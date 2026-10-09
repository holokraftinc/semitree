/**
 * Global search index — a unified index over the whole Semitree ecosystem.
 *
 * This module imports every registry, so it is HEAVY: it must only be used
 * server-side (the /search-index.json route handler) and in tests — never in a
 * client bundle. The client dialog imports the light `./types` and fetches the
 * prebuilt JSON this produces.
 *
 * Extensible by design: each content type contributes one source.
 */
import {
  type SearchDoc,
  TYPE_META,
  typeLabel,
  categoryFor,
  whyRelevant,
  search,
} from "./types";

import { SEMI_TOOLS, SEMI_CATEGORY_LABELS } from "@/lib/data/semi-tools";
import { SEMI_LESSONS } from "@/lib/knowledge/semi-lessons";
import { COMPANIES } from "@/lib/industry/companies";
import { COMPANY_TYPE_LABELS, SITE_KIND_LABELS } from "@/lib/industry/types";
import { SUPPLY_STAGES, SEGMENTS } from "@/lib/knowledge/supply-chain";
import {
  INDIA_STATES,
  INDIA_PROJECTS,
  INDIA_INVESTMENTS,
  indiaFacilities,
  getState,
} from "@/lib/india/ecosystem";
import { publishedArticles } from "@/lib/content/articles";
import { CONTENT_TYPE_LABELS } from "@/lib/content/types";
import { PROBLEMS, OPPORTUNITY_CATEGORY_BY_KEY } from "@/lib/opportunities/opportunities";
import { SUPPLIER_CATEGORIES } from "@/lib/industry/relationships";
import { PROJECTS } from "@/lib/projects/projects";
// legacy / microfluidics domain
import { TOOLS, CATEGORY_LABELS } from "@/lib/data/tools";
import { LESSONS } from "@/lib/data/lessons";
import { GLOSSARY } from "@/lib/data/glossary";
import { sampleResources } from "@/lib/data/samples";

export { TYPE_META, typeLabel, categoryFor, whyRelevant, search };
export type { SearchDoc, SearchResult, SearchType, MatchReason } from "./types";

interface SearchSource {
  load: () => SearchDoc[];
}

const SEARCH_SOURCES: SearchSource[] = [
  // ---- Companies ----
  {
    load: () =>
      COMPANIES.map((c) => ({
        id: `company:${c.slug}`,
        type: "company" as const,
        title: c.name,
        description: c.description,
        href: `/industry/companies/${c.slug}`,
        keywords: [
          ...c.types.map((t) => COMPANY_TYPE_LABELS[t]),
          ...(c.technologies ?? []),
          ...(c.products ?? []),
          c.hq.city,
          c.hq.country,
          c.hq.state ?? "",
        ].join(" "),
      })),
  },
  // ---- People (founders & leadership) ----
  {
    load: () => {
      const docs: SearchDoc[] = [];
      const seen = new Set<string>();
      for (const c of COMPANIES) {
        for (const name of c.founders ?? []) {
          const id = `person:${name}|${c.slug}`;
          if (seen.has(id)) continue;
          seen.add(id);
          docs.push({
            id,
            type: "person",
            title: name,
            description: `Founder — ${c.name}`,
            href: `/industry/companies/${c.slug}`,
            keywords: `${c.name} founder`,
          });
        }
        for (const l of c.leadership ?? []) {
          const id = `person:${l.name}|${c.slug}`;
          if (seen.has(id)) continue;
          seen.add(id);
          docs.push({
            id,
            type: "person",
            title: l.name,
            description: `${l.role} — ${c.name}`,
            href: `/industry/companies/${c.slug}`,
            keywords: `${c.name} ${l.role}`,
          });
        }
      }
      return docs;
    },
  },
  // ---- Facilities (India sites) ----
  {
    load: () =>
      indiaFacilities().map((f) => ({
        id: `facility:${f.company.slug}:${f.point.label}`,
        type: "facility" as const,
        title: `${f.point.label} — ${f.company.name}`,
        description: `${f.point.city}${f.point.state ? `, ${f.point.state}` : ""} · ${SITE_KIND_LABELS[f.point.kind]}`,
        href: `/industry/companies/${f.company.slug}`,
        keywords: `${f.company.name} ${f.point.city} ${f.point.state ?? ""} ${SITE_KIND_LABELS[f.point.kind]} facility`,
      })),
  },
  // ---- States ----
  {
    load: () =>
      INDIA_STATES.map((s) => ({
        id: `state:${s.slug}`,
        type: "state" as const,
        title: s.name,
        description: s.tagline,
        href: `/india/states/${s.slug}`,
        keywords: `India state ${s.overview}`,
      })),
  },
  // ---- Projects (research projects + announced India facility projects) ----
  {
    load: () => [
      ...PROJECTS.map((p) => ({
        id: `project:${p.slug}`,
        type: "project" as const,
        title: p.title,
        description: p.tagline,
        href: `/projects/${p.slug}`,
        keywords: `${p.objective} research project`,
      })),
      ...INDIA_PROJECTS.map((p) => ({
        id: `india-project:${p.slug}`,
        type: "project" as const,
        title: p.name,
        description: p.summary,
        href: `/india/states/${p.stateSlug}`,
        keywords: `${getState(p.stateSlug)?.name ?? ""} ${p.city} ${p.kind} project facility`,
      })),
    ],
  },
  // ---- Investments ----
  {
    load: () =>
      INDIA_INVESTMENTS.map((inv) => ({
        id: `investment:${inv.slug}`,
        type: "investment" as const,
        title: inv.label,
        description: `${inv.amountText} · ${getState(inv.stateSlug)?.name ?? "India"}`,
        href: `/india/states/${inv.stateSlug}`,
        keywords: `investment funding ${inv.amountText} ${getState(inv.stateSlug)?.name ?? ""}`,
      })),
  },
  // ---- Insights ----
  {
    load: () =>
      publishedArticles().map((a) => ({
        id: `insight:${a.slug}`,
        type: "insight" as const,
        title: a.title,
        description: a.excerpt,
        href: `/articles/${a.slug}`,
        keywords: `${CONTENT_TYPE_LABELS[a.type]} ${a.tags.join(" ")}`,
      })),
  },
  // ---- Supply-chain stages ----
  {
    load: () =>
      SUPPLY_STAGES.map((s) => ({
        id: `stage:${s.slug}`,
        type: "stage" as const,
        title: s.name,
        description: s.tagline,
        href: `/supply-chain/${s.slug}`,
        keywords: [
          SEGMENTS.find((x) => x.id === s.segment)?.label ?? "",
          ...s.technologies,
        ].join(" "),
      })),
  },
  // ---- Opportunities / problems ----
  {
    load: () =>
      PROBLEMS.map((p) => ({
        id: `problem:${p.slug}`,
        type: "opportunity" as const,
        title: p.title,
        description: p.problem,
        href: `/opportunities/problems/${p.slug}`,
        keywords: `${OPPORTUNITY_CATEGORY_BY_KEY.get(p.category)?.label ?? ""} ${p.industry} problem gap opportunity`,
      })),
  },
  // ---- Suppliers (equipment & materials categories) ----
  {
    load: () =>
      SUPPLIER_CATEGORIES.map((c) => ({
        id: `supplier:${c.key}`,
        type: "supplier" as const,
        title: c.label,
        description: c.description,
        href: `/suppliers#${c.key}`,
        keywords: "supplier equipment materials",
      })),
  },
  // ---- Semiconductor tools ----
  {
    load: () =>
      SEMI_TOOLS.map((t) => ({
        id: `tool:${t.slug}`,
        type: "tool" as const,
        title: t.name,
        description: t.summary,
        href: `/semiconductors/tools/${t.slug}`,
        keywords: [SEMI_CATEGORY_LABELS[t.category], t.formula, ...(t.inputs ?? [])].join(" "),
      })),
  },
  // ---- Semiconductor learning topics ----
  {
    load: () =>
      SEMI_LESSONS.map((l) => ({
        id: `lesson:${l.slug}`,
        type: "lesson" as const,
        title: l.title,
        description: l.summary,
        href: `/semiconductors/learn/${l.slug}`,
        keywords: "learning topic semiconductor",
      })),
  },
  // ---- Legacy microfluidics domain (preserved) ----
  {
    load: () =>
      TOOLS.map((t) => ({
        id: `mf-tool:${t.slug}`,
        type: "tool" as const,
        title: t.name,
        description: t.summary,
        href: `/tools/${t.slug}`,
        keywords: CATEGORY_LABELS[t.category],
      })),
  },
  {
    load: () =>
      LESSONS.map((l) => ({
        id: `mf-lesson:${l.slug}`,
        type: "lesson" as const,
        title: l.title,
        description: l.summary,
        href: `/learn/${l.slug}`,
        keywords: l.whatYoullLearn.join(" "),
      })),
  },
  {
    load: () =>
      GLOSSARY.map((c) => ({
        id: `concept:${c.slug}`,
        type: "concept" as const,
        title: c.title,
        description: c.summary,
        href: `/concepts/${c.slug}`,
        keywords: c.explanation?.join(" "),
      })),
  },
  {
    load: () =>
      sampleResources.map((r) => ({
        id: `resource:${r.slug}`,
        type: "resource" as const,
        title: r.title,
        description: r.description ?? r.author ?? "",
        href: "/resources",
        keywords: r.author,
      })),
  },
];

/** Build the flat index from all sources. */
export function buildSearchIndex(): SearchDoc[] {
  return SEARCH_SOURCES.flatMap((s) => s.load());
}
