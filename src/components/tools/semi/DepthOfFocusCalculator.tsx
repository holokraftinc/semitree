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
import { lithoDepthOfFocus, type DepthOfFocusResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

export function DepthOfFocusCalculator() {
  const [wavelength, setWavelength] = useState<MeasurementValue>({ raw: "193", unit: "nm" });
  const [na, setNa] = useState("1.35");
  const [k2, setK2] = useState("0.5");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<DepthOfFocusResult | null>(null);

  const reset = () => {
    setWavelength({ raw: "193", unit: "nm" });
    setNa("1.35");
    setK2("0.5");
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lambda = measurementToSI(wavelength);
    const naN = parseNumber(na);
    const k2N = parseNumber(k2);
    const nextErrors: Record<string, string> = {};
    if (lambda === null) nextErrors.wavelength = "Enter a valid number.";
    if (naN === null) nextErrors.na = "Enter a valid number.";
    if (k2N === null) nextErrors.k2 = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = lithoDepthOfFocus({ wavelength: lambda!, numericalAperture: naN!, k2: k2N! });
    if (!res.ok) {
      setErrors(res.field ? { [res.field === "numericalAperture" ? "na" : res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "depth-of-focus", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "depth-of-focus" });
  };

  const numField = (id: string, label: string, value: string, onChange: (v: string) => void, error?: string, help?: string) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
      <input id={id} type="number" inputMode="decimal" step="any" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} className={cn(fieldBase, "w-full")} />
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );

  return (
    <CalculatorShell
      title="Depth of focus"
      description="Estimate focus tolerance with DOF = k₂·λ/NA² — and see the resolution trade-off."
      tier="mvp"
      trackSlug="depth-of-focus"
      categoryLabel="Lithography"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Depth of focus" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Educational / theoretical estimate">
            A first-order scalar estimate. Real usable focus is smaller once wafer flatness, topography, and process
            effects are included.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Wavelength (λ)" quantity="length" value={wavelength} onChange={setWavelength} error={errors.wavelength} />
          {numField("dof-na", "Numerical aperture (NA)", na, setNa, errors.na, "Dimensionless.")}
          {numField("dof-k2", "Process factor (k₂)", k2, setK2, errors.k2, "Dimensionless, order ~0.5.")}
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={result ? [{ label: "Estimated depth of focus", value: formatNumber(result.depthOfFocus * 1e9), unit: "nm", primary: true }] : []}
        />
      }
      interpretation={
        result ? (
          <p>
            Depth of focus is how far the wafer can move from best focus before the image degrades. Because NA is
            squared, pushing NA up to improve resolution shrinks DOF sharply — this is the core resolution-vs-focus
            trade-off. The usable <strong>process window</strong> is the overlap of focus and exposure latitude, so a
            large DOF makes a process far more robust.
          </p>
        ) : (
          <p>Enter a wavelength, numerical aperture, and k₂ factor.</p>
        )
      }
      formula={{ expression: "DOF = k₂ · λ / NA²", label: "Depth of focus", caption: "Educational, scalar estimate." }}
      variables={[
        { symbol: "DOF", name: "Depth of focus", unit: "m (shown as nm)" },
        { symbol: "k₂", name: "Process factor", unit: "dimensionless" },
        { symbol: "λ", name: "Exposure wavelength", unit: "m" },
        { symbol: "NA", name: "Numerical aperture", unit: "dimensionless" },
      ]}
      assumptions={[
        "DOF = k₂·λ/NA² — first-order scalar optics only.",
        "NA appears squared, so focus margin falls fast as NA rises.",
        "Real usable focus is reduced by wafer non-flatness and topography.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>λ = 193 nm, NA = 1.35, k₂ = 0.5.</p>
          <p className="font-mono text-xs text-muted-foreground">DOF = 0.5 × 193 nm / 1.35² ≈ 53 nm</p>
        </div>
      }
      relatedConcepts={[
        { label: "Photolithography", href: "/semiconductors/learn/lithography" },
        { label: "Metrology & inspection", href: "/semiconductors/learn/metrology" },
      ]}
      relatedLessons={getSemiToolLearningLinks("depth-of-focus")}
      relatedTools={getRelatedSemiToolLinks("depth-of-focus")}
    />
  );
}
