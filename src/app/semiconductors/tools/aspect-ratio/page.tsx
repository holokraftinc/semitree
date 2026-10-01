import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AspectRatioCalculator } from "@/components/tools/semi/AspectRatioCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Aspect ratio calculator",
  description:
    "Calculate feature aspect ratio (depth ÷ width) and understand its implications for etching, deposition, and packaging.",
  path: "/semiconductors/tools/aspect-ratio",
});

export default function AspectRatioPage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="aspect-ratio" />
      <TrackView event="tool_opened" payload={{ tool: "aspect-ratio" }} />
      <AspectRatioCalculator />
    </Container>
  );
}
