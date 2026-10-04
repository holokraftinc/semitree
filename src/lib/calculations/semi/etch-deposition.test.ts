import { describe, expect, it } from "vitest";
import {
  filmThickness,
  depositionRate,
  timeForThickness,
  etchRate,
  selectivity,
} from "./etch-deposition";

describe("filmThickness", () => {
  it("computes volume from thickness and area", () => {
    const r = filmThickness({ thickness: 1e-7, area: 1e-4 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.volume).toBeCloseTo(1e-11, 16);
      expect(r.value.computed).toBe("volume");
    }
  });
  it("computes thickness from volume and area", () => {
    const r = filmThickness({ volume: 1e-11, area: 1e-4 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.thickness).toBeCloseTo(1e-7, 16);
  });
  it("requires exactly two inputs", () => {
    expect(filmThickness({ thickness: 1e-7 }).ok).toBe(false);
    expect(filmThickness({ thickness: 1e-7, area: 1e-4, volume: 1e-11 }).ok).toBe(false);
  });
  it("rejects non-positive values", () => {
    expect(filmThickness({ thickness: 0, area: 1e-4 }).ok).toBe(false);
    expect(filmThickness({ thickness: -1, area: 1e-4 }).ok).toBe(false);
  });
});

describe("depositionRate", () => {
  it("computes rate = thickness / time", () => {
    const r = depositionRate({ thickness: 100e-9, time: 60 }); // 100 nm in 60 s
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.rate).toBeCloseTo(100e-9 / 60, 18); // ~1.667 nm/s
  });
  it("rejects zero time", () => {
    expect(depositionRate({ thickness: 1e-7, time: 0 }).ok).toBe(false);
  });
});

describe("timeForThickness", () => {
  it("computes time = thickness / rate", () => {
    const r = timeForThickness({ thickness: 100e-9, rate: 1e-9 }); // 100 nm at 1 nm/s
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.time).toBeCloseTo(100, 6);
  });
  it("rejects non-positive rate", () => {
    expect(timeForThickness({ thickness: 1e-7, rate: 0 }).ok).toBe(false);
  });
});

describe("etchRate", () => {
  it("computes rate from removed thickness", () => {
    const r = etchRate({ initialThickness: 200e-9, remainingThickness: 50e-9, time: 30 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.removed).toBeCloseTo(150e-9, 18);
      expect(r.value.rate).toBeCloseTo(150e-9 / 30, 18);
    }
  });
  it("rejects remaining >= initial", () => {
    expect(etchRate({ initialThickness: 100e-9, remainingThickness: 100e-9, time: 10 }).ok).toBe(false);
    expect(etchRate({ initialThickness: 100e-9, remainingThickness: 200e-9, time: 10 }).ok).toBe(false);
  });
  it("allows zero remaining (fully etched)", () => {
    expect(etchRate({ initialThickness: 100e-9, remainingThickness: 0, time: 10 }).ok).toBe(true);
  });
});

describe("selectivity", () => {
  it("computes the etch-rate ratio", () => {
    const r = selectivity({ targetRate: 100, maskRate: 5 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.selectivity).toBeCloseTo(20, 6);
  });
  it("rejects zero/negative rates", () => {
    expect(selectivity({ targetRate: 100, maskRate: 0 }).ok).toBe(false);
    expect(selectivity({ targetRate: -1, maskRate: 5 }).ok).toBe(false);
  });
});
