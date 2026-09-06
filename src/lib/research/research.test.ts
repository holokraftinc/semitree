import { describe, expect, it } from "vitest";
import {
  RESEARCH_TOPICS,
  RESEARCH_RESOURCES,
  SECTIONS,
  getTopic,
  resourcesByType,
  facetOptions,
  topicsForFacet,
  FACET_DEFS,
} from "./registry";
import { SEMI_LESSONS } from "@/lib/knowledge/semi-lessons";
import { MFG_PROCESSES } from "@/lib/knowledge/manufacturing";
import { SEMI_TOOLS } from "@/lib/data/semi-tools";
import { COMPANIES } from "@/lib/industry/companies";

const lessonSlugs = new Set(SEMI_LESSONS.map((l) => l.slug));
const processSlugs = new Set(MFG_PROCESSES.map((p) => p.slug));
const toolSlugs = new Set(SEMI_TOOLS.map((t) => t.slug));
const companySlugs = new Set(COMPANIES.map((c) => c.slug));

describe("research resources (no fabrication)", () => {
  it("papers, patents, and researchers are empty (verified sources only)", () => {
    expect(resourcesByType("paper")).toHaveLength(0);
    expect(resourcesByType("patent")).toHaveLength(0);
    expect(resourcesByType("researcher")).toHaveLength(0);
  });

  it("seeded resources are marked verified and have unique ids", () => {
    expect(RESEARCH_RESOURCES.length).toBeGreaterThan(0);
    expect(new Set(RESEARCH_RESOURCES.map((r) => r.id)).size).toBe(RESEARCH_RESOURCES.length);
    for (const r of RESEARCH_RESOURCES) {
      expect(r.verified).toBe(true);
      expect(r.title.length).toBeGreaterThan(0);
    }
  });

  it("every resource url (when present) is an absolute https URL", () => {
    for (const r of RESEARCH_RESOURCES) {
      if (r.url) expect(r.url.startsWith("https://")).toBe(true);
    }
  });

  it("seeds journals, conferences, universities, and labs", () => {
    expect(resourcesByType("journal").length).toBeGreaterThan(0);
    expect(resourcesByType("conference").length).toBeGreaterThan(0);
    expect(resourcesByType("university").length).toBeGreaterThan(0);
    expect(resourcesByType("lab").length).toBeGreaterThan(0);
  });

  it("SECTIONS covers all eight required sections", () => {
    const labels = SECTIONS.map((s) => s.label);
    for (const l of ["Papers", "Patents", "Journals", "Conferences", "Research labs", "Universities", "Research topics", "Researchers"]) {
      expect(labels).toContain(l);
    }
  });
});

describe("research topics + interlinks", () => {
  it("topics have unique slugs and required content", () => {
    expect(new Set(RESEARCH_TOPICS.map((t) => t.slug)).size).toBe(RESEARCH_TOPICS.length);
    for (const t of RESEARCH_TOPICS) {
      expect(t.summary.length).toBeGreaterThan(0);
      expect(t.description.length).toBeGreaterThan(0);
      expect(t.technologies.length).toBeGreaterThan(0);
    }
  });

  it("all interlinks resolve to real Semitree entities", () => {
    for (const t of RESEARCH_TOPICS) {
      for (const c of t.relatedConcepts) expect(lessonSlugs.has(c.slug)).toBe(true);
      for (const p of t.relatedProcesses) expect(processSlugs.has(p)).toBe(true);
      for (const tl of t.relatedTools) expect(toolSlugs.has(tl)).toBe(true);
      for (const co of t.relatedCompanies) expect(companySlugs.has(co)).toBe(true);
    }
  });

  it("getTopic resolves and rejects unknowns", () => {
    for (const t of RESEARCH_TOPICS) expect(getTopic(t.slug)?.name).toBe(t.name);
    expect(getTopic("nope")).toBeUndefined();
  });
});

describe("discovery facets", () => {
  it("every facet yields options that each match at least one topic", () => {
    for (const f of FACET_DEFS) {
      const opts = facetOptions(f.key);
      expect(opts.length).toBeGreaterThan(0);
      for (const o of opts) {
        expect(topicsForFacet(f.key, o.value).length).toBeGreaterThan(0);
      }
    }
  });

  it("process and company facet labels resolve to real names", () => {
    const proc = facetOptions("process");
    expect(proc.every((o) => processSlugs.has(o.value))).toBe(true);
    const co = facetOptions("company");
    expect(co.every((o) => companySlugs.has(o.value))).toBe(true);
  });
});
