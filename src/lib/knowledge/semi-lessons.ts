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
  /** A small comparison table (e.g. CVD vs PVD vs ALD). */
  table?: { caption?: string; columns: string[]; rows: string[][] };
  /** An optional built-in diagram shown inside the panel, with a caption. */
  visualKey?: LessonVisualKey;
  visualCaption?: string;
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
  | "wafer-level-packaging"
  | "deposit-etch-cycle";

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
    title: "Etching and Deposition",
    summary:
      "The two processes that add and remove material — used with lithography to build and shape a chip layer by layer.",
    whatYoullLearn: [
      "The one core idea: deposition adds material, etching removes it",
      "Why thin films are needed and what thickness, uniformity, and composition control",
      "How CVD, PVD, ALD, and epitaxy differ — and when each is used",
      "Wet vs dry etching, isotropic vs anisotropic, and what selectivity means",
      "How deposition, lithography, and etch work together to pattern a layer",
    ],
    whyItMatters:
      "Almost every structure on a chip is built by adding a film, patterning it with lithography, and etching it — repeated hundreds of times. Deposition and etching are the 'add' and 'remove' half of that cycle, so their control over thickness, profile, and selectivity directly shapes the transistors and wiring and directly sets yield.",
    quickStart: [
      "Deposition ADDS material to the wafer; etching REMOVES material from it.",
      "Together with lithography — which decides WHERE — they build and shape structures layer by layer.",
      "Deposition films can be conductors, insulators, or semiconductors, and their thickness, uniformity, and composition all matter.",
      "Etching can be isotropic (removes in all directions) or anisotropic (removes straight down), and must be selective — removing the target without harming the mask or the layer beneath.",
      "This add–pattern–remove cycle is repeated many times; a chip is the result of hundreds of these layers stacked and aligned.",
    ],
    prerequisites: ["deposition", "photoresist", "lithography"],
    intuition: [
      "A useful first analogy: lithography defines WHERE something should happen, deposition determines WHAT material is added, and etching determines WHAT material is removed. Lithography draws the stencil; deposition and etching do the adding and taking away.",
      "Why the analogy is useful but incomplete: real deposition is not 'painting on' a layer — the film grows atom by atom through physics and chemistry, and how well it coats steep, narrow shapes (conformality) is a hard problem paint never faces. Real etching is not 'cutting' — it is a controlled chemical and/or physical attack that must remove one material fast while barely touching its neighbours, in the right direction, to a precise depth.",
      "So think of them less like a brush and a knife, and more like carefully tuned chemical processes whose exact behaviour depends on the materials, the shapes, the temperature, the pressure, and the gases involved.",
    ],
    whereItFits: {
      journeyStepId: "etching",
      note: "Deposition adds the film, lithography patterns a resist stencil on it, and etching transfers that pattern into the film — then the whole block repeats for the next layer. A modern chip runs through this add–pattern–remove loop many dozens of times.",
    },
    explanation: [
      "Deposition and etching are complementary. Deposition (film formation) adds a thin, controlled layer of material onto the wafer — a conductor, an insulator, or a semiconductor. Etching removes material, usually where a patterned resist or hard mask leaves it exposed, transferring a pattern into the film beneath.",
      "Neither works alone. Lithography sits between them: a film is deposited, a resist is coated and patterned by lithography, and the etch removes the film only where the resist allows. Strip the resist and a patterned layer remains. Stack and align hundreds of such layers and you have a working chip.",
      "Etching comes in two broad families. Wet etching uses liquid chemistry and tends to remove material in all directions (isotropic). Dry etching uses a plasma of reactive species and can be made highly directional (anisotropic), cutting nearly straight down to form vertical features. The choice depends on the material, the shape needed, and how selective and controllable the process must be.",
      "Deposition likewise comes in several families — CVD, PVD, ALD, and epitaxy — each depositing films in a different way, with different strengths in conformality, thickness control, temperature, and the materials they suit. There is no single 'best' method; each is chosen for the job.",
    ],
    howItWorks: [
      "Add: a deposition step grows a thin film of the needed material across the whole wafer, aiming for the right thickness, uniformity, and composition.",
      "Define where: photoresist is coated and lithography patterns it, leaving resist covering the areas to keep and openings where the film should be removed.",
      "Remove: an etch step removes the exposed film — ideally only the target material, in the intended direction, stopping at the layer below.",
      "Clean up: the remaining resist is stripped, leaving the film patterned into the shape lithography defined.",
      "Repeat: the wafer moves on to the next film, and the add–pattern–remove cycle runs again for the next layer, each aligned to the ones before it.",
    ],
    steps: [
      { name: "Film deposition", detail: "Add the target material as a thin film across the wafer (CVD, PVD, ALD, or epitaxy)." },
      { name: "Photoresist", detail: "Coat the film with a light-sensitive resist." },
      { name: "Lithography", detail: "Expose and develop the resist so it carries the layer's pattern." },
      { name: "Patterned resist", detail: "Resist now protects some regions and leaves others open to attack." },
      { name: "Etch", detail: "Remove the exposed film — selectively, and in the intended direction and depth." },
      { name: "Resist removal", detail: "Strip the resist that protected the covered regions." },
      { name: "Finished patterned layer", detail: "The film is left in the exact shape lithography defined, ready for the next layer." },
    ],
    science: [
      "Deposition is about growing a film with controlled thickness, uniformity across the wafer, and conformality (how evenly it coats steep, narrow features). Different methods trade these off: some are fast but coat unevenly, others are slow but perfectly conformal.",
      "Etching is about removing the right material, in the right direction, without harming its neighbours. Selectivity (removing the target much faster than the mask or underlayer) and anisotropy (removing straight down rather than sideways) are the two properties that make an etch useful for fine patterns.",
      "The reason dry/plasma etching became dominant for small features is directionality: energetic ions can be steered to strike the surface vertically, so the etch cuts down without widening the opening — essential for the tall, narrow shapes in modern devices.",
    ],
    equipment: [
      { name: "CVD chamber", detail: "A sealed, temperature- and pressure-controlled reactor where precursor gases react at the wafer surface to grow a film." },
      { name: "PVD system", detail: "A vacuum system that physically transports material from a solid source (target) to the wafer, e.g. by sputtering or evaporation." },
      { name: "ALD system", detail: "A reactor that pulses precursors in alternating, self-limiting steps to build a film one atomic layer per cycle." },
      { name: "Epitaxy reactor", detail: "A high-purity, often high-temperature system that grows a crystalline film aligned to the wafer's crystal structure." },
      { name: "Plasma etch chamber", detail: "A vacuum chamber where RF power creates a plasma of reactive species and ions to etch the wafer, often with directional control." },
      { name: "Wet bench", detail: "Controlled chemical baths and rinses for wet etching and cleaning, with careful handling and process control." },
      { name: "Gas delivery system", detail: "Mass-flow controllers and plumbing that meter reactive and carrier gases precisely into the chambers." },
      { name: "Vacuum & RF/plasma systems", detail: "Pumps that set the low pressures many processes need, and RF generators that create and sustain the plasma." },
    ],
    materials: [
      { name: "Conductors", detail: "Metal films for wiring and contacts — the current-carrying parts of the chip." },
      { name: "Insulators (dielectrics)", detail: "Films that electrically separate conductors and devices." },
      { name: "Semiconducting films", detail: "Semiconductor layers, sometimes grown crystalline by epitaxy, that form or extend active device regions." },
      { name: "Barrier layers", detail: "Thin films that stop one material from diffusing into another (e.g. keeping metal out of the dielectric)." },
      { name: "Liners & adhesion layers", detail: "Films that help a later material stick and deposit well onto the surface beneath it." },
      { name: "Interconnect-related films", detail: "The stack of conductors, barriers, and dielectrics used to build multi-level wiring." },
    ],
    parameters: [
      { name: "Film thickness", detail: "How much material is added; must hit a target, because too thin or too thick both change device behaviour." },
      { name: "Uniformity", detail: "How consistent thickness and composition are across the whole wafer and wafer-to-wafer." },
      { name: "Conformality", detail: "How evenly a film coats vertical walls and the bottoms of narrow features." },
      { name: "Composition", detail: "The exact material and its purity — small changes can shift electrical or mechanical properties." },
      { name: "Selectivity (etch)", detail: "How much faster the etch removes the target than the mask or underlying layer." },
      { name: "Anisotropy / directionality (etch)", detail: "Whether the etch removes straight down (anisotropic) or in all directions (isotropic)." },
      { name: "Temperature & pressure", detail: "Set reaction rates, film quality, and plasma behaviour in both deposition and etch." },
      { name: "Aspect ratio", detail: "The depth-to-width ratio of a feature; high aspect ratios make both filling and etching much harder." },
    ],
    parametersNote:
      "Which material each method deposits, and the exact temperatures, pressures, gases, and rates, are process- and tool-specific and set by each fab. The relationships here are conceptual, not a recipe — and this topic deliberately avoids hazardous chemical procedures.",
    visual:
      "A cross-section sequence: deposit a film on the wafer, coat and pattern resist over it, etch the film through the openings, then strip the resist — leaving the film in the exact shape lithography defined.",
    visualKey: "deposit-etch-cycle",
    terminology: [
      { term: "Deposition", def: "Adding a thin film of material onto the wafer." },
      { term: "Etching", def: "Removing selected material from the wafer, usually through openings in a mask." },
      { term: "Thin film", def: "A layer, often nanometres to micrometres thick, deposited across the wafer." },
      { term: "Conformality", def: "How evenly a deposited film coats steep, narrow, 3D features." },
      { term: "Selectivity", def: "Removing (or depositing on) the target material far faster than other materials." },
      { term: "Isotropic", def: "Acting equally in all directions (etches sideways as well as down)." },
      { term: "Anisotropic", def: "Acting mainly in one direction (etches straight down for vertical walls)." },
      { term: "CVD", def: "Chemical vapour deposition — a film grown from reacting precursor gases at the surface." },
      { term: "PVD", def: "Physical vapour deposition — material physically transported from a source to the wafer (e.g. sputtering)." },
      { term: "ALD", def: "Atomic layer deposition — film built one atomic layer per self-limiting cycle." },
      { term: "Epitaxy", def: "Growing a crystalline film aligned to the wafer's underlying crystal." },
      { term: "RIE", def: "Reactive-ion etching — a plasma etch combining chemical reaction with directional ion bombardment." },
      { term: "Aspect ratio", def: "A feature's depth divided by its width; high values are hard to fill and to etch." },
      { term: "Undercut", def: "Unwanted sideways etching beneath the mask edge." },
    ],
    formula: {
      expression: "Aspect ratio = feature depth / feature width",
      caption:
        "A simple but decisive number: as features get narrower and deeper, the aspect ratio rises, and both filling them (deposition) and clearing them (etch) get dramatically harder.",
    },
    example:
      "Building a metal wire shows the cycle end to end: deposit a metal film across the wafer (add), coat and pattern resist so it covers only the wire shapes (where), etch away the exposed metal so only the wires remain (remove), then strip the resist. Selectivity matters here — the etch must clear the metal but stop on the insulator beneath, or it would keep cutting into the layer below.",
    commonMistakes: [
      "Thinking deposition is just 'painting' the wafer. Films grow through physics and chemistry, atom by atom, and must coat complex 3D shapes evenly — something paint never has to do.",
      "Thinking etching is just 'cutting' the wafer. Etching is a controlled chemical and/or physical attack that must be selective, directional, and stopped at the right depth.",
      "Assuming dry etching is always better than wet etching. Dry etch gives directionality and fine control, but wet etch can be faster, gentler, cheaper, and highly selective for the right jobs.",
      "Assuming thicker films are better. Thickness is a target to hit; too thick can add stress, waste material, or change device behaviour just as too thin can.",
      "Believing perfect vertical profiles are always the goal. Sometimes a tapered or rounded profile is exactly what a later step needs — the 'right' profile depends on the structure being built.",
    ],
    realWorld:
      "Modern 3D devices — FinFETs, gate-all-around transistors, and 3D NAND with dozens of stacked layers — exist only because deposition can coat and fill extremely narrow, deep features and etching can cut high-aspect-ratio shapes precisely. The add and remove steps are as central to scaling as lithography.",
    defects: [
      "Non-uniform thickness: a film that is thicker in some regions than others shifts device behaviour across the wafer.",
      "Particles: stray particles create missing or extra material that can kill a device.",
      "Poor conformality: a film that fails to coat steep sidewalls or feature bottoms leaves gaps or voids.",
      "Over-etch: removing too much — cutting into the underlying layer or widening features beyond spec.",
      "Under-etch: removing too little — leaving residue that blocks contact or distorts the pattern.",
      "Profile distortion: sidewalls that come out sloped, bowed, or undercut when they should not be.",
      "Residue and contamination: leftover material or chemical/metal contamination that disrupts later steps.",
      "Film stress: built-in mechanical stress that can bow the wafer or crack or delaminate the film.",
    ],
    metrology: [
      "Film thickness and uniformity are measured optically (e.g. reflectometry/ellipsometry) across many points on the wafer.",
      "Composition and film properties are checked with spectroscopic and physical-analysis techniques to confirm the right material and purity.",
      "Profiles and critical dimensions — sidewall angle, depth, feature width — are measured with cross-section or scatterometry methods to confirm the etch shape.",
      "Defects and particles are found by optical or e-beam inspection, and surface properties (roughness, residue) are checked to catch problems before the next layer.",
    ],
    yieldImpact: [
      "Because deposition and etch repeat on every layer, a small systematic error — a thickness drift, a slight over-etch — is multiplied across the wafer and across layers, quietly eroding yield.",
      "A single particle or a void from poor conformality in the wrong place can disable an entire chip, so defect and contamination control in these steps strongly gates yield.",
      "Profile and thickness control also set how much margin later steps have; a well-centred, uniform process is worth as much as raw capability.",
    ],
    designImplications: [
      "Design rules reflect what deposition and etch can actually build: how narrow a feature can be filled, how deep it can be cut, and how vertical the walls can be.",
      "Layouts favour regular, similar-density patterns because widely varying feature sizes and densities etch and deposit at different rates (loading effects).",
      "Structures are designed with realistic film thickness and etch-profile variation in mind, leaving margin so layers still connect and isolate correctly.",
    ],
    industryContext: [
      "Deposition and etch tools are a large share of a fab's equipment, and the number of these steps has grown as chips add more layers and move to 3D structures.",
      "Progress depends on a deep ecosystem: equipment makers, precursor and gas suppliers, and metrology vendors advancing together, much like lithography.",
      "As scaling shifts from shrinking flat features to building vertically, deposition and etch capability (conformal films, high-aspect-ratio etch) increasingly pace what new devices are possible.",
    ],
    deepDives: [
      {
        id: "why-deposition",
        level: "engineer",
        title: "Why deposition is needed: thin films",
        intro:
          "A chip is a stack of many thin films, each doing a specific electrical or structural job. Deposition is how those films are formed with the thickness, uniformity, and composition each job requires.",
        bullets: [
          "Conductors: metal films carry current — the contacts to devices and the wiring that links them.",
          "Insulators (dielectrics): films that electrically separate conductors and devices so signals do not short together.",
          "Semiconducting materials: semiconductor films (sometimes grown crystalline by epitaxy) that form or extend the active regions of devices.",
          "Barrier layers: thin films that block one material from diffusing into another — for example, keeping metal atoms out of the surrounding dielectric.",
          "Liners and adhesion layers: films that help the next material stick and deposit evenly on the surface below.",
          "Interconnect-related films: the combined stack of conductors, barriers, and dielectrics used to build multi-level wiring.",
        ],
        note:
          "Why thickness, uniformity, and composition matter: thickness sets electrical properties (resistance, capacitance) and must hit a target; uniformity keeps every device on the wafer behaving the same; composition and purity determine whether the film actually does its intended job. Small errors in any of the three shift device behaviour or reduce yield.",
      },
      {
        id: "deposition-techniques",
        level: "engineer",
        title: "Deposition techniques: CVD, PVD, ALD, epitaxy",
        intro:
          "There is no single best deposition method. Each forms a film in a different way, with different strengths — so fabs pick the method that fits the material, the shape, and the thickness control a layer needs. (Specific material/process pairings are process-dependent and not listed here.)",
        bullets: [
          "CVD (chemical vapour deposition) — What: a film grown from chemistry. How: precursor gases flow over the heated wafer and react at the surface, depositing a solid film (precursor gases → surface reaction → film formation). Materials: many conductors, insulators, and semiconductors depending on the chemistry. Why: good throughput and often good conformality. Limitations: needs suitable precursor chemistry, often elevated temperature, and byproducts to manage.",
          "PVD (physical vapour deposition) — What: a film formed by physically moving material. How: atoms are knocked off a solid source (sputtering) or boiled off it (evaporation) in vacuum and travel to the wafer. Materials: metals and some other materials. Why: simple, fast, high-purity films — common for metal layers. Limitations: largely line-of-sight, so it coats steep, narrow features poorly (limited conformality).",
          "ALD (atomic layer deposition) — What: film grown one atomic layer at a time. How: two precursors are pulsed alternately; each reaction is self-limiting, so exactly one layer forms per cycle (covered in its own deep dive). Materials: high-quality thin dielectrics and other films. Why: unmatched thickness control and conformality. Limitations: slow, because growth is cycle-by-cycle.",
          "Epitaxy — What: growth of a crystalline film aligned to the wafer's crystal. How: atoms arrive and arrange onto the existing lattice so the film continues the crystal structure. Materials: semiconductor layers. Why: gives device-quality single-crystal material. Limitations: demanding conditions (high purity, often high temperature) and constraints from the underlying crystal.",
        ],
      },
      {
        id: "cvd-detail",
        level: "engineer",
        title: "CVD in depth: precursor gases → surface reaction → film",
        intro:
          "Chemical vapour deposition grows a film from gas-phase chemistry: precursor gases are delivered to a hot wafer, react at the surface, and leave a solid film behind while volatile byproducts are pumped away.",
        bullets: [
          "Conformality: because the film grows from surface reactions rather than line-of-sight arrival, CVD can coat vertical walls and feature bottoms far better than PVD — valuable for 3D shapes.",
          "Uniformity: gas flow, temperature, and pressure must be balanced so the film grows at the same rate everywhere on the wafer.",
          "Temperature: reaction rate and film quality depend strongly on temperature; higher temperatures often improve quality but limit what underlying layers can tolerate.",
          "Pressure: chamber pressure affects how gases move and react; low-pressure and plasma-assisted variants exist to control rate, uniformity, and allowable temperature.",
          "Reaction chemistry: the choice of precursors sets which material forms, the byproducts produced, and the conditions required — the chemistry is central, not incidental.",
        ],
      },
      {
        id: "pvd-detail",
        level: "engineer",
        title: "PVD in depth: physical transport of material",
        intro:
          "Physical vapour deposition moves material physically, not chemically: atoms leave a solid source and travel through vacuum to condense on the wafer.",
        bullets: [
          "Sputtering: energetic ions strike a target, knocking atoms loose; those atoms fly to the wafer and build up a film. It is the workhorse for many metal layers.",
          "Evaporation: the source material is heated until it vaporises, and the vapour condenses on the cooler wafer.",
          "Where PVD is useful: fast, high-purity metal films on relatively open surfaces — for example, blanket metal layers and seed layers.",
          "Limitations: PVD is largely line-of-sight, so it thins or leaves gaps on steep sidewalls and at the bottoms of narrow, deep features — poor conformality compared with CVD or ALD.",
        ],
      },
      {
        id: "ald-detail",
        level: "advanced",
        title: "ALD: atomic-scale, self-limiting growth",
        intro:
          "Atomic layer deposition earns its own section because it works differently from the others: it grows a film in discrete cycles, and each cycle adds at most one atomic layer.",
        bullets: [
          "Self-limiting reactions: a first precursor is pulsed in and reacts with the surface until every available site is taken — then it stops on its own, because there is nothing left to react with. The chamber is purged, a second precursor is pulsed to complete the layer, and it too self-limits.",
          "Cycle-by-cycle growth: repeating this pulse–purge–pulse–purge cycle adds one atomic layer at a time, so final thickness is set simply by counting cycles.",
          "Conformality: because each step saturates every exposed surface equally — including deep, narrow walls — ALD coats complex 3D features with near-perfect evenness.",
          "Atomic-scale thickness control: growth per cycle is essentially fixed, giving sub-nanometre control that other methods cannot match.",
          "Why it is valuable for complex 3D structures: modern devices have extremely narrow, deep, and folded features; ALD's self-limiting, conformal growth is often the only way to line or fill them uniformly — at the cost of being slow.",
        ],
      },
      {
        id: "epitaxy-detail",
        level: "advanced",
        title: "Epitaxy: growing crystal on crystal",
        intro:
          "Epitaxy is deposition that preserves crystal order: instead of an amorphous or polycrystalline film, it grows a single-crystal layer that continues the wafer's own lattice.",
        bullets: [
          "Crystal growth: arriving atoms settle into positions that extend the existing crystal, so the new film shares the substrate's orderly lattice.",
          "Substrate relationship: the underlying crystal acts as a template; the film's structure (and any strain) depends on how well the two lattices match.",
          "Why crystal quality matters: defects and dislocations in the grown layer degrade device performance, so epitaxy demands very clean, controlled conditions.",
          "Device applications: epitaxial layers provide device-quality semiconductor material — for example, engineered channel or source/drain regions and high-quality starting layers for devices.",
        ],
      },
      {
        id: "advanced-deposition",
        level: "advanced",
        title: "Advanced deposition: what makes a film good",
        intro:
          "Beyond simply adding material, a production film has to meet many quality requirements at once. These are the properties process engineers actually tune.",
        bullets: [
          "Conformality: how uniformly a film coats 3D topography — ideally the same thickness on the top, the sidewalls, and the bottom of a feature. It is the single biggest differentiator between deposition methods.",
          "Step coverage: a practical measure of conformality — the ratio of the film's thickness on a sidewall or feature bottom to its thickness on the flat top. Poor step coverage leaves thin spots or voids where a feature bends.",
          "Nucleation: film growth starts as atoms gather into initial clusters (nuclei) on the surface. How readily and evenly nuclei form decides how thin a film can be before it is continuous, and how rough it ends up.",
          "Growth mechanisms: films can build up island-by-island, layer-by-layer, or a mix. The mode affects density, roughness, and the minimum continuous thickness achievable.",
          "Film stress: every deposited film carries intrinsic and thermal stress (tensile or compressive). Too much stress bows the wafer, cracks the film, or peels it off, so stress is deliberately managed.",
          "Composition control: hitting the right stoichiometry and purity — small deviations shift electrical and mechanical behaviour, so composition is monitored as tightly as thickness.",
          "Interface quality: the boundary between two films (how abrupt and clean it is, whether an unwanted reaction occurred) strongly affects the device — the gate-dielectric-to-channel interface is a classic example.",
          "Wafer uniformity: consistency of thickness and composition across the whole wafer and wafer-to-wafer; non-uniformity means devices behave differently depending on where they sit.",
        ],
      },
      {
        id: "cvd-pvd-ald-compare",
        level: "advanced",
        title: "CVD vs PVD vs ALD, compared",
        intro:
          "A side-by-side comparison of the three most common thin-film methods. Read it as a map of trade-offs, not a ranking — each is the right tool for different layers.",
        table: {
          columns: ["Dimension", "CVD", "PVD", "ALD"],
          rows: [
            ["Mechanism", "Precursor gases react at the wafer surface", "Atoms physically transported from a solid source in vacuum", "Alternating self-limiting surface reactions, one layer per cycle"],
            ["Conformality", "Generally good", "Limited (largely line-of-sight)", "Excellent"],
            ["Thickness control", "Good", "Moderate", "Atomic-scale, set by cycle count"],
            ["Throughput", "High", "High", "Low (cycle-by-cycle)"],
            ["Temperature", "Often elevated", "Can be relatively low", "Low to moderate for many chemistries"],
            ["Material range", "Wide", "Metals and some other materials", "Select high-quality films, especially dielectrics"],
            ["Geometry suitability", "Good for moderate 3D", "Best on open, flat surfaces", "Best for narrow, deep, complex 3D"],
            ["Typical applications", "Many dielectric, semiconductor, and metal films", "Metal layers, seed and adhesion layers", "Ultrathin dielectrics, liners and barriers, conformal coatings"],
            ["Main limitation", "Needs suitable precursors; byproducts and temperature", "Poor conformality on high-aspect-ratio features", "Slow throughput"],
          ],
          caption: "Conceptual comparison; exact capabilities are process- and tool-dependent.",
        },
        note:
          "No method is universally best. Each layer is matched to the method whose blend of conformality, thickness control, throughput, temperature, and material range fits the job — fabs use all three, often on the same chip.",
      },
      {
        id: "etch-types",
        level: "engineer",
        title: "Etching: wet vs dry, isotropic vs anisotropic",
        intro:
          "Etching removes selected material from the wafer — normally the material left exposed by openings in a resist or hard mask. It splits into two broad families with different behaviour.",
        bullets: [
          "Wet etching — a chemical reaction in a liquid dissolves and removes the target material (chemical reaction → material dissolution/removal). It is often highly selective and gentle, but usually isotropic (etches sideways as well as down), which limits how fine a feature it can hold. Selectivity, isotropy, surface compatibility, and bath control (concentration, temperature, time) are the levers. (No specific chemistries are given here.)",
          "Dry etching — a plasma of reactive species removes material, and can be made strongly directional. It combines chemistry (reactive species attack the material) with physics (ions accelerated toward the wafer strike it vertically), enabling anisotropic profiles with nearly vertical walls.",
          "Reactive-ion etching (RIE) is the classic example: a plasma supplies reactive species while an electric field drives ions downward, so the etch proceeds mostly straight down. Plasma etching more broadly spans more-chemical (less directional) to more-physical (more directional) regimes.",
          "Isotropic vs anisotropic: isotropic etches remove material equally in all directions (rounded, undercut profiles); anisotropic etches remove mainly downward (straight sidewalls). Fine, dense patterns need anisotropy, which is why dry etch dominates there.",
        ],
        note:
          "Dry is not automatically 'better': wet etching remains the right choice when its speed, gentleness, cost, or very high selectivity suit the job. This topic stays conceptual and does not provide hazardous processing instructions.",
      },
      {
        id: "selectivity",
        level: "engineer",
        title: "Selectivity: removing the target and nothing else",
        intro:
          "Selectivity answers one question: how well can we remove the target material without damaging the other materials around it?",
        bullets: [
          "Target material: the film you actually want to remove.",
          "Mask: the resist or hard mask on top that must survive the etch so the pattern is preserved.",
          "Underlying layer: the film beneath that the etch should stop on, not cut into.",
          "High selectivity means the etch removes the target much faster than it removes the mask or the underlayer — giving a wide margin to stop at the right place.",
        ],
        note:
          "Simple example: etching a contact hole through an insulator down to a metal pad. The etch must clear the insulator (target) but barely touch the metal beneath (underlayer) and not strip away the mask on top — so it needs high selectivity to both. Low selectivity would punch through the pad or lose the pattern.",
      },
      {
        id: "etch-profile",
        level: "advanced",
        title: "Etch profile & aspect-ratio effects",
        intro:
          "The shape an etch leaves behind — its profile — matters as much as how much it removes. Profile and depth-dependent effects decide whether a feature is usable.",
        bullets: [
          "Vertical sidewalls: straight-down walls from a strongly anisotropic etch — needed for fine, densely packed features.",
          "Tapered sidewalls: sloped walls, sometimes deliberate (to help a later film fill or coat the feature).",
          "Undercut: unwanted sideways etching beneath the mask edge, which shrinks or distorts the feature — common with isotropic etching.",
          "Aspect ratio: depth divided by width; as it rises, reactants struggle to reach the bottom and byproducts struggle to leave, making deep narrow etches much harder.",
          "Microloading: etch rate depends on how much exposed area or how many features are nearby — dense regions can etch at a different rate than isolated ones.",
          "Aspect-ratio-dependent etching (ARDE): narrow, high-aspect-ratio features etch more slowly than wide ones, so features of different sizes reach different depths in the same time — a key challenge for 3D structures.",
        ],
      },
      {
        id: "advanced-etching",
        level: "advanced",
        title: "Advanced etching: plasma, ions, and profiles",
        intro:
          "A production etch is a balance of chemistry and physics tuned to remove one material, in one direction, to one depth. These are the knobs and effects engineers work with.",
        bullets: [
          "Anisotropy: how directional the etch is. It comes from balancing a chemical (isotropic) component against an ion-driven (vertical) component — more ion drive gives straighter walls.",
          "Selectivity: removing the target much faster than the mask or the underlayer, achieved mainly through the choice of chemistry.",
          "Etch rate: how fast material is removed. It must be uniform and repeatable across the wafer, not merely fast — a fast but uneven etch is useless.",
          "Plasma chemistry: the gas mix sets which reactive species form, what they attack, and whether byproducts are volatile enough to leave — it largely determines both selectivity and rate.",
          "Ion energy: the energy of ions hitting the surface. Higher energy increases directionality and physical removal, but risks surface damage and can lower selectivity.",
          "Charging effects: insulating surfaces and deep features can accumulate electric charge that deflects incoming ions, distorting profiles (notching or bowing) — a real limit at high aspect ratios.",
          "Aspect-ratio-dependent etching (ARDE): deep, narrow features etch more slowly because reactants struggle to reach the bottom and byproducts struggle to escape.",
          "Microloading: the local etch rate depends on how much exposed area is nearby, so dense and isolated regions can etch differently.",
          "Endpoint detection: sensing the moment a layer is cleared — often by watching the plasma's optical emission change — so the etch stops at the right depth instead of over-etching into the layer below.",
        ],
      },
      {
        id: "process-control",
        level: "advanced",
        title: "Process control: keeping every wafer on target",
        intro:
          "Deposition and etch tools drift — chambers coat up, parts wear, gases vary. Fabs hold results steady by measuring, monitoring, and feeding corrections back, so the process is a controlled loop rather than a fixed recipe.",
        bullets: [
          "Sensors: in-situ sensors track plasma conditions, gas flows, pressure, temperature, and RF power in real time during the process.",
          "Endpoint detection: optical-emission or interferometric signals detect the transition to a new layer, so etch or deposition stops at exactly the right point.",
          "Statistical process control (SPC): measured outputs are tracked on control charts so drift is caught and corrected before it produces out-of-spec wafers.",
          "Metrology: inline and offline measurement of thickness, critical dimension, profile, and defects supplies the data the control system acts on.",
          "Feedback (run-to-run / advanced process control): corrections computed from metrology adjust the settings of the next run to re-centre the process.",
          "Chamber monitoring: the chamber's own condition (wall deposits, part wear, and matching between supposedly identical chambers) is tracked, because the chamber state itself changes the result.",
        ],
      },
      {
        id: "bringing-together",
        level: "advanced",
        title: "Bringing it together: repeated structure formation",
        intro:
          "Lithography, deposition, etching, and metrology are not separate topics in practice — they are one repeating loop, and repeating it is what builds complex structures.",
        flow: [
          "Lithography — where",
          "Deposition — add material",
          "Etching — remove material",
          "Metrology — measure & control",
          "Repeat → complex 3D structures",
        ],
        bullets: [
          "Each pass of the loop builds one part of one layer: lithography places the pattern, deposition supplies the material, etching shapes it, and metrology confirms every pass is in spec.",
          "A chip is hundreds of these passes stacked and aligned — remove any one of the four and the structure cannot be built reliably.",
          "Repeating and combining the steps is precisely what creates 3D transistors (fins, then nanosheets) and multi-level interconnect — structures no single step could ever make on its own.",
          "As flat scaling slows, more progress comes from building vertically, which leans even harder on conformal deposition, high-aspect-ratio and selective etching, and tight metrology working together.",
        ],
      },
      {
        id: "adv-research-frontiers",
        level: "researcher",
        title: "Research frontiers: atomic-scale, 3D, and new materials",
        intro:
          "The topics below separate what is already in high-volume production from what is emerging or ramping — a distinction worth keeping clear.",
        bullets: [
          "Atomic-scale process control: atomic layer etching (ALE) removes material in self-limiting cycles — the etch counterpart of ALD — for near-atomic precision. ALD is in production; ALE is emerging and expanding.",
          "High-aspect-ratio etching: pushing ever deeper, narrower, straighter etches (as in 3D memory) against ARDE, charging, and profile control — a continual engineering frontier.",
          "3D transistor structures: FinFETs are in production; device architecture keeps evolving toward more vertical, more folded shapes.",
          "Gate-all-around (GAA) structures: nanosheet transistors ramping at the leading edge, which depend on extremely selective etch and deposition to remove sacrificial layers from between stacked sheets.",
          "Backside processing: routing power (and eventually more) on the wafer's back side to relieve front-side congestion — emerging and beginning to ramp.",
          "New materials: alternative channel, contact, and dielectric materials are under active research to extend device performance.",
          "Selective deposition (area-selective deposition): growing a film only where it is wanted, guided by surface chemistry, potentially removing patterning steps — emerging.",
          "Selective etching: removing one material while barely touching an adjacent one, at very high selectivity — some in production and a key enabler for GAA, being pushed much further.",
        ],
        note:
          "In production today: CVD, PVD, ALD, plasma/RIE etching, FinFETs, endpoint detection, and SPC/APC. Emerging or ramping: atomic layer etching, gate-all-around nanosheets, backside power delivery, area-selective deposition, and new channel materials.",
      },
    ],
    keyTakeaways: [
      "Deposition adds material and etching removes it; with lithography deciding where, they build and shape a chip layer by layer.",
      "Deposition methods — CVD, PVD, ALD, epitaxy — each form films differently, trading off conformality, thickness control, temperature, and the materials they suit.",
      "Etching is wet or dry and isotropic or anisotropic; dry/plasma etch dominates fine features because it can cut straight down.",
      "Selectivity — removing the target without harming the mask or underlayer — and profile control are what make etching useful, not just removal.",
      "The add–pattern–remove cycle repeats hundreds of times, so thickness, uniformity, conformality, and profile control directly drive yield.",
    ],
    references: [
      {
        title: "Silicon VLSI Technology: Fundamentals, Practice, and Modeling",
        author: "J. D. Plummer, M. D. Deal, P. B. Griffin",
        publisher: "Prentice Hall",
        year: 2000,
        kind: "textbook",
        note: "Covers deposition (CVD, PVD, epitaxy) and etching within the full process flow.",
      },
      {
        title: "Introduction to Microfabrication",
        author: "Sami Franssila",
        publisher: "Wiley",
        year: 2010,
        kind: "textbook",
        note: "Accessible treatment of thin-film deposition, etching, and process integration.",
      },
      {
        title: "Fundamentals of Semiconductor Manufacturing and Process Control",
        author: "G. S. May, C. J. Spanos",
        publisher: "Wiley-IEEE Press",
        year: 2006,
        kind: "textbook",
        note: "Process steps together with metrology and process control.",
      },
      {
        title: "SEMI — global industry association for semiconductor manufacturing",
        publisher: "SEMI",
        url: "https://www.semi.org",
        kind: "standards",
        note: "Industry standards and background on manufacturing equipment and materials.",
      },
    ],
    relatedLessons: ["deposition", "lithography", "cmp", "metallization"],
  }),
  L({
    slug: "ion-implantation",
    pathId: "manufacturing",
    order: 9,
    title: "Doping",
    summary:
      "Deliberately adding tiny amounts of impurity atoms to silicon to control how it conducts — the step that turns inert crystal into transistors.",
    whatYoullLearn: [
      "Why pure silicon alone cannot make useful devices",
      "How electrons, holes, and energy bands give silicon its behaviour",
      "What n-type and p-type mean, and what donors and acceptors do",
      "How dopant concentration sets carrier concentration, conductivity, and resistivity",
      "How doping builds the PN junction and a transistor — and how doping is done and measured",
    ],
    whyItMatters:
      "Pure silicon barely conducts and cannot switch or amplify. Doping — adding controlled, minute amounts of specific impurity atoms — is what gives silicon the tunable, region-by-region electrical behaviour every transistor, diode, and chip depends on. Without controlled doping there are no PN junctions, no transistors, and no integrated circuits.",
    quickStart: [
      "Doping is the controlled introduction of impurity atoms into a semiconductor to modify its electrical properties.",
      "The chain is: pure silicon → controlled impurity introduction → changed carrier concentration → different electrical behaviour → working electronic devices.",
      "Adding donor atoms gives extra free electrons (n-type); adding acceptor atoms creates holes (p-type).",
      "The silicon stays a crystal throughout — doping changes how it conducts, not what it fundamentally is.",
      "Doping is done in precise amounts, in precise places (by ion implantation or diffusion), because where and how much you dope defines the device.",
    ],
    prerequisites: ["what-is-a-semiconductor", "intrinsic-semiconductor"],
    intuition: [
      "Pure (intrinsic) silicon is like a room full of people all holding hands — every electron is tied up in a bond, so almost nothing is free to move and carry current. Silicon on its own is a poor conductor.",
      "Doping is like slipping a few different people into that room. A donor atom brings an extra electron that is not needed for bonding, so it is free to roam and carry current (n-type). An acceptor atom is short one electron, leaving an empty spot — a 'hole' — that neighbouring electrons hop into, so the hole appears to move and also carries current (p-type).",
      "The key idea: you add only a tiny fraction of impurity atoms — often around one impurity per millions to billions of silicon atoms — yet that tiny, controlled addition transforms how the material conducts. It is precision, not contamination.",
    ],
    whereItFits: {
      journeyStepId: "doping",
      note: "Doping is interleaved with the other steps: a mask (from lithography) defines where dopants go, they are introduced by implantation or diffusion, and an anneal activates them — and this repeats to build the many differently-doped regions of every device.",
    },
    explanation: [
      "A semiconductor like silicon sits between a conductor and an insulator: on its own it conducts only weakly. Doping deliberately adds a small, precise amount of a chosen impurity element to change how many mobile charge carriers the material has, and therefore how well — and in what way — it conducts.",
      "There are two flavours. n-type doping adds donor atoms that contribute extra free electrons (negative carriers). p-type doping adds acceptor atoms that create holes (the absence of an electron, which behaves like a positive carrier). By placing n-type and p-type regions next to each other, engineers build the junctions that make diodes and transistors work.",
      "Crucially, doping is spatial: different regions of the same wafer are doped differently — some n-type, some p-type, some heavily, some lightly — to form sources, drains, channels, and wells. Getting the amount (dose) and the location and depth right is the whole game.",
      "Two methods introduce dopants: ion implantation (firing dopant ions into the wafer) and diffusion (letting dopants move into hot silicon). Both are usually followed by a thermal anneal that repairs the crystal and activates the dopants so they actually contribute carriers.",
    ],
    howItWorks: [
      "Choose the dopant: a donor element for n-type or an acceptor element for p-type, depending on the region being built.",
      "Define where: a mask (patterned by lithography, often oxide or resist) exposes only the regions that should be doped.",
      "Introduce the dopant: by ion implantation (fired in as an ion beam) or by diffusion (driven in thermally).",
      "Activate and repair: a thermal anneal moves dopant atoms onto crystal lattice sites so they contribute carriers, and heals any damage.",
      "Result: a region with a controlled carrier type and concentration, ready to form part of a junction or transistor.",
    ],
    steps: [
      { name: "Select dopant & target", detail: "Pick a donor (n-type) or acceptor (p-type) and the concentration and depth the region needs." },
      { name: "Mask the wafer", detail: "Use a lithographically patterned mask so only the intended regions receive dopant." },
      { name: "Introduce dopant", detail: "Add the dopant by ion implantation or by thermal diffusion." },
      { name: "Anneal", detail: "Heat the wafer to activate dopants (place them on lattice sites) and repair crystal damage." },
      { name: "Verify", detail: "Measure the doped region's depth and electrical behaviour (e.g. sheet resistance) before moving on." },
    ],
    science: [
      "Silicon is a crystal: each atom shares its four outer (valence) electrons with four neighbours in covalent bonds, forming a regular repeating lattice. In this bonded state, electrons are not free to move, so pure silicon conducts poorly.",
      "Energy bands explain conduction. Electrons bound in bonds occupy the valence band; to move freely and carry current they must reach the conduction band. Between the two lies the band gap — an energy step electrons must cross. Silicon's moderate band gap is why it is a semiconductor rather than a metal (no gap) or insulator (huge gap).",
      "Two kinds of carrier exist. An electron promoted into the conduction band is a free negative carrier. The empty bond it leaves behind is a hole — a vacancy that neighbouring electrons hop into, so the hole moves like a positive carrier. Current can be carried by both.",
      "In pure (intrinsic) silicon, electrons and holes exist only in equal, tiny numbers created by thermal energy — far too few for useful devices. Doping changes this: it deliberately adds carriers of one type, raising conductivity by orders of magnitude and setting whether a region is dominated by electrons (n-type) or holes (p-type).",
    ],
    equipment: [
      { name: "Ion implanter", detail: "Generates dopant ions, accelerates them, selects the desired ion, and scans the beam across the wafer to deliver a precise dose." },
      { name: "Diffusion furnace", detail: "A high-temperature furnace that drives dopant atoms into the silicon from a gas, liquid, or solid source." },
      { name: "Rapid thermal anneal (RTA)", detail: "Heats the wafer quickly and briefly to activate dopants and repair damage while limiting unwanted diffusion." },
      { name: "Masking layers", detail: "Patterned oxide or photoresist that blocks dopants everywhere except the intended regions." },
    ],
    materials: [
      { name: "Donor dopants (n-type)", detail: "Group V elements such as phosphorus, arsenic, or antimony, which each contribute an extra electron." },
      { name: "Acceptor dopants (p-type)", detail: "Group III elements such as boron, which each create a hole by being short one bonding electron." },
      { name: "Silicon substrate", detail: "The crystalline wafer into which dopants are introduced; it remains crystalline after doping." },
      { name: "Masking materials", detail: "Oxide or resist films that define where doping is allowed." },
    ],
    parameters: [
      { name: "Dopant concentration", detail: "How many dopant atoms are added per unit volume; sets the target carrier concentration." },
      { name: "Dose", detail: "In implantation, the number of ions delivered per unit area — the primary knob for how heavily a region is doped." },
      { name: "Energy", detail: "In implantation, the ion energy that largely sets how deep the dopant goes." },
      { name: "Junction depth", detail: "How deep the doped region extends before meeting oppositely-doped or undoped material." },
      { name: "Profile", detail: "How dopant concentration varies with depth — abrupt or graded — which shapes device behaviour." },
      { name: "Uniformity", detail: "Consistency of dose and depth across the wafer so devices match wherever they sit." },
      { name: "Activation", detail: "The fraction of dopant atoms placed on lattice sites so they actually contribute carriers." },
      { name: "Thermal budget", detail: "The total heat (temperature × time) the wafer receives; it activates dopants but also causes further diffusion." },
    ],
    parametersNote:
      "Specific doses, energies, temperatures, and concentrations are technology- and device-dependent and set by each fab. The values discussed here are conceptual, and this topic gives no operational equipment settings or hazardous process recipes.",
    visual:
      "Two silicon lattices side by side: on the left, a donor atom (e.g. phosphorus) contributes a free electron for n-type; on the right, an acceptor atom (e.g. boron) leaves a hole for p-type — the crystal is intact in both.",
    visualKey: "doping",
    terminology: [
      { term: "Doping", def: "Controlled introduction of impurity atoms to change a semiconductor's electrical behaviour." },
      { term: "Intrinsic semiconductor", def: "Pure, undoped silicon, with very few carriers." },
      { term: "Extrinsic semiconductor", def: "Doped silicon, whose carrier concentration is set by added impurities." },
      { term: "Donor", def: "A dopant atom that contributes a free electron (makes n-type)." },
      { term: "Acceptor", def: "A dopant atom that creates a hole (makes p-type)." },
      { term: "n-type", def: "Silicon where electrons are the majority carriers." },
      { term: "p-type", def: "Silicon where holes are the majority carriers." },
      { term: "Carrier", def: "A mobile charge that carries current — an electron or a hole." },
      { term: "Hole", def: "A missing electron in a bond that moves and behaves like a positive carrier." },
      { term: "Band gap", def: "The energy an electron must gain to move from the valence band to the conduction band." },
      { term: "Dose", def: "In implantation, the number of dopant ions delivered per unit area." },
      { term: "Junction depth", def: "How deep a doped region extends into the wafer." },
      { term: "Sheet resistance", def: "An electrical measure of how a thin doped layer conducts, reported in ohms per square." },
    ],
    formula: {
      expression: "σ = q · (n·μₙ + p·μₚ)",
      caption:
        "Conductivity rises with carrier concentration. Doping sets n (electrons) or p (holes), so it directly controls how well a region conducts. Full variable definitions are in the carriers deep dive below.",
    },
    example:
      "A MOSFET is built from doped regions: heavily-doped source and drain of one type sit in a lightly-doped well of the opposite type, with the channel between them controlled by the gate. Change the doping and you change the transistor — its junctions, its threshold, and how it switches.",
    commonMistakes: [
      "Thinking doping makes silicon 'dirty'. Doping is the deliberate, extremely controlled addition of specific atoms in precise amounts — the opposite of random contamination.",
      "Assuming more dopant is always better. Each region has a target concentration; too much can degrade the crystal, cause leakage, or ruin device behaviour just as too little can.",
      "Thinking p-type means the material has positive atoms overall. p-type silicon is electrically neutral overall; 'p' refers to holes being the majority mobile carriers, not a net positive charge.",
      "Thinking n-type means the material carries a negative charge overall. n-type silicon is also neutral overall; 'n' means electrons are the majority carriers, balanced by the fixed positive donor ions.",
      "Believing doping changes silicon into a different material. The silicon crystal remains silicon; only its carrier population — and thus its electrical behaviour — is modified.",
    ],
    realWorld:
      "Every transistor in every chip relies on precisely doped regions placed exactly where the design needs them. The ability to dope specific regions to specific concentrations and depths — repeatably, across billions of transistors on a wafer — is one of the foundations that makes integrated circuits possible.",
    defects: [
      "Incorrect dose: too much or too little dopant shifts carrier concentration and changes device thresholds and currents.",
      "Incorrect depth: an implant too shallow or too deep places the junction in the wrong place, altering how the device behaves.",
      "Non-uniformity: dose or depth varying across the wafer makes devices behave differently depending on location.",
      "Activation issues: dopants not properly placed on lattice sites do not contribute carriers, so the region under-performs.",
      "Excessive diffusion: too much thermal budget spreads dopants beyond their intended region, blurring junctions.",
      "Crystal damage: implantation damages the lattice; if not repaired by annealing, it degrades carrier movement and can cause leakage.",
      "Contamination: unwanted impurities introduced along with (or instead of) the intended dopant disrupt electrical behaviour.",
      "Junction leakage: damaged or poorly-formed junctions leak current when they should block it, wasting power and hurting performance.",
    ],
    metrology: [
      "Sheet resistance measures how well a thin doped layer conducts (in ohms per square) and is a fast, common check on whether a region was doped and activated as intended.",
      "Concentration profiling determines how dopant concentration varies with depth, revealing the shape of the doped region.",
      "Junction-depth measurement confirms how deep the doped region extends, since depth strongly affects device behaviour.",
      "Electrical characterization (measuring resistances, junction behaviour, and device parameters) checks that the doping produced the intended electrical result — the ultimate test of a doping step.",
    ],
    yieldImpact: [
      "Because doping sets transistor thresholds and currents, small dose or depth errors shift device behaviour and can push chips out of spec, directly lowering yield.",
      "Doping repeats across many regions and layers, so a systematic error is multiplied across billions of transistors — uniformity and control are essential.",
      "Junction leakage from doping or damage problems raises power consumption and can disable circuits, making defect and contamination control critical.",
    ],
    designImplications: [
      "Circuit and device designers specify target doping types, concentrations, and depths for every region; the process must hit them repeatably.",
      "Designs must tolerate real dose and depth variation, leaving margin so transistors still meet spec when doping is slightly off.",
      "Thermal budget is a shared, finite resource: later high-temperature steps move earlier dopants, so the whole flow is designed together to keep junctions where they belong.",
    ],
    industryContext: [
      "Controlled doping is one of the enabling pillars of the entire semiconductor industry — the reason silicon can be turned into switching devices at all.",
      "Ion implantation and annealing tools are precise, specialised systems, and their control over dose, depth, and thermal budget is central to making advanced transistors.",
      "As devices shrink and become more three-dimensional, placing dopants precisely (shallow junctions, tight profiles) becomes harder and increasingly paces device design.",
    ],
    deepDives: [
      {
        id: "carriers-conductivity",
        level: "engineer",
        title: "Carriers, conductivity, and concentration",
        intro:
          "Doping is powerful because it directly sets the number of mobile carriers, and carrier count controls conductivity. A few relationships make this precise.",
        equations: [
          {
            name: "Conductivity",
            expression: "σ = q · (n·μₙ + p·μₚ)",
            variables: [
              { symbol: "σ", meaning: "electrical conductivity (higher = conducts better)", unit: "S/cm" },
              { symbol: "q", meaning: "elementary charge (a constant, ≈ 1.6×10⁻¹⁹)", unit: "C" },
              { symbol: "n", meaning: "free-electron concentration", unit: "cm⁻³" },
              { symbol: "p", meaning: "hole concentration", unit: "cm⁻³" },
              { symbol: "μₙ", meaning: "electron mobility (how easily electrons move)", unit: "cm²/V·s" },
              { symbol: "μₚ", meaning: "hole mobility (how easily holes move)", unit: "cm²/V·s" },
            ],
            meaning:
              "Conductivity is the sum of what electrons and holes each contribute. Doping raises n (n-type) or p (p-type), so it directly raises conductivity — often by orders of magnitude versus intrinsic silicon.",
            assumptions: [
              "Mobilities are treated as roughly constant over a range, though they actually fall at very high doping and vary with temperature.",
              "Assumes dopants are activated (contributing carriers).",
            ],
            example:
              "In n-type silicon, electrons dominate, so σ ≈ q·n·μₙ. Raising the donor concentration about 10× raises n about 10×, so conductivity rises roughly 10× (mobility roughly steady over that range).",
            sensitivity: [
              "More doping → more carriers (n or p) → higher conductivity.",
              "Higher mobility → higher conductivity; electrons are typically more mobile than holes in silicon.",
              "At very high doping, mobility drops, so conductivity rises less than linearly.",
            ],
          },
          {
            name: "Resistivity",
            expression: "ρ = 1 / σ",
            variables: [
              { symbol: "ρ", meaning: "resistivity (higher = resists current more)", unit: "Ω·cm" },
              { symbol: "σ", meaning: "conductivity", unit: "S/cm" },
            ],
            meaning:
              "Resistivity is just the inverse of conductivity. Because doping raises conductivity, it lowers resistivity — a heavily doped region is far less resistive than intrinsic silicon.",
            assumptions: ["Same conditions as the conductivity relation (activated dopants, given temperature)."],
            example: "If doping raises conductivity 10×, resistivity falls to about one-tenth.",
            sensitivity: [
              "More doping → lower resistivity.",
              "Less doping → higher resistivity (closer to intrinsic silicon).",
            ],
          },
          {
            name: "Mass-action law",
            expression: "n · p = nᵢ²",
            variables: [
              { symbol: "n", meaning: "electron concentration", unit: "cm⁻³" },
              { symbol: "p", meaning: "hole concentration", unit: "cm⁻³" },
              { symbol: "nᵢ", meaning: "intrinsic carrier concentration of the material", unit: "cm⁻³" },
            ],
            meaning:
              "In equilibrium the product of electron and hole concentrations is fixed for a given material and temperature. So raising one carrier type (by doping) suppresses the other: n-type silicon has many electrons and few holes, and vice versa.",
            assumptions: [
              "Thermal equilibrium at a fixed temperature.",
              "nᵢ is very small for silicon at room temperature (around 10¹⁰ cm⁻³), and rises with temperature.",
            ],
            example:
              "Heavily doping n-type raises n far above nᵢ, so p = nᵢ²/n becomes tiny — electrons are the clear majority and holes the minority.",
            sensitivity: [
              "Increase n by doping → p falls to keep the product constant.",
              "Higher temperature → larger nᵢ → more of both carriers, which is why devices are sensitive to temperature.",
            ],
          },
        ],
        note:
          "The big picture: dopant concentration → carrier concentration → conductivity/resistivity. That chain is why a tiny, controlled amount of impurity has such an outsized electrical effect.",
      },
      {
        id: "doping-methods",
        level: "engineer",
        title: "Doping methods: diffusion vs ion implantation",
        intro:
          "Two methods put dopants into silicon. They differ fundamentally in how the dopant gets in and how precisely its amount and depth can be controlled.",
        bullets: [
          "Ion implantation: dopant atoms are ionised and fired into the wafer as an accelerated beam. The amount (dose) and depth (energy) are set electrically and independently, giving precise, repeatable control — even at low temperature.",
          "Diffusion: the wafer is heated and dopants move into the silicon from a source at the surface, driven by concentration gradient and temperature. Amount and depth are coupled through temperature and time, so they are harder to control independently.",
          "The fundamental difference: implantation delivers a measured quantity to a chosen depth by controlling a beam; diffusion relies on thermally-driven movement from the surface, where deeper almost always means more spread-out.",
        ],
      },
      {
        id: "ion-implantation-detail",
        level: "engineer",
        title: "Ion implantation, step by step",
        intro:
          "Ion implantation is the workhorse for controlled doping. Conceptually it is a beam of dopant ions aimed at the wafer.",
        flow: ["Ion generation", "Acceleration", "Beam (ion selection & scan)", "Wafer", "Implanted region"],
        bullets: [
          "Ion generation: the dopant element is turned into ions (charged atoms).",
          "Acceleration: an electric field accelerates the ions to a chosen energy.",
          "Beam: the desired ion is selected and the beam is scanned across the wafer so the dose lands uniformly, only where the mask allows.",
          "Dose: the number of ions per unit area — the main control over how heavily the region is doped.",
          "Energy: largely sets how deep the ions come to rest, and thus the junction depth.",
          "Depth & profile: together, energy and dose shape how dopant concentration varies with depth — the region's profile.",
        ],
        note:
          "Conceptual only: this describes the principle, not operational settings, and involves no hazardous process instructions.",
      },
      {
        id: "diffusion-detail",
        level: "engineer",
        title: "Diffusion: doping driven by heat",
        intro:
          "Diffusion introduces dopants by letting them migrate into hot silicon — the same way a drop of dye spreads through warm water, but atom by atom into a crystal.",
        bullets: [
          "Thermal diffusion: at high temperature, dopant atoms at the surface move into the silicon, seeking lower-concentration regions.",
          "Concentration gradients: dopants flow from where they are plentiful (the surface source) toward where they are scarce (deeper in), so the gradient drives the process.",
          "Temperature dependence: diffusion is strongly temperature-sensitive — hotter means faster movement and deeper penetration.",
          "Diffusion profiles: the result is typically a graded profile, highest at the surface and tapering with depth.",
        ],
        note:
          "Diffusion played a central historical role in early device making and is still used, but modern processes often rely heavily on ion implantation when precise, independently-controlled dose and depth are needed. Neither is universally 'better' — the choice depends on the region and the profile required.",
      },
      {
        id: "annealing-detail",
        level: "advanced",
        title: "Annealing: repairing and activating",
        intro:
          "Implanting ions damages the crystal and leaves many dopant atoms sitting in the wrong places. A thermal anneal fixes both — but heat is a double-edged tool.",
        bullets: [
          "Lattice damage: incoming ions knock silicon atoms out of place, disordering the crystal near the surface; heavy damage degrades how carriers move.",
          "Dopant activation: heating lets dopant atoms settle onto proper lattice sites, where they finally contribute free carriers — an un-activated dopant does nothing electrically.",
          "Diffusion during annealing: the same heat that activates dopants also lets them move, so the doped region can spread and the junction shift during the anneal.",
          "Trade-offs: enough heat is needed to repair damage and activate dopants, but too much thermal budget spreads dopants and blurs shallow junctions — so modern processes favour fast, brief anneals (e.g. rapid thermal annealing) to activate while limiting diffusion.",
        ],
      },
      {
        id: "pn-junction-detail",
        level: "engineer",
        title: "The PN junction — where doping becomes a device",
        intro:
          "Put a p-type region next to an n-type region and something remarkable happens: you get a PN junction, the building block of diodes and the heart of every transistor. This is doping's big payoff.",
        visualKey: "pn-junction",
        visualCaption:
          "A p-type region meets an n-type region; near the boundary a carrier-free depletion region forms, with a built-in electric field across it.",
        bullets: [
          "Where p meets n, free electrons from the n-side and holes from the p-side meet near the boundary and cancel, leaving a thin zone with almost no mobile carriers — the depletion region.",
          "The fixed dopant ions left behind in that zone (positive on the n-side, negative on the p-side) create a built-in potential — an internal voltage step across the junction, even with no battery attached.",
          "Carrier movement: that built-in field opposes further crossing, setting up a balance. Applying an external voltage one way shrinks the barrier and lets current flow; the other way widens it and blocks current.",
          "Diode behaviour: this is exactly why a PN junction conducts in one direction and blocks the other — a diode. Combine junctions and you can build a transistor that switches and amplifies.",
        ],
        note:
          "This is the 'aha': doping alone does nothing magical, but placing differently-doped regions together creates junctions — and junctions are what compute.",
      },
      {
        id: "doping-in-transistors",
        level: "advanced",
        title: "Doping inside a transistor",
        intro:
          "A transistor is essentially an arrangement of doped regions. Doping type, amount, and placement define every part of it.",
        visualKey: "mosfet",
        visualCaption:
          "A MOSFET: heavily-doped source and drain in a well of the opposite type, with the gate controlling the channel between them.",
        bullets: [
          "Source and drain: heavily-doped regions of one carrier type that the current flows between.",
          "Channel: the region between source and drain whose conduction the gate switches on and off; its doping helps set the transistor's threshold.",
          "Wells: larger regions of a given doping type that host transistors of the opposite type, isolating them and providing the body the device needs.",
          "Junctions everywhere: source-to-well and drain-to-well are PN junctions, so the whole device is built from the doped regions and the junctions between them.",
        ],
        note:
          "Change the doping — type, concentration, depth, or placement — and you change the transistor. Controlled spatial doping is what makes a specific device rather than a lump of silicon.",
      },
    ],
    keyTakeaways: [
      "Pure silicon conducts poorly; doping adds tiny, controlled amounts of impurity to give it useful, tunable electrical behaviour.",
      "Donors make n-type (extra electrons); acceptors make p-type (holes) — and the crystal stays silicon, electrically neutral overall.",
      "Dopant concentration sets carrier concentration, which sets conductivity (σ = q(nμₙ + pμₚ)) and resistivity.",
      "Placing p-type next to n-type creates the PN junction — the basis of diodes and transistors — so where you dope matters as much as how much.",
      "Doping is done by ion implantation or diffusion and usually followed by annealing to activate dopants and repair the crystal; dose, depth, and thermal budget must be tightly controlled.",
    ],
    references: [
      {
        title: "Silicon VLSI Technology: Fundamentals, Practice, and Modeling",
        author: "J. D. Plummer, M. D. Deal, P. B. Griffin",
        publisher: "Prentice Hall",
        year: 2000,
        kind: "textbook",
        note: "Covers doping, diffusion, ion implantation, and annealing in depth.",
      },
      {
        title: "Semiconductor Physics and Devices",
        author: "Donald A. Neamen",
        publisher: "McGraw-Hill",
        year: 2012,
        kind: "textbook",
        note: "Clear treatment of carriers, doping, and the PN junction for beginners.",
      },
      {
        title: "Physics of Semiconductor Devices",
        author: "S. M. Sze, Kwok K. Ng",
        publisher: "Wiley",
        year: 2007,
        kind: "textbook",
        note: "Standard reference on junctions and device physics.",
      },
      {
        title: "SEMI — global industry association for semiconductor manufacturing",
        publisher: "SEMI",
        url: "https://www.semi.org",
        kind: "standards",
        note: "Background on manufacturing equipment and materials.",
      },
    ],
    relatedLessons: ["pn-junction", "n-type", "p-type", "mosfet"],
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
