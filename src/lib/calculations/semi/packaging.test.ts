import { describe, expect, it } from "vitest";
import { junctionTemperature, powerDensity } from "./packaging";

describe("junctionTemperature", () => {
  it("T_j = T_a + P·θ", () => {
    // P = 10 W, θ = 5 K/W, T_a = 298.15 K → ΔT = 50, T_j = 348.15
    const r = junctionTemperature({ power: 10, thermalResistance: 5, ambientTemp: 298.15 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.temperatureRise).toBeCloseTo(50, 9);
      expect(r.value.junctionTemp).toBeCloseTo(348.15, 9);
    }
  });
  it("zero power → no rise", () => {
    const r = junctionTemperature({ power: 0, thermalResistance: 5, ambientTemp: 300 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.junctionTemp).toBeCloseTo(300, 9);
  });
  it("rejects zero ambient temperature (non-physical, K)", () => {
    const r = junctionTemperature({ power: 10, thermalResistance: 5, ambientTemp: 0 });
    expect(r.ok).toBe(false);
  });
  it("rejects negative thermal resistance", () => {
    const r = junctionTemperature({ power: 10, thermalResistance: -1, ambientTemp: 300 });
    expect(r.ok).toBe(false);
  });
});

describe("powerDensity", () => {
  it("P/A", () => {
    // 100 W over 1 cm² = 1e-4 m² → 1e6 W/m²
    const r = powerDensity({ power: 100, area: 1e-4 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.powerDensity).toBeCloseTo(1e6, 3);
  });
  it("rejects zero area", () => {
    const r = powerDensity({ power: 100, area: 0 });
    expect(r.ok).toBe(false);
  });
  it("rejects negative power", () => {
    const r = powerDensity({ power: -1, area: 1e-4 });
    expect(r.ok).toBe(false);
  });
});
