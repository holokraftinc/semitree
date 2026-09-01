import { describe, expect, it } from "vitest";
import { convert, toSI } from "./convert";

describe("units/convert", () => {
  it("is identity for same unit", () => {
    expect(convert(42, "uL_per_min", "uL_per_min")).toBe(42);
  });

  it("converts pressure across units via the SI base", () => {
    // 1 bar = 100000 Pa = 1000 mbar
    expect(convert(1, "bar", "Pa")).toBeCloseTo(100000, 6);
    expect(convert(1, "bar", "mbar")).toBeCloseTo(1000, 6);
  });

  it("converts flow rate µL/min to m³/s", () => {
    // 60 µL/min = 1 µL/s = 1e-9 m³/s
    expect(convert(60, "uL_per_min", "m3_per_s")).toBeCloseTo(1e-9, 18);
  });

  it("handles affine temperature conversion", () => {
    expect(convert(0, "C", "K")).toBeCloseTo(273.15, 6);
    expect(convert(273.15, "K", "C")).toBeCloseTo(0, 6);
  });

  it("normalises to SI base with toSI", () => {
    expect(toSI(1000, "mbar")).toBeCloseTo(100000, 6);
  });

  it("throws on cross-quantity conversion", () => {
    expect(() => convert(1, "bar", "uL")).toThrow();
  });

  it("throws on unknown unit", () => {
    expect(() => convert(1, "nope", "Pa")).toThrow();
  });

  it("converts diffusivity µm²/s to m²/s", () => {
    // 1000 µm²/s = 1e-9 m²/s
    expect(convert(1000, "um2_per_s", "m2_per_s")).toBeCloseTo(1e-9, 18);
  });
});
