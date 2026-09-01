import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { UnitConverter } from "@/components/tools/calculators/UnitConverter";
import { ToolSeo } from "@/components/seo/ToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Unit converter",
  description:
    "Convert microfluidics units instantly: flow rate, pressure, volume, and viscosity.",
  path: "/tools/unit-converter",
});

export default function UnitConverterPage() {
  return (
    <Container className="space-y-8 py-10">
      <ToolSeo slug="unit-converter" />
      <TrackView event="tool_opened" payload={{ tool: "unit-converter" }} />
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Unit converter" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Unit converter</h1>
        <p className="max-w-2xl text-muted-foreground">
          Instant conversions for the units you use most in the lab — flow rate,
          pressure, volume, and viscosity. Swap directions or copy the result.
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <UnitConverter />
      </Card>
    </Container>
  );
}
