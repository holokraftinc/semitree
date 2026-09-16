import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "The semiconductor ecosystem — equipment, materials, supply chain & industry",
  description:
    "How semiconductor manufacturing depends on a global ecosystem: the equipment and materials value chains, the roles of fabless, foundry, IDM and OSAT, and India's semiconductor ecosystem via the India Semiconductor Mission.",
  path: "/semiconductors/ecosystem",
});

/** The full learning chain, from the underlying technology to the industry. */
const CHAIN: { label: string; href: string }[] = [
  { label: "Technology", href: "/semiconductors/concepts" },
  { label: "Process", href: "/manufacturing" },
  { label: "Equipment", href: "/semiconductors/equipment" },
  { label: "Materials", href: "/semiconductors/materials" },
  { label: "Manufacturing", href: "/manufacturing" },
  { label: "Packaging", href: "/semiconductors/packaging" },
  { label: "Testing", href: "/semiconductors/equipment#testing" },
  { label: "Supply chain", href: "/supply-chain" },
  { label: "Industry", href: "/industry" },
];

const EQUIPMENT_CATEGORIES: { label: string; href: string }[] = [
  { label: "Lithography", href: "/semiconductors/equipment/lithography" },
  { label: "Deposition", href: "/semiconductors/equipment/deposition" },
  { label: "Etch", href: "/semiconductors/equipment/etching" },
  { label: "Metrology", href: "/semiconductors/equipment/metrology" },
  { label: "Inspection", href: "/semiconductors/equipment/inspection" },
  { label: "Packaging", href: "/semiconductors/equipment#packaging" },
  { label: "Testing", href: "/semiconductors/equipment#testing" },
];

const EQUIPMENT_VALUE_CHAIN = [
  "Equipment manufacturer",
  "Semiconductor manufacturer",
  "Foundry / IDM / OSAT",
  "Final device",
];

const MATERIALS_FLOW: { label: string; href?: string }[] = [
  { label: "Raw material", href: "/supply-chain" },
  { label: "Specialty material", href: "/supply-chain" },
  { label: "Process material", href: "/semiconductors/materials" },
  { label: "Wafer fabrication", href: "/manufacturing" },
  { label: "Packaging", href: "/semiconductors/packaging" },
  { label: "Testing", href: "/semiconductors/equipment#testing" },
];

const MATERIAL_REQUIREMENTS: { name: string; detail: string }[] = [
  { name: "Purity", detail: "Trace contaminants become electrical defects, so many materials must be extraordinarily pure." },
  { name: "Consistency", detail: "Lot-to-lot uniformity keeps a qualified process stable across millions of wafers." },
  { name: "Contamination control", detail: "Particles and stray elements are handled from source to point of use." },
  { name: "Supply reliability", detail: "A single interrupted material can halt a fab, so redundancy and continuity matter." },
  { name: "Qualification", detail: "New materials and sources must be qualified against a process before use — a slow, deliberate step." },
  { name: "Process compatibility", detail: "A material must fit the whole flow (thermal budget, adjacent layers, tools), not just its own step." },
];

const INDUSTRY_ROLES: { name: string; detail: string }[] = [
  { name: "Fabless", detail: "Designs chips but outsources their manufacturing." },
  { name: "Foundry", detail: "Manufactures wafers for others (does not sell its own branded chips)." },
  { name: "IDM", detail: "Integrated device manufacturer — designs and fabricates its own chips." },
  { name: "OSAT / ATMP", detail: "Outsourced assembly and test / assembly, test, marking and packaging providers." },
  { name: "Equipment suppliers", detail: "Build the tools that fabs and assembly houses run." },
  { name: "Materials suppliers", detail: "Provide the wafers, chemicals, gases, and consumables the flow depends on." },
];

const INDIA_BUILDING_BLOCKS: { name: string; detail: string }[] = [
  { name: "Wafer fabs", detail: "Front-end fabrication facilities that build devices on wafers." },
  { name: "OSAT / ATMP", detail: "Assembly, test, marking and packaging facilities that turn dies into finished parts." },
  { name: "Design ecosystem", detail: "Chip design companies, talent, and design-linked incentives." },
  { name: "Materials & equipment", detail: "The supporting supply of materials, chemicals, gases, and tools." },
];

function FlowPills({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
      {items.map((it, i) => (
        <span key={`${it.label}-${i}`} className="flex items-center">
          {it.href ? (
            <Link
              href={it.href}
              className="rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {it.label}
            </Link>
          ) : (
            <span className="rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground">
              {it.label}
            </span>
          )}
          {i < items.length - 1 && (
            <span aria-hidden="true" className="px-1 text-brand/50">→</span>
          )}
        </span>
      ))}
    </div>
  );
}

function DefGrid({ items }: { items: { name: string; detail: string }[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map((p) => (
        <div key={p.name}>
          <dt className="text-sm font-semibold text-foreground">{p.name}</dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{p.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-20 space-y-4">
      <h2 id={`${id}-h`} className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default function SemiconductorEcosystemPage() {
  return (
    <Container className="space-y-10 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Explore", path: "/explore" },
            { name: "Ecosystem", path: "/semiconductors/ecosystem" },
          ]),
        ])}
      />
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Explore", href: "/explore" },
            { label: "Ecosystem" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">The semiconductor ecosystem</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          No single company or country makes a chip alone. Semiconductor
          manufacturing depends on a global ecosystem — the tools, the materials,
          the manufacturers, and the supply chain that connects them.
        </p>
      </div>

      {/* The full learning chain */}
      <Section id="chain" title="The learning chain">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Everything on Semitree connects along one chain — from the underlying
          technology to the industry that delivers it. Follow any step.
        </p>
        <FlowPills items={CHAIN} />
      </Section>

      {/* Equipment ecosystem */}
      <Section id="equipment" title="The equipment ecosystem">
        <p className="max-w-2xl text-sm leading-relaxed text-foreground">
          Fabs run on categories of process and support equipment. Each is a
          type of tool, not a single company — the machines below come from a
          range of suppliers.
        </p>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {c.label} →
            </Link>
          ))}
        </div>
        <Card className="bg-muted/20 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            From tool to device
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            A tool travels a long way to a finished product: the equipment maker
            builds it, a semiconductor manufacturer installs and runs it, that
            manufacturer may be a foundry, IDM, or OSAT, and the result is a
            device in a system. Each role depends on the others.
          </p>
          <div className="mt-3">
            <FlowPills items={EQUIPMENT_VALUE_CHAIN.map((label) => ({ label }))} />
          </div>
        </Card>
        <p className="text-sm text-muted-foreground">
          Which vendor supplies a given category — and how strong each one is —
          lives in the{" "}
          <Link href="/industry" className="font-medium text-brand hover:underline">industry section</Link>, not
          in these learning pages. This page teaches the categories; it is not a
          ranking of companies.
        </p>
      </Section>

      {/* Materials ecosystem */}
      <Section id="materials" title="The materials ecosystem">
        <p className="max-w-2xl text-sm leading-relaxed text-foreground">
          Materials flow from raw inputs through progressively more specialized
          forms, into wafer fabrication, packaging, and test.
        </p>
        <FlowPills items={MATERIALS_FLOW} />
        <div className="pt-2">
          <h3 className="text-sm font-semibold text-foreground">
            Why semiconductor materials are demanding
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Semiconductor materials routinely carry stringent requirements — a
            large part of why the supply chain is specialized and concentrated.
          </p>
          <div className="mt-3">
            <DefGrid items={MATERIAL_REQUIREMENTS} />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/semiconductors/materials" className="font-medium text-brand hover:underline">Materials hub →</Link>
          <Link href="/supply-chain" className="font-medium text-brand hover:underline">Supply chain →</Link>
        </div>
      </Section>

      {/* Industry connection */}
      <Section id="industry" title="The industry: who does what">
        <p className="max-w-2xl text-sm leading-relaxed text-foreground">
          The industry is organized by role, not just by name. These are
          categories of company — many real companies combine several.
        </p>
        <DefGrid items={INDUSTRY_ROLES} />
        <Alert variant="info" title="On naming companies">
          Company capabilities change over time, and marketing claims are not
          technical facts. Semitree keeps specific companies in the industry
          directory (with context) rather than baking them into learning pages —
          so a category here is never a stand-in for one vendor.
        </Alert>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/industry" className="font-medium text-brand hover:underline">Industry →</Link>
          <Link href="/industry/companies" className="font-medium text-brand hover:underline">Company directory →</Link>
          <Link href="/industry/map" className="font-medium text-brand hover:underline">Global map →</Link>
        </div>
      </Section>

      {/* India connection */}
      <Section id="india" title="India in the semiconductor ecosystem">
        <p className="max-w-2xl text-sm leading-relaxed text-foreground">
          The{" "}
          <span className="font-medium">India Semiconductor Mission (ISM)</span>,
          launched in 2021 under the Ministry of Electronics and IT (MeitY) as
          part of the Semicon India Programme (with an initial outlay of about
          &#8377;76,000 crore), is the Government of India&rsquo;s initiative to
          build a domestic semiconductor and display ecosystem. Building that
          ecosystem means developing several pieces together.
        </p>
        <DefGrid items={INDIA_BUILDING_BLOCKS} />
        <Alert variant="info" title="A note on India's capabilities">
          Which specific facilities and projects are operating, and what they can
          do, changes over time. Semitree does not assert particular Indian
          manufacturing capabilities here — for current, official status, see the
          India Semiconductor Mission and the India view in the industry section.
        </Alert>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/industry/map/india" className="font-medium text-brand hover:underline">India map →</Link>
          <a
            href="https://www.ism.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand hover:underline"
          >
            India Semiconductor Mission (official) →
          </a>
        </div>
      </Section>

      {/* Where this connects */}
      <Card className="bg-muted/30 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Keep exploring
        </h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <Link href="/semiconductors/equipment" className="font-medium text-brand hover:underline">Equipment →</Link>
          <Link href="/semiconductors/materials" className="font-medium text-brand hover:underline">Materials →</Link>
          <Link href="/manufacturing" className="font-medium text-brand hover:underline">Manufacturing →</Link>
          <Link href="/supply-chain" className="font-medium text-brand hover:underline">Supply chain →</Link>
          <Link href="/industry" className="font-medium text-brand hover:underline">Industry →</Link>
        </div>
      </Card>
    </Container>
  );
}
