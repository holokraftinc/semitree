/**
 * Semiconductor Testing — landing-hub information architecture (Phase 2).
 *
 * This is the data behind /semiconductors/testing: a conceptual journey, three
 * discovery pathways, and eight topic groups. It follows the equipment-map /
 * materials-map convention.
 *
 * HONESTY RULE: a card/stage/pathway item is only linked (`href`) when a real
 * Semitree page already covers it — the Phase 1 reuse set (existing lessons,
 * equipment topics, tools, the supply-chain testing stage, companies, India).
 * Everything else is `status: "planned"` with NO href, so nothing links to an
 * empty destination. Dedicated Testing topic pages arrive in Phase 3; their
 * `planned` cards flip to `available` then. No reading times or counts are
 * fabricated.
 */

export interface JourneyStop {
  label: string;
  blurb: string;
  /** Present only when a real page covers this stage. */
  href?: string;
}

/**
 * A simplified, conceptual journey — NOT a universal process sequence. Real test
 * flows vary by device type, manufacturer, product, and business model.
 */
export const TESTING_JOURNEY: JourneyStop[] = [
  { label: "Design for Testability", blurb: "Test structures, scan chains, and BIST are built into the design.", href: "/semiconductors/design" },
  { label: "Wafer Fabrication", blurb: "Devices are built on the wafer in the fab.", href: "/manufacturing" },
  { label: "Wafer Probe / Wafer Sort", blurb: "Each die is probed and tested on the wafer; good dies are mapped.", href: "/semiconductors/learn/wafer-test" },
  { label: "Die Selection", blurb: "Known-good dies are chosen for packaging." },
  { label: "Packaging", blurb: "Dies are assembled into protected, connectable packages.", href: "/semiconductors/packaging" },
  { label: "Final Test", blurb: "Packaged devices are tested to specification before they ship.", href: "/semiconductors/learn/final-test" },
  { label: "Reliability / Qualification", blurb: "Burn-in and stress tests — often on samples during qualification, not every unit.", href: "/semiconductors/equipment/burn-in" },
  { label: "System-Level Validation", blurb: "Devices are checked in a realistic system context, where appropriate." },
];

export interface PathwayItem {
  label: string;
  href?: string;
}

export interface Pathway {
  level: string;
  summary: string;
  items: PathwayItem[];
}

export const TESTING_PATHWAYS: Pathway[] = [
  {
    level: "Beginner",
    summary: "Start here if semiconductor testing is new to you.",
    items: [
      { label: "What is semiconductor testing?", href: "/semiconductors/learn/introduction-to-semiconductor-testing" },
      { label: "Why chips are tested", href: "/semiconductors/learn/introduction-to-semiconductor-testing" },
      { label: "Wafer testing vs final testing", href: "/semiconductors/learn/wafer-test" },
      { label: "How a chip is tested (the testing stage)", href: "/supply-chain/testing" },
    ],
  },
  {
    level: "Engineering",
    summary: "For students and engineers who want the working detail.",
    items: [
      { label: "ATE & the test-equipment ecosystem", href: "/semiconductors/learn/test-equipment" },
      { label: "Wafer probing & probe cards", href: "/semiconductors/equipment/wafer-probing" },
      { label: "Digital & analog test", href: "/semiconductors/learn/test-methods" },
      { label: "Test coverage & yield", href: "/semiconductors/tools/wafer-yield" },
      { label: "Test programs & debugging", href: "/semiconductors/learn/test-methods" },
    ],
  },
  {
    level: "Industry & Research",
    summary: "For professionals, researchers, and ecosystem participants.",
    items: [
      { label: "Test equipment ecosystem", href: "/semiconductors/equipment" },
      { label: "Advanced packaging & chiplet testing", href: "/semiconductors/equipment/advanced-packaging" },
      { label: "Reliability & failure analysis", href: "/semiconductors/equipment/burn-in" },
      { label: "Test economics & India's ecosystem", href: "/india" },
    ],
  },
];

export type TopicStatus = "available" | "planned";
export type TopicDifficulty = "Beginner" | "Engineering" | "Advanced";

export interface TopicCard {
  name: string;
  blurb: string;
  href?: string;
  status: TopicStatus;
  difficulty?: TopicDifficulty;
}

export interface TopicGroup {
  title: string;
  blurb: string;
  topics: TopicCard[];
}

/** A = available (real page exists), P = planned (Phase 3). */
export const TESTING_GROUPS: TopicGroup[] = [
  {
    title: "Testing Fundamentals",
    blurb: "What semiconductor testing is, and why it happens at many stages.",
    topics: [
      { name: "Introduction to semiconductor testing", blurb: "What testing measures and where it happens.", href: "/semiconductors/learn/introduction-to-semiconductor-testing", status: "available", difficulty: "Beginner" },
      { name: "Why semiconductor testing matters", blurb: "Quality, reliability, cost, and trust.", status: "planned", difficulty: "Beginner" },
      { name: "The semiconductor testing stage", blurb: "How testing fits in the end-to-end chain.", href: "/supply-chain/testing", status: "available", difficulty: "Beginner" },
    ],
  },
  {
    title: "Wafer Testing",
    blurb: "Testing devices while they are still on the wafer.",
    topics: [
      { name: "Wafer test & wafer sort", blurb: "Electrical test of each die; mapping good dies.", href: "/semiconductors/learn/wafer-test", status: "available", difficulty: "Engineering" },
      { name: "Wafer probing & probe cards", blurb: "Making contact with tiny pads to run the test.", href: "/semiconductors/equipment/wafer-probing", status: "available", difficulty: "Engineering" },
      { name: "Die selection & known-good die", blurb: "Choosing dies worth packaging.", status: "planned", difficulty: "Engineering" },
    ],
  },
  {
    title: "Package & Final Testing",
    blurb: "Testing the finished, packaged device.",
    topics: [
      { name: "Final test", blurb: "Specification test of packaged parts before shipping.", href: "/semiconductors/learn/final-test", status: "available", difficulty: "Engineering" },
      { name: "Package-level testing", blurb: "What changes once a die is in a package.", status: "planned", difficulty: "Engineering" },
      { name: "System-level testing", blurb: "Validating devices in a realistic system context.", status: "planned", difficulty: "Advanced" },
    ],
  },
  {
    title: "Test Equipment",
    blurb: "The machines and interfaces that run the tests.",
    topics: [
      { name: "Test equipment ecosystem", blurb: "How ATE, probers, handlers, sockets, and load boards fit together.", href: "/semiconductors/learn/test-equipment", status: "available", difficulty: "Engineering" },
      { name: "Automated Test Equipment (ATE)", blurb: "The testers that drive and measure the device.", href: "/semiconductors/equipment/semiconductor-test", status: "available", difficulty: "Engineering" },
      { name: "Inspection & measurement", blurb: "Finding defects and measuring structures.", href: "/semiconductors/equipment/inspection", status: "available", difficulty: "Engineering" },
      { name: "All test & inspection equipment", blurb: "Browse the equipment hub.", href: "/semiconductors/equipment", status: "available", difficulty: "Engineering" },
    ],
  },
  {
    title: "Test Methods",
    blurb: "Different device types need different test approaches.",
    topics: [
      { name: "Test methods & measurements", blurb: "How test programs apply stimuli and evaluate results.", href: "/semiconductors/learn/test-methods", status: "available", difficulty: "Engineering" },
      { name: "Metrology & measurement", blurb: "Measuring dimensions, films, and parameters.", href: "/semiconductors/learn/metrology", status: "available", difficulty: "Engineering" },
      { name: "Digital, analog, mixed-signal & RF test", blurb: "How test differs by signal type.", href: "/semiconductors/learn/test-methods", status: "available", difficulty: "Advanced" },
      { name: "Memory testing", blurb: "Patterns, repair, and built-in self-test.", status: "planned", difficulty: "Advanced" },
      { name: "Power-semiconductor testing", blurb: "High-voltage and high-current test.", status: "planned", difficulty: "Advanced" },
    ],
  },
  {
    title: "Reliability & Failure Analysis",
    blurb: "Proving devices keep working, and learning when they don't.",
    topics: [
      { name: "Burn-in, reliability & qualification", blurb: "Stress testing and qualification.", href: "/semiconductors/equipment/burn-in", status: "available", difficulty: "Advanced" },
      { name: "Defect detection & failure analysis", blurb: "Finding and understanding failures.", status: "planned", difficulty: "Advanced" },
    ],
  },
  {
    title: "Advanced Testing",
    blurb: "Where testing is heading — and where it gets hard.",
    topics: [
      { name: "Advanced packaging & chiplet testing", blurb: "Testing multi-die and 3D assemblies.", href: "/semiconductors/equipment/advanced-packaging", status: "available", difficulty: "Advanced" },
      { name: "Test yield, coverage & cost", blurb: "Estimate good dies and the cost of test.", href: "/semiconductors/tools/wafer-yield", status: "available", difficulty: "Engineering" },
      { name: "Test data, automation & AI", blurb: "Using test data to improve yield.", status: "planned", difficulty: "Advanced" },
    ],
  },
  {
    title: "Testing Industry & Supply Chain",
    blurb: "The companies, facilities, and ecosystem behind test.",
    topics: [
      { name: "Test supply chain", blurb: "Test houses, OSAT/ATMP, and equipment vendors.", href: "/supply-chain/testing", status: "available", difficulty: "Beginner" },
      { name: "Test & packaging companies", blurb: "OSAT/ATMP and test-equipment companies.", href: "/industry/companies", status: "available", difficulty: "Beginner" },
      { name: "Testing in India", blurb: "India's assembly-and-test ecosystem.", href: "/india", status: "available", difficulty: "Beginner" },
      { name: "Careers & skills in testing", blurb: "Roles and skills in semiconductor test.", status: "planned", difficulty: "Beginner" },
    ],
  },
];

export interface RelatedLink {
  label: string;
  href: string;
  note: string;
}

export const TESTING_RELATED: RelatedLink[] = [
  { label: "Manufacturing", href: "/manufacturing", note: "Where the devices under test are built." },
  { label: "Packaging", href: "/semiconductors/packaging", note: "Assembly before final test." },
  { label: "Design", href: "/semiconductors/design", note: "Design-for-testability and test structures." },
  { label: "Equipment", href: "/semiconductors/equipment", note: "Probers, ATE, handlers, inspection." },
  { label: "Materials", href: "/semiconductors/materials", note: "Probe cards, sockets, substrates, interconnects." },
  { label: "Supply chain", href: "/supply-chain/testing", note: "The testing stage, end to end." },
  { label: "Companies", href: "/industry/companies", note: "OSAT/ATMP and test-equipment companies." },
  { label: "Insights", href: "/insights", note: "News, explainers, and analysis." },
];

/** Stable counts for honest summaries (no fabricated numbers). */
export const TESTING_AVAILABLE_COUNT = TESTING_GROUPS.reduce(
  (n, g) => n + g.topics.filter((t) => t.status === "available").length,
  0,
);
