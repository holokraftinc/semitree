import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ImplantDoseCalculator } from "@/components/tools/semi/ImplantDoseCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Implant dose calculator (educational)",
  description:
    "Total implanted ions from an areal dose and area; educational, with no operational implant recipes.",
  path: "/semiconductors/tools/implant-dose",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="implant-dose" />
      <TrackView event="tool_opened" payload={{ tool: "implant-dose" }} />
      <ImplantDoseCalculator />
    </Container>
  );
}
