"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { exposureDose, type DoseResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

export function DoseExposureCalculator() {
  const [energy, setEnergy] = useState<MeasurementValue>({ raw: "1", unit: "mJ" });
  const [area, setArea] = useState<MeasurementValue>({ raw: "100", unit: "mm2" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<DoseResult | null>(null);

  const reset = () => {
    setEnergy({ raw: "1", unit: "mJ" });
    setArea({ raw: "100", unit: "mm2" });
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const en = measurementToSI(energy);
    const ar = measurementToSI(area);
    const nextErrors: Record<string, string> = {};
    if (en === null) nextErrors.energy = "Enter a valid number.";
    if (ar === null) nextErrors.area = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = exposureDose({ energy: en!, area: ar! });
    if (!res.ok) {
      setErrors(res.field ? { [res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "dose-exposure", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "dose-exposure" });
  };

  // dose is in J/m²; 1 J/m² = 0.1 mJ/cm².
  const mJcm2 = result ? result.dose * 0.1 : 0;

  return (
    <CalculatorShell
      title="Exposure dose"
      description="Educational dose from exposure energy and exposed area: dose = energy / area."
      tier="mvp"
      trackSlug="dose-exposure"
      categoryLabel="Lithography"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Exposure dose" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Educational definition">
            This computes the simple definition dose = energy / area. Real lithography exposure and process control —
            dose, focus, uniformity, resist response — are far more complex.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Exposure energy" quantity="energy" value={energy} onChange={setEnergy} error={errors.energy} />
          <MeasurementField label="Exposed area" quantity="area" value={area} onChange={setArea} error={errors.area} help="100 mm² = 1 cm²." />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Dose", value: formatNumber(mJcm2), unit: "mJ/cm²", primary: true },
                  { label: "Dose", value: formatNumber(result.dose), unit: "J/m²" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Dose is the exposure energy delivered per unit area. In lithography it is usually quoted in{" "}
            <strong>mJ/cm²</strong>. Resists have a characteristic dose-to-clear, and the right dose (with focus) is
            what places feature sizes on target — but real dose control also depends on illumination uniformity, resist
            contrast, and feedback from metrology, which this simple ratio does not capture.
          </p>
        ) : (
          <p>Enter the exposure energy and the exposed area.</p>
        )
      }
      formula={{ expression: "dose = energy / area", label: "Exposure dose", caption: "Energy per unit area (commonly mJ/cm²)." }}
      variables={[
        { symbol: "dose", name: "Exposure dose", unit: "J/m² (shown as mJ/cm²)" },
        { symbol: "energy", name: "Exposure energy", unit: "J" },
        { symbol: "area", name: "Exposed area", unit: "m²" },
      ]}
      assumptions={[
        "Dose = energy ÷ area, assuming energy is spread uniformly over the area.",
        "Educational definition only — not a model of resist response or process control.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>energy = 1 mJ, area = 1 cm² (100 mm²).</p>
          <p className="font-mono text-xs text-muted-foreground">dose = 1 mJ / 1 cm² = 1 mJ/cm² (= 10 J/m²)</p>
        </div>
      }
      relatedConcepts={[
        { label: "Photolithography", href: "/semiconductors/learn/lithography" },
        { label: "Photoresist", href: "/semiconductors/learn/photoresist" },
      ]}
      relatedLessons={getSemiToolLearningLinks("dose-exposure")}
      relatedTools={getRelatedSemiToolLinks("dose-exposure")}
    />
  );
}
