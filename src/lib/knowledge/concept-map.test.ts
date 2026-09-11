import { describe, expect, it } from "vitest";
import { CONCEPT_CLUSTERS, START_HERE } from "./concept-map";
import { getSemiLesson } from "./semi-lessons";

describe("Concept map", () => {
  it("has the expected clusters in order", () => {
    expect(CONCEPT_CLUSTERS.map((c) => c.id)).toEqual([
      "foundations",
      "devices",
      "logic",
      "memory",
      "advanced",
    ]);
    for (const c of CONCEPT_CLUSTERS) {
      expect(c.understand.trim().length).toBeGreaterThan(0);
      expect(c.audience.trim().length).toBeGreaterThan(0);
      expect(c.topics.length).toBeGreaterThan(0);
    }
  });

  it("start-here points at a real lesson", () => {
    expect(getSemiLesson(START_HERE.lessonSlug)).toBeDefined();
  });

  it("every available (non-coming-soon) topic reuses an existing lesson", () => {
    for (const c of CONCEPT_CLUSTERS) {
      for (const t of c.topics) {
        if (t.comingSoon) {
          expect(t.lessonSlug, `${t.label} is Soon but has a slug`).toBeUndefined();
        } else {
          expect(t.lessonSlug, `${t.label} has no slug`).toBeTruthy();
          expect(getSemiLesson(t.lessonSlug!), `missing lesson: ${t.lessonSlug}`).toBeDefined();
        }
      }
    }
  });
});
