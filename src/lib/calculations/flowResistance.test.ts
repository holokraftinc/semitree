import { describe, expect, it } from "vitest";
import { flowResistance } from "./flowResistance";

describe("flowResistance", () => {
  it("circular resistance is exact (128μL/πD⁴)", () => {
    const r = flowResistance({ method: "circular", viscosity: 1e-3, length: 0.1, diameter: 100e-6 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const expected = (128 * 1e-3 * 0.1) / (Math.PI * (100e-6) ** 4);
      expect(r.value.resistance).toBeCloseTo(expected, 0);
      expect(r.value.approximation).toBe(false);
    }
  });

  it("rectangular resistance is flagged approximate and order-independent in w/h", () => {
    const a = flowResistance({ method: "rectangular", viscosity: 1e-3, length: 0.1, width: 100e-6, height: 50e-6 });
    const b = flowResistance({ method: "rectangular", viscosity: 1e-3, length: 0.1, width: 50e-6, height: 100e-6 });
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) {
      expect(a.value.approximation).toBe(true);
      expect(a.value.resistance).toBeCloseTo(b.value.resistance, 6);
    }
  });

  it("near-square rectangular channel emits a warning", () => {
    const r = flowResistance({ method: "rectangular", viscosity: 1e-3, length: 0.1, width: 100e-6, height: 90e-6 });
    if (r.ok) expect(r.value.approximation && r.warnings.length > 0).toBe(true);
  });

  it("from-measurements uses R = ΔP/Q (definition)", () => {
    const r = flowResistance({ method: "from-measurements", pressureDrop: 1000, flowRate: 1e-9 });
    if (r.ok) {
      expect(r.value.resistance).toBeCloseTo(1e12, 3);
      expect(r.value.approximation).toBe(false);
    }
  });

  it("small and large values stay finite", () => {
    const small = flowResistance({ method: "circular", viscosity: 1e-3, length: 1e-6, diameter: 1e-3 });
    const large = flowResistance({ method: "circular", viscosity: 10, length: 10, diameter: 1e-5 });
    expect(small.ok && large.ok).toBe(true);
    if (small.ok) expect(Number.isFinite(small.value.resistance)).toBe(true);
    if (large.ok) expect(Number.isFinite(large.value.resistance)).toBe(true);
  });

  it("rejects zero/negative/NaN/empty and division by zero flow", () => {
    expect(flowResistance({ method: "circular", viscosity: 1e-3, length: 0.1, diameter: 0 }).ok).toBe(false);
    expect(flowResistance({ method: "rectangular", viscosity: -1, length: 0.1, width: 1e-4, height: 1e-4 }).ok).toBe(false);
    expect(flowResistance({ method: "from-measurements", pressureDrop: 1000, flowRate: 0 }).ok).toBe(false);
    expect(flowResistance({ method: "circular", viscosity: NaN, length: 0.1, diameter: 1e-4 }).ok).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(flowResistance({} as any).ok).toBe(false);
  });
});
