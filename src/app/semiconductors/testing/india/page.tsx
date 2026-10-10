import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";
import { StatusBadge } from "@/components/industry/StatusBadge";
import { COMPANIES, companyPoints, getCompany } from "@/lib/industry/companies";
import { COMPANY_TYPE_LABELS, SITE_KIND_LABELS, type CompanyType } from "@/lib/industry/types";
import { INDIA_PROJECTS, getState, PROJECT_STATUS_LABELS } from "@/lib/india/ecosystem";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor testing in India",
  description:
    "Discover India's semiconductor assembly-and-test ecosystem — OSAT/ATMP facilities, test-equipment presence, and announced projects — with verified facts and reported announcements kept distinct. Compiled from public sources; missing data is labelled.",
  path: "/semiconductors/testing/india",
});

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// Testing is embodied by assembly-and-test types; a company's general presence
// is NOT treated as proof of a specific test capability.
const TESTING_TYPES: CompanyType[] = ["atmp", "osat", "testing"];

export default function TestingIndiaPage() {
  const companies = COMPANIES.filter(
    (c) => companyPoints(c).some((p) => p.countryCode === "IN") && c.types.some((t) => TESTING_TYPES.includes(t)),
  ).sort((a, b) => a.name.localeCompare(b.name));

  // ATMP = Assembly, Test, Marking, Packaging; OSAT = Outsourced Assembly & Test —
  // both inherently include testing. Fabs are excluded (fabrication, not test).
  const projects = INDIA_PROJECTS.filter((p) => p.kind === "atmp" || p.kind === "osat");

  return (
    <Container className="space-y-12 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Explore", path: "/explore" },
            { name: "Testing", path: "/semiconductors/testing" },
            { name: "India", path: "/semiconductors/testing/india" },
          ]),
        ])}
      />

      {/* Hero */}
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Explore", href: "/explore" },
            { label: "Testing", href: "/semiconductors/testing" },
            { label: "India" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Semiconductor testing in India</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A starting point for discovering India&apos;s assembly-and-test ecosystem — kept honest, with
          verified facts and reported announcements clearly distinguished.
        </p>
      </div>

      {/* India's role in testing */}
      <section aria-labelledby="role-h" className="space-y-3">
        <h2 id="role-h" className="text-xl font-semibold tracking-tight">India&apos;s role in semiconductor testing</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-foreground">
          Testing runs throughout the value chain — alongside design, after wafer fabrication, and within
          assembly, packaging, and test. Much of India&apos;s near-term manufacturing activity is in
          <strong> assembly, testing, marking &amp; packaging (ATMP)</strong> and
          <strong> outsourced semiconductor assembly &amp; test (OSAT)</strong>, which inherently include testing —
          but testing is <em>not</em> confined to OSAT/ATMP: it also happens in design companies&apos; test
          engineering, in fabs, and at test-equipment and interface suppliers.
        </p>
        <p className="max-w-3xl text-xs text-muted-foreground">
          This page reuses Semitree&apos;s verified company and project records. A company&apos;s general
          semiconductor presence is not treated as proof of a specific test capability, and nothing here is
          marked operational merely because it was announced or approved.
        </p>
      </section>

      {/* Evidence key */}
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <p className="text-sm font-semibold tracking-tight">How to read this</p>
        <p className="mt-1 text-sm text-muted-foreground">
          <StatusBadge status="verified" /> well-established public facts in Semitree&apos;s registry ·{" "}
          <StatusBadge status="reported" /> publicly announced, not independently re-verified ·{" "}
          <StatusBadge status="researching" /> still being compiled. Project status uses: announced · approved ·
          under construction · operational · proposed · unknown — we show the most accurate supported status.
        </p>
      </div>

      {/* Ecosystem categories */}
      <section aria-labelledby="cats-h" className="space-y-4">
        <h2 id="cats-h" className="text-xl font-semibold tracking-tight">Ecosystem categories</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">We list only categories for which Semitree can source information today.</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "OSAT / ATMP facilities", d: "Assembly-and-test plants (announced or under construction)." },
            { t: "Manufacturers with test capability", d: "IDMs/foundries whose plants include test." },
            { t: "Test-equipment & interface presence", d: "Equipment and engineering presence in India." },
          ].map((c) => (
            <li key={c.t}><Card className="h-full p-4"><h3 className="text-sm font-semibold">{c.t}</h3><p className="mt-1 text-xs text-muted-foreground">{c.d}</p></Card></li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Reliability/failure-analysis labs, probe-card/interface suppliers, and university test labs are
          <strong> under research</strong> — we don&apos;t list what we can&apos;t yet source.
        </p>
      </section>

      {/* Companies & facilities (reused, verified) */}
      <section aria-labelledby="companies-h" className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="companies-h" className="text-xl font-semibold tracking-tight">Companies with India assembly/test presence</h2>
          <StatusBadge status="verified" />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {companies.map((c) => {
            const indiaSites = companyPoints(c).filter((p) => p.countryCode === "IN");
            return (
              <li key={c.slug}>
                <Card className="h-full p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link href={`/industry/companies/${c.slug}`} className="font-semibold tracking-tight text-foreground hover:text-brand">{c.name}</Link>
                    <span className="text-xs text-muted-foreground">{c.types.map((t) => COMPANY_TYPE_LABELS[t]).join(", ")}</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {indiaSites.map((p) => (
                      <li key={p.label + p.city}>{p.label} — {p.city}{p.state ? `, ${p.state}` : ""} · {SITE_KIND_LABELS[p.kind]}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" className={linkClass}>Official source ↗</a>
                    ) : (
                      <span>Source: see company page</span>
                    )}
                    {c.lastVerified && <span> · Last verified {c.lastVerified}</span>}
                  </p>
                </Card>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-muted-foreground">
          Assembly/test type (ATMP/OSAT/test) is used as the inclusion basis; it does not assert a specific
          device-level test capability beyond what each company publishes. Full records in the{" "}
          <Link href="/industry/companies" className={linkClass}>company directory</Link>.
        </p>
      </section>

      {/* Projects (reused, reported) */}
      <section aria-labelledby="projects-h" className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="projects-h" className="text-xl font-semibold tracking-tight">Announced assembly-and-test projects</h2>
          <StatusBadge status="reported" />
        </div>
        <ul className="divide-y divide-border rounded-xl border border-border">
          {projects.map((p) => {
            const st = getState(p.stateSlug);
            const co = getCompany(p.companySlug);
            return (
              <li key={p.slug} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{p.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {co && (<><Link href={`/industry/companies/${co.slug}`} className="hover:text-brand">{co.name}</Link> · </>)}
                    {p.city}{st ? `, ${st.name}` : ""} · Last verified {p.lastVerified}
                  </span>
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{PROJECT_STATUS_LABELS[p.status]}</span>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-muted-foreground">
          Status and figures are as publicly reported, not independently re-verified. See the full{" "}
          <Link href="/india" className={linkClass}>India ecosystem</Link> for investments and state detail.
        </p>
      </section>

      {/* Research questions (not proven gaps) */}
      <section aria-labelledby="research-h" className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="research-h" className="text-xl font-semibold tracking-tight">Open research questions</h2>
          <StatusBadge status="researching" />
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">
          These are questions Semitree is researching — <strong>not</strong> claims that a capability is
          absent. We do not assert India lacks something simply because we haven&apos;t yet found evidence.
        </p>
        <ul className="space-y-1.5 text-sm">
          {[
            "Which specific test capabilities are documented publicly for each facility?",
            "Which test-equipment and probe-card/interface categories have identifiable India suppliers?",
            "Which testing-related skills are most needed across the value chain?",
            "Which public sources best describe facility status and capabilities over time?",
            "Which supplier categories have limited publicly available information today?",
          ].map((q) => (
            <li key={q} className="flex gap-2"><span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" /><span>{q}</span></li>
          ))}
        </ul>
        <p className="text-sm">
          Know a verified testing facility, supplier, or capability?{" "}
          <Link href="/submit" className={linkClass}>Submit it →</Link>
        </p>
      </section>

      {/* Ecosystem integration */}
      <section aria-labelledby="connect-h" className="space-y-4 border-t border-border pt-8">
        <h2 id="connect-h" className="text-xl font-semibold tracking-tight">Explore across Semitree</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Testing overview", href: "/semiconductors/testing", note: "The full testing section." },
            { label: "India ecosystem", href: "/india", note: "Companies, states, projects, investments." },
            { label: "Company directory", href: "/industry/companies", note: "Filter by OSAT/ATMP and location." },
            { label: "Testing supply chain", href: "/supply-chain/testing", note: "The testing stage, end to end." },
            { label: "Test equipment", href: "/semiconductors/equipment", note: "Probers, ATE, handlers, inspection." },
            { label: "Packaging", href: "/semiconductors/packaging", note: "Assembly before final test." },
            { label: "Opportunities", href: "/opportunities", note: "Gaps and problems worth solving." },
            { label: "Insights", href: "/insights", note: "India semiconductor developments." },
          ].map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="group block h-full rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="block text-sm font-semibold tracking-tight group-hover:text-brand">{r.label} →</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{r.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
