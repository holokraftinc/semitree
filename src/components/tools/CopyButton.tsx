"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Copies a pre-formatted text string to the clipboard. Uses the async
 * Clipboard API with an execCommand fallback for insecure contexts, mirroring
 * the Unit converter's copy behaviour.
 */
export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!text) return;
    let succeeded = false;
    try {
      await navigator.clipboard.writeText(text);
      succeeded = true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        succeeded = document.execCommand("copy");
      } catch {
        succeeded = false;
      }
      document.body.removeChild(ta);
    }
    if (succeeded) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy result"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {copied ? (
        <>
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-success" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="7" y="7" width="9" height="9" rx="1.5" />
            <path d="M4 13V4h9" />
          </svg>
          Copy result
        </>
      )}
    </button>
  );
}
