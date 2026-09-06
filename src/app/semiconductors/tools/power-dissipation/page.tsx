import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PowerDissipationCalculator } from "@/components/tools/semi/PowerDissipationCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Power dissipation calculator",
  description:
    "Compute resistive power (P = V·I = I²·R = V²/R) from any two of voltage, current, and resistance.",
  path: "/semiconductors/tools/power-dissipation",
});

export default function PowerDissipationPage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="power-dissipation" />
      <TrackView event="tool_opened" payload={{ tool: "power-dissipation" }} />
      <PowerDissipationCalculator />
    </Container>
  );
}
