/**
 * Directory registry.
 *
 * IMPORTANT: no companies, services, or listings are invented. Until entries are
 * gathered and verified, `DIRECTORY_ENTRIES` is intentionally EMPTY and the UI
 * shows empty states. The structure is designed for future search, filtering,
 * verification, featured/paid placement, and lead generation.
 */
import type { DirectoryEntry, DirectoryEntryType } from "./types";

export const DIRECTORY_CATEGORIES: {
  type: DirectoryEntryType;
  label: string;
  description: string;
}[] = [
  { type: "foundry", label: "Foundries", description: "Shops that fabricate chips." },
  {
    type: "fabrication-service",
    label: "Fabrication services",
    description: "Prototyping and manufacturing services.",
  },
  { type: "supplier", label: "Suppliers", description: "Materials and consumables." },
  { type: "equipment", label: "Equipment", description: "Pumps, microscopes, instruments." },
  { type: "software", label: "Software", description: "CAD, simulation, and design tools." },
  { type: "designer", label: "Designers", description: "Freelance chip designers." },
  { type: "course", label: "Courses", description: "Training and short courses." },
  { type: "journal", label: "Journals", description: "Where the field publishes." },
  { type: "conference", label: "Conferences", description: "Where the field meets." },
];

/** No verified listings yet — deliberately empty (do not fabricate entries). */
export const DIRECTORY_ENTRIES: DirectoryEntry[] = [];

export function directoryLabel(type: DirectoryEntryType): string {
  return DIRECTORY_CATEGORIES.find((c) => c.type === type)?.label ?? type;
}

export function entriesByType(type: DirectoryEntryType): DirectoryEntry[] {
  return DIRECTORY_ENTRIES.filter((e) => e.type === type);
}
