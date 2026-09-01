import { Section } from "@/components/ui/Section";
import { ToolCard } from "@/components/tools/ToolCard";
import { TOOLS, isToolAvailable } from "@/lib/data/tools";

export function PopularTools() {
  // Show available calculators first.
  const tools = [...TOOLS]
    .sort(
      (a, b) => Number(isToolAvailable(b.slug)) - Number(isToolAvailable(a.slug)),
    )
    .slice(0, 6);
  return (
    <Section
      headingId="popular-tools"
      title="Popular tools"
      description="Start with the calculators researchers reach for most."
      action={{ label: "All tools", href: "/tools" }}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            available={isToolAvailable(tool.slug)}
          />
        ))}
      </div>
    </Section>
  );
}
