"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import {
  MeasurementField,
  type MeasurementValue,
} from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { getRelatedToolLinks } from "@/lib/data/tools";
import { getRelatedConceptLinks } from "@/lib/data/graph";
import { track } from "@/lib/analytics";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { flowResistance } from "@/lib/calculations/flowResistance";
import { formatNumber } from "@/lib/utils/format";

type Mode = "rectangular" | "from-measurements";
type FieldKey =
  | "viscosity"
  | "length"
  | "width"
  | "height"
  | "pressureDrop"
  | "flowRate";

const DEFAULTS: Record<FieldKey, MeasurementValue> = {
  viscosity: { raw: "1.0", unit: "mPa_s" },
  length: { raw: "10", unit: "mm" },
  width: { raw: "100", unit: "um" },
  height: { raw: "50", unit: "um" },
  pressureDrop: { raw: "10", unit: "kPa" },
  flowRate: { raw: "1", unit: "uL_per_min" },
};

const MODE_FIELDS: Record<Mode, FieldKey[]> = {
  rectangular: ["viscosity", "length", "width", "height"],
  "from-measurements": ["pressureDrop", "flowRate"],
};

export function FlowResistanceCalculator() {
  const [mode, setMode] = useState<Mode>("rectangular");
  const [fields, setFields] = useState<Record<FieldKey, MeasurementValue>>(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<{ resistance: number; approximation: boolean } | null>(
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

  const changeMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const active = MODE_FIELDS[mode];
    const si: Partial<Record<FieldKey, number>> = {};
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    active.forEach((k) => {
      const v = measurementToSI(fields[k]);
      if (v === null) nextErrors[k] = "Enter a valid number.";
      else si[k] = v;
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }

    const res =
      mode === "rectangular"
        ? flowResistance({
            method: "rectangular",
            viscosity: si.viscosity as number,
            length: si.length as number,
            width: si.width as number,
            height: si.height as number,
          })
        : flowResistance({
            method: "from-measurements",
            pressureDrop: si.pressureDrop as number,
            flowRate: si.flowRate as number,
          });

    if (!res.ok) {
      const field = res.field as FieldKey | undefined;
      setErrors(field ? { [field]: res.error } : {});
      setFormError(field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "flow-resistance", field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult({ resistance: res.value.resistance, approximation: res.value.approximation });
    track("calculation_completed", { tool: "flow-resistance" });
  };

  return (
    <CalculatorShell
      title="Flow resistance"
      description="Hydraulic resistance of a channel — the microfluidic analogue of electrical resistance."
      tier="mvp"
      trackSlug="flow-resistance"
      categoryLabel="Fluid mechanics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Flow resistance" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <Select
            label="Method"
            value={mode}
            onChange={(e) => changeMode(e.target.value as Mode)}
            options={[
              { value: "rectangular", label: "Rectangular channel (approximation)" },
              { value: "from-measurements", label: "From measured ΔP and Q" },
            ]}
          />

          {mode === "rectangular" ? (
            <>
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
                label="Channel width (w)"
                quantity="length"
                value={fields.width}
                onChange={set("width")}
                error={errors.width}
              />
              <MeasurementField
                label="Channel height (h)"
                quantity="length"
                value={fields.height}
                onChange={set("height")}
                error={errors.height}
                help="The smaller of width/height is treated as the height."
              />
            </>
          ) : (
            <>
              <MeasurementField
                label="Pressure drop (ΔP)"
                quantity="pressure"
                value={fields.pressureDrop}
                onChange={set("pressureDrop")}
                error={errors.pressureDrop}
              />
              <MeasurementField
                label="Flow rate (Q)"
                quantity="flowRate"
                value={fields.flowRate}
                onChange={set("flowRate")}
                error={errors.flowRate}
              />
            </>
          )}
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <div className="space-y-3">
          <ResultCard
            results={
              result
                ? [
                    {
                      label: "Flow resistance",
                      value: formatNumber(result.resistance),
                      unit: "Pa·s/m³",
                      primary: true,
                    },
                  ]
                : []
            }
          />
          {result?.approximation && (
            <p className="text-xs text-muted-foreground">
              <Badge variant="warning">Approximation</Badge>{" "}
              Rectangular resistance uses the first-term series approximation;
              most accurate for tall, narrow channels (h ≪ w).
            </p>
          )}
        </div>
      }
      interpretation={
        <div className="space-y-3">
          <p>
            Hydraulic resistance behaves exactly like electrical resistance, which
            lets you analyse a whole chip as a circuit:
          </p>
          <ul className="grid gap-1 text-sm sm:grid-cols-3">
            <li className="rounded-md border border-border bg-muted/40 px-3 py-2 font-mono">
              ΔP ↔ Voltage
            </li>
            <li className="rounded-md border border-border bg-muted/40 px-3 py-2 font-mono">
              Q ↔ Current
            </li>
            <li className="rounded-md border border-border bg-muted/40 px-3 py-2 font-mono">
              R ↔ Resistance
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Channels in series add (R = R₁ + R₂ + …); channels in parallel combine
            reciprocally (1/R = 1/R₁ + 1/R₂ + …) — just like resistors.
          </p>
        </div>
      }
      formula={{
        expression:
          mode === "rectangular"
            ? "R ≈ 12 · μ · L / [ w · h³ · (1 − 0.63 · h/w) ]"
            : "R = ΔP / Q",
        label: mode === "rectangular" ? "Rectangular channel (approximation)" : "Definition",
        caption:
          mode === "rectangular"
            ? "First term of the exact series; assumes laminar, fully developed flow."
            : "Resistance from a measured pressure drop and flow rate (no flow-regime assumption).",
      }}
      variables={[
        { symbol: "R", name: "Hydraulic resistance", unit: "Pa·s/m³" },
        { symbol: "ΔP", name: "Pressure drop", unit: "Pa" },
        { symbol: "Q", name: "Volumetric flow rate", unit: "m³/s" },
        { symbol: "μ", name: "Dynamic viscosity", unit: "Pa·s" },
        { symbol: "L", name: "Channel length", unit: "m" },
        { symbol: "w", name: "Channel width", unit: "m" },
        { symbol: "h", name: "Channel height", unit: "m" },
      ]}
      assumptions={[
        "R = ΔP/Q by definition (the 'from measurements' method makes no flow assumption).",
        "The rectangular formula R ≈ 12μL/(wh³(1−0.63 h/w)) is an APPROXIMATION (first term of the exact series); most accurate for h ≪ w.",
        "Rectangular method assumes fully developed, steady, laminar, Newtonian flow.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>
            A rectangular channel: μ = 1.0 mPa·s, L = 10 mm, w = 100 µm, h = 50 µm.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            R ≈ 12 × 10⁻³ × 0.01 / [10⁻⁴ × (5×10⁻⁵)³ × (1 − 0.63 × 0.5)] ≈ 3.5×10¹³ Pa·s/m³
          </p>
        </div>
      }
      relatedConcepts={getRelatedConceptLinks("flow-resistance")}
      relatedLessons={[
        { label: "Level 1 — Physics foundations", href: "/learn" },
      ]}
      relatedTools={getRelatedToolLinks("flow-resistance")}
    />
  );
}
