import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PitchHalfPitchCalculator } from "@/components/tools/semi/PitchHalfPitchCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Pitch / half-pitch calculator",
  description:
    "Convert a feature pitch into half-pitch and the equal line/space interpretation.",
  path: "/semiconductors/tools/pitch-half-pitch",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="pitch-half-pitch" />
      <TrackView event="tool_opened" payload={{ tool: "pitch-half-pitch" }} />
      <PitchHalfPitchCalculator />
    </Container>
  );
}
