import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SemiconductorJourney } from "@/components/semiconductors/SemiconductorJourney";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "The semiconductor manufacturing journey",
  description:
    "How a silicon wafer becomes a working packaged chip: a connected learning journey through photolithography, etching, deposition, doping, and packaging.",
  path: "/semiconductors/learn/journey",
});

const BEGINNER_PATH = [
  { n: 1, title: "Photolithography", href: "/semiconductors/learn/lithography", desc: "How a chip's patterns are printed onto the wafer." },
  { n: 2, title: "Etching & Deposition", href: "/semiconductors/learn/etching", desc: "How material is added and selectively removed." },
  { n: 3, title: "Doping", href: "/semiconductors/learn/ion-implantation", desc: "How a semiconductor's electrical behaviour is controlled." },
  { n: 4, title: "Chip Packaging", href: "/semiconductors/learn/packaging", desc: "How finished dies become usable components." },
];

const ENGINEERING_PATH = [
  { title: "Concepts", href: "/semiconductors/concepts" },
  { title: "Photolithography", href: "/semiconductors/learn/lithography" },
  { title: "Etching / Deposition", href: "/semiconductors/learn/etching" },
  { title: "Doping", href: "/semiconductors/learn/ion-implantation" },
  { title: "Device architecture", href: "/semiconductors/design" },
  { title: "Interconnect", href: "/semiconductors/learn/metallization" },
  { title: "Packaging", href: "/semiconductors/learn/packaging" },
  { title: "Testing", href: "/semiconductors/learn/final-test" },
  { title: "Yield", href: "/semiconductors/tools/wafer-yield" },
];

const CONNECTIONS = [
  { label: "Equipment", href: "/semiconductors/equipment" },
  { label: "Materials", href: "/semiconductors/materials" },
  { label: "Design", href: "/semiconductors/design" },
  { label: "Metrology", href: "/semiconductors/learn/metrology" },
  { label: "Ecosystem", href: "/semiconductors/ecosystem" },
  { label: "Supply chain", href: "/supply-chain" },
];

const SELF_CHECK = [
  { q: "Why is photolithography required?", hint: "Revisit Photolithography.", href: "/semiconductors/learn/lithography" },
  { q: "What is the difference between deposition and etching?", hint: "Revisit Etching & Deposition.", href: "/semiconductors/learn/etching" },
  { q: "Why is doping required?", hint: "Revisit Doping.", href: "/semiconductors/learn/ion-implantation" },
  { q: "What is the difference between a die and a package?", hint: "Revisit Chip Packaging.", href: "/semiconductors/learn/packaging" },
  { q: "Why does advanced packaging use chiplets?", hint: "Revisit Chip Packaging (advanced packaging).", href: "/semiconductors/learn/packaging" },
  { q: "Why are lithography, etching and deposition repeated many times?", hint: "Revisit Photolithography and the journey map above.", href: "/semiconductors/learn/lithography" },
  { q: "How does manufacturing affect yield?", hint: "Revisit Etching & Deposition and the yield tool.", href: "/semiconductors/tools/wafer-yield" },
  { q: "Why does packaging affect system performance?", hint: "Revisit Chip Packaging.", href: "/semiconductors/learn/packaging" },
];

export default function SemiconductorJourneyPage() {
  return (
    <Container className="space-y-12 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Learn", href: "/learn" },
            { label: "Semiconductors", href: "/semiconductors/learn" },
            { label: "Manufacturing journey" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">How does a silicon wafer become a working packaged chip?</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          One connected journey from design to a finished system — tying together photolithography, etching,
          deposition, doping, and packaging. Follow it end to end, or jump into any step.
        </p>
      </div>

      {/* The journey map */}
      <section aria-labelledby="journey-h" className="space-y-4">
        <h2 id="journey-h" className="text-xl font-semibold tracking-tight">The journey, step by step</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Design becomes a pattern, the pattern shapes material, material becomes an electrical device, dies are
          cut and packaged, and the result becomes part of a system.
        </p>
        <SemiconductorJourney />
      </section>

      {/* Beginner path */}
      <section aria-labelledby="beginner-h" className="space-y-4">
        <div className="space-y-1">
          <h2 id="beginner-h" className="text-xl font-semibold tracking-tight">New to semiconductors? Start here</h2>
          <p className="text-sm text-muted-foreground">
            Four topics, in order, take you from patterning to a packaged part. If you&rsquo;re brand new, skim the{" "}
            <Link href="/semiconductors/learn/what-is-a-semiconductor" className="font-medium text-brand hover:underline">
              fundamentals
            </Link>{" "}
            first, then follow this path.
          </p>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {BEGINNER_PATH.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-sm font-semibold text-brand">
                  {s.n}
                </span>
                <span>
                  <span className="block font-semibold text-foreground group-hover:text-brand">{s.title}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{s.desc}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Engineering path */}
      <section aria-labelledby="eng-h" className="space-y-4">
        <div className="space-y-1">
          <h2 id="eng-h" className="text-xl font-semibold tracking-tight">Going deeper? An engineering path</h2>
          <p className="text-sm text-muted-foreground">
            A broader route for advanced learners, linking existing Semitree content from concepts through to yield.
          </p>
        </div>
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {ENGINEERING_PATH.map((s, i) => (
            <li key={s.href} className="flex items-center">
              <Link
                href={s.href}
                className="rounded-full border border-border px-3 py-1 text-sm font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {s.title}
              </Link>
              {i < ENGINEERING_PATH.length - 1 && <span aria-hidden="true" className="px-1 text-brand/40">→</span>}
            </li>
          ))}
        </ol>
      </section>

      {/* Manufacturing connections */}
      <section aria-labelledby="connections-h" className="space-y-4">
        <h2 id="connections-h" className="text-xl font-semibold tracking-tight">Connect to the rest of Semitree</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Every step in the journey draws on equipment, materials, design, metrology, and a global supply chain.
        </p>
        <ul className="flex flex-wrap gap-2">
          {CONNECTIONS.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {c.label} <span aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Self-check */}
      <section aria-labelledby="selfcheck-h" className="space-y-4">
        <div className="space-y-1">
          <h2 id="selfcheck-h" className="text-xl font-semibold tracking-tight">Can you explain it?</h2>
          <p className="text-sm text-muted-foreground">
            A quick self-reflection — not a graded quiz. If a question stumps you, revisit the linked topic.
          </p>
        </div>
        <Card className="divide-y divide-border p-0">
          {SELF_CHECK.map((item, i) => (
            <details key={i} className="group p-4">
              <summary className="flex cursor-pointer list-none items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span aria-hidden="true" className="mt-0.5 font-mono text-xs font-semibold text-brand">{i + 1}.</span>
                <span className="font-medium text-foreground">{item.q}</span>
              </summary>
              <p className="mt-2 pl-7 text-sm text-muted-foreground">
                {item.hint}{" "}
                <Link href={item.href} className="font-medium text-brand hover:underline">
                  Open topic →
                </Link>
              </p>
            </details>
          ))}
        </Card>
      </section>

      <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6">
        <p className="text-sm leading-relaxed text-foreground">
          The big picture: <span className="font-semibold">design → pattern → material → electrical property → device → die → package → system.</span>{" "}
          That is how a silicon wafer becomes a working packaged chip.
        </p>
      </div>
    </Container>
  );
}
