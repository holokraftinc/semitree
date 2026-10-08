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
import { articleLinks } from "@/lib/content/article-links";
import { getAuthor } from "@/lib/content/authors";
import { CONTENT_TYPE_LABELS, readingTimeMinutes, type ArticleAnalysis } from "@/lib/content/types";
import { getSemiTool } from "@/lib/data/semi-tools";
import { RelatedRail, type RelatedGroup } from "@/components/platform/RelatedRail";
import { articleMeta, jsonLdGraph, breadcrumbLd, articleLd } from "@/lib/seo";
import { cn } from "@/lib/utils/cn";

const ANALYSIS_FIELDS: { key: keyof ArticleAnalysis; label: string }[] = [
  { key: "whatHappened", label: "What happened?" },
  { key: "whyItMatters", label: "Why does it matter?" },
  { key: "technology", label: "What technology is involved?" },
  { key: "valueChain", label: "Where it fits in the value chain" },
  { key: "whoIsInvolved", label: "Who is involved?" },
  { key: "suppliers", label: "What suppliers are required?" },
  { key: "indiaCapability", label: "What India can do today" },
  { key: "whatsMissing", label: "What remains missing?" },
  { key: "whatCouldChange", label: "What could change?" },
  { key: "watchNext", label: "What to watch next" },
];

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

  // Resolve all ecosystem connections, then group them for the rail + sidebar.
  const links = articleLinks(article);
  const groups: RelatedGroup[] = [
    { title: "Companies", links: links.companies },
    { title: "Technologies", links: links.technologies },
    { title: "Supply-chain stage", links: links.stages },
    { title: "India states", links: links.states },
    { title: "Projects", links: links.projects },
    { title: "Tools", links: links.tools },
    { title: "Related insights", links: links.insights },
  ].filter((g) => g.links.length > 0);

  const analysis = article.analysis;
  const analysisItems = analysis
    ? ANALYSIS_FIELDS.map((f) => ({ label: f.label, text: analysis[f.key] })).filter(
        (x): x is { label: string; text: string } => Boolean(x.text),
      )
    : [];

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

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <article className="min-w-0 max-w-3xl space-y-8">
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

        {/* The analysis — intelligence layer (only when authored) */}
        {analysisItems.length > 0 && (
          <section aria-labelledby="analysis" className="space-y-4 rounded-2xl border border-border bg-muted/30 p-6">
            <h2 id="analysis" className="text-lg font-semibold tracking-tight">The analysis</h2>
            <dl className="space-y-4">
              {analysisItems.map((it) => (
                <div key={it.label}>
                  <dt className="text-sm font-semibold text-foreground">{it.label}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{it.text}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Ecosystem connections — inline on mobile (sidebar handles desktop) */}
        <div className="lg:hidden">
          <RelatedRail groups={groups} />
        </div>

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

      {/* Desktop sidebar: connected entities */}
      {groups.length > 0 && (
        <aside className="hidden lg:block" aria-label="Connected to the ecosystem">
          <div className="sticky top-24 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Connected to the ecosystem
            </p>
            {groups.map((g) => (
              <div key={g.title} className="space-y-2">
                <h2 className="text-sm font-semibold tracking-tight">{g.title}</h2>
                <ul className="space-y-1.5">
                  {g.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className={linkClass}>{l.label} →</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="border-t border-border pt-4">
              <Link href="/opportunities" className={linkClass}>Ecosystem opportunities →</Link>
            </div>
          </div>
        </aside>
      )}
      </div>
    </Container>
  );
}
