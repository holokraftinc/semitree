/**
 * Semiconductor tools registry — the single source of truth for every tool
 * under `/semiconductors/tools`.
 *
 * Kept separate from the microfluidics `TOOLS` registry (src/lib/data/tools.ts)
 * because the two domains have different categories and routes. Tool cards,
 * category discovery, difficulty, status, and relationships are all expressed
 * here as DATA — never hard-coded in page components — so new tools can be added
 * without touching the Tools landing page or explorer.
 *
 * ACCURACY RULE: every tool must map to a scientifically valid formula with
 * defined assumptions, units, and limitations (surfaced on the tool page via
 * CalculatorShell). Approximations are flagged `educational: true`.
 */

import { getSemiLesson } from "@/lib/knowledge/semi-lessons";

/* ------------------------------------------------------------------ *
 * Taxonomy
 * ------------------------------------------------------------------ */

export type SemiToolCategory =
  | "manufacturing"
  | "device-physics"
  | "materials"
  | "lithography"
  | "etching-deposition"
  | "doping"
  | "packaging"
  | "testing-yield"
  | "process-equipment"
  | "design"
  | "economics"
  | "supply-chain"
  | "general";

export const SEMI_CATEGORY_LABELS: Record<SemiToolCategory, string> = {
  manufacturing: "Manufacturing",
  "device-physics": "Device physics",
  materials: "Materials",
  lithography: "Lithography",
  "etching-deposition": "Etching & deposition",
  doping: "Doping",
  packaging: "Packaging",
  "testing-yield": "Testing & yield",
  "process-equipment": "Process & equipment",
  design: "Design",
  economics: "Economics",
  "supply-chain": "Supply chain",
  general: "General semiconductor",
};

export const SEMI_CATEGORY_DESCRIPTIONS: Record<SemiToolCategory, string> = {
  manufacturing: "Wafer processing, throughput, and process-flow calculations.",
  "device-physics": "Carriers, junctions, and transistor behaviour.",
  materials: "Material properties relevant to semiconductor devices.",
  lithography: "Resolution, critical dimension, and patterning limits.",
  "etching-deposition": "Film thickness, rates, and etch/deposition profiles.",
  doping: "Dose, concentration, and junction-formation calculations.",
  packaging: "Thermal, interconnect, and package-level analysis.",
  "testing-yield": "Yield models, die counts, and test metrics.",
  "process-equipment": "Tool, chamber, and process-parameter calculations.",
  design: "Layout, scaling, and design-rule calculations.",
  economics: "Cost-per-die, wafer cost, and manufacturing economics.",
  "supply-chain": "Capacity, lead-time, and supply calculations.",
  general: "Core electrical and general-purpose semiconductor calculators.",
};

/** Display order for category discovery on the landing page. */
export const SEMI_CATEGORY_ORDER: SemiToolCategory[] = [
  "manufacturing",
  "device-physics",
  "materials",
  "lithography",
  "etching-deposition",
  "doping",
  "packaging",
  "testing-yield",
  "process-equipment",
  "design",
  "economics",
  "supply-chain",
  "general",
];

export type SemiToolDifficulty = "beginner" | "engineering" | "advanced";

export const SEMI_DIFFICULTY_LABELS: Record<SemiToolDifficulty, string> = {
  beginner: "Beginner",
  engineering: "Engineering",
  advanced: "Advanced",
};

export type SemiToolStatus = "available" | "beta" | "coming-soon";

export const SEMI_STATUS_LABELS: Record<SemiToolStatus, string> = {
  available: "Available",
  beta: "Beta",
  "coming-soon": "Coming soon",
};

/* ------------------------------------------------------------------ *
 * Tool model
 * ------------------------------------------------------------------ */

export interface SemiTool {
  /** Route segment under /semiconductors/tools/<slug>. */
  slug: string;
  name: string;
  /** One-line explanation shown on the card. */
  summary: string;
  category: SemiToolCategory;
  difficulty: SemiToolDifficulty;
  status: SemiToolStatus;
  /** Short formula shown on the card and tool page. */
  formula: string;
  /** Human-readable inputs (for the card and tool metadata). */
  inputs?: string[];
  /** The main output the tool produces. */
  output?: string;
  /** Learning-topic slugs (semi-lessons) this tool connects to. */
  relatedLearning?: string[];
  /** Related tool slugs — the tool↔tool graph. */
  relatedTools?: string[];
  /** True when the result is an educational approximation, not production-grade. */
  educational?: boolean;
}

/**
 * The registry. Only `status: "available"` tools have an implemented page and
 * are linked; others are listed for discovery without a dead link. No tool here
 * is fabricated — every entry maps to a real, implemented calculator.
 */
export const SEMI_TOOLS: SemiTool[] = [
  // ---- General semiconductor (electrical fundamentals) ----
  {
    slug: "ohms-law",
    name: "Ohm's law",
    summary: "Solve for voltage, current, or resistance in a resistive circuit.",
    category: "general",
    difficulty: "beginner",
    status: "available",
    formula: "V = I · R",
    inputs: ["Any two of voltage, current, resistance"],
    output: "The remaining quantity",
    relatedTools: ["power-dissipation", "rc-time-constant"],
  },
  {
    slug: "power-dissipation",
    name: "Power dissipation",
    summary: "Resistive power from voltage, current, or resistance.",
    category: "general",
    difficulty: "beginner",
    status: "available",
    formula: "P = V · I",
    inputs: ["Two of voltage, current, resistance"],
    output: "Dissipated power (W)",
    relatedTools: ["ohms-law", "power-density"],
  },
  {
    slug: "rc-time-constant",
    name: "RC time constant",
    summary: "Time constant and −3 dB cutoff of a single-pole RC network.",
    category: "general",
    difficulty: "engineering",
    status: "available",
    formula: "τ = R · C",
    inputs: ["Resistance (R)", "Capacitance (C)"],
    output: "Time constant τ and cutoff frequency",
    relatedLearning: ["metallization"],
    relatedTools: ["ohms-law", "power-dissipation"],
  },
  // ---- Device physics ----
  {
    slug: "built-in-potential",
    name: "Built-in potential",
    summary: "Junction potential of an abrupt PN junction from doping.",
    category: "device-physics",
    difficulty: "engineering",
    status: "available",
    formula: "V_bi = (kT/q) · ln(N_a·N_d / n_i²)",
    inputs: ["Acceptor doping N_a", "Donor doping N_d", "Temperature"],
    output: "Built-in potential (V)",
    relatedLearning: ["pn-junction", "ion-implantation"],
    relatedTools: ["ohms-law"],
  },
  // ---- Testing & yield ----
  {
    slug: "die-per-wafer",
    name: "Die per wafer",
    summary: "Estimate gross die count using the de Vries approximation.",
    category: "testing-yield",
    difficulty: "engineering",
    status: "available",
    formula: "DPW ≈ πd²/4S − πd/√(2S)",
    inputs: ["Wafer diameter", "Die area"],
    output: "Gross die per wafer",
    educational: true,
    relatedLearning: ["dicing", "wafer"],
    relatedTools: ["wafer-yield"],
  },
  {
    slug: "wafer-yield",
    name: "Wafer yield",
    summary: "Die yield from defect density (Poisson or Murphy model).",
    category: "testing-yield",
    difficulty: "engineering",
    status: "available",
    formula: "Y = e^(−D·A)",
    inputs: ["Defect density D", "Die area A", "Yield model"],
    output: "Estimated die yield (%)",
    educational: true,
    relatedLearning: ["metrology", "wafer-test"],
    relatedTools: ["die-per-wafer"],
  },
  // ---- Packaging ----
  {
    slug: "junction-temperature",
    name: "Junction temperature",
    summary: "Junction temperature rise from power and thermal resistance.",
    category: "packaging",
    difficulty: "engineering",
    status: "available",
    formula: "T_j = T_a + P · θ_JA",
    inputs: ["Power", "Ambient temperature", "Thermal resistance θ_JA"],
    output: "Junction temperature (°C)",
    relatedLearning: ["packaging"],
    relatedTools: ["power-density", "power-dissipation"],
  },
  {
    slug: "power-density",
    name: "Power density",
    summary: "Areal power density of a die or package.",
    category: "packaging",
    difficulty: "beginner",
    status: "available",
    formula: "P_density = P / A",
    inputs: ["Power", "Area"],
    output: "Power density (W/mm²)",
    relatedLearning: ["packaging"],
    relatedTools: ["junction-temperature", "power-dissipation"],
  },
  // ---- General semiconductor (utilities) ----
  {
    slug: "unit-converter",
    name: "Unit converter",
    summary: "Convert semiconductor units: length, area, time, energy, pressure, and more.",
    category: "general",
    difficulty: "beginner",
    status: "available",
    formula: "value × (factor_from / factor_to)",
    inputs: ["Value", "From unit", "To unit"],
    output: "Converted value",
    relatedTools: ["scientific-notation"],
  },
  {
    slug: "scientific-notation",
    name: "Scientific notation",
    summary: "Scientific, engineering, and SI-prefix forms of any number.",
    category: "general",
    difficulty: "beginner",
    status: "available",
    formula: "a × 10ⁿ  (1 ≤ a < 10)",
    inputs: ["A number"],
    output: "Scientific / engineering / SI-prefix forms",
    relatedTools: ["unit-converter"],
  },
  // ---- Design ----
  {
    slug: "die-size",
    name: "Die size & area",
    summary: "Die area and square-equivalent dimension from width and height.",
    category: "design",
    difficulty: "beginner",
    status: "available",
    formula: "A = width × height",
    inputs: ["Die width", "Die height"],
    output: "Die area and square-equivalent side",
    relatedLearning: ["dicing"],
    relatedTools: ["die-per-wafer", "aspect-ratio"],
  },
  // ---- Etching & deposition ----
  {
    slug: "aspect-ratio",
    name: "Aspect ratio",
    summary: "Feature aspect ratio (depth ÷ width) and what it implies.",
    category: "etching-deposition",
    difficulty: "engineering",
    status: "available",
    formula: "AR = depth / width",
    inputs: ["Feature depth", "Feature width"],
    output: "Aspect ratio (dimensionless)",
    relatedLearning: ["etching", "lithography"],
    relatedTools: ["die-size"],
  },
  // ---- Manufacturing ----
  {
    slug: "sheet-resistance",
    name: "Sheet resistance",
    summary: "Sheet resistance of a film from resistivity and thickness.",
    category: "manufacturing",
    difficulty: "engineering",
    status: "available",
    formula: "R_s = ρ / t",
    inputs: ["Resistivity (ρ)", "Thickness (t)", "Squares (L/W)"],
    output: "Sheet resistance (Ω/□) and resistance",
    relatedLearning: ["metrology", "ion-implantation"],
    relatedTools: ["ohms-law"],
  },
  // ---- Lithography ----
  {
    slug: "litho-resolution",
    name: "Lithography resolution",
    summary: "Rayleigh-style resolution estimate from wavelength, NA, and k₁.",
    category: "lithography",
    difficulty: "engineering",
    status: "available",
    formula: "R = k₁ · λ / NA",
    inputs: ["Wavelength (λ)", "Numerical aperture (NA)", "Process factor (k₁)"],
    output: "Estimated resolution (educational)",
    educational: true,
    relatedLearning: ["lithography", "metrology"],
    relatedTools: ["depth-of-focus", "process-window-explorer", "pitch-half-pitch", "aspect-ratio"],
  },
  {
    slug: "depth-of-focus",
    name: "Depth of focus",
    summary: "Rayleigh-style focus-tolerance estimate from wavelength, NA, and k₂.",
    category: "lithography",
    difficulty: "engineering",
    status: "available",
    formula: "DOF = k₂ · λ / NA²",
    inputs: ["Wavelength (λ)", "Numerical aperture (NA)", "Process factor (k₂)"],
    output: "Estimated depth of focus (educational)",
    educational: true,
    relatedLearning: ["lithography"],
    relatedTools: ["litho-resolution", "process-window-explorer"],
  },
  {
    slug: "pitch-half-pitch",
    name: "Pitch / half-pitch",
    summary: "Half-pitch and line/space interpretation from a feature pitch.",
    category: "lithography",
    difficulty: "beginner",
    status: "available",
    formula: "half-pitch = pitch / 2",
    inputs: ["Pitch"],
    output: "Half-pitch, line width, space",
    relatedLearning: ["lithography"],
    relatedTools: ["litho-resolution"],
  },
  {
    slug: "overlay-error",
    name: "Overlay error budget",
    summary: "Combine overlay contributions in quadrature (educational budgeting).",
    category: "lithography",
    difficulty: "engineering",
    status: "available",
    formula: "total = √(X² + Y² + P²)",
    inputs: ["X error", "Y error", "Process contribution"],
    output: "Combined overlay error (RSS)",
    educational: true,
    relatedLearning: ["lithography", "metrology"],
    relatedTools: ["litho-resolution"],
  },
  {
    slug: "dose-exposure",
    name: "Exposure dose",
    summary: "Educational dose from exposure energy and area (dose = energy / area).",
    category: "lithography",
    difficulty: "beginner",
    status: "available",
    formula: "dose = energy / area",
    inputs: ["Exposure energy", "Exposed area"],
    output: "Exposure dose (mJ/cm²)",
    educational: true,
    relatedLearning: ["lithography", "photoresist"],
    relatedTools: ["litho-resolution"],
  },
  {
    slug: "process-window-explorer",
    name: "Process window explorer",
    summary: "See how theoretical resolution changes as you vary wavelength, NA, and k₁.",
    category: "lithography",
    difficulty: "advanced",
    status: "available",
    formula: "R = k₁ · λ / NA (swept over NA)",
    inputs: ["Wavelength (λ)", "Numerical aperture (NA)", "Process factor (k₁)"],
    output: "Resolution and a resolution-vs-NA curve (educational)",
    educational: true,
    relatedLearning: ["lithography"],
    relatedTools: ["litho-resolution", "depth-of-focus"],
  },
  // ---- Etching & deposition ----
  {
    slug: "film-thickness",
    name: "Film thickness / volume",
    summary: "Relate film thickness, area, and volume — solve for the missing one.",
    category: "etching-deposition",
    difficulty: "beginner",
    status: "available",
    formula: "V = thickness × area",
    inputs: ["Any two of thickness, area, volume"],
    output: "The remaining quantity",
    relatedLearning: ["deposition", "etching"],
    relatedTools: ["film-stack", "deposition-rate"],
  },
  {
    slug: "deposition-rate",
    name: "Deposition rate",
    summary: "Average deposition rate from deposited thickness and process time.",
    category: "etching-deposition",
    difficulty: "beginner",
    status: "available",
    formula: "rate = thickness / time",
    inputs: ["Deposited thickness", "Process time"],
    output: "Deposition rate (nm/min)",
    relatedLearning: ["deposition"],
    relatedTools: ["process-time", "deposition-comparison"],
  },
  {
    slug: "process-time",
    name: "Deposition process time",
    summary: "Estimated time to reach a target thickness at a given rate.",
    category: "etching-deposition",
    difficulty: "beginner",
    status: "available",
    formula: "time = thickness / rate",
    inputs: ["Target thickness", "Deposition rate"],
    output: "Estimated process time (constant-rate assumption)",
    relatedLearning: ["deposition"],
    relatedTools: ["deposition-rate"],
  },
  {
    slug: "etch-rate",
    name: "Etch rate",
    summary: "Average etch rate from initial and remaining thickness over time.",
    category: "etching-deposition",
    difficulty: "engineering",
    status: "available",
    formula: "rate = (initial − remaining) / time",
    inputs: ["Initial thickness", "Remaining thickness", "Process time"],
    output: "Etch rate (nm/min)",
    relatedLearning: ["etching"],
    relatedTools: ["etch-time", "selectivity"],
  },
  {
    slug: "etch-time",
    name: "Etch time estimator",
    summary: "Estimated time to etch a thickness at a given rate.",
    category: "etching-deposition",
    difficulty: "beginner",
    status: "available",
    formula: "time = thickness / rate",
    inputs: ["Material thickness", "Etch rate"],
    output: "Estimated etch time (before endpoint/margins)",
    relatedLearning: ["etching"],
    relatedTools: ["etch-rate", "selectivity"],
  },
  {
    slug: "selectivity",
    name: "Etch selectivity",
    summary: "Ratio of target etch rate to mask/underlayer etch rate.",
    category: "etching-deposition",
    difficulty: "engineering",
    status: "available",
    formula: "S = target rate / mask rate",
    inputs: ["Target etch rate", "Mask/underlayer etch rate"],
    output: "Selectivity ratio (dimensionless)",
    relatedLearning: ["etching"],
    relatedTools: ["etch-rate", "etch-time"],
  },
  {
    slug: "film-stack",
    name: "Film stack builder",
    summary: "Build a multi-layer film stack, see total thickness, and visualize it.",
    category: "etching-deposition",
    difficulty: "beginner",
    status: "available",
    formula: "total = Σ layer thickness",
    inputs: ["Layer names and thicknesses"],
    output: "Per-layer and total stack thickness, with a visual",
    relatedLearning: ["deposition", "etching"],
    relatedTools: ["film-thickness"],
  },
  {
    slug: "deposition-comparison",
    name: "Deposition method comparison",
    summary: "Compare CVD, PVD, ALD, and epitaxy conceptually — no universal ranking.",
    category: "etching-deposition",
    difficulty: "beginner",
    status: "available",
    formula: "CVD · PVD · ALD · Epitaxy",
    output: "Conceptual comparison table",
    relatedLearning: ["deposition"],
    relatedTools: ["etch-comparison"],
  },
  {
    slug: "etch-comparison",
    name: "Etch method comparison",
    summary: "Compare wet vs dry etching conceptually.",
    category: "etching-deposition",
    difficulty: "beginner",
    status: "available",
    formula: "Wet vs dry etching",
    output: "Conceptual comparison table",
    relatedLearning: ["etching"],
    relatedTools: ["deposition-comparison"],
  },
  // ---- Doping ----
  {
    slug: "carrier-concentration",
    name: "Carrier concentration",
    summary: "Majority and minority carriers from dopant and intrinsic concentration.",
    category: "doping",
    difficulty: "engineering",
    status: "available",
    formula: "n·p = nᵢ²  (with charge neutrality)",
    inputs: ["Intrinsic carrier concentration", "Dopant concentration", "Dopant type"],
    output: "Majority & minority carrier concentrations",
    educational: true,
    relatedLearning: ["ion-implantation", "pn-junction", "mosfet"],
    relatedTools: ["conductivity", "doping-chain"],
  },
  {
    slug: "conductivity",
    name: "Conductivity",
    summary: "Conductivity from carrier concentrations and mobilities.",
    category: "doping",
    difficulty: "engineering",
    status: "available",
    formula: "σ = q·(n·μₙ + p·μₚ)",
    inputs: ["Electron conc", "Hole conc", "Electron mobility", "Hole mobility"],
    output: "Conductivity (S/m) and resistivity",
    relatedLearning: ["ion-implantation", "mosfet"],
    relatedTools: ["resistivity", "sheet-resistance", "carrier-concentration"],
  },
  {
    slug: "resistivity",
    name: "Resistivity",
    summary: "Resistivity as the reciprocal of conductivity (ρ = 1/σ).",
    category: "doping",
    difficulty: "beginner",
    status: "available",
    formula: "ρ = 1 / σ",
    inputs: ["Conductivity (σ)"],
    output: "Resistivity (Ω·m, Ω·cm)",
    relatedLearning: ["ion-implantation", "metrology"],
    relatedTools: ["conductivity", "sheet-resistance"],
  },
  {
    slug: "doping-conversion",
    name: "Doping concentration ↔ count",
    summary: "Convert between dopant concentration, volume, and total dopant atoms.",
    category: "doping",
    difficulty: "beginner",
    status: "available",
    formula: "count = concentration × volume",
    inputs: ["Any two of concentration, volume, count"],
    output: "The missing quantity",
    relatedLearning: ["ion-implantation"],
    relatedTools: ["carrier-concentration", "implant-dose"],
  },
  {
    slug: "implant-dose",
    name: "Implant dose (educational)",
    summary: "Total implanted ions from areal dose and area (educational).",
    category: "doping",
    difficulty: "beginner",
    status: "available",
    formula: "total ions = dose × area",
    inputs: ["Dose (ions/cm²)", "Exposed area"],
    output: "Total implanted ions",
    educational: true,
    relatedLearning: ["ion-implantation"],
    relatedTools: ["doping-conversion"],
  },
  {
    slug: "diffusion-education",
    name: "Diffusion profile (educational)",
    summary: "Visualize an erfc diffusion profile as you vary diffusion coefficient and time.",
    category: "doping",
    difficulty: "advanced",
    status: "available",
    formula: "C(x) = Cs · erfc( x / (2√(D·t)) )",
    inputs: ["Diffusion coefficient (D)", "Time (t)"],
    output: "Concentration-vs-depth curve (educational)",
    educational: true,
    relatedLearning: ["ion-implantation"],
    relatedTools: ["pn-junction-explorer"],
  },
  {
    slug: "pn-junction-explorer",
    name: "PN junction explorer",
    summary: "Interactive conceptual PN junction — see the depletion region change with doping.",
    category: "doping",
    difficulty: "advanced",
    status: "available",
    formula: "depletion split: xₙ/xₚ = Nₐ/N_d (qualitative)",
    inputs: ["Acceptor doping (Nₐ)", "Donor doping (N_d)"],
    output: "Depletion-region visualization (qualitative)",
    educational: true,
    relatedLearning: ["pn-junction", "ion-implantation"],
    relatedTools: ["built-in-potential", "diffusion-education"],
  },
  {
    slug: "doping-chain",
    name: "Doping → sheet resistance",
    summary: "Follow doping → carrier concentration → conductivity → resistivity → sheet resistance.",
    category: "doping",
    difficulty: "engineering",
    status: "available",
    formula: "Nd → n → σ = q·n·μₙ → ρ = 1/σ → Rs = ρ/t",
    inputs: ["Donor concentration", "Electron mobility", "Film thickness"],
    output: "Carrier, conductivity, resistivity, and sheet resistance",
    relatedLearning: ["ion-implantation", "metrology"],
    relatedTools: ["carrier-concentration", "conductivity", "sheet-resistance"],
  },
  // ---- Packaging ----
  {
    slug: "package-dimensions",
    name: "Package dimensions",
    summary: "Footprint and volume of a package from its length, width, and height.",
    category: "packaging",
    difficulty: "beginner",
    status: "available",
    formula: "footprint = L × W ;  volume = L × W × H",
    inputs: ["Package length", "Package width", "Package height"],
    output: "Footprint area and volume",
    relatedLearning: ["packaging"],
    relatedTools: ["die-size", "interconnect-count"],
  },
  {
    slug: "thermal-resistance",
    name: "Thermal resistance",
    summary: "Relate temperature rise, power, and thermal resistance (ΔT = P × Rθ).",
    category: "packaging",
    difficulty: "engineering",
    status: "available",
    formula: "ΔT = P × Rθ",
    inputs: ["Any two of ΔT, power, thermal resistance"],
    output: "The remaining quantity",
    educational: true,
    relatedLearning: ["packaging"],
    relatedTools: ["thermal-budget", "junction-temperature", "power-dissipation"],
  },
  {
    slug: "thermal-budget",
    name: "Thermal budget",
    summary: "Allowable power from the junction-to-ambient temperature margin and thermal resistance.",
    category: "packaging",
    difficulty: "engineering",
    status: "available",
    formula: "P ≤ (Tj_max − T_ambient) / Rθ",
    inputs: ["Ambient temperature", "Max junction temperature", "Thermal resistance"],
    output: "Allowable power (simplified model)",
    educational: true,
    relatedLearning: ["packaging"],
    relatedTools: ["thermal-resistance", "junction-temperature"],
  },
  {
    slug: "interconnect-count",
    name: "Interconnect capacity",
    summary: "Geometric connection capacity for an area at a given pitch.",
    category: "packaging",
    difficulty: "engineering",
    status: "available",
    formula: "count ≈ ⌊W/pitch⌋ × ⌊H/pitch⌋",
    inputs: ["Area width", "Area height", "Pitch"],
    output: "Theoretical geometric connection count",
    educational: true,
    relatedLearning: ["packaging"],
    relatedTools: ["bump-pitch", "package-dimensions"],
  },
  {
    slug: "bump-pitch",
    name: "Bump / interconnect pitch",
    summary: "Connection count, array span, and areal density from rows, columns, and pitch.",
    category: "packaging",
    difficulty: "beginner",
    status: "available",
    formula: "count = rows × columns ;  density = 1/pitch²",
    inputs: ["Rows", "Columns", "Pitch"],
    output: "Count, array size, and connection density",
    relatedLearning: ["packaging"],
    relatedTools: ["interconnect-count"],
  },
  {
    slug: "chiplet-explorer",
    name: "Chiplet package explorer",
    summary: "Explore side-by-side, stacked, interposer, and bridge chiplet integration, interactively.",
    category: "packaging",
    difficulty: "advanced",
    status: "available",
    formula: "side-by-side · stacked · interposer · bridge",
    inputs: ["Integration style"],
    output: "Conceptual package layout and explanation",
    educational: true,
    relatedLearning: ["packaging", "chiplets", "3d-ic"],
    relatedTools: ["packaging-comparison"],
  },
  {
    slug: "packaging-comparison",
    name: "2D / 2.5D / 3D comparison",
    summary: "Compare 2D, 2.5D, and 3D packaging: arrangement, interconnect, thermal, and use cases.",
    category: "packaging",
    difficulty: "beginner",
    status: "available",
    formula: "2D · 2.5D · 3D",
    output: "Conceptual comparison table",
    relatedLearning: ["packaging", "advanced-packaging"],
    relatedTools: ["chiplet-explorer"],
  },
];

/* ------------------------------------------------------------------ *
 * Lookups & helpers
 * ------------------------------------------------------------------ */

const BY_SLUG = new Map(SEMI_TOOLS.map((t) => [t.slug, t]));

export function getSemiTool(slug: string): SemiTool | undefined {
  return BY_SLUG.get(slug);
}

export function isSemiToolAvailable(slug: string): boolean {
  return BY_SLUG.get(slug)?.status === "available";
}

/** Related tools as {label, href} links — only tools that are actually available. */
export function getRelatedSemiToolLinks(slug: string): { label: string; href: string }[] {
  const tool = BY_SLUG.get(slug);
  if (!tool) return [];
  return (tool.relatedTools ?? [])
    .map((s) => BY_SLUG.get(s))
    .filter((t): t is SemiTool => Boolean(t) && t!.status === "available")
    .map((t) => ({ label: t.name, href: `/semiconductors/tools/${t.slug}` }));
}

/** Related learning topics as {label, href} links — only lessons that exist. */
export function getSemiToolLearningLinks(slug: string): { label: string; href: string }[] {
  const tool = BY_SLUG.get(slug);
  if (!tool) return [];
  return (tool.relatedLearning ?? [])
    .map((s) => getSemiLesson(s))
    .filter((l): l is NonNullable<ReturnType<typeof getSemiLesson>> => Boolean(l))
    .map((l) => ({ label: l.title, href: `/semiconductors/learn/${l.slug}` }));
}

/**
 * Grouped by category, in display order, for the index page. Only categories
 * that actually have tools are returned (kept for backward compatibility).
 */
export function semiToolsByCategory(): { category: SemiToolCategory; label: string; tools: SemiTool[] }[] {
  return SEMI_CATEGORY_ORDER.map((category) => ({
    category,
    label: SEMI_CATEGORY_LABELS[category],
    tools: SEMI_TOOLS.filter((t) => t.category === category),
  })).filter((g) => g.tools.length > 0);
}

/** Every category with its available-tool count, for category discovery. */
export function semiCategorySummaries(): {
  category: SemiToolCategory;
  label: string;
  description: string;
  count: number;
}[] {
  return SEMI_CATEGORY_ORDER.map((category) => ({
    category,
    label: SEMI_CATEGORY_LABELS[category],
    description: SEMI_CATEGORY_DESCRIPTIONS[category],
    count: SEMI_TOOLS.filter((t) => t.category === category && t.status !== "coming-soon").length,
  }));
}
