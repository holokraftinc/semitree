import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IndiaMap } from "@/components/industry/IndiaMap";
import { StatusBadge } from "@/components/industry/StatusBadge";
import {
  INDIA_STATES,
  INDIA_PROJECTS,
  INDIA_INVESTMENTS,
  INDIA_UNIVERSITIES,
  indiaFacilities,
  facilitiesOfKind,
  companiesForState,
  projectsForState,
  indiaCounts,
  PROJECT_STATUS_LABELS,
  getState,
} from "@/lib/india/ecosystem";
import { getCompany } from "@/lib/industry/companies";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "India Semiconductor Ecosystem",
  description:
    "India's semiconductor ecosystem — the map, states, projects, companies, fabs, OSAT/ATMP, design centres, suppliers, investments, policy, and talent. Compiled from verified public information.",
  path: "/india",
});

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function IndiaPage() {
  const counts = indiaCounts();
  const facilities = indiaFacilities();
  const fabs = facilitiesOfKind(facilities, ["fab"]);
  const atmp = facilitiesOfKind(facilities, ["atmp", "osat"]);
  const design = facilitiesOfKind(facilities, ["rd"]);

  const stat = [
    { n: counts.companies, label: "Companies" },
    { n: counts.facilities, label: "Facilities" },
    { n: counts.fabs, label: "Fabs" },
    { n: counts.atmpOsat, label: "OSAT / ATMP" },
    { n: counts.designCentres, label: "Design centres" },
    { n: counts.states, label: "Active states" },
    { n: counts.projects, label: "Tracked projects" },
  ];

  const facilityGroup = (title: string, items: typeof fabs, id: string) =>
    items.length > 0 && (
      <div id={id} className="space-y-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <ul className="space-y-1.5">
          {items.map((f) => (
            <li key={f.company.slug + f.point.label} className="text-sm">
              <Link href={`/industry/companies/${f.company.slug}`} className={linkClass}>
                {f.company.name}
              </Link>
              <span className="text-muted-foreground"> — {f.point.city}{f.point.state ? `, ${f.point.state}` : ""}</span>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border">
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "India" }]} />
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            India Semiconductor Ecosystem
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            The map, the states, the projects, and the companies building India&apos;s
            semiconductor capability — compiled from verified public information.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {stat.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="mt-1 text-2xl font-bold tracking-tight">{s.n}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="space-y-16 py-16">
        {/* India map */}
        <section aria-labelledby="map-h" className="space-y-4">
          <h2 id="map-h" className="text-xl font-semibold tracking-tight">India semiconductor map</h2>
          <IndiaMap />
          <p className="text-sm text-muted-foreground">
            Open the <Link href="/industry/map/india" className={linkClass}>full India map →</Link>
          </p>
        </section>

        {/* States — the selectable entry into state pages */}
        <section aria-labelledby="states-h" className="space-y-5">
          <h2 id="states-h" className="text-xl font-semibold tracking-tight">States</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            We cover states with genuine, verifiable semiconductor activity. Select a state for its companies, facilities, projects, investments, and more.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INDIA_STATES.map((s) => {
              const cos = companiesForState(s.slug).length;
              const projs = projectsForState(s.slug).length;
              return (
                <li key={s.slug}>
                  <Link href={`/india/states/${s.slug}`} className="group block h-full rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <h3 className="font-semibold tracking-tight group-hover:text-brand">{s.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.tagline}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {cos} {cos === 1 ? "company" : "companies"}
                      {projs > 0 ? ` · ${projs} ${projs === 1 ? "project" : "projects"}` : ""}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Projects */}
        <section aria-labelledby="projects-h" className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="projects-h" className="text-xl font-semibold tracking-tight">Projects</h2>
            <StatusBadge status="reported" />
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Major announced fabs and ATMP/OSAT facilities. Status and figures are as publicly reported.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {INDIA_PROJECTS.map((p) => {
              const co = getCompany(p.companySlug);
              const st = getState(p.stateSlug);
              return (
                <li key={p.slug} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold tracking-tight">{p.name}</h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {PROJECT_STATUS_LABELS[p.status]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {co && <Link href={`/industry/companies/${co.slug}`} className={linkClass}>{co.name} →</Link>}
                    {st && <Link href={`/india/states/${st.slug}`} className={linkClass}>{st.name} →</Link>}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Facilities: fabs / ATMP-OSAT / design centres */}
        <section aria-labelledby="facilities-h" className="space-y-5">
          <h2 id="facilities-h" className="text-xl font-semibold tracking-tight">Facilities</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {facilityGroup("Fabs", fabs, "fabs")}
            {facilityGroup("OSAT / ATMP", atmp, "osat-atmp")}
            {facilityGroup("Design centres", design, "design-centres")}
          </div>
        </section>

        {/* Companies + Suppliers */}
        <section aria-labelledby="companies-h" className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 id="companies-h" className="font-semibold tracking-tight">Companies</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {counts.companies} companies operate across India&apos;s ecosystem. Filter the directory by country &ldquo;India&rdquo; and by state, city, segment, or capability.
            </p>
            <p className="mt-3"><Link href="/industry/companies" className={linkClass}>Open the company directory →</Link></p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold tracking-tight">Suppliers</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Equipment, chemicals, wafers, materials, and testing suppliers — and the wider support base the ecosystem still needs.
            </p>
            <p className="mt-3"><Link href="/suppliers" className={linkClass}>Open the supplier directory →</Link></p>
          </div>
        </section>

        {/* Startups */}
        <section aria-labelledby="startups-h" className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="startups-h" className="text-xl font-semibold tracking-tight">Startups</h2>
            <StatusBadge status="researching" />
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            India&apos;s semiconductor startup base — fabless, IP, and tooling — is being compiled. We&apos;re not listing companies we can&apos;t yet verify.{" "}
            <Link href="/submit" className={linkClass}>Know one? Submit it →</Link>
          </p>
        </section>

        {/* Investments */}
        <section aria-labelledby="investments-h" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="investments-h" className="text-xl font-semibold tracking-tight">Investments</h2>
            <StatusBadge status="reported" />
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Publicly announced investment in the tracked projects, rounded and as reported — not independently re-verified.
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

        {/* Government & Policy */}
        <section aria-labelledby="policy-h" className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="policy-h" className="text-xl font-semibold tracking-tight">Government &amp; policy</h2>
            <StatusBadge status="researching" />
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            India&apos;s manufacturing push is anchored by the India Semiconductor Mission (ISM), which has approved the fabs and ATMP facilities tracked above. A structured policy and incentives tracker is in progress — we link only to what we can verify.
          </p>
          <p className="text-sm"><Link href="/opportunities" className={linkClass}>See ecosystem opportunities →</Link></p>
        </section>

        {/* Talent */}
        <section aria-labelledby="talent-h" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="talent-h" className="text-xl font-semibold tracking-tight">Talent &amp; research institutions</h2>
            <StatusBadge status="reported" />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {INDIA_UNIVERSITIES.map((u) => {
              const st = getState(u.stateSlug);
              return (
                <li key={u.slug} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.city}{st ? `, ${st.name}` : ""}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{u.focus}</p>
                </li>
              );
            })}
          </ul>
          <p className="text-xs text-muted-foreground">
            A fuller talent map — programmes, skilling, and jobs where verified — is being compiled.
          </p>
        </section>
      </Container>
    </>
  );
}
