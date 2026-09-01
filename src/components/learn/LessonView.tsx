import Link from "next/link";
import type { LessonContent } from "@/lib/data/lessons";
import { getTool } from "@/lib/data/tools";
import { GLOSSARY } from "@/lib/data/glossary";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { buttonClasses } from "@/components/ui/Button";
import { FormulaBlock } from "@/components/ui/FormulaBlock";
import { VariableTable } from "@/components/ui/VariableTable";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { cn } from "@/lib/utils/cn";

const CONCEPT_TITLES = new Map(GLOSSARY.map((c) => [c.slug, c.title]));

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-h`} className="space-y-3">
      <h2 id={`${id}-h`} className="text-xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Renders one lesson through the canonical template. Presentational only. */
export function LessonView({ lesson }: { lesson: LessonContent }) {
  const tryTool = lesson.tryItToolSlug ? getTool(lesson.tryItToolSlug) : undefined;
  const relatedTools = (lesson.relatedToolSlugs ?? [])
    .map((s) => getTool(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const relatedConcepts = (lesson.relatedConceptSlugs ?? []).map((slug) => ({
    slug,
    title: CONCEPT_TITLES.get(slug) ?? slug,
  }));

  return (
    <article className="space-y-10">
      {/* Title */}
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Learn", href: "/learn" },
            { label: lesson.title },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">Level {lesson.level}</Badge>
          {lesson.estimatedMinutes && (
            <span className="text-sm text-muted-foreground">
              {lesson.estimatedMinutes} min read
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {lesson.summary}
        </p>
      </header>

      {/* What you'll learn */}
      <Card className="bg-muted/30 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          What you&rsquo;ll learn
        </h2>
        <ul className="mt-3 space-y-2">
          {lesson.whatYoullLearn.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span aria-hidden="true" className="mt-0.5 text-brand">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Concept explanation */}
      <Section id="concept" title="The concept">
        <div className="space-y-4 leading-relaxed text-foreground">
          {lesson.concept.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>

      {/* Why it matters */}
      <Section id="why" title="Why it matters">
        <div className="space-y-3 leading-relaxed text-foreground">
          {lesson.whyItMatters.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>

      {/* Equation + variables */}
      {(lesson.equation || lesson.variables) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {lesson.equation && (
            <Section id="equation" title="The equation">
              <FormulaBlock
                expression={lesson.equation.expression}
                caption={lesson.equation.caption}
              />
            </Section>
          )}
          {lesson.variables && lesson.variables.length > 0 && (
            <Section id="variables" title="Variables">
              <VariableTable rows={lesson.variables} />
            </Section>
          )}
        </div>
      )}

      {/* Worked example */}
      {lesson.workedExample && (
        <Section id="worked-example" title="Worked example">
          <Card className="space-y-3 p-5 text-sm leading-relaxed">
            {lesson.workedExample.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {lesson.workedExample.math && (
              <p className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs">
                {lesson.workedExample.math}
              </p>
            )}
            {lesson.workedExample.conclusion && (
              <p className="font-medium">{lesson.workedExample.conclusion}</p>
            )}
          </Card>
        </Section>
      )}

      {/* Try it yourself — links directly to the relevant calculator */}
      {tryTool && (
        <section
          aria-labelledby="try-h"
          className="rounded-xl border border-brand/30 bg-brand/5 p-6"
        >
          <h2 id="try-h" className="text-lg font-semibold tracking-tight">
            Try it yourself
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Put these numbers into the {tryTool.name.toLowerCase()} calculator and
            see the result for your own channel.
          </p>
          <TrackedLink
            href={`/tools/${tryTool.slug}`}
            event="lesson_to_tool"
            payload={{ lesson: lesson.slug, tool: tryTool.slug }}
            className={cn(buttonClasses(), "mt-4")}
          >
            Open the {tryTool.name} calculator →
          </TrackedLink>
        </section>
      )}

      {/* Common mistakes */}
      {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
        <Section id="mistakes" title="Common mistakes">
          <Alert variant="warning" title="Watch out for:">
            <ul className="ml-4 list-disc space-y-1">
              {lesson.commonMistakes.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </Alert>
        </Section>
      )}

      {/* Related concepts + tools */}
      {(relatedConcepts.length > 0 || relatedTools.length > 0) && (
        <Section id="related" title="Keep going">
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedConcepts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Related concepts</h3>
                <ul className="space-y-1.5">
                  {relatedConcepts.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/concepts/${c.slug}`}
                        className="rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {c.title} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {relatedTools.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Related tools</h3>
                <ul className="space-y-1.5">
                  {relatedTools.map((t) => (
                    <li key={t.slug}>
                      <TrackedLink
                        href={`/tools/${t.slug}`}
                        event="lesson_to_tool"
                        payload={{ lesson: lesson.slug, tool: t.slug }}
                        className="rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {t.name} →
                      </TrackedLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Further reading */}
      {lesson.furtherReading && lesson.furtherReading.length > 0 && (
        <Section id="reading" title="Further reading">
          <ul className="space-y-2 text-sm">
            {lesson.furtherReading.map((r, i) => (
              <li key={i}>
                <span className="font-medium text-foreground">{r.title}</span>
                {r.author && (
                  <span className="text-muted-foreground"> — {r.author}</span>
                )}
                {r.note && (
                  <span className="block text-xs italic text-muted-foreground">
                    {r.note}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
