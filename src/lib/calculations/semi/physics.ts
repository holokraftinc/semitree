/**
 * Semiconductor-physics calculators (pure, SI, UI-independent).
 */
import { CalcResult, ok } from "../result";
import { validate, guardFinite } from "../validation";
import { KB, Q, NI_SILICON_300K } from "./constants";

/* --------------------------- Built-in potential -------------------------- */
// V_bi = (k_B · T / q) · ln( N_a · N_d / n_i² )  — abrupt PN junction

export interface BuiltInPotentialInput {
  acceptorConc: number; // N_a, m^-3
  donorConc: number; // N_d, m^-3
  temperature: number; // T, K
  intrinsicConc?: number; // n_i, m^-3 (defaults to silicon @ ~300 K)
}

export interface BuiltInPotentialResult {
  builtInPotential: number; // V
  thermalVoltage: number; // kT/q, V
  intrinsicConc: number; // n_i used, m^-3
}

export function builtInPotential(
  input: BuiltInPotentialInput,
): CalcResult<BuiltInPotentialResult> {
  const ni = input?.intrinsicConc ?? NI_SILICON_300K;
  const invalid = validate([
    { name: "acceptorConc", value: input?.acceptorConc, rule: "positive" },
    { name: "donorConc", value: input?.donorConc, rule: "positive" },
    { name: "temperature", value: input?.temperature, rule: "positive" },
    { name: "intrinsicConc", value: ni, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const thermalVoltage = (KB * input.temperature) / Q; // V
  const builtIn = thermalVoltage * Math.log((input.acceptorConc * input.donorConc) / (ni * ni));
  const nf = guardFinite({ builtInPotential: builtIn, thermalVoltage });
  if (nf) return nf;

  return ok(
    { builtInPotential: builtIn, thermalVoltage, intrinsicConc: ni },
    [
      "Abrupt (step) PN junction in thermal equilibrium.",
      "Non-degenerate doping: Boltzmann statistics apply.",
      "Complete ionization of dopants.",
      `Intrinsic carrier concentration n_i = ${ni.toExponential(2)} m^-3 (silicon ~300 K unless overridden).`,
    ],
  );
}
