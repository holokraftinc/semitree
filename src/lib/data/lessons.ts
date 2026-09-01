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
}

export interface LessonContent {
  slug: string;
  title: string;
  level: number;
  order: number;
  summary: string;
  estimatedMinutes?: number;
  whatYoullLearn: string[];
  concept: string[];
  whyItMatters: string[];
  equation?: { expression: string; caption?: string };
  variables?: LessonVariable[];
  workedExample?: { intro: string[]; math?: string; conclusion?: string };
  /** Slug of the calculator the "Try it yourself" button opens. */
  tryItToolSlug?: string;
  commonMistakes?: string[];
  /** Glossary concept slugs (resolved to /concepts#slug). */
  relatedConceptSlugs?: string[];
  /** Tool slugs (resolved to /tools/slug). */
  relatedToolSlugs?: string[];
  furtherReading?: FurtherReadingItem[];
}

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
