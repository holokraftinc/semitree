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
import { implantTotalIons, type ImplantDoseResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

export function ImplantDoseCalculator() {
  const [dose, setDose] = useState("1e14"); // ions/cm²
  const [area, setArea] = useState<MeasurementValue>({ raw: "1", unit: "mm2" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<ImplantDoseResult | null>(null);

  const reset = () => {
    setDose("1e14");
    setArea({ raw: "1", unit: "mm2" });
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dosePerCm2 = parseNumber(dose);
    const areaM2 = measurementToSI(area);
    const nextErrors: Record<string, string> = {};
    if (dosePerCm2 === null) nextErrors.dose = "Enter a valid number.";
    if (areaM2 === null) nextErrors.area = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    // dose in ions/cm² → ions/m² (×1e4).
    const res = implantTotalIons({ dose: dosePerCm2! * 1e4, area: areaM2! });
    if (!res.ok) {
      setErrors(res.field === "dose" ? { dose: res.error } : res.field === "area" ? { area: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "implant-dose", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "implant-dose" });
  };

  return (
    <CalculatorShell
      title="Implant dose (educational)"
      description="Estimate the total number of implanted ions from an areal dose and an exposed area."
      tier="mvp"
      trackSlug="implant-dose"
      categoryLabel="Doping"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Implant dose" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Educational only">
            This is the simple definition dose = ions per unit area. It gives no implant energy, depth, profile, or any
            operational implantation settings.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <div className="space-y-1.5">
            <label htmlFor="id-dose" className="block text-sm font-medium text-foreground">Dose</label>
            <div className="flex items-center gap-2">
              <input id="id-dose" type="number" inputMode="decimal" step="any" value={dose} onChange={(e) => setDose(e.target.value)} aria-invalid={Boolean(errors.dose)} className={cn(fieldBase, "w-full")} />
              <span className="shrink-0 text-sm text-muted-foreground">ions/cm²</span>
            </div>
            {errors.dose && <p className="text-sm text-danger">{errors.dose}</p>}
          </div>
          <MeasurementField label="Exposed area" quantity="area" value={area} onChange={setArea} error={errors.area} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={result ? [{ label: "Total implanted ions", value: formatNumber(result.totalIons), unit: "ions", primary: true }] : []}
        />
      }
      interpretation={
        result ? (
          <p>
            Dose is the number of ions delivered per unit area; multiplying by the exposed area gives the total ions
            implanted. Dose is the main knob for how heavily a region is doped — but the resulting depth and profile
            depend on ion energy and species, which this educational tool does not model.
          </p>
        ) : (
          <p>Enter an areal dose (ions/cm²) and the exposed area.</p>
        )
      }
      formula={{ expression: "total ions = dose × area", label: "Implant dose", caption: "Dose is ions per unit area." }}
      variables={[
        { symbol: "total ions", name: "Total implanted ions", unit: "count" },
        { symbol: "dose", name: "Areal dose", unit: "ions/m² (entered as ions/cm²)" },
        { symbol: "area", name: "Exposed area", unit: "m²" },
      ]}
      assumptions={["Uniform dose over the exposed area.", "Educational — no energy, depth, or profile modelled."]}
      workedExample={
        <div className="space-y-2">
          <p>dose = 1×10¹⁴ ions/cm², area = 1 mm² (= 0.01 cm²).</p>
          <p className="font-mono text-xs text-muted-foreground">total = 1×10¹⁴ × 0.01 = 1×10¹² ions</p>
        </div>
      }
      relatedConcepts={[{ label: "Doping", href: "/semiconductors/learn/ion-implantation" }]}
      relatedLessons={getSemiToolLearningLinks("implant-dose")}
      relatedTools={getRelatedSemiToolLinks("implant-dose")}
    />
  );
}
