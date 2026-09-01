import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { HydraulicDiameterCalculator } from "@/components/tools/calculators/HydraulicDiameterCalculator";
import { ToolSeo } from "@/components/seo/ToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Hydraulic diameter calculator",
  description:
    "Calculate the hydraulic diameter of a rectangular microchannel: Dₕ = 2wh/(w+h).",
  path: "/tools/hydraulic-diameter",
});

export default function HydraulicDiameterPage() {
  return (
    <Container className="py-10">
      <ToolSeo slug="hydraulic-diameter" />
      <TrackView event="tool_opened" payload={{ tool: "hydraulic-diameter" }} />
      <HydraulicDiameterCalculator />
    </Container>
  );
}
