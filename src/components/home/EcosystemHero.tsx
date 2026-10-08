import { ButtonLink } from "@/components/ui/Button";

/**
 * Homepage hero — the entry point to India's semiconductor ecosystem.
 * Typographic and restrained (no stock imagery, no large gradients): the
 * positioning line, the four-part promise, and two clear CTAs.
 */
export function EcosystemHero() {
  const promise = [
    "Understand the technology.",
    "Discover the companies.",
    "Follow the industry.",
    "Find the opportunities.",
  ];
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Faint node-grid accent — subtle, not a gradient wash. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            color: "rgb(var(--brand))",
          }}
        />
      </div>
      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Semitree</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          India&rsquo;s Semiconductor Ecosystem
        </h1>
        <div className="mt-6 max-w-xl space-y-1 text-lg text-muted-foreground sm:text-xl">
          {promise.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/india" size="lg" variant="primary">
            Explore India
          </ButtonLink>
          <ButtonLink href="/industry" size="lg" variant="outline">
            Explore the Industry
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
