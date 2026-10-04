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
import { etchRate, type EtchRateResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type Key = "initialThickness" | "remainingThickness" | "time";

const DEFAULTS: Record<Key, MeasurementValue> = {
  initialThickness: { raw: "200", unit: "nm" },
  remainingThickness: { raw: "50", unit: "nm" },
  time: { raw: "30", unit: "s" },
};

export function EtchRateCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<EtchRateResult | null>(null);

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
      initialThickness: measurementToSI(fields.initialThickness),
      remainingThickness: measurementToSI(fields.remainingThickness),
      time: measurementToSI(fields.time),
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
    const res = etchRate(si as Record<Key, number>);
    if (!res.ok) {
      setErrors(res.field ? { [res.field as Key]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "etch-rate", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "etch-rate" });
  };

  const nmPerMin = result ? result.rate * 1e9 * 60 : 0;
  const nmPerS = result ? result.rate * 1e9 : 0;

  return (
    <CalculatorShell
      title="Etch rate"
      description="Average etch rate from how much material was removed over the process time."
      tier="mvp"
      trackSlug="etch-rate"
      categoryLabel="Etching & deposition"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Etch rate" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Initial thickness" quantity="length" value={fields.initialThickness} onChange={set("initialThickness")} error={errors.initialThickness} />
          <MeasurementField label="Remaining thickness" quantity="length" value={fields.remainingThickness} onChange={set("remainingThickness")} error={errors.remainingThickness} help="Must be less than the initial thickness (0 = fully etched)." />
          <MeasurementField label="Process time" quantity="time" value={fields.time} onChange={set("time")} error={errors.time} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Etch rate", value: formatNumber(nmPerMin), unit: "nm/min", primary: true },
                  { label: "Etch rate", value: formatNumber(nmPerS), unit: "nm/s" },
                  { label: "Material removed", value: formatNumber(result.removed * 1e9), unit: "nm" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            The etch rate is the average amount of material removed per unit time. Like deposition rate it is an
            average — real rates depend on loading, feature depth (ARDE), and chemistry, and etches are usually stopped
            by <strong>endpoint detection</strong> rather than a fixed time.
          </p>
        ) : (
          <p>Enter the initial and remaining thickness and the process time.</p>
        )
      }
      formula={{ expression: "rate = (initial − remaining) / time", label: "Etch rate", caption: "Average rate over the etch." }}
      variables={[
        { symbol: "rate", name: "Etch rate", unit: "m/s (shown as nm/min)" },
        { symbol: "initial", name: "Initial thickness", unit: "m" },
        { symbol: "remaining", name: "Remaining thickness", unit: "m" },
        { symbol: "time", name: "Process time", unit: "s" },
      ]}
      assumptions={["Average rate over the etch.", "Constant rate assumed; loading/ARDE/endpoint effects not modelled."]}
      workedExample={
        <div className="space-y-2">
          <p>initial = 200 nm, remaining = 50 nm, time = 30 s.</p>
          <p className="font-mono text-xs text-muted-foreground">rate = (200 − 50) nm / 30 s = 5 nm/s = 300 nm/min</p>
        </div>
      }
      relatedConcepts={[{ label: "Etching & deposition", href: "/semiconductors/learn/etching" }]}
      relatedLessons={getSemiToolLearningLinks("etch-rate")}
      relatedTools={getRelatedSemiToolLinks("etch-rate")}
    />
  );
}
