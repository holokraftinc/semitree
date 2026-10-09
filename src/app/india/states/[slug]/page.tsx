import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import { StatusBadge } from "@/components/industry/StatusBadge";
import {
  INDIA_STATES,
  getState,
  adjacentStates,
  companiesForState,
  facilitiesForState,
  facilitiesOfKind,
  suppliersForState,
  startupsForState,
  projectsForState,
  investmentsForState,
  universitiesForState,
  insightsForState,
  PROJECT_STATUS_LABELS,
} from "@/lib/india/ecosystem";
import { COMPANY_TYPE_LABELS, SITE_KIND_LABELS } from "@/lib/industry/types";
import { getCompany } from "@/lib/industry/companies";
import { PrevNext } from "@/components/platform/PrevNext";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return INDIA_STATES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const st = getState(slug);
  if (!st) return pageMeta({ title: "State", description: "", path: "/india" });
  return pageMeta({
    title: `${st.name} — India semiconductor ecosystem`,
    description: `${st.overview} Semiconductor companies, facilities, projects, and investments in ${st.name}.`,
    path: `/india/states/${st.slug}`,
  });
}

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const st = getState(slug);
  if (!st) notFound();

  const companies = companiesForState(slug);
  const facilities = facilitiesForState(slug);
  const fabs = facilitiesOfKind(facilities, ["fab"]);
  const atmp = facilitiesOfKind(facilities, ["atmp", "osat"]);
  const design = facilitiesOfKind(facilities, ["rd"]);
  const suppliers = suppliersForState(slug);
  const startups = startupsForState(slug);
  const projects = projectsForState(slug);
  const investments = investmentsForState(slug);
  const universities = universitiesForState(slug);
  const insights = insightsForState(slug);

  return (
    <Container className="space-y-10 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "India", path: "/india" },
            { name: st.name, path: `/india/states/${st.slug}` },
          ]),
        ])}
      />
      <TrackView event="directory_clicked" payload={{ entry: st.slug, type: "india-state" }} />

      {/* Header */}
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "India", href: "/india" },
            { label: st.name },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">{st.name}</h1>
        <p className="max-w-2xl text-muted-foreground">{st.tagline}</p>
      </header>

      {/* Overview + Why it matters */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
          <p className="text-sm leading-relaxed text-foreground">{st.overview}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Why it matters</h2>
          <p className="text-sm leading-relaxed text-foreground">{st.whyItMatters}</p>
        </div>
      </section>

      {/* Semiconductor activity (snapshot) */}
      <section aria-labelledby="activity" className="space-y-3">
        <h2 id="activity" className="text-lg font-semibold tracking-tight">Semiconductor activity</h2>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { n: companies.length, label: "Companies" },
            { n: facilities.length, label: "Facilities" },
            { n: fabs.length, label: "Fabs" },
            { n: atmp.length, label: "OSAT / ATMP" },
            { n: design.length, label: "Design centres" },
            { n: projects.length, label: "Projects" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-3">
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="mt-1 text-xl font-bold tracking-tight">{s.n}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Companies */}
      <section aria-labelledby="companies" className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="companies" className="text-lg font-semibold tracking-tight">Companies</h2>
          <StatusBadge status="verified" />
        </div>
        <ul className="flex flex-wrap gap-2">
          {companies.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/industry/companies/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-brand/50 hover:text-brand"
              >
                {c.name}
                <span className="text-xs text-muted-foreground">{c.types.map((t) => COMPANY_TYPE_LABELS[t]).join(", ")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Facilities */}
      <section aria-labelledby="facilities" className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="facilities" className="text-lg font-semibold tracking-tight">Facilities</h2>
          <StatusBadge status="verified" />
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <li key={f.company.slug + f.point.label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium">{f.point.label}</p>
              <p className="text-sm text-muted-foreground">
                <Link href={`/industry/companies/${f.company.slug}`} className={linkClass}>{f.company.name}</Link>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {f.point.city} · {SITE_KIND_LABELS[f.point.kind]}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          <Link href="/industry/map/india" className={linkClass}>See on the India map →</Link>
        </p>
      </section>

      {/* Projects */}
      {projects.length > 0 && (
        <section aria-labelledby="projects" className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="projects" className="text-lg font-semibold tracking-tight">Projects</h2>
            <StatusBadge status="reported" />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => {
              const co = getCompany(p.companySlug);
              return (
                <li key={p.slug} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold tracking-tight">{p.name}</h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {PROJECT_STATUS_LABELS[p.status]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
                  {co && <p className="mt-3"><Link href={`/industry/companies/${co.slug}`} className={linkClass}>{co.name} →</Link></p>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Investments */}
      {investments.length > 0 && (
        <section aria-labelledby="investments" className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="investments" className="text-lg font-semibold tracking-tight">Investments</h2>
            <StatusBadge status="reported" />
          </div>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {investments.map((inv) => (
              <li key={inv.slug} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <span className="text-sm font-medium">{inv.label}</span>
                <span className="text-sm font-semibold">{inv.amountText}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">Figures are as publicly announced, rounded — not independently re-verified.</p>
        </section>
      )}

      {/* Suppliers */}
      <section aria-labelledby="suppliers" className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="suppliers" className="text-lg font-semibold tracking-tight">Suppliers</h2>
          <StatusBadge status={suppliers.length > 0 ? "verified" : "researching"} />
        </div>
        {suppliers.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {suppliers.map((c) => (
              <li key={c.slug}>
                <Link href={`/industry/companies/${c.slug}`} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-brand/50 hover:text-brand">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No verified supply-base companies recorded in {st.name} yet. Explore the{" "}
            <Link href="/suppliers" className={linkClass}>supplier directory →</Link>
          </p>
        )}
      </section>

      {/* Startups */}
      <section aria-labelledby="startups" className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="startups" className="text-lg font-semibold tracking-tight">Startups</h2>
          <StatusBadge status={startups.length > 0 ? "verified" : "researching"} />
        </div>
        {startups.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {startups.map((c) => (
              <li key={c.slug}>
                <Link href={`/industry/companies/${c.slug}`} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-brand/50 hover:text-brand">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            {st.name}&apos;s semiconductor startups are being compiled.{" "}
            <Link href="/submit" className={linkClass}>Submit one →</Link>
          </p>
        )}
      </section>

      {/* Research institutions / Talent */}
      <section aria-labelledby="talent" className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="talent" className="text-lg font-semibold tracking-tight">Research institutions &amp; talent</h2>
          <StatusBadge status={universities.length > 0 ? "reported" : "researching"} />
        </div>
        {universities.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {universities.map((u) => (
              <li key={u.slug} className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.city}</p>
                <p className="mt-1 text-sm text-muted-foreground">{u.focus}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            A verified map of {st.name}&apos;s semiconductor research institutions and talent programmes is being compiled.
          </p>
        )}
      </section>

      {/* Recent developments */}
      {st.developments && st.developments.length > 0 && (
        <section aria-labelledby="developments" className="space-y-3">
          <h2 id="developments" className="text-lg font-semibold tracking-tight">Recent developments</h2>
          <ul className="space-y-1.5 text-sm">
            {st.developments.map((d) => (
              <li key={d} className="flex gap-2">
                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related insights */}
      {insights.length > 0 && (
        <section aria-labelledby="insights" className="space-y-3">
          <h2 id="insights" className="text-lg font-semibold tracking-tight">Related insights</h2>
          <ul className="space-y-1.5">
            {insights.map((a) => (
              <li key={a.slug}><Link href={`/articles/${a.slug}`} className={linkClass}>{a.title} →</Link></li>
            ))}
          </ul>
        </section>
      )}

      {/* Previous / next state */}
      {(() => {
        const { prev, next } = adjacentStates(st.slug);
        return (
          <PrevNext
            ariaLabel="State navigation"
            prevKicker="← Previous state"
            nextKicker="Next state →"
            prev={prev ? { href: `/india/states/${prev.slug}`, label: prev.name } : undefined}
            next={next ? { href: `/india/states/${next.slug}`, label: next.name } : undefined}
          />
        );
      })()}

      {/* Back */}
      <nav className="pt-2">
        <Link href="/india" className={linkClass}>← All of India&apos;s ecosystem</Link>
      </nav>
    </Container>
  );
}
