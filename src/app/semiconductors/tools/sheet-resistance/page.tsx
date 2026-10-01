import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SheetResistanceCalculator } from "@/components/tools/semi/SheetResistanceCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Sheet resistance calculator",
  description:
    "Calculate sheet resistance (Ω/square) of a thin film from its resistivity and thickness, and the resistance of a patterned stripe.",
  path: "/semiconductors/tools/sheet-resistance",
});

export default function SheetResistancePage() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="sheet-resistance" />
      <TrackView event="tool_opened" payload={{ tool: "sheet-resistance" }} />
      <SheetResistanceCalculator />
    </Container>
  );
}
