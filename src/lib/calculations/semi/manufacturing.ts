/**
 * Manufacturing calculators (pure, SI, UI-independent).
 */
import { CalcResult, ok, err } from "../result";
import { validate, guardFinite } from "../validation";

/* ----------------------------- Die per wafer ----------------------------- */
// de Vries approximation:
//   DPW = (π · d² / (4 · S)) − (π · d / √(2 · S))
// where d = wafer diameter, S = die area. Edge/scribe losses are captured by
// the second term. This is an estimate; exact packing depends on die aspect
// ratio, scribe width, and edge-exclusion, which this model does not take.

export interface DiePerWaferInput {
  waferDiameter: number; // d, m
  dieArea: number; // S, m²
}

export interface DiePerWaferResult {
  diePerWafer: number; // integer count (floored, ≥ 0)
  grossDiePerWafer: number; // ideal area-fill (π d² / 4S), floored
}

export function diePerWafer(input: DiePerWaferInput): CalcResult<DiePerWaferResult> {
  const invalid = validate([
    { name: "waferDiameter", value: input?.waferDiameter, rule: "positive" },
    { name: "dieArea", value: input?.dieArea, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const d = input.waferDiameter;
  const s = input.dieArea;
  const raw = (Math.PI * d * d) / (4 * s) - (Math.PI * d) / Math.sqrt(2 * s);
  const gross = (Math.PI * d * d) / (4 * s);
  const nf = guardFinite({ raw, gross });
  if (nf) return nf;

  const diePerWaferCount = Math.max(0, Math.floor(raw));
  return ok(
    { diePerWafer: diePerWaferCount, grossDiePerWafer: Math.max(0, Math.floor(gross)) },
    [
      "de Vries approximation for die per wafer.",
      "Square dies assumed; no scribe-line or edge-exclusion width is modeled.",
      "Result is an estimate — real fabs use exact layout/packing tools.",
    ],
  );
}

/* ------------------------------ Wafer yield ------------------------------ */
// Poisson:  Y = e^(−D·A)
// Murphy:   Y = ((1 − e^(−D·A)) / (D·A))²
// D = defect density (defects / m²), A = die area (m²).

export type YieldModel = "poisson" | "murphy";

export interface YieldInput {
  defectDensity: number; // D, defects / m²
  dieArea: number; // A, m²
  model: YieldModel;
}

export interface YieldResult {
  yield: number; // fraction 0..1
  yieldPercent: number; // 0..100
  model: YieldModel;
}

export function waferYield(input: YieldInput): CalcResult<YieldResult> {
  if (!input || (input.model !== "poisson" && input.model !== "murphy")) {
    return err("Choose a yield model", "model");
  }
  const invalid = validate([
    { name: "defectDensity", value: input.defectDensity, rule: "nonnegative" },
    { name: "dieArea", value: input.dieArea, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const da = input.defectDensity * input.dieArea;
  let y: number;
  if (input.model === "poisson") {
    y = Math.exp(-da);
  } else {
    // Murphy: limit as da→0 is 1 (handled naturally since (1-e^-x)/x → 1).
    y = da === 0 ? 1 : Math.pow((1 - Math.exp(-da)) / da, 2);
  }
  const nf = guardFinite({ yield: y });
  if (nf) return nf;
  // Clamp to a physical [0,1] fraction.
  y = Math.min(1, Math.max(0, y));

  return ok(
    { yield: y, yieldPercent: y * 100, model: input.model },
    input.model === "poisson"
      ? [
          "Poisson (Seeds) yield model: Y = e^(−D·A).",
          "Defects are random, independent, and uniformly distributed.",
          "A single defect in the die area is assumed fatal.",
        ]
      : [
          "Murphy yield model: Y = ((1 − e^(−D·A)) / (D·A))².",
          "Accounts for non-uniform defect distribution across the wafer.",
          "A single defect in the die area is assumed fatal.",
        ],
  );
}
