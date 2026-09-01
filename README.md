# Semitree

A practical microfluidics platform for students, researchers, and engineers.
**Learn → Calculate → Understand → Apply.**

Three pillars:

1. **Tools** — microfluidics calculators & design utilities
2. **Learn** — a zero-to-competent curriculum, wired to the tools
3. **Hub** — directory, blog, newsletter, community

> Phase 01 (foundation & architecture) is complete: the app shell, the pure
> calculation/units engine architecture, the data models, and the docs are in
> place. **Calculators and lessons are built in later phases.**

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Quality gates:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

## Layout

- `src/app` — Next.js App Router (home + `/tools`, `/learn`, `/hub`)
- `src/lib/units` — pure SI unit-conversion layer
- `src/lib/calculations` — pure calculation-engine contract + registry
- `src/lib/data` — domain data models
- `docs/` — product & technical documentation (start here):
  - [PRODUCT.md](docs/PRODUCT.md), [ARCHITECTURE.md](docs/ARCHITECTURE.md),
    [DATA_MODEL.md](docs/DATA_MODEL.md), [CALCULATIONS.md](docs/CALCULATIONS.md),
    [ROADMAP.md](docs/ROADMAP.md), [QA.md](docs/QA.md),
    [DEPLOYMENT.md](docs/DEPLOYMENT.md)

Product source of truth: `Microfluidics_Tools_and_Learning_Site_Plan.md`.
