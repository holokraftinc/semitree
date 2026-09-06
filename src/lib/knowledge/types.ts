/**
 * Knowledge entity + relationship model — domain-generic.
 *
 * One reusable set of entity types serves EVERY domain (Semiconductors,
 * Microfluidics, …). Domains differ only in *data*, never in UI or types. This
 * is the structured, relational content model behind the knowledge graph — no
 * graph database; relationships are slug references resolved by helpers.
 *
 * Relationship convention: an entity references others by **slug** (arrays).
 * `graph.ts` resolves these and derives reverse links, so an edge is declared
 * once and traversed both ways. Empty arrays are the norm until verified content
 * is added (no fabricated companies, technologies, or research).
 */

export type KnowledgeDomainId = "semiconductors" | "microfluidics";

/** Fields shared by every knowledge entity. */
export interface EntityBase {
  slug: string;
  domainId: KnowledgeDomainId;
  title: string;
  summary?: string;
}

/** Top-level area within a domain (e.g. "Lithography", "Packaging"). */
export interface Category extends EntityBase {
  order?: number;
  /** Subcategory slugs, in display order. */
  subcategories?: string[];
}

/** A child of a category (e.g. "EUV" under "Lithography"). */
export interface Subcategory extends EntityBase {
  categorySlug: string;
  order?: number;
}

/** An atomic idea. The hub of the knowledge graph. */
export interface Concept extends EntityBase {
  categorySlug?: string;
  subcategorySlug?: string;
  relatedConcepts?: string[];
  relatedLessons?: string[];
  relatedTools?: string[];
  relatedTechnologies?: string[];
  relatedCompanies?: string[];
  relatedProcesses?: string[];
  relatedResources?: string[];
}

/** A grouping of concepts/lessons under a subcategory (a syllabus node). */
export interface Topic extends EntityBase {
  categorySlug?: string;
  subcategorySlug?: string;
  concepts?: string[];
  lessons?: string[];
}

/** A teaching module (authored content lives as MDX/structured body later). */
export interface Lesson extends EntityBase {
  level?: number;
  order?: number;
  concepts?: string[];
  tools?: string[];
}

/** An interactive tool/calculator (physics/logic lives in src/lib/calculations). */
export interface Tool extends EntityBase {
  category?: string;
  calculationSlug?: string;
  concepts?: string[];
}

/** An external or downloadable reference. */
export interface Resource extends EntityBase {
  kind: string;
  url?: string;
  fileUrl?: string;
  concepts?: string[];
}

/** A company in the ecosystem. NEVER fabricated — `verified` gates display. */
export interface Company extends EntityBase {
  verified: boolean;
  segment?: string;
  website?: string;
  location?: string;
  technologies?: string[];
  processes?: string[];
}

/** A technology (e.g. "EUV lithography", "GAA transistor"). */
export interface Technology extends EntityBase {
  categorySlug?: string;
  companies?: string[];
  concepts?: string[];
  processes?: string[];
}

/** A manufacturing/process step (e.g. "Plasma etch"). */
export interface Process extends EntityBase {
  categorySlug?: string;
  equipment?: string[];
  materials?: string[];
  concepts?: string[];
}

/** A piece of equipment/tooling used by processes. */
export interface Equipment extends EntityBase {
  companies?: string[];
  processes?: string[];
}

/** A material/chemical used by processes. */
export interface Material extends EntityBase {
  processes?: string[];
}

/** An end application (e.g. "AI accelerators", "Automotive"). */
export interface Application extends EntityBase {
  technologies?: string[];
  concepts?: string[];
}

/** A research item (paper/review). Research → Concept. */
export interface Research extends EntityBase {
  url?: string;
  concepts?: string[];
}

/** The complete content set for one domain. All arrays are data-only. */
export interface KnowledgeBase {
  domainId: KnowledgeDomainId;
  categories: Category[];
  subcategories: Subcategory[];
  concepts: Concept[];
  topics: Topic[];
  lessons: Lesson[];
  tools: Tool[];
  resources: Resource[];
  companies: Company[];
  technologies: Technology[];
  processes: Process[];
  equipment: Equipment[];
  materials: Material[];
  applications: Application[];
  research: Research[];
}

/** The entity kinds, for generic traversal/tooling. */
export type EntityKind =
  | "category"
  | "subcategory"
  | "concept"
  | "topic"
  | "lesson"
  | "tool"
  | "resource"
  | "company"
  | "technology"
  | "process"
  | "equipment"
  | "material"
  | "application"
  | "research";
