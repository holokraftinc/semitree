import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { WaferYieldCalculator } from "@/components/tools/semi/WaferYieldCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Wafer yield calculator",
  description:
    "Estimate die yield from defect density and die area using the Poisson or Murphy yield model.",
  path: "/semiconductors/tools/wafer-yield",
});

export default function WaferYieldPage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="wafer-yield" />
      <TrackView event="tool_opened" payload={{ tool: "wafer-yield" }} />
      <WaferYieldCalculator />
    </Container>
  );
}
