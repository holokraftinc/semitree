import { SemiComparison } from "./SemiComparison";

export function PackagingComparison() {
  return (
    <SemiComparison
      slug="packaging-comparison"
      title="2D / 2.5D / 3D packaging comparison"
      description="How 2D, 2.5D, and 3D packaging differ in arrangement, interconnect, thermal behaviour, integration challenge, and typical use. Terminology varies by architecture; treat this as a conceptual guide."
      columns={["Dimension", "2D", "2.5D", "3D"]}
      rows={[
        ["Arrangement", "Dies side by side on the package substrate", "Dies side by side on a shared interposer or over an embedded bridge", "Dies stacked vertically"],
        ["Interconnect", "Through the package substrate (longer, lower density)", "Through a dense interposer/bridge (short, high density)", "Through the stack, e.g. TSVs and hybrid bonding (shortest)"],
        ["Thermal", "Heat spreads across the footprint; easiest to cool", "Similar to 2D, with added interposer layers", "Hardest — inner dies have no direct path to a heatsink"],
        ["Integration challenge", "Lowest; mature and inexpensive", "Moderate; interposer/bridge adds cost and complexity", "Highest; stacking, TSVs, and bonding are demanding"],
        ["Typical use", "Cost-sensitive and simpler multi-die products", "High-bandwidth compute + memory (e.g. accelerators with HBM)", "Maximum density and bandwidth in a small footprint (e.g. stacked memory, 3D cache)"],
      ]}
      note="These are conceptual families, and industry usage of the labels varies by architecture. No approach is universally best — the right choice depends on bandwidth, footprint, thermal limits, and cost."
      relatedConcepts={[
        { label: "Chip packaging", href: "/semiconductors/learn/packaging" },
        { label: "Chiplets", href: "/semiconductors/learn/chiplets" },
        { label: "3D ICs", href: "/semiconductors/learn/3d-ic" },
        { label: "Advanced packaging", href: "/semiconductors/learn/advanced-packaging" },
      ]}
    />
  );
}
