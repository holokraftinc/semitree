import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { indiaMarkers } from "@/lib/industry/geo";
import { SITE_KIND_LABELS, type SiteKind } from "@/lib/industry/types";

/**
 * "India semiconductor today" — a concise, data-backed intelligence strip built
 * from the publicly-announced India facilities in the verified company registry.
 * Each item answers what (the facility) and why it matters (its ecosystem role),
 * and links to the company. This is NOT a generic news feed and invents nothing.
 */

const WHY: Record<SiteKind, string> = {
  fab: "Adds domestic wafer-fabrication capacity.",
  atmp: "Builds domestic assembly, test & packaging capacity.",
  osat: "Builds domestic assembly & test capacity.",
  rd: "Expands India's chip-design and R&D base.",
  hq: "Grows India's semiconductor industry presence.",
  office: "Grows India's semiconductor industry presence.",
};

// Prefer the most significant facility kinds first.
const KIND_RANK: Record<SiteKind, number> = { fab: 0, atmp: 1, osat: 1, rd: 2, hq: 3, office: 4 };

export function IndiaToday() {
  const items = indiaMarkers()
    .map((m) => ({ company: m.company, point: m.point }))
    .sort((a, b) => KIND_RANK[a.point.kind] - KIND_RANK[b.point.kind])
    .slice(0, 6);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="india-today-h" className="border-b border-border bg-muted/20">
      <Container className="py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">India semiconductor today</p>
            <h2 id="india-today-h" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              What&rsquo;s taking shape on the ground
            </h2>
          </div>
          <Link href="/india" className="text-sm font-medium text-brand hover:underline">
            Explore India →
          </Link>
        </div>

        <ul className="mt-8 divide-y divide-border border-y border-border">
          {items.map(({ company, point }) => (
            <li key={company.slug + point.kind + point.city}>
              <Link
                href={`/industry/companies/${company.slug}`}
                className="group flex flex-col gap-1 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <div className="sm:w-40 sm:shrink-0">
                  <Badge variant="brand">{SITE_KIND_LABELS[point.kind]}</Badge>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground group-hover:text-brand">
                    {company.name}
                    {point.state ? ` — ${point.state}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">{WHY[point.kind]}</p>
                </div>
                <span aria-hidden="true" className="hidden text-brand sm:block">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-muted-foreground">
          Drawn from publicly announced facilities in Semitree&rsquo;s company registry. A richer, timestamped
          intelligence feed is in development.
        </p>
      </Container>
    </section>
  );
}
