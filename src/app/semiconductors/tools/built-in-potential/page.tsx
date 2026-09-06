import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BuiltInPotentialCalculator } from "@/components/tools/semi/BuiltInPotentialCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Built-in potential calculator",
  description:
    "Calculate the built-in potential of an abrupt silicon PN junction from acceptor/donor doping and temperature.",
  path: "/semiconductors/tools/built-in-potential",
});

export default function BuiltInPotentialPage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="built-in-potential" />
      <TrackView event="tool_opened" payload={{ tool: "built-in-potential" }} />
      <BuiltInPotentialCalculator />
    </Container>
  );
}
