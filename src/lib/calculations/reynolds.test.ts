import { describe, expect, it } from "vitest";
import { reynolds, classifyRegime } from "./reynolds";

const base = { density: 1000, velocity: 0.01, hydraulicDiameter: 100e-6, viscosity: 1e-3 };

describe("reynolds", () => {
  it("typical microchannel value → Re = 1, laminar", () => {
    const r = reynolds(base);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.reynolds).toBeCloseTo(1, 9);
      expect(r.value.regime).toBe("laminar");
      expect(r.assumptions.length).toBeGreaterThan(0);
    }
  });

  it("large values → turbulent, finite", () => {
    const r = reynolds({ density: 1000, velocity: 100, hydraulicDiameter: 0.1, viscosity: 1e-3 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(Number.isFinite(r.value.reynolds)).toBe(true);
      expect(r.value.regime).toBe("turbulent");
    }
  });

  it("classifies regime boundaries", () => {
    expect(classifyRegime(1999)).toBe("laminar");
    expect(classifyRegime(2000)).toBe("transitional");
    expect(classifyRegime(4000)).toBe("transitional");
    expect(classifyRegime(4001)).toBe("turbulent");
  });

  it("zero velocity is allowed → Re = 0", () => {
    const r = reynolds({ ...base, velocity: 0 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.reynolds).toBe(0);
  });

  it("decimal and scientific-notation inputs work", () => {
    const r = reynolds({ density: 998.2, velocity: 2.5e-3, hydraulicDiameter: 7.5e-5, viscosity: 1.002e-3 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.reynolds).toBeGreaterThan(0);
  });

  it("rejects zero density (positive required)", () => {
    const r = reynolds({ ...base, density: 0 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.field).toBe("density");
  });

  it("rejects negative viscosity", () => {
    const r = reynolds({ ...base, viscosity: -1e-3 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.field).toBe("viscosity");
  });

  it("rejects NaN / empty (missing) input", () => {
    expect(reynolds({ ...base, velocity: NaN }).ok).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(reynolds({} as any).ok).toBe(false);
  });

  it("guards against non-finite result (μ underflow)", () => {
    const r = reynolds({ density: 1e308, velocity: 1e308, hydraulicDiameter: 1e308, viscosity: 5e-324 });
    expect(r.ok).toBe(false);
  });
});
