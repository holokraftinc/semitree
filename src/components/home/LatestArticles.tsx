import { Section } from "@/components/ui/Section";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { ArticleCard } from "@/components/content/ArticleCard";
import { latestArticles } from "@/lib/content/articles";

/** Latest articles from the content platform. */
export function LatestArticles() {
  const articles = latestArticles(3);
  return (
    <Section
      headingId="latest-articles"
      title="Latest articles"
      description="Explainers, deep dives, tutorials, and analysis."
      action={{ label: "Visit Insights", href: "/insights" }}
    >
      {articles.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="First articles coming soon"
          description="Subscribe to the newsletter to get them as they publish."
          action={<ButtonLink href="/newsletter">Get the newsletter</ButtonLink>}
        />
      )}
    </Section>
  );
}
