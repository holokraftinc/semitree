import { describe, expect, it } from "vitest";
import { PACKAGING_TERMS, POST_FAB_FLOW, PACKAGING_LADDER } from "./packaging-flow";
import { getSemiLesson } from "./semi-lessons";

describe("Packaging flow", () => {
  it("defines the key jargon terms before they're used", () => {
    const terms = PACKAGING_TERMS.map((t) => t.term.toLowerCase()).join(" | ");
    for (const needed of ["die", "substrate", "bump", "interposer", "tsv", "chiplet", "fan-out", "hybrid bonding"]) {
      expect(terms, `missing term: ${needed}`).toContain(needed);
    }
    for (const t of PACKAGING_TERMS) expect(t.definition.trim().length).toBeGreaterThan(0);
  });

  it("has an ordered post-fab flow and complexity ladder", () => {
    POST_FAB_FLOW.forEach((s, i) => expect(s.order).toBe(i + 1));
    PACKAGING_LADDER.forEach((a, i) => expect(a.order).toBe(i + 1));
    expect(PACKAGING_LADDER.map((a) => a.slug)).toEqual([
      "traditional",
      "flip-chip",
      "wafer-level",
      "2-5d",
      "chiplets",
      "3d",
      "heterogeneous",
    ]);
  });

  it("fills every ladder field (what/why/how/tradeoffs/whereUsed)", () => {
    for (const a of PACKAGING_LADDER) {
      for (const f of [a.title, a.what, a.why, a.how, a.tradeoffs, a.whereUsed]) {
        expect(f.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("only reuses lesson slugs that exist (no broken links)", () => {
    const slugs = [
      ...POST_FAB_FLOW.flatMap((s) => s.lessons),
      ...PACKAGING_LADDER.flatMap((a) => a.lessons),
    ];
    for (const slug of slugs) {
      expect(getSemiLesson(slug), `missing lesson: ${slug}`).toBeDefined();
    }
  });

  it("uses only internal, absolute-path extra links", () => {
    for (const a of PACKAGING_LADDER) {
      for (const l of a.links ?? []) {
        expect(l.href.startsWith("/"), `bad link: ${l.href}`).toBe(true);
      }
    }
  });
});
