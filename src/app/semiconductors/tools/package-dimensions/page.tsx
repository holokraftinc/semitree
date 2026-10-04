import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PackageDimensionsCalculator } from "@/components/tools/semi/PackageDimensionsCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Package dimensions calculator",
  description:
    "Footprint area and volume of a chip package from its length, width, and height.",
  path: "/semiconductors/tools/package-dimensions",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="package-dimensions" />
      <TrackView event="tool_opened" payload={{ tool: "package-dimensions" }} />
      <PackageDimensionsCalculator />
    </Container>
  );
}
