"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { fieldBase } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { sheetResistance, type SheetResistanceResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

const DEFAULTS = {
  resistivity: { raw: "1e-5", unit: "ohm_m" } as MeasurementValue,
  thickness: { raw: "100", unit: "nm" } as MeasurementValue,
  squares: "1",
};

export function SheetResistanceCalculator() {
  const [resistivity, setResistivity] = useState(DEFAULTS.resistivity);
  const [thickness, setThickness] = useState(DEFAULTS.thickness);
  const [squares, setSquares] = useState(DEFAULTS.squares);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<SheetResistanceResult | null>(null);

  const reset = () => {
    setResistivity(DEFAULTS.resistivity);
    setThickness(DEFAULTS.thickness);
    setSquares(DEFAULTS.squares);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rho = measurementToSI(resistivity);
    const t = measurementToSI(thickness);
    const n = parseNumber(squares);
    const nextErrors: Record<string, string> = {};
    if (rho === null) nextErrors.resistivity = "Enter a valid number.";
    if (t === null) nextErrors.thickness = "Enter a valid number.";
    if (n === null) nextErrors.squares = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = sheetResistance({ resistivity: rho!, thickness: t!, squares: n! });
    if (!res.ok) {
      setErrors(res.field ? { [res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "sheet-resistance", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "sheet-resistance" });
  };

  return (
    <CalculatorShell
      title="Sheet resistance"
      description="Sheet resistance of a thin film from its resistivity and thickness, and the resistance of a patterned stripe."
      tier="mvp"
      trackSlug="sheet-resistance"
      categoryLabel="Manufacturing"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Sheet resistance" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Resistivity (ρ)" quantity="resistivity" value={resistivity} onChange={setResistivity} error={errors.resistivity} />
          <MeasurementField label="Film thickness (t)" quantity="length" value={thickness} onChange={setThickness} error={errors.thickness} />
          <div className="space-y-1.5">
            <label htmlFor="sr-squares" className="block text-sm font-medium text-foreground">
              Number of squares (L / W)
            </label>
            <input
              id="sr-squares"
              type="number"
              inputMode="decimal"
              step="any"
              value={squares}
              onChange={(e) => setSquares(e.target.value)}
              aria-invalid={Boolean(errors.squares)}
              className={cn(fieldBase, "w-full")}
            />
            {errors.squares && <p className="text-sm text-danger">{errors.squares}</p>}
            <p className="text-xs text-muted-foreground">Defaults to 1 square. For a stripe, squares = length ÷ width.</p>
          </div>
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Sheet resistance (Rs)", value: formatNumber(result.sheetResistance), unit: "Ω/□", primary: true },
                  { label: `Resistance (${formatNumber(result.squares)} squares)`, value: formatNumber(result.resistance), unit: "Ω" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Sheet resistance Rs = ρ/t describes how a thin film conducts independent of its lateral size — it is quoted
            in <strong>ohms per square (Ω/□)</strong> because a square of the film has the same resistance regardless of
            its size. The total resistance of a patterned stripe is just Rs multiplied by the number of squares (its
            length-to-width ratio). It is widely used in processing to monitor doped layers and deposited films.
          </p>
        ) : (
          <p>Enter the film resistivity and thickness (and optionally a length-to-width ratio).</p>
        )
      }
      formula={{ expression: "R_s = ρ / t ,  R = R_s · (L/W)", label: "Sheet resistance", caption: "Ω/□ for the film; Ω for a patterned stripe." }}
      variables={[
        { symbol: "R_s", name: "Sheet resistance", unit: "Ω/□ (ohms per square)" },
        { symbol: "ρ", name: "Resistivity", unit: "Ω·m" },
        { symbol: "t", name: "Film thickness", unit: "m" },
        { symbol: "R", name: "Stripe resistance", unit: "Ω" },
        { symbol: "L/W", name: "Number of squares", unit: "dimensionless" },
      ]}
      assumptions={[
        "Uniform film of constant resistivity and thickness.",
        "Current flows laterally; thickness is small compared with lateral dimensions.",
        "Ω/□ is dimensionally ohms — the 'per square' label marks it as a sheet quantity.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>ρ = 1×10⁻⁵ Ω·m, t = 100 nm, 10 squares.</p>
          <p className="font-mono text-xs text-muted-foreground">
            R_s = 1×10⁻⁵ / 1×10⁻⁷ = 100 Ω/□; R = 100 × 10 = 1000 Ω
          </p>
        </div>
      }
      relatedConcepts={[
        { label: "Metrology & inspection", href: "/semiconductors/learn/metrology" },
        { label: "Doping", href: "/semiconductors/learn/ion-implantation" },
      ]}
      relatedLessons={getSemiToolLearningLinks("sheet-resistance")}
      relatedTools={getRelatedSemiToolLinks("sheet-resistance")}
    />
  );
}
