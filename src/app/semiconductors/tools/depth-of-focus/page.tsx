import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DepthOfFocusCalculator } from "@/components/tools/semi/DepthOfFocusCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Depth of focus estimator",
  description:
    "Educational depth-of-focus estimate (DOF = k2 lambda / NA^2) and the resolution-focus trade-off.",
  path: "/semiconductors/tools/depth-of-focus",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="depth-of-focus" />
      <TrackView event="tool_opened" payload={{ tool: "depth-of-focus" }} />
      <DepthOfFocusCalculator />
      <ToolEcosystem slug="depth-of-focus" />
    </Container>
  );
}
