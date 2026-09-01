import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { FlowResistanceCalculator } from "@/components/tools/calculators/FlowResistanceCalculator";
import { ToolSeo } from "@/components/seo/ToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Flow resistance calculator",
  description:
    "Hydraulic resistance of a channel (R = ΔP/Q; rectangular approximation) and the hydraulic–electrical analogy.",
  path: "/tools/flow-resistance",
});

export default function FlowResistancePage() {
  return (
    <Container className="py-10">
      <ToolSeo slug="flow-resistance" />
      <TrackView event="tool_opened" payload={{ tool: "flow-resistance" }} />
      <FlowResistanceCalculator />
    </Container>
  );
}
