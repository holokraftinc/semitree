import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Learn semiconductors & technology",
  description:
    "Learn across Semitree's knowledge domains — semiconductors (fundamentals, chip design, manufacturing, packaging, materials, equipment and the industry) and the specialized microfluidics domain.",
  path: "/learn",
});

const DOMAINS = [
  {
    href: "/semiconductors/learn",
    label: "Semiconductors",
    description:
      "Learn semiconductor fundamentals, chip design, manufacturing, wafer fabrication, lithography, materials, equipment, packaging, and the industry ecosystem.",
    primary: true,
  },
  {
    href: "/learn/microfluidics",
    label: "Microfluidics",
    description:
      "Learn microfluidics fundamentals, lab-on-chip systems, devices, manufacturing, and applications.",
    primary: false,
  },
];

export default function LearnPage() {
  return (
    <Container className="space-y-10 py-10">
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn" }]} />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Learn</h1>
        <p className="max-w-2xl text-muted-foreground">
          Build your understanding of the technologies shaping the future. Choose
          a domain to start.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {DOMAINS.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card
              className={
                "flex h-full flex-col p-6 transition-colors group-hover:border-brand/50 " +
                (d.primary ? "border-brand/40 bg-brand/5 sm:p-8" : "")
              }
            >
              {d.primary && (
                <span className="mb-2 inline-flex w-fit items-center rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                  Primary domain
                </span>
              )}
              <h2
                className={
                  "font-bold tracking-tight group-hover:text-brand " +
                  (d.primary ? "text-2xl" : "text-xl")
                }
              >
                {d.label}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {d.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                Start learning
                <span aria-hidden="true">→</span>
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
