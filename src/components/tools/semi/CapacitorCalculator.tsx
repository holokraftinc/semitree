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
import { parallelPlateCapacitance, type CapacitorResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

export function CapacitorCalculator() {
  const [area, setArea] = useState<MeasurementValue>({ raw: "1", unit: "mm2" });
  const [distance, setDistance] = useState<MeasurementValue>({ raw: "100", unit: "nm" });
  const [er, setEr] = useState("3.9");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<CapacitorResult | null>(null);

  const reset = () => { setArea({ raw: "1", unit: "mm2" }); setDistance({ raw: "100", unit: "nm" }); setEr("3.9"); setErrors({}); setFormError(null); setResult(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const a = measurementToSI(area); const d = measurementToSI(distance); const erN = parseNumber(er);
    const nextErrors: Record<string, string> = {};
    if (a === null) nextErrors.area = "Enter a valid number.";
    if (d === null) nextErrors.distance = "Enter a valid number.";
    if (erN === null) nextErrors.er = "Enter a valid number.";
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setFormError(null); setResult(null); return; }
    const res = parallelPlateCapacitance({ area: a!, distance: d!, relativePermittivity: erN! });
    if (!res.ok) { setErrors(res.field ? { [res.field === "relativePermittivity" ? "er" : res.field]: res.error } : {}); setFormError(res.field ? null : res.error); setResult(null); track("calculation_error", { tool: "capacitor", field: res.field }); return; }
    setErrors({}); setFormError(null); setResult(res.value); track("calculation_completed", { tool: "capacitor" });
  };

  return (
    <CalculatorShell
      title="Parallel-plate capacitor"
      description="Capacitance of an ideal parallel-plate capacitor from plate area, spacing, and dielectric."
      tier="mvp"
      trackSlug="capacitor"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Parallel-plate capacitor" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Plate area" quantity="area" value={area} onChange={setArea} error={errors.area} />
          <MeasurementField label="Plate spacing (d)" quantity="length" value={distance} onChange={setDistance} error={errors.distance} />
          <div className="space-y-1.5">
            <label htmlFor="cap-er" className="block text-sm font-medium text-foreground">Relative permittivity (εr)</label>
            <input id="cap-er" type="number" inputMode="decimal" step="any" value={er} onChange={(e) => setEr(e.target.value)} aria-invalid={Boolean(errors.er)} className={cn(fieldBase, "w-full")} />
            <p className="text-xs text-muted-foreground">e.g. 1 (vacuum), 3.9 (SiO₂), ~3.9–25 (various dielectrics).</p>
            {errors.er && <p className="text-sm text-danger">{errors.er}</p>}
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
                  { label: "Capacitance", value: formatNumber(result.capacitance * 1e12), unit: "pF", primary: true },
                  { label: "Capacitance", value: formatNumber(result.capacitance * 1e9), unit: "nF" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Capacitance grows with plate area and dielectric constant and shrinks with spacing (C = ε₀·εr·A/d). The same
            relation sets a MOSFET&rsquo;s gate-oxide capacitance (with a very small d) and the capacitance of
            interconnect and MIM capacitors. This ideal model ignores fringing fields.
          </p>
        ) : (
          <p>Enter the plate area, spacing, and dielectric constant.</p>
        )
      }
      formula={{ expression: "C = ε₀ · εr · A / d", label: "Parallel-plate capacitor", caption: "ε₀ = vacuum permittivity." }}
      variables={[
        { symbol: "C", name: "Capacitance", unit: "F (shown as pF/nF)" },
        { symbol: "ε₀", name: "Vacuum permittivity", unit: "F/m (8.854×10⁻¹²)" },
        { symbol: "εr", name: "Relative permittivity", unit: "dimensionless" },
        { symbol: "A", name: "Plate area", unit: "m²" },
        { symbol: "d", name: "Plate spacing", unit: "m" },
      ]}
      assumptions={["Ideal parallel plates; uniform dielectric; ignores fringing fields."]}
      workedExample={
        <div className="space-y-2">
          <p>A = 1 mm², d = 100 nm, εr = 3.9 (SiO₂).</p>
          <p className="font-mono text-xs text-muted-foreground">C = ε₀·3.9·1e-6/1e-7 ≈ 345 pF</p>
        </div>
      }
      relatedConcepts={[{ label: "Integrated circuit", href: "/semiconductors/learn/integrated-circuit" }]}
      relatedLessons={getSemiToolLearningLinks("capacitor")}
      relatedTools={getRelatedSemiToolLinks("capacitor")}
    />
  );
}
