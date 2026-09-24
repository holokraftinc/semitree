"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTopicProgress } from "@/lib/learning-progress";
import { track } from "@/lib/analytics";

/**
 * End-of-topic learning navigation: completion state, an "Up next" call to
 * action, and Previous/Next topic cards. Prev/Next are supplied by the caller
 * from the domain's data-driven learning sequence (never hardcoded per page).
 * Completion is read from the persisted store. Stacks vertically on mobile.
 */

export interface NavLink {
  href: string;
  title: string;
  /** Level / module the topic belongs to. */
  eyebrow?: string;
  /** Short description, shown for the "Up next" topic when available. */
  description?: string;
}

export function LearningTopicNav({
  topicKey,
  title,
  domain,
  prev,
  next,
}: {
  topicKey: string;
  title: string;
  domain?: string;
  prev?: NavLink;
  next?: NavLink;
}) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(Boolean(getTopicProgress(topicKey)?.completed));
    // Re-check when returning to the tab (progress may have completed elsewhere).
    const onVis = () => setCompleted(Boolean(getTopicProgress(topicKey)?.completed));
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [topicKey]);

  const fire = (event: "learning_next_clicked" | "learning_previous_clicked", to: string) => {
    try {
      track(event, { from: topicKey, to: `${domain ? `${domain}:` : ""}${to}` });
    } catch {
      /* analytics best-effort */
    }
  };

  return (
    <section aria-labelledby="topic-nav-h" className="space-y-5 rounded-2xl border border-border bg-muted/30 p-6">
      {/* Completion state (text + visual, not colour-only) */}
      <div>
        {completed ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-brand">
            <span aria-hidden="true">✓</span> Topic completed
          </p>
        ) : (
          <p className="text-sm font-medium text-muted-foreground">Continue learning</p>
        )}
        <h2 id="topic-nav-h" className="mt-1 text-lg font-semibold tracking-tight">
          {completed ? `You've completed: ${title}` : title}
        </h2>
      </div>

      {/* Up next — the prominent forward action */}
      {next ? (
        <Link
          href={next.href}
          onClick={() => fire("learning_next_clicked", next.title)}
          className="group block rounded-xl border border-brand/30 bg-brand/5 p-5 transition-colors hover:border-brand/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Up next: ${next.title}. Continue learning.`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Up next</p>
          <p className="mt-1 text-base font-semibold text-foreground group-hover:text-brand">{next.title}</p>
          {next.eyebrow && <p className="mt-0.5 text-xs text-muted-foreground">{next.eyebrow}</p>}
          {next.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{next.description}</p>
          )}
          <p className="mt-3 text-sm font-medium text-brand">Continue learning →</p>
        </Link>
      ) : (
        <p className="text-sm text-muted-foreground">
          You&rsquo;ve reached the end of this learning path.
        </p>
      )}

      {/* Previous / Next cards */}
      <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
        {prev ? (
          <Link
            href={prev.href}
            onClick={() => fire("learning_previous_clicked", prev.title)}
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Previous topic: ${prev.title}`}
          >
            <p className="text-xs font-medium text-muted-foreground">← Previous topic</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{prev.title}</p>
            {prev.eyebrow && <p className="mt-0.5 text-xs text-muted-foreground">{prev.eyebrow}</p>}
          </Link>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-4">
            <p className="text-xs font-medium text-muted-foreground">Start of this learning path</p>
          </div>
        )}

        {next ? (
          <Link
            href={next.href}
            onClick={() => fire("learning_next_clicked", next.title)}
            className="rounded-lg border border-border bg-card p-4 text-right transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Next topic: ${next.title}`}
          >
            <p className="text-xs font-medium text-muted-foreground">Next topic →</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{next.title}</p>
            {next.eyebrow && <p className="mt-0.5 text-xs text-muted-foreground">{next.eyebrow}</p>}
          </Link>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-right">
            <p className="text-xs font-medium text-muted-foreground">End of this learning path</p>
          </div>
        )}
      </div>
    </section>
  );
}
