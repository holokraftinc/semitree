import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PnJunctionExplorer } from "@/components/tools/semi/PnJunctionExplorer";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "PN junction explorer",
  description:
    "Interactive conceptual PN junction: see how the depletion region changes with doping.",
  path: "/semiconductors/tools/pn-junction-explorer",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="pn-junction-explorer" />
      <TrackView event="tool_opened" payload={{ tool: "pn-junction-explorer" }} />
      <PnJunctionExplorer />
      <ToolEcosystem slug="pn-junction-explorer" />
    </Container>
  );
}
