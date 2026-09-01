import type { Tool } from "@/lib/data/types";
import { CATEGORY_LABELS } from "@/lib/data/tools";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

// Re-exported for existing importers.
export { CATEGORY_LABELS };

/**
 * Card for a single tool: category, name, description, and an explicit Open
 * button. Implemented tools link to their calculator; anything not yet
 * available shows a "Planned" badge and no Open button (never a dead link).
 */
export function ToolCard({
  tool,
  available = true,
  className,
}: {
  tool: Tool;
  available?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("flex h-full flex-col p-5", className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {CATEGORY_LABELS[tool.category]}
        </span>
        {!available && <Badge variant="neutral">Planned</Badge>}
      </div>
      <h3 className="text-base font-semibold tracking-tight">{tool.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{tool.summary}</p>
      {available && (
        <div className="mt-4 pt-1">
          <ButtonLink
            href={`/tools/${tool.slug}`}
            size="sm"
            variant="outline"
            aria-label={`Open ${tool.name}`}
          >
            Open
          </ButtonLink>
        </div>
      )}
    </Card>
  );
}
