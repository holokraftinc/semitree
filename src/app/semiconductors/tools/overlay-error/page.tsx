import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { OverlayErrorCalculator } from "@/components/tools/semi/OverlayErrorCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Overlay error budget calculator",
  description:
    "Combine overlay error contributions in quadrature to understand lithography error budgeting.",
  path: "/semiconductors/tools/overlay-error",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="overlay-error" />
      <TrackView event="tool_opened" payload={{ tool: "overlay-error" }} />
      <OverlayErrorCalculator />
      <ToolEcosystem slug="overlay-error" />
    </Container>
  );
}
