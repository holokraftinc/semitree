import type { BaseUnits, Quantity, UnitDefinition } from "./types";

/**
 * SI base unit for each quantity. All conversions route through these.
 */
export const BASE_UNITS: BaseUnits = {
  length: "m",
  area: "m2",
  volume: "m3",
  pressure: "Pa",
  flowRate: "m3_per_s",
  velocity: "m_per_s",
  viscosity: "Pa_s",
  density: "kg_per_m3",
  time: "s",
  temperature: "K",
  diffusivity: "m2_per_s",
  voltage: "V",
  current: "A",
  resistance: "ohm",
  capacitance: "F",
  power: "W",
};

/**
 * Seed unit definitions covering the quantities the MVP tools need
 * (see docs/CALCULATIONS.md). This is deliberately a starting set, not the
 * complete list — new units are added here without touching call sites.
 */
export const UNIT_DEFINITIONS: UnitDefinition[] = [
  // length
  { id: "m", label: "m", quantity: "length", toBase: 1 },
  { id: "mm", label: "mm", quantity: "length", toBase: 1e-3 },
  { id: "um", label: "µm", quantity: "length", toBase: 1e-6 },

  // pressure
  { id: "Pa", label: "Pa", quantity: "pressure", toBase: 1 },
  { id: "kPa", label: "kPa", quantity: "pressure", toBase: 1e3 },
  { id: "mbar", label: "mbar", quantity: "pressure", toBase: 100 },
  { id: "bar", label: "bar", quantity: "pressure", toBase: 1e5 },
  { id: "psi", label: "psi", quantity: "pressure", toBase: 6894.757 },

  // volume
  { id: "m3", label: "m³", quantity: "volume", toBase: 1 },
  { id: "mL", label: "mL", quantity: "volume", toBase: 1e-6 },
  { id: "uL", label: "µL", quantity: "volume", toBase: 1e-9 },
  { id: "nL", label: "nL", quantity: "volume", toBase: 1e-12 },

  // flow rate
  { id: "m3_per_s", label: "m³/s", quantity: "flowRate", toBase: 1 },
  { id: "mL_per_h", label: "mL/h", quantity: "flowRate", toBase: 1e-6 / 3600 },
  { id: "uL_per_min", label: "µL/min", quantity: "flowRate", toBase: 1e-9 / 60 },
  { id: "nL_per_s", label: "nL/s", quantity: "flowRate", toBase: 1e-12 },

  // viscosity
  { id: "Pa_s", label: "Pa·s", quantity: "viscosity", toBase: 1 },
  { id: "mPa_s", label: "mPa·s (cP)", quantity: "viscosity", toBase: 1e-3 },

  // velocity
  { id: "m_per_s", label: "m/s", quantity: "velocity", toBase: 1 },
  { id: "mm_per_s", label: "mm/s", quantity: "velocity", toBase: 1e-3 },

  // density
  { id: "kg_per_m3", label: "kg/m³", quantity: "density", toBase: 1 },
  { id: "g_per_mL", label: "g/mL", quantity: "density", toBase: 1000 },

  // time
  { id: "s", label: "s", quantity: "time", toBase: 1 },
  { id: "min", label: "min", quantity: "time", toBase: 60 },
  { id: "h", label: "h", quantity: "time", toBase: 3600 },

  // diffusivity (diffusion coefficient)
  { id: "m2_per_s", label: "m²/s", quantity: "diffusivity", toBase: 1 },
  { id: "cm2_per_s", label: "cm²/s", quantity: "diffusivity", toBase: 1e-4 },
  { id: "um2_per_s", label: "µm²/s", quantity: "diffusivity", toBase: 1e-12 },

  // voltage
  { id: "uV", label: "µV", quantity: "voltage", toBase: 1e-6 },
  { id: "mV", label: "mV", quantity: "voltage", toBase: 1e-3 },
  { id: "V", label: "V", quantity: "voltage", toBase: 1 },
  { id: "kV", label: "kV", quantity: "voltage", toBase: 1e3 },

  // current
  { id: "nA", label: "nA", quantity: "current", toBase: 1e-9 },
  { id: "uA", label: "µA", quantity: "current", toBase: 1e-6 },
  { id: "mA", label: "mA", quantity: "current", toBase: 1e-3 },
  { id: "A", label: "A", quantity: "current", toBase: 1 },
  { id: "kA", label: "kA", quantity: "current", toBase: 1e3 },

  // resistance
  { id: "mohm", label: "mΩ", quantity: "resistance", toBase: 1e-3 },
  { id: "ohm", label: "Ω", quantity: "resistance", toBase: 1 },
  { id: "kohm", label: "kΩ", quantity: "resistance", toBase: 1e3 },
  { id: "Mohm", label: "MΩ", quantity: "resistance", toBase: 1e6 },

  // capacitance
  { id: "pF", label: "pF", quantity: "capacitance", toBase: 1e-12 },
  { id: "nF", label: "nF", quantity: "capacitance", toBase: 1e-9 },
  { id: "uF", label: "µF", quantity: "capacitance", toBase: 1e-6 },
  { id: "mF", label: "mF", quantity: "capacitance", toBase: 1e-3 },
  { id: "F", label: "F", quantity: "capacitance", toBase: 1 },

  // power
  { id: "uW", label: "µW", quantity: "power", toBase: 1e-6 },
  { id: "mW", label: "mW", quantity: "power", toBase: 1e-3 },
  { id: "W", label: "W", quantity: "power", toBase: 1 },
  { id: "kW", label: "kW", quantity: "power", toBase: 1e3 },

  // temperature (affine)
  { id: "K", label: "K", quantity: "temperature", toBase: 1 },
  {
    id: "C",
    label: "°C",
    quantity: "temperature",
    toBase: 1,
    toBaseFn: (c) => c + 273.15,
    fromBaseFn: (k) => k - 273.15,
  },
];

const BY_ID = new Map(UNIT_DEFINITIONS.map((u) => [u.id, u]));

/** Look up a unit definition by id, or undefined if unknown. */
export function getUnit(id: string): UnitDefinition | undefined {
  return BY_ID.get(id);
}

/** All units for a given quantity. */
export function unitsForQuantity(quantity: Quantity): UnitDefinition[] {
  return UNIT_DEFINITIONS.filter((u) => u.quantity === quantity);
}
