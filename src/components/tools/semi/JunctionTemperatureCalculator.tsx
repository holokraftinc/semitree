"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { NumberField } from "@/components/tools/calculator/NumberField";
import {
  MeasurementField,
  type MeasurementValue,
} from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { junctionTemperature, type ThermalResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

export function JunctionTemperatureCalculator() {
  const [powerValue, setPowerValue] = useState<MeasurementValue>({ raw: "5", unit: "W" });
  const [theta, setTheta] = useState("10");
  const [ambient, setAmbient] = useState<MeasurementValue>({ raw: "25", unit: "C" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<ThermalResult | null>(null);

  const reset = () => {
    setPowerValue({ raw: "5", unit: "W" });
    setTheta("10");
    setAmbient({ raw: "25", unit: "C" });
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = measurementToSI(powerValue);
    const th = parseNumber(theta);
    const ta = measurementToSI(ambient);
    const nextErrors: Record<string, string> = {};
    if (p === null) nextErrors.power = "Enter a valid number.";
    if (th === null) nextErrors.thermalResistance = "Enter a valid number.";
    if (ta === null) nextErrors.ambientTemp = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = junctionTemperature({ power: p!, thermalResistance: th!, ambientTemp: ta! });
    if (!res.ok) {
      if (res.field === "thermalResistance") setErrors({ thermalResistance: res.error });
      else if (res.field === "power") setErrors({ power: res.error });
      else if (res.field === "ambientTemp") setErrors({ ambientTemp: res.error });
      else setFormError(res.error);
      setResult(null);
      track("calculation_error", { tool: "junction-temperature", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "junction-temperature" });
  };

  return (
    <CalculatorShell
      title="Junction temperature"
      description="Steady-state junction temperature from dissipated power and thermal resistance."
      tier="mvp"
      trackSlug="junction-temperature"
      categoryLabel="Packaging & thermal"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Junction temperature" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <MeasurementField
            label="Dissipated power (P)"
            quantity="power"
            value={powerValue}
            onChange={setPowerValue}
            error={errors.power}
            help="Use the Power dissipation tool if you need this first."
          />
          <NumberField
            label="Thermal resistance (θ_JA)"
            value={theta}
            onChange={setTheta}
            error={errors.thermalResistance}
            suffix="K/W"
            help="Junction-to-ambient, from the device datasheet."
          />
          <MeasurementField
            label="Ambient temperature (T_a)"
            quantity="temperature"
            value={ambient}
            onChange={setAmbient}
            error={errors.ambientTemp}
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
                    label: "Junction temperature",
                    value: formatNumber(result.junctionTemp - 273.15),
                    unit: "°C",
                    primary: true,
                  },
                  {
                    label: "Junction temperature",
                    value: formatNumber(result.junctionTemp),
                    unit: "K",
                  },
                  {
                    label: "Temperature rise (ΔT)",
                    value: formatNumber(result.temperatureRise),
                    unit: "K",
                  },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            The junction runs this far above ambient at steady state. Compare it
            against the device&apos;s maximum rated junction temperature (often
            125 °C or 150 °C) — if it is close or above, you need a lower θ_JA (a
            better heatsink or airflow), a cooler ambient, or less dissipated
            power. This one-resistance model ignores transient thermal capacity.
          </p>
        ) : (
          <p>
            Enter dissipated power, the package&apos;s junction-to-ambient
            thermal resistance, and the ambient temperature.
          </p>
        )
      }
      formula={{
        expression: "T_j = T_a + P · θ_JA",
        label: "Junction temperature",
        caption: "θ_JA = junction-to-ambient thermal resistance.",
      }}
      variables={[
        { symbol: "T_j", name: "Junction temperature", unit: "K" },
        { symbol: "T_a", name: "Ambient temperature", unit: "K" },
        { symbol: "P", name: "Dissipated power", unit: "W" },
        { symbol: "θ_JA", name: "Thermal resistance", unit: "K/W" },
      ]}
      assumptions={[
        "Steady-state, one-dimensional heat flow (single θ_JA path).",
        "θ_JA is constant (independent of temperature and airflow).",
        "All dissipated power flows from junction to ambient through θ_JA.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>P = 5 W, θ_JA = 10 K/W, T_a = 25 °C.</p>
          <p className="font-mono text-xs text-muted-foreground">
            ΔT = 5 × 10 = 50 K → T_j = 25 + 50 = 75 °C
          </p>
        </div>
      }
      relatedConcepts={[
        { label: "Packaging", href: "/semiconductors/learn/packaging" },
        { label: "Flip-chip", href: "/semiconductors/learn/flip-chip" },
      ]}
      relatedLessons={[
        { label: "Advanced packaging", href: "/semiconductors/learn/advanced-packaging" },
      ]}
      relatedTools={[
        ...getRelatedSemiToolLinks("junction-temperature"),
        { label: "Explore semiconductor companies", href: "/industry" },
      ]}
    />
  );
}
