/**
 * Physical constants for semiconductor calculations (SI).
 * Values are the standard CODATA / textbook figures.
 */
export const Q = 1.602176634e-19; // elementary charge, C
export const KB = 1.380649e-23; // Boltzmann constant, J/K

/**
 * Intrinsic carrier concentration of silicon at ~300 K, in m^-3
 * (≈ 1.0 × 10^10 cm^-3). This is a commonly used textbook value; sources vary
 * between ~9.65×10^9 and ~1.5×10^10 cm^-3, so treat it as approximate.
 */
export const NI_SILICON_300K = 1.0e16; // m^-3
