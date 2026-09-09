/**
 * Learn lesson content.
 *
 * Structured content (not MDX) so every lesson renders through one consistent
 * template (see LessonView). Only genuinely-written lessons live here; the Learn
 * index links a curriculum module to a lesson via its `lessonSlug`.
 *
 * References: no fabricated citations or URLs. Where a standard text applies it
 * is named (title + author) with a "verify edition" note and NO link; otherwise
 * a clearly-marked placeholder is used.
 */

export interface LessonVariable {
  symbol: string;
  name: string;
  unit?: string;
}

export interface FurtherReadingItem {
  /** A real title, or a clearly-marked placeholder. Never a fabricated link. */
  title: string;
  author?: string;
  note?: string;
  /** Optional bibliographic detail for proper references (never fabricated). */
  year?: number;
  publisher?: string;
  /** A real, verified link only. Leave empty rather than guessing. */
  url?: string;
  /** A real DOI only — never invented. */
  doi?: string;
  kind?: "review" | "paper" | "textbook" | "resource";
}

/**
 * Standardized detailed-learning-module schema (Phase 14).
 *
 * The base fields (title…furtherReading) are unchanged and required-as-before, so
 * every existing lesson renders exactly as it did. The OPTIONAL fields below add
 * the standard multi-level sections — Quick start, Intuition, How it works,
 * equation assumptions + dimensionless interpretation, Microfluidic example,
 * Practical design implications, and (collapsible) Researcher notes. A section is
 * rendered only when its field is present, so no section is ever forced.
 *
 * Section order in LessonView (present sections only):
 *  Quick start → What you'll learn → Intuition → The concept → Why it matters →
 *  How it works → Equation (+ assumptions, dimensionless) → Worked example →
 *  Microfluidic example → Practical design implications → Try it →
 *  Common mistakes → Researcher notes → Related concepts → References.
 */
export interface LessonContent {
  slug: string;
  title: string;
  level: number;
  order: number;
  summary: string;
  estimatedMinutes?: number;
  /** QUICK START — "If you only remember three things…" (3–5 takeaways). */
  quickStart?: string[];
  whatYoullLearn: string[];
  /** INTUITION — analogies / everyday framing before the technical definition. */
  intuition?: string[];
  concept: string[];
  whyItMatters: string[];
  /** HOW IT WORKS — the mechanism, step by step. */
  howItWorks?: string[];
  equation?: { expression: string; caption?: string };
  variables?: LessonVariable[];
  /** Assumptions under which the equation holds. */
  equationAssumptions?: string[];
  /** For a dimensionless number: what high vs low means, and what wins. */
  dimensionless?: { high: string; low: string; competing?: string };
  workedExample?: { intro: string[]; math?: string; conclusion?: string };
  /** MICROFLUIDIC EXAMPLE — the theory in a real microfluidic situation. */
  microfluidicExample?: string[];
  /** PRACTICAL DESIGN IMPLICATIONS — what changes when you design a device. */
  designImplications?: string[];
  /** Slug of the calculator the "Try it yourself" button opens. */
  tryItToolSlug?: string;
  commonMistakes?: string[];
  /** RESEARCHER NOTES — advanced context; rendered collapsed. */
  researcherNotes?: string[];
  /** Glossary concept slugs (resolved to /concepts#slug). */
  relatedConceptSlugs?: string[];
  /** Tool slugs (resolved to /tools/slug). */
  relatedToolSlugs?: string[];
  /** REFERENCES / further reading — verified sources only. */
  furtherReading?: FurtherReadingItem[];
}

/**
 * The canonical section keys of a detailed learning module, in render order.
 * Useful for tests and tooling that reason about module completeness.
 */
export const LESSON_SECTIONS = [
  "quickStart",
  "whatYoullLearn",
  "intuition",
  "concept",
  "whyItMatters",
  "howItWorks",
  "equation",
  "workedExample",
  "microfluidicExample",
  "designImplications",
  "commonMistakes",
  "researcherNotes",
  "related",
  "references",
] as const;

export type LessonSectionKey = (typeof LESSON_SECTIONS)[number];

export const LESSONS: LessonContent[] = [
  // ---------------------------------------------------------------- Level 0
  {
    slug: "what-is-microfluidics",
    title: "What is microfluidics?",
    level: 0,
    order: 1,
    summary:
      "The science of manipulating tiny volumes of fluid inside micrometre-scale channels.",
    estimatedMinutes: 6,
    whatYoullLearn: [
      "What “microfluidics” means and the length and volume scales involved",
      "What a microfluidic chip is and what it can contain",
      "Why shrinking a protocol onto a chip is useful",
    ],
    concept: [
      "Microfluidics is the study and engineering of fluids in channels whose dimensions are on the order of micrometres — typically 1 to 1000 µm. At this scale the volumes involved shrink to microlitres, nanolitres, or even picolitres: a droplet thousands of times smaller than a raindrop.",
      "A microfluidic “chip” routes these small volumes through networks of channels moulded or etched into glass, silicon, or a soft polymer such as PDMS. Pumps, valves, mixers, and sensors can be built at the same scale, so in principle an entire benchtop protocol can be shrunk onto a chip the size of a coin — the “lab-on-a-chip” idea.",
      "The appeal is not only miniaturisation. Small volumes mean less reagent, faster heat and mass transfer, and many experiments running in parallel. And, as the next lessons show, the physics itself changes at the microscale in ways you can design around.",
    ],
    whyItMatters: [
      "Using less sample and reagent per experiment cuts cost and makes precious samples — a single cell, one drop of blood — go much further.",
      "Precise, repeatable control of tiny volumes is what makes modern diagnostics, drug screening, and single-cell biology possible.",
    ],
    workedExample: {
      intro: [
        "How little fluid is “microfluidic”? Take a channel 100 µm wide, 100 µm tall, and 1 cm long and work out its volume:",
      ],
      math: "V = (100×10⁻⁶ m)(100×10⁻⁶ m)(1×10⁻² m) = 1×10⁻¹⁰ m³ ≈ 100 nL",
      conclusion:
        "That is about one ten-thousandth of a millilitre — roughly a thousandth of a typical raindrop.",
    },
    commonMistakes: [
      "Assuming microfluidics just means “smaller pumps.” The behaviour of the fluid itself changes at this scale, so everyday plumbing intuition often fails.",
      "Confusing the channel dimensions (micrometres) with the device footprint (centimetres).",
    ],
    relatedConceptSlugs: [
      "microfluidics",
      "lab-on-chip",
      "laminar-flow",
      "droplet-microfluidics",
    ],
    relatedToolSlugs: ["unit-converter"],
    furtherReading: [
      {
        title: "Introduction to Microfluidics",
        author: "Patrick Tabeling",
        note: "A standard, accessible introduction. Verify the current edition.",
      },
    ],
  },
  {
    slug: "why-microscale-is-different",
    title: "Why the microscale behaves differently",
    level: 0,
    order: 2,
    summary:
      "As channels shrink, viscosity and surface tension take over while inertia and gravity fade.",
    estimatedMinutes: 8,
    whatYoullLearn: [
      "How the balance of forces shifts as size shrinks",
      "Why microscale flow is smooth (laminar) rather than turbulent",
      "Why surface tension and diffusion come to dominate",
    ],
    concept: [
      "When a channel shrinks, not all forces shrink at the same rate. Inertial and gravitational effects scale with volume (∝ L³), while viscous and surface-tension effects scale with area or length (∝ L² or L). Make L small and the volume-dependent effects — inertia, gravity, buoyancy — fade relative to viscosity and surface tension.",
      "The practical consequence is that microscale flow is dominated by viscosity. Flow is laminar (smooth and layered) rather than turbulent, so streams travel side by side and blend only by diffusion. Surface tension becomes strong enough to hold droplets together and to pull liquid into channels by capillary action.",
      "These are not obstacles to fight but tools to design with: predictable laminar streams, capillary-driven filling, and stable droplet compartments are all direct consequences of small size.",
    ],
    whyItMatters: [
      "Laminar flow is deterministic, so you can design exactly where each fluid goes.",
      "It also explains why mixing is hard (there is no turbulence to help) and why droplets and capillary filling work so reliably.",
    ],
    equation: {
      expression: "Re = ρ · v · Dₕ / μ",
      caption:
        "The Reynolds number captures the balance — inertial forces over viscous forces.",
    },
    variables: [
      { symbol: "Re", name: "Reynolds number", unit: "—" },
      { symbol: "ρ", name: "Fluid density", unit: "kg/m³" },
      { symbol: "v", name: "Mean velocity", unit: "m/s" },
      { symbol: "Dₕ", name: "Hydraulic diameter", unit: "m" },
      { symbol: "μ", name: "Dynamic viscosity", unit: "Pa·s" },
    ],
    workedExample: {
      intro: [
        "Compare water flowing at 1 cm/s through a 100 µm channel with the same water in a river:",
      ],
      math: "Re_chip = (1000)(0.01)(100×10⁻⁶) / (1×10⁻³) ≈ 1",
      conclusion:
        "The microchannel sits at Re ≈ 1 (firmly laminar), while a river can exceed Re ≈ 10⁶ (fully turbulent) — the same fluid, utterly different behaviour.",
    },
    tryItToolSlug: "reynolds-number",
    commonMistakes: [
      "Trying to mix two microscale streams by “stirring” — turbulence is not available; mixing is diffusion-limited.",
      "Ignoring surface tension and capillary effects that are negligible at large scale but dominant here.",
    ],
    relatedConceptSlugs: ["laminar-flow", "surface-tension", "reynolds-number"],
    relatedToolSlugs: ["reynolds-number", "diffusion-time"],
    furtherReading: [
      {
        title: "Theoretical Microfluidics",
        author: "Henrik Bruus",
        note: "Covers the scaling of forces in detail. Verify the current edition.",
      },
    ],
  },
  {
    slug: "major-applications",
    title: "Major applications",
    level: 0,
    order: 3,
    summary:
      "Where microfluidics is used — diagnostics, single-cell biology, organ-on-chip, flow chemistry, and cooling.",
    estimatedMinutes: 7,
    whatYoullLearn: [
      "The major application areas and what each needs from the physics",
      "How the calculators on this site map onto real workflows",
    ],
    concept: [
      "Diagnostics and point-of-care: lab-on-chip devices run assays — lateral-flow tests are the everyday example — using tiny samples, moving testing out of central laboratories.",
      "Single-cell analysis: droplet microfluidics encapsulates individual cells in picolitre droplets for techniques such as single-cell RNA sequencing (scRNA-seq).",
      "Organ-on-chip and cell culture: microchannels recreate tissue-like environments with controlled flow and chemical gradients.",
      "Chemical synthesis and flow chemistry: continuous microreactors give fast, well-controlled reactions with excellent heat transfer.",
      "Microfluidic cooling: dense networks of microchannels carry heat away from high-power electronics and AI chips, exploiting the large surface-area-to-volume ratio.",
    ],
    whyItMatters: [
      "Each application leans on microscale physics: laminar gradients for cell culture, Poisson statistics for single-cell loading, and high surface-area-to-volume for cooling.",
      "Knowing the target application tells you which physics — and which of these tools — you will actually need.",
    ],
    workedExample: {
      intro: [
        "In droplet single-cell sequencing, cells are diluted so that most droplets are empty and very few hold two cells. Whether a droplet gets 0, 1, or 2+ cells follows Poisson statistics — something you can size up directly.",
      ],
      conclusion:
        "Open the single-cell loading tool to see how the empty / single / doublet fractions depend on the mean cells per droplet.",
    },
    tryItToolSlug: "poisson-single-cell-loading",
    commonMistakes: [
      "Assuming one chip design fits every application — requirements (flow rates, materials, throughput) differ sharply between, say, cooling and single-cell work.",
    ],
    relatedConceptSlugs: [
      "lab-on-chip",
      "droplet-microfluidics",
      "poisson-loading",
    ],
    relatedToolSlugs: ["poisson-single-cell-loading"],
    furtherReading: [
      {
        title: "Fundamentals and Applications of Microfluidics",
        author: "Nguyen & Wereley",
        note: "Broad coverage of devices and applications. Verify the current edition.",
      },
    ],
  },

  // ---------------------------------------------------------------- Level 1
  {
    slug: "laminar-flow",
    title: "Laminar flow",
    level: 1,
    order: 1,
    summary:
      "Why microscale flow moves in smooth, parallel layers — and what that means for mixing.",
    estimatedMinutes: 8,
    whatYoullLearn: [
      "What laminar flow is and how it differs from turbulent flow",
      "Why it dominates at the microscale",
      "What it implies for mixing and channel design",
    ],
    concept: [
      "In laminar flow, fluid moves in smooth layers (“laminae”) that slide past one another without cross-currents. Adjacent streams stay separate and follow predictable paths set entirely by the channel geometry.",
      "Turbulence — the chaotic eddies that mix fluid rapidly — needs inertia to overcome viscosity. At the microscale viscosity wins overwhelmingly, so flow stays laminar across nearly all practical conditions.",
      "Two streams meeting in a microchannel therefore flow side by side and blend only where molecules diffuse across the interface. This is exactly why designers reach for long serpentine channels or herringbone structures when they need fast mixing.",
    ],
    whyItMatters: [
      "Deterministic flow lets you position fluids precisely — laminar co-flow and gradient generators depend on it.",
      "It also means mixing must be engineered deliberately, never assumed.",
    ],
    equation: {
      expression: "Re = ρ · v · Dₕ / μ",
      caption: "Below Re ≈ 2000 (in a pipe), flow is laminar.",
    },
    variables: [
      { symbol: "Re", name: "Reynolds number", unit: "—" },
      { symbol: "ρ", name: "Fluid density", unit: "kg/m³" },
      { symbol: "v", name: "Mean velocity", unit: "m/s" },
      { symbol: "Dₕ", name: "Hydraulic diameter", unit: "m" },
      { symbol: "μ", name: "Dynamic viscosity", unit: "Pa·s" },
    ],
    workedExample: {
      intro: ["Water at 1 cm/s in a 100 µm channel:"],
      math: "Re = (1000)(0.01)(100×10⁻⁶) / (1×10⁻³) ≈ 1",
      conclusion: "Re ≈ 1 is far below the ~2000 threshold, so the flow is laminar.",
    },
    tryItToolSlug: "reynolds-number",
    commonMistakes: [
      "Expecting turbulent mixing inside a microchannel — it almost never happens.",
      "Treating the pipe transition value (~2000) as a hard rule for every geometry; it is a guideline.",
    ],
    relatedConceptSlugs: ["laminar-flow", "reynolds-number", "diffusion"],
    relatedToolSlugs: ["reynolds-number", "diffusion-time"],
    furtherReading: [
      {
        title: "Theoretical Microfluidics",
        author: "Henrik Bruus",
        note: "Verify the current edition.",
      },
    ],
  },
  {
    slug: "reynolds-number",
    title: "Reynolds number",
    level: 1,
    order: 2,
    summary:
      "The single dimensionless number that predicts whether flow is laminar or turbulent.",
    estimatedMinutes: 8,
    whatYoullLearn: [
      "What the Reynolds number represents physically",
      "How to compute it and read the result",
      "Why microchannels almost always sit at low Re",
    ],
    concept: [
      "The Reynolds number, Re, is the ratio of inertial forces to viscous forces in a flow. A high Re means inertia dominates and turbulence is likely; a low Re means viscosity dominates and the flow is smooth and laminar.",
      "Re = ρvDₕ/μ combines density, mean velocity, a length scale (the hydraulic diameter), and viscosity. Because microchannels have a tiny Dₕ and modest velocities, Re is usually well below 100 — firmly laminar.",
      "By convention, pipe flow is laminar below Re ≈ 2000 and turbulent above ≈ 4000, with a transitional band between. These thresholds are calibrated for circular pipes; other cross-sections shift them, so treat them as guidelines.",
    ],
    whyItMatters: [
      "A single quick calculation tells you which flow regime you are in — and therefore which design rules and mixing strategies apply.",
    ],
    equation: {
      expression: "Re = ρ · v · Dₕ / μ",
      caption: "Dimensionless ratio of inertial to viscous forces.",
    },
    variables: [
      { symbol: "Re", name: "Reynolds number", unit: "—" },
      { symbol: "ρ", name: "Fluid density", unit: "kg/m³" },
      { symbol: "v", name: "Mean velocity", unit: "m/s" },
      { symbol: "Dₕ", name: "Hydraulic diameter", unit: "m" },
      { symbol: "μ", name: "Dynamic viscosity", unit: "Pa·s" },
    ],
    workedExample: {
      intro: ["Water (ρ = 1000 kg/m³, μ = 1.0 mPa·s) at v = 0.01 m/s in a 100 µm channel:"],
      math: "Re = (1000)(0.01)(100×10⁻⁶) / (1.0×10⁻³) = 1.0",
      conclusion: "Re = 1 → laminar, as expected for a microchannel.",
    },
    tryItToolSlug: "reynolds-number",
    commonMistakes: [
      "Mixing unit systems — always convert to SI first, or you can be off by factors of ten.",
      "Using a plain diameter for a rectangular channel; use the hydraulic diameter Dₕ instead.",
    ],
    relatedConceptSlugs: ["reynolds-number", "laminar-flow", "hydraulic-diameter"],
    relatedToolSlugs: ["reynolds-number", "hydraulic-diameter"],
    furtherReading: [
      {
        title: "A standard fluid-mechanics textbook chapter on the Reynolds number",
        note: "Placeholder — a specific, verified reference will be added.",
      },
    ],
  },
  {
    slug: "flow-pressure-resistance",
    title: "Flow, pressure and resistance",
    level: 1,
    order: 3,
    summary:
      "Pressure drives flow through resistance — the hydraulic–electrical analogy that turns a chip into a circuit.",
    estimatedMinutes: 10,
    whatYoullLearn: [
      "How pressure, flow rate, and resistance relate",
      "The hydraulic–electrical analogy and how to use it",
      "How channel resistances combine in series and parallel",
    ],
    concept: [
      "Driving fluid through a channel requires a pressure difference ΔP. The resulting flow rate Q depends on the channel’s hydraulic resistance R through ΔP = Q·R — Ohm’s law for fluids.",
      "For laminar flow the analogy is exact: pressure ↔ voltage, flow rate ↔ current, resistance ↔ resistance. A whole chip becomes an electrical circuit you can analyse with the same rules.",
      "Resistances in series add (R = R₁ + R₂ + …); in parallel they combine reciprocally (1/R = 1/R₁ + 1/R₂ + …). For a circular channel R = 128μL/(πD⁴); a rectangular channel has a close approximation. The fourth-power dependence on diameter makes resistance extremely sensitive to channel size.",
    ],
    whyItMatters: [
      "You can predict and balance the flow split across a network, size a channel for a target flow rate, and see where most of your pressure is being spent.",
    ],
    equation: {
      expression: "ΔP = Q · R,   R = 128 · μ · L / (π · D⁴)",
      caption: "Ohm’s law for fluids, with the circular-channel resistance.",
    },
    variables: [
      { symbol: "ΔP", name: "Pressure drop", unit: "Pa" },
      { symbol: "Q", name: "Volumetric flow rate", unit: "m³/s" },
      { symbol: "R", name: "Hydraulic resistance", unit: "Pa·s/m³" },
      { symbol: "μ", name: "Dynamic viscosity", unit: "Pa·s" },
      { symbol: "L", name: "Channel length", unit: "m" },
      { symbol: "D", name: "Channel diameter", unit: "m" },
    ],
    workedExample: {
      intro: [
        "How sensitive is resistance to size? Halve a circular channel’s diameter and see what happens to R (which scales as 1/D⁴):",
      ],
      math: "R ∝ 1/D⁴  →  halving D multiplies R by 2⁴ = 16",
      conclusion:
        "The same pump pressure now delivers only 1/16 of the flow. Small dimensions dominate the hydraulics.",
    },
    tryItToolSlug: "flow-resistance",
    commonMistakes: [
      "Forgetting the strong D⁴ (or w·h³) dependence, so small dimension changes are underestimated.",
      "Adding parallel resistances directly instead of combining them reciprocally.",
    ],
    relatedConceptSlugs: [
      "flow-resistance",
      "pressure-drop",
      "hydraulic-electrical-analogy",
    ],
    relatedToolSlugs: ["flow-resistance", "pressure-drop", "hydraulic-diameter"],
    furtherReading: [
      {
        title: "Theoretical Microfluidics",
        author: "Henrik Bruus",
        note: "Chapters on hydraulic resistance and networks. Verify the current edition.",
      },
    ],
  },
  {
    slug: "surface-tension-wetting-capillarity",
    title: "Surface tension, wetting & capillarity",
    level: 1,
    order: 4,
    summary:
      "Why liquids pull themselves into narrow channels — the interfacial physics that lets a microfluidic device move fluid with no pump at all.",
    estimatedMinutes: 14,
    quickStart: [
      "Surface tension (γ) is the energy it costs to make new liquid surface — measured in J/m², which is the same quantity as a pull of N/m along the surface. It exists because molecules at an interface have fewer neighbours to bond with than molecules in the bulk.",
      "Whether a liquid spreads on a surface or beads up is set by the contact angle θ through Young's equation. For water, θ < 90° means the surface is hydrophilic (wetting); θ > 90° means hydrophobic (non-wetting).",
      "A curved interface supports a pressure jump — the Young–Laplace relation, ΔP = γ(1/R₁ + 1/R₂). In a wetting channel this capillary pressure sucks liquid in with no pump, which is the basis of capillary filling, paper devices and passive pumping.",
      "Surface forces scale with length while gravity and volume forces scale faster, so capillarity wins as things shrink. Below the capillary length (~2.7 mm for water) surface tension dominates gravity — and every microchannel is far below it.",
    ],
    whatYoullLearn: [
      "What surface tension is, and why an interface behaves differently from the bulk fluid",
      "The difference between surface energy and surface tension",
      "Wetting, contact angle, and Young's equation — with every symbol explained",
      "Capillary (Young–Laplace) pressure, capillary rise, and the capillary length",
      "Why capillarity dominates at the microscale, and how it shapes real devices",
    ],
    intuition: [
      "Picture the molecules in a glass of water all tugging on their neighbours. Deep inside the liquid a molecule is pulled equally in every direction, so the pulls cancel. A molecule sitting at the top surface has water below but only air above, so it feels a net inward tug. The whole surface therefore behaves like a slightly stretched elastic skin that tries to shrink to the smallest possible area — that tendency is surface tension.",
      "This is why a water strider can stand on a pond, why free droplets are round, and why a slightly overfilled glass can bulge above the rim without spilling: the surface resists being stretched.",
      "Now line the inside of a thin straw with a material that water clings to. The water creeps up the walls to touch more of them, dragging the rest of the liquid up behind it — and the narrower the straw, the higher it climbs, with no pump involved. Shrink that straw to the width of a microfluidic channel and the effect becomes strong enough to fill an entire chip on its own.",
    ],
    concept: [
      "At a liquid–gas interface, molecules in the bulk are surrounded on all sides by neighbours they attract and are attracted by, so the net force on them averages to zero. Molecules in the surface layer are missing neighbours on the vapour side, leaving a net inward attraction. Enlarging the surface means dragging more molecules out of the comfortable bulk into this higher-energy interfacial layer, and that costs energy. Surface tension, γ, is exactly that cost: the energy needed to create one unit of new interfacial area, set by the strength of the liquid's cohesive interactions (van der Waals forces, plus hydrogen bonding in water).",
      "Because γ is an energy per unit area (J/m²), it is dimensionally identical to a force per unit length (N/m) — the same quantity written two ways. That is why surface tension can be pictured as a tension pulling along the surface, contracting it. For a clean water–air interface at room temperature γ ≈ 0.072 N/m; many organic solvents sit lower, around 0.02–0.03 N/m. (These are standard tabulated values, quoted here only to give a sense of scale.)",
      "Surface energy versus surface tension: for a simple liquid the two are numerically equal, because a liquid can freely bring new molecules to its surface — stretching the area and creating new area are the same physical act. For a solid this is not generally true: a solid surface can be strained elastically without adding atoms, so the energy to create new surface (surface energy) and the mechanical stress in the existing surface (surface stress) differ. Throughout this lesson we stay in the liquid regime, where 'surface tension' and 'surface energy' can be used interchangeably.",
      "Wetting describes how a liquid spreads on a solid. It is a contest between cohesion — the attraction of the liquid's molecules for each other — and adhesion — their attraction to the solid. When adhesion to the solid outweighs cohesion within the liquid, the drop spreads out; when cohesion wins, it beads up. The outcome is summarised by the contact angle θ, measured inside the liquid at the line where liquid, solid and vapour meet.",
      "A low contact angle means the liquid wets the surface; a high angle means it does not. For water, a surface with θ < 90° is called hydrophilic ('water-loving') and one with θ > 90° hydrophobic ('water-fearing'). θ → 0° is complete wetting (the liquid spreads into a film); θ above roughly 150° with low adhesion is superhydrophobic, as on a lotus leaf. The same surface can wet one liquid and repel another, so 'hydrophobic' always refers to water specifically.",
      "At equilibrium the contact angle is fixed by the balance of the three interfacial tensions meeting at the contact line. Balancing the pull along the solid gives Young's equation — the headline equation below — which ties the observable contact angle to the solid–vapour, solid–liquid and liquid–vapour tensions.",
      "Capillarity is the movement of liquid into narrow spaces driven by these interfacial forces rather than by an external pump. Its engine is the pressure jump across a curved interface, the Young–Laplace relation ΔP = γ(1/R₁ + 1/R₂), where R₁ and R₂ are the two principal radii of curvature and ΔP is the pressure difference, higher on the concave side. A flat interface (infinite radii) has no jump; sharper curvature gives a larger one. For a spherical droplet of radius R both radii equal R, so ΔP = 2γ/R; for a long cylindrical meniscus one radius is effectively infinite, so ΔP = γ/R.",
    ],
    whyItMatters: [
      "At the microscale surface tension is not a minor correction — it is often the dominant force. Understanding it is what lets you make a channel fill itself, form monodisperse droplets on demand, wick a sample through paper, or (just as importantly) diagnose why a channel refuses to fill or keeps trapping bubbles.",
    ],
    equation: {
      expression: "γₛᵥ = γₛₗ + γₗᵥ · cos θ",
      caption:
        "Young's equation: the horizontal balance of interfacial tensions at the contact line. Rearranged, cos θ = (γₛᵥ − γₛₗ) / γₗᵥ.",
    },
    variables: [
      { symbol: "γₛᵥ", name: "Solid–vapour interfacial tension (energy of the dry solid surface)", unit: "N/m (= J/m²)" },
      { symbol: "γₛₗ", name: "Solid–liquid interfacial tension", unit: "N/m (= J/m²)" },
      { symbol: "γₗᵥ", name: "Liquid–vapour surface tension (the liquid's γ)", unit: "N/m (= J/m²)" },
      { symbol: "θ", name: "Equilibrium (Young) contact angle, measured through the liquid", unit: "degrees" },
    ],
    equationAssumptions: [
      "The surface is ideal: smooth, rigid, chemically uniform and non-reactive. Real roughness and chemical heterogeneity cause contact-angle hysteresis — a range of stable angles rather than a single θ.",
      "The system is at equilibrium with a stationary contact line; a moving contact line has a speed-dependent dynamic angle instead.",
      "The three interfacial tensions are well-defined and constant — no surfactant gradients, dissolution, or swelling of the solid.",
      "The balance is local to the contact line; gravity and overall drop size do not distort the wedge where the three phases meet.",
      "On rough or textured surfaces the apparent angle follows the Wenzel or Cassie–Baxter models, not the bare Young angle.",
    ],
    dimensionless: {
      high: "Bond number Bo ≫ 1: gravity dominates surface tension. Interfaces behave like heavy pools — flat on top, shaped by weight. This is the everyday, large-scale regime.",
      low: "Bo ≪ 1: surface tension dominates gravity. Interfaces are set by curvature and wetting, not weight; drops stay spherical and channels fill by capillarity. Microfluidics lives here.",
      competing:
        "The Bond number compares gravitational to interfacial forces, Bo = ρgL²/γ = (L/κ⁻¹)², where κ⁻¹ = √(γ/ρg) is the capillary length. Because it grows with L², shrinking the length scale drives Bo toward zero — which is exactly why capillarity, negligible in a bucket, takes over in a micrometre-wide channel.",
    },
    howItWorks: [
      "Start from a curved interface. Young–Laplace says a curved surface carries a pressure jump ΔP = γ(1/R₁ + 1/R₂), with the higher pressure on the concave side. A flat interface has no jump; sharper curvature gives a larger one.",
      "Put that interface in a channel the liquid wets. Wetting (θ < 90°) curves the meniscus concave toward the air, so the pressure just inside the liquid is lower than the air ahead of it. In a circular channel of radius r the meniscus is a spherical cap of radius R = r/cos θ, giving a capillary pressure ΔP = 2γ·cos θ / r.",
      "That pressure deficit pulls liquid in. Acting like a built-in suction at the meniscus, it draws the liquid along the channel with no external pump — this is capillary filling. The smaller the radius r, the larger the driving pressure.",
      "Against gravity, the liquid rises until its weight balances the pull. Setting the capillary pressure equal to the hydrostatic pressure ρgh gives Jurin's law, h = 2γ·cos θ / (ρ·g·r): halve the tube radius and the liquid climbs twice as high.",
      "Gravity only matters above the capillary length. Comparing surface tension with gravity defines κ⁻¹ = √(γ/(ρg)) — about 2.7 mm for water. Below that scale (every microchannel) gravity is negligible and capillary pressure governs the behaviour.",
      "During filling, the advance is resisted by viscosity, not gravity. In a horizontal channel the filled length grows as the square root of time (the Lucas–Washburn behaviour, ℓ ∝ √t): fast at first, then slowing as the filled column lengthens.",
    ],
    workedExample: {
      intro: [
        "Illustrative calculation (using standard tabulated constants, not measured data). How large is water's capillary length, κ⁻¹ = √(γ/(ρg))? Take γ ≈ 0.072 N/m, ρ ≈ 1000 kg/m³, g ≈ 9.81 m/s²:",
      ],
      math: "κ⁻¹ = √(0.072 / (1000 × 9.81)) = √(7.3×10⁻⁶) ≈ 2.7×10⁻³ m",
      conclusion:
        "About 2.7 mm. A 100 µm channel is roughly 27× smaller, so gravity is negligible there and surface tension rules — the number is illustrative, but the conclusion is general.",
    },
    microfluidicExample: [
      "Capillary filling. Because ΔP = 2γ·cos θ / r grows as channels shrink, a hydrophilic microchannel fills itself the instant liquid touches its inlet — no pump, tubing or power. Many point-of-care chips load a sample simply by touching a drop to the port.",
      "Paper and thread (paper microfluidics). Paper is a dense mesh of hydrophilic cellulose fibres — effectively millions of tiny capillaries. Patterning hydrophobic barriers into it channels the wicking, so a finger-prick of blood or a drop of urine flows to reaction zones entirely by capillarity. This underpins low-cost diagnostic strips.",
      "Droplet generation. When two immiscible fluids meet at a T-junction or flow-focusing nozzle, surface tension resists stretching the interface and eventually pinches it into uniform droplets. The ratio of viscous shear to interfacial force — the capillary number Ca = μv/γ — selects the regime (dripping versus jetting) and the droplet size.",
      "Open and passive microfluidics. Remove the channel roof and surface tension holds the liquid in an open groove, giving 'open microfluidics' that is easy to access and pipette into. Related passive-pumping schemes use the higher Laplace pressure of a small droplet (ΔP = 2γ/R) to push liquid toward a larger one, driving flow across a chip with nothing but two drops of different size.",
    ],
    designImplications: [
      "Channel dimensions. Capillary pressure scales as 1/r, so smaller channels fill faster and pull harder — but also resist harder if you ever need to push a meniscus back. Size r for the capillary drive you actually want.",
      "Surface treatment and contact angle. The sign of cos θ decides everything: a hydrophilic wall (θ < 90°) makes a channel self-fill, while a hydrophobic wall (θ > 90°) resists filling and can trap air. PDMS is natively hydrophobic and gradually recovers hydrophobicity after plasma treatment, so time-sensitive filling must account for surface ageing.",
      "Fluid properties. Surface tension varies with the liquid, temperature and especially surfactants — adding surfactant lowers γ, weakening capillary filling but stabilising droplets. Design around your working fluid's γ, not water's.",
      "Geometry and corners. Sharp interior corners and abrupt expansions can pin or arrest a meniscus; a sudden change in width may stop capillary flow entirely or trap a bubble. Smooth, gently converging geometries fill more reliably.",
      "Trapped air and venting. Capillarity can fill faster than air escapes, so dead-ends and pockets need vents or hydrophilic guiding features — otherwise bubbles will block the channel.",
    ],
    commonMistakes: [
      "Confusing surface energy and surface tension. For liquids they are the same number; the distinction only bites for solids, where surface stress and surface energy differ.",
      "Measuring the contact angle on the wrong side. θ is measured through the liquid — a 30° hydrophilic surface and a 150° hydrophobic surface are genuinely different, not the same angle measured two ways.",
      "Assuming wettability is fixed. Contact angle drifts with contamination, oxidation and (for plasma-treated PDMS) time, so the θ you designed for may not be the θ at the bench.",
      "Using ΔP = 2γ/R for a channel meniscus. That spherical form is for a droplet; a cylindrical channel gives ΔP = 2γ·cos θ / r via R = r/cos θ, and a slit-like channel differs again.",
      "Invoking gravity where it does not belong. Below the capillary length, Jurin-style height limits are irrelevant to a horizontal chip; the filling rate is set by viscosity (∝ √t), not by ρgh.",
    ],
    researcherNotes: [
      "Young's equation assumes an ideal surface. Real surfaces show contact-angle hysteresis — a gap between advancing and receding angles caused by roughness and chemical heterogeneity — so report both angles for serious work rather than a single equilibrium θ.",
      "On rough or textured surfaces the apparent angle follows the Wenzel (fully wetted) or Cassie–Baxter (air-trapped) models rather than the bare Young angle; superhydrophobicity is usually a Cassie state (see Quéré, 2008).",
      "The Lucas–Washburn ℓ ∝ √t result assumes fully developed laminar flow, a constant contact angle and negligible inertia and gravity; the earliest instants of filling are inertia- or visco-inertially limited and deviate from √t.",
      "The dynamic contact angle depends on contact-line speed (through the capillary number), so the θ in ΔP = 2γ·cos θ / r during fast filling is not the static equilibrium value.",
      "Surface tension falls with temperature, and gradients in γ from temperature or surfactant concentration drive Marangoni flows — an effect separate from the pressure-driven capillarity covered here.",
    ],
    relatedConceptSlugs: [
      "surface-tension",
      "wetting",
      "bond-number",
      "capillary-number",
      "weber-number",
      "droplet-microfluidics",
    ],
    furtherReading: [
      {
        title: "Capillarity and Wetting Phenomena: Drops, Bubbles, Pearls, Waves",
        author: "P.-G. de Gennes, F. Brochard-Wyart & D. Quéré",
        year: 2004,
        publisher: "Springer",
        url: "https://books.google.com/books?id=MxLQk8vms-kC",
        kind: "textbook",
        note: "The standard graduate-level treatment of surface tension, wetting and capillarity.",
      },
      {
        title: "Wetting and roughness",
        author: "D. Quéré",
        year: 2008,
        publisher: "Annu. Rev. Mater. Res. 38, 71–99",
        doi: "10.1146/annurev.matsci.38.060407.132434",
        kind: "review",
      },
      {
        title: "An essay on the cohesion of fluids",
        author: "T. Young",
        year: 1805,
        publisher: "Phil. Trans. R. Soc. Lond. 95, 65–87",
        doi: "10.1098/rstl.1805.0005",
        kind: "paper",
        note: "The original source of the contact-angle relation now called Young's equation.",
      },
      {
        title: "The dynamics of capillary flow",
        author: "E. W. Washburn",
        year: 1921,
        publisher: "Phys. Rev. 17, 273–283",
        doi: "10.1103/PhysRev.17.273",
        kind: "paper",
        note: "The origin of the ℓ ∝ √t (Lucas–Washburn) capillary-filling law.",
      },
      {
        title: "Microfluidics: fluid physics at the nanoliter scale",
        author: "T. M. Squires & S. R. Quake",
        year: 2005,
        publisher: "Rev. Mod. Phys. 77, 977–1026",
        doi: "10.1103/RevModPhys.77.977",
        kind: "review",
      },
      {
        title: "Engineering flows in small devices: microfluidics toward a lab-on-a-chip",
        author: "H. A. Stone, A. D. Stroock & A. Ajdari",
        year: 2004,
        publisher: "Annu. Rev. Fluid Mech. 36, 381–411",
        doi: "10.1146/annurev.fluid.36.050802.122124",
        kind: "review",
      },
      {
        title: "The origins and the future of microfluidics",
        author: "G. M. Whitesides",
        year: 2006,
        publisher: "Nature 442, 368–373",
        doi: "10.1038/nature05058",
        kind: "review",
      },
      {
        title:
          "Diagnostics for the developing world: microfluidic paper-based analytical devices",
        author: "A. W. Martinez, S. T. Phillips, G. M. Whitesides & E. Carrilho",
        year: 2010,
        publisher: "Anal. Chem. 82, 3–10",
        doi: "10.1021/ac9013989",
        kind: "paper",
      },
    ],
  },
  {
    slug: "diffusion",
    title: "Diffusion",
    level: 1,
    order: 4,
    summary:
      "Why mixing at the microscale is slow, and how to estimate how long it takes.",
    estimatedMinutes: 8,
    whatYoullLearn: [
      "What diffusion is and how far and fast it acts",
      "Why microscale mixing is diffusion-limited",
      "How to estimate a mixing time",
    ],
    concept: [
      "Diffusion is the spreading of molecules by random thermal motion, from high concentration toward low. In the absence of turbulence, it is the only way two laminar streams mix.",
      "The characteristic distance a species diffuses in time t scales as L ≈ √(2Dt), so the time to diffuse a distance L is t ≈ L²/(2D). The square dependence is the crucial point: doubling the distance quadruples the time.",
      "Because channels are narrow, diffusion across the short dimension can be quick, but mixing across wide channels — or achieving uniformity — is slow. That is why serpentine and herringbone mixers exist: they fold the streams to shorten the diffusion distance.",
    ],
    whyItMatters: [
      "Estimating the diffusion time tells you how long a channel (or how much residence time) you need to mix two streams — or, conversely, how to keep them separate.",
    ],
    equation: {
      expression: "t ≈ L² / (2D)",
      caption: "A characteristic-scaling estimate, not an exact profile.",
    },
    variables: [
      { symbol: "t", name: "Diffusion time", unit: "s" },
      { symbol: "L", name: "Diffusion distance", unit: "m" },
      { symbol: "D", name: "Diffusion coefficient", unit: "m²/s" },
    ],
    workedExample: {
      intro: [
        "A small molecule (D ≈ 1×10⁻⁹ m²/s) mixing across a 100 µm channel:",
      ],
      math: "t ≈ (100×10⁻⁶)² / (2 × 1×10⁻⁹) = 1×10⁻⁸ / 2×10⁻⁹ = 5 s",
      conclusion:
        "About 5 seconds to mix across 100 µm — and roughly 20 seconds across 200 µm, because of the square dependence.",
    },
    tryItToolSlug: "diffusion-time",
    commonMistakes: [
      "Treating t ≈ L²/2D as exact; it is an order-of-magnitude estimate of a characteristic time.",
      "Assuming stirring will help — at low Reynolds number there is no turbulence to stir with.",
    ],
    relatedConceptSlugs: ["diffusion", "peclet-number", "laminar-flow"],
    relatedToolSlugs: ["diffusion-time", "reynolds-number"],
    furtherReading: [
      {
        title: "Introduction to Microfluidics",
        author: "Patrick Tabeling",
        note: "Sections on diffusion and mixing. Verify the current edition.",
      },
    ],
  },
  {
    slug: "dimensionless-numbers",
    title: "The dimensionless numbers that run microfluidics",
    level: 1,
    order: 6,
    summary:
      "A field guide to Re, Pe, Ca, We and Bo — reading each as a contest between two effects, so you can tell which physics actually governs your device.",
    estimatedMinutes: 16,
    quickStart: [
      "A dimensionless number answers one question: which physical effect dominates here? It is a ratio of two competing effects, so its value tells you which one wins.",
      "Each number can be read two equivalent ways — as a ratio of forces, or as a ratio of timescales. Both give the same value; the timescale view is often the more useful one for transport and mixing.",
      "There are no universal magic thresholds. 'High' and 'low' depend on your choice of characteristic length and velocity, on the geometry, the fluid, and what you are trying to achieve.",
      "The five that run microfluidics: Re (inertia vs viscosity), Pe (advection vs diffusion), Ca (viscous vs interfacial), We (inertia vs interfacial), Bo (gravity vs interfacial).",
    ],
    whatYoullLearn: [
      "What a dimensionless number is, and why nondimensionalising the physics produces them",
      "The five key numbers — Re, Pe, Ca, We, Bo — with their formulas, units and meaning",
      "How to read each one as either a force ratio or a timescale ratio",
      "Why thresholds are not universal, and how to choose a characteristic length and velocity",
      "Which number dominates in real microfluidic situations, and how the numbers relate",
    ],
    intuition: [
      "Think of every microfluidic situation as a tug-of-war between two physical effects — say inertia pulling one way and viscosity the other. A dimensionless number is the scoreboard: it divides one effect by the other, so a value far above 1 means the first effect is winning, far below 1 means the second is, and near 1 means it is a genuine contest.",
      "Because the number is a pure ratio, the units cancel — which is exactly why it travels across scales. The same Reynolds number describes a swimming bacterium and a scale model in a wind tunnel, as long as the ratio of inertia to viscosity matches.",
      "A second, equivalent picture is a race between two clocks. Instead of asking which force is bigger, ask which process finishes first: does the flow carry a molecule downstream before diffusion can spread it sideways? The Péclet number is that race written as a single number.",
    ],
    concept: [
      "When you write the governing equations of a flow and rescale every variable by a characteristic value — a length L, a velocity U, and so on — the equations reorganise into a dimensionless form whose coefficients are pure numbers. Those coefficients are the dimensionless numbers, and each one measures the relative size of two terms in the equations, i.e. two competing physical effects. That is why they are diagnostic tools rather than mere formulas: the value tells you which term you may neglect and which one governs the behaviour.",
      "Every number here can be read as a ratio of forces or as a ratio of timescales, and the two readings are algebraically identical. The Reynolds number, for example, is both the ratio of inertial to viscous forces and the ratio of the time for momentum to diffuse across the channel (L²/ν) to the time for the flow to carry fluid along it (L/U). The force picture is intuitive; the timescale picture is often more useful for transport and mixing, where the real question is which process happens first.",
      "The five competitions share a structure. Re weighs inertia against viscosity; Pe weighs advection against diffusion; Ca weighs viscous forces against interfacial (surface) tension; We weighs inertia against interfacial tension; Bo weighs gravity against interfacial tension. Notice that three of them — Ca, We and Bo — measure something against interfacial tension, which is why surface tension is such a recurring character at the microscale.",
      "Because they share variables, the numbers are related. Pe = Re·Sc, where the Schmidt number Sc = ν/D compares momentum diffusion to mass diffusion; We = Re·Ca; and We/Bo = U²/(gL), a Froude number comparing inertia to gravity. One number stands apart: the capillary number Ca = μU/γ contains no length at all, so, unlike the others, it does not depend on device size — one reason it is the natural parameter for droplet break-up regardless of scale.",
      "It is tempting to memorise cut-offs — 'turbulence above Re ≈ 2000', say — but those values are tied to a specific geometry (there, a long circular pipe) and to specific definitions of L and U. Change the cross-section, choose the hydraulic diameter instead of the width, use the mean instead of the maximum velocity, or switch fluids, and the meaningful boundary moves. Treat thresholds as calibrated guidelines for a stated configuration, never as universal constants; what is robust is the comparison the number expresses, not a magic value.",
    ],
    whyItMatters: [
      "Computing the right dimensionless number is often faster and more revealing than a full simulation: it tells you at a glance whether your flow is laminar, whether it will mix on its own, whether droplets will form cleanly, and whether gravity matters — and therefore which equations and design rules actually apply.",
    ],
    equation: {
      expression: "Re = ρUL/μ = UL/ν",
      caption:
        "The template reading. Reynolds number: inertial ÷ viscous forces, equivalently the momentum-diffusion time (L²/ν) ÷ the advection time (L/U).",
    },
    variables: [
      { symbol: "Re", name: "Reynolds number", unit: "—" },
      { symbol: "ρ", name: "Fluid density", unit: "kg/m³" },
      { symbol: "U", name: "Characteristic velocity (e.g. mean flow speed)", unit: "m/s" },
      { symbol: "L", name: "Characteristic length (e.g. hydraulic diameter)", unit: "m" },
      { symbol: "μ", name: "Dynamic viscosity", unit: "Pa·s" },
      { symbol: "ν", name: "Kinematic viscosity, ν = μ/ρ", unit: "m²/s" },
    ],
    equationAssumptions: [
      "L and U are deliberate choices: in a non-circular channel L is usually the hydraulic diameter Dₕ = 4A/P, and U is usually the mean velocity — always state which you mean.",
      "The fluid is Newtonian with constant properties; strongly shear-thinning or variable-viscosity fluids need extra care.",
      "The flow is single-phase and incompressible — the same precondition applies before reading any of these numbers.",
      "The number describes a regime, not a hard threshold; the laminar–turbulent boundary in particular is geometry-specific.",
      "Entrance and development effects mean the effective number can differ near inlets, bends and junctions.",
    ],
    dimensionless: {
      high: "Re ≫ 1: inertia dominates viscosity. Flow can become unstable and, high enough, turbulent, so mixing by chaotic velocity fluctuations becomes possible. Rare inside microchannels.",
      low: "Re ≪ 1: viscosity dominates inertia. Flow is smooth, laminar and reversible; streams run side by side and mix only by diffusion. This is the everyday microfluidic world.",
      competing:
        "Re compares inertial to viscous forces, Re = ρUL/μ, or equivalently the viscous (momentum-diffusion) time L²/ν to the advection time L/U. The familiar pipe-flow figures (laminar below Re ≈ 2000) are calibrated for a circular pipe and are not universal — they shift with geometry and with how L and U are defined.",
    },
    howItWorks: [
      "Reynolds, Re = ρUL/μ — inertia vs viscosity (the template above). Density ρ [kg/m³], velocity U [m/s], length L [m], viscosity μ [Pa·s]; Re is dimensionless. Timescale view: momentum-diffusion time L²/ν over advection time L/U. High Re → inertial, possibly turbulent; low Re → laminar. Microfluidic reality: Re is typically ≪ 1 to ~100, so flow is laminar and predictable. Example: water at 10 mm/s in a 100 µm channel gives Re ≈ 1. Limitation: the turbulent threshold is geometry-specific, and L is a choice (use the hydraulic diameter for non-circular channels).",
      "Péclet, Pe = UL/D — advection vs diffusion. Velocity U [m/s], length L [m], molecular diffusion coefficient D [m²/s]; dimensionless. Timescale view: diffusion time L²/D over advection time L/U. High Pe → advection dominates, so co-flowing streams stay unmixed for a long distance; low Pe → diffusion keeps up and mixing is fast. Microfluidic reality: for typical molecules Pe across a channel width is large, which is why microscale mixing is hard and needs long paths or engineered (e.g. chaotic) mixers. Relation: Pe = Re·Sc. Example: U = 1 mm/s, L = 100 µm, D = 10⁻⁹ m²/s → Pe ≈ 100. Limitation: D depends strongly on molecule size and temperature, and Pe uses whichever L matters for the transport in question (channel width for cross-stream mixing), which may differ from the L used for Re.",
      "Capillary, Ca = μU/γ — viscous forces vs interfacial tension. Viscosity μ [Pa·s], velocity U [m/s], interfacial tension γ [N/m]; dimensionless — and note there is no length, so Ca is scale-independent. High Ca → viscous shear dominates and stretches interfaces (jetting, thread break-up); low Ca → interfacial tension dominates and interfaces stay compact and rounded (dripping, well-defined droplets). Microfluidic reality: Ca selects droplet-generation regimes, and typical operation sits at low-to-moderate Ca (often ~10⁻³–10⁻¹). Example: μ = 10⁻³ Pa·s, U = 10 mm/s, γ = 0.03 N/m → Ca ≈ 3×10⁻⁴. Limitation: the dripping↔jetting value depends on geometry (T-junction vs flow-focusing) and on the viscosity ratio of the two phases — it is not universal — and in confined junctions at very low Ca break-up is driven by pressure, not shear.",
      "Weber, We = ρU²L/γ — inertia vs interfacial tension. Density ρ [kg/m³], velocity U [m/s], length L [m], interfacial tension γ [N/m]; dimensionless. High We → inertia overwhelms surface tension and interfaces deform and break (splashing, atomisation); low We → surface tension holds the interface together. Microfluidic reality: because velocities and lengths are small, We is usually small, so surface tension (not inertia) shapes interfaces — though We rises in high-speed step-emulsification or jetting. Relation: We = Re·Ca. Example: ρ = 1000, U = 0.1 m/s, L = 100 µm, γ = 0.05 N/m → We ≈ 0.02. Limitation: which velocity and length you use (drop diameter? channel width? relative velocity of the phases?) changes the value, so define them.",
      "Bond, Bo = ρgL²/γ — gravity vs interfacial tension (also called the Eötvös number). Density ρ [kg/m³], gravity g [m/s²], length L [m], interfacial tension γ [N/m]; dimensionless. High Bo → gravity dominates and interfaces flatten while buoyancy and sedimentation matter; low Bo → surface tension dominates and gravity is negligible. Microfluidic reality: Bo is almost always ≪ 1 at the microscale — equivalently L is far below the capillary length ℓ_c = √(γ/ρg) (~2.7 mm for water) — so orientation usually does not matter and drops stay spherical. Example: ρ = 1000, L = 100 µm, γ = 0.072 N/m → Bo ≈ 1.4×10⁻³. Limitation: Bo can matter for large density mismatches, long residence times (slow settling still happens) or millimetre-scale features; 'gravity is negligible' is a consequence of small L, not a law.",
    ],
    workedExample: {
      intro: [
        "Illustrative calculation (round numbers, to show the method — not measured data). Water in a straight 100 µm channel at U = 1 mm/s. Take ρ = 1000 kg/m³, μ = 10⁻³ Pa·s (so ν = 10⁻⁶ m²/s) and a small-molecule D ≈ 10⁻⁹ m²/s. Which effects dominate?",
      ],
      math: "Re = UL/ν = (10⁻³)(10⁻⁴)/10⁻⁶ = 0.1     Pe = UL/D = (10⁻³)(10⁻⁴)/10⁻⁹ = 100",
      conclusion:
        "Re ≈ 0.1 (≪ 1) → firmly laminar: viscosity wins, with no turbulence to help. Pe ≈ 100 (≫ 1) → advection wins over diffusion: the stream is carried downstream faster than it can mix sideways. The same channel is simultaneously 'low Re' and 'high Pe' — which is exactly why microfluidic flows are orderly yet hard to mix.",
    },
    tryItToolSlug: "reynolds-number",
    microfluidicExample: [
      "Straight microchannel (pressure-driven flow). The contest is inertia vs viscosity — the Reynolds number. At the micron scale Re is tiny, so viscosity dominates: the flow is laminar, steady and reversible, with a predictable parabolic profile. Which dominates? Viscosity.",
      "Mixing two co-flowing streams. Now the question is advection vs diffusion — the Péclet number. Pe is large, so advection dominates and the streams refuse to mix over short distances. Which dominates? Advection — which is why you need a long serpentine path or an active/chaotic mixer to force diffusion to catch up (in a chaotic mixer the required length grows only slowly, roughly logarithmically, with Pe).",
      "Droplet formation at a T-junction or flow-focuser. Here viscous shear competes with interfacial tension — the capillary number. At low Ca interfacial tension wins and you get clean, monodisperse dripping; as Ca rises, viscous forces win and the system shifts to jetting with a thin thread. Which dominates? It depends on Ca — the knob you turn (via flow rate, viscosity or surfactant) to choose the regime.",
      "Capillary-driven filling. A hydrophilic channel fills itself; whether that matters against body forces is gravity vs interfacial tension — the Bond number. Bo ≪ 1, so surface tension dominates gravity and the filling is set by capillary pressure and viscous drag, not by height or orientation. Which dominates? Interfacial tension.",
      "Gravity-sensitive systems (sedimenting cells or beads, density-mismatched phases, larger chambers). Gravity re-enters when L grows or densities differ — again the Bond number, plus slow settling over long times. In a millimetre-scale reservoir or during a long incubation, Bo is no longer negligible and cells or beads sediment. Which dominates? It can tip toward gravity — a reminder that 'the microscale ignores gravity' is a statement about small L and short times, not a universal truth.",
    ],
    designImplications: [
      "Pick — and state — your characteristic length and velocity before quoting a number. For Re in a non-circular channel use the hydraulic diameter; for cross-stream mixing use the channel width in Pe. The same flow gives different numbers under different (equally valid) choices.",
      "Use the number to decide what to neglect. Low Re lets you drop inertial terms (Stokes flow); low Bo lets you ignore gravity; high Pe warns that diffusion will not mix for you. That is the practical payoff of computing them.",
      "Change a number by changing the physics you control. Ca and the droplet regime move with flow rate, viscosity and surfactant (γ); Pe and mixing move with velocity and channel width; Re rarely leaves the laminar range at these scales.",
      "Watch the interfacial trio together. Ca, We and Bo all measure something against surface tension, so a surfactant that lowers γ raises all three at once — helpful for one goal, harmful for another.",
      "Do not design to a borrowed threshold. Validate the actual transition for your geometry and fluids rather than assuming a textbook cut-off transfers to your device.",
    ],
    commonMistakes: [
      "Treating thresholds as universal. 'Turbulence above Re ≈ 2000' is a circular-pipe result; the meaningful boundary depends on geometry and on how L and U are defined.",
      "Using the wrong (or an unstated) characteristic length. Radius vs diameter vs hydraulic diameter, or width vs length, can shift a number by large factors — and make two people's 'Pe' incomparable.",
      "Assuming microfluidics means high speed and inertia. Almost all microfluidic flow is low-Re; reaching for turbulent-mixing intuition is a classic error.",
      "Forgetting that Ca has no length. Ca does not scale with device size, so shrinking a device does not change Ca at fixed velocity — a point that trips up scaling arguments.",
      "Conflating the force-ratio and timescale readings carelessly. They are equal for a given number, but mixing up which L or U belongs to which process yields the wrong timescale.",
    ],
    researcherNotes: [
      "The numbers arise formally from nondimensionalising the governing equations (Navier–Stokes, the advection–diffusion equation, the interfacial stress balance); each appears as the coefficient of a specific term, which is why setting it small justifies dropping that term (e.g. Stokes flow as Re → 0). See Bruus (2008).",
      "Interrelations worth remembering: Pe = Re·Sc (Sc = ν/D), We = Re·Ca, and We/Bo = U²/(gL) (a Froude number). These let you convert between numbers when one variable is hard to measure directly.",
      "Characteristic-length choice is not cosmetic: Re commonly uses the hydraulic diameter, Pe the transverse dimension relevant to mixing, and Bo the dimension along gravity. A bare number reported without its L and U is ambiguous.",
      "In confined T-junctions, droplet break-up at low Ca is dominated by the pressure build-up across the forming droplet rather than by viscous shear (Garstecki et al., 2006), so the naïve 'shear vs tension' Ca picture is incomplete in that regime.",
      "Watch for name and definition variants: the Bond number is also the Eötvös number, and the Péclet number can be defined for heat (using thermal diffusivity α) rather than mass (D). Always check which diffusivity and which length a source uses before comparing values.",
    ],
    relatedConceptSlugs: [
      "reynolds-number",
      "peclet-number",
      "capillary-number",
      "weber-number",
      "bond-number",
    ],
    relatedToolSlugs: ["reynolds-number", "diffusion-time", "hydraulic-diameter"],
    furtherReading: [
      {
        title: "Microfluidics: fluid physics at the nanoliter scale",
        author: "T. M. Squires & S. R. Quake",
        year: 2005,
        publisher: "Rev. Mod. Phys. 77, 977–1026",
        doi: "10.1103/RevModPhys.77.977",
        kind: "review",
        note: "A comprehensive review organised around the dimensionless numbers of microfluidics.",
      },
      {
        title: "Engineering flows in small devices: microfluidics toward a lab-on-a-chip",
        author: "H. A. Stone, A. D. Stroock & A. Ajdari",
        year: 2004,
        publisher: "Annu. Rev. Fluid Mech. 36, 381–411",
        doi: "10.1146/annurev.fluid.36.050802.122124",
        kind: "review",
      },
      {
        title: "Life at low Reynolds number",
        author: "E. M. Purcell",
        year: 1977,
        publisher: "Am. J. Phys. 45, 3–11",
        doi: "10.1119/1.10903",
        kind: "paper",
        note: "The classic account of the low-Reynolds-number world.",
      },
      {
        title: "Chaotic mixer for microchannels",
        author: "A. D. Stroock, S. K. W. Dertinger, A. Ajdari, I. Mezić, H. A. Stone & G. M. Whitesides",
        year: 2002,
        publisher: "Science 295, 647–651",
        doi: "10.1126/science.1066238",
        kind: "paper",
        note: "Shows the mixing length growing only logarithmically with the Péclet number.",
      },
      {
        title:
          "Formation of droplets and bubbles in a microfluidic T-junction — scaling and mechanism of break-up",
        author: "P. Garstecki, M. J. Fuerstman, H. A. Stone & G. M. Whitesides",
        year: 2006,
        publisher: "Lab Chip 6, 437–446",
        doi: "10.1039/b510841a",
        kind: "paper",
        note: "Capillary-number-dependent droplet break-up, including the low-Ca pressure-driven regime.",
      },
      {
        title: "Dynamics of microfluidic droplets",
        author: "C. N. Baroud, F. Gallaire & R. Dangla",
        year: 2010,
        publisher: "Lab Chip 10, 2032–2045",
        doi: "10.1039/c001191f",
        kind: "review",
      },
      {
        title: "Theoretical Microfluidics",
        author: "H. Bruus",
        year: 2008,
        publisher: "Oxford University Press",
        url: "https://global.oup.com/academic/product/theoretical-microfluidics-9780199235094",
        kind: "textbook",
        note: "Derives the numbers by nondimensionalising the governing equations (ISBN 978-0-19-923509-4).",
      },
    ],
  },
  {
    slug: "pdms-soft-lithography",
    title: "PDMS & soft lithography",
    level: 2,
    order: 1,
    summary:
      "How casting a silicone rubber against a micro-patterned master turned microfluidic prototyping from a cleanroom project into a benchtop afternoon — and what that convenience costs.",
    estimatedMinutes: 16,
    quickStart: [
      "PDMS is a transparent, rubbery silicone. You make a chip by pouring it over a micro-patterned master, curing it, peeling it off, and sealing it to a flat surface — a process called soft lithography.",
      "It won academia because it is fast, cheap and forgiving: once a master exists, a new chip takes hours on a benchtop rather than a full cleanroom run. Its transparency, elasticity and gas permeability also enable imaging, valves and cell culture.",
      "The expensive, cleanroom part — the master — is made once by photolithography (typically an SU-8 photoresist pattern on a silicon wafer) and then reused to cast many PDMS replicas.",
      "The very properties that make PDMS convenient are also its limits: it absorbs small hydrophobic molecules, swells in many solvents, recovers hydrophobicity after surface treatment, deforms under pressure, and is hard to mass-manufacture — a superb prototyping material but often a poor production one.",
    ],
    whatYoullLearn: [
      "What PDMS is, why it became the workhorse of academic microfluidics, and its key material properties",
      "What soft lithography is, and how a silicon/SU-8 master becomes a finished PDMS chip",
      "The full workflow — from CAD design through photolithography, casting, bonding and testing — and why each parameter matters",
      "The real advantages of PDMS, and the limitations that constrain where it should be used",
      "When PDMS is the right choice, when it is not, and how it compares with glass, silicon and thermoplastics",
    ],
    intuition: [
      "Soft lithography is moulding — the same idea as a jelly mould or a rubber stamp, shrunk to the micron scale. You make one detailed mould (the master), then cast a soft material against it as many times as you like; every replica carries a faithful negative of the pattern.",
      "The trick is a division of labour: the hard, precise, expensive work happens once, in a cleanroom, to make the master. After that, copying the pattern into PDMS is cheap, quick and needs no cleanroom — which is why a student can iterate a design in an afternoon.",
      "PDMS itself is best pictured as a clear, springy silicone rubber — transparent like glass, flexible like an eraser, and slightly permeable to gases like a sponge is to water. Those three traits (clear, springy, breathable) explain most of both its powers and its problems.",
    ],
    concept: [
      "PDMS (polydimethylsiloxane) is a silicone elastomer — a polymer with a flexible –Si–O–Si– backbone and methyl (–CH₃) side groups. It is supplied as two liquids, a base and a curing (cross-linking) agent; when they are mixed and heated, the curing agent links the chains into a soft, transparent, rubbery solid. Because it begins as a pourable liquid and sets into an elastic solid, it can be cast against a mould and then peeled away intact.",
      "Before PDMS, microchannels were etched into glass or silicon — accurate but slow, costly and cleanroom-bound. Casting PDMS against a reusable master (Duffy et al., 1998; Whitesides, 2006) cut the turnaround from weeks to hours and moved most steps out of the cleanroom, so ordinary labs could design, build and test a chip in a day. That accessibility, more than any single property, is why PDMS came to dominate academic microfluidics (McDonald & Whitesides, 2002).",
      "The properties that matter most are its advantages: optical transparency across the visible and into the near-UV, good for microscopy and optical detection; a very low elastic modulus (on the order of a few MPa — roughly 1–3 MPa for common formulations — thousands of times softer than glass), so it is elastic enough to make flexible membranes, valves and pumps; easy moulding, since the liquid flows into micron- and sub-micron features and cures at modest temperatures; high gas permeability, so oxygen and CO₂ diffuse through it, useful for oxygenating cells on-chip; low cost and simple processing, giving cheap and rapid prototyping; and high replication fidelity, faithfully reproducing fine features from the master (Xia & Whitesides, 1998; McDonald & Whitesides, 2002).",
      "Soft lithography is a family of techniques that use a soft elastomer — usually PDMS — cast or stamped against a patterned master to transfer micro- and nanoscale features, rather than etching each device directly (Xia & Whitesides, 1998). In microfluidics its dominant form is replica moulding: cast PDMS on the master, cure, peel, and bond to a substrate to close the channels. The master is patterned once by conventional photolithography; the elastomer does the copying.",
      "The workflow therefore splits into two halves: a hard, one-time master fabrication (photolithography, in a cleanroom) and a soft, repeatable replication (casting PDMS, on the bench). Understanding the process means understanding both halves — and why the parameters in each shape the final chip.",
    ],
    whyItMatters: [
      "The soft-lithography route is a large part of why microfluidics grew into a broad academic field: it let thousands of labs prototype devices cheaply and quickly. Knowing how it works — and where PDMS's convenient properties become liabilities — lets you judge whether a result will translate beyond a research chip, and when to reach for a different material.",
    ],
    howItWorks: [
      "Design (CAD). The channel network is drawn as a 2D layout in CAD. Feature sizes, spacing and the resolution of the eventual mask set the smallest channels you can make, and the design fixes where inlets, outlets and functional elements sit. This step is essentially free to iterate — much of PDMS's appeal.",
      "Photomask. The layout is printed as a photomask: a transparent film or glass plate with opaque regions defining the pattern. High-resolution transparency masks are inexpensive and adequate down to roughly the tens-of-microns range; chrome-on-glass masks are used for finer features. Mask quality directly limits edge sharpness and the minimum feature size.",
      "Photolithography. In a cleanroom, a light-sensitive polymer (photoresist) is spin-coated onto a silicon wafer to a controlled thickness, then exposed to UV light through the mask. Exposure changes the resist's solubility where light strikes it; developing then washes away either the exposed or unexposed regions, leaving a patterned relief. The spin speed sets the resist thickness — and therefore the eventual channel height — so it is a key parameter.",
      "SU-8 and the master. For microfluidic masters the resist is usually SU-8, a negative epoxy photoresist prized for tall, straight-walled, high-aspect-ratio features (del Campo & Greiner, 2007). After exposure and development, the SU-8 relief standing proud of the wafer is the master — a positive relief of the channels. Because the master is reused for many castings, its accuracy is worth the cleanroom cost; feature height equals the SU-8 thickness, and sidewall quality sets channel-wall quality.",
      "Mixing PDMS. The base and curing agent are mixed — a widely used example is a 10:1 base-to-curing-agent mass ratio for Sylgard 184 (Duffy et al., 1998; McDonald & Whitesides, 2002); this is an example process condition, not a universal rule. The ratio matters because it sets the cross-link density: more curing agent gives a stiffer, less deformable chip, less gives a softer one. Mixing entrains air, so the blend is degassed under vacuum to remove bubbles that would otherwise become defects.",
      "Casting (replica moulding). The liquid PDMS is poured over the master in a holder and, being a low-viscosity liquid, flows into and fills every feature — the origin of its high replication fidelity. The pour depth sets the slab thickness.",
      "Curing. Heating cross-links the PDMS into a solid; higher temperature cures faster (room temperature over many hours, or roughly an hour in a warm oven, are commonly reported ranges — treat any specific schedule as an example, since it depends on the formulation and the target stiffness). Under-curing leaves sticky, leachable uncross-linked material; over-curing can embrittle the surface — so the cure schedule is a genuine quality parameter, not a formality.",
      "Demolding. The cured PDMS is peeled off the master. Because it is elastic and does not adhere strongly to silicon/SU-8, it releases cleanly and the master survives for reuse, so one master yields many chips. Aggressive peeling, or fragile tall features on the master, can tear either part, so geometry and release behaviour matter.",
      "Port creation (punching). Access holes for tubing are punched through the PDMS at the inlets and outlets, usually with a coring punch, connecting the channels to the outside world. The hole diameter must match the tubing or connector for a leak-free fit, and ragged punches shed debris that can clog channels.",
      "Surface treatment. The PDMS surface is natively hydrophobic. Exposure to oxygen plasma (or UV-ozone) oxidises the surface methyl groups into silanol (–OH) groups, making it temporarily hydrophilic and, crucially, chemically activating it for bonding. Plasma power, time and pressure are instrument-specific tunables — over-treatment can crack the surface, under-treatment gives weak bonds — so they are optimised per system rather than copied as fixed numbers.",
      "Bonding. Pressing a freshly plasma-activated PDMS surface against another activated PDMS or glass surface lets the silanol groups condense into covalent –Si–O–Si– bonds, sealing the channels with a strong, irreversible bond (Duffy et al., 1998). Any layer alignment happens here; the surfaces must be clean and dust-free, since a single particle prevents contact and causes leaks, and bonding must be done promptly, before the surface reverts.",
      "Assembly and testing. Tubing is inserted into the ports and the device is tested — typically by flowing liquid through and checking for leaks, correct filling and bond integrity at the intended pressure. Only a chip that seals and fills as designed is ready for use; failures here usually trace back to dust, weak bonding, or an over- or under-cured slab.",
    ],
    microfluidicExample: [
      "Imaging and detection (transparency). Because PDMS is optically clear, a bonded PDMS-on-glass chip sits straight on a microscope stage, so flow, cells and fluorescence are observed directly through the device — a major reason PDMS suits biology.",
      "Valves and pumps (elasticity). PDMS's softness is exploited in the classic multilayer 'Quake' microvalve: pressurising a channel in one layer deflects a thin PDMS membrane to pinch off a channel below it. Chaining such valves builds on-chip pumps and large-scale integrated fluidic circuits — something a rigid material cannot easily do.",
      "Cell culture (gas permeability). Oxygen and CO₂ diffuse through PDMS, so cells in a sealed channel can still breathe, which underpins many organ-on-chip and long-term culture devices — though the same permeability lets water vapour escape and concentrate the medium over time.",
      "Rapid iteration (prototyping + fidelity). Because one master casts many faithful replicas cheaply, a lab can build several design variants in parallel and refine quickly — the practical engine behind microfluidics' rapid growth.",
    ],
    designImplications: [
      "Small-molecule absorption: PDMS soaks up hydrophobic small molecules (many drugs and dyes), depleting them from solution and skewing concentrations — a serious problem for quantitative assays and drug studies (Toepke & Beebe, 2006). Account for it, coat the surface, or choose another material.",
      "Hydrophobic recovery: the hydrophilicity from plasma treatment is temporary — low-molecular-weight chains migrate to the surface and it reverts to hydrophobic over hours to days (McDonald & Whitesides, 2002). Bond and fill promptly, and do not rely on lasting wettability without a stabilising treatment.",
      "Solvent compatibility: PDMS swells in, and is degraded by, many organic solvents (e.g. toluene, hexane, chloroform), distorting channels and leaching oligomers (Lee, Park & Whitesides, 2003). It suits aqueous work best; check solvent compatibility before use.",
      "Gas permeability (double-edged): excellent for oxygenating cells, but it also lets bubbles form and pass and lets water vapour escape, so aqueous samples evaporate and concentrate over long runs. Plan humidification or sealing for long experiments.",
      "Mechanical deformation: being soft, PDMS channels bulge under pressure, changing their cross-section and hence hydraulic resistance and flow rate. At higher pressures this is significant — factor it into flow-control designs, or use a stiffer formulation.",
      "Scalability: soft lithography is a manual, low-throughput process that does not translate to high-volume manufacturing, where thermoplastic methods such as injection moulding and hot embossing are used instead (Becker & Gärtner, 2008). A PDMS prototype rarely becomes a product unchanged.",
      "Batch variability: hand mixing, degassing, curing and plasma treatment introduce device-to-device variation in stiffness, surface chemistry and dimensions — a reproducibility concern to control for, especially across labs.",
    ],
    commonMistakes: [
      "Assuming a plasma-treated surface stays hydrophilic. It reverts (hydrophobic recovery), so any wettability-dependent step must happen before it does.",
      "Using PDMS for quantitative small-molecule work without checking absorption. Concentrations can drift as the molecule partitions into the walls, invalidating dose–response data.",
      "Running incompatible solvents. Non-aqueous solvents can swell or dissolve PDMS, deforming channels and contaminating samples.",
      "Ignoring channel deformation under pressure. Treating soft PDMS channels as rigid overestimates flow rates and misreads resistance.",
      "Skipping degassing, or working with dust. Trapped bubbles and single particles are the most common causes of failed casts and leaky bonds.",
      "Treating a PDMS prototype as a manufacturable product. What works as a one-off cast usually needs a different material and process to scale.",
    ],
    researcherNotes: [
      "When PDMS is a good choice: rapid prototyping and design iteration; devices needing optical access, elastic membranes and valves, or gas-permeable walls (cell culture, organ-on-chip); and low-volume, aqueous, academic work where turnaround and cost matter more than manufacturability.",
      "When PDMS is a poor choice: quantitative small-molecule or drug assays (absorption); work with organic solvents (swelling); applications needing rigid, dimensionally stable channels or precise pressure–flow relationships; and anything destined for mass production or regulatory-grade reproducibility (Berthier et al., 2012).",
      "Versus glass: glass is rigid, chemically inert, non-absorbing, solvent-resistant and optically excellent, but its fabrication (etching, bonding) is slow, expensive and cleanroom-intensive, and it cannot form elastic valves. Choose it when chemical robustness and dimensional stability outweigh turnaround.",
      "Versus silicon: silicon enables the highest-resolution features and integrates with electronics and standard IC processing, and is rigid and chemically robust, but it is opaque to visible light (no simple transmitted-light imaging), electrically conductive and expensive — best where precision and integration outweigh optical access and cost.",
      "Versus thermoplastics (PMMA, COC, polystyrene, PC): rigid, low-absorbing materials that, unlike PDMS, scale to mass manufacturing via injection moulding and hot embossing (Becker & Gärtner, 2008), and polystyrene matches the validated surface of conventional cultureware (Berthier et al., 2012). The trade-off is less nimble prototyping and the need for moulding tooling, so they suit production more than early exploration.",
      "The trade-off in one line: PDMS optimises for speed, cost and its unique elastomer and gas-transport properties, at the expense of chemical inertness, dimensional stiffness, quantitative fidelity and scalability — so the best material depends on whether you are exploring or deploying (Berthier et al., 2012).",
    ],
    relatedConceptSlugs: ["pdms", "soft-lithography", "wetting", "lab-on-chip"],
    furtherReading: [
      {
        title: "Soft lithography",
        author: "Y. Xia & G. M. Whitesides",
        year: 1998,
        publisher: "Annu. Rev. Mater. Sci. 28, 153–184",
        doi: "10.1146/annurev.matsci.28.1.153",
        kind: "review",
        note: "The foundational review of soft lithography and replica moulding.",
      },
      {
        title: "Rapid prototyping of microfluidic systems in poly(dimethylsiloxane)",
        author: "D. C. Duffy, J. C. McDonald, O. J. A. Schueller & G. M. Whitesides",
        year: 1998,
        publisher: "Anal. Chem. 70, 4974–4984",
        doi: "10.1021/ac980656z",
        kind: "paper",
        note: "The landmark paper establishing the CAD-to-chip PDMS workflow and O₂-plasma bonding.",
      },
      {
        title: "Poly(dimethylsiloxane) as a material for fabricating microfluidic devices",
        author: "J. C. McDonald & G. M. Whitesides",
        year: 2002,
        publisher: "Acc. Chem. Res. 35, 491–499",
        doi: "10.1021/ar010110q",
        kind: "review",
        note: "PDMS material properties, bonding and hydrophobic recovery.",
      },
      {
        title: "The origins and the future of microfluidics",
        author: "G. M. Whitesides",
        year: 2006,
        publisher: "Nature 442, 368–373",
        doi: "10.1038/nature05058",
        kind: "review",
      },
      {
        title: "SU-8: a photoresist for high-aspect-ratio and 3D submicron lithography",
        author: "A. del Campo & C. Greiner",
        year: 2007,
        publisher: "J. Micromech. Microeng. 17, R81–R95",
        doi: "10.1088/0960-1317/17/6/R01",
        kind: "review",
        note: "The photoresist most commonly used to make microfluidic masters.",
      },
      {
        title: "PDMS absorption of small molecules and consequences in microfluidic applications",
        author: "M. W. Toepke & D. J. Beebe",
        year: 2006,
        publisher: "Lab Chip 6, 1484–1486",
        doi: "10.1039/b612140c",
        kind: "paper",
      },
      {
        title: "Solvent compatibility of poly(dimethylsiloxane)-based microfluidic devices",
        author: "J. N. Lee, C. Park & G. M. Whitesides",
        year: 2003,
        publisher: "Anal. Chem. 75, 6544–6554",
        doi: "10.1021/ac0346712",
        kind: "paper",
      },
      {
        title: "Engineers are from PDMS-land, Biologists are from Polystyrenia",
        author: "E. Berthier, E. W. K. Young & D. Beebe",
        year: 2012,
        publisher: "Lab Chip 12, 1224–1237",
        doi: "10.1039/c2lc20982a",
        kind: "review",
        note: "Evidence-based comparison of PDMS with polystyrene and other thermoplastics for cell biology.",
      },
      {
        title: "Polymer microfabrication technologies for microfluidic systems",
        author: "H. Becker & C. Gärtner",
        year: 2008,
        publisher: "Anal. Bioanal. Chem. 390, 89–111",
        doi: "10.1007/s00216-007-1692-2",
        kind: "review",
        note: "Injection moulding, hot embossing and other scalable thermoplastic routes.",
      },
    ],
  },
];

const BY_SLUG = new Map(LESSONS.map((l) => [l.slug, l]));

export function getLesson(slug: string): LessonContent | undefined {
  return BY_SLUG.get(slug);
}

export function getLessonsByLevel(level: number): LessonContent[] {
  return LESSONS.filter((l) => l.level === level).sort(
    (a, b) => a.order - b.order,
  );
}

export function hasLesson(slug: string): boolean {
  return BY_SLUG.has(slug);
}
