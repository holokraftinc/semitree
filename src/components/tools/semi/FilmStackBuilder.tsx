"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { Button } from "@/components/ui/Button";
import { fieldBase } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { parseNumber, formatNumber } from "@/lib/utils/format";

interface Layer {
  id: number;
  name: string;
  nm: string; // thickness in nm, as a string for the input
}

const PALETTE = ["bg-brand/40", "bg-info/40", "bg-warning/50", "bg-success/40", "bg-brand/20", "bg-info/20"];

let nextId = 100;

const INITIAL: Layer[] = [
  { id: 1, name: "Oxide", nm: "50" },
  { id: 2, name: "Nitride", nm: "100" },
  { id: 3, name: "Metal", nm: "200" },
];

export function FilmStackBuilder() {
  const [layers, setLayers] = useState<Layer[]>(INITIAL);

  const reset = () => setLayers(INITIAL.map((l) => ({ ...l })));
  const addLayer = () => setLayers((ls) => [...ls, { id: nextId++, name: `Layer ${ls.length + 1}`, nm: "50" }]);
  const removeLayer = (id: number) => setLayers((ls) => ls.filter((l) => l.id !== id));
  const update = (id: number, patch: Partial<Layer>) =>
    setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const parsed = useMemo(
    () => layers.map((l) => ({ ...l, value: parseNumber(l.nm) })),
    [layers],
  );
  const total = parsed.reduce((sum, l) => sum + (l.value && l.value > 0 ? l.value : 0), 0);
  const maxForScale = Math.max(total, 1);

  const builder = (
    <div className="space-y-4">
      <ul className="space-y-2">
        {layers.map((l, i) => (
          <li key={l.id} className="flex items-center gap-2">
            <span aria-hidden="true" className={cn("h-4 w-4 shrink-0 rounded-sm border border-border", PALETTE[i % PALETTE.length])} />
            <input
              aria-label={`Layer ${i + 1} name`}
              value={l.name}
              onChange={(e) => update(l.id, { name: e.target.value })}
              className={cn(fieldBase, "min-w-0 flex-1")}
            />
            <input
              aria-label={`Layer ${i + 1} thickness in nm`}
              type="number"
              inputMode="decimal"
              step="any"
              value={l.nm}
              onChange={(e) => update(l.id, { nm: e.target.value })}
              className={cn(fieldBase, "w-24")}
            />
            <span className="text-xs text-muted-foreground">nm</span>
            <button
              type="button"
              onClick={() => removeLayer(l.id)}
              aria-label={`Remove ${l.name}`}
              disabled={layers.length <= 1}
              className="rounded-md border border-border px-2 py-1 text-sm text-muted-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={addLayer}>+ Add layer</Button>
        <Button type="button" variant="outline" onClick={reset}>Reset</Button>
      </div>
    </div>
  );

  const viz = (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground">Total stack thickness</p>
        <p className="mt-1 text-2xl font-semibold text-brand">{formatNumber(total)} nm</p>
        <p className="text-xs text-muted-foreground">{formatNumber(total / 1000)} µm · {layers.length} layer{layers.length === 1 ? "" : "s"}</p>
      </div>

      {/* Stacked visualization (top layer = last added, substrate at the bottom) */}
      <figure className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="mx-auto flex max-w-xs flex-col overflow-hidden rounded-md border border-border">
          {[...parsed].reverse().map((l, revIdx) => {
            const i = parsed.length - 1 - revIdx;
            const v = l.value && l.value > 0 ? l.value : 0;
            const heightPx = Math.max(22, (v / maxForScale) * 240);
            return (
              <div
                key={l.id}
                className={cn("flex items-center justify-between gap-2 px-3 text-xs", PALETTE[i % PALETTE.length])}
                style={{ height: `${heightPx}px` }}
              >
                <span className="truncate font-medium text-foreground">{l.name || "Layer"}</span>
                <span className="shrink-0 text-muted-foreground">{v ? `${formatNumber(v)} nm` : "—"}</span>
              </div>
            );
          })}
          <div className="flex h-10 items-center justify-center bg-muted text-xs font-medium text-muted-foreground">
            Substrate
          </div>
        </div>
        <figcaption className="mt-3 text-center text-xs text-muted-foreground">
          Layers stack upward on the substrate; block heights are proportional to thickness (with a minimum for
          legibility).
        </figcaption>
      </figure>
    </div>
  );

  return (
    <CalculatorShell
      title="Film stack builder"
      description="Build a multi-layer film stack, see the total thickness, and visualize the layers on a substrate."
      tier="mvp"
      trackSlug="film-stack"
      categoryLabel="Etching & deposition"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Film stack builder" },
      ]}
      inputs={builder}
      result={viz}
      interpretation={
        <p>
          Real devices are built from many stacked thin films — conductors, insulators, barriers, and liners — each
          deposited and often patterned in turn. The total stack thickness is simply the sum of the layers. Add, remove,
          and resize layers to see how a stack builds up; the visual shows the relative thicknesses, not absolute scale.
        </p>
      }
      formula={{ expression: "total = Σ layer thickness", label: "Stack thickness", caption: "Sum of all individual layer thicknesses." }}
      variables={[
        { symbol: "total", name: "Total stack thickness", unit: "nm" },
        { symbol: "layer thickness", name: "Each layer's thickness", unit: "nm" },
      ]}
      assumptions={[
        "Planar, uniform layers; the total is the simple sum of thicknesses.",
        "The drawing is proportional with a minimum block height, not to absolute scale.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>Oxide 50 nm + Nitride 100 nm + Metal 200 nm.</p>
          <p className="font-mono text-xs text-muted-foreground">total = 50 + 100 + 200 = 350 nm</p>
        </div>
      }
      relatedConcepts={[
        { label: "Etching & deposition", href: "/semiconductors/learn/etching" },
        { label: "Deposition", href: "/semiconductors/learn/deposition" },
      ]}
      relatedLessons={getSemiToolLearningLinks("film-stack")}
      relatedTools={getRelatedSemiToolLinks("film-stack")}
    />
  );
}
