import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProcessWindowExplorer } from "@/components/tools/semi/ProcessWindowExplorer";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Lithography process window explorer",
  description:
    "Interactive educational explorer: vary wavelength, NA, and k1 to see how theoretical resolution changes.",
  path: "/semiconductors/tools/process-window-explorer",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="process-window-explorer" />
      <TrackView event="tool_opened" payload={{ tool: "process-window-explorer" }} />
      <ProcessWindowExplorer />
    </Container>
  );
}
