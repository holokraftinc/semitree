/**
 * Hydraulic (flow) resistance of a channel — R = ΔP / Q.
 *
 * Three methods (per spec §2A):
 *  - circular:           R = 128·μ·L / (π·D⁴)                          (EXACT, laminar)
 *  - rectangular:        R ≈ 12·μ·L / (w·h³·(1 − 0.63·h/w))           (APPROXIMATION)
 *  - from-measurements:  R = ΔP / Q                                    (definition)
 *
 * The rectangular form is the common first-term approximation of the exact
 * Fourier-series solution; it is most accurate for high aspect ratios (h ≪ w).
 * The smaller of width/height is treated as the height h.
 *
 * SI units throughout: μ [Pa·s], L,D,w,h [m], ΔP [Pa], Q [m³/s] → R [Pa·s/m³].
 */
import { CalcResult, ok, err } from "./result";
import { validate, guardFinite } from "./validation";

export type FlowResistanceInput =
  | { method: "circular"; viscosity: number; length: number; diameter: number }
  | {
      method: "rectangular";
      viscosity: number;
      length: number;
      width: number;
      height: number;
    }
  | { method: "from-measurements"; pressureDrop: number; flowRate: number };

export interface FlowResistanceResult {
  /** Hydraulic resistance R, Pa·s/m³. */
  resistance: number;
  /** True when an approximate formula was used. */
  approximation: boolean;
}

/**
 * Rectangular-channel resistance (first-term approximation). Exported so the
 * pressure-drop module can reuse the identical physics. `w`/`h` are ordered
 * internally so h is the smaller dimension (the formula assumes h ≤ w).
 */
export function rectangularResistance(
  viscosity: number,
  length: number,
  width: number,
  height: number,
): number {
  const w = Math.max(width, height);
  const h = Math.min(width, height);
  return (12 * viscosity * length) / (w * h ** 3 * (1 - 0.63 * (h / w)));
}

/** Circular-channel resistance (exact, laminar Hagen–Poiseuille). */
export function circularResistance(
  viscosity: number,
  length: number,
  diameter: number,
): number {
  return (128 * viscosity * length) / (Math.PI * diameter ** 4);
}

const LAMINAR_ASSUMPTION =
  "Fully developed, steady, laminar flow of a Newtonian fluid.";

export function flowResistance(
  input: FlowResistanceInput,
): CalcResult<FlowResistanceResult> {
  if (!input || typeof input !== "object" || !("method" in input)) {
    return err("A resistance method must be provided", "method");
  }

  if (input.method === "circular") {
    const invalid = validate([
      { name: "viscosity", value: input.viscosity, rule: "positive" },
      { name: "length", value: input.length, rule: "positive" },
      { name: "diameter", value: input.diameter, rule: "positive" },
    ]);
    if (invalid) return invalid;
    const r = circularResistance(input.viscosity, input.length, input.diameter);
    const nf = guardFinite({ resistance: r });
    if (nf) return nf;
    return ok({ resistance: r, approximation: false }, [
      LAMINAR_ASSUMPTION,
      "Circular cross-section; R = 128μL/(πD⁴) is exact for this case.",
    ]);
  }

  if (input.method === "rectangular") {
    const invalid = validate([
      { name: "viscosity", value: input.viscosity, rule: "positive" },
      { name: "length", value: input.length, rule: "positive" },
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
    const nf = guardFinite({ resistance: r });
    if (nf) return nf;
    const ratio = Math.min(input.width, input.height) / Math.max(input.width, input.height);
    const warnings =
      ratio > 0.7
        ? [
            "Aspect ratio h/w is near 1; the first-term approximation is least accurate for near-square channels.",
          ]
        : [];
    return ok(
      { resistance: r, approximation: true },
      [
        LAMINAR_ASSUMPTION,
        "Rectangular R ≈ 12μL/(wh³(1−0.63 h/w)) is an APPROXIMATION (first term of the exact series); most accurate for h ≪ w.",
        "The smaller of width/height is taken as the height h.",
      ],
      warnings,
    );
  }

  if (input.method === "from-measurements") {
    const invalid = validate([
      { name: "pressureDrop", value: input.pressureDrop, rule: "nonnegative" },
      { name: "flowRate", value: input.flowRate, rule: "positive" },
    ]);
    if (invalid) return invalid;
    const r = input.pressureDrop / input.flowRate;
    const nf = guardFinite({ resistance: r });
    if (nf) return nf;
    return ok({ resistance: r, approximation: false }, [
      "R = ΔP/Q by definition; no flow-regime assumption is made.",
    ]);
  }

  return err("Unknown resistance method", "method");
}
