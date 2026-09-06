/**
 * Semiconductor tools registry — single source of truth for the Semiconductor
 * Engineering calculators under `/semiconductors/tools`.
 *
 * Kept separate from the microfluidics `TOOLS` registry (src/lib/data/tools.ts)
 * because the two domains have different categories and routes. Relationships
 * between tools are expressed here as data, not hard-coded in page components.
 */

export type SemiToolCategory =
  | "electrical-fundamentals"
  | "device-physics"
  | "manufacturing"
  | "packaging";

export const SEMI_CATEGORY_LABELS: Record<SemiToolCategory, string> = {
  "electrical-fundamentals": "Electrical fundamentals",
  "device-physics": "Semiconductor physics",
  manufacturing: "Manufacturing",
  packaging: "Packaging & thermal",
};

export interface SemiTool {
  /** Route segment under /semiconductors/tools/<slug>. */
  slug: string;
  name: string;
  summary: string;
  category: SemiToolCategory;
  /** Short formula shown on the index card. */
  formula: string;
  relatedTools: string[];
}

export const SEMI_TOOLS: SemiTool[] = [
  {
    slug: "ohms-law",
    name: "Ohm's law",
    summary: "Solve for voltage, current, or resistance in a resistive circuit.",
    category: "electrical-fundamentals",
    formula: "V = I · R",
    relatedTools: ["power-dissipation", "rc-time-constant"],
  },
  {
    slug: "power-dissipation",
    name: "Power dissipation",
    summary: "Resistive power from voltage, current, or resistance.",
    category: "electrical-fundamentals",
    formula: "P = V · I",
    relatedTools: ["ohms-law", "power-density"],
  },
  {
    slug: "rc-time-constant",
    name: "RC time constant",
    summary: "Time constant and −3 dB cutoff of a single-pole RC network.",
    category: "electrical-fundamentals",
    formula: "τ = R · C",
    relatedTools: ["ohms-law", "power-dissipation"],
  },
  {
    slug: "built-in-potential",
    name: "Built-in potential",
    summary: "Junction potential of an abrupt PN junction from doping.",
    category: "device-physics",
    formula: "V_bi = (kT/q) · ln(N_a N_d / n_i²)",
    relatedTools: ["ohms-law"],
  },
  {
    slug: "die-per-wafer",
    name: "Die per wafer",
    summary: "Estimate gross die count using the de Vries approximation.",
    category: "manufacturing",
    formula: "DPW ≈ πd²/4S − πd/√(2S)",
    relatedTools: ["wafer-yield"],
  },
  {
    slug: "wafer-yield",
    name: "Wafer yield",
    summary: "Die yield from defect density (Poisson or Murphy model).",
    category: "manufacturing",
    formula: "Y = e^(−D·A)",
    relatedTools: ["die-per-wafer"],
  },
  {
    slug: "junction-temperature",
    name: "Junction temperature",
    summary: "Junction temperature rise from power and thermal resistance.",
    category: "packaging",
    formula: "T_j = T_a + P · θ_JA",
    relatedTools: ["power-density", "power-dissipation"],
  },
  {
    slug: "power-density",
    name: "Power density",
    summary: "Areal power density of a die or package.",
    category: "packaging",
    formula: "P_density = P / A",
    relatedTools: ["junction-temperature", "power-dissipation"],
  },
];

const BY_SLUG = new Map(SEMI_TOOLS.map((t) => [t.slug, t]));

export function getSemiTool(slug: string): SemiTool | undefined {
  return BY_SLUG.get(slug);
}

/** Related tools as {label, href} links for the calculator shell. */
export function getRelatedSemiToolLinks(slug: string): { label: string; href: string }[] {
  const tool = BY_SLUG.get(slug);
  if (!tool) return [];
  return tool.relatedTools
    .map((s) => BY_SLUG.get(s))
    .filter((t): t is SemiTool => Boolean(t))
    .map((t) => ({ label: t.name, href: `/semiconductors/tools/${t.slug}` }));
}

/** Grouped by category, preserving declaration order, for the index page. */
export function semiToolsByCategory(): { category: SemiToolCategory; label: string; tools: SemiTool[] }[] {
  const order: SemiToolCategory[] = [
    "electrical-fundamentals",
    "device-physics",
    "manufacturing",
    "packaging",
  ];
  return order
    .map((category) => ({
      category,
      label: SEMI_CATEGORY_LABELS[category],
      tools: SEMI_TOOLS.filter((t) => t.category === category),
    }))
    .filter((g) => g.tools.length > 0);
}
