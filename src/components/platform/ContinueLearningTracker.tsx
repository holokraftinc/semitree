"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getTool } from "@/lib/data/tools";
import { getLesson } from "@/lib/data/lessons";
import { getConcept } from "@/lib/data/glossary";
import { getSemiLesson } from "@/lib/knowledge/semi-lessons";
import { recordRecent } from "@/lib/continue-learning";

/**
 * Records the current lesson/tool/concept page to local history so the homepage
 * can offer "Continue where you left off". Mounted once in the root layout;
 * no per-page wiring. Login-free (localStorage only).
 */
export function ContinueLearningTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);

    // Semiconductor lessons: /semiconductors/learn/<slug>
    if (parts.length === 3 && parts[0] === "semiconductors" && parts[1] === "learn") {
      const sl = getSemiLesson(parts[2]);
      if (sl) {
        recordRecent({
          type: "lesson",
          slug: parts[2],
          title: sl.title,
          href: `/semiconductors/learn/${parts[2]}`,
        });
      }
      return;
    }

    if (parts.length !== 2) return; // only /section/slug pages
    const [section, slug] = parts;

    if (section === "tools") {
      const t = getTool(slug);
      if (t) recordRecent({ type: "tool", slug, title: t.name, href: `/tools/${slug}` });
    } else if (section === "learn") {
      const l = getLesson(slug);
      if (l) recordRecent({ type: "lesson", slug, title: l.title, href: `/learn/${slug}` });
    } else if (section === "concepts") {
      const c = getConcept(slug);
      if (c) recordRecent({ type: "concept", slug, title: c.title, href: `/concepts/${slug}` });
    }
  }, [pathname]);

  return null;
}
