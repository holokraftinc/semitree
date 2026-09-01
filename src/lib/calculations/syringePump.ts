/**
 * Syringe-pump settings — mapping between plunger speed and flow rate.
 *
 * A syringe pump advances the plunger at a linear speed; the volumetric flow
 * rate is that speed times the syringe's internal cross-sectional area:
 *   A = π·d²/4   and   Q = A·v            (exact geometric relation)
 *
 * SI units: d [m], v [m/s], A [m²], Q [m³/s].
 */
import { CalcResult, ok, err } from "./result";
import { validate, guardFinite } from "./validation";

export type SyringePumpInput =
  | { mode: "speed-from-flow"; innerDiameter: number; flowRate: number }
  | { mode: "flow-from-speed"; innerDiameter: number; plungerSpeed: number };

export interface SyringePumpResult {
  /** Syringe internal cross-sectional area A, m². */
  crossSectionArea: number;
  /** Volumetric flow rate Q, m³/s. */
  flowRate: number;
  /** Plunger linear speed v, m/s. */
  plungerSpeed: number;
}

const ASSUMPTIONS = [
  "Incompressible fluid; no leakage or system compliance (tubing/seal deformation ignored).",
  "Q = A·v with A = π·d²/4 (based on the syringe internal diameter) is exact geometry.",
];

export function syringePump(
  input: SyringePumpInput,
): CalcResult<SyringePumpResult> {
  if (!input || typeof input !== "object" || !("mode" in input)) {
    return err("A mode must be provided", "mode");
  }

  const diameterCheck = validate([
    { name: "innerDiameter", value: input.innerDiameter, rule: "positive" },
  ]);
  if (diameterCheck) return diameterCheck;

  const area = (Math.PI * input.innerDiameter ** 2) / 4;

  if (input.mode === "speed-from-flow") {
    const invalid = validate([
      { name: "flowRate", value: input.flowRate, rule: "nonnegative" },
    ]);
    if (invalid) return invalid;
    const plungerSpeed = input.flowRate / area;
    const nf = guardFinite({
      crossSectionArea: area,
      flowRate: input.flowRate,
      plungerSpeed,
    });
    if (nf) return nf;
    return ok(
      { crossSectionArea: area, flowRate: input.flowRate, plungerSpeed },
      ASSUMPTIONS,
    );
  }

  if (input.mode === "flow-from-speed") {
    const invalid = validate([
      { name: "plungerSpeed", value: input.plungerSpeed, rule: "nonnegative" },
    ]);
    if (invalid) return invalid;
    const flowRate = area * input.plungerSpeed;
    const nf = guardFinite({
      crossSectionArea: area,
      flowRate,
      plungerSpeed: input.plungerSpeed,
    });
    if (nf) return nf;
    return ok(
      { crossSectionArea: area, flowRate, plungerSpeed: input.plungerSpeed },
      ASSUMPTIONS,
    );
  }

  return err("Unknown mode", "mode");
}
