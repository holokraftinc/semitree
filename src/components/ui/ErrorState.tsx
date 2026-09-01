import { cn } from "@/lib/utils/cn";
import { Button } from "./Button";

/**
 * Presentational error state. Framework-agnostic so it can back a Next.js
 * `error.tsx` boundary, a failed fetch, or an invalid calculator input set.
 */
export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-danger/30 bg-danger/5 px-6 py-12 text-center",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="mb-3 h-8 w-8 text-danger"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M12 8v5m0 3h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-base font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
