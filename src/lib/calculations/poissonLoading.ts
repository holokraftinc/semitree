/**
 * Poisson single-cell loading statistics.
 *
 * Formula (exact, per spec §2C):  P(k) = λᵏ·e^(−λ) / k!
 * where λ is the mean number of cells per droplet.
 *
 * Reports the probabilities of a droplet containing 0, exactly 1, or 2+ cells.
 * The 1-cell probability is the useful single-occupancy fraction for scRNA-seq.
 */
import { CalcResult, ok } from "./result";
import { validate, guardFinite, requireInteger } from "./validation";

export interface PoissonInput {
  /** Mean cells per droplet, λ (dimensionless, ≥ 0). */
  lambda: number;
}

export interface PoissonResult {
  lambda: number;
  /** P(0 cells). */
  p0: number;
  /** P(exactly 1 cell) — the useful single-occupancy fraction. */
  p1: number;
  /** P(2 or more cells) — doublets and higher. */
  p2OrMore: number;
}

const ASSUMPTIONS = [
  "Cells are independent and randomly distributed (Poisson statistics), P(k)=λᵏe^(−λ)/k! (exact).",
  "λ is the mean cells per droplet; achieving mostly-single occupancy requires low λ (most droplets empty).",
];

/** Poisson pmf, computed iteratively to avoid factorial/pow overflow. */
export function poissonPmf(lambda: number, k: number): CalcResult<number> {
  const invalidLambda = validate([
    { name: "lambda", value: lambda, rule: "nonnegative" },
  ]);
  if (invalidLambda) return invalidLambda;
  const invalidK = requireInteger("k", k);
  if (invalidK) return invalidK;
  if (k < 0) return { ok: false, error: "k must be zero or greater", field: "k" };

  // p = λ^k e^{-λ} / k!  built up term by term.
  let p = Math.exp(-lambda);
  for (let i = 1; i <= k; i++) {
    p *= lambda / i;
  }
  const nf = guardFinite({ p });
  if (nf) return nf;
  return ok(p, ASSUMPTIONS);
}

export function poissonLoading(input: PoissonInput): CalcResult<PoissonResult> {
  const invalid = validate([
    { name: "lambda", value: input?.lambda, rule: "nonnegative" },
  ]);
  if (invalid) return invalid;

  const lambda = input.lambda;
  const p0 = Math.exp(-lambda);
  const p1 = lambda * Math.exp(-lambda);
  // Clamp tiny negative float residue from 1 − p0 − p1.
  const p2OrMore = Math.max(0, 1 - p0 - p1);

  const nf = guardFinite({ p0, p1, p2OrMore });
  if (nf) return nf;

  return ok({ lambda, p0, p1, p2OrMore }, ASSUMPTIONS);
}

export interface LambdaFromConcentrationInput {
  /** Cell concentration, cells/m³. */
  cellConcentration: number;
  /** Droplet volume, m³. */
  dropletVolume: number;
}

/** Convenience: λ = concentration × droplet volume. */
export function lambdaFromConcentration(
  input: LambdaFromConcentrationInput,
): CalcResult<{ lambda: number }> {
  const invalid = validate([
    {
      name: "cellConcentration",
      value: input?.cellConcentration,
      rule: "nonnegative",
    },
    { name: "dropletVolume", value: input?.dropletVolume, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const lambda = input.cellConcentration * input.dropletVolume;
  const nf = guardFinite({ lambda });
  if (nf) return nf;

  return ok({ lambda }, [
    "λ = cell concentration × droplet volume; requires consistent SI units (cells/m³ and m³).",
  ]);
}
