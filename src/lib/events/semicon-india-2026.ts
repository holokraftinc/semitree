/**
 * SEMICON India 2026 — a temporary, self-contained event hub.
 *
 * This is a MODULAR event feature: all of its content lives in this one data
 * module, rendered by a single route (/events/semicon-india-2026). To archive
 * or remove the event after it ends, delete this file and its route folder —
 * nothing else in the app depends on it.
 *
 * Semitree is NOT the official organizer, sponsor, media partner, or endorser of
 * SEMICON India. This is Semitree's independent coverage and learning hub, and
 * the official SEMICON India website is the authoritative source for the event.
 * Facts below are drawn from the official event site and public reporting; the
 * detailed agenda, speakers, and exhibitor lists live on the official site and
 * are intentionally not reproduced here. No sessions are invented.
 */

import { ARTICLES } from "@/lib/content/articles";
import type { Article } from "@/lib/content/types";

/**
 * Event classification tag. Add this to an Article's `tags` (in the existing
 * content registry) to make it appear in the hub's coverage section — no
 * separate blog or CMS. Editorial rule for tagged articles: distinguish FACT,
 * SOURCE, and Semitree ANALYSIS, and prioritize official SEMICON India,
 * government, company announcements, then reputable reporting. No rumors as
 * facts; no fabricated timestamps.
 */
export const SEMICON_EVENT_TAG = "semicon-india-2026";

/* ------------------------------------------------------------------ *
 * Event lifecycle — the single source of truth for the event window.
 * Dates live here only; components derive their state from these. The
 * status is date-driven (India Standard Time), so the before/live/archive
 * transitions happen automatically with no code change.
 * ------------------------------------------------------------------ */

export const EVENT_SLUG = "semicon-india-2026";
export const EVENT_START_ISO = "2026-09-17";
export const EVENT_END_ISO = "2026-09-19";
// Event window in India Standard Time (UTC+5:30).
export const EVENT_START = Date.parse(`${EVENT_START_ISO}T00:00:00+05:30`);
export const EVENT_END = Date.parse(`${EVENT_END_ISO}T23:59:59+05:30`);

export type EventStatus = "upcoming" | "live" | "archive";

/** Lifecycle status at a given instant (defaults to now). */
export function eventStatus(now: number = Date.now()): EventStatus {
  if (now < EVENT_START) return "upcoming";
  if (now > EVENT_END) return "archive";
  return "live";
}

/** Day number (1-3) while the event is live, otherwise null. Uses IST. */
export function eventDayNumber(now: number = Date.now()): number | null {
  if (eventStatus(now) !== "live") return null;
  const ist = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(now));
  const istMidnight = Date.parse(`${ist}T00:00:00+05:30`);
  return Math.round((istMidnight - Date.parse(`${EVENT_START_ISO}T00:00:00+05:30`)) / 86_400_000) + 1;
}

/** Semitree articles tagged for this event, newest first. */
export function getSemiconArticles(): Article[] {
  return ARTICLES.filter((a) => a.tags?.includes(SEMICON_EVENT_TAG)).sort((a, b) =>
    a.publishedDate < b.publishedDate ? 1 : -1,
  );
}

export interface EventLink {
  label: string;
  href: string;
  /** true for external (official) links. */
  external?: boolean;
}

export interface ThemeLink {
  theme: string;
  blurb: string;
  /** A Semitree learning destination for this theme (internal). Omit if none exists. */
  href?: string;
  hrefLabel?: string;
}

/**
 * One session from the official agenda. Only officially listed session/theme
 * names are used — no invented sessions, speakers, or times. `time` is omitted
 * unless a verified time is available. `description` is a concise, generally
 * true note about the theme (never a fabricated event-specific claim), shown as
 * "Why it matters". The after-session fields stay empty until real coverage is
 * added.
 */
export interface EventSession {
  title: string;
  track: string;
  /** Concise, verified "why it matters" — optional. */
  description?: string;
  /** Semitree learning destinations for this theme (internal). */
  related?: EventLink[];
  /** After-session content — empty until added. */
  summary?: string;
  takeaway?: string;
  companies?: string[];
  technologies?: string[];
}

export interface EventDay {
  label: string;
  /** Display date, e.g. "17 September 2026". */
  date: string;
  /** ISO date (Asia/Kolkata) used to compute upcoming/live/completed status. */
  iso: string;
  summary: string;
  sessions: EventSession[];
}

export const SEMICON_INDIA_2026 = {
  slug: EVENT_SLUG,
  name: "SEMICON India 2026",
  theme: "Silicon to Systems: Building the Ecosystem",
  dates: "17–19 September 2026",
  venue: "Yashobhoomi (India International Convention & Expo Centre), New Delhi",
  organizers: "Jointly organized by the India Semiconductor Mission (ISM) and SEMI",
  officialUrl: "https://www.semiconindia.org/",

  /** The one-line positioning shown near the hero. */
  positioning:
    "Semitree's independent coverage and learning hub for SEMICON India 2026 — we are not the official organizer, sponsor, or media partner.",

  heroBlurb:
    "Follow India's semiconductor ecosystem as the industry, government, researchers, startups and global technology companies come together at SEMICON India 2026.",

  overview: [
    "SEMICON India 2026 is a major semiconductor industry event bringing the global chip ecosystem together in New Delhi, jointly organized by the India Semiconductor Mission (ISM) and SEMI.",
    "Held under the theme “Silicon to Systems: Building the Ecosystem”, it spans the full value chain — materials, manufacturing equipment, chip design, fabrication, advanced packaging, and electronics systems.",
  ],

  whyItMatters: [
    "It is one of the largest gatherings of India's growing semiconductor ecosystem, connecting government policy, manufacturers, equipment and materials suppliers, designers, researchers, and startups.",
    "The theme — “Silicon to Systems” — reflects India's ambition to build capability across the whole chain, not just one stage, aligned with the India Semiconductor Mission.",
    "For learners, it is a live snapshot of the technologies, companies, and policies shaping the industry right now.",
  ],

  whatToWatch: [
    "Announcements from government and the India Semiconductor Mission on ecosystem progress.",
    "Company and investment announcements across manufacturing, packaging, equipment, and materials.",
    "Sessions spanning the value chain, from materials and equipment to design, fabrication, and systems.",
    "International collaboration and the role of India in the global supply chain.",
  ],

  /** Reported scale (public reporting, not Semitree figures). Kept qualitative/attributed. */
  reportedScale:
    "Public reporting ahead of the event described participation on the scale of hundreds of companies and speakers and tens of thousands of visitors from dozens of countries. Treat any specific figure as reported by the organizers or press, not verified by Semitree — see the official site for confirmed numbers.",

  days: [
    {
      label: "Day 1",
      date: "17 September 2026",
      iso: "2026-09-17",
      summary:
        "Opening of the event and exhibition. The 5th edition of SEMICON India was inaugurated by the Prime Minister. The sessions below are from the official agenda; see the official site for times and speakers.",
      sessions: [
        { title: "Grand Inaugural Session", track: "Ceremony" },
        { title: "Exhibition Inauguration", track: "Ceremony" },
        {
          title: "Policy Makers",
          track: "Policy",
          related: [{ label: "The ecosystem", href: "/semiconductors/ecosystem" }],
        },
        {
          title: "NextGen Manufacturing",
          track: "Manufacturing",
          description:
            "Advancing chip fabrication — the process flow, capacity, and the manufacturing base that turns wafers into devices.",
          related: [
            { label: "Manufacturing", href: "/manufacturing" },
            { label: "Equipment", href: "/semiconductors/equipment" },
            { label: "Materials", href: "/semiconductors/materials" },
          ],
        },
        {
          title: "Packaging",
          track: "Packaging",
          description:
            "Advanced packaging is increasingly important as scaling shifts toward integration, chiplets, and heterogeneous architectures.",
          related: [
            { label: "Packaging", href: "/semiconductors/packaging" },
            { label: "Advanced packaging", href: "/semiconductors/equipment/advanced-packaging" },
            { label: "Packaging materials", href: "/semiconductors/materials" },
          ],
        },
        {
          title: "Equipment R&D and Manufacturing Ecosystem",
          track: "Equipment",
          description:
            "The tools that run every process step, the R&D behind them, and the manufacturing supply base fabs depend on.",
          related: [
            { label: "Equipment", href: "/semiconductors/equipment" },
            { label: "Manufacturing", href: "/manufacturing" },
            { label: "The ecosystem", href: "/semiconductors/ecosystem" },
          ],
        },
        {
          title: "AI Transforming Industry",
          track: "AI",
          description:
            "AI is both a major driver of semiconductor demand and, increasingly, a tool used across chip design and manufacturing.",
          related: [
            { label: "The ecosystem", href: "/semiconductors/ecosystem" },
            { label: "Industry", href: "/industry" },
          ],
        },
      ],
    },
    {
      label: "Day 2",
      date: "18 September 2026",
      iso: "2026-09-18",
      summary:
        "Conference sessions across the semiconductor value chain. The themes below are from the official agenda; see the official site for times and speakers.",
      sessions: [
        {
          title: "Policy",
          track: "Policy",
          related: [{ label: "The ecosystem", href: "/semiconductors/ecosystem" }],
        },
        {
          title: "Supply Chain 360",
          track: "Supply chain",
          description:
            "The end-to-end semiconductor supply chain — materials, equipment, fabrication, packaging, test, and logistics.",
          related: [
            { label: "Supply chain", href: "/supply-chain" },
            { label: "The ecosystem", href: "/semiconductors/ecosystem" },
          ],
        },
        {
          title: "Electronic Systems & Products",
          track: "Systems",
          description:
            "The 'systems' end of silicon-to-systems — turning chips into electronic products.",
          related: [{ label: "The ecosystem", href: "/semiconductors/ecosystem" }],
        },
        {
          title: "R&D",
          track: "R&D",
          related: [
            { label: "Learn (all paths)", href: "/semiconductors/learn" },
            { label: "Concepts", href: "/semiconductors/concepts" },
          ],
        },
        {
          title: "International Collaboration",
          track: "International",
          related: [
            { label: "Supply chain", href: "/supply-chain" },
            { label: "The ecosystem", href: "/semiconductors/ecosystem" },
          ],
        },
        {
          title: "Design",
          track: "Design",
          description:
            "How an idea becomes a chip — architecture, RTL, verification, and physical design.",
          related: [{ label: "Design", href: "/semiconductors/design" }],
        },
        {
          title: "Fabless",
          track: "Fabless",
          description:
            "The fabless model — designing chips while outsourcing their manufacturing to foundries.",
          related: [
            { label: "The ecosystem", href: "/semiconductors/ecosystem" },
            { label: "Design", href: "/semiconductors/design" },
          ],
        },
        {
          title: "Investment",
          track: "Investment",
          related: [
            { label: "Industry", href: "/industry" },
            { label: "The ecosystem", href: "/semiconductors/ecosystem" },
          ],
        },
        {
          title: "State Spotlight",
          track: "Regional",
          related: [{ label: "India ecosystem map", href: "/industry/map/india" }],
        },
        {
          title: "Leadership",
          track: "Leadership",
          related: [{ label: "Industry", href: "/industry" }],
        },
      ],
    },
    {
      label: "Day 3",
      date: "19 September 2026",
      iso: "2026-09-19",
      summary:
        "The event concludes on 19 September. The themes below are from the official agenda; see the official site for the full closing-day programme.",
      sessions: [
        {
          title: "Compound Semiconductors",
          track: "Compound semiconductors",
          description:
            "Materials beyond silicon — such as silicon carbide (SiC) and gallium nitride (GaN) — used for power and high-frequency devices.",
          related: [
            { label: "Materials", href: "/semiconductors/materials" },
            { label: "The ecosystem", href: "/semiconductors/ecosystem" },
          ],
        },
        {
          title: "Industry Synergy",
          track: "Industry",
          related: [
            { label: "Industry", href: "/industry" },
            { label: "The ecosystem", href: "/semiconductors/ecosystem" },
          ],
        },
        {
          title: "Investment",
          track: "Investment",
          related: [
            { label: "Industry", href: "/industry" },
            { label: "The ecosystem", href: "/semiconductors/ecosystem" },
          ],
        },
        {
          title: "Ease of Doing Business",
          track: "Policy",
          related: [{ label: "The ecosystem", href: "/semiconductors/ecosystem" }],
        },
      ],
    },
  ] as EventDay[],

  /**
   * Themes the event officially spans (per the official value-chain framing),
   * each connected to Semitree learning where a section exists. These are event
   * THEMES, not specific session titles.
   */
  themes: [
    {
      theme: "Semiconductor manufacturing",
      blurb: "How wafers become chips — the front-end process flow.",
      href: "/manufacturing",
      hrefLabel: "Manufacturing learning",
    },
    {
      theme: "Equipment",
      blurb: "The machines that run every process step.",
      href: "/semiconductors/equipment",
      hrefLabel: "Equipment learning",
    },
    {
      theme: "Materials",
      blurb: "What chips are built from, front-end to packaging.",
      href: "/semiconductors/materials",
      hrefLabel: "Materials learning",
    },
    {
      theme: "Advanced packaging",
      blurb: "Turning dies into systems — 2.5D, 3D, chiplets.",
      href: "/semiconductors/packaging",
      hrefLabel: "Packaging learning",
    },
    {
      theme: "Chip design",
      blurb: "How an idea becomes a chip — the design flow.",
      href: "/semiconductors/design",
      hrefLabel: "Design learning",
    },
    {
      theme: "Supply chain",
      blurb: "The end-to-end ecosystem that delivers a chip.",
      href: "/supply-chain",
      hrefLabel: "Supply chain explorer",
    },
    {
      theme: "Industry & ecosystem",
      blurb: "The companies and roles across the value chain.",
      href: "/semiconductors/ecosystem",
      hrefLabel: "The ecosystem",
    },
    {
      theme: "R&D, workforce, startups, AI & policy",
      blurb:
        "Cross-cutting themes shaping the industry — research, talent, new entrants, AI-driven demand, and government policy.",
    },
  ] as ThemeLink[],

  /** Semitree learning destinations to explore around the event (internal only). */
  learningLinks: [
    { label: "Manufacturing", href: "/manufacturing" },
    { label: "Equipment", href: "/semiconductors/equipment" },
    { label: "Materials", href: "/semiconductors/materials" },
    { label: "Packaging", href: "/semiconductors/packaging" },
    { label: "Design", href: "/semiconductors/design" },
    { label: "Supply chain", href: "/supply-chain" },
    { label: "The ecosystem", href: "/semiconductors/ecosystem" },
    { label: "Learn (all paths)", href: "/semiconductors/learn" },
  ] as EventLink[],

  /** Where Semitree's own coverage/analysis lives (existing content architecture). */
  coverageLinks: [
    { label: "Insights (news, explainers, research, analysis)", href: "/insights" },
    { label: "Industry directory", href: "/industry" },
    { label: "India ecosystem map", href: "/industry/map/india" },
  ] as EventLink[],

  indiaEcosystem: [
    "SEMICON India 2026 sits within the India Semiconductor Mission (ISM) — the Government of India's initiative (launched 2021, under MeitY) to build a domestic semiconductor and display ecosystem.",
    "Building that ecosystem spans fabs, assembly/test (ATMP/OSAT), design, and the supporting materials and equipment supply base.",
  ],

  officialResources: [
    { label: "SEMICON India — official website", href: "https://www.semiconindia.org/", external: true },
    { label: "India Semiconductor Mission (ISM)", href: "https://www.ism.gov.in/", external: true },
  ] as EventLink[],
};
