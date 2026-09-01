"use client";

import { useEffect, useRef } from "react";
import { track, type AnalyticsEvent, type AnalyticsEventMap } from "@/lib/analytics";

/**
 * Fires a single analytics event once when a page/view mounts (e.g.
 * `tool_opened`, `lesson_opened`). Renders nothing.
 */
export function TrackView<E extends AnalyticsEvent>({
  event,
  payload,
}: {
  event: E;
  payload: AnalyticsEventMap[E];
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(event, payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
