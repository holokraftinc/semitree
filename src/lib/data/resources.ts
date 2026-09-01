/**
 * Resource categories for the Research Hub.
 *
 * Actual resources live in `sampleResources` (samples.ts). Only genuine,
 * standard texts are listed (the books named in the product spec); every other
 * category is empty until verified content is added — no papers, courses,
 * videos, or reviews are invented.
 */
import type { Resource, ResourceKind } from "./types";
import { sampleResources } from "./samples";

export const RESOURCES: Resource[] = sampleResources;

export const RESOURCE_CATEGORIES: {
  kind: ResourceKind;
  label: string;
  description: string;
}[] = [
  { kind: "paper", label: "Papers", description: "Key papers and reviews." },
  { kind: "book", label: "Books", description: "Standard texts on the field." },
  { kind: "course", label: "Courses", description: "Free and paid courses." },
  { kind: "video", label: "Videos", description: "Talks and walkthroughs." },
  { kind: "software", label: "Software", description: "Design and simulation tools." },
  {
    kind: "cheatsheet",
    label: "Cheat sheets",
    description: "Downloadable quick references.",
  },
];

export function resourcesByKind(kind: ResourceKind): Resource[] {
  return RESOURCES.filter((r) => r.kind === kind);
}
