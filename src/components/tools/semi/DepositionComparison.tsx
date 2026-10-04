import { SemiComparison } from "./SemiComparison";

export function DepositionComparison() {
  return (
    <SemiComparison
      slug="deposition-comparison"
      title="Deposition method comparison"
      description="How CVD, PVD, ALD, and epitaxy differ, conceptually. Read it as a map of trade-offs — each is the right tool for different layers, and there is no universal ranking."
      columns={["Dimension", "CVD", "PVD", "ALD", "Epitaxy"]}
      rows={[
        ["Mechanism", "Precursor gases react at the wafer surface", "Atoms physically transported from a solid source in vacuum", "Alternating self-limiting surface reactions, one layer per cycle", "Crystalline growth aligned to the substrate lattice"],
        ["Conformality", "Generally good", "Limited (largely line-of-sight)", "Excellent", "Follows the surface/crystal"],
        ["Thickness control", "Good", "Moderate", "Atomic, set by cycle count", "Good, crystal-limited"],
        ["Typical use cases", "Many dielectric, semiconductor, and metal films", "Metal layers, seed and adhesion layers", "Ultrathin dielectrics, liners, and barriers", "Device-quality single-crystal layers"],
        ["Limitations", "Needs suitable precursors; byproducts and temperature", "Poor conformality on high-aspect-ratio features", "Slow throughput", "Demanding conditions; constrained by the underlying lattice"],
      ]}
      note="No method is universally best. Each layer is matched to the method whose blend of conformality, thickness control, throughput, temperature, and material fit suits the job — fabs use all of them, often on the same chip."
      relatedConcepts={[
        { label: "Deposition", href: "/semiconductors/learn/deposition" },
        { label: "Etching & deposition", href: "/semiconductors/learn/etching" },
      ]}
    />
  );
}
