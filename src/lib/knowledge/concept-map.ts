/**
 * Semiconductor Concepts map — the guided landing at /semiconductors/concepts.
 *
 * A learner-facing map of the ideas behind semiconductors, grouped into
 * clusters. Topics REUSE existing lessons via `lessonSlug`
 * (→ /semiconductors/learn/<slug>); genuine gaps are marked `comingSoon` and
 * render as non-links (no fabricated pages, no fake progress). Every non-gap
 * `lessonSlug` must exist in SEMI_LESSONS (enforced by concept-map.test.ts).
 */

export interface ConceptTopic {
  label: string;
  /** Reuse an existing lesson: resolves to /semiconductors/learn/<slug>. */
  lessonSlug?: string;
  /** Genuine gap — no page yet; rendered as "Coming soon", never a link. */
  comingSoon?: boolean;
}

export interface ConceptCluster {
  id: string;
  title: string;
  /** What the learner will understand after this cluster. */
  understand: string;
  /** Who it is for. */
  audience: string;
  topics: ConceptTopic[];
}

/** The single entry point for newcomers. */
export const START_HERE = {
  label: "What is a semiconductor?",
  lessonSlug: "what-is-a-semiconductor",
};

export const CONCEPT_CLUSTERS: ConceptCluster[] = [
  {
    id: "foundations",
    title: "Foundations",
    understand:
      "What a semiconductor actually is, and the physics of charge, energy bands and doping that everything else rests on.",
    audience: "Complete beginners — the ground truth before devices.",
    topics: [
      { label: "What is a semiconductor?", lessonSlug: "what-is-a-semiconductor" },
      { label: "Conductor vs semiconductor", lessonSlug: "conductors-vs-semiconductors" },
      { label: "Energy bands", lessonSlug: "energy-bands" },
      { label: "Band gap", lessonSlug: "bandgap" },
      { label: "Intrinsic semiconductor", lessonSlug: "intrinsic-semiconductor" },
      { label: "Doping", lessonSlug: "doping" },
      { label: "n-type", lessonSlug: "n-type" },
      { label: "p-type", lessonSlug: "p-type" },
      { label: "Charge carriers & mobility", comingSoon: true },
      { label: "Drift & diffusion", comingSoon: true },
    ],
  },
  {
    id: "devices",
    title: "Devices",
    understand:
      "How junctions and transistors switch and amplify — the building blocks inside every chip.",
    audience: "Students and engineers moving from physics to real devices.",
    topics: [
      { label: "PN junction", lessonSlug: "pn-junction" },
      { label: "Diode", lessonSlug: "diode" },
      { label: "MOSFET", lessonSlug: "mosfet" },
      { label: "CMOS", lessonSlug: "cmos" },
      { label: "Integrated circuit", lessonSlug: "integrated-circuit" },
      { label: "BJT", comingSoon: true },
      { label: "Threshold voltage", comingSoon: true },
    ],
  },
  {
    id: "logic",
    title: "Logic",
    understand:
      "How transistors combine into logic gates, digital circuits and ultimately processors.",
    audience: "Anyone connecting devices to the digital world.",
    topics: [
      { label: "Logic (gates & functions)", lessonSlug: "logic" },
      { label: "Integrated circuit", lessonSlug: "integrated-circuit" },
      { label: "Logic gates", comingSoon: true },
      { label: "Boolean logic", comingSoon: true },
      { label: "Combinational & sequential logic", comingSoon: true },
      { label: "Flip-flops & registers", comingSoon: true },
    ],
  },
  {
    id: "memory",
    title: "Memory",
    understand:
      "The main memory technologies and how they trade off speed, density and cost.",
    audience: "Anyone curious how chips store data.",
    topics: [
      { label: "SRAM", comingSoon: true },
      { label: "DRAM", comingSoon: true },
      { label: "NAND flash", comingSoon: true },
      { label: "Emerging memory", comingSoon: true },
    ],
  },
  {
    id: "advanced",
    title: "Advanced",
    understand:
      "Why chips keep getting denser — and the scaling limits and engineering realities that come with it.",
    audience: "Engineers and researchers going deeper.",
    topics: [
      { label: "Chiplets", lessonSlug: "chiplets" },
      { label: "Moore's Law", comingSoon: true },
      { label: "FinFET", comingSoon: true },
      { label: "Gate-all-around (GAA)", comingSoon: true },
      { label: "Interconnects & RC delay", comingSoon: true },
      { label: "Leakage, yield & reliability", comingSoon: true },
    ],
  },
];
