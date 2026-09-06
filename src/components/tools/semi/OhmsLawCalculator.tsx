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
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { ohmsLaw, type OhmsLawResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type SolveFor = "voltage" | "current" | "resistance";

const SOLVE_OPTIONS = [
  { value: "voltage", label: "Voltage (V)" },
  { value: "current", label: "Current (I)" },
  { value: "resistance", label: "Resistance (R)" },
];

const DEFAULTS = {
  voltage: { raw: "5", unit: "V" } as MeasurementValue,
  current: { raw: "10", unit: "mA" } as MeasurementValue,
  resistance: { raw: "500", unit: "ohm" } as MeasurementValue,
};

export function OhmsLawCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("voltage");
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<OhmsLawResult | null>(null);

  const set = (key: keyof typeof DEFAULTS) => (next: MeasurementValue) =>
    setFields((f) => ({ ...f, [key]: next }));

  const reset = () => {
    setSolveFor("voltage");
    setFields(DEFAULTS);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  // The two inputs needed for the current mode.
  const needed: Record<SolveFor, Array<keyof typeof DEFAULTS>> = {
    voltage: ["current", "resistance"],
    current: ["voltage", "resistance"],
    resistance: ["voltage", "current"],
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keys = needed[solveFor];
    const si: Partial<Record<keyof typeof DEFAULTS, number>> = {};
    const nextErrors: Record<string, string> = {};
    keys.forEach((k) => {
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

    const input =
      solveFor === "voltage"
        ? { solveFor, current: si.current!, resistance: si.resistance! }
        : solveFor === "current"
          ? { solveFor, voltage: si.voltage!, resistance: si.resistance! }
          : { solveFor, voltage: si.voltage!, current: si.current! };

    const res = ohmsLaw(input);
    if (!res.ok) {
      setErrors(res.field ? { [res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "ohms-law", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "ohms-law" });
  };

  const keys = needed[solveFor];

  return (
    <CalculatorShell
      title="Ohm's law"
      description="Solve for voltage, current, or resistance in a resistive (ohmic) circuit."
      tier="mvp"
      trackSlug="ohms-law"
      categoryLabel="Electrical fundamentals"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Ohm's law" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <Select
            label="Solve for"
            options={SOLVE_OPTIONS}
            value={solveFor}
            onChange={(e) => {
              setSolveFor(e.target.value as SolveFor);
              setResult(null);
              setErrors({});
            }}
          />
          {keys.includes("voltage") && (
            <MeasurementField
              label="Voltage (V)"
              quantity="voltage"
              value={fields.voltage}
              onChange={set("voltage")}
              error={errors.voltage}
            />
          )}
          {keys.includes("current") && (
            <MeasurementField
              label="Current (I)"
              quantity="current"
              value={fields.current}
              onChange={set("current")}
              error={errors.current}
            />
          )}
          {keys.includes("resistance") && (
            <MeasurementField
              label="Resistance (R)"
              quantity="resistance"
              value={fields.resistance}
              onChange={set("resistance")}
              error={errors.resistance}
            />
          )}
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
                    label:
                      solveFor === "voltage"
                        ? "Voltage"
                        : solveFor === "current"
                          ? "Current"
                          : "Resistance",
                    value:
                      solveFor === "voltage"
                        ? formatNumber(result.voltage)
                        : solveFor === "current"
                          ? formatNumber(result.current)
                          : formatNumber(result.resistance),
                    unit:
                      solveFor === "voltage"
                        ? "V"
                        : solveFor === "current"
                          ? "A"
                          : "Ω",
                    primary: true,
                  },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            For an ohmic device these three quantities are locked together by V =
            I·R. Change any two and the third follows. Real devices (diodes,
            transistors) are non-linear, so Ohm&apos;s law applies only to
            resistive elements or small-signal approximations.
          </p>
        ) : (
          <p>
            Pick what to solve for, enter the other two values, and calculate.
            Results use SI internally, so any unit you choose is converted
            automatically.
          </p>
        )
      }
      formula={{
        expression: "V = I · R",
        label: "Ohm's law",
        caption: "Voltage equals current times resistance.",
      }}
      variables={[
        { symbol: "V", name: "Voltage", unit: "V" },
        { symbol: "I", name: "Current", unit: "A" },
        { symbol: "R", name: "Resistance", unit: "Ω" },
      ]}
      assumptions={[
        "Ohmic (linear) device: resistance is constant.",
        "DC / steady-state conditions.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>A 500 Ω resistor carries 10 mA. What is the voltage across it?</p>
          <p className="font-mono text-xs text-muted-foreground">
            V = 0.010 A × 500 Ω = 5 V
          </p>
        </div>
      }
      relatedConcepts={[
        { label: "MOSFET", href: "/semiconductors/learn/mosfet" },
        { label: "Integrated circuit", href: "/semiconductors/learn/integrated-circuit" },
      ]}
      relatedLessons={[
        { label: "CMOS", href: "/semiconductors/learn/cmos" },
      ]}
      relatedTools={[
        ...getRelatedSemiToolLinks("ohms-law"),
        { label: "Explore semiconductor companies", href: "/industry" },
      ]}
    />
  );
}
