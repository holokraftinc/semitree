"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { Alert } from "@/components/ui/Alert";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { dopingChain, type DopingChainResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type Key = "dopant" | "mobility" | "thickness";

const DEFAULTS: Record<Key, MeasurementValue> = {
  dopant: { raw: "1e18", unit: "per_cm3" },
  mobility: { raw: "1400", unit: "cm2_Vs" },
  thickness: { raw: "100", unit: "nm" },
};

const STEPS = ["Doping (Nd)", "Carrier (n)", "Conductivity (σ)", "Resistivity (ρ)", "Sheet resistance (Rs)"];

export function DopingChainCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<DopingChainResult | null>(null);

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
      dopant: measurementToSI(fields.dopant),
      mobility: measurementToSI(fields.mobility),
      thickness: measurementToSI(fields.thickness),
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
    const res = dopingChain({ dopant: si.dopant!, electronMobility: si.mobility!, thickness: si.thickness! });
    if (!res.ok) {
      setErrors(res.field ? { [res.field === "electronMobility" ? "mobility" : res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "doping-chain", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "doping-chain" });
  };

  const values = result
    ? [
        `${formatNumber(measurementToSI(fields.dopant)! / 1e6)} cm⁻³`,
        `${formatNumber(result.carrier / 1e6)} cm⁻³`,
        `${formatNumber(result.conductivity / 100)} S/cm`,
        `${formatNumber(result.resistivity * 100)} Ω·cm`,
        `${formatNumber(result.sheetResistance)} Ω/□`,
      ]
    : [];

  return (
    <CalculatorShell
      title="Doping → sheet resistance"
      description="Follow the chain from a doping level all the way to sheet resistance, one step at a time."
      tier="mvp"
      trackSlug="doping-chain"
      categoryLabel="Doping"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Doping → sheet resistance" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="n-type, educational chain">
            Assumes n-type material (majority electrons ≈ donor concentration), constant mobility, and a uniform film.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Donor concentration (Nd)" quantity="concentration" value={fields.dopant} onChange={set("dopant")} error={errors.dopant} />
          <MeasurementField label="Electron mobility (μₙ)" quantity="mobility" value={fields.mobility} onChange={set("mobility")} error={errors.mobility} />
          <MeasurementField label="Film thickness (t)" quantity="length" value={fields.thickness} onChange={set("thickness")} error={errors.thickness} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        result ? (
          <ol className="space-y-2">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-semibold text-brand">{i + 1}</span>
                <span className="flex-1 text-sm text-muted-foreground">{label}</span>
                <span className="font-mono text-sm font-semibold text-foreground">{values[i]}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">Enter a doping level, mobility, and thickness to trace the chain.</p>
        )
      }
      interpretation={
        result ? (
          <p>
            This is the throughline of the doping topic: the dopant level sets the carrier concentration, carriers and
            mobility set the conductivity (σ = q·n·μₙ), conductivity inverts to resistivity (ρ = 1/σ), and dividing by
            film thickness gives the sheet resistance (Rs = ρ/t) that fabs actually measure. Change the doping and watch
            every downstream quantity move.
          </p>
        ) : (
          <p>Each step feeds the next: doping → carriers → conductivity → resistivity → sheet resistance.</p>
        )
      }
      formula={{ expression: "Nd → n → σ = q·n·μₙ → ρ = 1/σ → Rs = ρ/t", label: "Doping to sheet resistance", caption: "n-type, educational chain." }}
      variables={[
        { symbol: "Nd", name: "Donor concentration", unit: "m⁻³" },
        { symbol: "n", name: "Electron concentration", unit: "m⁻³" },
        { symbol: "σ", name: "Conductivity", unit: "S/m" },
        { symbol: "ρ", name: "Resistivity", unit: "Ω·m" },
        { symbol: "Rs", name: "Sheet resistance", unit: "Ω/□" },
        { symbol: "t", name: "Film thickness", unit: "m" },
      ]}
      assumptions={[
        "n-type: majority electron concentration from charge neutrality + mass action.",
        "Electron drift only (σ = q·n·μₙ); constant mobility; uniform film.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>Nd = 1×10¹⁸ cm⁻³, μₙ = 1400 cm²/(V·s), t = 100 nm.</p>
          <p className="font-mono text-xs text-muted-foreground">n ≈ 1×10¹⁸ cm⁻³ → σ ≈ 224 S/cm → ρ ≈ 0.0045 Ω·cm → Rs ≈ 446 Ω/□</p>
        </div>
      }
      relatedConcepts={[
        { label: "Doping", href: "/semiconductors/learn/ion-implantation" },
        { label: "Metrology & inspection", href: "/semiconductors/learn/metrology" },
      ]}
      relatedLessons={getSemiToolLearningLinks("doping-chain")}
      relatedTools={getRelatedSemiToolLinks("doping-chain")}
    />
  );
}
