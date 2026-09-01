# Semitree — Data Model

Defines the reusable data structures behind the three pillars. The
authoritative source is [`src/lib/data/types.ts`](../src/lib/data/types.ts);
this document explains intent and relationships.

All models are plain, serialisable TypeScript interfaces so they can back MDX
frontmatter, static JSON, or a database later without change. Entities are keyed
by a stable, URL-safe `slug` (content) or `id` (future user data).

## 1. Content & catalogue models (Phase 01)

### Category
Shared taxonomy across tools, lessons, and resources.
`{ slug, name, description? }`

### Tool
The **content wrapper** around a calculator — the catalogue entry shown in
listings/search. Links to the engine by `calculationSlug`.
`{ slug, name, summary, category, tier, calculationSlug, relatedConcepts? }`

> A `Tool` (catalogue/content) is distinct from a `CalculationDefinition`
> (runtime engine contract, in `src/lib/calculations`). The Tool references the
> definition by slug. This separation lets content and physics evolve
> independently.

### Concept
An atomic idea in the curriculum (e.g. "Reynolds number"). Carries the
learn→tool link via `relatedTools`.
`{ slug, title, summary, relatedTools?, relatedConcepts? }`

### Lesson
A module within a learning level; body authored as MDX.
`{ slug, title, level, order, summary, concepts?, relatedTools?, estimatedMinutes? }`

### Resource
An external or downloadable reference (book, course, video, paper, article,
cheatsheet).
`{ slug, title, kind, url?, author?, description?, relatedConcepts? }`

### DirectoryEntry
A Hub directory listing. `type` is one of: foundry, fabrication-service,
supplier, equipment, software, designer, course, journal, conference.
`verified` / `lastVerified` back a verification workflow; `featured` is reserved
for future featured / paid placement (monetization not implemented). Listings
appear only once verified — none are fabricated.
`{ id, name, type, description?, website?, location?, services?, categories?, verified, lastVerified?, featured? }`

### Resource
A Learn/Hub reference. `kind` is one of: paper, book, course, video, software,
cheatsheet, article.
`{ slug, title, kind, url?, author?, description?, relatedConcepts? }`

## 2. The learn ↔ tool wiring

The product's core promise is structural, expressed through explicit
cross-links rather than manual curation:

```text
Concept.relatedTools     ─▶ Tool.slug
Tool.relatedConcepts     ─▶ Concept.slug
Lesson.concepts          ─▶ Concept.slug
Lesson.relatedTools      ─▶ Tool.slug
Tool.calculationSlug     ─▶ CalculationDefinition.slug   (engine)
```

Resolving these at build time renders "Learn the concept" links on tools and
"Calculate this" links on lessons.

## 3. Relationships (overview)

```text
Category 1───* Tool
Category 1───* Lesson
Tool     *───* Concept        (via relatedConcepts / relatedTools)
Lesson   1───* Concept        (via concepts[])
Lesson   *───* Tool           (via relatedTools)
Resource *───* Concept        (via relatedConcepts)
Tool     1───1 CalculationDefinition  (via calculationSlug)
```

## 4. Future domain models (designed for, NOT built in Phase 01)

These support accounts, saved work, and projects. They exist in the types file
so the schema is coherent from day one, but nothing in the app depends on them
and no store is wired.

### User
`{ id, email, displayName?, createdAt }`

### Workspace
A team/tenant boundary. `{ id, ownerId, name, memberIds?, createdAt }`

### Project
A unit of saved work within a workspace.
`{ id, workspaceId, name, description?, createdAt, updatedAt }`

### Calculation (saved run)
A persisted calculator run: inputs + a snapshot of results, optionally attached
to a project.
`{ id, projectId?, calculationSlug, inputs, results, createdAt }`

### Note
A research note. `{ id, projectId?, authorId, body, createdAt, updatedAt }`

### SavedResource
A user's bookmark of a `Resource`. `{ id, userId, resourceSlug, savedAt }`

### Future relationships

```text
User      1───* Workspace         (owner)
Workspace *───* User              (members)
Workspace 1───* Project
Project   1───* Calculation
Project   1───* Note
User      1───* SavedResource ───* Resource
```

## 5. Conventions

- **Slugs** are lowercase, hyphenated, stable once published (they are URLs and
  cross-link keys).
- **Timestamps** are ISO-8601 strings for JSON-friendliness.
- **Tiers** (`mvp | v1 | v2`) drive what appears when; see `ROADMAP.md`.
- Adding a field is additive; **renaming/removing a slug is a breaking change**
  and requires redirects.
