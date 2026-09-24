import Link from "next/link";
import type { SemiLesson } from "@/lib/knowledge/semi-lessons";
import { lessonNeighbors, getSemiLesson } from "@/lib/knowledge/semi-lessons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { FormulaBlock } from "@/components/ui/FormulaBlock";
import { LessonDiagram } from "./LessonDiagram";
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

/** Renders one semiconductor lesson via the full template + retention actions. */
export function SemiLessonView({ lesson }: { lesson: SemiLesson }) {
  const { prev, next, path } = lessonNeighbors(lesson.slug);
  const related = (lesson.relatedLessons ?? [])
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

      <Section id="explanation" title="Explanation">
        <div className="space-y-3 leading-relaxed text-foreground">
          {lesson.explanation.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Section>

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
