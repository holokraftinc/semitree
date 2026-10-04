"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { fieldBase } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { subthresholdSwing } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

const VRANGE = 0.3; // volts below threshold to plot

export function SubthresholdExplorer() {
  const [n, setN] = useState("1");
  const [temp, setTemp] = useState<MeasurementValue>({ raw: "27", unit: "C" });

  const reset = () => { setN("1"); setTemp({ raw: "27", unit: "C" }); };

  const nVal = parseNumber(n);
  const T = measurementToSI(temp);
  const valid = nVal !== null && nVal > 0 && T !== null && T > 0;
  const res = valid ? subthresholdSwing({ idealityFactor: nVal!, temperature: T! }) : null;
  const swingV = res && res.ok ? res.value.swing : null; // V/decade

  // Subthreshold is log-linear: current drops by ΔV/S decades per volt below Vth.
  const curve = useMemo(() => {
    if (!swingV) return [];
    const pts: { dv: number; dec: number }[] = [];
    for (let k = 0; k <= 40; k++) {
      const dv = -(VRANGE * k) / 40; // 0 → -0.3 V (below threshold)
      pts.push({ dv, dec: dv / swingV }); // decades (negative)
    }
    return pts;
  }, [swingV]);

  const decMin = curve.length ? curve[curve.length - 1].dec : -1;
  const W = 360, H = 200, PAD = { l: 52, r: 12, t: 12, b: 32 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const px = (dv: number) => PAD.l + ((dv + VRANGE) / VRANGE) * pw; // -0.3→left, 0→right
  const py = (dec: number) => PAD.t + (1 - (dec - decMin) / (0 - decMin || 1)) * ph;
  const path = curve.map((p, k) => `${k === 0 ? "M" : "L"}${px(p.dv).toFixed(1)} ${py(p.dec).toFixed(1)}`).join(" ");

  return (
    <CalculatorShell
      title="Subthreshold swing explorer"
      description="The subthreshold swing S = n·(kT/q)·ln10 — how many millivolts of gate voltage change the off-state current by 10×."
      tier="mvp"
      trackSlug="subthreshold-explorer"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Subthreshold swing explorer" },
      ]}
      inputs={
        <div className="space-y-4">
          <Alert variant="info" title="Educational classic-MOSFET limit">
            S = n·(kT/q)·ln10 is the thermal limit on how sharply a conventional MOSFET turns off. The ideal (n = 1) value
            is ≈ 60 mV/decade at 300 K; it cannot be beaten by classic MOSFETs (steep-slope devices use different physics).
          </Alert>
          <div className="space-y-1.5">
            <label htmlFor="st-n" className="block text-sm font-medium text-foreground">Ideality / body factor (n)</label>
            <input id="st-n" type="number" inputMode="decimal" step="any" value={n} onChange={(e) => setN(e.target.value)} className={cn(fieldBase, "w-full")} />
            <p className="text-xs text-muted-foreground">n ≥ 1; set by the depletion/oxide capacitance divider.</p>
          </div>
          <MeasurementField label="Temperature" quantity="temperature" value={temp} onChange={setTemp} />
          <div><Button type="button" variant="outline" onClick={reset}>Reset</Button></div>
        </div>
      }
      result={
        valid && swingV ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Subthreshold swing</p>
              <p className="mt-1 text-2xl font-semibold text-brand">{formatNumber(swingV * 1000)} mV/decade</p>
            </div>
            <figure className="rounded-lg border border-border bg-muted/30 p-4">
              <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full" role="img" aria-label="Log of drain current falling linearly as the gate voltage drops below threshold.">
                <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
                <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
                <path d={path} className="fill-none stroke-brand" strokeWidth="2" />
                <text x={PAD.l} y={H - PAD.b + 18} className="fill-muted-foreground text-[9px]">Vth − {VRANGE} V</text>
                <text x={W - PAD.r} y={H - PAD.b + 18} textAnchor="end" className="fill-muted-foreground text-[9px]">Vth</text>
                <text x={(PAD.l + W - PAD.r) / 2} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[10px]">Gate voltage (Vgs)</text>
                <text x={PAD.l - 6} y={PAD.t + 6} textAnchor="end" className="fill-muted-foreground text-[9px]">0</text>
                <text x={PAD.l - 6} y={H - PAD.b} textAnchor="end" className="fill-muted-foreground text-[9px]">{formatNumber(decMin, 1)}</text>
                <text x={12} y={(PAD.t + H - PAD.b) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(PAD.t + H - PAD.b) / 2})`} className="fill-muted-foreground text-[10px]">log₁₀(Id)</text>
              </svg>
              <figcaption className="mt-2 text-center text-xs text-muted-foreground">Below threshold, log(Id) falls linearly — one decade per S of gate voltage.</figcaption>
            </figure>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Enter an ideality factor and temperature.</p>
        )
      }
      interpretation={
        <p>
          In the subthreshold region the drain current is exponential in gate voltage, so on a log scale it falls as a
          straight line — one decade for every S volts. A smaller S means the transistor switches off more sharply, which
          lowers leakage and allows a lower supply voltage. The n·(kT/q)·ln10 form shows why this &ldquo;60 mV/decade&rdquo;
          limit is fundamentally thermal for classic MOSFETs.
        </p>
      }
      formula={{ expression: "S = n · (kT/q) · ln(10)", label: "Subthreshold swing", caption: "Ideal n=1 → ≈ 60 mV/dec at 300 K." }}
      variables={[
        { symbol: "S", name: "Subthreshold swing", unit: "V/decade (shown as mV/dec)" },
        { symbol: "n", name: "Body/ideality factor", unit: "dimensionless (≥ 1)" },
        { symbol: "kT/q", name: "Thermal voltage", unit: "V" },
      ]}
      assumptions={[
        "Classic MOSFET subthreshold conduction (diffusion current).",
        "The log-Id line is a first-order picture; real curves bend near and above threshold.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>n = 1, 27 °C.</p>
          <p className="font-mono text-xs text-muted-foreground">S = 1 · 0.0259 · ln10 ≈ 60 mV/decade</p>
        </div>
      }
      relatedConcepts={[{ label: "MOSFET", href: "/semiconductors/learn/mosfet" }]}
      relatedLessons={getSemiToolLearningLinks("subthreshold-explorer")}
      relatedTools={getRelatedSemiToolLinks("subthreshold-explorer")}
    />
  );
}
