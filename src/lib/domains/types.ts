/**
 * Domain model — the core of Semitree's multi-domain architecture.
 *
 * A **Domain** is a self-contained knowledge/tools area (e.g. Microfluidics,
 * Semiconductors). Everything domain-specific is expressed as *data* here, so
 * new domains are added by registering a Domain object — not by rewriting UI.
 *
 * This layer is additive and does not change existing routes. The Microfluidics
 * domain is currently `rootMounted` (served at the site root, e.g. /tools,
 * /learn) for backward compatibility; the model already supports moving a domain
 * under its own base path (`/{slug}/…`) later without code changes to consumers.
 */

export type DomainStatus = "live" | "planned";

export type DomainId = "microfluidics" | "semiconductors";

/** A section within a domain (Learn, Tools, Manufacturing, …). */
export interface DomainSection {
  /** Stable key, e.g. "learn", "tools", "manufacturing". */
  key: string;
  label: string;
  status: DomainStatus;
  /** Current live route, when the section exists. Omitted for planned sections. */
  href?: string;
  description?: string;
}

export interface Domain {
  id: DomainId;
  name: string;
  /** URL-safe base slug for the domain (future base path `/{slug}`). */
  slug: string;
  tagline: string;
  status: DomainStatus;
  /**
   * True when this domain is currently served at the site ROOT (no /{slug}
   * prefix). Preserves today's live Microfluidics URLs. Exactly one domain
   * should be root-mounted at a time.
   */
  rootMounted?: boolean;
  sections: DomainSection[];
}
