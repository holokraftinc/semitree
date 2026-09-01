/**
 * Canonical tool registry — the single source of truth for the Tools platform.
 *
 * This holds the eight implemented tools, their categories, and (importantly)
 * their **relationships to one another**, expressed as data. Relationships are
 * NOT hard-coded in individual calculator page components — pages read them from
 * here via `getRelatedToolLinks`, so the graph is edited in one place.
 */
import type { Tool } from "./types";
import type { CalculationCategory } from "@/lib/calculations/types";

/** Display labels for the tool categories. */
export const CATEGORY_LABELS: Record<CalculationCategory, string> = {
  "fluid-mechanics": "Fluid mechanics",
  "resistance-network": "Resistance network",
  droplet: "Droplet",
  "diffusion-mixing": "Diffusion & mixing",
  "lab-utilities": "Lab utilities",
  advanced: "Advanced",
};

/**
 * The implemented tools. `relatedTools` defines the tool↔tool graph.
 * Slugs equal the route segment under `/tools/<slug>`.
 */
export const TOOLS: Tool[] = [
  {
    slug: "reynolds-number",
    name: "Reynolds number",
    summary: "Check whether flow is laminar or turbulent.",
    category: "fluid-mechanics",
    tier: "mvp",
    calculationSlug: "reynolds-number",
    relatedConcepts: ["laminar-flow", "reynolds-number"],
    relatedTools: ["hydraulic-diameter", "flow-resistance", "pressure-drop"],
  },
  {
    slug: "hydraulic-diameter",
    name: "Hydraulic diameter",
    summary: "Effective diameter for non-circular (rectangular) channels.",
    category: "fluid-mechanics",
    tier: "mvp",
    calculationSlug: "hydraulic-diameter",
    relatedConcepts: ["hydraulic-diameter"],
    relatedTools: ["reynolds-number", "flow-resistance", "pressure-drop"],
  },
  {
    slug: "pressure-drop",
    name: "Pressure drop",
    summary: "Hagen–Poiseuille pressure drop across a circular channel.",
    category: "fluid-mechanics",
    tier: "mvp",
    calculationSlug: "pressure-drop",
    relatedConcepts: ["pressure-drop", "flow-resistance"],
    relatedTools: ["flow-resistance", "hydraulic-diameter", "reynolds-number"],
  },
  {
    slug: "flow-resistance",
    name: "Flow resistance",
    summary: "Hydraulic resistance of a channel (the electrical analogy).",
    category: "fluid-mechanics",
    tier: "mvp",
    calculationSlug: "flow-resistance",
    relatedConcepts: ["flow-resistance", "hydraulic-electrical-analogy"],
    relatedTools: ["pressure-drop", "hydraulic-diameter", "reynolds-number"],
  },
  {
    slug: "diffusion-time",
    name: "Diffusion time",
    summary: "Estimate how long a species takes to spread by diffusion.",
    category: "diffusion-mixing",
    tier: "mvp",
    calculationSlug: "diffusion-time",
    relatedConcepts: ["diffusion", "peclet-number"],
    relatedTools: ["reynolds-number", "unit-converter"],
  },
  {
    slug: "poisson-single-cell-loading",
    name: "Poisson single-cell loading",
    summary: "Probability of 0 / 1 / 2+ cells per droplet.",
    category: "droplet",
    tier: "mvp",
    calculationSlug: "poisson-loading",
    relatedConcepts: ["poisson-loading", "droplet-microfluidics"],
    relatedTools: ["syringe-pump-settings", "unit-converter"],
  },
  {
    slug: "unit-converter",
    name: "Unit converter",
    summary: "Convert flow rate, pressure, volume, and viscosity.",
    category: "lab-utilities",
    tier: "mvp",
    calculationSlug: "unit-converters",
    relatedTools: ["flow-resistance", "pressure-drop", "syringe-pump-settings"],
  },
  {
    slug: "syringe-pump-settings",
    name: "Syringe pump settings",
    summary: "Convert between syringe plunger speed and flow rate.",
    category: "lab-utilities",
    tier: "mvp",
    calculationSlug: "syringe-pump",
    relatedConcepts: ["newtonian-fluid"],
    relatedTools: ["flow-resistance", "pressure-drop", "unit-converter"],
  },
];

const BY_SLUG = new Map(TOOLS.map((t) => [t.slug, t]));

/** Slugs of tools whose calculators are implemented (all of TOOLS, for now). */
export const IMPLEMENTED_TOOL_SLUGS = new Set<string>(TOOLS.map((t) => t.slug));

export function isToolAvailable(slug: string): boolean {
  return IMPLEMENTED_TOOL_SLUGS.has(slug);
}

export function getTool(slug: string): Tool | undefined {
  return BY_SLUG.get(slug);
}

/** Resolve a tool's related slugs to the full Tool objects (skips unknowns). */
export function getRelatedTools(slug: string): Tool[] {
  const tool = BY_SLUG.get(slug);
  if (!tool?.relatedTools) return [];
  return tool.relatedTools
    .map((s) => BY_SLUG.get(s))
    .filter((t): t is Tool => Boolean(t));
}

/** Related tools as {label, href} links for the calculator shell. */
export function getRelatedToolLinks(
  slug: string,
): { label: string; href: string }[] {
  return getRelatedTools(slug).map((t) => ({
    label: t.name,
    href: `/tools/${t.slug}`,
  }));
}

/**
 * Quick-start intents: "what are you trying to do?" → the tool that does it.
 * Data-driven so the Tools page renders these without hard-coding.
 */
export const QUICK_START_INTENTS: { label: string; slug: string }[] = [
  { label: "Calculate flow", slug: "flow-resistance" },
  { label: "Calculate pressure drop", slug: "pressure-drop" },
  { label: "Check flow regime", slug: "reynolds-number" },
  { label: "Estimate diffusion", slug: "diffusion-time" },
  { label: "Calculate cell loading", slug: "poisson-single-cell-loading" },
  { label: "Convert units", slug: "unit-converter" },
  { label: "Set syringe pump", slug: "syringe-pump-settings" },
];
