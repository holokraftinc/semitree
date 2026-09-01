"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type SearchInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  /** Accessible label; visually hidden but read by screen readers. */
  label?: string;
  onClear?: () => void;
};

/** Search field with a leading icon and an optional clear button. */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { className, label = "Search", value, onClear, placeholder = "Search…", ...props },
    ref,
  ) => {
    const hasValue = typeof value === "string" && value.length > 0;
    return (
      <div className="relative">
        <label className="sr-only" htmlFor={props.id}>
          {label}
        </label>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="M14 14l3 3" strokeLinecap="round" />
        </svg>
        <input
          ref={ref}
          type="search"
          role="searchbox"
          value={value}
          placeholder={placeholder}
          className={cn(
            "h-10 w-full rounded-md border border-input bg-background pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "[&::-webkit-search-cancel-button]:hidden",
            className,
          )}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";
