import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DiffusionTimeCalculator } from "@/components/tools/calculators/DiffusionTimeCalculator";
import { ToolSeo } from "@/components/seo/ToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Diffusion time calculator",
  description:
    "Estimate the characteristic diffusion time across a distance: t ≈ L²/(2D).",
  path: "/tools/diffusion-time",
});

export default function DiffusionTimePage() {
  return (
    <Container className="py-10">
      <ToolSeo slug="diffusion-time" />
      <TrackView event="tool_opened" payload={{ tool: "diffusion-time" }} />
      <DiffusionTimeCalculator />
    </Container>
  );
}
