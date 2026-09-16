import { describe, expect, it } from "vitest";
import { MATERIAL_TOPICS, getMaterialTopic } from "./material-topics";
import { getSemiLesson } from "./semi-lessons";
import { getMaterialCategory } from "./materials-map";
import { getEquipmentTopic } from "./equipment-topics";

describe("Material topics", () => {
  it("has unique slugs, titles and summaries", () => {
    const slugs = new Set(MATERIAL_TOPICS.map((t) => t.slug));
    expect(slugs.size).toBe(MATERIAL_TOPICS.length);
    for (const t of MATERIAL_TOPICS) {
      expect(t.title.trim().length).toBeGreaterThan(0);
      expect(t.summary.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes the representative silicon topic with core sections", () => {
    const si = getMaterialTopic("silicon");
    expect(si).toBeDefined();
    expect(si!.quickAnswer).toBeTruthy();
    expect(si!.properties?.length).toBeGreaterThan(0);
    expect(si!.parameters?.length).toBeGreaterThan(0);
    // Values-depend-on-conditions caveats present (no fabricated specs).
    expect(si!.propertiesNote).toBeTruthy();
    expect(si!.parametersNote).toBeTruthy();
    // Material selection is taught as a trade-off, with alternatives.
    expect(si!.selectionNote).toBeTruthy();
    expect(si!.alternatives?.length).toBeGreaterThan(0);
  });

  it("only cross-links lesson slugs that exist", () => {
    for (const t of MATERIAL_TOPICS) {
      for (const slug of [...(t.relatedConceptLessons ?? []), ...(t.relatedProcessLessons ?? [])]) {
        expect(getSemiLesson(slug), `missing lesson: ${slug}`).toBeDefined();
      }
    }
  });

  it("topic categoryId (if set) resolves to a real material category", () => {
    for (const t of MATERIAL_TOPICS) {
      if (t.categoryId) {
        expect(getMaterialCategory(t.categoryId), `bad categoryId: ${t.categoryId}`).toBeDefined();
      }
    }
  });

  it("only links equipment topic pages that exist", () => {
    for (const t of MATERIAL_TOPICS) {
      for (const e of t.relatedEquipment ?? []) {
        const slug = e.href?.split("/").pop();
        if (slug) {
          expect(getEquipmentTopic(slug), `missing equipment topic: ${slug}`).toBeDefined();
        }
      }
    }
  });
});
