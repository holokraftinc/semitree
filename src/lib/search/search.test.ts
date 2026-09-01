import { describe, expect, it } from "vitest";
import { buildSearchIndex, search } from "./index";

const index = buildSearchIndex();

describe("global search", () => {
  it("indexes all four content types", () => {
    const types = new Set(index.map((d) => d.type));
    expect(types.has("tool")).toBe(true);
    expect(types.has("lesson")).toBe(true);
    expect(types.has("concept")).toBe(true);
    expect(types.has("resource")).toBe(true);
  });

  it("is case-insensitive", () => {
    const lower = search("reynolds", index).map((r) => r.id);
    const upper = search("REYNOLDS", index).map((r) => r.id);
    expect(lower).toEqual(upper);
    expect(lower.length).toBeGreaterThan(0);
  });

  it("supports partial matches", () => {
    const results = search("reyn", index);
    expect(results.some((r) => r.title.toLowerCase().includes("reynolds"))).toBe(
      true,
    );
  });

  it("ranks a matching tool above a matching concept for the same query", () => {
    const results = search("reynolds number", index);
    const toolIdx = results.findIndex((r) => r.type === "tool");
    const conceptIdx = results.findIndex((r) => r.type === "concept");
    expect(toolIdx).toBeGreaterThanOrEqual(0);
    expect(conceptIdx).toBeGreaterThanOrEqual(0);
    expect(toolIdx).toBeLessThan(conceptIdx);
  });

  it("finds results across types for a broad term", () => {
    const results = search("diffusion", index);
    const types = new Set(results.map((r) => r.type));
    expect(types.has("tool")).toBe(true);
    expect(types.has("concept")).toBe(true);
    expect(types.has("lesson")).toBe(true);
  });

  it("matches keyword/description text, not just titles", () => {
    // "single-cell" appears in the Poisson tool/concept text, not every title.
    const results = search("single-cell", index);
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns nothing for empty or non-matching queries", () => {
    expect(search("", index)).toHaveLength(0);
    expect(search("   ", index)).toHaveLength(0);
    expect(search("zzzznotathing", index)).toHaveLength(0);
  });

  it("respects the result limit", () => {
    expect(search("a", index, 3).length).toBeLessThanOrEqual(3);
  });
});
