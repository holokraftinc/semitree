import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { WorldMap } from "@/components/industry/WorldMap";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Global semiconductor map",
  description:
    "A global map of the semiconductor industry — foundries, fabless, IDMs, OSAT, EDA, equipment, and materials companies plotted by location.",
  path: "/industry/map",
});

export default function GlobalMapPage() {
  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industry", href: "/industry" },
            { label: "Global map" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Global semiconductor map</h1>
        <p className="max-w-2xl text-muted-foreground">
          Where the industry is. Filter by company type and tap a marker to see
          who&apos;s there. For India-specific fab, ATMP, and OSAT projects, see
          the{" "}
          <Link href="/industry/map/india" className="font-medium text-brand hover:underline">
            India map
          </Link>
          .
        </p>
      </div>

      <WorldMap />

      <p className="text-sm text-muted-foreground">
        Prefer a list? Browse the{" "}
        <Link href="/industry/companies" className="font-medium text-brand hover:underline">
          company directory
        </Link>
        .
      </p>
    </Container>
  );
}
