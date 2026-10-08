import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import { PROJECTS, getProject, PROJECT_STATUS_META } from "@/lib/projects/projects";
import { getCompany } from "@/lib/industry/companies";
import { getArticle } from "@/lib/content/articles";
import { getProblem, PROBLEM_STATUS_META } from "@/lib/opportunities/opportunities";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return pageMeta({ title: "Project", description: "", path: "/projects" });
  return pageMeta({ title: p.title, description: p.objective, path: `/projects/${p.slug}` });
}

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <ul className="space-y-1.5 text-sm">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
            <span className="leading-relaxed">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const meta = PROJECT_STATUS_META[p.status];
  const stats = p.stats();
  const companies = (p.relatedCompanies ?? []).map((s) => getCompany(s)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const insights = (p.relatedInsights ?? []).map((s) => getArticle(s)).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const problems = (p.relatedProblems ?? []).map((s) => getProblem(s)).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <Container className="space-y-10 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: p.title, path: `/projects/${p.slug}` },
          ]),
        ])}
      />
      <TrackView event="directory_clicked" payload={{ entry: p.slug, type: "project" }} />

      {/* Header */}
      <header className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: p.title }]} />
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
            {meta.label}
          </span>
          <span className="text-muted-foreground">Last updated {formatDate(p.lastUpdated)}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{p.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{p.tagline}</p>
        <div className="pt-1">
          <Link href={p.primaryHref} className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {p.primaryLabel} →
          </Link>
        </div>
      </header>

      {/* Coverage stats — research-asset dashboard */}
      <section aria-label="Coverage statistics">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4">
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Objective + why it matters */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Objective</h2>
          <p className="text-sm leading-relaxed text-foreground">{p.objective}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Why it matters</h2>
          <p className="text-sm leading-relaxed text-foreground">{p.whyItMatters}</p>
        </div>
      </section>

      {/* Coverage + data collected */}
      <section className="grid gap-8 sm:grid-cols-2">
        <List title="Coverage" items={p.coverage} />
        <List title="Data collected" items={p.dataCollected} />
      </section>

      {/* Findings + open questions */}
      <section className="grid gap-8 sm:grid-cols-2">
        <List title="Findings" items={p.findings} />
        <List title="Open questions" items={p.openQuestions} />
      </section>

      {/* Latest updates — timeline */}
      <section aria-labelledby="updates" className="space-y-3">
        <h2 id="updates" className="text-lg font-semibold tracking-tight">Latest updates</h2>
        <ol className="space-y-3">
          {p.updates.map((u) => (
            <li key={u.date} className="flex gap-4">
              <time dateTime={u.date} className="w-28 shrink-0 text-xs font-medium text-muted-foreground">{formatDate(u.date)}</time>
              <span className="text-sm leading-relaxed">{u.text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Related entities */}
      {(companies.length > 0 || insights.length > 0 || problems.length > 0) && (
        <section aria-labelledby="related" className="space-y-4 border-t border-border pt-6">
          <h2 id="related" className="text-lg font-semibold tracking-tight">Connected to the ecosystem</h2>
          <div className="grid gap-6 sm:grid-cols-3">
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
            {insights.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Related insights</h3>
                <ul className="space-y-1.5">
                  {insights.map((a) => (
                    <li key={a.slug}><Link href={`/articles/${a.slug}`} className={linkClass}>{a.title} →</Link></li>
                  ))}
                </ul>
              </div>
            )}
            {problems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Related opportunities</h3>
                <ul className="space-y-1.5">
                  {problems.map((pr) => (
                    <li key={pr.slug} className="flex items-center gap-2">
                      <Link href={`/opportunities/problems/${pr.slug}`} className={linkClass}>{pr.title} →</Link>
                      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${PROBLEM_STATUS_META[pr.status].className}`}>
                        {PROBLEM_STATUS_META[pr.status].label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Next steps */}
      <section className="rounded-2xl border border-border bg-muted/30 p-6">
        <List title="Next steps" items={p.nextSteps} />
      </section>

      <nav className="border-t border-border pt-6">
        <Link href="/projects" className={linkClass}>← All projects</Link>
      </nav>
    </Container>
  );
}
