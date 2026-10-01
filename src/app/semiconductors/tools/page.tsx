import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SemiToolsExplorer } from "@/components/tools/semi/SemiToolsExplorer";
import { SEMI_TOOLS, semiCategorySummaries } from "@/lib/data/semi-tools";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor Tools",
  description:
    "Interactive calculators, design tools and analysis utilities for understanding semiconductor technology, manufacturing and packaging.",
  path: "/semiconductors/tools",
});

export default function SemiconductorToolsPage() {
  const categories = semiCategorySummaries();
  const availableCount = SEMI_TOOLS.filter((t) => t.status === "available").length;

  return (
    <Container className="space-y-12 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Semiconductors", href: "/explore" },
            { label: "Tools" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Semiconductor Tools</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Interactive calculators, design tools and analysis utilities for understanding semiconductor
          technology, manufacturing and packaging.
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each tool shows its formula, assumptions, units, a worked example, and links to the concept behind
          it. Approximations are clearly labelled <span className="italic">Educational calculation</span>.{" "}
          <Link href="/semiconductors/learn/journey" className="font-medium text-brand hover:underline">
            Prefer to start with the learning journey? →
          </Link>
        </p>
      </div>

      {/* Discover by category — the full taxonomy (roadmap included) */}
      <section aria-labelledby="categories-h" className="space-y-4">
        <h2 id="categories-h" className="text-xl font-semibold tracking-tight">Browse by category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Card key={c.category} className="flex h-full flex-col p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold tracking-tight">{c.label}</h3>
                {c.count > 0 ? (
                  <span className="text-xs font-medium text-muted-foreground">
                    {c.count} {c.count === 1 ? "tool" : "tools"}
                  </span>
                ) : (
                  <Badge variant="neutral">Coming soon</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Search + filter over the implemented tools */}
      <section aria-labelledby="explore-h" className="space-y-4">
        <div className="space-y-1">
          <h2 id="explore-h" className="text-xl font-semibold tracking-tight">All tools</h2>
          <p className="text-sm text-muted-foreground">
            {availableCount} tools available today — search or filter by category and difficulty. More are on
            the way across every category above.
          </p>
        </div>
        <SemiToolsExplorer tools={SEMI_TOOLS} />
      </section>
    </Container>
  );
}
