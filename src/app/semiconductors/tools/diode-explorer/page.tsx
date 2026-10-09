import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DiodeExplorer } from "@/components/tools/semi/DiodeExplorer";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Diode I-V explorer",
  description:
    "Interactive ideal (Shockley) diode I-V curve: I = Is(exp(V/nVt) - 1).",
  path: "/semiconductors/tools/diode-explorer",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="diode-explorer" />
      <TrackView event="tool_opened" payload={{ tool: "diode-explorer" }} />
      <DiodeExplorer />
      <ToolEcosystem slug="diode-explorer" />
    </Container>
  );
}
