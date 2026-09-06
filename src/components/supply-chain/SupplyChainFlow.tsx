import { Fragment } from "react";
import Link from "next/link";
import { flowBySegment } from "@/lib/knowledge/supply-chain";

/**
 * The supply-chain flow: one continuous, connected timeline of the twelve stages,
 * grouped by segment. Reuses the `.flow-rail` connector (animated downward to
 * convey flow; disabled under prefers-reduced-motion). Every node links to its
 * stage page. Single-column layout works on mobile and desktop alike.
 */
export function SupplyChainFlow() {
  const flow = flowBySegment();

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-0.5 flow-rail" />

      <ol className="space-y-3">
        {flow.map(({ segment, stages }) => (
          <Fragment key={segment.id}>
            <li className="pl-14 pt-4 first:pt-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                {segment.label}
              </p>
              <p className="text-xs text-muted-foreground">{segment.summary}</p>
            </li>

            {stages.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/supply-chain/${s.slug}`}
                  className="group flex items-center gap-4 rounded-xl focus-visible:outline-none"
                >
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-background font-mono text-sm font-semibold text-brand shadow-sm transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground group-focus-visible:ring-2 group-focus-visible:ring-ring">
                    {s.order}
                  </span>
                  <span className="flex flex-1 items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-colors group-hover:border-brand/50">
                    <span className="min-w-0">
                      <span className="block font-semibold tracking-tight group-hover:text-brand">
                        {s.name}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{s.tagline}</span>
                    </span>
                    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                      <path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </Fragment>
        ))}
      </ol>
    </div>
  );
}
