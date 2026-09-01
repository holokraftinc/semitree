# Semitree — Roadmap

Maps the Plan's build roadmap onto Semitree's execution phases. Tiers
(`mvp/v1/v2`) come from [`PRODUCT.md`](./PRODUCT.md) and
[`CALCULATIONS.md`](./CALCULATIONS.md).

## Phase 01 — Foundation & Architecture ← THIS PHASE

**Goal:** technical + product foundation. No user-facing calculators or lessons.

Delivered:
- Next.js 15 + React 19 + TypeScript + Tailwind 3.4 project scaffolded in the
  existing working directory.
- App shell (header/footer, homepage expressing the Learn → Calculate →
  Understand → Apply loop) and placeholder routes for the three pillars.
- Pure, UI-independent **units** layer (`src/lib/units`) with SI conversion + a
  Vitest spec.
- Pure **calculation-engine** contract + registry (`src/lib/calculations`) —
  architecture only, **zero calculators implemented**.
- **Data models** for Tool, Lesson, Concept, Resource, DirectoryEntry, Category,
  and future User/Workspace/Project/Calculation/Note/SavedResource
  (`src/lib/data`).
- Documentation set in `docs/`.
- `npm install` / `npm run build` / `npm run lint` / `npm test` green.

Explicitly deferred: building calculators, writing lessons, MDX loader, search
index, analytics, newsletter, accounts, any "Future" feature.

## Phase 0 (Plan) — Launchable skeleton  → Semitree next phases

- 6–8 **MVP calculators** live (Reynolds, hydraulic diameter, pressure drop,
  flow resistance, diffusion time, Poisson loading, unit converters,
  syringe-pump; + flow↔velocity).
- 2 cornerstone Learn articles (Level 0 intro + one Level 1 physics topic).
- Newsletter signup + analytics installed.
- MDX content pipeline + client-side search over tools/content.
- Deploy to Vercel; share where the audience already is.

## Phase 1 (Plan) — Depth

- Full **v1** calculator suite + the **resistance-network designer** (flagship).
- Learn Levels 0–2 complete.
- Directory v1 (foundries + suppliers).
- Weekly blog + newsletter cadence.

## Phase 2 (Plan) — Complete product + monetization on

- **v2** tools; Learn Levels 3–5; cheat sheets + glossary.
- Premium/team features on the heaviest-used tools (needs accounts — see the
  future data models).
- Sponsorships + job board live; community launched.

## Phase 3 (Plan) — Bridge to a bigger business

- Lead-gen / referral: route "I need a chip designed/made" visitors to foundries
  & freelancers for a fee — on-ramp to a fabless-services / marketplace business.

## Sequencing notes

- Accounts, saved calculations, projects, and notes are **modelled now, built
  when premium/team features arrive** (Phase 2 territory). The `src/lib/data`
  future models and the `src/lib/**` server-safe boundary make this additive.
- The resistance-network designer reuses the pure resistance primitives from the
  MVP fluid-mechanics tools, so those come first.
