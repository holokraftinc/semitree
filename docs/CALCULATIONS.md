# Semitree — Calculation Architecture & Formula Catalogue

Phase 01 established the **engine architecture** and recorded the **formulas**.
Phase 04 **implements** the core calculation modules as pure, UI-independent
TypeScript with full validation and tests — see
[§8 Implemented engine](#8-implemented-engine-phase-04). The calculator *interfaces*
(UI) are still not built.

## 1. Design rules

1. **Pure & UI-independent.** Everything under `src/lib/calculations` and
   `src/lib/units` is plain TypeScript. It must never import React, Next, or
   touch the DOM. It is unit-testable with Vitest and reusable server-side later.
2. **Declarative definitions.** A calculator is a `CalculationDefinition`
   (`src/lib/calculations/types.ts`): metadata + `inputs` + `outputs` + a pure
   `compute` function. The UI renders forms and formats results from this; it
   holds no physics.
3. **SI in the core.** `compute` receives inputs already normalised to SI base
   units and returns SI outputs. Display units are the UI's concern, handled by
   `src/lib/units`.
4. **Registry, not hard-coded lists.** Calculators self-register via
   `registerCalculation`. Tools UI and search enumerate the registry.
5. **Show the work.** Each definition carries a `formula` display string and
   links to related Learn concepts, honouring "the formula shown + Learn link."

## 2. The contract

```ts
interface CalculationDefinition {
  slug: string;              // "reynolds-number"
  name: string;
  summary: string;
  category: CalculationCategory;
  tier: "mvp" | "v1" | "v2";
  formula: string;           // display string (e.g. KaTeX source)
  inputs: InputField[];      // number (with quantity+unit) or select
  outputs: OutputField[];
  compute: (input) => output; // PURE
  relatedConcepts?: string[];
}
```

Number inputs declare a `quantity` (e.g. `pressure`) and a `defaultUnit`, tying
them to the units registry so the UI can offer the correct unit dropdown and the
engine can normalise.

## 3. Units layer

- `src/lib/units/registry.ts` — one SI base unit per quantity + declared units.
- `src/lib/units/convert.ts` — `convert(value, fromId, toId)` and `toSI`, with
  affine hooks for temperature.
- Quantities seeded: length, area, volume, pressure, flow rate, velocity,
  viscosity, density, time, temperature. Units are added here without touching
  call sites.

## 4. Formula catalogue

All standard, published equations (from the Plan). Symbols: ρ density, v mean
velocity, Dₕ hydraulic diameter, μ dynamic viscosity, Q volumetric flow rate, L
length, w width, h height, γ surface tension, D diffusion coefficient, k_B
Boltzmann constant, T temperature, r particle radius, Δρ density difference, g
gravity.

### 4A. Fluid mechanics fundamentals

| Tool | Formula | Tier |
|---|---|---|
| Reynolds number | Re = ρ·v·Dₕ / μ | MVP |
| Hydraulic diameter (rectangular) | Dₕ = 2wh / (w + h) | MVP |
| Pressure drop (Hagen–Poiseuille) | ΔP = 128μLQ / (πD⁴) (circular); rectangular via series form | MVP |
| Flow resistance | R = ΔP / Q; rectangular R ≈ 12μL / (wh³(1 − 0.63 h/w)) | MVP |
| Flow ↔ velocity | v = Q / A | MVP |
| Shear stress / wall shear rate | τ = μ·γ̇; γ̇ = 6Q / (wh²) (rect.) | v1 |
| Péclet number | Pe = v·L / D | v1 |
| Capillary number | Ca = μ·v / γ | v1 |
| Weber / Bond / capillary length | We; Bo; ℓ_c = √(γ / (Δρ·g)) | v2 |

### 4B. Resistance-network designer (flagship)

Model channels as resistors and the chip as a circuit using the
hydraulic–electrical analogy: ΔP ↔ V, Q ↔ I, R ↔ R. Users build series/parallel
networks; the tool solves flow distribution (linear system over channel
resistances). **Tier: v1–v2.** Built on the same pure resistance primitives as
4A.

### 4C. Droplet microfluidics

| Tool | Basis | Tier |
|---|---|---|
| Droplet size estimator | Flow-rate-ratio scaling laws (T-junction / flow-focusing) | v1 |
| Generation frequency | f = Q_disperse / V_droplet | v1 |
| Poisson single-cell loading | P(k) = λᵏ·e⁻λ / k! | MVP |
| Regime helper (dripping/jetting) | Ca thresholds | v2 |

### 4D. Diffusion & mixing

| Tool | Formula | Tier |
|---|---|---|
| Diffusion time / length | t ≈ L² / (2D) | MVP |
| Stokes–Einstein D | D = k_BT / (6πμr) | v1 |
| Mixing length | L_mix ≈ Pe·w | v2 |

### 4E. Lab / design utilities

| Tool | What | Tier |
|---|---|---|
| Unit converters | flow rate, pressure, volume, viscosity | MVP |
| Syringe-pump settings | syringe diameter → flow rate mapping | MVP |
| PDMS mixing/curing helper | base:agent ratio, volume, cure time/temp | v1 |
| Dilution / gradient designer | serial dilution & gradient ratios | v1 |
| Reagent/volume consumption | cost & volume per run | v1 |
| Serpentine length in a footprint | fit target length in area | v2 |
| Chip fill-time estimator | time to prime a channel | v2 |

### 4F. Advanced (later)

Electroosmotic flow velocity (Helmholtz–Smoluchowski), Debye length,
electrophoretic mobility, Taylor–Aris dispersion, Knudsen number.

## 5. MVP build order (next phase, not now)

Per the Plan's "build these first": Reynolds, hydraulic diameter, pressure drop,
flow resistance, diffusion time, Poisson single-cell loading, unit converters,
syringe-pump settings (plus flow↔velocity, also MVP-tagged).

## 6. Testing

Each calculator ships with a Vitest spec asserting known values (textbook worked
examples) and edge cases (zero/near-zero denominators, unit round-trips). The
units layer already has a spec (`src/lib/units/convert.test.ts`) demonstrating
the pattern. See [`QA.md`](./QA.md).

## 7. Accuracy discipline

Formulas here are standard and safe to implement, but each will cite its source
and note assumptions (e.g. rectangular-channel approximations valid for given
aspect ratios). Numerical results should never be presented as a substitute for
validation on critical work.

## 8. Implemented engine (Phase 04)

The modules below live in `src/lib/calculations/` as **pure functions** — no
React, no DOM, no I/O. Each:

- accepts a **typed input** object in **SI base units**,
- **validates** every field (finite number + sign constraints),
- returns a discriminated **`CalcResult<T>`** — `{ ok: true, value, assumptions,
  warnings }` on success, or `{ ok: false, error, field? }` on invalid input,
- **never throws** for bad input and **never returns NaN or ±Infinity** (outputs
  are re-checked with `guardFinite`; overflow/underflow → an error result),
- **states its assumptions**, and flags any **approximation** explicitly.

Shared helpers: `result.ts` (`CalcResult`, `ok`, `err`) and `validation.ts`
(`validate`, `guardFinite`, `requireInteger`). Every module has a co-located
`*.test.ts` covering typical / small / large / zero / negative / decimal /
scientific-notation / invalid / empty inputs (58 tests total).

> **Scientific rule:** these are the formulas from the product spec — no silent
> substitutions. Where a formula is an approximation it is labelled as one, both
> in the returned `assumptions`/`approximation` fields and below.

| Module (`src/lib/calculations/…`) | Formula | Status | SI units |
|---|---|---|---|
| `reynolds` | Re = ρ·v·Dₕ / μ | Exact | ρ [kg/m³], v [m/s], Dₕ [m], μ [Pa·s] → Re [–] |
| `hydraulicDiameter` | Dₕ = 2wh / (w+h) | Exact (rectangle) | w,h [m] → Dₕ [m] |
| `pressureDrop` (circular) | ΔP = 128·μ·L·Q / (π·D⁴) | Exact (laminar) | μ [Pa·s], L,D [m], Q [m³/s] → ΔP [Pa] |
| `pressureDrop` (rectangular) | ΔP = R·Q, R ≈ 12μL/(wh³(1−0.63 h/w)) | **Approximation** | as above; w,h [m] |
| `flowResistance` (circular) | R = 128·μ·L / (π·D⁴) | Exact (laminar) | → R [Pa·s/m³] |
| `flowResistance` (rectangular) | R ≈ 12μL/(wh³(1−0.63 h/w)) | **Approximation** | → R [Pa·s/m³] |
| `flowResistance` (from-measurements) | R = ΔP / Q | Definition | ΔP [Pa], Q [m³/s] |
| `diffusionTime` | t ≈ L² / (2D) | **Approximation** (scaling) | L [m], D [m²/s] → t [s] |
| `diffusionLength` | L = √(2·D·t) | **Approximation** (scaling) | D [m²/s], t [s] → L [m] |
| `poissonLoading` | P(k) = λᵏ·e^(−λ) / k! | Exact | λ [–] → p0, p1, p2OrMore |
| `syringePump` | A = π·d²/4, Q = A·v | Exact (geometry) | d [m], v [m/s] → A [m²], Q [m³/s] |
| `unitConversion` | value·factor (or affine) | Exact per registry | any registry unit → target unit |

### Assumptions by module

- **reynolds** — Newtonian, incompressible fluid; Dₕ appropriate for the
  cross-section; regime thresholds are the conventional pipe-flow values
  (laminar < 2000, transitional 2000–4000, turbulent > 4000), which can differ in
  microchannels.
- **hydraulicDiameter** — rectangular cross-section; Dₕ = 2wh/(w+h) = 4·Area/Perimeter (exact).
- **pressureDrop / flowResistance** — fully developed, steady, laminar,
  Newtonian flow. Circular forms are exact; the rectangular form is the
  first-term approximation of the exact Fourier series, most accurate for h ≪ w
  (a warning is emitted for near-square channels). The smaller of width/height is
  taken as the height h.
- **diffusionTime / diffusionLength** — 1-D characteristic scaling
  (order-of-magnitude), not an exact concentration profile; constant D.
- **poissonLoading** — cells independent and randomly distributed; λ is the mean
  cells per droplet; mostly-single occupancy requires low λ. Exact statistics.
  `lambdaFromConcentration` gives λ = concentration × droplet volume.
- **syringePump** — incompressible fluid; no leakage or system compliance; ideal
  plunger geometry.
- **unitConversion** — linear/affine conversions as defined in the units
  registry; unknown units and cross-quantity conversions return errors.
