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
  /** Render a same-tab download link (implies external). */
  download?: boolean;
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
  download,
  ...rest
}: TrackedLinkProps<E>) {
  const onClick = () => track(event, payload);

  if (external || download) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        {...(download
          ? { download: "" }
          : { target: "_blank", rel: "noopener noreferrer" })}
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
