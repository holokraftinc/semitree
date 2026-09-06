import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { semiToolsByCategory } from "@/lib/data/semi-tools";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor engineering tools",
  description:
    "Free semiconductor engineering calculators: Ohm's law, power, RC time constant, built-in potential, die per wafer, wafer yield, junction temperature, and power density.",
  path: "/semiconductors/tools",
});

export default function SemiconductorToolsPage() {
  const groups = semiToolsByCategory();

  return (
    <Container className="space-y-10 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Semiconductors", href: "/explore" },
            { label: "Tools" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">
          Semiconductor engineering tools
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Focused calculators for electrical fundamentals, device physics,
          manufacturing, and packaging. Each one shows the formula, its
          assumptions, a worked example, and links to the concept behind it.
        </p>
      </div>

      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.category} aria-labelledby={`${group.category}-heading`} className="space-y-4">
            <h2
              id={`${group.category}-heading`}
              className="text-lg font-semibold tracking-tight"
            >
              {group.label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/semiconductors/tools/${tool.slug}`}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Card className="h-full p-5 transition-colors group-hover:border-brand/50">
                    <h3 className="text-base font-semibold tracking-tight group-hover:text-brand">
                      {tool.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tool.summary}
                    </p>
                    <p className="mt-3 font-mono text-xs text-muted-foreground">
                      {tool.formula}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
