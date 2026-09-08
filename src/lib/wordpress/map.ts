/**
 * WordPress REST → CmsArticle mapping + small HTML helpers.
 * Keeping this separate means UI components never see raw WP shapes.
 */
import type { CmsType } from "./config";
import type { CmsArticle, CmsTermGroups, WpRawPost } from "./types";

export function decodeHtml(input: string): string {
  if (!input) return "";
  if (typeof document !== "undefined") {
    const el = document.createElement("textarea");
    el.innerHTML = input;
    return el.value;
  }
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function stripHtml(input: string): string {
  if (!input) return "";
  return decodeHtml(input.replace(/<[^>]*>/g, "")).trim();
}

/**
 * Defensive sanitizer for `content.rendered`. Content is first-party (authored
 * by trusted CMS users, and WordPress runs kses on save), but we still strip
 * scripts, styles, inline event handlers, and javascript: URLs before injecting.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/ on\w+="[^"]*"/gi, "")
    .replace(/ on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

const TAXONOMY_TO_GROUP: Record<string, keyof CmsTermGroups> = {
  st_domain: "domains",
  st_content_category: "categories",
  st_topic: "topics",
  st_tag: "tags",
  st_difficulty: "difficulty",
};

function extractTerms(raw: WpRawPost): CmsTermGroups {
  const groups: CmsTermGroups = { domains: [], categories: [], topics: [], tags: [], difficulty: [] };
  const embedded = raw._embedded?.["wp:term"];
  if (!embedded) return groups;
  for (const list of embedded) {
    for (const term of list || []) {
      const g = TAXONOMY_TO_GROUP[term.taxonomy];
      if (g) groups[g].push(term.name);
    }
  }
  return groups;
}

function toReadingTime(meta: Record<string, unknown> | undefined): number | null {
  const raw = meta?.st_reading_time;
  const n = typeof raw === "number" ? raw : parseInt(String(raw ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function mapPost(type: CmsType, raw: WpRawPost): CmsArticle {
  const seo = raw.st_seo
    ? {
        title: raw.st_seo.title ?? "",
        description: raw.st_seo.description ?? "",
        canonical: raw.st_seo.canonical ?? "",
        ogTitle: raw.st_seo.og_title ?? "",
        ogDescription: raw.st_seo.og_description ?? "",
        socialImage: raw.st_seo.social_image ?? null,
      }
    : null;

  return {
    id: raw.id,
    type,
    slug: raw.slug,
    title: decodeHtml(raw.title?.rendered ?? ""),
    excerpt: stripHtml(raw.excerpt?.rendered ?? ""),
    contentHtml: sanitizeHtml(raw.content?.rendered ?? ""),
    publishedDate: raw.date,
    modifiedDate: raw.modified,
    author: raw.st_author ? { id: raw.st_author.id, name: raw.st_author.name, slug: raw.st_author.slug } : null,
    featuredImage: raw.st_featured_image ? { url: raw.st_featured_image.url, alt: raw.st_featured_image.alt } : null,
    seo,
    terms: extractTerms(raw),
    readingTime: toReadingTime(raw.meta),
    fields: raw.meta ?? {},
  };
}
