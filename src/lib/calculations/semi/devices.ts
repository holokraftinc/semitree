/**
 * Device-physics calculators (pure, SI, UI-independent).
 *
 * These are standard EDUCATIONAL textbook relationships (long-channel MOSFET,
 * ideal Shockley diode, parallel-plate capacitor, Varshni bandgap, …). They are
 * teaching models, not device simulators: they omit short-channel effects,
 * velocity saturation, series resistance, high-field and quantum effects, etc.
 */
import { CalcResult, ok, err } from "../result";
import { validate, guardFinite } from "../validation";
import { KB, Q, EPS0, EPS_SI, EPS_OX, NI_SILICON_300K } from "./constants";

/* --------------------------- Thermal voltage ----------------------------- */
// Vt = kB·T / q

export interface ThermalVoltageInput { temperature: number; } // K
export interface ThermalVoltageResult { thermalVoltage: number; } // V

export function thermalVoltage(input: ThermalVoltageInput): CalcResult<ThermalVoltageResult> {
  const invalid = validate([{ name: "temperature", value: input?.temperature, rule: "positive" }]);
  if (invalid) return invalid;
  const vt = (KB * input.temperature) / Q;
  const nf = guardFinite({ vt });
  if (nf) return nf;
  return ok({ thermalVoltage: vt }, [
    "Thermal voltage Vt = kB·T/q (≈ 25.85 mV at 300 K).",
    "Sets the scale of diode and subthreshold exponentials.",
  ]);
}

/* ------------------------ Parallel-plate capacitor ----------------------- */
// C = ε0·εr·A / d

export interface CapacitorInput { area: number; distance: number; relativePermittivity: number; }
export interface CapacitorResult { capacitance: number; } // F

export function parallelPlateCapacitance(input: CapacitorInput): CalcResult<CapacitorResult> {
  const invalid = validate([
    { name: "area", value: input?.area, rule: "positive" },
    { name: "distance", value: input?.distance, rule: "positive" },
    { name: "relativePermittivity", value: input?.relativePermittivity, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const capacitance = (EPS0 * input.relativePermittivity * input.area) / input.distance;
  const nf = guardFinite({ capacitance });
  if (nf) return nf;
  return ok({ capacitance }, [
    "Ideal parallel-plate capacitor: C = ε0·εr·A/d.",
    "Ignores fringing fields and non-uniform dielectrics.",
  ]);
}

/* ---------------------------- Resistor (R=ρL/A) -------------------------- */

export interface ResistorInput { resistivity: number; length: number; area: number; }
export interface ResistorResult { resistance: number; } // Ω

export function resistorFromGeometry(input: ResistorInput): CalcResult<ResistorResult> {
  const invalid = validate([
    { name: "resistivity", value: input?.resistivity, rule: "positive" },
    { name: "length", value: input?.length, rule: "positive" },
    { name: "area", value: input?.area, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const resistance = (input.resistivity * input.length) / input.area;
  const nf = guardFinite({ resistance });
  if (nf) return nf;
  return ok({ resistance }, ["Uniform conductor: R = ρ·L/A.", "Ignores temperature dependence and contact resistance."]);
}

/* ----------------------- Interconnect resistance ------------------------- */
// R = ρ·L / (W·t);  sheet resistance Rs = ρ/t

export interface InterconnectResistanceInput { resistivity: number; length: number; width: number; thickness: number; }
export interface InterconnectResistanceResult { resistance: number; sheetResistance: number; squares: number; }

export function interconnectResistance(input: InterconnectResistanceInput): CalcResult<InterconnectResistanceResult> {
  const invalid = validate([
    { name: "resistivity", value: input?.resistivity, rule: "positive" },
    { name: "length", value: input?.length, rule: "positive" },
    { name: "width", value: input?.width, rule: "positive" },
    { name: "thickness", value: input?.thickness, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const sheetResistance = input.resistivity / input.thickness;
  const squares = input.length / input.width;
  const resistance = sheetResistance * squares;
  const nf = guardFinite({ resistance, sheetResistance, squares });
  if (nf) return nf;
  return ok({ resistance, sheetResistance, squares }, [
    "Uniform wire: R = ρ·L/(W·t) = Rs·(L/W).",
    "Ignores temperature, barrier/liner layers, and via resistance.",
  ]);
}

/* ------------------------------ RC delay --------------------------------- */
// τ = R·C;  50% delay ≈ 0.69·R·C.

export interface RcDelayInput { resistance: number; capacitance: number; }
export interface RcDelayResult { timeConstant: number; delay50: number; }

export function interconnectRcDelay(input: RcDelayInput): CalcResult<RcDelayResult> {
  const invalid = validate([
    { name: "resistance", value: input?.resistance, rule: "positive" },
    { name: "capacitance", value: input?.capacitance, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const timeConstant = input.resistance * input.capacitance;
  const delay50 = 0.69 * timeConstant;
  const nf = guardFinite({ timeConstant, delay50 });
  if (nf) return nf;
  return ok({ timeConstant, delay50 }, [
    "Lumped RC: τ = R·C; the 50% delay of a single RC stage is ≈ 0.69·R·C.",
    "A distributed wire is more complex (Elmore ~0.38·R·C for a line); this is a first-order estimate.",
  ]);
}

/* ------------------------------ Diode (Shockley) ------------------------- */
// I = Is·(exp(V/(n·Vt)) − 1)

export interface DiodeInput { voltage: number; saturationCurrent: number; idealityFactor: number; temperature: number; }
export interface DiodeResult { current: number; thermalVoltage: number; }

export function diodeCurrent(input: DiodeInput): CalcResult<DiodeResult> {
  const invalid = validate([
    { name: "saturationCurrent", value: input?.saturationCurrent, rule: "positive" },
    { name: "idealityFactor", value: input?.idealityFactor, rule: "positive" },
    { name: "temperature", value: input?.temperature, rule: "positive" },
    { name: "voltage", value: input?.voltage, rule: "finite" },
  ]);
  if (invalid) return invalid;
  const vt = (KB * input.temperature) / Q;
  const current = input.saturationCurrent * (Math.exp(input.voltage / (input.idealityFactor * vt)) - 1);
  const nf = guardFinite({ current, vt });
  if (nf) return err("Current overflowed — reduce the forward voltage for this educational model.", "voltage");
  return ok({ current, thermalVoltage: vt }, [
    "Ideal Shockley diode: I = Is·(exp(V/(n·Vt)) − 1).",
    "No series resistance, high-injection, breakdown, or recombination effects.",
  ]);
}

/* ------------------------------ Varshni bandgap -------------------------- */
// Eg(T) = Eg(0) − α·T² / (T + β)

export interface BandgapInput { eg0: number; alpha: number; beta: number; temperature: number; }
export interface BandgapResult { bandgap: number; } // eV

export function varshniBandgap(input: BandgapInput): CalcResult<BandgapResult> {
  const invalid = validate([
    { name: "eg0", value: input?.eg0, rule: "positive" },
    { name: "alpha", value: input?.alpha, rule: "nonnegative" },
    { name: "beta", value: input?.beta, rule: "positive" },
    { name: "temperature", value: input?.temperature, rule: "nonnegative" },
  ]);
  if (invalid) return invalid;
  const bandgap = input.eg0 - (input.alpha * input.temperature * input.temperature) / (input.temperature + input.beta);
  const nf = guardFinite({ bandgap });
  if (nf) return nf;
  return ok({ bandgap }, [
    "Varshni relation Eg(T) = Eg(0) − α·T²/(T+β) — an empirical fit.",
    "Parameters are material-specific; valid over a limited temperature range.",
  ]);
}

/* --------------------------- Subthreshold swing -------------------------- */
// S = n · (kT/q) · ln(10)

export interface SubthresholdInput { idealityFactor: number; temperature: number; }
export interface SubthresholdResult { swing: number; thermalVoltage: number; } // swing in V/decade

export function subthresholdSwing(input: SubthresholdInput): CalcResult<SubthresholdResult> {
  const invalid = validate([
    { name: "idealityFactor", value: input?.idealityFactor, rule: "positive" },
    { name: "temperature", value: input?.temperature, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const vt = (KB * input.temperature) / Q;
  const swing = input.idealityFactor * vt * Math.LN10;
  const nf = guardFinite({ swing, vt });
  if (nf) return nf;
  return ok({ swing, thermalVoltage: vt }, [
    "Subthreshold swing S = n·(kT/q)·ln(10); the ideal (n=1) limit is ≈ 60 mV/decade at 300 K.",
    "n > 1 from the body/depletion capacitance divider; this is the classic MOSFET limit.",
  ]);
}

/* -------------------- MOSFET threshold (long-channel) -------------------- */
// Cox = εox/tox;  φF = Vt·ln(Na/ni);  Vth = Vfb + 2φF + √(2·εSi·q·Na·2φF)/Cox

export interface MosThresholdInput {
  substrateDoping: number; // Na, m^-3
  oxideThickness: number; // tox, m
  flatbandVoltage: number; // Vfb, V (a parameter)
  temperature: number; // K
  intrinsicConc?: number;
}
export interface MosThresholdResult {
  thresholdVoltage: number; // V
  oxideCapacitance: number; // F/m²
  fermiPotential: number; // φF, V
}

export function mosThresholdVoltage(input: MosThresholdInput): CalcResult<MosThresholdResult> {
  const ni = input?.intrinsicConc ?? NI_SILICON_300K;
  const invalid = validate([
    { name: "substrateDoping", value: input?.substrateDoping, rule: "positive" },
    { name: "oxideThickness", value: input?.oxideThickness, rule: "positive" },
    { name: "flatbandVoltage", value: input?.flatbandVoltage, rule: "finite" },
    { name: "temperature", value: input?.temperature, rule: "positive" },
    { name: "intrinsicConc", value: ni, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const vt = (KB * input.temperature) / Q;
  const phiF = vt * Math.log(input.substrateDoping / ni);
  const cox = EPS_OX / input.oxideThickness;
  const qDep = Math.sqrt(2 * EPS_SI * Q * input.substrateDoping * 2 * phiF);
  const vth = input.flatbandVoltage + 2 * phiF + qDep / cox;
  const nf = guardFinite({ vth, cox, phiF });
  if (nf) return nf;
  return ok({ thresholdVoltage: vth, oxideCapacitance: cox, fermiPotential: phiF }, [
    "Educational long-channel nMOS model: Vth = Vfb + 2φF + √(2·εSi·q·Na·2φF)/Cox.",
    "Flatband voltage Vfb is a user parameter (depends on gate/semiconductor work functions and oxide charge).",
    "Operating region: long-channel, uniform substrate doping, complete ionization.",
    "Ignores short-channel effects, poly depletion, quantum, and interface traps.",
  ]);
}

/* --------------------- MOSFET drain current (long-channel) --------------- */
// Cutoff / triode / saturation (square-law).

export interface MosfetIdInput {
  mobility: number; // μ, m²/(V·s)
  oxideCapacitance: number; // Cox, F/m²
  widthToLength: number; // W/L
  vgs: number; // V
  vth: number; // V
  vds: number; // V
}
export interface MosfetIdResult { current: number; region: "cutoff" | "triode" | "saturation"; }

export function mosfetDrainCurrent(input: MosfetIdInput): CalcResult<MosfetIdResult> {
  const invalid = validate([
    { name: "mobility", value: input?.mobility, rule: "positive" },
    { name: "oxideCapacitance", value: input?.oxideCapacitance, rule: "positive" },
    { name: "widthToLength", value: input?.widthToLength, rule: "positive" },
    { name: "vgs", value: input?.vgs, rule: "finite" },
    { name: "vth", value: input?.vth, rule: "finite" },
    { name: "vds", value: input?.vds, rule: "nonnegative" },
  ]);
  if (invalid) return invalid;
  const k = input.mobility * input.oxideCapacitance * input.widthToLength;
  const vov = input.vgs - input.vth;
  let current: number;
  let region: MosfetIdResult["region"];
  if (vov <= 0) {
    current = 0;
    region = "cutoff";
  } else if (input.vds < vov) {
    current = k * (vov * input.vds - (input.vds * input.vds) / 2);
    region = "triode";
  } else {
    current = 0.5 * k * vov * vov;
    region = "saturation";
  }
  const nf = guardFinite({ current });
  if (nf) return nf;
  return ok({ current, region }, [
    "Educational long-channel square-law model.",
    "Saturation: Id = ½·μ·Cox·(W/L)·(Vgs−Vth)²; triode: Id = μ·Cox·(W/L)·[(Vgs−Vth)Vds − Vds²/2].",
    "Ignores channel-length modulation, velocity saturation, and short-channel effects.",
  ]);
}
