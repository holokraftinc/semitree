import { describe, expect, it } from "vitest";
import {
  PROCESS_LINKS,
  getProcessLinkForEquipment,
  getProcessLinkForMaterial,
} from "./process-links";
import { getProcess } from "./manufacturing";
import { getSemiLesson } from "./semi-lessons";
import { getEquipmentTopic } from "./equipment-topics";
import { getMaterialTopic } from "./material-topics";

describe("Process links", () => {
  it("has unique keys and required fields", () => {
    const keys = new Set(PROCESS_LINKS.map((l) => l.key));
    expect(keys.size).toBe(PROCESS_LINKS.length);
    for (const l of PROCESS_LINKS) {
      expect(l.process.trim().length).toBeGreaterThan(0);
      expect(l.affects.trim().length).toBeGreaterThan(0);
      expect(l.equipment.length, `${l.key} has no equipment`).toBeGreaterThan(0);
      expect(l.metrology.length, `${l.key} has no metrology`).toBeGreaterThan(0);
    }
  });

  it("only references entities that actually exist (no artificial relationships)", () => {
    for (const l of PROCESS_LINKS) {
      if (l.manufacturingSlug) {
        expect(getProcess(l.manufacturingSlug), `missing mfg: ${l.manufacturingSlug}`).toBeDefined();
      }
      if (l.conceptLesson) {
        expect(getSemiLesson(l.conceptLesson), `missing lesson: ${l.conceptLesson}`).toBeDefined();
      }
      for (const e of [...l.equipment, ...l.metrology]) {
        expect(getEquipmentTopic(e.slug), `missing equipment topic: ${e.slug}`).toBeDefined();
      }
      for (const m of l.materials) {
        expect(getMaterialTopic(m.slug), `missing material topic: ${m.slug}`).toBeDefined();
      }
    }
  });

  it("resolves reverse lookups for equipment and materials", () => {
    expect(getProcessLinkForEquipment("lithography")?.key).toBe("lithography");
    expect(getProcessLinkForEquipment("cmp")?.key).toBe("cmp");
    // Metrology equipment participates in a process link too.
    expect(getProcessLinkForEquipment("metrology")).toBeDefined();
    expect(getProcessLinkForMaterial("photoresist")?.key).toBe("lithography");
    expect(getProcessLinkForMaterial("cmp-slurries")?.key).toBe("cmp");
    // An unrelated slug returns nothing.
    expect(getProcessLinkForEquipment("does-not-exist")).toBeUndefined();
  });
});
