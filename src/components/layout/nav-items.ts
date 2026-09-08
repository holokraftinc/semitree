/** Navigation model, shared by the desktop and mobile nav and the footer. */

export type NavChild = {
  href: string;
  label: string;
  description?: string;
  /** Marks the visually-dominant option in a menu. */
  primary?: boolean;
};

export type NavItem = {
  href: string;
  label: string;
  /** When present, the item renders as a dropdown (desktop) / submenu (mobile). */
  children?: NavChild[];
};

/**
 * Learn is a hub across knowledge domains. Semiconductors is the primary
 * learning domain; Microfluidics is a specialized secondary domain. Add future
 * domains here — the nav renders them automatically.
 */
export const LEARN_DOMAINS: NavChild[] = [
  {
    href: "/semiconductors/learn",
    label: "Semiconductors",
    description:
      "Concepts, chip design, manufacturing, packaging, materials and the semiconductor ecosystem.",
    primary: true,
  },
  {
    href: "/learn/microfluidics",
    label: "Microfluidics",
    description: "Fundamentals, lab-on-chip systems, devices and applications.",
  },
];

/** Primary navigation. Home is reached via the wordmark, so it's separate. */
export const PRIMARY_NAV: NavItem[] = [
  { href: "/explore", label: "Explore" },
  { href: "/learn", label: "Learn", children: LEARN_DOMAINS },
  { href: "/tools", label: "Tools" },
  { href: "/insights", label: "Insights" },
  { href: "/industry", label: "Industry" },
  { href: "/research", label: "Research" },
  { href: "/resources", label: "Resources" },
];

/** Secondary / future sections — surfaced in the mobile menu and footer. */
export const SECONDARY_NAV: NavItem[] = [
  { href: "/newsletter", label: "Newsletter" },
];

/** Home entry, used where an explicit Home link helps (mobile menu). */
export const HOME_ITEM: NavItem = { href: "/", label: "Home" };
