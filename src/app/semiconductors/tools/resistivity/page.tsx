import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ResistivityCalculator } from "@/components/tools/semi/ResistivityCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Resistivity calculator",
  description:
    "Resistivity as the reciprocal of conductivity, and its link to sheet resistance.",
  path: "/semiconductors/tools/resistivity",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="resistivity" />
      <TrackView event="tool_opened" payload={{ tool: "resistivity" }} />
      <ResistivityCalculator />
      <ToolEcosystem slug="resistivity" />
    </Container>
  );
}
