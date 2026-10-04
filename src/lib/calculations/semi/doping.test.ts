import { describe, expect, it } from "vitest";
import {
  carrierConcentration,
  conductivity,
  resistivityFromConductivity,
  dopingConversion,
  implantTotalIons,
  dopingChain,
} from "./doping";
import { Q, NI_SILICON_300K } from "./constants";

describe("carrierConcentration", () => {
  it("gives majority ≈ dopant and minority = ni²/majority when heavily doped", () => {
    const Nd = 1e22; // m^-3 (1e16 cm^-3), >> ni
    const r = carrierConcentration({ dopant: Nd, type: "n" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.majority).toBeGreaterThan(0.99 * Nd);
      expect(r.value.electron).toBeCloseTo(r.value.majority, 0);
      expect(r.value.hole * r.value.electron).toBeCloseTo(NI_SILICON_300K ** 2, -20); // mass action
    }
  });
  it("warns when dopant is near intrinsic", () => {
    const r = carrierConcentration({ dopant: 2 * NI_SILICON_300K, type: "n" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.warnings.length).toBeGreaterThan(0);
  });
  it("rejects bad type / non-positive dopant", () => {
    // @ts-expect-error bad type
    expect(carrierConcentration({ dopant: 1e22, type: "x" }).ok).toBe(false);
    expect(carrierConcentration({ dopant: 0, type: "n" }).ok).toBe(false);
  });
});

describe("conductivity", () => {
  it("computes σ = q(nμn + pμp)", () => {
    const r = conductivity({ electron: 1e22, hole: 0, electronMobility: 0.14, holeMobility: 0.045 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.conductivity).toBeCloseTo(Q * 1e22 * 0.14, 6);
      expect(r.value.resistivity).toBeCloseTo(1 / (Q * 1e22 * 0.14), 10);
    }
  });
  it("errors when everything is zero", () => {
    expect(conductivity({ electron: 0, hole: 0, electronMobility: 0.14, holeMobility: 0.045 }).ok).toBe(false);
  });
});

describe("resistivityFromConductivity", () => {
  it("inverts conductivity", () => {
    const r = resistivityFromConductivity({ conductivity: 100 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.resistivity).toBeCloseTo(0.01, 10);
  });
  it("rejects non-positive", () => {
    expect(resistivityFromConductivity({ conductivity: 0 }).ok).toBe(false);
  });
});

describe("dopingConversion", () => {
  it("computes count from concentration and volume", () => {
    const r = dopingConversion({ concentration: 1e22, volume: 1e-18 }); // 1e22 /m^3 × 1e-18 m^3
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.count).toBeCloseTo(1e4, 0);
      expect(r.value.computed).toBe("count");
    }
  });
  it("requires exactly two", () => {
    expect(dopingConversion({ concentration: 1e22 }).ok).toBe(false);
    expect(dopingConversion({ concentration: 1e22, volume: 1e-18, count: 1 }).ok).toBe(false);
  });
});

describe("implantTotalIons", () => {
  it("multiplies dose by area", () => {
    const r = implantTotalIons({ dose: 1e18, area: 1e-4 }); // 1e18 /m² over 1 cm²
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.totalIons).toBeCloseTo(1e14, 0);
  });
  it("rejects non-positive", () => {
    expect(implantTotalIons({ dose: 0, area: 1e-4 }).ok).toBe(false);
  });
});

describe("dopingChain", () => {
  it("runs doping → carrier → σ → ρ → Rs", () => {
    const r = dopingChain({ dopant: 1e24, electronMobility: 0.1, thickness: 1e-7 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const sigma = Q * r.value.carrier * 0.1;
      expect(r.value.conductivity).toBeCloseTo(sigma, 6);
      expect(r.value.resistivity).toBeCloseTo(1 / sigma, 10);
      expect(r.value.sheetResistance).toBeCloseTo(1 / sigma / 1e-7, 6);
    }
  });
  it("rejects non-positive thickness", () => {
    expect(dopingChain({ dopant: 1e24, electronMobility: 0.1, thickness: 0 }).ok).toBe(false);
  });
});
