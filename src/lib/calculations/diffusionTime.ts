/**
 * Diffusion time and length (characteristic 1-D scaling).
 *
 * Formula (APPROXIMATION / scaling law, per spec §2D):  t ≈ L² / (2D)
 * Inverted for length:  L = √(2·D·t)
 *
 * This is an order-of-magnitude characteristic time for 1-D diffusion, not an
 * exact concentration profile.
 *
 * SI units: L [m], D [m²/s], t [s].
 */
import { CalcResult, ok } from "./result";
import { validate, guardFinite } from "./validation";

export interface DiffusionTimeInput {
  /** Diffusion distance L, m. */
  length: number;
  /** Diffusion coefficient D, m²/s. */
  diffusionCoefficient: number;
}

export interface DiffusionTimeResult {
  /** Characteristic diffusion time t, s. */
  time: number;
}

export interface DiffusionLengthInput {
  /** Elapsed time t, s. */
  time: number;
  /** Diffusion coefficient D, m²/s. */
  diffusionCoefficient: number;
}

export interface DiffusionLengthResult {
  /** Characteristic diffusion length L, m. */
  length: number;
}

const ASSUMPTIONS = [
  "1-D diffusion; t ≈ L²/2D is an APPROXIMATION (characteristic scaling), not an exact concentration profile.",
  "Constant diffusion coefficient D.",
];

export function diffusionTime(
  input: DiffusionTimeInput,
): CalcResult<DiffusionTimeResult> {
  const invalid = validate([
    { name: "length", value: input?.length, rule: "positive" },
    {
      name: "diffusionCoefficient",
      value: input?.diffusionCoefficient,
      rule: "positive",
    },
  ]);
  if (invalid) return invalid;

  const t = input.length ** 2 / (2 * input.diffusionCoefficient);
  const nf = guardFinite({ time: t });
  if (nf) return nf;

  return ok({ time: t }, ASSUMPTIONS);
}

export function diffusionLength(
  input: DiffusionLengthInput,
): CalcResult<DiffusionLengthResult> {
  const invalid = validate([
    { name: "time", value: input?.time, rule: "positive" },
    {
      name: "diffusionCoefficient",
      value: input?.diffusionCoefficient,
      rule: "positive",
    },
  ]);
  if (invalid) return invalid;

  const l = Math.sqrt(2 * input.diffusionCoefficient * input.time);
  const nf = guardFinite({ length: l });
  if (nf) return nf;

  return ok({ length: l }, ASSUMPTIONS);
}
