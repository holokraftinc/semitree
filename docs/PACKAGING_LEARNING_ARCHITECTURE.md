# Semiconductor Packaging — Learning Architecture

Architecture only — this document defines the packaging learning structure. It
does **not** create the full content library. It records the hierarchy, the
learning sequence, routes, topic dependencies, and what can be reused.

## Core idea to teach

**A semiconductor is not finished when the wafer is fabricated.** Packaging
connects the die to the rest of the system and increasingly determines:
performance, power, thermal behaviour, reliability, bandwidth, form factor, and
system integration. As transistor scaling slows, packaging is where much of the
system-level progress now happens.

---

## Current state (what already exists — reuse first)

Prior phases already shipped a working packaging surface. This architecture
builds on it rather than duplicating it.

- **Hub (live):** `/semiconductors/packaging` — a guided landing with a jargon
  strip (die, package, substrate, bump, interposer, TSV, chiplet, fan-out,
  hybrid bonding), the "after fabrication" flow, and a complexity ladder
  (traditional → flip-chip → wafer-level → 2.5D → chiplets → 3D → heterogeneous).
  Source of truth: `src/lib/knowledge/packaging-flow.ts`.
- **Lessons (live)** at `/semiconductors/learn/<slug>`:
  `traditional-packaging`, `wire-bonding`, `flip-chip`, `2-5d`, `3d-ic`,
  `chiplets`, `hbm`, `advanced-packaging`, plus post-fab: `wafer`, `dicing`,
  `packaging`, `wafer-test`, `final-test`.
- **Diagrams (live):** `wire-bonding`, `flip-chip`, `2-5d`, `3d-ic`, `chiplets`,
  `wafer-to-package` (in `LessonDiagram.tsx`).
- **Related surfaces:** `/manufacturing` (process explorer), `/supply-chain`
  (packaging stage), `/industry` (OSAT/ATMP companies), `/semiconductors/design`
  (stage 11 "Package"), thermal/yield tools under `/semiconductors/tools`.
- **Registry:** the `packaging` domain section is `live`.

---

## 1. Information architecture (the 18 topics)

Grouped into clusters. Tags: **[live]** reuse an existing lesson · **[partial]**
covered inside a broader lesson/landing · **[gap]** to author later.

### A. Foundations & vocabulary
1. **Packaging Fundamentals** — why a wafer isn't a finished chip; what packaging does. `[partial → landing intro; gap: standalone "why chips need packaging" lesson]`
2. **Die and Package** — the bare die vs the finished, connectable package. `[partial: defined in the landing jargon strip; gap: standalone]`
3. **Substrate** — the carrier that fans die connections out to the board. `[partial: jargon; gap: standalone]`
4. **Interconnects** — electrical links (wires, bumps, balls, TSVs); the electrical + thermal path. `[gap]` (RC/interconnect physics touched in `metallization`)

### B. First-level packaging methods
5. **Wire Bonding** — `wire-bonding` `[live]` (diagram)
6. **Flip Chip** — `flip-chip` `[live]` (diagram)
7. **Traditional Packages** — leadframe, QFN, QFP, BGA, CSP — `traditional-packaging` `[live]`; per-package detail `[partial]`

### C. Wafer-level & advanced integration
8. **Wafer-Level Packaging (WLP)** — building the package while dies are on the wafer. `[gap]` (ladder rung on landing)
9. **Fan-Out** — spreading connections beyond the die edge without a substrate. `[gap]`
10. **2.5D** — dies side-by-side on a silicon interposer — `2-5d` `[live]` (diagram); `hbm` `[live]`
11. **3D** — vertically stacked dies with TSVs / hybrid bonding — `3d-ic` `[live]` (diagram)
12. **Chiplets** — a system split into smaller dies — `chiplets` `[live]` (diagram)
13. **Heterogeneous Integration** — combining different dies/nodes/functions — `advanced-packaging` `[partial]`; standalone named page `[gap]`

### D. Cross-cutting engineering concerns
14. **Thermal Management** — heat generation, thermal resistance, spreading, TIMs, package-level limits. `[gap]` (tools: `junction-temperature`, `power-density`, `power-dissipation`)
15. **Reliability** — thermal cycling, mechanical stress, electromigration, warpage, moisture, reliability testing. `[gap]`

### E. Making & advancing packages
16. **Packaging Manufacturing** — die attach, bonding, molding, singulation, inspection, test — `dicing`, `packaging`, `wafer-test`, `final-test` `[live]`; assembly/die-attach/molding detail `[partial]`
17. **Advanced Packaging** — the state of the art overview — `advanced-packaging` `[live]`, `hbm` `[live]`
18. **Future Packaging Technologies** — hybrid bonding, co-packaged optics, emerging architectures. `[gap]`

### The industry layer (roles, not brands)
Explain **who** packages chips, described by role — **no vendor marketing**:
- **OSAT** — Outsourced Assembly & Test providers; independent companies that
  package and test dies for others.
- **Foundry packaging** — foundries offering their own advanced-packaging lines
  (interposers, 2.5D/3D) alongside wafer fabrication.
- **IDM packaging** — integrated device manufacturers packaging in-house.
Surface via a short "who does packaging" section that links to `/industry`
(company directory, filter by OSAT/ATMP) rather than promoting any company.

---

## 2. Learning sequence

Vocabulary first, then methods from simple to advanced, then the cross-cutting
concerns, then how it's made and who makes it:

`Fundamentals (why package) → Die & Package → Substrate → Interconnects →
Wire Bonding → Flip Chip → Traditional Packages → Wafer-Level Packaging →
Fan-Out → 2.5D → Chiplets → 3D → Heterogeneous Integration →
Thermal Management ↔ Reliability (cross-cutting) → Packaging Manufacturing →
Advanced Packaging → Future Packaging → Industry (OSAT / Foundry / IDM)`

Beginners follow it top-to-bottom; experienced readers jump straight to a method
or to Advanced/Future. The existing landing already presents two views of this
(the post-fab flow and the complexity ladder).

## 3. Proposed routes (reuse the existing scheme — no new patterns)

- **Hub:** `/semiconductors/packaging` (exists) — the guided map; new gap topics
  slot into its jargon strip / ladder as they are authored.
- **Lessons:** `/semiconductors/learn/<slug>` (exists) — reuse the live lessons;
  author gap lessons into the **same** `packaging` learn path so there is one
  canonical home. Proposed new slugs (future phases): `why-packaging`,
  `substrate`, `interconnects`, `wafer-level-packaging`, `fan-out`,
  `heterogeneous-integration`, `thermal-management`, `packaging-reliability`,
  `future-packaging`.
- No separate route scheme, no duplicate pages.

## 4. Topic dependencies

- **Prerequisites for everything:** Die & Package → Substrate → Interconnects
  (the vocabulary). These must be explained before the methods rely on them.
- **Base methods:** Wire Bonding and Flip Chip are the two fundamental
  die-to-package connection methods; Flip Chip is a prerequisite for 2.5D and 3D.
- **Advanced chain:** Flip Chip → WLP/Fan-Out → 2.5D → 3D → Chiplets →
  Heterogeneous Integration (which composes all of the above).
- **Cross-cutting:** Thermal Management and Reliability depend on the advanced
  methods (especially 3D stacking) and should follow them.
- **Making/industry:** Packaging Manufacturing and the OSAT/Foundry/IDM layer
  apply across all methods.

## 5. Existing content reuse opportunities

- **Reuse directly:** the 8 packaging lessons + 4 post-fab lessons; the 6
  packaging diagrams; the `/semiconductors/packaging` landing and its
  `packaging-flow.ts` data.
- **Cross-link (already partly wired):** `/manufacturing`, `/supply-chain`,
  `/industry`, `/semiconductors/design` (stage 11), and the thermal/yield tools.
- **Author only the gaps:** Fundamentals/why-package, Substrate, Interconnects,
  WLP, Fan-Out, Heterogeneous Integration (standalone), Thermal Management,
  Reliability, Future Packaging — using the existing `SemiLesson` template and
  `LessonDiagram` component (add diagrams for substrate, interconnects, fan-out,
  WLP, thermal path as those lessons are written).

---

## Out of scope for this phase

No content is authored here. Building the gap lessons, adding their diagrams, and
wiring them into the packaging landing are separate, later phases — each small
and independently shippable.
