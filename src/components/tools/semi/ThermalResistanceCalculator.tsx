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
import { thermalResistance, type ThermalResistanceResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

function readPlain(raw: string): "empty" | number | null {
  if (raw.trim() === "") return "empty";
  return parseNumber(raw);
}

export function ThermalResistanceCalculator() {
  const [deltaT, setDeltaT] = useState(""); // °C, blank = compute
  const [power, setPower] = useState<MeasurementValue>({ raw: "10", unit: "W" });
  const [theta, setTheta] = useState("5"); // °C/W
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<ThermalResistanceResult | null>(null);

  const reset = () => {
    setDeltaT("");
    setPower({ raw: "10", unit: "W" });
    setTheta("5");
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dt = readPlain(deltaT);
    const th = readPlain(theta);
    const pRaw = power.raw.trim() === "" ? "empty" : measurementToSI(power);
    const nextErrors: Record<string, string> = {};
    if (dt === null) nextErrors.deltaT = "Enter a valid number or leave blank.";
    if (th === null) nextErrors.theta = "Enter a valid number or leave blank.";
    if (pRaw === null) nextErrors.power = "Enter a valid number or leave blank.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const provided = [dt, th, pRaw].filter((x) => x !== "empty").length;
    if (provided !== 2) {
      setErrors({});
      setFormError("Enter exactly two of ΔT, power, and thermal resistance — leave the third blank.");
      setResult(null);
      return;
    }
    const res = thermalResistance({
      deltaT: dt === "empty" ? undefined : (dt as number),
      power: pRaw === "empty" ? undefined : (pRaw as number),
      thetaResistance: th === "empty" ? undefined : (th as number),
    });
    if (!res.ok) {
      const map: Record<string, string> = { deltaT: "deltaT", power: "power", thetaResistance: "theta" };
      setErrors(res.field ? { [map[res.field] ?? res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "thermal-resistance", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "thermal-resistance" });
  };

  return (
    <CalculatorShell
      title="Thermal resistance"
      description="Relate temperature rise, power, and thermal resistance with ΔT = P × Rθ. Fill any two; the third is computed."
      tier="mvp"
      trackSlug="thermal-resistance"
      categoryLabel="Packaging"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Thermal resistance" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Simplified steady-state model">
            Treats the heat path as a single thermal resistance. Real packages have several heat paths, hotspots, and
            transients not captured here.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <div className="space-y-1.5">
            <label htmlFor="tr-dt" className="block text-sm font-medium text-foreground">Temperature rise (ΔT)</label>
            <div className="flex items-center gap-2">
              <input id="tr-dt" type="number" inputMode="decimal" step="any" value={deltaT} onChange={(e) => setDeltaT(e.target.value)} aria-invalid={Boolean(errors.deltaT)} className={cn(fieldBase, "w-full")} placeholder="leave blank to compute" />
              <span className="shrink-0 text-sm text-muted-foreground">°C</span>
            </div>
            {errors.deltaT && <p className="text-sm text-danger">{errors.deltaT}</p>}
          </div>
          <MeasurementField label="Power (P)" quantity="power" value={power} onChange={setPower} error={errors.power} required={false} help="Leave blank to compute from ΔT and Rθ." />
          <div className="space-y-1.5">
            <label htmlFor="tr-theta" className="block text-sm font-medium text-foreground">Thermal resistance (Rθ)</label>
            <div className="flex items-center gap-2">
              <input id="tr-theta" type="number" inputMode="decimal" step="any" value={theta} onChange={(e) => setTheta(e.target.value)} aria-invalid={Boolean(errors.theta)} className={cn(fieldBase, "w-full")} placeholder="leave blank to compute" />
              <span className="shrink-0 text-sm text-muted-foreground">°C/W</span>
            </div>
            {errors.theta && <p className="text-sm text-danger">{errors.theta}</p>}
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
                  { label: "Temperature rise (ΔT)", value: formatNumber(result.deltaT), unit: "°C", primary: result.computed === "deltaT" },
                  { label: "Power (P)", value: formatNumber(result.power), unit: "W", primary: result.computed === "power" },
                  { label: "Thermal resistance (Rθ)", value: formatNumber(result.thetaResistance), unit: "°C/W", primary: result.computed === "thetaResistance" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Thermal resistance Rθ (in <strong>°C/W</strong>) says how many degrees the junction rises for each watt it
            dissipates: ΔT = P × Rθ. A lower Rθ (better heat spreader, bigger heatsink, better interface material) means
            a smaller temperature rise for the same power — the goal of package thermal design.
          </p>
        ) : (
          <p>Fill any two of ΔT, power, and thermal resistance; leave the third blank.</p>
        )
      }
      formula={{ expression: "ΔT = P × Rθ", label: "Thermal resistance", caption: "ΔT in °C, P in W, Rθ in °C/W." }}
      variables={[
        { symbol: "ΔT", name: "Temperature rise (junction above reference)", unit: "°C (= K)" },
        { symbol: "P", name: "Power dissipated", unit: "W" },
        { symbol: "Rθ", name: "Thermal resistance", unit: "°C/W" },
      ]}
      assumptions={[
        "Steady state; a single lumped thermal resistance.",
        "ΔT is a temperature difference, so °C and K are interchangeable here.",
        "No hotspots or transient behaviour modelled.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>P = 10 W, Rθ = 5 °C/W.</p>
          <p className="font-mono text-xs text-muted-foreground">ΔT = 10 W × 5 °C/W = 50 °C</p>
        </div>
      }
      relatedConcepts={[
        { label: "Chip packaging", href: "/semiconductors/learn/packaging" },
      ]}
      relatedLessons={getSemiToolLearningLinks("thermal-resistance")}
      relatedTools={getRelatedSemiToolLinks("thermal-resistance")}
    />
  );
}
