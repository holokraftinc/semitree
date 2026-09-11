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

export interface SemiTerm {
  term: string;
  def: string;
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
  | "chiplets";

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
    title: "Advanced Packaging",
    summary: "From wire-bond packages to chiplets, 3D stacks, and HBM.",
    lessonSlugs: [
      "traditional-packaging",
      "wire-bonding",
      "flip-chip",
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
    title: "Lithography",
    summary: "Projecting each layer's pattern onto the wafer — the step that defines feature size.",
    whatYoullLearn: ["How projection lithography works", "Why wavelength limits resolution", "What EUV changed"],
    whyItMatters: "Lithography is the pacing technology of Moore's Law — it sets how small features can be.",
    explanation: [
      "A stepper/scanner projects the mask pattern, usually demagnified, onto the resist-coated wafer, repeating across the wafer. Resolution improves with shorter wavelength and higher numerical aperture.",
      "Deep-ultraviolet (193 nm) light, with tricks like immersion and multi-patterning, carried the industry for years; extreme-ultraviolet (13.5 nm) EUV now enables the smallest features.",
    ],
    visual: "Light through a mask, focused by a lens, projecting a demagnified pattern onto the wafer.",
    terminology: [
      { term: "Scanner/stepper", def: "The tool that projects the pattern across the wafer." },
      { term: "Numerical aperture (NA)", def: "A lens property; higher NA resolves finer features." },
      { term: "EUV", def: "13.5 nm extreme-ultraviolet lithography." },
    ],
    formula: {
      expression: "Resolution ≈ k₁ · λ / NA",
      caption: "The Rayleigh criterion: smaller λ and larger NA resolve finer features.",
    },
    example: "Multi-patterning splits one dense layer into several exposures to beat the single-exposure limit.",
    commonMistakes: ["Assuming feature size equals the light wavelength — clever techniques go well below it."],
    realWorld: "EUV scanners are among the most complex machines ever built.",
    relatedLessons: ["photoresist", "etching", "mask"],
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
