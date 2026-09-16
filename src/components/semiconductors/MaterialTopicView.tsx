import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { getSemiLesson } from "@/lib/knowledge/semi-lessons";
import { getProcessLinkForMaterial } from "@/lib/knowledge/process-links";
import { getProcess } from "@/lib/knowledge/manufacturing";
import { ManufacturingRelationship } from "@/components/semiconductors/ManufacturingRelationship";
import { LearningLoop } from "@/components/semiconductors/LearningLoop";
import type { MaterialTopic, TopicLink } from "@/lib/knowledge/material-topics";

/** The first related process lesson that is also a manufacturing process page. */
function firstMfgProcess(slugs?: string[]): { label: string; href: string } | undefined {
  for (const s of slugs ?? []) {
    const p = getProcess(s);
    if (p) return { label: `${p.name} process`, href: `/manufacturing/${s}` };
  }
  return undefined;
}

/**
 * Reusable template for a single semiconductor material topic. Every section is
 * optional and renders only when the topic provides it — so one component serves
 * simple and detailed materials alike. Presentational only; reuses the design
 * system. Section order follows the beginner -> researcher learning arc.
 */

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`${id}-h`} className="space-y-3">
      <h2 id={`${id}-h`} className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Paras({ items }: { items: string[] }) {
  return (
    <div className="space-y-3 leading-relaxed text-foreground">
      {items.map((p, i) => <p key={i}>{p}</p>)}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2 leading-relaxed text-foreground">
          <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function NamedGrid({ items }: { items: { name: string; detail: string }[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map((p) => (
        <div key={p.name}>
          <dt className="text-sm font-semibold text-foreground">{p.name}</dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{p.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

function lessonChips(slugs: string[]): TopicLink[] {
  return slugs
    .map((slug): TopicLink | null => {
      const l = getSemiLesson(slug);
      return l ? { label: l.title, href: `/semiconductors/learn/${slug}` } : null;
    })
    .filter((x): x is TopicLink => x !== null);
}

function ChipRow({ links }: { links: TopicLink[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) =>
        l.href ? (
          <Link
            key={l.label}
            href={l.href}
            className="rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {l.label} →
          </Link>
        ) : (
          <span key={l.label} className="rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground">
            {l.label}
          </span>
        ),
      )}
    </div>
  );
}

export function MaterialTopicView({ topic }: { topic: MaterialTopic }) {
  const t = topic;
  const conceptChips = t.relatedConceptLessons ? lessonChips(t.relatedConceptLessons) : [];
  const processChips = t.relatedProcessLessons ? lessonChips(t.relatedProcessLessons) : [];
  const mfgLink = getProcessLinkForMaterial(t.slug);
  const seeProcess = mfgLink?.manufacturingSlug
    ? { label: `${mfgLink.process} process`, href: `/manufacturing/${mfgLink.manufacturingSlug}` }
    : firstMfgProcess(t.relatedProcessLessons);

  return (
    <Container className="space-y-10 py-10">
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Explore", href: "/explore" },
            { label: "Materials", href: "/semiconductors/materials" },
            { label: t.title },
          ]}
        />
        <Badge variant="brand">Material</Badge>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{t.summary}</p>
      </header>

      {t.quickAnswer && (
        <Card className="border-brand/30 bg-brand/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">In short</h2>
          <p className="mt-2 leading-relaxed text-foreground">{t.quickAnswer}</p>
        </Card>
      )}

      {t.whyItMatters && (
        <Section id="why" title="Why it matters"><Paras items={[t.whyItMatters]} /></Section>
      )}
      {t.intuition && t.intuition.length > 0 && (
        <Section id="intuition" title="Beginner intuition"><Paras items={t.intuition} /></Section>
      )}

      {t.properties && t.properties.length > 0 && (
        <Section id="properties" title="Material properties">
          <NamedGrid items={t.properties} />
          {t.propertiesNote && (
            <Alert variant="info" title="A note on properties">{t.propertiesNote}</Alert>
          )}
        </Section>
      )}

      {t.whereUsed && t.whereUsed.length > 0 && (
        <Section id="where" title="Where it is used"><Bullets items={t.whereUsed} /></Section>
      )}

      {t.processConnection && (
        <Section id="process" title="Manufacturing process connection">
          <Paras items={[t.processConnection]} />
        </Section>
      )}

      {t.relatedEquipment && t.relatedEquipment.length > 0 && (
        <Section id="equipment" title="Equipment connection">
          <ChipRow links={t.relatedEquipment} />
        </Section>
      )}

      {t.parameters && t.parameters.length > 0 && (
        <Section id="parameters" title="Important parameters">
          <NamedGrid items={t.parameters} />
          {t.parametersNote && (
            <Alert variant="info" title="A note on numbers">{t.parametersNote}</Alert>
          )}
        </Section>
      )}

      {t.purity && t.purity.length > 0 && (
        <Section id="purity" title="Purity & contamination"><Paras items={t.purity} /></Section>
      )}
      {t.processCompatibility && t.processCompatibility.length > 0 && (
        <Section id="compatibility" title="Process compatibility"><Bullets items={t.processCompatibility} /></Section>
      )}

      {t.defects && t.defects.length > 0 && (
        <Section id="defects" title="Common issues">
          <Alert variant="warning" title="What can go wrong:">
            <ul className="ml-4 list-disc space-y-1">
              {t.defects.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </Alert>
        </Section>
      )}

      {t.performance && t.performance.length > 0 && (
        <Section id="performance" title="Performance implications"><Paras items={t.performance} /></Section>
      )}
      {t.yieldImplications && t.yieldImplications.length > 0 && (
        <Section id="yield" title="Yield implications"><Paras items={t.yieldImplications} /></Section>
      )}

      {(t.packagingConnection || t.supplyChainConnection) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {t.packagingConnection && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-foreground">Packaging connection</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.packagingConnection}</p>
              <Link href="/semiconductors/packaging" className="mt-2 inline-block text-sm font-medium text-brand hover:underline">Packaging →</Link>
            </Card>
          )}
          {t.supplyChainConnection && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-foreground">Supply-chain importance</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.supplyChainConnection}</p>
              <Link href="/supply-chain" className="mt-2 inline-block text-sm font-medium text-brand hover:underline">Supply chain →</Link>
            </Card>
          )}
        </div>
      )}

      {t.safety && t.safety.length > 0 && (
        <Section id="safety" title="Environmental & safety">
          <Alert variant="warning" title="Handle with care">
            <ul className="ml-4 list-disc space-y-1">
              {t.safety.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </Alert>
        </Section>
      )}

      {(t.selectionNote || (t.alternatives && t.alternatives.length > 0)) && (
        <Section id="alternatives" title="Alternatives & material selection">
          {t.selectionNote && <Paras items={[t.selectionNote]} />}
          {t.alternatives && t.alternatives.length > 0 && <NamedGrid items={t.alternatives} />}
        </Section>
      )}

      {t.advanced && t.advanced.length > 0 && (
        <details id="advanced" className="group scroll-mt-20 rounded-xl border border-border bg-muted/20 p-5">
          <summary className="cursor-pointer list-none text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="text-brand transition-transform group-open:rotate-90">▸</span>
              Advanced &amp; research
            </span>
          </summary>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">
            {t.advanced.map((a, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {mfgLink && (
        <ManufacturingRelationship link={mfgLink} currentSlug={t.slug} currentKind="material" />
      )}

      {/* Connections */}
      {(processChips.length > 0 || conceptChips.length > 0 || t.relatedMaterials?.length) && (
        <Section id="related" title="How this connects">
          <div className="grid gap-5 sm:grid-cols-2">
            {processChips.length > 0 && (
              <div className="space-y-2"><h3 className="text-sm font-semibold">Related processes</h3><ChipRow links={processChips} /></div>
            )}
            {conceptChips.length > 0 && (
              <div className="space-y-2"><h3 className="text-sm font-semibold">Related concepts</h3><ChipRow links={conceptChips} /></div>
            )}
            {t.relatedMaterials && t.relatedMaterials.length > 0 && (
              <div className="space-y-2"><h3 className="text-sm font-semibold">Related materials</h3><ChipRow links={t.relatedMaterials} /></div>
            )}
          </div>
        </Section>
      )}

      {t.learningLoop ? (
        <LearningLoop
          youJustLearned={t.learningLoop.youJustLearned}
          nowYouKnow={t.learningLoop.nowYouKnow}
          learnNext={t.learnNext}
          seeProcess={seeProcess}
          understandMaterial={t.relatedMaterials}
          understandMachine={t.relatedEquipment}
          hasAdvanced={!!(t.advanced && t.advanced.length > 0)}
          backHref="/semiconductors/materials"
          backLabel="All materials"
        />
      ) : (
        t.learnNext && t.learnNext.length > 0 && (
          <Card className="bg-muted/30 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Learn next</h2>
            <div className="mt-3"><ChipRow links={t.learnNext} /></div>
            <Link href="/semiconductors/materials" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
              ← All materials
            </Link>
          </Card>
        )
      )}
    </Container>
  );
}
