import { cn } from "@/lib/utils/cn";

type Segment = { label: string; value: number; className: string; dot: string };

/**
 * Visual representation of the Poisson loading distribution: a single stacked
 * bar (100% of droplets) split into empty / single / multi segments, plus an
 * accessible legend with percentages.
 */
export function PoissonBar({
  p0,
  p1,
  p2OrMore,
}: {
  p0: number;
  p1: number;
  p2OrMore: number;
}) {
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const segments: Segment[] = [
    { label: "Empty (0 cells)", value: p0, className: "bg-muted-foreground/40", dot: "bg-muted-foreground/40" },
    { label: "Single (1 cell)", value: p1, className: "bg-brand", dot: "bg-brand" },
    { label: "Multiple (2+ cells)", value: p2OrMore, className: "bg-warning", dot: "bg-warning" },
  ];

  return (
    <div className="space-y-3">
      <div
        className="flex h-8 w-full overflow-hidden rounded-md border border-border"
        role="img"
        aria-label={`Droplet occupancy: ${pct(p0)} empty, ${pct(p1)} single-cell, ${pct(
          p2OrMore,
        )} multiple cells.`}
      >
        {segments.map((s) => (
          <div
            key={s.label}
            className={cn("h-full", s.className)}
            style={{ width: pct(s.value) }}
            title={`${s.label}: ${pct(s.value)}`}
          />
        ))}
      </div>
      <ul className="grid gap-2 sm:grid-cols-3">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className={cn("h-3 w-3 shrink-0 rounded-sm", s.dot)}
            />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="ml-auto font-mono font-medium text-foreground">
              {pct(s.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
