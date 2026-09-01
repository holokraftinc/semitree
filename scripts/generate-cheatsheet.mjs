/**
 * Generates the Semitree "Dimensionless Numbers" cheat sheet PDF.
 *
 * Original Semitree content (the equations themselves are standard, published
 * physics). Run: `npm run cheatsheet`. Output: public/files/dimensionless-numbers.pdf
 *
 * Uses a system Unicode font (Arial) so Greek/math glyphs render; pdfkit subsets
 * only the glyphs used into the PDF, so no font file is committed.
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

const OUT = path.join("public", "files", "dimensionless-numbers.pdf");
fs.mkdirSync(path.dirname(OUT), { recursive: true });

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: 0, left: 54, right: 54, bottom: 54 },
  info: {
    Title: "Microfluidics Dimensionless Numbers — Semitree Cheat Sheet",
    Author: "Semitree (Holokraft)",
    Subject: "The dimensionless numbers that govern microfluidic flow",
  },
});
doc.registerFont("reg", REG);
doc.registerFont("bold", BOLD);
doc.pipe(fs.createWriteStream(OUT));

const pageW = doc.page.width; // 612
const L = 54;
const R = pageW - 54;
const W = R - L;

// ---- Header band ----
doc.rect(0, 0, pageW, 92).fill(BRAND);
doc.fill("#ffffff").font("bold").fontSize(22).text("Dimensionless Numbers", L, 26);
doc
  .font("reg")
  .fontSize(11)
  .fill("#d1fae5")
  .text("The ratios that govern microfluidic flow — a Semitree cheat sheet", L, 56);

let y = 118;

doc
  .font("reg")
  .fontSize(10.5)
  .fill(MUTED)
  .text(
    "At the microscale, a handful of dimensionless numbers tell you which forces win and how a device behaves. Each is a ratio of two competing effects.",
    L,
    y,
    { width: W, lineGap: 2 },
  );
y = doc.y + 16;

// ---- Number cards ----
const numbers = [
  {
    name: "Reynolds number",
    sym: "Re",
    formula: "Re = ρ · v · Dh / μ",
    ratio: "inertial vs. viscous forces",
    note: "Laminar when Re ≲ 2000; microchannels sit far below this.",
  },
  {
    name: "Péclet number",
    sym: "Pe",
    formula: "Pe = v · L / D",
    ratio: "advection vs. diffusion",
    note: "High Pe: flow carries species faster than diffusion can mix them.",
  },
  {
    name: "Capillary number",
    sym: "Ca",
    formula: "Ca = μ · v / γ",
    ratio: "viscous vs. interfacial forces",
    note: "Sets the droplet-formation regime in two-phase flow.",
  },
  {
    name: "Weber number",
    sym: "We",
    formula: "We = ρ · v² · L / γ",
    ratio: "inertial vs. interfacial forces",
    note: "Predicts droplet breakup and jetting.",
  },
  {
    name: "Bond number",
    sym: "Bo",
    formula: "Bo = Δρ · g · L² / γ",
    ratio: "gravity vs. interfacial forces",
    note: "Tiny at the microscale — surface tension dominates gravity.",
  },
  {
    name: "Capillary length",
    sym: "Lc",
    formula: "Lc = √( γ / (Δρ · g) )",
    ratio: "where gravity ≈ surface tension",
    note: "Below this length scale, capillarity rules (~2.7 mm for water/air).",
  },
];

const rowH = 62;
for (const n of numbers) {
  doc.roundedRect(L, y, W, rowH, 8).fill(SOFT);
  // name + symbol
  doc.fill(INK).font("bold").fontSize(12.5).text(n.name, L + 14, y + 11);
  doc
    .fill(BRAND)
    .font("bold")
    .fontSize(12.5)
    .text(n.sym, L + 14, y + 11, { width: W - 28, align: "right" });
  // formula
  doc.fill(INK).font("reg").fontSize(12).text(n.formula, L + 14, y + 30);
  // ratio + note
  doc
    .fill(MUTED)
    .font("reg")
    .fontSize(9.5)
    .text(`${n.ratio} — ${n.note}`, L + 14, y + 46, { width: W - 28 });
  y += rowH + 10;
}

// ---- Variable legend ----
y += 4;
doc.fill(INK).font("bold").fontSize(12).text("Variables", L, y);
y = doc.y + 6;

const vars = [
  ["ρ", "density (kg/m³)"],
  ["v", "mean velocity (m/s)"],
  ["Dh", "hydraulic diameter (m)"],
  ["μ", "dynamic viscosity (Pa·s)"],
  ["L", "characteristic length (m)"],
  ["D", "diffusion coefficient (m²/s)"],
  ["γ", "surface tension (N/m)"],
  ["Δρ", "density difference (kg/m³)"],
  ["g", "gravity (9.81 m/s²)"],
];
const colW = W / 3;
vars.forEach(([sym, desc], i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const cx = L + col * colW;
  const cy = y + row * 20;
  doc.fill(BRAND).font("bold").fontSize(10).text(sym, cx, cy, { continued: true });
  doc.fill(MUTED).font("reg").fontSize(10).text(`  ${desc}`);
});
y = y + Math.ceil(vars.length / 3) * 20 + 16;

// ---- Footer ----
doc
  .moveTo(L, y)
  .lineTo(R, y)
  .lineWidth(1)
  .strokeColor(LINE)
  .stroke();
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
process.stdout.write(`Wrote ${OUT}\n`);
