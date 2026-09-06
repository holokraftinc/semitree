/**
 * Article registry. All entries are Semitree's own original, evergreen content
 * (see types.ts) — no fabricated news, statistics, or external authors. Every
 * article interlinks to real Semitree entities (lessons, companies, tools,
 * research topics). Content is data; UI components never hardcode it.
 */
import type { Article, ContentType } from "./types";

export const ARTICLES: Article[] = [
  {
    slug: "how-a-chip-is-made",
    title: "How a chip is made, in ten minutes",
    subtitle: "From sand to a packaged, tested chip — the whole journey.",
    type: "explainer",
    authorId: "semitree",
    publishedDate: "2026-09-02",
    excerpt:
      "A fast, plain-English tour of semiconductor manufacturing — from purifying silicon to fabricating, packaging, and testing the finished chip.",
    tags: ["manufacturing", "overview", "beginners"],
    accent: "teal",
    featured: true,
    popular: true,
    body: [
      { type: "p", text: "A modern chip starts as ordinary sand and ends as billions of transistors working in concert. In between are hundreds of precisely controlled steps. Here's the whole journey at a high level — each stage links to a deeper explainer." },
      { type: "h2", text: "From sand to wafer" },
      { type: "p", text: "High-purity silica is reduced to metallurgical-grade silicon, then refined to electronic-grade polysilicon. A single crystal is grown from the melt and sliced into thin, mirror-polished wafers — the substrate every chip is built on." },
      { type: "h2", text: "Building the transistors" },
      { type: "p", text: "Inside the fab, the wafer cycles through deposit → pattern → etch → dope → planarize, hundreds of times. Lithography defines the smallest features; etching transfers them; doping creates the transistor regions; and interconnect wiring ties everything together." },
      { type: "callout", title: "The pacing step", text: "Lithography sets how small features can be, which is why it is the pacing technology of Moore's Law." },
      { type: "h2", text: "Test, cut, package, test again" },
      { type: "p", text: "Finished wafers are tested die-by-die, diced into individual chips, packaged to protect and connect them, and tested once more before they ship. Packaging is increasingly where performance is won as transistor scaling slows." },
      { type: "p", text: "Want the step-by-step version? Walk the interactive Manufacturing Explorer, or follow the whole value chain in the Supply Chain Explorer." },
    ],
    relatedConcepts: [
      { label: "Wafer", slug: "wafer" },
      { label: "Lithography", slug: "lithography" },
      { label: "Packaging", slug: "packaging" },
    ],
    relatedCompanies: ["tsmc", "asml", "ase"],
    relatedTools: ["die-per-wafer"],
    relatedArticles: ["why-euv-matters", "estimate-dies-per-wafer", "fabless-idm-foundry"],
  },
  {
    slug: "fabless-idm-foundry",
    title: "Fabless, IDM, or foundry? How the chip business is split",
    subtitle: "The three business models behind every chip — and why the split matters.",
    type: "explainer",
    authorId: "semitree",
    publishedDate: "2026-08-12",
    excerpt:
      "Fabless designers, pure-play foundries, and integrated device manufacturers each play a different role. Here's how the modern semiconductor business is divided.",
    tags: ["business models", "foundry", "fabless", "IDM"],
    accent: "teal",
    popular: true,
    body: [
      { type: "p", text: "Building a leading-edge fab costs tens of billions of dollars. That economic reality split the industry into distinct business models — and understanding them explains who does what." },
      { type: "h2", text: "Fabless" },
      { type: "p", text: "Fabless companies design chips but own no fab. They focus on architecture and design, then pay a foundry to manufacture. This lets them scale R&D without the capital burden of a fab." },
      { type: "h2", text: "Foundry" },
      { type: "p", text: "A pure-play foundry manufactures chips designed by others. It sells manufacturing capacity and process technology rather than branded products, and lives or dies by yield and advanced-node leadership." },
      { type: "h2", text: "IDM" },
      { type: "p", text: "An integrated device manufacturer both designs and fabricates its own products. Some IDMs now also offer foundry services, blurring the line." },
      { type: "callout", title: "Why it matters", text: "The split is why a single phone chip can involve a fabless designer, a foundry, an equipment maker, and an OSAT — each a specialist." },
    ],
    relatedConcepts: [{ label: "Integrated circuit", slug: "integrated-circuit" }],
    relatedCompanies: ["tsmc", "intel", "nvidia", "globalfoundries", "amd"],
    relatedArticles: ["how-a-chip-is-made", "why-euv-matters"],
  },
  {
    slug: "why-euv-matters",
    title: "Why EUV lithography is the pacing technology of Moore's Law",
    subtitle: "Shorter wavelength, smaller features — and a single supplier.",
    type: "technology-deep-dive",
    authorId: "semitree",
    publishedDate: "2026-08-20",
    excerpt:
      "Extreme-ultraviolet lithography lets chipmakers print the smallest features. Here's how it works, why it's so hard, and why it gates scaling.",
    tags: ["EUV", "lithography", "Moore's Law"],
    accent: "indigo",
    popular: true,
    body: [
      { type: "p", text: "Lithography projects each layer's pattern onto the wafer, and its resolution sets the minimum feature size. Roughly, resolution improves with shorter wavelength and higher numerical aperture." },
      { type: "h2", text: "From 193 nm to 13.5 nm" },
      { type: "p", text: "Deep-ultraviolet (193 nm) light, stretched with immersion and multi-patterning, carried the industry for years. Extreme-ultraviolet (EUV) at 13.5 nm now enables the smallest features in a single exposure." },
      { type: "h2", text: "Why it's hard" },
      { type: "ul", items: [
        "EUV is absorbed by almost everything, so the whole system works in vacuum with reflective mirrors.",
        "The light source vaporizes tin droplets with a high-power laser tens of thousands of times per second.",
        "Masks, resists, and pellicles all had to be reinvented for the new wavelength.",
      ] },
      { type: "callout", title: "One supplier", text: "EUV scanners are among the most complex machines ever built, and are supplied by a single company — a concentration point for the whole industry." },
      { type: "p", text: "The next step, High-NA EUV, pushes resolution further. Explore the EUV research topic for the open questions." },
    ],
    relatedConcepts: [
      { label: "Lithography", slug: "lithography" },
      { label: "Photoresist", slug: "photoresist" },
    ],
    relatedCompanies: ["asml", "tsmc", "intel", "samsung-semiconductor"],
    relatedTechnologies: [{ label: "EUV lithography", slug: "euv-lithography" }],
    relatedArticles: ["how-a-chip-is-made", "fabless-idm-foundry"],
  },
  {
    slug: "estimate-dies-per-wafer",
    title: "How to estimate good dies per wafer",
    subtitle: "Two calculators, one back-of-envelope answer.",
    type: "tool-tutorial",
    authorId: "semitree",
    publishedDate: "2026-08-28",
    excerpt:
      "Combine the die-per-wafer and wafer-yield calculators to estimate how many good chips a wafer will produce — and see what drives the number.",
    tags: ["tutorial", "yield", "wafer"],
    accent: "amber",
    body: [
      { type: "p", text: "\"How many chips per wafer?\" is one of the first economic questions in chip design. Two Semitree tools get you a quick estimate." },
      { type: "h2", text: "Step 1 — gross dies per wafer" },
      { type: "p", text: "Open the Die-per-wafer calculator and enter the wafer diameter and die size. It uses the de Vries approximation, which subtracts an edge term for partial dies lost at the wafer's rim." },
      { type: "h2", text: "Step 2 — apply yield" },
      { type: "p", text: "Not every die works. Open the Wafer-yield calculator, enter your defect density and die area, and pick a model (Poisson or Murphy). Multiply gross dies by the yield fraction to estimate good dies." },
      { type: "callout", title: "What drives it", text: "Bigger dies hurt twice: fewer fit on the wafer, and each is more likely to catch a fatal defect. That's why die size is a central design lever." },
      { type: "ol", items: [
        "Gross dies = die-per-wafer estimate.",
        "Yield = wafer-yield calculator output.",
        "Good dies ≈ gross dies × yield.",
      ] },
    ],
    relatedConcepts: [
      { label: "Wafer", slug: "wafer" },
      { label: "Dicing", slug: "dicing" },
    ],
    relatedCompanies: ["tsmc", "globalfoundries"],
    relatedTools: ["die-per-wafer", "wafer-yield"],
    relatedArticles: ["how-a-chip-is-made"],
  },
  {
    slug: "advanced-packaging-chiplets-guide",
    title: "Advanced packaging and chiplets: performance beyond scaling",
    subtitle: "When you can't shrink the transistor, integrate smarter.",
    type: "technology-deep-dive",
    authorId: "semitree",
    publishedDate: "2026-08-25",
    excerpt:
      "As transistor scaling slows, performance increasingly comes from packaging — chiplets, 2.5D interposers, 3D stacks, and HBM. Here's the landscape.",
    tags: ["packaging", "chiplets", "HBM", "3D"],
    accent: "indigo",
    popular: true,
    body: [
      { type: "p", text: "For decades, progress meant smaller transistors. As that slows and gets costlier, a second axis has opened up: how you integrate dies together in a package." },
      { type: "h2", text: "Chiplets" },
      { type: "p", text: "Instead of one large monolithic die, a design is split into smaller chiplets — each potentially on a different process — and integrated in one package. Smaller dies yield better and can be mixed and matched." },
      { type: "h2", text: "2.5D, 3D, and HBM" },
      { type: "ul", items: [
        "2.5D places dies side-by-side on an interposer with dense wiring between them.",
        "3D stacks dies vertically with through-silicon vias for the shortest interconnect.",
        "High-bandwidth memory (HBM) stacks DRAM to feed data-hungry AI accelerators.",
      ] },
      { type: "callout", title: "New constraints", text: "Packing more power into a smaller volume makes thermal management and die-to-die interconnect the hard problems — try the junction-temperature and power-density tools." },
    ],
    relatedConcepts: [
      { label: "Chiplets", slug: "chiplets" },
      { label: "Flip-chip", slug: "flip-chip" },
      { label: "Advanced packaging", slug: "advanced-packaging" },
      { label: "HBM", slug: "hbm" },
    ],
    relatedCompanies: ["tsmc", "ase", "amd", "nvidia", "sk-hynix"],
    relatedTechnologies: [{ label: "Advanced packaging & chiplets", slug: "advanced-packaging-chiplets" }],
    relatedTools: ["junction-temperature", "power-density"],
    relatedArticles: ["how-a-chip-is-made", "why-euv-matters"],
  },
  {
    slug: "india-semiconductor-overview",
    title: "India's semiconductor push: the projects taking shape",
    subtitle: "The publicly announced fabs and assembly plants putting India on the map.",
    type: "india-update",
    authorId: "semitree",
    publishedDate: "2026-09-04",
    excerpt:
      "An overview of India's publicly announced semiconductor projects — fabs and assembly-test facilities — and where they sit on the map.",
    tags: ["India", "fabs", "ATMP"],
    accent: "rose",
    popular: true,
    body: [
      { type: "p", text: "India has moved from almost no domestic chip manufacturing toward a set of publicly announced fabs and assembly-and-test facilities. This is an overview of those projects; for anything time-sensitive, always check primary sources." },
      { type: "h2", text: "Where the projects are" },
      { type: "ul", items: [
        "Gujarat has attracted the most activity — an assembly-and-test facility at Sanand and a fab project at Dholera, among others.",
        "Assembly-and-test (OSAT/ATMP) projects span several states, reflecting where packaging can scale first.",
        "Design centers of global companies have operated in Bengaluru, Hyderabad, and Noida for years.",
      ] },
      { type: "callout", title: "See it on the map", text: "The India semiconductor map groups these by state — Gujarat, Maharashtra, Karnataka, Tamil Nadu, Telangana, Uttar Pradesh, and others." },
      { type: "p", text: "Semitree lists only publicly announced facilities, at city level, and never fabricates specifics. Explore the companies for details." },
    ],
    relatedConcepts: [{ label: "Packaging", slug: "packaging" }],
    relatedCompanies: ["micron", "tata-electronics", "cg-power", "kaynes", "hcltech"],
    relatedArticles: ["how-a-chip-is-made"],
  },
  {
    slug: "getting-started-with-semitree",
    title: "Getting started with Semitree",
    subtitle: "Learn → Calculate → Understand → Apply.",
    type: "blog",
    authorId: "semitree",
    publishedDate: "2026-08-05",
    excerpt:
      "New to Semitree? Here's how the learning, tools, manufacturing, supply chain, industry, and research pieces fit together.",
    tags: ["semitree", "guide"],
    accent: "teal",
    body: [
      { type: "p", text: "Semitree is a knowledge, tools, and research platform for the semiconductor industry (with a full microfluidics domain too). Here's how to get the most from it." },
      { type: "h2", text: "Learn the concepts" },
      { type: "p", text: "Start with the structured learning paths — from what a semiconductor is up to CMOS integrated circuits, chip manufacturing, the design flow, and advanced packaging." },
      { type: "h2", text: "Use the tools" },
      { type: "p", text: "The semiconductor calculators cover electrical fundamentals, device physics, manufacturing, and packaging — each with the formula, assumptions, and a worked example." },
      { type: "h2", text: "Explore the industry" },
      { type: "p", text: "Walk the Manufacturing and Supply Chain explorers, browse the company directory and maps, and dig into research topics — everything is cross-linked." },
    ],
    relatedTools: ["die-per-wafer"],
    relatedArticles: ["how-a-chip-is-made", "fabless-idm-foundry"],
  },
];

const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]));

export function getArticle(slug: string): Article | undefined {
  return BY_SLUG.get(slug);
}

/** Published articles, newest first. (Drafts/scheduled excluded when added.) */
export function publishedArticles(): Article[] {
  return ARTICLES.filter((a) => (a.status ?? "published") === "published").sort((a, b) =>
    b.publishedDate.localeCompare(a.publishedDate),
  );
}

export function latestArticles(n?: number): Article[] {
  const all = publishedArticles();
  return n ? all.slice(0, n) : all;
}

export function featuredArticle(): Article | undefined {
  return publishedArticles().find((a) => a.featured);
}

export function popularArticles(n = 4): Article[] {
  return publishedArticles().filter((a) => a.popular).slice(0, n);
}

export function articlesByType(type: ContentType): Article[] {
  return publishedArticles().filter((a) => a.type === type);
}

/** Content types that actually have at least one published article, with counts. */
export function activeCategories(): { type: ContentType; count: number }[] {
  const counts = new Map<ContentType, number>();
  for (const a of publishedArticles()) counts.set(a.type, (counts.get(a.type) ?? 0) + 1);
  return Array.from(counts.entries()).map(([type, count]) => ({ type, count }));
}

export function allTags(): string[] {
  const set = new Set<string>();
  for (const a of publishedArticles()) a.tags.forEach((t) => set.add(t));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function articlesByTag(tag: string): Article[] {
  return publishedArticles().filter((a) => a.tags.includes(tag));
}

export function relatedArticleObjects(slug: string): Article[] {
  const a = BY_SLUG.get(slug);
  if (!a?.relatedArticles) return [];
  return a.relatedArticles
    .map((s) => BY_SLUG.get(s))
    .filter((x): x is Article => Boolean(x) && (x!.status ?? "published") === "published");
}
