import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, jsonLdGraph, breadcrumbLd, eventLd } from "@/lib/seo";
import {
  SEMICON_INDIA_2026 as E,
  getSemiconArticles,
  EVENT_START_ISO,
  EVENT_END_ISO,
} from "@/lib/events/semicon-india-2026";
import { SemiconDays } from "@/components/events/SemiconDays";
import { SemiconCoverage } from "@/components/events/SemiconCoverage";
import { SemiconStatusBadge, SemiconArchiveNotice } from "@/components/events/SemiconStatus";

export const metadata: Metadata = pageMeta({
  title: "SEMICON India 2026: Schedule, Themes & Semiconductor Coverage",
  description:
    "SEMICON India 2026 (17–19 September, Yashobhoomi, New Delhi) — Semitree's coverage and learning hub for the event and India's semiconductor ecosystem: overview, three-day themes, and links across manufacturing, equipment, materials, packaging, design and the supply chain.",
  path: "/events/semicon-india-2026",
});

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-20 space-y-4">
      <h2 id={`${id}-h`} className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Paras({ items }: { items: string[] }) {
  return (
    <div className="space-y-3 leading-relaxed text-foreground">
      {items.map((p, i) => <p key={i} className="max-w-3xl">{p}</p>)}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2 leading-relaxed text-foreground">
          <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
          <span className="max-w-3xl">{it}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SemiconIndia2026Page() {
  return (
    <Container className="space-y-12 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
            { name: E.name, path: `/events/${E.slug}` },
          ]),
          eventLd({
            name: E.name,
            startDate: EVENT_START_ISO,
            endDate: EVENT_END_ISO,
            path: `/events/${E.slug}`,
            description: E.overview[0],
            locationName: "Yashobhoomi (India International Convention & Expo Centre)",
            addressLocality: "New Delhi",
            addressCountry: "IN",
            sameAs: [E.officialUrl],
            organizers: [
              { name: "India Semiconductor Mission (ISM)", url: "https://www.ism.gov.in/" },
              { name: "SEMI" },
            ],
          }),
        ])}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: "SEMICON India 2026" },
        ]}
      />

      {/* Hero — distinctive event banner, still within the design system */}
      <header className="overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/10 via-brand/5 to-transparent p-6 sm:p-10">
        <SemiconStatusBadge />
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{E.name}</h1>
        <p className="mt-2 text-lg font-medium text-brand">{E.theme}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {E.dates} · {E.venue}
        </p>
        <p className="mt-4 max-w-2xl leading-relaxed text-foreground">{E.heroBlurb}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#overview" className={buttonClasses()}>Explore SEMICON India 2026</a>
          <a
            href={E.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("secondary")}
          >
            Official event website ↗
          </a>
        </div>
      </header>

      {/* Positioning — clear, honest, non-affiliation */}
      <p className="max-w-3xl text-sm text-muted-foreground">
        {E.positioning} The official{" "}
        <a href={E.officialUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
          SEMICON India website
        </a>{" "}
        is the authoritative source for the agenda, speakers, and exhibitors.
      </p>

      <SemiconArchiveNotice />

      <Section id="overview" title="Event overview">
        <Paras items={E.overview} />
        <Card className="bg-muted/20 p-5">
          <dl className="grid gap-3 sm:grid-cols-3">
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dates</dt><dd className="mt-0.5 text-sm text-foreground">{E.dates}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Venue</dt><dd className="mt-0.5 text-sm text-foreground">{E.venue}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Organized by</dt><dd className="mt-0.5 text-sm text-foreground">{E.organizers}</dd></div>
          </dl>
        </Card>
      </Section>

      <Section id="why" title="Why SEMICON India 2026 matters">
        <Bullets items={E.whyItMatters} />
      </Section>

      <Section id="what-to-watch" title="What to watch">
        <Bullets items={E.whatToWatch} />
      </Section>

      {/* Days — day-by-day agenda with live/completed status */}
      <Section id="agenda" title="Day-by-day agenda">
        <p className="max-w-3xl text-sm text-muted-foreground">
          Switch between the three days below. Sessions show as upcoming, live,
          or completed based on the current date in India Standard Time. Session
          names are from the official agenda — see the{" "}
          <a href={E.officialUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">official agenda ↗</a>{" "}
          for times, speakers, and full descriptions.
        </p>
        <SemiconDays days={E.days} officialUrl={E.officialUrl} />
      </Section>

      {/* Key themes — connected to Semitree learning */}
      <Section id="themes" title="Key themes — and where to learn them on Semitree">
        <p className="max-w-3xl text-sm text-muted-foreground">
          SEMICON India spans the whole value chain. Here are the themes it
          covers, each linked to Semitree&rsquo;s learning where it exists — so
          you can go from an event topic straight to understanding it.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {E.themes.map((t) => (
            <Card key={t.theme} className="p-5">
              <h3 className="text-base font-semibold tracking-tight">{t.theme}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.blurb}</p>
              {t.href && t.hrefLabel && (
                <Link href={t.href} className="mt-3 inline-block text-sm font-medium text-brand hover:underline">
                  {t.hrefLabel} →
                </Link>
              )}
            </Card>
          ))}
        </div>
      </Section>

      <Section id="companies" title="Companies & ecosystem">
        <Paras items={[E.reportedScale]} />
        <p className="max-w-3xl text-sm text-muted-foreground">
          For the confirmed exhibitor and participant list, see the{" "}
          <a href={E.officialUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">official site ↗</a>.
          To explore companies and roles across the industry on Semitree, visit the{" "}
          <Link href="/industry" className="font-medium text-brand hover:underline">industry directory</Link>.
        </p>
      </Section>

      <Section id="learning" title="Semitree learning">
        <p className="max-w-3xl text-sm text-muted-foreground">
          Use the event as a map into Semitree&rsquo;s learning across the value chain.
        </p>
        <div className="flex flex-wrap gap-2">
          {E.learningLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {l.label} →
            </Link>
          ))}
        </div>
      </Section>

      <Section id="coverage" title="Semitree coverage">
        <p className="max-w-3xl text-sm text-muted-foreground">
          Semitree&rsquo;s news, explainers, research and analysis tagged for this
          event appear below, grouped by day and type. Everything Semitree
          publishes also lives in the existing sections.
        </p>
        <SemiconCoverage
          articles={getSemiconArticles()}
          days={E.days.map((d) => ({ label: d.label, iso: d.iso }))}
        />
        <div className="flex flex-wrap gap-4 text-sm">
          {E.coverageLinks.map((l) => (
            <Link key={l.href} href={l.href} className="font-medium text-brand hover:underline">
              {l.label} →
            </Link>
          ))}
        </div>
      </Section>

      <Section id="india" title="India's semiconductor ecosystem">
        <Paras items={E.indiaEcosystem} />
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/industry/map/india" className="font-medium text-brand hover:underline">India ecosystem map →</Link>
          <Link href="/semiconductors/ecosystem" className="font-medium text-brand hover:underline">The semiconductor ecosystem →</Link>
        </div>
      </Section>

      <Section id="official" title="Official resources">
        <Card className="bg-muted/20 p-5">
          <ul className="space-y-2">
            {E.officialResources.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            {E.positioning}
          </p>
        </Card>
      </Section>
    </Container>
  );
}
