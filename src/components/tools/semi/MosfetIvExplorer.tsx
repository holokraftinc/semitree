"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { fieldBase } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { mosfetDrainCurrent } from "@/lib/calculations/semi";
import { parseNumber, formatNumber } from "@/lib/utils/format";

const VDS_MAX = 2;
const CURVE_COLORS = ["stroke-brand", "stroke-info", "stroke-warning"];
const OVERDRIVES = [0.5, 1.0, 1.5]; // Vgs − Vth for the three curves

export function MosfetIvExplorer() {
  const [knPrime, setKnPrime] = useState("200"); // µA/V² (= μ·Cox)
  const [wl, setWl] = useState("10"); // W/L
  const [vth, setVth] = useState("0.5"); // V

  const reset = () => { setKnPrime("200"); setWl("10"); setVth("0.5"); };

  const kn = parseNumber(knPrime); // µA/V²
  const wlVal = parseNumber(wl);
  const vthVal = parseNumber(vth);
  const valid = kn !== null && kn > 0 && wlVal !== null && wlVal > 0 && vthVal !== null && Number.isFinite(vthVal);

  const curves = useMemo(() => {
    if (!valid) return [];
    const mobilitySI = kn! * 1e-6; // treat μ·Cox (A/V²) as mobility with Cox=1
    return OVERDRIVES.map((ov) => {
      const vgs = vthVal! + ov;
      const pts: { vds: number; id: number }[] = [];
      for (let k = 0; k <= 60; k++) {
        const vds = (VDS_MAX * k) / 60;
        const r = mosfetDrainCurrent({ mobility: mobilitySI, oxideCapacitance: 1, widthToLength: wlVal!, vgs, vth: vthVal!, vds });
        pts.push({ vds, id: r.ok ? r.value.current : 0 });
      }
      return { vgs, pts };
    });
  }, [valid, kn, wlVal, vthVal]);

  const iMax = Math.max(0.001, ...curves.flatMap((c) => c.pts.map((p) => p.id)));
  const W = 360, H = 210, PAD = { l: 52, r: 12, t: 12, b: 32 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const px = (vds: number) => PAD.l + (vds / VDS_MAX) * pw;
  const py = (id: number) => PAD.t + (1 - id / iMax) * ph;
  const toPath = (pts: { vds: number; id: number }[]) => pts.map((p, k) => `${k === 0 ? "M" : "L"}${px(p.vds).toFixed(1)} ${py(p.id).toFixed(1)}`).join(" ");

  const numField = (id: string, label: string, value: string, set: (v: string) => void, suffix?: string) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <input id={id} type="number" inputMode="decimal" step="any" value={value} onChange={(e) => set(e.target.value)} className={cn(fieldBase, "w-full")} />
        {suffix && <span className="shrink-0 text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <CalculatorShell
      title="MOSFET I–V explorer"
      description="Long-channel square-law drain-current curves for three gate overdrives, swept over drain voltage."
      tier="mvp"
      trackSlug="mosfet-iv-explorer"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "MOSFET I–V explorer" },
      ]}
      inputs={
        <div className="space-y-4">
          <Alert variant="info" title="Educational long-channel model">
            Model: square-law long-channel MOSFET. Operating regions: cutoff / triode / saturation. It ignores
            channel-length modulation, velocity saturation, and all short-channel effects, so it is a teaching aid, not a
            device simulator.
          </Alert>
          {numField("iv-kn", "Transconductance μ·Cox (kn′)", knPrime, setKnPrime, "µA/V²")}
          {numField("iv-wl", "Width / length (W/L)", wl, setWl)}
          {numField("iv-vth", "Threshold voltage (Vth)", vth, setVth, "V")}
          <div><Button type="button" variant="outline" onClick={reset}>Reset</Button></div>
        </div>
      }
      result={
        valid ? (
          <figure className="rounded-lg border border-border bg-muted/30 p-4">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full" role="img" aria-label="MOSFET drain current versus drain voltage for three gate overdrives, each rising then saturating.">
              <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
              <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
              {curves.map((c, i) => (
                <path key={i} d={toPath(c.pts)} className={cn("fill-none", CURVE_COLORS[i % CURVE_COLORS.length])} strokeWidth="2" />
              ))}
              <text x={PAD.l} y={H - PAD.b + 18} className="fill-muted-foreground text-[9px]">0</text>
              <text x={W - PAD.r} y={H - PAD.b + 18} textAnchor="end" className="fill-muted-foreground text-[9px]">{VDS_MAX} V</text>
              <text x={(PAD.l + W - PAD.r) / 2} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[10px]">Drain voltage (Vds)</text>
              <text x={PAD.l - 6} y={PAD.t + 6} textAnchor="end" className="fill-muted-foreground text-[9px]">{formatNumber(iMax * 1e3)} mA</text>
              <text x={14} y={(PAD.t + H - PAD.b) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(PAD.t + H - PAD.b) / 2})`} className="fill-muted-foreground text-[10px]">Drain current</text>
            </svg>
            <figcaption className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              {curves.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  <span className={cn("h-2 w-4 rounded-sm", CURVE_COLORS[i % CURVE_COLORS.length].replace("stroke", "bg"))} />
                  Vgs = {formatNumber(c.vgs)} V
                </span>
              ))}
            </figcaption>
          </figure>
        ) : (
          <p className="text-sm text-muted-foreground">Enter a positive kn′, W/L, and a threshold voltage.</p>
        )
      }
      interpretation={
        <p>
          Each curve rises steeply in the <strong>triode</strong> region (small Vds) then flattens into{" "}
          <strong>saturation</strong> once Vds exceeds the overdrive (Vgs − Vth). A larger gate overdrive or W/L gives
          more current; the saturation current scales with (Vgs − Vth)². This square-law picture is the long-channel
          ideal — real short devices saturate earlier and the flat region slopes upward.
        </p>
      }
      formula={{ expression: "Id,sat = ½·μCox·(W/L)·(Vgs−Vth)²", label: "Square-law MOSFET", caption: "Triode: Id = μCox(W/L)[(Vgs−Vth)Vds − Vds²/2]." }}
      variables={[
        { symbol: "Id", name: "Drain current", unit: "A (shown as mA)" },
        { symbol: "μCox", name: "Transconductance parameter", unit: "A/V²" },
        { symbol: "W/L", name: "Width-to-length ratio", unit: "dimensionless" },
        { symbol: "Vgs, Vth", name: "Gate and threshold voltage", unit: "V" },
        { symbol: "Vds", name: "Drain voltage", unit: "V" },
      ]}
      assumptions={[
        "Educational long-channel square-law model.",
        "Cutoff / triode / saturation regions only.",
        "Ignores channel-length modulation, velocity saturation, and short-channel effects.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>kn′ = 200 µA/V², W/L = 10, Vth = 0.5 V, Vgs = 1.5 V (overdrive 1 V).</p>
          <p className="font-mono text-xs text-muted-foreground">Id,sat = ½·(200µ·10)·1² = 1 mA</p>
        </div>
      }
      relatedConcepts={[{ label: "MOSFET", href: "/semiconductors/learn/mosfet" }]}
      relatedLessons={getSemiToolLearningLinks("mosfet-iv-explorer")}
      relatedTools={getRelatedSemiToolLinks("mosfet-iv-explorer")}
    />
  );
}
