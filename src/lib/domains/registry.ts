/**
 * Domain registry — the single source of truth for Semitree's domains.
 *
 * Adding a future domain = append a `Domain` object here. No UI rewrite needed.
 * NOTE: Semiconductors is declared as `planned` (architecture only) — its
 * content and routes are intentionally NOT built in this phase.
 */
import type { Domain, DomainId } from "./types";

export const DOMAINS: Domain[] = [
  {
    id: "microfluidics",
    name: "Microfluidics",
    slug: "microfluidics",
    tagline:
      "Learn microfluidics and design your chip in the same place — free.",
    status: "live",
    // Served at the site root today; existing routes are unchanged.
    rootMounted: true,
    sections: [
      { key: "learn", label: "Learn", status: "live", href: "/learn/microfluidics", description: "Zero-to-competent curriculum." },
      { key: "tools", label: "Tools", status: "live", href: "/tools", description: "Calculators & design utilities." },
      { key: "concepts", label: "Concepts", status: "live", href: "/concepts", description: "Searchable glossary." },
      { key: "resources", label: "Resources", status: "live", href: "/resources", description: "Curated references & downloads." },
    ],
  },
  {
    id: "semiconductors",
    name: "Semiconductor Industry",
    slug: "semiconductors",
    tagline:
      "Knowledge, tools, and industry intelligence for the semiconductor industry.",
    status: "planned",
    // No content or routes yet — architectural placeholder for later phases.
    sections: [
      { key: "learn", label: "Learn", status: "live", href: "/semiconductors/learn", description: "Structured learning paths." },
      { key: "tools", label: "Tools", status: "live", href: "/semiconductors/tools", description: "Engineering calculators." },
      { key: "concepts", label: "Concepts", status: "planned" },
      { key: "manufacturing", label: "Manufacturing", status: "live", href: "/manufacturing", description: "Interactive process explorer." },
      { key: "supply-chain", label: "Supply chain", status: "live", href: "/supply-chain", description: "End-to-end supply chain explorer." },
      { key: "design", label: "Design", status: "planned" },
      { key: "packaging", label: "Packaging", status: "planned" },
      { key: "equipment", label: "Equipment", status: "planned" },
      { key: "materials", label: "Materials", status: "planned" },
      { key: "industry", label: "Industry", status: "live", href: "/industry", description: "Company directory & maps." },
    ],
  },
];

const BY_ID = new Map(DOMAINS.map((d) => [d.id, d]));

export function getDomain(id: DomainId): Domain | undefined {
  return BY_ID.get(id);
}

export function getAllDomains(): Domain[] {
  return DOMAINS;
}

export function getLiveDomains(): Domain[] {
  return DOMAINS.filter((d) => d.status === "live");
}

/** The domain currently mounted at the site root (Microfluidics, for now). */
export function getRootDomain(): Domain | undefined {
  return DOMAINS.find((d) => d.rootMounted);
}

/**
 * Resolve a section's path. Root-mounted domains keep their existing routes
 * (`/tools`); non-root domains resolve under their slug (`/{slug}/tools`).
 * This is the seam that lets a domain move off the root later with no consumer
 * changes.
 */
export function sectionPath(domainId: DomainId, sectionKey: string): string | undefined {
  const domain = BY_ID.get(domainId);
  const section = domain?.sections.find((s) => s.key === sectionKey);
  if (!domain || !section) return undefined;
  if (section.href) return section.href;
  return domain.rootMounted ? `/${sectionKey}` : `/${domain.slug}/${sectionKey}`;
}
