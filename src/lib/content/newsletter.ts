/**
 * Newsletter archive. Each issue is Semitree's own original recap — evergreen,
 * factual, no fabricated external news. Content is data, not hardcoded in UI.
 */
import type { NewsletterIssue } from "./types";

export const NEWSLETTER_ISSUES: NewsletterIssue[] = [
  {
    slug: "issue-2-explorers",
    number: 2,
    title: "The explorers are live",
    date: "2026-09-05",
    summary:
      "The interactive Manufacturing and Supply Chain explorers are here, plus the industry directory and maps.",
    body: [
      { type: "p", text: "This issue: two big interactive additions and how they connect to everything else on Semitree." },
      { type: "h2", text: "Manufacturing Explorer" },
      { type: "p", text: "Walk all 17 process steps from raw material to final test — each with inputs, outputs, equipment, defects, and the concepts and tools behind it." },
      { type: "h2", text: "Supply Chain Explorer" },
      { type: "p", text: "Zoom out to the full value chain — from raw materials and EDA to fabs, packaging, and end markets — with every stage cross-linked to companies, processes, and tools." },
      { type: "h2", text: "Industry directory & maps" },
      { type: "p", text: "Browse companies by type, country, and technology, and see them on the global and India maps." },
    ],
    relatedArticles: ["how-a-chip-is-made", "advanced-packaging-chiplets-guide"],
    relatedTools: ["die-per-wafer", "wafer-yield"],
    relatedResearch: ["advanced-packaging-chiplets"],
  },
  {
    slug: "issue-1-launch",
    number: 1,
    title: "Semitree for semiconductors",
    date: "2026-08-01",
    summary:
      "Semitree now covers the semiconductor industry — learning paths, calculators, and a knowledge base — alongside microfluidics.",
    body: [
      { type: "p", text: "Welcome to the first Semitree newsletter. Here's what's new for the semiconductor domain." },
      { type: "h2", text: "Learning paths" },
      { type: "p", text: "Structured paths take you from what a semiconductor is up to CMOS ICs, manufacturing, the design flow, and advanced packaging." },
      { type: "h2", text: "Calculators" },
      { type: "p", text: "New engineering tools cover electrical fundamentals, device physics, manufacturing, and packaging — each with formula, assumptions, and a worked example." },
      { type: "callout", title: "How to start", text: "Read the getting-started guide, then pick a learning path or a tool." },
    ],
    relatedArticles: ["getting-started-with-semitree", "why-euv-matters"],
    relatedTools: ["ohms-law", "die-per-wafer"],
    relatedResearch: ["euv-lithography"],
  },
];

const BY_SLUG = new Map(NEWSLETTER_ISSUES.map((i) => [i.slug, i]));

export function getIssue(slug: string): NewsletterIssue | undefined {
  return BY_SLUG.get(slug);
}

/** Issues newest first (by number). */
export function issuesNewestFirst(): NewsletterIssue[] {
  return [...NEWSLETTER_ISSUES].sort((a, b) => b.number - a.number);
}
