/**
 * General semiconductor calculators (pure, SI, UI-independent).
 *
 * Each function takes SI inputs and returns a CalcResult carrying the number(s),
 * the assumptions behind them, and validation errors for bad input. Formulas are
 * standard geometric / material relationships — no semiconductor-specific
 * empirical claims are made.
 */
import { CalcResult, ok } from "../result";
import { validate, guardFinite } from "../validation";

/* ------------------------------- Die area -------------------------------- */
// area = width × height; square-equivalent side = √area.

export interface DieAreaInput {
  width: number; // m
  height: number; // m
}

export interface DieAreaResult {
  area: number; // m²
  squareEquivalent: number; // m (side of a square of equal area)
}

export function dieArea(input: DieAreaInput): CalcResult<DieAreaResult> {
  const invalid = validate([
    { name: "width", value: input?.width, rule: "positive" },
    { name: "height", value: input?.height, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const area = input.width * input.height;
  const squareEquivalent = Math.sqrt(area);
  const nf = guardFinite({ area, squareEquivalent });
  if (nf) return nf;

  return ok({ area, squareEquivalent }, [
    "Rectangular die; area = width × height.",
    "Square-equivalent side = √area (the side of a square of the same area).",
    "Ignores scribe lanes, edge exclusion, and rounded corners.",
  ]);
}

/* ----------------------------- Aspect ratio ------------------------------ */
// aspect ratio = depth / width (dimensionless).

export interface AspectRatioInput {
  depth: number; // m
  width: number; // m
}

export interface AspectRatioResult {
  aspectRatio: number; // dimensionless (depth : width)
}

export function aspectRatio(input: AspectRatioInput): CalcResult<AspectRatioResult> {
  const invalid = validate([
    { name: "depth", value: input?.depth, rule: "nonnegative" },
    { name: "width", value: input?.width, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const ratio = input.depth / input.width;
  const nf = guardFinite({ ratio });
  if (nf) return nf;

  return ok({ aspectRatio: ratio }, [
    "Aspect ratio = feature depth ÷ feature width (same length units cancel).",
    "A dimensionless number; 2:1 means depth is twice the width.",
  ]);
}

/* --------------------------- Sheet resistance ---------------------------- */
// Rs = ρ / t  (Ω/square);  R = Rs × (number of squares)  (Ω).
// Number of squares = L / W for a rectangular conductor.

export interface SheetResistanceInput {
  resistivity: number; // ρ, Ω·m
  thickness: number; // t, m
  squares?: number; // L/W, dimensionless (default 1)
}

export interface SheetResistanceResult {
  sheetResistance: number; // Rs, Ω/square
  squares: number; // number of squares used
  resistance: number; // R = Rs × squares, Ω
}

export function sheetResistance(input: SheetResistanceInput): CalcResult<SheetResistanceResult> {
  const squares = input?.squares ?? 1;
  const invalid = validate([
    { name: "resistivity", value: input?.resistivity, rule: "positive" },
    { name: "thickness", value: input?.thickness, rule: "positive" },
    { name: "squares", value: squares, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const rs = input.resistivity / input.thickness;
  const resistance = rs * squares;
  const nf = guardFinite({ rs, resistance });
  if (nf) return nf;

  return ok({ sheetResistance: rs, squares, resistance }, [
    "Uniform film of constant resistivity and thickness.",
    "Sheet resistance Rs = ρ / t, expressed in ohms per square (Ω/□).",
    "Resistance R = Rs × (L/W); the number of squares is the length-to-width ratio.",
  ]);
}
