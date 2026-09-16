import { describe, expect, it } from "vitest";
import {
  MATERIALS_JOURNEY,
  MATERIAL_CATEGORIES,
  getMaterialCategory,
} from "./materials-map";
import { getSemiLesson } from "./semi-lessons";
import { getEquipmentTopic } from "./equipment-topics";

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

  it("every non-coming-soon category reuses existing lessons; gaps have none", () => {
    for (const c of MATERIAL_CATEGORIES) {
      if (c.comingSoon) {
        expect(c.lessons.length, `${c.id} is Soon but lists lessons`).toBe(0);
      } else {
        expect(c.lessons.length, `${c.id} has no lessons`).toBeGreaterThan(0);
        for (const slug of c.lessons) {
          expect(getSemiLesson(slug), `missing lesson: ${slug}`).toBeDefined();
        }
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
