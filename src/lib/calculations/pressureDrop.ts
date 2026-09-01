/**
 * Pressure drop across a channel (Hagen–Poiseuille).
 *
 * Formulas (per spec §2A):
 *  - circular:     ΔP = 128·μ·L·Q / (π·D⁴)                 (EXACT, laminar)
 *  - rectangular:  ΔP = R·Q with R ≈ 12·μ·L/(w·h³(1−0.63 h/w))  (APPROXIMATION)
 *
 * SI units: μ [Pa·s], L,D,w,h [m], Q [m³/s] → ΔP [Pa], R [Pa·s/m³].
 */
import { CalcResult, ok, err } from "./result";
import { validate, guardFinite } from "./validation";
import { circularResistance, rectangularResistance } from "./flowResistance";

export type PressureDropInput =
  | {
      shape: "circular";
      viscosity: number;
      length: number;
      flowRate: number;
      diameter: number;
    }
  | {
      shape: "rectangular";
      viscosity: number;
      length: number;
      flowRate: number;
      width: number;
      height: number;
    };

export interface PressureDropResult {
  /** Pressure drop ΔP, Pa. */
  pressureDrop: number;
  /** Hydraulic resistance R used, Pa·s/m³. */
  resistance: number;
  /** True when the resistance model is an approximation (rectangular). */
  approximation: boolean;
}

const LAMINAR_ASSUMPTION =
  "Fully developed, steady, laminar flow of a Newtonian fluid.";

export function pressureDrop(
  input: PressureDropInput,
): CalcResult<PressureDropResult> {
  if (!input || typeof input !== "object" || !("shape" in input)) {
    return err("A channel shape must be provided", "shape");
  }

  if (input.shape === "circular") {
    const invalid = validate([
      { name: "viscosity", value: input.viscosity, rule: "positive" },
      { name: "length", value: input.length, rule: "positive" },
      { name: "flowRate", value: input.flowRate, rule: "nonnegative" },
      { name: "diameter", value: input.diameter, rule: "positive" },
    ]);
    if (invalid) return invalid;
    const r = circularResistance(input.viscosity, input.length, input.diameter);
    const dp = r * input.flowRate;
    const nf = guardFinite({ pressureDrop: dp, resistance: r });
    if (nf) return nf;
    return ok({ pressureDrop: dp, resistance: r, approximation: false }, [
      LAMINAR_ASSUMPTION,
      "Circular cross-section; ΔP = 128μLQ/(πD⁴) is exact for this case.",
    ]);
  }

  if (input.shape === "rectangular") {
    const invalid = validate([
      { name: "viscosity", value: input.viscosity, rule: "positive" },
      { name: "length", value: input.length, rule: "positive" },
      { name: "flowRate", value: input.flowRate, rule: "nonnegative" },
      { name: "width", value: input.width, rule: "positive" },
      { name: "height", value: input.height, rule: "positive" },
    ]);
    if (invalid) return invalid;
    const r = rectangularResistance(
      input.viscosity,
      input.length,
      input.width,
      input.height,
    );
    const dp = r * input.flowRate;
    const nf = guardFinite({ pressureDrop: dp, resistance: r });
    if (nf) return nf;
    return ok({ pressureDrop: dp, resistance: r, approximation: true }, [
      LAMINAR_ASSUMPTION,
      "Rectangular ΔP uses R ≈ 12μL/(wh³(1−0.63 h/w)), an APPROXIMATION (first term of the exact series); most accurate for h ≪ w.",
    ]);
  }

  return err("Unknown channel shape", "shape");
}
