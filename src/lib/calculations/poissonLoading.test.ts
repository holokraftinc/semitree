import { describe, expect, it } from "vitest";
import {
  poissonLoading,
  poissonPmf,
  lambdaFromConcentration,
} from "./poissonLoading";

describe("poissonLoading", () => {
  it("typical λ=0.1 probabilities", () => {
    const r = poissonLoading({ lambda: 0.1 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.p0).toBeCloseTo(Math.exp(-0.1), 12);
      expect(r.value.p1).toBeCloseTo(0.1 * Math.exp(-0.1), 12);
      expect(r.value.p0 + r.value.p1 + r.value.p2OrMore).toBeCloseTo(1, 12);
    }
  });

  it("λ=0 → all droplets empty", () => {
    const r = poissonLoading({ lambda: 0 });
    if (r.ok) {
      expect(r.value.p0).toBe(1);
      expect(r.value.p1).toBe(0);
      expect(r.value.p2OrMore).toBe(0);
    }
  });

  it("large λ → p0,p1 → 0, p2OrMore → 1, still finite", () => {
    const r = poissonLoading({ lambda: 50 });
    if (r.ok) {
      expect(r.value.p0).toBeCloseTo(0, 12);
      expect(r.value.p2OrMore).toBeCloseTo(1, 6);
      expect(Number.isFinite(r.value.p2OrMore)).toBe(true);
    }
  });

  it("poissonPmf matches closed form and avoids overflow for large k", () => {
    const r = poissonPmf(2, 2); // 2^2 e^-2 / 2! = 0.2707
    if (r.ok) expect(r.value).toBeCloseTo(0.27067, 5);
    const big = poissonPmf(1, 170); // large k, must stay finite (not Infinity)
    if (big.ok) expect(Number.isFinite(big.value)).toBe(true);
  });

  it("lambdaFromConcentration = concentration × volume", () => {
    // 1e12 cells/m³ (=1e6/mL) × 1e-12 m³ (=1 nL) = 1
    const r = lambdaFromConcentration({ cellConcentration: 1e12, dropletVolume: 1e-12 });
    if (r.ok) expect(r.value.lambda).toBeCloseTo(1, 9);
  });

  it("rejects negative λ, non-integer/negative k, NaN, and empty", () => {
    expect(poissonLoading({ lambda: -1 }).ok).toBe(false);
    expect(poissonPmf(1, 1.5).ok).toBe(false);
    expect(poissonPmf(1, -1).ok).toBe(false);
    expect(poissonLoading({ lambda: NaN }).ok).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(poissonLoading({} as any).ok).toBe(false);
  });
});
