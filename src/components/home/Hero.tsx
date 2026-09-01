import { ButtonLink } from "@/components/ui/Button";

const STEPS = ["Learn", "Calculate", "Understand", "Apply"] as const;

export function Hero() {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="hero-heading">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-medium text-brand">
          Free microfluidics tools & curriculum
        </p>
        <h1
          id="hero-heading"
          className="text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Learn microfluidics and design your chip in the same place.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Calculators wired to a zero-to-competent curriculum. Every concept
          links to the tool that applies it — and every tool links back to the
          concept that explains it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/tools" size="lg">
            Explore the tools
          </ButtonLink>
          <ButtonLink href="/learn" size="lg" variant="outline">
            Start learning
          </ButtonLink>
        </div>

        <ol className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-3 text-sm font-medium">
          {STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">
                {step}
              </span>
              {i < STEPS.length - 1 && (
                <span aria-hidden="true" className="text-muted-foreground/50">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
