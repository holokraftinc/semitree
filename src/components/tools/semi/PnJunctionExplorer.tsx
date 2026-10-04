"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";

export function PnJunctionExplorer() {
  const [na, setNa] = useState<MeasurementValue>({ raw: "1e16", unit: "per_cm3" });
  const [nd, setNd] = useState<MeasurementValue>({ raw: "1e16", unit: "per_cm3" });

  const reset = () => {
    setNa({ raw: "1e16", unit: "per_cm3" });
    setNd({ raw: "1e16", unit: "per_cm3" });
  };

  const Na = measurementToSI(na);
  const Nd = measurementToSI(nd);
  const valid = Na !== null && Na > 0 && Nd !== null && Nd > 0;

  // Qualitative depletion model (fixed built-in potential):
  //   total width ∝ √(1/Na + 1/Nd); charge balance gives xp/xn = Nd/Na.
  // Normalise against a reference so the bar scales sensibly on screen.
  const REF = 1e22; // m^-3 reference for width scaling
  let depletionPct = 0; // % of the bar used by depletion
  let xpShare = 0.5; // fraction of depletion on the P side
  if (valid) {
    const widthRel = Math.sqrt(1 / Na! + 1 / Nd!) / Math.sqrt(2 / REF); // ~1 at Na=Nd=REF
    depletionPct = Math.max(6, Math.min(70, widthRel * 20)); // clamp for display
    xpShare = Nd! / (Na! + Nd!); // depletion penetrates the lightly-doped side more
  }
  const neutralPct = (100 - depletionPct) / 2;
  const xpPct = depletionPct * xpShare;
  const xnPct = depletionPct * (1 - xpShare);

  const result = valid ? (
    <div className="space-y-4">
      <figure className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex h-24 w-full overflow-hidden rounded-md border border-border text-[10px] font-medium">
          <div className="flex items-center justify-center bg-warning/30 text-foreground" style={{ width: `${neutralPct}%` }}>P</div>
          <div className="flex items-center justify-center bg-muted text-muted-foreground" style={{ width: `${xpPct}%` }} title="Depletion (P side)" />
          <div className="flex items-center justify-center bg-muted text-muted-foreground" style={{ width: `${xnPct}%` }} title="Depletion (N side)" />
          <div className="flex items-center justify-center bg-info/30 text-foreground" style={{ width: `${neutralPct}%` }}>N</div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-warning/30" /> P region</span>
          <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-muted" /> Depletion region</span>
          <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-info/30" /> N region</span>
        </div>
        <figcaption className="mt-3 text-center text-xs text-muted-foreground">
          Qualitative view — the depletion region is carrier-free; widths are relative, not to scale.
        </figcaption>
      </figure>
    </div>
  ) : (
    <p className="text-sm text-muted-foreground">Enter positive acceptor and donor concentrations.</p>
  );

  const lighter = valid ? (Na! < Nd! ? "P" : Na! > Nd! ? "N" : null) : null;

  return (
    <CalculatorShell
      title="PN junction explorer"
      description="See conceptually how the depletion region of a PN junction changes as you vary the doping on each side."
      tier="mvp"
      trackSlug="pn-junction-explorer"
      categoryLabel="Doping"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "PN junction explorer" },
      ]}
      inputs={
        <div className="space-y-4">
          <Alert variant="info" title="Qualitative — not to scale">
            This shows trends only (how the depletion region grows, shrinks, and shifts with doping). It does not
            compute an exact depletion width, which also depends on the junction voltage.
          </Alert>
          <MeasurementField label="Acceptor doping (Nₐ, P side)" quantity="concentration" value={na} onChange={setNa} />
          <MeasurementField label="Donor doping (N_d, N side)" quantity="concentration" value={nd} onChange={setNd} />
          <div><Button type="button" variant="outline" onClick={reset}>Reset</Button></div>
        </div>
      }
      result={result}
      interpretation={
        <p>
          Where P meets N, carriers recombine and leave a carrier-free <strong>depletion region</strong>. Two trends:
          (1) heavier doping on both sides makes the depletion region <strong>narrower</strong>; (2) the depletion
          extends <strong>further into the more lightly-doped side</strong> (charge balance means Nₐ·xₚ = N_d·xₙ).
          {lighter && <> Here the {lighter} side is more lightly doped, so the depletion reaches further into it.</>}
          {valid && Na === Nd && <> With equal doping the depletion is symmetric.</>}
        </p>
      }
      formula={{ expression: "Nₐ·xₚ = N_d·xₙ  ·  W ∝ √(1/Nₐ + 1/N_d)", label: "Depletion (qualitative)", caption: "Trends only; exact width also needs the junction voltage." }}
      variables={[
        { symbol: "Nₐ", name: "Acceptor (P-side) doping", unit: "m⁻³" },
        { symbol: "N_d", name: "Donor (N-side) doping", unit: "m⁻³" },
        { symbol: "xₚ, xₙ", name: "Depletion widths into P and N", unit: "m (relative here)" },
        { symbol: "W", name: "Total depletion width", unit: "m (relative here)" },
      ]}
      assumptions={[
        "Abrupt junction; qualitative trends only.",
        "Widths are relative/illustrative, not computed in absolute units.",
        "Ignores applied bias; the real width also depends on the junction voltage.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>Make Nₐ ≪ N_d (lightly-doped P side).</p>
          <p className="text-xs text-muted-foreground">The depletion region widens and reaches much further into the P side.</p>
        </div>
      }
      relatedConcepts={[
        { label: "PN junction", href: "/semiconductors/learn/pn-junction" },
        { label: "Doping", href: "/semiconductors/learn/ion-implantation" },
      ]}
      relatedLessons={getSemiToolLearningLinks("pn-junction-explorer")}
      relatedTools={getRelatedSemiToolLinks("pn-junction-explorer")}
    />
  );
}
