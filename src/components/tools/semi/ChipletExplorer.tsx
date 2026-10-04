"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { Alert } from "@/components/ui/Alert";
import { cn } from "@/lib/utils/cn";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";

type Mode = "side-by-side" | "stacked" | "interposer" | "bridge";

const MODES: { id: Mode; label: string }[] = [
  { id: "side-by-side", label: "Side-by-side (2D)" },
  { id: "stacked", label: "Stacked (3D)" },
  { id: "interposer", label: "Interposer (2.5D)" },
  { id: "bridge", label: "Bridge (2.5D)" },
];

const DESCRIPTIONS: Record<Mode, { summary: string; points: string[] }> = {
  "side-by-side": {
    summary: "Separate dies sit next to each other on the package substrate and connect through its wiring.",
    points: [
      "Simplest multi-die arrangement; each die is placed and bonded on the substrate.",
      "Die-to-die links go through the substrate, so they are longer and lower-density than 2.5D/3D.",
      "Heat spreads across the whole footprint, which is relatively easy to cool.",
    ],
  },
  stacked: {
    summary: "Dies are stacked vertically and connected through the stack (e.g. with through-silicon vias).",
    points: [
      "Shortest die-to-die connections and the smallest footprint.",
      "Through-silicon vias (TSVs) carry signals and power up and down the stack.",
      "Heat is the main challenge — inner dies have no direct path to a heatsink.",
    ],
  },
  interposer: {
    summary: "Dies sit side by side on a shared interposer that provides very dense, short die-to-die wiring.",
    points: [
      "A silicon (or other) interposer under the dies routes thousands of fine connections between them.",
      "Enables compute dies next to high-bandwidth memory with short, dense links (2.5D).",
      "More complex and costly than plain side-by-side, but far higher die-to-die bandwidth.",
    ],
  },
  bridge: {
    summary: "A small bridge embedded in the substrate links two neighbouring dies only where they meet.",
    points: [
      "Instead of a full interposer, a small silicon bridge provides dense local connections.",
      "Cheaper than a large interposer when only certain die pairs need high-density links.",
      "Intel's EMIB is a publicly described example of this embedded-bridge approach (cited as an example).",
    ],
  },
};

const DIE = "stroke-brand fill-brand/30";
const MEM = "stroke-border fill-info/30";
const IO = "stroke-border fill-warning/40";

function Schematic({ mode }: { mode: Mode }) {
  return (
    <svg viewBox="0 0 320 180" className="mx-auto h-auto w-full max-w-md" role="img" aria-label={`Chiplet package schematic: ${mode} integration.`}>
      {/* package substrate (common) */}
      <rect x="8" y="140" width="304" height="30" rx="3" className="fill-muted stroke-border" strokeWidth="1.2" />
      <text x="160" y="159" textAnchor="middle" className="fill-muted-foreground text-[10px]">Package substrate</text>

      {mode === "side-by-side" && (
        <g>
          {[
            { x: 16, w: 66, cls: DIE, t: "Compute" },
            { x: 90, w: 66, cls: DIE, t: "Compute" },
            { x: 164, w: 64, cls: MEM, t: "Memory" },
            { x: 236, w: 68, cls: IO, t: "I/O" },
          ].map((d) => (
            <g key={d.t + d.x}>
              <rect x={d.x} y="96" width={d.w} height="38" rx="2" className={cn(d.cls)} strokeWidth="1.2" />
              <text x={d.x + d.w / 2} y="119" textAnchor="middle" className="fill-foreground text-[9px]">{d.t}</text>
            </g>
          ))}
        </g>
      )}

      {mode === "interposer" && (
        <g>
          <rect x="24" y="116" width="272" height="16" rx="2" className="fill-brand/15 stroke-brand" strokeWidth="1.1" />
          <text x="160" y="128" textAnchor="middle" className="fill-foreground text-[9px]">Interposer</text>
          {[
            { x: 32, w: 76, cls: DIE, t: "Compute" },
            { x: 118, w: 76, cls: DIE, t: "Compute" },
            { x: 204, w: 84, cls: MEM, t: "Memory" },
          ].map((d) => (
            <g key={d.t + d.x}>
              <rect x={d.x} y="78" width={d.w} height="36" rx="2" className={cn(d.cls)} strokeWidth="1.2" />
              <text x={d.x + d.w / 2} y="100" textAnchor="middle" className="fill-foreground text-[9px]">{d.t}</text>
            </g>
          ))}
        </g>
      )}

      {mode === "bridge" && (
        <g>
          {/* embedded bridge spanning the gap between the two left dies */}
          <rect x="92" y="130" width="40" height="10" rx="1" className="fill-brand/20 stroke-brand" strokeWidth="1" />
          <text x="112" y="124" textAnchor="middle" className="fill-muted-foreground text-[8px]">bridge</text>
          {[
            { x: 24, w: 70, cls: DIE, t: "Compute" },
            { x: 110, w: 70, cls: DIE, t: "Compute" },
            { x: 196, w: 100, cls: IO, t: "I/O + Memory" },
          ].map((d) => (
            <g key={d.t + d.x}>
              <rect x={d.x} y="96" width={d.w} height="38" rx="2" className={cn(d.cls)} strokeWidth="1.2" />
              <text x={d.x + d.w / 2} y="119" textAnchor="middle" className="fill-foreground text-[9px]">{d.t}</text>
            </g>
          ))}
        </g>
      )}

      {mode === "stacked" && (
        <g>
          {/* a vertical stack in the centre with TSVs, plus a compute die beside it */}
          <rect x="40" y="96" width="90" height="38" rx="2" className={cn(DIE)} strokeWidth="1.2" />
          <text x="85" y="119" textAnchor="middle" className="fill-foreground text-[9px]">Compute</text>
          {[0, 1, 2].map((i) => (
            <rect key={i} x="170" y={112 - i * 22} width="110" height="20" rx="2" className={cn(MEM)} strokeWidth="1.1" />
          ))}
          <text x="225" y="104" textAnchor="middle" className="fill-foreground text-[9px]">Memory stack</text>
          {/* TSVs */}
          {[190, 225, 260].map((x) => (
            <line key={x} x1={x} y1="72" x2={x} y2="132" className="stroke-brand/50" strokeWidth="1" strokeDasharray="2 2" />
          ))}
          <text x="225" y="150" textAnchor="middle" className="fill-muted-foreground text-[8px]">TSVs</text>
        </g>
      )}
    </svg>
  );
}

export function ChipletExplorer() {
  const [mode, setMode] = useState<Mode>("side-by-side");
  const desc = DESCRIPTIONS[mode];

  const widget = (
    <div className="space-y-4">
      <Alert variant="info" title="Educational explorer — not a package designer">
        A conceptual view of how chiplets can be integrated. It illustrates arrangements and trade-offs; it does not
        design or validate a real package.
      </Alert>
      <div role="tablist" aria-label="Integration style" className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            type="button"
            aria-selected={m.id === mode}
            onClick={() => setMode(m.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              m.id === mode ? "border-brand bg-brand/10 text-brand" : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      <figure className="rounded-lg border border-border bg-muted/30 p-4">
        <Schematic mode={mode} />
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">Conceptual layout — relative sizes, not to scale.</figcaption>
      </figure>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <p className="leading-relaxed text-foreground">{desc.summary}</p>
      <ul className="space-y-2">
        {desc.points.map((p, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground">
            <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <CalculatorShell
      title="Chiplet package explorer"
      description="See how multiple dies — compute, memory, I/O — can be integrated in one package, and the trade-offs of each approach."
      tier="mvp"
      trackSlug="chiplet-explorer"
      categoryLabel="Packaging"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Chiplet package explorer" },
      ]}
      inputs={widget}
      result={result}
      interpretation={
        <p>
          Chiplets split what might have been one large die into several smaller ones, then reunite them in a package.
          How they are joined — side by side through the substrate, on a shared interposer, over an embedded bridge, or
          stacked vertically — trades off die-to-die bandwidth, footprint, cost, and how hard the result is to cool.
          Switch between the styles above to compare them.
        </p>
      }
      formula={{ expression: "side-by-side · interposer · bridge · stacked", label: "Integration styles", caption: "Conceptual, educational." }}
      assumptions={[
        "Conceptual schematic; relative sizes are illustrative, not to scale.",
        "Does not model electrical, thermal, or mechanical design of a real package.",
      ]}
      relatedConcepts={[
        { label: "Chip packaging", href: "/semiconductors/learn/packaging" },
        { label: "Chiplets", href: "/semiconductors/learn/chiplets" },
        { label: "3D ICs", href: "/semiconductors/learn/3d-ic" },
      ]}
      relatedLessons={getSemiToolLearningLinks("chiplet-explorer")}
      relatedTools={getRelatedSemiToolLinks("chiplet-explorer")}
    />
  );
}
