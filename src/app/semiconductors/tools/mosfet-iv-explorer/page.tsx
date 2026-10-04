import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MosfetIvExplorer } from "@/components/tools/semi/MosfetIvExplorer";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "MOSFET I-V explorer",
  description:
    "Interactive long-channel square-law MOSFET drain-current curves across gate and drain voltage.",
  path: "/semiconductors/tools/mosfet-iv-explorer",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="mosfet-iv-explorer" />
      <TrackView event="tool_opened" payload={{ tool: "mosfet-iv-explorer" }} />
      <MosfetIvExplorer />
    </Container>
  );
}
