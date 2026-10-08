/**
 * India semiconductor ecosystem — structured entities.
 *
 * EDITORIAL RULE (same as the rest of Semitree): nothing is fabricated. States,
 * projects, investments, and institutions are seeded ONLY where there is
 * well-established public information. Company and facility data is NOT
 * duplicated here — it is derived at runtime from the verified company registry
 * (lib/industry/companies.ts) by matching the state on each company site.
 *
 * Every relationship carries a confidence status (see RelationStatus) and a
 * lastVerified date. Figures (investments) are shown as publicly ANNOUNCED and
 * marked "reported" — they are not independently re-verified, and rounded.
 *
 * We seed ONLY states with genuine, verifiable semiconductor activity — never an
 * empty page for every Indian state.
 */
import { COMPANIES, companyPoints } from "@/lib/industry/companies";
import type { Company, GeoPoint, CompanyType } from "@/lib/industry/types";
import type { RelationStatus } from "@/lib/industry/relationships";
import { publishedArticles } from "@/lib/content/articles";

const V = "2026-09-06";

/* --------------------------------- Entities -------------------------------- */

export interface IndiaState {
  slug: string;
  /** Must match the `state` field used on company GeoPoints. */
  name: string;
  tagline: string;
  overview: string;
  whyItMatters: string;
  /** Recent, factual developments (public announcements). */
  developments?: string[];
  /** Article slugs genuinely relevant to this state. */
  insightSlugs?: string[];
}

export type ProjectKind = "fab" | "atmp" | "osat" | "rd";
export type ProjectStatus = "operational" | "under-construction" | "announced";

export interface Project {
  slug: string;
  name: string;
  companySlug: string;
  stateSlug: string;
  city: string;
  kind: ProjectKind;
  status: ProjectStatus;
  summary: string;
  investmentSlug?: string;
  confidence: RelationStatus;
  lastVerified: string;
}

export interface Investment {
  slug: string;
  label: string;
  /** Publicly announced figure, rounded, as reported. */
  amountText: string;
  stateSlug: string;
  projectSlug?: string;
  confidence: RelationStatus;
  lastVerified: string;
}

export interface University {
  slug: string;
  name: string;
  city: string;
  stateSlug: string;
  focus: string;
  confidence: RelationStatus;
}

/* ---------------------------------- States --------------------------------- */

export const INDIA_STATES: IndiaState[] = [
  {
    slug: "gujarat",
    name: "Gujarat",
    tagline: "India's fab and ATMP front-runner.",
    overview:
      "Gujarat hosts India's first announced commercial wafer fab (Tata–PSMC at Dholera) and a cluster of assembly, test, and packaging facilities around Sanand. It has moved fastest from policy to ground-breaking.",
    whyItMatters:
      "Gujarat anchors the front end of India's semiconductor ambitions — the first fab and multiple ATMP plants give the country its initial end-to-end manufacturing footprint.",
    developments: [
      "Tata Electronics' fab at Dholera (with Powerchip/PSMC as technology partner) under construction.",
      "Micron's assembly & test facility at Sanand.",
      "CG Power and Kaynes building ATMP/OSAT plants at Sanand.",
    ],
    insightSlugs: ["india-semiconductor-overview"],
  },
  {
    slug: "karnataka",
    name: "Karnataka",
    tagline: "The chip-design and R&D capital.",
    overview:
      "Bengaluru is India's densest concentration of semiconductor design and R&D — global design centres for logic, EDA, and IP, plus equipment and ATMP players in the wider state.",
    whyItMatters:
      "Design and engineering talent is India's strongest semiconductor asset, and Karnataka is its centre of gravity — the design end of the value chain where India already competes globally.",
    developments: [
      "Design and R&D centres from Intel, NVIDIA, Qualcomm, Arm, Synopsys, Texas Instruments, and Infineon in Bengaluru.",
      "Applied Materials engineering presence in Bengaluru; Kaynes ATMP at Mysuru.",
    ],
  },
  {
    slug: "telangana",
    name: "Telangana",
    tagline: "A fast-growing design hub.",
    overview:
      "Hyderabad is a major semiconductor design and R&D location, with global fabless and IDM design centres and a growing engineering base.",
    whyItMatters:
      "Telangana broadens India's design footprint beyond Bengaluru, adding depth to the country's design-services and IP capability.",
    developments: [
      "Design and R&D centres from AMD, Qualcomm, and Micron in Hyderabad.",
    ],
  },
  {
    slug: "uttar-pradesh",
    name: "Uttar Pradesh",
    tagline: "Design centres and an emerging corridor.",
    overview:
      "Noida and the wider NCR host EDA and design-services R&D, and Uttar Pradesh is positioning itself as an electronics and semiconductor corridor.",
    whyItMatters:
      "Uttar Pradesh extends India's design base into the north and is building toward downstream electronics manufacturing.",
    developments: [
      "Synopsys and Cadence R&D centres in Noida.",
      "HCLTech design-services presence in Noida and Jewar.",
    ],
  },
  {
    slug: "maharashtra",
    name: "Maharashtra",
    tagline: "Corporate base and electronics depth.",
    overview:
      "Maharashtra is home to major corporate headquarters in the ecosystem and a deep electronics and industrial base around Mumbai and Pune.",
    whyItMatters:
      "Maharashtra brings corporate, financial, and downstream-electronics strength that complements the manufacturing and design clusters elsewhere.",
    developments: [
      "Tata Electronics and CG Power corporate bases in Mumbai.",
    ],
  },
  {
    slug: "tamil-nadu",
    name: "Tamil Nadu",
    tagline: "Equipment, test, and electronics manufacturing.",
    overview:
      "Tamil Nadu combines a strong electronics-manufacturing base with semiconductor equipment and test engineering presence around Chennai.",
    whyItMatters:
      "Tamil Nadu links India's large electronics-manufacturing ecosystem to the semiconductor supply chain, including equipment and test capability.",
    developments: [
      "KLA equipment and test engineering presence in Chennai.",
    ],
  },
  {
    slug: "assam",
    name: "Assam",
    tagline: "The Northeast enters the map.",
    overview:
      "Assam hosts Tata Electronics' assembly and test facility at Jagiroad — the first major semiconductor manufacturing investment in India's Northeast.",
    whyItMatters:
      "Jagiroad extends semiconductor manufacturing beyond the western and southern clusters, bringing ATMP capacity and skilled jobs to the Northeast.",
    developments: [
      "Tata Electronics' ATMP facility at Jagiroad under construction.",
    ],
    insightSlugs: ["india-semiconductor-overview"],
  },
];

/* --------------------------------- Projects -------------------------------- */

export const INDIA_PROJECTS: Project[] = [
  {
    slug: "tata-dholera-fab",
    name: "Tata–PSMC wafer fab, Dholera",
    companySlug: "tata-electronics",
    stateSlug: "gujarat",
    city: "Dholera",
    kind: "fab",
    status: "under-construction",
    summary:
      "India's first announced commercial wafer fab, built by Tata Electronics with Powerchip (PSMC) as technology partner.",
    investmentSlug: "tata-dholera-investment",
    confidence: "reported",
    lastVerified: V,
  },
  {
    slug: "micron-sanand-atmp",
    name: "Micron assembly & test, Sanand",
    companySlug: "micron",
    stateSlug: "gujarat",
    city: "Sanand",
    kind: "atmp",
    status: "under-construction",
    summary:
      "Micron's assembly, test, marking, and packaging facility at Sanand — among the first ATMP plants approved under the India Semiconductor Mission.",
    investmentSlug: "micron-sanand-investment",
    confidence: "reported",
    lastVerified: V,
  },
  {
    slug: "tata-jagiroad-atmp",
    name: "Tata ATMP, Jagiroad",
    companySlug: "tata-electronics",
    stateSlug: "assam",
    city: "Jagiroad",
    kind: "atmp",
    status: "under-construction",
    summary:
      "Tata Electronics' assembly and test facility at Jagiroad, Assam — the first major semiconductor plant in India's Northeast.",
    investmentSlug: "tata-jagiroad-investment",
    confidence: "reported",
    lastVerified: V,
  },
  {
    slug: "cg-power-sanand-atmp",
    name: "CG Power ATMP, Sanand",
    companySlug: "cg-power",
    stateSlug: "gujarat",
    city: "Sanand",
    kind: "atmp",
    status: "under-construction",
    summary:
      "CG Power's assembly and test facility at Sanand, developed with Renesas and Stars Microelectronics as partners.",
    investmentSlug: "cg-power-sanand-investment",
    confidence: "reported",
    lastVerified: V,
  },
  {
    slug: "kaynes-sanand-osat",
    name: "Kaynes OSAT, Sanand",
    companySlug: "kaynes",
    stateSlug: "gujarat",
    city: "Sanand",
    kind: "osat",
    status: "under-construction",
    summary:
      "Kaynes Technology's outsourced assembly and test facility at Sanand, approved under the India Semiconductor Mission.",
    investmentSlug: "kaynes-sanand-investment",
    confidence: "reported",
    lastVerified: V,
  },
];

/* ------------------------------- Investments ------------------------------- */
// Publicly ANNOUNCED figures, rounded, as reported. Not independently verified.

export const INDIA_INVESTMENTS: Investment[] = [
  { slug: "tata-dholera-investment", label: "Tata–PSMC fab, Dholera", amountText: "≈ ₹91,000 crore", stateSlug: "gujarat", projectSlug: "tata-dholera-fab", confidence: "reported", lastVerified: V },
  { slug: "tata-jagiroad-investment", label: "Tata ATMP, Jagiroad", amountText: "≈ ₹27,000 crore", stateSlug: "assam", projectSlug: "tata-jagiroad-atmp", confidence: "reported", lastVerified: V },
  { slug: "micron-sanand-investment", label: "Micron ATMP, Sanand", amountText: "≈ ₹22,500 crore (total, incl. incentives)", stateSlug: "gujarat", projectSlug: "micron-sanand-atmp", confidence: "reported", lastVerified: V },
  { slug: "cg-power-sanand-investment", label: "CG Power ATMP, Sanand", amountText: "≈ ₹7,600 crore", stateSlug: "gujarat", projectSlug: "cg-power-sanand-atmp", confidence: "reported", lastVerified: V },
  { slug: "kaynes-sanand-investment", label: "Kaynes OSAT, Sanand", amountText: "≈ ₹3,300 crore", stateSlug: "gujarat", projectSlug: "kaynes-sanand-osat", confidence: "reported", lastVerified: V },
];

/* ------------------------------- Universities ------------------------------ */
// Established institutions with recognised micro/nano-electronics research.

export const INDIA_UNIVERSITIES: University[] = [
  { slug: "iisc-bengaluru", name: "Indian Institute of Science (IISc)", city: "Bengaluru", stateSlug: "karnataka", focus: "Centre for Nano Science & Engineering; micro/nano-electronics research and fabrication.", confidence: "reported" },
  { slug: "iit-bombay", name: "IIT Bombay", city: "Mumbai", stateSlug: "maharashtra", focus: "IIT Bombay Nanofabrication Facility (IITBNF); microelectronics research.", confidence: "reported" },
  { slug: "iit-madras", name: "IIT Madras", city: "Chennai", stateSlug: "tamil-nadu", focus: "VLSI and microelectronics research.", confidence: "reported" },
  { slug: "iit-hyderabad", name: "IIT Hyderabad", city: "Hyderabad", stateSlug: "telangana", focus: "VLSI design and semiconductor research.", confidence: "reported" },
];

/* --------------------------------- Helpers --------------------------------- */

const STATE_BY_SLUG = new Map(INDIA_STATES.map((s) => [s.slug, s]));
const STATE_SLUG_BY_NAME = new Map(INDIA_STATES.map((s) => [s.name, s.slug]));

export function getState(slug: string): IndiaState | undefined {
  return STATE_BY_SLUG.get(slug);
}

export function stateSlugForName(name: string | undefined): string | undefined {
  return name ? STATE_SLUG_BY_NAME.get(name) : undefined;
}

export interface Facility {
  company: Company;
  point: GeoPoint;
}

/** All India facilities (company sites located in India). */
export function indiaFacilities(): Facility[] {
  const out: Facility[] = [];
  for (const c of COMPANIES) {
    for (const p of companyPoints(c)) {
      if (p.countryCode === "IN") out.push({ company: c, point: p });
    }
  }
  return out;
}

export function facilitiesForState(stateSlug: string): Facility[] {
  const name = getState(stateSlug)?.name;
  if (!name) return [];
  return indiaFacilities().filter((f) => f.point.state === name);
}

/** Companies with at least one facility in the state (deduped, sorted). */
export function companiesForState(stateSlug: string): Company[] {
  const seen = new Map<string, Company>();
  for (const f of facilitiesForState(stateSlug)) seen.set(f.company.slug, f.company);
  return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function facilitiesOfKind(facilities: Facility[], kinds: GeoPoint["kind"][]): Facility[] {
  const set = new Set(kinds);
  return facilities.filter((f) => set.has(f.point.kind));
}

const SUPPLIER_TYPES = new Set<CompanyType>(["equipment", "materials", "chemicals", "silicon-wafers", "testing", "distributor"]);

/** Companies in the state whose business type makes them part of the supply base. */
export function suppliersForState(stateSlug: string): Company[] {
  return companiesForState(stateSlug).filter((c) => c.types.some((t) => SUPPLIER_TYPES.has(t)));
}

/** Startup-type companies in the state (none seeded yet → honest empty). */
export function startupsForState(stateSlug: string): Company[] {
  return companiesForState(stateSlug).filter((c) => c.types.includes("startup"));
}

export function projectsForState(stateSlug: string): Project[] {
  return INDIA_PROJECTS.filter((p) => p.stateSlug === stateSlug);
}

export function investmentsForState(stateSlug: string): Investment[] {
  return INDIA_INVESTMENTS.filter((i) => i.stateSlug === stateSlug);
}

export function universitiesForState(stateSlug: string): University[] {
  return INDIA_UNIVERSITIES.filter((u) => u.stateSlug === stateSlug);
}

export function insightsForState(stateSlug: string): { title: string; slug: string }[] {
  const slugs = new Set(getState(stateSlug)?.insightSlugs ?? []);
  if (slugs.size === 0) return [];
  return publishedArticles()
    .filter((a) => slugs.has(a.slug))
    .map((a) => ({ title: a.title, slug: a.slug }));
}

/* ------------------------------- Nationwide -------------------------------- */

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  operational: "Operational",
  "under-construction": "Under construction",
  announced: "Announced",
};

/** Count of India facilities by category, for the landing dashboard. */
export function indiaCounts() {
  const f = indiaFacilities();
  return {
    facilities: f.length,
    fabs: facilitiesOfKind(f, ["fab"]).length,
    atmpOsat: facilitiesOfKind(f, ["atmp", "osat"]).length,
    designCentres: facilitiesOfKind(f, ["rd"]).length,
    companies: new Set(f.map((x) => x.company.slug)).size,
    states: INDIA_STATES.length,
    projects: INDIA_PROJECTS.length,
  };
}
