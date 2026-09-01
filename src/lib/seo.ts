/**
 * SEO helpers: site config, per-page metadata, and JSON-LD structured data.
 *
 * The canonical base URL is env-driven. Until a production domain is set via
 * NEXT_PUBLIC_SITE_URL, it falls back to a RESERVED placeholder
 * (`semitree.example.com`, under the RFC-2606 example.com) so canonicals are
 * absolute and valid without asserting a real domain.
 */
import type { Metadata } from "next";

export const SITE = {
  name: "Semitree",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://semitree.example.com",
  description:
    "Learn microfluidics and design your chip in the same place. Free calculators, a zero-to-competent curriculum, and a resource hub.",
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}

/** Build per-page metadata with canonical + OpenGraph + Twitter. */
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "en_US",
      url: path,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* --------------------------- JSON-LD structured data -------------------- */

type LdNode = Record<string, unknown>;

/** Wrap one or more schema.org nodes in a single @graph document. */
export function jsonLdGraph(nodes: LdNode[]): LdNode {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function breadcrumbLd(items: { name: string; path: string }[]): LdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webSiteLd(): LdNode {
  return {
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  };
}

export function organizationLd(): LdNode {
  return { "@type": "Organization", name: SITE.name, url: SITE.url };
}

export function softwareApplicationLd(tool: {
  name: string;
  description: string;
  path: string;
}): LdNode {
  return {
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: absoluteUrl(tool.path),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
  };
}

export function definedTermLd(concept: {
  name: string;
  description: string;
  path: string;
}): LdNode {
  return {
    "@type": "DefinedTerm",
    name: concept.name,
    description: concept.description,
    url: absoluteUrl(concept.path),
    inDefinedTermSet: absoluteUrl("/concepts"),
  };
}

export function learningResourceLd(lesson: {
  name: string;
  description: string;
  path: string;
  level: number;
}): LdNode {
  return {
    "@type": "LearningResource",
    name: lesson.name,
    description: lesson.description,
    url: absoluteUrl(lesson.path),
    learningResourceType: "lesson",
    educationalLevel: `Level ${lesson.level}`,
    isAccessibleForFree: true,
  };
}
