import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ConductivityCalculator } from "@/components/tools/semi/ConductivityCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor conductivity calculator",
  description:
    "Conductivity of a doped semiconductor from carrier concentrations and mobilities, sigma = q(n mu_n + p mu_p).",
  path: "/semiconductors/tools/conductivity",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="conductivity" />
      <TrackView event="tool_opened" payload={{ tool: "conductivity" }} />
      <ConductivityCalculator />
    </Container>
  );
}
