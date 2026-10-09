import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MosfetThresholdCalculator } from "@/components/tools/semi/MosfetThresholdCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "MOSFET threshold voltage calculator",
  description:
    "Educational long-channel nMOS threshold voltage from substrate doping, oxide thickness, and flatband voltage.",
  path: "/semiconductors/tools/mosfet-threshold",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="mosfet-threshold" />
      <TrackView event="tool_opened" payload={{ tool: "mosfet-threshold" }} />
      <MosfetThresholdCalculator />
      <ToolEcosystem slug="mosfet-threshold" />
    </Container>
  );
}
