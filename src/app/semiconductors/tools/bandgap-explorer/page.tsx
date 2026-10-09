import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BandgapExplorer } from "@/components/tools/semi/BandgapExplorer";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Bandgap energy explorer",
  description:
    "Temperature dependence of the semiconductor bandgap via the Varshni relation, with material presets.",
  path: "/semiconductors/tools/bandgap-explorer",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="bandgap-explorer" />
      <TrackView event="tool_opened" payload={{ tool: "bandgap-explorer" }} />
      <BandgapExplorer />
      <ToolEcosystem slug="bandgap-explorer" />
    </Container>
  );
}
