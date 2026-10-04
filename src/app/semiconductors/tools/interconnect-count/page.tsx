import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { InterconnectCapacityCalculator } from "@/components/tools/semi/InterconnectCapacityCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Interconnect capacity calculator",
  description:
    "Theoretical geometric connection capacity for an area at a given pitch, distinct from actual package capability.",
  path: "/semiconductors/tools/interconnect-count",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="interconnect-count" />
      <TrackView event="tool_opened" payload={{ tool: "interconnect-count" }} />
      <InterconnectCapacityCalculator />
    </Container>
  );
}
