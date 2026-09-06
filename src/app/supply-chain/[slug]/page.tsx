import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import {
  SUPPLY_STAGES,
  SEGMENTS,
  INTEL_DIMENSIONS,
  getStage,
  stageNeighbors,
  stageEquipment,
  stageMaterials,
} from "@/lib/knowledge/supply-chain";
import { companiesForTypes } from "@/lib/industry/companies";
import { COMPANY_TYPE_LABELS } from "@/lib/industry/types";
import { getProcess } from "@/lib/knowledge/manufacturing";
import { getSemiTool } from "@/lib/data/semi-tools";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPLY_STAGES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stage = getStage(slug);
  if (!stage) return pageMeta({ title: "Stage", description: "", path: "/supply-chain" });
  return pageMeta({
    title: `${stage.name} — Supply chain`,
    description: `${stage.whatHappens} Part of the semiconductor supply chain on Semitree.`,
    path: `/supply-chain/${stage.slug}`,
  });
}

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function InfoList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
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

export default async function StagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stage = getStage(slug);
  if (!stage) notFound();

  const segment = SEGMENTS.find((s) => s.id === stage.segment);
  const { prev, next } = stageNeighbors(stage.slug);
  const equipment = stageEquipment(stage);
  const materials = stageMaterials(stage);
  const companies = companiesForTypes(stage.companyTypes);

  return (
    <Container className="space-y-10 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Semiconductors", path: "/explore" },
            { name: "Supply chain", path: "/supply-chain" },
            { name: stage.name, path: `/supply-chain/${stage.slug}` },
          ]),
        ])}
      />
      <TrackView event="supply_chain_stage_opened" payload={{ stage: stage.slug }} />

      {/* Header */}
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Semiconductors", href: "/explore" },
            { label: "Supply chain", href: "/supply-chain" },
            { label: stage.name },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex h-6 items-center rounded-full bg-brand/10 px-2 font-mono text-xs font-semibold text-brand">
            Stage {stage.order} of {SUPPLY_STAGES.length}
          </span>
          {segment && <span className="text-muted-foreground">{segment.label}</span>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{stage.name}</h1>
        <p className="max-w-2xl text-muted-foreground">{stage.tagline}</p>
      </header>

      {/* What happens here */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">What happens here?</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-foreground">{stage.whatHappens}</p>
      </section>

      {/* Example chain */}
      {stage.exampleChain && stage.exampleChain.length > 0 && (
        <section aria-label="Example connection" className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">How it connects</h2>
          <div className="overflow-x-auto">
            <ol className="flex min-w-max items-center gap-2">
              {stage.exampleChain.map((link, i) => (
                <li key={link.label} className="flex items-center gap-2">
                  {link.href ? (
                    <Link href={link.href} className="rounded-full border border-brand/40 bg-brand/5 px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/10">
                      {link.label}
                    </Link>
                  ) : (
                    <span className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground">
                      {link.label}
                    </span>
                  )}
                  {i < stage.exampleChain!.length - 1 && (
                    <span aria-hidden="true" className="text-brand/50">→</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Participants / technologies / equipment / materials / skills */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoList title="Who participates" items={stage.participants} />
        <InfoList title="Technologies involved" items={stage.technologies} />
        <InfoList title="Equipment required" items={equipment} />
        <InfoList title="Materials required" items={materials} />
        <InfoList title="Skills required" items={stage.skills} />
        <InfoList title="Research happening" items={stage.researchThemes} />
      </section>

      {/* Companies operating here (from the verified registry) */}
      <section aria-labelledby="companies-heading" className="space-y-3">
        <h2 id="companies-heading" className="text-lg font-semibold tracking-tight">
          Companies operating here
        </h2>
        {companies.length > 0 ? (
          <>
            <ul className="flex flex-wrap gap-2">
              {companies.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/industry/companies/${c.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-brand/50 hover:text-brand"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              From Semitree&apos;s{" "}
              <Link href="/industry/companies" className={linkClass}>directory</Link>{" "}
              (a curated sample) — types:{" "}
              {stage.companyTypes.map((t) => COMPANY_TYPE_LABELS[t]).join(", ")}.
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No companies of this type are in the directory yet.{" "}
            <Link href="/industry/companies" className={linkClass}>Browse the directory →</Link>
          </p>
        )}
      </section>

      {/* Interlinks */}
      <section aria-labelledby="links-heading" className="space-y-4">
        <h2 id="links-heading" className="text-lg font-semibold tracking-tight">Explore the detail</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Manufacturing processes</h3>
            {stage.relatedProcesses && stage.relatedProcesses.length > 0 ? (
              <ul className="space-y-1.5">
                {stage.relatedProcesses.map((pslug) => {
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
                <Link href="/manufacturing" className={linkClass}>Manufacturing Explorer →</Link>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Concepts</h3>
            {stage.relatedConcepts && stage.relatedConcepts.length > 0 ? (
              <ul className="space-y-1.5">
                {stage.relatedConcepts.map((c) => (
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
            <h3 className="text-sm font-semibold">Tools</h3>
            {stage.relatedTools && stage.relatedTools.length > 0 ? (
              <ul className="space-y-1.5">
                {stage.relatedTools.map((tslug) => {
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
                <Link href="/semiconductors/tools" className={linkClass}>Browse tools →</Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Future-ready: supply-chain intelligence */}
      <section aria-labelledby="intel-heading" className="rounded-xl border border-border bg-muted/30 p-5">
        <h2 id="intel-heading" className="text-sm font-semibold tracking-tight">
          Supply-chain intelligence
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          These dimensions are architected for this stage. Only data derived from
          verified sources is shown — no speculative figures.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {INTEL_DIMENSIONS.map((d) => (
            <li
              key={d.key}
              className={
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium " +
                (d.status === "available"
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground")
              }
            >
              {d.label}
              <span className="opacity-70">
                {d.status === "available" ? "· available" : "· planned"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Prev / next */}
      <nav aria-label="Stage navigation" className="grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
        {prev ? (
          <Link href={`/supply-chain/${prev.slug}`} className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/50">
            <span className="text-xs text-muted-foreground">← Previous stage</span>
            <span className="mt-1 block font-semibold tracking-tight group-hover:text-brand">{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/supply-chain/${next.slug}`} className="group rounded-xl border border-border bg-card p-4 text-right transition-colors hover:border-brand/50">
            <span className="text-xs text-muted-foreground">Next stage →</span>
            <span className="mt-1 block font-semibold tracking-tight group-hover:text-brand">{next.name}</span>
          </Link>
        ) : (
          <Link href="/supply-chain" className="group rounded-xl border border-border bg-card p-4 text-right transition-colors hover:border-brand/50">
            <span className="text-xs text-muted-foreground">Done →</span>
            <span className="mt-1 block font-semibold tracking-tight group-hover:text-brand">Back to the full chain</span>
          </Link>
        )}
      </nav>
    </Container>
  );
}
