import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ThermalResistanceCalculator } from "@/components/tools/semi/ThermalResistanceCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Thermal resistance calculator",
  description:
    "Relate temperature rise, power, and thermal resistance with the educational relation delta-T = P x R-theta (C/W).",
  path: "/semiconductors/tools/thermal-resistance",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="thermal-resistance" />
      <TrackView event="tool_opened" payload={{ tool: "thermal-resistance" }} />
      <ThermalResistanceCalculator />
      <ToolEcosystem slug="thermal-resistance" />
    </Container>
  );
}
