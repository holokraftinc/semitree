/**
 * Navigation model, shared by the desktop and mobile nav and the footer.
 *
 * The primary sections come from the information-architecture module
 * (src/lib/data/ia.ts) so the nav and the section-hub pages stay in sync. Only
 * `available` sub-items are offered as dropdown children (never a dead link);
 * each section's full hierarchy — including `coming-soon` items — lives on its
 * hub page.
 */
import { IA_SECTIONS, IA_UTILITIES } from "@/lib/data/ia";

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

// Sections that benefit from a dropdown of their key existing destinations.
// Others are plain top-level links to their hub (which lists the full hierarchy).
const DROPDOWN_SECTIONS = new Set(["explore", "industry"]);
const MAX_CHILDREN = 6;

/** Primary navigation, derived from the IA. Home is reached via the wordmark. */
export const PRIMARY_NAV: NavItem[] = IA_SECTIONS.map((section) => {
  const item: NavItem = { href: section.href, label: section.label };
  if (DROPDOWN_SECTIONS.has(section.key)) {
    const children = section.items
      .filter((i) => i.status === "available" && i.href)
      .slice(0, MAX_CHILDREN)
      .map((i, idx) => ({ href: i.href!, label: i.label, description: i.description, primary: idx === 0 }));
    if (children.length > 0) item.children = children;
  }
  return item;
});

/** Secondary / utility sections — surfaced in the mobile menu and footer. */
export const SECONDARY_NAV: NavItem[] = IA_UTILITIES.filter((i) => i.href).map((i) => ({
  href: i.href!,
  label: i.label,
}));

/** Home entry, used where an explicit Home link helps (mobile menu). */
export const HOME_ITEM: NavItem = { href: "/", label: "Home" };
