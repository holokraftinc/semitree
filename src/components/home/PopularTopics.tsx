import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { POPULAR_TOPICS } from "@/lib/data/platform";

export function PopularTopics() {
  return (
    <Section
      headingId="popular-topics"
      title="Popular topics"
      description="Concepts people explore most — microfluidics today, semiconductors soon."
      action={{ label: "Browse concepts", href: "/concepts" }}
    >
      <ul className="flex flex-wrap gap-2">
        {POPULAR_TOPICS.map((t) =>
          t.status === "live" && t.href ? (
            <li key={t.label}>
              <Link
                href={t.href}
                className="inline-flex rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t.label}
              </Link>
            </li>
          ) : (
            <li key={t.label}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3.5 py-1.5 text-sm text-muted-foreground">
                {t.label}
                <Badge variant="neutral">Soon</Badge>
              </span>
            </li>
          ),
        )}
      </ul>
    </Section>
  );
}
