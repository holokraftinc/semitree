import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ResistorCalculator } from "@/components/tools/semi/ResistorCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Resistor calculator (R = rho L / A)",
  description:
    "Resistance of a uniform conductor from resistivity, length, and cross-sectional area.",
  path: "/semiconductors/tools/resistor",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="resistor" />
      <TrackView event="tool_opened" payload={{ tool: "resistor" }} />
      <ResistorCalculator />
      <ToolEcosystem slug="resistor" />
    </Container>
  );
}
