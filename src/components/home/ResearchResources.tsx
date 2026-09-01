import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { sampleResources } from "@/lib/data/samples";

const KIND_LABELS: Record<string, string> = {
  book: "Book",
  course: "Course",
  video: "Video",
  paper: "Paper",
  article: "Article",
  cheatsheet: "Cheat sheet",
};

export function ResearchResources() {
  return (
    <Section
      headingId="research-resources"
      title="Research resources"
      description="Curated texts and references to go deeper. Verify editions before relying on them."
      action={{ label: "All resources", href: "/resources" }}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sampleResources.map((resource) => (
          <Card key={resource.slug} className="flex h-full flex-col">
            <CardHeader>
              <Badge variant="neutral" className="w-fit">
                {KIND_LABELS[resource.kind] ?? resource.kind}
              </Badge>
              <CardTitle className="mt-2">{resource.title}</CardTitle>
              {resource.author && (
                <CardDescription>{resource.author}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="mt-auto">
              <p className="text-sm text-muted-foreground">
                {resource.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
