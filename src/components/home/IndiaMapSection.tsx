import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { IndiaMap } from "@/components/industry/IndiaMap";

/**
 * Large India-map section — a signature visual, not a card. Reuses the real
 * IndiaMap (states, companies, facilities by bucket) and links to the full map.
 */
export function IndiaMapSection() {
  return (
    <section aria-labelledby="india-map-h" className="border-b border-border bg-muted/20">
      <Container className="py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">India semiconductor map</p>
            <h2 id="india-map-h" className="mt-2 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
              Fabs, ATMP, design centres and suppliers across India
            </h2>
          </div>
          <Link
            href="/industry/map/india"
            className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Explore India&rsquo;s semiconductor map →
          </Link>
        </div>

        <div className="mt-8">
          <IndiaMap />
        </div>
      </Container>
    </section>
  );
}
