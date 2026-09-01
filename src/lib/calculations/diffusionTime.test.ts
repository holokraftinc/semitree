import { describe, expect, it } from "vitest";
import { diffusionTime, diffusionLength } from "./diffusionTime";

describe("diffusionTime", () => {
  it("typical: L=100µm, D=1e-9 → t = 5 s", () => {
    const r = diffusionTime({ length: 100e-6, diffusionCoefficient: 1e-9 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.time).toBeCloseTo(5, 9);
      expect(r.assumptions.join(" ")).toMatch(/APPROXIMATION/);
    }
  });

  it("diffusionLength is the inverse of diffusionTime", () => {
    const l = diffusionLength({ time: 5, diffusionCoefficient: 1e-9 });
    if (l.ok) expect(l.value.length).toBeCloseTo(100e-6, 9);
  });

  it("small and large values stay finite", () => {
    const small = diffusionTime({ length: 1e-9, diffusionCoefficient: 1e-9 });
    const large = diffusionTime({ length: 1, diffusionCoefficient: 1e-12 });
    if (small.ok) expect(Number.isFinite(small.value.time)).toBe(true);
    if (large.ok) expect(Number.isFinite(large.value.time)).toBe(true);
  });

  it("decimal / scientific inputs work", () => {
    const r = diffusionTime({ length: 7.5e-5, diffusionCoefficient: 2.3e-9 });
    expect(r.ok).toBe(true);
  });

  it("rejects zero, negative, NaN, and empty", () => {
    expect(diffusionTime({ length: 0, diffusionCoefficient: 1e-9 }).ok).toBe(false);
    expect(diffusionTime({ length: -1, diffusionCoefficient: 1e-9 }).ok).toBe(false);
    expect(diffusionTime({ length: 1, diffusionCoefficient: NaN }).ok).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(diffusionTime({} as any).ok).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(diffusionLength({} as any).ok).toBe(false);
  });
});
