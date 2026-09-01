"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import {
  MeasurementField,
  type MeasurementValue,
} from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { getRelatedToolLinks } from "@/lib/data/tools";
import { getRelatedConceptLinks } from "@/lib/data/graph";
import { track } from "@/lib/analytics";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { reynolds, type ReynoldsResult } from "@/lib/calculations/reynolds";
import { formatNumber } from "@/lib/utils/format";

type FieldKey = "density" | "velocity" | "hydraulicDiameter" | "viscosity";

const DEFAULTS: Record<FieldKey, MeasurementValue> = {
  density: { raw: "1000", unit: "kg_per_m3" },
  velocity: { raw: "0.01", unit: "m_per_s" },
  hydraulicDiameter: { raw: "100", unit: "um" },
  viscosity: { raw: "1.0", unit: "mPa_s" },
};

const REGIME_LABEL: Record<ReynoldsResult["regime"], string> = {
  laminar: "Laminar",
  transitional: "Transitional",
  turbulent: "Turbulent",
};

const REGIME_VARIANT = {
  laminar: "success",
  transitional: "warning",
  turbulent: "danger",
} as const;

export function ReynoldsCalculator() {
  const [fields, setFields] = useState<Record<FieldKey, MeasurementValue>>(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<ReynoldsResult | null>(null);

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
      density: measurementToSI(fields.density),
      velocity: measurementToSI(fields.velocity),
      hydraulicDiameter: measurementToSI(fields.hydraulicDiameter),
      viscosity: measurementToSI(fields.viscosity),
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

    const res = reynolds(si as Record<FieldKey, number>);
    if (!res.ok) {
      const field = res.field as FieldKey | undefined;
      setErrors(field ? { [field]: res.error } : {});
      setFormError(field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "reynolds-number", field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "reynolds-number" });
  };

  return (
    <CalculatorShell
      title="Reynolds number"
      description="Check whether flow in a channel is laminar or turbulent."
      tier="mvp"
      trackSlug="reynolds-number"
      categoryLabel="Fluid mechanics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Reynolds number" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <MeasurementField
            label="Fluid density (ρ)"
            quantity="density"
            value={fields.density}
            onChange={set("density")}
            error={errors.density}
            help="Water ≈ 1000 kg/m³."
          />
          <MeasurementField
            label="Mean velocity (v)"
            quantity="velocity"
            value={fields.velocity}
            onChange={set("velocity")}
            error={errors.velocity}
          />
          <MeasurementField
            label="Hydraulic diameter (Dₕ)"
            quantity="length"
            value={fields.hydraulicDiameter}
            onChange={set("hydraulicDiameter")}
            error={errors.hydraulicDiameter}
            help="Use the Hydraulic diameter tool for non-circular channels."
          />
          <MeasurementField
            label="Dynamic viscosity (μ)"
            quantity="viscosity"
            value={fields.viscosity}
            onChange={set("viscosity")}
            error={errors.viscosity}
            help="Water ≈ 1.0 mPa·s."
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
                    label: "Reynolds number",
                    value: formatNumber(result.reynolds),
                    primary: true,
                  },
                  { label: "Flow regime", value: REGIME_LABEL[result.regime] },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span>This flow is</span>
              <Badge variant={REGIME_VARIANT[result.regime]}>
                {REGIME_LABEL[result.regime]}
              </Badge>
            </p>
            <p>
              {result.regime === "laminar" &&
                "Re < 2000: smooth, orderly flow in parallel layers — the norm at the microscale, where mixing is dominated by diffusion, not turbulence."}
              {result.regime === "transitional" &&
                "2000 ≤ Re ≤ 4000: the flow is in the transitional range and may be unstable; treat predictions with caution."}
              {result.regime === "turbulent" &&
                "Re > 4000: inertial forces dominate and the flow is turbulent — unusual at the microscale and often a sign of large channels or high velocity."}
            </p>
          </div>
        ) : (
          <p>
            Enter your fluid and channel values and calculate to see the flow
            regime. Below ~2000 the flow is laminar; above ~4000 it is turbulent.
          </p>
        )
      }
      formula={{
        expression: "Re = ρ · v · Dₕ / μ",
        label: "Reynolds number",
        caption: "Dimensionless ratio of inertial to viscous forces.",
      }}
      variables={[
        { symbol: "Re", name: "Reynolds number", unit: "—" },
        { symbol: "ρ", name: "Fluid density", unit: "kg/m³" },
        { symbol: "v", name: "Mean velocity", unit: "m/s" },
        { symbol: "Dₕ", name: "Hydraulic diameter", unit: "m" },
        { symbol: "μ", name: "Dynamic viscosity", unit: "Pa·s" },
      ]}
      assumptions={[
        "Newtonian, incompressible fluid.",
        "Hydraulic diameter Dₕ is appropriate for the channel cross-section.",
        "Transition thresholds use conventional pipe-flow values (laminar < 2000, transitional 2000–4000, turbulent > 4000); the true transition in microchannels can differ.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>
            Water (ρ = 1000 kg/m³, μ = 1.0 mPa·s) flows at v = 0.01 m/s through a
            channel with Dₕ = 100 µm.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Re = (1000 × 0.01 × 100×10⁻⁶) / 1.0×10⁻³ = 1.0
          </p>
          <p>Re ≈ 1 → firmly laminar.</p>
        </div>
      }
      relatedConcepts={getRelatedConceptLinks("reynolds-number")}
      relatedLessons={[
        { label: "Level 1 — Physics foundations", href: "/learn" },
      ]}
      relatedTools={getRelatedToolLinks("reynolds-number")}
    />
  );
}
