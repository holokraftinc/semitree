"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import {
  MeasurementField,
  type MeasurementValue,
} from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { rcTimeConstant, type RcResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type FieldKey = "resistance" | "capacitance";

const DEFAULTS: Record<FieldKey, MeasurementValue> = {
  resistance: { raw: "1", unit: "kohm" },
  capacitance: { raw: "1", unit: "uF" },
};

export function RcTimeConstantCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<RcResult | null>(null);

  const set = (key: FieldKey) => (next: MeasurementValue) =>
    setFields((f) => ({ ...f, [key]: next }));

  const reset = () => {
    setFields(DEFAULTS);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const si = {
      resistance: measurementToSI(fields.resistance),
      capacitance: measurementToSI(fields.capacitance),
    };
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    (Object.keys(si) as FieldKey[]).forEach((k) => {
      if (si[k] === null) nextErrors[k] = "Enter a valid number.";
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = rcTimeConstant(si as Record<FieldKey, number>);
    if (!res.ok) {
      setErrors(res.field ? { [res.field as FieldKey]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "rc-time-constant", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "rc-time-constant" });
  };

  return (
    <CalculatorShell
      title="RC time constant"
      description="Time constant and −3 dB cutoff frequency of a single-pole RC network."
      tier="mvp"
      trackSlug="rc-time-constant"
      categoryLabel="Electrical fundamentals"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "RC time constant" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <MeasurementField
            label="Resistance (R)"
            quantity="resistance"
            value={fields.resistance}
            onChange={set("resistance")}
            error={errors.resistance}
          />
          <MeasurementField
            label="Capacitance (C)"
            quantity="capacitance"
            value={fields.capacitance}
            onChange={set("capacitance")}
            error={errors.capacitance}
          />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  {
                    label: "Time constant (τ)",
                    value: formatNumber(result.timeConstant * 1e6),
                    unit: "µs",
                    primary: true,
                  },
                  {
                    label: "Cutoff frequency (f_c)",
                    value: formatNumber(result.cutoffFrequency),
                    unit: "Hz",
                  },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            After one time constant a capacitor charges to ~63% (or discharges to
            ~37%) of its final value; ~5τ is treated as fully settled. The cutoff
            frequency f_c = 1/(2πRC) is the −3 dB corner of the equivalent
            first-order low-pass filter — signals above it are attenuated. RC
            delay like this limits interconnect and gate switching speed on chip.
          </p>
        ) : (
          <p>Enter the resistance and capacitance of a single RC stage.</p>
        )
      }
      formula={{
        expression: "τ = R · C ,  f_c = 1 / (2π R C)",
        label: "RC time constant",
        caption: "Charge/discharge time and the corresponding filter corner.",
      }}
      variables={[
        { symbol: "τ", name: "Time constant", unit: "s" },
        { symbol: "f_c", name: "Cutoff frequency", unit: "Hz" },
        { symbol: "R", name: "Resistance", unit: "Ω" },
        { symbol: "C", name: "Capacitance", unit: "F" },
      ]}
      assumptions={[
        "Ideal single-pole RC (one resistor, one capacitor); no parasitics.",
        "τ is the 63.2% charge/discharge time; f_c is the −3 dB corner.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>R = 1 kΩ, C = 1 µF.</p>
          <p className="font-mono text-xs text-muted-foreground">
            τ = 1000 Ω × 1×10⁻⁶ F = 1 ms; f_c = 1/(2π·1 ms) ≈ 159 Hz
          </p>
        </div>
      }
      relatedConcepts={[
        { label: "Integrated circuit", href: "/semiconductors/learn/integrated-circuit" },
        { label: "Metallization", href: "/semiconductors/learn/metallization" },
      ]}
      relatedLessons={[
        { label: "CMOS", href: "/semiconductors/learn/cmos" },
      ]}
      relatedTools={[
        ...getRelatedSemiToolLinks("rc-time-constant"),
        { label: "Explore semiconductor companies", href: "/industry" },
      ]}
    />
  );
}
