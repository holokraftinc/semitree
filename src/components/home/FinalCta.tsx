import { ButtonLink } from "@/components/ui/Button";

/** Closing call to action — restates the mission and sends the user into the ecosystem. */
export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-h" className="bg-foreground text-background">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/70">Semitree</p>
        <h2 id="final-cta-h" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Mapping India&rsquo;s semiconductor ecosystem
        </h2>
        <div className="mt-8">
          <ButtonLink href="/industry" size="lg" variant="primary">
            Explore the ecosystem →
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
