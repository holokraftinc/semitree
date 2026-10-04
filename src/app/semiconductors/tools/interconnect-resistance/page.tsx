import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { InterconnectResistanceCalculator } from "@/components/tools/semi/InterconnectResistanceCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Interconnect resistance calculator",
  description:
    "Resistance of a metal wire from resistivity and geometry, R = rho L / (W t).",
  path: "/semiconductors/tools/interconnect-resistance",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="interconnect-resistance" />
      <TrackView event="tool_opened" payload={{ tool: "interconnect-resistance" }} />
      <InterconnectResistanceCalculator />
    </Container>
  );
}
