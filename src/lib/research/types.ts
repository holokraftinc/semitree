/**
 * Research Hub — data model.
 *
 * NO FABRICATION (hard rule): never invent papers, authors, institutions, or
 * URLs. Categories that can only be populated with specific, individually-sourced
 * items (papers, patents, researchers) are left EMPTY and render honest empty
 * states. The categories that are seeded (journals, conferences, universities,
 * research labs) contain only real, well-established entities, and a `url` is set
 * ONLY where the canonical official domain is known — otherwise it is omitted,
 * never guessed. `verified` marks entries confirmed as real, established entities.
 *
 * Research *topics* are factual technology/research areas (not papers), and are
 * the interlinking core that connects research to the rest of Semitree
 * (concepts, processes, tools, companies) per the "Research → Learning" goal.
 */

export type ResourceType =
  | "paper"
  | "patent"
  | "journal"
  | "conference"
  | "lab"
  | "university"
  | "researcher";

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  paper: "Papers",
  patent: "Patents",
  journal: "Journals",
  conference: "Conferences",
  lab: "Research labs",
  university: "Universities",
  researcher: "Researchers",
};

export interface SourceRef {
  label: string;
  url?: string;
}

export interface ResearchResource {
  id: string;
  type: ResourceType;
  title: string;
  description?: string;
  author?: string;
  organization?: string;
  url?: string;
  /** ISO date (YYYY-MM-DD) — for papers/patents; usually absent for institutions. */
  publicationDate?: string;
  /** Primary research-topic slug. */
  topic?: string;
  technology?: string[];
  tags?: string[];
  /** Confirmed as a real, established entity. */
  verified: boolean;
  source?: SourceRef;
  /** Interlinks (never fabricated). */
  relatedConcepts?: { label: string; slug: string }[];
  relatedProcesses?: string[];
  relatedCompanies?: string[];
  relatedTools?: string[];
  /** ISO date the entry was compiled/checked. */
  lastVerified?: string;
}

/**
 * A research topic — a factual technology/research area. Topics carry the facet
 * tags used by discovery (technology / device / material / application) and the
 * interlinks used by "Research → Learning".
 */
export interface ResearchTopic {
  slug: string;
  name: string;
  summary: string;
  description: string[];

  technologies: string[];
  devices: string[];
  materials: string[];
  applications: string[];

  relatedConcepts: { label: string; slug: string }[];
  relatedProcesses: string[];
  relatedTools: string[];
  relatedCompanies: string[];

  /** Open, factual research directions (not citations). */
  openQuestions: string[];
}

/* -------------------------------------------------------------------------- */
/* FUTURE ARCHITECTURE (reserved — not implemented; requires accounts)         */
/*                                                                            */
/* These interfaces reserve space for the roadmap: paper alerts, saved papers, */
/* research collections, citation management, and researcher profiles. They    */
/* are intentionally unused until account infrastructure exists.               */
/* -------------------------------------------------------------------------- */

export interface SavedPaper {
  resourceId: string;
  savedAt: string;
}

export interface ResearchCollection {
  id: string;
  name: string;
  resourceIds: string[];
}

export interface PaperAlert {
  id: string;
  /** Facet/topic query the alert watches. */
  query: Record<string, string>;
}

export interface Citation {
  resourceId: string;
  /** Formatted citation strings, keyed by style (e.g. "ieee", "apa"). */
  formats: Record<string, string>;
}

export interface ResearcherProfile {
  id: string;
  name: string;
  organization?: string;
  topics?: string[];
}
