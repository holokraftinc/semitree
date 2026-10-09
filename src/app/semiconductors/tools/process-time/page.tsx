import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProcessTimeCalculator } from "@/components/tools/semi/ProcessTimeCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Deposition process time calculator",
  description:
    "Estimate deposition process time for a target thickness at a given rate (constant-rate assumption).",
  path: "/semiconductors/tools/process-time",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="process-time" />
      <TrackView event="tool_opened" payload={{ tool: "process-time" }} />
      <ProcessTimeCalculator />
      <ToolEcosystem slug="process-time" />
    </Container>
  );
}
