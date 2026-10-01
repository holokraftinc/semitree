import { describe, expect, it } from "vitest";
import { dieArea, aspectRatio, sheetResistance } from "./general";

describe("dieArea", () => {
  it("computes area and square-equivalent side", () => {
    const r = dieArea({ width: 0.004, height: 0.005 }); // 4mm × 5mm
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.area).toBeCloseTo(2e-5, 12); // 20 mm²
      expect(r.value.squareEquivalent).toBeCloseTo(Math.sqrt(2e-5), 12);
    }
  });

  it("rejects non-positive dimensions", () => {
    expect(dieArea({ width: 0, height: 1 }).ok).toBe(false);
    expect(dieArea({ width: -1, height: 1 }).ok).toBe(false);
    expect(dieArea({ width: NaN, height: 1 }).ok).toBe(false);
  });
});

describe("aspectRatio", () => {
  it("computes depth / width", () => {
    const r = aspectRatio({ depth: 2e-6, width: 1e-6 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.aspectRatio).toBeCloseTo(2, 10);
  });

  it("allows zero depth but not zero width", () => {
    expect(aspectRatio({ depth: 0, width: 1e-6 }).ok).toBe(true);
    expect(aspectRatio({ depth: 1e-6, width: 0 }).ok).toBe(false);
  });
});

describe("sheetResistance", () => {
  it("computes Rs = rho / t", () => {
    const r = sheetResistance({ resistivity: 1e-6, thickness: 1e-7 }); // 1 µΩ·m, 100 nm
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.sheetResistance).toBeCloseTo(10, 6); // 10 Ω/sq
      expect(r.value.squares).toBe(1);
      expect(r.value.resistance).toBeCloseTo(10, 6);
    }
  });

  it("scales resistance by number of squares", () => {
    const r = sheetResistance({ resistivity: 1e-6, thickness: 1e-7, squares: 5 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.resistance).toBeCloseTo(50, 6);
  });

  it("rejects non-positive inputs", () => {
    expect(sheetResistance({ resistivity: 0, thickness: 1e-7 }).ok).toBe(false);
    expect(sheetResistance({ resistivity: 1e-6, thickness: 0 }).ok).toBe(false);
    expect(sheetResistance({ resistivity: 1e-6, thickness: 1e-7, squares: 0 }).ok).toBe(false);
  });
});
