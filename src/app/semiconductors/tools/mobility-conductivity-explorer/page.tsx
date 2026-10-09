import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MobilityConductivityExplorer } from "@/components/tools/semi/MobilityConductivityExplorer";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Mobility / conductivity explorer",
  description:
    "Interactive conductivity sigma = q n mu as you vary carrier concentration and mobility.",
  path: "/semiconductors/tools/mobility-conductivity-explorer",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="mobility-conductivity-explorer" />
      <TrackView event="tool_opened" payload={{ tool: "mobility-conductivity-explorer" }} />
      <MobilityConductivityExplorer />
      <ToolEcosystem slug="mobility-conductivity-explorer" />
    </Container>
  );
}
