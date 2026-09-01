"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils/cn";

type TooltipProps = {
  /** Tooltip text. */
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom";
};

/**
 * Accessible tooltip. The trigger is a real, focusable element (button) wired to
 * the tooltip via `aria-describedby`; the tip shows on hover and keyboard focus
 * and dismisses on blur / Escape.
 */
export function Tooltip({
  content,
  children,
  className,
  side = "top",
}: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        className="inline-flex cursor-help items-center rounded-sm underline decoration-dotted underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      >
        {children}
      </button>
      <span
        role="tooltip"
        id={id}
        className={cn(
          "pointer-events-none absolute left-1/2 z-20 w-max max-w-xs -translate-x-1/2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-card-foreground shadow-card transition-opacity",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          open ? "opacity-100" : "opacity-0",
          className,
        )}
        // Hidden from AT when not shown; aria-describedby only references it while open.
        aria-hidden={!open}
      >
        {content}
      </span>
    </span>
  );
}
