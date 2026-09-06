/**
 * Electrical-fundamentals calculators (pure, SI, UI-independent).
 * Standard, textbook laws — no invented formulas.
 */
import { CalcResult, ok, err } from "../result";
import { validate, guardFinite } from "../validation";

/* ------------------------------- Ohm's law ------------------------------- */
// V = I · R

export type OhmsLawInput =
  | { solveFor: "voltage"; current: number; resistance: number }
  | { solveFor: "current"; voltage: number; resistance: number }
  | { solveFor: "resistance"; voltage: number; current: number };

export interface OhmsLawResult {
  voltage: number; // V
  current: number; // A
  resistance: number; // Ω
}

const OHM_ASSUMPTIONS = [
  "Ohmic (linear) device: resistance is constant and independent of voltage/current.",
  "DC / steady-state conditions.",
];

export function ohmsLaw(input: OhmsLawInput): CalcResult<OhmsLawResult> {
  if (!input || !("solveFor" in input)) return err("Choose what to solve for", "solveFor");

  if (input.solveFor === "voltage") {
    const invalid = validate([
      { name: "current", value: input.current, rule: "finite" },
      { name: "resistance", value: input.resistance, rule: "nonnegative" },
    ]);
    if (invalid) return invalid;
    const voltage = input.current * input.resistance;
    const nf = guardFinite({ voltage });
    if (nf) return nf;
    return ok({ voltage, current: input.current, resistance: input.resistance }, OHM_ASSUMPTIONS);
  }
  if (input.solveFor === "current") {
    const invalid = validate([
      { name: "voltage", value: input.voltage, rule: "finite" },
      { name: "resistance", value: input.resistance, rule: "positive" },
    ]);
    if (invalid) return invalid;
    const current = input.voltage / input.resistance;
    const nf = guardFinite({ current });
    if (nf) return nf;
    return ok({ voltage: input.voltage, current, resistance: input.resistance }, OHM_ASSUMPTIONS);
  }
  // resistance
  const invalid = validate([
    { name: "voltage", value: input.voltage, rule: "finite" },
    { name: "current", value: input.current, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const resistance = input.voltage / input.current;
  const nf = guardFinite({ resistance });
  if (nf) return nf;
  return ok({ voltage: input.voltage, current: input.current, resistance }, OHM_ASSUMPTIONS);
}

/* --------------------------------- Power --------------------------------- */
// P = V·I = I²·R = V²/R

export type PowerInput =
  | { method: "vi"; voltage: number; current: number }
  | { method: "ir"; current: number; resistance: number }
  | { method: "vr"; voltage: number; resistance: number };

export interface PowerResult {
  power: number; // W
}

const POWER_ASSUMPTIONS = [
  "Resistive (real) power; no reactive/AC phase effects.",
  "DC / steady-state, ohmic device.",
];

export function power(input: PowerInput): CalcResult<PowerResult> {
  if (!input || !("method" in input)) return err("Choose a method", "method");
  if (input.method === "vi") {
    const invalid = validate([
      { name: "voltage", value: input.voltage, rule: "finite" },
      { name: "current", value: input.current, rule: "finite" },
    ]);
    if (invalid) return invalid;
    const p = Math.abs(input.voltage * input.current);
    const nf = guardFinite({ power: p });
    if (nf) return nf;
    return ok({ power: p }, POWER_ASSUMPTIONS);
  }
  if (input.method === "ir") {
    const invalid = validate([
      { name: "current", value: input.current, rule: "finite" },
      { name: "resistance", value: input.resistance, rule: "nonnegative" },
    ]);
    if (invalid) return invalid;
    const p = input.current * input.current * input.resistance;
    const nf = guardFinite({ power: p });
    if (nf) return nf;
    return ok({ power: p }, POWER_ASSUMPTIONS);
  }
  // vr
  const invalid = validate([
    { name: "voltage", value: input.voltage, rule: "finite" },
    { name: "resistance", value: input.resistance, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const p = (input.voltage * input.voltage) / input.resistance;
  const nf = guardFinite({ power: p });
  if (nf) return nf;
  return ok({ power: p }, POWER_ASSUMPTIONS);
}

/* ---------------------------- RC time constant --------------------------- */
// τ = R·C ; f_c = 1 / (2π R C)

export interface RcInput {
  resistance: number; // Ω
  capacitance: number; // F
}

export interface RcResult {
  timeConstant: number; // s
  cutoffFrequency: number; // Hz
}

export function rcTimeConstant(input: RcInput): CalcResult<RcResult> {
  const invalid = validate([
    { name: "resistance", value: input?.resistance, rule: "positive" },
    { name: "capacitance", value: input?.capacitance, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const timeConstant = input.resistance * input.capacitance;
  const cutoffFrequency = 1 / (2 * Math.PI * timeConstant);
  const nf = guardFinite({ timeConstant, cutoffFrequency });
  if (nf) return nf;
  return ok({ timeConstant, cutoffFrequency }, [
    "Ideal single-pole RC (one resistor, one capacitor); no parasitics.",
    "τ is the 63.2% charge/discharge time; f_c = 1/(2πRC) is the −3 dB corner.",
  ]);
}
