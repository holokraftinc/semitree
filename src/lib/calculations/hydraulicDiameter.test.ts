import { describe, expect, it } from "vitest";
import { hydraulicDiameter } from "./hydraulicDiameter";

describe("hydraulicDiameter", () => {
  it("typical rectangular channel", () => {
    const r = hydraulicDiameter({ width: 100e-6, height: 50e-6 });
    expect(r.ok).toBe(true);
    // 2*100e-6*50e-6 / 150e-6 = 6.6667e-5
    if (r.ok) expect(r.value.hydraulicDiameter).toBeCloseTo(6.6667e-5, 9);
  });

  it("square channel → Dₕ equals the side length", () => {
    const r = hydraulicDiameter({ width: 100e-6, height: 100e-6 });
    if (r.ok) expect(r.value.hydraulicDiameter).toBeCloseTo(100e-6, 12);
  });

  it("very small (nanochannel) values stay finite", () => {
    const r = hydraulicDiameter({ width: 1e-9, height: 2e-9 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(Number.isFinite(r.value.hydraulicDiameter)).toBe(true);
  });

  it("large values stay finite", () => {
    const r = hydraulicDiameter({ width: 0.5, height: 0.25 });
    if (r.ok) expect(r.value.hydraulicDiameter).toBeCloseTo(0.3333, 4);
  });

  it("is symmetric in width/height", () => {
    const a = hydraulicDiameter({ width: 30e-6, height: 90e-6 });
    const b = hydraulicDiameter({ width: 90e-6, height: 30e-6 });
    if (a.ok && b.ok)
      expect(a.value.hydraulicDiameter).toBeCloseTo(b.value.hydraulicDiameter, 15);
  });

  it("rejects zero, negative, NaN, and empty", () => {
    expect(hydraulicDiameter({ width: 0, height: 1e-4 }).ok).toBe(false);
    expect(hydraulicDiameter({ width: -1e-4, height: 1e-4 }).ok).toBe(false);
    expect(hydraulicDiameter({ width: NaN, height: 1e-4 }).ok).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(hydraulicDiameter({} as any).ok).toBe(false);
  });
});
