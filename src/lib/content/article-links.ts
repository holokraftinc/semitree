/**
 * Resolve an article's connections into the ecosystem — companies, technologies,
 * tools, supply-chain stages, India states, projects, and related insights.
 *
 * All links point at REAL entities. Supply-chain stages are taken from the
 * article's explicit `relatedStages`, and otherwise derived from its
 * `relatedConcepts` via the same concept→stage map the learning pages use — no
 * invented relationships. Empty groups are simply omitted by the UI.
 */
import type { Article } from "./types";
import { getCompany } from "@/lib/industry/companies";
import { getSemiTool } from "@/lib/data/semi-tools";
import { getStage } from "@/lib/knowledge/supply-chain";
import { supplyStageForLesson } from "@/lib/knowledge/lesson-connections";
import { getState, INDIA_PROJECTS } from "@/lib/india/ecosystem";
import { relatedArticleObjects } from "./articles";

export interface LinkRef {
  label: string;
  href: string;
}

export interface ArticleLinks {
  companies: LinkRef[];
  technologies: LinkRef[];
  tools: LinkRef[];
  stages: LinkRef[];
  states: LinkRef[];
  projects: LinkRef[];
  insights: LinkRef[];
}

function dedupe(refs: LinkRef[]): LinkRef[] {
  const seen = new Set<string>();
  return refs.filter((r) => (seen.has(r.href) ? false : (seen.add(r.href), true)));
}

export function articleLinks(a: Article): ArticleLinks {
  const companies = (a.relatedCompanies ?? [])
    .map((slug) => {
      const c = getCompany(slug);
      return c ? { label: c.name, href: `/industry/companies/${c.slug}` } : null;
    })
    .filter((x): x is LinkRef => Boolean(x));

  const technologies = [
    ...(a.relatedTechnologies ?? []).map((t) => ({ label: t.label, href: `/research/topics/${t.slug}` })),
    ...(a.relatedConcepts ?? []).map((c) => ({ label: c.label, href: `/semiconductors/learn/${c.slug}` })),
  ];

  const tools = (a.relatedTools ?? [])
    .map((slug) => {
      const t = getSemiTool(slug);
      return t ? { label: t.name, href: `/semiconductors/tools/${t.slug}` } : null;
    })
    .filter((x): x is LinkRef => Boolean(x));

  // Stages: explicit first, then derived from concepts.
  const explicitStages = (a.relatedStages ?? [])
    .map((slug) => {
      const s = getStage(slug);
      return s ? { label: s.name, href: `/supply-chain/${s.slug}` } : null;
    })
    .filter((x): x is LinkRef => Boolean(x));
  const derivedStages = (a.relatedConcepts ?? [])
    .map((c) => supplyStageForLesson(c.slug))
    .filter((x): x is { label: string; href: string } => Boolean(x));
  const stages = dedupe([...explicitStages, ...derivedStages]);

  const states = (a.relatedStates ?? [])
    .map((slug) => {
      const st = getState(slug);
      return st ? { label: st.name, href: `/india/states/${st.slug}` } : null;
    })
    .filter((x): x is LinkRef => Boolean(x));

  // Projects may share a state (and therefore an href); keep each distinct one.
  const projects = Array.from(new Set(a.relatedProjects ?? []))
    .map((slug) => {
      const p = INDIA_PROJECTS.find((x) => x.slug === slug);
      if (!p) return null;
      return { label: p.name, href: `/india/states/${p.stateSlug}` };
    })
    .filter((x): x is LinkRef => Boolean(x));

  const insights = relatedArticleObjects(a.slug).map((r) => ({
    label: r.title,
    href: `/articles/${r.slug}`,
  }));

  return {
    companies: dedupe(companies),
    technologies: dedupe(technologies),
    tools: dedupe(tools),
    stages,
    states: dedupe(states),
    projects,
    insights: dedupe(insights),
  };
}
