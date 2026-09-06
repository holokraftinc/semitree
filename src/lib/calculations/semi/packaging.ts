/**
 * Packaging / thermal calculators (pure, SI, UI-independent).
 */
import { CalcResult, ok } from "../result";
import { validate, guardFinite } from "../validation";

/* --------------------------- Thermal resistance -------------------------- */
// Junction temperature: T_j = T_a + P · θ_JA
// where θ_JA = junction-to-ambient thermal resistance (K/W), P = dissipated
// power (W), T_a = ambient temperature (K).

export interface ThermalInput {
  power: number; // P, W
  thermalResistance: number; // θ_JA, K/W
  ambientTemp: number; // T_a, K
}

export interface ThermalResult {
  junctionTemp: number; // T_j, K
  temperatureRise: number; // ΔT = P · θ, K
}

export function junctionTemperature(input: ThermalInput): CalcResult<ThermalResult> {
  const invalid = validate([
    { name: "power", value: input?.power, rule: "nonnegative" },
    { name: "thermalResistance", value: input?.thermalResistance, rule: "nonnegative" },
    { name: "ambientTemp", value: input?.ambientTemp, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const temperatureRise = input.power * input.thermalResistance;
  const junctionTemp = input.ambientTemp + temperatureRise;
  const nf = guardFinite({ junctionTemp, temperatureRise });
  if (nf) return nf;

  return ok({ junctionTemp, temperatureRise }, [
    "Steady-state, one-dimensional heat flow (single θ_JA path).",
    "θ_JA is treated as constant (independent of temperature and airflow).",
    "All dissipated power flows from junction to ambient through θ_JA.",
  ]);
}

/* ----------------------------- Power density ----------------------------- */
// P_density = P / A

export interface PowerDensityInput {
  power: number; // P, W
  area: number; // A, m²
}

export interface PowerDensityResult {
  powerDensity: number; // W/m²
}

export function powerDensity(input: PowerDensityInput): CalcResult<PowerDensityResult> {
  const invalid = validate([
    { name: "power", value: input?.power, rule: "nonnegative" },
    { name: "area", value: input?.area, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const pd = input.power / input.area;
  const nf = guardFinite({ powerDensity: pd });
  if (nf) return nf;

  return ok({ powerDensity: pd }, [
    "Uniform power dissipation over the given area.",
    "Areal power density only; no depth/volume term.",
  ]);
}
