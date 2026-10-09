import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ThermalBudgetCalculator } from "@/components/tools/semi/ThermalBudgetCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Thermal budget calculator",
  description:
    "Allowable power from junction-to-ambient temperature margin and thermal resistance (simplified model).",
  path: "/semiconductors/tools/thermal-budget",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="thermal-budget" />
      <TrackView event="tool_opened" payload={{ tool: "thermal-budget" }} />
      <ThermalBudgetCalculator />
      <ToolEcosystem slug="thermal-budget" />
    </Container>
  );
}
