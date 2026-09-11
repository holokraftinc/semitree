/**
 * Semiconductor design flow — the guided "idea → chip" path.
 *
 * SOURCE OF TRUTH for the /semiconductors/design landing. Each stage answers the
 * same questions (what/why/who/in/out/what-can-go-wrong) and REUSES existing
 * lessons via `lessons` (→ /semiconductors/learn/<slug>) rather than duplicating
 * content. "What happens next" is derived from `order`. Adding a stage here adds
 * it to the page — no component change. Every slug in `lessons` must exist in
 * SEMI_LESSONS (enforced by design-flow.test.ts).
 */

/** Which segment of the idea→chip journey a stage belongs to. */
export type DesignPhase = "design" | "manufacture" | "package" | "test";

export const DESIGN_PHASE_LABELS: Record<DesignPhase, string> = {
  design: "Design",
  manufacture: "Manufacture",
  package: "Package",
  test: "Test",
};

export interface DesignStageLink {
  label: string;
  href: string;
}

export interface DesignStage {
  slug: string;
  order: number;
  phase: DesignPhase;
  title: string;
  /** The question that makes a learner curious about this stage. */
  question: string;
  what: string;
  why: string;
  who: string;
  inputs: string;
  outputs: string;
  /** What can go wrong here. */
  risks: string;
  /** Existing lessons to reuse: resolve to /semiconductors/learn/<slug>. */
  lessons: string[];
  /** Other in-site connections (explorers, tools, concepts). */
  links?: DesignStageLink[];
}

export const DESIGN_FLOW: DesignStage[] = [
  {
    slug: "define-the-problem",
    order: 1,
    phase: "design",
    title: "Define the problem",
    question: "What should this chip do — and for whom?",
    what: "A market or product need is turned into concrete requirements: functions, performance, power, area, cost, and the interfaces the chip must support.",
    why: "Every later decision is judged against these requirements. A vague specification leads to a chip that works but does not fit the product.",
    who: "Product managers, system architects, and customers.",
    inputs: "Market need, use cases, and constraints (cost, power budget, schedule).",
    outputs: "A product and technical specification.",
    risks: "Missing or ambiguous requirements, or targets that are physically or economically impossible.",
    lessons: [],
  },
  {
    slug: "create-the-architecture",
    order: 2,
    phase: "design",
    title: "Create the architecture",
    question: "How will the chip be organised to meet the spec?",
    what: "Architects choose the major blocks (CPU/GPU/accelerators, memory, I/O), how they connect, and the performance–power–area trade-offs — the microarchitecture.",
    why: "The architecture sets the ceiling on performance and efficiency before a single line of RTL is written.",
    who: "Chip and system architects.",
    inputs: "The specification.",
    outputs: "An architecture / microarchitecture definition and block diagram.",
    risks: "Over- or under-designing, or baking in bottlenecks such as memory bandwidth or interconnect limits.",
    lessons: ["architecture"],
    links: [{ label: "Integrated circuit", href: "/semiconductors/learn/integrated-circuit" }],
  },
  {
    slug: "design-the-logic",
    order: 3,
    phase: "design",
    title: "Design the logic",
    question: "What digital logic implements each block?",
    what: "Blocks are expressed as Boolean logic and functional units — datapaths, control, and state machines — built from logic gates and standard cells.",
    why: "Logic is the bridge between architectural intent and something that can be described in hardware.",
    who: "Digital design engineers.",
    inputs: "The architecture / microarchitecture.",
    outputs: "A functional logic definition.",
    risks: "Logic that is correct but too slow, too large, or too power-hungry.",
    lessons: ["logic"],
    links: [
      { label: "CMOS", href: "/semiconductors/learn/cmos" },
      { label: "MOSFET", href: "/semiconductors/learn/mosfet" },
    ],
  },
  {
    slug: "write-rtl",
    order: 4,
    phase: "design",
    title: "Write RTL",
    question: "How is the logic captured in a hardware language?",
    what: "Engineers describe the design at register-transfer level in a hardware description language (e.g. Verilog/SystemVerilog): registers and the logic between them, evaluated each clock cycle.",
    why: "RTL is the human-written, machine-readable source that tools transform into a physical chip.",
    who: "RTL / design engineers.",
    inputs: "Logic design and specification.",
    outputs: "Synthesizable RTL plus timing and design constraints.",
    risks: "Functional bugs, untestable code, or RTL that cannot meet timing after synthesis.",
    lessons: ["rtl"],
  },
  {
    slug: "verify-the-design",
    order: 5,
    phase: "design",
    title: "Verify the design",
    question: "Does the design actually do what the spec says?",
    what: "The RTL is exercised with simulation, testbenches, assertions, and coverage — and sometimes formal methods — to find bugs before anything is manufactured.",
    why: "Fixing a bug in RTL costs minutes; finding it after tape-out can cost months and a costly mask respin.",
    who: "Verification engineers — often the largest team on a project.",
    inputs: "RTL and a verification plan.",
    outputs: "Verified RTL with coverage evidence and a closed bug list.",
    risks: "Missed corner cases — a bug that escapes to silicon.",
    lessons: ["verification"],
  },
  {
    slug: "synthesize",
    order: 6,
    phase: "design",
    title: "Synthesize",
    question: "How does RTL become a gate-level circuit?",
    what: "A synthesis tool maps RTL onto a foundry's standard-cell library for a target process, optimising for timing, area, and power under the given constraints.",
    why: "It translates abstract code into the actual gates the foundry can build.",
    who: "Implementation engineers using EDA (electronic design automation) tools.",
    inputs: "RTL, constraints, and a standard-cell library from the foundry's PDK.",
    outputs: "A gate-level netlist.",
    risks: "Timing not met, area or power blow-up, or constraints that do not reflect reality.",
    lessons: ["synthesis"],
    links: [{ label: "CMOS (standard cells)", href: "/semiconductors/learn/cmos" }],
  },
  {
    slug: "physical-design",
    order: 7,
    phase: "design",
    title: "Design the physical layout",
    question: "Where does every gate and wire physically go on the die?",
    what: "Floorplanning, placement, clock-tree synthesis, and routing turn the netlist into an actual geometric layout of cells and interconnect.",
    why: "Physics — distance, resistance, capacitance — decides real speed and power, not the netlist alone.",
    who: "Physical-design / implementation engineers.",
    inputs: "Gate-level netlist, constraints, and the PDK.",
    outputs: "A placed-and-routed layout.",
    risks: "Routing congestion, timing or IR-drop problems, or a layout that cannot close.",
    lessons: ["physical-design", "place-and-route"],
  },
  {
    slug: "sign-off",
    order: 8,
    phase: "design",
    title: "Sign off",
    question: "Is the layout correct, manufacturable, and reliable?",
    what: "Final checks — static timing analysis (STA), design-rule check (DRC), layout-versus-schematic (LVS), IR-drop, and electromigration/reliability — confirm the design is ready.",
    why: "These are the last gates before committing to expensive masks and fabrication.",
    who: "Signoff and CAD engineers.",
    inputs: "The final layout and the foundry's rule decks.",
    outputs: "A clean, signed-off design database.",
    risks: "A violation slipping through, or margins that are too optimistic.",
    lessons: ["signoff"],
  },
  {
    slug: "tape-out",
    order: 9,
    phase: "design",
    title: "Tape out",
    question: "What is handed to the foundry?",
    what: "The finished layout is packaged as a database (e.g. GDSII/OASIS) and sent to the foundry to make the photomasks — the point of no return.",
    why: "It is the formal hand-off from design to manufacturing.",
    who: "The design team, handing off to the foundry.",
    inputs: "The signed-off design database.",
    outputs: "A mask data set at the foundry.",
    risks: "A late error becomes an expensive mask respin and schedule slip.",
    lessons: ["tapeout"],
  },
  {
    slug: "manufacture",
    order: 10,
    phase: "manufacture",
    title: "Manufacture",
    question: "How is the chip actually built on silicon?",
    what: "In the fab, hundreds of steps — lithography, deposition, etching, doping, CMP, and metallization — build the design layer by layer on a silicon wafer.",
    why: "This is where the design becomes physical transistors and wires.",
    who: "Fab process engineers and operators (a foundry or an IDM).",
    inputs: "Photomasks and blank wafers.",
    outputs: "Finished wafers, each holding many dies.",
    risks: "Defects and process variation that reduce yield.",
    lessons: ["lithography", "etching", "deposition"],
    links: [{ label: "Manufacturing process explorer", href: "/manufacturing" }],
  },
  {
    slug: "package",
    order: 11,
    phase: "package",
    title: "Package",
    question: "How does the tiny die connect to the outside world?",
    what: "Wafers are diced into individual dies, which are attached to a package or substrate and connected — by wire bond, flip-chip, or advanced 2.5D/3D methods — then encapsulated.",
    why: "Packaging provides electrical connections, mechanical protection, and a thermal path — and increasingly sets overall system performance.",
    who: "OSATs, foundry advanced-packaging lines, or IDMs.",
    inputs: "Tested wafers and dies.",
    outputs: "Packaged chips.",
    risks: "Thermal, warpage, and interconnect-reliability problems.",
    lessons: ["dicing", "packaging", "traditional-packaging", "flip-chip"],
  },
  {
    slug: "test",
    order: 12,
    phase: "test",
    title: "Test",
    question: "Does each finished chip actually work?",
    what: "Chips are tested — at wafer level and again after packaging (final test) — for function, speed, and reliability, then binned or discarded.",
    why: "Only known-good chips should reach customers, and the test data also feeds yield learning back to design and the fab.",
    who: "Test and product engineers.",
    inputs: "Packaged chips (and wafers, earlier in the flow).",
    outputs: "Known-good, binned devices ready to ship.",
    risks: "Test escapes (bad chips passing) or over-rejection (good chips failing).",
    lessons: ["wafer-test", "final-test"],
    links: [{ label: "Die-per-wafer & yield tools", href: "/semiconductors/tools" }],
  },
];

export function getDesignStage(slug: string): DesignStage | undefined {
  return DESIGN_FLOW.find((s) => s.slug === slug);
}
