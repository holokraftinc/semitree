# Semitree — Manual QA Checklist (Phase 15)

Automated QA is green (see bottom). This checklist covers what a human must
verify **visually / on real devices / against live services** before declaring
production-ready. **Do not declare production-ready until every box is checked.**

Legend: ☐ = to verify.

---

## 1. Cross-browser & real devices
- ☐ Chrome (desktop) — home, a calculator, a map, an article render correctly.
- ☐ Safari (desktop) — same.
- ☐ Firefox (desktop) — same.
- ☐ iOS Safari (real iPhone) — home, mobile menu, a calculator, a map.
- ☐ Android Chrome (real device) — same.
- ☐ No horizontal scrolling on any page at 320px, 375px, 768px, 1024px, 1440px.

## 2. Visual / design polish
- ☐ Typography, spacing, and colors look correct (system font stack).
- ☐ **Dark mode**: toggle OS to dark — every page's tokens invert correctly, text stays legible (contrast), no white flashes.
- ☐ Cards, badges, buttons, and the flow-rail animation look right; no layout jumps.
- ☐ Focus rings are clearly visible when tabbing (keyboard only).

## 3. Navigation
- ☐ Every header nav item (Explore, Tools, Industry, Research, Resources) loads the right page.
- ☐ **Learn is a dropdown** (desktop): clicking/hovering opens it; it does **not** jump straight to Microfluidics. Semiconductors appears first (primary), Microfluidics second. Both links navigate correctly. Esc + outside-click + selecting a domain all close it.
- ☐ **Learn on mobile**: tapping "Learn" **expands** a submenu (Semiconductors, Microfluidics) rather than navigating; both links work; large touch targets; no overflow.
- ☐ `/learn` shows the **hub** (domain selection, Semiconductors dominant), not the microfluidics curriculum. `/learn/microfluidics` shows the microfluidics curriculum; `/semiconductors/learn` the semiconductor paths.
- ☐ Breadcrumbs reflect the hierarchy: Home ▸ Learn ▸ Semiconductors ▸ … and Home ▸ Learn ▸ Microfluidics ▸ …
- ☐ Footer links work (Learn group lists Semiconductors + Microfluidics).
- ☐ Mobile hamburger opens/closes; links navigate; menu traps focus and closes on Esc.
- ☐ Breadcrumbs on inner pages are correct and clickable.
- ☐ Wordmark returns to home.

## 4. Search (⌘K)
- ☐ `⌘K` / `Ctrl+K` opens the search modal; `Esc` closes it.
- ☐ Typing shows results across concepts, lessons, and tools.
- ☐ Arrow keys + Enter navigate to a result; focus returns sanely on close.
- ☐ Empty / no-match state reads well.

## 5. Calculators (spot-check ~4, incl. one microfluidics + one semiconductor)
- ☐ Enter values → **Calculate** → result appears instantly.
- ☐ **Reset** clears inputs and result.
- ☐ **Copy result** actually copies to clipboard (paste to confirm).
- ☐ Unit dropdowns convert correctly (e.g. mm vs µm changes the result).
- ☐ Invalid/negative/empty inputs show an inline error, not a crash or NaN.
- ☐ Formula, Variables, Interpretation, Assumptions, and Worked example sections render.
- ☐ Related concepts / lessons / tools / companies links work.

## 6. Explorers & maps
- ☐ Manufacturing Explorer: all 17 steps clickable; prev/next work; example chains scroll on mobile.
- ☐ Supply Chain Explorer: all 12 stages; company/process/tool links resolve.
- ☐ Global map: pins render; type filter works; clicking a marker shows the company panel with working links.
- ☐ India map: state buckets populated; pins clickable.
- ☐ Learning paths & lessons: navigation between lessons works; diagrams render.

## 7. Content / CMS (after WordPress plugin v1.0.1 is uploaded + content published)
- ☐ `cms.semitree.in` REST returns published Articles; CORS header `Access-Control-Allow-Origin: https://semitree.in` present (check DevTools Network on a `wp-json` request). If missing, exclude `/wp-json/` from GoDaddy cache.
- ☐ `semitree.in/cms/articles` lists published Articles in the Semitree design.
- ☐ Opening an article renders body, featured image, author, date in the Semitree article layout.
- ☐ A **draft** article does NOT appear publicly.
- ☐ Unpublishing/archiving removes it from the public listing.
- ☐ Article `canonical` (view-source) points to `semitree.in`, never `cms.semitree.in`.
- ☐ WordPress unreachable → `/cms/*` shows the friendly "temporarily unavailable" state (no crash); rest of site works.

## 8. Newsletter
- ☐ Subscribe with a new email → success state; confirm the subscriber appears in wp-admin → Subscribers.
- ☐ Subscribe again with the same email → "already subscribed" state.
- ☐ Invalid email → validation error.
- ☐ Unsubscribe link (`/unsubscribe?token=…`) marks the subscriber unsubscribed.
- ☐ (Once an email provider is wired) test-send an issue; unsubscribe link in the email works; SPF/DKIM/DMARC pass (check message headers / mail-tester.com).

## 9. Resources & downloads
- ☐ Cheat-sheet PDFs download and open correctly.
- ☐ Resource and directory routes render (microfluidics directory shows its "verified only" empty state).

## 10. Accessibility (assistive tech)
- ☐ Full keyboard-only pass of home + one calculator (Tab/Shift-Tab/Enter/Esc) — nothing unreachable, order is logical.
- ☐ Screen reader (VoiceOver / NVDA) reads headings, labels, and calculator results (`aria-live`) correctly.
- ☐ Run Lighthouse / axe DevTools on 3–4 representative pages — address any contrast or ARIA findings.

## 11. SEO & metadata
- ☐ View-source on home + an article + a tool: unique `<title>`, meta description, canonical, OpenGraph tags.
- ☐ `sitemap.xml` lists the correct `https://semitree.in` URLs; `robots.txt` is correct.
- ☐ JSON-LD present and valid (Rich Results test) on articles/tools/lessons.

## 12. Performance
- ☐ Lighthouse (mobile) on home + a calculator + an article: Performance, Accessibility, Best Practices, SEO all green.
- ☐ First load feels instant; no layout shift; calculators respond with no perceptible delay.

## 13. Regression — existing functionality
- ☐ `semitree.in` (GitHub Pages) still serves the real site over HTTPS.
- ☐ All prior microfluidics tools, lessons, concepts still work.
- ☐ No console errors on key pages (check DevTools console).

---

## Automated QA — status at Phase 15 (all passing)
- `npm test` → **318 tests pass** (incl. the calculator boundary matrix: normal / zero / negative / empty / very small / very large / decimal / scientific / invalid across all 16 engines).
- `npm run typecheck` → clean.
- `npm run lint` → clean.
- `npm run build` → **200 static pages**; route sweep: **195/195 routes return HTTP 200**, plus `sitemap.xml` and `robots.txt`.
- User journeys (browser-verified): Student, Researcher, Discovery (incl. global search), Mobile — all pass.
- E2E framework: **not configured** (no Playwright/Cypress). Consider adding Playwright for CI later; journeys were verified manually via the browser this phase.
