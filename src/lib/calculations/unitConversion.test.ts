import { describe, expect, it } from "vitest";
import { convertUnit } from "./unitConversion";

describe("convertUnit", () => {
  it("pressure: 1 bar → 100000 Pa", () => {
    const r = convertUnit({ value: 1, from: "bar", to: "Pa" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.value).toBeCloseTo(100000, 6);
      expect(r.value.quantity).toBe("pressure");
    }
  });

  it("flow rate: 60 µL/min → 1e-9 m³/s", () => {
    const r = convertUnit({ value: 60, from: "uL_per_min", to: "m3_per_s" });
    if (r.ok) expect(r.value.value).toBeCloseTo(1e-9, 18);
  });

  it("affine temperature: 0 °C → 273.15 K", () => {
    const r = convertUnit({ value: 0, from: "C", to: "K" });
    if (r.ok) expect(r.value.value).toBeCloseTo(273.15, 6);
  });

  it("zero, negative, decimal, and scientific values convert", () => {
    expect((convertUnit({ value: 0, from: "bar", to: "Pa" }) as { value: { value: number } }).value.value).toBe(0);
    const neg = convertUnit({ value: -2.5, from: "bar", to: "Pa" });
    if (neg.ok) expect(neg.value.value).toBeCloseTo(-250000, 6);
    const sci = convertUnit({ value: 1.5e-3, from: "mL", to: "uL" });
    if (sci.ok) expect(sci.value.value).toBeCloseTo(1.5, 9);
  });

  it("rejects unknown units", () => {
    expect(convertUnit({ value: 1, from: "nope", to: "Pa" }).ok).toBe(false);
    expect(convertUnit({ value: 1, from: "Pa", to: "nope" }).ok).toBe(false);
  });

  it("rejects cross-quantity conversion", () => {
    const r = convertUnit({ value: 1, from: "bar", to: "uL" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.field).toBe("to");
  });

  it("rejects NaN / non-finite value", () => {
    expect(convertUnit({ value: NaN, from: "bar", to: "Pa" }).ok).toBe(false);
    expect(convertUnit({ value: Infinity, from: "bar", to: "Pa" }).ok).toBe(false);
  });
});
