import Link from "next/link";

/**
 * The full conceptual "wafer → working chip" learning journey. Steps that have
 * a matching learning topic are clickable and route to it (existing routes
 * only); conceptual steps (repeat, cleaning, system) are shown but not linked.
 * This is a teaching map, not a literal one-pass manufacturing flow.
 */

interface JourneyStep {
  label: string;
  href?: string;
  /** Marks the four flagship deep-dive topics. */
  flagship?: boolean;
  /** A conceptual, non-process step (repeat / system), styled distinctly. */
  concept?: boolean;
}

const STEPS: JourneyStep[] = [
  { label: "Design", href: "/semiconductors/design" },
  { label: "Wafer", href: "/semiconductors/learn/wafer" },
  { label: "Deposition", href: "/semiconductors/learn/etching", flagship: true },
  { label: "Photolithography", href: "/semiconductors/learn/lithography", flagship: true },
  { label: "Etching", href: "/semiconductors/learn/etching", flagship: true },
  { label: "Doping", href: "/semiconductors/learn/ion-implantation", flagship: true },
  { label: "Cleaning / processing" },
  { label: "Repeat many times", concept: true },
  { label: "Interconnects", href: "/semiconductors/learn/metallization" },
  { label: "Wafer test", href: "/semiconductors/learn/wafer-test" },
  { label: "Dicing", href: "/semiconductors/learn/dicing" },
  { label: "Packaging", href: "/semiconductors/learn/packaging", flagship: true },
  { label: "Final test", href: "/semiconductors/learn/final-test" },
  { label: "System", concept: true },
];

export function SemiconductorJourney() {
  return (
    <div className="space-y-3">
      <ol className="space-y-0">
        {STEPS.map((step, i) => {
          const isLast = i === STEPS.length - 1;
          const inner = (
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={
                    step.concept
                      ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-xs text-muted-foreground"
                      : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-semibold text-brand"
                  }
                >
                  {step.concept ? "↻" : i + 1}
                </span>
                <span className="text-sm font-medium">{step.label}</span>
                {step.flagship && (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                    Topic
                  </span>
                )}
              </span>
              {step.href && <span aria-hidden="true" className="text-brand">→</span>}
            </div>
          );

          return (
            <li key={step.label + i}>
              {step.href ? (
                <Link
                  href={step.href}
                  className="block rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-brand/50 hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {inner}
                </Link>
              ) : (
                <div
                  className={
                    step.concept
                      ? "rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3"
                      : "rounded-lg border border-border bg-muted/30 px-4 py-3"
                  }
                >
                  {inner}
                </div>
              )}
              {!isLast && (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <span className="text-brand/40">↓</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-muted-foreground">
        A conceptual learning map — real manufacturing flows are far more complex, repeat and interleave
        many of these steps, and vary by process and product. Steps marked <span className="font-semibold text-brand">Topic</span> open a full learning topic.
      </p>
    </div>
  );
}
