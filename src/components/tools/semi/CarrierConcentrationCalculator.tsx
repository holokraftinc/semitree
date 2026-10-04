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
import { carrierConcentration, type CarrierResult, type DopantType } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

export function CarrierConcentrationCalculator() {
  const [ni, setNi] = useState<MeasurementValue>({ raw: "1e10", unit: "per_cm3" });
  const [dopant, setDopant] = useState<MeasurementValue>({ raw: "1e16", unit: "per_cm3" });
  const [type, setType] = useState<DopantType>("n");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<CarrierResult | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const reset = () => {
    setNi({ raw: "1e10", unit: "per_cm3" });
    setDopant({ raw: "1e16", unit: "per_cm3" });
    setType("n");
    setErrors({});
    setFormError(null);
    setResult(null);
    setWarnings([]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const niSI = measurementToSI(ni);
    const dopSI = measurementToSI(dopant);
    const nextErrors: Record<string, string> = {};
    if (niSI === null) nextErrors.ni = "Enter a valid number.";
    if (dopSI === null) nextErrors.dopant = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      setWarnings([]);
      return;
    }
    const res = carrierConcentration({ dopant: dopSI!, type, intrinsicConc: niSI! });
    if (!res.ok) {
      setErrors(res.field ? { [res.field === "intrinsicConc" ? "ni" : res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      setWarnings([]);
      track("calculation_error", { tool: "carrier-concentration", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    setWarnings(res.warnings);
    track("calculation_completed", { tool: "carrier-concentration" });
  };

  return (
    <CalculatorShell
      title="Carrier concentration"
      description="Find majority and minority carrier concentrations from the dopant level and the intrinsic carrier concentration."
      tier="mvp"
      trackSlug="carrier-concentration"
      categoryLabel="Doping"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Carrier concentration" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Educational, non-degenerate model">
            Assumes complete dopant ionization and non-degenerate (Boltzmann) statistics, with a single dopant type.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <div className="space-y-1.5">
            <label htmlFor="cc-type" className="block text-sm font-medium text-foreground">Dopant type</label>
            <select id="cc-type" value={type} onChange={(e) => setType(e.target.value as DopantType)} className={cn(fieldBase, "w-full")}>
              <option value="n">n-type (donors)</option>
              <option value="p">p-type (acceptors)</option>
            </select>
          </div>
          <MeasurementField label="Dopant concentration" quantity="concentration" value={dopant} onChange={setDopant} error={errors.dopant} />
          <MeasurementField label="Intrinsic carrier concentration (nᵢ)" quantity="concentration" value={ni} onChange={setNi} error={errors.ni} help="Silicon at ~300 K is about 1×10¹⁰ cm⁻³." />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Majority carriers", value: formatNumber(result.majority / 1e6), unit: "cm⁻³", primary: true },
                  { label: "Minority carriers", value: formatNumber(result.minority / 1e6), unit: "cm⁻³" },
                  { label: "Electrons (n)", value: formatNumber(result.electron / 1e6), unit: "cm⁻³" },
                  { label: "Holes (p)", value: formatNumber(result.hole / 1e6), unit: "cm⁻³" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <div className="space-y-2">
            {warnings.map((w, i) => (
              <Alert key={i} variant="warning" title="Note">{w}</Alert>
            ))}
            <p>
              In {type === "n" ? "n-type" : "p-type"} material the {type === "n" ? "electrons" : "holes"} are the
              majority carriers (≈ the dopant concentration when heavily doped), while the other carrier is suppressed by
              the mass-action law n·p = nᵢ². Raising one carrier type lowers the other.
            </p>
          </div>
        ) : (
          <p>Choose a dopant type and enter the dopant and intrinsic concentrations.</p>
        )
      }
      formula={{ expression: "n·p = nᵢ² ,  majority ≈ Nd/2 + √((Nd/2)² + nᵢ²)", label: "Carrier concentrations", caption: "Charge neutrality combined with mass action." }}
      variables={[
        { symbol: "n", name: "Electron concentration", unit: "m⁻³ (shown as cm⁻³)" },
        { symbol: "p", name: "Hole concentration", unit: "m⁻³ (shown as cm⁻³)" },
        { symbol: "Nd / Na", name: "Donor / acceptor concentration", unit: "m⁻³" },
        { symbol: "nᵢ", name: "Intrinsic carrier concentration", unit: "m⁻³" },
      ]}
      assumptions={[
        "Complete dopant ionization; non-degenerate (Boltzmann) statistics.",
        "Single dopant type, no compensation.",
        "Equilibrium (no applied bias or illumination).",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>n-type, Nd = 1×10¹⁶ cm⁻³, nᵢ = 1×10¹⁰ cm⁻³.</p>
          <p className="font-mono text-xs text-muted-foreground">n ≈ 1×10¹⁶ cm⁻³; p = nᵢ²/n ≈ 1×10⁴ cm⁻³</p>
        </div>
      }
      relatedConcepts={[
        { label: "Doping", href: "/semiconductors/learn/ion-implantation" },
        { label: "PN junction", href: "/semiconductors/learn/pn-junction" },
        { label: "What is a semiconductor?", href: "/semiconductors/learn/what-is-a-semiconductor" },
      ]}
      relatedLessons={getSemiToolLearningLinks("carrier-concentration")}
      relatedTools={getRelatedSemiToolLinks("carrier-concentration")}
    />
  );
}
