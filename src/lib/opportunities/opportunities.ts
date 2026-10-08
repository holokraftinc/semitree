/**
 * Opportunity & problem intelligence layer.
 *
 * This is NOT a startup-ideas list. It documents real, well-established gaps and
 * problems in the semiconductor ecosystem, each tagged with an HONEST evidence
 * level and a discovery status. We never turn speculation into fact:
 *   - "observed"  : we can see it directly in Semitree's own data (e.g. a
 *                   supplier category with zero verified companies).
 *   - "reported"  : widely and consistently reported in the public industry
 *                   record — not independently re-verified by us.
 *   - "researching": we are still compiling evidence.
 *   - "validated" : independently validated with primary evidence. Intentionally
 *                   NOT used by any seeded entry yet — the slot exists for later.
 *
 * Status reflects where Semitree is in the discovery process, not a claim about
 * the market. No entry is marked "confirmed", "experimenting" or "solved" until
 * that is genuinely true.
 */
import type { RelationStatus } from "@/lib/industry/relationships";

export type OpportunityCategoryKey =
  | "industry-gaps"
  | "supply-chain-gaps"
  | "startup-opportunities"
  | "emerging-technologies"
  | "supplier-opportunities"
  | "market-signals";

export interface OpportunityCategory {
  key: OpportunityCategoryKey;
  label: string;
  description: string;
}

export const OPPORTUNITY_CATEGORIES: OpportunityCategory[] = [
  { key: "industry-gaps", label: "Industry Gaps", description: "Where the ecosystem is structurally thin or missing capability." },
  { key: "supply-chain-gaps", label: "Supply Chain Gaps", description: "Missing or weak links in the end-to-end supply chain." },
  { key: "supplier-opportunities", label: "Supplier Opportunities", description: "Supplier categories with no verified player in our registry yet." },
  { key: "startup-opportunities", label: "Startup Opportunities", description: "Problems a new company could address — framed, not hyped." },
  { key: "emerging-technologies", label: "Emerging Technologies", description: "Shifts worth tracking because they reshape demand upstream." },
  { key: "market-signals", label: "Market Signals", description: "Concrete, reported signals — capital, projects, policy." },
];

export const OPPORTUNITY_CATEGORY_BY_KEY = new Map(OPPORTUNITY_CATEGORIES.map((c) => [c.key, c]));

/* ------------------------------ Status & evidence ------------------------------ */

export type ProblemStatus =
  | "researching"
  | "validating"
  | "confirmed"
  | "potential-opportunity"
  | "experimenting"
  | "solved";

export const PROBLEM_STATUS_META: Record<ProblemStatus, { label: string; className: string }> = {
  researching: { label: "Researching", className: "bg-muted text-muted-foreground" },
  validating: { label: "Validating", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  confirmed: { label: "Confirmed", className: "bg-brand/10 text-brand" },
  "potential-opportunity": { label: "Potential opportunity", className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  experimenting: { label: "Experimenting", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  solved: { label: "Solved / product built", className: "bg-success/10 text-success" },
};

export type EvidenceLevel = "observed" | "reported" | "researching" | "validated";

export const EVIDENCE_META: Record<EvidenceLevel, { label: string; className: string; description: string }> = {
  observed: { label: "Observed", className: "bg-success/10 text-success", description: "Directly visible in Semitree's own data." },
  reported: { label: "Reported", className: "bg-brand/10 text-brand", description: "Widely reported publicly; not independently re-verified." },
  researching: { label: "Researching", className: "bg-muted text-muted-foreground", description: "Evidence is still being compiled." },
  validated: { label: "Validated", className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400", description: "Independently validated with primary evidence." },
};

/* ---------------------------------- Problems ----------------------------------- */

export interface EvidencePoint {
  level: EvidenceLevel;
  text: string;
}

export interface Problem {
  /** Zero-padded id, e.g. "001". */
  id: string;
  slug: string;
  title: string;
  category: OpportunityCategoryKey;
  problem: string;
  industry: string;
  affectedParticipants: string[];
  whyItMatters: string;
  evidence: EvidencePoint[];
  currentAlternatives: string[];
  knownLimitations: string[];
  whoExperiences: string[];
  potentialApproaches: string[];
  status: ProblemStatus;
  /** Interlinks to real Semitree entities. */
  relatedCompanies?: string[];
  relatedTechnologies?: { label: string; slug: string }[];
  /** Supply-chain stage slug. */
  relatedStage?: string;
}

export const PROBLEMS: Problem[] = [
  {
    id: "001",
    slug: "semiconductor-supplier-qualification",
    title: "Semiconductor supplier qualification",
    category: "supply-chain-gaps",
    problem:
      "Qualifying a new supplier into a semiconductor manufacturing line — materials, chemicals, parts, or services — is slow, expensive, and opaque. A new entrant can face long audit, sampling, and reliability-qualification cycles before a single purchase order.",
    industry: "Semiconductor manufacturing",
    affectedParticipants: ["New and regional suppliers", "Fabs and ATMP/OSAT operators", "Procurement & quality teams"],
    whyItMatters:
      "Qualification cost and time are a structural barrier to diversifying and localising the supply base — exactly what new ecosystems like India are trying to do. It slows resilience and keeps supply concentrated.",
    evidence: [
      { level: "reported", text: "Long, multi-stage qualification is a consistently reported barrier for suppliers entering semiconductor supply chains." },
      { level: "observed", text: "Semitree's own supplier registry has verified companies in only a handful of categories; most remain empty." },
    ],
    currentAlternatives: ["Partnering with an already-qualified incumbent", "Second-sourcing after a long audit cycle", "Supplying adjacent, less-regulated industries first"],
    knownLimitations: ["Qualification data is rarely shared across buyers", "High fixed cost falls hardest on smaller suppliers", "Little standardisation between fabs"],
    whoExperiences: ["Suppliers trying to enter the industry", "Fabs trying to de-risk single-source dependencies"],
    potentialApproaches: ["Shared qualification data / standards", "Readiness tooling and checklists for new suppliers", "Regional qualification support programmes"],
    status: "researching",
    relatedStage: "fab",
  },
  {
    id: "002",
    slug: "india-thin-local-supplier-base",
    title: "Thin local supplier base in India",
    category: "supplier-opportunities",
    problem:
      "India's new fabs and ATMP plants depend heavily on imported equipment, materials, gases, and sub-systems. The domestic supplier base across most support categories is still thin or absent.",
    industry: "Semiconductor manufacturing (India)",
    affectedParticipants: ["Indian fabs & ATMP operators", "Would-be domestic suppliers", "Policy & industrial-development bodies"],
    whyItMatters:
      "Localising the supply base is what turns a few plants into an ecosystem — it affects cost, lead times, resilience, and the depth of the opportunity for Indian companies.",
    evidence: [
      { level: "observed", text: "In Semitree's India data, state pages for the active states show no verified local supply-base companies in most supplier categories." },
      { level: "reported", text: "Import dependence for equipment, materials, and specialty inputs is widely reported as a gap for India's emerging ecosystem." },
    ],
    currentAlternatives: ["Importing equipment, materials, and gases", "Global suppliers setting up local presence over time"],
    knownLimitations: ["Localisation takes years and capital", "Qualification barriers (see #001) compound the gap"],
    whoExperiences: ["New Indian manufacturing projects", "Indian industrial firms considering entry"],
    potentialApproaches: ["Targeted supplier-development programmes", "Joint ventures with established global suppliers", "Starting in less capital-intensive categories first"],
    status: "potential-opportunity",
    relatedStage: "raw-materials",
    relatedCompanies: ["tata-electronics", "micron"],
  },
  {
    id: "003",
    slug: "specialty-gases-chemicals-localisation",
    title: "Specialty gases & chemicals localisation",
    category: "supply-chain-gaps",
    problem:
      "Fabs consume large volumes of ultra-high-purity gases and specialty chemicals. Producing and delivering these at semiconductor-grade purity, reliably and close to the fab, is a distinct and under-built capability in emerging ecosystems.",
    industry: "Semiconductor materials & chemicals",
    affectedParticipants: ["Fabs", "Industrial gas & chemical producers", "Logistics providers"],
    whyItMatters:
      "Purity and proximity directly affect yield and operating cost. Gases and chemicals are a recurring, high-volume input — a durable supply opportunity, not a one-off sale.",
    evidence: [
      { level: "observed", text: "Semitree's supplier registry has no verified companies in the Gases or Industrial gases categories." },
      { level: "reported", text: "Specialty gases and chemicals are widely cited among the hardest inputs to localise at semiconductor grade." },
    ],
    currentAlternatives: ["Importing purified gases and chemicals", "On-site generation for some bulk gases"],
    knownLimitations: ["Purity and handling requirements are extreme", "Capital and safety barriers are high"],
    whoExperiences: ["Fabs in new regions", "Chemical & gas firms considering a semiconductor line"],
    potentialApproaches: ["On-site or near-site generation", "Partnerships with established specialty-gas firms"],
    status: "researching",
    relatedStage: "raw-materials",
  },
  {
    id: "004",
    slug: "atmp-talent-and-capacity-ramp",
    title: "ATMP talent & capacity ramp",
    category: "industry-gaps",
    problem:
      "Assembly, test, and packaging is scaling fastest in new ecosystems, but ramping skilled operators, process engineers, and reliability specialists at the required pace is a bottleneck.",
    industry: "Assembly, test & packaging",
    affectedParticipants: ["ATMP/OSAT operators", "Workforce & skilling institutions", "Equipment suppliers"],
    whyItMatters:
      "Plants can be built faster than a specialised workforce can be trained. Talent depth determines how quickly announced capacity becomes productive output.",
    evidence: [
      { level: "reported", text: "Workforce and skilling depth is widely reported as a constraint on scaling semiconductor manufacturing in new regions." },
      { level: "observed", text: "Semitree tracks multiple announced ATMP/OSAT projects whose ramp depends on skilled staffing." },
    ],
    currentAlternatives: ["In-house training programmes", "Hiring experienced staff from abroad", "Vendor-led training with equipment"],
    knownLimitations: ["Experienced talent is scarce and mobile", "Training lead times are long"],
    whoExperiences: ["ATMP/OSAT operators", "Engineering graduates seeking a path into the industry"],
    potentialApproaches: ["Industry–academia skilling pipelines", "Simulation & hands-on training facilities"],
    status: "researching",
    relatedStage: "packaging",
    relatedCompanies: ["tata-electronics", "cg-power", "kaynes", "micron"],
  },
  {
    id: "005",
    slug: "advanced-packaging-capability",
    title: "Advanced packaging & chiplet capability",
    category: "emerging-technologies",
    problem:
      "As gains from shrinking transistors slow, advanced packaging and chiplets carry more of the performance improvement. Building this capability — not just traditional packaging — is where much of the future value sits.",
    industry: "Advanced packaging",
    affectedParticipants: ["OSAT/ATMP firms", "Fabless & IDM designers", "Substrate & materials suppliers"],
    whyItMatters:
      "Advanced packaging is becoming a strategic capability in its own right, and it is a realistic place for newer ecosystems to move up the value chain from basic assembly.",
    evidence: [
      { level: "reported", text: "The shift of performance gains toward advanced packaging and chiplets is extensively documented in the public record." },
      { level: "researching", text: "Where India and other newer ecosystems can compete in advanced packaging specifically is still being mapped." },
    ],
    currentAlternatives: ["Traditional single-die packaging", "Outsourcing advanced packaging to established hubs"],
    knownLimitations: ["Requires substrates, materials, and process depth", "Capital and know-how barriers"],
    whoExperiences: ["Packaging firms moving up-market", "System designers adopting chiplets"],
    potentialApproaches: ["Focused advanced-packaging lines", "Substrate & materials localisation to support it"],
    status: "potential-opportunity",
    relatedStage: "packaging",
    relatedCompanies: ["ase", "amkor", "tata-electronics"],
    relatedTechnologies: [{ label: "Advanced packaging & chiplets", slug: "advanced-packaging-chiplets" }],
  },
];

const PROBLEM_BY_SLUG = new Map(PROBLEMS.map((p) => [p.slug, p]));

export function getProblem(slug: string): Problem | undefined {
  return PROBLEM_BY_SLUG.get(slug);
}

export function problemsByCategory(key: OpportunityCategoryKey): Problem[] {
  return PROBLEMS.filter((p) => p.category === key);
}

/** Count of distinct evidence levels backing a problem (for the card summary). */
export function strongestEvidence(p: Problem): EvidenceLevel {
  const order: EvidenceLevel[] = ["validated", "observed", "reported", "researching"];
  for (const lvl of order) if (p.evidence.some((e) => e.level === lvl)) return lvl;
  return "researching";
}

/* Re-export the supplier-category gap view (Phase 6) as it IS supply-chain evidence. */
export type { RelationStatus };
