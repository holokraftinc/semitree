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
import { dieArea, type DieAreaResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type FieldKey = "width" | "height";

const DEFAULTS: Record<FieldKey, MeasurementValue> = {
  width: { raw: "5", unit: "mm" },
  height: { raw: "5", unit: "mm" },
};

export function DieSizeCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<DieAreaResult | null>(null);

  const set = (key: FieldKey) => (next: MeasurementValue) => setFields((f) => ({ ...f, [key]: next }));

  const reset = () => {
    setFields(DEFAULTS);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const si = { width: measurementToSI(fields.width), height: measurementToSI(fields.height) };
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
    const res = dieArea(si as Record<FieldKey, number>);
    if (!res.ok) {
      setErrors(res.field ? { [res.field as FieldKey]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "die-size", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "die-size" });
  };

  return (
    <CalculatorShell
      title="Die size & area"
      description="Compute die area and the square-equivalent dimension from die width and height."
      tier="mvp"
      trackSlug="die-size"
      categoryLabel="Design"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Die size & area" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Die width" quantity="length" value={fields.width} onChange={set("width")} error={errors.width} />
          <MeasurementField label="Die height" quantity="length" value={fields.height} onChange={set("height")} error={errors.height} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Die area", value: formatNumber(result.area * 1e6), unit: "mm²", primary: true },
                  { label: "Die area", value: formatNumber(result.area * 1e12), unit: "µm²" },
                  { label: "Square-equivalent side", value: formatNumber(result.squareEquivalent * 1e3), unit: "mm" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            The die area sets how many dies fit on a wafer and strongly affects yield — larger dies are more
            likely to contain a killer defect. The square-equivalent side is the edge length of a square with the
            same area, useful for quick comparisons between differently-shaped dies.
          </p>
        ) : (
          <p>Enter the die width and height to get its area.</p>
        )
      }
      formula={{ expression: "A = width × height ,  s = √A", label: "Die area", caption: "Rectangular die area and square-equivalent side." }}
      variables={[
        { symbol: "A", name: "Die area", unit: "m² (shown as mm²/µm²)" },
        { symbol: "width", name: "Die width", unit: "m" },
        { symbol: "height", name: "Die height", unit: "m" },
        { symbol: "s", name: "Square-equivalent side", unit: "m" },
      ]}
      assumptions={[
        "Rectangular die; area = width × height.",
        "Ignores scribe lanes, edge exclusion, and rounded corners.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>width = 5 mm, height = 5 mm.</p>
          <p className="font-mono text-xs text-muted-foreground">A = 5 mm × 5 mm = 25 mm²; s = √25 = 5 mm</p>
        </div>
      }
      relatedConcepts={[{ label: "Dicing", href: "/semiconductors/learn/dicing" }]}
      relatedLessons={getSemiToolLearningLinks("die-size")}
      relatedTools={getRelatedSemiToolLinks("die-size")}
    />
  );
}
