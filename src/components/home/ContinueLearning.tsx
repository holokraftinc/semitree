"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecent, type RecentItem } from "@/lib/continue-learning";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

const TYPE_LABEL: Record<RecentItem["type"], string> = {
  lesson: "Lesson",
  tool: "Tool",
  concept: "Concept",
};

/** Shows recent lessons/tools/concepts from local history. Renders nothing
 *  until mounted and only when there is history (no empty state for newcomers). */
export function ContinueLearning() {
  const [items, setItems] = useState<RecentItem[] | null>(null);

  useEffect(() => {
    setItems(getRecent());
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <Section
      headingId="continue"
      title="Continue where you left off"
      description="Picked up from this browser — no account needed."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Badge variant="neutral" className="w-fit">
              {TYPE_LABEL[item.type]}
            </Badge>
            <span className="mt-2 font-semibold tracking-tight group-hover:text-brand">
              {item.title}
            </span>
            <span className="mt-1 text-sm text-muted-foreground">Resume →</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
