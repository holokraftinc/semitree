# Semitree — Quality & Testing

## 1. Quality gates

Every change should keep these green:

```bash
npm run lint        # ESLint (next/core-web-vitals + next/typescript)
npm run typecheck   # tsc --noEmit (strict mode)
npm run build       # next build — must compile & type-check
npm test            # vitest run
```

Phase 01 status: all green (see the Phase 01 report).

## 2. Testing strategy

The physics is the risk surface, and it is pure — so it is tested directly,
without a browser or React.

- **Units layer** — round-trip and cross-unit conversions, affine temperature,
  and error cases (unknown unit, cross-quantity). Implemented:
  `src/lib/units/convert.test.ts`.
- **Calculators (future)** — each `CalculationDefinition` ships a spec that:
  - asserts textbook worked-example values within tolerance,
  - checks dimensionless results are unit-independent,
  - exercises edge cases (zero/near-zero denominators, extreme aspect ratios),
  - verifies SI normalisation of inputs.
- **Data integrity (future)** — a test that every `relatedTools` /
  `relatedConcepts` / `calculationSlug` cross-link resolves to a real entity, so
  the learn↔tool wiring never dangles.
- **Registry (future)** — duplicate-slug protection is already enforced at
  registration; a test will assert the built registry matches the published tool
  catalogue.

## 3. Tolerances

Numeric assertions use `toBeCloseTo` with an explicit precision matched to the
quantity's scale (e.g. flow rates around 1e-9 m³/s need generous decimal
places). Prefer comparing against SI values to avoid unit ambiguity in tests.

## 4. Linting & types

- ESLint config extends `next/core-web-vitals` and `next/typescript`.
- TypeScript runs in `strict` mode; `npm run typecheck` is part of the gate.
- Pure `src/lib/**` code must not import React/Next/DOM — enforced by review now,
  and a lint rule can be added later.

## 5. Accuracy review

Beyond automated tests, calculators and lessons get a correctness pass:
- formula matches a cited standard source,
- assumptions/validity ranges are stated in the UI,
- worked examples are reproduced by the implementation.

## 6. CI (future)

A GitHub Actions workflow will run lint + typecheck + build + test on every PR
before Vercel deploys. Not configured in Phase 01; see `DEPLOYMENT.md`.

## 7. Manual smoke check

```bash
npm run dev
# visit http://localhost:3000  → home, /tools, /learn, /hub render
```
