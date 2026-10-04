import { SemiComparison } from "./SemiComparison";

export function EtchComparison() {
  return (
    <SemiComparison
      slug="etch-comparison"
      title="Etch method comparison"
      description="How wet and dry (plasma) etching differ, conceptually — mechanism, isotropy, selectivity, equipment, applications, and limitations."
      columns={["Dimension", "Wet etching", "Dry (plasma) etching"]}
      rows={[
        ["Mechanism", "A chemical reaction in a liquid dissolves the material", "A plasma of reactive species, often with directional ion bombardment"],
        ["Isotropy", "Usually isotropic — etches sideways as well as down", "Can be highly anisotropic — nearly vertical sidewalls"],
        ["Selectivity", "Often very high and gentle for the right chemistry", "Tunable; can drop when ion energy is high"],
        ["Equipment", "Wet benches, controlled chemical baths and rinses", "Vacuum plasma chambers with RF power and gas delivery"],
        ["Typical applications", "Blanket strips, cleaning, and less-critical layers", "Fine, dense, and high-aspect-ratio features"],
        ["Limitations", "Undercut limits fine features; chemical handling", "More complex and costly; can add damage or charging effects"],
      ]}
      note="Dry etching is not automatically better. Wet etching remains the right choice when its speed, gentleness, cost, or very high selectivity suit the job; dry etching wins where fine, directional profiles are required."
      relatedConcepts={[
        { label: "Etching & deposition", href: "/semiconductors/learn/etching" },
      ]}
    />
  );
}
