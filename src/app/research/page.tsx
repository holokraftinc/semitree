import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Alert } from "@/components/ui/Alert";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import {
  SECTIONS,
  RESEARCH_TOPICS,
  resourcesByType,
} from "@/lib/research/registry";
import { RESOURCE_TYPE_LABELS, type ResourceType } from "@/lib/research/types";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Research hub",
  description:
    "Semiconductor research on Semitree: journals, conferences, universities, research labs, and active research topics linked to the knowledge base. Papers, patents, and researcher profiles are added only with verified sources.",
  path: "/research",
});

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const FUTURE = [
  "Paper alerts",
  "Saved papers",
  "Research collections",
  "Citation management",
  "Researcher profiles",
];

function ResourceSection({ type }: { type: ResourceType }) {
  const resources = resourcesByType(type);
  const label = RESOURCE_TYPE_LABELS[type];
  return (
    <section aria-labelledby={`sec-${type}`} className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={`sec-${type}`} className="text-lg font-semibold tracking-tight">{label}</h2>
        <span className="text-xs text-muted-foreground">{resources.length}</span>
      </div>
      {resources.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <li key={r.id} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium">{r.title}</p>
              {r.organization && (
                <p className="text-xs text-muted-foreground">{r.organization}</p>
              )}
              {r.url && (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className={`${linkClass} mt-1`}>
                  Official site ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
          No verified {label.toLowerCase()} listed yet. Entries are added only with
          individually verified sources — nothing fabricated.
        </div>
      )}
    </section>
  );
}

export default function ResearchPage() {
  const topicCount = RESEARCH_TOPICS.length;

  return (
    <Container className="space-y-12 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Research", path: "/research" },
          ]),
        ])}
      />
      <TrackView event="research_hub_opened" payload={{}} />

      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Research" }]} />
        <h1 className="text-3xl font-bold tracking-tight">Research hub</h1>
        <p className="max-w-2xl text-muted-foreground">
          A hub for the research behind the field — journals, conferences,
          universities, labs, and the active topics that connect to Semitree&apos;s
          concepts, processes, tools, and companies.
        </p>
      </div>

      <Alert variant="info" title="Verified sources only — nothing fabricated">
        Journals, conferences, universities, and labs listed here are real,
        established institutions; links point to official homepages where known.
        Papers, patents, and researcher profiles are added only with
        individually verified sources, so those sections stay empty until then.
      </Alert>

      {/* Section overview */}
      <section aria-labelledby="overview" className="space-y-4">
        <h2 id="overview" className="sr-only">Sections</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s) => {
            const count = s.type === "topic" ? topicCount : resourcesByType(s.type).length;
            const href = s.type === "topic" ? "/research/topics" : `#sec-${s.type}`;
            return (
              <Link key={s.type} href={href} className="group rounded-xl border border-border bg-card p-4 shadow-card transition-colors hover:border-brand/50">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold tracking-tight group-hover:text-brand">{s.label}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured research topics */}
      <section aria-labelledby="topics" className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="topics" className="text-lg font-semibold tracking-tight">Research topics</h2>
          <Link href="/research/topics" className={linkClass}>Browse & filter all →</Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESEARCH_TOPICS.slice(0, 6).map((t) => (
            <li key={t.slug}>
              <Link href={`/research/topics/${t.slug}`} className="group block h-full rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50">
                <h3 className="font-semibold tracking-tight group-hover:text-brand">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Sections */}
      <div className="space-y-10">
        <ResourceSection type="journal" />
        <ResourceSection type="conference" />
        <ResourceSection type="lab" />
        <ResourceSection type="university" />
        <ResourceSection type="paper" />
        <ResourceSection type="patent" />
        <ResourceSection type="researcher" />
      </div>

      {/* Future */}
      <section className="rounded-xl border border-border bg-muted/30 p-5">
        <p className="text-sm font-semibold tracking-tight">Coming to the research hub</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Architected for later, once accounts exist — not available yet.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {FUTURE.map((f) => (
            <li key={f} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {f} · planned
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
