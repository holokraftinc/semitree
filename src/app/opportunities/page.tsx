import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StatusPill, EvidencePill } from "@/components/opportunities/Badges";
import {
  OPPORTUNITY_CATEGORIES,
  PROBLEMS,
  strongestEvidence,
} from "@/lib/opportunities/opportunities";
import { researchingSupplierCategories } from "@/lib/industry/relationships";
import { INDIA_INVESTMENTS, getState } from "@/lib/india/ecosystem";
import { articlesInCategory } from "@/lib/content/articles";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Opportunities & problems worth solving",
  description:
    "An evidence-based map of real gaps, supply-chain weaknesses, and problems worth solving in the semiconductor ecosystem — each tagged with an honest evidence level. Not startup hype; intelligence gathering.",
  path: "/opportunities",
});

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function SubmitCta() {
  return (
    <section className="rounded-2xl border border-brand/30 bg-brand/5 p-6 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight">Do you work in semiconductors?</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Tell us about a problem, supply-chain gap, or underserved need. Semitree is
        gathering evidence on where the real opportunities are — your input helps
        the whole community see them.
      </p>
      <div className="mt-4">
        <Link
          href="/submit"
          className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Submit an Industry Problem →
        </Link>
      </div>
    </section>
  );
}

export default function OpportunitiesPage() {
  const supplierGaps = researchingSupplierCategories();
  const deepDives = articlesInCategory("deep-dives");

  return (
    <Container className="space-y-14 py-10">
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Opportunities" }]} />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Opportunities &amp; problems worth solving</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          An evidence-based map of real gaps and problems in the semiconductor
          ecosystem — not startup hype. Every entry carries an honest evidence
          level, and nothing here is presented as more certain than it is.
        </p>
      </div>

      {/* Honesty / evidence key */}
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <p className="text-sm font-semibold tracking-tight">How to read this</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Evidence is labelled <EvidencePill level="observed" /> (visible in our own data),{" "}
          <EvidencePill level="reported" /> (widely reported, not re-verified),{" "}
          <EvidencePill level="researching" /> (still compiling), or{" "}
          <EvidencePill level="validated" /> (independently validated). We do not turn speculation into fact.
        </p>
      </div>

      {/* Categories */}
      <section aria-labelledby="cats-h" className="space-y-5">
        <h2 id="cats-h" className="text-xl font-semibold tracking-tight">What we track</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OPPORTUNITY_CATEGORIES.map((c) => (
            <li key={c.key} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold tracking-tight">{c.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Problems worth solving */}
      <section aria-labelledby="problems-h" className="space-y-5">
        <h2 id="problems-h" className="text-xl font-semibold tracking-tight">Problems worth solving</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A structured, evidence-tagged problem database. Each one links to the
          companies, technologies, and supply-chain stage it touches.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {PROBLEMS.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/opportunities/problems/${p.slug}`}
                className="group block h-full rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-muted-foreground">Problem #{p.id}</span>
                  <StatusPill status={p.status} />
                </div>
                <h3 className="mt-2 font-semibold tracking-tight group-hover:text-brand">{p.title}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{p.problem}</p>
                <div className="mt-3 flex items-center gap-2">
                  <EvidencePill level={strongestEvidence(p)} />
                  <span className="text-xs text-muted-foreground">
                    {OPPORTUNITY_CATEGORIES.find((c) => c.key === p.category)?.label}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Supplier opportunities / supply-chain gaps (observed from our registry) */}
      <section aria-labelledby="gaps-h" className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="gaps-h" className="text-xl font-semibold tracking-tight">Supplier opportunities</h2>
          <EvidencePill level="observed" />
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Supplier categories with <strong>no verified company in our registry yet</strong> — an
          observed gap, straight from Semitree&apos;s own data. Each is a candidate opportunity.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {supplierGaps.map((cat) => (
            <li key={cat.key} className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
              <h3 className="text-sm font-semibold">{cat.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{cat.description}</p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          See the <Link href="/suppliers" className={linkClass}>supplier directory</Link> for categories that are already covered.
        </p>
      </section>

      {/* Market signals (reported) */}
      <section aria-labelledby="signals-h" className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="signals-h" className="text-xl font-semibold tracking-tight">Market signals</h2>
          <EvidencePill level="reported" />
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Concrete, publicly reported signals of where capital is moving — the announced India investments we track.
        </p>
        <ul className="divide-y divide-border rounded-xl border border-border">
          {INDIA_INVESTMENTS.map((inv) => {
            const st = getState(inv.stateSlug);
            return (
              <li key={inv.slug} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <span className="text-sm font-medium">{inv.label}</span>
                <span className="flex items-center gap-3 text-sm">
                  <span className="font-semibold">{inv.amountText}</span>
                  {st && <Link href={`/india/states/${st.slug}`} className="text-xs text-muted-foreground hover:text-brand">{st.name}</Link>}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Emerging technologies */}
      {deepDives.length > 0 && (
        <section aria-labelledby="tech-h" className="space-y-4">
          <h2 id="tech-h" className="text-xl font-semibold tracking-tight">Emerging technologies to watch</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {deepDives.map((a) => (
              <li key={a.slug}>
                <Link href={`/articles/${a.slug}`} className="group block rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/50">
                  <span className="block text-sm font-semibold tracking-tight group-hover:text-brand">{a.title}</span>
                  {a.subtitle && <span className="mt-0.5 block text-xs text-muted-foreground">{a.subtitle}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SubmitCta />

      <p className="text-sm text-muted-foreground">
        Grounded in the <Link href="/supply-chain" className={linkClass}>supply chain</Link>, the{" "}
        <Link href="/industry/companies" className={linkClass}>company registry</Link>, the{" "}
        <Link href="/india" className={linkClass}>India ecosystem</Link>, and{" "}
        <Link href="/insights" className={linkClass}>insights</Link>.
      </p>
    </Container>
  );
}
