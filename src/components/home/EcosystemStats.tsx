import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { COMPANIES } from "@/lib/industry/companies";
import { indiaMarkers } from "@/lib/industry/geo";
import type { CompanyType } from "@/lib/industry/types";

/**
 * Companies & suppliers — real statistics derived from the verified registry.
 * Nothing is hardcoded; counts come from the data and move as it grows. Labels
 * are precise so no figure is misleading.
 */

const SUPPLIER_TYPES = new Set<CompanyType>(["equipment", "materials", "chemicals", "silicon-wafers", "distributor"]);
const FACILITY_KINDS = new Set(["fab", "atmp", "osat", "rd"]);

export function EcosystemStats() {
  const companiesMapped = COMPANIES.length;
  const suppliers = COMPANIES.filter((c) => c.types.some((t) => SUPPLIER_TYPES.has(t))).length;

  const inIndia = indiaMarkers();
  const indiaFacilities = inIndia.filter((m) => FACILITY_KINDS.has(m.point.kind)).length;
  const statesCovered = new Set(inIndia.map((m) => m.point.state).filter(Boolean)).size;

  const stats = [
    { value: companiesMapped, label: "Companies mapped" },
    { value: suppliers, label: "Suppliers & materials firms" },
    { value: indiaFacilities, label: "India facilities tracked" },
    { value: statesCovered, label: "Indian states covered" },
  ];

  return (
    <section aria-labelledby="stats-h" className="border-b border-border">
      <Container className="py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Companies &amp; suppliers</p>
            <h2 id="stats-h" className="mt-2 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
              A growing, verified map of who does what
            </h2>
          </div>
          <Link href="/companies" className="text-sm font-medium text-brand hover:underline">
            Browse companies →
          </Link>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{s.value}</span>
                <span className="mt-2 block text-sm text-muted-foreground">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 max-w-2xl text-xs text-muted-foreground">
          Compiled from public sources and verified before listing. Figures update as the registry grows — no numbers are
          invented.
        </p>
      </Container>
    </section>
  );
}
