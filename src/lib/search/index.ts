/**
 * Global search — a unified, client-side/static index over Semitree's content.
 *
 * Extensible by design: search draws from a registry of SOURCES, each
 * contributing typed documents. Adding a future content type (papers,
 * companies, equipment, courses, directory, jobs, blog) is a matter of adding a
 * source and a type label — the index, ranking, and UI need no changes.
 *
 * No external/paid search service: ranking is a small in-memory scorer.
 */
import { TOOLS, CATEGORY_LABELS } from "@/lib/data/tools";
import { LESSONS } from "@/lib/data/lessons";
import { GLOSSARY } from "@/lib/data/glossary";
import { sampleResources } from "@/lib/data/samples";

/**
 * Search result types. The four current types are implemented; the rest are
 * declared now so the UI and ranking are ready for them (see FUTURE READY).
 */
export type SearchType =
  | "tool"
  | "lesson"
  | "concept"
  | "resource"
  // future:
  | "paper"
  | "company"
  | "equipment"
  | "course"
  | "directory"
  | "job"
  | "blog";

export interface SearchDoc {
  id: string;
  type: SearchType;
  title: string;
  description: string;
  href: string;
  /** Extra searchable text (not shown), e.g. category, objectives. */
  keywords?: string;
}

/** A pluggable source of documents. Add one per content type. */
export interface SearchSource {
  type: SearchType;
  load: () => SearchDoc[];
}

/** Display metadata per type: a short uppercase label + list order. */
export const TYPE_META: Record<
  SearchType,
  { label: string; order: number }
> = {
  tool: { label: "Tool", order: 0 },
  lesson: { label: "Lesson", order: 1 },
  concept: { label: "Concept", order: 2 },
  resource: { label: "Resource", order: 3 },
  paper: { label: "Paper", order: 4 },
  company: { label: "Company", order: 5 },
  equipment: { label: "Equipment", order: 6 },
  course: { label: "Course", order: 7 },
  directory: { label: "Directory", order: 8 },
  job: { label: "Job", order: 9 },
  blog: { label: "Blog", order: 10 },
};

export function typeLabel(type: SearchType): string {
  return TYPE_META[type]?.label ?? type.toUpperCase();
}

/** The active sources (the four implemented content types). */
export const SEARCH_SOURCES: SearchSource[] = [
  {
    type: "tool",
    load: () =>
      TOOLS.map((t) => ({
        id: `tool:${t.slug}`,
        type: "tool" as const,
        title: t.name,
        description: t.summary,
        href: `/tools/${t.slug}`,
        keywords: CATEGORY_LABELS[t.category],
      })),
  },
  {
    type: "lesson",
    load: () =>
      LESSONS.map((l) => ({
        id: `lesson:${l.slug}`,
        type: "lesson" as const,
        title: l.title,
        description: l.summary,
        href: `/learn/${l.slug}`,
        keywords: l.whatYoullLearn.join(" "),
      })),
  },
  {
    type: "concept",
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
    type: "resource",
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

/** Build the flat index from all sources. Cheap; safe to call per session. */
export function buildSearchIndex(): SearchDoc[] {
  return SEARCH_SOURCES.flatMap((s) => s.load());
}

export interface SearchResult extends SearchDoc {
  score: number;
}

/** Score a document against a lowercased query and its terms. */
function scoreDoc(doc: SearchDoc, query: string, terms: string[]): number {
  const title = doc.title.toLowerCase();
  const keywords = (doc.keywords ?? "").toLowerCase();
  const description = doc.description.toLowerCase();
  const hay = `${title} ${keywords} ${description}`;

  // Every term must appear somewhere (AND semantics) for a partial match.
  if (!terms.every((t) => hay.includes(t))) return 0;

  if (title === query) return 100;
  if (title.startsWith(query)) return 80;
  if (title.includes(query)) return 60;
  if (keywords.includes(query)) return 40;
  return 20; // matched only in description / across terms
}

/**
 * Case-insensitive, partial, relevance-ranked search.
 * Ties break by type order (tool → lesson → concept → resource → …) then title.
 */
export function search(
  query: string,
  index: SearchDoc[] = buildSearchIndex(),
  limit = 20,
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q === "") return [];
  const terms = q.split(/\s+/).filter(Boolean);

  return index
    .map((doc) => ({ ...doc, score: scoreDoc(doc, q, terms) }))
    .filter((r) => r.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        TYPE_META[a.type].order - TYPE_META[b.type].order ||
        a.title.localeCompare(b.title),
    )
    .slice(0, limit);
}
