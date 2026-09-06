import { describe, expect, it } from "vitest";
import { builtInPotential } from "./physics";

describe("builtInPotential", () => {
  it("typical silicon junction ~0.6–0.8 V", () => {
    // N_a = 1e16 cm^-3 = 1e22 m^-3, N_d = 1e16 cm^-3 = 1e22 m^-3, T = 300 K
    const r = builtInPotential({
      acceptorConc: 1e22,
      donorConc: 1e22,
      temperature: 300,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.builtInPotential).toBeGreaterThan(0.5);
      expect(r.value.builtInPotential).toBeLessThan(0.9);
      expect(r.value.thermalVoltage).toBeCloseTo(0.02585, 4); // kT/q at 300 K
    }
  });
  it("higher doping → higher V_bi", () => {
    const low = builtInPotential({ acceptorConc: 1e21, donorConc: 1e21, temperature: 300 });
    const high = builtInPotential({ acceptorConc: 1e24, donorConc: 1e24, temperature: 300 });
    if (low.ok && high.ok) {
      expect(high.value.builtInPotential).toBeGreaterThan(low.value.builtInPotential);
    }
  });
  it("rejects zero doping", () => {
    const r = builtInPotential({ acceptorConc: 0, donorConc: 1e22, temperature: 300 });
    expect(r.ok).toBe(false);
  });
  it("rejects zero temperature", () => {
    const r = builtInPotential({ acceptorConc: 1e22, donorConc: 1e22, temperature: 0 });
    expect(r.ok).toBe(false);
  });
  it("honors custom intrinsic concentration", () => {
    const r = builtInPotential({
      acceptorConc: 1e22,
      donorConc: 1e22,
      temperature: 300,
      intrinsicConc: 1e16,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.intrinsicConc).toBe(1e16);
  });
});
