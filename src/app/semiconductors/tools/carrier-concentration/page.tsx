import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CarrierConcentrationCalculator } from "@/components/tools/semi/CarrierConcentrationCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Carrier concentration calculator",
  description:
    "Majority and minority carrier concentrations from dopant level and intrinsic carrier concentration (n p = ni squared).",
  path: "/semiconductors/tools/carrier-concentration",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="carrier-concentration" />
      <TrackView event="tool_opened" payload={{ tool: "carrier-concentration" }} />
      <CarrierConcentrationCalculator />
    </Container>
  );
}
