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
