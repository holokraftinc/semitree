import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RelatedEntities } from "@/components/graph/RelatedEntities";
import { RelationshipChain } from "@/components/supply-chain/RelationshipChain";
import { RELATIONSHIP_CHAIN } from "@/lib/knowledge/supply-chain-explorer";
import { FEATURED_NODES, getNode } from "@/lib/graph/graph";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Ecosystem knowledge graph",
  description:
    "How Semitree's entities connect — companies, technologies, equipment, materials, processes, facilities, states, projects, investments, insights, opportunities, learning topics, and tools, as one relationship layer.",
  path: "/ecosystem",
});

// The core relationship model (entity → relationship → entity), from the spec.
const RELATIONSHIP_MODEL = [
  { from: "Company", verb: "operates in", to: "Technology" },
  { from: "Technology", verb: "requires", to: "Equipment" },
  { from: "Equipment", verb: "uses", to: "Material" },
  { from: "Material", verb: "supports", to: "Process" },
  { from: "Process", verb: "occurs at", to: "Facility" },
  { from: "Facility", verb: "located in", to: "State" },
  { from: "State", verb: "part of", to: "Project" },
  { from: "Project", verb: "covered by", to: "Insight" },
  { from: "Insight", verb: "identifies", to: "Problem" },
  { from: "Problem", verb: "may create", to: "Opportunity" },
];

const ENTITIES = [
  "Technology", "Company", "Supplier", "Equipment", "Material", "Process", "Facility",
  "State", "Project", "Investment", "Insight", "Opportunity", "Problem", "Learning topic", "Tool",
];

export default function EcosystemPage() {
  return (
    <>
      <section className="border-b border-border">
        <Container className="py-14 sm:py-16">
          <JsonLd data={jsonLdGraph([breadcrumbLd([{ name: "Home", path: "/" }, { name: "Ecosystem graph", path: "/ecosystem" }])])} />
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Ecosystem graph" }]} />
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            Ecosystem knowledge graph
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything on Semitree is connected. This is the relationship layer
            underneath — pick any entity and follow how it links to the rest of
            the ecosystem. (A visual graph can sit on top of this later; the
            relationships come first.)
          </p>
        </Container>
      </section>

      <Container className="space-y-16 py-14">
        {/* The relationship model */}
        <section aria-labelledby="model-h" className="space-y-5">
          <h2 id="model-h" className="text-xl font-semibold tracking-tight">The relationship model</h2>
          <div className="flex flex-wrap gap-1.5">
            {ENTITIES.map((e) => (
              <span key={e} className="rounded-full border border-border bg-card px-3 py-1 text-sm font-medium">{e}</span>
            ))}
          </div>
          <ol className="grid gap-2 sm:grid-cols-2">
            {RELATIONSHIP_MODEL.map((r) => (
              <li key={r.from + r.to} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm">
                <span className="font-semibold">{r.from}</span>
                <span className="text-xs italic text-muted-foreground">{r.verb}</span>
                <span aria-hidden="true" className="text-brand/50">→</span>
                <span className="font-semibold">{r.to}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Worked example path */}
        <section aria-labelledby="path-h" className="space-y-5 border-t border-border pt-12">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Follow a thread</p>
            <h2 id="path-h" className="text-xl font-semibold tracking-tight">One real path through the graph</h2>
            <p className="max-w-2xl text-muted-foreground">
              From a piece of equipment all the way to the insight that explains why it matters — every hop is a real link.
            </p>
          </div>
          <RelationshipChain steps={RELATIONSHIP_CHAIN} />
        </section>

        {/* Featured neighbourhoods */}
        <section aria-labelledby="neighbourhoods-h" className="space-y-5 border-t border-border pt-12">
          <div className="space-y-2">
            <h2 id="neighbourhoods-h" className="text-xl font-semibold tracking-tight">Explore a neighbourhood</h2>
            <p className="max-w-2xl text-muted-foreground">
              Every entity carries its own set of connections. Here are a few starting points — each entity page across Semitree shows the same relationships.
            </p>
          </div>
          <div className="space-y-5">
            {FEATURED_NODES.map((ref) => {
              const n = getNode(ref);
              return n ? <RelatedEntities key={`${ref.type}:${ref.id}`} node={ref} /> : null;
            })}
          </div>
        </section>

        <p className="text-sm text-muted-foreground">
          The relationships power the related sections across{" "}
          <Link href="/supply-chain" className="font-medium text-brand hover:underline">supply chain</Link>,{" "}
          <Link href="/industry/companies" className="font-medium text-brand hover:underline">companies</Link>,{" "}
          <Link href="/india" className="font-medium text-brand hover:underline">India</Link>,{" "}
          <Link href="/insights" className="font-medium text-brand hover:underline">insights</Link>, and{" "}
          <Link href="/opportunities" className="font-medium text-brand hover:underline">opportunities</Link>.
        </p>
      </Container>
    </>
  );
}
