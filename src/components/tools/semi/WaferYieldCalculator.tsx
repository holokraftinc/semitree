"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { Select } from "@/components/ui/Select";
import { NumberField } from "@/components/tools/calculator/NumberField";
import {
  MeasurementField,
  type MeasurementValue,
} from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { waferYield, type YieldModel, type YieldResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

const MODEL_OPTIONS = [
  { value: "poisson", label: "Poisson (Y = e^(−D·A))" },
  { value: "murphy", label: "Murphy" },
];

// Defect density entered in defects/cm²; convert to SI defects/m² (× 1e4).
const PER_CM2_TO_PER_M2 = 1e4;

export function WaferYieldCalculator() {
  const [model, setModel] = useState<YieldModel>("poisson");
  const [defectDensity, setDefectDensity] = useState("0.5");
  const [dieWidth, setDieWidth] = useState<MeasurementValue>({ raw: "10", unit: "mm" });
  const [dieHeight, setDieHeight] = useState<MeasurementValue>({ raw: "10", unit: "mm" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<YieldResult | null>(null);

  const reset = () => {
    setModel("poisson");
    setDefectDensity("0.5");
    setDieWidth({ raw: "10", unit: "mm" });
    setDieHeight({ raw: "10", unit: "mm" });
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseNumber(defectDensity);
    const w = measurementToSI(dieWidth);
    const h = measurementToSI(dieHeight);
    const nextErrors: Record<string, string> = {};
    if (d === null) nextErrors.defectDensity = "Enter a valid number.";
    if (w === null) nextErrors.dieWidth = "Enter a valid number.";
    if (h === null) nextErrors.dieHeight = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = waferYield({
      defectDensity: d! * PER_CM2_TO_PER_M2,
      dieArea: w! * h!,
      model,
    });
    if (!res.ok) {
      if (res.field === "defectDensity") setErrors({ defectDensity: res.error });
      else setFormError(res.error);
      setResult(null);
      track("calculation_error", { tool: "wafer-yield", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "wafer-yield" });
  };

  return (
    <CalculatorShell
      title="Wafer yield"
      description="Estimate the fraction of good dies from defect density (Poisson or Murphy model)."
      tier="mvp"
      trackSlug="wafer-yield"
      categoryLabel="Manufacturing"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Wafer yield" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <Select
            label="Yield model"
            options={MODEL_OPTIONS}
            value={model}
            onChange={(e) => {
              setModel(e.target.value as YieldModel);
              setResult(null);
            }}
          />
          <NumberField
            label="Defect density (D)"
            value={defectDensity}
            onChange={setDefectDensity}
            error={errors.defectDensity}
            suffix="defects/cm²"
            help="Fatal-defect density, e.g. 0.1–1 for a mature process."
          />
          <MeasurementField
            label="Die width"
            quantity="length"
            value={dieWidth}
            onChange={setDieWidth}
            error={errors.dieWidth}
          />
          <MeasurementField
            label="Die height"
            quantity="length"
            value={dieHeight}
            onChange={setDieHeight}
            error={errors.dieHeight}
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
                    label: "Yield",
                    value: formatNumber(result.yieldPercent),
                    unit: "%",
                    primary: true,
                  },
                  {
                    label: "Model",
                    value: result.model === "poisson" ? "Poisson" : "Murphy",
                  },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            This is the die yield — the fraction of dies expected to be free of
            fatal defects. Larger dies and higher defect density both drive it
            down sharply. The Poisson model assumes uniformly random defects and
            tends to be pessimistic for large dies; the Murphy model assumes a
            spread of defect densities across the wafer and is often closer to
            observed data. Multiply by the Die-per-wafer estimate to get good
            dies per wafer.
          </p>
        ) : (
          <p>
            Enter defect density and die size, then pick a model. Yield depends
            on the product D·A (defect density × die area).
          </p>
        )
      }
      formula={
        <div className="space-y-2 font-mono text-sm">
          <p>Poisson: Y = e^(−D·A)</p>
          <p>Murphy: Y = ((1 − e^(−D·A)) / (D·A))²</p>
        </div>
      }
      variables={[
        { symbol: "Y", name: "Die yield", unit: "fraction" },
        { symbol: "D", name: "Defect density", unit: "m⁻²" },
        { symbol: "A", name: "Die area (w × h)", unit: "m²" },
      ]}
      assumptions={[
        "A single fatal defect within the die area kills the die.",
        "Poisson: defects are random, independent, and uniformly distributed.",
        "Murphy: accounts for non-uniform defect distribution across the wafer.",
        "Only random defect limited yield — no systematic/parametric loss.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>D = 0.5 defects/cm², die 10 mm × 10 mm (A = 1 cm²) → D·A = 0.5.</p>
          <p className="font-mono text-xs text-muted-foreground">
            Poisson: Y = e^(−0.5) ≈ 0.607 → 60.7%
          </p>
        </div>
      }
      relatedConcepts={[
        { label: "Wafer test", href: "/semiconductors/learn/wafer-test" },
        { label: "Metrology & inspection", href: "/semiconductors/learn/metrology" },
      ]}
      relatedLessons={[
        { label: "Final test", href: "/semiconductors/learn/final-test" },
        { label: "Lithography", href: "/semiconductors/learn/lithography" },
      ]}
      relatedTools={[
        ...getRelatedSemiToolLinks("wafer-yield"),
        { label: "Explore semiconductor companies", href: "/industry" },
      ]}
    />
  );
}
