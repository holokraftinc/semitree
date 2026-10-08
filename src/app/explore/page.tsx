import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { getIaSection } from "@/lib/data/ia";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Explore",
  description:
    "Understand the technology behind the semiconductor ecosystem — from fundamentals to manufacturing, packaging, equipment, materials and supply chains. Free, forever.",
  path: "/explore",
});

const explore = getIaSection("explore")!;

// A light Beginner → Intermediate → Advanced path, using existing content only.
const JOURNEY = [
  {
    level: "Beginner",
    title: "Semiconductor fundamentals",
    desc: "What a semiconductor is, carriers, junctions, and the transistor.",
    href: "/semiconductors/learn/what-is-a-semiconductor",
  },
  {
    level: "Intermediate",
    title: "How chips are made",
    desc: "The end-to-end manufacturing journey, step by step.",
    href: "/semiconductors/learn/journey",
  },
  {
    level: "Advanced",
    title: "Design, devices & packaging",
    desc: "Device physics, the design flow, and advanced packaging.",
    href: "/semiconductors/design",
  },
];

export default function ExplorePage() {
  return (
    <>
      <section className="border-b border-border">
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Explore" }]} />
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            Understand the technology behind the semiconductor ecosystem.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            From semiconductor fundamentals to manufacturing, packaging, equipment, materials and supply chains.
            Everything here is free.
          </p>
        </Container>
      </section>

      <Container className="space-y-16 py-16">
        {/* Learning journey */}
        <section aria-labelledby="journey-h" className="space-y-5">
          <h2 id="journey-h" className="text-xl font-semibold tracking-tight">A path from first principles</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {JOURNEY.map((step, i) => (
              <li key={step.level} className="relative">
                <Link href={step.href} className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Card className="flex h-full flex-col p-5 transition-colors group-hover:border-brand/50">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-semibold text-brand">{i + 1}</span>
                      <Badge variant="brand">{step.level}</Badge>
                    </div>
                    <h3 className="mt-3 text-base font-semibold tracking-tight group-hover:text-brand">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                  </Card>
                </Link>
              </li>
            ))}
          </ol>
          <p className="text-sm text-muted-foreground">
            Not every topic fits a level — browse any area directly below.
          </p>
        </section>

        {/* Content areas */}
        <section aria-labelledby="areas-h" className="space-y-5">
          <h2 id="areas-h" className="text-xl font-semibold tracking-tight">Explore by area</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {explore.items.map((item) => {
              const available = item.status === "available" && item.href;
              const card = (hover: boolean) => (
                <Card className={`flex h-full flex-col p-5 transition-colors${hover ? " group-hover:border-brand/50" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-base font-semibold tracking-tight${hover ? " group-hover:text-brand" : ""}`}>{item.label}</h3>
                    {available ? <span aria-hidden="true" className="text-brand">→</span> : <Badge variant="neutral">Coming soon</Badge>}
                  </div>
                  {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
                </Card>
              );
              return (
                <li key={item.label}>
                  {available ? (
                    <Link href={item.href!} className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {card(true)}
                    </Link>
                  ) : (
                    <div className="h-full opacity-80">{card(false)}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* Tools CTA */}
        <section aria-labelledby="tools-h" className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
          <h2 id="tools-h" className="text-xl font-semibold tracking-tight">Learn it, then compute with it</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Over 50 interactive calculators and explorers turn the concepts into numbers — resolution, yield, thermal,
            device physics, and more.
          </p>
          <div className="mt-4">
            <ButtonLink href="/semiconductors/tools" variant="primary">Open the tools →</ButtonLink>
          </div>
        </section>

        {/* Other domains / specialized research */}
        <section aria-labelledby="domains-h" className="space-y-4 border-t border-border pt-10">
          <h2 id="domains-h" className="text-xl font-semibold tracking-tight">Other domains &amp; specialized research</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Semitree also covers adjacent fields. These are specialized tracks alongside the semiconductor focus.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            <li>
              <Link href="/learn/microfluidics" className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Card className="h-full p-5 transition-colors group-hover:border-brand/50">
                  <h3 className="text-base font-semibold tracking-tight group-hover:text-brand">Microfluidics</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Fundamentals, lab-on-chip systems, devices, and the microfluidics toolset.</p>
                </Card>
              </Link>
            </li>
          </ul>
        </section>
      </Container>
    </>
  );
}
