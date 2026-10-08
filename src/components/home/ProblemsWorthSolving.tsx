import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";

/**
 * "Problems worth solving" — the focus areas where the ecosystem has gaps.
 * These are areas, not fabricated claims: the evidence-backed specifics live in
 * the Opportunities project as it is built. Each tile links to Opportunities.
 */
const AREAS = [
  "Supplier qualification",
  "Equipment availability",
  "Materials",
  "Talent",
  "Manufacturing",
  "Procurement",
  "Data",
  "Infrastructure",
];

export function ProblemsWorthSolving() {
  return (
    <section aria-labelledby="problems-h" className="border-b border-border">
      <Container className="py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Problems worth solving</p>
            <h2 id="problems-h" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Where the ecosystem needs builders
            </h2>
            <p className="mt-3 text-muted-foreground">
              Evidence-backed gaps across the value chain — the areas where new suppliers, tools, and companies can make
              the biggest difference. Specifics are added as the evidence is compiled.
            </p>
          </div>
          <Link
            href="/opportunities"
            className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Explore industry problems →
          </Link>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((area) => (
            <li key={area}>
              <Link href="/opportunities" className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Card className="h-full p-4 transition-colors group-hover:border-brand/50">
                  <span className="text-sm font-semibold text-foreground group-hover:text-brand">{area}</span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
