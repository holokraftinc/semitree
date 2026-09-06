/**
 * Semiconductor Supply Chain Explorer — stage model.
 *
 * This layer is deliberately an OVERVIEW that interlinks to existing Semitree
 * entities rather than duplicating them:
 *   - detailed process content lives in manufacturing.ts (/manufacturing)
 *   - companies live in the industry registry (/industry)
 *   - concepts live in semi-lessons.ts (/semiconductors/learn)
 *   - calculators live in semi-tools.ts (/semiconductors/tools)
 * For manufacturing-heavy stages, equipment/materials are DERIVED from the
 * linked manufacturing processes (single source of truth), not re-listed.
 *
 * FUTURE-READY: the `SupplyChainIntel` interface reserves space for supply-chain
 * risk, geographic concentration, capacity, investments, and technology
 * dependencies. These are intentionally left unpopulated — no speculative data
 * is shipped. "Companies" is the one intelligence dimension available today,
 * because it is derived from the verified industry registry.
 */
import type { CompanyType } from "@/lib/industry/types";
import { getProcess } from "./manufacturing";

export type SegmentId =
  | "inputs"
  | "design"
  | "tooling"
  | "front-end"
  | "back-end"
  | "downstream";

export interface Segment {
  id: SegmentId;
  label: string;
  summary: string;
}

export const SEGMENTS: Segment[] = [
  { id: "inputs", label: "Inputs & materials", summary: "From raw sand to a polished silicon wafer." },
  { id: "design", label: "Design", summary: "Turning an idea into a manufacturable chip design." },
  { id: "tooling", label: "Equipment", summary: "The machines that make chip-making possible." },
  { id: "front-end", label: "Front-end manufacturing", summary: "Building transistors and wiring on the wafer." },
  { id: "back-end", label: "Assembly, packaging & test", summary: "Turning wafers into packaged, tested chips." },
  { id: "downstream", label: "Downstream", summary: "Chips become products, and products reach markets." },
];

/** Reserved architecture for later supply-chain intelligence. Not populated. */
export interface SupplyChainIntel {
  risk?: string[];
  geographicConcentration?: string[];
  capacity?: string[];
  investments?: string[];
  technologyDependencies?: string[];
}

/** The intelligence dimensions surfaced in the UI (architecture roadmap). */
export const INTEL_DIMENSIONS = [
  { key: "companies", label: "Companies", status: "available" as const },
  { key: "geographicConcentration", label: "Geographic concentration", status: "planned" as const },
  { key: "risk", label: "Supply-chain risk", status: "planned" as const },
  { key: "capacity", label: "Capacity", status: "planned" as const },
  { key: "investments", label: "Investments", status: "planned" as const },
  { key: "technologyDependencies", label: "Technology dependencies", status: "planned" as const },
];

export interface ChainLink {
  label: string;
  href?: string;
}

export interface SupplyStage {
  slug: string;
  name: string;
  order: number;
  segment: SegmentId;
  tagline: string;

  whatHappens: string;
  participants: string[];
  technologies: string[];
  /** Explicit equipment; if omitted, derived from `relatedProcesses`. */
  equipment?: string[];
  /** Explicit materials; if omitted, derived from `relatedProcesses`. */
  materials?: string[];
  /** Company types that operate here → resolved against the industry registry. */
  companyTypes: CompanyType[];
  skills: string[];
  researchThemes: string[];

  /* Interlinks (no duplication — these point at the detailed content). */
  relatedProcesses?: string[];
  relatedConcepts?: { label: string; slug: string }[];
  relatedTools?: string[];

  /** Illustrative cross-stage chain (see spec examples). */
  exampleChain?: ChainLink[];

  /** Reserved; intentionally undefined (no speculative data). */
  intel?: SupplyChainIntel;
}

export const SUPPLY_STAGES: SupplyStage[] = [
  {
    slug: "raw-materials",
    name: "Raw materials",
    order: 1,
    segment: "inputs",
    tagline: "Silica sand, chemicals, and the elements chips are built from.",
    whatHappens:
      "The elemental inputs are sourced and refined into feedstock — high-purity silica reduced to metallurgical-grade silicon, plus the many process gases, chemicals, and rare materials the rest of the chain consumes.",
    participants: ["Mining & minerals suppliers", "Specialty chemical producers", "Materials companies"],
    technologies: ["Carbothermic reduction", "Purification chemistry"],
    equipment: ["Submerged-arc / electric-arc furnace"],
    materials: ["Silica (quartz) sand", "Carbon reductants", "Metallurgical-grade silicon"],
    companyTypes: ["materials", "chemicals", "silicon-wafers"],
    skills: ["Metallurgy", "Chemical engineering", "Materials science"],
    researchThemes: ["Lower-energy silicon reduction", "Feedstock purity & traceability"],
    relatedProcesses: ["raw-material", "silicon"],
    relatedConcepts: [{ label: "Silicon", slug: "silicon" }],
  },
  {
    slug: "silicon",
    name: "Silicon",
    order: 2,
    segment: "inputs",
    tagline: "Purifying to electronic-grade polysilicon.",
    whatHappens:
      "Metallurgical-grade silicon is refined to electronic-grade polysilicon — pure to better than nine nines — the base material from which single-crystal wafers are grown.",
    participants: ["Polysilicon producers", "Materials companies"],
    technologies: ["Siemens process", "Fluidized-bed reactors", "Distillation"],
    equipment: ["Siemens deposition reactors", "Distillation columns"],
    materials: ["Trichlorosilane", "Hydrogen", "Electronic-grade polysilicon"],
    companyTypes: ["silicon-wafers", "materials", "chemicals"],
    skills: ["Process chemistry", "Chemical engineering"],
    researchThemes: ["Fluidized-bed polysilicon", "Energy-efficient purification"],
    relatedProcesses: ["silicon", "ingot"],
    relatedConcepts: [{ label: "Intrinsic semiconductor", slug: "intrinsic-semiconductor" }],
  },
  {
    slug: "wafer-manufacturing",
    name: "Wafer manufacturing",
    order: 3,
    segment: "inputs",
    tagline: "Growing crystals and slicing polished wafers.",
    whatHappens:
      "Polysilicon is melted and pulled into a single-crystal ingot, which is sliced, lapped, and polished into the flat, defect-free wafers that every chip is built on.",
    participants: ["Silicon wafer manufacturers"],
    technologies: ["Czochralski crystal growth", "Slicing, lapping & polishing (CMP)"],
    equipment: ["Czochralski puller", "Wire saw", "CMP polisher"],
    materials: ["Polysilicon", "Quartz crucibles", "Polishing slurry"],
    companyTypes: ["silicon-wafers", "materials"],
    skills: ["Crystal growth", "Precision machining", "Metrology"],
    researchThemes: ["Larger-diameter wafers", "Edge-defect and warp reduction"],
    relatedProcesses: ["ingot", "wafer"],
    relatedConcepts: [{ label: "Wafer", slug: "wafer" }],
    relatedTools: ["die-per-wafer"],
  },
  {
    slug: "eda",
    name: "EDA",
    order: 4,
    segment: "design",
    tagline: "The software that makes chip design possible.",
    whatHappens:
      "Electronic-design-automation tools and IP let engineers describe, synthesize, place, route, and verify billions of transistors — no modern chip is designed without them.",
    participants: ["EDA vendors", "IP providers"],
    technologies: ["Logic synthesis", "Place & route", "Verification & simulation", "Silicon IP"],
    equipment: ["EDA software & high-performance compute"],
    materials: [],
    companyTypes: ["eda", "design-services"],
    skills: ["Software engineering", "Algorithms", "Computer architecture", "Applied math"],
    researchThemes: ["AI-driven design automation", "Cloud EDA"],
    relatedConcepts: [
      { label: "RTL", slug: "rtl" },
      { label: "Synthesis", slug: "synthesis" },
      { label: "Verification", slug: "verification" },
      { label: "Place & route", slug: "place-and-route" },
    ],
  },
  {
    slug: "chip-design",
    name: "Chip design",
    order: 5,
    segment: "design",
    tagline: "Architecture to tapeout.",
    whatHappens:
      "Fabless companies and IDM design teams turn a specification into a verified layout — architecture, RTL, logic, physical design, and signoff — ready to hand to a fab.",
    participants: ["Fabless companies", "IDMs (design)", "Design-service firms"],
    technologies: ["RTL / HDL design", "Analog & mixed-signal design", "Computer architecture", "Physical design"],
    equipment: ["EDA software & compute"],
    materials: [],
    companyTypes: ["fabless", "design-services", "idm"],
    skills: ["Digital & analog design", "HDL (Verilog/VHDL)", "Verification", "DSP"],
    researchThemes: ["Chiplet & 3D architectures", "Domain-specific accelerators", "Low-power design"],
    relatedConcepts: [
      { label: "Architecture", slug: "architecture" },
      { label: "RTL", slug: "rtl" },
      { label: "Logic", slug: "logic" },
      { label: "Physical design", slug: "physical-design" },
    ],
    relatedTools: ["power-density", "rc-time-constant", "power-dissipation", "ohms-law"],
  },
  {
    slug: "semiconductor-equipment",
    name: "Semiconductor equipment",
    order: 6,
    segment: "tooling",
    tagline: "The tools that build chips.",
    whatHappens:
      "Equipment makers supply the lithography, deposition, etch, implant, planarization, and metrology tools a fab needs. These are among the most complex machines ever built, and a handful of suppliers dominate each category.",
    participants: ["Equipment (tool) makers", "Component & subsystem suppliers"],
    technologies: ["Lithography (EUV/DUV)", "Deposition (CVD/PVD/ALD)", "Etch", "Metrology & inspection"],
    equipment: ["Precision manufacturing & assembly", "Tool calibration & metrology"],
    materials: ["Precision optics", "Vacuum / plasma subsystems", "Specialty components"],
    companyTypes: ["equipment"],
    skills: ["Precision optics", "Mechatronics", "Vacuum & plasma physics", "Control systems"],
    researchThemes: ["High-NA EUV", "Atomic-layer processing", "AI-based metrology"],
    relatedProcesses: ["lithography", "deposition", "etching", "metrology"],
    exampleChain: [
      { label: "Lithography (process)", href: "/manufacturing/lithography" },
      { label: "EUV scanner (equipment)" },
      { label: "Photoresist (materials)", href: "/manufacturing/photoresist" },
      { label: "Foundry (company)", href: "/supply-chain/fab" },
      { label: "Device (concept)", href: "/semiconductors/learn/integrated-circuit" },
    ],
  },
  {
    slug: "fab",
    name: "Fab",
    order: 7,
    segment: "front-end",
    tagline: "The cleanroom where chips are made.",
    whatHappens:
      "The fabrication plant integrates hundreds of process steps into a single, tightly-controlled cleanroom line. Foundries run this for others; IDMs run it for their own products. It is the most capital-intensive link in the chain.",
    participants: ["Foundries", "IDMs", "Process & equipment engineers"],
    technologies: ["Process integration", "Statistical process control", "Cleanroom manufacturing"],
    equipment: ["Integrated cleanroom line", "Automated material handling (AMHS)"],
    materials: ["Ultra-pure water", "Process gases", "Photoresist & specialty chemicals"],
    companyTypes: ["foundry", "idm"],
    skills: ["Process integration", "Semiconductor physics", "Statistics / SPC", "Cleanroom operations"],
    researchThemes: ["Advanced-node process integration", "Yield learning & analytics"],
    relatedProcesses: ["oxidation", "lithography", "etching", "interconnect"],
    relatedConcepts: [
      { label: "Integrated circuit", slug: "integrated-circuit" },
      { label: "CMOS", slug: "cmos" },
    ],
    relatedTools: ["die-per-wafer", "wafer-yield"],
  },
  {
    slug: "wafer-processing",
    name: "Wafer processing",
    order: 8,
    segment: "front-end",
    tagline: "The repeated cycle that builds each layer.",
    whatHappens:
      "Inside the fab, the wafer runs through the deposit → pattern → etch → dope → planarize cycle hundreds of times, layer by layer, to build the transistors and interconnect. Equipment and materials here are drawn from the individual process steps.",
    participants: ["Foundries", "IDMs", "Process engineers"],
    technologies: ["Photolithography", "Thin-film deposition", "Plasma etch", "Ion implantation", "Planarization (CMP)"],
    // equipment & materials derived from relatedProcesses (single source of truth).
    companyTypes: ["foundry", "idm", "equipment"],
    skills: ["Litho / etch / deposition process engineering", "Plasma physics", "Process chemistry"],
    researchThemes: ["Gate-all-around transistors", "Advanced patterning", "New interconnect metals"],
    relatedProcesses: [
      "oxidation", "deposition", "photoresist", "lithography", "etching", "doping", "cmp", "metrology", "interconnect",
    ],
    relatedTools: ["wafer-yield", "die-per-wafer"],
  },
  {
    slug: "packaging",
    name: "Packaging",
    order: 9,
    segment: "back-end",
    tagline: "Protecting and connecting the die.",
    whatHappens:
      "Finished wafers are diced into individual dies, which are mounted in packages that protect them, connect them electrically, and carry away heat — from simple wire-bond packages to advanced 2.5D/3D stacks and chiplets.",
    participants: ["OSAT providers", "IDMs (in-house)", "Substrate & materials suppliers"],
    technologies: ["Wire bonding", "Flip-chip", "Advanced packaging (2.5D/3D, chiplets)"],
    // equipment & materials derived from relatedProcesses.
    companyTypes: ["osat", "atmp", "packaging"],
    skills: ["Mechanical & thermal engineering", "Materials science", "Assembly process engineering"],
    researchThemes: ["Heterogeneous integration", "2.5D/3D stacking and HBM", "Panel-level packaging"],
    relatedProcesses: ["dicing", "packaging"],
    relatedConcepts: [
      { label: "Packaging", slug: "packaging" },
      { label: "Advanced packaging", slug: "advanced-packaging" },
    ],
    relatedTools: ["junction-temperature", "power-density"],
    exampleChain: [
      { label: "Packaging (process)", href: "/manufacturing/packaging" },
      { label: "Bonder / molding (equipment)" },
      { label: "Substrate & mold compound (materials)" },
      { label: "OSAT (company)", href: "/industry/companies/ase" },
      { label: "End application", href: "/supply-chain/end-markets" },
    ],
  },
  {
    slug: "testing",
    name: "Testing",
    order: 10,
    segment: "back-end",
    tagline: "Screening good chips from bad.",
    whatHappens:
      "Dies are tested on the wafer (wafer sort) and again after packaging (final test), often across voltage and temperature, so only chips that meet specification ship. Test data also feeds yield improvement.",
    participants: ["OSAT / test houses", "ATE & probe-card suppliers"],
    technologies: ["Wafer sort / probe", "Automated test (ATE)", "Burn-in", "Design-for-test (DFT)"],
    // equipment & materials derived from relatedProcesses.
    companyTypes: ["testing", "osat"],
    skills: ["Test engineering", "ATE programming", "Design-for-test", "Reliability engineering"],
    researchThemes: ["System-level test", "Adaptive / AI-driven test", "Burn-in reduction"],
    relatedProcesses: ["wafer-test", "final-test", "metrology"],
    relatedTools: ["wafer-yield"],
  },
  {
    slug: "electronics",
    name: "Electronics",
    order: 11,
    segment: "downstream",
    tagline: "Chips become boards and systems.",
    whatHappens:
      "Packaged chips are assembled with other components onto boards and into systems by OEMs, contract manufacturers, and distributors — the point where silicon turns into products.",
    participants: ["OEMs / ODMs", "Contract manufacturers (EMS)", "Distributors"],
    technologies: ["PCB assembly", "System integration", "Firmware / embedded software"],
    equipment: ["Pick-and-place / SMT lines", "Reflow ovens", "System test"],
    materials: ["Substrates / PCBs", "Passive components", "Assembly materials"],
    companyTypes: ["distributor"],
    skills: ["PCB & system design", "Firmware / embedded", "Manufacturing engineering"],
    researchThemes: ["Advanced thermal & power delivery", "Hardware/software co-design"],
    relatedConcepts: [
      { label: "Integrated circuit", slug: "integrated-circuit" },
      { label: "Packaging", slug: "packaging" },
    ],
  },
  {
    slug: "end-markets",
    name: "End markets",
    order: 12,
    segment: "downstream",
    tagline: "Where chips create value.",
    whatHappens:
      "Finished products reach the markets that drive demand back up the chain — computing and AI, mobile, automotive, industrial, and consumer — each with different volume, performance, and reliability needs.",
    participants: ["System & product companies", "Cloud & data-center operators", "Device & automakers"],
    technologies: ["Computing & AI", "Mobile", "Automotive", "Industrial", "Consumer"],
    equipment: [],
    materials: [],
    companyTypes: [],
    skills: ["Product & systems engineering", "Domain expertise (auto, mobile, AI, …)"],
    researchThemes: ["Edge AI", "Automotive electrification & ADAS", "Energy-efficient computing"],
    relatedConcepts: [{ label: "Integrated circuit", slug: "integrated-circuit" }],
  },
];

const BY_SLUG = new Map(SUPPLY_STAGES.map((s) => [s.slug, s]));

export function getStage(slug: string): SupplyStage | undefined {
  return BY_SLUG.get(slug);
}

export function stageNeighbors(slug: string): { prev?: SupplyStage; next?: SupplyStage } {
  const i = SUPPLY_STAGES.findIndex((s) => s.slug === slug);
  if (i === -1) return {};
  return {
    prev: i > 0 ? SUPPLY_STAGES[i - 1] : undefined,
    next: i < SUPPLY_STAGES.length - 1 ? SUPPLY_STAGES[i + 1] : undefined,
  };
}

export function flowBySegment(): { segment: Segment; stages: SupplyStage[] }[] {
  return SEGMENTS.map((segment) => ({
    segment,
    stages: SUPPLY_STAGES.filter((s) => s.segment === segment.id),
  }));
}

/** Equipment for a stage — explicit, else derived from linked processes. */
export function stageEquipment(stage: SupplyStage): string[] {
  if (stage.equipment) return stage.equipment;
  return dedupeFromProcesses(stage.relatedProcesses, (p) => p.equipment);
}

/** Materials for a stage — explicit, else derived from linked processes. */
export function stageMaterials(stage: SupplyStage): string[] {
  if (stage.materials) return stage.materials;
  return dedupeFromProcesses(stage.relatedProcesses, (p) => p.materials);
}

function dedupeFromProcesses(
  slugs: string[] | undefined,
  pick: (p: NonNullable<ReturnType<typeof getProcess>>) => string[],
): string[] {
  const set = new Set<string>();
  (slugs ?? []).forEach((slug) => {
    const proc = getProcess(slug);
    if (proc) pick(proc).forEach((item) => set.add(item));
  });
  return Array.from(set);
}
