import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DiffusionProfileTool } from "@/components/tools/semi/DiffusionProfileTool";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Diffusion profile tool (educational)",
  description:
    "Visualize an erfc dopant diffusion profile as you vary diffusion coefficient and time.",
  path: "/semiconductors/tools/diffusion-education",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="diffusion-education" />
      <TrackView event="tool_opened" payload={{ tool: "diffusion-education" }} />
      <DiffusionProfileTool />
    </Container>
  );
}
