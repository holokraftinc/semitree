import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Alert } from "@/components/ui/Alert";
import { ResourcesExplorer } from "@/components/hub/ResourcesExplorer";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Resources",
  description:
    "Curated microfluidics resources: papers, books, courses, videos, software, and cheat sheets.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="max-w-2xl text-muted-foreground">
          Curated references for going deeper — organised by type. New categories
          fill in as verified entries are added.
        </p>
      </div>

      <Alert variant="info" title="Being curated">
        Each category is populated only with genuinely free or openly-licensed
        material, plus Semitree&rsquo;s own downloads. More is added over time.
      </Alert>

      <ResourcesExplorer />
    </Container>
  );
}
