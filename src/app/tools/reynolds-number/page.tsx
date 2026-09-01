import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ReynoldsCalculator } from "@/components/tools/calculators/ReynoldsCalculator";
import { ToolSeo } from "@/components/seo/ToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Reynolds number calculator",
  description:
    "Calculate the Reynolds number (Re = ρvDₕ/μ) and check whether microchannel flow is laminar or turbulent.",
  path: "/tools/reynolds-number",
});

export default function ReynoldsNumberPage() {
  return (
    <Container className="py-10">
      <ToolSeo slug="reynolds-number" />
      <TrackView event="tool_opened" payload={{ tool: "reynolds-number" }} />
      <ReynoldsCalculator />
    </Container>
  );
}
