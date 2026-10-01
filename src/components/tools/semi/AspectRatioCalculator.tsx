"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { aspectRatio, type AspectRatioResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type FieldKey = "depth" | "width";

const DEFAULTS: Record<FieldKey, MeasurementValue> = {
  depth: { raw: "200", unit: "nm" },
  width: { raw: "50", unit: "nm" },
};

export function AspectRatioCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<AspectRatioResult | null>(null);

  const set = (key: FieldKey) => (next: MeasurementValue) => setFields((f) => ({ ...f, [key]: next }));

  const reset = () => {
    setFields(DEFAULTS);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const si = { depth: measurementToSI(fields.depth), width: measurementToSI(fields.width) };
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    (Object.keys(si) as FieldKey[]).forEach((k) => {
      if (si[k] === null) nextErrors[k] = "Enter a valid number.";
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = aspectRatio(si as Record<FieldKey, number>);
    if (!res.ok) {
      setErrors(res.field ? { [res.field as FieldKey]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "aspect-ratio", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "aspect-ratio" });
  };

  return (
    <CalculatorShell
      title="Aspect ratio"
      description="Feature aspect ratio (depth ÷ width) and what it implies for etching, deposition, and packaging."
      tier="mvp"
      trackSlug="aspect-ratio"
      categoryLabel="Etching & deposition"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Aspect ratio" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Feature depth" quantity="length" value={fields.depth} onChange={set("depth")} error={errors.depth} />
          <MeasurementField label="Feature width" quantity="length" value={fields.width} onChange={set("width")} error={errors.width} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Aspect ratio", value: formatNumber(result.aspectRatio), unit: ": 1", primary: true },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            A higher aspect ratio means a deeper, narrower feature. High-aspect-ratio features are harder to{" "}
            <strong>etch</strong> (reactants struggle to reach the bottom and byproducts to escape — ARDE), harder to{" "}
            <strong>fill or line by deposition</strong> (line-of-sight methods leave voids, so conformal methods like
            ALD/CVD are needed), and they matter in <strong>packaging</strong> structures such as through-silicon vias.
            Lower aspect ratios are generally easier to process.
          </p>
        ) : (
          <p>Enter a feature depth and width (same or different length units).</p>
        )
      }
      formula={{ expression: "AR = depth / width", label: "Aspect ratio", caption: "Dimensionless; units cancel." }}
      variables={[
        { symbol: "AR", name: "Aspect ratio", unit: "dimensionless" },
        { symbol: "depth", name: "Feature depth", unit: "m" },
        { symbol: "width", name: "Feature width", unit: "m" },
      ]}
      assumptions={[
        "Aspect ratio = depth ÷ width; both lengths, so the units cancel.",
        "A single feature; does not account for profile shape or sidewall angle.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>depth = 200 nm, width = 50 nm.</p>
          <p className="font-mono text-xs text-muted-foreground">AR = 200 nm / 50 nm = 4 (i.e. 4:1)</p>
        </div>
      }
      relatedConcepts={[
        { label: "Etching & deposition", href: "/semiconductors/learn/etching" },
        { label: "Photolithography", href: "/semiconductors/learn/lithography" },
      ]}
      relatedLessons={getSemiToolLearningLinks("aspect-ratio")}
      relatedTools={getRelatedSemiToolLinks("aspect-ratio")}
    />
  );
}
