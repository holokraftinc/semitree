/**
 * WordPress REST → Semitree normalized content types.
 *
 * The frontend never consumes raw WP shapes directly; the mapper (map.ts)
 * converts them to `CmsArticle`, so UI components stay decoupled from WordPress.
 */
import type { CmsType } from "./config";

/** Minimal subset of the WP REST post shape we rely on. */
export interface WpRawPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  meta?: Record<string, unknown>;
  // Convenience read-fields added by the Semitree CMS plugin (Phase 11):
  st_featured_image?: { id: number; url: string; alt: string } | null;
  st_author?: { id: number; name: string; slug: string } | null;
  st_seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    og_title?: string;
    og_description?: string;
    social_image?: string | null;
  } | null;
  // Embedded terms/author when requested with _embed.
  _embedded?: {
    "wp:term"?: Array<Array<{ taxonomy: string; name: string; slug: string }>>;
  };
}

export interface CmsAuthor {
  id: number;
  name: string;
  slug: string;
}

export interface CmsImage {
  url: string;
  alt: string;
}

export interface CmsSeo {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  socialImage: string | null;
}

export interface CmsTermGroups {
  domains: string[];
  categories: string[];
  topics: string[];
  tags: string[];
  difficulty: string[];
}

/** Normalized article the Semitree UI renders (any of the five content types). */
export interface CmsArticle {
  id: number;
  type: CmsType;
  slug: string;
  title: string;
  excerpt: string;
  /** Sanitized HTML body (detail views only). */
  contentHtml: string;
  publishedDate: string;
  modifiedDate: string;
  author: CmsAuthor | null;
  featuredImage: CmsImage | null;
  seo: CmsSeo | null;
  terms: CmsTermGroups;
  readingTime: number | null;
  /** Type-specific extra fields (subtitle, summary, source_url, doi, …). */
  fields: Record<string, unknown>;
}

export interface CmsListResult {
  items: CmsArticle[];
  total: number;
  totalPages: number;
  /** True when served from cache after a live fetch failure. */
  fromCache?: boolean;
}

export interface CmsListParams {
  page?: number;
  perPage?: number;
  search?: string;
  /** Term IDs to filter by (WordPress expects IDs for these taxonomies). */
  domain?: number;
  tag?: number;
  category?: number;
}
