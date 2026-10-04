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
import { timeForThickness, type TimeForThicknessResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

export function ProcessTimeCalculator() {
  const [thickness, setThickness] = useState<MeasurementValue>({ raw: "100", unit: "nm" });
  const [rate, setRate] = useState<MeasurementValue>({ raw: "50", unit: "nm_min" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<TimeForThicknessResult | null>(null);

  const reset = () => {
    setThickness({ raw: "100", unit: "nm" });
    setRate({ raw: "50", unit: "nm_min" });
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = measurementToSI(thickness);
    const r = measurementToSI(rate);
    const nextErrors: Record<string, string> = {};
    if (t === null) nextErrors.thickness = "Enter a valid number.";
    if (r === null) nextErrors.rate = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = timeForThickness({ thickness: t!, rate: r! });
    if (!res.ok) {
      setErrors(res.field ? { [res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "process-time", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "process-time" });
  };

  return (
    <CalculatorShell
      title="Deposition process time"
      description="Estimate the time to reach a target thickness at a given deposition rate."
      tier="mvp"
      trackSlug="process-time"
      categoryLabel="Etching & deposition"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Deposition process time" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Constant-rate assumption">
            This assumes a constant deposition rate for the whole run. Real rates vary (especially during nucleation),
            so treat the result as a planning estimate.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Target thickness" quantity="length" value={thickness} onChange={setThickness} error={errors.thickness} />
          <MeasurementField label="Deposition rate" quantity="depositionRate" value={rate} onChange={setRate} error={errors.rate} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Estimated time", value: formatNumber(result.time / 60), unit: "min", primary: true },
                  { label: "Estimated time", value: formatNumber(result.time), unit: "s" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Time = target thickness ÷ deposition rate, assuming a constant rate. In practice fabs add margin and verify
            with in-situ monitoring or post-deposition metrology rather than relying on a fixed time alone.
          </p>
        ) : (
          <p>Enter a target thickness and a deposition rate.</p>
        )
      }
      formula={{ expression: "time = thickness / rate", label: "Process time", caption: "Constant-rate estimate." }}
      variables={[
        { symbol: "time", name: "Process time", unit: "s (shown as min)" },
        { symbol: "thickness", name: "Target thickness", unit: "m" },
        { symbol: "rate", name: "Deposition rate", unit: "m/s" },
      ]}
      assumptions={["Constant deposition rate for the whole run.", "No nucleation delay, drift, or margin included."]}
      workedExample={
        <div className="space-y-2">
          <p>thickness = 100 nm, rate = 50 nm/min.</p>
          <p className="font-mono text-xs text-muted-foreground">time = 100 nm / 50 nm/min = 2 min</p>
        </div>
      }
      relatedConcepts={[{ label: "Deposition", href: "/semiconductors/learn/deposition" }]}
      relatedLessons={getSemiToolLearningLinks("process-time")}
      relatedTools={getRelatedSemiToolLinks("process-time")}
    />
  );
}
