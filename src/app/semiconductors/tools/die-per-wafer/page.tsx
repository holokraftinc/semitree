import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DiePerWaferCalculator } from "@/components/tools/semi/DiePerWaferCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Die per wafer calculator",
  description:
    "Estimate how many dies fit on a wafer using the de Vries approximation from wafer diameter and die size.",
  path: "/semiconductors/tools/die-per-wafer",
});

export default function DiePerWaferPage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="die-per-wafer" />
      <TrackView event="tool_opened" payload={{ tool: "die-per-wafer" }} />
      <DiePerWaferCalculator />
    </Container>
  );
}
