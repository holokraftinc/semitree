import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  DESIGN_FLOW,
  DESIGN_PHASE_LABELS,
  type DesignStage,
} from "@/lib/knowledge/design-flow";
import { getSemiLesson } from "@/lib/knowledge/semi-lessons";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "How an idea becomes a chip — semiconductor design flow",
  description:
    "A guided walk through the semiconductor design flow: specification, architecture, logic, RTL, verification, synthesis, physical design, signoff, tape-out, manufacturing, packaging and test — each stage linked to the concepts behind it.",
  path: "/semiconductors/design",
});

function StageLinks({ stage }: { stage: DesignStage }) {
  const lessonLinks = stage.lessons
    .map((slug) => {
      const lesson = getSemiLesson(slug);
      return lesson ? { label: lesson.title, href: `/semiconductors/learn/${slug}` } : null;
    })
    .filter((x): x is { label: string; href: string } => x !== null);
  const links = [...lessonLinks, ...(stage.links ?? [])];
  if (links.length === 0) return null;
  return (
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
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm leading-relaxed text-foreground">{value}</dd>
    </div>
  );
}

export default function SemiconductorDesignPage() {
  return (
    <Container className="space-y-10 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Explore", href: "/explore" },
            { label: "Semiconductor design" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">
          How an idea becomes a chip
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          What happens when someone decides to build a chip? Follow the journey
          from a product idea all the way to a tested device — twelve connected
          stages, each linked to the concepts and processes behind it. Flows vary
          by chip type (digital, analog, memory, RF) and by company, so treat
          this as the shape of the journey rather than a rigid recipe.
        </p>
      </div>

      {/* The flow */}
      <ol className="space-y-0">
        {DESIGN_FLOW.map((stage, i) => {
          const prevPhase = i > 0 ? DESIGN_FLOW[i - 1].phase : undefined;
          const showPhase = stage.phase !== prevPhase;
          const isLast = i === DESIGN_FLOW.length - 1;
          return (
            <li key={stage.slug}>
              {showPhase && (
                <h2 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-brand first:mt-0">
                  {DESIGN_PHASE_LABELS[stage.phase]}
                </h2>
              )}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-sm font-semibold text-brand"
                  >
                    {stage.order}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold tracking-tight">
                        {stage.title}
                      </h3>
                      <Badge variant="neutral">{DESIGN_PHASE_LABELS[stage.phase]}</Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium text-brand">
                      {stage.question}
                    </p>

                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                      <Field label="What happens" value={stage.what} />
                      <Field label="Why it's needed" value={stage.why} />
                      <Field label="Who does it" value={stage.who} />
                      <Field label="What can go wrong" value={stage.risks} />
                      <Field label="Goes in" value={stage.inputs} />
                      <Field label="Comes out" value={stage.outputs} />
                    </dl>

                    <StageLinks stage={stage} />
                  </div>
                </div>
              </Card>

              {!isLast && (
                <div aria-hidden="true" className="flex justify-center py-2 text-brand/60">
                  ↓
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* One connected system */}
      <Card className="bg-muted/30 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          One connected system
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground">
          These stages are not isolated. A{" "}
          <Link href="/semiconductors/learn/mosfet" className="font-medium text-brand hover:underline">
            MOSFET
          </Link>{" "}
          becomes a{" "}
          <Link href="/semiconductors/learn/cmos" className="font-medium text-brand hover:underline">
            CMOS
          </Link>{" "}
          gate, gates become{" "}
          <Link href="/semiconductors/learn/logic" className="font-medium text-brand hover:underline">
            logic
          </Link>
          , logic is captured as{" "}
          <Link href="/semiconductors/learn/rtl" className="font-medium text-brand hover:underline">
            RTL
          </Link>
          , RTL is placed and routed in{" "}
          <Link href="/semiconductors/learn/physical-design" className="font-medium text-brand hover:underline">
            physical design
          </Link>
          , and the result is{" "}
          <Link href="/manufacturing" className="font-medium text-brand hover:underline">
            manufactured
          </Link>{" "}
          on a wafer.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/semiconductors/learn" className="font-medium text-brand hover:underline">
            Learn paths →
          </Link>
          <Link href="/semiconductors/tools" className="font-medium text-brand hover:underline">
            Engineering tools →
          </Link>
          <Link href="/supply-chain" className="font-medium text-brand hover:underline">
            Supply chain →
          </Link>
        </div>
      </Card>
    </Container>
  );
}
