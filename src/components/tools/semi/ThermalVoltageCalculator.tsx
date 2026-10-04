"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { thermalVoltage, type ThermalVoltageResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

export function ThermalVoltageCalculator() {
  const [temp, setTemp] = useState<MeasurementValue>({ raw: "27", unit: "C" });
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<ThermalVoltageResult | null>(null);

  const reset = () => { setTemp({ raw: "27", unit: "C" }); setError(undefined); setResult(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = measurementToSI(temp);
    if (t === null) { setError("Enter a valid number."); setResult(null); return; }
    const res = thermalVoltage({ temperature: t });
    if (!res.ok) { setError(res.error); setResult(null); track("calculation_error", { tool: "thermal-voltage", field: res.field }); return; }
    setError(undefined); setResult(res.value); track("calculation_completed", { tool: "thermal-voltage" });
  };

  return (
    <CalculatorShell
      title="Thermal voltage"
      description="The thermal voltage Vt = kT/q sets the scale of diode and transistor sub-threshold exponentials."
      tier="mvp"
      trackSlug="thermal-voltage"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Thermal voltage" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <MeasurementField label="Temperature" quantity="temperature" value={temp} onChange={setTemp} error={error} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Thermal voltage (Vt)", value: formatNumber(result.thermalVoltage * 1000), unit: "mV", primary: true },
                  { label: "Thermal voltage (Vt)", value: formatNumber(result.thermalVoltage), unit: "V" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Vt = kT/q is about <strong>25.85 mV at 300 K</strong> and rises linearly with temperature. It is the natural
            voltage scale for carrier statistics — diode and sub-threshold currents change by a factor of e for every Vt
            of applied voltage, and the sub-threshold swing is proportional to it.
          </p>
        ) : (
          <p>Enter a temperature.</p>
        )
      }
      formula={{ expression: "Vt = kB · T / q", label: "Thermal voltage", caption: "kB = Boltzmann constant, q = elementary charge." }}
      variables={[
        { symbol: "Vt", name: "Thermal voltage", unit: "V" },
        { symbol: "kB", name: "Boltzmann constant", unit: "J/K (1.381×10⁻²³)" },
        { symbol: "T", name: "Absolute temperature", unit: "K" },
        { symbol: "q", name: "Elementary charge", unit: "C (1.602×10⁻¹⁹)" },
      ]}
      assumptions={["Exact definition; no approximation beyond the constants used."]}
      workedExample={
        <div className="space-y-2">
          <p>T = 27 °C (300.15 K).</p>
          <p className="font-mono text-xs text-muted-foreground">Vt = kB·T/q ≈ 25.9 mV</p>
        </div>
      }
      relatedConcepts={[{ label: "PN junction", href: "/semiconductors/learn/pn-junction" }]}
      relatedLessons={getSemiToolLearningLinks("thermal-voltage")}
      relatedTools={getRelatedSemiToolLinks("thermal-voltage")}
    />
  );
}
