/**
 * PLACEHOLDER content for lessons and resources (design-system previews).
 *
 * The canonical TOOL registry now lives in `./tools.ts`. This file holds only
 * the Learn/Hub sample content used by home sections and placeholder pages until
 * real MDX content is authored.
 */
import type { Lesson, Resource } from "./types";

export const sampleLessons: Lesson[] = [
  {
    slug: "what-is-microfluidics",
    title: "What is microfluidics?",
    level: 0,
    order: 1,
    summary: "Length scales, intuition, and why the microscale is different.",
    estimatedMinutes: 8,
  },
  {
    slug: "laminar-flow",
    title: "Laminar flow & low Reynolds number",
    level: 1,
    order: 1,
    summary: "The laminar world and the number that defines it.",
    relatedTools: ["reynolds-number"],
    estimatedMinutes: 12,
  },
  {
    slug: "flow-pressure-resistance",
    title: "Flow, pressure & resistance",
    level: 1,
    order: 2,
    summary: "The hydraulic–electrical analogy in practice.",
    relatedTools: ["pressure-drop", "flow-resistance"],
    estimatedMinutes: 15,
  },
];

export const sampleResources: Resource[] = [
  {
    slug: "dimensionless-numbers-cheatsheet",
    title: "Dimensionless numbers cheat sheet",
    kind: "cheatsheet",
    author: "Semitree",
    description:
      "Re, Pe, Ca, We, Bo, and the capillary length — formulas, what each ratio means, and the variable legend, on one page.",
    fileUrl: "/files/dimensionless-numbers.pdf",
    fileSize: "44 KB",
    relatedConcepts: [
      "reynolds-number",
      "peclet-number",
      "capillary-number",
      "weber-number",
      "bond-number",
    ],
  },
  {
    slug: "flow-pressure-resistance-cheatsheet",
    title: "Flow, pressure & resistance cheat sheet",
    kind: "cheatsheet",
    author: "Semitree",
    description:
      "The hydraulic–electrical analogy: ΔP = Q·R, circular and rectangular resistance, series/parallel rules, and hydraulic diameter.",
    fileUrl: "/files/flow-pressure-resistance.pdf",
    fileSize: "44 KB",
    relatedConcepts: [
      "pressure-drop",
      "flow-resistance",
      "hydraulic-diameter",
      "hydraulic-electrical-analogy",
    ],
  },
  {
    slug: "diffusion-mixing-cheatsheet",
    title: "Diffusion & mixing cheat sheet",
    kind: "cheatsheet",
    author: "Semitree",
    description:
      "Diffusion time and length, Péclet number, Stokes–Einstein, and mixing length — why microscale mixing is slow.",
    fileUrl: "/files/diffusion-mixing.pdf",
    fileSize: "40 KB",
    relatedConcepts: ["diffusion", "peclet-number", "stokes-einstein"],
  },
  {
    slug: "unit-conversions-cheatsheet",
    title: "Unit conversions cheat sheet",
    kind: "cheatsheet",
    author: "Semitree",
    description:
      "Everyday microfluidics conversions for flow rate, pressure, volume, viscosity, and length.",
    fileUrl: "/files/unit-conversions.pdf",
    fileSize: "40 KB",
  },
];
