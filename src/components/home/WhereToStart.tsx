"use client";

import { useState } from "react";
import Link from "next/link";
import { PERSONAS } from "@/lib/data/platform";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

/** Guided "I am a…" selector → data-driven recommendations. */
export function WhereToStart() {
  const [activeId, setActiveId] = useState(PERSONAS[0].id);
  const active = PERSONAS.find((p) => p.id === activeId)!;

  return (
    <section
      aria-labelledby="where-to-start"
      className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8"
    >
      <h2 id="where-to-start" className="text-2xl font-semibold tracking-tight">
        Where should I start?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">I am a…</p>

      <div
        role="tablist"
        aria-label="Choose your role"
        className="mt-4 flex flex-wrap gap-2"
      >
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={p.id === activeId}
            onClick={() => setActiveId(p.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              p.id === activeId
                ? "border-brand bg-brand/10 text-brand"
                : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-5" aria-live="polite">
        <p className="text-sm text-muted-foreground">{active.blurb}</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {active.recommendations.map((rec) =>
            rec.status === "live" && rec.href ? (
              <li key={rec.label}>
                <Link
                  href={rec.href}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="font-medium text-foreground">{rec.label}</span>
                  <span aria-hidden="true" className="text-brand">→</span>
                </Link>
              </li>
            ) : (
              <li key={rec.label}>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border px-4 py-3 text-sm">
                  <span className="text-muted-foreground">{rec.label}</span>
                  <Badge variant="neutral">Soon</Badge>
                </div>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
