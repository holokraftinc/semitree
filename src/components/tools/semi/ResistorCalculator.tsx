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
import { resistorFromGeometry, type ResistorResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type Key = "resistivity" | "length" | "area";
const DEFAULTS: Record<Key, MeasurementValue> = {
  resistivity: { raw: "1.7e-8", unit: "ohm_m" },
  length: { raw: "1", unit: "mm" },
  area: { raw: "1", unit: "um2" },
};

export function ResistorCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<ResistorResult | null>(null);
  const set = (k: Key) => (v: MeasurementValue) => setFields((f) => ({ ...f, [k]: v }));
  const reset = () => { setFields(DEFAULTS); setErrors({}); setFormError(null); setResult(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const si = { resistivity: measurementToSI(fields.resistivity), length: measurementToSI(fields.length), area: measurementToSI(fields.area) };
    const nextErrors: Partial<Record<Key, string>> = {};
    (Object.keys(si) as Key[]).forEach((k) => { if (si[k] === null) nextErrors[k] = "Enter a valid number."; });
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setFormError(null); setResult(null); return; }
    const res = resistorFromGeometry(si as Record<Key, number>);
    if (!res.ok) { setErrors(res.field ? { [res.field as Key]: res.error } : {}); setFormError(res.field ? null : res.error); setResult(null); track("calculation_error", { tool: "resistor", field: res.field }); return; }
    setErrors({}); setFormError(null); setResult(res.value); track("calculation_completed", { tool: "resistor" });
  };

  return (
    <CalculatorShell
      title="Resistor (R = ρL/A)"
      description="Resistance of a uniform conductor from its resistivity, length, and cross-sectional area."
      tier="mvp"
      trackSlug="resistor"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Resistor" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Resistivity (ρ)" quantity="resistivity" value={fields.resistivity} onChange={set("resistivity")} error={errors.resistivity} help="e.g. ~1.7×10⁻⁸ Ω·m for copper." />
          <MeasurementField label="Length (L)" quantity="length" value={fields.length} onChange={set("length")} error={errors.length} />
          <MeasurementField label="Cross-section area (A)" quantity="area" value={fields.area} onChange={set("area")} error={errors.area} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={result ? [{ label: "Resistance", value: formatNumber(result.resistance), unit: "Ω", primary: true }] : []}
        />
      }
      interpretation={
        result ? (
          <p>
            Resistance rises with resistivity and length and falls with cross-sectional area (R = ρL/A). This is why thin,
            long wires are more resistive — a central issue for on-chip interconnect, where shrinking cross-sections drive
            resistance up.
          </p>
        ) : (
          <p>Enter the resistivity, length, and cross-sectional area.</p>
        )
      }
      formula={{ expression: "R = ρ · L / A", label: "Resistance", caption: "Uniform conductor." }}
      variables={[
        { symbol: "R", name: "Resistance", unit: "Ω" },
        { symbol: "ρ", name: "Resistivity", unit: "Ω·m" },
        { symbol: "L", name: "Length", unit: "m" },
        { symbol: "A", name: "Cross-section area", unit: "m²" },
      ]}
      assumptions={["Uniform conductor; ignores temperature dependence and contact resistance."]}
      workedExample={
        <div className="space-y-2">
          <p>ρ = 1.7×10⁻⁸ Ω·m (copper), L = 1 mm, A = 1 µm².</p>
          <p className="font-mono text-xs text-muted-foreground">R = 1.7e-8 × 1e-3 / 1e-12 ≈ 17 Ω</p>
        </div>
      }
      relatedConcepts={[{ label: "Metallization", href: "/semiconductors/learn/metallization" }]}
      relatedLessons={getSemiToolLearningLinks("resistor")}
      relatedTools={getRelatedSemiToolLinks("resistor")}
    />
  );
}
