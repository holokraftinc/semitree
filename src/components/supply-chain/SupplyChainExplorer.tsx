"use client";

import { useState } from "react";
import Link from "next/link";
import type { StageView } from "@/lib/knowledge/supply-chain-explorer";
import { cn } from "@/lib/utils/cn";

/**
 * The signature Supply Chain Explorer: a clickable journey (Design → End markets)
 * with a progressive-disclosure details panel. Primary facts (what it is, why it
 * matters, inputs/outputs) are always visible; related entities and deeper
 * discovery expand on demand — not a giant flowchart. The journey nodes stay
 * readable at every width.
 */

function Chips({ items }: { items: { name: string; href: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((it) => (
        <li key={it.href + it.name}>
          <Link
            href={it.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:border-brand/50 hover:text-brand"
          >
            {it.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {items.map((it) => (
        <li key={it} className="flex gap-2">
          <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function SupplyChainExplorer({ stages }: { stages: StageView[] }) {
  const [active, setActive] = useState(0);
  const s = stages[active];

  return (
    <div className="space-y-8">
      {/* The journey — readable, wrapping nodes (no tiny unreadable dots) */}
      <ol className="flex flex-wrap items-center gap-2" aria-label="Supply chain stages">
        {stages.map((stage, i) => {
          const isActive = i === active;
          return (
            <li key={stage.slug} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive ? "border-brand bg-brand/5" : "border-border hover:border-brand/40 hover:bg-muted/40",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold",
                    isActive ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {stage.position}
                </span>
                <span className={cn("text-sm font-semibold", isActive ? "text-brand" : "text-foreground")}>
                  {stage.label}
                </span>
              </button>
              {i < stages.length - 1 && (
                <span aria-hidden="true" className="text-brand/40">→</span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Details panel — progressive disclosure */}
      <div className="rounded-2xl border border-border bg-card p-6">
        {/* Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Stage {s.position} of {stages.length} · {s.segmentLabel}
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight">{s.label}</h3>
          </div>
          <Link
            href={s.href}
            className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open full stage page →
          </Link>
        </div>
        <p className="mt-2 text-muted-foreground">{s.tagline}</p>

        {/* Primary: what it is / why it matters */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold tracking-tight">What it is</h4>
            <p className="text-sm leading-relaxed text-foreground">{s.whatHappens}</p>
          </div>
          {s.whyItMatters && (
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold tracking-tight">Why it matters</h4>
              <p className="text-sm leading-relaxed text-foreground">{s.whyItMatters}</p>
            </div>
          )}
        </div>

        {/* Inputs / outputs */}
        {(s.inputs.length > 0 || s.outputs.length > 0) && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {s.inputs.length > 0 && (
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">↓ Inputs</h4>
                <div className="mt-2"><BulletList items={s.inputs} /></div>
              </div>
            )}
            {s.outputs.length > 0 && (
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">↑ Outputs</h4>
                <div className="mt-2"><BulletList items={s.outputs} /></div>
              </div>
            )}
          </div>
        )}

        {/* Companies — the key discovery, always visible */}
        {s.companies.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold tracking-tight">Companies</h4>
              <Chips items={s.companies.map((c) => ({ name: c.name, href: `/industry/companies/${c.slug}` }))} />
            </div>
            {s.indianCompanies.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold tracking-tight">Indian companies</h4>
                <Chips items={s.indianCompanies.map((c) => ({ name: c.name, href: `/industry/companies/${c.slug}` }))} />
              </div>
            )}
            {s.suppliers.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold tracking-tight">Suppliers to this stage</h4>
                <Chips items={s.suppliers.map((c) => ({ name: c.name, href: `/industry/companies/${c.slug}` }))} />
              </div>
            )}
          </div>
        )}

        {/* Secondary: technologies / equipment / materials (progressive disclosure) */}
        {(s.technologies.length > 0 || s.equipment.length > 0 || s.materials.length > 0) && (
          <details className="group mt-6 rounded-xl border border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-semibold">
              Technologies, equipment &amp; materials
              <span aria-hidden="true" className="text-muted-foreground transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="grid gap-6 border-t border-border p-4 sm:grid-cols-3">
              {s.technologies.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Technologies</h5>
                  <BulletList items={s.technologies} />
                </div>
              )}
              {s.equipment.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Equipment</h5>
                  <BulletList items={s.equipment} />
                </div>
              )}
              {s.materials.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Materials</h5>
                  <BulletList items={s.materials} />
                </div>
              )}
            </div>
          </details>
        )}

        {/* Deeper discovery: related stages, developments, opportunities */}
        <div className="mt-6 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
          {s.relatedStages.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold tracking-tight">Related stages</h4>
              <Chips items={s.relatedStages.map((r) => ({ name: r.name, href: `/supply-chain/${r.slug}` }))} />
            </div>
          )}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold tracking-tight">Recent developments</h4>
            {s.developments.length > 0 ? (
              <BulletList items={s.developments} />
            ) : (
              <p className="text-sm text-muted-foreground">No tracked India developments for this stage yet.</p>
            )}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Known gaps &amp; opportunities for this stage are compiled in{" "}
          <Link href="/opportunities" className="font-medium text-brand hover:underline">Opportunities →</Link>
        </p>
      </div>
    </div>
  );
}
