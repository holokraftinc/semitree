import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SubthresholdExplorer } from "@/components/tools/semi/SubthresholdExplorer";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Subthreshold swing explorer",
  description:
    "Subthreshold swing S = n (kT/q) ln10 and the exponential sub-threshold current.",
  path: "/semiconductors/tools/subthreshold-explorer",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="subthreshold-explorer" />
      <TrackView event="tool_opened" payload={{ tool: "subthreshold-explorer" }} />
      <SubthresholdExplorer />
      <ToolEcosystem slug="subthreshold-explorer" />
    </Container>
  );
}
