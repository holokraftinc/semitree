import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { EtchRateCalculator } from "@/components/tools/semi/EtchRateCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Etch rate calculator",
  description:
    "Average etch rate from initial and remaining thickness over the process time.",
  path: "/semiconductors/tools/etch-rate",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="etch-rate" />
      <TrackView event="tool_opened" payload={{ tool: "etch-rate" }} />
      <EtchRateCalculator />
      <ToolEcosystem slug="etch-rate" />
    </Container>
  );
}
