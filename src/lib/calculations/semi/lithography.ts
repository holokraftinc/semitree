/**
 * Photolithography calculators (pure, SI, UI-independent).
 *
 * These are EDUCATIONAL estimates based on the standard Rayleigh-style optical
 * relationships. They capture the first-order physics only — real lithographic
 * performance depends on illumination, resist, mask (OPC), process control, and
 * much more. No specific tool, node, or fab is modelled.
 */
import { CalcResult, ok } from "../result";
import { validate, guardFinite } from "../validation";

/* ----------------------------- Resolution -------------------------------- */
// Rayleigh:  R = k1 · λ / NA

export interface ResolutionInput {
  wavelength: number; // λ, m
  numericalAperture: number; // NA, dimensionless
  k1: number; // process factor, dimensionless
}

export interface ResolutionResult {
  resolution: number; // m
}

export function lithoResolution(input: ResolutionInput): CalcResult<ResolutionResult> {
  const invalid = validate([
    { name: "wavelength", value: input?.wavelength, rule: "positive" },
    { name: "numericalAperture", value: input?.numericalAperture, rule: "positive" },
    { name: "k1", value: input?.k1, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const resolution = (input.k1 * input.wavelength) / input.numericalAperture;
  const nf = guardFinite({ resolution });
  if (nf) return nf;

  const warnings: string[] = [];
  if (input.k1 < 0.25) {
    warnings.push("k1 below ~0.25 is beyond the single-exposure theoretical limit; real processes use multiple patterning to go lower.");
  }
  if (input.numericalAperture > 1.5) {
    warnings.push("NA above ~1.5 is beyond current optics; typical values are ≤1.35 (immersion DUV) or ~0.33–0.55 (EUV).");
  }

  return ok(
    { resolution },
    [
      "Rayleigh criterion R = k1·λ/NA — an educational, theoretical estimate.",
      "k1 bundles illumination, resist, and mask effects; the single-exposure floor is ~0.25.",
      "Real resolution also depends on process window, resist, mask correction, and metrology.",
    ],
    warnings,
  );
}

/* --------------------------- Depth of focus ------------------------------ */
// DOF = k2 · λ / NA²

export interface DepthOfFocusInput {
  wavelength: number; // λ, m
  numericalAperture: number; // NA, dimensionless
  k2: number; // process factor, dimensionless
}

export interface DepthOfFocusResult {
  depthOfFocus: number; // m
}

export function lithoDepthOfFocus(input: DepthOfFocusInput): CalcResult<DepthOfFocusResult> {
  const invalid = validate([
    { name: "wavelength", value: input?.wavelength, rule: "positive" },
    { name: "numericalAperture", value: input?.numericalAperture, rule: "positive" },
    { name: "k2", value: input?.k2, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const depthOfFocus = (input.k2 * input.wavelength) / (input.numericalAperture * input.numericalAperture);
  const nf = guardFinite({ depthOfFocus });
  if (nf) return nf;

  return ok({ depthOfFocus }, [
    "DOF = k2·λ/NA² — an educational, scalar estimate.",
    "Because NA is squared, raising NA to improve resolution sharply reduces focus margin.",
    "Real usable focus is smaller once wafer flatness and topography are included.",
  ]);
}

/* --------------------------- Pitch / half-pitch -------------------------- */
// Dense line/space: half-pitch = pitch / 2; line width = space = half-pitch.

export interface HalfPitchInput {
  pitch: number; // m
}

export interface HalfPitchResult {
  halfPitch: number; // m
  lineWidth: number; // m (equal line/space assumption)
  space: number; // m
}

export function halfPitch(input: HalfPitchInput): CalcResult<HalfPitchResult> {
  const invalid = validate([{ name: "pitch", value: input?.pitch, rule: "positive" }]);
  if (invalid) return invalid;

  const hp = input.pitch / 2;
  const nf = guardFinite({ hp });
  if (nf) return nf;

  return ok({ halfPitch: hp, lineWidth: hp, space: hp }, [
    "Pitch is the centre-to-centre distance between repeating features.",
    "Half-pitch = pitch ÷ 2; for an equal line/space pattern, line width = space = half-pitch.",
  ]);
}

/* ---------------------------- Overlay error ------------------------------ */
// Independent contributions add in quadrature (root-sum-square).
//   total = √(Σ cᵢ²)

export interface OverlayInput {
  xError: number; // m
  yError: number; // m
  processError: number; // m (combined process/distortion contribution)
}

export interface OverlayResult {
  total: number; // m — combined (RSS) overlay
}

export function overlayError(input: OverlayInput): CalcResult<OverlayResult> {
  const invalid = validate([
    { name: "xError", value: input?.xError, rule: "nonnegative" },
    { name: "yError", value: input?.yError, rule: "nonnegative" },
    { name: "processError", value: input?.processError, rule: "nonnegative" },
  ]);
  if (invalid) return invalid;

  const total = Math.sqrt(input.xError ** 2 + input.yError ** 2 + input.processError ** 2);
  const nf = guardFinite({ total });
  if (nf) return nf;

  return ok({ total }, [
    "Independent error sources combine in quadrature: total = √(Σ contributions²).",
    "This is an educational error-budget model, not any specific fab's overlay budget.",
    "Correlated or systematic errors do not combine this way and must be handled separately.",
  ]);
}

/* ------------------------------- Dose ------------------------------------ */
// dose = energy / area

export interface DoseInput {
  energy: number; // J
  area: number; // m²
}

export interface DoseResult {
  dose: number; // J/m²
}

export function exposureDose(input: DoseInput): CalcResult<DoseResult> {
  const invalid = validate([
    { name: "energy", value: input?.energy, rule: "positive" },
    { name: "area", value: input?.area, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const dose = input.energy / input.area;
  const nf = guardFinite({ dose });
  if (nf) return nf;

  return ok({ dose }, [
    "Dose = exposure energy ÷ exposed area (J/m²; commonly quoted in mJ/cm²).",
    "An educational definition — real exposure/process control (dose, focus, uniformity) is far more complex.",
  ]);
}
