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
import { power, type PowerResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type Method = "vi" | "ir" | "vr";

const METHOD_OPTIONS = [
  { value: "vi", label: "Voltage & current (P = V·I)" },
  { value: "ir", label: "Current & resistance (P = I²·R)" },
  { value: "vr", label: "Voltage & resistance (P = V²/R)" },
];

const DEFAULTS = {
  voltage: { raw: "3.3", unit: "V" } as MeasurementValue,
  current: { raw: "100", unit: "mA" } as MeasurementValue,
  resistance: { raw: "33", unit: "ohm" } as MeasurementValue,
};

export function PowerDissipationCalculator() {
  const [method, setMethod] = useState<Method>("vi");
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<PowerResult | null>(null);

  const set = (key: keyof typeof DEFAULTS) => (next: MeasurementValue) =>
    setFields((f) => ({ ...f, [key]: next }));

  const reset = () => {
    setMethod("vi");
    setFields(DEFAULTS);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const needed: Record<Method, Array<keyof typeof DEFAULTS>> = {
    vi: ["voltage", "current"],
    ir: ["current", "resistance"],
    vr: ["voltage", "resistance"],
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keys = needed[method];
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
      method === "vi"
        ? { method, voltage: si.voltage!, current: si.current! }
        : method === "ir"
          ? { method, current: si.current!, resistance: si.resistance! }
          : { method, voltage: si.voltage!, resistance: si.resistance! };

    const res = power(input);
    if (!res.ok) {
      setErrors(res.field ? { [res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "power-dissipation", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "power-dissipation" });
  };

  const keys = needed[method];

  return (
    <CalculatorShell
      title="Power dissipation"
      description="Compute resistive (real) power from any two of voltage, current, and resistance."
      tier="mvp"
      trackSlug="power-dissipation"
      categoryLabel="Electrical fundamentals"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Power dissipation" },
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
            options={METHOD_OPTIONS}
            value={method}
            onChange={(e) => {
              setMethod(e.target.value as Method);
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
              ? [{ label: "Power", value: formatNumber(result.power), unit: "W", primary: true }]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            This is the real power converted to heat in the resistive element.
            In a chip, summed across all devices it sets the thermal budget —
            feed it into the Junction temperature and Power density tools to
            check the package can remove it.
          </p>
        ) : (
          <p>
            Choose which two quantities you know. All three forms (P = V·I, I²·R,
            V²/R) are algebraically equivalent for an ohmic device.
          </p>
        )
      }
      formula={{
        expression: "P = V · I = I² · R = V² / R",
        label: "Resistive power",
        caption: "Three equivalent forms for an ohmic device.",
      }}
      variables={[
        { symbol: "P", name: "Power", unit: "W" },
        { symbol: "V", name: "Voltage", unit: "V" },
        { symbol: "I", name: "Current", unit: "A" },
        { symbol: "R", name: "Resistance", unit: "Ω" },
      ]}
      assumptions={[
        "Resistive (real) power; no reactive/AC phase effects.",
        "DC / steady-state, ohmic device.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>A device drops 3.3 V while drawing 100 mA.</p>
          <p className="font-mono text-xs text-muted-foreground">
            P = 3.3 V × 0.10 A = 0.33 W
          </p>
        </div>
      }
      relatedConcepts={[
        { label: "CMOS", href: "/semiconductors/learn/cmos" },
        { label: "MOSFET", href: "/semiconductors/learn/mosfet" },
      ]}
      relatedLessons={[
        { label: "Integrated circuit", href: "/semiconductors/learn/integrated-circuit" },
      ]}
      relatedTools={[
        ...getRelatedSemiToolLinks("power-dissipation"),
        { label: "Explore semiconductor companies", href: "/industry" },
      ]}
    />
  );
}
