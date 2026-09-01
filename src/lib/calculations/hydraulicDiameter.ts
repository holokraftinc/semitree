/**
 * Hydraulic diameter for a rectangular channel.
 *
 * Formula (exact for a rectangle, per spec §2A):  Dₕ = 2wh / (w + h)
 * This is the general Dₕ = 4A/P specialised to a rectangle (A = wh, P = 2(w+h)).
 *
 * Inputs and output are in metres.
 */
import { CalcResult, ok } from "./result";
import { validate, guardFinite } from "./validation";

export interface HydraulicDiameterInput {
  /** Channel width w, m. */
  width: number;
  /** Channel height h, m. */
  height: number;
}

export interface HydraulicDiameterResult {
  /** Hydraulic diameter Dₕ, m. */
  hydraulicDiameter: number;
}

const ASSUMPTIONS = [
  "Rectangular cross-section.",
  "Dₕ = 2wh/(w+h), equivalent to 4·Area/Perimeter for a rectangle (exact).",
];

export function hydraulicDiameter(
  input: HydraulicDiameterInput,
): CalcResult<HydraulicDiameterResult> {
  const invalid = validate([
    { name: "width", value: input?.width, rule: "positive" },
    { name: "height", value: input?.height, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const dh = (2 * input.width * input.height) / (input.width + input.height);

  const nonFinite = guardFinite({ hydraulicDiameter: dh });
  if (nonFinite) return nonFinite;

  return ok({ hydraulicDiameter: dh }, ASSUMPTIONS);
}
