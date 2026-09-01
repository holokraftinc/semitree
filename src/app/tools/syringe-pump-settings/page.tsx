import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SyringePumpCalculator } from "@/components/tools/calculators/SyringePumpCalculator";
import { ToolSeo } from "@/components/seo/ToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Syringe pump settings calculator",
  description:
    "Convert between syringe plunger speed and flow rate for a given inner diameter: Q = A·v, A = πd²/4.",
  path: "/tools/syringe-pump-settings",
});

export default function SyringePumpSettingsPage() {
  return (
    <Container className="py-10">
      <ToolSeo slug="syringe-pump-settings" />
      <TrackView event="tool_opened" payload={{ tool: "syringe-pump-settings" }} />
      <SyringePumpCalculator />
    </Container>
  );
}
