/**
 * Semitree research projects — the "what we're actively mapping" layer.
 *
 * Each project is a research ASSET, not a blog post: it describes an ongoing
 * effort over one of Semitree's real datasets and reports LIVE coverage stats
 * computed from that data (never hardcoded numbers). Status is honest — a
 * project with no data yet is "researching", not dressed up as "active".
 * Findings and open questions are grounded in what the data actually shows.
 */
import { COMPANIES, presentTypes, presentCountries } from "@/lib/industry/companies";
import {
  SUPPLIER_CATEGORIES,
  populatedSupplierCategories,
  researchingSupplierCategories,
} from "@/lib/industry/relationships";
import { INDIA_PROJECTS, INDIA_INVESTMENTS, indiaCounts } from "@/lib/india/ecosystem";
import { SUPPLY_STAGES, SEGMENTS } from "@/lib/knowledge/supply-chain";
import { CORE_FLOW } from "@/lib/knowledge/supply-chain-explorer";
import { MFG_PROCESSES } from "@/lib/knowledge/manufacturing";
import { PROBLEMS } from "@/lib/opportunities/opportunities";

export type ProjectStatus = "researching" | "active" | "expanding" | "updated" | "archived";

export const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; className: string }> = {
  researching: { label: "Researching", className: "bg-muted text-muted-foreground" },
  active: { label: "Active", className: "bg-success/10 text-success" },
  expanding: { label: "Expanding", className: "bg-brand/10 text-brand" },
  updated: { label: "Updated", className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  archived: { label: "Archived", className: "bg-muted text-muted-foreground" },
};

export interface Stat {
  label: string;
  value: number | string;
}

export interface ProjectUpdate {
  date: string;
  text: string;
}

export interface ResearchProject {
  slug: string;
  title: string;
  tagline: string;
  objective: string;
  whyItMatters: string;
  status: ProjectStatus;
  lastUpdated: string;
  /** Live coverage stats, computed from the real data. */
  stats: () => Stat[];
  coverage: string[];
  dataCollected: string[];
  findings: string[];
  openQuestions: string[];
  updates: ProjectUpdate[];
  nextSteps: string[];
  relatedCompanies?: string[];
  relatedInsights?: string[];
  relatedProblems?: string[];
  /** The live asset this project maintains. */
  primaryHref: string;
  primaryLabel: string;
}

const indiaCompanyCount = () => new Set(
  COMPANIES.filter((c) => [c.hq, ...(c.sites ?? [])].some((p) => p.countryCode === "IN")).map((c) => c.slug),
).size;

const startupCount = () => COMPANIES.filter((c) => c.types.includes("startup")).length;

export const PROJECTS: ResearchProject[] = [
  {
    slug: "india-semiconductor-map",
    title: "India Semiconductor Map",
    tagline: "Mapping every verifiable node of India's ecosystem.",
    objective:
      "Build a living map of India's semiconductor ecosystem — companies, facilities, projects, and investments — grouped by state, from verified public information.",
    whyItMatters:
      "India's ecosystem is forming now. A single, honest, state-by-state map helps everyone — companies, suppliers, students, and policymakers — see what actually exists and where the gaps are.",
    status: "expanding",
    lastUpdated: "2026-10-06",
    stats: () => {
      const c = indiaCounts();
      return [
        { label: "States covered", value: c.states },
        { label: "Facilities", value: c.facilities },
        { label: "Companies in India", value: indiaCompanyCount() },
        { label: "Tracked projects", value: c.projects },
      ];
    },
    coverage: [
      "7 states with verified activity: Gujarat, Karnataka, Telangana, Uttar Pradesh, Maharashtra, Tamil Nadu, Assam.",
      "Fabs, ATMP/OSAT, and design centres mapped at city level.",
    ],
    dataCollected: ["Company sites by state and kind", "Announced fab/ATMP projects and status", "Announced investment figures (as reported)"],
    findings: [
      "Gujarat leads on manufacturing (the first fab plus multiple ATMP plants); Bengaluru and Hyderabad concentrate design.",
      "Manufacturing is the new piece — design centres have operated in India for years.",
      "The local supplier base is still thin across most states.",
    ],
    openQuestions: ["How fast do announced plants reach production?", "Where will the supplier base localise first?"],
    updates: [
      { date: "2026-10-06", text: "Added Assam (Jagiroad ATMP) and refreshed state activity snapshots." },
      { date: "2026-09-06", text: "Initial seven-state coverage with projects and investments." },
    ],
    nextSteps: ["Add research institutions and talent per state", "Track construction/production milestones"],
    relatedInsights: ["india-semiconductor-overview"],
    relatedProblems: ["india-thin-local-supplier-base"],
    primaryHref: "/india",
    primaryLabel: "Open the India ecosystem",
  },
  {
    slug: "company-database",
    title: "Company Database",
    tagline: "A structured, cross-linked registry of the industry.",
    objective:
      "Maintain a verified registry of semiconductor companies — type, location, technologies, capabilities — cross-linked to the supply chain, knowledge base, and insights.",
    whyItMatters:
      "A company directory is only useful if it shows where each company fits. This registry is the backbone the maps, supply chain, and insights all draw on.",
    status: "active",
    lastUpdated: "2026-09-06",
    stats: () => [
      { label: "Companies", value: COMPANIES.length },
      { label: "Company types", value: presentTypes().length },
      { label: "Countries", value: presentCountries().length },
      { label: "In India", value: indiaCompanyCount() },
    ],
    coverage: [
      "Foundries, IDMs, fabless, EDA, equipment, materials, OSAT/ATMP, and design-services firms.",
      "City-level locations; filterable by type, segment, state, city, technology, facility, and capability.",
    ],
    dataCollected: ["Business type and segment", "HQ and site locations", "Technologies, products, and capabilities", "Cross-links to stages, tools, and concepts"],
    findings: [
      "Equipment and materials supply is highly concentrated in a few global firms.",
      "India's entries skew toward design/R&D and newer ATMP projects.",
    ],
    openQuestions: ["Which mid-tier suppliers and startups should be added next?"],
    updates: [{ date: "2026-09-06", text: "Registry compiled from public sources with provenance and last-verified dates." }],
    nextSteps: ["Deepen supplier and startup coverage", "Add more per-company relationships as they are verified"],
    primaryHref: "/industry/companies",
    primaryLabel: "Open the company directory",
  },
  {
    slug: "supplier-database",
    title: "Supplier Database",
    tagline: "Mapping the deep supplier base — honestly.",
    objective:
      "Map the supplier categories behind semiconductor manufacturing and populate each with verified companies — marking everything else as being researched.",
    whyItMatters:
      "The supplier base is where resilience and localisation are won or lost. Showing which categories are covered — and which are not — is itself valuable intelligence.",
    status: "researching",
    lastUpdated: "2026-09-06",
    stats: () => [
      { label: "Categories", value: SUPPLIER_CATEGORIES.length },
      { label: "Populated", value: populatedSupplierCategories().length },
      { label: "Researching", value: researchingSupplierCategories().length },
    ],
    coverage: [
      "19-category supplier taxonomy from equipment and chemicals to cleanroom, metrology, and logistics.",
      "5 categories populated with verified companies so far; 14 still being researched.",
    ],
    dataCollected: ["Supplier categories and what feeds which segment", "Verified companies per category"],
    findings: [
      "Only equipment, chemicals, wafers, packaging materials, and testing have verified entries so far.",
      "Most support categories (gases, substrates, cleanroom, metrology, logistics…) have no verified player in the registry yet.",
    ],
    openQuestions: ["Which suppliers serve the new India plants?", "Where are the easiest categories to localise first?"],
    updates: [{ date: "2026-09-06", text: "Launched the supplier taxonomy with honest Researching states." }],
    nextSteps: ["Populate researched categories as entries are verified", "Link suppliers to the fabs/ATMP they serve"],
    relatedProblems: ["semiconductor-supplier-qualification", "india-thin-local-supplier-base"],
    primaryHref: "/suppliers",
    primaryLabel: "Open the supplier directory",
  },
  {
    slug: "startup-tracker",
    title: "Semiconductor Startup Tracker",
    tagline: "Tracking India's emerging chip companies.",
    objective:
      "Identify and verify India's semiconductor startups — fabless, IP, tooling, and materials — and place them in the ecosystem map.",
    whyItMatters:
      "Startups are an early signal of where the ecosystem is heading. Tracking them credibly (not by rumour) shows momentum and gaps.",
    status: "researching",
    lastUpdated: "2026-09-06",
    stats: () => [
      { label: "Verified startups", value: startupCount() },
      { label: "Status", value: "Scoping" },
    ],
    coverage: ["No startups verified into the registry yet — criteria and sourcing are being defined."],
    dataCollected: ["Inclusion criteria (in progress)"],
    findings: ["Nothing to report yet — we will not list companies we cannot verify."],
    openQuestions: ["What counts as a semiconductor startup for this tracker?", "Which Indian startups are active and verifiable today?"],
    updates: [{ date: "2026-09-06", text: "Project scoped; awaiting verified entries and community submissions." }],
    nextSteps: ["Define inclusion criteria", "Open submissions and verify the first cohort"],
    relatedProblems: ["india-thin-local-supplier-base"],
    primaryHref: "/submit",
    primaryLabel: "Submit a startup or problem",
  },
  {
    slug: "investment-tracker",
    title: "Investment Tracker",
    tagline: "Where announced capital is flowing.",
    objective:
      "Track announced investments behind India's semiconductor projects, with each figure labelled as reported and tied to its project and state.",
    whyItMatters:
      "Investment is the clearest market signal. Tracking announced figures — honestly, as reported — shows where commitment is concentrating.",
    status: "active",
    lastUpdated: "2026-09-06",
    stats: () => [
      { label: "Investments tracked", value: INDIA_INVESTMENTS.length },
      { label: "Linked projects", value: INDIA_PROJECTS.length },
      { label: "States", value: new Set(INDIA_INVESTMENTS.map((i) => i.stateSlug)).size },
    ],
    coverage: ["The announced ISM-approved fab and ATMP/OSAT investments across Gujarat and Assam."],
    dataCollected: ["Announced investment figures (rounded, as reported)", "Links to the project and state each belongs to"],
    findings: ["Announced capital is concentrated in Gujarat, led by the Dholera fab.", "Figures are reported, not independently re-verified."],
    openQuestions: ["How do announced figures compare to deployed capital over time?"],
    updates: [{ date: "2026-09-06", text: "Seeded the announced ISM-approved investments." }],
    nextSteps: ["Add new announcements as they are made", "Distinguish announced vs deployed where sources allow"],
    primaryHref: "/india#investments-h",
    primaryLabel: "See the investments",
  },
  {
    slug: "manufacturing-tracker",
    title: "Manufacturing Tracker",
    tagline: "Processes, facilities, and capacity on the ground.",
    objective:
      "Track the manufacturing picture — the processes that build a chip and the real facilities and projects turning design into silicon.",
    whyItMatters:
      "Manufacturing is the hardest, most capital-intensive link. Mapping processes alongside real facilities grounds the whole platform in what actually happens on a fab line.",
    status: "active",
    lastUpdated: "2026-09-06",
    stats: () => {
      const c = indiaCounts();
      return [
        { label: "Processes documented", value: MFG_PROCESSES.length },
        { label: "Supply-chain stages", value: SUPPLY_STAGES.length },
        { label: "India facilities", value: c.facilities },
        { label: "Announced projects", value: c.projects },
      ];
    },
    coverage: ["Front-end and back-end processes, cross-linked to the supply chain and the companies that run them."],
    dataCollected: ["Process steps with inputs, equipment, and materials", "India facilities by kind and state"],
    findings: ["Back-end (assembly, test, packaging) is scaling first in India; front-end fabrication follows with Dholera."],
    openQuestions: ["What capacity will the announced plants add, and when?"],
    updates: [{ date: "2026-09-06", text: "Linked manufacturing processes to supply-chain stages and facilities." }],
    nextSteps: ["Add capacity data where verifiable", "Track facility milestones"],
    primaryHref: "/manufacturing",
    primaryLabel: "Open the Manufacturing Explorer",
  },
  {
    slug: "supply-chain-explorer",
    title: "Supply Chain Explorer",
    tagline: "The end-to-end chain, made explorable.",
    objective:
      "Model the semiconductor supply chain end to end — every stage, its inputs and outputs, and the companies, technologies, and materials behind it.",
    whyItMatters:
      "Understanding how a chip moves from design to final product is the foundation for everything else — gaps, opportunities, and where India fits.",
    status: "active",
    lastUpdated: "2026-10-06",
    stats: () => [
      { label: "Stages modelled", value: SUPPLY_STAGES.length },
      { label: "Core-flow stages", value: CORE_FLOW.length },
      { label: "Segments", value: SEGMENTS.length },
    ],
    coverage: ["All stages from raw materials through design, equipment, fabrication, packaging, testing, to end markets."],
    dataCollected: ["Per-stage inputs/outputs, technologies, equipment, materials", "Companies and Indian companies per stage", "Cross-entity relationship chains"],
    findings: ["Equipment and materials are the tightest chokepoints; design is where India already competes."],
    openQuestions: ["How deep can per-stage India coverage go as the ecosystem matures?"],
    updates: [
      { date: "2026-10-06", text: "Rebuilt as an interactive explorer with progressive disclosure and a relationship view." },
      { date: "2026-09-06", text: "Initial end-to-end stage model." },
    ],
    nextSteps: ["Expand recent-developments per stage", "Add more relationship chains"],
    primaryHref: "/supply-chain",
    primaryLabel: "Open the Supply Chain Explorer",
  },
];

const BY_SLUG = new Map(PROJECTS.map((p) => [p.slug, p]));

export function getProject(slug: string): ResearchProject | undefined {
  return BY_SLUG.get(slug);
}

/** A single headline stat for the project card. */
export function headlineStat(p: ResearchProject): Stat | undefined {
  return p.stats()[0];
}

export function problemsForProject(p: ResearchProject) {
  return (p.relatedProblems ?? []).map((s) => PROBLEMS.find((x) => x.slug === s)).filter(Boolean);
}

/** Previous / next project in listing order, for the pager. */
export function projectNeighbors(slug: string): { prev?: ResearchProject; next?: ResearchProject } {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { prev: i > 0 ? PROJECTS[i - 1] : undefined, next: i < PROJECTS.length - 1 ? PROJECTS[i + 1] : undefined };
}
