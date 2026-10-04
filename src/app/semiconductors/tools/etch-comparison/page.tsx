import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { EtchComparison } from "@/components/tools/semi/EtchComparison";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Etch method comparison",
  description:
    "Compare wet and dry etching: mechanism, isotropy, selectivity, equipment, applications, and limitations.",
  path: "/semiconductors/tools/etch-comparison",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="etch-comparison" />
      <TrackView event="tool_opened" payload={{ tool: "etch-comparison" }} />
      <EtchComparison />
    </Container>
  );
}
