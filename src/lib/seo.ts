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
    "Semitree — a knowledge, tools, and research platform for the semiconductor industry. Learn the concepts, explore the technology, use the tools, and discover the industry. Includes a full microfluidics domain.",
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

/** Per-page metadata for an article (OpenGraph type "article" + timestamps). */
export function articleMeta({
  title,
  description,
  path,
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: {
  title: string;
  description: string;
  path: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      siteName: SITE.name,
      locale: "en_US",
      url: path,
      title,
      description,
      publishedTime,
      modifiedTime,
      authors,
      tags,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function articleLd(article: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  section?: string;
  keywords?: string[];
}): LdNode {
  return {
    "@type": "BlogPosting",
    headline: article.headline,
    description: article.description,
    mainEntityOfPage: absoluteUrl(article.path),
    url: absoluteUrl(article.path),
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: { "@type": "Organization", name: article.authorName, url: SITE.url },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    ...(article.section ? { articleSection: article.section } : {}),
    ...(article.keywords ? { keywords: article.keywords.join(", ") } : {}),
    isAccessibleForFree: true,
  };
}
