import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ValueChainJourney, type ValueChainNode } from "@/components/home/ValueChainJourney";
import { COMPANIES } from "@/lib/industry/companies";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Explore the Semiconductor Industry",
  description:
    "Understand how technologies, companies, equipment, materials and manufacturing capabilities connect — follow the value chain from design to end markets.",
  path: "/industry",
});

/**
 * The industry value chain, as the spec lays it out — each node links to its
 * existing /supply-chain/<slug> stage page (all slugs verified against
 * SUPPLY_STAGES). The homepage journey uses the component's own defaults; here
 * we pass the full ten-stage industry flow.
 */
const VALUE_CHAIN: ValueChainNode[] = [
  { label: "Design", slug: "chip-design", blurb: "Turning a product idea into a manufacturable chip architecture and layout." },
  { label: "EDA / IP", slug: "eda", blurb: "The design software and reusable IP blocks that make modern chips possible." },
  { label: "Equipment", slug: "semiconductor-equipment", blurb: "The machines that pattern, deposit, etch, implant, and inspect wafers." },
  { label: "Materials", slug: "raw-materials", blurb: "Silicon, gases, photoresists, and specialty chemicals the fab consumes." },
  { label: "Wafer", slug: "wafer-manufacturing", blurb: "Growing crystal ingots and slicing them into polished silicon wafers." },
  { label: "Fabrication", slug: "fab", blurb: "Building the transistors and interconnect layer by layer on the wafer." },
  { label: "Packaging", slug: "packaging", blurb: "Turning finished dies into protected, connectable components." },
  { label: "Testing", slug: "testing", blurb: "Proving each die and package works before it ships." },
  { label: "Electronics", slug: "electronics", blurb: "Chips become boards, modules, systems, and finished products." },
  { label: "End markets", slug: "end-markets", blurb: "Where finished electronics reach phones, cars, data centres, and more." },
];

export default function IndustryPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border">
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Industry" }]} />
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            Explore the Semiconductor Industry
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Understand how technologies, companies, equipment, materials and
            manufacturing capabilities connect.
          </p>
        </Container>
      </section>

      {/* The clickable value chain (reuses the interactive journey) */}
      <ValueChainJourney
        nodes={VALUE_CHAIN}
        eyebrow="How the industry works"
        title="Follow the value chain, stage by stage"
        intro="The semiconductor industry is a chain of specialised stages, each dependent on the one before it. Select any stage to see what happens there, the technologies and equipment involved, and the companies that operate in it."
      />

      <Container className="space-y-12 py-16">
        {/* Directory + maps entry points */}
        <section aria-labelledby="explore-h" className="space-y-5">
          <h2 id="explore-h" className="text-xl font-semibold tracking-tight">
            Explore the players
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/industry/companies" className="group rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50">
              <h3 className="font-semibold tracking-tight group-hover:text-brand">Company directory</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Search &amp; filter {COMPANIES.length} companies by type, segment, location, technology, facility, and capability.
              </p>
            </Link>
            <Link href="/suppliers" className="group rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50">
              <h3 className="font-semibold tracking-tight group-hover:text-brand">Supplier directory</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Equipment, chemicals, wafers, materials, testing, and the wider support base.
              </p>
            </Link>
            <Link href="/industry/map" className="group rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50">
              <h3 className="font-semibold tracking-tight group-hover:text-brand">Global map</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The worldwide industry, plotted by location and filterable by type.
              </p>
            </Link>
            <Link href="/industry/map/india" className="group rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50">
              <h3 className="font-semibold tracking-tight group-hover:text-brand">India map</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                India&apos;s fabs, ATMP/OSAT, and design centres by state.
              </p>
            </Link>
          </div>
        </section>

        {/* All stages (full chain, including intermediate stages) */}
        <section aria-labelledby="stages-h" className="space-y-3">
          <h2 id="stages-h" className="text-xl font-semibold tracking-tight">
            Every stage, end to end
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Prefer the full picture? The supply-chain explorer walks the complete
            sequence, including intermediate stages, with cross-links to processes,
            concepts, tools, and companies.
          </p>
          <Link
            href="/supply-chain"
            className="inline-flex items-center gap-1 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open the supply-chain explorer →
          </Link>
        </section>

        {/* SEMICON pointer */}
        <p className="max-w-2xl text-sm text-muted-foreground">
          Following{" "}
          <Link href="/events/semicon-india-2026" className="font-medium text-brand hover:underline">
            SEMICON India 2026
          </Link>
          ? Explore the companies and ecosystem behind the event.
        </p>

        {/* Honesty note */}
        <div className="rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          Listings use well-established public facts only, compiled from public
          sources — nothing auto-generated or fabricated. Locations are city-level.
          The microfluidics{" "}
          <Link href="/directory" className="font-medium text-brand underline hover:no-underline">
            directory
          </Link>{" "}
          is separate.
        </div>
      </Container>
    </>
  );
}
