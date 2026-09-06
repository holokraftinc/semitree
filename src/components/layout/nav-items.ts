/** Navigation model, shared by the desktop and mobile nav and the footer. */

export type NavItem = { href: string; label: string };

/** Primary navigation. Home is reached via the wordmark, so it's separate. */
export const PRIMARY_NAV: NavItem[] = [
  { href: "/explore", label: "Explore" },
  { href: "/learn", label: "Learn" },
  { href: "/tools", label: "Tools" },
  { href: "/industry", label: "Industry" },
  { href: "/research", label: "Research" },
  { href: "/resources", label: "Resources" },
];

/** Secondary / future sections — surfaced in the mobile menu and footer. */
export const SECONDARY_NAV: NavItem[] = [
  { href: "/blog", label: "Blog" },
  { href: "/newsletter", label: "Newsletter" },
];

/** Home entry, used where an explicit Home link helps (mobile menu). */
export const HOME_ITEM: NavItem = { href: "/", label: "Home" };
