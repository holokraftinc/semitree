import { MANUFACTURING_JOURNEY, JOURNEY_NOTE } from "@/lib/knowledge/manufacturing-journey";

/**
 * Renders the conceptual chip-manufacturing journey as a flow of steps, with the
 * current topic's step highlighted. Presentational and theme-aware; reused by
 * learning topics in their "Where it fits" section. Decorative arrows are hidden
 * from assistive tech; the highlighted step is marked with aria-current.
 */
export function ManufacturingJourney({ highlightId }: { highlightId?: string }) {
  return (
    <div className="space-y-3">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
        {MANUFACTURING_JOURNEY.map((step, i) => {
          const active = step.id === highlightId;
          return (
            <li key={step.id} className="flex items-center">
              <span
                aria-current={active ? "step" : undefined}
                className={
                  active
                    ? "rounded-full border border-brand bg-brand/10 px-3 py-1 text-sm font-semibold text-brand"
                    : "rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                }
              >
                {step.label}
              </span>
              {i < MANUFACTURING_JOURNEY.length - 1 && (
                <span aria-hidden="true" className="px-1 text-brand/40">→</span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-muted-foreground">{JOURNEY_NOTE}</p>
    </div>
  );
}
