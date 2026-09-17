import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import {
  MATERIALS_JOURNEY,
  PACKAGING_MATERIALS_JOURNEY,
  MATERIAL_CATEGORIES,
  type MaterialCategory,
} from "@/lib/knowledge/materials-map";
import { getSemiLesson } from "@/lib/knowledge/semi-lessons";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor materials — what chips are built from",
  description:
    "The materials that build a semiconductor: wafers and substrates, photoresists, dielectrics, conductors, deposition and dopant materials, etch and CMP chemistry, and packaging materials — why each is used, where, and what it enables.",
  path: "/semiconductors/materials",
});

function categoryLessonLinks(cat: MaterialCategory) {
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

export default function SemiconductorMaterialsPage() {
  return (
    <Container className="space-y-10 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Explore", path: "/explore" },
            { name: "Materials", path: "/semiconductors/materials" },
          ]),
        ])}
      />
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Explore", href: "/explore" },
            { label: "Materials" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Semiconductor materials</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A modern semiconductor is built from many carefully engineered
          materials. Explore what each one is, where it is used, and why it
          matters — always in the context of making a chip.
        </p>
      </div>

      {/* Three entry points */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-brand/30 bg-brand/5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">Start here</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            New to materials? Follow the simplified journey a chip&rsquo;s
            materials take, from wafer to package.
          </p>
          <div className="mt-3">
            <a href="#journey" className={buttonClasses()}>The materials journey →</a>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Explore by process
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Prefer the process view? See the manufacturing steps and the
            equipment that works these materials.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/manufacturing" className={buttonClasses("secondary")}>
              Process explorer
            </Link>
            <Link href="/semiconductors/equipment" className={buttonClasses("secondary")}>
              Equipment
            </Link>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Explore by material type
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Already know your way around? Jump straight to a material family.
          </p>
          <div className="mt-3">
            <a href="#categories" className={buttonClasses("secondary")}>
              Browse materials →
            </a>
          </div>
        </Card>
      </div>

      {/* The materials journey */}
      <section id="journey" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">The materials journey</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A chip is built up from many material families, roughly in this order.
          Layers repeat many times, and not every process uses exactly this
          sequence — but it is a useful way to see how the materials fit together.
        </p>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {MATERIALS_JOURNEY.map((stage, i) => (
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
              {i < MATERIALS_JOURNEY.length - 1 && (
                <span aria-hidden="true" className="px-1 text-brand/50">→</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* After fabrication: the packaging-materials journey */}
      <section id="packaging-journey" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          After fabrication: the packaging materials
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Once the wafer is finished, a second set of materials turns each die
          into a connected, protected package — attaching it, wiring it, moving
          its heat, encapsulating it, and routing it out. Exact sequences differ
          by package technology.
        </p>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {PACKAGING_MATERIALS_JOURNEY.map((stage, i) => (
            <span key={`${stage.label}-${i}`} className="flex items-center">
              {stage.topicSlug ? (
                <Link
                  href={`/semiconductors/materials/${stage.topicSlug}`}
                  className="rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {stage.label}
                </Link>
              ) : (
                <span className="rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground">
                  {stage.label}
                </span>
              )}
              {i < PACKAGING_MATERIALS_JOURNEY.length - 1 && (
                <span aria-hidden="true" className="px-1 text-brand/50">→</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* Explore by material type */}
      <section id="categories" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Materials by type</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each material family, in plain terms. Follow a link to learn the
          process that uses it or the equipment that works it; families marked{" "}
          <Badge variant="neutral">Soon</Badge> aren&rsquo;t written yet.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {MATERIAL_CATEGORIES.map((cat) => {
            const links = categoryLessonLinks(cat);
            return (
              <Card key={cat.id} id={cat.id} className="scroll-mt-20 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">{cat.title}</h3>
                  {cat.comingSoon && <Badge variant="neutral">Soon</Badge>}
                </div>
                <dl className="mt-3 space-y-3">
                  <Field label="What it is" value={cat.what} />
                  <Field label="Where it fits" value={cat.where} />
                  <Field label="Why it matters" value={cat.why} />
                </dl>
                {cat.topics && cat.topics.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                    {cat.topics.map((tp) => (
                      <Link
                        key={tp.slug}
                        href={`/semiconductors/materials/${tp.slug}`}
                        className="inline-block text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {tp.label ? `${tp.label} details` : "Material details"} →
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
                {cat.equipment && cat.equipment.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Worked by
                    </span>
                    {cat.equipment.map((e) => (
                      <Link
                        key={e.slug}
                        href={`/semiconductors/equipment/${e.slug}`}
                        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {e.label} →
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Where materials connect */}
      <Card className="bg-muted/30 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Where materials connect
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground">
          Equipment alone does not manufacture a device. Every result comes from
          <span className="font-medium text-foreground"> equipment + materials + process conditions + process control + metrology</span>{" "}
          working together — materials are worked by the equipment, shaped by the
          processes, and sourced through the industry&rsquo;s supply chain.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/semiconductors/ecosystem" className="font-medium text-brand hover:underline">
            Ecosystem →
          </Link>
          <Link href="/semiconductors/equipment" className="font-medium text-brand hover:underline">
            Equipment →
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
          <Link href="/events/semicon-india-2026" className="font-medium text-brand hover:underline">
            SEMICON India 2026 →
          </Link>
        </div>
      </Card>
    </Container>
  );
}
