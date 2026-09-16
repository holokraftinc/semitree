import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import {
  EQUIPMENT_JOURNEY,
  PACKAGING_JOURNEY,
  EQUIPMENT_CATEGORIES,
  type EquipmentCategory,
} from "@/lib/knowledge/equipment-map";
import { getSemiLesson } from "@/lib/knowledge/semi-lessons";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor equipment — the machines that make chips",
  description:
    "Explore the machines that turn wafers into semiconductor devices: lithography, deposition, etching, doping, thermal processing, CMP, metrology, packaging and test — what each does, where it fits, and why it matters.",
  path: "/semiconductors/equipment",
});

function categoryLessonLinks(cat: EquipmentCategory) {
  return cat.lessons
    .map((slug) => {
      const l = getSemiLesson(slug);
      return l ? { label: l.title, href: `/semiconductors/learn/${slug}` } : null;
    })
    .filter((x): x is { label: string; href: string } => x !== null);
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm leading-relaxed text-foreground">{value}</dd>
    </div>
  );
}

export default function SemiconductorEquipmentPage() {
  return (
    <Container className="space-y-10 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Explore", path: "/explore" },
            { name: "Equipment", path: "/semiconductors/equipment" },
          ]),
        ])}
      />
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Explore", href: "/explore" },
            { label: "Equipment" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Semiconductor equipment</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Explore the machines that turn wafers into semiconductor devices — what
          each does, where it sits in the process, and why it matters.
        </p>
      </div>

      {/* Two entry points */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-brand/30 bg-brand/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">Start here</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            New to fabs? Follow the wafer&rsquo;s journey step by step, then walk the
            full process in the interactive explorer.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href="#journey" className={buttonClasses()}>The wafer&rsquo;s journey →</a>
            <Link href="/manufacturing" className={buttonClasses("secondary")}>
              Process explorer
            </Link>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Explore by process
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Already know the flow? Jump straight to the equipment by process
            step.
          </p>
          <div className="mt-3">
            <a href="#categories" className={buttonClasses("secondary")}>
              Browse equipment →
            </a>
          </div>
        </Card>
      </div>

      {/* The manufacturing journey */}
      <section id="journey" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">The wafer&rsquo;s journey</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A wafer passes through many machines on its way to becoming a chip. This
          is the typical shape of the flow — layers repeat many times, and not
          every process uses exactly this sequence.
        </p>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {EQUIPMENT_JOURNEY.map((stage, i) => (
            <span key={`${stage.label}-${i}`} className="flex items-center">
              {stage.categoryId ? (
                <a
                  href={`#${stage.categoryId}`}
                  className="rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {stage.label}
                </a>
              ) : (
                <span className="rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground">
                  {stage.label}
                </span>
              )}
              {i < EQUIPMENT_JOURNEY.length - 1 && (
                <span aria-hidden="true" className="px-1 text-brand/50">→</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* The back-end: a second equipment ecosystem */}
      <section id="backend" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          A second ecosystem: assembly, packaging &amp; test
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Semiconductor equipment is not only about the wafer fab. Once dies are
          finished, a whole second ecosystem of tools attaches, connects,
          encapsulates, singulates, inspects and tests them. Exact sequences
          differ by package technology.
        </p>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {PACKAGING_JOURNEY.map((stage, i) => (
            <span key={`${stage.label}-${i}`} className="flex items-center">
              {stage.topicSlug ? (
                <Link
                  href={`/semiconductors/equipment/${stage.topicSlug}`}
                  className="rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {stage.label}
                </Link>
              ) : (
                <span className="rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground">
                  {stage.label}
                </span>
              )}
              {i < PACKAGING_JOURNEY.length - 1 && (
                <span aria-hidden="true" className="px-1 text-brand/50">→</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* Explore by process */}
      <section id="categories" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Equipment by process</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each machine, in plain terms. Follow a link to learn the process it
          performs; items marked <Badge variant="neutral">Soon</Badge> aren&rsquo;t
          written yet.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {EQUIPMENT_CATEGORIES.map((cat) => {
            const links = categoryLessonLinks(cat);
            return (
              <Card key={cat.id} id={cat.id} className="scroll-mt-20 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">{cat.title}</h3>
                  {cat.comingSoon && <Badge variant="neutral">Soon</Badge>}
                </div>
                <dl className="mt-3 space-y-3">
                  <Field label="What it does" value={cat.what} />
                  <Field label="Where it fits" value={cat.where} />
                  <Field label="Why it matters" value={cat.why} />
                </dl>
                {cat.topics && cat.topics.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                    {cat.topics.map((tp) => (
                      <Link
                        key={tp.slug}
                        href={`/semiconductors/equipment/${tp.slug}`}
                        className="inline-block text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {tp.label ? `${tp.label} details` : "Equipment details"} →
                      </Link>
                    ))}
                  </div>
                )}
                {links.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Learn the process
                    </span>
                    {links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {l.label} →
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Where it connects */}
      <Card className="bg-muted/30 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Where equipment connects
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground">
          Equipment runs the processes, works on the materials, and is built and
          supplied by the industry — part of a global ecosystem.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/semiconductors/ecosystem" className="font-medium text-brand hover:underline">
            Ecosystem →
          </Link>
          <Link href="/semiconductors/materials" className="font-medium text-brand hover:underline">
            Materials →
          </Link>
          <Link href="/manufacturing" className="font-medium text-brand hover:underline">
            Manufacturing processes →
          </Link>
          <Link href="/semiconductors/packaging" className="font-medium text-brand hover:underline">
            Packaging →
          </Link>
          <Link href="/supply-chain" className="font-medium text-brand hover:underline">
            Supply chain →
          </Link>
          <Link href="/industry" className="font-medium text-brand hover:underline">
            Industry →
          </Link>
        </div>
      </Card>
    </Container>
  );
}
