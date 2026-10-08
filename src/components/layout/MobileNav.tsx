"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { HOME_ITEM, PRIMARY_NAV, SECONDARY_NAV, type NavItem } from "./nav-items";

/**
 * Mobile / tablet navigation: a drill-down panel (menu → section → page), not a
 * shrunk desktop nav. The root level lists the primary sections; tapping a
 * section with sub-items slides to that section's items with an obvious Back
 * control. Escape and route changes close it; body scroll is locked while open.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<NavItem | null>(null);
  const pathname = usePathname();

  // Close + reset the drill-down on navigation.
  useEffect(() => {
    setOpen(false);
    setSection(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (section) setSection(null);
      else setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, section]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const rootLink = (item: NavItem) => {
    const active = isActive(item.href);
    if (item.groups) {
      return (
        <li key={item.href}>
          <button
            type="button"
            onClick={() => setSection(item)}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "bg-muted text-foreground" : "text-foreground hover:bg-muted/60",
            )}
          >
            {item.label}
            <svg viewBox="0 0 20 20" className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path d="M8 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </li>
      );
    }
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "block rounded-md px-3 py-2.5 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active ? "bg-muted text-foreground" : "text-foreground hover:bg-muted/60",
          )}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => {
          setOpen((v) => !v);
          setSection(null);
        }}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 top-16 z-30 bg-foreground/20 animate-fade-in" aria-hidden="true" onClick={() => setOpen(false)} />
          <nav
            id="mobile-nav-panel"
            aria-label="Primary"
            className="fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-background p-4 shadow-card animate-fade-in"
          >
            {section ? (
              <div>
                <button
                  type="button"
                  onClick={() => setSection(null)}
                  className="mb-2 flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                    <path d="M12 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back
                </button>
                <p className="px-3 pb-2 text-lg font-semibold tracking-tight">{section.label}</p>

                {section.groups!.map((group) => (
                  <div key={group.title} className="mb-2">
                    <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.title}</p>
                    <ul className="space-y-1">
                      {group.items.map((entry) =>
                        entry.href && !entry.comingSoon ? (
                          <li key={entry.label}>
                            <Link
                              href={entry.href}
                              aria-current={isActive(entry.href.split("?")[0]) ? "page" : undefined}
                              className={cn(
                                "block rounded-md px-3 py-2.5 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                isActive(entry.href.split("?")[0]) ? "bg-muted text-foreground" : "text-foreground hover:bg-muted/60",
                              )}
                            >
                              {entry.label}
                            </Link>
                          </li>
                        ) : (
                          <li key={entry.label} className="flex items-center justify-between px-3 py-2.5">
                            <span className="text-base text-muted-foreground/70">{entry.label}</span>
                            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Soon</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                ))}

                <Link href={section.href} className="mt-1 block rounded-md px-3 py-2.5 text-base font-semibold text-brand hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  All of {section.label} →
                </Link>
              </div>
            ) : (
              <>
                <ul className="space-y-1">
                  {rootLink(HOME_ITEM)}
                  {PRIMARY_NAV.map(rootLink)}
                </ul>
                <p className="px-3 pb-1 pt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">More</p>
                <ul className="space-y-1">{SECONDARY_NAV.map(rootLink)}</ul>
              </>
            )}
          </nav>
        </>
      )}
    </div>
  );
}
