"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { fieldBase } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { varshniBandgap } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

// Standard Varshni parameters (Eg0 in eV, alpha in eV/K, beta in K).
const MATERIALS = {
  Si: { label: "Silicon (Si)", eg0: 1.17, alpha: 4.73e-4, beta: 636 },
  Ge: { label: "Germanium (Ge)", eg0: 0.7437, alpha: 4.77e-4, beta: 235 },
  GaAs: { label: "Gallium arsenide (GaAs)", eg0: 1.519, alpha: 5.405e-4, beta: 204 },
} as const;
type MatKey = keyof typeof MATERIALS;

const TMAX = 500;

export function BandgapExplorer() {
  const [mat, setMat] = useState<MatKey>("Si");
  const [temp, setTemp] = useState("300"); // K

  const reset = () => { setMat("Si"); setTemp("300"); };

  const m = MATERIALS[mat];
  const T = parseNumber(temp);
  const valid = T !== null && T >= 0;
  const egNow = valid ? varshniBandgap({ ...m, temperature: T! }) : null;

  const curve = useMemo(() => {
    const pts: { t: number; eg: number }[] = [];
    for (let k = 0; k <= 50; k++) {
      const t = (TMAX * k) / 50;
      const r = varshniBandgap({ ...m, temperature: t });
      if (r.ok) pts.push({ t, eg: r.value.bandgap });
    }
    return pts;
  }, [m]);

  const egVals = curve.map((p) => p.eg);
  const egHi = Math.max(...egVals, 0.1);
  const egLo = Math.min(...egVals, egHi - 0.01);
  const W = 360, H = 200, PAD = { l: 48, r: 12, t: 12, b: 32 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const px = (t: number) => PAD.l + (t / TMAX) * pw;
  const py = (eg: number) => PAD.t + (1 - (eg - egLo) / (egHi - egLo || 1)) * ph;
  const path = curve.map((p, k) => `${k === 0 ? "M" : "L"}${px(p.t).toFixed(1)} ${py(p.eg).toFixed(1)}`).join(" ");
  const markerX = valid && T! <= TMAX ? px(T!) : null;

  return (
    <CalculatorShell
      title="Bandgap energy explorer"
      description="How a semiconductor's bandgap shrinks with temperature, via the empirical Varshni relation."
      tier="mvp"
      trackSlug="bandgap-explorer"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Bandgap energy explorer" },
      ]}
      inputs={
        <div className="space-y-4">
          <Alert variant="info" title="Empirical Varshni fit">
            Uses Eg(T) = Eg(0) − αT²/(T+β) with standard published parameters. It is an empirical fit valid over a limited
            temperature range, not a first-principles calculation.
          </Alert>
          <div className="space-y-1.5">
            <label htmlFor="bg-mat" className="block text-sm font-medium text-foreground">Material</label>
            <select id="bg-mat" value={mat} onChange={(e) => setMat(e.target.value as MatKey)} className={cn(fieldBase, "w-full")}>
              {(Object.keys(MATERIALS) as MatKey[]).map((k) => (
                <option key={k} value={k}>{MATERIALS[k].label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="bg-t" className="block text-sm font-medium text-foreground">Temperature: {temp} K</label>
            <input id="bg-t" type="range" min={0} max={TMAX} step={5} value={valid ? T! : 300} onChange={(e) => setTemp(e.target.value)} className="w-full accent-brand" />
          </div>
          <div><Button type="button" variant="outline" onClick={reset}>Reset</Button></div>
        </div>
      }
      result={
        valid ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">{m.label} bandgap at {formatNumber(T!)} K</p>
              <p className="mt-1 text-2xl font-semibold text-brand">{egNow && egNow.ok ? formatNumber(egNow.value.bandgap, 4) : "—"} eV</p>
            </div>
            <figure className="rounded-lg border border-border bg-muted/30 p-4">
              <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full" role="img" aria-label={`Bandgap of ${m.label} decreasing with temperature.`}>
                <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
                <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
                <path d={path} className="fill-none stroke-brand" strokeWidth="2" />
                {markerX !== null && egNow && egNow.ok && (
                  <circle cx={markerX} cy={py(egNow.value.bandgap)} r="4" className="fill-brand" />
                )}
                <text x={PAD.l} y={H - PAD.b + 18} className="fill-muted-foreground text-[9px]">0</text>
                <text x={W - PAD.r} y={H - PAD.b + 18} textAnchor="end" className="fill-muted-foreground text-[9px]">{TMAX} K</text>
                <text x={(PAD.l + W - PAD.r) / 2} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[10px]">Temperature</text>
                <text x={PAD.l - 6} y={PAD.t + 6} textAnchor="end" className="fill-muted-foreground text-[9px]">{formatNumber(egHi, 3)}</text>
                <text x={PAD.l - 6} y={H - PAD.b} textAnchor="end" className="fill-muted-foreground text-[9px]">{formatNumber(egLo, 3)}</text>
                <text x={12} y={(PAD.t + H - PAD.b) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(PAD.t + H - PAD.b) / 2})`} className="fill-muted-foreground text-[10px]">Eg (eV)</text>
              </svg>
              <figcaption className="mt-2 text-center text-xs text-muted-foreground">Bandgap falls as temperature rises.</figcaption>
            </figure>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Enter a non-negative temperature.</p>
        )
      }
      interpretation={
        <p>
          A semiconductor&rsquo;s bandgap narrows as temperature rises, because the lattice expands and electron–phonon
          interactions grow. The Varshni fit captures this with three material-specific constants. A smaller bandgap at
          higher temperature is part of why intrinsic carrier concentration — and leakage — climb with temperature.
        </p>
      }
      formula={{ expression: "Eg(T) = Eg(0) − α·T² / (T + β)", label: "Varshni relation", caption: "Empirical; α and β are material-specific." }}
      variables={[
        { symbol: "Eg(T)", name: "Bandgap at temperature T", unit: "eV" },
        { symbol: "Eg(0)", name: "Bandgap at 0 K", unit: "eV" },
        { symbol: "α", name: "Varshni α parameter", unit: "eV/K" },
        { symbol: "β", name: "Varshni β parameter", unit: "K" },
        { symbol: "T", name: "Temperature", unit: "K" },
      ]}
      assumptions={[
        "Empirical Varshni fit with standard published parameters.",
        "Valid over a limited temperature range; not a first-principles result.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>Silicon at 300 K (Eg0 = 1.17 eV, α = 4.73×10⁻⁴, β = 636).</p>
          <p className="font-mono text-xs text-muted-foreground">Eg ≈ 1.17 − 4.73e-4·300²/(300+636) ≈ 1.12 eV</p>
        </div>
      }
      relatedConcepts={[{ label: "Bandgap", href: "/semiconductors/learn/bandgap" }]}
      relatedLessons={getSemiToolLearningLinks("bandgap-explorer")}
      relatedTools={getRelatedSemiToolLinks("bandgap-explorer")}
    />
  );
}
