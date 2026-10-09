import Link from "next/link";

/**
 * Standard previous / next pager used across sequential content (projects,
 * insights, states). Same visual language as the supply-chain stage pager, so
 * "what's next" looks and behaves the same everywhere. Either side may be
 * absent; the kicker labels adapt per context (Older/Newer, Previous/Next…).
 */
export interface PagerItem {
  href: string;
  label: string;
}

export function PrevNext({
  prev,
  next,
  prevKicker = "← Previous",
  nextKicker = "Next →",
  ariaLabel = "Pagination",
}: {
  prev?: PagerItem;
  next?: PagerItem;
  prevKicker?: string;
  nextKicker?: string;
  ariaLabel?: string;
}) {
  if (!prev && !next) return null;
  return (
    <nav aria-label={ariaLabel} className="grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="text-xs text-muted-foreground">{prevKicker}</span>
          <span className="mt-1 block font-semibold tracking-tight group-hover:text-brand">{prev.label}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link href={next.href} className="group rounded-xl border border-border bg-card p-4 text-right transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="text-xs text-muted-foreground">{nextKicker}</span>
          <span className="mt-1 block font-semibold tracking-tight group-hover:text-brand">{next.label}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
    </nav>
  );
}
