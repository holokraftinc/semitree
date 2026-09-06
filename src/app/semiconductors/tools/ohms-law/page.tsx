import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { OhmsLawCalculator } from "@/components/tools/semi/OhmsLawCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Ohm's law calculator",
  description:
    "Solve for voltage, current, or resistance (V = I·R) in a resistive circuit, with unit conversion and worked examples.",
  path: "/semiconductors/tools/ohms-law",
});

export default function OhmsLawPage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="ohms-law" />
      <TrackView event="tool_opened" payload={{ tool: "ohms-law" }} />
      <OhmsLawCalculator />
    </Container>
  );
}
