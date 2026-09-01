# Semitree — Architecture

Phase 01 establishes the technical foundation. This document is the map of how
the pieces fit and, importantly, where the boundaries are so future phases stay
clean.

## 1. Guiding principles

1. **Physics is independent of UI.** All calculation and unit logic lives in
   pure TypeScript under `src/lib/**` and must never import React, Next, or the
   DOM. This makes it testable, reusable on a server later, and portable.
2. **Content is data.** Lessons, concepts, tools, resources, and directory
   entries are modelled as typed data (MDX frontmatter or JSON), not hard-coded
   into components.
3. **Learn ↔ Tool wiring is first-class.** The data model carries explicit
   cross-links (`relatedConcepts`, `relatedTools`) so the product's core promise
   is structural, not manual.
4. **Start static, stay cheap.** No backend at first. Everything renders
   statically or client-side. Design leaves room for accounts/persistence later
   without forcing them now.
5. **Additive, phased growth.** No feature in the "Future" list is built now,
   but the schema and folder layout are designed so adding them later does not
   require restructuring.

## 2. Stack

| Layer         | Choice                                              | Notes |
|---------------|-----------------------------------------------------|-------|
| Framework     | **Next.js 15 (App Router)** + **React 19**          | Matches the Plan's Next.js recommendation. |
| Language      | **TypeScript** (strict)                             | Whole codebase. |
| Styling       | **Tailwind CSS 3.4**                                | Utility-first; brand tokens in `tailwind.config.ts`. |
| Content       | **Markdown / MDX**                                  | For lessons, concepts, blog. Loader added when Learn content lands. |
| Calculations  | **Pure TypeScript** (`src/lib/calculations`)        | UI-independent engine + registry. |
| Units         | **Pure TypeScript** (`src/lib/units`)               | SI-based conversion layer. |
| Search        | **Static / client-side** to start                   | Prebuilt index over tools + content. |
| Tests         | **Vitest**                                          | Fast, no browser needed for pure logic. |
| Hosting       | **Vercel** (from **GitHub**)                        | Free tier; see `DEPLOYMENT.md`. |
| Analytics     | Plausible or GA4 (added at launch)                  | Not wired in Phase 01. |

> Tailwind 3.4 (not 4) was chosen for a low-risk, well-documented PostCSS setup.
> This can be revisited later; it does not affect the `src/lib` boundary.

## 3. Directory layout

```text
Semitree/
  docs/                     # this documentation set
  public/                   # static assets
  src/
    app/                    # Next.js App Router
      layout.tsx            # shell: header + footer
      page.tsx              # homepage (pillars + philosophy loop)
      globals.css
      tools/page.tsx        # Pillar 1 — placeholder in Phase 01
      learn/page.tsx        # Pillar 2 — placeholder in Phase 01
      hub/page.tsx          # Pillar 3 — placeholder in Phase 01
    components/             # shared presentational components
      SiteHeader.tsx
      SiteFooter.tsx
    lib/
      units/                # pure unit system (types, registry, convert)
      calculations/         # pure calculation engine (contract + registry)
      data/                 # domain data models (content + future entities)
    content/                # (future) MDX lessons/concepts/blog
  tailwind.config.ts
  next.config.mjs
  postcss.config.mjs
  vitest.config.ts
  tsconfig.json
```

## 4. Frontend

- **App Router** with a single shared layout (`SiteHeader` / `SiteFooter`).
- Three top-level routes map to the three pillars (`/tools`, `/learn`, `/hub`).
  In Phase 01 they are informative placeholders — no calculators or lessons yet.
- Components are presentational; any numeric behaviour they need comes from
  `src/lib`, never inline physics.
- Theming via CSS variables + Tailwind tokens (`background`, `foreground`,
  `brand`). Light/dark handled with `prefers-color-scheme`.

## 5. Content pipeline (MDX)

- Lessons, concepts, and blog posts will be authored as MDX with typed
  frontmatter matching `src/lib/data/types.ts`.
- A thin loader (added when content lands) will read the files, validate
  frontmatter against the types, and expose typed accessors to the App Router.
- Cross-links (`relatedTools`, `relatedConcepts`) are resolved at build time to
  render the learn↔tool wiring.

## 6. Calculation engine

- `src/lib/calculations/types.ts` defines `CalculationDefinition`: a
  fully-declarative description of a tool (inputs, outputs, formula string, and
  a pure `compute` function) with no UI.
- `registry.ts` provides `registerCalculation` / `getAllCalculations` /
  `getCalculation`. Each future calculator lives in its own file and
  self-registers; importing the engine index pulls them in.
- The Tools UI (later phase) renders a form from `inputs`, calls `compute`, and
  formats `outputs` — it contains zero physics.
- See [`CALCULATIONS.md`](./CALCULATIONS.md).

## 7. Units

- `src/lib/units` normalises everything through SI base units per quantity.
- Units are declared once in `registry.ts`; conversion is a pure `convert(value,
  fromId, toId)` (plus affine hooks for temperature).
- Calculators consume SI-normalised inputs and return SI outputs; the UI handles
  display units. This keeps the physics unit-agnostic.

## 8. Search

- Start with a **static, client-side** index built over the tools registry and
  content frontmatter (title, summary, category, concepts).
- No search service in Phase 01. The data model is search-friendly (stable
  slugs, summaries, categories) so a prebuilt JSON index is straightforward when
  needed. Upgrade path (e.g. a hosted index) stays open but is not committed to.

## 9. State & persistence

- **None server-side in Phase 01.** Calculators will be stateless and
  client-only.
- Future accounts / saved calculations / projects / notes are modelled in
  `src/lib/data/types.ts` (the "Future domain models" block) but not wired to
  any store. When added, the natural seam is a data-access layer under `src/lib`
  that the App Router calls — keeping components ignorant of the backend.

## 10. Deployment

GitHub → Vercel, free tier. Details in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## 11. Explicitly out of scope for Phase 01

Calculator implementations, lesson content, MDX loader, search index, analytics,
newsletter integration, accounts, and every "Future" feature. Phase 01 is
foundation and architecture only.
