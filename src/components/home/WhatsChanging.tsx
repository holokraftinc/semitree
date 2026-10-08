import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * "What's changing?" — the forces reshaping the ecosystem, as entry points into
 * the relevant section. Each tile links to where that kind of change is tracked
 * today (richer per-category feeds come later).
 */
const CATEGORIES: { label: string; href: string }[] = [
  { label: "Investments", href: "/india" },
  { label: "Facilities", href: "/india" },
  { label: "Startups", href: "/companies" },
  { label: "Technology", href: "/explore" },
  { label: "Policy", href: "/india" },
  { label: "Supply chain", href: "/supply-chain" },
  { label: "Partnerships", href: "/insights" },
];

export function WhatsChanging() {
  return (
    <section aria-labelledby="changing-h" className="border-b border-border bg-muted/20">
      <Container className="py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">What&rsquo;s changing?</p>
        <h2 id="changing-h" className="mt-2 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
          The forces reshaping India&rsquo;s ecosystem
        </h2>

        <ul className="mt-8 flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <li key={c.label}>
              <Link
                href={c.href}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {c.label}
                <span aria-hidden="true" className="text-brand">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
