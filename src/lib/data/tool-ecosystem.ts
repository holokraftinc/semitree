/**
 * Server-side derivation of a tool's ecosystem connections.
 *
 * This is imported only by the ToolEcosystem SERVER component, so the heavy
 * registries it touches (lessons, companies, articles) never reach the client
 * calculator bundle. Every link is real and derived — a tool connects to the
 * ecosystem through the learning topic(s) it supports:
 *   concept → manufacturing process → equipment/materials → supply-chain stage
 *   → companies → insights → related tools.
 * Nothing is invented; groups with no data are simply omitted.
 */
import { getSemiTool, getRelatedSemiToolLinks } from "./semi-tools";
import { getSemiLesson } from "@/lib/knowledge/semi-lessons";
import { getProcess } from "@/lib/knowledge/manufacturing";
import {
  companiesForLesson,
  insightsForLesson,
  supplyStageForLesson,
  type ConnLink,
} from "@/lib/knowledge/lesson-connections";

export interface ToolEcosystem {
  whyItMatters?: string;
  concepts: ConnLink[];
  processes: ConnLink[];
  equipment: string[];
  materials: string[];
  stages: ConnLink[];
  companies: ConnLink[];
  insights: ConnLink[];
  tools: ConnLink[];
  /** True only when at least one group has content. */
  hasAny: boolean;
}

// Curated "why it matters" for the flagship tools. Optional by design — tools
// without an entry simply don't show the line (short utilities stay concise).
const WHY_IT_MATTERS: Record<string, string> = {
  "litho-resolution":
    "Resolution sets the smallest feature a process can print — the number behind every node generation and the reason EUV lithography matters.",
  "die-per-wafer":
    "Dies per wafer drives cost per chip. It is the first-order economics question every fab and fabless company runs constantly.",
  "wafer-yield":
    "Yield decides how many good chips a wafer actually produces — the difference between a profitable node and an unprofitable one.",
  "depth-of-focus":
    "Depth of focus bounds how much topography and film variation a lithography step can tolerate before patterns fail.",
  "etch-rate":
    "Etch rate and uniformity control how precisely features are transferred into the wafer — central to yield.",
  "deposition-rate":
    "Deposition rate and uniformity set film thickness control, which ripples through device performance and yield.",
  "thermal-resistance":
    "Thermal resistance governs how hot a packaged chip runs — a limiter on performance and reliability.",
  "interconnect-rc-delay":
    "RC delay in the wiring increasingly limits chip speed, which is why materials and advanced packaging matter.",
};

function prettify(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function uniqBy<T>(items: T[], key: (t: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((it) => (seen.has(key(it)) ? false : (seen.add(key(it)), true)));
}

export function toolEcosystem(slug: string): ToolEcosystem {
  const tool = getSemiTool(slug);
  const empty: ToolEcosystem = {
    concepts: [], processes: [], equipment: [], materials: [],
    stages: [], companies: [], insights: [], tools: [], hasAny: false,
  };
  if (!tool) return empty;

  const lessons = tool.relatedLearning ?? [];

  const concepts: ConnLink[] = lessons.map((s) => ({
    label: getSemiLesson(s)?.title ?? prettify(s),
    href: `/semiconductors/learn/${s}`,
  }));

  const procObjs = lessons.map((s) => getProcess(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const processes: ConnLink[] = procObjs.map((p) => ({ label: p.name, href: `/manufacturing/${p.slug}` }));

  const equipment = Array.from(new Set(procObjs.flatMap((p) => p.equipment))).slice(0, 8);
  const materials = Array.from(new Set(procObjs.flatMap((p) => p.materials))).slice(0, 8);

  const stages = uniqBy(
    lessons.map((s) => supplyStageForLesson(s)).filter((x): x is ConnLink => Boolean(x)),
    (l) => l.href,
  );

  const companies = uniqBy(lessons.flatMap((s) => companiesForLesson(s)), (l) => l.href).slice(0, 6);
  const insights = uniqBy(lessons.flatMap((s) => insightsForLesson(s)), (l) => l.href).slice(0, 4);
  const tools = getRelatedSemiToolLinks(slug);

  const hasAny =
    concepts.length + processes.length + equipment.length + materials.length +
      stages.length + companies.length + insights.length + tools.length > 0;

  return {
    whyItMatters: WHY_IT_MATTERS[slug],
    concepts, processes, equipment, materials, stages, companies, insights, tools,
    hasAny,
  };
}
