"use client";

import { useEffect, useRef, useState } from "react";
import { getTopicProgress, saveTopicProgress } from "@/lib/learning-progress";
import { track } from "@/lib/analytics";

/**
 * Sticky learning-progress indicator shown at the top of a learning topic.
 *
 * Progress is measured against the topic's own content container (the element
 * with id="learning-content"), NOT the whole document — so headers, footers and
 * the bottom navigation don't count. It reaches 100% only when the end of that
 * content reaches the viewport, at which point the topic is marked completed and
 * the state is persisted (localStorage) and reported to analytics once.
 *
 * Performance: one passive scroll listener throttled with requestAnimationFrame,
 * plus resize / content-resize observers to stay correct as images and
 * equations load. Reduced-motion is respected on the bar transition.
 */

const CONTENT_ID = "learning-content";

export function LearningTopicProgress({
  topicKey,
  title,
  eyebrow,
  index,
  total,
  domain,
}: {
  topicKey: string;
  title: string;
  eyebrow?: string;
  index?: number;
  total?: number;
  domain?: string;
}) {
  const [pct, setPct] = useState(0);
  const [completed, setCompleted] = useState(false);
  const maxRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    // Resume any stored state so returning learners see prior progress / completion.
    const stored = getTopicProgress(topicKey);
    if (stored) {
      maxRef.current = stored.progress;
      setPct(stored.progress);
      if (stored.completed) {
        completedRef.current = true;
        setCompleted(true);
      }
    }

    let raf = 0;
    const compute = () => {
      raf = 0;
      const el = document.getElementById(CONTENT_ID);
      if (!el) return;
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const contentTop = rect.top + window.scrollY;
      const contentHeight = el.offsetHeight;
      const scrollable = contentHeight - vh;

      // Reading progress: how far the viewport top has moved through the content.
      // 0% when the content top meets the viewport top; 100% only when the
      // content bottom reaches the viewport bottom (the true end).
      let p = scrollable > 0 ? (window.scrollY - contentTop) / scrollable : 0;
      p = Math.max(0, Math.min(1, p));
      const value = Math.round(p * 100);

      if (value > maxRef.current) maxRef.current = value;
      setPct((cur) => (value > cur || !completedRef.current ? value : cur));

      // Completion = the actual end of the content is in view.
      const endReached = rect.bottom - vh <= 4 || value >= 100;
      if (endReached && !completedRef.current) {
        completedRef.current = true;
        maxRef.current = 100;
        setCompleted(true);
        setPct(100);
        saveTopicProgress(topicKey, { progress: 100, completed: true });
        try {
          track("learning_topic_completed", { topic: topicKey, domain });
        } catch {
          /* analytics best-effort */
        }
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };

    const persist = () => {
      if (!completedRef.current) {
        saveTopicProgress(topicKey, { progress: maxRef.current, completed: false });
      }
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("pagehide", persist);
    document.addEventListener("visibilitychange", persist);

    // Recompute when the content box changes height (late images / equations).
    const el = document.getElementById(CONTENT_ID);
    const ro = el && "ResizeObserver" in window ? new ResizeObserver(onScroll) : null;
    if (ro && el) ro.observe(el);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pagehide", persist);
      document.removeEventListener("visibilitychange", persist);
      ro?.disconnect();
      persist();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicKey]);

  const shownPct = completed ? 100 : pct;

  return (
    <div className="sticky top-16 z-30 bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-xs text-muted-foreground sm:text-sm">
          {eyebrow && <span className="font-medium text-foreground">{eyebrow}</span>}
          {eyebrow && typeof index === "number" && total ? " · " : ""}
          {typeof index === "number" && total ? `Topic ${index} of ${total}` : ""}
          {!eyebrow && !(typeof index === "number" && total) ? title : ""}
        </p>
        <p className="shrink-0 text-xs font-semibold sm:text-sm">
          {completed ? (
            <span className="text-brand">✓ Completed</span>
          ) : (
            <span className="text-muted-foreground">{shownPct}%</span>
          )}
        </p>
      </div>
      <div
        className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={shownPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={
          completed
            ? `Topic completed. Learning progress: 100 percent`
            : `Learning progress: ${shownPct} percent`
        }
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-150 ease-out motion-reduce:transition-none"
          style={{ width: `${shownPct}%` }}
        />
      </div>
    </div>
  );
}
