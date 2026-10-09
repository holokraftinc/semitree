/**
 * Search types, metadata, and the (pure) scorer.
 *
 * This module imports NO data registries, so it is safe to bundle into the
 * client search dialog. The heavy index is built server-side (see ./index.ts)
 * and shipped to the client as a static JSON file it fetches on demand.
 */

export type SearchType =
  // semiconductor ecosystem
  | "company"
  | "person"
  | "facility"
  | "state"
  | "project"
  | "investment"
  | "insight"
  | "stage"
  | "opportunity"
  | "supplier"
  | "tool"
  | "lesson"
  | "concept"
  // legacy / microfluidics
  | "resource"
  | "paper"
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
  /** Extra searchable text (not shown): category, keywords, synonyms. */
  keywords?: string;
}

/** Per-type display metadata: short label, the reader-facing category, order. */
export const TYPE_META: Record<
  SearchType,
  { label: string; category: string; order: number }
> = {
  company: { label: "Company", category: "Companies", order: 0 },
  stage: { label: "Supply-chain stage", category: "Supply chain", order: 1 },
  supplier: { label: "Supplier", category: "Equipment & materials", order: 2 },
  facility: { label: "Facility", category: "Facilities", order: 3 },
  project: { label: "Project", category: "Projects", order: 4 },
  investment: { label: "Investment", category: "Investments", order: 5 },
  state: { label: "State", category: "States", order: 6 },
  insight: { label: "Insight", category: "Insights", order: 7 },
  opportunity: { label: "Opportunity", category: "Opportunities", order: 8 },
  // tool before lesson/concept so a matching tool out-ranks a same-score concept.
  tool: { label: "Tool", category: "Tools", order: 9 },
  lesson: { label: "Learning", category: "Learning", order: 10 },
  concept: { label: "Concept", category: "Concepts", order: 11 },
  person: { label: "Person", category: "People", order: 12 },
  resource: { label: "Resource", category: "Resources", order: 13 },
  paper: { label: "Paper", category: "Research", order: 14 },
  equipment: { label: "Equipment", category: "Equipment", order: 15 },
  course: { label: "Course", category: "Learning", order: 16 },
  directory: { label: "Directory", category: "Directory", order: 17 },
  job: { label: "Job", category: "Jobs", order: 18 },
  blog: { label: "Blog", category: "Insights", order: 19 },
};

export function typeLabel(type: SearchType): string {
  return TYPE_META[type]?.label ?? type.toUpperCase();
}

export function categoryFor(type: SearchType): string {
  return TYPE_META[type]?.category ?? "Other";
}

export type MatchReason = "name" | "keyword" | "description";

export interface SearchResult extends SearchDoc {
  score: number;
  /** Where the query matched — drives the "why it may be relevant" line. */
  reason: MatchReason;
}

function reasonText(reason: MatchReason, category: string): string {
  switch (reason) {
    case "name":
      return `${category} · name match`;
    case "keyword":
      return `${category} · matches a related term`;
    default:
      return `${category} · mentioned in the description`;
  }
}

export function whyRelevant(r: SearchResult): string {
  return reasonText(r.reason, categoryFor(r.type));
}

/** Score a document against a lowercased query and its terms. */
function scoreDoc(
  doc: SearchDoc,
  query: string,
  terms: string[],
): { score: number; reason: MatchReason } {
  const title = doc.title.toLowerCase();
  const keywords = (doc.keywords ?? "").toLowerCase();
  const description = doc.description.toLowerCase();
  const hay = `${title} ${keywords} ${description}`;

  // Every term must appear somewhere (AND semantics) for a partial match.
  if (!terms.every((t) => hay.includes(t))) return { score: 0, reason: "description" };

  if (title === query) return { score: 100, reason: "name" };
  if (title.startsWith(query)) return { score: 80, reason: "name" };
  if (title.includes(query)) return { score: 60, reason: "name" };
  if (terms.every((t) => title.includes(t))) return { score: 55, reason: "name" };
  if (keywords.includes(query) || terms.every((t) => keywords.includes(t)))
    return { score: 40, reason: "keyword" };
  return { score: 20, reason: "description" };
}

/**
 * Case-insensitive, partial, relevance-ranked search over a prebuilt index.
 * Ties break by type order then title.
 */
export function search(
  query: string,
  index: SearchDoc[],
  limit = 30,
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q === "") return [];
  const terms = q.split(/\s+/).filter(Boolean);

  return index
    .map((doc) => {
      const { score, reason } = scoreDoc(doc, q, terms);
      return { ...doc, score, reason };
    })
    .filter((r) => r.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        TYPE_META[a.type].order - TYPE_META[b.type].order ||
        a.title.localeCompare(b.title),
    )
    .slice(0, limit);
}
