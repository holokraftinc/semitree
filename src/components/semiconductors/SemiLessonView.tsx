import Link from "next/link";
import type { SemiLesson, LessonDeepDive, LessonEquation, DeepDiveLevel } from "@/lib/knowledge/semi-lessons";
import { lessonNeighbors, getSemiLesson } from "@/lib/knowledge/semi-lessons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { FormulaBlock } from "@/components/ui/FormulaBlock";
import { LessonDiagram } from "./LessonDiagram";
import { ManufacturingJourney } from "./ManufacturingJourney";
import { LearningTopicProgress } from "@/components/learn/LearningTopicProgress";
import { LearningTopicNav } from "@/components/learn/LearningTopicNav";

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
        <div key={p.name} className="rounded-lg border border-border bg-card p-4">
          <dt className="text-sm font-semibold text-foreground">{p.name}</dt>
          <dd className="mt-1 text-sm text-muted-foreground">{p.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

const LEVEL_META: Record<DeepDiveLevel, { label: string; variant: "info" | "brand" | "warning" }> = {
  engineer: { label: "Engineer", variant: "info" },
  advanced: { label: "Advanced", variant: "brand" },
  researcher: { label: "Researcher", variant: "warning" },
};

/** One equation, fully unpacked: formula, variables + units, meaning, assumptions, example, sensitivity. */
function EquationCard({ eq }: { eq: LessonEquation }) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <FormulaBlock label={eq.name} expression={eq.expression} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Variables</p>
        <dl className="mt-1 space-y-1">
          {eq.variables.map((v) => (
            <div key={v.symbol} className="text-sm leading-relaxed">
              <span className="font-mono font-semibold text-foreground">{v.symbol}</span>
              <span className="text-muted-foreground">
                {" "}— {v.meaning}
                {v.unit ? ` · ${v.unit}` : ""}
              </span>
            </div>
          ))}
        </dl>
      </div>
      <p className="text-sm leading-relaxed text-foreground">
        <span className="font-semibold">Meaning: </span>
        {eq.meaning}
      </p>
      {eq.assumptions && eq.assumptions.length > 0 && (
        <div className="text-sm">
          <p className="font-semibold text-foreground">Assumptions</p>
          <ul className="ml-4 mt-1 list-disc space-y-1 text-muted-foreground">
            {eq.assumptions.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      )}
      {eq.example && (
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-semibold">Example: </span>
          {eq.example}
        </p>
      )}
      {eq.sensitivity && eq.sensitivity.length > 0 && (
        <div className="text-sm">
          <p className="font-semibold text-foreground">When each variable changes</p>
          <ul className="ml-4 mt-1 list-disc space-y-1 text-muted-foreground">
            {eq.sensitivity.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

/** An ordered flow rendered as arrowed pills (e.g. the feedback-control loop). */
function FlowSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center">
          <span className="rounded-full border border-brand/40 bg-brand/5 px-3 py-1 text-sm font-medium text-foreground">
            {s}
          </span>
          {i < steps.length - 1 && <span aria-hidden="true" className="px-1 text-brand/40">→</span>}
        </li>
      ))}
    </ol>
  );
}

/** A collapsed, level-tagged deep-dive panel so advanced content never crowds the basics. */
function DeepDive({ dive }: { dive: LessonDeepDive }) {
  const meta = LEVEL_META[dive.level];
  return (
    <details className="group rounded-xl border border-border bg-muted/20 p-5">
      <summary className="cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="flex flex-wrap items-center gap-3">
          <span aria-hidden="true" className="text-brand transition-transform group-open:rotate-90">▸</span>
          <span className="text-lg font-semibold tracking-tight">{dive.title}</span>
          <Badge variant={meta.variant}>{meta.label}</Badge>
        </span>
      </summary>
      <div className="mt-4 space-y-4">
        {dive.intro && <p className="leading-relaxed text-foreground">{dive.intro}</p>}
        {dive.visualKey && (
          <figure className="rounded-lg border border-border bg-muted/30 p-5">
            <LessonDiagram visualKey={dive.visualKey} />
            {dive.visualCaption && (
              <figcaption className="mt-3 text-center text-sm text-muted-foreground">{dive.visualCaption}</figcaption>
            )}
          </figure>
        )}
        {dive.flow && dive.flow.length > 0 && <FlowSteps steps={dive.flow} />}
        {dive.body && dive.body.length > 0 && <Paras items={dive.body} />}
        {dive.table && dive.table.rows.length > 0 && (
          <figure className="space-y-2">
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    {dive.table.columns.map((c, i) => (
                      <th
                        key={i}
                        scope="col"
                        className={`p-3 font-semibold text-foreground ${i === 0 ? "" : "border-l border-border"}`}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dive.table.rows.map((row, r) => (
                    <tr key={r} className="border-t border-border align-top">
                      {row.map((cell, c) => (
                        <td
                          key={c}
                          className={`p-3 ${c === 0 ? "font-medium text-foreground" : "border-l border-border text-muted-foreground"}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {dive.table.caption && (
              <figcaption className="text-xs text-muted-foreground">{dive.table.caption}</figcaption>
            )}
          </figure>
        )}
        {dive.equations && dive.equations.length > 0 && (
          <div className="space-y-4">
            {dive.equations.map((eq) => <EquationCard key={eq.name} eq={eq} />)}
          </div>
        )}
        {dive.bullets && dive.bullets.length > 0 && <Bullets items={dive.bullets} />}
        {dive.note && <Alert variant="info" title="Key point">{dive.note}</Alert>}
      </div>
    </details>
  );
}

/** Renders one semiconductor lesson via the full template + retention actions. */
export function SemiLessonView({ lesson }: { lesson: SemiLesson }) {
  const { prev, next, path } = lessonNeighbors(lesson.slug);
  const related = (lesson.relatedLessons ?? [])
    .map((s) => getSemiLesson(s))
    .filter((l): l is SemiLesson => Boolean(l));
  const prereqs = (lesson.prerequisites ?? [])
    .map((s) => getSemiLesson(s))
    .filter((l): l is SemiLesson => Boolean(l));
  const index = path ? path.lessonSlugs.indexOf(lesson.slug) + 1 : undefined;
  const total = path?.lessonSlugs.length;

  return (
    <article className="space-y-10">
      <LearningTopicProgress
        topicKey={`semiconductors:${lesson.slug}`}
        title={lesson.title}
        eyebrow={path?.title}
        index={index}
        total={total}
        domain="semiconductors"
      />
      {/* Title */}
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Learn", href: "/learn" },
            { label: "Semiconductors", href: "/semiconductors/learn" },
            { label: lesson.title },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2">
          {path && <Badge variant="brand">{path.title}</Badge>}
          <span className="text-sm text-muted-foreground">
            Lesson {path ? path.lessonSlugs.indexOf(lesson.slug) + 1 : lesson.order} of{" "}
            {path?.lessonSlugs.length}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{lesson.summary}</p>
      </header>

      <div id="learning-content" className="space-y-10">
      {/* Quick start */}
      {lesson.quickStart && lesson.quickStart.length > 0 && (
        <Card className="border-brand/30 bg-brand/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">Quick start</h2>
          <div className="mt-3"><Bullets items={lesson.quickStart} /></div>
        </Card>
      )}

      {/* Prerequisites */}
      {prereqs.length > 0 && (
        <Section id="prerequisites" title="Prerequisites">
          <ul className="flex flex-wrap gap-2">
            {prereqs.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/semiconductors/learn/${p.slug}`}
                  className="rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {p.title} →
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* What you'll learn */}
      <Card className="bg-muted/30 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          What you&rsquo;ll learn
        </h2>
        <ul className="mt-3 space-y-2">
          {lesson.whatYoullLearn.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span aria-hidden="true" className="mt-0.5 text-brand">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Section id="why" title="Why it matters">
        <p className="leading-relaxed text-foreground">{lesson.whyItMatters}</p>
      </Section>

      {lesson.intuition && lesson.intuition.length > 0 && (
        <Section id="intuition" title="Beginner intuition"><Paras items={lesson.intuition} /></Section>
      )}

      {lesson.whereItFits && (
        <Section id="where-it-fits" title="Where it fits in chip manufacturing">
          {lesson.whereItFits.note && <p className="leading-relaxed text-foreground">{lesson.whereItFits.note}</p>}
          <ManufacturingJourney highlightId={lesson.whereItFits.journeyStepId} />
        </Section>
      )}

      <Section id="explanation" title="Explanation">
        <div className="space-y-3 leading-relaxed text-foreground">
          {lesson.explanation.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Section>

      {lesson.howItWorks && lesson.howItWorks.length > 0 && (
        <Section id="how-it-works" title="How it works"><Paras items={lesson.howItWorks} /></Section>
      )}

      {lesson.steps && lesson.steps.length > 0 && (
        <Section id="steps" title="Step-by-step process">
          <ol className="space-y-3">
            {lesson.steps.map((s, i) => (
              <li key={s.name} className="flex gap-3">
                <span aria-hidden="true" className="mt-0.5 font-mono text-xs font-semibold text-brand">{i + 1}.</span>
                <span className="leading-relaxed text-foreground">
                  <span className="font-semibold text-foreground">{s.name}</span> — {s.detail}
                </span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {lesson.science && lesson.science.length > 0 && (
        <Section id="science" title="The physics, chemistry & engineering behind it"><Paras items={lesson.science} /></Section>
      )}

      {lesson.equipment && lesson.equipment.length > 0 && (
        <Section id="equipment" title="Equipment"><NamedGrid items={lesson.equipment} /></Section>
      )}

      {lesson.materials && lesson.materials.length > 0 && (
        <Section id="materials" title="Materials"><NamedGrid items={lesson.materials} /></Section>
      )}

      {lesson.parameters && lesson.parameters.length > 0 && (
        <Section id="parameters" title="Process parameters that matter">
          <NamedGrid items={lesson.parameters} />
          {lesson.parametersNote && (
            <Alert variant="info" title="A note on numbers">{lesson.parametersNote}</Alert>
          )}
        </Section>
      )}

      {/* Visual explanation */}
      <Section id="visual" title="Visual explanation">
        <figure className="rounded-lg border border-border bg-muted/30 p-5">
          {lesson.visualKey && <LessonDiagram visualKey={lesson.visualKey} />}
          <figcaption className="mt-3 text-center text-sm text-muted-foreground">
            {lesson.visual}
          </figcaption>
        </figure>
      </Section>

      {/* Key terminology */}
      <Section id="terminology" title="Key terminology">
        <dl className="grid gap-3 sm:grid-cols-2">
          {lesson.terminology.map((t) => (
            <div key={t.term} className="rounded-lg border border-border bg-card p-4">
              <dt className="text-sm font-semibold text-foreground">{t.term}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{t.def}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Formula */}
      {lesson.formula && (
        <Section id="formula" title="Formula">
          <FormulaBlock expression={lesson.formula.expression} caption={lesson.formula.caption} />
        </Section>
      )}

      {/* Example */}
      <Section id="example" title="Example">
        <Card className="p-5 text-sm leading-relaxed">{lesson.example}</Card>
      </Section>

      {/* Common mistakes */}
      <Section id="mistakes" title="Common mistakes">
        <Alert variant="warning" title="Watch out for:">
          <ul className="ml-4 list-disc space-y-1">
            {lesson.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </Alert>
      </Section>

      {/* Real-world application */}
      <Section id="real-world" title="Real-world application">
        <p className="leading-relaxed text-foreground">{lesson.realWorld}</p>
      </Section>

      {lesson.defects && lesson.defects.length > 0 && (
        <Section id="defects" title="Defects & failure modes">
          <Alert variant="warning" title="What can go wrong:">
            <ul className="ml-4 list-disc space-y-1">
              {lesson.defects.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </Alert>
        </Section>
      )}

      {lesson.metrology && lesson.metrology.length > 0 && (
        <Section id="metrology" title="Measurement & metrology"><Paras items={lesson.metrology} /></Section>
      )}

      {lesson.yieldImpact && lesson.yieldImpact.length > 0 && (
        <Section id="yield" title="Yield impact"><Paras items={lesson.yieldImpact} /></Section>
      )}

      {lesson.designImplications && lesson.designImplications.length > 0 && (
        <Section id="design" title="Design implications"><Bullets items={lesson.designImplications} /></Section>
      )}

      {lesson.industryContext && lesson.industryContext.length > 0 && (
        <Section id="industry" title="Manufacturing & industry context"><Paras items={lesson.industryContext} /></Section>
      )}

      {lesson.deepDives && lesson.deepDives.length > 0 && (
        <section aria-labelledby="deep-dives-h" className="space-y-4">
          <div className="space-y-1">
            <h2 id="deep-dives-h" className="text-xl font-semibold tracking-tight">
              Go deeper: engineering &amp; research
            </h2>
            <p className="text-sm text-muted-foreground">
              Optional expandable sections that build from engineer to advanced to researcher level.
              The basics above are enough for a first read — open these when you want the depth.
            </p>
          </div>
          <div className="space-y-3">
            {lesson.deepDives.map((d) => <DeepDive key={d.id} dive={d} />)}
          </div>
        </section>
      )}

      {lesson.researcherNotes && lesson.researcherNotes.length > 0 && (
        <details className="group rounded-xl border border-border bg-muted/20 p-5">
          <summary className="cursor-pointer list-none text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="text-brand transition-transform group-open:rotate-90">▸</span>
              Researcher &amp; advanced notes
            </span>
          </summary>
          <div className="mt-3"><Bullets items={lesson.researcherNotes} /></div>
        </details>
      )}

      {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
        <Card className="bg-muted/30 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Key takeaways</h2>
          <div className="mt-3"><Bullets items={lesson.keyTakeaways} /></div>
        </Card>
      )}

      {lesson.references && lesson.references.length > 0 && (
        <Section id="references" title="References">
          <ul className="space-y-2 text-sm">
            {lesson.references.map((r, i) => (
              <li key={i}>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="rounded-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {r.title} ↗
                  </a>
                ) : (
                  <span className="font-medium text-foreground">{r.title}</span>
                )}
                {r.author && <span className="text-muted-foreground"> — {r.author}</span>}
                {(r.publisher || r.year) && (
                  <span className="text-muted-foreground"> ({[r.publisher, r.year].filter(Boolean).join(", ")})</span>
                )}
                {r.doi && (
                  <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-brand hover:underline">
                    doi:{r.doi}
                  </a>
                )}
                {r.note && <span className="block text-xs italic text-muted-foreground">{r.note}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Related concepts */}
      {related.length > 0 && (
        <Section id="related" title="Explore related concepts">
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/semiconductors/learn/${r.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="font-medium text-foreground group-hover:text-brand">{r.title}</span>
                  <span aria-hidden="true" className="text-brand">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      </div>

      <LearningTopicNav
        topicKey={`semiconductors:${lesson.slug}`}
        title={lesson.title}
        domain="semiconductors"
        prev={
          prev
            ? { href: `/semiconductors/learn/${prev.slug}`, title: prev.title, eyebrow: path?.title, description: prev.summary }
            : undefined
        }
        next={
          next
            ? { href: `/semiconductors/learn/${next.slug}`, title: next.title, eyebrow: path?.title, description: next.summary }
            : undefined
        }
      />
    </article>
  );
}
