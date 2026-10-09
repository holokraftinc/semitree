/**
 * Ecosystem knowledge graph — the unified relationship layer.
 *
 * Phase 14 goal: build the RELATIONSHIPS first, not a visual graph. This module
 * is the single query layer over every Semitree entity. It does not duplicate
 * data: `neighbors()` dispatches by node type and reuses the derivations already
 * built across the platform (lesson-connections, relationships, article-links,
 * tool-ecosystem, the India helpers, etc.), returning a consistent set of
 * "Related X" groups any UI — a sidebar today, a visual graph later — can render.
 *
 * Heavy (imports many registries): server/build-time only, never a client bundle.
 */
import type { RelatedGroup, RelatedLink } from "@/components/platform/RelatedRail";
import { getCompany, companiesForTypes, companyPoints } from "@/lib/industry/companies";
import {
  supplyStagesForCompany,
  insightsForCompany,
  relatedSupplierCategories,
  companiesForSupplierCategory,
  getSupplierCategory,
} from "@/lib/industry/relationships";
import {
  relatedToolsForLesson,
  companiesForLesson,
  insightsForLesson,
  supplyStageForLesson,
} from "@/lib/knowledge/lesson-connections";
import { getSemiLesson } from "@/lib/knowledge/semi-lessons";
import { getSemiTool } from "@/lib/data/semi-tools";
import { toolEcosystem } from "@/lib/data/tool-ecosystem";
import { getStage } from "@/lib/knowledge/supply-chain";
import { getProcess } from "@/lib/knowledge/manufacturing";
import {
  getState,
  companiesForState,
  facilitiesForState,
  projectsForState,
  investmentsForState,
  INDIA_PROJECTS,
  stateSlugForName,
} from "@/lib/india/ecosystem";
import { getArticle, publishedArticles } from "@/lib/content/articles";
import { articleLinks } from "@/lib/content/article-links";
import { getProblem, PROBLEMS } from "@/lib/opportunities/opportunities";

export type NodeType =
  | "company"
  | "learning"
  | "tool"
  | "stage"
  | "state"
  | "project"
  | "investment"
  | "insight"
  | "problem"
  | "supplier"
  | "process"
  | "facility";

export interface GraphRef {
  type: NodeType;
  id: string;
}

export interface GraphNode extends GraphRef {
  label: string;
  href: string;
  description?: string;
}

/* --------------------------------- getNode --------------------------------- */

export function getNode(ref: GraphRef): GraphNode | undefined {
  const { type, id } = ref;
  switch (type) {
    case "company": {
      const c = getCompany(id);
      return c && { ...ref, label: c.name, href: `/industry/companies/${c.slug}`, description: c.description };
    }
    case "learning": {
      const l = getSemiLesson(id);
      return l && { ...ref, label: l.title, href: `/semiconductors/learn/${l.slug}`, description: l.summary };
    }
    case "tool": {
      const t = getSemiTool(id);
      return t && { ...ref, label: t.name, href: `/semiconductors/tools/${t.slug}`, description: t.summary };
    }
    case "stage": {
      const s = getStage(id);
      return s && { ...ref, label: s.name, href: `/supply-chain/${s.slug}`, description: s.tagline };
    }
    case "state": {
      const s = getState(id);
      return s && { ...ref, label: s.name, href: `/india/states/${s.slug}`, description: s.tagline };
    }
    case "insight": {
      const a = getArticle(id);
      return a && { ...ref, label: a.title, href: `/articles/${a.slug}`, description: a.excerpt };
    }
    case "problem": {
      const p = getProblem(id);
      return p && { ...ref, label: p.title, href: `/opportunities/problems/${p.slug}`, description: p.problem };
    }
    case "supplier": {
      const c = getSupplierCategory(id);
      return c && { ...ref, label: c.label, href: `/suppliers#${c.key}`, description: c.description };
    }
    case "process": {
      const p = getProcess(id);
      return p && { ...ref, label: p.name, href: `/manufacturing/${p.slug}`, description: p.tagline };
    }
    case "project": {
      const p = INDIA_PROJECTS.find((x) => x.slug === id);
      return p && { ...ref, label: p.name, href: `/india/states/${p.stateSlug}`, description: p.summary };
    }
    default:
      return undefined;
  }
}

/* -------------------------------- neighbors -------------------------------- */

const link = (label: string, href: string): RelatedLink => ({ label, href });
const group = (title: string, links: RelatedLink[]): RelatedGroup => ({ title, links });

function companyNeighbors(id: string): RelatedGroup[] {
  const c = getCompany(id);
  if (!c) return [];
  const indiaPts = companyPoints(c).filter((p) => p.countryCode === "IN");
  const stateSlugs = Array.from(
    new Set(indiaPts.map((p) => stateSlugForName(p.state)).filter((s): s is string => Boolean(s))),
  );
  return [
    group("Related technologies", (c.relatedConcepts ?? []).map((x) => link(x.label, `/semiconductors/learn/${x.slug}`))),
    group("Related supply chain", supplyStagesForCompany(c).map((s) => link(s.name, `/supply-chain/${s.slug}`))),
    group("Related suppliers", relatedSupplierCategories(c).map((s) => link(s.label, `/suppliers#${s.key}`))),
    group("Related companies", (c.relatedCompanies ?? []).map((s) => getCompany(s)).filter((x): x is NonNullable<typeof x> => Boolean(x)).map((x) => link(x.name, `/industry/companies/${x.slug}`))),
    group("Related states", stateSlugs.map((s) => link(getState(s)!.name, `/india/states/${s}`))),
    group("Related projects", INDIA_PROJECTS.filter((p) => p.companySlug === id).map((p) => link(p.name, `/india/states/${p.stateSlug}`))),
    group("Related insights", insightsForCompany(c).map((a) => link(a.title, `/articles/${a.slug}`))),
    group("Related problems", PROBLEMS.filter((p) => (p.relatedCompanies ?? []).includes(id)).map((p) => link(p.title, `/opportunities/problems/${p.slug}`))),
  ];
}

function learningNeighbors(id: string): RelatedGroup[] {
  const proc = getProcess(id);
  const stage = supplyStageForLesson(id);
  return [
    group("Related tools", relatedToolsForLesson(id)),
    group("Related companies", companiesForLesson(id)),
    group("Related manufacturing", proc ? [link(proc.name, `/manufacturing/${proc.slug}`)] : []),
    group("Related supply chain", stage ? [link(stage.label, stage.href)] : []),
    group("Related insights", insightsForLesson(id)),
  ];
}

function toolNeighbors(id: string): RelatedGroup[] {
  const e = toolEcosystem(id);
  return [
    group("Related technologies", e.concepts),
    group("Related manufacturing", e.processes),
    group("Related equipment", e.equipment.map((x) => link(x, "/supply-chain/semiconductor-equipment"))),
    group("Related materials", e.materials.map((x) => link(x, "/supply-chain/raw-materials"))),
    group("Related supply chain", e.stages),
    group("Related companies", e.companies),
    group("Related insights", e.insights),
    group("Related tools", e.tools),
  ];
}

function stageNeighborGroups(id: string): RelatedGroup[] {
  const s = getStage(id);
  if (!s) return [];
  const conceptSlugs = new Set((s.relatedConcepts ?? []).map((c) => c.slug));
  const insights =
    conceptSlugs.size > 0
      ? publishedArticles()
          .filter((a) => (a.relatedConcepts ?? []).some((rc) => conceptSlugs.has(rc.slug)))
          .slice(0, 4)
      : [];
  return [
    group("Related companies", companiesForTypes(s.companyTypes).map((c) => link(c.name, `/industry/companies/${c.slug}`))),
    group("Related technologies", (s.relatedConcepts ?? []).map((c) => link(c.label, `/semiconductors/learn/${c.slug}`))),
    group("Related manufacturing", (s.relatedProcesses ?? []).map((p) => getProcess(p)).filter((x): x is NonNullable<typeof x> => Boolean(x)).map((x) => link(x.name, `/manufacturing/${x.slug}`))),
    group("Related tools", (s.relatedTools ?? []).map((t) => getSemiTool(t)).filter((x): x is NonNullable<typeof x> => Boolean(x)).map((x) => link(x.name, `/semiconductors/tools/${x.slug}`))),
    group("Related insights", insights.map((a) => link(a.title, `/articles/${a.slug}`))),
  ];
}

function stateNeighbors(id: string): RelatedGroup[] {
  const s = getState(id);
  if (!s) return [];
  return [
    group("Related companies", companiesForState(id).map((c) => link(c.name, `/industry/companies/${c.slug}`))),
    group("Related facilities", facilitiesForState(id).map((f) => link(`${f.point.label} — ${f.company.name}`, `/industry/companies/${f.company.slug}`))),
    group("Related projects", projectsForState(id).map((p) => link(p.name, `/industry/companies/${p.companySlug}`))),
    group("Related investments", investmentsForState(id).map((inv) => link(`${inv.label} · ${inv.amountText}`, `/india/states/${id}`))),
    group("Related insights", (s.insightSlugs ?? []).map((slug) => getArticle(slug)).filter((a): a is NonNullable<typeof a> => Boolean(a)).map((a) => link(a.title, `/articles/${a.slug}`))),
  ];
}

function insightNeighbors(id: string): RelatedGroup[] {
  const a = getArticle(id);
  if (!a) return [];
  const l = articleLinks(a);
  return [
    group("Related companies", l.companies),
    group("Related technologies", l.technologies),
    group("Related supply chain", l.stages),
    group("Related states", l.states),
    group("Related projects", l.projects),
    group("Related tools", l.tools),
    group("Related insights", l.insights),
  ];
}

function problemNeighbors(id: string): RelatedGroup[] {
  const p = getProblem(id);
  if (!p) return [];
  const stage = p.relatedStage ? getStage(p.relatedStage) : undefined;
  return [
    group("Related companies", (p.relatedCompanies ?? []).map((s) => getCompany(s)).filter((x): x is NonNullable<typeof x> => Boolean(x)).map((x) => link(x.name, `/industry/companies/${x.slug}`))),
    group("Related technologies", (p.relatedTechnologies ?? []).map((t) => link(t.label, `/research/topics/${t.slug}`))),
    group("Related supply chain", stage ? [link(stage.name, `/supply-chain/${stage.slug}`)] : []),
  ];
}

function supplierNeighbors(id: string): RelatedGroup[] {
  const cat = getSupplierCategory(id);
  if (!cat) return [];
  return [
    group("Related companies", companiesForSupplierCategory(cat).map((c) => link(c.name, `/industry/companies/${c.slug}`))),
  ];
}

function projectNeighbors(id: string): RelatedGroup[] {
  const p = INDIA_PROJECTS.find((x) => x.slug === id);
  if (!p) return [];
  const co = getCompany(p.companySlug);
  const st = getState(p.stateSlug);
  return [
    group("Related companies", co ? [link(co.name, `/industry/companies/${co.slug}`)] : []),
    group("Related states", st ? [link(st.name, `/india/states/${st.slug}`)] : []),
  ];
}

/**
 * The related groups for a node, as a consistent "Related X" set. Empty groups
 * are dropped, so the caller renders only what genuinely connects.
 */
export function neighbors(ref: GraphRef): RelatedGroup[] {
  let groups: RelatedGroup[] = [];
  switch (ref.type) {
    case "company": groups = companyNeighbors(ref.id); break;
    case "learning": groups = learningNeighbors(ref.id); break;
    case "tool": groups = toolNeighbors(ref.id); break;
    case "stage": groups = stageNeighborGroups(ref.id); break;
    case "state": groups = stateNeighbors(ref.id); break;
    case "insight": groups = insightNeighbors(ref.id); break;
    case "problem": groups = problemNeighbors(ref.id); break;
    case "supplier": groups = supplierNeighbors(ref.id); break;
    case "project": groups = projectNeighbors(ref.id); break;
    default: groups = [];
  }
  return groups.filter((g) => g.links.length > 0);
}

/** Count of distinct related entities (for a "N connections" summary). */
export function connectionCount(ref: GraphRef): number {
  return neighbors(ref).reduce((n, g) => n + g.links.length, 0);
}

/** A small, curated set of featured starting points for the explorer. */
export const FEATURED_NODES: GraphRef[] = [
  { type: "company", id: "tata-electronics" },
  { type: "stage", id: "fab" },
  { type: "state", id: "gujarat" },
  { type: "tool", id: "litho-resolution" },
];
