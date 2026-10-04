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
import { KB, Q } from "@/lib/calculations/semi/constants";
import { parseNumber, formatNumber } from "@/lib/utils/format";

const VMAX = 0.8;

export function DiodeExplorer() {
  const [isat, setIsat] = useState("1e-12"); // A
  const [n, setN] = useState("1");
  const [temp, setTemp] = useState<MeasurementValue>({ raw: "27", unit: "C" });

  const reset = () => { setIsat("1e-12"); setN("1"); setTemp({ raw: "27", unit: "C" }); };

  const Is = parseNumber(isat);
  const nVal = parseNumber(n);
  const T = measurementToSI(temp);
  const valid = Is !== null && Is > 0 && nVal !== null && nVal > 0 && T !== null && T > 0;
  const vt = valid ? (KB * T!) / Q : 0;

  const curve = useMemo(() => {
    if (!valid) return [];
    const pts: { v: number; i: number }[] = [];
    const steps = 70;
    for (let k = 0; k <= steps; k++) {
      const v = (VMAX * k) / steps;
      pts.push({ v, i: Is! * (Math.exp(v / (nVal! * vt)) - 1) });
    }
    return pts;
  }, [valid, Is, nVal, vt]);

  const iMax = curve.length ? curve[curve.length - 1].i : 1;
  const W = 360, H = 210, PAD = { l: 50, r: 12, t: 12, b: 32 };
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  const px = (v: number) => PAD.l + (v / VMAX) * pw;
  const py = (i: number) => PAD.t + (1 - i / (iMax || 1)) * ph;
  const path = curve.map((p, k) => `${k === 0 ? "M" : "L"}${px(p.v).toFixed(1)} ${py(p.i).toFixed(1)}`).join(" ");

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
      title="Diode I–V explorer"
      description="The ideal (Shockley) diode I–V curve, I = Is(exp(V/nVt) − 1), as you vary the parameters."
      tier="mvp"
      trackSlug="diode-explorer"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Diode I–V explorer" },
      ]}
      inputs={
        <div className="space-y-4">
          <Alert variant="info" title="Ideal Shockley model">
            Educational ideal-diode model. It omits series resistance, high-injection, recombination, and breakdown, so
            the current rises unrealistically fast at high forward bias.
          </Alert>
          {numField("de-is", "Saturation current (Is)", isat, setIsat, "A")}
          {numField("de-n", "Ideality factor (n)", n, setN)}
          <MeasurementField label="Temperature" quantity="temperature" value={temp} onChange={setTemp} />
          <div><Button type="button" variant="outline" onClick={reset}>Reset</Button></div>
        </div>
      }
      result={
        valid ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Current at {VMAX} V (Vt = {formatNumber(vt * 1000)} mV)</p>
              <p className="mt-1 text-2xl font-semibold text-brand">{formatNumber(iMax * 1e3)} mA</p>
            </div>
            <figure className="rounded-lg border border-border bg-muted/30 p-4">
              <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full" role="img" aria-label="Diode current rising exponentially with forward voltage.">
                <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
                <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
                <path d={path} className="fill-none stroke-brand" strokeWidth="2" />
                <text x={PAD.l} y={H - PAD.b + 18} className="fill-muted-foreground text-[9px]">0</text>
                <text x={W - PAD.r} y={H - PAD.b + 18} textAnchor="end" className="fill-muted-foreground text-[9px]">{VMAX} V</text>
                <text x={(PAD.l + W - PAD.r) / 2} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[10px]">Forward voltage</text>
                <text x={PAD.l - 6} y={PAD.t + 6} textAnchor="end" className="fill-muted-foreground text-[9px]">{formatNumber(iMax * 1e3)} mA</text>
                <text x={14} y={(PAD.t + H - PAD.b) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(PAD.t + H - PAD.b) / 2})`} className="fill-muted-foreground text-[10px]">Current</text>
              </svg>
              <figcaption className="mt-2 text-center text-xs text-muted-foreground">The exponential turn-on &ldquo;knee&rdquo; shifts with Is, n, and temperature.</figcaption>
            </figure>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Enter a positive saturation current, ideality factor, and temperature.</p>
        )
      }
      interpretation={
        <p>
          A diode conducts negligibly until the forward voltage approaches its turn-on &ldquo;knee&rdquo;, then current
          rises exponentially (a factor of ~10 every n·Vt·ln10 ≈ 60 mV per decade at 300 K for n = 1). A larger saturation
          current or ideality factor, or higher temperature, shifts and softens the knee. This ideal model exaggerates
          high-bias current because it has no series resistance.
        </p>
      }
      formula={{ expression: "I = Is · (exp(V / (n·Vt)) − 1)", label: "Shockley diode", caption: "Vt = kT/q." }}
      variables={[
        { symbol: "I", name: "Diode current", unit: "A" },
        { symbol: "Is", name: "Saturation current", unit: "A" },
        { symbol: "V", name: "Forward voltage", unit: "V" },
        { symbol: "n", name: "Ideality factor", unit: "dimensionless" },
        { symbol: "Vt", name: "Thermal voltage (kT/q)", unit: "V" },
      ]}
      assumptions={[
        "Ideal Shockley diode; operating in forward bias.",
        "No series resistance, high-injection, recombination, or breakdown.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>Is = 1×10⁻¹² A, n = 1, 27 °C.</p>
          <p className="font-mono text-xs text-muted-foreground">At 0.6 V, I ≈ Is·exp(0.6/0.0259) ≈ a few mA.</p>
        </div>
      }
      relatedConcepts={[
        { label: "PN junction", href: "/semiconductors/learn/pn-junction" },
        { label: "Diode", href: "/semiconductors/learn/diode" },
      ]}
      relatedLessons={getSemiToolLearningLinks("diode-explorer")}
      relatedTools={getRelatedSemiToolLinks("diode-explorer")}
    />
  );
}
