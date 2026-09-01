import type { Resource } from "@/lib/data/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrackedLink } from "@/components/analytics/TrackedLink";

const KIND_LABELS: Record<string, string> = {
  paper: "Paper",
  book: "Book",
  course: "Course",
  video: "Video",
  software: "Software",
  cheatsheet: "Cheat sheet",
  article: "Article",
};

/** A single resource. Links out only when a real URL is present. */
export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <Badge variant="neutral" className="w-fit">
          {KIND_LABELS[resource.kind] ?? resource.kind}
        </Badge>
        <CardTitle className="mt-2">{resource.title}</CardTitle>
        {resource.author && <CardDescription>{resource.author}</CardDescription>}
      </CardHeader>
      <CardContent className="mt-auto space-y-2">
        {resource.description && (
          <p className="text-sm text-muted-foreground">{resource.description}</p>
        )}
        {resource.url ? (
          <TrackedLink
            href={resource.url}
            external
            event="resource_clicked"
            payload={{ resource: resource.slug, kind: resource.kind }}
            className="text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Visit ↗
          </TrackedLink>
        ) : (
          <p className="text-xs italic text-muted-foreground">
            Verify the current edition.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
