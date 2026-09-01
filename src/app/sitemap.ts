import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { TOOLS } from "@/lib/data/tools";
import { LESSONS } from "@/lib/data/lessons";
import { GLOSSARY } from "@/lib/data/glossary";

// Required for `output: "export"` — emit a static sitemap.xml.
export const dynamic = "force-static";

/**
 * Sitemap of all indexable routes. The design-preview route (/tools/preview) is
 * intentionally omitted (it duplicates a real tool and is noindex).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/tools", priority: 0.9 },
    { path: "/learn", priority: 0.9 },
    { path: "/concepts", priority: 0.8 },
    { path: "/resources", priority: 0.6 },
    { path: "/directory", priority: 0.6 },
    { path: "/blog", priority: 0.5 },
    { path: "/newsletter", priority: 0.5 },
    { path: "/hub", priority: 0.4 },
  ];

  const dynamicPaths: { path: string; priority: number }[] = [
    ...TOOLS.map((t) => ({ path: `/tools/${t.slug}`, priority: 0.8 })),
    ...LESSONS.map((l) => ({ path: `/learn/${l.slug}`, priority: 0.7 })),
    ...GLOSSARY.map((c) => ({ path: `/concepts/${c.slug}`, priority: 0.6 })),
  ];

  return [...staticPaths, ...dynamicPaths].map(({ path, priority }) => ({
    url: new URL(path, SITE.url).toString(),
    changeFrequency: "monthly",
    priority,
  }));
}
