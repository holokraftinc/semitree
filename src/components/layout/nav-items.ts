/**
 * Navigation model, shared by the desktop nav, mega menu, mobile nav, and
 * footer. Derived from the information architecture (src/lib/data/ia.ts) so the
 * nav and the section-hub pages stay in sync.
 *
 * Sections that declare a grouped `menu` in the IA render as a desktop mega menu
 * and a drill-down mobile panel. Available items are links; coming-soon items
 * are shown (so the full structure is visible) but are never dead links.
 */
import { IA_SECTIONS, IA_UTILITIES } from "@/lib/data/ia";

export type NavMegaItem = {
  label: string;
  /** Present for available items; absent for coming-soon. */
  href?: string;
  description?: string;
  comingSoon?: boolean;
};

export type NavGroup = {
  title: string;
  items: NavMegaItem[];
};

export type NavItem = {
  href: string;
  label: string;
  /** When present, the item renders as a mega menu (desktop) / drill-down (mobile). */
  groups?: NavGroup[];
};

/** Primary navigation, derived from the IA. Home is reached via the wordmark. */
export const PRIMARY_NAV: NavItem[] = IA_SECTIONS.map((section) => {
  const item: NavItem = { href: section.href, label: section.label };
  if (section.menu && section.menu.length > 0) {
    item.groups = section.menu.map((g) => ({
      title: g.title,
      items: g.items.map((i) => ({
        label: i.label,
        href: i.href,
        description: i.description,
        comingSoon: i.status === "coming-soon",
      })),
    }));
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
