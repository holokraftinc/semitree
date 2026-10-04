"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { Alert } from "@/components/ui/Alert";
import { fieldBase } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { Button } from "@/components/ui/Button";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { parseNumber, formatNumber } from "@/lib/utils/format";

const NA_MIN = 0.2;
const NA_MAX = 1.5;

export function ProcessWindowExplorer() {
  const [wavelength, setWavelength] = useState<MeasurementValue>({ raw: "193", unit: "nm" });
  const [na, setNa] = useState("1.35");
  const [k1, setK1] = useState("0.28");

  const reset = () => {
    setWavelength({ raw: "193", unit: "nm" });
    setNa("1.35");
    setK1("0.28");
  };

  const lambda = measurementToSI(wavelength); // m
  const naN = parseNumber(na);
  const k1N = parseNumber(k1);
  const valid = lambda !== null && lambda > 0 && naN !== null && naN > 0 && k1N !== null && k1N > 0;

  // Resolution at the chosen point (nm).
  const resolutionNm = valid ? (k1N! * lambda! * 1e9) / naN! : null;

  // Curve: R(NA) = k1·λ/NA across the NA range, in nm.
  const curve = useMemo(() => {
    if (!valid) return [];
    const pts: { na: number; r: number }[] = [];
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const naVal = NA_MIN + ((NA_MAX - NA_MIN) * i) / steps;
      pts.push({ na: naVal, r: (k1N! * lambda! * 1e9) / naVal });
    }
    return pts;
  }, [valid, k1N, lambda]);

  // SVG geometry.
  const W = 360;
  const H = 200;
  const PAD = { l: 44, r: 12, t: 12, b: 30 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const rMax = curve.length ? curve[0].r : 1; // largest R is at smallest NA
  const rMin = curve.length ? curve[curve.length - 1].r : 0;
  const x = (naVal: number) => PAD.l + ((naVal - NA_MIN) / (NA_MAX - NA_MIN)) * plotW;
  const y = (r: number) => {
    const span = rMax - rMin || 1;
    return PAD.t + (1 - (r - rMin) / span) * plotH;
  };
  const path = curve.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.na).toFixed(1)} ${y(p.r).toFixed(1)}`).join(" ");
  const markerInRange = valid && naN! >= NA_MIN && naN! <= NA_MAX;

  const widget = (
    <div className="space-y-4">
      <Alert variant="info" title="Educational explorer — not a production simulator">
        Shows how the first-order Rayleigh resolution R = k₁·λ/NA changes with your inputs. It does not simulate a real
        process window, resist, or tool.
      </Alert>
      <MeasurementField label="Wavelength (λ)" quantity="length" value={wavelength} onChange={setWavelength} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="pw-na" className="block text-sm font-medium text-foreground">Numerical aperture (NA)</label>
          <input id="pw-na" type="number" inputMode="decimal" step="any" value={na} onChange={(e) => setNa(e.target.value)} className={cn(fieldBase, "w-full")} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="pw-k1" className="block text-sm font-medium text-foreground">Process factor (k₁)</label>
          <input id="pw-k1" type="number" inputMode="decimal" step="any" value={k1} onChange={(e) => setK1(e.target.value)} className={cn(fieldBase, "w-full")} />
        </div>
      </div>
      <div>
        <Button type="button" variant="outline" onClick={reset}>Reset</Button>
      </div>
    </div>
  );

  const resultPanel = valid ? (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground">Estimated resolution at NA = {formatNumber(naN!)}</p>
        <p className="mt-1 text-2xl font-semibold text-brand">{formatNumber(resolutionNm!)} nm</p>
      </div>
      <figure className="rounded-lg border border-border bg-muted/30 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full" role="img" aria-label={`Resolution versus numerical aperture: resolution falls from about ${formatNumber(rMax)} nm at NA ${NA_MIN} to about ${formatNumber(rMin)} nm at NA ${NA_MAX} for the chosen wavelength and k1.`}>
          {/* axes */}
          <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
          <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} className="stroke-border" strokeWidth="1" />
          {/* curve */}
          <path d={path} className="fill-none stroke-brand" strokeWidth="2" />
          {/* current point */}
          {markerInRange && (
            <>
              <line x1={x(naN!)} y1={PAD.t} x2={x(naN!)} y2={H - PAD.b} className="stroke-brand/40" strokeWidth="1" strokeDasharray="3 2" />
              <circle cx={x(naN!)} cy={y(resolutionNm!)} r="4" className="fill-brand" />
            </>
          )}
          {/* labels */}
          <text x={PAD.l} y={H - PAD.b + 18} className="fill-muted-foreground text-[9px]">{NA_MIN}</text>
          <text x={W - PAD.r} y={H - PAD.b + 18} textAnchor="end" className="fill-muted-foreground text-[9px]">{NA_MAX}</text>
          <text x={(PAD.l + W - PAD.r) / 2} y={H - 4} textAnchor="middle" className="fill-muted-foreground text-[10px]">Numerical aperture (NA)</text>
          <text x={PAD.l - 6} y={PAD.t + 6} textAnchor="end" className="fill-muted-foreground text-[9px]">{formatNumber(rMax)}</text>
          <text x={PAD.l - 6} y={H - PAD.b} textAnchor="end" className="fill-muted-foreground text-[9px]">{formatNumber(rMin)}</text>
          <text x={10} y={(PAD.t + H - PAD.b) / 2} textAnchor="middle" transform={`rotate(-90 10 ${(PAD.t + H - PAD.b) / 2})`} className="fill-muted-foreground text-[10px]">Resolution (nm)</text>
        </svg>
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          Resolution vs NA at λ and k₁ fixed. Lower is finer; the dashed line marks your chosen NA.
        </figcaption>
      </figure>
    </div>
  ) : (
    <p className="text-sm text-muted-foreground">Enter a positive wavelength, NA, and k₁ to see the curve.</p>
  );

  return (
    <CalculatorShell
      title="Process window explorer"
      description="Vary wavelength, NA, and k₁ and watch how the theoretical resolution changes."
      tier="mvp"
      trackSlug="process-window-explorer"
      categoryLabel="Lithography"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Process window explorer" },
      ]}
      inputs={widget}
      result={resultPanel}
      interpretation={
        <p>
          The curve shows the first-order Rayleigh resolution as numerical aperture varies, with wavelength and k₁ held
          at your values. Shorter λ, higher NA, and lower k₁ all push resolution finer — but in reality a higher NA also
          shrinks depth of focus, and a lower k₁ shrinks the process window, so the &ldquo;best&rdquo; point trades off
          against robustness. This is a teaching aid, not a production simulator.
        </p>
      }
      formula={{ expression: "R = k₁ · λ / NA", label: "Rayleigh criterion", caption: "Swept over NA; educational." }}
      variables={[
        { symbol: "R", name: "Resolution", unit: "m (shown as nm)" },
        { symbol: "k₁", name: "Process factor", unit: "dimensionless" },
        { symbol: "λ", name: "Wavelength", unit: "m" },
        { symbol: "NA", name: "Numerical aperture", unit: "dimensionless" },
      ]}
      assumptions={[
        "First-order Rayleigh relationship only; no resist, mask, or tool model.",
        "The NA axis spans 0.2–1.5 for illustration; real tools occupy narrower ranges.",
        "Not a production process-window simulator.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>At λ = 193 nm, k₁ = 0.28: raising NA from 0.9 to 1.35 lowers R from ~60 nm to ~40 nm.</p>
        </div>
      }
      relatedConcepts={[
        { label: "Photolithography", href: "/semiconductors/learn/lithography" },
        { label: "Metrology & inspection", href: "/semiconductors/learn/metrology" },
      ]}
      relatedLessons={getSemiToolLearningLinks("process-window-explorer")}
      relatedTools={getRelatedSemiToolLinks("process-window-explorer")}
    />
  );
}
