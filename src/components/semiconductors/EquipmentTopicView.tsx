import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { getSemiLesson } from "@/lib/knowledge/semi-lessons";
import { getProcessLinkForEquipment } from "@/lib/knowledge/process-links";
import { getProcess } from "@/lib/knowledge/manufacturing";
import { ManufacturingRelationship } from "@/components/semiconductors/ManufacturingRelationship";
import { LearningLoop } from "@/components/semiconductors/LearningLoop";
import { TopicDiagram } from "@/components/semiconductors/TopicDiagram";
import { AdvancedResearch } from "@/components/semiconductors/AdvancedResearch";
import type { EquipmentTopic, TopicLink } from "@/lib/knowledge/equipment-topics";

/** The first related process lesson that is also a manufacturing process page. */
function firstMfgProcess(slugs?: string[]): { label: string; href: string } | undefined {
  for (const s of slugs ?? []) {
    const p = getProcess(s);
    if (p) return { label: `${p.name} process`, href: `/manufacturing/${s}` };
  }
  return undefined;
}

/**
 * Reusable template for a single semiconductor equipment topic. Every section is
 * optional and renders only when the topic provides it — so one component serves
 * simple and detailed topics alike. Presentational only; reuses the design
 * system. Section order follows the beginner → researcher learning arc.
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

export function EquipmentTopicView({ topic }: { topic: EquipmentTopic }) {
  const t = topic;
  const conceptChips = t.relatedConceptLessons ? lessonChips(t.relatedConceptLessons) : [];
  const processChips = t.relatedProcessLessons ? lessonChips(t.relatedProcessLessons) : [];
  const mfgLink = getProcessLinkForEquipment(t.slug);
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
            { label: "Equipment", href: "/semiconductors/equipment" },
            { label: t.title },
          ]}
        />
        <Badge variant="brand">Equipment</Badge>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{t.summary}</p>
      </header>

      {t.quickAnswer && (
        <Card className="border-brand/30 bg-brand/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">In short</h2>
          <p className="mt-2 leading-relaxed text-foreground">{t.quickAnswer}</p>
        </Card>
      )}

      {t.diagram && (
        <figure className="rounded-xl border border-border bg-muted/10 p-5">
          <TopicDiagram diagramKey={t.diagram} />
          {t.diagramCaption && (
            <figcaption className="mt-3 text-center text-sm font-medium text-muted-foreground">{t.diagramCaption}</figcaption>
          )}
        </figure>
      )}

      {t.whyItMatters && (
        <Section id="why" title="Why it matters"><Paras items={[t.whyItMatters]} /></Section>
      )}
      {t.intuition && t.intuition.length > 0 && (
        <Section id="intuition" title="Beginner intuition"><Paras items={t.intuition} /></Section>
      )}
      {t.whereItFits && (
        <Section id="where" title="Where it fits in manufacturing"><Paras items={[t.whereItFits]} /></Section>
      )}

      {(t.inputs || t.howItWorks || t.outputs) && (
        <Section id="how" title="How it works">
          <div className="grid gap-6 lg:grid-cols-3">
            {t.inputs && t.inputs.length > 0 && (
              <Card className="p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">What goes in</h3>
                <div className="mt-2"><Bullets items={t.inputs} /></div>
              </Card>
            )}
            {t.howItWorks && t.howItWorks.length > 0 && (
              <Card className="p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">What happens inside</h3>
                <ol className="mt-2 space-y-2">
                  {t.howItWorks.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground">
                      <span aria-hidden="true" className="font-mono text-xs font-semibold text-brand">{i + 1}.</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            )}
            {t.outputs && t.outputs.length > 0 && (
              <Card className="p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">What comes out</h3>
                <div className="mt-2"><Bullets items={t.outputs} /></div>
              </Card>
            )}
          </div>
        </Section>
      )}

      {t.subsystems && t.subsystems.length > 0 && (
        <Section id="subsystems" title="Major subsystems">
          <div className="grid gap-3 sm:grid-cols-2">
            {t.subsystems.map((s) => (
              <Card key={s.name} className="p-4">
                <h3 className="text-sm font-semibold text-foreground">{s.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {t.parameters && t.parameters.length > 0 && (
        <Section id="parameters" title="Process parameters that matter">
          <dl className="grid gap-3 sm:grid-cols-2">
            {t.parameters.map((p) => (
              <div key={p.name}>
                <dt className="text-sm font-semibold text-foreground">{p.name}</dt>
                <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{p.detail}</dd>
              </div>
            ))}
          </dl>
          {t.parametersNote && (
            <Alert variant="info" title="A note on numbers">{t.parametersNote}</Alert>
          )}
        </Section>
      )}

      {t.performance && t.performance.length > 0 && (
        <Section id="performance" title="What determines performance"><Paras items={t.performance} /></Section>
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
      {t.metrology && t.metrology.length > 0 && (
        <Section id="metrology" title="Metrology & inspection"><Paras items={t.metrology} /></Section>
      )}
      {t.yieldImplications && t.yieldImplications.length > 0 && (
        <Section id="yield" title="Yield implications"><Paras items={t.yieldImplications} /></Section>
      )}
      {t.manufacturingImplications && t.manufacturingImplications.length > 0 && (
        <Section id="manufacturing" title="Manufacturing implications"><Paras items={t.manufacturingImplications} /></Section>
      )}
      {t.cost && t.cost.length > 0 && (
        <Section id="cost" title="Cost & economics"><Paras items={t.cost} /></Section>
      )}

      {t.advanced && t.advanced.length > 0 && <AdvancedResearch items={t.advanced} />}

      {/* Connections */}
      {(conceptChips.length > 0 || processChips.length > 0 || t.relatedMaterials?.length || t.relatedEquipment?.length) && (
        <Section id="related" title="How this connects">
          <div className="grid gap-5 sm:grid-cols-2">
            {processChips.length > 0 && (
              <div className="space-y-2"><h3 className="text-sm font-semibold">Related process</h3><ChipRow links={processChips} /></div>
            )}
            {conceptChips.length > 0 && (
              <div className="space-y-2"><h3 className="text-sm font-semibold">Related concepts</h3><ChipRow links={conceptChips} /></div>
            )}
            {t.relatedMaterials && t.relatedMaterials.length > 0 && (
              <div className="space-y-2"><h3 className="text-sm font-semibold">Related materials</h3><ChipRow links={t.relatedMaterials} /></div>
            )}
            {t.relatedEquipment && t.relatedEquipment.length > 0 && (
              <div className="space-y-2"><h3 className="text-sm font-semibold">Related equipment</h3><ChipRow links={t.relatedEquipment} /></div>
            )}
          </div>
        </Section>
      )}

      {mfgLink && (
        <ManufacturingRelationship link={mfgLink} currentSlug={t.slug} currentKind="equipment" />
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
              <h3 className="text-sm font-semibold text-foreground">Supply-chain connection</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.supplyChainConnection}</p>
              <Link href="/supply-chain" className="mt-2 inline-block text-sm font-medium text-brand hover:underline">Supply chain →</Link>
            </Card>
          )}
        </div>
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
          backHref="/semiconductors/equipment"
          backLabel="All equipment"
        />
      ) : (
        t.learnNext && t.learnNext.length > 0 && (
          <Card className="bg-muted/30 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Learn next</h2>
            <div className="mt-3"><ChipRow links={t.learnNext} /></div>
            <Link href="/semiconductors/equipment" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
              ← All equipment
            </Link>
          </Card>
        )
      )}
    </Container>
  );
}
