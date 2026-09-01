import Link from "next/link";
import type { ReactNode } from "react";
import type { Tier } from "@/lib/calculations/types";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { FormulaBlock } from "@/components/ui/FormulaBlock";
import { VariableTable, type VariableRow } from "@/components/ui/VariableTable";
import { TierBadge } from "@/components/ui/Badge";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { cn } from "@/lib/utils/cn";

export type RelatedLink = { label: string; href: string; note?: string };

const linkClass =
  "group inline-flex items-baseline gap-1.5 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type FormulaProp =
  | { expression: string; label?: string; caption?: string }
  | ReactNode;

export type CalculatorShellProps = {
  title: string;
  description: string;
  tier?: Tier;
  categoryLabel?: string;
  breadcrumbs?: Crumb[];

  /** Interactive slots (supplied by the calculator page in a later phase). */
  inputs: ReactNode;
  /** Action row under the inputs (e.g. the Calculate button). */
  actions?: ReactNode;
  /** The result display (e.g. <ResultCard />). */
  result?: ReactNode;

  /** Explanatory content. */
  interpretation?: ReactNode;
  formula?: FormulaProp;
  variables?: VariableRow[];
  assumptions?: string[];
  workedExample?: ReactNode;

  relatedConcepts?: RelatedLink[];
  relatedLessons?: RelatedLink[];
  relatedTools?: RelatedLink[];
  /** Tool slug, used to attribute `tool_to_lesson` clicks on related lessons. */
  trackSlug?: string;
};

function SubSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="space-y-3">
      <h2 id={`${id}-heading`} className="text-lg font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function isFormulaObject(
  f: FormulaProp,
): f is { expression: string; label?: string; caption?: string } {
  return (
    typeof f === "object" && f !== null && "expression" in (f as object)
  );
}

/** Derive a lesson slug from a /learn href ("/learn/x" → "x", "/learn" → "index"). */
function lessonSlugFromHref(href: string): string {
  const rest = href.replace(/^\/learn\/?/, "");
  return rest === "" ? "index" : rest.split(/[?#]/)[0];
}

function RelatedList({
  links,
  trackToolSlug,
}: {
  links: RelatedLink[];
  /** When set, links fire `tool_to_lesson` from this tool. */
  trackToolSlug?: string;
}) {
  return (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href + link.label}>
          {trackToolSlug ? (
            <TrackedLink
              href={link.href}
              event="tool_to_lesson"
              payload={{
                tool: trackToolSlug,
                lesson: lessonSlugFromHref(link.href),
              }}
              className={linkClass}
            >
              {link.label} →
            </TrackedLink>
          ) : (
            <Link href={link.href} className={linkClass}>
              {link.label}
              <span aria-hidden="true">→</span>
            </Link>
          )}
          {link.note && (
            <p className="text-xs text-muted-foreground">{link.note}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Reusable calculator page shell. It lays out every section a Semitree
 * calculator needs, in the canonical order, and is purely presentational —
 * it holds no physics. A calculator page fills the interactive slots
 * (`inputs`, `actions`, `result`) and the explanatory props.
 */
export function CalculatorShell(props: CalculatorShellProps) {
  const {
    title,
    description,
    tier,
    categoryLabel,
    breadcrumbs,
    inputs,
    actions,
    result,
    interpretation,
    formula,
    variables,
    assumptions,
    workedExample,
    relatedConcepts,
    relatedLessons,
    relatedTools,
    trackSlug,
  } = props;

  const hasRelated =
    (relatedConcepts?.length ?? 0) +
      (relatedLessons?.length ?? 0) +
      (relatedTools?.length ?? 0) >
    0;

  return (
    <article className="space-y-10">
      {/* Header */}
      <header className="space-y-3">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className="flex flex-wrap items-center gap-2">
          {categoryLabel && (
            <span className="text-sm font-medium text-muted-foreground">
              {categoryLabel}
            </span>
          )}
          {tier && <TierBadge tier={tier} />}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </header>

      {/* Interactive panel: inputs + calculate + result */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <SubSection id="inputs" title="Inputs">
            <div className="space-y-4">{inputs}</div>
            {actions && <div className="pt-2">{actions}</div>}
          </SubSection>
        </Card>
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-20">
            {result ?? (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5 text-sm text-muted-foreground">
                Results appear here after you calculate.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interpretation */}
      {interpretation && (
        <SubSection id="interpretation" title="Interpretation">
          <div className="prose-sm max-w-none text-sm leading-relaxed text-foreground">
            {interpretation}
          </div>
        </SubSection>
      )}

      {/* Formula + Variables */}
      {(formula || variables) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {formula && (
            <SubSection id="formula" title="Formula">
              {isFormulaObject(formula) ? (
                <FormulaBlock
                  expression={formula.expression}
                  label={formula.label}
                  caption={formula.caption}
                />
              ) : (
                formula
              )}
            </SubSection>
          )}
          {variables && variables.length > 0 && (
            <SubSection id="variables" title="Variables">
              <VariableTable rows={variables} />
            </SubSection>
          )}
        </div>
      )}

      {/* Assumptions */}
      {assumptions && assumptions.length > 0 && (
        <SubSection id="assumptions" title="Assumptions & validity">
          <Alert variant="warning" title="This tool assumes:">
            <ul className="ml-4 list-disc space-y-1">
              {assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </Alert>
        </SubSection>
      )}

      {/* Worked example */}
      {workedExample && (
        <SubSection id="worked-example" title="Worked example">
          <Card className="p-5 text-sm leading-relaxed">{workedExample}</Card>
        </SubSection>
      )}

      {/* Related */}
      {hasRelated && (
        <SubSection id="related" title="Keep going">
          <div
            className={cn(
              "grid gap-6",
              "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {relatedConcepts && relatedConcepts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Related concepts
                </h3>
                <RelatedList links={relatedConcepts} />
              </div>
            )}
            {relatedLessons && relatedLessons.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Related lessons
                </h3>
                <RelatedList links={relatedLessons} trackToolSlug={trackSlug} />
              </div>
            )}
            {relatedTools && relatedTools.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Related tools
                </h3>
                <RelatedList links={relatedTools} />
              </div>
            )}
          </div>
        </SubSection>
      )}
    </article>
  );
}
