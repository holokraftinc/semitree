import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ChipletExplorer } from "@/components/tools/semi/ChipletExplorer";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Chiplet package explorer",
  description:
    "Interactive educational view of side-by-side, stacked, interposer, and bridge chiplet integration.",
  path: "/semiconductors/tools/chiplet-explorer",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="chiplet-explorer" />
      <TrackView event="tool_opened" payload={{ tool: "chiplet-explorer" }} />
      <ChipletExplorer />
    </Container>
  );
}
