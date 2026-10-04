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
import { lithoResolution, type ResolutionResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

export function LithoResolutionCalculator() {
  const [wavelength, setWavelength] = useState<MeasurementValue>({ raw: "193", unit: "nm" });
  const [na, setNa] = useState("1.35");
  const [k1, setK1] = useState("0.28");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<ResolutionResult | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const reset = () => {
    setWavelength({ raw: "193", unit: "nm" });
    setNa("1.35");
    setK1("0.28");
    setErrors({});
    setFormError(null);
    setResult(null);
    setWarnings([]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lambda = measurementToSI(wavelength);
    const naN = parseNumber(na);
    const k1N = parseNumber(k1);
    const nextErrors: Record<string, string> = {};
    if (lambda === null) nextErrors.wavelength = "Enter a valid number.";
    if (naN === null) nextErrors.na = "Enter a valid number.";
    if (k1N === null) nextErrors.k1 = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      setWarnings([]);
      return;
    }
    const res = lithoResolution({ wavelength: lambda!, numericalAperture: naN!, k1: k1N! });
    if (!res.ok) {
      setErrors(res.field ? { [res.field === "numericalAperture" ? "na" : res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      setWarnings([]);
      track("calculation_error", { tool: "litho-resolution", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    setWarnings(res.warnings);
    track("calculation_completed", { tool: "litho-resolution" });
  };

  const numField = (
    id: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
    error?: string,
    help?: string,
  ) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
      <input id={id} type="number" inputMode="decimal" step="any" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} className={cn(fieldBase, "w-full")} />
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );

  return (
    <CalculatorShell
      title="Lithography resolution"
      description="Estimate the smallest printable feature with the Rayleigh criterion R = k₁·λ/NA."
      tier="mvp"
      trackSlug="litho-resolution"
      categoryLabel="Lithography"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Lithography resolution" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Educational / theoretical estimate">
            This uses the first-order Rayleigh relationship only. Real manufacturing resolution depends on
            illumination, resist, mask correction (OPC), process window, and much more.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Wavelength (λ)" quantity="length" value={wavelength} onChange={setWavelength} error={errors.wavelength} />
          {numField("lr-na", "Numerical aperture (NA)", na, setNa, errors.na, "Dimensionless. e.g. 1.35 (immersion DUV), 0.33 (EUV).")}
          {numField("lr-k1", "Process factor (k₁)", k1, setK1, errors.k1, "Dimensionless. Single-exposure floor ≈ 0.25.")}
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Estimated resolution", value: formatNumber(result.resolution * 1e9), unit: "nm", primary: true },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <div className="space-y-2">
            {warnings.map((w, i) => (
              <Alert key={i} variant="warning" title="Note">{w}</Alert>
            ))}
            <p>
              Resolution improves (smaller number) with shorter wavelength λ, higher numerical aperture NA, and a
              lower process factor k₁. It is a theoretical limit, not a guarantee of manufacturability — reaching a
              resolution once is not the same as centring a wide process window on it.
            </p>
          </div>
        ) : (
          <p>Enter a wavelength, numerical aperture, and k₁ factor.</p>
        )
      }
      formula={{ expression: "R = k₁ · λ / NA", label: "Rayleigh criterion", caption: "Educational, theoretical estimate." }}
      variables={[
        { symbol: "R", name: "Resolution (min. half-pitch)", unit: "m (shown as nm)" },
        { symbol: "k₁", name: "Process factor", unit: "dimensionless" },
        { symbol: "λ", name: "Exposure wavelength", unit: "m" },
        { symbol: "NA", name: "Numerical aperture", unit: "dimensionless" },
      ]}
      assumptions={[
        "Rayleigh criterion R = k₁·λ/NA — first-order optics only.",
        "k₁ bundles illumination, resist, and mask effects; single-exposure floor ≈ 0.25.",
        "Does not model process window, resist chemistry, mask correction, or metrology.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>λ = 193 nm, NA = 1.35, k₁ = 0.28.</p>
          <p className="font-mono text-xs text-muted-foreground">R = 0.28 × 193 nm / 1.35 ≈ 40 nm</p>
        </div>
      }
      relatedConcepts={[
        { label: "Photolithography", href: "/semiconductors/learn/lithography" },
        { label: "Photoresist", href: "/semiconductors/learn/photoresist" },
        { label: "Metrology & inspection", href: "/semiconductors/learn/metrology" },
      ]}
      relatedLessons={getSemiToolLearningLinks("litho-resolution")}
      relatedTools={getRelatedSemiToolLinks("litho-resolution")}
    />
  );
}
