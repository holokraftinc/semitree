import Link from "next/link";
import { Section } from "@/components/ui/Section";

const LEVELS = [
  { n: 0, title: "Orientation", body: "What microfluidics is and why the microscale behaves differently." },
  { n: 1, title: "Physics foundations", body: "Laminar flow, resistance, capillarity, diffusion — the calculator-linked core." },
  { n: 2, title: "Materials & fabrication", body: "PDMS, soft lithography, glass/silicon, thermoplastics, bonding." },
  { n: 3, title: "Components & unit operations", body: "Channels, valves, pumps, mixers, droplet & gradient generators." },
  { n: 4, title: "Applications", body: "Single-cell, PCR, point-of-care, organ-on-chip, chip cooling." },
  { n: 5, title: "Do it yourself", body: "Design your first chip, work with a foundry, troubleshoot failures." },
] as const;

export function LearnFromZero() {
  return (
    <Section
      headingId="learn-from-zero"
      title="Learn from zero"
      description="A structured path from knowing nothing to designing with confidence."
      action={{ label: "See the curriculum", href: "/learn" }}
    >
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LEVELS.map((level) => (
          <li key={level.n}>
            <Link
              href="/learn"
              className="flex h-full gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-sm font-semibold text-brand">
                {level.n}
              </span>
              <span>
                <span className="block text-sm font-semibold">
                  {level.title}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {level.body}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Section>
  );
}
