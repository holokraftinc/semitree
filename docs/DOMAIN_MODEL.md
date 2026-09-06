# Semitree — Domain Model

Semitree is being repositioned from a single microfluidics site into a
**multi-domain platform**. This document defines the reusable **Domain**
abstraction that makes that possible without rewriting the app.

## 1. What is a Domain?

A **Domain** is a self-contained knowledge / tools / research area with its own
sections (Learn, Tools, Concepts, …). Domains are **data, not code** — defined
in [`src/lib/domains`](../src/lib/domains) and consumed generically by the UI.

Current domains:

| Domain | id | Status | Mounted at |
|--------|----|--------|-----------|
| Microfluidics | `microfluidics` | **live** | site root (`/tools`, `/learn`, …) |
| Semiconductor Industry | `semiconductors` | **planned** | `/semiconductors/…` (not built yet) |

## 2. Types

See [`src/lib/domains/types.ts`](../src/lib/domains/types.ts):

```ts
type DomainStatus = "live" | "planned";
type DomainId = "microfluidics" | "semiconductors";

interface DomainSection {
  key: string;        // "learn", "tools", "manufacturing", …
  label: string;
  status: DomainStatus;
  href?: string;      // current live route (omitted for planned)
  description?: string;
}

interface Domain {
  id: DomainId;
  name: string;
  slug: string;       // base path segment for the domain
  tagline: string;
  status: DomainStatus;
  rootMounted?: boolean; // served at "/" instead of "/{slug}"
  sections: DomainSection[];
}
```

## 3. Registry & resolution

[`src/lib/domains/registry.ts`](../src/lib/domains/registry.ts) holds `DOMAINS`
plus helpers: `getDomain`, `getAllDomains`, `getLiveDomains`, `getRootDomain`,
and `sectionPath(domainId, sectionKey)`.

**`rootMounted` is the backward-compatibility seam.** Microfluidics is currently
`rootMounted: true`, so its live URLs (`/tools`, `/learn`, `/concepts`,
`/resources`) are unchanged. `sectionPath()` returns:

- the section's existing `href` if set, else
- `/{sectionKey}` for the root-mounted domain, else
- `/{slug}/{sectionKey}` for any other domain.

This means a domain can later move off the root (e.g. Microfluidics → `/microfluidics`)
by flipping `rootMounted` and adding a redirect — with **no changes to consumers**.

## 4. Section taxonomy

Sections are per-domain and open-ended (just keys + labels), so each domain
declares only what it needs:

- **Microfluidics:** Learn, Tools, Concepts, Resources.
- **Semiconductors (planned):** Learn, Tools, Concepts, Manufacturing, Design,
  Packaging, Equipment, Materials, Industry.

Platform-level areas (Research, Resources, Companies, Industry, Blog,
Newsletter, Search) sit **above** domains and aggregate across them — they are
not part of any single Domain.

## 5. How content maps to domains

Content entities (`Tool`, `Lesson`, `Concept`, `Resource` in
[`src/lib/data/types.ts`](../src/lib/data/types.ts)) carry an optional
`domainId`. When omitted it defaults to `"microfluidics"`, so all existing data
keeps working. Future domains tag their own content, and platform-level views
filter/aggregate by `domainId`. See [CONTENT_MODEL.md](./CONTENT_MODEL.md).

## 6. Adding a new domain (future)

1. Append a `Domain` to `DOMAINS` (id, name, slug, sections).
2. Author its content with `domainId` set (Tools/Lessons/Concepts/…).
3. Add its routes under `/{slug}/…` (planned pattern), or root-mount it.

No UI rewrite is required — the app reads the registry and content data.

## 6b. Knowledge model (entities & taxonomy)

The per-domain **entity + relationship model** and the **semiconductor taxonomy**
(23 categories + subcategory hierarchy) live in `src/lib/knowledge` and are
documented in [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md). Both
Semiconductors and Microfluidics are registered there as `KnowledgeBase`s keyed
by `domainId`, so the UI stays domain-generic.

## 7. Explicitly out of scope for this phase

Semiconductor content, semiconductor routes, domain-switcher UI, per-domain
theming, and the admin/CMS are **not** built here. This phase introduces the
model and documentation only.
