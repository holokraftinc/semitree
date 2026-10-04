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
import { interconnectRcDelay, type RcDelayResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

export function InterconnectRcDelayCalculator() {
  const [resistance, setResistance] = useState<MeasurementValue>({ raw: "1", unit: "kohm" });
  const [capacitance, setCapacitance] = useState<MeasurementValue>({ raw: "1", unit: "pF" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<RcDelayResult | null>(null);

  const reset = () => { setResistance({ raw: "1", unit: "kohm" }); setCapacitance({ raw: "1", unit: "pF" }); setErrors({}); setFormError(null); setResult(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = measurementToSI(resistance); const c = measurementToSI(capacitance);
    const nextErrors: Record<string, string> = {};
    if (r === null) nextErrors.resistance = "Enter a valid number.";
    if (c === null) nextErrors.capacitance = "Enter a valid number.";
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setFormError(null); setResult(null); return; }
    const res = interconnectRcDelay({ resistance: r!, capacitance: c! });
    if (!res.ok) { setErrors(res.field ? { [res.field]: res.error } : {}); setFormError(res.field ? null : res.error); setResult(null); track("calculation_error", { tool: "interconnect-rc-delay", field: res.field }); return; }
    setErrors({}); setFormError(null); setResult(res.value); track("calculation_completed", { tool: "interconnect-rc-delay" });
  };

  return (
    <CalculatorShell
      title="Interconnect RC delay"
      description="First-order RC delay of an interconnect: τ = R·C, with a 50% delay of about 0.69·R·C."
      tier="mvp"
      trackSlug="interconnect-rc-delay"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Interconnect RC delay" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="First-order estimate">
            Treats the wire as a single lumped R and C. A real distributed line is more complex (an Elmore estimate for a
            uniform line is ≈ 0.38·R·C); use this to build intuition, not for sign-off timing.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Resistance (R)" quantity="resistance" value={resistance} onChange={setResistance} error={errors.resistance} />
          <MeasurementField label="Capacitance (C)" quantity="capacitance" value={capacitance} onChange={setCapacitance} error={errors.capacitance} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Time constant (τ = RC)", value: formatNumber(result.timeConstant * 1e12), unit: "ps", primary: true },
                  { label: "50% delay (≈ 0.69·RC)", value: formatNumber(result.delay50 * 1e12), unit: "ps" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            RC delay grows with both resistance and capacitance, so thinner, more-resistive wires and denser, more-
            capacitive neighbours both slow signals down. Because a wire&rsquo;s R and C each scale with length, its
            intrinsic RC delay rises roughly with length squared — which is why long global wires are buffered and routed
            on thicker metal layers.
          </p>
        ) : (
          <p>Enter the interconnect resistance and capacitance.</p>
        )
      }
      formula={{ expression: "τ = R · C ;  t₅₀ ≈ 0.69 · R · C", label: "RC delay", caption: "Lumped single-stage RC." }}
      variables={[
        { symbol: "τ", name: "Time constant", unit: "s (shown as ps)" },
        { symbol: "R", name: "Resistance", unit: "Ω" },
        { symbol: "C", name: "Capacitance", unit: "F" },
        { symbol: "t₅₀", name: "50% propagation delay", unit: "s" },
      ]}
      assumptions={[
        "Single lumped R and C (one stage).",
        "A distributed wire differs (Elmore ≈ 0.38·R·C for a uniform line); first-order estimate only.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>R = 1 kΩ, C = 1 pF.</p>
          <p className="font-mono text-xs text-muted-foreground">τ = 1 ns; 50% delay ≈ 0.69 ns</p>
        </div>
      }
      relatedConcepts={[{ label: "Metallization", href: "/semiconductors/learn/metallization" }]}
      relatedLessons={getSemiToolLearningLinks("interconnect-rc-delay")}
      relatedTools={getRelatedSemiToolLinks("interconnect-rc-delay")}
    />
  );
}
