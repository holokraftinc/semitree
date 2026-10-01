import { describe, expect, it } from "vitest";
import { convert } from "./convert";
import { unitsForQuantity } from "./registry";

describe("semiconductor unit conversions", () => {
  it("converts length down to ångström", () => {
    expect(convert(1, "nm", "angstrom")).toBeCloseTo(10, 10);
    expect(convert(1, "um", "nm")).toBeCloseTo(1000, 6);
    expect(convert(1, "m", "nm")).toBeCloseTo(1e9, 0);
  });

  it("converts area correctly (quadratic factors)", () => {
    expect(convert(1, "mm2", "um2")).toBeCloseTo(1e6, 0);
    expect(convert(1, "m2", "mm2")).toBeCloseTo(1e6, 0);
  });

  it("converts sub-second time units", () => {
    expect(convert(1, "ms", "us")).toBeCloseTo(1000, 6);
    expect(convert(1, "ns", "ps")).toBeCloseTo(1000, 6);
  });

  it("converts vacuum pressures", () => {
    expect(convert(1, "Torr", "mTorr")).toBeCloseTo(1000, 6);
    expect(convert(760, "Torr", "Pa")).toBeCloseTo(101325, -1); // ~1 atm
  });

  it("converts energy via the exact elementary charge", () => {
    expect(convert(1, "eV", "J")).toBeCloseTo(1.602176634e-19, 25);
    expect(convert(1, "keV", "eV")).toBeCloseTo(1000, 6);
    expect(convert(1, "MeV", "keV")).toBeCloseTo(1000, 6);
  });

  it("converts frequency", () => {
    expect(convert(1, "GHz", "MHz")).toBeCloseTo(1000, 6);
    expect(convert(1, "MHz", "Hz")).toBeCloseTo(1e6, 0);
  });

  it("converts resistivity", () => {
    expect(convert(1, "ohm_cm", "ohm_m")).toBeCloseTo(0.01, 10);
  });

  it("exposes units for every converter quantity", () => {
    for (const q of ["length", "area", "time", "temperature", "pressure", "energy", "power", "current", "voltage", "resistance", "capacitance", "frequency"] as const) {
      expect(unitsForQuantity(q).length, q).toBeGreaterThan(0);
    }
  });

  it("refuses cross-quantity conversion", () => {
    expect(() => convert(1, "nm", "s")).toThrow();
  });
});
