"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { erfc } from "@/lib/utils/erf";
import { formatNumber } from "@/lib/utils/format";

export function DiffusionProfileTool() {
  const [diffusivity, setDiffusivity] = useState<MeasurementValue>({ raw: "1e-14", unit: "cm2_per_s" });
  const [time, setTime] = useState<MeasurementValue>({ raw: "30", unit: "min" });

  const reset = () => {
    setDiffusivity({ raw: "1e-14", unit: "cm2_per_s" });
    setTime({ raw: "30", unit: "min" });
  };

  const D = measurementToSI(diffusivity); // m²/s
  const t = measurementToSI(time); // s
  const valid = D !== null && D > 0 && t !== null && t > 0;

  // Characteristic depth of a constant-source (erfc) profile: 2√(Dt).
  const charDepth = valid ? 2 * Math.sqrt(D! * t!) : null; // m

  const curve = useMemo(() => {
    if (!valid || !charDepth) return [];
    const pts: { x: number; c: number }[] = [];
    const xMax = 3 * charDepth;
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const x = (xMax * i) / steps;
      pts.push({ x, c: erfc(x / charDepth) }); // C/Cs = erfc(x / (2√(Dt)))
    }
    return pts;
  }, [valid, charDepth]);

  const W = 360;
  const H = 210;
  const PAD = { l: 44, r: 12, t: 12, b: 32 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const xMax = charDepth ? 3 * charDepth : 1;
  const px = (x: number) => PAD.l + (x / xMax) * plotW;
  const py = (c: number) => PAD.t + (1 - c) * plotH;
  const path = curve.map((p, i) => `${i === 0 ? "M" : "L"}${px(p.x).toFixed(1)} ${py(p.c).toFixed(1)}`).join(" ");
  const toNm = (m: number) => m * 1e9;

  const result = valid ? (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground">Characteristic diffusion depth (2√(D·t))</p>
        <p className="mt-1 text-2xl font-semibold text-brand">{formatNumber(toNm(charDepth!))} nm</p>
        <p className="text-xs text-muted-foreground">Depth where C/Cs ≈ 0.16</p>
      </div>
      <figure className="rounded-lg border border-border bg-muted/30 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full" role="img" aria-label={`Normalized dopant concentration falling from 1 at the surface toward 0 with depth, over roughly ${formatNumber(toNm(xMax))} nm.`}>
          <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
          <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
          <path d={path} className="fill-none stroke-brand" strokeWidth="2" />
          <text x={PAD.l} y={H - PAD.b + 18} className="fill-muted-foreground text-[9px]">0</text>
          <text x={W - PAD.r} y={H - PAD.b + 18} textAnchor="end" className="fill-muted-foreground text-[9px]">{formatNumber(toNm(xMax))} nm</text>
          <text x={(PAD.l + W - PAD.r) / 2} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[10px]">Depth</text>
          <text x={PAD.l - 6} y={PAD.t + 6} textAnchor="end" className="fill-muted-foreground text-[9px]">1.0</text>
          <text x={PAD.l - 6} y={H - PAD.b} textAnchor="end" className="fill-muted-foreground text-[9px]">0</text>
          <text x={12} y={(PAD.t + H - PAD.b) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(PAD.t + H - PAD.b) / 2})`} className="fill-muted-foreground text-[10px]">C / Cs</text>
        </svg>
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          Constant-source (erfc) profile. Increasing D or t spreads dopant deeper.
        </figcaption>
      </figure>
    </div>
  ) : (
    <p className="text-sm text-muted-foreground">Enter a positive diffusion coefficient and time.</p>
  );

  return (
    <CalculatorShell
      title="Diffusion profile (educational)"
      description="Visualize how a dopant concentration spreads with depth as diffusion coefficient and time change."
      tier="mvp"
      trackSlug="diffusion-education"
      categoryLabel="Doping"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Diffusion profile" },
      ]}
      inputs={
        <div className="space-y-4">
          <Alert variant="info" title="Educational model — not a production simulation">
            Uses a single constant-source (erfc) diffusion profile. Real diffusion involves concentration-dependent
            coefficients, multiple steps, and later thermal budget that this does not capture.
          </Alert>
          <MeasurementField label="Diffusion coefficient (D)" quantity="diffusivity" value={diffusivity} onChange={setDiffusivity} />
          <MeasurementField label="Time (t)" quantity="time" value={time} onChange={setTime} />
          <div><Button type="button" variant="outline" onClick={reset}>Reset</Button></div>
        </div>
      }
      result={result}
      interpretation={
        <p>
          With a fixed surface concentration, the dopant profile follows C(x) = Cs·erfc(x / (2√(D·t))). The quantity
          2√(D·t) sets the characteristic depth — raising the diffusion coefficient (hotter) or the time pushes dopant
          deeper and makes the profile more graded. This is why thermal budget is carefully controlled: heat that
          activates dopants also moves them.
        </p>
      }
      formula={{ expression: "C(x) = Cs · erfc( x / (2√(D·t)) )", label: "Constant-source diffusion", caption: "Educational erfc profile." }}
      variables={[
        { symbol: "C(x)", name: "Concentration at depth x", unit: "same as Cs" },
        { symbol: "Cs", name: "Surface concentration", unit: "m⁻³" },
        { symbol: "D", name: "Diffusion coefficient", unit: "m²/s" },
        { symbol: "t", name: "Diffusion time", unit: "s" },
        { symbol: "x", name: "Depth", unit: "m" },
      ]}
      assumptions={[
        "Constant surface concentration (predeposition-style erfc profile).",
        "Constant, concentration-independent diffusion coefficient.",
        "A single diffusion step — not a full process simulation.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>D = 1×10⁻¹⁴ cm²/s, t = 30 min.</p>
          <p className="font-mono text-xs text-muted-foreground">2√(D·t) ≈ 85 nm — the characteristic diffusion depth.</p>
        </div>
      }
      relatedConcepts={[{ label: "Doping", href: "/semiconductors/learn/ion-implantation" }]}
      relatedLessons={getSemiToolLearningLinks("diffusion-education")}
      relatedTools={getRelatedSemiToolLinks("diffusion-education")}
    />
  );
}
