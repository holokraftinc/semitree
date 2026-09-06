import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SupplyChainFlow } from "@/components/supply-chain/SupplyChainFlow";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import { SUPPLY_STAGES } from "@/lib/knowledge/supply-chain";
import { pageMeta, jsonLdGraph, breadcrumbLd, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor Supply Chain Explorer",
  description:
    "Walk the semiconductor supply chain — from raw materials and silicon through EDA, chip design, equipment, fabrication, packaging, and testing to electronics and end markets. Each stage links to the companies, processes, tools, and concepts behind it.",
  path: "/supply-chain",
});

const ASPECTS = [
  "What happens here",
  "Who participates",
  "Technologies",
  "Equipment",
  "Materials",
  "Companies",
  "Skills",
  "Research",
];

export default function SupplyChainPage() {
  const itemListLd = {
    "@type": "ItemList",
    name: "Semiconductor supply chain stages",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: SUPPLY_STAGES.length,
    itemListElement: SUPPLY_STAGES.map((s) => ({
      "@type": "ListItem",
      position: s.order,
      name: s.name,
      url: new URL(`/supply-chain/${s.slug}`, SITE.url).toString(),
    })),
  };

  return (
    <Container className="space-y-10 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Semiconductors", path: "/explore" },
            { name: "Supply chain", path: "/supply-chain" },
          ]),
          itemListLd,
        ])}
      />
      <TrackView event="supply_chain_opened" payload={{}} />

      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Semiconductors", href: "/explore" },
            { label: "Supply chain" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Semiconductor Supply Chain Explorer
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          The semiconductor supply chain is one of the most complex in the world.
          Follow it end to end — from raw sand to end markets — and tap any stage
          to see who participates and the technologies, equipment, materials,
          companies, skills, and research behind it. Every stage links into the
          rest of Semitree.
        </p>
      </div>

      {/* What each stage shows */}
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <p className="text-sm font-semibold tracking-tight">Each stage answers:</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {ASPECTS.map((a) => (
            <li key={a} className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
              {a}
            </li>
          ))}
        </ul>
      </div>

      <section aria-label="Supply chain flow">
        <SupplyChainFlow />
      </section>

      <p className="text-sm text-muted-foreground">
        See also the{" "}
        <Link href="/manufacturing" className="font-medium text-brand hover:underline">
          Manufacturing Explorer
        </Link>{" "}
        for the fab-level process detail, and the{" "}
        <Link href="/industry" className="font-medium text-brand hover:underline">
          industry directory & maps
        </Link>{" "}
        for the companies.
      </p>
    </Container>
  );
}
