import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { COMPANIES } from "@/lib/industry/companies";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Industry",
  description:
    "The semiconductor industry on Semitree: companies, equipment, materials, and market segments — in development.",
  path: "/industry",
});

const SEGMENTS = [
  { title: "Foundries & IDMs", desc: "Who fabricates chips, and how the fabless model works." },
  { title: "Equipment", desc: "Lithography, deposition, etch, metrology toolmakers." },
  { title: "Materials", desc: "Wafers, photoresists, gases, and specialty chemicals." },
  { title: "Design & IP", desc: "EDA, IP cores, and chip-design services." },
  { title: "Packaging & test", desc: "Advanced packaging, assembly, and test houses." },
  { title: "Supply chain", desc: "How the ecosystem fits together, end to end." },
];

export default function IndustryPage() {
  return (
    <Container className="space-y-12 py-10">
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Industry" }]} />
        <h1 className="text-3xl font-bold tracking-tight">Industry</h1>
        <p className="max-w-2xl text-muted-foreground">
          A map of the semiconductor ecosystem — the segments, players, and how
          they connect. Explore the company directory and the global and India
          maps, all cross-linked to the knowledge base.
        </p>
      </div>

      {/* Directory + maps entry points */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/industry/companies" className="group rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50">
          <h2 className="font-semibold tracking-tight group-hover:text-brand">Company directory</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search & filter {COMPANIES.length} companies by category, country, state, and technology.
          </p>
        </Link>
        <Link href="/industry/map" className="group rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50">
          <h2 className="font-semibold tracking-tight group-hover:text-brand">Global map</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The worldwide industry, plotted by location and filterable by type.
          </p>
        </Link>
        <Link href="/industry/map/india" className="group rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50">
          <h2 className="font-semibold tracking-tight group-hover:text-brand">India map</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            India&apos;s fabs, ATMP/OSAT, and design centers by state.
          </p>
        </Link>
      </div>

      <Section headingId="segments" title="Segments" description="How the industry is structured.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SEGMENTS.map((s) => (
            <Card key={s.title}>
              <CardHeader>
                <CardTitle as="h2" className="text-base">{s.title}</CardTitle>
                <CardDescription>{s.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <div className="rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
        Listings use well-established public facts only, compiled from public
        sources — nothing auto-generated or fabricated. Locations are city-level.
        The microfluidics{" "}
        <ButtonLink href="/directory" variant="ghost" size="sm" className="px-1 underline">
          directory
        </ButtonLink>{" "}
        is separate.
      </div>
    </Container>
  );
}
