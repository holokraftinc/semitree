import Link from "next/link";
import type { SemiTool } from "@/lib/data/semi-tools";
import {
  SEMI_CATEGORY_LABELS,
  SEMI_DIFFICULTY_LABELS,
  SEMI_STATUS_LABELS,
  getSemiToolLearningLinks,
} from "@/lib/data/semi-tools";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

const DIFFICULTY_VARIANT = {
  beginner: "info",
  engineering: "brand",
  advanced: "warning",
} as const;

const STATUS_VARIANT = {
  available: "success",
  beta: "info",
  "coming-soon": "neutral",
} as const;

/**
 * Card for a single semiconductor tool: category, difficulty, status, name,
 * one-line summary, the related learning topic, and a "Use tool" CTA. Only
 * available tools link out — coming-soon tools show a badge and no dead link.
 * Reuses the shared Card / Badge / Button primitives (no new UI system).
 */
export function SemiToolCard({ tool }: { tool: SemiTool }) {
  const href = `/semiconductors/tools/${tool.slug}`;
  const available = tool.status === "available";
  const learning = getSemiToolLearningLinks(tool.slug);

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {SEMI_CATEGORY_LABELS[tool.category]}
        </span>
        <Badge variant={DIFFICULTY_VARIANT[tool.difficulty]}>
          {SEMI_DIFFICULTY_LABELS[tool.difficulty]}
        </Badge>
        {!available && <Badge variant={STATUS_VARIANT[tool.status]}>{SEMI_STATUS_LABELS[tool.status]}</Badge>}
      </div>

      <h3 className="text-base font-semibold tracking-tight">{tool.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{tool.summary}</p>

      <p className="mt-3 font-mono text-xs text-muted-foreground">{tool.formula}</p>

      {tool.educational && (
        <p className="mt-2 text-xs italic text-muted-foreground">Educational calculation</p>
      )}

      {learning.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Related learning:{" "}
          {learning.map((l, i) => (
            <span key={l.href}>
              {i > 0 && ", "}
              <Link href={l.href} className="font-medium text-brand hover:underline">
                {l.label}
              </Link>
            </span>
          ))}
        </p>
      )}

      <div className="mt-4 pt-1">
        {available ? (
          <ButtonLink href={href} size="sm" variant="outline" aria-label={`Use ${tool.name}`}>
            Use tool →
          </ButtonLink>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">{SEMI_STATUS_LABELS[tool.status]}</span>
        )}
      </div>
    </Card>
  );
}
