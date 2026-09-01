/** Navigation model, shared by the desktop and mobile nav and the footer. */

export type NavItem = { href: string; label: string };

/** Primary navigation. Home is reached via the wordmark, so it's separate. */
export const PRIMARY_NAV: NavItem[] = [
  { href: "/tools", label: "Tools" },
  { href: "/learn", label: "Learn" },
  { href: "/concepts", label: "Concepts" },
  { href: "/resources", label: "Resources" },
  { href: "/directory", label: "Directory" },
];

/** Secondary / future sections — surfaced in the mobile menu and footer. */
export const SECONDARY_NAV: NavItem[] = [
  { href: "/blog", label: "Blog" },
  { href: "/newsletter", label: "Newsletter" },
];

/** Home entry, used where an explicit Home link helps (mobile menu). */
export const HOME_ITEM: NavItem = { href: "/", label: "Home" };
