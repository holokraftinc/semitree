import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import { RESEARCH_TOPICS, getTopic } from "@/lib/research/registry";
import { getProcess } from "@/lib/knowledge/manufacturing";
import { getSemiTool } from "@/lib/data/semi-tools";
import { getCompany } from "@/lib/industry/companies";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return RESEARCH_TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return pageMeta({ title: "Research topic", description: "", path: "/research/topics" });
  return pageMeta({
    title: `${topic.name} — Research`,
    description: topic.summary,
    path: `/research/topics/${topic.slug}`,
  });
}

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function TagCard({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">{i}</span>
        ))}
      </div>
    </Card>
  );
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  return (
    <Container className="space-y-10 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Research", path: "/research" },
            { name: "Topics", path: "/research/topics" },
            { name: topic.name, path: `/research/topics/${topic.slug}` },
          ]),
        ])}
      />
      <TrackView event="research_topic_opened" payload={{ topic: topic.slug }} />

      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: "Topics", href: "/research/topics" },
            { label: topic.name },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">{topic.name}</h1>
        <p className="max-w-2xl text-muted-foreground">{topic.summary}</p>
      </header>

      <section className="space-y-2">
        {topic.description.map((p, i) => (
          <p key={i} className="max-w-3xl text-sm leading-relaxed text-foreground">{p}</p>
        ))}
      </section>

      {/* Facets */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TagCard title="Technologies" items={topic.technologies} />
        <TagCard title="Devices" items={topic.devices} />
        <TagCard title="Materials" items={topic.materials} />
        <TagCard title="Applications" items={topic.applications} />
      </section>

      {/* Open questions */}
      {topic.openQuestions.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Active research directions</h2>
          <ul className="space-y-1.5 text-sm">
            {topic.openQuestions.map((q) => (
              <li key={q} className="flex gap-2">
                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Research → Learning */}
      <section aria-labelledby="connect" className="space-y-4">
        <h2 id="connect" className="text-lg font-semibold tracking-tight">Connect to the knowledge base</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Concepts &amp; lessons</h3>
            {topic.relatedConcepts.length > 0 ? (
              <ul className="space-y-1.5">
                {topic.relatedConcepts.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/semiconductors/learn/${c.slug}`} className={linkClass}>{c.label} →</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                <Link href="/semiconductors/learn" className={linkClass}>Learn semiconductors →</Link>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Processes</h3>
            {topic.relatedProcesses.length > 0 ? (
              <ul className="space-y-1.5">
                {topic.relatedProcesses.map((pslug) => {
                  const proc = getProcess(pslug);
                  if (!proc) return null;
                  return (
                    <li key={pslug}>
                      <Link href={`/manufacturing/${pslug}`} className={linkClass}>{proc.name} →</Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                <Link href="/manufacturing" className={linkClass}>Manufacturing →</Link>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Tools</h3>
            {topic.relatedTools.length > 0 ? (
              <ul className="space-y-1.5">
                {topic.relatedTools.map((tslug) => {
                  const tool = getSemiTool(tslug);
                  if (!tool) return null;
                  return (
                    <li key={tslug}>
                      <Link href={`/semiconductors/tools/${tslug}`} className={linkClass}>{tool.name} →</Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                <Link href="/semiconductors/tools" className={linkClass}>Tools →</Link>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Companies</h3>
            {topic.relatedCompanies.length > 0 ? (
              <ul className="space-y-1.5">
                {topic.relatedCompanies.map((cslug) => {
                  const co = getCompany(cslug);
                  if (!co) return null;
                  return (
                    <li key={cslug}>
                      <Link href={`/industry/companies/${cslug}`} className={linkClass}>{co.name} →</Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                <Link href="/industry/companies" className={linkClass}>Directory →</Link>
              </p>
            )}
          </div>
        </div>
      </section>

      <p className="text-sm text-muted-foreground">
        <Link href="/research/topics" className={linkClass}>← All research topics</Link>
      </p>
    </Container>
  );
}
