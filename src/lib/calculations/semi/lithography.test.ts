import { describe, expect, it } from "vitest";
import {
  lithoResolution,
  lithoDepthOfFocus,
  halfPitch,
  overlayError,
  exposureDose,
} from "./lithography";

describe("lithoResolution", () => {
  it("computes R = k1·λ/NA", () => {
    const r = lithoResolution({ wavelength: 193e-9, numericalAperture: 1.35, k1: 0.28 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.resolution).toBeCloseTo((0.28 * 193e-9) / 1.35, 18);
  });
  it("warns below the k1 single-exposure limit", () => {
    const r = lithoResolution({ wavelength: 13.5e-9, numericalAperture: 0.33, k1: 0.2 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.warnings.some((w) => w.includes("0.25"))).toBe(true);
  });
  it("rejects zero / negative / missing", () => {
    expect(lithoResolution({ wavelength: 0, numericalAperture: 1, k1: 0.3 }).ok).toBe(false);
    expect(lithoResolution({ wavelength: 193e-9, numericalAperture: -1, k1: 0.3 }).ok).toBe(false);
    // @ts-expect-error missing field
    expect(lithoResolution({ wavelength: 193e-9, numericalAperture: 1 }).ok).toBe(false);
  });
});

describe("lithoDepthOfFocus", () => {
  it("computes DOF = k2·λ/NA²", () => {
    const r = lithoDepthOfFocus({ wavelength: 193e-9, numericalAperture: 1.35, k2: 0.5 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.depthOfFocus).toBeCloseTo((0.5 * 193e-9) / 1.35 ** 2, 18);
  });
  it("rejects non-positive NA", () => {
    expect(lithoDepthOfFocus({ wavelength: 193e-9, numericalAperture: 0, k2: 0.5 }).ok).toBe(false);
  });
});

describe("halfPitch", () => {
  it("halves the pitch and reports equal line/space", () => {
    const r = halfPitch({ pitch: 100e-9 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.halfPitch).toBeCloseTo(50e-9, 18);
      expect(r.value.lineWidth).toBeCloseTo(50e-9, 18);
      expect(r.value.space).toBeCloseTo(50e-9, 18);
    }
  });
  it("rejects non-positive pitch", () => {
    expect(halfPitch({ pitch: 0 }).ok).toBe(false);
    expect(halfPitch({ pitch: -1 }).ok).toBe(false);
  });
});

describe("overlayError", () => {
  it("combines contributions in quadrature", () => {
    const r = overlayError({ xError: 3e-9, yError: 4e-9, processError: 0 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.total).toBeCloseTo(5e-9, 18); // 3-4-5
  });
  it("allows zeros but rejects negatives", () => {
    expect(overlayError({ xError: 0, yError: 0, processError: 0 }).ok).toBe(true);
    expect(overlayError({ xError: -1e-9, yError: 0, processError: 0 }).ok).toBe(false);
  });
});

describe("exposureDose", () => {
  it("computes dose = energy / area", () => {
    const r = exposureDose({ energy: 1e-3, area: 1e-4 }); // 1 mJ over 1 cm²
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.dose).toBeCloseTo(10, 6); // 10 J/m² = 1 mJ/cm²
  });
  it("rejects zero / negative / non-finite", () => {
    expect(exposureDose({ energy: 0, area: 1e-4 }).ok).toBe(false);
    expect(exposureDose({ energy: 1e-3, area: -1 }).ok).toBe(false);
    expect(exposureDose({ energy: NaN, area: 1e-4 }).ok).toBe(false);
  });
});
