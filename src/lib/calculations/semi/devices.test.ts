import { describe, expect, it } from "vitest";
import {
  thermalVoltage,
  parallelPlateCapacitance,
  resistorFromGeometry,
  interconnectResistance,
  interconnectRcDelay,
  diodeCurrent,
  varshniBandgap,
  subthresholdSwing,
  mosThresholdVoltage,
  mosfetDrainCurrent,
} from "./devices";

describe("thermalVoltage", () => {
  it("is ~25.85 mV at 300 K", () => {
    const r = thermalVoltage({ temperature: 300 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.thermalVoltage).toBeCloseTo(0.02585, 4);
  });
  it("rejects non-positive T", () => {
    expect(thermalVoltage({ temperature: 0 }).ok).toBe(false);
  });
});

describe("parallelPlateCapacitance", () => {
  it("computes C = ε0·εr·A/d", () => {
    const r = parallelPlateCapacitance({ area: 1e-4, distance: 1e-3, relativePermittivity: 1 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.capacitance).toBeCloseTo((8.8541878128e-12 * 1e-4) / 1e-3, 18);
  });
  it("rejects non-positive", () => {
    expect(parallelPlateCapacitance({ area: 0, distance: 1e-3, relativePermittivity: 1 }).ok).toBe(false);
  });
});

describe("resistorFromGeometry & interconnectResistance", () => {
  it("R = ρL/A", () => {
    const r = resistorFromGeometry({ resistivity: 1e-6, length: 1e-3, area: 1e-9 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.resistance).toBeCloseTo(1, 6);
  });
  it("interconnect R = ρL/(W·t) and squares = L/W", () => {
    const r = interconnectResistance({ resistivity: 2e-8, length: 100e-6, width: 1e-6, thickness: 1e-7 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.squares).toBeCloseTo(100, 6);
      expect(r.value.sheetResistance).toBeCloseTo(0.2, 6);
      expect(r.value.resistance).toBeCloseTo(20, 6);
    }
  });
});

describe("interconnectRcDelay", () => {
  it("τ = RC and 0.69RC", () => {
    const r = interconnectRcDelay({ resistance: 1000, capacitance: 1e-12 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.timeConstant).toBeCloseTo(1e-9, 15);
      expect(r.value.delay50).toBeCloseTo(0.69e-9, 15);
    }
  });
});

describe("diodeCurrent", () => {
  it("is ~0 at V=0 and rises with forward V", () => {
    const z = diodeCurrent({ voltage: 0, saturationCurrent: 1e-12, idealityFactor: 1, temperature: 300 });
    expect(z.ok).toBe(true);
    if (z.ok) expect(z.value.current).toBeCloseTo(0, 15);
    const f = diodeCurrent({ voltage: 0.6, saturationCurrent: 1e-12, idealityFactor: 1, temperature: 300 });
    expect(f.ok).toBe(true);
    if (f.ok) expect(f.value.current).toBeGreaterThan(1e-3);
  });
  it("rejects non-positive Is / n", () => {
    expect(diodeCurrent({ voltage: 0.6, saturationCurrent: 0, idealityFactor: 1, temperature: 300 }).ok).toBe(false);
  });
});

describe("varshniBandgap", () => {
  it("equals Eg0 at 0 K and decreases with T (silicon)", () => {
    const z = varshniBandgap({ eg0: 1.17, alpha: 4.73e-4, beta: 636, temperature: 0 });
    expect(z.ok).toBe(true);
    if (z.ok) expect(z.value.bandgap).toBeCloseTo(1.17, 6);
    const t = varshniBandgap({ eg0: 1.17, alpha: 4.73e-4, beta: 636, temperature: 300 });
    expect(t.ok).toBe(true);
    if (t.ok) expect(t.value.bandgap).toBeCloseTo(1.124, 2); // ~1.12 eV for Si at 300 K
  });
});

describe("subthresholdSwing", () => {
  it("is ~60 mV/dec for n=1 at 300 K", () => {
    const r = subthresholdSwing({ idealityFactor: 1, temperature: 300 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.swing * 1000).toBeCloseTo(59.5, 0);
  });
});

describe("mosThresholdVoltage", () => {
  it("gives a plausible positive Vth for an nMOS example", () => {
    const r = mosThresholdVoltage({ substrateDoping: 1e23, oxideThickness: 5e-9, flatbandVoltage: -0.9, temperature: 300 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.oxideCapacitance).toBeGreaterThan(0);
      expect(r.value.fermiPotential).toBeGreaterThan(0);
      expect(Number.isFinite(r.value.thresholdVoltage)).toBe(true);
    }
  });
});

describe("mosfetDrainCurrent", () => {
  it("is cutoff below Vth, saturation above pinch-off", () => {
    const cut = mosfetDrainCurrent({ mobility: 0.05, oxideCapacitance: 0.006, widthToLength: 10, vgs: 0.4, vth: 0.5, vds: 1 });
    expect(cut.ok).toBe(true);
    if (cut.ok) { expect(cut.value.region).toBe("cutoff"); expect(cut.value.current).toBe(0); }
    const sat = mosfetDrainCurrent({ mobility: 0.05, oxideCapacitance: 0.006, widthToLength: 10, vgs: 1.5, vth: 0.5, vds: 2 });
    expect(sat.ok).toBe(true);
    if (sat.ok) expect(sat.value.region).toBe("saturation");
    const tri = mosfetDrainCurrent({ mobility: 0.05, oxideCapacitance: 0.006, widthToLength: 10, vgs: 1.5, vth: 0.5, vds: 0.2 });
    expect(tri.ok).toBe(true);
    if (tri.ok) expect(tri.value.region).toBe("triode");
  });
});
