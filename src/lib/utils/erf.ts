/**
 * Error function (erf) and complementary error function (erfc).
 *
 * Uses the Abramowitz & Stegun 7.1.26 rational approximation (max abs error
 * ~1.5e-7), which is ample for an educational diffusion visualization. Pure and
 * framework-free.
 */
export function erf(x: number): number {
  if (!Number.isFinite(x)) return NaN;
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

export function erfc(x: number): number {
  return 1 - erf(x);
}
