import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function PlatformHero() {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="hero-heading">
      <div className="max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="brand">Semiconductor platform</Badge>
          <Badge variant="neutral">Microfluidics domain — live</Badge>
        </div>
        <h1
          id="hero-heading"
          className="text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Understand the semiconductor industry.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Learn the concepts. Explore the technology. Use the tools. Discover the
          industry — one platform for knowledge, tools, and research, starting
          with a full microfluidics domain and expanding into semiconductors.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/explore" size="lg">
            Explore semiconductors
          </ButtonLink>
          <ButtonLink href="/learn" size="lg" variant="outline">
            Start learning
          </ButtonLink>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <a href="/tools" className="rounded-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Explore tools →
          </a>
          <a href="/research" className="rounded-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Latest research →
          </a>
        </div>
      </div>
    </section>
  );
}
