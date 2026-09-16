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

  it("includes the core materials path with populated sections", () => {
    const core = [
      "silicon",
      "silicon-wafers",
      "soi",
      "silicon-dioxide",
      "silicon-nitride",
      "high-k-dielectrics",
      "low-k-dielectrics",
      "copper",
      "aluminum",
      "tungsten",
    ];
    for (const slug of core) {
      const topic = getMaterialTopic(slug);
      expect(topic, `missing topic: ${slug}`).toBeDefined();
      expect(topic!.quickAnswer).toBeTruthy();
      expect(topic!.properties?.length, `no properties: ${slug}`).toBeGreaterThan(0);
      // Values-depend-on-conditions caveat present (no fabricated specs).
      expect(topic!.propertiesNote, `no propertiesNote: ${slug}`).toBeTruthy();
    }
  });

  it("includes the process-materials path with populated sections", () => {
    const process = [
      "photoresist",
      "developers",
      "deposition-precursors",
      "process-gases",
      "etch-chemistry",
      "cmp-slurries",
      "cmp-pads",
      "cleaning-chemicals",
      "specialty-process-materials",
    ];
    for (const slug of process) {
      const topic = getMaterialTopic(slug);
      expect(topic, `missing topic: ${slug}`).toBeDefined();
      expect(topic!.quickAnswer).toBeTruthy();
      expect(topic!.properties?.length, `no properties: ${slug}`).toBeGreaterThan(0);
      expect(topic!.propertiesNote, `no propertiesNote: ${slug}`).toBeTruthy();
      // The equipment + materials + conditions + control + metrology idea is present.
      expect(topic!.performance?.length, `no performance: ${slug}`).toBeGreaterThan(0);
    }
  });

  it("includes the packaging-materials path with populated sections", () => {
    const packaging = [
      "package-substrates",
      "solder-materials",
      "bump-materials",
      "underfill",
      "molding-compounds",
      "die-attach-materials",
      "bonding-materials",
      "thermal-interface-materials",
      "heat-spreader-materials",
      "packaging-dielectric-materials",
    ];
    for (const slug of packaging) {
      const topic = getMaterialTopic(slug);
      expect(topic, `missing topic: ${slug}`).toBeDefined();
      expect(topic!.quickAnswer).toBeTruthy();
      expect(topic!.properties?.length, `no properties: ${slug}`).toBeGreaterThan(0);
      expect(topic!.categoryId).toBe("packaging-materials");
      // Established vs emerging technologies are distinguished.
      expect(topic!.advanced?.length, `no advanced: ${slug}`).toBeGreaterThan(0);
    }
  });

  it("learning loops (where present) have 3-5 key ideas and a takeaway", () => {
    for (const t of MATERIAL_TOPICS) {
      if (!t.learningLoop) continue;
      expect(t.learningLoop.youJustLearned.length, `${t.slug} loop`).toBeGreaterThanOrEqual(3);
      expect(t.learningLoop.youJustLearned.length, `${t.slug} loop`).toBeLessThanOrEqual(5);
      expect(t.learningLoop.nowYouKnow.trim().length, `${t.slug} takeaway`).toBeGreaterThan(0);
    }
  });

  it("every diagram answers a question (has a caption)", () => {
    for (const t of MATERIAL_TOPICS) {
      if (t.diagram) {
        expect(t.diagramCaption?.trim().length, `${t.slug} diagram caption`).toBeGreaterThan(0);
      }
    }
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
