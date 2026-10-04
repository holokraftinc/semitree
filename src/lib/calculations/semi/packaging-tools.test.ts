import { describe, expect, it } from "vitest";
import {
  packageDimensions,
  thermalResistance,
  thermalBudget,
  interconnectCapacity,
  bumpArray,
} from "./packaging-tools";

describe("packageDimensions", () => {
  it("computes footprint and volume", () => {
    const r = packageDimensions({ length: 0.01, width: 0.01, height: 0.001 }); // 10×10×1 mm
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.footprint).toBeCloseTo(1e-4, 10); // 100 mm²
      expect(r.value.volume).toBeCloseTo(1e-7, 12); // 100 mm³
    }
  });
  it("rejects non-positive", () => {
    expect(packageDimensions({ length: 0, width: 1, height: 1 }).ok).toBe(false);
  });
});

describe("thermalResistance", () => {
  it("computes ΔT from P and Rθ", () => {
    const r = thermalResistance({ power: 10, thetaResistance: 5 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.deltaT).toBeCloseTo(50, 6);
      expect(r.value.computed).toBe("deltaT");
    }
  });
  it("computes power from ΔT and Rθ", () => {
    const r = thermalResistance({ deltaT: 50, thetaResistance: 5 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.power).toBeCloseTo(10, 6);
  });
  it("requires exactly two and rejects negatives", () => {
    expect(thermalResistance({ power: 10 }).ok).toBe(false);
    expect(thermalResistance({ power: 10, thetaResistance: 5, deltaT: 50 }).ok).toBe(false);
    expect(thermalResistance({ power: -1, thetaResistance: 5 }).ok).toBe(false);
  });
});

describe("thermalBudget", () => {
  it("computes allowable power", () => {
    const r = thermalBudget({ tjMax: 398.15, tAmbient: 298.15, thetaResistance: 2 }); // 125°C, 25°C
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.deltaT).toBeCloseTo(100, 6);
      expect(r.value.allowablePower).toBeCloseTo(50, 6);
    }
  });
  it("rejects Tj_max <= ambient and non-positive Rθ", () => {
    expect(thermalBudget({ tjMax: 300, tAmbient: 300, thetaResistance: 2 }).ok).toBe(false);
    expect(thermalBudget({ tjMax: 400, tAmbient: 300, thetaResistance: 0 }).ok).toBe(false);
  });
});

describe("interconnectCapacity", () => {
  it("floors a grid into the area", () => {
    const r = interconnectCapacity({ areaWidth: 1e-3, areaHeight: 1e-3, pitch: 1e-4 }); // 1mm/0.1mm = 10
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.columns).toBe(10);
      expect(r.value.rows).toBe(10);
      expect(r.value.count).toBe(100);
    }
  });
  it("rejects non-positive pitch", () => {
    expect(interconnectCapacity({ areaWidth: 1e-3, areaHeight: 1e-3, pitch: 0 }).ok).toBe(false);
  });
});

describe("bumpArray", () => {
  it("computes count, span, and density", () => {
    const r = bumpArray({ rows: 10, columns: 10, pitch: 1e-4 }); // 100 µm pitch
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.count).toBe(100);
      expect(r.value.arrayWidth).toBeCloseTo(9e-4, 10);
      expect(r.value.density).toBeCloseTo(1 / (1e-4 * 1e-4), 2); // 1e8 /m² = 100 /mm²
    }
  });
  it("rejects non-integer rows/cols and non-positive pitch", () => {
    expect(bumpArray({ rows: 10.5, columns: 10, pitch: 1e-4 }).ok).toBe(false);
    expect(bumpArray({ rows: 10, columns: 10, pitch: 0 }).ok).toBe(false);
  });
});
