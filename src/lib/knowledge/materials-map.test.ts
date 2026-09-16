import { describe, expect, it } from "vitest";
import {
  MATERIALS_JOURNEY,
  MATERIAL_CATEGORIES,
  getMaterialCategory,
} from "./materials-map";
import { getSemiLesson } from "./semi-lessons";
import { getEquipmentTopic } from "./equipment-topics";
import { getMaterialTopic } from "./material-topics";

describe("Materials map", () => {
  it("has unique category ids and fills what/where/why", () => {
    const ids = new Set(MATERIAL_CATEGORIES.map((c) => c.id));
    expect(ids.size).toBe(MATERIAL_CATEGORIES.length);
    for (const c of MATERIAL_CATEGORIES) {
      for (const f of [c.title, c.what, c.where, c.why]) {
        expect(f.trim().length, `empty field in ${c.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("every non-coming-soon category is reachable (lessons or topics); gaps have neither", () => {
    for (const c of MATERIAL_CATEGORIES) {
      if (c.comingSoon) {
        expect(c.lessons.length, `${c.id} is Soon but lists lessons`).toBe(0);
        expect(c.topics?.length ?? 0, `${c.id} is Soon but lists topics`).toBe(0);
      } else {
        const reachable = c.lessons.length + (c.topics?.length ?? 0);
        expect(reachable, `${c.id} has no lessons or topics`).toBeGreaterThan(0);
        for (const slug of c.lessons) {
          expect(getSemiLesson(slug), `missing lesson: ${slug}`).toBeDefined();
        }
      }
    }
  });

  it("category topic links resolve to real material topics", () => {
    for (const c of MATERIAL_CATEGORIES) {
      for (const tp of c.topics ?? []) {
        expect(getMaterialTopic(tp.slug), `missing material topic: ${tp.slug}`).toBeDefined();
      }
    }
  });

  it("only cross-links equipment topics that exist", () => {
    for (const c of MATERIAL_CATEGORIES) {
      for (const e of c.equipment ?? []) {
        expect(getEquipmentTopic(e.slug), `missing equipment topic: ${e.slug}`).toBeDefined();
      }
    }
  });

  it("every journey stage maps to a real category (or is an unlinked note)", () => {
    for (const s of MATERIALS_JOURNEY) {
      expect(s.label.trim().length).toBeGreaterThan(0);
      if (s.categoryId) {
        expect(getMaterialCategory(s.categoryId), `bad categoryId: ${s.categoryId}`).toBeDefined();
      }
    }
  });
});
