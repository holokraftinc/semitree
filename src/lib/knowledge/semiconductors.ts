/**
 * Semiconductor domain — TAXONOMY ONLY (structure, not articles).
 *
 * Categories and subcategories are standard, factual industry terminology.
 * Content entities (concepts, lessons, tools, companies, technologies,
 * processes, research, …) are intentionally EMPTY here — this phase builds the
 * information architecture, not the content, and never fabricates companies,
 * technologies, or statistics.
 */
import type { Category, KnowledgeBase, Subcategory } from "./types";

const D = "semiconductors" as const;

/** The 23 top-level areas of the semiconductor domain. */
export const SEMI_CATEGORIES: Category[] = [
  { slug: "fundamentals", domainId: D, title: "Semiconductor Fundamentals", order: 1, summary: "Band theory, carriers, junctions — the physics everything rests on." },
  { slug: "materials", domainId: D, title: "Materials", order: 2, summary: "Silicon, compound semiconductors, and their properties." },
  { slug: "devices", domainId: D, title: "Semiconductor Devices", order: 3, summary: "Diodes, transistors (MOSFET, FinFET, GAA), memory cells." },
  { slug: "ic-design", domainId: D, title: "IC Design", order: 4, summary: "Turning intent into a manufacturable chip.", subcategories: ["digital", "analog", "mixed-signal", "verification", "physical-design", "tapeout"] },
  { slug: "eda", domainId: D, title: "EDA", order: 5, summary: "Electronic design automation software and flows." },
  { slug: "wafer-manufacturing", domainId: D, title: "Wafer Manufacturing", order: 6, summary: "From sand to polished wafers to finished dies." },
  { slug: "lithography", domainId: D, title: "Lithography", order: 7, summary: "Patterning each layer onto the wafer.", subcategories: ["euv", "photoresist", "mask", "overlay", "litho-metrology"] },
  { slug: "deposition", domainId: D, title: "Deposition", order: 8, summary: "Adding thin films (CVD, PVD, ALD, epitaxy)." },
  { slug: "etching", domainId: D, title: "Etching", order: 9, summary: "Selectively removing material (wet and plasma)." },
  { slug: "doping", domainId: D, title: "Doping", order: 10, summary: "Introducing dopants (implantation, diffusion, anneal)." },
  { slug: "cmp", domainId: D, title: "CMP", order: 11, summary: "Chemical-mechanical planarisation between layers." },
  { slug: "metrology-inspection", domainId: D, title: "Metrology & Inspection", order: 12, summary: "Measuring and finding defects at nanometre scale." },
  { slug: "cleanroom", domainId: D, title: "Cleanroom", order: 13, summary: "Contamination control and fab environments." },
  { slug: "packaging", domainId: D, title: "Packaging", order: 14, summary: "Turning dies into usable, connected chips.", subcategories: ["traditional-packaging", "flip-chip", "2-5d", "3d", "chiplets", "hbm"] },
  { slug: "testing", domainId: D, title: "Testing", order: 15, summary: "Electrical test, binning, and reliability." },
  { slug: "equipment", domainId: D, title: "Equipment", order: 16, summary: "The tools that build and measure chips." },
  { slug: "chemicals-materials", domainId: D, title: "Chemicals & Materials", order: 17, summary: "Process chemicals, gases, and consumables." },
  { slug: "supply-chain", domainId: D, title: "Semiconductor Supply Chain", order: 18, summary: "How the global ecosystem fits together." },
  { slug: "applications", domainId: D, title: "Applications", order: 19, summary: "Where chips are used — compute, mobile, auto, AI." },
  { slug: "companies", domainId: D, title: "Companies", order: 20, summary: "The players across the value chain." },
  { slug: "research", domainId: D, title: "Research", order: 21, summary: "Papers, roadmaps, and emerging directions." },
  { slug: "careers", domainId: D, title: "Careers", order: 22, summary: "Roles, skills, and paths into the industry." },
  { slug: "india-ecosystem", domainId: D, title: "India Semiconductor Ecosystem", order: 23, summary: "Policy, fabs, design centres, and talent in India." },
];

/** Subcategory hierarchy for the worked-example areas. */
export const SEMI_SUBCATEGORIES: Subcategory[] = [
  // Lithography
  { slug: "euv", domainId: D, categorySlug: "lithography", order: 1, title: "EUV", summary: "Extreme-ultraviolet lithography for leading-edge nodes." },
  { slug: "photoresist", domainId: D, categorySlug: "lithography", order: 2, title: "Photoresist", summary: "Light-sensitive films that record the pattern." },
  { slug: "mask", domainId: D, categorySlug: "lithography", order: 3, title: "Mask", summary: "Photomasks/reticles that define each layer." },
  { slug: "overlay", domainId: D, categorySlug: "lithography", order: 4, title: "Overlay", summary: "Aligning each layer to the ones below." },
  { slug: "litho-metrology", domainId: D, categorySlug: "lithography", order: 5, title: "Metrology", summary: "Measuring critical dimensions and alignment." },
  // Packaging
  { slug: "traditional-packaging", domainId: D, categorySlug: "packaging", order: 1, title: "Traditional Packaging", summary: "Wire-bond and lead-frame packages." },
  { slug: "flip-chip", domainId: D, categorySlug: "packaging", order: 2, title: "Flip Chip", summary: "Face-down die attach via solder bumps." },
  { slug: "2-5d", domainId: D, categorySlug: "packaging", order: 3, title: "2.5D", summary: "Dies on a shared interposer." },
  { slug: "3d", domainId: D, categorySlug: "packaging", order: 4, title: "3D", summary: "Vertically stacked dies with through-silicon vias." },
  { slug: "chiplets", domainId: D, categorySlug: "packaging", order: 5, title: "Chiplets", summary: "Composing systems from smaller reusable dies." },
  { slug: "hbm", domainId: D, categorySlug: "packaging", order: 6, title: "HBM", summary: "High-bandwidth memory stacks." },
  // IC Design
  { slug: "digital", domainId: D, categorySlug: "ic-design", order: 1, title: "Digital", summary: "RTL, logic synthesis, and digital blocks." },
  { slug: "analog", domainId: D, categorySlug: "ic-design", order: 2, title: "Analog", summary: "Amplifiers, references, data converters." },
  { slug: "mixed-signal", domainId: D, categorySlug: "ic-design", order: 3, title: "Mixed Signal", summary: "Combining analog and digital on one die." },
  { slug: "verification", domainId: D, categorySlug: "ic-design", order: 4, title: "Verification", summary: "Proving the design behaves before tapeout." },
  { slug: "physical-design", domainId: D, categorySlug: "ic-design", order: 5, title: "Physical Design", summary: "Floorplan, place-and-route, timing closure." },
  { slug: "tapeout", domainId: D, categorySlug: "ic-design", order: 6, title: "Tapeout", summary: "Final signoff and hand-off to the foundry." },
];

/** The semiconductor knowledge base — taxonomy populated, content empty. */
export const SEMICONDUCTORS: KnowledgeBase = {
  domainId: D,
  categories: SEMI_CATEGORIES,
  subcategories: SEMI_SUBCATEGORIES,
  concepts: [],
  topics: [],
  lessons: [],
  tools: [],
  resources: [],
  companies: [], // never fabricated — added only when verified
  technologies: [],
  processes: [],
  equipment: [],
  materials: [],
  applications: [],
  research: [],
};
