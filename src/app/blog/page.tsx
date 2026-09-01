import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = pageMeta({
  title: "Blog",
  description:
    "How-to guides, comparisons, and case studies from the Semitree microfluidics blog — coming soon.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="max-w-2xl text-muted-foreground">
          How-to guides, “X vs Y” comparisons, case studies, and news
          commentary. Posts start once the core tools and lessons are live.
        </p>
      </div>

      <EmptyState
        title="No posts yet"
        description="The blog will publish on a steady cadence. Subscribe to the newsletter to get new posts as they land."
        action={<ButtonLink href="/newsletter">Get the newsletter</ButtonLink>}
      />
    </Container>
  );
}
