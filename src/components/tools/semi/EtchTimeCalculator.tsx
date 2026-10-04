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

export function EtchTimeCalculator() {
  const [thickness, setThickness] = useState<MeasurementValue>({ raw: "150", unit: "nm" });
  const [rate, setRate] = useState<MeasurementValue>({ raw: "300", unit: "nm_min" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<TimeForThicknessResult | null>(null);

  const reset = () => {
    setThickness({ raw: "150", unit: "nm" });
    setRate({ raw: "300", unit: "nm_min" });
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
      track("calculation_error", { tool: "etch-time", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "etch-time" });
  };

  return (
    <CalculatorShell
      title="Etch time estimator"
      description="Estimate the time to etch a given thickness at a known etch rate."
      tier="mvp"
      trackSlug="etch-time"
      categoryLabel="Etching & deposition"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Etch time estimator" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="A planning estimate only">
            Real etch processes use <strong>endpoint detection</strong> and build in process margin rather than running
            for a fixed calculated time — over-etching into the layer below is a real risk.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Material thickness" quantity="length" value={thickness} onChange={setThickness} error={errors.thickness} />
          <MeasurementField label="Etch rate" quantity="depositionRate" value={rate} onChange={setRate} error={errors.rate} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Estimated etch time", value: formatNumber(result.time), unit: "s", primary: true },
                  { label: "Estimated etch time", value: formatNumber(result.time / 60), unit: "min" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Time = thickness ÷ etch rate at a constant rate. Treat this as a starting point: fabs rely on endpoint
            detection (watching the plasma or film signal) and add margin, because the exact time to clear a layer
            varies and over-etch can damage what lies beneath.
          </p>
        ) : (
          <p>Enter the material thickness and the etch rate.</p>
        )
      }
      formula={{ expression: "time = thickness / rate", label: "Etch time", caption: "Constant-rate estimate; real etches use endpoint detection." }}
      variables={[
        { symbol: "time", name: "Etch time", unit: "s" },
        { symbol: "thickness", name: "Material thickness", unit: "m" },
        { symbol: "rate", name: "Etch rate", unit: "m/s" },
      ]}
      assumptions={["Constant etch rate.", "No endpoint detection or process margin included."]}
      workedExample={
        <div className="space-y-2">
          <p>thickness = 150 nm, rate = 300 nm/min.</p>
          <p className="font-mono text-xs text-muted-foreground">time = 150 nm / 300 nm/min = 0.5 min = 30 s</p>
        </div>
      }
      relatedConcepts={[{ label: "Etching & deposition", href: "/semiconductors/learn/etching" }]}
      relatedLessons={getSemiToolLearningLinks("etch-time")}
      relatedTools={getRelatedSemiToolLinks("etch-time")}
    />
  );
}
