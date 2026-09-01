import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export const metadata: Metadata = pageMeta({
  title: "Hub",
  description:
    "The Semitree hub: resources, directory, blog, and newsletter for the microfluidics field.",
  path: "/hub",
});

const SECTIONS = [
  {
    href: "/resources",
    title: "Resources",
    description: "Standard texts, courses, and references to go deeper.",
  },
  {
    href: "/directory",
    title: "Directory",
    description: "Foundries, suppliers, software, and services.",
  },
  {
    href: "/blog",
    title: "Blog",
    description: "How-to guides, comparisons, and case studies.",
  },
  {
    href: "/newsletter",
    title: "Newsletter",
    description: "The weekly microfluidics roundup.",
  },
] as const;

export default function HubPage() {
  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Hub" }]} />
        <h1 className="text-3xl font-bold tracking-tight">Hub</h1>
        <p className="max-w-2xl text-muted-foreground">
          The resource and audience layer around the tools and curriculum.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Card
            key={section.href}
            className="relative transition-shadow hover:shadow-card-hover"
          >
            <CardHeader>
              <CardTitle as="h2">
                <Link
                  href={section.href}
                  className="rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:text-brand"
                >
                  {section.title}
                </Link>
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Container>
  );
}
