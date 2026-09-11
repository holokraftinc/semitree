/**
 * Semiconductor packaging — the guided "after fabrication" experience.
 *
 * SOURCE OF TRUTH for the /semiconductors/packaging landing. Reuses existing
 * lessons via `lessons` (→ /semiconductors/learn/<slug>) rather than
 * duplicating content; jargon is defined up front so terms are explained before
 * they are relied on. Every slug in `lessons` must exist in SEMI_LESSONS
 * (enforced by packaging-flow.test.ts). Adding an entry here adds it to the page.
 */

/** A term defined before the guided path relies on it. */
export interface PackagingTerm {
  term: string;
  definition: string;
}

export const PACKAGING_TERMS: PackagingTerm[] = [
  { term: "Die", definition: "A single chip cut from the wafer — the bare piece of silicon carrying the circuit." },
  { term: "Package", definition: "The protective, connectable housing that turns a fragile die into a usable component." },
  { term: "Substrate", definition: "The carrier the die sits on inside the package; it fans the die's tiny connections out to larger board-level pins or balls." },
  { term: "Bump", definition: "A tiny solder ball on the face of a die used to connect it directly to a substrate (flip-chip), instead of using wires." },
  { term: "Interposer", definition: "A thin intermediate layer (often silicon) between dies and the substrate, carrying very dense wiring to link dies placed side by side (2.5D)." },
  { term: "TSV (through-silicon via)", definition: "A vertical electrical connection etched straight through a die, letting dies be stacked and connected top-to-bottom (3D)." },
  { term: "Chiplet", definition: "A smaller die that handles one part of a system; several chiplets are combined in one package instead of building one large chip." },
  { term: "Fan-out", definition: "A wafer-level technique that spreads connections beyond the die's edge without a separate substrate, for thinner, higher-density packages." },
  { term: "Hybrid bonding", definition: "A fine-pitch, direct copper-to-copper bond that joins dies without solder bumps, enabling very dense 3D stacking." },
];

export interface PackagingLink {
  label: string;
  href: string;
}

/** A step in the linear "what happens after fabrication" flow (Part 1). */
export interface PostFabStep {
  slug: string;
  order: number;
  title: string;
  description: string;
  lessons: string[];
}

export const POST_FAB_FLOW: PostFabStep[] = [
  {
    slug: "wafer",
    order: 1,
    title: "Wafer",
    description:
      "Fabrication ends with a finished wafer holding many identical dies — not yet usable chips.",
    lessons: ["wafer"],
  },
  {
    slug: "die",
    order: 2,
    title: "Die",
    description: "Each individual chip on the wafer is a “die” — a bare, fragile piece of silicon.",
    lessons: [],
  },
  {
    slug: "die-preparation",
    order: 3,
    title: "Die preparation",
    description:
      "The wafer is thinned and sawn into individual dies; wafer-test data marks which dies are good (known-good die).",
    lessons: ["dicing", "wafer-test"],
  },
  {
    slug: "interconnection",
    order: 4,
    title: "Interconnection",
    description:
      "Each die's pads are connected to the package — by wire bonding (thin wires) or flip-chip (the die flipped onto solder bumps).",
    lessons: ["wire-bonding", "flip-chip"],
  },
  {
    slug: "package-assembly",
    order: 5,
    title: "Package assembly",
    description:
      "The die is attached to a leadframe or substrate that routes its connections out to board-level pins or balls.",
    lessons: ["traditional-packaging", "packaging"],
  },
  {
    slug: "encapsulation",
    order: 6,
    title: "Encapsulation",
    description:
      "The assembly is sealed with a moulded compound or lid, protecting it mechanically and from moisture.",
    lessons: ["packaging"],
  },
  {
    slug: "testing",
    order: 7,
    title: "Testing",
    description:
      "The packaged part is tested for function, speed, and reliability (final test), then binned or discarded.",
    lessons: ["final-test"],
  },
  {
    slug: "finished-component",
    order: 8,
    title: "Finished component",
    description: "The result is a packaged chip ready to be soldered onto a circuit board.",
    lessons: [],
  },
];

/** A rung on the simple → advanced packaging ladder (Part 2). */
export interface PackagingApproach {
  slug: string;
  order: number;
  title: string;
  what: string;
  why: string;
  how: string;
  tradeoffs: string;
  whereUsed: string;
  lessons: string[];
  links?: PackagingLink[];
}

export const PACKAGING_LADDER: PackagingApproach[] = [
  {
    slug: "traditional",
    order: 1,
    title: "Traditional (wire-bond) packaging",
    what: "The die is attached to a leadframe or substrate, connected with thin bond wires, and encapsulated (packages such as QFN, QFP, BGA).",
    why: "Cheap, mature, and reliable — it covers the vast majority of chips made today.",
    how: "Die attach → wire bonding → moulding → lead or solder-ball formation.",
    tradeoffs: "Wires add inductance and limit how many connections and how much speed are possible.",
    whereUsed: "Microcontrollers, power devices, and most consumer and industrial ICs.",
    lessons: ["traditional-packaging", "wire-bonding"],
  },
  {
    slug: "flip-chip",
    order: 2,
    title: "Flip-chip",
    what: "The die is flipped face-down and connected directly to the substrate through solder bumps, with underfill added for strength.",
    why: "Far more connections and much shorter electrical paths than wires — better speed and power delivery.",
    how: "Bumps are grown on the die, which is flipped and reflow-soldered to the substrate, then underfilled.",
    tradeoffs: "Costlier; thermal and mechanical stress at the bumps must be managed; the substrate is more complex.",
    whereUsed: "CPUs, GPUs, and other high-performance, high-pin-count chips.",
    lessons: ["flip-chip"],
  },
  {
    slug: "wafer-level",
    order: 3,
    title: "Wafer-level & fan-out packaging",
    what: "The package is built while dies are still on (or reconstituted on) a wafer; fan-out spreads connections beyond the die edge without a separate substrate.",
    why: "Thinner, smaller, higher-density packages — and it can remove the substrate cost.",
    how: "Redistribution layers are formed over the die; fan-out re-embeds dies in moulding and routes connections outward.",
    tradeoffs: "Warpage and yield are harder to control, and density is limited by the redistribution layers.",
    whereUsed: "Mobile processors, RF front-ends, and space-constrained devices.",
    lessons: [],
    links: [{ label: "Advanced packaging", href: "/semiconductors/learn/advanced-packaging" }],
  },
  {
    slug: "2-5d",
    order: 4,
    title: "2.5D integration",
    what: "Multiple dies are placed side by side on a shared silicon interposer that carries very dense wiring between them.",
    why: "Connects a large logic die to high-bandwidth memory (HBM) with far more bandwidth than a normal substrate allows.",
    how: "Dies are flip-chipped onto an interposer (with TSVs) that in turn sits on the package substrate.",
    tradeoffs: "The interposer is expensive and the package is large; dies still sit in a plane (no vertical logic stacking).",
    whereUsed: "GPUs and AI accelerators paired with HBM, and high-end networking chips.",
    lessons: ["2-5d", "hbm"],
  },
  {
    slug: "chiplets",
    order: 5,
    title: "Chiplets",
    what: "A system is split into several smaller dies (chiplets), each possibly on a different process node, combined in one package.",
    why: "Better yield and cost than one huge die, the freedom to mix nodes, and reuse of proven blocks.",
    how: "Chiplets are connected through an advanced substrate, a 2.5D interposer, or 3D stacking, using standard die-to-die interfaces.",
    tradeoffs: "Die-to-die links add latency and power; interface standards and known-good-die testing add complexity.",
    whereUsed: "Modern CPUs and AI accelerators.",
    lessons: ["chiplets"],
  },
  {
    slug: "3d",
    order: 6,
    title: "3D integration",
    what: "Dies are stacked vertically and connected top-to-bottom with through-silicon vias (TSVs) or hybrid bonding.",
    why: "The shortest possible connections and the highest density — for example, stacking memory directly on logic.",
    how: "TSVs are etched through the dies and the stack is bonded, increasingly with hybrid bonding rather than microbumps.",
    tradeoffs: "Heat is trapped inside the stack (a serious thermal challenge), and the process is complex and costly.",
    whereUsed: "HBM stacks, stacked cache-on-logic, and leading-edge processors.",
    lessons: ["3d-ic"],
  },
  {
    slug: "heterogeneous",
    order: 7,
    title: "Heterogeneous integration",
    what: "Different kinds of dies — logic, memory, analog/RF, even optics — often from different nodes or vendors, are combined into one package as a system.",
    why: "No single process is best at everything, so the best building blocks are integrated together.",
    how: "It uses the whole toolbox above — flip-chip, 2.5D interposers, chiplets, 3D stacking, hybrid bonding — as needed.",
    tradeoffs: "System-level thermal, power-delivery, interface, and supply-chain complexity all rise.",
    whereUsed: "Leading-edge AI/data-center parts and advanced mobile SoCs.",
    lessons: ["advanced-packaging"],
    links: [{ label: "Chiplets", href: "/semiconductors/learn/chiplets" }],
  },
];
