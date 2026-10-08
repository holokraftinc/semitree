import Link from "next/link";

/**
 * Reusable "what else is related" rail. Every major page can eventually render
 * Related Topics / Companies / Technologies / Insights / Projects / Opportunities
 * by passing the groups it has. Empty groups are skipped, so a page shows only
 * what it can actually link today — the architecture is here; cross-links are
 * filled in over later phases.
 */
export interface RelatedLink {
  label: string;
  href: string;
}
export interface RelatedGroup {
  title: string;
  links: RelatedLink[];
}

export function RelatedRail({ groups }: { groups: RelatedGroup[] }) {
  const present = groups.filter((g) => g.links.length > 0);
  if (present.length === 0) return null;

  return (
    <section aria-labelledby="related-h" className="space-y-4 border-t border-border pt-8">
      <h2 id="related-h" className="text-lg font-semibold tracking-tight">Related</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {present.map((g) => (
          <div key={g.title} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.title}</p>
            <ul className="space-y-1">
              {g.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
