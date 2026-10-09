import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MosCapacitorExplorer } from "@/components/tools/semi/MosCapacitorExplorer";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "MOS capacitor explorer",
  description:
    "Oxide capacitance Cox = eps_ox / tox and the accumulation, depletion, and inversion regions.",
  path: "/semiconductors/tools/mos-capacitor-explorer",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="mos-capacitor-explorer" />
      <TrackView event="tool_opened" payload={{ tool: "mos-capacitor-explorer" }} />
      <MosCapacitorExplorer />
      <ToolEcosystem slug="mos-capacitor-explorer" />
    </Container>
  );
}
