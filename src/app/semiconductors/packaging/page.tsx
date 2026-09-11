import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import {
  PACKAGING_TERMS,
  POST_FAB_FLOW,
  PACKAGING_LADDER,
  type PackagingApproach,
} from "@/lib/knowledge/packaging-flow";
import { getSemiLesson } from "@/lib/knowledge/semi-lessons";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor packaging — from wafer to finished chip",
  description:
    "What happens to a chip after fabrication. A guided path through packaging: die preparation, interconnection, assembly, encapsulation and test — then the ladder from traditional wire-bond packages to flip-chip, wafer-level, 2.5D, chiplets, 3D and heterogeneous integration.",
  path: "/semiconductors/packaging",
});

/** Resolve reuse links (lessons + extra links) for a ladder rung. */
function approachLinks(a: PackagingApproach) {
  const lessonLinks = a.lessons
    .map((slug) => {
      const l = getSemiLesson(slug);
      return l ? { label: l.title, href: `/semiconductors/learn/${slug}` } : null;
    })
    .filter((x): x is { label: string; href: string } => x !== null);
  return [...lessonLinks, ...(a.links ?? [])];
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm leading-relaxed text-foreground">{value}</dd>
    </div>
  );
}

export default function SemiconductorPackagingPage() {
  return (
    <Container className="space-y-12 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Explore", href: "/explore" },
            { label: "Packaging" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">What happens to a chip after fabrication?</h1>
        <p className="max-w-2xl text-muted-foreground">
          A semiconductor is not finished when the wafer is fabricated. Packaging
          connects the die to the outside world — and increasingly decides
          performance, power, thermal behaviour, reliability, bandwidth, form
          factor, and how a whole system is integrated.
        </p>
      </div>

      {/* Jargon — defined before it's relied on */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">First, the vocabulary</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A few terms come up throughout packaging. Here they are in plain
          language before we use them.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGING_TERMS.map((t) => (
            <Card key={t.term} className="p-4">
              <h3 className="text-sm font-semibold text-foreground">{t.term}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.definition}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Part 1 — the after-fabrication flow */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">From wafer to finished component</h2>
        <ol className="space-y-0">
          {POST_FAB_FLOW.map((step, i) => {
            const lessonLinks = step.lessons
              .map((slug) => {
                const l = getSemiLesson(slug);
                return l ? { label: l.title, href: `/semiconductors/learn/${slug}` } : null;
              })
              .filter((x): x is { label: string; href: string } => x !== null);
            const isLast = i === POST_FAB_FLOW.length - 1;
            return (
              <li key={step.slug}>
                <Card className="p-5">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-semibold text-brand"
                    >
                      {step.order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                      {lessonLinks.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {lessonLinks.map((l) => (
                            <Link
                              key={l.href}
                              href={l.href}
                              className="rounded-full border border-border px-3 py-0.5 text-xs font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {l.label} →
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
                {!isLast && (
                  <div aria-hidden="true" className="flex justify-center py-1.5 text-brand/60">↓</div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* Part 2 — simple to advanced */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">From simple to advanced</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Packaging has climbed a ladder of complexity as chips demand more
          connections, more bandwidth, and tighter integration.
        </p>
        <ol className="space-y-0">
          {PACKAGING_LADDER.map((a, i) => {
            const links = approachLinks(a);
            const next = PACKAGING_LADDER[i + 1];
            const isLast = i === PACKAGING_LADDER.length - 1;
            return (
              <li key={a.slug}>
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-sm font-semibold text-brand"
                    >
                      {a.order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold tracking-tight">{a.title}</h3>
                      <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                        <Field label="What" value={a.what} />
                        <Field label="Why" value={a.why} />
                        <Field label="How" value={a.how} />
                        <Field label="Trade-offs" value={a.tradeoffs} />
                        <Field label="Where it's used" value={a.whereUsed} />
                        {next && <Field label="What comes next" value={next.title} />}
                      </dl>
                      {links.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Learn this
                          </span>
                          {links.map((l) => (
                            <Link
                              key={l.href + l.label}
                              href={l.href}
                              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {l.label} →
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
                {!isLast && (
                  <div aria-hidden="true" className="flex justify-center py-2 text-brand/60">↓</div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* Where packaging fits */}
      <Card className="bg-muted/30 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Where packaging fits
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground">
          Packaging is the step after design and fabrication, and it feeds the
          industry that ships real products.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/semiconductors/design" className="font-medium text-brand hover:underline">
            Design flow →
          </Link>
          <Link href="/manufacturing" className="font-medium text-brand hover:underline">
            Manufacturing →
          </Link>
          <Link href="/supply-chain" className="font-medium text-brand hover:underline">
            Supply chain →
          </Link>
          <Link href="/industry" className="font-medium text-brand hover:underline">
            Industry (OSAT & more) →
          </Link>
          <Link href="/semiconductors/learn" className="font-medium text-brand hover:underline">
            Learn paths →
          </Link>
        </div>
      </Card>
    </Container>
  );
}
