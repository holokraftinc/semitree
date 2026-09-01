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
import { getRelatedToolLinks } from "@/lib/data/tools";
import { getRelatedConceptLinks } from "@/lib/data/graph";
import { track } from "@/lib/analytics";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { pressureDrop } from "@/lib/calculations/pressureDrop";
import { convert } from "@/lib/units";
import { formatNumber } from "@/lib/utils/format";

type FieldKey = "viscosity" | "length" | "flowRate" | "diameter";

const DEFAULTS: Record<FieldKey, MeasurementValue> = {
  viscosity: { raw: "1.0", unit: "mPa_s" },
  length: { raw: "10", unit: "mm" },
  flowRate: { raw: "1", unit: "uL_per_min" },
  diameter: { raw: "50", unit: "um" },
};

export function PressureDropCalculator() {
  const [fields, setFields] = useState<Record<FieldKey, MeasurementValue>>(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<{ pressureDrop: number; resistance: number } | null>(
    null,
  );

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
      viscosity: measurementToSI(fields.viscosity),
      length: measurementToSI(fields.length),
      flowRate: measurementToSI(fields.flowRate),
      diameter: measurementToSI(fields.diameter),
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

    const res = pressureDrop({
      shape: "circular",
      viscosity: si.viscosity as number,
      length: si.length as number,
      flowRate: si.flowRate as number,
      diameter: si.diameter as number,
    });
    if (!res.ok) {
      const field = res.field as FieldKey | undefined;
      setErrors(field ? { [field]: res.error } : {});
      setFormError(field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "pressure-drop", field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult({ pressureDrop: res.value.pressureDrop, resistance: res.value.resistance });
    track("calculation_completed", { tool: "pressure-drop" });
  };

  return (
    <CalculatorShell
      title="Pressure drop"
      description="Pressure needed to drive a flow through a circular channel (Hagen–Poiseuille)."
      tier="mvp"
      trackSlug="pressure-drop"
      categoryLabel="Fluid mechanics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Pressure drop" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Circular channel">
            This tool uses the circular-channel Hagen–Poiseuille equation. For a
            rectangular channel, use the{" "}
            <a href="/tools/flow-resistance" className="font-medium text-brand hover:underline">
              flow resistance
            </a>{" "}
            tool.
          </Alert>
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <MeasurementField
            label="Dynamic viscosity (μ)"
            quantity="viscosity"
            value={fields.viscosity}
            onChange={set("viscosity")}
            error={errors.viscosity}
            help="Water ≈ 1.0 mPa·s."
          />
          <MeasurementField
            label="Channel length (L)"
            quantity="length"
            value={fields.length}
            onChange={set("length")}
            error={errors.length}
          />
          <MeasurementField
            label="Flow rate (Q)"
            quantity="flowRate"
            value={fields.flowRate}
            onChange={set("flowRate")}
            error={errors.flowRate}
          />
          <MeasurementField
            label="Channel diameter (D)"
            quantity="length"
            value={fields.diameter}
            onChange={set("diameter")}
            error={errors.diameter}
          />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          results={
            result
              ? [
                  {
                    label: "Pressure drop",
                    value: formatNumber(convert(result.pressureDrop, "Pa", "kPa")),
                    unit: "kPa",
                    primary: true,
                  },
                  {
                    label: "In pascals",
                    value: formatNumber(result.pressureDrop),
                    unit: "Pa",
                  },
                  {
                    label: "Resistance (R = ΔP/Q)",
                    value: formatNumber(result.resistance),
                    unit: "Pa·s/m³",
                  },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            This is the pressure your pump must supply to sustain the given flow
            rate through the channel. Pressure drop scales with 1/D⁴, so halving
            the diameter raises the required pressure ~16×.
          </p>
        ) : (
          <p>
            Enter the fluid, channel, and flow rate to get the pressure drop. The
            strong 1/D⁴ dependence means small diameter changes matter a lot.
          </p>
        )
      }
      formula={{
        expression: "ΔP = 128 · μ · L · Q / (π · D⁴)",
        label: "Hagen–Poiseuille (circular channel)",
        caption: "Exact for fully developed laminar flow in a circular channel.",
      }}
      variables={[
        { symbol: "ΔP", name: "Pressure drop", unit: "Pa" },
        { symbol: "μ", name: "Dynamic viscosity", unit: "Pa·s" },
        { symbol: "L", name: "Channel length", unit: "m" },
        { symbol: "Q", name: "Volumetric flow rate", unit: "m³/s" },
        { symbol: "D", name: "Channel diameter", unit: "m" },
      ]}
      assumptions={[
        "Circular cross-section — this is the key assumption; rectangular channels need the resistance approximation.",
        "Fully developed, steady, laminar flow.",
        "Newtonian, incompressible fluid.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>
            Water (μ = 1.0 mPa·s) flows at Q = 1 µL/min through a circular channel
            L = 10 mm long and D = 50 µm across.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            ΔP = 128 × 10⁻³ × 0.01 × (1.667×10⁻¹¹) / (π × (50×10⁻⁶)⁴) ≈ 1.09 kPa
          </p>
        </div>
      }
      relatedConcepts={getRelatedConceptLinks("pressure-drop")}
      relatedLessons={[
        { label: "Level 1 — Physics foundations", href: "/learn" },
      ]}
      relatedTools={getRelatedToolLinks("pressure-drop")}
    />
  );
}
