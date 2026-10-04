import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PackagingComparison } from "@/components/tools/semi/PackagingComparison";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "2D / 2.5D / 3D packaging comparison",
  description:
    "Compare 2D, 2.5D, and 3D packaging: arrangement, interconnect, thermal, challenges, and use cases.",
  path: "/semiconductors/tools/packaging-comparison",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="packaging-comparison" />
      <TrackView event="tool_opened" payload={{ tool: "packaging-comparison" }} />
      <PackagingComparison />
    </Container>
  );
}
