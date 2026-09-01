import Link from "next/link";

/**
 * The differentiator section: shows the two-way wiring between a Learn concept
 * and the calculator that applies it.
 */
export function LearnToCalculate() {
  return (
    <section
      aria-labelledby="learn-to-calculate"
      className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-10"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="learn-to-calculate"
          className="text-2xl font-semibold tracking-tight"
        >
          Learn ↔ Calculate
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The core idea: reading and computing live side by side. Follow the link
          in either direction.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/concepts"
          className="rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Concept
          </p>
          <p className="mt-1 text-base font-semibold">
            Laminar flow & low Reynolds number
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Understand why microscale flow is orderly, not turbulent.
          </p>
        </Link>

        <div
          aria-hidden="true"
          className="flex items-center justify-center text-2xl text-brand"
        >
          <span className="hidden sm:inline">⇄</span>
          <span className="sm:hidden">↕</span>
        </div>

        <Link
          href="/tools/reynolds-number"
          className="rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Calculator
          </p>
          <p className="mt-1 text-base font-semibold">Reynolds number</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Plug in your channel and check laminar vs turbulent instantly.
          </p>
        </Link>
      </div>
    </section>
  );
}
