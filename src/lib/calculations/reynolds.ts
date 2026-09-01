/**
 * Reynolds number — laminar vs. turbulent check.
 *
 * Formula (exact, per spec §2A):  Re = ρ · v · Dₕ / μ
 *
 * All inputs are SI base units. Re is dimensionless.
 */
import { CalcResult, ok } from "./result";
import { validate, guardFinite } from "./validation";

export interface ReynoldsInput {
  /** Fluid density ρ, kg/m³. */
  density: number;
  /** Mean velocity v, m/s. */
  velocity: number;
  /** Hydraulic diameter Dₕ, m. */
  hydraulicDiameter: number;
  /** Dynamic viscosity μ, Pa·s. */
  viscosity: number;
}

export type FlowRegime = "laminar" | "transitional" | "turbulent";

export interface ReynoldsResult {
  /** Reynolds number (dimensionless). */
  reynolds: number;
  regime: FlowRegime;
}

const ASSUMPTIONS = [
  "Newtonian, incompressible fluid.",
  "Hydraulic diameter Dₕ is appropriate for the channel cross-section.",
  "Regime thresholds use the conventional pipe-flow values (laminar Re < 2000, transitional 2000–4000, turbulent > 4000); the true transition in microchannels can differ.",
];

/** Classify a Reynolds number using conventional thresholds. */
export function classifyRegime(re: number): FlowRegime {
  if (re < 2000) return "laminar";
  if (re <= 4000) return "transitional";
  return "turbulent";
}

export function reynolds(input: ReynoldsInput): CalcResult<ReynoldsResult> {
  const invalid = validate([
    { name: "density", value: input?.density, rule: "positive" },
    { name: "velocity", value: input?.velocity, rule: "nonnegative" },
    { name: "hydraulicDiameter", value: input?.hydraulicDiameter, rule: "positive" },
    { name: "viscosity", value: input?.viscosity, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const re =
    (input.density * input.velocity * input.hydraulicDiameter) /
    input.viscosity;

  const nonFinite = guardFinite({ reynolds: re });
  if (nonFinite) return nonFinite;

  return ok({ reynolds: re, regime: classifyRegime(re) }, ASSUMPTIONS);
}
