import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { ProcessIODiagram } from "@/components/manufacturing/ProcessIODiagram";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import {
  MFG_PROCESSES,
  STAGES,
  getProcess,
  processNeighbors,
} from "@/lib/knowledge/manufacturing";
import { getSemiTool } from "@/lib/data/semi-tools";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return MFG_PROCESSES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const process = getProcess(slug);
  if (!process) return pageMeta({ title: "Process", description: "", path: "/manufacturing" });
  return pageMeta({
    title: `${process.name} — Manufacturing`,
    description: `${process.what} Part of semiconductor manufacturing on Semitree.`,
    path: `/manufacturing/${process.slug}`,
  });
}

const linkClass =
  "group inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
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

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const process = getProcess(slug);
  if (!process) notFound();

  const stage = STAGES.find((s) => s.id === process.stage);
  const { prev, next } = processNeighbors(process.slug);

  // Learning loop targets.
  const learnHref = process.lessonSlug
    ? `/semiconductors/learn/${process.lessonSlug}`
    : "/semiconductors/learn";
  const understand = process.relatedConcepts.find(
    (c) => c.slug !== process.lessonSlug,
  );
  const understandHref = understand
    ? `/semiconductors/learn/${understand.slug}`
    : learnHref;
  const firstTool = process.relatedTools[0]
    ? getSemiTool(process.relatedTools[0])
    : undefined;
  const calculateHref = firstTool
    ? `/semiconductors/tools/${firstTool.slug}`
    : "/semiconductors/tools";

  return (
    <Container className="space-y-10 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Semiconductors", path: "/explore" },
            { name: "Manufacturing", path: "/manufacturing" },
            { name: process.name, path: `/manufacturing/${process.slug}` },
          ]),
        ])}
      />
      <TrackView
        event="manufacturing_process_opened"
        payload={{ process: process.slug }}
      />

      {/* Header */}
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Semiconductors", href: "/explore" },
            { label: "Manufacturing", href: "/manufacturing" },
            { label: process.name },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex h-6 items-center rounded-full bg-brand/10 px-2 font-mono text-xs font-semibold text-brand">
            Step {process.order} of {MFG_PROCESSES.length}
          </span>
          {stage && (
            <span className="text-muted-foreground">{stage.label}</span>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{process.name}</h1>
        <p className="max-w-2xl text-muted-foreground">{process.tagline}</p>
      </header>

      {/* Learning loop */}
      <section
        aria-label="Learning loop"
        className="rounded-xl border border-border bg-muted/30 p-5"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          Learn → Understand → Explore → Calculate
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <ButtonLink href={learnHref} variant="primary" size="sm">
            Learn {process.name.toLowerCase()}
          </ButtonLink>
          <ButtonLink href={understandHref} variant="outline" size="sm">
            Understand {understand ? understand.label.toLowerCase() : "the concept"}
          </ButtonLink>
          <ButtonLink href="/industry" variant="outline" size="sm">
            Explore the industry
          </ButtonLink>
          <ButtonLink href={calculateHref} variant="outline" size="sm">
            {firstTool ? `Calculate: ${firstTool.name}` : "Explore tools"}
          </ButtonLink>
        </div>
      </section>

      {/* Inputs → process → outputs */}
      <section aria-label="Inputs and outputs" className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">At a glance</h2>
        <ProcessIODiagram
          name={process.name}
          inputs={process.inputs}
          outputs={process.outputs}
        />
      </section>

      {/* What / Why / How */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">What is it?</h2>
          <p className="text-sm leading-relaxed text-foreground">{process.what}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Why is it needed?</h2>
          <p className="text-sm leading-relaxed text-foreground">{process.why}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">How does it work?</h2>
          <div className="space-y-2 text-sm leading-relaxed text-foreground">
            {process.how.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Parameters / defects / equipment / materials */}
      <section className="grid gap-4 sm:grid-cols-2">
        <InfoList title="Critical parameters" items={process.criticalParameters} />
        <InfoList title="Typical defects" items={process.defects} />
        <InfoList title="Equipment involved" items={process.equipment} />
        <InfoList title="Materials involved" items={process.materials} />
      </section>

      {/* Related */}
      <section aria-labelledby="related-heading" className="space-y-4">
        <h2 id="related-heading" className="text-lg font-semibold tracking-tight">
          Keep going
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Related concepts</h3>
            <ul className="space-y-2">
              {process.relatedConcepts.map((c) => (
                <li key={c.slug}>
                  <Link href={`/semiconductors/learn/${c.slug}`} className={linkClass}>
                    {c.label} <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Related tools</h3>
            {process.relatedTools.length > 0 ? (
              <ul className="space-y-2">
                {process.relatedTools.map((slug) => {
                  const tool = getSemiTool(slug);
                  if (!tool) return null;
                  return (
                    <li key={slug}>
                      <Link href={`/semiconductors/tools/${slug}`} className={linkClass}>
                        {tool.name} <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No calculator maps directly to this step yet.{" "}
                <Link href="/semiconductors/tools" className={linkClass}>
                  Browse all tools →
                </Link>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Related companies</h3>
            <ul className="space-y-2">
              {process.industrySegments.map((seg) => (
                <li key={seg} className="text-sm text-muted-foreground">
                  {seg}
                </li>
              ))}
            </ul>
            <Link href="/industry" className={linkClass}>
              Explore the industry <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Related research</h3>
            <ul className="space-y-2">
              {process.researchThemes.map((theme) => (
                <li key={theme} className="text-sm text-muted-foreground">
                  {theme}
                </li>
              ))}
            </ul>
            <Link href="/research" className={linkClass}>
              Research hub <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Prev / next flow navigation */}
      <nav
        aria-label="Process navigation"
        className="grid gap-4 border-t border-border pt-6 sm:grid-cols-2"
      >
        {prev ? (
          <Link
            href={`/manufacturing/${prev.slug}`}
            className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/50"
          >
            <span className="text-xs text-muted-foreground">← Previous step</span>
            <span className="mt-1 block font-semibold tracking-tight group-hover:text-brand">
              {prev.name}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/manufacturing/${next.slug}`}
            className="group rounded-xl border border-border bg-card p-4 text-right transition-colors hover:border-brand/50 sm:text-right"
          >
            <span className="text-xs text-muted-foreground">Next step →</span>
            <span className="mt-1 block font-semibold tracking-tight group-hover:text-brand">
              {next.name}
            </span>
          </Link>
        ) : (
          <Link
            href="/manufacturing"
            className="group rounded-xl border border-border bg-card p-4 text-right transition-colors hover:border-brand/50"
          >
            <span className="text-xs text-muted-foreground">Done →</span>
            <span className="mt-1 block font-semibold tracking-tight group-hover:text-brand">
              Back to the full flow
            </span>
          </Link>
        )}
      </nav>
    </Container>
  );
}
