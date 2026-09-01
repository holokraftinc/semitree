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
    slug: "bruus-theoretical-microfluidics",
    title: "Theoretical Microfluidics",
    kind: "book",
    author: "Henrik Bruus",
    description: "A standard graduate text on the physics of microflows.",
    relatedConcepts: [
      "reynolds-number",
      "flow-resistance",
      "pressure-drop",
      "diffusion",
      "laminar-flow",
    ],
  },
  {
    slug: "tabeling-introduction",
    title: "Introduction to Microfluidics",
    kind: "book",
    author: "Patrick Tabeling",
    description: "An accessible entry point to the field.",
    relatedConcepts: ["microfluidics", "laminar-flow", "diffusion"],
  },
  {
    slug: "nguyen-wereley-fundamentals",
    title: "Fundamentals and Applications of Microfluidics",
    kind: "book",
    author: "Nguyen & Wereley",
    description: "Broad coverage of devices and applications.",
    relatedConcepts: ["microfluidics", "lab-on-chip", "droplet-microfluidics"],
  },
];
