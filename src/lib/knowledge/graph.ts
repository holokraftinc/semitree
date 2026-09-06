/**
 * Knowledge graph traversal — maintainable, relational; NOT a graph database.
 *
 * Relationships are slug references on entities. These helpers resolve them
 * (forward) and derive reverse links, so an edge declared once is navigable in
 * both directions. They work for any domain and return [] cleanly when content
 * is empty (the current state of the semiconductor domain).
 *
 * Covers the required edges:
 *   Concept→Lesson, Concept→Tool, Concept→Company, Concept→Technology,
 *   Process→Equipment, Process→Material, Technology→Company, Company→Technology,
 *   Company→Process, Research→Concept.
 */
import type { EntityBase, KnowledgeDomainId } from "./types";
import { getKnowledge } from "./registry";

type WithSlug = EntityBase;

function index<T extends WithSlug>(items: T[]): Map<string, T> {
  return new Map(items.map((i) => [i.slug, i]));
}

/** Resolve a list of slugs against a collection (skips unknowns). */
function resolve<T extends WithSlug>(items: T[], slugs?: string[]): T[] {
  if (!slugs?.length) return [];
  const by = index(items);
  return slugs.map((s) => by.get(s)).filter((x): x is T => Boolean(x));
}

/** Forward links from one entity's relation field. */
export function forward<T extends WithSlug>(
  targets: T[],
  fromEntity: EntityBase | undefined,
  relationField: string,
): T[] {
  const slugs = (fromEntity as Record<string, unknown> | undefined)?.[
    relationField
  ] as string[] | undefined;
  return resolve(targets, slugs);
}

/** Reverse links: all `sources` whose `relationField` contains `targetSlug`. */
export function reverse<S extends WithSlug>(
  sources: S[],
  relationField: string,
  targetSlug: string,
): S[] {
  return sources.filter((s) => {
    const slugs = (s as unknown as Record<string, unknown>)[relationField] as
      | string[]
      | undefined;
    return Array.isArray(slugs) && slugs.includes(targetSlug);
  });
}

/* ---- Named convenience resolvers for the required relationships ---- */

export function lessonsForConcept(domainId: KnowledgeDomainId, conceptSlug: string) {
  const kb = getKnowledge(domainId);
  const c = index(kb.concepts).get(conceptSlug);
  return [
    ...forward(kb.lessons, c, "relatedLessons"),
    ...reverse(kb.lessons, "concepts", conceptSlug),
  ].filter(dedupe());
}

export function toolsForConcept(domainId: KnowledgeDomainId, conceptSlug: string) {
  const kb = getKnowledge(domainId);
  const c = index(kb.concepts).get(conceptSlug);
  return [
    ...forward(kb.tools, c, "relatedTools"),
    ...reverse(kb.tools, "concepts", conceptSlug),
  ].filter(dedupe());
}

export function companiesForTechnology(domainId: KnowledgeDomainId, techSlug: string) {
  const kb = getKnowledge(domainId);
  const t = index(kb.technologies).get(techSlug);
  return [
    ...forward(kb.companies, t, "companies"),
    ...reverse(kb.companies, "technologies", techSlug),
  ].filter(dedupe());
}

export function technologiesForCompany(domainId: KnowledgeDomainId, companySlug: string) {
  const kb = getKnowledge(domainId);
  const c = index(kb.companies).get(companySlug);
  return [
    ...forward(kb.technologies, c, "technologies"),
    ...reverse(kb.technologies, "companies", companySlug),
  ].filter(dedupe());
}

export function equipmentForProcess(domainId: KnowledgeDomainId, processSlug: string) {
  const kb = getKnowledge(domainId);
  const p = index(kb.processes).get(processSlug);
  return forward(kb.equipment, p, "equipment");
}

export function materialsForProcess(domainId: KnowledgeDomainId, processSlug: string) {
  const kb = getKnowledge(domainId);
  const p = index(kb.processes).get(processSlug);
  return forward(kb.materials, p, "materials");
}

export function conceptsForResearch(domainId: KnowledgeDomainId, researchSlug: string) {
  const kb = getKnowledge(domainId);
  const r = index(kb.research).get(researchSlug);
  return forward(kb.concepts, r, "concepts");
}

/** Dedupe by slug while preserving order. */
function dedupe<T extends WithSlug>() {
  const seen = new Set<string>();
  return (item: T) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  };
}
