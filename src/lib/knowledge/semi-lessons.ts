/**
 * Semiconductor learning paths + lesson content.
 *
 * Original Semitree content: standard, well-established semiconductor
 * engineering knowledge, written from scratch. No fabricated citations,
 * companies, or statistics — "related companies / research / articles" resolve
 * to section pages, not invented names.
 *
 * Structured data so one template (SemiLessonView) renders every lesson and one
 * route serves all of them.
 */

import type { NamedItem } from "./equipment-topics";

export interface SemiTerm {
  term: string;
  def: string;
}

/** A verified reference / further-reading item (never a fabricated link or DOI). */
export interface SemiReference {
  title: string;
  author?: string;
  publisher?: string;
  year?: number;
  url?: string;
  doi?: string;
  note?: string;
  kind?: "review" | "paper" | "textbook" | "resource" | "vendor" | "standards";
}

/** One equation, fully unpacked for an engineering-level reader. */
export interface LessonEquation {
  name: string;
  expression: string;
  /** Each symbol, what it means, and its unit. */
  variables: { symbol: string; meaning: string; unit?: string }[];
  /** Physical meaning of the relationship. */
  meaning: string;
  /** What the equation assumes / where it breaks down. */
  assumptions?: string[];
  /** A simple worked example. */
  example?: string;
  /** What happens as each variable changes. */
  sensitivity?: string[];
}

export type DeepDiveLevel = "engineer" | "advanced" | "researcher";

/**
 * An expandable, visually-separated section for readers past the basics.
 * Rendered collapsed so it never overwhelms a first-time learner, and tagged
 * with the level it is aimed at (engineer -> advanced -> researcher).
 */
export interface LessonDeepDive {
  id: string;
  level: DeepDiveLevel;
  title: string;
  /** Short framing line shown before the panel is expanded is NOT needed; this is the opening paragraph inside. */
  intro?: string;
  body?: string[];
  bullets?: string[];
  equations?: LessonEquation[];
  /** An ordered flow rendered as arrowed steps (e.g. a feedback-control loop). */
  flow?: string[];
  /** Closing note, e.g. distinguishing production technology from R&D. */
  note?: string;
}

export type LessonVisualKey =
  | "energy-bands"
  | "pn-junction"
  | "mosfet"
  | "wafer-flow"
  | "doping"
  | "cmos"
  | "wafer-to-package"
  | "wire-bonding"
  | "flip-chip"
  | "2-5d"
  | "3d-ic"
  | "chiplets"
  | "die-vs-package"
  | "substrate"
  | "electrical-connections"
  | "wafer-level-packaging";

export interface SemiLesson {
  slug: string;
  pathId: string;
  order: number;
  title: string;
  summary: string;
  whatYoullLearn: string[];
  whyItMatters: string;
  explanation: string[];
  /** A described visual, shown in a figure box. */
  visual: string;
  /** Optional built-in SVG diagram. */
  visualKey?: LessonVisualKey;
  terminology: SemiTerm[];
  formula?: { expression: string; caption?: string };
  example: string;
  commonMistakes: string[];
  realWorld: string;
  /** Sibling lesson slugs to surface as "related concepts". */
  relatedLessons?: string[];

  /* ---------------------------------------------------------------- *
   * Deep-topic sections (all OPTIONAL). Used by the major manufacturing
   * topics (photolithography, etching & deposition, doping, packaging)
   * to support the full WHY -> WHAT -> HOW -> PHYSICS -> EQUIPMENT ->
   * PROCESS -> DEFECTS -> METRICS -> INDUSTRY progression and the four
   * learning levels. Existing lessons omit them and render unchanged.
   * ---------------------------------------------------------------- */

  /** Level 1 — "if you only remember a few things". */
  quickStart?: string[];
  /** Prior lesson slugs the reader should ideally have seen first. */
  prerequisites?: string[];
  /** Level 1 — everyday-framing analogies before the technical definition. */
  intuition?: string[];
  /** Where the topic sits in the manufacturing journey (see manufacturing-journey.ts). */
  whereItFits?: { journeyStepId?: string; note?: string };
  /** Level 2 — the mechanism. */
  howItWorks?: string[];
  /** Level 2 — the step-by-step process. */
  steps?: NamedItem[];
  /** Level 2/3 — the physics / chemistry / engineering behind it. */
  science?: string[];
  /** Level 2 — equipment involved. */
  equipment?: NamedItem[];
  /** Level 2 — materials involved. */
  materials?: NamedItem[];
  /** Level 2 — process parameters that matter. */
  parameters?: NamedItem[];
  /** Caveat that specific numbers are technology/vendor/process dependent. */
  parametersNote?: string;
  /** Level 3 — defects and failure modes (what can go wrong). */
  defects?: string[];
  /** Level 3 — measurement and metrology. */
  metrology?: string[];
  /** Level 3 — yield impact. */
  yieldImpact?: string[];
  /** Level 2/3 — design implications. */
  designImplications?: string[];
  /** Manufacturing / industry context. */
  industryContext?: string[];
  /** Level 4 — advanced context, trade-offs, emerging approaches (collapsed). */
  researcherNotes?: string[];
  /** Engineer -> advanced -> researcher deep dives, shown as collapsed panels. */
  deepDives?: LessonDeepDive[];
  /** Key takeaways. */
  keyTakeaways?: string[];
  /** References / further reading — verified sources only. */
  references?: SemiReference[];
}

export interface LearningPath {
  id: string;
  title: string;
  summary: string;
  lessonSlugs: string[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "fundamentals",
    title: "Semiconductor Fundamentals",
    summary: "From what a semiconductor is up to the CMOS integrated circuit.",
    lessonSlugs: [
      "what-is-a-semiconductor",
      "conductors-vs-semiconductors",
      "energy-bands",
      "bandgap",
      "intrinsic-semiconductor",
      "doping",
      "n-type",
      "p-type",
      "pn-junction",
      "diode",
      "mosfet",
      "cmos",
      "integrated-circuit",
    ],
  },
  {
    id: "manufacturing",
    title: "Chip Manufacturing",
    summary: "The journey from sand to a packaged, tested chip.",
    lessonSlugs: [
      "silicon",
      "ingot",
      "wafer",
      "oxidation",
      "deposition",
      "photoresist",
      "lithography",
      "etching",
      "ion-implantation",
      "cmp",
      "metallization",
      "metrology",
      "wafer-test",
      "dicing",
      "packaging",
      "final-test",
    ],
  },
  {
    id: "ic-design",
    title: "IC Design Flow",
    summary: "How an idea becomes a manufacturable chip, step by step.",
    lessonSlugs: [
      "architecture",
      "rtl",
      "logic",
      "synthesis",
      "verification",
      "place-and-route",
      "physical-design",
      "signoff",
      "tapeout",
    ],
  },
  {
    id: "packaging",
    title: "Packaging",
    summary: "From what packaging is and why it's needed, through wire-bond and flip-chip, up to chiplets, 3D stacks, and HBM.",
    lessonSlugs: [
      "what-is-packaging",
      "why-packaging",
      "die-vs-package",
      "substrate",
      "electrical-connections",
      "wire-bonding",
      "flip-chip",
      "traditional-packaging",
      "wafer-level-packaging",
      "2-5d",
      "3d-ic",
      "chiplets",
      "hbm",
      "advanced-packaging",
    ],
  },
];

const L = (l: SemiLesson) => l;

export const SEMI_LESSONS: SemiLesson[] = [
  // ============================ PATH 1: FUNDAMENTALS ============================
  L({
    slug: "what-is-a-semiconductor",
    pathId: "fundamentals",
    order: 1,
    title: "What is a semiconductor?",
    summary:
      "A material whose ability to conduct electricity sits between a conductor and an insulator — and can be controlled.",
    whatYoullLearn: [
      "The defining property of a semiconductor",
      "Common semiconductor materials",
      "Why controllable conductivity matters",
    ],
    whyItMatters:
      "Every chip exists because a semiconductor's conductivity can be tuned by doping, voltage, light, or temperature.",
    explanation: [
      "A semiconductor is a material with electrical conductivity between that of a conductor (like copper) and an insulator (like glass). Silicon is the dominant example; germanium and compound semiconductors such as gallium arsenide (GaAs) and gallium nitride (GaN) are also used.",
      "The crucial feature is not the middling conductivity itself but that it can be controlled precisely — by adding tiny amounts of impurities (doping) or by applying an electric field. That controllability is what makes switches, amplifiers, and logic possible.",
    ],
    visual:
      "A conductivity scale: insulators (glass) on the left, metals (copper) on the right, and semiconductors (silicon) in the tunable middle band.",
    terminology: [
      { term: "Conductivity", def: "How easily a material carries electric current." },
      { term: "Silicon", def: "The most widely used semiconductor element." },
      { term: "Compound semiconductor", def: "A semiconductor made of two or more elements (e.g. GaAs)." },
    ],
    example:
      "Pure silicon barely conducts, but adding one boron atom per million silicon atoms makes it conduct far better — a change you engineer on purpose.",
    commonMistakes: [
      "Thinking semiconductors are simply 'weak conductors' — the point is that the conductivity is controllable.",
      "Assuming silicon is the only semiconductor; compound semiconductors dominate optoelectronics and power.",
    ],
    realWorld:
      "Silicon underpins essentially all logic and memory chips; GaN and SiC are rising in power electronics.",
    relatedLessons: ["conductors-vs-semiconductors", "energy-bands", "doping"],
  }),
  L({
    slug: "conductors-vs-semiconductors",
    pathId: "fundamentals",
    order: 2,
    title: "Conductors vs semiconductors",
    summary:
      "Why metals conduct freely, insulators barely conduct, and semiconductors sit in between.",
    whatYoullLearn: [
      "How free electrons differ across material types",
      "The role of temperature",
      "Why the difference comes down to energy bands",
    ],
    whyItMatters:
      "The conductor/insulator/semiconductor distinction is the foundation for everything that follows.",
    explanation: [
      "In a conductor, huge numbers of electrons are free to move, so current flows with little resistance. In an insulator, electrons are tightly bound and almost none are free. A semiconductor has few free carriers at room temperature but that number rises sharply with temperature or doping.",
      "Counter-intuitively, heating a metal *reduces* its conductivity (more atomic vibration scatters electrons), while heating a pure semiconductor *increases* it (more electrons gain enough energy to move).",
    ],
    visual:
      "Three bars comparing free-carrier density: metal (very high), semiconductor (low, temperature-dependent), insulator (near zero).",
    terminology: [
      { term: "Free carrier", def: "An electron (or hole) available to carry current." },
      { term: "Resistivity", def: "A material's intrinsic opposition to current flow." },
    ],
    example:
      "Copper conducts about 10^20 times better than glass; silicon lands many orders of magnitude in between and moves within that range as you dope it.",
    commonMistakes: [
      "Assuming all materials conduct better when hot — pure semiconductors do, metals do not.",
    ],
    realWorld:
      "Temperature sensitivity is exploited in thermistors and must be managed in every chip's thermal design.",
    relatedLessons: ["what-is-a-semiconductor", "energy-bands", "bandgap"],
  }),
  L({
    slug: "energy-bands",
    pathId: "fundamentals",
    order: 3,
    title: "Energy bands",
    summary:
      "Electrons in a solid occupy allowed energy bands separated by forbidden gaps.",
    whatYoullLearn: [
      "What the valence and conduction bands are",
      "How bands form from atomic orbitals",
      "How band occupancy sets material behaviour",
    ],
    whyItMatters:
      "Band structure explains, in one picture, why materials are conductors, insulators, or semiconductors.",
    explanation: [
      "When atoms bond into a solid, their discrete energy levels broaden into continuous bands. The highest band that is full of electrons is the valence band; the next band up, largely empty, is the conduction band. Electrons must reach the conduction band to move freely.",
      "In metals these bands overlap, so electrons flow easily. In insulators and semiconductors a gap separates them; the gap is large for insulators and small enough for semiconductors that some electrons can cross it.",
    ],
    visual: "Valence band (filled) below the conduction band (empty), with an energy gap between them.",
    visualKey: "energy-bands",
    terminology: [
      { term: "Valence band", def: "The highest energy band normally filled with electrons." },
      { term: "Conduction band", def: "The band electrons must enter to conduct." },
      { term: "Fermi level", def: "The energy level with 50% occupation probability." },
    ],
    example:
      "At room temperature a few silicon electrons have enough thermal energy to jump the gap into the conduction band, giving silicon its slight conductivity.",
    commonMistakes: [
      "Picturing bands as single lines — they are dense ranges of closely spaced levels.",
      "Forgetting that an electron leaving the valence band leaves behind a mobile 'hole'.",
    ],
    realWorld:
      "Band engineering (e.g. strained silicon, heterojunctions) is used to boost transistor performance.",
    relatedLessons: ["bandgap", "intrinsic-semiconductor", "conductors-vs-semiconductors"],
  }),
  L({
    slug: "bandgap",
    pathId: "fundamentals",
    order: 4,
    title: "Bandgap",
    summary:
      "The energy gap between the valence and conduction bands — the number that defines a semiconductor.",
    whatYoullLearn: [
      "What the bandgap is and its units",
      "Typical values for common materials",
      "How the bandgap affects devices",
    ],
    whyItMatters:
      "Bandgap sets how easily carriers are created, the wavelengths a material emits or absorbs, and its temperature behaviour.",
    explanation: [
      "The bandgap (Eg) is the minimum energy an electron needs to jump from the valence band to the conduction band, measured in electron-volts (eV). Silicon's is about 1.1 eV, germanium's about 0.66 eV, and gallium arsenide's about 1.4 eV. Insulators have gaps of several eV.",
      "A smaller gap means carriers are generated more easily (higher intrinsic conductivity, more leakage); a larger gap suits high-temperature and high-power devices and sets the colour of LEDs and the response of photodetectors.",
    ],
    visual: "The same band diagram, now labelling the gap height Eg between the two bands.",
    visualKey: "energy-bands",
    terminology: [
      { term: "Bandgap (Eg)", def: "Energy needed to promote an electron to the conduction band." },
      { term: "Electron-volt (eV)", def: "A convenient energy unit at the atomic scale." },
      { term: "Direct/indirect gap", def: "Whether an electron can cross the gap without a momentum change — key for light emission." },
    ],
    formula: {
      expression: "E_photon = h · f = Eg  (at the band edge)",
      caption: "A material tends to emit/absorb light with photon energy near its bandgap.",
    },
    example:
      "GaN's wide ~3.4 eV gap corresponds to ultraviolet/blue light — which is why it enabled efficient blue LEDs.",
    commonMistakes: [
      "Confusing a large bandgap with 'better' — the right gap depends on the application.",
      "Ignoring that silicon's indirect gap makes it a poor light emitter.",
    ],
    realWorld:
      "Wide-bandgap SiC and GaN power devices switch faster and run hotter than silicon.",
    relatedLessons: ["energy-bands", "intrinsic-semiconductor", "diode"],
  }),
  L({
    slug: "intrinsic-semiconductor",
    pathId: "fundamentals",
    order: 5,
    title: "Intrinsic semiconductor",
    summary: "A pure, undoped semiconductor where electrons and holes come only from thermal generation.",
    whatYoullLearn: [
      "What 'intrinsic' means",
      "Electron–hole pair generation",
      "Why intrinsic material is rarely used directly",
    ],
    whyItMatters:
      "Intrinsic behaviour is the baseline you modify by doping to build real devices.",
    explanation: [
      "In an intrinsic (pure) semiconductor, the only carriers come from thermal energy knocking electrons from the valence to the conduction band. Each promoted electron leaves a hole, so electrons and holes are equal in number (n = p = ni).",
      "This intrinsic carrier concentration is tiny and strongly temperature-dependent, so pure silicon is a poor conductor. Real devices deliberately add impurities to fix the carrier type and concentration.",
    ],
    visual: "Equal numbers of free electrons (–) and holes (+) scattered through a pure silicon lattice.",
    terminology: [
      { term: "Intrinsic carrier concentration (ni)", def: "Carrier density in pure material." },
      { term: "Electron–hole pair", def: "An electron and the hole it leaves behind." },
      { term: "Hole", def: "A missing valence electron that acts like a positive carrier." },
    ],
    formula: {
      expression: "n = p = ni",
      caption: "In intrinsic material, electron and hole concentrations are equal.",
    },
    example:
      "Silicon's ni is about 10^10 per cm³ at room temperature — vanishingly small next to ~10^22 atoms per cm³.",
    commonMistakes: [
      "Thinking pure silicon is a good conductor — it barely conducts.",
      "Forgetting holes contribute to current alongside electrons.",
    ],
    realWorld:
      "Wafers start close to intrinsic and are doped region-by-region to build transistors.",
    relatedLessons: ["doping", "n-type", "p-type"],
  }),
  L({
    slug: "doping",
    pathId: "fundamentals",
    order: 6,
    title: "Doping",
    summary: "Adding trace impurities to control a semiconductor's carrier type and concentration.",
    whatYoullLearn: [
      "What doping does",
      "Donors vs acceptors",
      "How doping level sets conductivity",
    ],
    whyItMatters:
      "Doping is the single most important tool for turning inert silicon into working devices.",
    explanation: [
      "Doping introduces small, controlled amounts of impurity atoms into the lattice. Donor atoms (e.g. phosphorus) add extra electrons; acceptor atoms (e.g. boron) add holes. Even parts-per-million doping changes conductivity by orders of magnitude.",
      "By choosing the dopant and its concentration, engineers set whether a region is electron-rich (n-type) or hole-rich (p-type), and how strongly it conducts.",
    ],
    visual: "A silicon lattice with a phosphorus atom contributing a spare electron, and a boron atom creating a hole.",
    visualKey: "doping",
    terminology: [
      { term: "Dopant", def: "An impurity added to change carrier concentration." },
      { term: "Donor", def: "A dopant that donates a free electron (n-type)." },
      { term: "Acceptor", def: "A dopant that accepts an electron, creating a hole (p-type)." },
    ],
    example:
      "Adding phosphorus to silicon makes it n-type; adding boron makes it p-type — the basis of every junction.",
    commonMistakes: [
      "Assuming more doping is always better — heavy doping raises leakage and can degrade mobility.",
      "Mixing up donors (n-type) and acceptors (p-type).",
    ],
    realWorld:
      "Ion implantation places precise dopant doses exactly where transistors need them.",
    relatedLessons: ["n-type", "p-type", "ion-implantation"],
  }),
  L({
    slug: "n-type",
    pathId: "fundamentals",
    order: 7,
    title: "n-type semiconductor",
    summary: "Silicon doped with donors, where electrons are the majority carriers.",
    whatYoullLearn: [
      "How donor doping works",
      "Majority vs minority carriers",
      "Where n-type regions are used",
    ],
    whyItMatters:
      "n-type and p-type regions are the two ingredients of every junction and transistor.",
    explanation: [
      "Adding a group-V donor such as phosphorus or arsenic gives each dopant atom a spare electron that is easily freed. Electrons become the majority carriers and holes the minority, so current is carried mainly by negative charge — hence 'n-type'.",
      "The electron concentration is set by the donor dose, making conductivity predictable and tunable.",
    ],
    visual: "A lattice dominated by free electrons (–), with a few holes as minority carriers.",
    terminology: [
      { term: "Majority carrier", def: "The more abundant carrier (electrons in n-type)." },
      { term: "Minority carrier", def: "The scarcer carrier (holes in n-type)." },
    ],
    example:
      "An n-type source/drain region feeds electrons into an NMOS transistor's channel.",
    commonMistakes: [
      "Thinking n-type material is negatively charged overall — it stays electrically neutral.",
    ],
    realWorld:
      "The source and drain of NMOS transistors are heavily n-type.",
    relatedLessons: ["p-type", "pn-junction", "doping"],
  }),
  L({
    slug: "p-type",
    pathId: "fundamentals",
    order: 8,
    title: "p-type semiconductor",
    summary: "Silicon doped with acceptors, where holes are the majority carriers.",
    whatYoullLearn: [
      "How acceptor doping works",
      "Why holes carry current",
      "Where p-type regions are used",
    ],
    whyItMatters:
      "The p-type counterpart to n-type completes the junction toolkit.",
    explanation: [
      "Adding a group-III acceptor such as boron leaves an empty bonding site — a hole — that neighbouring electrons hop into, moving the hole through the lattice. Holes become the majority carriers, so current is carried mainly by positive charge.",
      "As with n-type, the hole concentration follows the acceptor dose.",
    ],
    visual: "A lattice dominated by holes (+), with a few free electrons as minority carriers.",
    terminology: [
      { term: "Acceptor", def: "A dopant that creates a hole." },
      { term: "Hole conduction", def: "Current carried by the motion of holes." },
    ],
    example:
      "A p-type substrate hosts the NMOS transistors of a CMOS chip.",
    commonMistakes: [
      "Imagining holes as physical particles — a hole is the collective motion of electrons.",
    ],
    realWorld:
      "PMOS source/drain regions are heavily p-type; the wafer bulk is often lightly p-type.",
    relatedLessons: ["n-type", "pn-junction", "cmos"],
  }),
  L({
    slug: "pn-junction",
    pathId: "fundamentals",
    order: 9,
    title: "PN junction",
    summary: "Where n-type and p-type meet — the building block that conducts in one direction.",
    whatYoullLearn: [
      "What forms at a p–n interface",
      "The depletion region and built-in potential",
      "Forward vs reverse bias",
    ],
    whyItMatters:
      "The p–n junction is the heart of diodes, solar cells, LEDs, and every transistor.",
    explanation: [
      "When p-type and n-type material meet, electrons and holes near the interface recombine, leaving a carrier-free 'depletion region' with a built-in electric field. This field opposes further diffusion and sets up a built-in potential.",
      "Applying forward bias (p positive) shrinks the depletion region and lets current flow; reverse bias widens it and blocks current. That asymmetry is rectification.",
    ],
    visual: "A p region and n region meeting, with a depletion zone and its internal field arrow at the junction.",
    visualKey: "pn-junction",
    terminology: [
      { term: "Depletion region", def: "The carrier-free zone at the junction." },
      { term: "Built-in potential", def: "The voltage across the depletion region at equilibrium." },
      { term: "Bias", def: "An externally applied junction voltage." },
    ],
    example:
      "Under forward bias above ~0.7 V, a silicon p–n junction conducts strongly; under reverse bias it blocks.",
    commonMistakes: [
      "Assuming current flows equally both ways — the junction is a one-way valve.",
      "Forgetting the depletion region has no free carriers.",
    ],
    realWorld:
      "Solar cells generate power by separating light-created carriers across a p–n junction.",
    relatedLessons: ["diode", "n-type", "p-type"],
  }),
  L({
    slug: "diode",
    pathId: "fundamentals",
    order: 10,
    title: "Diode",
    summary: "A single p–n junction packaged as a one-way current valve.",
    whatYoullLearn: [
      "How a diode uses the p–n junction",
      "The I–V characteristic",
      "Common diode types",
    ],
    whyItMatters:
      "Diodes rectify, protect, and emit light — and the diode I–V law recurs throughout electronics.",
    explanation: [
      "A diode is a p–n junction with two terminals: the anode (p) and cathode (n). It conducts when forward-biased beyond its turn-on voltage and blocks when reverse-biased, up to a breakdown voltage.",
      "The current rises exponentially with forward voltage, described by the Shockley diode equation.",
    ],
    visual: "A diode I–V curve: near-zero current until turn-on, then a steep exponential rise.",
    terminology: [
      { term: "Anode / cathode", def: "The p-side and n-side terminals." },
      { term: "Turn-on voltage", def: "Forward voltage where the diode begins to conduct (~0.7 V for silicon)." },
      { term: "Breakdown", def: "Reverse voltage at which the diode suddenly conducts." },
    ],
    formula: {
      expression: "I = I₀ ( e^(V / (n·Vt)) − 1 )",
      caption: "Shockley diode equation; Vt = kT/q ≈ 26 mV at room temperature.",
    },
    example:
      "A rectifier diode converts AC to pulsating DC by conducting only on positive half-cycles.",
    commonMistakes: [
      "Treating the turn-on voltage as fixed — it varies with current and temperature.",
      "Ignoring reverse breakdown, which is intentional in Zener diodes.",
    ],
    realWorld:
      "LEDs are diodes engineered to emit light; photodiodes do the reverse.",
    relatedLessons: ["pn-junction", "mosfet", "bandgap"],
  }),
  L({
    slug: "mosfet",
    pathId: "fundamentals",
    order: 11,
    title: "MOSFET",
    summary: "The voltage-controlled switch that makes up modern logic.",
    whatYoullLearn: [
      "The four MOSFET terminals",
      "How gate voltage forms a channel",
      "Threshold voltage and switching",
    ],
    whyItMatters:
      "The MOSFET is the workhorse transistor — billions of them form a modern processor.",
    explanation: [
      "A MOSFET (metal-oxide-semiconductor field-effect transistor) has a gate, source, drain, and body. A thin insulating oxide separates the gate from the channel region between source and drain.",
      "When the gate voltage exceeds the threshold voltage (Vth), it attracts carriers to form a conducting channel, turning the device on. Below Vth it is essentially off. Because the gate is insulated, control takes almost no steady current.",
    ],
    visual: "Cross-section: gate over a thin oxide, with source and drain either side and a channel forming beneath the gate.",
    visualKey: "mosfet",
    terminology: [
      { term: "Gate oxide", def: "The thin insulator between gate and channel." },
      { term: "Threshold voltage (Vth)", def: "Gate voltage at which the channel forms." },
      { term: "Channel", def: "The conducting path between source and drain." },
    ],
    formula: {
      expression: "I_D ≈ ½ · μ · Cox · (W/L) · (V_GS − Vth)²   (saturation)",
      caption: "Drain current grows with gate overdrive and the width/length ratio.",
    },
    example:
      "Raising a logic gate's input above Vth switches its transistor on, pulling the output toward a rail.",
    commonMistakes: [
      "Thinking the gate draws current — it's capacitive, drawing current only while switching.",
      "Confusing NMOS (electron channel) with PMOS (hole channel).",
    ],
    realWorld:
      "FinFET and gate-all-around (GAA) transistors are 3D evolutions of the MOSFET for advanced nodes.",
    relatedLessons: ["cmos", "diode", "physical-design"],
  }),
  L({
    slug: "cmos",
    pathId: "fundamentals",
    order: 12,
    title: "CMOS",
    summary: "Pairing NMOS and PMOS transistors for low-power digital logic.",
    whatYoullLearn: [
      "What CMOS stands for",
      "Why it draws almost no static power",
      "The CMOS inverter",
    ],
    whyItMatters:
      "CMOS is the dominant logic technology precisely because it wastes so little power at rest.",
    explanation: [
      "CMOS (complementary MOS) uses NMOS and PMOS transistors together so that, in either steady logic state, one transistor is off. That means almost no current flows except briefly during switching.",
      "The simplest CMOS circuit, the inverter, connects a PMOS pull-up and an NMOS pull-down; the output is always driven high or low with negligible static power.",
    ],
    visual: "A CMOS inverter: PMOS to the supply, NMOS to ground, gates tied to the input, output between them.",
    visualKey: "cmos",
    terminology: [
      { term: "Complementary", def: "Using both NMOS and PMOS together." },
      { term: "Static power", def: "Power drawn when the circuit is not switching." },
      { term: "Dynamic power", def: "Power used charging/discharging capacitance while switching." },
    ],
    formula: {
      expression: "P_dynamic ≈ α · C · V² · f",
      caption: "Dynamic power scales with activity, capacitance, voltage², and clock frequency.",
    },
    example:
      "A CMOS inverter outputs 1 when the input is 0 and vice versa, drawing current only during the transition.",
    commonMistakes: [
      "Assuming CMOS uses no power — dynamic and leakage power are very real at scale.",
      "Forgetting the brief short-circuit current during switching.",
    ],
    realWorld:
      "Virtually all microprocessors, memory, and logic are built in CMOS.",
    relatedLessons: ["mosfet", "integrated-circuit", "logic"],
  }),
  L({
    slug: "integrated-circuit",
    pathId: "fundamentals",
    order: 13,
    title: "Integrated circuit",
    summary: "Millions to billions of transistors fabricated together on one chip.",
    whatYoullLearn: [
      "What integration means",
      "Why integration drives cost and performance",
      "How ICs are classified",
    ],
    whyItMatters:
      "Integration is the reason computing got exponentially cheaper and more capable.",
    explanation: [
      "An integrated circuit builds many transistors and their interconnections on a single semiconductor die, rather than wiring discrete components together. Shrinking features lets more devices fit per chip, improving speed, power, and cost per function.",
      "ICs range from simple logic to processors and memory with tens of billions of transistors, all made with the same photolithographic process.",
    ],
    visual: "A die with functional blocks (cores, cache, I/O) and layers of metal interconnect above the transistors.",
    terminology: [
      { term: "Die", def: "A single chip cut from the wafer." },
      { term: "Integration", def: "Fabricating many devices together on one substrate." },
      { term: "Node", def: "A process generation, loosely tied to feature size." },
    ],
    example:
      "A modern CPU integrates billions of CMOS transistors plus memory and I/O on one die.",
    commonMistakes: [
      "Equating a process 'node' name with an actual physical dimension — modern node names are marketing labels.",
    ],
    realWorld:
      "The manufacturing path (next learning path) is exactly how these ICs are made.",
    relatedLessons: ["cmos", "silicon", "architecture"],
  }),

  // ============================ PATH 2: MANUFACTURING ============================
  L({
    slug: "silicon",
    pathId: "manufacturing",
    order: 1,
    title: "Silicon",
    summary: "Purifying sand into electronic-grade silicon — the starting material.",
    whatYoullLearn: ["Why silicon is used", "What electronic-grade purity means", "How raw silicon is refined"],
    whyItMatters: "The whole process begins with silicon of almost unimaginable purity.",
    explanation: [
      "Silicon is abundant (from sand/quartz), forms a stable oxide, and has a workable bandgap — so it dominates the industry. Raw silicon is refined to 'electronic-grade' purity of about 99.9999999% (nine nines).",
      "Impurities are reduced through chemical purification (e.g. the Siemens process) before crystal growth.",
    ],
    visual: "A purity ladder from quartz sand to metallurgical-grade to electronic-grade polysilicon.",
    terminology: [
      { term: "Electronic-grade silicon", def: "Ultra-pure silicon suitable for chips (~9N)." },
      { term: "Polysilicon", def: "Purified silicon before single-crystal growth." },
    ],
    example: "A single stray impurity atom per billion can matter, so purification is extreme.",
    commonMistakes: ["Assuming purity is 'good enough' at 99.9% — chips need far higher."],
    realWorld: "Polysilicon supply is a strategic part of the semiconductor supply chain.",
    relatedLessons: ["ingot", "wafer"],
  }),
  L({
    slug: "ingot",
    pathId: "manufacturing",
    order: 2,
    title: "Ingot",
    summary: "Growing a single crystal of silicon into a large cylindrical ingot.",
    whatYoullLearn: ["The Czochralski method", "Why single-crystal matters", "What sets ingot diameter"],
    whyItMatters: "A perfect crystal is the substrate every transistor is built into.",
    explanation: [
      "In the Czochralski (CZ) process, a seed crystal is dipped into molten silicon and slowly pulled while rotating, growing a single-crystal cylindrical ingot (a boule). Controlled doping can be added to the melt.",
      "A single crystal (no grain boundaries) is essential for uniform, predictable device behaviour. Modern ingots are 300 mm in diameter.",
    ],
    visual: "A seed crystal pulling a growing cylindrical boule up out of a crucible of molten silicon.",
    terminology: [
      { term: "Czochralski (CZ)", def: "The main crystal-pulling method." },
      { term: "Boule", def: "The grown single-crystal ingot." },
      { term: "Single crystal", def: "A solid with one continuous crystal lattice." },
    ],
    example: "A 300 mm ingot can be over a metre long and weigh hundreds of kilograms.",
    commonMistakes: ["Confusing single-crystal (chip-grade) with polycrystalline or amorphous silicon."],
    realWorld: "Larger wafers (300 mm, and eventually 450 mm) lower cost per die.",
    relatedLessons: ["silicon", "wafer"],
  }),
  L({
    slug: "wafer",
    pathId: "manufacturing",
    order: 3,
    title: "Wafer",
    summary: "Slicing and polishing the ingot into mirror-flat wafers.",
    whatYoullLearn: ["How wafers are made from ingots", "Why flatness matters", "Standard wafer sizes"],
    whyItMatters: "The wafer is the canvas on which hundreds of chips are patterned at once.",
    explanation: [
      "The ingot is sliced into thin discs with a wire saw, then lapped, etched, and polished to an atomically smooth, defect-free surface. Edges are rounded and the crystal orientation is marked.",
      "Extreme flatness is required so that lithography can focus sharply across the whole wafer.",
    ],
    visual: "A boule sliced into thin discs, then a single polished mirror-finish 300 mm wafer.",
    visualKey: "wafer-flow",
    terminology: [
      { term: "Wafer", def: "A thin polished disc of single-crystal silicon." },
      { term: "CMP", def: "Chemical-mechanical polishing used for flatness (see later lesson)." },
      { term: "Flat/notch", def: "A marking that indicates crystal orientation." },
    ],
    example: "A 300 mm wafer can yield hundreds to thousands of dies depending on chip size.",
    commonMistakes: ["Underestimating flatness requirements — nanometre-scale variation matters for lithography."],
    realWorld: "Yield (good dies per wafer) is a central economic metric.",
    relatedLessons: ["ingot", "oxidation", "lithography"],
  }),
  L({
    slug: "oxidation",
    pathId: "manufacturing",
    order: 4,
    title: "Oxidation",
    summary: "Growing a high-quality silicon dioxide layer on the wafer.",
    whatYoullLearn: ["How thermal oxide is grown", "Why SiO₂ is so useful", "Where oxide is used"],
    whyItMatters: "Silicon's native oxide is one of the reasons silicon won — it makes excellent insulators and gate dielectrics.",
    explanation: [
      "Heating silicon in oxygen or steam grows a dense, stable silicon dioxide (SiO₂) film directly from the wafer surface. Thickness is controlled by temperature and time.",
      "SiO₂ serves as gate dielectric, insulation between layers, and a mask against dopants — a remarkably versatile material.",
    ],
    visual: "A thin SiO₂ layer growing on top of (and consuming a little of) the silicon surface.",
    terminology: [
      { term: "Thermal oxidation", def: "Growing SiO₂ by reacting silicon with oxygen/steam." },
      { term: "Gate dielectric", def: "The insulator under a transistor gate." },
      { term: "High-k dielectric", def: "A newer gate insulator replacing SiO₂ at small nodes." },
    ],
    example: "Early MOSFET gates used a few nanometres of thermal SiO₂ as the gate dielectric.",
    commonMistakes: ["Assuming oxide only sits on top — thermal oxidation consumes some underlying silicon."],
    realWorld: "At advanced nodes, SiO₂ gate dielectrics were replaced by high-k materials to cut leakage.",
    relatedLessons: ["deposition", "mosfet"],
  }),
  L({
    slug: "deposition",
    pathId: "manufacturing",
    order: 5,
    title: "Deposition",
    summary: "Adding thin films of conductors, insulators, and semiconductors layer by layer.",
    whatYoullLearn: ["CVD, PVD, and ALD", "Why film control matters", "Typical deposited materials"],
    whyItMatters: "Chips are built up from dozens of precisely deposited thin films.",
    explanation: [
      "Deposition adds material onto the wafer. Chemical vapour deposition (CVD) grows films from reactive gases; physical vapour deposition (PVD/sputtering) knocks atoms from a target onto the wafer; atomic layer deposition (ALD) builds films one atomic layer at a time for ultimate control.",
      "Films must be uniform, conformal, and defect-free across the wafer.",
    ],
    visual: "Gas precursors reacting at the wafer surface (CVD) beside atoms sputtered from a target (PVD).",
    terminology: [
      { term: "CVD", def: "Chemical vapour deposition." },
      { term: "PVD", def: "Physical vapour deposition (sputtering/evaporation)." },
      { term: "ALD", def: "Atomic layer deposition — one monolayer per cycle." },
    ],
    example: "ALD deposits ultrathin high-k gate dielectrics with sub-nanometre thickness control.",
    commonMistakes: ["Treating all deposition as equivalent — each method has different conformality and speed."],
    realWorld: "Advanced logic uses ALD extensively for the thinnest, most critical films.",
    relatedLessons: ["oxidation", "photoresist", "metallization"],
  }),
  L({
    slug: "photoresist",
    pathId: "manufacturing",
    order: 6,
    title: "Photoresist",
    summary: "A light-sensitive coating that records the pattern to be etched.",
    whatYoullLearn: ["What photoresist does", "Positive vs negative resist", "The coat–expose–develop cycle"],
    whyItMatters: "Photoresist is the recording medium that turns light into a physical pattern.",
    explanation: [
      "A liquid photoresist is spun onto the wafer as a thin, even film. Where light hits it (through a mask), its solubility changes. Positive resist becomes soluble where exposed; negative resist becomes insoluble where exposed.",
      "After exposure, a developer washes away the soluble regions, leaving a patterned mask for etching or implantation.",
    ],
    visual: "Spin-coat, then expose through a mask, then develop to reveal a patterned resist.",
    terminology: [
      { term: "Photoresist", def: "A light-sensitive polymer coating." },
      { term: "Positive/negative resist", def: "Whether exposed regions become soluble or insoluble." },
      { term: "Spin coating", def: "Applying an even film by spinning the wafer." },
    ],
    example: "Positive resist plus a mask leaves resist everywhere except where the pattern will be etched.",
    commonMistakes: ["Confusing which regions remain for positive vs negative resist."],
    realWorld: "EUV lithography needs specially engineered resists sensitive to 13.5 nm light.",
    relatedLessons: ["lithography", "etching"],
  }),
  L({
    slug: "lithography",
    pathId: "manufacturing",
    order: 7,
    title: "Photolithography",
    summary:
      "Printing each layer's pattern onto the wafer with light — the step that decides how small a chip's features can be.",
    whatYoullLearn: [
      "What photolithography actually does, and what it does not",
      "How light, a mask, and photoresist turn a design into a pattern on silicon",
      "Why resolution is set by wavelength, optics, and process — not wavelength alone",
      "How layers are aligned to each other, and why overlay error matters",
      "What can go wrong, how it is measured, and why control is so hard",
    ],
    whyItMatters:
      "Photolithography is the pacing step of chip making: it defines the smallest features on every layer, is repeated dozens of times per wafer, and its precision directly sets how many working chips a fab can produce. When people say a chip is '3 nm' or '5 nm', they are really talking about what lithography (with etch and deposition) can pattern.",
    quickStart: [
      "Photolithography prints a pattern onto the wafer using light shone through a mask and a light-sensitive coating called photoresist.",
      "It does not build the transistor by itself — it draws a temporary stencil in resist that later steps (etch, deposition, implant) use to shape the real material.",
      "The whole layer is not drawn in one flash: the pattern is projected field by field, and the full sequence is repeated for every layer of the chip.",
      "How small a feature can be printed depends on the light's wavelength, the optics, and clever process tricks — captured by Resolution ≈ k₁ · λ / NA.",
      "Each new layer must line up with the ones beneath it. That alignment accuracy is called overlay, and it is as important as resolution.",
    ],
    prerequisites: ["wafer", "deposition", "photoresist"],
    intuition: [
      "Think of a photographic stencil. Light shines through a patterned mask onto a light-sensitive film on the wafer; where the light lands, the film's chemistry changes, and developing washes part of it away to leave the pattern behind.",
      "It is like a projector, not a stamp: the mask pattern is projected and shrunk by a lens onto a small area of the wafer, then the wafer steps over and the projection repeats — again and again across the whole wafer.",
      "And it is like printing a book in many passes of a press that must register perfectly: a chip is built from many patterned layers, and each pass has to land on top of the last one with almost no misalignment.",
    ],
    whereItFits: {
      journeyStepId: "lithography",
      note: "Lithography sits between preparing a film (deposition) and shaping it (etch, or implant/deposition), and this whole block repeats for every layer — a modern chip goes through the litho step dozens of times, not once.",
    },
    explanation: [
      "Photolithography (often just 'litho' or 'patterning') is how a circuit design is transferred onto the wafer. A layer of light-sensitive photoresist is coated on the wafer, light is projected through a patterned mask, and developing the resist leaves a stencil that protects some regions and exposes others. Later steps — etching, deposition, or ion implantation — act only where the resist allows, so the resist pattern becomes a real pattern in the chip's materials.",
      "A stepper or scanner projects the mask (reticle) pattern, usually demagnified about 4×, onto one field of the resist-coated wafer, then steps to the next field and repeats. Resolution improves with shorter wavelength and higher numerical aperture, and with process techniques that lower the k₁ factor.",
      "Deep-ultraviolet (193 nm) light — extended for years with immersion and multiple patterning — carried the industry through many generations and still patterns most layers today. Extreme-ultraviolet (13.5 nm, EUV) now handles the very smallest features, but litho is not one technology: contact/proximity printing, i-line and KrF DUV, 193 nm dry and immersion, and EUV all coexist, chosen per layer by what a feature needs.",
      "Because a chip is many stacked patterned layers, every exposure must align to the layers already on the wafer. Getting the pattern small enough (resolution) and landing it accurately on the previous layers (overlay) are the two things litho must do well at the same time.",
    ],
    howItWorks: [
      "Coat: the wafer is coated with a thin, uniform film of photoresist, typically by dispensing liquid resist and spinning the wafer so it spreads evenly.",
      "Soft bake: gentle heating drives off solvent and stabilizes the resist film so it responds predictably to light.",
      "Align: the tool measures alignment marks on the wafer and positions it so the new pattern will register to the existing layers.",
      "Expose: light is projected through the mask/reticle and the projection optics onto one field of the wafer, delivering a controlled dose in sharp focus; the exposure is scanned or stepped across the wafer field by field.",
      "Post-exposure bake: heating drives the light-triggered chemistry (e.g. in chemically amplified resists) to completion and smooths out standing-wave effects.",
      "Develop: a developer solution removes the resist that should go — the exposed regions for a positive resist, the unexposed regions for a negative resist — leaving the patterned stencil.",
      "Inspect / measure: the printed pattern's feature size (CD) and alignment (overlay) are measured before the wafer moves on; if the print is off, resist can be stripped and the layer reworked (unlike the etch that follows).",
    ],
    steps: [
      { name: "Surface preparation", detail: "Clean and prime the wafer surface so resist adheres uniformly and repeatably." },
      { name: "Resist coat", detail: "Apply a thin, uniform photoresist film — thickness and uniformity are set here and matter for the whole layer." },
      { name: "Soft bake", detail: "Remove solvent and stabilize the film so exposure behaves predictably." },
      { name: "Alignment", detail: "Read alignment marks and position the wafer so the new layer registers to the layers below." },
      { name: "Exposure", detail: "Project the mask pattern onto the resist at the right dose and focus, field by field across the wafer." },
      { name: "Post-exposure bake", detail: "Complete the light-driven chemistry and reduce standing-wave roughness." },
      { name: "Development", detail: "Wash away the soluble resist to reveal the physical pattern that guides the next step." },
      { name: "Pattern inspection", detail: "Measure critical dimension and overlay; rework the resist if the print is out of spec." },
    ],
    science: [
      "Photoresist is a polymer whose solubility changes where light hits it. A positive resist becomes soluble where exposed (the pattern matches the clear parts of the mask); a negative resist becomes insoluble where exposed (the pattern is reversed). Which one is used depends on the layer.",
      "Resolution is governed by diffraction: light passing through fine mask features spreads out, blurring the smallest details. The Rayleigh relation Resolution ≈ k₁ · λ / NA captures the three levers — wavelength λ, numerical aperture NA, and the process factor k₁.",
      "Shorter wavelength (193 nm DUV → 13.5 nm EUV) and higher NA both sharpen the smallest printable feature. NA is raised with better/larger optics and, for DUV, immersion (water between the last lens and the wafer). EUV uses reflective mirror optics rather than transmissive lenses because 13.5 nm light is absorbed by glass and air, so it runs in vacuum.",
      "The k₁ factor lumps together the process cleverness — illumination shaping, resist chemistry, mask corrections, and multiple patterning — that pushes features below what wavelength and NA alone would allow. Lowering k₁ is why 193 nm light kept printing far below 193 nm for years.",
      "Depth of focus — the range over which the image stays sharp — shrinks as resolution improves, which is why wafer flatness, focus control, and thin uniform resist become harder and more important at the leading edge.",
    ],
    equipment: [
      { name: "Coater / developer (track)", detail: "Coats resist, bakes, and develops; usually linked directly to the exposure tool so wafers flow through as one process." },
      { name: "Scanner / stepper", detail: "The exposure tool: it holds the reticle, projects and demagnifies the pattern, and steps/scans it across the wafer." },
      { name: "Illumination system", detail: "The light source and optics that shape how the mask is lit — the shape of the illumination is itself tuned to improve resolution." },
      { name: "Projection optics", detail: "Precision lenses (DUV) or mirrors (EUV) that form the demagnified image of the mask on the resist." },
      { name: "Wafer stage", detail: "Moves and holds the wafer with extreme positional accuracy, stepping between fields and keeping focus during the scan." },
      { name: "Alignment & focus systems", detail: "Sensors that read alignment marks and wafer height so each field lands in the right place, in focus." },
      { name: "Reticle / mask", detail: "The patterned master (typically 4× the printed size) that carries one layer's design into the tool." },
      { name: "Metrology tools", detail: "Separate CD, overlay, and defect-inspection systems that measure the printed result and feed process control." },
    ],
    materials: [
      { name: "Photoresist", detail: "The light-sensitive polymer that records the pattern; formulated differently for DUV vs EUV and for each layer's needs." },
      { name: "Anti-reflective coatings", detail: "Thin layers above or below the resist that suppress reflections which would otherwise distort the printed feature." },
      { name: "Developer & solvents", detail: "Chemistries that dissolve the intended resist regions cleanly without attacking the rest." },
      { name: "Photomask / reticle blank", detail: "A flat, ultra-clean substrate carrying the absorber pattern (with a pellicle to keep particles out of focus)." },
      { name: "Immersion fluid (DUV)", detail: "Ultra-pure water placed between the final optic and the wafer to raise the effective numerical aperture." },
    ],
    parameters: [
      { name: "Exposure dose", detail: "How much light energy the resist receives; too little or too much shifts feature size and can leave resist behind or wash it away." },
      { name: "Focus", detail: "How sharply the image lands on the resist; going out of focus blurs edges and narrows the usable process window." },
      { name: "Overlay / alignment", detail: "How accurately the new layer lands on the previous ones; small errors can misconnect features between layers." },
      { name: "Resist thickness & uniformity", detail: "Set at the coat step; affects dose response, focus margin, and how faithfully the pattern transfers." },
      { name: "Critical dimension (CD)", detail: "The measured width of the printed features — the number the whole step is trying to hit consistently across the wafer and lot." },
      { name: "Process window", detail: "The combined range of dose and focus over which features still meet spec; a wider window means a more robust, higher-yielding process." },
    ],
    parametersNote:
      "Exact doses, wavelengths per layer, NA values, and CD targets are technology-, tool-, and process-dependent and are set by each fab; the numbers here are illustrative of the physics, not a recipe.",
    visual:
      "Light from the source passes through the patterned mask/reticle, is focused and demagnified by the projection optics, and prints a sharp, shrunken image onto the photoresist on the wafer — one field at a time.",
    terminology: [
      { term: "Photoresist", def: "A light-sensitive coating that records the mask pattern and becomes a temporary stencil after developing." },
      { term: "Mask vs reticle", def: "A reticle carries one field's pattern (often 4×) that is projected and stepped across the wafer; 'mask' is the general term, and in 1:1 contact/proximity printing the mask covers the whole wafer at once." },
      { term: "Scanner / stepper", def: "The exposure tool that projects the reticle pattern onto the wafer, field by field." },
      { term: "Numerical aperture (NA)", def: "A measure of how much light the optics collect; higher NA resolves finer features." },
      { term: "k₁ factor", def: "A process factor bundling all the tricks (illumination, resist, mask correction, multiple patterning) that push features below the raw wavelength/NA limit." },
      { term: "DUV", def: "Deep-ultraviolet lithography (e.g. 193 nm), including immersion; still patterns most layers." },
      { term: "EUV", def: "Extreme-ultraviolet lithography at 13.5 nm, using reflective mirror optics in vacuum for the smallest features." },
      { term: "Critical dimension (CD)", def: "The width of the smallest printed features, the key quantity litho controls." },
      { term: "Overlay", def: "How accurately a new layer aligns to the layers already on the wafer." },
      { term: "Depth of focus", def: "The range of wafer position over which the projected image stays acceptably sharp." },
    ],
    formula: {
      expression: "Resolution ≈ k₁ · λ / NA",
      caption:
        "The Rayleigh criterion. It tells an engineer which levers move the smallest printable feature: shorter wavelength λ, larger numerical aperture NA, and a smaller process factor k₁ — not just wavelength.",
    },
    example:
      "To connect a metal wire to a contact underneath, litho must both print the wire narrow enough (resolution) and land it squarely on the contact (overlay). If the wire prints fine but the layer is shifted, the wire misses the contact and the circuit fails — a vivid reminder that alignment matters as much as feature size.",
    defects: [
      "Under- or over-exposure: wrong dose leaves features too wide, too narrow, or with residual resist ('scumming') that blocks the next step.",
      "Defocus: features print blurred or with sloped sidewalls when the image falls outside the depth of focus.",
      "Overlay error: the layer lands shifted or rotated relative to the layers below, misconnecting features between layers.",
      "Resist defects and particles: pinholes, bubbles, or airborne/particle contamination create missing or extra pattern that can kill a chip.",
      "Pattern collapse: very tall, thin resist lines topple during development as surface tension pulls them over.",
      "CD variation and line-edge roughness (LER): feature width drifts across the wafer or wiggles along an edge, hurting device matching and performance.",
      "Incomplete development: developer fails to fully clear the intended resist, leaving residue that distorts the transferred pattern.",
    ],
    metrology: [
      "Critical-dimension metrology measures printed feature widths (e.g. with CD-SEM or scatterometry) to confirm the pattern hit its target across the wafer.",
      "Overlay metrology measures how well the new layer aligns to previous layers using dedicated targets, feeding corrections back to the scanner.",
      "Defect inspection scans wafers optically or with e-beam to find particles, pattern defects, and repeating (mask-related) faults.",
      "The key mindset: litho makes the pattern, metrology measures it. Making and measuring are separate jobs — measurement is what closes the loop and keeps the process in control run to run.",
    ],
    yieldImpact: [
      "Because litho repeats on every layer, a small systematic error is multiplied many times over a wafer's life — a modest CD or overlay drift on several layers can quietly erode yield.",
      "A single killer particle or pattern defect in the wrong place can disable an entire chip, so defect density in litho strongly gates how many good dies a wafer yields.",
      "A wider process window (dose × focus × overlay margin) is worth as much as raw resolution: it is what keeps yield high as tools and materials drift.",
    ],
    designImplications: [
      "Design rules encode what litho can reliably print: minimum feature sizes, spacings, and shapes that stay inside the process window.",
      "Layouts are drawn to be manufacturable, not just electrically ideal — restricted, regular patterns print more predictably than arbitrary geometry.",
      "The design must tolerate real overlay and CD variation, leaving enough margin that layers still connect when every step is slightly off.",
      "At the leading edge, what the design team can draw and what the litho team can print are decided together — the layout is co-designed with the patterning process.",
    ],
    industryContext: [
      "Lithography tools are among the most complex and capital-intensive machines in manufacturing, and the litho module is often the largest single equipment investment and throughput bottleneck in a fab.",
      "The ecosystem is deep: scanner makers, mask/reticle shops, resist and materials suppliers, and metrology vendors all have to advance together for a new node to work.",
      "Progress increasingly comes from squeezing k₁ — better illumination, resist, mask correction, and patterning schemes — as much as from moving to shorter wavelengths, because each wavelength jump is enormously expensive and hard-won.",
    ],
    commonMistakes: [
      "Thinking litho builds the transistor. It only prints a temporary resist stencil; etch, deposition, and implant create the actual device using that stencil.",
      "Believing the whole chip is drawn in a single flash of light. The pattern is projected field by field and the whole sequence is repeated for every layer.",
      "Assuming feature size equals the light's wavelength. Process tricks (the k₁ factor) print features well below the wavelength — 193 nm light patterned features far smaller than 193 nm for years.",
      "Thinking EUV is 'the' lithography. EUV handles the smallest layers, but DUV and older methods still pattern most layers and remain essential.",
      "Focusing only on resolution and forgetting overlay. Landing each layer accurately on the previous ones is just as critical as printing small features.",
    ],
    realWorld:
      "Leading-edge scanners are among the most complex machines ever built, tracking and positioning the wafer thousands of times a second at picometer-scale precision, and no single company makes an entire advanced litho system alone — it depends on a worldwide supply chain of optics, sources, masks, resists, and metrology.",
    deepDives: [
      {
        id: "physics-equations",
        level: "engineer",
        title: "The physics, in equations",
        intro:
          "Everything litho can and cannot print traces back to diffraction — light bending as it passes fine mask features. A handful of relationships turn that physics into numbers an engineer can reason about. In each one, the wavelength, the optics, and a process factor appear again and again.",
        equations: [
          {
            name: "Numerical aperture",
            expression: "NA = n · sin θ",
            variables: [
              { symbol: "NA", meaning: "numerical aperture of the projection optics", unit: "dimensionless" },
              { symbol: "n", meaning: "refractive index of the medium between the last optic and the wafer", unit: "dimensionless" },
              { symbol: "θ", meaning: "half-angle of the widest cone of light the optics can focus", unit: "degrees or radians" },
            ],
            meaning:
              "NA measures how steep a cone of light the optics can collect and focus. Steeper cones capture more of the diffracted light that carries fine-feature information, so a higher NA prints finer features.",
            assumptions: [
              "Well-corrected optics with negligible aberrations.",
              "n is the index at the wafer: 1 in air/vacuum, about 1.44 for purified water at 193 nm.",
            ],
            example:
              "Dry 193 nm systems image through air (n = 1), so NA stays below 1. Flooding the gap with water (n ≈ 1.44) — immersion — lets NA reach roughly 1.35.",
            sensitivity: [
              "Wider light cone (larger θ) → higher NA → finer features.",
              "Higher medium index n (immersion) → higher NA at the same wavelength.",
              "NA above 1 is only reachable with immersion; in air or vacuum it is capped below 1.",
            ],
          },
          {
            name: "Resolution (Rayleigh criterion)",
            expression: "R = k₁ · λ / NA",
            variables: [
              { symbol: "R", meaning: "smallest reliably printable feature (half-pitch)", unit: "nm" },
              { symbol: "k₁", meaning: "process factor bundling illumination, resist, mask and patterning technique", unit: "dimensionless" },
              { symbol: "λ", meaning: "exposure wavelength", unit: "nm" },
              { symbol: "NA", meaning: "numerical aperture", unit: "dimensionless" },
            ],
            meaning:
              "Sets the smallest half-pitch the process can resolve. Shorter wavelength, higher NA, and a lower k₁ all shrink R — which is why no single lever tells the whole story.",
            assumptions: [
              "Projection imaging operating near the diffraction limit.",
              "k₁ absorbs everything not in λ or NA; the hard physical floor for a single exposure is k₁ ≈ 0.25.",
              "R is a resolution limit, not a guaranteed manufacturable size (see the process-window deep dive).",
            ],
            example:
              "193 nm immersion at NA = 1.35 with k₁ = 0.28 → R ≈ 0.28 × 193 / 1.35 ≈ 40 nm. EUV at 13.5 nm, NA = 0.33, k₁ = 0.4 → R ≈ 16 nm.",
            sensitivity: [
              "Shorter λ → smaller R (the leap from 193 nm DUV to 13.5 nm EUV).",
              "Higher NA → smaller R (immersion, and later high-NA EUV).",
              "Lower k₁ → smaller R, but k₁ cannot fall below ≈ 0.25 for a single exposure — which is exactly what forces fabs toward multiple patterning.",
            ],
          },
          {
            name: "Depth of focus",
            expression: "DOF = k₂ · λ / NA²",
            variables: [
              { symbol: "DOF", meaning: "range of wafer height over which the image stays sharp", unit: "nm" },
              { symbol: "k₂", meaning: "process factor (how forgiving the process is)", unit: "dimensionless" },
              { symbol: "λ", meaning: "exposure wavelength", unit: "nm" },
              { symbol: "NA", meaning: "numerical aperture", unit: "dimensionless" },
            ],
            meaning:
              "How far the wafer can drift from perfect focus before features degrade. Because NA is squared, the very optics that sharpen resolution shrink the focus margin — the core tension of high-resolution imaging.",
            assumptions: [
              "Scalar imaging approximation.",
              "Single exposure; real budgets shrink further once wafer non-flatness and surface topography are added.",
            ],
            example:
              "193 nm at NA = 1.35 with k₂ = 0.5 → DOF ≈ 0.5 × 193 / 1.35² ≈ 53 nm — only tens of nanometres, which is why wafer flatness and focus control are so demanding.",
            sensitivity: [
              "Higher NA → sharply smaller DOF (NA is squared) — resolution and focus margin pull in opposite directions.",
              "Shorter λ → smaller DOF.",
              "Larger k₂ (a more forgiving process) → larger DOF.",
            ],
          },
          {
            name: "Aerial image contrast",
            expression: "C = (I_max − I_min) / (I_max + I_min)",
            variables: [
              { symbol: "C", meaning: "contrast of the projected light pattern (0 to 1)", unit: "dimensionless" },
              { symbol: "I_max", meaning: "peak intensity in the bright parts of the image", unit: "intensity (a.u.)" },
              { symbol: "I_min", meaning: "minimum intensity in the dark parts of the image", unit: "intensity (a.u.)" },
            ],
            meaning:
              "How sharply the projected light swings between bright and dark at a feature edge. High contrast makes a crisp resist edge; low contrast blurs it, adding roughness and shrinking the process window. Engineers often track the closely related NILS (normalized image log-slope) as the practical edge-sharpness metric.",
            assumptions: [
              "Describes the optical (aerial) image only, before the resist reacts.",
              "Real edge quality also depends on resist chemistry and diffusion blur.",
            ],
            example:
              "As a pattern's pitch approaches λ/NA, diffracted orders are lost and I_min climbs toward I_max, so contrast falls and features 'wash out' — even when the resolution formula says the size is reachable.",
            sensitivity: [
              "Pitch shrinking toward the resolution limit → lower contrast.",
              "Illumination shaping, phase-shift masks, and higher NA → higher contrast.",
              "Higher contrast → sharper edges, less line-edge roughness, and a wider process window.",
            ],
          },
        ],
      },
      {
        id: "process-window",
        level: "engineer",
        title: "Resolution vs process window",
        intro:
          "Reaching a resolution once, on one wafer in a lab, is not the same as manufacturing at that resolution. The gap between the two is the process window.",
        bullets: [
          "The resolution formula gives the smallest feature the optics can form. Manufacturing must print that feature on every field, every wafer, and every lot — despite drift in focus, dose, materials, and the incoming surface.",
          "The process window is the overlap of dose and focus ranges over which every feature still meets its critical-dimension spec. A wide window means robust, high-yielding production; a razor-thin window means the size is a demonstration, not a product.",
          "Exposure latitude (dose margin) and depth of focus trade against each other: you can spend margin on one only by giving it up on the other, and the usable window is their overlap.",
          "Pushing k₁ lower or NA higher to reach a smaller feature usually shrinks the window too — lower contrast and smaller depth of focus — so raw resolution and robustness pull in opposite directions.",
          "This is why a research tool can show a feature a fab cannot yet ship: hitting a resolution once is not the same as centring a wide, stable process window on it.",
        ],
        note:
          "Rule of thumb: resolution says what is possible; the process window says what is manufacturable. Yield lives in the window, not at the limit.",
      },
      {
        id: "overlay-deep",
        level: "advanced",
        title: "Overlay & layer-to-layer registration",
        intro:
          "Resolution is about the size of features on one layer. Overlay is about landing each new layer accurately on the layers already built — a separate problem that becomes just as limiting as features shrink.",
        bullets: [
          "Alignment: the scanner reads alignment marks printed on earlier layers and positions the wafer so the new pattern registers to them before exposing.",
          "Overlay error: the residual misregistration between layers that remains after alignment, measured on dedicated overlay targets.",
          "Overlay budget: the total misregistration a layer can tolerate, divided among many contributors — stage, alignment sensors, mask, wafer distortion, and errors inherited from prior layers. Each source must stay a small fraction of the whole.",
          "Wafer-stage accuracy: the stage must position and track the wafer with picometre-scale precision, thousands of times a second, while scanning each field.",
          "Process-induced distortion: deposition, etch, CMP, and thermal cycles physically warp the wafer between layers, shifting features non-uniformly; scanners model and correct these per wafer and per field.",
          "Why it scales harder: overlay must stay a fixed fraction of feature size, so the budget shrinks as features shrink — but the physical distortions do not shrink as fast. A metal line that prints perfectly but lands off its contact still fails, so overlay often limits scaling as much as resolution does.",
        ],
      },
      {
        id: "patterning-strategies",
        level: "advanced",
        title: "Patterning strategies",
        intro:
          "Because a single exposure bottoms out at k₁ ≈ 0.25, fabs use several strategies to reach denser patterns. These are conceptual families, not recipes.",
        bullets: [
          "Single patterning: one mask, one exposure per layer — the simplest and cheapest option, limited by the single-exposure resolution floor.",
          "Multiple patterning: split one dense layer across several masks and exposures so each sub-pattern is coarser than the final pitch, then combine them — for example litho-etch-litho-etch (LELE).",
          "Pitch splitting: decompose a dense pattern into two or more interleaved patterns at relaxed pitch, each printed separately — a common form of multiple patterning.",
          "Spacer-based (self-aligned) patterning: deposit thin spacers on the sidewalls of a printed template, then remove the template; the spacers define features at a fraction of the original pitch (SADP/SAQP). Density is set by film thickness rather than the exposure, giving excellent uniformity.",
          "EUV patterning: the shorter 13.5 nm wavelength restores single-exposure printing for many layers that DUV could reach only with multiple patterning — simplifying some flows, though the very hardest layers may still need EUV multiple patterning.",
        ],
        note:
          "Why multiple patterning adds complexity: each extra exposure means more masks, more process steps, more cost — and its own overlay error between the sub-patterns. So multiple patterning spends overlay budget and multiplies defect and metrology load. It trades tool resolution for process complexity.",
      },
      {
        id: "computational-litho",
        level: "advanced",
        title: "Computational lithography",
        intro:
          "At the leading edge the mask is computed, not drawn one-to-one. Software predicts how diffraction and resist will distort the pattern and pre-compensates for it.",
        bullets: [
          "OPC (optical proximity correction): pre-distorts mask shapes — adding serifs, biasing widths, and inserting sub-resolution assist features — so diffraction produces the intended shape on the wafer.",
          "Source-mask optimization (SMO): jointly optimizes the illumination shape and the mask pattern to maximize contrast and process window for a given design.",
          "Inverse lithography (ILT): computes a freeform mask directly from the desired wafer image, rather than editing drawn shapes — often yielding curved, non-intuitive mask geometry.",
          "Process-window optimization: tunes the corrections so features meet spec across the whole expected dose and focus range, not only at the nominal setting.",
          "Simulation: physical models of the optics and resist predict what will actually print, so corrections are verified in software before an expensive mask is ever made.",
        ],
        note:
          "Why the mask is not the wafer geometry: diffraction and resist blur transform the pattern between mask and wafer. A mask shaped exactly like the target would print rounded, shrunken, or bridged features — so the mask is deliberately made to look 'wrong' in order for the wafer to come out 'right.'",
      },
      {
        id: "control-loop",
        level: "advanced",
        title: "Metrology & the process-control loop",
        intro:
          "Photolithography is best understood not as a fixed recipe but as a feedback-control system: measure the result, correct the process, and apply the correction to the next wafers.",
        flow: [
          "Design",
          "Mask",
          "Exposure",
          "Development",
          "Measurement (CD, overlay, defects)",
          "Process correction",
          "Next wafer",
        ],
        bullets: [
          "After patterning, wafers are measured for critical dimension, overlay, and defects, and the results are compared to targets.",
          "Corrections — dose, focus, and per-field alignment offsets — are fed back to the scanner and track so the next wafers are re-centred in the process window. In fabs this is called advanced process control (APC).",
          "Because litho repeats on every layer, this loop runs continuously: the fab is a controller constantly nudging the process against drift, not a machine running one frozen setting.",
          "Rework is possible before etch: an out-of-spec resist pattern can be stripped and re-exposed — a safety valve litho has that later, permanent steps (etch, implant) do not.",
        ],
      },
      {
        id: "researcher-frontiers",
        level: "researcher",
        title: "Research frontiers & open problems",
        intro:
          "The topics below separate what is in high-volume production today from what is still being developed or ramped — a distinction worth keeping clear.",
        bullets: [
          "Stochastic variability: at EUV each feature is formed from relatively few photons and resist molecules, so shot noise causes random CD variation and rare 'stochastic' defects (missing or merged features) — a leading yield concern at the smallest nodes.",
          "EUV photon statistics: 13.5 nm photons each carry more energy, so a given dose delivers fewer photons than DUV; fewer photons per feature raise statistical noise, tying dose, resolution, and defectivity together.",
          "Source power: EUV throughput depends on how much stable 13.5 nm power the source delivers; more power allows a higher dose (less stochastic noise) while keeping wafers-per-hour economic — an ongoing engineering push.",
          "Resist chemistry trade-offs: resolution, line-edge roughness, and sensitivity form a trilemma (the 'RLS trade-off') — improving one usually worsens another; metal-oxide and other new resists aim to break it.",
          "Roughness (LER/LWR): nanometre-scale edge wiggle feeds directly into transistor variability, making it a combined materials, imaging, and stochastic problem.",
          "Defectivity: finding and eliminating rare, pattern-dependent, and stochastic defects at production scale drives much inspection and resist research.",
          "Mask effects: EUV uses a reflective, 3D mask illuminated at an angle, causing shadowing and imaging asymmetries (mask-3D effects) that source-mask optimization must correct.",
          "Pellicles: thin membranes that keep particles off the mask must transmit EUV with minimal loss and survive high source power — a materials problem unique to EUV.",
          "High-NA EUV: raising EUV numerical aperture from about 0.33 toward roughly 0.55 extends single-exposure resolution, but uses anamorphic optics (different magnification in x and y), halves the exposure field, and tightens depth of focus — reshaping masks, resists, and integration. It is ramping, not mature.",
          "Process integration: none of these live in isolation — resist, mask, source, optics, overlay, etch, and design must advance together for a node to yield, so integration is often the real bottleneck.",
        ],
        note:
          "In production today: DUV (including immersion), EUV at NA ≈ 0.33, OPC/SMO, multiple patterning, and advanced process control. Active R&D or ramping: high-NA EUV, curvilinear ILT masks, next-generation resists, and stochastic-defect control.",
      },
    ],
    keyTakeaways: [
      "Photolithography prints each layer's pattern onto the wafer with light and photoresist; it makes a temporary stencil, not the finished device.",
      "The pattern is projected field by field and the whole step is repeated for every layer — chip making is many interleaved litho cycles, not one.",
      "Resolution follows k₁ · λ / NA: wavelength, optics, and process cleverness together — not wavelength alone — set the smallest feature.",
      "Overlay (aligning each layer to the ones below) matters as much as resolution; both must be right at once.",
      "DUV and EUV coexist by layer, and yield hinges on defects, CD/overlay control, and a wide process window — which is why litho is measured as carefully as it is made.",
    ],
    references: [
      {
        title: "Lithography principles",
        publisher: "ASML",
        url: "https://www.asml.com/en/technology/lithography-principles",
        kind: "vendor",
        note: "Accessible overview of how projection lithography, DUV, and EUV work.",
      },
      {
        title: "The Rayleigh criterion",
        publisher: "ASML",
        url: "https://www.asml.com/en/technology/lithography-principles/rayleigh-criterion",
        kind: "vendor",
        note: "Explains how k₁, wavelength, and numerical aperture set resolution.",
      },
      {
        title: "Pushing k1 further",
        publisher: "ASML",
        url: "https://www.asml.com/en/technology/lithography-principles/pushing-k1-further",
        kind: "vendor",
        note: "How illumination, resist, and mask techniques print below the wavelength.",
      },
      {
        title: "Silicon VLSI Technology: Fundamentals, Practice, and Modeling",
        author: "J. D. Plummer, M. D. Deal, P. B. Griffin",
        publisher: "Prentice Hall",
        year: 2000,
        kind: "textbook",
        note: "Standard reference covering lithography within the full process flow.",
      },
      {
        title: "SEMI — global industry association for semiconductor manufacturing",
        publisher: "SEMI",
        url: "https://www.semi.org",
        kind: "standards",
        note: "Industry standards and background on manufacturing equipment and materials.",
      },
    ],
    relatedLessons: ["photoresist", "etching", "deposition", "metrology"],
  }),
  L({
    slug: "etching",
    pathId: "manufacturing",
    order: 8,
    title: "Etching",
    summary: "Removing material where the resist doesn't protect it.",
    whatYoullLearn: ["Wet vs dry etching", "Anisotropy and selectivity", "Why plasma etch dominates"],
    whyItMatters: "Etching transfers the resist pattern into the actual device layers.",
    explanation: [
      "Etching removes exposed material. Wet etching uses chemical baths (often isotropic); dry/plasma etching uses reactive ions and can be highly anisotropic, cutting straight down to make vertical features.",
      "Good etch processes are selective (attack the target layer, not the mask or underlayer) and precisely controlled.",
    ],
    visual: "Plasma ions etching straight-walled trenches through openings in the resist.",
    terminology: [
      { term: "Anisotropic", def: "Etching preferentially in one direction (vertical)." },
      { term: "Selectivity", def: "Etching the target far faster than other materials." },
      { term: "RIE", def: "Reactive-ion etching, a common plasma etch." },
    ],
    example: "Deep, vertical trenches for capacitors or vias rely on highly anisotropic plasma etch.",
    commonMistakes: ["Assuming etching is just 'dissolving' — plasma etch is physical + chemical and directional."],
    realWorld: "3D structures (FinFETs, 3D NAND) depend on precise high-aspect-ratio etching.",
    relatedLessons: ["photoresist", "lithography", "deposition"],
  }),
  L({
    slug: "ion-implantation",
    pathId: "manufacturing",
    order: 9,
    title: "Ion implantation",
    summary: "Firing dopant ions into the wafer to create n- and p-type regions precisely.",
    whatYoullLearn: ["How implantation doses dopants", "Dose and energy control", "Why annealing follows"],
    whyItMatters: "Implantation is how the doped regions of every transistor are placed exactly.",
    explanation: [
      "Dopant atoms are ionised, accelerated, and fired into the wafer; the resist/oxide mask blocks them everywhere except the intended regions. Dose (ions per area) and energy (depth) are tightly controlled.",
      "Implantation damages the crystal, so a high-temperature anneal follows to repair the lattice and activate the dopants.",
    ],
    visual: "An ion beam striking the wafer through mask openings, doping only the exposed regions.",
    terminology: [
      { term: "Dose", def: "Number of implanted ions per unit area." },
      { term: "Anneal", def: "A heat step that repairs damage and activates dopants." },
      { term: "Junction depth", def: "How deep the doped region extends." },
    ],
    example: "A shallow, high-dose implant forms a MOSFET's source/drain; a light implant sets the channel.",
    commonMistakes: ["Forgetting that implantation must be followed by annealing to work."],
    realWorld: "Precise implants define transistor threshold voltages and junctions.",
    relatedLessons: ["doping", "n-type", "p-type"],
  }),
  L({
    slug: "cmp",
    pathId: "manufacturing",
    order: 10,
    title: "CMP",
    summary: "Chemical-mechanical planarisation — polishing each layer flat before the next.",
    whatYoullLearn: ["Why planarity is essential", "How CMP works", "Where CMP is used"],
    whyItMatters: "Without flat surfaces between layers, lithography can't stay in focus and wiring fails.",
    explanation: [
      "CMP presses the wafer against a rotating pad with an abrasive, chemically active slurry, removing high spots to leave a flat surface. It is used many times through the process.",
      "Flatness (planarity) keeps each new lithography layer sharp and lets many metal layers stack reliably.",
    ],
    visual: "A wafer pressed face-down on a spinning polishing pad flooded with slurry.",
    terminology: [
      { term: "Planarisation", def: "Making a surface flat." },
      { term: "Slurry", def: "The abrasive, reactive polishing fluid." },
    ],
    example: "After depositing metal into trenches, CMP polishes back the excess to leave flat, isolated wires.",
    commonMistakes: ["Thinking CMP is a one-time step — it recurs at nearly every layer."],
    realWorld: "Copper interconnect (the damascene process) depends entirely on CMP.",
    relatedLessons: ["deposition", "metallization"],
  }),
  L({
    slug: "metallization",
    pathId: "manufacturing",
    order: 11,
    title: "Metallization",
    summary: "Wiring the transistors together with layers of metal interconnect.",
    whatYoullLearn: ["What interconnect does", "The damascene copper process", "Why many metal layers exist"],
    whyItMatters: "Transistors are useless until connected; interconnect increasingly limits performance.",
    explanation: [
      "Metallization builds the wiring that links transistors into circuits. Modern chips use copper deposited into etched trenches and vias (the damascene process), separated by insulating dielectric, then planarised by CMP.",
      "Advanced chips stack 10–20+ metal layers, from fine local wires to thick global power lines.",
    ],
    visual: "Stacked metal layers connected by vertical vias, sitting above the transistor layer.",
    terminology: [
      { term: "Interconnect", def: "The metal wiring linking devices." },
      { term: "Via", def: "A vertical connection between metal layers." },
      { term: "Damascene", def: "Filling etched trenches with copper, then polishing back." },
    ],
    example: "A signal may travel up through several vias and metal layers to cross the chip.",
    commonMistakes: ["Assuming wiring is an afterthought — interconnect delay and power are first-order concerns."],
    realWorld: "Interconnect resistance/capacitance (RC delay) is a major limiter at advanced nodes.",
    relatedLessons: ["cmp", "deposition", "physical-design"],
  }),
  L({
    slug: "metrology",
    pathId: "manufacturing",
    order: 12,
    title: "Metrology & inspection",
    summary: "Measuring dimensions and finding defects at every critical step.",
    whatYoullLearn: ["Metrology vs inspection", "What gets measured", "Why it protects yield"],
    whyItMatters: "You can't control what you can't measure — metrology keeps a 1000-step process on target.",
    explanation: [
      "Metrology measures features (film thickness, critical dimensions, overlay alignment); inspection finds defects (particles, pattern errors). Both run throughout the line, often on sampled wafers.",
      "Fast, accurate measurement catches drift and defects early, before they ruin many wafers.",
    ],
    visual: "A wafer scanned by an optical/e-beam tool producing a defect map with flagged spots.",
    terminology: [
      { term: "Critical dimension (CD)", def: "The size of the smallest patterned features." },
      { term: "Overlay", def: "Alignment error between layers." },
      { term: "Yield", def: "Fraction of good dies per wafer." },
    ],
    example: "An overlay tool checks that a new layer aligns to the previous one within a few nanometres.",
    commonMistakes: ["Confusing metrology (measuring) with inspection (defect finding) — they're complementary."],
    realWorld: "E-beam and optical inspection are essential for ramping yield on new nodes.",
    relatedLessons: ["lithography", "wafer-test"],
  }),
  L({
    slug: "wafer-test",
    pathId: "manufacturing",
    order: 13,
    title: "Wafer test",
    summary: "Testing each die on the wafer before it's cut out.",
    whatYoullLearn: ["What wafer sort does", "Why test before dicing", "How bad dies are marked"],
    whyItMatters: "Testing early avoids spending packaging cost on dead chips.",
    explanation: [
      "In wafer test (wafer sort), a probe card contacts each die's pads and runs electrical tests. Failing dies are recorded so they can be discarded after dicing.",
      "This screens out defects before the expensive packaging steps.",
    ],
    visual: "A probe card touching down on each die across the wafer, building a pass/fail map.",
    terminology: [
      { term: "Wafer sort", def: "Electrical test of dies on the wafer." },
      { term: "Probe card", def: "The fixture that contacts die pads." },
      { term: "Bin", def: "A category assigned by test results." },
    ],
    example: "A die that fails at-speed tests is binned as bad and not packaged.",
    commonMistakes: ["Assuming all testing happens after packaging — much is done at wafer level first."],
    realWorld: "Speed binning at test sorts otherwise-identical CPUs into different products.",
    relatedLessons: ["metrology", "dicing", "final-test"],
  }),
  L({
    slug: "dicing",
    pathId: "manufacturing",
    order: 14,
    title: "Dicing",
    summary: "Cutting the wafer into individual dies.",
    whatYoullLearn: ["How wafers are singulated", "Dicing methods", "Why edge quality matters"],
    whyItMatters: "Dicing turns one wafer into the many individual chips that get packaged.",
    explanation: [
      "The wafer is mounted on tape and cut along the scribe lines between dies, using a precision saw or laser. Only the dies that passed wafer test proceed.",
      "Clean cuts avoid chipping and cracks that would weaken the die.",
    ],
    visual: "A diamond saw (or laser) cutting the wafer along the grid of scribe lines into separate dies.",
    terminology: [
      { term: "Singulation", def: "Separating the wafer into individual dies." },
      { term: "Scribe line", def: "The spacing between dies where cuts are made." },
    ],
    example: "Laser dicing can reduce mechanical stress on fragile advanced dies.",
    commonMistakes: ["Overlooking that dicing damage can crack dies if not controlled."],
    realWorld: "Thin dies for stacked packages need especially gentle singulation.",
    relatedLessons: ["wafer-test", "packaging"],
  }),
  L({
    slug: "packaging",
    pathId: "manufacturing",
    order: 15,
    title: "Packaging",
    summary: "Encasing and connecting the die so it can be used on a board.",
    whatYoullLearn: ["Why chips are packaged", "Core packaging functions", "Where advanced packaging fits"],
    whyItMatters: "The package protects the die, connects it to the world, and removes its heat.",
    explanation: [
      "Packaging mounts the die, connects its pads to external terminals (wire bonds or flip-chip bumps), and encapsulates it for protection and heat removal. It also matches the tiny die pitch to the coarser board.",
      "Advanced packaging (chiplets, 2.5D/3D) increasingly determines system performance — the full Packaging path covers it.",
    ],
    visual: "A die bonded into a package, connected by bonds/bumps, and sealed, with leads/balls underneath.",
    visualKey: "wafer-to-package",
    terminology: [
      { term: "Package", def: "The housing that protects and connects the die." },
      { term: "Interconnect (package)", def: "Wire bonds or solder bumps linking die to package." },
      { term: "Encapsulation", def: "Protective sealing of the die." },
    ],
    example: "A processor die is flip-chip bonded to a substrate with thousands of solder bumps.",
    commonMistakes: ["Treating packaging as trivial — it's now a key performance and cost lever."],
    realWorld: "Advanced packaging enables chiplet-based products and high-bandwidth memory.",
    relatedLessons: ["dicing", "final-test", "advanced-packaging"],
  }),
  L({
    slug: "final-test",
    pathId: "manufacturing",
    order: 16,
    title: "Final test",
    summary: "Testing the finished, packaged part before it ships.",
    whatYoullLearn: ["What final test covers", "Burn-in and reliability", "Why re-test after packaging"],
    whyItMatters: "Final test is the last guarantee that a shipped chip actually works.",
    explanation: [
      "After packaging, each part is tested again — often across voltage, temperature, and speed — because packaging can introduce new faults. Some parts undergo burn-in to weed out early-life failures.",
      "Passing parts are graded, marked, and shipped.",
    ],
    visual: "Packaged parts in a handler being tested across temperature and speed, then binned.",
    terminology: [
      { term: "Final/package test", def: "Testing the packaged device." },
      { term: "Burn-in", def: "Stress at elevated voltage/temperature to expose weak parts." },
    ],
    example: "Automotive chips face especially stringent final test and burn-in for reliability.",
    commonMistakes: ["Assuming wafer test makes final test redundant — packaging adds new failure modes."],
    realWorld: "Test cost is a meaningful fraction of total chip cost, especially for complex parts.",
    relatedLessons: ["wafer-test", "packaging"],
  }),

  // ============================ PATH 3: IC DESIGN ============================
  L({
    slug: "architecture",
    pathId: "ic-design",
    order: 1,
    title: "Architecture",
    summary: "Defining what the chip does and how its blocks are organised.",
    whatYoullLearn: ["What chip architecture decides", "Specification and trade-offs", "Where the flow begins"],
    whyItMatters: "Architecture sets the performance, power, and area envelope before any gate is drawn.",
    explanation: [
      "Architecture translates product requirements into a high-level structure: what processing blocks exist, how they connect, memory hierarchy, and interfaces. Key trade-offs are performance, power, area, and cost (PPA/C).",
      "Decisions here dominate the outcome — no downstream step can fully fix a poor architecture.",
    ],
    visual: "A block diagram: cores, caches, interconnect fabric, memory controllers, and I/O.",
    terminology: [
      { term: "PPA", def: "Performance, power, and area — the core design trade-offs." },
      { term: "Microarchitecture", def: "The internal organisation implementing an instruction set." },
    ],
    example: "Choosing core count, cache sizes, and bus width is an architectural decision.",
    commonMistakes: ["Assuming later optimisation can rescue a weak architecture — it usually can't."],
    realWorld: "Architecture choices differentiate a mobile SoC from a datacentre CPU.",
    relatedLessons: ["rtl", "logic"],
  }),
  L({
    slug: "rtl",
    pathId: "ic-design",
    order: 2,
    title: "RTL",
    summary: "Describing behaviour at the register-transfer level in an HDL.",
    whatYoullLearn: ["What RTL is", "HDLs like Verilog/VHDL", "Why RTL is the design's source of truth"],
    whyItMatters: "RTL is the human-written code that everything downstream is generated from.",
    explanation: [
      "Register-transfer level (RTL) code describes how data moves between registers each clock cycle and the logic in between, using hardware description languages such as Verilog, SystemVerilog, or VHDL.",
      "RTL is technology-independent and is the primary artefact designers write and verify.",
    ],
    visual: "RTL code beside its meaning: registers connected by combinational logic, updated each clock.",
    terminology: [
      { term: "RTL", def: "Register-transfer level description of hardware." },
      { term: "HDL", def: "Hardware description language (Verilog/VHDL)." },
      { term: "Register", def: "A clocked storage element." },
    ],
    example: "An adder plus a register holding the result is a few lines of RTL.",
    commonMistakes: ["Writing RTL like software — it describes parallel hardware, not sequential code."],
    realWorld: "Reusable RTL 'IP blocks' are licensed and integrated across many chips.",
    relatedLessons: ["logic", "synthesis", "verification"],
  }),
  L({
    slug: "logic",
    pathId: "ic-design",
    order: 3,
    title: "Logic",
    summary: "The Boolean gates and flip-flops that implement digital functions.",
    whatYoullLearn: ["Combinational vs sequential logic", "Standard cells", "How logic maps to CMOS"],
    whyItMatters: "All digital design ultimately reduces to logic gates built from CMOS transistors.",
    explanation: [
      "Combinational logic (AND, OR, NOT, XOR, …) computes outputs purely from current inputs; sequential logic (flip-flops, latches) adds memory and is clocked. Designs are built from a library of pre-characterised 'standard cells'.",
      "Each cell is a small CMOS circuit; synthesis chooses and connects them to realise the RTL.",
    ],
    visual: "Gate symbols feeding flip-flops, mapped onto standard cells from a library.",
    terminology: [
      { term: "Combinational logic", def: "Output depends only on present inputs." },
      { term: "Sequential logic", def: "Output depends on inputs and stored state." },
      { term: "Standard cell", def: "A pre-designed logic gate in a library." },
    ],
    example: "A 2-input NAND standard cell is a four-transistor CMOS circuit.",
    commonMistakes: ["Forgetting timing — sequential logic must meet setup/hold constraints."],
    realWorld: "Foundries provide standard-cell libraries tuned to each process node.",
    relatedLessons: ["cmos", "rtl", "synthesis"],
  }),
  L({
    slug: "synthesis",
    pathId: "ic-design",
    order: 4,
    title: "Synthesis",
    summary: "Translating RTL into a gate-level netlist of standard cells.",
    whatYoullLearn: ["What logic synthesis does", "Constraints and optimisation", "What a netlist is"],
    whyItMatters: "Synthesis turns human-readable RTL into the actual gates that will be built.",
    explanation: [
      "A synthesis tool compiles RTL into a netlist of standard cells, optimising for timing, area, and power under designer-supplied constraints (clock speed, etc.). It's the hardware analogue of a software compiler.",
      "The result is a gate-level description ready for physical implementation.",
    ],
    visual: "RTL going into a synthesis tool and coming out as an interconnected netlist of gates.",
    terminology: [
      { term: "Netlist", def: "A list of cells and their connections." },
      { term: "Constraints", def: "Targets like clock period the tool must meet." },
      { term: "Synthesis", def: "RTL-to-gates compilation." },
    ],
    example: "Tightening the clock constraint makes synthesis use faster (larger) cells.",
    commonMistakes: ["Ignoring constraints — unconstrained synthesis produces meaningless timing."],
    realWorld: "Synthesis quality strongly affects the final chip's speed and power.",
    relatedLessons: ["logic", "place-and-route", "signoff"],
  }),
  L({
    slug: "verification",
    pathId: "ic-design",
    order: 5,
    title: "Verification",
    summary: "Proving the design does what it's supposed to — before it's built.",
    whatYoullLearn: ["Why verification dominates effort", "Simulation vs formal", "Coverage"],
    whyItMatters: "A silicon bug can cost a costly re-spin, so verification often exceeds design effort.",
    explanation: [
      "Verification checks the design against its specification using simulation (running testbenches), formal methods (mathematical proofs), and emulation (running RTL on special hardware). Coverage metrics track how thoroughly behaviour has been exercised.",
      "Because fixing bugs after manufacturing is enormously expensive, verification is exhaustive.",
    ],
    visual: "A testbench driving the design under test, comparing outputs against expected results.",
    terminology: [
      { term: "Testbench", def: "Code that stimulates and checks a design." },
      { term: "Formal verification", def: "Proving properties mathematically." },
      { term: "Coverage", def: "How much of the design's behaviour has been tested." },
    ],
    example: "A formal tool can prove an arbiter never grants two requesters at once.",
    commonMistakes: ["Confusing 'passes my tests' with 'correct' — coverage matters."],
    realWorld: "Verification commonly consumes the majority of a chip project's engineering effort.",
    relatedLessons: ["rtl", "signoff"],
  }),
  L({
    slug: "place-and-route",
    pathId: "ic-design",
    order: 6,
    title: "Place & route",
    summary: "Positioning cells and wiring them together on the die.",
    whatYoullLearn: ["Placement and routing", "Why physical layout affects timing", "Congestion"],
    whyItMatters: "Where cells sit and how wires run determines real-world speed and power.",
    explanation: [
      "Placement decides where each standard cell goes on the die; routing draws the metal wires connecting them, across many layers. Both optimise timing, power, area, and routability while obeying design rules.",
      "Long wires add delay, so placement and routing are tightly coupled to timing.",
    ],
    visual: "Cells arranged in rows, then routed with multi-layer wiring avoiding congestion.",
    terminology: [
      { term: "Placement", def: "Assigning physical locations to cells." },
      { term: "Routing", def: "Drawing the interconnect wires." },
      { term: "Congestion", def: "Too many wires needing the same area." },
    ],
    example: "Placing communicating blocks close together shortens critical wires and improves timing.",
    commonMistakes: ["Treating layout as cosmetic — it directly sets timing and power."],
    realWorld: "Modern place-and-route handles billions of objects with heavy automation.",
    relatedLessons: ["synthesis", "physical-design", "metallization"],
  }),
  L({
    slug: "physical-design",
    pathId: "ic-design",
    order: 7,
    title: "Physical design",
    summary: "Turning the netlist into a manufacturable layout that meets all constraints.",
    whatYoullLearn: ["The scope of physical design", "Timing closure", "Power and clock networks"],
    whyItMatters: "Physical design is where logical intent becomes a real, buildable chip.",
    explanation: [
      "Physical design encompasses floorplanning, placement, clock-tree synthesis, routing, and closing timing/power/signal-integrity — iterating until every constraint is met. It's the bridge from netlist to layout.",
      "Achieving 'timing closure' (no path too slow) across billions of gates is a central challenge.",
    ],
    visual: "A floorplan with power grid and clock tree overlaid on placed-and-routed logic.",
    terminology: [
      { term: "Floorplan", def: "The high-level arrangement of major blocks." },
      { term: "Timing closure", def: "Meeting all timing constraints." },
      { term: "Clock tree", def: "The network distributing the clock with low skew." },
    ],
    example: "Clock-tree synthesis balances arrival times so flip-flops across the chip stay in sync.",
    commonMistakes: ["Assuming timing closure is automatic — it often needs many iterations."],
    realWorld: "Physical design teams are among the largest in a chip project.",
    relatedLessons: ["place-and-route", "signoff", "tapeout"],
  }),
  L({
    slug: "signoff",
    pathId: "ic-design",
    order: 8,
    title: "Signoff",
    summary: "The final checks that confirm the design is correct and manufacturable.",
    whatYoullLearn: ["What signoff verifies", "DRC and LVS", "Timing/power signoff"],
    whyItMatters: "Signoff is the last gate before committing millions to manufacturing.",
    explanation: [
      "Signoff runs exhaustive checks: design-rule checking (DRC) confirms the layout obeys the foundry's rules; layout-versus-schematic (LVS) confirms the layout matches the netlist; static timing analysis confirms speed; plus power, IR-drop, and reliability checks.",
      "Only after clean signoff does the design go to tapeout.",
    ],
    visual: "A checklist of signoff checks (DRC, LVS, STA, power) all turning green.",
    terminology: [
      { term: "DRC", def: "Design-rule check against foundry rules." },
      { term: "LVS", def: "Layout-versus-schematic comparison." },
      { term: "STA", def: "Static timing analysis." },
    ],
    example: "A DRC violation (two wires too close) must be fixed before tapeout.",
    commonMistakes: ["Skipping a signoff corner — a missed case can cause silicon failure."],
    realWorld: "Foundries supply the rule decks that signoff tools check against.",
    relatedLessons: ["physical-design", "tapeout", "verification"],
  }),
  L({
    slug: "tapeout",
    pathId: "ic-design",
    order: 9,
    title: "Tapeout",
    summary: "Handing the finished layout to the foundry to be manufactured.",
    whatYoullLearn: ["What tapeout means", "GDSII/OASIS and the mask set", "Why it's a point of no return"],
    whyItMatters: "Tapeout commits the design to expensive mask-making and manufacturing.",
    explanation: [
      "Tapeout is the moment the final layout (as a GDSII or OASIS file) is sent to the foundry to make photomasks and begin fabrication. The name dates from when layouts were shipped on magnetic tape.",
      "After tapeout, changes require new masks and a costly re-spin, so it follows thorough signoff.",
    ],
    visual: "The layout database being handed off, then turned into a photomask set at the foundry.",
    terminology: [
      { term: "GDSII / OASIS", def: "Standard layout file formats sent to the foundry." },
      { term: "Mask set", def: "The photomasks made from the layout, one per layer." },
      { term: "Re-spin", def: "A costly re-manufacture to fix a post-tapeout bug." },
    ],
    example: "First silicon comes back weeks after tapeout for bring-up and validation.",
    commonMistakes: ["Treating tapeout as the finish line — bring-up and validation still follow."],
    realWorld: "A mask set for an advanced node can cost millions, so tapeout is taken very seriously.",
    relatedLessons: ["signoff", "lithography"],
  }),

  // ============================ PATH 4: PACKAGING ============================
  L({
    slug: "what-is-packaging",
    pathId: "packaging",
    order: 1,
    title: "What is semiconductor packaging?",
    summary: "Turning a bare, fragile die into a usable, connectable chip — everything that happens after the wafer.",
    whatYoullLearn: [
      "What packaging is and where it sits after fabrication",
      "The wafer → die → package → system journey",
      "Why the wafer is not a finished product",
    ],
    whyItMatters: "The wafer coming out of the fab isn't something you can use; packaging is what turns it into a chip you can put in a product.",
    explanation: [
      "Fabrication ends with a wafer holding many identical dies. Packaging is everything that comes after: cutting out each die, connecting it to the outside world, and protecting it inside a housing — the finished “chip” you can solder onto a board.",
      "The journey is: wafer → die → die preparation (dicing) → interconnection (connecting the die's pads) → package assembly and sealing → testing → a component that goes into a system.",
      "Packaging does three core jobs: it makes electrical connections between the tiny die and the much larger board, it protects the die mechanically and from moisture, and it gives heat a path to escape.",
    ],
    visual: "A wafer of dies, one die singulated, then that die mounted and sealed in a package with balls underneath.",
    visualKey: "wafer-to-package",
    terminology: [
      { term: "Die", def: "A single chip cut from the wafer — the bare silicon with the circuit on it." },
      { term: "Package", def: "The housing that protects the die and connects it to the board." },
      { term: "Singulation", def: "Cutting the wafer into individual dies (dicing)." },
    ],
    example: "A processor die is diced from its wafer, attached to a substrate, connected, sealed, tested, and shipped as the chip you see on a board.",
    commonMistakes: ["Thinking a fabricated wafer is a finished product — it still needs packaging and test before it can be used."],
    realWorld: "Every chip in a phone, car, or data center went through packaging after its wafer was made.",
    relatedLessons: ["why-packaging", "die-vs-package", "packaging"],
  }),
  L({
    slug: "why-packaging",
    pathId: "packaging",
    order: 2,
    title: "Why does a chip need packaging?",
    summary: "Protection, connection, and heat — the three problems a bare die can't solve on its own.",
    whatYoullLearn: [
      "The three jobs packaging does",
      "Why a bare die can't be used directly",
      "How packaging affects performance and reliability",
    ],
    whyItMatters: "Without packaging a die is fragile, unconnectable, and can't shed heat — packaging is what makes it a dependable component.",
    explanation: [
      "A bare die is a sliver of silicon with connection pads far too small and delicate to attach to a circuit board. Packaging solves three problems at once.",
      "Connection: it fans the die's micron-scale pads out to millimetre-scale pins or balls a board can use. Protection: it shields the die from physical damage, moisture, and contamination. Thermal: it gives heat a path from the die to a heatsink or the board.",
      "Increasingly, packaging also decides performance — how many connections, how short they are, and how much bandwidth and power the chip can deliver — which is why advanced packaging has become so important.",
    ],
    visual: "A bare, fragile die versus the same die protected and connected inside a package.",
    visualKey: "die-vs-package",
    terminology: [
      { term: "Pad", def: "A tiny metal contact on the die where a connection is made." },
      { term: "Thermal path", def: "The route heat takes from the die out to the environment." },
    ],
    example: "A die that runs hot must be packaged so heat can reach a heatsink; otherwise it would overheat almost immediately.",
    commonMistakes: ["Assuming packaging is just a protective box — it also carries every electrical connection and much of the heat, and increasingly limits performance."],
    realWorld: "Automotive and industrial chips use rugged packaging to survive heat, vibration, and moisture for years.",
    relatedLessons: ["what-is-packaging", "electrical-connections", "substrate"],
  }),
  L({
    slug: "die-vs-package",
    pathId: "packaging",
    order: 3,
    title: "Die vs package",
    summary: "The bare silicon chip versus the finished, connectable component it lives inside.",
    whatYoullLearn: [
      "The difference between a die and a package",
      "What a die is and where it comes from",
      "What the package adds around it",
    ],
    whyItMatters: "These two words come up constantly in packaging; mixing them up makes everything else confusing.",
    explanation: [
      "A die is the bare piece of silicon cut from the wafer — the actual circuit, with microscopic connection pads, but fragile and impossible to handle or connect directly.",
      "A package is the finished housing built around one (or more) dies: it mounts the die, routes its connections out to board-level pins or balls, seals it, and manages heat. The “chip” on a circuit board is the package; the die is inside it.",
      "One package can hold a single die (traditional packaging) or many dies (advanced packaging — chiplets, 2.5D, 3D).",
    ],
    visual: "On the left a bare die with tiny pads; on the right the same die mounted, connected, and sealed inside a package with balls underneath.",
    visualKey: "die-vs-package",
    terminology: [
      { term: "Bare die", def: "A die that has not yet been packaged." },
      { term: "Known-good die (KGD)", def: "A die already tested and confirmed working before packaging." },
    ],
    example: "In a chiplet product, several known-good dies are placed into one package.",
    commonMistakes: ["Using “chip” loosely — usually the chip you handle is the package; the die is the silicon inside it."],
    realWorld: "“Bare die” versus “packaged parts” is a real distinction in the supply chain, especially for advanced packaging.",
    relatedLessons: ["what-is-packaging", "substrate", "chiplets"],
  }),
  L({
    slug: "substrate",
    pathId: "packaging",
    order: 4,
    title: "Package substrate",
    summary: "The carrier inside the package that fans the die's tiny connections out to the board.",
    whatYoullLearn: [
      "What a substrate is and what it does",
      "How it bridges fine die pitch to coarse board pitch",
      "Why substrates matter for advanced packaging",
    ],
    whyItMatters: "The substrate is the hidden workhorse of a package — it carries every signal and power connection between the die and the board.",
    explanation: [
      "A package substrate is a small, multilayer board that the die sits on inside the package. Its main job is “fan-out”: the die's pads are only micrometres apart, but the board's pins/balls are far larger and further apart, so the substrate routes the connections from fine die pitch to coarse board pitch.",
      "It also delivers power to the die and provides mechanical and partial thermal support. Modern substrates have many routing layers, like a miniature printed circuit board.",
      "In advanced packaging the substrate — or a silicon interposer placed on top of it — must carry far more and denser connections, which is why substrate technology is a bottleneck and an area of heavy investment.",
    ],
    visual: "A die on a multilayer substrate that routes its fine pads outward to the larger solder balls underneath the package.",
    visualKey: "substrate",
    terminology: [
      { term: "Pitch", def: "The spacing between connections." },
      { term: "Fan-out (routing)", def: "Spreading fine die connections to a coarser board pitch." },
      { term: "Interposer", def: "An extra dense-wiring layer placed above the substrate, used in 2.5D." },
    ],
    example: "A high-pin-count processor uses a large multilayer substrate to route thousands of connections to the motherboard.",
    commonMistakes: ["Confusing the package substrate with the circuit board it's soldered to — the substrate is inside the package."],
    realWorld: "Substrate supply has been a real constraint on shipping high-end CPUs and GPUs.",
    relatedLessons: ["die-vs-package", "electrical-connections", "2-5d"],
  }),
  L({
    slug: "electrical-connections",
    pathId: "packaging",
    order: 5,
    title: "Electrical connections",
    summary: "How a die's tiny pads are wired to the package and out to the board — wires, bumps, and balls.",
    whatYoullLearn: [
      "The chain of connections from die to board",
      "The two main die-to-package methods",
      "How connection choices affect speed and count",
    ],
    whyItMatters: "Every signal and every watt into a chip travels through these connections; they set how fast and how many.",
    explanation: [
      "Electricity travels from the die all the way to the board through a chain: die pad → die-to-package connection → substrate routing → package pins or balls → the board.",
      "There are two main ways to connect the die to the package. Wire bonding runs thin wires from pads at the die's edge to the substrate. Flip chip flips the die face-down onto an array of tiny solder bumps covering its whole face.",
      "The method matters: wire bonds are cheap but limited in count and add electrical inductance; flip-chip bumps give far more connections and shorter, faster paths. From the substrate, solder balls (as in a BGA) connect the package to the board.",
    ],
    visual: "The connection chain: die pad → wire or bump → substrate → solder ball → board.",
    visualKey: "electrical-connections",
    terminology: [
      { term: "Bump", def: "A tiny solder ball on the die's face, used in flip chip." },
      { term: "Ball (BGA)", def: "A solder ball under the package that connects it to the board." },
      { term: "Inductance", def: "An electrical property that limits high-speed signals; longer wires have more of it." },
    ],
    example: "A high-speed processor uses flip-chip bumps for the die and a ball grid array (BGA) to reach the board.",
    commonMistakes: ["Thinking there's a single connection — there's a whole chain from die pad to board, each link with its own limits."],
    realWorld: "The shift from wire bonding to flip chip was driven by the need for more connections and higher speed in CPUs and GPUs.",
    relatedLessons: ["wire-bonding", "flip-chip", "substrate"],
  }),
  L({
    slug: "wafer-level-packaging",
    pathId: "packaging",
    order: 9,
    title: "Wafer-level packaging",
    summary: "Building the package while the dies are still on the wafer — smaller, thinner, and often without a separate substrate.",
    whatYoullLearn: [
      "What wafer-level packaging (WLP) is",
      "How it differs from traditional packaging",
      "Fan-out WLP and its trade-offs",
    ],
    whyItMatters: "WLP enables the very small, thin packages phones and wearables need, and underpins fan-out and much of advanced packaging.",
    explanation: [
      "In traditional packaging, dies are cut from the wafer first and then packaged one by one. In wafer-level packaging (WLP), the packaging steps are done while the dies are still on (or reconstituted onto) a wafer, and the wafer is diced at the very end — so many packages are built in parallel.",
      "In the simplest “fan-in” WLP, connections stay within the die's own footprint, giving a package barely larger than the die (chip-scale). Fan-out WLP re-embeds dies in a moulded wafer and adds redistribution layers (RDL) that spread connections beyond the die edge — more connections without a separate substrate.",
      "Advantages: smaller, thinner packages and, for fan-out, no substrate cost and shorter connections. Limitations: warpage and yield are harder to control, and the connection count is limited by the redistribution layers rather than a full substrate.",
    ],
    visual: "Packages built across a whole wafer, with redistribution layers spreading each die's connections beyond its edge (fan-out) before dicing.",
    visualKey: "wafer-level-packaging",
    terminology: [
      { term: "RDL (redistribution layer)", def: "A thin metal layer that re-routes a die's connections to new positions." },
      { term: "Fan-in / fan-out", def: "Keeping connections within the die footprint, versus spreading them beyond it." },
      { term: "Chip-scale package (CSP)", def: "A package barely larger than the die itself." },
    ],
    example: "Mobile processors and RF chips widely use fan-out WLP for compact, high-density packaging.",
    commonMistakes: ["Assuming WLP is just “a smaller package” — fan-out WLP is a different process that packages many dies in parallel on a wafer."],
    realWorld: "Fan-out WLP became mainstream in smartphones and is a stepping stone toward chiplet-style integration.",
    relatedLessons: ["flip-chip", "traditional-packaging", "chiplets"],
  }),
  L({
    slug: "traditional-packaging",
    pathId: "packaging",
    order: 1,
    title: "Traditional packaging",
    summary: "Classic single-die packages that protect and connect a chip.",
    whatYoullLearn: ["What a traditional package provides", "Common package styles", "Their limits"],
    whyItMatters: "Traditional packages still ship in enormous volumes and set the baseline.",
    explanation: [
      "Traditional packaging places one die in a housing (e.g. QFP, BGA) with wire bonds or bumps to leads/balls, then encapsulates it. It protects the die, dissipates heat, and adapts the fine die pitch to the board.",
      "As chips demanded more connections and bandwidth, these single-die packages began to limit performance — motivating advanced packaging.",
    ],
    visual: "A single die in a package with leads/balls, sealed in moulding compound.",
    terminology: [
      { term: "BGA", def: "Ball-grid array package with solder balls underneath." },
      { term: "Lead frame", def: "The metal frame forming a package's external leads." },
    ],
    example: "A microcontroller in a QFP package uses wire bonds from die pads to the leads.",
    commonMistakes: ["Assuming packaging is 'just a box' — it constrains I/O count and thermals."],
    realWorld: "Cost-sensitive, lower-pin-count parts still use traditional packages widely.",
    relatedLessons: ["wire-bonding", "flip-chip"],
  }),
  L({
    slug: "wire-bonding",
    pathId: "packaging",
    order: 2,
    title: "Wire bonding",
    summary: "Connecting die pads to the package with fine metal wires.",
    whatYoullLearn: ["How wire bonding works", "Its advantages", "Its limits vs flip-chip"],
    whyItMatters: "Wire bonding is the most common, lowest-cost die-attach interconnect.",
    explanation: [
      "Wire bonding welds thin gold or copper wires from the die's peripheral pads to the package leads, one connection at a time. It's mature, flexible, and inexpensive.",
      "Because pads sit around the die edge and wires add inductance, it limits connection count and high-speed performance compared with flip-chip.",
    ],
    visual: "Fine wires arcing from pads around the die edge to the surrounding package leads.",
    visualKey: "wire-bonding",
    terminology: [
      { term: "Bond wire", def: "The fine wire connecting die to package." },
      { term: "Bond pad", def: "The die metal pad a wire attaches to." },
    ],
    example: "A sensor chip uses a few dozen wire bonds around its perimeter.",
    commonMistakes: ["Assuming wire bonding is obsolete — it's still dominant by unit volume."],
    realWorld: "High-pin-count processors moved to flip-chip; many other chips still wire-bond.",
    relatedLessons: ["traditional-packaging", "flip-chip"],
  }),
  L({
    slug: "flip-chip",
    pathId: "packaging",
    order: 3,
    title: "Flip chip",
    summary: "Mounting the die face-down on solder bumps for dense, fast connections.",
    whatYoullLearn: ["How flip-chip differs from wire bonding", "Why area-array I/O helps", "Where it's used"],
    whyItMatters: "Flip-chip enables the thousands of fast connections high-performance chips need.",
    explanation: [
      "In flip-chip, solder bumps are formed across the die's whole face; the die is flipped and bonded directly to the substrate. This gives area-array I/O (connections across the die, not just the edge) with short, low-inductance paths.",
      "It supports far more connections and higher speeds than wire bonding.",
    ],
    visual: "A die flipped face-down, its bump array bonded directly onto the package substrate.",
    visualKey: "flip-chip",
    terminology: [
      { term: "Solder bump", def: "A small solder ball on the die face." },
      { term: "Area-array I/O", def: "Connections distributed across the die, not just the edge." },
      { term: "Underfill", def: "Epoxy that mechanically reinforces the bump joints." },
    ],
    example: "A CPU die is flip-chip bonded to its substrate with thousands of bumps.",
    commonMistakes: ["Forgetting underfill — it's needed to relieve thermal-mechanical stress on bumps."],
    realWorld: "Flip-chip is standard for CPUs, GPUs, and other high-I/O chips.",
    relatedLessons: ["wire-bonding", "2-5d", "3d-ic"],
  }),
  L({
    slug: "2-5d",
    pathId: "packaging",
    order: 4,
    title: "2.5D integration",
    summary: "Placing multiple dies side-by-side on a shared interposer.",
    whatYoullLearn: ["What an interposer is", "Why 2.5D exists", "Typical use with HBM"],
    whyItMatters: "2.5D links dies with dense, short wiring that a normal package can't provide.",
    explanation: [
      "In 2.5D, several dies sit next to each other on a silicon (or organic) interposer that carries fine, dense wiring between them, often with through-silicon vias down to the package.",
      "It gives near-on-die bandwidth between separate dies — commonly used to place high-bandwidth memory beside a processor.",
    ],
    visual: "Two dies side-by-side on an interposer with dense wiring between them, mounted on a substrate.",
    visualKey: "2-5d",
    terminology: [
      { term: "Interposer", def: "A wiring layer between dies and the package substrate." },
      { term: "TSV", def: "Through-silicon via — a vertical connection through silicon." },
    ],
    example: "A GPU and stacks of HBM share a silicon interposer for very high memory bandwidth.",
    commonMistakes: ["Confusing 2.5D (side-by-side on an interposer) with true 3D stacking."],
    realWorld: "2.5D + HBM is the standard recipe for AI accelerators and high-end GPUs.",
    relatedLessons: ["3d-ic", "hbm", "chiplets"],
  }),
  L({
    slug: "3d-ic",
    pathId: "packaging",
    order: 5,
    title: "3D IC",
    summary: "Stacking dies vertically and connecting them through silicon.",
    whatYoullLearn: ["How 3D stacking works", "TSVs and hybrid bonding", "Benefits and challenges"],
    whyItMatters: "Vertical stacking shortens connections and packs more function into a footprint.",
    explanation: [
      "3D ICs stack dies on top of one another, connected vertically by through-silicon vias (TSVs) or, at the finest pitch, by hybrid bonding (direct copper-to-copper). This shortens interconnects and boosts density and bandwidth.",
      "Heat removal and manufacturing complexity are the main challenges.",
    ],
    visual: "Two or more dies stacked vertically, joined by TSVs / hybrid-bonded copper pads.",
    visualKey: "3d-ic",
    terminology: [
      { term: "TSV", def: "Vertical via through a die connecting stacked layers." },
      { term: "Hybrid bonding", def: "Direct fine-pitch copper-to-copper die bonding." },
    ],
    example: "Cache stacked directly on a CPU die via hybrid bonding cuts latency and adds capacity.",
    commonMistakes: ["Underestimating thermal challenges — stacked dies trap heat."],
    realWorld: "3D stacking (logic-on-logic, memory-on-logic) is a major frontier of scaling.",
    relatedLessons: ["2-5d", "chiplets", "hbm"],
  }),
  L({
    slug: "chiplets",
    pathId: "packaging",
    order: 6,
    title: "Chiplets",
    summary: "Building a system from smaller, reusable dies instead of one big die.",
    whatYoullLearn: ["What chiplets are", "Why disaggregation helps yield and cost", "The role of interconnect standards"],
    whyItMatters: "Chiplets let designers mix processes and improve yield as monolithic scaling slows.",
    explanation: [
      "Instead of one large monolithic die, a chiplet design splits functions into several smaller dies connected in an advanced package. Smaller dies yield better, can use the best-suited process each, and can be reused across products.",
      "Die-to-die interconnect standards (e.g. UCIe) aim to let chiplets from different sources interoperate.",
    ],
    visual: "Several small chiplets (cores, I/O, memory) combined in one package via dense die-to-die links.",
    visualKey: "chiplets",
    terminology: [
      { term: "Chiplet", def: "A small die combined with others in a package." },
      { term: "Disaggregation", def: "Splitting a chip into multiple dies." },
      { term: "Die-to-die interconnect", def: "The link between chiplets (e.g. UCIe)." },
    ],
    example: "A processor built from compute chiplets plus a separate I/O die improves yield and flexibility.",
    commonMistakes: ["Assuming chiplets are always cheaper — packaging and interconnect add cost and complexity."],
    realWorld: "Chiplet-based CPUs and accelerators are now mainstream at the high end.",
    relatedLessons: ["2-5d", "3d-ic", "advanced-packaging"],
  }),
  L({
    slug: "hbm",
    pathId: "packaging",
    order: 7,
    title: "HBM",
    summary: "High-bandwidth memory: stacked DRAM connected by a very wide interface.",
    whatYoullLearn: ["What HBM is", "Why stacking + wide bus = bandwidth", "Where HBM is used"],
    whyItMatters: "HBM feeds data-hungry accelerators far faster than conventional memory.",
    explanation: [
      "HBM stacks several DRAM dies vertically (using TSVs) and connects them through a very wide interface, usually placed beside the processor on a 2.5D interposer. The wide bus delivers very high bandwidth at good energy efficiency.",
      "It trades higher cost and packaging complexity for bandwidth that AI and HPC workloads demand.",
    ],
    visual: "A stack of DRAM dies with TSVs beside a processor on an interposer, joined by a wide bus.",
    terminology: [
      { term: "HBM", def: "High-bandwidth memory (stacked DRAM)." },
      { term: "Wide interface", def: "A very large number of parallel data connections." },
    ],
    example: "An AI accelerator surrounds its compute die with several HBM stacks for terabytes/second of bandwidth.",
    commonMistakes: ["Confusing HBM's bandwidth advantage with lower latency — it's about throughput."],
    realWorld: "HBM is central to modern AI training hardware.",
    relatedLessons: ["2-5d", "3d-ic"],
  }),
  L({
    slug: "advanced-packaging",
    pathId: "packaging",
    order: 8,
    title: "Advanced packaging",
    summary: "Why packaging is now a primary driver of system performance.",
    whatYoullLearn: ["What 'advanced packaging' groups together", "Why it rose in importance", "How the pieces fit"],
    whyItMatters: "As transistor scaling slows, packaging is where much of the gains now come from.",
    explanation: [
      "Advanced packaging is the umbrella for flip-chip, 2.5D, 3D, chiplets, and HBM — techniques that integrate multiple dies with dense, short interconnect. Together they deliver bandwidth, density, and heterogeneity that a single die or traditional package can't.",
      "The industry increasingly treats the package as a system, co-designed with the silicon.",
    ],
    visual: "A single package combining chiplets, an interposer, 3D stacks, and HBM into one system.",
    terminology: [
      { term: "Heterogeneous integration", def: "Combining dies of different types/processes in one package." },
      { term: "System-in-package (SiP)", def: "A package that integrates a whole subsystem." },
    ],
    example: "A modern accelerator is a package of compute chiplets plus HBM on an interposer — a system, not a chip.",
    commonMistakes: ["Thinking Moore's Law is only about transistors — packaging now carries much of the progress."],
    realWorld: "Advanced packaging capacity is now a strategic constraint for the whole industry.",
    relatedLessons: ["chiplets", "2-5d", "3d-ic"],
  }),
];

/* --------------------------------- helpers --------------------------------- */

const BY_SLUG = new Map(SEMI_LESSONS.map((l) => [l.slug, l]));
const PATH_BY_ID = new Map(LEARNING_PATHS.map((p) => [p.id, p]));

export function getSemiLesson(slug: string): SemiLesson | undefined {
  return BY_SLUG.get(slug);
}

export function getLearningPath(id: string): LearningPath | undefined {
  return PATH_BY_ID.get(id);
}

export function lessonsOfPath(pathId: string): SemiLesson[] {
  const p = PATH_BY_ID.get(pathId);
  if (!p) return [];
  return p.lessonSlugs
    .map((s) => BY_SLUG.get(s))
    .filter((l): l is SemiLesson => Boolean(l));
}

/** Previous/next lesson within the same path. */
export function lessonNeighbors(slug: string): {
  prev?: SemiLesson;
  next?: SemiLesson;
  path?: LearningPath;
} {
  const lesson = BY_SLUG.get(slug);
  if (!lesson) return {};
  const path = PATH_BY_ID.get(lesson.pathId);
  if (!path) return {};
  const i = path.lessonSlugs.indexOf(slug);
  return {
    path,
    prev: i > 0 ? BY_SLUG.get(path.lessonSlugs[i - 1]) : undefined,
    next:
      i >= 0 && i < path.lessonSlugs.length - 1
        ? BY_SLUG.get(path.lessonSlugs[i + 1])
        : undefined,
  };
}
