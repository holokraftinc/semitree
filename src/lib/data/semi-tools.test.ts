import { describe, expect, it } from "vitest";
import {
  SEMI_TOOLS,
  SEMI_CATEGORY_LABELS,
  SEMI_DIFFICULTY_LABELS,
  SEMI_STATUS_LABELS,
  getRelatedSemiToolLinks,
  getSemiToolLearningLinks,
  semiCategorySummaries,
} from "./semi-tools";
import { getSemiLesson } from "@/lib/knowledge/semi-lessons";

describe("semiconductor tools registry", () => {
  const slugs = new Set(SEMI_TOOLS.map((t) => t.slug));

  it("has unique slugs and valid metadata", () => {
    expect(slugs.size).toBe(SEMI_TOOLS.length);
    for (const t of SEMI_TOOLS) {
      expect(t.name.trim().length).toBeGreaterThan(0);
      expect(t.summary.trim().length).toBeGreaterThan(0);
      expect(t.formula.trim().length).toBeGreaterThan(0);
      expect(SEMI_CATEGORY_LABELS[t.category]).toBeDefined();
      expect(SEMI_DIFFICULTY_LABELS[t.difficulty]).toBeDefined();
      expect(SEMI_STATUS_LABELS[t.status]).toBeDefined();
    }
  });

  it("has no dead related-tool links", () => {
    for (const t of SEMI_TOOLS) {
      for (const r of t.relatedTools ?? []) {
        expect(slugs.has(r), `${t.slug} → ${r}`).toBe(true);
      }
    }
  });

  it("only links related tools that are available (never dead links)", () => {
    for (const t of SEMI_TOOLS) {
      for (const link of getRelatedSemiToolLinks(t.slug)) {
        expect(link.href.startsWith("/semiconductors/tools/")).toBe(true);
      }
    }
  });

  it("only references learning topics that actually exist", () => {
    for (const t of SEMI_TOOLS) {
      for (const slug of t.relatedLearning ?? []) {
        expect(getSemiLesson(slug), `${t.slug} → ${slug}`).toBeDefined();
      }
      // Resolved links point at real learn routes.
      for (const link of getSemiToolLearningLinks(t.slug)) {
        expect(link.href.startsWith("/semiconductors/learn/")).toBe(true);
      }
    }
  });

  it("exposes every category for discovery, with correct counts", () => {
    const summaries = semiCategorySummaries();
    // All 13 categories present.
    expect(summaries.length).toBe(Object.keys(SEMI_CATEGORY_LABELS).length);
    for (const s of summaries) {
      const real = SEMI_TOOLS.filter((t) => t.category === s.category && t.status !== "coming-soon").length;
      expect(s.count).toBe(real);
    }
  });
});
