import { describe, expect, it } from "vitest";
import {
  SUPPLY_STAGES,
  SEGMENTS,
  getStage,
  stageNeighbors,
  flowBySegment,
  stageEquipment,
  stageMaterials,
} from "./supply-chain";
import { SEMI_LESSONS } from "./semi-lessons";
import { MFG_PROCESSES } from "./manufacturing";
import { SEMI_TOOLS } from "@/lib/data/semi-tools";
import { COMPANY_TYPE_LABELS } from "@/lib/industry/types";
import { companiesForTypes } from "@/lib/industry/companies";

const lessonSlugs = new Set(SEMI_LESSONS.map((l) => l.slug));
const processSlugs = new Set(MFG_PROCESSES.map((p) => p.slug));
const toolSlugs = new Set(SEMI_TOOLS.map((t) => t.slug));

describe("supply chain stages", () => {
  it("has 12 stages with contiguous 1..N ordering and unique slugs", () => {
    expect(SUPPLY_STAGES.length).toBe(12);
    expect(SUPPLY_STAGES.map((s) => s.order)).toEqual(
      Array.from({ length: 12 }, (_, i) => i + 1),
    );
    expect(new Set(SUPPLY_STAGES.map((s) => s.slug)).size).toBe(12);
  });

  it("every stage has the required aspect content", () => {
    for (const s of SUPPLY_STAGES) {
      expect(s.whatHappens.length).toBeGreaterThan(0);
      expect(s.participants.length).toBeGreaterThan(0);
      expect(s.technologies.length).toBeGreaterThan(0);
      expect(s.skills.length).toBeGreaterThan(0);
      expect(s.researchThemes.length).toBeGreaterThan(0);
    }
  });

  it("cross-links resolve to real processes, concepts, and tools", () => {
    for (const s of SUPPLY_STAGES) {
      for (const p of s.relatedProcesses ?? []) expect(processSlugs.has(p)).toBe(true);
      for (const c of s.relatedConcepts ?? []) expect(lessonSlugs.has(c.slug)).toBe(true);
      for (const t of s.relatedTools ?? []) expect(toolSlugs.has(t)).toBe(true);
    }
  });

  it("company types are valid and resolve against the registry", () => {
    for (const s of SUPPLY_STAGES) {
      for (const t of s.companyTypes) expect(COMPANY_TYPE_LABELS[t]).toBeDefined();
    }
    // Manufacturing-facing stages have at least one company in the directory.
    expect(companiesForTypes(getStage("fab")!.companyTypes).length).toBeGreaterThan(0);
    expect(companiesForTypes(getStage("semiconductor-equipment")!.companyTypes).length).toBeGreaterThan(0);
  });

  it("derives equipment/materials from linked processes when not explicit", () => {
    const wp = getStage("wafer-processing")!;
    expect(wp.equipment).toBeUndefined();
    const eq = stageEquipment(wp);
    const mat = stageMaterials(wp);
    expect(eq.length).toBeGreaterThan(0);
    expect(mat.length).toBeGreaterThan(0);
    // Derived equipment should include an item from a linked process.
    const litho = MFG_PROCESSES.find((p) => p.slug === "lithography")!;
    expect(eq.some((e) => litho.equipment.includes(e))).toBe(true);
  });

  it("uses explicit equipment/materials when provided (e.g. fab)", () => {
    const fab = getStage("fab")!;
    expect(fab.equipment).toBeDefined();
    expect(stageEquipment(fab)).toEqual(fab.equipment);
  });

  it("neighbors chain correctly across the flow", () => {
    const first = SUPPLY_STAGES[0];
    const last = SUPPLY_STAGES[SUPPLY_STAGES.length - 1];
    expect(stageNeighbors(first.slug).prev).toBeUndefined();
    expect(stageNeighbors(last.slug).next).toBeUndefined();
    for (let i = 1; i < SUPPLY_STAGES.length - 1; i++) {
      const { prev, next } = stageNeighbors(SUPPLY_STAGES[i].slug);
      expect(prev?.slug).toBe(SUPPLY_STAGES[i - 1].slug);
      expect(next?.slug).toBe(SUPPLY_STAGES[i + 1].slug);
    }
    expect(stageNeighbors("nope")).toEqual({});
  });

  it("flowBySegment covers every stage exactly once, in order", () => {
    const flow = flowBySegment();
    expect(flow.map((f) => f.segment.id)).toEqual(SEGMENTS.map((s) => s.id));
    const flat = flow.flatMap((f) => f.stages);
    expect(flat.map((s) => s.slug)).toEqual(SUPPLY_STAGES.map((s) => s.slug));
  });

  it("example chains only point at real internal routes", () => {
    for (const s of SUPPLY_STAGES) {
      for (const link of s.exampleChain ?? []) {
        if (link.href && link.href.startsWith("/manufacturing/")) {
          const slug = link.href.replace("/manufacturing/", "");
          expect(processSlugs.has(slug)).toBe(true);
        }
      }
    }
  });
});
