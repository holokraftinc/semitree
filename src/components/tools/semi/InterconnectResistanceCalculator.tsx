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
import { interconnectResistance, type InterconnectResistanceResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type Key = "resistivity" | "length" | "width" | "thickness";
const DEFAULTS: Record<Key, MeasurementValue> = {
  resistivity: { raw: "2e-8", unit: "ohm_m" },
  length: { raw: "100", unit: "um" },
  width: { raw: "1", unit: "um" },
  thickness: { raw: "100", unit: "nm" },
};

export function InterconnectResistanceCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<InterconnectResistanceResult | null>(null);
  const set = (k: Key) => (v: MeasurementValue) => setFields((f) => ({ ...f, [k]: v }));
  const reset = () => { setFields(DEFAULTS); setErrors({}); setFormError(null); setResult(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const si = { resistivity: measurementToSI(fields.resistivity), length: measurementToSI(fields.length), width: measurementToSI(fields.width), thickness: measurementToSI(fields.thickness) };
    const nextErrors: Partial<Record<Key, string>> = {};
    (Object.keys(si) as Key[]).forEach((k) => { if (si[k] === null) nextErrors[k] = "Enter a valid number."; });
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setFormError(null); setResult(null); return; }
    const res = interconnectResistance(si as Record<Key, number>);
    if (!res.ok) { setErrors(res.field ? { [res.field as Key]: res.error } : {}); setFormError(res.field ? null : res.error); setResult(null); track("calculation_error", { tool: "interconnect-resistance", field: res.field }); return; }
    setErrors({}); setFormError(null); setResult(res.value); track("calculation_completed", { tool: "interconnect-resistance" });
  };

  return (
    <CalculatorShell
      title="Interconnect resistance"
      description="Resistance of a metal wire from its resistivity and geometry: R = ρL/(W·t)."
      tier="mvp"
      trackSlug="interconnect-resistance"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Interconnect resistance" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Resistivity (ρ)" quantity="resistivity" value={fields.resistivity} onChange={set("resistivity")} error={errors.resistivity} help="e.g. ~2×10⁻⁸ Ω·m for copper (thin-film values run higher)." />
          <MeasurementField label="Length (L)" quantity="length" value={fields.length} onChange={set("length")} error={errors.length} />
          <MeasurementField label="Width (W)" quantity="length" value={fields.width} onChange={set("width")} error={errors.width} />
          <MeasurementField label="Thickness (t)" quantity="length" value={fields.thickness} onChange={set("thickness")} error={errors.thickness} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Wire resistance", value: formatNumber(result.resistance), unit: "Ω", primary: true },
                  { label: "Sheet resistance", value: formatNumber(result.sheetResistance), unit: "Ω/□" },
                  { label: "Number of squares (L/W)", value: formatNumber(result.squares), unit: "" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            A wire&rsquo;s resistance is its sheet resistance (ρ/t) times the number of squares (L/W). Scaling shrinks W
            and t, which drives interconnect resistance up — a growing limiter of chip performance that advanced metals
            and more metal layers work to offset. This ideal model ignores barrier/liner layers and vias.
          </p>
        ) : (
          <p>Enter the wire resistivity, length, width, and thickness.</p>
        )
      }
      formula={{ expression: "R = ρ · L / (W · t) = Rs · (L/W)", label: "Interconnect resistance", caption: "Rs = ρ/t is the sheet resistance." }}
      variables={[
        { symbol: "R", name: "Wire resistance", unit: "Ω" },
        { symbol: "ρ", name: "Resistivity", unit: "Ω·m" },
        { symbol: "L, W, t", name: "Length, width, thickness", unit: "m" },
        { symbol: "Rs", name: "Sheet resistance", unit: "Ω/□" },
      ]}
      assumptions={["Uniform rectangular wire; ignores temperature, barrier/liner layers, and via resistance."]}
      workedExample={
        <div className="space-y-2">
          <p>ρ = 2×10⁻⁸ Ω·m, L = 100 µm, W = 1 µm, t = 100 nm.</p>
          <p className="font-mono text-xs text-muted-foreground">Rs = 0.2 Ω/□; squares = 100; R = 20 Ω</p>
        </div>
      }
      relatedConcepts={[{ label: "Metallization", href: "/semiconductors/learn/metallization" }]}
      relatedLessons={getSemiToolLearningLinks("interconnect-resistance")}
      relatedTools={getRelatedSemiToolLinks("interconnect-resistance")}
    />
  );
}
