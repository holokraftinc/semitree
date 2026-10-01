import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DieSizeCalculator } from "@/components/tools/semi/DieSizeCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Die size & area calculator",
  description:
    "Calculate die area and the square-equivalent dimension from die width and height.",
  path: "/semiconductors/tools/die-size",
});

export default function DieSizePage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="die-size" />
      <TrackView event="tool_opened" payload={{ tool: "die-size" }} />
      <DieSizeCalculator />
    </Container>
  );
}
