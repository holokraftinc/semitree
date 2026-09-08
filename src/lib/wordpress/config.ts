/**
 * WordPress headless CMS — connection config.
 *
 * The base URL is env-driven so it can move from the temporary GoDaddy host to
 * https://cms.semitree.in with only an environment/config change — never a code
 * change. It is read from `NEXT_PUBLIC_WORDPRESS_API_URL` (must be NEXT_PUBLIC_
 * so the browser can read it on this static site); it falls back to the current
 * development host. The URL is a PUBLIC, read-only endpoint — not a secret.
 */

// Production default is the final CMS domain — no development host ships in the
// bundle. For local development, set NEXT_PUBLIC_WORDPRESS_API_URL in .env.local
// to the temporary GoDaddy host (see .env.example).
const DEFAULT_WORDPRESS_API_URL = "https://cms.semitree.in";

function normalizeBase(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/** CMS base URL (env override → production default). */
export const WORDPRESS_API_URL = normalizeBase(
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL || DEFAULT_WORDPRESS_API_URL,
);

/** Base for Semitree's custom WordPress REST namespace (subscribe/unsubscribe). */
export const WP_SEMITREE_API = `${WORDPRESS_API_URL}/wp-json/semitree/v1`;

/** WordPress core REST namespace for our content. */
export const WP_V2 = `${WORDPRESS_API_URL}/wp-json/wp/v2`;

/** The five Semitree content types, mapped to their REST bases (Phase 11 plugin). */
export const CMS_TYPES = [
  { key: "articles", rest: "articles", label: "Articles" },
  { key: "news", rest: "news", label: "Industry News" },
  { key: "explainers", rest: "explainers", label: "Explainers" },
  { key: "research", rest: "research", label: "Research Insights" },
  { key: "analysis", rest: "analysis", label: "Industry Analysis" },
] as const;

export type CmsType = (typeof CMS_TYPES)[number]["key"];

export function cmsTypeMeta(key: CmsType) {
  return CMS_TYPES.find((t) => t.key === key)!;
}

export function isCmsType(value: string): value is CmsType {
  return CMS_TYPES.some((t) => t.key === value);
}
