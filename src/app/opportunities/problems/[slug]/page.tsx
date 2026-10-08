import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import { StatusPill, EvidencePill } from "@/components/opportunities/Badges";
import {
  PROBLEMS,
  getProblem,
  OPPORTUNITY_CATEGORY_BY_KEY,
} from "@/lib/opportunities/opportunities";
import { getCompany } from "@/lib/industry/companies";
import { getStage } from "@/lib/knowledge/supply-chain";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProblem(slug);
  if (!p) return pageMeta({ title: "Problem", description: "", path: "/opportunities" });
  return pageMeta({
    title: `Problem #${p.id}: ${p.title}`,
    description: p.problem,
    path: `/opportunities/problems/${p.slug}`,
  });
}

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function InfoCard({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <ul className="mt-3 space-y-1.5 text-sm">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProblem(slug);
  if (!p) notFound();

  const category = OPPORTUNITY_CATEGORY_BY_KEY.get(p.category);
  const stage = p.relatedStage ? getStage(p.relatedStage) : undefined;
  const companies = (p.relatedCompanies ?? [])
    .map((s) => getCompany(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <Container className="space-y-10 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Opportunities", path: "/opportunities" },
            { name: p.title, path: `/opportunities/problems/${p.slug}` },
          ]),
        ])}
      />
      <TrackView event="directory_clicked" payload={{ entry: p.slug, type: "problem" }} />

      {/* Header */}
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Opportunities", href: "/opportunities" },
            { label: `Problem #${p.id}` },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-mono text-xs text-muted-foreground">Problem #{p.id}</span>
          <StatusPill status={p.status} />
          {category && <span className="text-muted-foreground">{category.label}</span>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{p.title}</h1>
        <p className="max-w-3xl text-muted-foreground">{p.problem}</p>
        <p className="text-sm text-muted-foreground">Industry: <span className="font-medium text-foreground">{p.industry}</span></p>
      </header>

      {/* Why it matters */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">Why it matters</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-foreground">{p.whyItMatters}</p>
      </section>

      {/* Evidence — with honest levels */}
      <section aria-labelledby="evidence" className="space-y-3">
        <h2 id="evidence" className="text-lg font-semibold tracking-tight">Evidence</h2>
        <ul className="space-y-2">
          {p.evidence.map((e) => (
            <li key={e.text} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <EvidencePill level={e.level} />
              <span className="text-sm text-foreground">{e.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Structured fields */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard title="Affected participants" items={p.affectedParticipants} />
        <InfoCard title="Who experiences it" items={p.whoExperiences} />
        <InfoCard title="Current alternatives" items={p.currentAlternatives} />
        <InfoCard title="Known limitations" items={p.knownLimitations} />
        <InfoCard title="Potential approaches" items={p.potentialApproaches} />
      </section>

      {/* Related entities */}
      <section aria-labelledby="related" className="space-y-4 border-t border-border pt-6">
        <h2 id="related" className="text-lg font-semibold tracking-tight">Connected to the ecosystem</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Related companies</h3>
              <ul className="space-y-1.5">
                {companies.map((c) => (
                  <li key={c.slug}><Link href={`/industry/companies/${c.slug}`} className={linkClass}>{c.name} →</Link></li>
                ))}
              </ul>
            </div>
          )}
          {p.relatedTechnologies && p.relatedTechnologies.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Related technologies</h3>
              <ul className="space-y-1.5">
                {p.relatedTechnologies.map((t) => (
                  <li key={t.slug}><Link href={`/research/topics/${t.slug}`} className={linkClass}>{t.label} →</Link></li>
                ))}
              </ul>
            </div>
          )}
          {stage && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Supply-chain stage</h3>
              <ul className="space-y-1.5">
                <li><Link href={`/supply-chain/${stage.slug}`} className={linkClass}>{stage.name} →</Link></li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-brand/30 bg-brand/5 p-6">
        <h2 className="text-lg font-semibold tracking-tight">Do you work in semiconductors?</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Seeing this problem first-hand, or solving it? Tell us about a problem,
          supply-chain gap, or underserved need — evidence from the field makes
          this map more useful for everyone.
        </p>
        <div className="mt-4">
          <Link href="/submit" className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Submit an Industry Problem →
          </Link>
        </div>
      </section>

      <nav className="border-t border-border pt-6">
        <Link href="/opportunities" className={linkClass}>← All opportunities &amp; problems</Link>
      </nav>
    </Container>
  );
}
