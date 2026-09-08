import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { TOOLS } from "@/lib/data/tools";
import { LESSONS } from "@/lib/data/lessons";
import { GLOSSARY } from "@/lib/data/glossary";
import { SEMI_LESSONS } from "@/lib/knowledge/semi-lessons";
import { SEMI_TOOLS } from "@/lib/data/semi-tools";
import { MFG_PROCESSES } from "@/lib/knowledge/manufacturing";
import { COMPANIES } from "@/lib/industry/companies";
import { SUPPLY_STAGES } from "@/lib/knowledge/supply-chain";
import { RESEARCH_TOPICS } from "@/lib/research/registry";
import { ARTICLES } from "@/lib/content/articles";
import { NEWSLETTER_ISSUES } from "@/lib/content/newsletter";
import { CMS_TYPES } from "@/lib/wordpress/config";

// Required for `output: "export"` — emit a static sitemap.xml.
export const dynamic = "force-static";

/**
 * Sitemap of all indexable routes. The design-preview route (/tools/preview) is
 * intentionally omitted (it duplicates a real tool and is noindex).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/explore", priority: 0.9 },
    { path: "/semiconductors/learn", priority: 0.9 },
    { path: "/semiconductors/tools", priority: 0.9 },
    { path: "/manufacturing", priority: 0.9 },
    { path: "/supply-chain", priority: 0.9 },
    { path: "/tools", priority: 0.9 },
    { path: "/learn", priority: 0.9 },
    { path: "/learn/microfluidics", priority: 0.8 },
    { path: "/concepts", priority: 0.8 },
    { path: "/industry", priority: 0.7 },
    { path: "/industry/companies", priority: 0.8 },
    { path: "/industry/map", priority: 0.7 },
    { path: "/industry/map/india", priority: 0.7 },
    { path: "/research", priority: 0.7 },
    { path: "/research/topics", priority: 0.7 },
    { path: "/resources", priority: 0.6 },
    { path: "/directory", priority: 0.6 },
    { path: "/insights", priority: 0.7 },
    ...CMS_TYPES.map((t) => ({ path: `/insights/${t.key}`, priority: 0.5 })),
    { path: "/newsletter", priority: 0.5 },
    { path: "/hub", priority: 0.4 },
  ];

  const dynamicPaths: { path: string; priority: number }[] = [
    ...TOOLS.map((t) => ({ path: `/tools/${t.slug}`, priority: 0.8 })),
    ...LESSONS.map((l) => ({ path: `/learn/${l.slug}`, priority: 0.7 })),
    ...GLOSSARY.map((c) => ({ path: `/concepts/${c.slug}`, priority: 0.6 })),
    ...SEMI_LESSONS.map((l) => ({
      path: `/semiconductors/learn/${l.slug}`,
      priority: 0.7,
    })),
    ...SEMI_TOOLS.map((t) => ({
      path: `/semiconductors/tools/${t.slug}`,
      priority: 0.8,
    })),
    ...MFG_PROCESSES.map((p) => ({
      path: `/manufacturing/${p.slug}`,
      priority: 0.7,
    })),
    ...COMPANIES.map((c) => ({
      path: `/industry/companies/${c.slug}`,
      priority: 0.6,
    })),
    ...SUPPLY_STAGES.map((s) => ({
      path: `/supply-chain/${s.slug}`,
      priority: 0.7,
    })),
    ...RESEARCH_TOPICS.map((t) => ({
      path: `/research/topics/${t.slug}`,
      priority: 0.6,
    })),
    ...ARTICLES.map((a) => ({ path: `/articles/${a.slug}`, priority: 0.7 })),
    ...NEWSLETTER_ISSUES.map((i) => ({ path: `/newsletter/${i.slug}`, priority: 0.5 })),
  ];

  return [...staticPaths, ...dynamicPaths].map(({ path, priority }) => ({
    url: new URL(path, SITE.url).toString(),
    changeFrequency: "monthly",
    priority,
  }));
}
