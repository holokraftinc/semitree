import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import {
  COMPANIES,
  getCompany,
  companyPoints,
  relatedCompanyObjects,
} from "@/lib/industry/companies";
import { COMPANY_TYPE_LABELS, SITE_KIND_LABELS } from "@/lib/industry/types";
import { getProcess } from "@/lib/knowledge/manufacturing";
import { getSemiTool } from "@/lib/data/semi-tools";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCompany(slug);
  if (!c) return pageMeta({ title: "Company", description: "", path: "/industry/companies" });
  return pageMeta({
    title: `${c.name} — Semiconductor industry`,
    description: c.description,
    path: `/industry/companies/${c.slug}`,
  });
}

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function InfoList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <ul className="mt-3 space-y-1.5 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();

  const points = companyPoints(company);
  const related = relatedCompanyObjects(company.slug);
  const careersHref = company.hiringUrl ?? company.website;

  return (
    <Container className="space-y-10 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Industry", path: "/industry" },
            { name: "Companies", path: "/industry/companies" },
            { name: company.name, path: `/industry/companies/${company.slug}` },
          ]),
          {
            "@type": "Organization",
            name: company.name,
            description: company.description,
            ...(company.website ? { url: company.website } : {}),
            ...(company.founders ? { founder: company.founders.map((f) => ({ "@type": "Person", name: f })) } : {}),
            address: {
              "@type": "PostalAddress",
              addressLocality: company.hq.city,
              addressCountry: company.hq.countryCode,
            },
          },
        ])}
      />
      <TrackView event="directory_clicked" payload={{ entry: company.slug, type: "company" }} />

      {/* Header */}
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industry", href: "/industry" },
            { label: "Companies", href: "/industry/companies" },
            { label: company.name },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
        <div className="flex flex-wrap gap-1.5">
          {company.types.map((t) => (
            <span key={t} className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
              {COMPANY_TYPE_LABELS[t]}
            </span>
          ))}
        </div>
        <p className="max-w-2xl text-muted-foreground">{company.description}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            {company.hq.city}, {company.hq.country}
          </span>
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Official website ↗
            </a>
          )}
          {company.linkedin && (
            <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
              LinkedIn ↗
            </a>
          )}
        </div>
      </header>

      {/* Locations */}
      <section aria-labelledby="locations" className="space-y-3">
        <h2 id="locations" className="text-lg font-semibold tracking-tight">Locations</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => (
            <li key={p.label + p.city} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium">{p.label}</p>
              <p className="text-sm text-muted-foreground">
                {p.city}
                {p.state ? `, ${p.state}` : ""}, {p.country}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {SITE_KIND_LABELS[p.kind]} · {p.precision === "city" ? "city-level location" : "site location"}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          <Link href="/industry/map" className={linkClass}>See on the global map →</Link>
          {points.some((p) => p.countryCode === "IN") && (
            <>
              {"  "}
              <Link href="/industry/map/india" className={linkClass}>India map →</Link>
            </>
          )}
        </p>
      </section>

      {/* Profile detail */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoList title="Technologies" items={company.technologies} />
        <InfoList title="Products" items={company.products} />
        <InfoList title="Processes" items={company.processes} />
        <InfoList title="Facilities" items={company.facilities} />
        <InfoList title="Founders" items={company.founders} />
        {company.leadership && company.leadership.length > 0 && (
          <Card className="p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Leadership</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {company.leadership.map((l) => (
                <li key={l.name}>
                  <span className="font-medium">{l.name}</span>
                  <span className="text-muted-foreground"> — {l.role}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>

      {/* Company → Knowledge */}
      <section aria-labelledby="knowledge" className="space-y-4">
        <h2 id="knowledge" className="text-lg font-semibold tracking-tight">Connect to the knowledge base</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Processes */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Processes</h3>
            {company.relatedProcesses && company.relatedProcesses.length > 0 ? (
              <ul className="space-y-1.5">
                {company.relatedProcesses.map((pslug) => {
                  const proc = getProcess(pslug);
                  if (!proc) return null;
                  return (
                    <li key={pslug}>
                      <Link href={`/manufacturing/${pslug}`} className={linkClass}>
                        {proc.name} →
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                <Link href="/manufacturing" className={linkClass}>Explore manufacturing →</Link>
              </p>
            )}
          </div>

          {/* Concepts */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Technologies &amp; concepts</h3>
            {company.relatedConcepts && company.relatedConcepts.length > 0 ? (
              <ul className="space-y-1.5">
                {company.relatedConcepts.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/semiconductors/learn/${c.slug}`} className={linkClass}>
                      {c.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                <Link href="/semiconductors/learn" className={linkClass}>Learn semiconductors →</Link>
              </p>
            )}
          </div>

          {/* Tools */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Tools</h3>
            {company.relatedTools && company.relatedTools.length > 0 ? (
              <ul className="space-y-1.5">
                {company.relatedTools.map((tslug) => {
                  const tool = getSemiTool(tslug);
                  if (!tool) return null;
                  return (
                    <li key={tslug}>
                      <Link href={`/semiconductors/tools/${tslug}`} className={linkClass}>
                        {tool.name} →
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                <Link href="/semiconductors/tools" className={linkClass}>Browse tools →</Link>
              </p>
            )}
          </div>

          {/* Research */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Research</h3>
            {company.research && company.research.length > 0 ? (
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {company.research.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : null}
            <Link href="/research" className={linkClass}>Research hub →</Link>
          </div>

          {/* Jobs */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Jobs</h3>
            {careersHref ? (
              <a href={careersHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Careers on the official site ↗
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">No verified careers link yet.</p>
            )}
          </div>

          {/* News */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">News</h3>
            {company.website ? (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Official newsroom ↗
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">No verified news feed yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Related companies */}
      {related.length > 0 && (
        <section aria-labelledby="related-co" className="space-y-3">
          <h2 id="related-co" className="text-lg font-semibold tracking-tight">Related companies</h2>
          <ul className="flex flex-wrap gap-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/industry/companies/${r.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-brand/50 hover:text-brand"
                >
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Provenance */}
      <section className="rounded-xl border border-border bg-muted/30 p-5 text-sm">
        <p className="font-medium">Data & sources</p>
        <p className="mt-1 text-muted-foreground">
          Compiled from public information. Locations are city-level, not exact
          addresses. Fields that cannot be stated with confidence are left blank
          rather than guessed.
        </p>
        {company.sources && company.sources.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-3">
            {company.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
        {company.lastVerified && (
          <p className="mt-2 text-xs text-muted-foreground">Last verified: {company.lastVerified}</p>
        )}
      </section>
    </Container>
  );
}
