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
import { packageDimensions, type PackageDimsResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type Key = "length" | "width" | "height";

const DEFAULTS: Record<Key, MeasurementValue> = {
  length: { raw: "10", unit: "mm" },
  width: { raw: "10", unit: "mm" },
  height: { raw: "1", unit: "mm" },
};

export function PackageDimensionsCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<PackageDimsResult | null>(null);

  const set = (key: Key) => (next: MeasurementValue) => setFields((f) => ({ ...f, [key]: next }));

  const reset = () => {
    setFields(DEFAULTS);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const si = {
      length: measurementToSI(fields.length),
      width: measurementToSI(fields.width),
      height: measurementToSI(fields.height),
    };
    const nextErrors: Partial<Record<Key, string>> = {};
    (Object.keys(si) as Key[]).forEach((k) => {
      if (si[k] === null) nextErrors[k] = "Enter a valid number.";
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = packageDimensions(si as Record<Key, number>);
    if (!res.ok) {
      setErrors(res.field ? { [res.field as Key]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "package-dimensions", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "package-dimensions" });
  };

  return (
    <CalculatorShell
      title="Package dimensions"
      description="Compute the footprint and volume of a package from its length, width, and height."
      tier="mvp"
      trackSlug="package-dimensions"
      categoryLabel="Packaging"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Package dimensions" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Package length" quantity="length" value={fields.length} onChange={set("length")} error={errors.length} />
          <MeasurementField label="Package width" quantity="length" value={fields.width} onChange={set("width")} error={errors.width} />
          <MeasurementField label="Package height" quantity="length" value={fields.height} onChange={set("height")} error={errors.height} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Footprint area", value: formatNumber(result.footprint * 1e6), unit: "mm²", primary: true },
                  { label: "Volume", value: formatNumber(result.volume * 1e9), unit: "mm³" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            The footprint is the board area the package occupies — a key constraint in system design and a driver of
            cost. The volume matters for height-constrained products and for how much material and internal space the
            package uses. Footprint also bounds how many external connections can fit beneath the package.
          </p>
        ) : (
          <p>Enter the package length, width, and height.</p>
        )
      }
      formula={{ expression: "footprint = L × W ;  volume = L × W × H", label: "Package geometry", caption: "Rectangular package envelope." }}
      variables={[
        { symbol: "footprint", name: "Board area occupied", unit: "m² (shown as mm²)" },
        { symbol: "volume", name: "Package volume", unit: "m³ (shown as mm³)" },
        { symbol: "L, W, H", name: "Length, width, height", unit: "m" },
      ]}
      assumptions={["Rectangular envelope; ignores leads, balls, and internal structure."]}
      workedExample={
        <div className="space-y-2">
          <p>10 mm × 10 mm × 1 mm.</p>
          <p className="font-mono text-xs text-muted-foreground">footprint = 100 mm²; volume = 100 mm³</p>
        </div>
      }
      relatedConcepts={[
        { label: "Chip packaging", href: "/semiconductors/learn/packaging" },
        { label: "Die vs package", href: "/semiconductors/learn/die-vs-package" },
      ]}
      relatedLessons={getSemiToolLearningLinks("package-dimensions")}
      relatedTools={getRelatedSemiToolLinks("package-dimensions")}
    />
  );
}
