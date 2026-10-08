/**
 * Semitree information architecture — the single source of truth for the new
 * "India's Semiconductor Ecosystem" section hierarchy.
 *
 * This module declares the sections, their sub-items, and whether each item is
 * `available` (a real route today) or `coming-soon` (scaffolded for a later
 * phase). The navigation and the section-hub pages both read from here, so the
 * hierarchy is edited in ONE place.
 *
 * No content or data is implemented here — this is structure only. Existing
 * routes are referenced, never moved; `coming-soon` items intentionally have no
 * live destination and are rendered as non-links.
 */

export type IaStatus = "available" | "coming-soon";

export interface IaItem {
  label: string;
  /** Destination for `available` items. Omit/ignore for `coming-soon`. */
  href?: string;
  description?: string;
  status: IaStatus;
}

/** A titled group of items, used for grouped (mega-menu) sections. */
export interface MegaGroup {
  title: string;
  items: IaItem[];
}

export interface IaSection {
  /** Stable key. */
  key: string;
  /** Section landing route. */
  href: string;
  label: string;
  /** One-line purpose shown under the section title. */
  tagline: string;
  /** Whether the section landing page exists today or is scaffolded this phase. */
  landing: "existing" | "scaffold";
  items: IaItem[];
  /**
   * Optional grouped structure for the desktop mega menu and (when present) the
   * section hub. Sections without a menu render as a plain nav link.
   */
  menu?: MegaGroup[];
}

const A = (label: string, href: string, description?: string): IaItem => ({ label, href, description, status: "available" });
const SOON = (label: string, description?: string): IaItem => ({ label, description, status: "coming-soon" });

/* ------------------------------------------------------------------ *
 * The eight primary sections.
 * ------------------------------------------------------------------ */

export const IA_SECTIONS: IaSection[] = [
  {
    key: "explore",
    href: "/explore",
    label: "Explore",
    tagline: "Understand the technology.",
    landing: "existing",
    items: [
      A("Semiconductor 101", "/semiconductors/learn", "Start from first principles."),
      A("How chips are made", "/semiconductors/learn/journey", "The wafer-to-chip manufacturing journey."),
      A("Design", "/semiconductors/design", "How an idea becomes a manufacturable chip."),
      A("Manufacturing", "/manufacturing", "Front-end wafer processing, step by step."),
      A("Packaging", "/semiconductors/packaging", "Turning dies into usable components."),
      SOON("Testing", "Wafer sort, package test, and yield."),
      A("Equipment", "/semiconductors/equipment", "The tools that build chips."),
      A("Materials", "/semiconductors/materials", "The materials chips are built from."),
      A("Supply chain", "/supply-chain", "How the ecosystem connects, end to end."),
      A("Glossary", "/concepts", "Key concepts and terminology."),
      A("Tools", "/semiconductors/tools", "Interactive calculators and explorers."),
    ],
    menu: [
      {
        title: "Learn",
        items: [
          A("Semiconductor 101", "/semiconductors/learn"),
          A("How chips are made", "/semiconductors/learn/journey"),
          A("Design", "/semiconductors/design"),
          A("Manufacturing", "/manufacturing"),
          A("Packaging", "/semiconductors/packaging"),
          SOON("Testing"),
          A("Equipment", "/semiconductors/equipment"),
          A("Materials", "/semiconductors/materials"),
          A("Glossary", "/concepts"),
        ],
      },
      {
        title: "Tools",
        items: [
          A("Semiconductor tools", "/semiconductors/tools"),
          A("Manufacturing tools", "/semiconductors/tools?category=manufacturing"),
          A("Packaging tools", "/semiconductors/tools?category=packaging"),
          A("Device physics", "/semiconductors/tools?category=device-physics"),
        ],
      },
    ],
  },
  {
    key: "industry",
    href: "/industry",
    label: "Industry",
    tagline: "Understand the industry structure.",
    landing: "existing",
    items: [
      A("Value chain", "/supply-chain", "Design through end markets."),
      A("Company directory", "/industry/companies", "Companies across the ecosystem."),
      A("Global map", "/industry/map", "The industry plotted by location."),
      SOON("Fabs", "Wafer fabrication facilities."),
      SOON("OSAT / ATMP", "Assembly, test, and packaging."),
      SOON("Design & IP", "Fabless design houses and IP."),
      SOON("Equipment", "Equipment makers."),
      SOON("Materials", "Materials and consumables suppliers."),
      SOON("Packaging", "Advanced packaging players."),
      SOON("Testing", "Test houses and services."),
      A("Suppliers", "/suppliers", "The broader supplier base."),
      SOON("Startups", "Emerging companies."),
      SOON("Electronics", "Downstream electronics."),
    ],
    menu: [
      {
        title: "Value chain",
        items: [
          A("Design", "/supply-chain/chip-design"),
          A("EDA / IP", "/supply-chain/eda"),
          A("Equipment", "/supply-chain/semiconductor-equipment"),
          A("Materials", "/supply-chain/raw-materials"),
          A("Fab", "/supply-chain/fab"),
          A("Packaging", "/supply-chain/packaging"),
          A("Testing", "/supply-chain/testing"),
          A("Electronics", "/supply-chain/electronics"),
        ],
      },
      {
        title: "Industry",
        items: [
          A("Company directory", "/industry/companies"),
          A("Global map", "/industry/map"),
          A("Suppliers", "/suppliers"),
          SOON("Fabs"),
          SOON("OSAT / ATMP"),
          SOON("Startups"),
        ],
      },
    ],
  },
  {
    key: "companies",
    href: "/companies",
    label: "Companies",
    tagline: "Discover the companies.",
    landing: "scaffold",
    items: [
      A("Company directory", "/industry/companies", "Browse all companies."),
      A("Supplier directory", "/suppliers", "Equipment, chemicals, wafers, materials, and the support base."),
      A("Global map", "/industry/map", "Companies by location."),
      SOON("Fabs", "Foundries and IDMs."),
      SOON("OSAT / ATMP", "Assembly and test."),
      SOON("Design companies", "Fabless and IP."),
      SOON("Equipment companies", "Tooling vendors."),
      SOON("Materials companies", "Materials suppliers."),
      SOON("Startups", "Emerging companies."),
      SOON("Research organizations", "Labs and institutes."),
    ],
  },
  {
    key: "india",
    href: "/india",
    label: "India",
    tagline: "Understand India's ecosystem.",
    landing: "existing",
    items: [
      A("India overview", "/india", "The ecosystem at a glance."),
      A("India semiconductor map", "/industry/map/india", "Projects and companies across India."),
      A("States", "/india#states-h", "Ecosystem by state."),
      A("Projects", "/india#projects-h", "Announced fabs, ATMP, and facilities."),
      A("Investments", "/india#investments-h", "Announced funding and incentives."),
      A("Indian companies", "/industry/companies", "Companies operating in India."),
      A("Suppliers", "/suppliers", "The supplier base."),
      A("Talent", "/india#talent-h", "Research institutions and skills."),
      SOON("Government & policy", "Schemes and policy tracker."),
    ],
    menu: [
      {
        title: "India",
        items: [
          A("India overview", "/india"),
          A("Map", "/industry/map/india"),
          A("Projects", "/india#projects-h"),
          A("Investments", "/india#investments-h"),
          A("Companies", "/industry/companies"),
          A("Talent", "/india#talent-h"),
        ],
      },
      {
        title: "Top states",
        items: [
          A("Gujarat", "/india/states/gujarat"),
          A("Karnataka", "/india/states/karnataka"),
          A("Telangana", "/india/states/telangana"),
          A("Tamil Nadu", "/india/states/tamil-nadu"),
          A("Assam", "/india/states/assam"),
        ],
      },
    ],
  },
  {
    key: "supply-chain",
    href: "/supply-chain",
    label: "Supply chain",
    tagline: "Understand how the ecosystem connects.",
    landing: "existing",
    items: [
      A("Supply chain explorer", "/supply-chain", "Design → EDA/IP → equipment → materials → wafer → fab → packaging → testing → electronics → end markets."),
    ],
  },
  {
    key: "insights",
    href: "/insights",
    label: "Insights",
    tagline: "Understand what is changing.",
    landing: "existing",
    items: [
      A("Latest", "/insights", "Everything Semitree publishes."),
      SOON("India", "India-specific developments."),
      SOON("News", "Industry news."),
      SOON("Explainers", "Plain-language explainers."),
      SOON("Deep dives", "In-depth analysis."),
      SOON("Analysis", "Market and technology analysis."),
      SOON("Interviews", "Voices from the ecosystem."),
      A("Research", "/research", "Papers, references, and topics."),
    ],
  },
  {
    key: "opportunities",
    href: "/opportunities",
    label: "Opportunities",
    tagline: "Find the opportunities.",
    landing: "existing",
    items: [
      A("Problems worth solving", "/opportunities#problems-h", "Evidence-tagged problem database."),
      A("Supplier opportunities", "/opportunities#gaps-h", "Supplier categories with no verified player yet."),
      A("Market signals", "/opportunities#signals-h", "Reported signals — capital, projects, policy."),
      A("Emerging technologies", "/opportunities#tech-h", "Shifts worth tracking."),
      A("Submit a problem", "/submit", "Tell us about a gap or need."),
      SOON("Industry gaps", "Structural capability gaps."),
    ],
  },
  {
    key: "projects",
    href: "/projects",
    label: "Projects",
    tagline: "Semitree's ongoing ecosystem research.",
    landing: "scaffold",
    items: [
      A("India semiconductor map", "/industry/map/india", "Mapping India's ecosystem."),
      A("Company database", "/industry/companies", "The company registry."),
      A("Supply chain explorer", "/supply-chain", "The end-to-end chain."),
      SOON("Supplier database", "A verified supplier registry."),
      SOON("Startup tracker", "Tracking new companies."),
      SOON("Investment tracker", "Funding and incentives."),
      SOON("Manufacturing tracker", "Facilities and capacity."),
    ],
  },
];

/** Utility links (header/footer), outside the primary section set. */
export const IA_UTILITIES: IaItem[] = [
  A("Newsletter", "/newsletter", "Get ecosystem updates."),
  A("Submit an industry problem", "/submit", "Tell us what the ecosystem is missing."),
  A("About", "/about", "What Semitree is and why."),
];

const BY_KEY = new Map(IA_SECTIONS.map((s) => [s.key, s]));
export function getIaSection(key: string): IaSection | undefined {
  return BY_KEY.get(key);
}
