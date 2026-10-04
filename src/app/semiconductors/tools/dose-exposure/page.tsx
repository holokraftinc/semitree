import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DoseExposureCalculator } from "@/components/tools/semi/DoseExposureCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Exposure dose calculator",
  description:
    "Educational exposure dose from energy and area (dose = energy / area), in mJ/cm2.",
  path: "/semiconductors/tools/dose-exposure",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="dose-exposure" />
      <TrackView event="tool_opened" payload={{ tool: "dose-exposure" }} />
      <DoseExposureCalculator />
    </Container>
  );
}
