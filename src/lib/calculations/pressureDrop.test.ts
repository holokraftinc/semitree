import { describe, expect, it } from "vitest";
import { pressureDrop } from "./pressureDrop";

const circ = { shape: "circular" as const, viscosity: 1e-3, length: 0.1, flowRate: 1e-9, diameter: 100e-6 };

describe("pressureDrop", () => {
  it("circular Hagen–Poiseuille (exact), ΔP = R·Q", () => {
    const r = pressureDrop(circ);
    expect(r.ok).toBe(true);
    if (r.ok) {
      // R = 128*1e-3*0.1/(π*(1e-4)^4)
      const expectedR = (128 * 1e-3 * 0.1) / (Math.PI * (100e-6) ** 4);
      expect(r.value.resistance).toBeCloseTo(expectedR, 0);
      expect(r.value.pressureDrop).toBeCloseTo(expectedR * 1e-9, 6);
      expect(r.value.approximation).toBe(false);
    }
  });

  it("rectangular is flagged as an approximation", () => {
    const r = pressureDrop({
      shape: "rectangular",
      viscosity: 1e-3,
      length: 0.1,
      flowRate: 1e-9,
      width: 100e-6,
      height: 50e-6,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.approximation).toBe(true);
      expect(r.value.pressureDrop).toBeGreaterThan(0);
    }
  });

  it("zero flow rate → zero pressure drop", () => {
    const r = pressureDrop({ ...circ, flowRate: 0 });
    if (r.ok) expect(r.value.pressureDrop).toBe(0);
  });

  it("large flow rate stays finite", () => {
    const r = pressureDrop({ ...circ, flowRate: 1e3 });
    if (r.ok) expect(Number.isFinite(r.value.pressureDrop)).toBe(true);
  });

  it("decimal / scientific inputs work", () => {
    const r = pressureDrop({ ...circ, viscosity: 1.002e-3, diameter: 7.5e-5 });
    expect(r.ok).toBe(true);
  });

  it("rejects negative flow rate, zero diameter, NaN, and missing shape", () => {
    expect(pressureDrop({ ...circ, flowRate: -1e-9 }).ok).toBe(false);
    expect(pressureDrop({ ...circ, diameter: 0 }).ok).toBe(false);
    expect(pressureDrop({ ...circ, viscosity: NaN }).ok).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(pressureDrop({} as any).ok).toBe(false);
  });

  it("guards against Infinity from diameter underflow", () => {
    const r = pressureDrop({ ...circ, diameter: 1e-100 });
    expect(r.ok).toBe(false);
  });
});
