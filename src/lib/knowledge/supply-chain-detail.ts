/**
 * Authored explanatory detail for the core supply-chain stages, kept separate
 * from the structural SUPPLY_STAGES data so the big registry stays lean.
 *
 * These are editorial explanations (like `whatHappens`/`tagline`), not fabricated
 * facts, figures, or relationships: "why it matters" in plain terms, and the
 * high-level inputs a stage consumes / outputs it produces. Stages without an
 * entry fall back gracefully in the UI.
 */
export interface StageDetail {
  whyItMatters: string;
  inputs: string[];
  outputs: string[];
}

export const STAGE_DETAIL: Record<string, StageDetail> = {
  "chip-design": {
    whyItMatters:
      "Design decides what a chip can do, how fast it runs, and how much power it uses — the ceiling on everything downstream. It is the stage where India is already globally competitive.",
    inputs: ["Product requirements & specifications", "IP blocks and standard cells", "Target process node"],
    outputs: ["Register-transfer-level (RTL) design", "Verified logical design", "Design hand-off to physical implementation"],
  },
  eda: {
    whyItMatters:
      "No modern chip can be designed by hand. EDA software and reusable IP are the tools that turn an architecture into a manufacturable layout — a small set of vendors the whole industry depends on.",
    inputs: ["RTL and design intent", "Process design kits (PDKs) from foundries", "Licensed IP cores"],
    outputs: ["Synthesised, placed-and-routed layout", "Verified timing and physical design", "GDSII / tape-out database"],
  },
  "semiconductor-equipment": {
    whyItMatters:
      "The machines define what is physically possible. A single lithography generation (like EUV) can gate an entire nation's access to leading-edge nodes — which is why equipment is the industry's biggest chokepoint.",
    inputs: ["Precision sub-systems & optics", "Control software", "Fab process requirements"],
    outputs: ["Lithography, deposition, etch, implant & inspection tools", "Installed, qualified fab capacity"],
  },
  "raw-materials": {
    whyItMatters:
      "Chips are only as good as their inputs. Ultra-pure silicon, gases, and chemicals at parts-per-billion purity are non-negotiable — and a quiet source of supply-chain risk.",
    inputs: ["Silica / quartz and feedstock", "Specialty chemicals & gases", "Energy"],
    outputs: ["Electronic-grade polysilicon", "Process chemicals, slurries & gases", "Specialty materials for the fab"],
  },
  "wafer-manufacturing": {
    whyItMatters:
      "The wafer is the canvas every chip is built on. Crystal quality and surface flatness set the baseline for yield across the entire fab line.",
    inputs: ["Electronic-grade polysilicon", "Crystal-growth furnaces", "Slicing & polishing equipment"],
    outputs: ["Single-crystal silicon ingots", "Polished, mirror-flat wafers"],
  },
  fab: {
    whyItMatters:
      "The fab is where a design becomes silicon — the most capital-intensive, technically demanding link in the entire chain. A single leading-edge fab can cost tens of billions of dollars.",
    inputs: ["Polished wafers", "Photomasks from tape-out", "Process chemicals, gases & equipment"],
    outputs: ["Patterned wafers with completed transistors & interconnect", "Wafers ready for assembly & test"],
  },
  packaging: {
    whyItMatters:
      "Packaging turns fragile dies into usable components and is now where much of the performance gain happens — advanced packaging and chiplets are the new frontier, and the part of manufacturing India is entering first.",
    inputs: ["Finished wafers", "Substrates, leadframes & bonding materials", "Assembly equipment"],
    outputs: ["Singulated, packaged dies", "Assembled modules & chiplet packages"],
  },
  testing: {
    whyItMatters:
      "Testing is the quality gate: it proves each die and package works before it ships, and the data it produces feeds yield learning back into the fab.",
    inputs: ["Packaged or bare dies", "Test programs & probe cards", "Automated test equipment"],
    outputs: ["Known-good, binned devices", "Yield & reliability data"],
  },
  electronics: {
    whyItMatters:
      "This is where chips meet the real world — assembled onto boards and into the systems and products people actually buy. It anchors demand for everything upstream.",
    inputs: ["Packaged, tested chips", "Printed circuit boards & components", "System design"],
    outputs: ["Assembled boards & modules", "Finished electronic products"],
  },
  "end-markets": {
    whyItMatters:
      "End markets — phones, cars, data centres, industrial and defence — are the pull that drives the whole chain. Shifts here (AI, electric vehicles) reshape demand all the way back to design.",
    inputs: ["Finished electronic products", "Market demand"],
    outputs: ["Deployed systems across industries", "Demand signals that reshape the chain"],
  },
};

export function getStageDetail(slug: string): StageDetail | undefined {
  return STAGE_DETAIL[slug];
}
