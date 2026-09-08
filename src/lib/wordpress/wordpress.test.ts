import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchList, fetchBySlug, WpError } from "./client";
import { mapPost, stripHtml, sanitizeHtml } from "./map";
import { WORDPRESS_API_URL, WP_V2, isCmsType } from "./config";
import type { WpRawPost } from "./types";

const rawPost: WpRawPost = {
  id: 42,
  slug: "advanced-packaging",
  date: "2026-09-01T00:00:00",
  modified: "2026-09-02T00:00:00",
  title: { rendered: "Advanced &amp; packaging" },
  excerpt: { rendered: "<p>Beyond <b>scaling</b>.</p>" },
  content: { rendered: "<p>Body</p><script>alert(1)</script>" },
  meta: { st_reading_time: 6, st_subtitle: "Integrate smarter" },
  st_featured_image: { id: 7, url: "https://cms.example/img.jpg", alt: "chip" },
  st_author: { id: 3, name: "Semitree", slug: "semitree" },
  st_seo: { title: "SEO title", description: "SEO desc", canonical: "https://semitree.in/articles/advanced-packaging", og_title: "", og_description: "", social_image: null },
  _embedded: {
    "wp:term": [
      [{ taxonomy: "st_domain", name: "Advanced Packaging", slug: "advanced-packaging" }],
      [{ taxonomy: "st_tag", name: "Chiplets", slug: "chiplets" }],
    ],
  },
};

function mockFetch(body: unknown, headers: Record<string, string> = {}, ok = true, status = 200) {
  return vi.fn(async () =>
    ({
      ok,
      status,
      headers: { get: (k: string) => headers[k] ?? null },
      json: async () => body,
    }) as unknown as Response,
  );
}

beforeEach(() => {
  // Isolate module cache between tests by clearing sessionStorage + fresh spies.
  if (typeof window !== "undefined") window.sessionStorage?.clear?.();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("config", () => {
  it("derives the WP v2 base from the API URL and validates types", () => {
    expect(WP_V2).toBe(`${WORDPRESS_API_URL}/wp-json/wp/v2`);
    expect(isCmsType("articles")).toBe(true);
    expect(isCmsType("nope")).toBe(false);
  });
});

describe("mapPost", () => {
  it("normalizes a raw WP post into a CmsArticle", () => {
    const a = mapPost("articles", rawPost);
    expect(a.title).toBe("Advanced & packaging"); // entities decoded
    expect(a.excerpt).toBe("Beyond scaling."); // tags stripped
    expect(a.contentHtml).not.toContain("<script>"); // sanitized
    expect(a.readingTime).toBe(6);
    expect(a.author?.name).toBe("Semitree");
    expect(a.featuredImage?.url).toBe("https://cms.example/img.jpg");
    expect(a.seo?.canonical).toBe("https://semitree.in/articles/advanced-packaging");
    expect(a.terms.domains).toContain("Advanced Packaging");
    expect(a.terms.tags).toContain("Chiplets");
    expect(a.fields.st_subtitle).toBe("Integrate smarter");
  });

  it("strips and sanitizes helpers behave", () => {
    expect(stripHtml("<p>a &amp; b</p>")).toBe("a & b");
    expect(sanitizeHtml('<a href="javascript:x" onclick="y">t</a>')).not.toMatch(/javascript:|onclick/);
  });
});

describe("fetchList", () => {
  it("requests the right endpoint with lightweight fields + pagination, and maps items", async () => {
    const spy = mockFetch([rawPost], { "X-WP-Total": "5", "X-WP-TotalPages": "1" });
    vi.stubGlobal("fetch", spy);

    const res = await fetchList("news", { page: 2, perPage: 3, search: "euv" });
    const calledUrl = (spy.mock.calls[0] as unknown as string[])[0];

    expect(calledUrl).toContain(`${WP_V2}/news`);
    expect(calledUrl).toContain("per_page=3");
    expect(calledUrl).toContain("page=2");
    expect(calledUrl).toContain("search=euv");
    expect(calledUrl).toContain("_fields="); // never pulls the whole DB
    expect(res.total).toBe(5);
    expect(res.items[0].type).toBe("news");
    expect(res.items[0].slug).toBe("advanced-packaging");
  });

  it("throws a WpError on a non-OK response with no cache", async () => {
    vi.stubGlobal("fetch", mockFetch("Unauthorized", {}, false, 401));
    await expect(fetchList("explainers", { search: "unique-miss-1" })).rejects.toBeInstanceOf(WpError);
  });
});

describe("fetchBySlug", () => {
  it("queries by slug with embedded terms and returns a single item", async () => {
    const spy = mockFetch([rawPost], {});
    vi.stubGlobal("fetch", spy);
    const item = await fetchBySlug("articles", "advanced-packaging");
    const url = (spy.mock.calls[0] as unknown as string[])[0];
    expect(url).toContain("slug=advanced-packaging");
    expect(url).toContain("_embed=wp%3Aterm");
    expect(item?.slug).toBe("advanced-packaging");
  });

  it("returns null when no post matches", async () => {
    vi.stubGlobal("fetch", mockFetch([], {}));
    const item = await fetchBySlug("articles", "does-not-exist-xyz");
    expect(item).toBeNull();
  });
});

describe("caching + dedup", () => {
  it("dedupes concurrent identical requests into one fetch", async () => {
    const spy = mockFetch([rawPost], { "X-WP-Total": "1", "X-WP-TotalPages": "1" });
    vi.stubGlobal("fetch", spy);
    const [a, b] = await Promise.all([
      fetchList("research", { search: "dedup-key" }),
      fetchList("research", { search: "dedup-key" }),
    ]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(a.items.length).toBe(b.items.length);
  });

  it("serves stale cache when a later fetch fails", async () => {
    // First call succeeds and caches.
    vi.stubGlobal("fetch", mockFetch([rawPost], { "X-WP-Total": "1", "X-WP-TotalPages": "1" }));
    const first = await fetchList("analysis", { search: "stale-key" });
    expect(first.items.length).toBe(1);

    // Force cache expiry by advancing time beyond TTL, then fail.
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now + 10 * 60 * 1000);
    vi.stubGlobal("fetch", mockFetch("err", {}, false, 500));
    const second = await fetchList("analysis", { search: "stale-key" });
    expect(second.items.length).toBe(1); // fell back to cached content
  });
});
