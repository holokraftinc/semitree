/**
 * Semiconductor Industry Directory — data model.
 *
 * EDITORIAL RULE (see also semi-lessons.ts / manufacturing.ts): company
 * information is NOT fabricated. Only well-established public facts are seeded —
 * name, business type, HQ city/country, official website, a high-level factual
 * description, and city-level coordinates. Uncertain or fast-changing fields
 * (current leadership, exact facility addresses, hiring URLs) are left EMPTY
 * rather than guessed. Every point is placed at city precision unless a more
 * accurate site location is genuinely known; the UI states this. `lastVerified`
 * records when the entry was compiled from public sources.
 */

/** The company / entity types the directory supports. */
export type CompanyType =
  | "fabless"
  | "foundry"
  | "idm"
  | "osat"
  | "atmp"
  | "eda"
  | "equipment"
  | "materials"
  | "chemicals"
  | "silicon-wafers"
  | "packaging"
  | "testing"
  | "design-services"
  | "research"
  | "startup"
  | "distributor";

export const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  fabless: "Fabless",
  foundry: "Foundry",
  idm: "IDM",
  osat: "OSAT",
  atmp: "ATMP",
  eda: "EDA",
  equipment: "Semiconductor equipment",
  materials: "Materials",
  chemicals: "Chemicals",
  "silicon-wafers": "Silicon / wafers",
  packaging: "Packaging",
  testing: "Testing",
  "design-services": "Design services",
  research: "Research",
  startup: "Semiconductor startup",
  distributor: "Distributor",
};

/** What a mapped point represents. */
export type SiteKind = "hq" | "fab" | "atmp" | "osat" | "rd" | "office";

export const SITE_KIND_LABELS: Record<SiteKind, string> = {
  hq: "Headquarters",
  fab: "Fab",
  atmp: "ATMP / packaging",
  osat: "OSAT",
  rd: "R&D / design center",
  office: "Office",
};

/**
 * A geographic point. `precision` is honest about how accurately it is placed:
 * "city" means the marker sits on the city centroid, not an exact address.
 */
export interface GeoPoint {
  /** Short label, e.g. "HQ" or "Sanand ATMP". */
  label: string;
  kind: SiteKind;
  city: string;
  /** State/province — used to bucket the India map. */
  state?: string;
  country: string;
  /** ISO 3166-1 alpha-2, e.g. "US", "TW", "IN". */
  countryCode: string;
  lat: number;
  long: number;
  precision: "city" | "site";
}

export interface LeadershipEntry {
  name: string;
  role: string;
}

export interface CompanyLink {
  label: string;
  url: string;
}

export interface Company {
  slug: string;
  name: string;
  types: CompanyType[];
  website?: string;

  /** Headquarters — always present. */
  hq: GeoPoint;
  /** Additional locations (fabs, ATMP, design centers). */
  sites?: GeoPoint[];

  description: string;

  technologies?: string[];
  products?: string[];
  processes?: string[];
  facilities?: string[];
  leadership?: LeadershipEntry[];
  founders?: string[];

  linkedin?: string;
  hiringUrl?: string;
  /** Factual research themes/areas — not fabricated citations. */
  research?: string[];

  /** Related company slugs. */
  relatedCompanies?: string[];

  /* ---- Company → Knowledge connections ---- */
  /** Manufacturing process slugs (/manufacturing/<slug>). */
  relatedProcesses?: string[];
  /** Semiconductor tool slugs (/semiconductors/tools/<slug>). */
  relatedTools?: string[];
  /** Lesson slugs (/semiconductors/learn/<slug>). */
  relatedConcepts?: { label: string; slug: string }[];

  /** Provenance — where the facts come from (typically the company itself). */
  sources?: CompanyLink[];
  /** ISO date (YYYY-MM-DD) the entry was compiled/checked. */
  lastVerified?: string;
}
