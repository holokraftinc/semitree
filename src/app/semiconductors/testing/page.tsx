import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  TESTING_JOURNEY,
  TESTING_PATHWAYS,
  TESTING_GROUPS,
  TESTING_RELATED,
} from "@/lib/knowledge/testing-map";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor Testing",
  description:
    "Discover how semiconductor chips are measured, validated, and screened to help ensure they perform as designed — wafer sort, final test, ATE, reliability, and the test ecosystem.",
  path: "/semiconductors/testing",
});

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function TestingPage() {
  return (
    <Container className="space-y-14 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Explore", path: "/explore" },
            { name: "Testing", path: "/semiconductors/testing" },
          ]),
        ])}
      />

      {/* Hero */}
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Explore", href: "/explore" },
            { label: "Testing" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Semiconductor Testing</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Discover how semiconductor chips are measured, validated, and screened to
          help ensure they perform as designed.
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Testing is used at <strong>multiple stages</strong> — not just at the end of
          manufacturing — to evaluate electrical behaviour, detect defects, characterise
          performance, and judge whether devices meet their specifications. A chip is
          probed on the wafer, screened again after packaging, and (for some products)
          stress-tested and validated in a system before it ships.
        </p>
      </div>

      {/* Visual journey */}
      <section aria-labelledby="journey-h" className="space-y-4">
        <h2 id="journey-h" className="text-xl font-semibold tracking-tight">The testing journey</h2>
        <ol className="flex flex-wrap items-stretch gap-2">
          {TESTING_JOURNEY.map((s, i) => {
            const inner = (
              <span className="flex h-full flex-col rounded-lg border border-border bg-card px-3 py-2 transition-colors group-hover:border-brand/50">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[11px] font-semibold text-muted-foreground">{i + 1}</span>
                  <span className="text-sm font-semibold">{s.label}</span>
                </span>
                <span className="mt-1 max-w-[16rem] text-xs text-muted-foreground">{s.blurb}</span>
              </span>
            );
            return (
              <li key={s.label} className="flex items-center gap-2">
                {s.href ? (
                  <Link href={s.href} className="group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{inner}</Link>
                ) : (
                  <span className="group">{inner}</span>
                )}
                {i < TESTING_JOURNEY.length - 1 && <span aria-hidden="true" className="text-brand/40">→</span>}
              </li>
            );
          })}
        </ol>
        <p className="max-w-3xl text-xs text-muted-foreground">
          This is a <strong>simplified, conceptual</strong> journey — not a universal
          sequence. Real test flows vary by device type, manufacturer, product
          requirements, and business model. Some reliability tests run during
          qualification on samples rather than on every unit, and system-level testing
          is used where appropriate.
        </p>
      </section>

      {/* Learning pathways */}
      <section aria-labelledby="pathways-h" className="space-y-5">
        <h2 id="pathways-h" className="text-xl font-semibold tracking-tight">Where to start</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">Discovery pathways, not fixed courses — jump in wherever fits.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {TESTING_PATHWAYS.map((p) => (
            <Card key={p.level} className="flex h-full flex-col p-5">
              <h3 className="font-semibold tracking-tight">{p.level}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {p.items.map((it) => (
                  <li key={it.label} className="flex gap-2">
                    <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
                    {it.href ? (
                      <Link href={it.href} className={linkClass}>{it.label} →</Link>
                    ) : (
                      <span className="text-muted-foreground">{it.label} <span className="text-xs">(coming soon)</span></span>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Topic groups */}
      <section aria-labelledby="topics-h" className="space-y-6">
        <h2 id="topics-h" className="text-xl font-semibold tracking-tight">Explore testing by topic</h2>
        <div className="space-y-8">
          {TESTING_GROUPS.map((g) => (
            <div key={g.title} className="space-y-3">
              <div>
                <h3 className="text-base font-semibold tracking-tight">{g.title}</h3>
                <p className="text-sm text-muted-foreground">{g.blurb}</p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.topics.map((t) => {
                  const body = (
                    <Card className={`flex h-full flex-col p-4 transition-colors${t.href ? " group-hover:border-brand/50" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-semibold tracking-tight${t.href ? " group-hover:text-brand" : ""}`}>{t.name}</h4>
                        {t.href ? (
                          <span aria-hidden="true" className="text-brand">→</span>
                        ) : (
                          <Badge variant="neutral">Coming soon</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{t.blurb}</p>
                      {t.difficulty && (
                        <span className="mt-2 inline-flex w-fit rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{t.difficulty}</span>
                      )}
                    </Card>
                  );
                  return (
                    <li key={t.name}>
                      {t.href ? (
                        <Link href={t.href} className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{body}</Link>
                      ) : (
                        <div className="h-full opacity-90">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Related discovery */}
      <section aria-labelledby="related-h" className="space-y-4 border-t border-border pt-8">
        <h2 id="related-h" className="text-xl font-semibold tracking-tight">Connected across Semitree</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TESTING_RELATED.map((r) => (
            <li key={r.href + r.label}>
              <Link href={r.href} className="group block h-full rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="block text-sm font-semibold tracking-tight group-hover:text-brand">{r.label} →</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{r.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
