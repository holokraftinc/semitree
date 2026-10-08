import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SupplyChainExplorer } from "@/components/supply-chain/SupplyChainExplorer";
import { RelationshipChain } from "@/components/supply-chain/RelationshipChain";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import { SUPPLY_STAGES } from "@/lib/knowledge/supply-chain";
import { buildStageViews, RELATIONSHIP_CHAIN } from "@/lib/knowledge/supply-chain-explorer";
import { pageMeta, jsonLdGraph, breadcrumbLd, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor Supply Chain Explorer",
  description:
    "Walk the semiconductor supply chain from design to end markets. Tap any stage to see what it is, why it matters, its inputs and outputs, the technologies, equipment, materials, companies, Indian companies, and suppliers behind it — then follow the relationships into deeper discovery.",
  path: "/supply-chain",
});

export default function SupplyChainPage() {
  const stages = buildStageViews();

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
    <>
      {/* Hero */}
      <section className="border-b border-border">
        <Container className="py-14 sm:py-16">
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
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Semiconductors", href: "/explore" },
              { label: "Supply chain" },
            ]}
          />
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            Semiconductor Supply Chain Explorer
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            How a semiconductor moves from design to final product. Tap any stage to
            see what it is, why it matters, what goes in and out, and the companies,
            suppliers, and technologies behind it.
          </p>
        </Container>
      </section>

      <Container className="space-y-16 py-14">
        {/* The interactive journey */}
        <section aria-labelledby="explorer-h" className="space-y-6">
          <h2 id="explorer-h" className="text-xl font-semibold tracking-tight">The journey, stage by stage</h2>
          <SupplyChainExplorer stages={stages} />
        </section>

        {/* Relationship view */}
        <section aria-labelledby="relationship-h" className="space-y-5 border-t border-border pt-12">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Deeper discovery</p>
            <h2 id="relationship-h" className="text-xl font-semibold tracking-tight">Follow the relationships</h2>
            <p className="max-w-2xl text-muted-foreground">
              Every entity connects to the next. Walk one real chain — from a piece
              of equipment all the way to the insight that explains why it matters.
            </p>
          </div>
          <RelationshipChain steps={RELATIONSHIP_CHAIN} />
        </section>

        {/* Cross-links */}
        <section className="rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          See the{" "}
          <Link href="/manufacturing" className="font-medium text-brand hover:underline">Manufacturing Explorer</Link>{" "}
          for fab-level process detail, the{" "}
          <Link href="/industry" className="font-medium text-brand hover:underline">industry directory &amp; maps</Link>{" "}
          for the companies, and the{" "}
          <Link href="/india" className="font-medium text-brand hover:underline">India ecosystem</Link>{" "}
          for projects and investments. Following{" "}
          <Link href="/events/semicon-india-2026" className="font-medium text-brand hover:underline">SEMICON India 2026</Link>
          ? Its themes span this whole chain.
        </section>
      </Container>
    </>
  );
}
