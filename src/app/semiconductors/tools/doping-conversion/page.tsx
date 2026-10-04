import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DopingConversionCalculator } from "@/components/tools/semi/DopingConversionCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Doping concentration to count converter",
  description:
    "Convert between dopant concentration, volume, and total dopant atoms; concentration is a density, not a count.",
  path: "/semiconductors/tools/doping-conversion",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="doping-conversion" />
      <TrackView event="tool_opened" payload={{ tool: "doping-conversion" }} />
      <DopingConversionCalculator />
    </Container>
  );
}
