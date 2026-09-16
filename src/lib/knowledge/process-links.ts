/**
 * Process links — the connective tissue that ties a manufacturing PROCESS to
 * the EQUIPMENT that performs it, the MATERIALS it consumes, the CONTROL /
 * METROLOGY that measures it, and the yield it AFFECTS. This is the data behind
 * the relationship Semitree teaches:
 *
 *   PROCESS + EQUIPMENT + MATERIAL + CONTROL + METROLOGY = MANUFACTURING RESULT
 *
 * It is a plain data module (no backend, no graph database) that only records
 * technically meaningful relationships between entities that already exist in
 * the project. Every slug is validated in process-links.test.ts:
 *   - manufacturingSlug  -> MFG_PROCESSES  (/manufacturing/<slug>)
 *   - conceptLesson      -> SEMI_LESSONS   (/semiconductors/learn/<slug>)
 *   - equipment/metrology-> EQUIPMENT_TOPICS (/semiconductors/equipment/<slug>)
 *   - materials          -> MATERIAL_TOPICS  (/semiconductors/materials/<slug>)
 */

export interface LinkRef {
  slug: string;
  label: string;
}

export interface ProcessLink {
  /** Stable key for the process. */
  key: string;
  /** Display name of the process. */
  process: string;
  /** The manufacturing process page (/manufacturing/<slug>), if one exists. */
  manufacturingSlug?: string;
  /** A concept lesson that explains the idea (/semiconductors/learn/<slug>). */
  conceptLesson?: string;
  /** Equipment that performs the process. */
  equipment: LinkRef[];
  /** Materials the process requires. */
  materials: LinkRef[];
  /** How the result is measured (metrology / inspection / test equipment). */
  metrology: LinkRef[];
  /** What varying the result affects (yield / performance / reliability). */
  affects: string;
  /** Whether to surface the supply-chain link (for ecosystem-level topics). */
  supplyChain?: boolean;
  /** The natural next process to learn. */
  next?: { label: string; href: string };
}

export const PROCESS_LINKS: ProcessLink[] = [
  {
    key: "lithography",
    process: "Lithography",
    manufacturingSlug: "lithography",
    conceptLesson: "integrated-circuit",
    equipment: [{ slug: "lithography", label: "Lithography" }],
    materials: [
      { slug: "photoresist", label: "Photoresist" },
      { slug: "developers", label: "Developers" },
    ],
    metrology: [
      { slug: "metrology", label: "Metrology" },
      { slug: "inspection", label: "Inspection" },
    ],
    affects:
      "Critical-dimension (CD) and overlay errors cause opens, shorts, and misalignment — a direct, systematic hit to yield.",
    next: { label: "Etching", href: "/semiconductors/equipment/etching" },
  },
  {
    key: "deposition",
    process: "Deposition",
    manufacturingSlug: "deposition",
    conceptLesson: "integrated-circuit",
    equipment: [{ slug: "deposition", label: "Deposition" }],
    materials: [
      { slug: "deposition-precursors", label: "Deposition precursors" },
      { slug: "process-gases", label: "Process gases" },
    ],
    metrology: [{ slug: "metrology", label: "Metrology" }],
    affects:
      "Film thickness, uniformity, and defectivity set device behaviour; a systematic error can shift every die on the wafer.",
    next: { label: "Lithography", href: "/semiconductors/equipment/lithography" },
  },
  {
    key: "etching",
    process: "Etching",
    manufacturingSlug: "etching",
    conceptLesson: "mosfet",
    equipment: [{ slug: "etching", label: "Etching" }],
    materials: [
      { slug: "etch-chemistry", label: "Etch chemistry" },
      { slug: "photoresist", label: "Photoresist" },
    ],
    metrology: [
      { slug: "metrology", label: "Metrology" },
      { slug: "inspection", label: "Inspection" },
    ],
    affects:
      "Profile and selectivity errors distort the real device geometry, degrading performance and yield.",
    next: { label: "Deposition", href: "/semiconductors/equipment/deposition" },
  },
  {
    key: "cmp",
    process: "CMP (planarization)",
    manufacturingSlug: "cmp",
    conceptLesson: "integrated-circuit",
    equipment: [{ slug: "cmp", label: "CMP" }],
    materials: [
      { slug: "cmp-slurries", label: "CMP slurries" },
      { slug: "cmp-pads", label: "CMP pads" },
    ],
    metrology: [
      { slug: "metrology", label: "Metrology" },
      { slug: "inspection", label: "Inspection" },
    ],
    affects:
      "Scratches, dishing, and residue create defects and lithography problems on the layers built above.",
    next: { label: "Lithography", href: "/semiconductors/equipment/lithography" },
  },
  {
    key: "advanced-packaging",
    process: "Advanced packaging",
    manufacturingSlug: "packaging",
    equipment: [
      { slug: "advanced-packaging", label: "Advanced packaging" },
      { slug: "advanced-bonding", label: "Advanced bonding" },
      { slug: "die-attach", label: "Die attach" },
    ],
    materials: [
      { slug: "package-substrates", label: "Package substrates" },
      { slug: "bonding-materials", label: "Bonding materials" },
      { slug: "thermal-interface-materials", label: "Thermal interface materials" },
    ],
    metrology: [
      { slug: "packaging-inspection", label: "Packaging inspection" },
      { slug: "semiconductor-test", label: "Test (ATE)" },
    ],
    affects:
      "Bond, joint, and thermal-path defects hit package reliability and yield — and in multi-die packages, one bad die can fail the whole part.",
    supplyChain: true,
    next: { label: "Test (ATE)", href: "/semiconductors/equipment/semiconductor-test" },
  },
];

/** The process link that an equipment topic participates in (as performer or metrology). */
export function getProcessLinkForEquipment(slug: string): ProcessLink | undefined {
  return PROCESS_LINKS.find(
    (l) =>
      l.equipment.some((e) => e.slug === slug) ||
      l.metrology.some((m) => m.slug === slug),
  );
}

/** The process link that a material topic participates in (as a required material). */
export function getProcessLinkForMaterial(slug: string): ProcessLink | undefined {
  return PROCESS_LINKS.find((l) => l.materials.some((m) => m.slug === slug));
}
