import { describe, expect, it } from "vitest";
import { erf, erfc } from "./erf";

describe("erf / erfc", () => {
  it("has the right anchor values", () => {
    expect(erf(0)).toBeCloseTo(0, 6);
    expect(erf(1)).toBeCloseTo(0.8427, 3);
    expect(erf(2)).toBeCloseTo(0.9953, 3);
    expect(erfc(0)).toBeCloseTo(1, 6);
  });
  it("is odd and erfc = 1 - erf", () => {
    expect(erf(-1)).toBeCloseTo(-erf(1), 6);
    expect(erfc(0.7)).toBeCloseTo(1 - erf(0.7), 6);
  });
  it("saturates for large arguments", () => {
    expect(erf(5)).toBeCloseTo(1, 5);
    expect(erfc(5)).toBeCloseTo(0, 5);
  });
  it("returns NaN for non-finite", () => {
    expect(Number.isNaN(erf(Infinity))).toBe(true);
  });
});
