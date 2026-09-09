# Learning Module Structure

A reusable structure for **detailed microfluidics learning modules** on Semitree.
It standardizes how a lesson is organized without introducing any new UI, page,
or content system. Every module renders through the existing lesson pipeline:

- **Data:** `src/lib/data/lessons.ts` — one `LessonContent` object per lesson.
- **Template:** `src/components/learn/LessonView.tsx` — the single renderer.

The structure is defined by **optional fields** on the existing `LessonContent`
type. A section renders **only when its field is present**, so:

- No section is ever forced — author only the parts a topic needs.
- Every existing lesson is byte-for-byte unchanged (it sets none of the new
  fields), so there is zero regression to the Learn section or existing lessons.

> This document describes the structure only. It does **not** add new topics, and
> it does not remove any "Coming Soon" state — those are separate content tasks.

---

## The eleven sections

Authored fields map to sections in this render order (present sections only):

| # | Section | Field | Shape | Notes |
|---|---------|-------|-------|-------|
| 1 | Quick start | `quickStart` | `string[]` | "If you only remember three things…" — 3–5 takeaways. |
| — | What you'll learn | `whatYoullLearn` | `string[]` | *(base field, required)* |
| 2 | Intuition | `intuition` | `string[]` | Analogies / everyday framing before the technical definition. |
| 3 | Core concept | `concept` | `string[]` | *(base field, required)* |
| — | Why it matters | `whyItMatters` | `string[]` | *(base field, required)* |
| 4 | How it works | `howItWorks` | `string[]` | The mechanism, step by step (rendered as a numbered list). |
| 5 | Equation | `equation`, `variables` | see below | *(base fields)* Plus `equationAssumptions` and `dimensionless`. |
| 6 | Microfluidic example | `microfluidicExample` | `string[]` | The theory in a real microfluidic situation. |
| 7 | Practical design implications | `designImplications` | `string[]` | What changes when you actually design a device. |
| 8 | Common mistakes | `commonMistakes` | `string[]` | *(base field)* |
| 9 | Researcher notes | `researcherNotes` | `string[]` | Advanced context — rendered **collapsed** (`<details>`). |
| 10 | Related concepts | `relatedConceptSlugs`, `relatedToolSlugs` | `string[]` | *(base fields)* Only real, resolvable links. |
| 11 | References | `furtherReading` | `FurtherReadingItem[]` | *(base field)* Verified sources only — see below. |

The canonical ordered list is also exported for tooling/tests:

```ts
import { LESSON_SECTIONS, type LessonSectionKey } from "@/lib/data/lessons";
```

### Equation detail (section 5)

The equation block is enriched by two optional fields:

```ts
equation?: { expression: string; caption?: string };
variables?: { symbol: string; name: string; unit?: string }[]; // include SI units
equationAssumptions?: string[];   // conditions under which the equation holds
// For a dimensionless number: what a high vs low value means, and which effect wins.
dimensionless?: { high: string; low: string; competing?: string };
```

- List every variable with its **SI unit** in `variables`.
- Use `equationAssumptions` to state when the equation is valid (e.g. Newtonian,
  incompressible, fully developed flow).
- For a dimensionless number, `dimensionless` renders a "Reading the number"
  block: `high` / `low` describe the two regimes and `competing` names the two
  effects whose ratio the number expresses.

### References detail (section 11)

```ts
interface FurtherReadingItem {
  title: string;                 // real title, or a clearly-marked placeholder
  author?: string;
  note?: string;
  year?: number;
  publisher?: string;
  url?: string;                  // a real, verified link only — never guessed
  doi?: string;                  // a real DOI only — never invented
  kind?: "review" | "paper" | "textbook" | "resource";
}
```

When `url` is present the title renders as an external link; when `doi` is present
a `https://doi.org/…` link is appended. Items with only `title`/`author`/`note`
render exactly as before.

---

## Content rules (non-negotiable)

- **No fabrication.** Never invent a DOI, citation, URL, or experimental value.
  Leave a field empty rather than guessing; name a textbook by title + author
  with no link if a verified URL isn't available.
- **Explain every equation.** No unexplained symbols; always give SI units,
  assumptions, and a dimensional interpretation.
- **No marketing or filler.** Scientifically accurate, evidence-based prose.
- **Sections are optional.** Only author what the topic genuinely needs.

---

## Authoring a module

1. Add (or extend) a `LessonContent` object in `src/lib/data/lessons.ts`.
2. Fill the base required fields (`slug`, `title`, `level`, `order`, `summary`,
   `whatYoullLearn`, `concept`, `whyItMatters`).
3. Add any of the optional sections above that the topic warrants.
4. Keep the lesson's "Coming Soon" state until the content is complete **and**
   verified — do not remove it early.
5. Verify: `npx tsc --noEmit`, `npx vitest run`, `npx next lint`, `npm run build`.

No template changes are needed — `LessonView` already renders every section from
the data.

---

## Why this design

Extending the existing lesson pipeline additively (optional fields + gated
rendering) — rather than building a parallel module system — reuses the existing
Semitree learning UI unchanged, guarantees the existing lessons stay identical,
and standardizes the structure of future detailed modules in one place.
