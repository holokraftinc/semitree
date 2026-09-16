# Semiconductor Equipment & Materials — Learning Architecture

Architecture only. This document defines the long-term structure for two
**educational** sections — **Equipment** and **Materials** — not a content
library and not an implementation. No pages are built in this phase.

## Guiding idea

The **Manufacturing** section already teaches the *processes* (lithography,
etching, deposition, CMP, …). Equipment and Materials are the other two legs of
the same stool:

- **Equipment** = the *tools* that perform each process.
- **Materials** = the *inputs and consumables* each process uses.

So both sections are organised to **parallel the manufacturing flow** and reuse
it via cross-links, rather than becoming standalone directories. The chain to
make explicit everywhere:

`Equipment → Manufacturing Process → Material → Process Parameter → Result → Metrology → Yield (→ Cost)`

## Core learning model (per topic, eventually)

Every equipment/material topic should follow the same layered arc:

WHAT IS IT? → WHY IS IT NEEDED? → WHERE IS IT USED? → HOW DOES IT WORK? →
WHAT PARAMETERS MATTER? → WHAT CAN GO WRONG? → HOW DOES IT AFFECT MANUFACTURING? →
HOW DOES IT AFFECT YIELD? → HOW DOES IT AFFECT COST? → WHAT COMES NEXT?

This maps onto the existing `SemiLesson` template (whatYoullLearn / whyItMatters
/ explanation / terminology / example / commonMistakes / realWorld / related),
extended in prose to cover parameters, yield and cost.

---

## Deliverables 1–5: current state (reuse first)

### 1. Existing Equipment routes
**None.** `equipment` is a `planned` section in `src/lib/domains/registry.ts`
with no route.

### 2. Existing Materials routes
**None.** `materials` is a `planned` section in the registry with no route.

### 3. Existing Manufacturing routes (the processes to reuse)
- `/manufacturing` — the process explorer hub.
- `/manufacturing/<slug>` — `raw-material`, `silicon`, `ingot`, `wafer`,
  `oxidation`, `deposition`, `photoresist`, `lithography`, `etching`, `doping`,
  `metallization`, `cmp`, `metrology`, `wafer-test`, `dicing`, `packaging`,
  `final-test`, `interconnect`, `advanced-packaging`, `flip-chip`.
- `/supply-chain` and `/supply-chain/<slug>` — value-chain view.
- Process **lessons** at `/semiconductors/learn/<slug>` (fundamentals +
  manufacturing + packaging paths).

### 4. Existing components / patterns to reuse
- **Hub pattern:** the Concepts / Design / Packaging landings (guided maps that
  reuse lessons) — `SemiConcept`-style pages driven by a data module.
- **Lessons:** `SemiLesson` type + `SemiLessonView` + `LEARNING_PATHS`
  (`semi-lessons.ts`), `getSemiLesson`, `lessonNeighbors`.
- **Diagrams:** `LessonDiagram` (add equipment/material keys as needed).
- **Taxonomy:** `semiconductors.ts` already defines `equipment` (order 16) and
  `chemicals-materials` (order 17) categories, plus process categories
  (`lithography`, `deposition`, `etching`, `doping`, `cmp`,
  `metrology-inspection`, `wafer-manufacturing`, `cleanroom`) with subcategories
  — reuse these as the cluster skeleton.
- **Registry:** flip `equipment` / `materials` `planned → live` when hubs ship
  (auto-links on Explore), exactly as Design/Packaging did.
- **Cross-links:** `/manufacturing`, `/supply-chain`, `/industry`
  (companies filterable by `equipment`, `materials`, `chemicals` type), design/
  concepts/packaging landings, and the `graph.ts` pattern.

### 5. Existing relevant content
Process lessons already teach the *process* behind most equipment/material
categories: `lithography`, `photoresist`, `deposition`, `etching`,
`ion-implantation`, `oxidation`, `cmp`, `metallization`, `metrology`, `dicing`,
`packaging`, `wafer-test`, `final-test`, `silicon`, `wafer`, `substrate`,
`electrical-connections`, plus advanced packaging (`2-5d`, `3d-ic`, `chiplets`,
`advanced-packaging`). These are the anchor points to cross-link from.

---

## 6. Proposed Equipment hierarchy

Clusters follow the manufacturing flow. Tag: **[process live]** = the *process*
lesson exists to cross-link (the equipment *page* itself is a gap unless noted).

**Front-end (wafer → patterned device)**
1. **Wafer Manufacturing Equipment** — crystal growth, slicing, polishing `[process live: ingot, wafer]`
2. **Cleaning Equipment** — wet benches, single-wafer cleaners `[gap]`
3. **Lithography Equipment** — optical/DUV/EUV scanners, coater/developer tracks `[process live: lithography, photoresist]`
4. **Deposition Equipment** — PVD, CVD, ALD, epitaxy tools `[process live: deposition]`
5. **Etching Equipment** — wet etch, dry/plasma, RIE `[process live: etching]`
6. **Ion Implantation / Doping Equipment** — implanters, diffusion `[process live: ion-implantation, doping]`
7. **Thermal Processing Equipment** — furnaces, RTP, anneal `[process live: oxidation]`
8. **CMP Equipment** — polishers, slurry delivery, endpoint control `[process live: cmp]`

**Measurement & control**
9. **Metrology Equipment** — CD, overlay, film thickness `[process live: metrology]`
10. **Inspection Equipment** — defect/particle inspection, review `[partial: within metrology]`
11. **Wafer Handling Equipment** — FOUPs, robots, sorters `[gap]`
12. **Process Control Equipment** — SPC/APC, fault detection `[gap]`

**Back-end (assembly, packaging, test)**
13. **Packaging Equipment** — overview `[process live: packaging]`
14. **Assembly Equipment** — die attach, pick-and-place `[gap]`
15. **Bonding Equipment** — wire bonders, flip-chip bonders, hybrid bonding `[process live: wire-bonding, flip-chip]`
16. **Singulation Equipment** — dicing saws, laser dicing `[process live: dicing]`
17. **Testing Equipment** — wafer probers, ATE, package test `[process live: wafer-test, final-test]`
18. **Advanced Packaging Equipment** — interposer/2.5D/3D, WLP tools `[process live: 2-5d, 3d-ic, chiplets, advanced-packaging]`

**Facility & frontier**
19. **Cleanroom / Facility Infrastructure** — contamination control, gas/water/power `[gap; taxonomy: cleanroom]`
20. **Emerging / Advanced Manufacturing Equipment** — high-NA EUV, new architectures `[gap]`

*Subtopics* (litho: optical/DUV/EUV/track; deposition: PVD/CVD/ALD/epitaxy;
etch: wet/dry/RIE; doping: implant/diffusion/activation; thermal: furnace/RTP/
anneal; CMP: polish/slurry/endpoint; metrology: CD/overlay/thickness/defect;
packaging: die-attach/wire-bond/flip-chip/mold/WLP; test: probe/ATE) are
authored **only as demand warrants** — not all at once.

## 7. Proposed Materials hierarchy

Grouped by role in the flow, mirroring the equipment clusters.

- **A. Semiconductor Materials** — silicon `[live]`; compound/III-V/wide-bandgap/emerging `[gap]`
- **B. Wafers & Substrates** — silicon wafer `[live]`; SOI, compound substrates, glass `[gap]`
- **C. Photoresists & Lithography Materials** — photoresist `[live]`; positive/negative, underlayers, developers `[gap]`
- **D. Deposition Materials** — CVD/ALD precursors, PVD targets, dielectric sources `[gap]` (process: deposition)
- **E. Conductive Materials** — copper, aluminum, tungsten, barrier metals `[gap]` (process: metallization)
- **F. Dielectrics** — SiO₂ `[partial: oxidation]`; silicon nitride, low-k, high-k `[gap]`
- **G. Dopant Materials** — boron, phosphorus, arsenic `[gap]` (process: doping/ion-implantation)
- **H. CMP Materials** — slurries, pads, post-CMP cleans `[gap]` (process: cmp)
- **I. Etching Materials** — process gases, wet etchants, plasma chemistry `[gap]` (process: etching)
- **J. Packaging Materials** — substrates `[live]`; underfill, molding compound, solder, bonding materials, thermal interface materials `[gap; some defined on the packaging landing jargon]`
- **K. Cleanroom / Process Materials** — ultrapure water, bulk & specialty gases, specialty chemicals, filtration `[gap]`
- **L. Advanced / Emerging Materials** — advanced dielectrics, 2D materials, advanced substrates, advanced-packaging materials `[gap]`

## Material vs process-chemistry — terminology (must be explicit)

Do not lump everything under "materials." Tag each entry by its **role**:

| Role | Meaning | Examples |
|---|---|---|
| **Substrate** | the base the device is built on | silicon wafer, SOI, interposer |
| **Structural material** | stays in the finished device | copper, tungsten, SiO₂, high-k |
| **Precursor / source** | consumed to *grow/deposit* a film | CVD/ALD precursors, PVD target |
| **Process gas** | gas-phase reagent in a process | etch gases, CVD carrier/reactant |
| **Chemical reagent** | liquid used in a reaction step | wet etchants, developers, cleans |
| **Consumable** | worn/used up, not in the device | CMP slurry & pad, filters |
| **Process material** | applied then removed | photoresist, sacrificial layers |
| **Packaging material** | used in assembly/packaging | underfill, molding compound, solder, TIM |

Each material page states its role, the process(es) that use it, and what it
leaves behind (if anything).

---

## 8. Learning dependencies

- **Prerequisite spine:** Concepts (what a device is) → Manufacturing (the
  process) → then Equipment (the tool that does it) **and** Materials (what it
  consumes), in parallel → Metrology → Yield → Cost.
- A learner should understand a *process* before its *equipment* and *materials*;
  equipment and materials pages therefore link back to the process lesson as a
  prerequisite.
- Advanced topics (EUV, high-k/low-k, hybrid bonding) depend on their base
  category first.

## 9. Cross-links with Manufacturing (the anchor)

Each manufacturing process links to its equipment and materials, forming the
chain. Examples:

- **Lithography** → lithography equipment (scanner, track) → photoresist +
  developer → exposure → development → pattern → metrology (CD/overlay).
- **Etching** → etch equipment → process gases / plasma chemistry → feature
  formation → inspection.
- **CMP** → CMP equipment → slurry + pad → polishing → surface planarity →
  metrology.
- **Deposition** → PVD/CVD/ALD tools → precursors/targets → film → thickness
  metrology.

## 10. Cross-links with Concepts

- **FinFET** → advanced lithography + deposition + selective etching + metrology.
- **GAA / nanosheets** → advanced (ALD) deposition + highly selective etching +
  process control.
- **Scaling / Moore's Law** → EUV lithography + new materials (high-k/low-k).

## 11. Cross-links with Packaging

- **Chiplets / 2.5D / 3D** → advanced-packaging equipment (bonders, interposer
  tools, WLP) + packaging materials (substrate, underfill, solder, TIM) +
  testing equipment (known-good-die).
- Reuse the packaging fundamentals (`substrate`, `electrical-connections`,
  `wafer-level-packaging`) as the materials/equipment bridge.

## 12. Cross-links with Supply Chain & Industry

- Equipment categories map to `/supply-chain` (equipment stage) and `/industry`
  companies filtered by the `equipment` type; materials map to the materials /
  chemicals / silicon-wafers company types. Describe **roles**, never promote a
  vendor.

---

## 13. Topics that already exist (reuse, don't recreate)
Process lessons: `lithography`, `photoresist`, `deposition`, `etching`,
`ion-implantation`, `doping` (concept), `oxidation`, `cmp`, `metallization`,
`metrology`, `dicing`, `packaging`, `wafer-test`, `final-test`, `silicon`,
`wafer`, `substrate`, `electrical-connections`, `wire-bonding`, `flip-chip`,
`2-5d`, `3d-ic`, `chiplets`, `advanced-packaging`. Plus the `/manufacturing`
explorer and taxonomy `equipment` / `chemicals-materials` categories.

## 14. Topics that need to be created
- **Equipment hub** (`/semiconductors/equipment`) and **Materials hub**
  (`/semiconductors/materials`) landings (guided maps, reuse pattern).
- **Equipment lessons** (highest value first): lithography equipment (+ EUV/DUV),
  deposition tools (PVD/CVD/ALD/epitaxy), etch tools (wet/dry/RIE), implanter,
  thermal (furnace/RTP), CMP tool, metrology & inspection, test (probe/ATE),
  bonders, cleaning, wafer handling, process control, cleanroom, emerging.
- **Materials lessons** (highest value first): photoresist materials detail,
  dielectrics (nitride/low-k/high-k), conductive metals (Cu/Al/W + barriers),
  dopant materials, deposition precursors/targets, CMP slurry & pad, etch gases,
  packaging materials (underfill/mold/solder/TIM), ultrapure water & process
  gases, compound/III-V/wide-bandgap, 2D & emerging.

## 15. Recommended implementation order
1. **Equipment hub** landing — organise the 20 categories along the process flow,
   each cross-linking its existing manufacturing process lesson; mark real gaps
   "Coming soon". Flip registry `equipment → live`; add to sitemap. *(Mostly
   reuse — ships fast, immediate value.)*
2. **Materials hub** landing — same, for the A–L groups, with the role
   terminology front-and-centre. Flip `materials → live`.
3. **Flagship equipment lessons** — lithography/EUV, deposition (PVD/CVD/ALD),
   etch, CMP, metrology, test — authored into a new `equipment` learn path.
4. **Flagship materials lessons** — photoresist, dielectrics, conductive metals,
   dopants, CMP consumables, etch gases, packaging materials — into a new
   `materials` learn path.
5. **Wire the full chain** — process ↔ equipment ↔ material cross-links, and
   Concepts/Packaging/Supply-chain/Industry links.
6. **Advanced & emerging** — high-NA EUV, hybrid bonding, 2D materials, advanced
   dielectrics.

Each step is a small, independently shippable phase. No content is authored here.
