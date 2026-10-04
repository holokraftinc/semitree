"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { fieldBase } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { mosThresholdVoltage, type MosThresholdResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

export function MosfetThresholdCalculator() {
  const [doping, setDoping] = useState<MeasurementValue>({ raw: "1e17", unit: "per_cm3" });
  const [tox, setTox] = useState<MeasurementValue>({ raw: "5", unit: "nm" });
  const [vfb, setVfb] = useState("-0.9");
  const [temp, setTemp] = useState<MeasurementValue>({ raw: "27", unit: "C" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<MosThresholdResult | null>(null);

  const reset = () => { setDoping({ raw: "1e17", unit: "per_cm3" }); setTox({ raw: "5", unit: "nm" }); setVfb("-0.9"); setTemp({ raw: "27", unit: "C" }); setErrors({}); setFormError(null); setResult(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const na = measurementToSI(doping); const tx = measurementToSI(tox); const vf = parseNumber(vfb); const t = measurementToSI(temp);
    const nextErrors: Record<string, string> = {};
    if (na === null) nextErrors.doping = "Enter a valid number.";
    if (tx === null) nextErrors.tox = "Enter a valid number.";
    if (vf === null) nextErrors.vfb = "Enter a valid number.";
    if (t === null) nextErrors.temp = "Enter a valid number.";
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setFormError(null); setResult(null); return; }
    const res = mosThresholdVoltage({ substrateDoping: na!, oxideThickness: tx!, flatbandVoltage: vf!, temperature: t! });
    if (!res.ok) { setErrors(res.field ? { [res.field]: res.error } : {}); setFormError(res.field ? null : res.error); setResult(null); track("calculation_error", { tool: "mosfet-threshold", field: res.field }); return; }
    setErrors({}); setFormError(null); setResult(res.value); track("calculation_completed", { tool: "mosfet-threshold" });
  };

  return (
    <CalculatorShell
      title="MOSFET threshold voltage"
      description="An educational long-channel nMOS threshold-voltage model from substrate doping, oxide thickness, and flatband voltage."
      tier="mvp"
      trackSlug="mosfet-threshold"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "MOSFET threshold voltage" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Educational long-channel model">
            Model: Vth = Vfb + 2φF + √(2·εSi·q·Na·2φF)/Cox. Operating region: long-channel nMOS, uniform substrate doping,
            full ionization. It ignores short-channel effects, poly depletion, quantum effects, and interface traps.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Substrate doping (Na)" quantity="concentration" value={doping} onChange={setDoping} error={errors.doping} />
          <MeasurementField label="Oxide thickness (tox)" quantity="length" value={tox} onChange={setTox} error={errors.tox} />
          <div className="space-y-1.5">
            <label htmlFor="vth-vfb" className="block text-sm font-medium text-foreground">Flatband voltage (Vfb)</label>
            <div className="flex items-center gap-2">
              <input id="vth-vfb" type="number" inputMode="decimal" step="any" value={vfb} onChange={(e) => setVfb(e.target.value)} aria-invalid={Boolean(errors.vfb)} className={cn(fieldBase, "w-full")} />
              <span className="shrink-0 text-sm text-muted-foreground">V</span>
            </div>
            <p className="text-xs text-muted-foreground">A parameter set by gate/semiconductor work functions and oxide charge.</p>
            {errors.vfb && <p className="text-sm text-danger">{errors.vfb}</p>}
          </div>
          <MeasurementField label="Temperature" quantity="temperature" value={temp} onChange={setTemp} error={errors.temp} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Threshold voltage (Vth)", value: formatNumber(result.thresholdVoltage), unit: "V", primary: true },
                  { label: "Oxide capacitance (Cox)", value: formatNumber(result.oxideCapacitance * 1e3), unit: "mF/m²" },
                  { label: "Fermi potential (φF)", value: formatNumber(result.fermiPotential), unit: "V" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Threshold voltage is the gate voltage at which the channel turns on. Heavier substrate doping raises it (the
            depletion-charge term), while a thinner oxide (larger Cox) lowers it. The flatband voltage shifts the whole
            curve. This is the classic long-channel picture — real short devices need more complete models.
          </p>
        ) : (
          <p>Enter the substrate doping, oxide thickness, flatband voltage, and temperature.</p>
        )
      }
      formula={{ expression: "Vth = Vfb + 2φF + √(2·εSi·q·Na·2φF) / Cox", label: "Long-channel Vth", caption: "Cox = εox/tox; φF = Vt·ln(Na/ni)." }}
      variables={[
        { symbol: "Vth", name: "Threshold voltage", unit: "V" },
        { symbol: "Vfb", name: "Flatband voltage (parameter)", unit: "V" },
        { symbol: "φF", name: "Fermi potential", unit: "V" },
        { symbol: "Na", name: "Substrate (acceptor) doping", unit: "m⁻³" },
        { symbol: "Cox", name: "Oxide capacitance per area", unit: "F/m²" },
      ]}
      assumptions={[
        "Educational long-channel nMOS model.",
        "Uniform substrate doping; complete ionization; non-degenerate.",
        "Ignores short-channel effects, poly depletion, quantum effects, and interface traps.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>Na = 1×10¹⁷ cm⁻³, tox = 5 nm, Vfb = −0.9 V, 27 °C.</p>
          <p className="font-mono text-xs text-muted-foreground">Cox = εox/tox; φF = Vt·ln(Na/ni); Vth = Vfb + 2φF + √(…)/Cox</p>
        </div>
      }
      relatedConcepts={[{ label: "MOSFET", href: "/semiconductors/learn/mosfet" }]}
      relatedLessons={getSemiToolLearningLinks("mosfet-threshold")}
      relatedTools={getRelatedSemiToolLinks("mosfet-threshold")}
    />
  );
}
