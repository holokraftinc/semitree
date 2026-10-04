"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { Q } from "@/lib/calculations/semi/constants";
import { formatNumber } from "@/lib/utils/format";

export function MobilityConductivityExplorer() {
  const [conc, setConc] = useState<MeasurementValue>({ raw: "1e16", unit: "per_cm3" });
  const [mobility, setMobility] = useState<MeasurementValue>({ raw: "1400", unit: "cm2_Vs" });

  const reset = () => { setConc({ raw: "1e16", unit: "per_cm3" }); setMobility({ raw: "1400", unit: "cm2_Vs" }); };

  const nSI = measurementToSI(conc); // m^-3
  const muSI = measurementToSI(mobility); // m²/Vs
  const valid = nSI !== null && nSI > 0 && muSI !== null && muSI > 0;
  const sigma = valid ? Q * nSI! * muSI! : null; // S/m

  const curve = useMemo(() => {
    if (!valid) return [];
    const muMax = muSI! * 2;
    const pts: { mu: number; s: number }[] = [];
    for (let k = 0; k <= 40; k++) {
      const mu = (muMax * k) / 40;
      pts.push({ mu, s: Q * nSI! * mu });
    }
    return pts;
  }, [valid, nSI, muSI]);

  const sMax = curve.length ? curve[curve.length - 1].s : 1;
  const muMax = muSI ? muSI * 2 : 1;
  const W = 360, H = 190, PAD = { l: 50, r: 12, t: 12, b: 32 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const px = (mu: number) => PAD.l + (mu / muMax) * pw;
  const py = (s: number) => PAD.t + (1 - s / (sMax || 1)) * ph;
  const path = curve.map((p, k) => `${k === 0 ? "M" : "L"}${px(p.mu).toFixed(1)} ${py(p.s).toFixed(1)}`).join(" ");

  return (
    <CalculatorShell
      title="Mobility / conductivity explorer"
      description="How conductivity scales with carrier concentration and mobility, σ = q·n·μ (single carrier)."
      tier="mvp"
      trackSlug="mobility-conductivity-explorer"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Mobility / conductivity explorer" },
      ]}
      inputs={
        <div className="space-y-4">
          <Alert variant="info" title="Single-carrier, constant-mobility model">
            σ = q·n·μ for one carrier type with mobility treated as constant. Real mobility falls at high doping and
            high field; this is an educational linear relationship.
          </Alert>
          <MeasurementField label="Carrier concentration (n)" quantity="concentration" value={conc} onChange={setConc} />
          <MeasurementField label="Mobility (μ)" quantity="mobility" value={mobility} onChange={setMobility} />
          <div><Button type="button" variant="outline" onClick={reset}>Reset</Button></div>
        </div>
      }
      result={
        valid && sigma !== null ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Conductivity</p>
              <p className="mt-1 text-2xl font-semibold text-brand">{formatNumber(sigma / 100)} S/cm</p>
              <p className="text-xs text-muted-foreground">{formatNumber(sigma)} S/m · ρ = {formatNumber((1 / sigma) * 100)} Ω·cm</p>
            </div>
            <figure className="rounded-lg border border-border bg-muted/30 p-4">
              <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full" role="img" aria-label="Conductivity rising linearly with mobility at fixed carrier concentration.">
                <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
                <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
                <path d={path} className="fill-none stroke-brand" strokeWidth="2" />
                {muSI !== null && <circle cx={px(muSI)} cy={py(sigma)} r="4" className="fill-brand" />}
                <text x={(PAD.l + W - PAD.r) / 2} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[10px]">Mobility →</text>
                <text x={12} y={(PAD.t + H - PAD.b) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(PAD.t + H - PAD.b) / 2})`} className="fill-muted-foreground text-[10px]">σ →</text>
              </svg>
              <figcaption className="mt-2 text-center text-xs text-muted-foreground">At fixed carrier concentration, σ is linear in mobility; the dot marks your value.</figcaption>
            </figure>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Enter a positive carrier concentration and mobility.</p>
        )
      }
      interpretation={
        <p>
          Conductivity is the product of charge, carrier concentration, and mobility (σ = q·n·μ). Doping raises n and
          thus σ; mobility sets how freely those carriers move. Because electrons are usually more mobile than holes,
          n-type material of the same doping conducts somewhat better. In reality mobility itself drops at very high
          doping, so σ rises less than linearly there.
        </p>
      }
      formula={{ expression: "σ = q · n · μ", label: "Conductivity (single carrier)", caption: "q = elementary charge." }}
      variables={[
        { symbol: "σ", name: "Conductivity", unit: "S/m (shown as S/cm)" },
        { symbol: "n", name: "Carrier concentration", unit: "m⁻³" },
        { symbol: "μ", name: "Carrier mobility", unit: "m²/(V·s)" },
      ]}
      assumptions={["Single carrier type; constant mobility.", "Ignores high-doping and high-field mobility degradation."]}
      workedExample={
        <div className="space-y-2">
          <p>n = 1×10¹⁶ cm⁻³, μ = 1400 cm²/(V·s).</p>
          <p className="font-mono text-xs text-muted-foreground">σ = q·n·μ ≈ 0.22 S/m (≈ 0.0022 S/cm)</p>
        </div>
      }
      relatedConcepts={[{ label: "Doping", href: "/semiconductors/learn/ion-implantation" }]}
      relatedLessons={getSemiToolLearningLinks("mobility-conductivity-explorer")}
      relatedTools={getRelatedSemiToolLinks("mobility-conductivity-explorer")}
    />
  );
}
