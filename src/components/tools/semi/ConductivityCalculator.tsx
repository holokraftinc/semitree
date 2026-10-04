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
import { conductivity, type ConductivityResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type Key = "electron" | "hole" | "electronMobility" | "holeMobility";

const DEFAULTS: Record<Key, MeasurementValue> = {
  electron: { raw: "1e16", unit: "per_cm3" },
  hole: { raw: "1e4", unit: "per_cm3" },
  electronMobility: { raw: "1400", unit: "cm2_Vs" },
  holeMobility: { raw: "450", unit: "cm2_Vs" },
};

export function ConductivityCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<ConductivityResult | null>(null);

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
      electron: measurementToSI(fields.electron),
      hole: measurementToSI(fields.hole),
      electronMobility: measurementToSI(fields.electronMobility),
      holeMobility: measurementToSI(fields.holeMobility),
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
    const res = conductivity(si as Record<Key, number>);
    if (!res.ok) {
      setErrors(res.field ? { [res.field as Key]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "conductivity", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "conductivity" });
  };

  return (
    <CalculatorShell
      title="Conductivity"
      description="Conductivity of a doped semiconductor from carrier concentrations and mobilities."
      tier="mvp"
      trackSlug="conductivity"
      categoryLabel="Doping"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Conductivity" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Electron concentration (n)" quantity="concentration" value={fields.electron} onChange={set("electron")} error={errors.electron} />
          <MeasurementField label="Hole concentration (p)" quantity="concentration" value={fields.hole} onChange={set("hole")} error={errors.hole} />
          <MeasurementField label="Electron mobility (μₙ)" quantity="mobility" value={fields.electronMobility} onChange={set("electronMobility")} error={errors.electronMobility} />
          <MeasurementField label="Hole mobility (μₚ)" quantity="mobility" value={fields.holeMobility} onChange={set("holeMobility")} error={errors.holeMobility} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Conductivity", value: formatNumber(result.conductivity), unit: "S/m", primary: true },
                  { label: "Conductivity", value: formatNumber(result.conductivity / 100), unit: "S/cm" },
                  { label: "Resistivity", value: formatNumber(result.resistivity), unit: "Ω·m" },
                  { label: "Resistivity", value: formatNumber(result.resistivity * 100), unit: "Ω·cm" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Conductivity is the sum of what electrons and holes each contribute: σ = q(n·μₙ + p·μₚ). Doping raises the
            majority-carrier concentration, which raises σ — often by orders of magnitude over intrinsic material.
            Electrons are typically more mobile than holes in silicon, so n-type material of the same doping conducts
            somewhat better. Resistivity is just 1/σ.
          </p>
        ) : (
          <p>Enter carrier concentrations and mobilities.</p>
        )
      }
      formula={{ expression: "σ = q · (n·μₙ + p·μₚ)", label: "Conductivity", caption: "q is the elementary charge." }}
      variables={[
        { symbol: "σ", name: "Conductivity", unit: "S/m" },
        { symbol: "q", name: "Elementary charge", unit: "C (1.602×10⁻¹⁹)" },
        { symbol: "n", name: "Electron concentration", unit: "m⁻³" },
        { symbol: "p", name: "Hole concentration", unit: "m⁻³" },
        { symbol: "μₙ", name: "Electron mobility", unit: "m²/(V·s)" },
        { symbol: "μₚ", name: "Hole mobility", unit: "m²/(V·s)" },
      ]}
      assumptions={[
        "Drift conduction only; mobilities treated as constant.",
        "No field-dependence or high-doping mobility degradation modelled.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>n = 1×10¹⁶ cm⁻³, μₙ = 1400 cm²/(V·s), holes negligible.</p>
          <p className="font-mono text-xs text-muted-foreground">σ = q·n·μₙ ≈ 0.22 S/m (≈ 4.5 Ω·m)</p>
        </div>
      }
      relatedConcepts={[
        { label: "Doping", href: "/semiconductors/learn/ion-implantation" },
        { label: "MOSFET", href: "/semiconductors/learn/mosfet" },
      ]}
      relatedLessons={getSemiToolLearningLinks("conductivity")}
      relatedTools={getRelatedSemiToolLinks("conductivity")}
    />
  );
}
