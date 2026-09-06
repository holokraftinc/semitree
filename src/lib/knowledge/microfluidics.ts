/**
 * Microfluidics domain in the generic knowledge model.
 *
 * Microfluidics remains a fully valid domain. Its LIVE content (tools, lessons,
 * concepts, resources) continues to be served by the existing, battle-tested
 * modules in `src/lib/data` and its routes are unchanged. This file only mirrors
 * the domain's category taxonomy into the generic model so both domains share
 * one entity/UI architecture; content is not duplicated here (an adapter over
 * src/lib/data can populate the entity arrays in a later phase).
 */
import type { Category, KnowledgeBase } from "./types";

const D = "microfluidics" as const;

export const MICRO_CATEGORIES: Category[] = [
  { slug: "fundamentals", domainId: D, title: "Fundamentals", order: 1, summary: "The physics of the microscale — laminar flow and scaling." },
  { slug: "fluid-mechanics", domainId: D, title: "Fluid Mechanics", order: 2, summary: "Reynolds, resistance, pressure, hydraulic diameter." },
  { slug: "droplet", domainId: D, title: "Droplet Microfluidics", order: 3, summary: "Droplet generation and single-cell loading." },
  { slug: "diffusion-mixing", domainId: D, title: "Diffusion & Mixing", order: 4, summary: "Diffusion times and why mixing is hard." },
  { slug: "lab-utilities", domainId: D, title: "Lab Utilities", order: 5, summary: "Unit converters, syringe-pump settings, helpers." },
];

/**
 * Taxonomy only; entity arrays are empty because the live content is served by
 * `src/lib/data`. This keeps microfluidics a first-class domain in the generic
 * model without duplicating content.
 */
export const MICROFLUIDICS: KnowledgeBase = {
  domainId: D,
  categories: MICRO_CATEGORIES,
  subcategories: [],
  concepts: [],
  topics: [],
  lessons: [],
  tools: [],
  resources: [],
  companies: [],
  technologies: [],
  processes: [],
  equipment: [],
  materials: [],
  applications: [],
  research: [],
};
