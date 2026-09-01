import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PoissonCalculator } from "@/components/tools/calculators/PoissonCalculator";
import { ToolSeo } from "@/components/seo/ToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Poisson single-cell loading calculator",
  description:
    "Probability of 0, 1, or 2+ cells per droplet from Poisson statistics: P(k) = λᵏe⁻λ/k!.",
  path: "/tools/poisson-single-cell-loading",
});

export default function PoissonLoadingPage() {
  return (
    <Container className="py-10">
      <ToolSeo slug="poisson-single-cell-loading" />
      <TrackView event="tool_opened" payload={{ tool: "poisson-single-cell-loading" }} />
      <PoissonCalculator />
    </Container>
  );
}
