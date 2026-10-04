"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { fieldBase } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { resistivityFromConductivity, type ResistivityResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

export function ResistivityCalculator() {
  const [sigma, setSigma] = useState("100");
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<ResistivityResult | null>(null);

  const reset = () => {
    setSigma("100");
    setError(undefined);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const s = parseNumber(sigma);
    if (s === null) {
      setError("Enter a valid number.");
      setResult(null);
      return;
    }
    const res = resistivityFromConductivity({ conductivity: s });
    if (!res.ok) {
      setError(res.error);
      setResult(null);
      track("calculation_error", { tool: "resistivity", field: res.field });
      return;
    }
    setError(undefined);
    setResult(res.value);
    track("calculation_completed", { tool: "resistivity" });
  };

  return (
    <CalculatorShell
      title="Resistivity"
      description="Resistivity is the reciprocal of conductivity. It feeds directly into sheet resistance."
      tier="mvp"
      trackSlug="resistivity"
      categoryLabel="Doping"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Resistivity" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="rho-sigma" className="block text-sm font-medium text-foreground">Conductivity (σ)</label>
            <div className="flex items-center gap-2">
              <input id="rho-sigma" type="number" inputMode="decimal" step="any" value={sigma} onChange={(e) => setSigma(e.target.value)} aria-invalid={Boolean(error)} className={cn(fieldBase, "w-full")} />
              <span className="shrink-0 text-sm text-muted-foreground">S/m</span>
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
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
                  { label: "Resistivity", value: formatNumber(result.resistivity), unit: "Ω·m", primary: true },
                  { label: "Resistivity", value: formatNumber(result.resistivity * 100), unit: "Ω·cm" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Resistivity ρ = 1/σ is a material property — how strongly a material opposes current, independent of shape.
            For a thin film of thickness t it sets the <strong>sheet resistance</strong> Rs = ρ/t, the quantity fabs use
            to monitor doped layers and films. Lower resistivity (heavier doping) means a more conductive layer.
          </p>
        ) : (
          <p>Enter a conductivity to get the resistivity.</p>
        )
      }
      formula={{ expression: "ρ = 1 / σ", label: "Resistivity", caption: "Reciprocal of conductivity." }}
      variables={[
        { symbol: "ρ", name: "Resistivity", unit: "Ω·m (shown as Ω·cm too)" },
        { symbol: "σ", name: "Conductivity", unit: "S/m" },
      ]}
      assumptions={["Uniform, isotropic material.", "Resistivity is the inverse of conductivity at the same conditions."]}
      workedExample={
        <div className="space-y-2">
          <p>σ = 100 S/m.</p>
          <p className="font-mono text-xs text-muted-foreground">ρ = 1 / 100 = 0.01 Ω·m = 1 Ω·cm</p>
        </div>
      }
      relatedConcepts={[
        { label: "Doping", href: "/semiconductors/learn/ion-implantation" },
        { label: "Metrology & inspection", href: "/semiconductors/learn/metrology" },
      ]}
      relatedLessons={getSemiToolLearningLinks("resistivity")}
      relatedTools={getRelatedSemiToolLinks("resistivity")}
    />
  );
}
