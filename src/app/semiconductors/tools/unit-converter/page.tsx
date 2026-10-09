import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SemiUnitConverter } from "@/components/tools/semi/SemiUnitConverter";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor unit converter",
  description:
    "Convert semiconductor units: length (nm, Å), area, time (ns, ps), temperature, pressure (Torr), energy (eV), power, current, voltage, resistance, capacitance, and frequency.",
  path: "/semiconductors/tools/unit-converter",
});

export default function UnitConverterPage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="unit-converter" />
      <TrackView event="tool_opened" payload={{ tool: "unit-converter" }} />
      <SemiUnitConverter />
      <ToolEcosystem slug="unit-converter" />
    </Container>
  );
}
