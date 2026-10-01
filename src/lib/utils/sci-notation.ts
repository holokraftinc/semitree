/**
 * Scientific / engineering / SI-prefix representations of a number.
 *
 * Pure and framework-free. Used by the Scientific notation tool and available
 * anywhere a value needs a compact, dimensionally-neutral representation
 * (semiconductor dimensions and concentrations span many orders of magnitude).
 */

/** SI prefixes keyed by power-of-ten exponent (multiples of 3). */
const SI_PREFIXES: Record<number, string> = {
  [-24]: "y",
  [-21]: "z",
  [-18]: "a",
  [-15]: "f",
  [-12]: "p",
  [-9]: "n",
  [-6]: "µ",
  [-3]: "m",
  [0]: "",
  [3]: "k",
  [6]: "M",
  [9]: "G",
  [12]: "T",
  [15]: "P",
  [18]: "E",
  [21]: "Z",
  [24]: "Y",
};

/** Format a mantissa to `sig` significant figures, trimming trailing zeros. */
function trimMantissa(value: number, sig: number): string {
  if (value === 0) return "0";
  const fixed = value.toPrecision(sig);
  // Strip trailing zeros (and a dangling decimal point) without going to exponent form.
  return fixed.includes(".") ? fixed.replace(/\.?0+$/, "") : fixed;
}

export interface ScientificForms {
  scientific: string; // e.g. "1.5 × 10⁻⁹"
  engineering: string; // e.g. "1.5 × 10⁻⁹"
  siPrefix: string; // e.g. "1.5 n"
}

const SUPERSCRIPT: Record<string, string> = {
  "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};

function superscript(exp: number): string {
  return String(exp)
    .split("")
    .map((c) => SUPERSCRIPT[c] ?? c)
    .join("");
}

/**
 * Compute scientific, engineering, and SI-prefix forms of a finite number.
 * Returns null for non-finite input so callers can show a validation message.
 */
export function scientificForms(n: number, sig = 6): ScientificForms | null {
  if (typeof n !== "number" || !Number.isFinite(n)) return null;

  if (n === 0) {
    return { scientific: "0", engineering: "0", siPrefix: "0" };
  }

  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);

  // Scientific: mantissa in [1, 10).
  let exp = Math.floor(Math.log10(abs));
  let mantissa = abs / 10 ** exp;
  // Guard floating-point edges (e.g. mantissa computed as 9.999… or 10).
  if (mantissa >= 10) {
    mantissa /= 10;
    exp += 1;
  } else if (mantissa < 1) {
    mantissa *= 10;
    exp -= 1;
  }
  const scientific = `${sign}${trimMantissa(mantissa, sig)} × 10${superscript(exp)}`;

  // Engineering: exponent a multiple of 3, mantissa in [1, 1000).
  const engExp = Math.floor(exp / 3) * 3;
  const engMantissa = abs / 10 ** engExp;
  const engineering = `${sign}${trimMantissa(engMantissa, sig)} × 10${superscript(engExp)}`;

  // SI prefix: use the engineering exponent if it maps to a known prefix.
  const prefix = SI_PREFIXES[engExp];
  const siPrefix =
    prefix !== undefined
      ? `${sign}${trimMantissa(engMantissa, sig)}${prefix ? " " + prefix : ""}`
      : engineering; // outside y…Y range — fall back to engineering form

  return { scientific, engineering, siPrefix };
}
