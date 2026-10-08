/**
 * Cross-entity connections for a learning topic, derived by REVERSE LOOKUP from
 * the real registries — never duplicated or invented:
 *   - Related tools     : semi-tools whose `relatedLearning` names this lesson.
 *   - Related companies : companies whose `relatedConcepts` name this lesson.
 *   - Related insights  : articles whose `relatedConcepts` name this lesson.
 *   - Supply-chain stage: a small, explicit map to the stage a topic belongs to.
 *
 * Each helper returns {label, href} links (empty when there is nothing to show),
 * so a topic page renders only the connections it genuinely has.
 */
import { SEMI_TOOLS } from "@/lib/data/semi-tools";
import { COMPANIES } from "@/lib/industry/companies";
import { publishedArticles } from "@/lib/content/articles";
import { getStage } from "./supply-chain";

export interface ConnLink {
  label: string;
  href: string;
}

/**
 * Tools whose relatedLearning includes this lesson (available only). Tools that
 * name this lesson as their PRIMARY related topic are listed first, so the main
 * "try the tool" CTA picks the most on-point calculator.
 */
export function relatedToolsForLesson(slug: string): ConnLink[] {
  return SEMI_TOOLS.filter((t) => t.status === "available" && (t.relatedLearning ?? []).includes(slug))
    .sort((a, b) => Number(b.relatedLearning?.[0] === slug) - Number(a.relatedLearning?.[0] === slug))
    .map((t) => ({ label: t.name, href: `/semiconductors/tools/${t.slug}` }));
}

/** Companies whose relatedConcepts reference this lesson. */
export function companiesForLesson(slug: string): ConnLink[] {
  return COMPANIES.filter((c) => (c.relatedConcepts ?? []).some((rc) => rc.slug === slug))
    .slice(0, 6)
    .map((c) => ({ label: c.name, href: `/industry/companies/${c.slug}` }));
}

/** Published articles whose relatedConcepts reference this lesson. */
export function insightsForLesson(slug: string): ConnLink[] {
  return publishedArticles()
    .filter((a) => (a.relatedConcepts ?? []).some((rc) => rc.slug === slug))
    .slice(0, 4)
    .map((a) => ({ label: a.title, href: `/articles/${a.slug}` }));
}

// The supply-chain stage each topic belongs to (only where there is a clean fit).
const LESSON_TO_STAGE: Record<string, { label: string; slug: string }> = {
  silicon: { label: "Raw materials", slug: "raw-materials" },
  ingot: { label: "Wafer manufacturing", slug: "wafer-manufacturing" },
  wafer: { label: "Wafer manufacturing", slug: "wafer-manufacturing" },
  oxidation: { label: "Front-end fab", slug: "fab" },
  deposition: { label: "Front-end fab", slug: "fab" },
  photoresist: { label: "Front-end fab", slug: "fab" },
  lithography: { label: "Front-end fab", slug: "fab" },
  etching: { label: "Front-end fab", slug: "fab" },
  "ion-implantation": { label: "Front-end fab", slug: "fab" },
  cmp: { label: "Front-end fab", slug: "fab" },
  metallization: { label: "Front-end fab", slug: "fab" },
  metrology: { label: "Testing", slug: "testing" },
  "wafer-test": { label: "Testing", slug: "testing" },
  dicing: { label: "Packaging", slug: "packaging" },
  packaging: { label: "Packaging", slug: "packaging" },
  "final-test": { label: "Testing", slug: "testing" },
  architecture: { label: "Chip design", slug: "chip-design" },
  rtl: { label: "Chip design", slug: "chip-design" },
  logic: { label: "Chip design", slug: "chip-design" },
  synthesis: { label: "EDA & IP", slug: "eda" },
  verification: { label: "EDA & IP", slug: "eda" },
  "place-and-route": { label: "EDA & IP", slug: "eda" },
  "physical-design": { label: "EDA & IP", slug: "eda" },
  tapeout: { label: "EDA & IP", slug: "eda" },
};

/** The supply-chain stage this topic belongs to, if a page exists for it. */
export function supplyStageForLesson(slug: string): ConnLink | null {
  const mapped = LESSON_TO_STAGE[slug];
  if (!mapped || !getStage(mapped.slug)) return null;
  return { label: mapped.label, href: `/supply-chain/${mapped.slug}` };
}
