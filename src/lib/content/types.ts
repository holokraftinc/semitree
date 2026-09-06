/**
 * Content platform — data model.
 *
 * Articles and newsletter issues are DATA, never hardcoded into UI components.
 * All seeded content is Semitree's own original, evergreen writing based on
 * well-established knowledge — no fabricated news, statistics, quotes, or
 * external authors. Time-sensitive content types (news, industry/company
 * analysis) exist in the model but are seeded only when there is something
 * genuine to say; otherwise their category shows an honest empty state.
 *
 * FUTURE (reserved, not built here — no admin panel): `status`, `scheduledFor`,
 * `editorIds`, drafts, email campaigns, subscriber segmentation, analytics.
 */

export type ContentType =
  | "blog"
  | "newsletter"
  | "research-article"
  | "explainer"
  | "industry-analysis"
  | "company-analysis"
  | "technology-deep-dive"
  | "news"
  | "india-update"
  | "tool-tutorial";

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  blog: "Blog",
  newsletter: "Newsletter",
  "research-article": "Research article",
  explainer: "Explainer",
  "industry-analysis": "Industry analysis",
  "company-analysis": "Company analysis",
  "technology-deep-dive": "Technology deep dive",
  news: "News",
  "india-update": "India update",
  "tool-tutorial": "Tool tutorial",
};

export type PublishStatus = "published" | "draft" | "scheduled";

export interface Author {
  id: string;
  name: string;
  bio?: string;
  url?: string;
}

/** Structured content blocks — rendered by ArticleBody, never raw HTML. */
export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; title?: string; text: string }
  | { type: "quote"; text: string; cite?: string };

export interface Article {
  slug: string;
  title: string;
  subtitle?: string;
  type: ContentType;
  authorId: string;
  /** ISO date (YYYY-MM-DD). */
  publishedDate: string;
  updatedDate?: string;

  /** Meta description + card excerpt. */
  excerpt: string;
  tags: string[];
  /** Optional accent for the gradient hero band (no fabricated photos). */
  accent?: "teal" | "indigo" | "amber" | "rose";

  body: Block[];

  featured?: boolean;
  popular?: boolean;

  /* Interlinks to existing Semitree entities. */
  relatedConcepts?: { label: string; slug: string }[];
  relatedCompanies?: string[];
  /** Research-topic slugs (technologies). */
  relatedTechnologies?: { label: string; slug: string }[];
  relatedTools?: string[];
  relatedArticles?: string[];

  /** SEO overrides (defaults derived from title/excerpt/path). */
  seo?: { title?: string; description?: string; canonical?: string };

  /* FUTURE (reserved). */
  status?: PublishStatus;
  scheduledFor?: string;
  editorIds?: string[];
}

export interface NewsletterIssue {
  slug: string;
  number: number;
  title: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  summary: string;
  body: Block[];
  relatedArticles?: string[];
  relatedTools?: string[];
  /** Research-topic slugs. */
  relatedResearch?: string[];
}

/** Words per minute used to estimate reading time. */
const WPM = 200;

function blockText(b: Block): string {
  switch (b.type) {
    case "ul":
    case "ol":
      return b.items.join(" ");
    case "callout":
      return `${b.title ?? ""} ${b.text}`;
    case "quote":
      return `${b.text} ${b.cite ?? ""}`;
    default:
      return b.text;
  }
}

/** Estimated reading time in minutes (min 1), derived from the body. */
export function readingTimeMinutes(body: Block[]): number {
  const words = body.map(blockText).join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}
