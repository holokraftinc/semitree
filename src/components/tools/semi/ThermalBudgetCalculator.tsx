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
import { thermalBudget, type ThermalBudgetResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

export function ThermalBudgetCalculator() {
  const [tAmbient, setTAmbient] = useState<MeasurementValue>({ raw: "25", unit: "C" });
  const [tjMax, setTjMax] = useState<MeasurementValue>({ raw: "125", unit: "C" });
  const [theta, setTheta] = useState("2"); // °C/W
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<ThermalBudgetResult | null>(null);

  const reset = () => {
    setTAmbient({ raw: "25", unit: "C" });
    setTjMax({ raw: "125", unit: "C" });
    setTheta("2");
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ta = measurementToSI(tAmbient); // K
    const tj = measurementToSI(tjMax); // K
    const th = parseNumber(theta);
    const nextErrors: Record<string, string> = {};
    if (ta === null) nextErrors.tAmbient = "Enter a valid number.";
    if (tj === null) nextErrors.tjMax = "Enter a valid number.";
    if (th === null) nextErrors.theta = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = thermalBudget({ tjMax: tj!, tAmbient: ta!, thetaResistance: th! });
    if (!res.ok) {
      const map: Record<string, string> = { tjMax: "tjMax", tAmbient: "tAmbient", thetaResistance: "theta" };
      setErrors(res.field ? { [map[res.field] ?? res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "thermal-budget", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "thermal-budget" });
  };

  return (
    <CalculatorShell
      title="Thermal budget"
      description="The maximum power a package can dissipate given its junction-to-ambient temperature margin and thermal resistance."
      tier="mvp"
      trackSlug="thermal-budget"
      categoryLabel="Packaging"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Thermal budget" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Simplified model">
            Uses allowable P = (Tj_max − T_ambient) / Rθ with a single junction-to-ambient thermal resistance and uniform
            heating. Real limits add margin and account for transients and hotspots.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Ambient temperature (T_ambient)" quantity="temperature" value={tAmbient} onChange={setTAmbient} error={errors.tAmbient} />
          <MeasurementField label="Max junction temperature (Tj_max)" quantity="temperature" value={tjMax} onChange={setTjMax} error={errors.tjMax} />
          <div className="space-y-1.5">
            <label htmlFor="tb-theta" className="block text-sm font-medium text-foreground">Thermal resistance (Rθ)</label>
            <div className="flex items-center gap-2">
              <input id="tb-theta" type="number" inputMode="decimal" step="any" value={theta} onChange={(e) => setTheta(e.target.value)} aria-invalid={Boolean(errors.theta)} className={cn(fieldBase, "w-full")} />
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
                  { label: "Allowable power", value: formatNumber(result.allowablePower), unit: "W", primary: true },
                  { label: "Temperature margin (ΔT)", value: formatNumber(result.deltaT), unit: "°C" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            The temperature margin (Tj_max − T_ambient) divided by the thermal resistance gives the most power the chip
            can dissipate before the junction reaches its limit. Raising the margin (cooler ambient or a higher-rated
            junction) or lowering Rθ (better cooling) both raise the allowable power. Treat this as an upper bound —
            designs keep margin below it.
          </p>
        ) : (
          <p>Enter the ambient and maximum junction temperatures and the thermal resistance.</p>
        )
      }
      formula={{ expression: "P_allowable = (Tj_max − T_ambient) / Rθ", label: "Thermal budget", caption: "Simplified steady-state limit." }}
      variables={[
        { symbol: "P_allowable", name: "Maximum dissipated power", unit: "W" },
        { symbol: "Tj_max", name: "Maximum junction temperature", unit: "°C / K" },
        { symbol: "T_ambient", name: "Ambient temperature", unit: "°C / K" },
        { symbol: "Rθ", name: "Junction-to-ambient thermal resistance", unit: "°C/W" },
      ]}
      assumptions={[
        "Steady state; single junction-to-ambient thermal resistance.",
        "Uniform heating; no hotspots, transients, or design margin included.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>T_ambient = 25 °C, Tj_max = 125 °C, Rθ = 2 °C/W.</p>
          <p className="font-mono text-xs text-muted-foreground">P = (125 − 25) / 2 = 50 W</p>
        </div>
      }
      relatedConcepts={[{ label: "Chip packaging", href: "/semiconductors/learn/packaging" }]}
      relatedLessons={getSemiToolLearningLinks("thermal-budget")}
      relatedTools={getRelatedSemiToolLinks("thermal-budget")}
    />
  );
}
