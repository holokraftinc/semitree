"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
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
import { syringePump, type SyringePumpResult } from "@/lib/calculations/syringePump";
import { convert } from "@/lib/units";
import { formatNumber } from "@/lib/utils/format";

type Mode = "speed-from-flow" | "flow-from-speed";
type FieldKey = "innerDiameter" | "flowRate" | "plungerSpeed";

const DEFAULTS: Record<FieldKey, MeasurementValue> = {
  innerDiameter: { raw: "4.6", unit: "mm" },
  flowRate: { raw: "10", unit: "uL_per_min" },
  plungerSpeed: { raw: "0.01", unit: "mm_per_s" },
};

const MODE_FIELDS: Record<Mode, FieldKey[]> = {
  "speed-from-flow": ["innerDiameter", "flowRate"],
  "flow-from-speed": ["innerDiameter", "plungerSpeed"],
};

export function SyringePumpCalculator() {
  const [mode, setMode] = useState<Mode>("speed-from-flow");
  const [fields, setFields] = useState<Record<FieldKey, MeasurementValue>>(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<SyringePumpResult | null>(null);

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
      mode === "speed-from-flow"
        ? syringePump({
            mode: "speed-from-flow",
            innerDiameter: si.innerDiameter as number,
            flowRate: si.flowRate as number,
          })
        : syringePump({
            mode: "flow-from-speed",
            innerDiameter: si.innerDiameter as number,
            plungerSpeed: si.plungerSpeed as number,
          });

    if (!res.ok) {
      const field = res.field as FieldKey | undefined;
      setErrors(field ? { [field]: res.error } : {});
      setFormError(field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "syringe-pump-settings", field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "syringe-pump-settings" });
  };

  const results = result
    ? mode === "speed-from-flow"
      ? [
          {
            label: "Plunger speed",
            value: formatNumber(convert(result.plungerSpeed, "m_per_s", "mm_per_s")),
            unit: "mm/s",
            primary: true,
          },
          {
            label: "Plunger speed",
            value: formatNumber(
              convert(result.plungerSpeed, "m_per_s", "mm_per_s") * 60,
            ),
            unit: "mm/min",
          },
          {
            label: "Syringe area",
            value: formatNumber(result.crossSectionArea * 1e6),
            unit: "mm²",
          },
        ]
      : [
          {
            label: "Flow rate",
            value: formatNumber(convert(result.flowRate, "m3_per_s", "uL_per_min")),
            unit: "µL/min",
            primary: true,
          },
          {
            label: "Flow rate",
            value: formatNumber(convert(result.flowRate, "m3_per_s", "mL_per_h")),
            unit: "mL/h",
          },
          {
            label: "Syringe area",
            value: formatNumber(result.crossSectionArea * 1e6),
            unit: "mm²",
          },
        ]
    : [];

  return (
    <CalculatorShell
      title="Syringe pump settings"
      description="Map a syringe's inner diameter between plunger speed and volumetric flow rate."
      tier="mvp"
      trackSlug="syringe-pump-settings"
      categoryLabel="Lab utilities"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Syringe pump settings" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="What this assumes">
            The flow rate equals the plunger speed times the syringe&rsquo;s
            internal cross-section (Q = A·v, A = πd²/4). It assumes an
            incompressible fluid and no leakage or tubing/seal compliance.
          </Alert>
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <Select
            label="Solve for"
            value={mode}
            onChange={(e) => changeMode(e.target.value as Mode)}
            options={[
              { value: "speed-from-flow", label: "Plunger speed from flow rate" },
              { value: "flow-from-speed", label: "Flow rate from plunger speed" },
            ]}
          />
          <MeasurementField
            label="Syringe inner diameter (d)"
            quantity="length"
            value={fields.innerDiameter}
            onChange={set("innerDiameter")}
            error={errors.innerDiameter}
            help="From the syringe spec; e.g. a 1 mL BD syringe ≈ 4.6 mm ID."
          />
          {mode === "speed-from-flow" ? (
            <MeasurementField
              label="Target flow rate (Q)"
              quantity="flowRate"
              value={fields.flowRate}
              onChange={set("flowRate")}
              error={errors.flowRate}
            />
          ) : (
            <MeasurementField
              label="Plunger speed (v)"
              quantity="velocity"
              value={fields.plungerSpeed}
              onChange={set("plungerSpeed")}
              error={errors.plungerSpeed}
            />
          )}
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          results={results}
          empty="Enter the syringe diameter and target to see the setting."
        />
      }
      interpretation={
        result ? (
          <p>
            Set your pump to this value for the chosen syringe. Note the strong
            dependence on diameter: because area scales with d², a syringe with
            twice the diameter needs one-quarter the plunger speed for the same
            flow rate.
          </p>
        ) : (
          <p>
            Syringe pumps are programmed either by plunger speed or by flow rate.
            This tool converts between them for a given syringe diameter.
          </p>
        )
      }
      formula={{
        expression: "Q = A · v,   A = π · d² / 4",
        label: "Flow rate from plunger speed",
        caption: "Exact geometric relation for the syringe barrel.",
      }}
      variables={[
        { symbol: "Q", name: "Volumetric flow rate", unit: "m³/s" },
        { symbol: "A", name: "Syringe cross-section area", unit: "m²" },
        { symbol: "v", name: "Plunger linear speed", unit: "m/s" },
        { symbol: "d", name: "Syringe inner diameter", unit: "m" },
      ]}
      assumptions={[
        "Q = A·v with A = π·d²/4 (based on the syringe inner diameter) — exact geometry.",
        "Incompressible fluid.",
        "No leakage, and no system compliance (tubing/seal deformation ignored).",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>
            A 1 mL syringe (d = 4.6 mm) set to Q = 10 µL/min.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            A = π(4.6×10⁻³)²/4 ≈ 1.66×10⁻⁵ m²; v = Q/A ≈ 0.010 mm/s
          </p>
        </div>
      }
      relatedConcepts={getRelatedConceptLinks("syringe-pump-settings")}
      relatedLessons={[{ label: "Level 5 — Do it yourself", href: "/learn" }]}
      relatedTools={getRelatedToolLinks("syringe-pump-settings")}
    />
  );
}
