/**
 * Semiconductor equipment map — the guided hub at /semiconductors/equipment.
 *
 * Teaches "what machines turn wafers into devices" by organising equipment along
 * the manufacturing flow. Each category REUSES the existing process lesson(s)
 * via `lessons` (→ /semiconductors/learn/<slug>) rather than duplicating them;
 * categories without meaningful content yet are `comingSoon` (rendered as
 * non-links, never fabricated). Every non-gap lesson slug must exist in
 * SEMI_LESSONS (enforced by equipment-map.test.ts). It is deliberately NOT a
 * list of equipment manufacturers.
 */

/** A step in the beginner-facing "wafer's journey" flow. */
export interface JourneyStage {
  label: string;
  /** The equipment category this stage maps to (anchors to its card). */
  categoryId?: string;
  /** A dedicated equipment topic page this stage links to. */
  topicSlug?: string;
}

export const EQUIPMENT_JOURNEY: JourneyStage[] = [
  { label: "Wafer", categoryId: "wafer-manufacturing" },
  { label: "Clean", categoryId: "cleaning" },
  { label: "Coat", categoryId: "lithography" },
  { label: "Expose", categoryId: "lithography" },
  { label: "Develop", categoryId: "lithography" },
  { label: "Deposit", categoryId: "deposition" },
  { label: "Etch", categoryId: "etching" },
  { label: "Dope", categoryId: "doping" },
  { label: "Anneal", categoryId: "thermal" },
  { label: "CMP", categoryId: "cmp" },
  { label: "Inspect", categoryId: "metrology-inspection" },
  { label: "Measure", categoryId: "metrology-inspection" },
  { label: "Repeat" },
  { label: "Package", categoryId: "packaging" },
  { label: "Test", categoryId: "testing" },
];

/**
 * The back-end (assembly, packaging and test) journey — the "second equipment
 * ecosystem" after wafer fabrication. Stages link to dedicated equipment topic
 * pages where one exists. Exact sequences differ by package technology.
 */
export const PACKAGING_JOURNEY: JourneyStage[] = [
  { label: "Die" },
  { label: "Attach", topicSlug: "die-attach" },
  { label: "Interconnect", topicSlug: "wire-bonding" },
  { label: "Encapsulate", topicSlug: "molding" },
  { label: "Singulate", topicSlug: "singulation" },
  { label: "Inspect", topicSlug: "packaging-inspection" },
  { label: "Test", topicSlug: "semiconductor-test" },
  { label: "Ship" },
];

/** A dedicated equipment topic page linked from a category card. */
export interface EquipmentTopicRef {
  /** /semiconductors/equipment/<slug>. */
  slug: string;
  /** Optional label; when a category has several topics, give each a name. */
  label?: string;
}

/** An equipment category: what the machine does, where it fits, why it matters. */
export interface EquipmentCategory {
  id: string;
  title: string;
  /** What this machine does. */
  what: string;
  /** Where it fits in the process. */
  where: string;
  /** Why it matters. */
  why: string;
  /** Reuse existing process lessons: /semiconductors/learn/<slug>. */
  lessons: string[];
  /** Dedicated equipment topic page(s): /semiconductors/equipment/<slug>. */
  topics?: EquipmentTopicRef[];
  /** No meaningful content yet — render as "Coming soon", not a link. */
  comingSoon?: boolean;
}

export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  {
    id: "wafer-manufacturing",
    title: "Wafer manufacturing",
    what: "Grows a large silicon crystal (ingot), slices it into thin wafers, and polishes them mirror-flat.",
    where: "The very start — before any devices are built.",
    why: "Every chip begins on a wafer; its flatness and purity set the floor for everything after.",
    lessons: ["ingot", "wafer"],
  },
  {
    id: "cleaning",
    title: "Cleaning",
    what: "Removes particles, residues, and contamination from the wafer between steps.",
    where: "Repeatedly — before and after most process steps.",
    why: "A single stray particle can kill a device, so cleanliness is central to yield.",
    lessons: [],
    comingSoon: true,
  },
  {
    id: "lithography",
    title: "Lithography",
    what: "Coats the wafer with light-sensitive resist, projects the circuit pattern onto it, and develops the image.",
    where: "At the start of every patterned layer.",
    why: "It defines the smallest features on the chip — the pacing item for scaling.",
    lessons: ["lithography", "photoresist"],
    topics: [{ slug: "lithography" }],
  },
  {
    id: "deposition",
    title: "Deposition",
    what: "Adds thin films of conductors, insulators, or semiconductors onto the wafer (PVD, CVD, ALD, epitaxy).",
    where: "Whenever a new material layer is needed.",
    why: "Chips are built layer by layer; deposition lays each one down with near-atomic control.",
    lessons: ["deposition"],
    topics: [{ slug: "deposition" }],
  },
  {
    id: "etching",
    title: "Etching",
    what: "Selectively removes material to carve the patterned features (wet, or dry/plasma etch).",
    where: "After lithography has defined where to remove material.",
    why: "It turns a flat resist pattern into real 3D structures; profile control sets device quality.",
    lessons: ["etching"],
    topics: [{ slug: "etching" }],
  },
  {
    id: "doping",
    title: "Doping / ion implantation",
    what: "Introduces dopant atoms to change how regions of silicon conduct (implantation, diffusion).",
    where: "To form transistor source/drain regions, wells, and junctions.",
    why: "Doping is what makes silicon into a device; dose and depth set transistor behaviour.",
    lessons: ["ion-implantation"],
    topics: [{ slug: "ion-implantation" }],
  },
  {
    id: "thermal",
    title: "Thermal processing",
    what: "Heats the wafer to grow oxides, activate dopants, and repair the crystal (furnaces, rapid thermal processing).",
    where: "At oxide-growth steps and after doping.",
    why: "Precise temperature and time set film and junction properties and heal implant damage.",
    lessons: ["oxidation"],
    topics: [{ slug: "thermal" }],
  },
  {
    id: "cmp",
    title: "CMP (planarization)",
    what: "Chemically and mechanically polishes the wafer flat between layers (slurry + pad).",
    where: "Between build-up layers, especially across the interconnect stack.",
    why: "Each new layer needs a flat surface; poor planarity ruins lithography and yield.",
    lessons: ["cmp"],
    topics: [{ slug: "cmp" }],
  },
  {
    id: "metrology-inspection",
    title: "Metrology & inspection",
    what: "Measures critical dimensions, overlay, and film thickness, and inspects for defects.",
    where: "Throughout the flow, after key steps.",
    why: "You can't control what you can't measure — metrology and inspection drive yield learning.",
    lessons: ["metrology"],
    topics: [
      { slug: "metrology", label: "Metrology" },
      { slug: "inspection", label: "Inspection" },
    ],
  },
  {
    id: "wafer-handling",
    title: "Wafer handling",
    what: "Moves and stores wafers automatically between tools in sealed pods.",
    where: "Everywhere — it connects every process tool.",
    why: "Automation keeps wafers clean and traceable across hundreds of steps.",
    lessons: [],
    comingSoon: true,
  },
  {
    id: "packaging",
    title: "Packaging & assembly",
    what: "Dices wafers into dies, attaches and connects them, and seals them into packages.",
    where: "The back end, after the wafer is finished.",
    why: "Packaging connects the die to the system and increasingly sets performance.",
    lessons: ["dicing", "packaging", "wire-bonding", "flip-chip"],
    topics: [
      { slug: "die-attach", label: "Die attach" },
      { slug: "wire-bonding", label: "Wire bonding" },
      { slug: "flip-chip", label: "Flip-chip" },
      { slug: "molding", label: "Molding" },
      { slug: "singulation", label: "Singulation" },
      { slug: "wafer-level-packaging", label: "Wafer-level packaging" },
      { slug: "advanced-bonding", label: "Advanced bonding" },
      { slug: "packaging-inspection", label: "Packaging inspection" },
      { slug: "advanced-packaging", label: "Advanced packaging" },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    what: "Electrically tests dies on the wafer and packaged parts, then bins good from bad.",
    where: "After patterning (wafer test) and after packaging (final test).",
    why: "Only known-good chips ship, and test data feeds yield and reliability learning.",
    lessons: ["wafer-test", "final-test"],
    topics: [
      { slug: "wafer-probing", label: "Wafer probing" },
      { slug: "semiconductor-test", label: "Test (ATE)" },
      { slug: "burn-in", label: "Burn-in & reliability" },
    ],
  },
];

export function getEquipmentCategory(id: string): EquipmentCategory | undefined {
  return EQUIPMENT_CATEGORIES.find((c) => c.id === id);
}
