import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ThermalVoltageCalculator } from "@/components/tools/semi/ThermalVoltageCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Thermal voltage calculator",
  description:
    "Thermal voltage Vt = kT/q, the scale of diode and MOSFET sub-threshold exponentials.",
  path: "/semiconductors/tools/thermal-voltage",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="thermal-voltage" />
      <TrackView event="tool_opened" payload={{ tool: "thermal-voltage" }} />
      <ThermalVoltageCalculator />
      <ToolEcosystem slug="thermal-voltage" />
    </Container>
  );
}
