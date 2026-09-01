import Link from "next/link";
import { QUICK_START_INTENTS, getTool } from "@/lib/data/tools";

/**
 * "What are you trying to do?" — task-first entry points that route straight to
 * the right calculator. Intents are data-driven (see tools.ts).
 */
export function QuickStart() {
  return (
    <section
      aria-labelledby="quick-start"
      className="rounded-2xl border border-border bg-muted/30 p-6"
    >
      <h2 id="quick-start" className="text-lg font-semibold tracking-tight">
        What are you trying to do?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Jump straight to the tool for the task.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_START_INTENTS.map((intent) => {
          const tool = getTool(intent.slug);
          if (!tool) return null;
          return (
            <li key={intent.slug}>
              <Link
                href={`/tools/${intent.slug}`}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="font-medium text-foreground">
                  {intent.label}
                </span>
                <span
                  aria-hidden="true"
                  className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                >
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
