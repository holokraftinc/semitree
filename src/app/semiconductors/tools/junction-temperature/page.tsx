import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { JunctionTemperatureCalculator } from "@/components/tools/semi/JunctionTemperatureCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Junction temperature calculator",
  description:
    "Calculate steady-state junction temperature (T_j = T_a + P·θ_JA) from power, thermal resistance, and ambient.",
  path: "/semiconductors/tools/junction-temperature",
});

export default function JunctionTemperaturePage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="junction-temperature" />
      <TrackView event="tool_opened" payload={{ tool: "junction-temperature" }} />
      <JunctionTemperatureCalculator />
    </Container>
  );
}
