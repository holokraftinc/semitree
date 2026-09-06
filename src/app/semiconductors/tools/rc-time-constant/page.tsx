import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RcTimeConstantCalculator } from "@/components/tools/semi/RcTimeConstantCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "RC time constant calculator",
  description:
    "Compute the RC time constant (τ = R·C) and the −3 dB cutoff frequency of a single-pole RC network.",
  path: "/semiconductors/tools/rc-time-constant",
});

export default function RcTimeConstantPage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="rc-time-constant" />
      <TrackView event="tool_opened" payload={{ tool: "rc-time-constant" }} />
      <RcTimeConstantCalculator />
    </Container>
  );
}
