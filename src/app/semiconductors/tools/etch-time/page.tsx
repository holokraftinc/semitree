import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { EtchTimeCalculator } from "@/components/tools/semi/EtchTimeCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Etch time estimator",
  description:
    "Estimate etch time for a thickness at a given etch rate; real processes use endpoint detection and margins.",
  path: "/semiconductors/tools/etch-time",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="etch-time" />
      <TrackView event="tool_opened" payload={{ tool: "etch-time" }} />
      <EtchTimeCalculator />
    </Container>
  );
}
