/**
 * The honest relationship / discovery layer for companies & suppliers.
 *
 * Phase 6 principle: we DO NOT fabricate company relationships. Edges shown in
 * the UI are one of two honest kinds:
 *   1. STRUCTURAL edges derived from verified company facts (a company's `types`
 *      place it in a supply-chain stage; its `relatedConcepts` link to insights).
 *      These are "verified" because they follow directly from the seeded facts.
 *   2. CURATED edges explicitly recorded in the registry (`relatedCompanies`).
 *      These are "reported".
 * Everything we cannot yet substantiate (specific vendor partnerships,
 * investments, named supplier contracts) is surfaced as "researching" — the slot
 * exists in the IA, but no data is invented to fill it.
 *
 * Every relationship is designed to eventually carry { source, status,
 * lastVerified }; `RelationStatus` is that confidence vocabulary.
 */
import { COMPANIES, companiesForTypes } from "./companies";
import type { Company, CompanyType } from "./types";
import { SUPPLY_STAGES, SEGMENTS, type SupplyStage } from "@/lib/knowledge/supply-chain";
import { publishedArticles } from "@/lib/content/articles";

/* ------------------------------ Confidence model ------------------------------ */

export type RelationStatus = "verified" | "reported" | "researching" | "unknown";

export const STATUS_META: Record<
  RelationStatus,
  { label: string; description: string; className: string }
> = {
  verified: {
    label: "Verified",
    description: "Derived from verified public facts in the registry.",
    className: "bg-success/10 text-success",
  },
  reported: {
    label: "Reported",
    description: "Curated from public reporting; not independently re-verified.",
    className: "bg-brand/10 text-brand",
  },
  researching: {
    label: "Researching",
    description: "The connection slot exists; we are still compiling verified data.",
    className: "bg-muted text-muted-foreground",
  },
  unknown: {
    label: "Unknown",
    description: "No reliable public information found yet.",
    className: "bg-muted text-muted-foreground",
  },
};

/* --------------------------- Company → supply chain --------------------------- */

/**
 * The supply-chain stages a company participates in, derived from its `types`
 * (a stage lists the company types that operate in it). Verified structural edge.
 */
export function supplyStagesForCompany(company: Company): SupplyStage[] {
  const wanted = new Set(company.types);
  return SUPPLY_STAGES.filter((s) => s.companyTypes.some((t) => wanted.has(t))).sort(
    (a, b) => a.order - b.order,
  );
}

// Reverse map: company type → the supply-chain segment(s) it belongs to.
const TYPE_TO_SEGMENTS = (() => {
  const map = new Map<CompanyType, Set<string>>();
  for (const stage of SUPPLY_STAGES) {
    for (const t of stage.companyTypes) {
      if (!map.has(t)) map.set(t, new Set());
      map.get(t)!.add(stage.segment);
    }
  }
  return map;
})();

/** The supply-chain segments a company spans (verified structural edge). */
export function segmentsForCompany(company: Company): { id: string; label: string }[] {
  const ids = new Set<string>();
  for (const t of company.types) {
    for (const seg of TYPE_TO_SEGMENTS.get(t) ?? []) ids.add(seg);
  }
  return SEGMENTS.filter((s) => ids.has(s.id)).map((s) => ({ id: s.id, label: s.label }));
}

/* ------------------------------- Company → insights --------------------------- */

/** Published insights referencing any concept this company is linked to. */
export function insightsForCompany(company: Company): { title: string; slug: string }[] {
  const concepts = new Set((company.relatedConcepts ?? []).map((c) => c.slug));
  if (concepts.size === 0) return [];
  return publishedArticles()
    .filter((a) => (a.relatedConcepts ?? []).some((rc) => concepts.has(rc.slug)))
    .slice(0, 4)
    .map((a) => ({ title: a.title, slug: a.slug }));
}

/* ------------------------------ Supplier taxonomy ----------------------------- */

export interface SupplierCategory {
  key: string;
  label: string;
  description: string;
  /** Registry company types that genuinely represent this category (may be empty). */
  companyTypes: CompanyType[];
  /** Which supply segment this category primarily feeds. */
  feedsSegment: string;
}

/**
 * The supplier discovery taxonomy. Categories are mapped to registry company
 * types ONLY where a seeded company genuinely fits; the rest are left empty on
 * purpose and render as "Researching" — never padded with invented vendors.
 */
export const SUPPLIER_CATEGORIES: SupplierCategory[] = [
  { key: "equipment", label: "Equipment", description: "Lithography, deposition, etch, implant, and inspection tools.", companyTypes: ["equipment"], feedsSegment: "tooling" },
  { key: "chemicals", label: "Chemicals", description: "Process chemicals, slurries, photoresists, and cleaning agents.", companyTypes: ["chemicals"], feedsSegment: "inputs" },
  { key: "gases", label: "Gases", description: "Bulk and specialty process gases.", companyTypes: [], feedsSegment: "inputs" },
  { key: "wafers", label: "Wafers", description: "Polished silicon and compound-semiconductor wafers.", companyTypes: ["silicon-wafers"], feedsSegment: "inputs" },
  { key: "substrates", label: "Substrates", description: "Package substrates and interposers.", companyTypes: [], feedsSegment: "back-end" },
  { key: "packaging-materials", label: "Packaging materials", description: "Leadframes, encapsulants, bonding wire, and molding compounds.", companyTypes: ["materials"], feedsSegment: "back-end" },
  { key: "cleanroom", label: "Cleanroom", description: "Cleanroom construction, filtration, and environmental control.", companyTypes: [], feedsSegment: "front-end" },
  { key: "testing", label: "Testing", description: "Test equipment, probe cards, and test services.", companyTypes: ["testing"], feedsSegment: "back-end" },
  { key: "automation", label: "Automation", description: "Material handling, robotics, and factory automation.", companyTypes: [], feedsSegment: "front-end" },
  { key: "precision-engineering", label: "Precision engineering", description: "Precision machined parts and sub-assemblies for tools.", companyTypes: [], feedsSegment: "tooling" },
  { key: "industrial-gases", label: "Industrial gases", description: "Nitrogen, oxygen, hydrogen, and abatement.", companyTypes: [], feedsSegment: "inputs" },
  { key: "water-treatment", label: "Water treatment", description: "Ultra-pure water generation and recycling.", companyTypes: [], feedsSegment: "front-end" },
  { key: "hvac", label: "HVAC", description: "Temperature, humidity, and airflow systems.", companyTypes: [], feedsSegment: "front-end" },
  { key: "esd", label: "ESD", description: "Electrostatic-discharge control and protection.", companyTypes: [], feedsSegment: "front-end" },
  { key: "metrology", label: "Metrology", description: "Dimensional, defect, and in-line measurement systems.", companyTypes: [], feedsSegment: "front-end" },
  { key: "logistics", label: "Logistics", description: "Specialized transport, bonded warehousing, and distribution.", companyTypes: ["distributor"], feedsSegment: "downstream" },
  { key: "maintenance", label: "Maintenance", description: "Tool maintenance, refurbishment, and spares.", companyTypes: [], feedsSegment: "front-end" },
  { key: "engineering-services", label: "Engineering services", description: "Process, facility, and ramp engineering support.", companyTypes: [], feedsSegment: "front-end" },
  { key: "consulting", label: "Consulting", description: "Strategy, market, and technical advisory.", companyTypes: [], feedsSegment: "downstream" },
];

const SUPPLIER_BY_KEY = new Map(SUPPLIER_CATEGORIES.map((c) => [c.key, c]));

export function getSupplierCategory(key: string): SupplierCategory | undefined {
  return SUPPLIER_BY_KEY.get(key);
}

/** Real companies that fit a supplier category (empty where none are seeded). */
export function companiesForSupplierCategory(cat: SupplierCategory): Company[] {
  if (cat.companyTypes.length === 0) return [];
  return companiesForTypes(cat.companyTypes);
}

/** Status of a supplier category: verified if it has real companies, else researching. */
export function supplierCategoryStatus(cat: SupplierCategory): RelationStatus {
  return companiesForSupplierCategory(cat).length > 0 ? "verified" : "researching";
}

/** Supplier categories whose companies sit in the registry (populated first). */
export function populatedSupplierCategories(): SupplierCategory[] {
  return SUPPLIER_CATEGORIES.filter((c) => companiesForSupplierCategory(c).length > 0);
}

export function researchingSupplierCategories(): SupplierCategory[] {
  return SUPPLIER_CATEGORIES.filter((c) => companiesForSupplierCategory(c).length === 0);
}

/**
 * Supplier categories relevant to a company, by matching the segment(s) the
 * company spans to the segment each supplier category feeds. This is a
 * structural "these categories supply this part of the chain" link — NOT a
 * claim of a specific verified vendor relationship.
 */
export function relatedSupplierCategories(company: Company): SupplierCategory[] {
  const segs = new Set(segmentsForCompany(company).map((s) => s.id));
  // A company in design/downstream only is not meaningfully "supplied" here.
  return SUPPLIER_CATEGORIES.filter((c) => segs.has(c.feedsSegment));
}

/* ------------------------- Directory facet derivations ------------------------ */

/** Distinct cities across all company points, alphabetically. */
export function presentCities(): string[] {
  const set = new Set<string>();
  for (const c of COMPANIES) {
    set.add(c.hq.city);
    for (const s of c.sites ?? []) set.add(s.city);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Distinct capabilities (processes companies list), alphabetically. */
export function presentCapabilities(): string[] {
  const set = new Set<string>();
  for (const c of COMPANIES) (c.processes ?? []).forEach((p) => set.add(p));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
