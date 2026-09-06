import { describe, expect, it } from "vitest";
import {
  ARTICLES,
  getArticle,
  publishedArticles,
  featuredArticle,
  popularArticles,
  activeCategories,
  allTags,
  articlesByTag,
  relatedArticleObjects,
} from "./articles";
import { NEWSLETTER_ISSUES, getIssue, issuesNewestFirst } from "./newsletter";
import { getAuthor } from "./authors";
import { readingTimeMinutes } from "./types";
import { SEMI_LESSONS } from "@/lib/knowledge/semi-lessons";
import { SEMI_TOOLS } from "@/lib/data/semi-tools";
import { COMPANIES } from "@/lib/industry/companies";
import { RESEARCH_TOPICS } from "@/lib/research/registry";

const lessonSlugs = new Set(SEMI_LESSONS.map((l) => l.slug));
const toolSlugs = new Set(SEMI_TOOLS.map((t) => t.slug));
const companySlugs = new Set(COMPANIES.map((c) => c.slug));
const topicSlugs = new Set(RESEARCH_TOPICS.map((t) => t.slug));
const articleSlugs = new Set(ARTICLES.map((a) => a.slug));

describe("articles", () => {
  it("have unique slugs, a valid author, and required fields", () => {
    expect(new Set(ARTICLES.map((a) => a.slug)).size).toBe(ARTICLES.length);
    for (const a of ARTICLES) {
      expect(getAuthor(a.authorId)).toBeDefined();
      expect(a.title.length).toBeGreaterThan(0);
      expect(a.excerpt.length).toBeGreaterThan(0);
      expect(a.body.length).toBeGreaterThan(0);
      expect(/^\d{4}-\d{2}-\d{2}$/.test(a.publishedDate)).toBe(true);
      expect(readingTimeMinutes(a.body)).toBeGreaterThanOrEqual(1);
    }
  });

  it("all interlinks resolve to real Semitree entities", () => {
    for (const a of ARTICLES) {
      for (const c of a.relatedConcepts ?? []) expect(lessonSlugs.has(c.slug)).toBe(true);
      for (const t of a.relatedTools ?? []) expect(toolSlugs.has(t)).toBe(true);
      for (const co of a.relatedCompanies ?? []) expect(companySlugs.has(co)).toBe(true);
      for (const tech of a.relatedTechnologies ?? []) expect(topicSlugs.has(tech.slug)).toBe(true);
      for (const r of a.relatedArticles ?? []) expect(articleSlugs.has(r)).toBe(true);
    }
  });

  it("published articles are sorted newest first", () => {
    const dates = publishedArticles().map((a) => a.publishedDate);
    const sorted = [...dates].sort((x, y) => y.localeCompare(x));
    expect(dates).toEqual(sorted);
  });

  it("exposes featured, popular, categories, and tags", () => {
    expect(featuredArticle()).toBeDefined();
    expect(popularArticles().length).toBeGreaterThan(0);
    expect(activeCategories().length).toBeGreaterThan(0);
    const tags = allTags();
    expect(tags.length).toBeGreaterThan(0);
    // Every tag returns at least one article.
    for (const t of tags) expect(articlesByTag(t).length).toBeGreaterThan(0);
  });

  it("getArticle resolves and rejects unknowns; related articles resolve", () => {
    for (const a of ARTICLES) expect(getArticle(a.slug)?.title).toBe(a.title);
    expect(getArticle("nope")).toBeUndefined();
    const withRelated = ARTICLES.find((a) => (a.relatedArticles?.length ?? 0) > 0)!;
    expect(relatedArticleObjects(withRelated.slug).length).toBeGreaterThan(0);
  });
});

describe("newsletter", () => {
  it("issues have unique slugs/numbers and required fields", () => {
    expect(new Set(NEWSLETTER_ISSUES.map((i) => i.slug)).size).toBe(NEWSLETTER_ISSUES.length);
    expect(new Set(NEWSLETTER_ISSUES.map((i) => i.number)).size).toBe(NEWSLETTER_ISSUES.length);
    for (const i of NEWSLETTER_ISSUES) {
      expect(i.title.length).toBeGreaterThan(0);
      expect(i.summary.length).toBeGreaterThan(0);
      expect(i.body.length).toBeGreaterThan(0);
    }
  });

  it("issue interlinks resolve", () => {
    for (const i of NEWSLETTER_ISSUES) {
      for (const s of i.relatedArticles ?? []) expect(articleSlugs.has(s)).toBe(true);
      for (const s of i.relatedTools ?? []) expect(toolSlugs.has(s)).toBe(true);
      for (const s of i.relatedResearch ?? []) expect(topicSlugs.has(s)).toBe(true);
    }
  });

  it("issuesNewestFirst orders by number descending; getIssue works", () => {
    const nums = issuesNewestFirst().map((i) => i.number);
    expect(nums).toEqual([...nums].sort((a, b) => b - a));
    expect(getIssue(NEWSLETTER_ISSUES[0].slug)?.number).toBe(NEWSLETTER_ISSUES[0].number);
    expect(getIssue("nope")).toBeUndefined();
  });
});
