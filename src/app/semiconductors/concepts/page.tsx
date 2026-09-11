import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { CONCEPT_CLUSTERS, START_HERE, type ConceptTopic } from "@/lib/knowledge/concept-map";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor concepts — understand the ideas behind chips",
  description:
    "A guided map of semiconductor concepts, from “what is a semiconductor?” through devices, logic, memory and advanced scaling. Start at the beginning, or jump straight to an advanced topic.",
  path: "/semiconductors/concepts",
});

function Topic({ topic }: { topic: ConceptTopic }) {
  if (topic.comingSoon || !topic.lessonSlug) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground">
        {topic.label}
        <Badge variant="neutral">Soon</Badge>
      </span>
    );
  }
  return (
    <Link
      href={`/semiconductors/learn/${topic.lessonSlug}`}
      className="rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {topic.label} →
    </Link>
  );
}

export default function SemiconductorConceptsPage() {
  return (
    <Container className="space-y-10 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Explore", href: "/explore" },
            { label: "Concepts" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Concepts</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Understand the ideas that make modern semiconductors work — from the
          physics of a single crystal up to how billions of transistors become a
          processor.
        </p>
      </div>

      {/* Start here */}
      <Card className="border-brand/30 bg-brand/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">Start here</h2>
            <p className="mt-1 text-lg font-semibold tracking-tight">{START_HERE.label}</p>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              New to this? Begin with the one idea everything else builds on, then
              follow the path through devices, logic and beyond.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/semiconductors/learn/${START_HERE.lessonSlug}`} className={buttonClasses()}>
              Start learning →
            </Link>
            <Link href="/semiconductors/learn" className={buttonClasses("secondary")}>
              Full learning path
            </Link>
          </div>
        </div>
      </Card>

      <p className="max-w-2xl text-sm text-muted-foreground">
        Prefer to jump in? Pick any cluster below — beginners can read top to
        bottom, and experienced readers can go straight to the advanced topics.
        Items marked <Badge variant="neutral">Soon</Badge> aren&rsquo;t written yet.
      </p>

      {/* Clusters */}
      <div className="space-y-6">
        {CONCEPT_CLUSTERS.map((cluster) => (
          <Card key={cluster.id} className="p-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold tracking-tight">{cluster.title}</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-foreground">{cluster.understand}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">For:</span> {cluster.audience}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {cluster.topics.map((t) => (
                <Topic key={t.label} topic={t} />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Where to go next */}
      <Card className="bg-muted/30 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Where these ideas lead
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground">
          Concepts are the foundation. See how they become a real chip, get made,
          and get packaged.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/semiconductors/design" className="font-medium text-brand hover:underline">
            Design flow →
          </Link>
          <Link href="/manufacturing" className="font-medium text-brand hover:underline">
            Manufacturing →
          </Link>
          <Link href="/semiconductors/packaging" className="font-medium text-brand hover:underline">
            Packaging →
          </Link>
          <Link href="/semiconductors/tools" className="font-medium text-brand hover:underline">
            Tools →
          </Link>
        </div>
      </Card>
    </Container>
  );
}
