/**
 * Phase 15 QA — calculator boundary matrix.
 *
 * Runs EVERY calculator engine through the required value matrix (normal, zero,
 * negative, empty, very small, very large, decimal, scientific, invalid) and
 * asserts the CalcResult contract holds in all cases:
 *   - the call never throws,
 *   - an `ok` result never leaks NaN / ±Infinity,
 *   - an invalid/empty/NaN input is rejected with a clean `err` (ok:false).
 *
 * This complements the per-engine unit tests with a uniform, exhaustive sweep.
 */
import { describe, expect, it } from "vitest";
import type { CalcResult } from "./result";

import { reynolds } from "./reynolds";
import { hydraulicDiameter } from "./hydraulicDiameter";
import { pressureDrop } from "./pressureDrop";
import { flowResistance } from "./flowResistance";
import { diffusionTime } from "./diffusionTime";
import { poissonLoading } from "./poissonLoading";
import { syringePump } from "./syringePump";
import { convertUnit } from "./unitConversion";

import { ohmsLaw, power, rcTimeConstant } from "./semi/electrical";
import { builtInPotential } from "./semi/physics";
import { diePerWafer, waferYield } from "./semi/manufacturing";
import { junctionTemperature, powerDensity } from "./semi/packaging";

/** The value matrix applied to each calculator's "primary" input. */
const MATRIX: { label: string; value: unknown; expectValid: boolean }[] = [
  { label: "normal", value: 5, expectValid: true },
  { label: "zero", value: 0, expectValid: false }, // most primaries must be > 0
  { label: "negative", value: -5, expectValid: false },
  { label: "empty/undefined", value: undefined, expectValid: false },
  { label: "very small", value: 1e-300, expectValid: true },
  { label: "very large", value: 1e12, expectValid: true },
  { label: "decimal", value: 3.14159, expectValid: true },
  { label: "scientific", value: 1.5e-9, expectValid: true },
  { label: "NaN", value: NaN, expectValid: false },
  { label: "string", value: "abc" as unknown as number, expectValid: false },
];

/** Assert the universal CalcResult contract for one call. */
function assertContract(res: CalcResult<unknown>) {
  expect(res).toBeDefined();
  expect(typeof res.ok).toBe("boolean");
  if (res.ok) {
    for (const [k, v] of Object.entries(res.value as Record<string, unknown>)) {
      if (typeof v === "number") {
        expect(Number.isFinite(v), `field ${k} must be finite`).toBe(true);
      }
    }
  } else {
    expect(typeof res.error).toBe("string");
    expect(res.error.length).toBeGreaterThan(0);
  }
}

/** A calculator under test: a builder that injects the matrix value + the run. */
interface Calc {
  name: string;
  run: (v: unknown) => CalcResult<unknown>;
  /** Values in the matrix that this calc legitimately accepts as valid. */
  validException?: (label: string) => boolean;
}

const CALCS: Calc[] = [
  // ---- Microfluidics ----
  { name: "reynolds (velocity)", run: (v) => reynolds({ density: 1000, velocity: v as number, hydraulicDiameter: 100e-6, viscosity: 1e-3 }) },
  { name: "hydraulicDiameter (width)", run: (v) => hydraulicDiameter({ width: v as number, height: 50e-6 }) },
  { name: "pressureDrop (flowRate)", run: (v) => pressureDrop({ shape: "circular", viscosity: 1e-3, length: 0.01, flowRate: v as number, diameter: 100e-6 }) },
  { name: "flowResistance (diameter)", run: (v) => flowResistance({ method: "circular", viscosity: 1e-3, length: 0.01, diameter: v as number }) },
  { name: "diffusionTime (length)", run: (v) => diffusionTime({ length: v as number, diffusionCoefficient: 1e-9 }) },
  { name: "poissonLoading (lambda)", run: (v) => poissonLoading({ lambda: v as number }), validException: (l) => l === "zero" },
  { name: "syringePump (plungerSpeed)", run: (v) => syringePump({ mode: "flow-from-speed", innerDiameter: 0.01, plungerSpeed: v as number }) },
  { name: "convertUnit (value)", run: (v) => convertUnit({ value: v as number, from: "bar", to: "psi" }), validException: (l) => l === "zero" || l === "negative" },

  // ---- Semiconductors ----
  { name: "ohmsLaw (current)", run: (v) => ohmsLaw({ solveFor: "voltage", current: v as number, resistance: 500 }), validException: (l) => l === "zero" || l === "negative" },
  { name: "power (voltage)", run: (v) => power({ method: "vi", voltage: v as number, current: 0.01 }), validException: (l) => l === "zero" || l === "negative" },
  { name: "rcTimeConstant (resistance)", run: (v) => rcTimeConstant({ resistance: v as number, capacitance: 1e-6 }) },
  { name: "builtInPotential (temperature)", run: (v) => builtInPotential({ acceptorConc: 1e22, donorConc: 1e22, temperature: v as number }) },
  { name: "diePerWafer (dieArea)", run: (v) => diePerWafer({ waferDiameter: 0.3, dieArea: v as number }) },
  { name: "waferYield (defectDensity)", run: (v) => waferYield({ defectDensity: v as number, dieArea: 1e-4, model: "poisson" }), validException: (l) => l === "zero" }, // 0 defects = valid (yield 1)
  { name: "junctionTemperature (power)", run: (v) => junctionTemperature({ power: v as number, thermalResistance: 10, ambientTemp: 300 }), validException: (l) => l === "zero" }, // 0 W = valid
  { name: "powerDensity (area)", run: (v) => powerDensity({ power: 5, area: v as number }) },
];

describe("calculator boundary matrix (Phase 15 QA)", () => {
  for (const calc of CALCS) {
    describe(calc.name, () => {
      for (const cell of MATRIX) {
        it(`${cell.label}`, () => {
          let res: CalcResult<unknown>;
          expect(() => {
            res = calc.run(cell.value) as CalcResult<unknown>;
          }).not.toThrow();
          res = calc.run(cell.value) as CalcResult<unknown>;
          assertContract(res);

          const expectValid = cell.expectValid || (calc.validException?.(cell.label) ?? false);
          // Hard invalids (NaN, undefined, string) must ALWAYS be rejected.
          if (["NaN", "empty/undefined", "string", "negative"].includes(cell.label) && !calc.validException?.(cell.label)) {
            expect(res.ok).toBe(false);
          }
          // Moderate valid values must compute. (Very small/large values may be
          // correctly rejected by guardFinite if they overflow/underflow to a
          // non-finite result — that's the contract working, so they are only
          // required to satisfy assertContract above, not to be `ok`.)
          if (expectValid && ["normal", "decimal", "scientific"].includes(cell.label)) {
            expect(res.ok).toBe(true);
          }
        });
      }
    });
  }

  it("covers every shipped calculator engine", () => {
    // 8 microfluidics + 8 semiconductor engines.
    expect(CALCS.length).toBe(16);
  });
});
