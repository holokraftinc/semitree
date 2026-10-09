import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SelectivityCalculator } from "@/components/tools/semi/SelectivityCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Etch selectivity calculator",
  description:
    "Ratio of target etch rate to mask/underlayer etch rate, and why selectivity matters.",
  path: "/semiconductors/tools/selectivity",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="selectivity" />
      <TrackView event="tool_opened" payload={{ tool: "selectivity" }} />
      <SelectivityCalculator />
      <ToolEcosystem slug="selectivity" />
    </Container>
  );
}
