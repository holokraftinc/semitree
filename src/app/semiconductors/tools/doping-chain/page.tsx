import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DopingChainCalculator } from "@/components/tools/semi/DopingChainCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Doping to sheet resistance chain",
  description:
    "Follow doping to carrier concentration to conductivity to resistivity to sheet resistance in one tool.",
  path: "/semiconductors/tools/doping-chain",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="doping-chain" />
      <TrackView event="tool_opened" payload={{ tool: "doping-chain" }} />
      <DopingChainCalculator />
      <ToolEcosystem slug="doping-chain" />
    </Container>
  );
}
