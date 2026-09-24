import { describe, expect, it } from "vitest";
import { MANUFACTURING_JOURNEY, getJourneyStep, JOURNEY_NOTE } from "./manufacturing-journey";

describe("Manufacturing journey", () => {
  it("has unique, labelled steps and a caveat note", () => {
    const ids = new Set(MANUFACTURING_JOURNEY.map((s) => s.id));
    expect(ids.size).toBe(MANUFACTURING_JOURNEY.length);
    for (const s of MANUFACTURING_JOURNEY) {
      expect(s.id.trim().length).toBeGreaterThan(0);
      expect(s.label.trim().length).toBeGreaterThan(0);
    }
    // The four topics' anchor steps exist in the map.
    for (const id of ["lithography", "etching", "deposition", "doping", "packaging"]) {
      expect(getJourneyStep(id), `missing journey step: ${id}`).toBeDefined();
    }
    expect(JOURNEY_NOTE.toLowerCase()).toContain("repeat");
  });
});
