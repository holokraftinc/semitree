import { describe, expect, it } from "vitest";
import { scientificForms } from "./sci-notation";

describe("scientificForms", () => {
  it("handles zero", () => {
    expect(scientificForms(0)).toEqual({ scientific: "0", engineering: "0", siPrefix: "0" });
  });

  it("formats a small value with the right SI prefix", () => {
    const r = scientificForms(1.5e-9);
    expect(r).not.toBeNull();
    expect(r!.scientific).toBe("1.5 × 10⁻⁹");
    expect(r!.engineering).toBe("1.5 × 10⁻⁹");
    expect(r!.siPrefix).toBe("1.5 n");
  });

  it("uses engineering exponents that are multiples of three", () => {
    const r = scientificForms(45000); // 4.5e4 scientific, 45e3 engineering
    expect(r!.scientific).toBe("4.5 × 10⁴");
    expect(r!.engineering).toBe("45 × 10³");
    expect(r!.siPrefix).toBe("45 k");
  });

  it("preserves sign", () => {
    const r = scientificForms(-2.2e-6);
    expect(r!.scientific).toBe("-2.2 × 10⁻⁶");
    expect(r!.siPrefix).toBe("-2.2 µ");
  });

  it("handles values at exponent zero", () => {
    const r = scientificForms(3.3);
    expect(r!.scientific).toBe("3.3 × 10⁰");
    expect(r!.siPrefix).toBe("3.3");
  });

  it("falls back to engineering form outside the SI prefix range", () => {
    const r = scientificForms(1e30); // beyond Y (10^24)
    expect(r!.siPrefix).toBe(r!.engineering);
  });

  it("rejects non-finite input", () => {
    expect(scientificForms(NaN)).toBeNull();
    expect(scientificForms(Infinity)).toBeNull();
  });
});
