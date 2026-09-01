import type { DirectoryEntry } from "@/lib/data/types";
import { directoryLabel } from "@/lib/data/directory";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrackedLink } from "@/components/analytics/TrackedLink";

/**
 * A directory listing. Renders a "Verified" badge when the entry has been
 * checked, and a "Featured" badge (reserved for future paid placement). Only
 * shown once real, verified entries exist — none are fabricated in Phase 11.
 */
export function DirectoryEntryCard({ entry }: { entry: DirectoryEntry }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{directoryLabel(entry.type)}</Badge>
          {entry.verified && <Badge variant="success">Verified</Badge>}
          {entry.featured && <Badge variant="brand">Featured</Badge>}
        </div>
        <CardTitle className="mt-2">{entry.name}</CardTitle>
        {entry.location && <CardDescription>{entry.location}</CardDescription>}
      </CardHeader>
      <CardContent className="mt-auto space-y-2">
        {entry.description && (
          <p className="text-sm text-muted-foreground">{entry.description}</p>
        )}
        {entry.services && entry.services.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {entry.services.join(" · ")}
          </p>
        )}
        {entry.website && (
          <TrackedLink
            href={entry.website}
            external
            event="directory_clicked"
            payload={{ entry: entry.id, type: entry.type }}
            className="text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Visit website ↗
          </TrackedLink>
        )}
        {entry.lastVerified && (
          <p className="text-xs text-muted-foreground">
            Last verified {entry.lastVerified}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
