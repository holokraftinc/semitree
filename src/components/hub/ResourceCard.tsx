import type { Resource } from "@/lib/data/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { cn } from "@/lib/utils/cn";

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
      <CardContent className="mt-auto space-y-3">
        {resource.description && (
          <p className="text-sm text-muted-foreground">{resource.description}</p>
        )}

        {resource.fileUrl && (
          <TrackedLink
            href={resource.fileUrl}
            download
            event="resource_clicked"
            payload={{ resource: resource.slug, kind: resource.kind }}
            className={cn(buttonClasses("primary", "sm"), "w-fit gap-1.5")}
            aria-label={`Download ${resource.title} (PDF)`}
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5M4 15h12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download PDF
            {resource.fileSize && (
              <span className="font-normal opacity-80">({resource.fileSize})</span>
            )}
          </TrackedLink>
        )}

        {resource.url ? (
          <TrackedLink
            href={resource.url}
            external
            event="resource_clicked"
            payload={{ resource: resource.slug, kind: resource.kind }}
            className="block text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Visit ↗
          </TrackedLink>
        ) : (
          !resource.fileUrl && (
            <p className="text-xs italic text-muted-foreground">
              Verify the current edition.
            </p>
          )
        )}
      </CardContent>
    </Card>
  );
}
