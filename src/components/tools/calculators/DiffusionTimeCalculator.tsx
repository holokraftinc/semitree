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
import { diffusionTime } from "@/lib/calculations/diffusionTime";
import { formatNumber } from "@/lib/utils/format";

type FieldKey = "length" | "diffusionCoefficient";

const DEFAULTS: Record<FieldKey, MeasurementValue> = {
  length: { raw: "100", unit: "um" },
  diffusionCoefficient: { raw: "1000", unit: "um2_per_s" },
};

export function DiffusionTimeCalculator() {
  const [fields, setFields] = useState<Record<FieldKey, MeasurementValue>>(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [timeSI, setTimeSI] = useState<number | null>(null);

  const set = (key: FieldKey) => (next: MeasurementValue) =>
    setFields((f) => ({ ...f, [key]: next }));

  const reset = () => {
    setFields(DEFAULTS);
    setErrors({});
    setFormError(null);
    setTimeSI(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const si = {
      length: measurementToSI(fields.length),
      diffusionCoefficient: measurementToSI(fields.diffusionCoefficient),
    };
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    (Object.keys(si) as FieldKey[]).forEach((k) => {
      if (si[k] === null) nextErrors[k] = "Enter a valid number.";
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setTimeSI(null);
      return;
    }

    const res = diffusionTime(si as Record<FieldKey, number>);
    if (!res.ok) {
      const field = res.field as FieldKey | undefined;
      setErrors(field ? { [field]: res.error } : {});
      setFormError(field ? null : res.error);
      setTimeSI(null);
      track("calculation_error", { tool: "diffusion-time", field });
      return;
    }
    setErrors({});
    setFormError(null);
    setTimeSI(res.value.time);
    track("calculation_completed", { tool: "diffusion-time" });
  };

  return (
    <CalculatorShell
      title="Diffusion time"
      description="Estimate how long a species takes to spread a given distance by diffusion."
      tier="mvp"
      trackSlug="diffusion-time"
      categoryLabel="Diffusion & mixing"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Diffusion time" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="warning" title="Order-of-magnitude estimate">
            This is a characteristic 1-D scaling estimate (t ≈ L²/2D), not an
            exact concentration profile. Use it for intuition, not precise timing.
          </Alert>
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <MeasurementField
            label="Diffusion distance (L)"
            quantity="length"
            value={fields.length}
            onChange={set("length")}
            error={errors.length}
            help="Typically the channel width to mix across."
          />
          <MeasurementField
            label="Diffusion coefficient (D)"
            quantity="diffusivity"
            value={fields.diffusionCoefficient}
            onChange={set("diffusionCoefficient")}
            error={errors.diffusionCoefficient}
            help="Small molecules in water ≈ 1000 µm²/s (1×10⁻⁹ m²/s)."
          />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          results={
            timeSI !== null
              ? [
                  {
                    label: "Diffusion time",
                    value: formatNumber(timeSI),
                    unit: "s",
                    primary: true,
                  },
                  {
                    label: "In milliseconds",
                    value: formatNumber(timeSI * 1000),
                    unit: "ms",
                  },
                ]
              : []
          }
          empty="Enter distance and diffusion coefficient to estimate the time."
        />
      }
      interpretation={
        timeSI !== null ? (
          <p>
            Because time scales with the square of distance, halving the distance
            cuts the mixing time to a quarter. This is why microchannels mix
            quickly across their narrow dimension but slowly along their length.
          </p>
        ) : (
          <p>
            Diffusion time grows with the square of distance (t ∝ L²), so
            shrinking the mixing distance is the most effective way to mix faster.
          </p>
        )
      }
      formula={{
        expression: "t ≈ L² / (2D)",
        label: "Characteristic diffusion time (estimate)",
        caption: "1-D scaling law — an order-of-magnitude estimate.",
      }}
      variables={[
        { symbol: "t", name: "Diffusion time", unit: "s" },
        { symbol: "L", name: "Diffusion distance", unit: "m" },
        { symbol: "D", name: "Diffusion coefficient", unit: "m²/s" },
      ]}
      assumptions={[
        "1-D diffusion; t ≈ L²/2D is an ESTIMATE (characteristic scaling), not an exact concentration profile.",
        "Constant diffusion coefficient D.",
        "No advection or reaction — pure diffusion.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>
            A small molecule (D ≈ 1000 µm²/s = 1×10⁻⁹ m²/s) diffuses across a
            100 µm channel.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            t ≈ (100×10⁻⁶)² / (2 × 1×10⁻⁹) = 1×10⁻⁸ / 2×10⁻⁹ = 5 s
          </p>
        </div>
      }
      relatedConcepts={getRelatedConceptLinks("diffusion-time")}
      relatedLessons={[
        { label: "Level 1 — Physics foundations", href: "/learn" },
      ]}
      relatedTools={getRelatedToolLinks("diffusion-time")}
    />
  );
}
