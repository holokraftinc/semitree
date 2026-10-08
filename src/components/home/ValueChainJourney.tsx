"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * The signature "Explore the ecosystem" element: an interactive value-chain
 * journey from design to end markets. Selecting a stage reveals how it connects
 * to the rest of Semitree (companies, technologies, suppliers, insights,
 * projects, opportunities) and links to the stage's own page. Connections
 * currently route to the section hubs — the per-stage wiring is filled in later.
 */

export interface ValueChainNode {
  label: string;
  /** /supply-chain/<slug> stage page. */
  slug: string;
  blurb: string;
}

const NODES: ValueChainNode[] = [
  { label: "Design", slug: "chip-design", blurb: "Turning an idea into a manufacturable chip design." },
  { label: "EDA / IP", slug: "eda", blurb: "The software and reusable IP that make design possible." },
  { label: "Equipment", slug: "semiconductor-equipment", blurb: "The machines that pattern, deposit, etch, and test." },
  { label: "Materials", slug: "raw-materials", blurb: "Silicon, gases, chemicals, and specialty materials." },
  { label: "Fab", slug: "fab", blurb: "Building transistors and wiring on the wafer." },
  { label: "Packaging", slug: "packaging", blurb: "Turning dies into usable, connected components." },
  { label: "Testing", slug: "testing", blurb: "Proving each chip works before it ships." },
  { label: "Electronics", slug: "electronics", blurb: "Chips become boards, systems, and products." },
  { label: "End markets", slug: "end-markets", blurb: "Where finished electronics reach the world." },
];

const CONNECTIONS = [
  { label: "Companies", href: "/industry/companies" },
  { label: "Technologies", href: "/semiconductors/learn" },
  { label: "Suppliers", href: "/companies" },
  { label: "Insights", href: "/insights" },
  { label: "Projects", href: "/projects" },
  { label: "Opportunities", href: "/opportunities" },
];

export interface ValueChainJourneyProps {
  nodes?: ValueChainNode[];
  eyebrow?: string;
  title?: string;
  intro?: string;
}

export function ValueChainJourney({
  nodes = NODES,
  eyebrow = "Explore the ecosystem",
  title = "Follow the value chain, from design to end markets",
  intro = "Every stage connects to the companies, technologies, and opportunities around it. Select a stage to see how it fits together.",
}: ValueChainJourneyProps = {}) {
  const [active, setActive] = useState(0);
  const node = nodes[active];

  return (
    <section aria-labelledby="valuechain-h" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
        <h2 id="valuechain-h" className="mt-2 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {intro}
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          {/* The journey rail */}
          <ol className="relative" aria-label="Value chain stages">
            {nodes.map((n, i) => {
              const isActive = i === active;
              return (
                <li key={n.slug} className="relative">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "border-brand bg-brand/5"
                        : "border-border hover:border-brand/40 hover:bg-muted/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold",
                        isActive ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className={cn("text-sm font-semibold", isActive ? "text-brand" : "text-foreground")}>
                      {n.label}
                    </span>
                  </button>
                  {i < nodes.length - 1 && (
                    <div aria-hidden="true" className="flex justify-start py-0.5 pl-[1.85rem]">
                      <span className="text-brand/40">↓</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {/* The detail panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Stage {active + 1} of {nodes.length}
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">{node.label}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{node.blurb}</p>

              <Link
                href={`/supply-chain/${node.slug}`}
                className="mt-4 inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Open {node.label} →
              </Link>

              <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Connects to</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {CONNECTIONS.map((c) => (
                  <li key={c.label}>
                    <Link
                      href={c.href}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {c.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
