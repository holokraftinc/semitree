"use client";

import { useState } from "react";
import Link from "next/link";
import type { RelationStep } from "@/lib/knowledge/supply-chain-explorer";
import { cn } from "@/lib/utils/cn";

/**
 * The relationship view: a single, fully real worked chain that shows how one
 * entity type leads to the next — Equipment → process → material → manufacturer
 * → facility → state → project → investment → insight. Progressive disclosure:
 * pick a hop to read what connects it to the next, then follow the link.
 */
export function RelationshipChain({ steps }: { steps: RelationStep[] }) {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <div className="space-y-6">
      <ol className="flex flex-wrap items-center gap-2" aria-label="Relationship chain">
        {steps.map((st, i) => {
          const isActive = i === active;
          return (
            <li key={st.lens} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={cn(
                  "flex flex-col rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive ? "border-brand bg-brand/5" : "border-border hover:border-brand/40 hover:bg-muted/40",
                )}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{st.lens}</span>
                <span className={cn("text-sm font-semibold", isActive ? "text-brand" : "text-foreground")}>{st.name}</span>
              </button>
              {i < steps.length - 1 && <span aria-hidden="true" className="text-brand/40">→</span>}
            </li>
          );
        })}
      </ol>

      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{step.lens}</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight">{step.name}</h3>
        <p className="mt-2 max-w-2xl text-muted-foreground">{step.detail}</p>
        <Link
          href={step.href}
          className="mt-4 inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Open {step.name} →
        </Link>
      </div>
    </div>
  );
}
