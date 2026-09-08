/**
 * WordPress REST client — the ONE place that talks to WordPress.
 *
 * Features (Step 6/7): in-memory + sessionStorage caching, request
 * deduplication, timeouts/abort, pagination via WP headers, field selection so
 * we never pull the whole database, and graceful fallback to cached content when
 * the API is unavailable. Only unauthenticated public GETs are made — no
 * credentials, tokens, or secrets (Step 8).
 */
import { WP_V2, cmsTypeMeta, type CmsType } from "./config";
import { mapPost } from "./map";
import type { CmsArticle, CmsListParams, CmsListResult, WpRawPost } from "./types";

const TTL_MS = 5 * 60 * 1000; // 5 minutes
const TIMEOUT_MS = 8000;
const LIST_FIELDS = "id,slug,date,modified,title,excerpt,author,st_featured_image,st_author,st_seo,meta";

export class WpError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message || `WordPress request failed (${status})`);
    this.name = "WpError";
    this.status = status;
  }
}

interface CacheEntry {
  time: number;
  payload: { data: unknown; total: number; totalPages: number };
}

const memCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<CacheEntry["payload"]>>();

function sessionGet(url: string): CacheEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem("stwp:" + url);
    return raw ? (JSON.parse(raw) as CacheEntry) : null;
  } catch {
    return null;
  }
}

function sessionSet(url: string, entry: CacheEntry): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem("stwp:" + url, JSON.stringify(entry));
  } catch {
    /* quota / disabled — ignore */
  }
}

/** Fetch JSON with caching, dedup, timeout, and stale-on-error fallback. */
async function wpJson(url: string): Promise<CacheEntry["payload"]> {
  const now = Date.now();

  const fresh = memCache.get(url) ?? sessionGet(url);
  if (fresh && now - fresh.time < TTL_MS) {
    memCache.set(url, fresh);
    return fresh.payload;
  }
  const existing = inflight.get(url);
  if (existing) return existing;

  const run = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
      if (!res.ok) throw new WpError(res.status);
      const total = Number(res.headers.get("X-WP-Total") || "0");
      const totalPages = Number(res.headers.get("X-WP-TotalPages") || "0");
      const data = await res.json();
      const payload = { data, total, totalPages };
      const entry: CacheEntry = { time: Date.now(), payload };
      memCache.set(url, entry);
      sessionSet(url, entry);
      return payload;
    } catch (err) {
      // Graceful degradation: serve stale cache if we have any.
      const stale = memCache.get(url) ?? sessionGet(url);
      if (stale) return stale.payload;
      throw err;
    } finally {
      clearTimeout(timer);
      inflight.delete(url);
    }
  })();

  inflight.set(url, run);
  return run;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== null) q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

/** List published items of a content type (paginated, lightweight fields). */
export async function fetchList(type: CmsType, params: CmsListParams = {}): Promise<CmsListResult> {
  const rest = cmsTypeMeta(type).rest;
  const query = buildQuery({
    _fields: LIST_FIELDS,
    per_page: params.perPage ?? 9,
    page: params.page ?? 1,
    search: params.search,
    orderby: "date",
    order: "desc",
    domains: params.domain,
    "content-tags": params.tag,
    "content-categories": params.category,
  });
  const url = `${WP_V2}/${rest}${query}`;
  const { data, total, totalPages } = await wpJson(url);
  const items = Array.isArray(data) ? (data as WpRawPost[]).map((p) => mapPost(type, p)) : [];
  return { items, total, totalPages };
}

/** Fetch a single published item by slug (full content + embedded terms). */
export async function fetchBySlug(type: CmsType, slug: string): Promise<CmsArticle | null> {
  const rest = cmsTypeMeta(type).rest;
  const query = buildQuery({ slug, per_page: 1, _embed: "wp:term" });
  const url = `${WP_V2}/${rest}${query}`;
  const { data } = await wpJson(url);
  const first = Array.isArray(data) ? (data[0] as WpRawPost | undefined) : undefined;
  return first ? mapPost(type, first) : null;
}
