/**
 * Knowledge-graph traversal.
 *
 * The graph has four node types — Concept, Lesson, Tool, Resource — connected by
 * edges that are declared exactly once in the data:
 *   - lesson → concept   (LessonContent.relatedConceptSlugs)
 *   - lesson → tool      (LessonContent.relatedToolSlugs / tryItToolSlug)
 *   - tool   → concept   (Tool.relatedConcepts)
 *   - tool   → tool      (Tool.relatedTools)
 *   - resource → concept (Resource.relatedConcepts)
 *   - concept → concept  (GlossaryTerm.relatedConceptSlugs)
 *
 * This module traverses those edges in BOTH directions so nothing is duplicated.
 * A "related lessons" list for a concept, for example, is derived by finding the
 * lessons that reference it — not stored again on the concept.
 */
import { GLOSSARY, getConcept, conceptTitle } from "./glossary";
import { LESSONS, type LessonContent } from "./lessons";
import { TOOLS, getTool } from "./tools";
import { sampleResources } from "./samples";
import type { Tool, Resource } from "./types";

export type GraphLink = { label: string; href: string };

/* ----------------------------- Concept → * ------------------------------ */

/** Tools that reference this concept (reverse of Tool.relatedConcepts). */
export function toolsForConcept(conceptSlug: string): Tool[] {
  return TOOLS.filter((t) => t.relatedConcepts?.includes(conceptSlug));
}

/** Lessons that reference this concept (reverse of Lesson.relatedConceptSlugs). */
export function lessonsForConcept(conceptSlug: string): LessonContent[] {
  return LESSONS.filter((l) =>
    l.relatedConceptSlugs?.includes(conceptSlug),
  ).sort((a, b) => a.level - b.level || a.order - b.order);
}

/** Resources that reference this concept (reverse of Resource.relatedConcepts). */
export function resourcesForConcept(conceptSlug: string): Resource[] {
  return sampleResources.filter((r) => r.relatedConcepts?.includes(conceptSlug));
}

/** Neighbouring concepts (concept↔concept edges, made symmetric). */
export function conceptsForConcept(conceptSlug: string): { slug: string; title: string }[] {
  const direct = getConcept(conceptSlug)?.relatedConceptSlugs ?? [];
  // Include concepts that point back at this one, so the graph reads both ways.
  const inbound = GLOSSARY.filter((c) =>
    c.relatedConceptSlugs?.includes(conceptSlug),
  ).map((c) => c.slug);
  const slugs = [...new Set([...direct, ...inbound])].filter(
    (s) => s !== conceptSlug && getConcept(s),
  );
  return slugs.map((slug) => ({ slug, title: conceptTitle(slug) }));
}

/* ------------------------------ link builders --------------------------- */

/** Concept links for a tool (Tool.relatedConcepts → /concepts/<slug>). */
export function getRelatedConceptLinks(toolSlug: string): GraphLink[] {
  const tool = getTool(toolSlug);
  return (tool?.relatedConcepts ?? [])
    .filter((s) => getConcept(s))
    .map((s) => ({ label: conceptTitle(s), href: `/concepts/${s}` }));
}

/** Concept links for a lesson (Lesson.relatedConceptSlugs → /concepts/<slug>). */
export function conceptLinksForLesson(slugs: string[] = []): GraphLink[] {
  return slugs
    .filter((s) => getConcept(s))
    .map((s) => ({ label: conceptTitle(s), href: `/concepts/${s}` }));
}
