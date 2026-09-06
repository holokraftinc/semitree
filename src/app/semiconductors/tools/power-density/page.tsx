import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PowerDensityCalculator } from "@/components/tools/semi/PowerDensityCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Power density calculator",
  description:
    "Calculate the areal power density (P/A) of a die or package from total power and die dimensions.",
  path: "/semiconductors/tools/power-density",
});

export default function PowerDensityPage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="power-density" />
      <TrackView event="tool_opened" payload={{ tool: "power-density" }} />
      <PowerDensityCalculator />
    </Container>
  );
}
