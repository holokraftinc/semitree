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
import { EPS_OX } from "@/lib/calculations/semi/constants";
import { formatNumber } from "@/lib/utils/format";

const REGIONS = [
  { name: "Accumulation", detail: "Gate bias attracts majority carriers to the surface; capacitance ≈ the full oxide capacitance Cox." },
  { name: "Depletion", detail: "Opposite bias pushes majority carriers away, growing a depletion layer in series with the oxide; total capacitance falls below Cox." },
  { name: "Inversion", detail: "Strong bias forms a minority-carrier channel at the surface — the condition a MOSFET turns on in." },
];

export function MosCapacitorExplorer() {
  const [tox, setTox] = useState<MeasurementValue>({ raw: "5", unit: "nm" });
  const [error, setError] = useState<string | undefined>();
  const [cox, setCox] = useState<number | null>(null);

  const reset = () => { setTox({ raw: "5", unit: "nm" }); setError(undefined); setCox(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = measurementToSI(tox);
    if (t === null || t <= 0) { setError("Enter a positive oxide thickness."); setCox(null); return; }
    setError(undefined); setCox(EPS_OX / t); track("calculation_completed", { tool: "mos-capacitor-explorer" });
  };

  return (
    <CalculatorShell
      title="MOS capacitor explorer"
      description="The oxide capacitance of a MOS stack (Cox = εox/tox) and the accumulation, depletion, and inversion regions."
      tier="mvp"
      trackSlug="mos-capacitor-explorer"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "MOS capacitor explorer" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Educational model">
            Computes the oxide capacitance per unit area for an SiO₂ gate dielectric and summarizes the bias regions. It
            does not compute a full C–V curve or model high-k dielectrics, poly depletion, or quantum effects.
          </Alert>
          <MeasurementField label="Oxide thickness (tox)" quantity="length" value={tox} onChange={setTox} error={error} help="Gate-dielectric thickness (SiO₂ assumed, εr ≈ 3.9)." />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            cox !== null
              ? [
                  { label: "Oxide capacitance (Cox)", value: formatNumber(cox * 1e3), unit: "mF/m²", primary: true },
                  { label: "Oxide capacitance (Cox)", value: formatNumber(cox / 1e4 * 1e9), unit: "nF/cm²" },
                ]
              : []
          }
        />
      }
      interpretation={
        <div className="space-y-3">
          <p>
            The oxide capacitance Cox = εox/tox is the maximum capacitance of the MOS stack (reached in accumulation). A
            thinner oxide gives a larger Cox, which gives the gate stronger control over the channel — the main reason
            gate oxides were scaled aggressively (and why high-k dielectrics were introduced to keep Cox high without an
            impractically thin film).
          </p>
          <div className="space-y-2">
            {REGIONS.map((r) => (
              <div key={r.name} className="rounded-lg border border-border bg-card p-3">
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{r.detail}</p>
              </div>
            ))}
          </div>
        </div>
      }
      formula={{ expression: "Cox = εox / tox", label: "Oxide capacitance", caption: "Per unit area; εox ≈ 3.9·ε₀ for SiO₂." }}
      variables={[
        { symbol: "Cox", name: "Oxide capacitance per area", unit: "F/m²" },
        { symbol: "εox", name: "Oxide permittivity", unit: "F/m (≈ 3.9·ε₀)" },
        { symbol: "tox", name: "Oxide thickness", unit: "m" },
      ]}
      assumptions={[
        "SiO₂ gate dielectric (εr ≈ 3.9); Cox is per unit area.",
        "Educational — no full C–V curve, high-k, poly depletion, or quantum effects.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>tox = 5 nm (SiO₂).</p>
          <p className="font-mono text-xs text-muted-foreground">Cox = 3.9·ε₀ / 5 nm ≈ 6.9 mF/m² (≈ 0.69 µF/cm²)</p>
        </div>
      }
      relatedConcepts={[{ label: "MOSFET", href: "/semiconductors/learn/mosfet" }]}
      relatedLessons={getSemiToolLearningLinks("mos-capacitor-explorer")}
      relatedTools={getRelatedSemiToolLinks("mos-capacitor-explorer")}
    />
  );
}
