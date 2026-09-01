import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PressureDropCalculator } from "@/components/tools/calculators/PressureDropCalculator";
import { ToolSeo } from "@/components/seo/ToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Pressure drop calculator",
  description:
    "Hagen–Poiseuille pressure drop for a circular channel: ΔP = 128μLQ/(πD⁴).",
  path: "/tools/pressure-drop",
});

export default function PressureDropPage() {
  return (
    <Container className="py-10">
      <ToolSeo slug="pressure-drop" />
      <TrackView event="tool_opened" payload={{ tool: "pressure-drop" }} />
      <PressureDropCalculator />
    </Container>
  );
}
