/**
 * Core domain data models for Semitree.
 *
 * These describe *content* and *catalogue* entities (as opposed to the
 * calculation engine's runtime contract in src/lib/calculations). They are
 * plain, serialisable TypeScript interfaces so they can back MDX frontmatter,
 * static JSON, or a database later without change.
 *
 * The "Future domain models" block at the bottom is designed-for-but-not-built
 * (accounts, workspaces, saved work) per the product spec. Nothing in Phase 01
 * depends on them; they exist so the schema is coherent from the start.
 */

import type { CalculationCategory, Tier } from "@/lib/calculations/types";

/** Shared category taxonomy across tools, lessons, resources. */
export interface Category {
  slug: string;
  name: string;
  description?: string;
}

/**
 * A Tool is the *content* wrapper around a calculator: the catalogue entry that
 * appears in listings and search. It links to the engine by `calculationSlug`.
 */
export interface Tool {
  slug: string;
  name: string;
  summary: string;
  category: CalculationCategory;
  tier: Tier;
  /** Slug of the CalculationDefinition this tool renders (once built). */
  calculationSlug: string;
  /** Learn concepts this tool applies — the tool→learn link. */
  relatedConcepts?: string[];
  /** Slugs of related tools — the tool↔tool graph (data-driven, see tools.ts). */
  relatedTools?: string[];
}

/** A Concept is an atomic idea in the curriculum (e.g. "Reynolds number"). */
export interface Concept {
  slug: string;
  title: string;
  summary: string;
  /** Tools that let you compute with this concept — the learn→tool link. */
  relatedTools?: string[];
  relatedConcepts?: string[];
}

/** A Lesson is a module within a learning level; body authored as MDX. */
export interface Lesson {
  slug: string;
  title: string;
  /** Curriculum level, 0–5 per the spec. */
  level: number;
  order: number;
  summary: string;
  /** Concepts covered, in order. */
  concepts?: string[];
  /** Tools referenced from the lesson. */
  relatedTools?: string[];
  /** Estimated reading/working time in minutes. */
  estimatedMinutes?: number;
}

export type ResourceKind =
  | "paper"
  | "book"
  | "course"
  | "video"
  | "software"
  | "cheatsheet"
  | "article";

/** A Resource is an external or downloadable reference in the Learn/Hub layer. */
export interface Resource {
  slug: string;
  title: string;
  kind: ResourceKind;
  url?: string;
  author?: string;
  description?: string;
  relatedConcepts?: string[];
}

export type DirectoryEntryType =
  | "foundry"
  | "fabrication-service"
  | "supplier"
  | "equipment"
  | "software"
  | "designer"
  | "course"
  | "journal"
  | "conference";

/**
 * A DirectoryEntry is a listing in the Hub directory.
 *
 * `verified` / `lastVerified` support a verification workflow; `featured` is
 * reserved for future featured / paid placement (monetization NOT implemented).
 */
export interface DirectoryEntry {
  id: string;
  name: string;
  type: DirectoryEntryType;
  description?: string;
  website?: string;
  location?: string;
  services?: string[];
  categories?: string[];
  verified: boolean;
  lastVerified?: string; // ISO-8601 date
  /** Reserved for future featured / paid placement. Not used yet. */
  featured?: boolean;
}

/* ------------------------------------------------------------------------- *
 * Future domain models — designed for, NOT implemented in Phase 01.
 * These support accounts, saved calculations, projects and notes. Do not wire
 * these into the app yet; they document the intended schema. See docs/DATA_MODEL.md.
 * ------------------------------------------------------------------------- */

export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  memberIds?: string[];
  createdAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/** A saved run of a calculator: inputs + a snapshot of results. */
export interface Calculation {
  id: string;
  projectId?: string;
  calculationSlug: string;
  inputs: Record<string, number | string>;
  results: Record<string, number | string>;
  createdAt: string;
}

export interface Note {
  id: string;
  projectId?: string;
  authorId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedResource {
  id: string;
  userId: string;
  resourceSlug: string;
  savedAt: string;
}
