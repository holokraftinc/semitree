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
import { depositionRate, type DepositionRateResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

export function DepositionRateCalculator() {
  const [thickness, setThickness] = useState<MeasurementValue>({ raw: "100", unit: "nm" });
  const [time, setTime] = useState<MeasurementValue>({ raw: "2", unit: "min" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<DepositionRateResult | null>(null);

  const reset = () => {
    setThickness({ raw: "100", unit: "nm" });
    setTime({ raw: "2", unit: "min" });
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = measurementToSI(thickness);
    const s = measurementToSI(time);
    const nextErrors: Record<string, string> = {};
    if (t === null) nextErrors.thickness = "Enter a valid number.";
    if (s === null) nextErrors.time = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = depositionRate({ thickness: t!, time: s! });
    if (!res.ok) {
      setErrors(res.field ? { [res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "deposition-rate", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "deposition-rate" });
  };

  // rate is m/s.
  const nmPerMin = result ? result.rate * 1e9 * 60 : 0;
  const nmPerS = result ? result.rate * 1e9 : 0;
  const umPerMin = result ? result.rate * 1e6 * 60 : 0;

  return (
    <CalculatorShell
      title="Deposition rate"
      description="Average deposition rate from the deposited thickness and the process time."
      tier="mvp"
      trackSlug="deposition-rate"
      categoryLabel="Etching & deposition"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Deposition rate" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Deposited thickness" quantity="length" value={thickness} onChange={setThickness} error={errors.thickness} />
          <MeasurementField label="Process time" quantity="time" value={time} onChange={setTime} error={errors.time} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Deposition rate", value: formatNumber(nmPerMin), unit: "nm/min", primary: true },
                  { label: "Deposition rate", value: formatNumber(nmPerS), unit: "nm/s" },
                  { label: "Deposition rate", value: formatNumber(umPerMin), unit: "µm/min" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            The deposition rate is the average film growth per unit time. It is an <strong>average</strong> over the
            whole run — real rates can vary at the start (nucleation) and with temperature, pressure, and precursor
            supply. Use it to plan process time, but verify with metrology.
          </p>
        ) : (
          <p>Enter the deposited thickness and the process time.</p>
        )
      }
      formula={{ expression: "rate = thickness / time", label: "Deposition rate", caption: "Average rate over the run." }}
      variables={[
        { symbol: "rate", name: "Deposition rate", unit: "m/s (shown as nm/min)" },
        { symbol: "thickness", name: "Deposited thickness", unit: "m" },
        { symbol: "time", name: "Process time", unit: "s" },
      ]}
      assumptions={["Average rate = thickness ÷ time.", "Assumes a constant rate; nucleation and process drift are not modelled."]}
      workedExample={
        <div className="space-y-2">
          <p>thickness = 100 nm, time = 2 min.</p>
          <p className="font-mono text-xs text-muted-foreground">rate = 100 nm / 2 min = 50 nm/min</p>
        </div>
      }
      relatedConcepts={[{ label: "Deposition", href: "/semiconductors/learn/deposition" }]}
      relatedLessons={getSemiToolLearningLinks("deposition-rate")}
      relatedTools={getRelatedSemiToolLinks("deposition-rate")}
    />
  );
}
