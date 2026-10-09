import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DepositionRateCalculator } from "@/components/tools/semi/DepositionRateCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Deposition rate calculator",
  description:
    "Average deposition rate from deposited thickness and process time, in nm/min.",
  path: "/semiconductors/tools/deposition-rate",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="deposition-rate" />
      <TrackView event="tool_opened" payload={{ tool: "deposition-rate" }} />
      <DepositionRateCalculator />
      <ToolEcosystem slug="deposition-rate" />
    </Container>
  );
}
