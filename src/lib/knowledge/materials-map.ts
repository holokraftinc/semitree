/**
 * Semiconductor materials map — the guided hub at /semiconductors/materials.
 *
 * Answers "what materials are required to build a semiconductor?" by organising
 * material families along the manufacturing flow. Every material is framed in
 * the context of manufacturing (why it is used, where, and what it enables) —
 * NOT as a chemical encyclopedia. Each category REUSES existing process lessons
 * via `lessons` (→ /semiconductors/learn/<slug>) and links to the equipment that
 * works the material via `equipment` (→ /semiconductors/equipment/<slug>) rather
 * than duplicating them; families without their own lesson yet are `comingSoon`
 * (rendered as non-links, never fabricated). Every non-gap lesson slug must exist
 * in SEMI_LESSONS (enforced by materials-map.test.ts).
 */

/** A step in the beginner-facing "materials journey" flow. */
export interface MaterialJourneyStage {
  label: string;
  /** The material category this stage maps to (anchors to its card). */
  categoryId?: string;
}

export const MATERIALS_JOURNEY: MaterialJourneyStage[] = [
  { label: "Wafer", categoryId: "wafers-substrates" },
  { label: "Films", categoryId: "deposition-materials" },
  { label: "Patterning materials", categoryId: "photoresists" },
  { label: "Etch chemistry", categoryId: "etch-chemistry" },
  { label: "Conductors", categoryId: "conductors" },
  { label: "Dielectrics", categoryId: "dielectrics" },
  { label: "Doping materials", categoryId: "dopant-materials" },
  { label: "CMP materials", categoryId: "cmp-materials" },
  { label: "Packaging materials", categoryId: "packaging-materials" },
];

/** A link to a dedicated equipment topic page. */
export interface MaterialEquipmentRef {
  /** /semiconductors/equipment/<slug>. */
  slug: string;
  label: string;
}

/** A material family: what it is, where it is used, why it matters. */
export interface MaterialCategory {
  id: string;
  title: string;
  /** What this material is / does. */
  what: string;
  /** Where it is used in the process. */
  where: string;
  /** Why it matters. */
  why: string;
  /** Reuse existing process lessons: /semiconductors/learn/<slug>. */
  lessons: string[];
  /** The equipment that works this material: /semiconductors/equipment/<slug>. */
  equipment?: MaterialEquipmentRef[];
  /** Dedicated material topic page(s): /semiconductors/materials/<slug>. */
  topics?: { slug: string; label?: string }[];
  /** No dedicated lesson yet — render as "Coming soon", not a link. */
  comingSoon?: boolean;
}

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: "semiconductor-materials",
    title: "Semiconductor materials",
    what: "The base semiconducting material a device is built from — most often silicon, sometimes a compound such as gallium arsenide or silicon carbide.",
    where: "The foundation of the whole device — everything else is added on top.",
    why: "Its properties (how it conducts, its crystal quality, its purity) set the ceiling for device performance; this is the material that can be 'switched'.",
    lessons: ["silicon"],
    topics: [{ slug: "silicon" }],
  },
  {
    id: "wafers-substrates",
    title: "Wafers & substrates",
    what: "The polished single-crystal slice that devices are built on, grown from a large crystal (ingot) and cut into wafers.",
    where: "The very start — the physical platform for every later step.",
    why: "Flatness, purity, and crystal perfection set the floor for everything after; defects here propagate into every device.",
    lessons: ["ingot", "wafer", "substrate"],
    topics: [
      { slug: "silicon-wafers", label: "Silicon wafers" },
      { slug: "soi", label: "SOI" },
    ],
  },
  {
    id: "photoresists",
    title: "Photoresists",
    what: "Light-sensitive films that record the circuit pattern when exposed, so it can be developed and transferred into the wafer.",
    where: "At the start of every patterned layer, in lithography.",
    why: "The resist's sensitivity and resolution help set the smallest feature that can be printed; it is the recording medium for the pattern.",
    lessons: ["photoresist"],
    equipment: [{ slug: "lithography", label: "Lithography" }],
  },
  {
    id: "dielectrics",
    title: "Dielectrics",
    what: "Insulating materials — grown oxides and deposited dielectrics — that separate conductors and form gate insulators.",
    where: "Throughout the stack: gate insulators, and insulation between wiring layers.",
    why: "They stop current where it should not flow; the thinnest (gate) dielectrics must be controlled to within a few atoms, and their quality sets leakage and reliability.",
    lessons: ["oxidation"],
    equipment: [
      { slug: "deposition", label: "Deposition" },
      { slug: "thermal", label: "Thermal processing" },
    ],
    topics: [
      { slug: "silicon-dioxide", label: "Silicon dioxide" },
      { slug: "silicon-nitride", label: "Silicon nitride" },
      { slug: "high-k-dielectrics", label: "High-k dielectrics" },
      { slug: "low-k-dielectrics", label: "Low-k dielectrics" },
    ],
  },
  {
    id: "conductors",
    title: "Conductors",
    what: "The metals that carry signals and power — the interconnect wiring, contacts, and barrier/liner layers.",
    where: "The wiring stack that connects millions of devices, built up layer by layer.",
    why: "Their resistance and reliability set how fast and how reliably signals move; interconnect increasingly limits chip performance.",
    lessons: ["metallization"],
    equipment: [
      { slug: "deposition", label: "Deposition" },
      { slug: "cmp", label: "CMP" },
    ],
    topics: [
      { slug: "copper", label: "Copper" },
      { slug: "aluminum", label: "Aluminum" },
      { slug: "tungsten", label: "Tungsten" },
    ],
  },
  {
    id: "deposition-materials",
    title: "Deposition materials",
    what: "The source materials for thin films — sputter targets and gas-phase precursors used by PVD, CVD, and ALD.",
    where: "Wherever a new film layer is added — many times across the flow.",
    why: "Precursor and target purity and chemistry determine film quality, composition, and defectivity — and thus device behaviour.",
    lessons: ["deposition"],
    equipment: [{ slug: "deposition", label: "Deposition" }],
  },
  {
    id: "dopant-materials",
    title: "Dopant materials",
    what: "The dopant species introduced into silicon to change how regions conduct (for example boron, phosphorus, arsenic).",
    where: "To form transistor source/drain regions, wells, and threshold adjustments.",
    why: "Doping is what turns plain silicon into a device; the dopant, dose, and depth set transistor behaviour.",
    lessons: ["ion-implantation"],
    equipment: [
      { slug: "ion-implantation", label: "Ion implantation" },
      { slug: "thermal", label: "Thermal processing" },
    ],
  },
  {
    id: "etch-chemistry",
    title: "Etch chemistry",
    what: "The liquid chemicals and reactive process gases that remove material selectively during etch.",
    where: "After lithography, on nearly every patterned layer.",
    why: "The chemistry sets selectivity and profile — how cleanly the pattern becomes real 3D structure without harming other layers.",
    lessons: ["etching"],
    equipment: [{ slug: "etching", label: "Etching" }],
  },
  {
    id: "cmp-materials",
    title: "CMP materials",
    what: "The polishing slurries (chemistry plus fine abrasives) and pads used to planarize the wafer between layers.",
    where: "Between build-up layers, especially across the interconnect stack.",
    why: "Slurry and pad behaviour set removal rate, selectivity, and planarity — and are a real source of defects if not controlled.",
    lessons: ["cmp"],
    equipment: [{ slug: "cmp", label: "CMP" }],
  },
  {
    id: "packaging-materials",
    title: "Packaging materials",
    what: "The substrates, solder and bonding materials, molding compounds, and thermal materials that assemble and protect the die.",
    where: "The back end — connecting the die to the system and sealing it into a package.",
    why: "They carry the die's signals, heat, and mechanical protection; in advanced packaging they increasingly set system performance.",
    lessons: ["packaging", "substrate", "electrical-connections"],
    equipment: [
      { slug: "die-attach", label: "Die attach" },
      { slug: "advanced-packaging", label: "Advanced packaging" },
    ],
  },
  {
    id: "cleanroom-materials",
    title: "Cleanroom materials",
    what: "The ultra-pure water, process gases, chemicals, and consumables that keep the fab environment and every step clean.",
    where: "Everywhere — supporting essentially every process step.",
    why: "A single stray particle or trace contaminant can kill a device, so purity and cleanliness are central to yield.",
    lessons: [],
    comingSoon: true,
  },
  {
    id: "emerging-materials",
    title: "Emerging materials",
    what: "New materials under research — for example high-mobility channels, 2D materials, and new dielectrics and interconnect metals.",
    where: "At the leading edge, as scaling of conventional materials runs into limits.",
    why: "New materials are one of the main ways device performance can keep improving as classical scaling slows.",
    lessons: [],
    comingSoon: true,
  },
];

export function getMaterialCategory(id: string): MaterialCategory | undefined {
  return MATERIAL_CATEGORIES.find((c) => c.id === id);
}
