import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LithoResolutionCalculator } from "@/components/tools/semi/LithoResolutionCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Lithography resolution calculator",
  description:
    "Educational Rayleigh-style resolution estimate (R = k1 lambda / NA) from wavelength, numerical aperture, and the k1 process factor.",
  path: "/semiconductors/tools/litho-resolution",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="litho-resolution" />
      <TrackView event="tool_opened" payload={{ tool: "litho-resolution" }} />
      <LithoResolutionCalculator />
    </Container>
  );
}
