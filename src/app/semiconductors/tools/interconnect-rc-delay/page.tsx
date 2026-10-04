import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { InterconnectRcDelayCalculator } from "@/components/tools/semi/InterconnectRcDelayCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Interconnect RC delay calculator",
  description:
    "First-order interconnect RC delay, tau = R C with a 50% delay of about 0.69 R C.",
  path: "/semiconductors/tools/interconnect-rc-delay",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="interconnect-rc-delay" />
      <TrackView event="tool_opened" payload={{ tool: "interconnect-rc-delay" }} />
      <InterconnectRcDelayCalculator />
    </Container>
  );
}
