import { describe, expect, it } from "vitest";
import {
  EQUIPMENT_JOURNEY,
  EQUIPMENT_CATEGORIES,
  getEquipmentCategory,
} from "./equipment-map";
import { getSemiLesson } from "./semi-lessons";

describe("Equipment map", () => {
  it("fills what/where/why for every category", () => {
    expect(EQUIPMENT_CATEGORIES.length).toBeGreaterThan(0);
    for (const c of EQUIPMENT_CATEGORIES) {
      for (const f of [c.title, c.what, c.where, c.why]) {
        expect(f.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("every non-coming-soon category reuses existing lessons; gaps have none", () => {
    for (const c of EQUIPMENT_CATEGORIES) {
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

  it("every journey stage maps to a real category (or is an unlinked note)", () => {
    for (const s of EQUIPMENT_JOURNEY) {
      expect(s.label.trim().length).toBeGreaterThan(0);
      if (s.categoryId) {
        expect(getEquipmentCategory(s.categoryId), `bad categoryId: ${s.categoryId}`).toBeDefined();
      }
    }
  });
});
