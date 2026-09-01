import { cn } from "@/lib/utils/cn";

export type ResultItem = {
  label: string;
  /** Pre-formatted value string (formatting is the caller's concern). */
  value: string;
  unit?: string;
  /** Highlight the primary result. */
  primary?: boolean;
};

/**
 * Displays one or more computed results. Presentational only — it receives
 * already-formatted strings and never computes anything.
 */
export function ResultCard({
  results,
  title = "Result",
  className,
  empty = "Enter values and calculate to see the result.",
}: {
  results: ResultItem[];
  title?: string;
  className?: string;
  empty?: string;
}) {
  const hasResults = results.length > 0;
  return (
    <div
      aria-live="polite"
      className={cn(
        "rounded-xl border border-brand/30 bg-brand/5 p-5",
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-brand">
        {title}
      </p>
      {hasResults ? (
        <dl className="mt-3 space-y-3">
          {results.map((r) => (
            <div
              key={r.label}
              className="flex items-baseline justify-between gap-4"
            >
              <dt className="text-sm text-muted-foreground">{r.label}</dt>
              <dd
                className={cn(
                  "text-right font-mono tabular-nums",
                  r.primary
                    ? "text-2xl font-semibold text-foreground"
                    : "text-base text-foreground",
                )}
              >
                {r.value}
                {r.unit && (
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    {r.unit}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{empty}</p>
      )}
    </div>
  );
}
