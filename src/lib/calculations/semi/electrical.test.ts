import { describe, expect, it } from "vitest";
import { ohmsLaw, power, rcTimeConstant } from "./electrical";

describe("ohmsLaw", () => {
  it("V = I·R", () => {
    const r = ohmsLaw({ solveFor: "voltage", current: 2, resistance: 5 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.voltage).toBeCloseTo(10, 9);
  });
  it("I = V/R", () => {
    const r = ohmsLaw({ solveFor: "current", voltage: 10, resistance: 5 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.current).toBeCloseTo(2, 9);
  });
  it("R = V/I", () => {
    const r = ohmsLaw({ solveFor: "resistance", voltage: 10, current: 2 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.resistance).toBeCloseTo(5, 9);
  });
  it("rejects division by zero current", () => {
    const r = ohmsLaw({ solveFor: "resistance", voltage: 10, current: 0 });
    expect(r.ok).toBe(false);
  });
  it("rejects division by zero resistance", () => {
    const r = ohmsLaw({ solveFor: "current", voltage: 10, resistance: 0 });
    expect(r.ok).toBe(false);
  });
  it("rejects NaN / non-finite", () => {
    const r = ohmsLaw({ solveFor: "voltage", current: NaN, resistance: 5 });
    expect(r.ok).toBe(false);
  });
  it("rejects negative resistance", () => {
    const r = ohmsLaw({ solveFor: "voltage", current: 1, resistance: -5 });
    expect(r.ok).toBe(false);
  });
});

describe("power", () => {
  it("P = V·I", () => {
    const r = power({ method: "vi", voltage: 5, current: 2 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.power).toBeCloseTo(10, 9);
  });
  it("P = I²·R", () => {
    const r = power({ method: "ir", current: 2, resistance: 5 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.power).toBeCloseTo(20, 9);
  });
  it("P = V²/R", () => {
    const r = power({ method: "vr", voltage: 10, resistance: 5 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.power).toBeCloseTo(20, 9);
  });
  it("three methods agree for the same circuit", () => {
    const a = power({ method: "vi", voltage: 10, current: 2 });
    const b = power({ method: "ir", current: 2, resistance: 5 });
    const c = power({ method: "vr", voltage: 10, resistance: 5 });
    if (a.ok && b.ok && c.ok) {
      expect(a.value.power).toBeCloseTo(b.value.power, 9);
      expect(b.value.power).toBeCloseTo(c.value.power, 9);
    }
  });
  it("rejects zero resistance in V²/R", () => {
    const r = power({ method: "vr", voltage: 10, resistance: 0 });
    expect(r.ok).toBe(false);
  });
});

describe("rcTimeConstant", () => {
  it("τ = R·C and f_c = 1/(2πRC)", () => {
    const r = rcTimeConstant({ resistance: 1000, capacitance: 1e-6 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.timeConstant).toBeCloseTo(1e-3, 12);
      expect(r.value.cutoffFrequency).toBeCloseTo(159.1549, 3);
    }
  });
  it("rejects zero capacitance", () => {
    const r = rcTimeConstant({ resistance: 1000, capacitance: 0 });
    expect(r.ok).toBe(false);
  });
  it("rejects negative resistance", () => {
    const r = rcTimeConstant({ resistance: -1, capacitance: 1e-6 });
    expect(r.ok).toBe(false);
  });
});
