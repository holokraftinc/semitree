import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ScientificNotationCalculator } from "@/components/tools/semi/ScientificNotationCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Scientific notation converter",
  description:
    "Convert any number to scientific, engineering, and SI-prefix notation — useful for semiconductor dimensions and concentrations.",
  path: "/semiconductors/tools/scientific-notation",
});

export default function ScientificNotationPage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="scientific-notation" />
      <TrackView event="tool_opened" payload={{ tool: "scientific-notation" }} />
      <ScientificNotationCalculator />
      <ToolEcosystem slug="scientific-notation" />
    </Container>
  );
}
