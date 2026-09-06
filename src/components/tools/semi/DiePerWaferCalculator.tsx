"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import {
  MeasurementField,
  type MeasurementValue,
} from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { diePerWafer, type DiePerWaferResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type FieldKey = "waferDiameter" | "dieWidth" | "dieHeight";

const DEFAULTS: Record<FieldKey, MeasurementValue> = {
  waferDiameter: { raw: "300", unit: "mm" },
  dieWidth: { raw: "10", unit: "mm" },
  dieHeight: { raw: "10", unit: "mm" },
};

export function DiePerWaferCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<DiePerWaferResult | null>(null);

  const set = (key: FieldKey) => (next: MeasurementValue) =>
    setFields((f) => ({ ...f, [key]: next }));

  const reset = () => {
    setFields(DEFAULTS);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = measurementToSI(fields.waferDiameter);
    const w = measurementToSI(fields.dieWidth);
    const h = measurementToSI(fields.dieHeight);
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    if (d === null) nextErrors.waferDiameter = "Enter a valid number.";
    if (w === null) nextErrors.dieWidth = "Enter a valid number.";
    if (h === null) nextErrors.dieHeight = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = diePerWafer({ waferDiameter: d!, dieArea: w! * h! });
    if (!res.ok) {
      // Engine reports on "dieArea"; map back to a form-level message.
      setErrors({});
      setFormError(res.error);
      setResult(null);
      track("calculation_error", { tool: "die-per-wafer", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "die-per-wafer" });
  };

  return (
    <CalculatorShell
      title="Die per wafer"
      description="Estimate how many rectangular dies fit on a round wafer (de Vries approximation)."
      tier="mvp"
      trackSlug="die-per-wafer"
      categoryLabel="Manufacturing"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Die per wafer" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <MeasurementField
            label="Wafer diameter (d)"
            quantity="length"
            value={fields.waferDiameter}
            onChange={set("waferDiameter")}
            error={errors.waferDiameter}
            help="Common wafers: 150, 200, or 300 mm."
          />
          <MeasurementField
            label="Die width"
            quantity="length"
            value={fields.dieWidth}
            onChange={set("dieWidth")}
            error={errors.dieWidth}
          />
          <MeasurementField
            label="Die height"
            quantity="length"
            value={fields.dieHeight}
            onChange={set("dieHeight")}
            error={errors.dieHeight}
          />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  {
                    label: "Die per wafer (est.)",
                    value: formatNumber(result.diePerWafer, 6),
                    primary: true,
                  },
                  {
                    label: "Gross (area fill only)",
                    value: formatNumber(result.grossDiePerWafer, 6),
                  },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            The estimate subtracts an edge term for partial dies lost around the
            wafer&apos;s rim, so it is lower than the pure area-fill number. It
            does not include scribe-line width, edge-exclusion zones, or test
            structures, so a real layout usually yields a bit fewer. Combine with
            the Wafer yield tool to estimate <em>good</em> dies per wafer.
          </p>
        ) : (
          <p>
            Enter the wafer diameter and die footprint. Die area is taken as
            width × height.
          </p>
        )
      }
      formula={{
        expression: "DPW ≈ π·d² / (4·S) − π·d / √(2·S)",
        label: "de Vries approximation",
        caption: "d = wafer diameter, S = die area. The second term captures edge loss.",
      }}
      variables={[
        { symbol: "DPW", name: "Die per wafer", unit: "—" },
        { symbol: "d", name: "Wafer diameter", unit: "m" },
        { symbol: "S", name: "Die area (w × h)", unit: "m²" },
      ]}
      assumptions={[
        "de Vries approximation for die per wafer.",
        "Rectangular dies; no scribe-line or edge-exclusion width is modeled.",
        "Result is an estimate — real fabs use exact layout/packing tools.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>300 mm wafer, 10 mm × 10 mm die (S = 100 mm²).</p>
          <p className="font-mono text-xs text-muted-foreground">
            DPW ≈ π·0.3²/(4·1e-4) − π·0.3/√(2·1e-4) ≈ 640
          </p>
        </div>
      }
      relatedConcepts={[
        { label: "Wafer", href: "/semiconductors/learn/wafer" },
        { label: "Dicing", href: "/semiconductors/learn/dicing" },
      ]}
      relatedLessons={[
        { label: "Silicon", href: "/semiconductors/learn/silicon" },
        { label: "Wafer test", href: "/semiconductors/learn/wafer-test" },
      ]}
      relatedTools={[
        ...getRelatedSemiToolLinks("die-per-wafer"),
        { label: "Explore semiconductor companies", href: "/industry" },
      ]}
    />
  );
}
