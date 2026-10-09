import Link from "next/link";
import { toolEcosystem } from "@/lib/data/tool-ecosystem";

/**
 * Server component: connects a tool outward into the ecosystem. Rendered on each
 * tool page below the calculator, it completes the journey —
 * Learn → Use → Understand → Explore technology/companies/supply chain/insights.
 * Renders nothing when a tool has no genuine connections, so simple utilities
 * (unit converters, etc.) stay clean.
 */
const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function LinkGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  if (links.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className={linkClass}>{l.label} →</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChipGroup({ title, items, moreHref, moreLabel }: { title: string; items: string[]; moreHref?: string; moreLabel?: string }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <li key={it} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{it}</li>
        ))}
      </ul>
      {moreHref && (
        <Link href={moreHref} className={linkClass}>{moreLabel} →</Link>
      )}
    </div>
  );
}

export function ToolEcosystem({ slug }: { slug: string }) {
  const eco = toolEcosystem(slug);
  if (!eco.hasAny) return null;

  return (
    <section aria-labelledby="tool-eco-h" className="mt-12 space-y-5 border-t border-border pt-8">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">From this tool</p>
        <h2 id="tool-eco-h" className="text-xl font-semibold tracking-tight">Connected to the ecosystem</h2>
        {eco.whyItMatters && <p className="max-w-2xl text-sm text-muted-foreground">{eco.whyItMatters}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <LinkGroup title="Related concept" links={eco.concepts} />
        <LinkGroup title="Related manufacturing" links={eco.processes} />
        <ChipGroup title="Related equipment" items={eco.equipment} moreHref="/supply-chain/semiconductor-equipment" moreLabel="Equipment stage" />
        <ChipGroup title="Related materials" items={eco.materials} moreHref="/supply-chain/raw-materials" moreLabel="Materials stage" />
        <LinkGroup title="Supply-chain stage" links={eco.stages} />
        <LinkGroup title="Related companies" links={eco.companies} />
        <LinkGroup title="Related insights" links={eco.insights} />
        <LinkGroup title="Related tools" links={eco.tools} />
      </div>
    </section>
  );
}
