/**
 * Server-side assembly of the Supply Chain Explorer view model.
 *
 * Everything here is derived from verified data — the supply-chain registry, the
 * company registry, and the India ecosystem — or authored editorial detail
 * (lib/knowledge/supply-chain-detail.ts). No fabricated relationships: company
 * links come from company types, "recent developments" come from real announced
 * India projects, and gaps/opportunities are left to the opportunities hub
 * rather than invented per stage.
 */
import {
  getStage,
  stageNeighbors,
  stageEquipment,
  stageMaterials,
  SEGMENTS,
  type SegmentId,
} from "./supply-chain";
import { getStageDetail } from "./supply-chain-detail";
import { companiesForTypes } from "@/lib/industry/companies";
import type { CompanyType } from "@/lib/industry/types";
import { INDIA_PROJECTS, getState, PROJECT_STATUS_LABELS } from "@/lib/india/ecosystem";

/** The core flow, in the exact order the spec lays out (display label → stage slug). */
export const CORE_FLOW: { label: string; slug: string }[] = [
  { label: "Design", slug: "chip-design" },
  { label: "EDA / IP", slug: "eda" },
  { label: "Equipment", slug: "semiconductor-equipment" },
  { label: "Materials", slug: "raw-materials" },
  { label: "Wafer", slug: "wafer-manufacturing" },
  { label: "Fabrication", slug: "fab" },
  { label: "Packaging", slug: "packaging" },
  { label: "Testing", slug: "testing" },
  { label: "Electronics", slug: "electronics" },
  { label: "End markets", slug: "end-markets" },
];

export interface EntityLink {
  name: string;
  slug: string;
}

export interface StageView {
  label: string;
  slug: string;
  position: number;
  segmentLabel: string;
  tagline: string;
  whatHappens: string;
  whyItMatters?: string;
  inputs: string[];
  outputs: string[];
  technologies: string[];
  equipment: string[];
  materials: string[];
  companies: EntityLink[];
  indianCompanies: EntityLink[];
  suppliers: EntityLink[];
  relatedStages: EntityLink[];
  /** Real, announced India developments relevant to this stage. */
  developments: string[];
  href: string;
}

// Which supplier company types genuinely feed each segment (honest, structural).
const SUPPLIER_TYPES_BY_SEGMENT: Record<SegmentId, CompanyType[]> = {
  inputs: ["equipment", "materials", "chemicals", "silicon-wafers"],
  design: [],
  tooling: ["materials", "chemicals"],
  "front-end": ["equipment", "materials", "chemicals", "silicon-wafers"],
  "back-end": ["equipment", "materials", "testing"],
  downstream: [],
};

// Which India project kinds count as "recent developments" for each stage slug.
const DEV_PROJECT_KINDS: Record<string, ("fab" | "atmp" | "osat" | "rd")[]> = {
  fab: ["fab"],
  "wafer-manufacturing": ["fab"],
  packaging: ["atmp", "osat"],
  testing: ["atmp", "osat"],
  "chip-design": ["rd"],
  eda: ["rd"],
};

function developmentsForStage(slug: string): string[] {
  const kinds = DEV_PROJECT_KINDS[slug];
  if (!kinds) return [];
  const set = new Set(kinds);
  return INDIA_PROJECTS.filter((p) => set.has(p.kind)).map((p) => {
    const st = getState(p.stateSlug);
    return `${p.name} — ${PROJECT_STATUS_LABELS[p.status]}${st ? ` (${st.name})` : ""}`;
  });
}

const toLink = (c: { name: string; slug: string }): EntityLink => ({ name: c.name, slug: c.slug });

export function buildStageViews(): StageView[] {
  return CORE_FLOW.map((entry, i) => {
    const stage = getStage(entry.slug);
    if (!stage) throw new Error(`Supply chain core flow references missing stage: ${entry.slug}`);

    const detail = getStageDetail(entry.slug);
    const segmentLabel = SEGMENTS.find((s) => s.id === stage.segment)?.label ?? "";
    const companies = companiesForTypes(stage.companyTypes);
    const indianCompanies = companies.filter((c) => c.hq.countryCode === "IN");
    const supplierTypes = SUPPLIER_TYPES_BY_SEGMENT[stage.segment];
    const suppliers = supplierTypes.length > 0 ? companiesForTypes(supplierTypes) : [];

    const { prev, next } = stageNeighbors(stage.slug);
    const relatedStages = [prev, next].filter(Boolean).map((s) => ({ name: s!.name, slug: s!.slug }));

    return {
      label: entry.label,
      slug: stage.slug,
      position: i + 1,
      segmentLabel,
      tagline: stage.tagline,
      whatHappens: stage.whatHappens,
      whyItMatters: detail?.whyItMatters,
      inputs: detail?.inputs ?? [],
      outputs: detail?.outputs ?? [],
      technologies: stage.technologies,
      equipment: stageEquipment(stage),
      materials: stageMaterials(stage),
      companies: companies.map(toLink),
      indianCompanies: indianCompanies.map(toLink),
      suppliers: suppliers.map(toLink),
      relatedStages,
      developments: developmentsForStage(stage.slug),
      href: `/supply-chain/${stage.slug}`,
    };
  });
}

/* ------------------------------ Relationship view ----------------------------- */

export interface RelationStep {
  lens: string;
  name: string;
  href: string;
  detail: string;
}

/**
 * A single, fully real worked chain that demonstrates cross-entity traversal:
 * Equipment → process → material → manufacturer → facility → state → project →
 * investment → insight. Every node links to a real page.
 */
export const RELATIONSHIP_CHAIN: RelationStep[] = [
  { lens: "Equipment", name: "Lithography scanner", href: "/supply-chain/semiconductor-equipment", detail: "A lithography tool patterns circuitry onto the wafer — the equipment stage of the chain." },
  { lens: "Process", name: "Lithography", href: "/manufacturing/lithography", detail: "The scanner runs the lithography process, exposing a pattern into light-sensitive film." },
  { lens: "Material", name: "Photoresist", href: "/manufacturing/photoresist", detail: "Lithography needs photoresist — a material a supplier like Shin-Etsu produces." },
  { lens: "Manufacturer", name: "Tata Electronics", href: "/industry/companies/tata-electronics", detail: "A fab operator runs these processes and materials at scale to make chips." },
  { lens: "Facility", name: "Dholera fab", href: "/industry/companies/tata-electronics", detail: "That manufacturer runs a specific facility — Tata's wafer fab at Dholera." },
  { lens: "State", name: "Gujarat", href: "/india/states/gujarat", detail: "The facility sits in a state — Gujarat, India's fab and ATMP front-runner." },
  { lens: "Project", name: "Tata–PSMC fab, Dholera", href: "/india/states/gujarat", detail: "The facility is an announced project tracked in the India ecosystem." },
  { lens: "Investment", name: "≈ ₹91,000 crore", href: "/india#investments-h", detail: "Each project carries announced investment — reported, rounded, not re-verified." },
  { lens: "Insight", name: "India's semiconductor push", href: "/articles/india-semiconductor-overview", detail: "And it all connects back to the insights explaining why this matters." },
];
