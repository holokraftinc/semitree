import { describe, expect, it } from "vitest";
import {
  MFG_PROCESSES,
  STAGES,
  getProcess,
  processNeighbors,
  flowByStage,
} from "./manufacturing";
import { SEMI_LESSONS } from "./semi-lessons";
import { SEMI_TOOLS } from "@/lib/data/semi-tools";

const lessonSlugs = new Set(SEMI_LESSONS.map((l) => l.slug));
const toolSlugs = new Set(SEMI_TOOLS.map((t) => t.slug));

describe("manufacturing process model", () => {
  it("has 17 processes with contiguous 1..N ordering", () => {
    expect(MFG_PROCESSES.length).toBe(17);
    const orders = MFG_PROCESSES.map((p) => p.order);
    expect(orders).toEqual(Array.from({ length: 17 }, (_, i) => i + 1));
  });

  it("has unique slugs", () => {
    const slugs = MFG_PROCESSES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every process has the required non-empty content", () => {
    for (const p of MFG_PROCESSES) {
      expect(p.what.length).toBeGreaterThan(0);
      expect(p.why.length).toBeGreaterThan(0);
      expect(p.how.length).toBeGreaterThan(0);
      expect(p.inputs.length).toBeGreaterThan(0);
      expect(p.outputs.length).toBeGreaterThan(0);
      expect(p.criticalParameters.length).toBeGreaterThan(0);
      expect(p.defects.length).toBeGreaterThan(0);
      expect(p.equipment.length).toBeGreaterThan(0);
      expect(p.materials.length).toBeGreaterThan(0);
      expect(p.relatedConcepts.length).toBeGreaterThan(0);
      expect(p.industrySegments.length).toBeGreaterThan(0);
      expect(p.researchThemes.length).toBeGreaterThan(0);
    }
  });

  it("lesson + related-concept slugs resolve to real lessons", () => {
    for (const p of MFG_PROCESSES) {
      if (p.lessonSlug) expect(lessonSlugs.has(p.lessonSlug)).toBe(true);
      for (const c of p.relatedConcepts) {
        expect(lessonSlugs.has(c.slug)).toBe(true);
      }
    }
  });

  it("related tool slugs resolve to real semiconductor tools", () => {
    for (const p of MFG_PROCESSES) {
      for (const slug of p.relatedTools) {
        expect(toolSlugs.has(slug)).toBe(true);
      }
    }
  });

  it("getProcess resolves each slug and rejects unknowns", () => {
    for (const p of MFG_PROCESSES) {
      expect(getProcess(p.slug)?.name).toBe(p.name);
    }
    expect(getProcess("does-not-exist")).toBeUndefined();
  });

  it("neighbors chain correctly across the full flow", () => {
    const first = MFG_PROCESSES[0];
    const last = MFG_PROCESSES[MFG_PROCESSES.length - 1];
    expect(processNeighbors(first.slug).prev).toBeUndefined();
    expect(processNeighbors(first.slug).next?.slug).toBe(MFG_PROCESSES[1].slug);
    expect(processNeighbors(last.slug).next).toBeUndefined();
    // Every middle step points forward and backward consistently.
    for (let i = 1; i < MFG_PROCESSES.length - 1; i++) {
      const { prev, next } = processNeighbors(MFG_PROCESSES[i].slug);
      expect(prev?.slug).toBe(MFG_PROCESSES[i - 1].slug);
      expect(next?.slug).toBe(MFG_PROCESSES[i + 1].slug);
    }
    expect(processNeighbors("unknown")).toEqual({});
  });

  it("flowByStage covers every process exactly once, in order", () => {
    const flow = flowByStage();
    expect(flow.map((f) => f.stage.id)).toEqual(STAGES.map((s) => s.id));
    const flat = flow.flatMap((f) => f.processes);
    expect(flat.map((p) => p.slug)).toEqual(MFG_PROCESSES.map((p) => p.slug));
  });
});
