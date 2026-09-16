import { describe, expect, it } from "vitest";
import { EQUIPMENT_TOPICS, getEquipmentTopic } from "./equipment-topics";
import { getSemiLesson } from "./semi-lessons";
import { getEquipmentCategory } from "./equipment-map";

describe("Equipment topics", () => {
  it("has unique slugs, titles and summaries", () => {
    const slugs = new Set(EQUIPMENT_TOPICS.map((t) => t.slug));
    expect(slugs.size).toBe(EQUIPMENT_TOPICS.length);
    for (const t of EQUIPMENT_TOPICS) {
      expect(t.title.trim().length).toBeGreaterThan(0);
      expect(t.summary.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes the representative lithography topic with core sections", () => {
    const litho = getEquipmentTopic("lithography");
    expect(litho).toBeDefined();
    expect(litho!.quickAnswer).toBeTruthy();
    expect(litho!.howItWorks?.length).toBeGreaterThan(0);
    expect(litho!.subsystems?.length).toBeGreaterThan(0);
    expect(litho!.parameters?.length).toBeGreaterThan(0);
    // Values-are-vendor-dependent caveat present (no fabricated specs).
    expect(litho!.parametersNote).toBeTruthy();
  });

  it("only cross-links lesson slugs that exist", () => {
    for (const t of EQUIPMENT_TOPICS) {
      for (const slug of [...(t.relatedConceptLessons ?? []), ...(t.relatedProcessLessons ?? [])]) {
        expect(getSemiLesson(slug), `missing lesson: ${slug}`).toBeDefined();
      }
    }
  });

  it("topic categoryId (if set) resolves to a real equipment category", () => {
    for (const t of EQUIPMENT_TOPICS) {
      if (t.categoryId) {
        expect(getEquipmentCategory(t.categoryId), `bad categoryId: ${t.categoryId}`).toBeDefined();
      }
    }
  });
});
