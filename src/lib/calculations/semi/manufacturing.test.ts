import { describe, expect, it } from "vitest";
import { diePerWafer, waferYield } from "./manufacturing";

describe("diePerWafer", () => {
  it("300 mm wafer, 100 mm² die → plausible count", () => {
    // d = 0.3 m, S = 100 mm² = 1e-4 m²
    const r = diePerWafer({ waferDiameter: 0.3, dieArea: 1e-4 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      // Gross fill ~707; de Vries slightly lower. Sanity band.
      expect(r.value.diePerWafer).toBeGreaterThan(600);
      expect(r.value.diePerWafer).toBeLessThan(710);
      expect(r.value.grossDiePerWafer).toBeGreaterThan(r.value.diePerWafer);
      expect(Number.isInteger(r.value.diePerWafer)).toBe(true);
    }
  });
  it("die larger than wafer → clamped to 0, never negative", () => {
    const r = diePerWafer({ waferDiameter: 0.01, dieArea: 1 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.diePerWafer).toBe(0);
  });
  it("rejects zero die area", () => {
    const r = diePerWafer({ waferDiameter: 0.3, dieArea: 0 });
    expect(r.ok).toBe(false);
  });
  it("rejects negative diameter", () => {
    const r = diePerWafer({ waferDiameter: -0.3, dieArea: 1e-4 });
    expect(r.ok).toBe(false);
  });
});

describe("waferYield", () => {
  it("Poisson: Y = e^(−D·A)", () => {
    // D = 0.1 /cm² = 1000 /m², A = 1 cm² = 1e-4 m² → D·A = 0.1
    const r = waferYield({ defectDensity: 1000, dieArea: 1e-4, model: "poisson" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.yield).toBeCloseTo(Math.exp(-0.1), 9);
      expect(r.value.yieldPercent).toBeCloseTo(90.48, 1);
    }
  });
  it("Murphy differs from Poisson but stays in [0,1]", () => {
    const p = waferYield({ defectDensity: 5000, dieArea: 1e-4, model: "poisson" });
    const m = waferYield({ defectDensity: 5000, dieArea: 1e-4, model: "murphy" });
    if (p.ok && m.ok) {
      expect(m.value.yield).not.toBeCloseTo(p.value.yield, 3);
      expect(m.value.yield).toBeGreaterThanOrEqual(0);
      expect(m.value.yield).toBeLessThanOrEqual(1);
    }
  });
  it("zero defects → yield 1 (both models)", () => {
    const p = waferYield({ defectDensity: 0, dieArea: 1e-4, model: "poisson" });
    const m = waferYield({ defectDensity: 0, dieArea: 1e-4, model: "murphy" });
    if (p.ok) expect(p.value.yield).toBeCloseTo(1, 12);
    if (m.ok) expect(m.value.yield).toBeCloseTo(1, 12);
  });
  it("rejects unknown model", () => {
    // @ts-expect-error testing runtime guard
    const r = waferYield({ defectDensity: 1000, dieArea: 1e-4, model: "bogus" });
    expect(r.ok).toBe(false);
  });
  it("rejects negative defect density", () => {
    const r = waferYield({ defectDensity: -1, dieArea: 1e-4, model: "poisson" });
    expect(r.ok).toBe(false);
  });
});
