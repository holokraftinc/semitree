import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ChannelGeometryExplorer } from "@/components/tools/semi/ChannelGeometryExplorer";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Channel length / geometry explorer",
  description:
    "How transistor width and length (W/L) scale the long-channel drive current.",
  path: "/semiconductors/tools/channel-geometry-explorer",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="channel-geometry-explorer" />
      <TrackView event="tool_opened" payload={{ tool: "channel-geometry-explorer" }} />
      <ChannelGeometryExplorer />
    </Container>
  );
}
