import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { QuickStart } from "@/components/tools/QuickStart";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";
import { TOOLS } from "@/lib/data/tools";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Tools",
  description:
    "Microfluidics calculators and design utilities. Search, filter by category, or start from what you're trying to do.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <Container className="space-y-10 py-10">
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />
        <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
        <p className="max-w-2xl text-muted-foreground">
          Eight microfluidics calculators. Each one gives a clean input, an
          instant result, the formula, and a link to the concept behind it.
        </p>
      </div>

      <QuickStart />

      <ToolsExplorer tools={TOOLS} />
    </Container>
  );
}
