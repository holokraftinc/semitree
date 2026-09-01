"use client";

import Link from "next/link";
import { track, type AnalyticsEvent, type AnalyticsEventMap } from "@/lib/analytics";

type TrackedLinkProps<E extends AnalyticsEvent> = {
  href: string;
  event: E;
  payload: AnalyticsEventMap[E];
  className?: string;
  children: React.ReactNode;
  /** Render an external anchor (new tab) instead of a Next link. */
  external?: boolean;
  "aria-label"?: string;
};

/**
 * A link that fires an analytics event on click, then navigates as normal.
 * Used for cross-links (lesson→tool, tool→lesson) and outbound clicks
 * (resources, directory).
 */
export function TrackedLink<E extends AnalyticsEvent>({
  href,
  event,
  payload,
  className,
  children,
  external,
  ...rest
}: TrackedLinkProps<E>) {
  const onClick = () => track(event, payload);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
