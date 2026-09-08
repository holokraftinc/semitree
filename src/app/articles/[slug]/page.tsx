import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleBody } from "@/components/content/ArticleBody";
import { ArticleCard, accentGradient } from "@/components/content/ArticleCard";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import { ButtonLink } from "@/components/ui/Button";
import { ARTICLES, getArticle, relatedArticleObjects } from "@/lib/content/articles";
import { getAuthor } from "@/lib/content/authors";
import { CONTENT_TYPE_LABELS, readingTimeMinutes } from "@/lib/content/types";
import { getCompany } from "@/lib/industry/companies";
import { getSemiTool } from "@/lib/data/semi-tools";
import { articleMeta, jsonLdGraph, breadcrumbLd, articleLd } from "@/lib/seo";
import { cn } from "@/lib/utils/cn";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return articleMeta({ title: "Article", description: "", path: "/insights" });
  const author = getAuthor(a.authorId);
  return articleMeta({
    title: a.seo?.title ?? a.title,
    description: a.seo?.description ?? a.excerpt,
    path: a.seo?.canonical ?? `/articles/${a.slug}`,
    publishedTime: a.publishedDate,
    modifiedTime: a.updatedDate,
    authors: author ? [author.name] : undefined,
    tags: a.tags,
  });
}

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const author = getAuthor(article.authorId);
  const related = relatedArticleObjects(article.slug);
  const path = `/articles/${article.slug}`;

  const topic = article.relatedTechnologies?.[0];
  const firstTool = article.relatedTools?.[0] ? getSemiTool(article.relatedTools[0]) : undefined;

  return (
    <Container className="py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: article.title, path },
          ]),
          articleLd({
            headline: article.title,
            description: article.excerpt,
            path,
            datePublished: article.publishedDate,
            dateModified: article.updatedDate,
            authorName: author?.name ?? "Semitree",
            section: CONTENT_TYPE_LABELS[article.type],
            keywords: article.tags,
          }),
        ])}
      />
      <TrackView event="article_opened" payload={{ article: article.slug, type: article.type }} />

      <article className="mx-auto max-w-3xl space-y-8">
        {/* Hero */}
        <div className={cn("-mx-4 h-36 rounded-none bg-gradient-to-br sm:mx-0 sm:rounded-2xl", accentGradient(article.accent))} />

        <header className="space-y-3">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Insights", href: "/insights" },
              { label: article.title },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-brand/10 px-2 py-0.5 font-medium text-brand">
              {CONTENT_TYPE_LABELS[article.type]}
            </span>
            <span className="text-muted-foreground">{readingTimeMinutes(article.body)} min read</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>
          {article.subtitle && <p className="text-lg text-muted-foreground">{article.subtitle}</p>}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>By {author?.name ?? "Semitree"}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.publishedDate}>{formatDate(article.publishedDate)}</time>
            {article.updatedDate && (
              <>
                <span aria-hidden="true">·</span>
                <span>Updated {formatDate(article.updatedDate)}</span>
              </>
            )}
          </div>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {article.tags.map((t) => (
                <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">#{t}</span>
              ))}
            </div>
          )}
        </header>

        {/* Body */}
        <ArticleBody blocks={article.body} />

        {/* Related entities */}
        <section aria-labelledby="related" className="space-y-4 border-t border-border pt-6">
          <h2 id="related" className="text-lg font-semibold tracking-tight">Related</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {article.relatedConcepts && article.relatedConcepts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Concepts</h3>
                <ul className="space-y-1.5">
                  {article.relatedConcepts.map((c) => (
                    <li key={c.slug}><Link href={`/semiconductors/learn/${c.slug}`} className={linkClass}>{c.label} →</Link></li>
                  ))}
                </ul>
              </div>
            )}
            {article.relatedTechnologies && article.relatedTechnologies.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Technologies</h3>
                <ul className="space-y-1.5">
                  {article.relatedTechnologies.map((t) => (
                    <li key={t.slug}><Link href={`/research/topics/${t.slug}`} className={linkClass}>{t.label} →</Link></li>
                  ))}
                </ul>
              </div>
            )}
            {article.relatedTools && article.relatedTools.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Tools</h3>
                <ul className="space-y-1.5">
                  {article.relatedTools.map((tslug) => {
                    const tool = getSemiTool(tslug);
                    if (!tool) return null;
                    return <li key={tslug}><Link href={`/semiconductors/tools/${tslug}`} className={linkClass}>{tool.name} →</Link></li>;
                  })}
                </ul>
              </div>
            )}
            {article.relatedCompanies && article.relatedCompanies.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Companies</h3>
                <ul className="space-y-1.5">
                  {article.relatedCompanies.map((cslug) => {
                    const co = getCompany(cslug);
                    if (!co) return null;
                    return <li key={cslug}><Link href={`/industry/companies/${cslug}`} className={linkClass}>{co.name} →</Link></li>;
                  })}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Engagement */}
        <section aria-label="Keep exploring" className="rounded-xl border border-border bg-muted/30 p-5">
          <p className="text-sm font-semibold tracking-tight">Keep exploring</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <ButtonLink href={topic ? `/research/topics/${topic.slug}` : "/research"} variant="outline" size="sm">
              {topic ? `Explore: ${topic.label}` : "Explore research"}
            </ButtonLink>
            <ButtonLink href={firstTool ? `/semiconductors/tools/${firstTool.slug}` : "/semiconductors/tools"} variant="outline" size="sm">
              {firstTool ? `Try: ${firstTool.name}` : "Try the tools"}
            </ButtonLink>
            <ButtonLink href="/industry/companies" variant="outline" size="sm">Explore companies</ButtonLink>
            <ButtonLink href="/newsletter" variant="primary" size="sm">Subscribe to the newsletter</ButtonLink>
          </div>
        </section>

        {/* Read next */}
        {related.length > 0 && (
          <section aria-labelledby="read-next" className="space-y-4">
            <h2 id="read-next" className="text-lg font-semibold tracking-tight">Read next</h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <li key={a.slug}><ArticleCard article={a} /></li>
              ))}
            </ul>
          </section>
        )}

        <NewsletterSignup />
      </article>
    </Container>
  );
}
