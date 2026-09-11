import { describe, expect, it } from "vitest";
import { DESIGN_FLOW, DESIGN_PHASE_LABELS } from "./design-flow";
import { getSemiLesson } from "./semi-lessons";

describe("Semiconductor design flow", () => {
  it("has the 12 stages in contiguous order with unique slugs", () => {
    expect(DESIGN_FLOW).toHaveLength(12);
    const slugs = new Set(DESIGN_FLOW.map((s) => s.slug));
    expect(slugs.size).toBe(12);
    DESIGN_FLOW.forEach((s, i) => expect(s.order).toBe(i + 1));
  });

  it("answers every guided question for each stage (no empty fields)", () => {
    for (const s of DESIGN_FLOW) {
      for (const field of [s.title, s.question, s.what, s.why, s.who, s.inputs, s.outputs, s.risks]) {
        expect(field.trim().length).toBeGreaterThan(0);
      }
      expect(DESIGN_PHASE_LABELS[s.phase]).toBeTruthy();
    }
  });

  it("only reuses lesson slugs that actually exist (no broken links)", () => {
    for (const s of DESIGN_FLOW) {
      for (const slug of s.lessons) {
        expect(getSemiLesson(slug), `missing lesson: ${slug}`).toBeDefined();
      }
    }
  });

  it("uses only internal, absolute-path links", () => {
    for (const s of DESIGN_FLOW) {
      for (const l of s.links ?? []) {
        expect(l.href.startsWith("/"), `external/relative link: ${l.href}`).toBe(true);
        expect(l.label.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
