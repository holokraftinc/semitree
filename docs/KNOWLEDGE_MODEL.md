# Semitree — Knowledge Model

Semitree's content is a small **knowledge graph** with four node types and a set
of typed edges. This document describes the model and, crucially, **where each
edge is declared** — because every relationship is declared exactly once and
traversed in both directions, never duplicated across components.

## 1. Nodes

| Node | Route | Source of truth |
|------|-------|-----------------|
| **Concept** | `/concepts/<slug>` | `src/lib/data/glossary.ts` (`GLOSSARY`) |
| **Lesson** | `/learn/<slug>` | `src/lib/data/lessons.ts` (`LESSONS`) |
| **Tool** | `/tools/<slug>` | `src/lib/data/tools.ts` (`TOOLS`) |
| **Resource** | (listed on `/resources`, `/concepts/<slug>`) | `src/lib/data/samples.ts` (`sampleResources`) |

## 2. Edges — declared once

Each edge is stored on **one** side only:

```text
Lesson  ──relatedConceptSlugs──▶  Concept
Lesson  ──relatedToolSlugs / tryItToolSlug──▶  Tool
Tool    ──relatedConcepts──▶  Concept
Tool    ──relatedTools──▶  Tool
Resource──relatedConcepts──▶  Concept
Concept ──relatedConceptSlugs──▶  Concept   (symmetric)
```

There is **no** `Concept.relatedLessons` or `Concept.relatedTools` field — those
directions are *derived*.

## 3. Traversal — both directions

`src/lib/data/graph.ts` is the single place that walks the graph. It turns the
one-directional edges above into bidirectional queries:

| Function | Returns | How |
|----------|---------|-----|
| `lessonsForConcept(slug)` | Lessons about a concept | reverse of `Lesson.relatedConceptSlugs` |
| `toolsForConcept(slug)` | Calculators for a concept | reverse of `Tool.relatedConcepts` |
| `resourcesForConcept(slug)` | References for a concept | reverse of `Resource.relatedConcepts` |
| `conceptsForConcept(slug)` | Neighbouring concepts | `Concept.relatedConceptSlugs`, made symmetric (inbound + outbound) |
| `getRelatedConceptLinks(toolSlug)` | Concept links for a tool page | `Tool.relatedConcepts` → `/concepts/<slug>` |
| `conceptLinksForLesson(slugs)` | Concept links for a lesson page | `Lesson.relatedConceptSlugs` → `/concepts/<slug>` |

Because the reverse direction is computed, adding one edge (e.g. a new lesson
that lists a concept) automatically makes that lesson appear on the concept
page — with no second edit.

## 4. The loop

The graph is fully connected for a topic. For "Reynolds number":

```text
/concepts/reynolds-number
   ├─ Related lessons ─▶ /learn/reynolds-number
   └─ Related tools   ─▶ /tools/reynolds-number

/learn/reynolds-number
   ├─ Related concepts ─▶ /concepts/reynolds-number
   └─ Try it yourself  ─▶ /tools/reynolds-number

/tools/reynolds-number
   └─ Related concepts ─▶ /concepts/reynolds-number
```

So **Concept → Lesson → Tool → Concept** is a closed loop, and every hop is a
real link verified by the Phase 09 tests.

## 5. Core concepts (Phase 09)

Eleven concepts carry a full definition + explanation:
Microfluidics, Lab-on-a-chip, Laminar flow, Reynolds number, Hydraulic diameter,
Pressure drop, Flow resistance, Diffusion, Surface tension, PDMS, and Droplet
microfluidics. The glossary also holds lighter terms (definition only) that get
the same page template and graph links.

## 6. Rules

- **No duplicated links.** Never store the same relationship on both nodes; add
  the edge once and let `graph.ts` derive the reverse.
- **No dead links.** Concept/lesson/tool slugs are validated by
  `dynamicParams = false` on the dynamic routes (unknown slugs → 404) and by the
  link-crawl test.
- **No fabricated references.** Resources name real texts with a "verify
  edition" note and no URLs; unverified further reading uses a clear placeholder.
