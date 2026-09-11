import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About Semitree",
  description:
    "Semitree is a free platform for understanding semiconductors — structured learning from first principles to advanced topics, interactive tools, and insights: news, explainers, articles, research and industry analysis.",
  path: "/about",
});

const OFFERINGS: { title: string; href: string; description: string }[] = [
  {
    title: "Learn",
    href: "/semiconductors/learn",
    description:
      "Structured paths from first principles — what a semiconductor is — up to devices, logic, and advanced topics.",
  },
  {
    title: "Design",
    href: "/semiconductors/design",
    description:
      "Follow how an idea becomes a chip: specification, architecture, RTL, verification, physical design, tape-out and beyond.",
  },
  {
    title: "Manufacturing & supply chain",
    href: "/manufacturing",
    description:
      "How chips are actually built — lithography, etching, deposition and more — and how the global ecosystem fits together.",
  },
  {
    title: "Tools",
    href: "/tools",
    description:
      "Interactive calculators and design utilities that turn the concepts into numbers you can use.",
  },
  {
    title: "Insights",
    href: "/insights",
    description:
      "News, explainers, articles, research and industry analysis — everything Semitree publishes, in one place.",
  },
  {
    title: "Industry",
    href: "/industry",
    description:
      "A company directory and semiconductor maps to explore who does what, and where, across the industry.",
  },
];

const AUDIENCES = [
  "Complete beginners",
  "Students",
  "Engineers from adjacent fields",
  "Semiconductor engineers",
  "Researchers",
  "Product & program managers",
  "Investors & founders",
  "Policymakers",
];

export default function AboutPage() {
  return (
    <Container className="space-y-12 py-10">
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <h1 className="text-3xl font-bold tracking-tight">About Semitree</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Semitree is a free platform for understanding semiconductors — a place
          to learn the technology from the ground up, and to stay current with
          insights, news, articles and analysis about the industry.
        </p>
      </div>

      {/* Mission */}
      <section className="max-w-2xl space-y-4 leading-relaxed text-foreground">
        <p>
          Semiconductors sit underneath almost everything modern — phones,
          cars, data centres, medical devices — yet the field can feel closed
          off behind jargon. Semitree exists to open it up: to take someone from
          &ldquo;I know nothing about this&rdquo; to genuinely understanding how
          a chip is designed, made, packaged, and used.
        </p>
        <p>
          We pair that education with an ongoing stream of{" "}
          <Link href="/insights" className="font-medium text-brand hover:underline">
            insights
          </Link>{" "}
          — news, explainers, articles, research and industry analysis — so the
          fundamentals and the fast-moving industry live in the same place.
          Semitree also covers a dedicated{" "}
          <Link href="/learn/microfluidics" className="font-medium text-brand hover:underline">
            microfluidics
          </Link>{" "}
          domain for lab-on-chip science.
        </p>
      </section>

      {/* What you'll find */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">What you&rsquo;ll find here</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERINGS.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full p-5 transition-colors hover:border-brand/40">
                <h3 className="font-semibold text-foreground group-hover:text-brand">
                  {o.title} <span aria-hidden="true">→</span>
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {o.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How we approach content */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">How we approach content</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <h3 className="font-semibold text-foreground">Layered, beginner-first</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Every topic starts with plain-language intuition and builds toward
              the technical detail — so you&rsquo;re never asked to understand
              advanced terms before you have the context.
            </p>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-foreground">Accurate & sourced</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              We favour authoritative, verifiable sources, explain the equations
              we use, and don&rsquo;t fabricate figures. Where values vary by
              process or condition, we say so.
            </p>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-foreground">One connected system</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Concepts, tools, manufacturing and industry link to each other, so
              you can move naturally from an idea to how it becomes a real chip.
            </p>
          </Card>
        </div>
      </section>

      {/* Who it's for */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Who it&rsquo;s for</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Semitree is written to serve a wide range of readers — whether
          you&rsquo;re starting from zero or already work in the field.
        </p>
        <div className="flex flex-wrap gap-2">
          {AUDIENCES.map((a) => (
            <span
              key={a}
              className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
            >
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-brand/30 bg-brand/5 p-6">
        <h2 className="text-lg font-semibold tracking-tight">Start exploring</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Jump into a learning path, browse the latest insights, or explore
          everything Semitree offers.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/semiconductors/learn" className={buttonClasses()}>
            Start learning →
          </Link>
          <Link href="/insights" className={buttonClasses("secondary")}>
            Read insights
          </Link>
          <Link href="/explore" className={buttonClasses("secondary")}>
            Explore Semitree
          </Link>
        </div>
      </section>
    </Container>
  );
}
