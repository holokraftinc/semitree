"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { fieldBase } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { dopingConversion, type DopingConversionResult } from "@/lib/calculations/semi";
import { toSI } from "@/lib/units";
import { parseNumber, formatNumber } from "@/lib/utils/format";

function readMeasure(m: MeasurementValue): "empty" | number | null {
  if (m.raw.trim() === "") return "empty";
  const n = parseNumber(m.raw);
  if (n === null) return null;
  try {
    return toSI(n, m.unit);
  } catch {
    return null;
  }
}
function readPlain(raw: string): "empty" | number | null {
  if (raw.trim() === "") return "empty";
  return parseNumber(raw);
}

export function DopingConversionCalculator() {
  const [concentration, setConcentration] = useState<MeasurementValue>({ raw: "1e16", unit: "per_cm3" });
  const [volume, setVolume] = useState<MeasurementValue>({ raw: "1", unit: "uL" });
  const [count, setCount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<DopingConversionResult | null>(null);

  const reset = () => {
    setConcentration({ raw: "1e16", unit: "per_cm3" });
    setVolume({ raw: "1", unit: "uL" });
    setCount("");
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = readMeasure(concentration);
    const v = readMeasure(volume);
    const n = readPlain(count);
    const nextErrors: Record<string, string> = {};
    if (c === null) nextErrors.concentration = "Enter a valid number or leave blank.";
    if (v === null) nextErrors.volume = "Enter a valid number or leave blank.";
    if (n === null) nextErrors.count = "Enter a valid number or leave blank.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const provided = [c, v, n].filter((x) => x !== "empty").length;
    if (provided !== 2) {
      setErrors({});
      setFormError("Enter exactly two of concentration, volume, and count — leave the third blank.");
      setResult(null);
      return;
    }
    const res = dopingConversion({
      concentration: c === "empty" ? undefined : (c as number),
      volume: v === "empty" ? undefined : (v as number),
      count: n === "empty" ? undefined : (n as number),
    });
    if (!res.ok) {
      setErrors(res.field ? { [res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "doping-conversion", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "doping-conversion" });
  };

  return (
    <CalculatorShell
      title="Doping concentration ↔ count"
      description="Convert between dopant concentration, a volume, and the total number of dopant atoms."
      tier="mvp"
      trackSlug="doping-conversion"
      categoryLabel="Doping"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Doping concentration ↔ count" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Concentration is not a count">
            Concentration is a density (atoms per unit volume). The total count depends on how large the volume is —
            fill any two fields and leave the third blank to compute it.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Dopant concentration" quantity="concentration" value={concentration} onChange={setConcentration} error={errors.concentration} required={false} />
          <MeasurementField label="Volume" quantity="volume" value={volume} onChange={setVolume} error={errors.volume} required={false} />
          <div className="space-y-1.5">
            <label htmlFor="dc-count" className="block text-sm font-medium text-foreground">Total dopant atoms (count)</label>
            <input id="dc-count" type="number" inputMode="decimal" step="any" value={count} onChange={(e) => setCount(e.target.value)} aria-invalid={Boolean(errors.count)} className={cn(fieldBase, "w-full")} placeholder="leave blank to compute" />
            {errors.count && <p className="text-sm text-danger">{errors.count}</p>}
          </div>
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Concentration", value: formatNumber(result.concentration / 1e6), unit: "cm⁻³", primary: result.computed === "concentration" },
                  { label: "Volume", value: formatNumber(result.volume * 1e9), unit: "µL", primary: result.computed === "volume" },
                  { label: "Total dopant atoms", value: formatNumber(result.count), unit: "atoms", primary: result.computed === "count" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Total atoms = concentration × volume. The same concentration gives very different total counts depending on
            the volume considered — which is why a doping level (a density) and a dopant count are distinct quantities.
          </p>
        ) : (
          <p>Fill any two of concentration, volume, and count; leave the third blank.</p>
        )
      }
      formula={{ expression: "count = concentration × volume", label: "Dopant count", caption: "Density × volume = total number." }}
      variables={[
        { symbol: "count", name: "Total dopant atoms", unit: "dimensionless" },
        { symbol: "concentration", name: "Dopant concentration", unit: "m⁻³" },
        { symbol: "volume", name: "Volume considered", unit: "m³" },
      ]}
      assumptions={["Uniform concentration throughout the volume."]}
      workedExample={
        <div className="space-y-2">
          <p>concentration = 1×10¹⁶ cm⁻³, volume = 1 µL (= 1×10⁻⁹ m³).</p>
          <p className="font-mono text-xs text-muted-foreground">count = 1×10²² m⁻³ × 1×10⁻⁹ m³ = 1×10¹³ atoms</p>
        </div>
      }
      relatedConcepts={[{ label: "Doping", href: "/semiconductors/learn/ion-implantation" }]}
      relatedLessons={getSemiToolLearningLinks("doping-conversion")}
      relatedTools={getRelatedSemiToolLinks("doping-conversion")}
    />
  );
}
