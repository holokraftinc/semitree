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
  title: "Insights",
  description:
    "What's happening in semiconductors — and why it matters. News, India updates, explainers, deep dives, analysis, and research, each connected to the companies, technologies, and supply-chain stages behind it.",
  path: "/insights",
});

export default function InsightsPage() {
  const featured = featuredArticle();
  const popular = popularArticles(4).filter((a) => a.slug !== featured?.slug);

  return (
    <Container className="space-y-12 py-10">
      <TrackView event="blog_opened" payload={{}} />

      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights" }]} />
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="max-w-2xl text-muted-foreground">
          What&apos;s happening in semiconductors — and why it matters. Every piece
          connects to the companies, technologies, and supply-chain stages behind
          it, so you can read the story and then explore the ecosystem around it.
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Featured:{" "}
          <Link href="/events/semicon-india-2026" className="font-medium text-brand hover:underline">
            Semitree&rsquo;s SEMICON India 2026 coverage &amp; learning hub
          </Link>
          .
        </p>
      </div>

      {/* Featured + popular (editorial) */}
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

      {/* Latest published updates (live editorial feed). Silent until present. */}
      <CmsList type="articles" perPage={6} silentWhenEmpty heading="Latest updates" />

      {/* All editorial pieces: category + search + tags */}
      <section aria-labelledby="all" className="space-y-5">
        <h2 id="all" className="text-lg font-semibold tracking-tight">Browse by category</h2>
        <BlogExplorer />
      </section>

      <NewsletterSignup />
    </Container>
  );
}
