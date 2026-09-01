# Semitree — Product Specification

> Source of truth: `Microfluidics_Tools_and_Learning_Site_Plan.md` (the "Plan").
> This document distills the Plan into the product decisions that drive the
> build. Where this doc and the Plan disagree, the Plan wins.

## 1. What Semitree is

A free web app of microfluidics **calculators & design tools**, wrapped in a
**content site** and a structured **learn-from-zero curriculum**.

**One-line pitch:** _"Learn microfluidics and design your chip in the same
place — free."_

**The unique move:** wire the learning to the tools. Every Learn concept links
to the calculator that applies it; every calculator links back to the lesson
that explains it. This learn↔do integration is the moat, not the equations
(the physics is commodity, standard, published).

## 2. Core philosophy

**Learn → Calculate → Understand → Apply.**

The product is organised so a visitor can move along that loop without leaving
the site: read the concept, run the numbers, see why the result is what it is,
and take it into a real design decision.

## 3. Three pillars

1. **Tools** — calculators & design utilities. The traffic magnet (SEO + daily
   utility).
2. **Learn** — a zero-to-competent curriculum. The retention & credibility
   engine.
3. **Hub** — directory, blog, newsletter, community. The monetizable audience.

## 4. Release tiers

The Plan tags each tool as MVP / v1 / v2. Semitree inherits those tiers.

### MVP (build first — ~6–8 calculators + one intro Learn page)

- Reynolds number
- Hydraulic diameter
- Pressure drop (Hagen–Poiseuille)
- Flow resistance
- Flow ↔ velocity converter
- Diffusion time / length
- Poisson single-cell loading
- Unit converters (flow rate, pressure, volume, viscosity)
- Syringe-pump settings
- Learn: Level 0 intro + one Level 1 physics topic
- Newsletter signup + analytics

> Note: the Plan's "MVP calculator set" line lists eight; the Reynolds/
> hydraulic-diameter/pressure-drop/resistance/diffusion/Poisson/unit-converter/
> syringe-pump group. Flow↔velocity is also tagged MVP in the tool table and is
> included above.

### v1

- Shear stress / wall shear rate, Péclet number, Capillary number
- **Resistance-network designer** (flagship — hydraulic↔electrical analogy)
- Droplet size estimator, generation frequency
- Stokes–Einstein diffusion coefficient
- PDMS mixing/curing helper, dilution/gradient designer, reagent/volume
  consumption
- Learn Levels 0–2 complete; Directory v1 (foundries + suppliers)

### v2

- Weber / Bond / capillary length, droplet regime helper (dripping/jetting)
- Mixing length, serpentine-length-in-footprint, chip fill-time estimator
- Learn Levels 3–5, cheat sheets, glossary
- Premium/team features, sponsorships, job board, community

### Future (designed for, not built now)

Electroosmotic flow, Debye length, electrophoretic mobility, Taylor–Aris
dispersion, Knudsen number; user accounts, saved calculations, projects,
research notes, chip-design tools, marketplace, lead-gen/referral.

## 5. Tools catalogue

Grouped as in the Plan. Full formulas and tiers live in
[`CALCULATIONS.md`](./CALCULATIONS.md).

- **2A Fluid mechanics fundamentals** — Reynolds, hydraulic diameter, pressure
  drop, flow resistance, flow↔velocity, shear stress, Péclet, capillary,
  Weber/Bond/capillary length.
- **2B Resistance-network designer** — the "semiconductor" showpiece; channels
  as resistors, chip as a circuit.
- **2C Droplet microfluidics** — droplet size, generation frequency, Poisson
  loading, regime helper.
- **2D Diffusion & mixing** — diffusion time/length, Stokes–Einstein D, mixing
  length.
- **2E Lab / design utilities** — unit converters, syringe-pump settings, PDMS
  helper, dilution/gradient, reagent consumption, serpentine length, fill-time.
- **2F Advanced (later)** — EOF, Debye length, mobility, Taylor–Aris, Knudsen.

Every tool follows the same UX: clean input → instant result → the formula
shown → a "Learn the concept" link → optional worked example.

## 6. Learn curriculum

Structured as levels of short modules. Each module = plain-English explainer +
key equation + direct link to the matching calculator + worked example +
further reading.

- **Level 0 — Orientation:** what/why microfluidics, length scales, the laminar
  world, big applications, glossary, how to use the site.
- **Level 1 — Physics foundations (calculator-linked core):** laminar flow &
  low Re; flow/pressure/resistance & the hydraulic–electrical analogy; surface
  tension & capillarity; diffusion & mixing; the dimensionless numbers.
- **Level 2 — Materials & fabrication:** PDMS & soft lithography; glass/silicon,
  photolithography & etching; thermoplastics; bonding, 3D-printed & paper
  microfluidics; fabless reality.
- **Level 3 — Components & unit operations:** channels & geometry; valves &
  pumps; mixers; droplet generators; gradient generators, filters, traps,
  sorters.
- **Level 4 — Applications deep-dives:** droplet & single-cell (scRNA-seq);
  PCR/dPCR; point-of-care & lateral-flow; organ-on-chip; microfluidic cooling;
  flow chemistry.
- **Level 5 — Do it yourself:** designing your first chip; CAD & CFD basics;
  working with a foundry; world-to-chip interfacing; troubleshooting.
- **Extras:** downloadable cheat sheets, SEO glossary (one page per term),
  reading list (Bruus; Tabeling; Nguyen & Wereley; Berthier — verify editions),
  curated free courses/videos.

## 7. Hub

- **Blog / tutorials** — SEO engine on a steady cadence.
- **Directory** — foundries, suppliers, software, freelancers, courses,
  journals, conferences (evergreen traffic + monetization).
- **Newsletter** — weekly roundup; the single most important owned asset.
- **Community (later)** — forum or Discord/Slack.

## 8. Monetization (order it will likely arrive)

1. Newsletter & site sponsorships
2. Directory listings (featured/paid)
3. Job board
4. Premium tool features (saved projects, teams, export)
5. Affiliate (books, equipment, courses)
6. Lead-gen / referral fees — highest value; bridge to services/marketplace

## 9. Success metrics

- Traffic + top-performing tools/pages
- Tool usage / repeat usage
- Newsletter subscribers + open rate
- Time on site & return-visitor rate
- Inbound "can you help me design/make a chip?" messages (demand signal)

## 10. Reality check

Niche audience; commodity physics. The moat is UX, breadth, the learn-do
integration, and the audience/brand. The long-term value is the network,
credibility, and demand signal that could make a fabless-services / marketplace
business viable later.

## 11. Accuracy discipline

All formulas are standard published equations and safe to implement. Book,
course, and link recommendations must have **editions and URLs verified** before
publishing. "Who competes / what ranks on Google" must be checked with live
research, not assumed.
