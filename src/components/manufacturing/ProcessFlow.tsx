import { Fragment } from "react";
import Link from "next/link";
import { flowByStage } from "@/lib/knowledge/manufacturing";

/**
 * The manufacturing flow: one continuous, vertically-connected timeline of every
 * process, grouped by stage. The connector rail animates downward to communicate
 * flow direction (raw material → finished chip); the motion is disabled under
 * prefers-reduced-motion. Every node is a link to its process page. The single-
 * column timeline works identically on mobile and desktop.
 */
export function ProcessFlow() {
  const flow = flowByStage();

  return (
    <div className="relative">
      {/* Animated flow rail, centered under the number badges. */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-[19px] top-6 w-0.5 flow-rail"
      />

      <ol className="space-y-3">
        {flow.map(({ stage, processes }) => (
          <Fragment key={stage.id}>
            <li className="pl-14 pt-4 first:pt-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                {stage.label}
              </p>
              <p className="text-xs text-muted-foreground">{stage.summary}</p>
            </li>

            {processes.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/manufacturing/${p.slug}`}
                  className="group flex items-center gap-4 rounded-xl focus-visible:outline-none"
                >
                  {/* Numbered node sitting on the rail. */}
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-background font-mono text-sm font-semibold text-brand shadow-sm transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground group-focus-visible:ring-2 group-focus-visible:ring-ring">
                    {p.order}
                  </span>

                  <span className="flex flex-1 items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-colors group-hover:border-brand/50">
                    <span className="min-w-0">
                      <span className="block font-semibold tracking-tight group-hover:text-brand">
                        {p.name}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {p.tagline}
                      </span>
                    </span>
                    <svg
                      viewBox="0 0 20 20"
                      className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      aria-hidden="true"
                    >
                      <path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </Fragment>
        ))}

        {/* End cap: the finished, ship-ready chip. */}
        <li className="flex items-center gap-4 pt-1">
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-success/40 bg-success/10 text-success">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            Packaged, tested chip — ready to ship.
          </span>
        </li>
      </ol>
    </div>
  );
}
