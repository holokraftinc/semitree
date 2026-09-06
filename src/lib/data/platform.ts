/**
 * Platform-level data for the Semitree homepage & Explore experience.
 *
 * Data-driven so the UI stays generic. Only genuinely-live things link out;
 * planned (semiconductor) items are marked "coming soon" — no fabricated
 * companies, articles, or statistics.
 */

export type LinkStatus = "live" | "soon";

export interface PlatformLink {
  label: string;
  href?: string; // omitted when status === "soon"
  status: LinkStatus;
  note?: string;
}

/** "Where should I start?" — persona → recommended, mostly-live content. */
export interface Persona {
  id: string;
  label: string;
  blurb: string;
  recommendations: PlatformLink[];
}

export const PERSONAS: Persona[] = [
  {
    id: "student",
    label: "Student",
    blurb: "Build intuition from zero, with worked examples and calculators.",
    recommendations: [
      { label: "Start the Learn curriculum", href: "/learn", status: "live" },
      { label: "Browse the concepts glossary", href: "/concepts", status: "live" },
      { label: "Try the calculators", href: "/tools", status: "live" },
      { label: "Semiconductor learning paths", href: "/semiconductors/learn", status: "live" },
    ],
  },
  {
    id: "researcher",
    label: "Researcher",
    blurb: "Reach for tools, references, and the physics behind them.",
    recommendations: [
      { label: "Open the calculators", href: "/tools", status: "live" },
      { label: "Reading list & cheat sheets", href: "/resources", status: "live" },
      { label: "Research hub", href: "/research", status: "live" },
    ],
  },
  {
    id: "engineer",
    label: "Semiconductor engineer",
    blurb: "Get to process concepts, tools, and design references fast.",
    recommendations: [
      { label: "Semiconductor learning paths", href: "/semiconductors/learn", status: "live" },
      { label: "Manufacturing overview", href: "/explore#manufacturing", status: "live" },
      { label: "Semiconductor tools", status: "soon" },
    ],
  },
  {
    id: "industry",
    label: "Industry professional",
    blurb: "Track the ecosystem: companies, equipment, and news.",
    recommendations: [
      { label: "Industry overview", href: "/industry", status: "live" },
      { label: "Directory", href: "/directory", status: "live" },
      { label: "Weekly newsletter", href: "/newsletter", status: "live" },
    ],
  },
  {
    id: "founder",
    label: "Founder",
    blurb: "Understand the landscape and where to plug in.",
    recommendations: [
      { label: "Industry overview", href: "/industry", status: "live" },
      { label: "Company directory", href: "/directory", status: "live" },
      { label: "Newsletter", href: "/newsletter", status: "live" },
    ],
  },
  {
    id: "investor",
    label: "Investor",
    blurb: "Follow technologies, players, and research signals.",
    recommendations: [
      { label: "Industry overview", href: "/industry", status: "live" },
      { label: "Research hub", href: "/research", status: "live" },
      { label: "Newsletter", href: "/newsletter", status: "live" },
    ],
  },
];

/** Popular topics — live microfluidics concepts + planned semiconductor topics. */
export const POPULAR_TOPICS: PlatformLink[] = [
  { label: "Reynolds number", href: "/concepts/reynolds-number", status: "live" },
  { label: "Laminar flow", href: "/concepts/laminar-flow", status: "live" },
  { label: "Droplet microfluidics", href: "/concepts/droplet-microfluidics", status: "live" },
  { label: "Diffusion & mixing", href: "/concepts/diffusion", status: "live" },
  { label: "Photolithography", status: "soon" },
  { label: "Etching & deposition", status: "soon" },
  { label: "Doping", status: "soon" },
  { label: "Chip packaging", status: "soon" },
];

/** High-level, factual semiconductor manufacturing stages (teaser). */
export interface ManufacturingStage {
  step: number;
  title: string;
  summary: string;
}

export const MANUFACTURING_STAGES: ManufacturingStage[] = [
  { step: 1, title: "Design & EDA", summary: "Circuits are designed and verified with electronic design automation before anything is built." },
  { step: 2, title: "Masks & lithography", summary: "Patterns are projected onto a photoresist-coated wafer to define each layer." },
  { step: 3, title: "Wafer fabrication", summary: "Layers are built up by deposition, etching, and doping — repeated hundreds of times." },
  { step: 4, title: "Packaging", summary: "Finished dies are cut, bonded, and encapsulated into usable chips." },
  { step: 5, title: "Test", summary: "Chips are electrically tested and sorted before they ship." },
];
