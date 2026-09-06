# Semitree — Content Model

How content is structured across domains. The guiding rule: **content is
structured data**, never hardcoded into UI components, so the same components
render any domain.

## 1. Layers

```text
Domain            (src/lib/domains)        — Microfluidics, Semiconductors, …
  └── Section      (Learn / Tools / …)      — declared per domain, as data
        └── Content entities (src/lib/data) — Tool, Lesson, Concept, Resource
```

## 2. Content entities

Defined in [`src/lib/data/types.ts`](../src/lib/data/types.ts). Each now carries
an optional `domainId` (defaults to `"microfluidics"`):

| Entity | Key fields | Domain field |
|--------|-----------|--------------|
| `Tool` | slug, name, summary, category, tier, calculationSlug, relatedTools, relatedConcepts | `domainId?` |
| `Lesson` | slug, title, level, order, summary, concepts, relatedTools | `domainId?` |
| `Concept` | slug, title, summary, relatedTools, relatedConcepts | `domainId?` |
| `Resource` | slug, title, kind, url/fileUrl, relatedConcepts | `domainId?` |
| `DirectoryEntry` | id, name, type, verified, … | (platform-level) |

The calculation engine (`src/lib/calculations`) stays domain-agnostic — it is
pure math consumed by any domain's tools.

## 3. Cross-links (the knowledge graph)

Relationships are declared once and traversed both ways (see
[KNOWLEDGE_MODEL.md](./KNOWLEDGE_MODEL.md)): lessons/tools/resources reference
concept slugs; `src/lib/data/graph.ts` derives the reverse links. This graph is
**per-domain** — links resolve within a domain's content; platform views can
still aggregate across domains via `domainId`.

## 4. Where content lives today

- Tools: `src/lib/data/tools.ts`
- Lessons: `src/lib/data/lessons.ts` + curriculum in `curriculum.ts`
- Concepts/glossary: `src/lib/data/glossary.ts`
- Resources: `src/lib/data/resources.ts` + `samples.ts`
- Directory: `src/lib/data/directory.ts`

All are typed TS modules — serialisable and ready to move behind a CMS/DB later
(see [ADMIN_CMS.md](./ADMIN_CMS.md)) without changing the component layer.

## 5. Authoring a new domain's content (future)

1. Add entries to the relevant data modules (or new per-domain modules) with
   `domainId` set to the new domain.
2. Wire them into that domain's section pages under `/{slug}/…`.
3. Keep formulas/definitions **factual and sourced**; never reproduce
   copyrighted text or host unlicensed files (see PRODUCT.md accuracy rules).

## 6. Migration note

No existing content changed in this phase. `domainId` is optional and defaults
to microfluidics, so every current Tool/Lesson/Concept/Resource is implicitly
`microfluidics` and continues to render exactly as before.
