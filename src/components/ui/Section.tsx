import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/** Section wrapper with a consistent heading + optional "see all" link. */
export function Section({
  title,
  description,
  action,
  children,
  className,
  headingId,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
  headingId?: string;
}) {
  return (
    <section
      aria-labelledby={headingId}
      className={cn("space-y-6", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="space-y-1">
          <h2
            id={headingId}
            className="text-2xl font-semibold tracking-tight"
          >
            {title}
          </h2>
          {description && (
            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {action.label} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
