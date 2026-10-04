import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CapacitorCalculator } from "@/components/tools/semi/CapacitorCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Parallel-plate capacitor calculator",
  description:
    "Capacitance of a parallel-plate capacitor from area, spacing, and relative permittivity.",
  path: "/semiconductors/tools/capacitor",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="capacitor" />
      <TrackView event="tool_opened" payload={{ tool: "capacitor" }} />
      <CapacitorCalculator />
    </Container>
  );
}
