import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { MANUFACTURING_STAGES } from "@/lib/data/platform";

/** High-level, factual overview of how chips are made (teaser). */
export function ManufacturingOverview() {
  return (
    <Section
      headingId="manufacturing"
      title="How a chip is made"
      description="A five-stage view of semiconductor manufacturing. Walk the full 17-step process in the interactive explorer."
      action={{ label: "Open the Manufacturing Explorer", href: "/manufacturing" }}
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {MANUFACTURING_STAGES.map((stage) => (
          <li key={stage.step}>
            <Card className="flex h-full flex-col p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 font-mono text-sm font-semibold text-brand">
                {stage.step}
              </span>
              <span className="mt-3 font-semibold tracking-tight">
                {stage.title}
              </span>
              <span className="mt-1 text-sm text-muted-foreground">
                {stage.summary}
              </span>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}
