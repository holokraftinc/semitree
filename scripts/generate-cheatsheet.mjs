/**
 * Generates Semitree cheat-sheet PDFs (original Semitree content — the equations
 * and SI conversion factors themselves are standard, public physics facts, not
 * taken from any copyrighted book).
 *
 * Run: `npm run cheatsheet`. Output: public/files/*.pdf
 *
 * Uses a system Unicode font (Arial) so Greek/math glyphs render; pdfkit subsets
 * only the used glyphs into each PDF, so no font file is committed.
 */
import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";

const REG = "/System/Library/Fonts/Supplemental/Arial.ttf";
const BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf";

const BRAND = "#0f766e";
const INK = "#0f172a";
const MUTED = "#64748b";
const LINE = "#e2e8f0";
const SOFT = "#f1f5f9";

const OUT_DIR = path.join("public", "files");
fs.mkdirSync(OUT_DIR, { recursive: true });

/** @typedef {{name:string, sym?:string, formula:string, note?:string}} Row */

/** Render one cheat sheet to its own PDF file. */
function makeSheet({ file, title, subtitle, intro, rows, vars }) {
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: 0, left: 54, right: 54, bottom: 54 },
    info: {
      Title: `${title} — Semitree Cheat Sheet`,
      Author: "Semitree (Holokraft)",
      Subject: subtitle,
    },
  });
  doc.registerFont("reg", REG);
  doc.registerFont("bold", BOLD);
  const outPath = path.join(OUT_DIR, file);
  doc.pipe(fs.createWriteStream(outPath));

  const pageW = doc.page.width;
  const L = 54;
  const R = pageW - 54;
  const W = R - L;

  // Header band
  doc.rect(0, 0, pageW, 92).fill(BRAND);
  doc.fill("#ffffff").font("bold").fontSize(22).text(title, L, 26, { width: W });
  doc.font("reg").fontSize(11).fill("#d1fae5").text(subtitle, L, 58, { width: W });

  let y = 116;
  doc
    .font("reg")
    .fontSize(10.5)
    .fill(MUTED)
    .text(intro, L, y, { width: W, lineGap: 2 });
  y = doc.y + 14;

  // Rows — size to fit one page.
  const rowH = rows.length > 5 ? 54 : 62;
  const gap = rows.length > 5 ? 8 : 10;
  for (const r of rows) {
    doc.roundedRect(L, y, W, rowH, 8).fill(SOFT);
    doc.fill(INK).font("bold").fontSize(12).text(r.name, L + 14, y + 9, { width: W - 90 });
    if (r.sym) {
      doc
        .fill(BRAND)
        .font("bold")
        .fontSize(12)
        .text(r.sym, L + 14, y + 9, { width: W - 28, align: "right" });
    }
    doc.fill(INK).font("reg").fontSize(11.5).text(r.formula, L + 14, y + (rowH > 55 ? 29 : 26));
    if (r.note) {
      doc
        .fill(MUTED)
        .font("reg")
        .fontSize(9)
        .text(r.note, L + 14, y + (rowH > 55 ? 45 : 40), { width: W - 28, height: 12, ellipsis: true });
    }
    y += rowH + gap;
  }

  // Variable legend
  if (vars && vars.length) {
    y += 2;
    doc.fill(INK).font("bold").fontSize(12).text("Variables", L, y);
    y = doc.y + 6;
    const colW = W / 3;
    vars.forEach(([sym, desc], i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const cx = L + col * colW;
      const cy = y + row * 19;
      doc.fill(BRAND).font("bold").fontSize(9.5).text(sym, cx, cy, { continued: true });
      doc.fill(MUTED).font("reg").fontSize(9.5).text(`  ${desc}`);
    });
    y = y + Math.ceil(vars.length / 3) * 19 + 14;
  }

  // Footer
  doc.moveTo(L, y).lineTo(R, y).lineWidth(1).strokeColor(LINE).stroke();
  y += 10;
  doc
    .fill(INK)
    .font("bold")
    .fontSize(10)
    .text("Semitree", L, y, { continued: true })
    .fill(MUTED)
    .font("reg")
    .text("  ·  A Holokraft Apps  ·  semitree.in");
  doc
    .fill(MUTED)
    .font("reg")
    .fontSize(8.5)
    .text(
      "Standard, published equations. Always verify against primary sources for critical work.",
      L,
      doc.y + 3,
    );

  doc.end();
  process.stdout.write(`Wrote ${outPath}\n`);
}

const SHEETS = [
  {
    file: "dimensionless-numbers.pdf",
    title: "Dimensionless Numbers",
    subtitle: "The ratios that govern microfluidic flow — a Semitree cheat sheet",
    intro:
      "At the microscale, a handful of dimensionless numbers tell you which forces win and how a device behaves. Each is a ratio of two competing effects.",
    rows: [
      { name: "Reynolds number", sym: "Re", formula: "Re = ρ · v · Dh / μ", note: "inertial vs. viscous — laminar when Re ≲ 2000" },
      { name: "Péclet number", sym: "Pe", formula: "Pe = v · L / D", note: "advection vs. diffusion — high Pe: flow outpaces mixing" },
      { name: "Capillary number", sym: "Ca", formula: "Ca = μ · v / γ", note: "viscous vs. interfacial — sets the droplet regime" },
      { name: "Weber number", sym: "We", formula: "We = ρ · v² · L / γ", note: "inertial vs. interfacial — droplet breakup / jetting" },
      { name: "Bond number", sym: "Bo", formula: "Bo = Δρ · g · L² / γ", note: "gravity vs. interfacial — tiny at the microscale" },
      { name: "Capillary length", sym: "Lc", formula: "Lc = √( γ / (Δρ · g) )", note: "where gravity ≈ surface tension (~2.7 mm for water/air)" },
    ],
    vars: [
      ["ρ", "density (kg/m³)"],
      ["v", "mean velocity (m/s)"],
      ["Dh", "hydraulic diameter (m)"],
      ["μ", "dynamic viscosity (Pa·s)"],
      ["L", "characteristic length (m)"],
      ["D", "diffusion coeff. (m²/s)"],
      ["γ", "surface tension (N/m)"],
      ["Δρ", "density difference (kg/m³)"],
      ["g", "gravity (9.81 m/s²)"],
    ],
  },
  {
    file: "flow-pressure-resistance.pdf",
    title: "Flow, Pressure & Resistance",
    subtitle: "The hydraulic–electrical analogy — a Semitree cheat sheet",
    intro:
      "For laminar flow, a chip behaves like a circuit: pressure drives flow through hydraulic resistance. Pressure ↔ voltage, flow rate ↔ current, resistance ↔ resistance.",
    rows: [
      { name: "Ohm's law for fluids", sym: "ΔP = Q·R", formula: "ΔP = Q · R", note: "the master relation between pressure, flow rate, and resistance" },
      { name: "Resistance (circular)", sym: "R", formula: "R = 128 · μ · L / (π · D⁴)", note: "exact for fully developed laminar flow" },
      { name: "Resistance (rectangular)", sym: "R ≈", formula: "R ≈ 12 · μ · L / ( w · h³ · (1 − 0.63 · h/w) )", note: "APPROXIMATION — most accurate for h ≪ w" },
      { name: "Series channels", sym: "Σ", formula: "R = R₁ + R₂ + …", note: "resistances add end-to-end" },
      { name: "Parallel channels", sym: "∥", formula: "1/R = 1/R₁ + 1/R₂ + …", note: "reciprocals add" },
      { name: "Hydraulic diameter", sym: "Dh", formula: "Dh = 2 · w · h / (w + h)", note: "rectangular cross-section" },
    ],
    vars: [
      ["ΔP", "pressure drop (Pa)"],
      ["Q", "flow rate (m³/s)"],
      ["R", "resistance (Pa·s/m³)"],
      ["μ", "dynamic viscosity (Pa·s)"],
      ["L", "channel length (m)"],
      ["D", "diameter (m)"],
      ["w", "width (m)"],
      ["h", "height (m)"],
    ],
  },
  {
    file: "diffusion-mixing.pdf",
    title: "Diffusion & Mixing",
    subtitle: "Why microscale mixing is slow — a Semitree cheat sheet",
    intro:
      "With no turbulence at low Reynolds number, laminar streams mix only by diffusion. Time scales with the square of distance, so shrinking the mixing distance is what speeds mixing up.",
    rows: [
      { name: "Diffusion time (estimate)", sym: "t", formula: "t ≈ L² / (2 · D)", note: "order-of-magnitude characteristic time, not an exact profile" },
      { name: "Diffusion length", sym: "L", formula: "L ≈ √( 2 · D · t )", note: "how far a species spreads in time t" },
      { name: "Péclet number", sym: "Pe", formula: "Pe = v · L / D", note: "advection vs. diffusion" },
      { name: "Stokes–Einstein", sym: "D", formula: "D = kB · T / (6 · π · μ · r)", note: "estimate D for a spherical particle" },
      { name: "Mixing length", sym: "Lmix", formula: "Lmix ≈ Pe · w", note: "channel length needed to mix across width w (order)" },
    ],
    vars: [
      ["t", "time (s)"],
      ["L", "distance (m)"],
      ["D", "diffusion coeff. (m²/s)"],
      ["v", "mean velocity (m/s)"],
      ["kB", "Boltzmann const. (J/K)"],
      ["T", "temperature (K)"],
      ["μ", "dynamic viscosity (Pa·s)"],
      ["r", "particle radius (m)"],
      ["w", "channel width (m)"],
    ],
  },
  {
    file: "unit-conversions.pdf",
    title: "Unit Conversions",
    subtitle: "Everyday microfluidics units — a Semitree cheat sheet",
    intro:
      "Quick conversions for the quantities you juggle most in the lab. All values follow directly from SI definitions.",
    rows: [
      { name: "Flow rate", formula: "1 µL/min = 16.67 nL/s = 0.06 mL/h", note: "1 mL/h = 16.67 µL/min ;  1 µL/min = 1.667×10⁻¹¹ m³/s" },
      { name: "Pressure", formula: "1 bar = 100 kPa = 1000 mbar = 14.504 psi", note: "1 psi = 6.895 kPa ;  1 mbar = 100 Pa" },
      { name: "Volume", formula: "1 mL = 1000 µL = 10⁶ nL", note: "1 µL = 1000 nL = 10⁻⁹ m³" },
      { name: "Viscosity", formula: "1 mPa·s = 1 cP = 10⁻³ Pa·s", note: "water ≈ 1 mPa·s at 20 °C" },
      { name: "Length", formula: "1 mm = 1000 µm = 10⁶ nm", note: "1 µm = 10⁻⁶ m" },
    ],
    vars: [],
  },
];

for (const sheet of SHEETS) makeSheet(sheet);
