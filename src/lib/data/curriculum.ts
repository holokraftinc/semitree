/**
 * The Learn curriculum outline, taken directly from the product spec
 * (`Microfluidics_Tools_and_Learning_Site_Plan.md`, §3). This is the STRUCTURE
 * only — module bodies (MDX lessons) are authored in a later phase. Modules
 * marked with a related tool will link to it once that calculator ships.
 */

export type CurriculumModule = {
  title: string;
  /** Slug of a tool this module maps to (for the learn↔tool wiring, later). */
  relatedTool?: string;
  /** Slug of a written lesson (see lessons.ts); linked when content exists. */
  lessonSlug?: string;
};

export type CurriculumLevel = {
  level: number;
  title: string;
  summary: string;
  modules: CurriculumModule[];
};

export const CURRICULUM: CurriculumLevel[] = [
  {
    level: 0,
    title: "Orientation",
    summary: "What microfluidics is, and why the microscale behaves differently.",
    modules: [
      {
        title: "What is microfluidics? Length scales & intuition",
        lessonSlug: "what-is-microfluidics",
      },
      {
        title: "Why the microscale behaves differently (the laminar world)",
        lessonSlug: "why-microscale-is-different",
      },
      {
        title:
          "The big applications: lab-on-chip, diagnostics, single-cell, organ-on-chip, chip cooling",
        lessonSlug: "major-applications",
      },
      { title: "Glossary + how to use this site" },
    ],
  },
  {
    level: 1,
    title: "Physics Foundations",
    summary: "The calculator-linked core: the physics that runs the field.",
    modules: [
      {
        title: "Laminar flow",
        relatedTool: "reynolds-number",
        lessonSlug: "laminar-flow",
      },
      {
        title: "Reynolds number",
        relatedTool: "reynolds-number",
        lessonSlug: "reynolds-number",
      },
      {
        title: "Flow, pressure & resistance; the hydraulic–electrical analogy",
        relatedTool: "flow-resistance",
        lessonSlug: "flow-pressure-resistance",
      },
      { title: "Surface tension, wetting & capillarity" },
      {
        title: "Diffusion & why mixing is hard at the microscale",
        relatedTool: "diffusion-time",
        lessonSlug: "diffusion",
      },
      { title: "The dimensionless numbers that run the field (Re, Pe, Ca, We, Bo)" },
    ],
  },
  {
    level: 2,
    title: "Materials & Fabrication",
    summary: "How chips are made — the semiconductor bridge.",
    modules: [
      { title: "PDMS & soft lithography (the workhorse)" },
      { title: "Glass & silicon; photolithography & etching basics" },
      { title: "Thermoplastics: injection molding, hot embossing" },
      { title: "Bonding techniques; 3D-printed & paper microfluidics" },
      { title: "The “fabless” reality: using foundries & shared cleanrooms" },
    ],
  },
  {
    level: 3,
    title: "Components & Unit Operations",
    summary: "The building blocks of a device.",
    modules: [
      { title: "Channels & geometry design rules" },
      { title: "Valves (incl. Quake/membrane valves) & pumps" },
      { title: "Passive vs active mixers" },
      { title: "Droplet generators: T-junction & flow-focusing" },
      { title: "Gradient generators, filters, traps, sorters" },
    ],
  },
  {
    level: 4,
    title: "Applications",
    summary: "Where microfluidics is actually used.",
    modules: [
      {
        title: "Droplet microfluidics & single-cell (scRNA-seq)",
        relatedTool: "poisson-loading",
      },
      { title: "PCR / digital PCR" },
      { title: "Point-of-care diagnostics & lateral-flow" },
      { title: "Organ-on-chip & cell culture" },
      { title: "Microfluidic cooling for electronics/AI chips" },
      { title: "Chemical synthesis & flow chemistry" },
    ],
  },
  {
    level: 5,
    title: "Do It Yourself",
    summary: "From design to a working chip.",
    modules: [
      { title: "Designing your first chip (step-by-step)" },
      { title: "CAD & layout tools; simulation/CFD basics" },
      { title: "Working with a foundry: files, tolerances, cost" },
      { title: "World-to-chip interfacing (the classic pain point)" },
      { title: "Troubleshooting common failures (leaks, bubbles, clogging)" },
    ],
  },
];
