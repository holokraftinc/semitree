import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DepositionComparison } from "@/components/tools/semi/DepositionComparison";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Deposition method comparison",
  description:
    "Compare CVD, PVD, ALD, and epitaxy conceptually: mechanism, conformality, thickness control, use cases, and limitations.",
  path: "/semiconductors/tools/deposition-comparison",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="deposition-comparison" />
      <TrackView event="tool_opened" payload={{ tool: "deposition-comparison" }} />
      <DepositionComparison />
    </Container>
  );
}
