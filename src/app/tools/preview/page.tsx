import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Tooltip } from "@/components/ui/Tooltip";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";

export const metadata: Metadata = {
  title: "Calculator shell preview",
  description:
    "A design preview of the reusable Semitree calculator shell. No calculations are performed.",
  // Duplicates the real Reynolds tool — keep out of the index.
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/preview" },
};

/**
 * Design-system preview of the calculator shell, populated with static Reynolds
 * example content. It performs NO calculation — inputs and results are
 * illustrative so the layout and every section can be reviewed.
 */
export default function CalculatorPreviewPage() {
  return (
    <Container className="py-10">
      <Alert variant="neutral" title="Design preview" className="mb-8">
        This page demonstrates the reusable calculator shell with placeholder
        content. Inputs are not wired to any computation — the calculation engine
        is implemented in a later phase.
      </Alert>

      <CalculatorShell
        title="Reynolds number"
        description="Check whether flow in a channel is laminar or turbulent."
        tier="mvp"
        categoryLabel="Fluid mechanics"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Reynolds number" },
        ]}
        inputs={
          <>
            <Input
              label="Fluid density (ρ)"
              type="number"
              placeholder="1000"
              help="Water ≈ 1000 kg/m³."
              defaultValue="1000"
            />
            <Input
              label="Mean velocity (v)"
              type="number"
              placeholder="0.01"
              defaultValue="0.01"
            />
            <Input
              label="Hydraulic diameter (Dₕ)"
              type="number"
              placeholder="100"
              defaultValue="100"
            />
            <Select
              label="Viscosity preset"
              defaultValue="water"
              options={[
                { value: "water", label: "Water (1.0 mPa·s)" },
                { value: "custom", label: "Custom…" },
              ]}
            />
          </>
        }
        actions={
          <Button size="md" disabled>
            Calculate
          </Button>
        }
        result={
          <ResultCard
            results={[
              { label: "Reynolds number", value: "1.0", primary: true },
              { label: "Regime", value: "Laminar" },
            ]}
          />
        }
        interpretation={
          <p>
            A Reynolds number well below ~2000 indicates{" "}
            <Tooltip content="Smooth, orderly flow in parallel layers — the norm at the microscale.">
              laminar
            </Tooltip>{" "}
            flow. At this scale, mixing is dominated by diffusion rather than
            turbulence.
          </p>
        }
        formula={{
          expression: "Re = ρ · v · Dₕ / μ",
          label: "Reynolds number",
          caption: "Dimensionless ratio of inertial to viscous forces.",
        }}
        variables={[
          { symbol: "Re", name: "Reynolds number", unit: "—" },
          { symbol: "ρ", name: "Fluid density", unit: "kg/m³" },
          { symbol: "v", name: "Mean velocity", unit: "m/s" },
          { symbol: "Dₕ", name: "Hydraulic diameter", unit: "m" },
          { symbol: "μ", name: "Dynamic viscosity", unit: "Pa·s" },
        ]}
        assumptions={[
          "Newtonian, incompressible fluid.",
          "Fully developed, steady flow.",
          "Hydraulic diameter is appropriate for the channel cross-section.",
        ]}
        workedExample={
          <div className="space-y-2">
            <p>
              Water (ρ = 1000 kg/m³, μ = 1.0 mPa·s) flows at v = 0.01 m/s through a
              channel with Dₕ = 100 µm.
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Re = (1000 × 0.01 × 100e-6) / 1.0e-3 = 1.0
            </p>
            <p>Re ≈ 1 → firmly laminar.</p>
          </div>
        }
        relatedConcepts={[
          { label: "Laminar flow & low Reynolds number", href: "/concepts" },
        ]}
        relatedLessons={[
          { label: "Level 1 — Physics foundations", href: "/learn" },
        ]}
        relatedTools={[{ label: "Browse all tools", href: "/tools" }]}
      />
    </Container>
  );
}
