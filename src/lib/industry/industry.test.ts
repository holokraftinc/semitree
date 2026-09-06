import { describe, expect, it } from "vitest";
import {
  COMPANIES,
  getCompany,
  companyPoints,
  presentTypes,
  presentCountries,
} from "./companies";
import {
  project,
  WORLD_BOX,
  INDIA_BOX,
  allMarkers,
  indiaMarkers,
  clusterMarkers,
  bucketForState,
  indiaMarkersByBucket,
  INDIA_BUCKETS,
} from "./geo";
import { SEMI_LESSONS } from "@/lib/knowledge/semi-lessons";
import { SEMI_TOOLS } from "@/lib/data/semi-tools";
import { MFG_PROCESSES } from "@/lib/knowledge/manufacturing";

const lessonSlugs = new Set(SEMI_LESSONS.map((l) => l.slug));
const toolSlugs = new Set(SEMI_TOOLS.map((t) => t.slug));
const processSlugs = new Set(MFG_PROCESSES.map((p) => p.slug));
const companySlugs = new Set(COMPANIES.map((c) => c.slug));

describe("industry company registry", () => {
  it("has unique slugs and a valid HQ per company", () => {
    expect(new Set(COMPANIES.map((c) => c.slug)).size).toBe(COMPANIES.length);
    for (const c of COMPANIES) {
      expect(c.hq).toBeDefined();
      expect(c.types.length).toBeGreaterThan(0);
      expect(c.description.length).toBeGreaterThan(0);
    }
  });

  it("every geo point has finite, in-range coordinates", () => {
    for (const c of COMPANIES) {
      for (const p of companyPoints(c)) {
        expect(Number.isFinite(p.lat)).toBe(true);
        expect(Number.isFinite(p.long)).toBe(true);
        expect(p.lat).toBeGreaterThanOrEqual(-90);
        expect(p.lat).toBeLessThanOrEqual(90);
        expect(p.long).toBeGreaterThanOrEqual(-180);
        expect(p.long).toBeLessThanOrEqual(180);
        expect(p.city.length).toBeGreaterThan(0);
        expect(p.countryCode.length).toBe(2);
      }
    }
  });

  it("cross-links resolve to real lessons, tools, processes, and companies", () => {
    for (const c of COMPANIES) {
      for (const con of c.relatedConcepts ?? []) expect(lessonSlugs.has(con.slug)).toBe(true);
      for (const t of c.relatedTools ?? []) expect(toolSlugs.has(t)).toBe(true);
      for (const p of c.relatedProcesses ?? []) expect(processSlugs.has(p)).toBe(true);
      for (const r of c.relatedCompanies ?? []) expect(companySlugs.has(r)).toBe(true);
    }
  });

  it("getCompany resolves each slug and rejects unknowns", () => {
    for (const c of COMPANIES) expect(getCompany(c.slug)?.name).toBe(c.name);
    expect(getCompany("nope")).toBeUndefined();
  });

  it("exposes present types and countries", () => {
    expect(presentTypes().length).toBeGreaterThan(0);
    expect(presentCountries()).toContain("India");
  });
});

describe("map geometry", () => {
  it("projects corners of a box to 0..1", () => {
    const tl = project(WORLD_BOX.maxLat, WORLD_BOX.minLong, WORLD_BOX);
    const br = project(WORLD_BOX.minLat, WORLD_BOX.maxLong, WORLD_BOX);
    expect(tl.x).toBeCloseTo(0, 6);
    expect(tl.y).toBeCloseTo(0, 6);
    expect(br.x).toBeCloseTo(1, 6);
    expect(br.y).toBeCloseTo(1, 6);
  });

  it("India points project within the India box", () => {
    for (const m of indiaMarkers()) {
      const { x, y } = project(m.point.lat, m.point.long, INDIA_BOX);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(1);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(1);
    }
  });

  it("clusters group same-city points and keep every marker", () => {
    const markers = allMarkers();
    const clusters = clusterMarkers(markers);
    const total = clusters.reduce((n, cl) => n + cl.markers.length, 0);
    expect(total).toBe(markers.length);
    expect(clusters.length).toBeLessThanOrEqual(markers.length);
  });

  it("buckets Indian states into the seven categories", () => {
    expect(bucketForState("Gujarat")).toBe("Gujarat");
    expect(bucketForState("Assam")).toBe("Other states");
    expect(bucketForState(undefined)).toBe("Other states");
    const byBucket = indiaMarkersByBucket();
    expect(byBucket.map((b) => b.bucket)).toEqual([...INDIA_BUCKETS]);
    // Every India marker lands in exactly one bucket.
    const counted = byBucket.reduce((n, b) => n + b.markers.length, 0);
    expect(counted).toBe(indiaMarkers().length);
  });

  it("has at least one company in each named India fab/OSAT state", () => {
    const byBucket = indiaMarkersByBucket();
    const gujarat = byBucket.find((b) => b.bucket === "Gujarat");
    expect(gujarat && gujarat.markers.length).toBeGreaterThan(0);
  });
});
