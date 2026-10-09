import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BumpPitchCalculator } from "@/components/tools/semi/BumpPitchCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Bump / interconnect pitch calculator",
  description:
    "Connection count, array span, and areal density from a bump array's rows, columns, and pitch.",
  path: "/semiconductors/tools/bump-pitch",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="bump-pitch" />
      <TrackView event="tool_opened" payload={{ tool: "bump-pitch" }} />
      <BumpPitchCalculator />
      <ToolEcosystem slug="bump-pitch" />
    </Container>
  );
}
