import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleCard } from "@/components/content/ArticleCard";
import { BlogExplorer } from "@/components/content/BlogExplorer";
import { CmsList } from "@/components/cms/CmsList";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { TrackView } from "@/components/analytics/TrackView";
import { featuredArticle, popularArticles } from "@/lib/content/articles";

export const metadata: Metadata = pageMeta({
  title: "Blog",
  description:
    "Explainers, technology deep dives, tutorials, and analysis from Semitree — the semiconductor knowledge, tools, and research platform.",
  path: "/blog",
});

export default function BlogPage() {
  const featured = featuredArticle();
  const popular = popularArticles(4).filter((a) => a.slug !== featured?.slug);

  return (
    <Container className="space-y-12 py-10">
      <TrackView event="blog_opened" payload={{}} />

      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="max-w-2xl text-muted-foreground">
          Explainers, technology deep dives, tutorials, and analysis — all
          cross-linked to Semitree&apos;s lessons, tools, companies, and research.{" "}
          <Link href="/cms" className="font-medium text-brand hover:underline">
            Visit the newsroom →
          </Link>
        </p>
      </div>

      {/* Featured + popular */}
      {featured && (
        <section aria-labelledby="featured" className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 id="featured" className="sr-only">Featured</h2>
            <ArticleCard article={featured} featured />
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Popular</h2>
            <ul className="space-y-3">
              {popular.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="group block rounded-lg border border-border bg-card p-3 transition-colors hover:border-brand/50"
                  >
                    <span className="block text-sm font-medium tracking-tight group-hover:text-brand">{a.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{a.subtitle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* All articles: search + category + tags */}
      <section aria-labelledby="all" className="space-y-5">
        <h2 id="all" className="text-lg font-semibold tracking-tight">All articles</h2>
        <BlogExplorer />
      </section>

      {/* Live from the CMS — silent until WordPress has published content. */}
      <CmsList type="articles" perPage={6} silentWhenEmpty heading="Live from the newsroom" />

      <NewsletterSignup />
    </Container>
  );
}
