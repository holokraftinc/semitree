import Link from "next/link";
import type { GlossaryTerm } from "@/lib/data/glossary";
import {
  toolsForConcept,
  lessonsForConcept,
  resourcesForConcept,
  conceptsForConcept,
} from "@/lib/data/graph";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

const GROUP_LABELS: Record<GlossaryTerm["group"], string> = {
  fundamentals: "Fundamentals",
  "dimensionless-numbers": "Dimensionless numbers",
  transport: "Transport",
  droplets: "Droplets",
  fabrication: "Fabrication",
};

function LinkList({
  links,
  empty,
}: {
  links: { label: string; href: string }[];
  empty: string;
}) {
  if (links.length === 0) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <ul className="space-y-1.5">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {l.label} →
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Concept detail page: definition, explanation, and graph links to
 *  lessons, tools, resources, and neighbouring concepts. */
export function ConceptView({ concept }: { concept: GlossaryTerm }) {
  const tools = toolsForConcept(concept.slug);
  const lessons = lessonsForConcept(concept.slug);
  const resources = resourcesForConcept(concept.slug);
  const concepts = conceptsForConcept(concept.slug);

  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Concepts", href: "/concepts" },
            { label: concept.title },
          ]}
        />
        <Badge variant="neutral">{GROUP_LABELS[concept.group]}</Badge>
        <h1 className="text-3xl font-bold tracking-tight">{concept.title}</h1>
      </header>

      {/* Definition */}
      <section aria-labelledby="def-h" className="space-y-2">
        <h2 id="def-h" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Definition
        </h2>
        <p className="text-lg leading-relaxed text-foreground">{concept.summary}</p>
      </section>

      {/* Explanation */}
      {concept.explanation && concept.explanation.length > 0 && (
        <section aria-labelledby="exp-h" className="space-y-3">
          <h2 id="exp-h" className="text-xl font-semibold tracking-tight">
            Explanation
          </h2>
          <div className="space-y-3 leading-relaxed text-foreground">
            {concept.explanation.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Primary calculator CTA (first related tool), if any */}
      {tools.length > 0 && (
        <ButtonLink href={`/tools/${tools[0].slug}`}>
          Calculate with the {tools[0].name} tool →
        </ButtonLink>
      )}

      {/* Graph links */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-sm font-semibold">Related tools</h2>
          <div className="mt-2">
            <LinkList
              links={tools.map((t) => ({ label: t.name, href: `/tools/${t.slug}` }))}
              empty="No calculator for this concept yet."
            />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold">Related lessons</h2>
          <div className="mt-2">
            <LinkList
              links={lessons.map((l) => ({
                label: l.title,
                href: `/learn/${l.slug}`,
              }))}
              empty="No lesson covers this yet."
            />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold">Related concepts</h2>
          <div className="mt-2">
            <LinkList
              links={concepts.map((c) => ({
                label: c.title,
                href: `/concepts/${c.slug}`,
              }))}
              empty="No linked concepts yet."
            />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold">Further reading</h2>
          <div className="mt-2">
            {resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No references linked yet.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {resources.map((r) => (
                  <li key={r.slug}>
                    <span className="font-medium text-foreground">{r.title}</span>
                    {r.author && (
                      <span className="text-muted-foreground"> — {r.author}</span>
                    )}
                    <span className="block text-xs italic text-muted-foreground">
                      Verify the current edition.
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </article>
  );
}
