# Semitree — Knowledge Architecture (multi-domain)

This document describes the **domain-generic knowledge model** introduced in the
repositioning: one set of entity types and relationships serving every domain
(Semiconductors, Microfluidics, …) with **no duplicate UI**. Code:
[`src/lib/knowledge`](../src/lib/knowledge). It complements the platform-level
Domain registry ([DOMAIN_MODEL.md](./DOMAIN_MODEL.md)) and the microfluidics
knowledge graph ([KNOWLEDGE_MODEL.md](./KNOWLEDGE_MODEL.md)).

> **Scope of this phase:** taxonomy + data model only. No articles, no pages, no
> fabricated companies/technologies/research. The semiconductor content arrays
> are intentionally empty.

## 1. Layers

```text
Domain              (src/lib/domains)     — Semiconductors, Microfluidics
  └── Category      (23 for semiconductors)
        └── Subcategory  (e.g. Lithography → EUV, Photoresist, Mask, …)
              └── Content entities (Concept, Topic, Lesson, Tool, Resource,
                    Company, Technology, Process, Equipment, Material,
                    Application, Research)
```

## 2. Entities

All entities extend `EntityBase { slug, domainId, title, summary? }` and are
defined in [`types.ts`](../src/lib/knowledge/types.ts):

| Entity | Purpose | Key relations (by slug) |
|--------|---------|-------------------------|
| **Category** | top-level area | `subcategories[]` |
| **Subcategory** | child of a category | `categorySlug` |
| **Concept** | atomic idea (graph hub) | relatedConcepts / Lessons / Tools / Technologies / Companies / Processes / Resources |
| **Topic** | syllabus grouping | concepts / lessons |
| **Lesson** | teaching module | concepts / tools |
| **Tool** | calculator/utility | concepts, calculationSlug |
| **Resource** | reference/download | concepts |
| **Company** | ecosystem player (`verified` gated) | technologies / processes |
| **Technology** | e.g. EUV, GAA | companies / concepts / processes |
| **Process** | fab/process step | equipment / materials / concepts |
| **Equipment** | tooling | companies / processes |
| **Material** | chemical/material | processes |
| **Application** | end use | technologies / concepts |
| **Research** | paper/review | concepts |

A `KnowledgeBase` bundles all entity arrays for one domain; the registry keys
these by `domainId`.

## 3. Relationships (knowledge graph)

Relationships are **slug references on entities** — a maintainable relational
structure, **not** a graph database. [`graph.ts`](../src/lib/knowledge/graph.ts)
resolves them forward and derives the reverse, so each edge is declared once and
navigable both ways. Named resolvers cover the required edges:

```text
Concept → Lesson       lessonsForConcept()
Concept → Tool         toolsForConcept()
Concept → Company      (Concept.relatedCompanies)
Concept → Technology   (Concept.relatedTechnologies)
Process → Equipment    equipmentForProcess()
Process → Material     materialsForProcess()
Technology → Company   companiesForTechnology()
Company → Technology   technologiesForCompany()
Company → Process      (Company.processes)
Research → Concept      conceptsForResearch()
```

Generic `forward()` / `reverse()` helpers make new edges trivial to add without
new plumbing.

## 4. Semiconductor taxonomy

23 top-level categories (see
[`semiconductors.ts`](../src/lib/knowledge/semiconductors.ts)): Fundamentals,
Materials, Devices, IC Design, EDA, Wafer Manufacturing, Lithography,
Deposition, Etching, Doping, CMP, Metrology & Inspection, Cleanroom, Packaging,
Testing, Equipment, Chemicals & Materials, Supply Chain, Applications,
Companies, Research, Careers, India Semiconductor Ecosystem.

Worked-example subcategory hierarchies:

- **Lithography** → EUV · Photoresist · Mask · Overlay · Metrology
- **Packaging** → Traditional · Flip Chip · 2.5D · 3D · Chiplets · HBM
- **IC Design** → Digital · Analog · Mixed Signal · Verification · Physical Design · Tapeout

Other categories carry a factual one-line summary and can grow subcategories as
content is authored.

## 5. Multi-domain: no duplicate UI

- Both **Semiconductors** and **Microfluidics** are registered `KnowledgeBase`s
  keyed by `domainId`; UI reads the registry generically.
- **Microfluidics is preserved unchanged.** Its live content still comes from the
  existing `src/lib/data` modules and its routes are untouched; in the generic
  model it currently contributes its category taxonomy (see
  [`microfluidics.ts`](../src/lib/knowledge/microfluidics.ts)). A thin adapter
  can later populate its entity arrays from `src/lib/data` — no content
  duplication is introduced now.

## 6. Content & integrity rules

- **No fabrication.** Companies, technologies, processes, and research start
  empty and are added only when verified/sourced. `Company.verified` gates
  display.
- **Taxonomy = facts.** Category/subcategory names are standard industry
  terminology; summaries are high-level and factual.
- **Additive & non-breaking.** This model lives alongside the existing data; no
  current route, component, or microfluidics content changed.

## 7. Out of scope for this phase

Semiconductor pages/routes, content authoring, company data, and any admin/CMS.
Architecture and documentation only — see ROADMAP.md (RP-03/04/05).
