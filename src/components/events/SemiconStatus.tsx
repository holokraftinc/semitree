"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { eventStatus, eventDayNumber, type EventStatus } from "@/lib/events/semicon-india-2026";

/**
 * Lifecycle-aware UI for the event page hero. Status is derived from the
 * centralized event dates (India Standard Time) at runtime, so the page moves
 * from "Live" to "Event archive" automatically with no code change. The page
 * itself is never removed or redirected — only its status label changes.
 * Computed after mount to avoid any server/client mismatch.
 */

/** The hero status badge: Upcoming / Live — Day N / Event archive. */
export function SemiconStatusBadge() {
  const [label, setLabel] = useState("Event coverage");

  useEffect(() => {
    const update = () => {
      const s: EventStatus = eventStatus();
      if (s === "upcoming") setLabel("Upcoming");
      else if (s === "live") setLabel(`Live — Day ${eventDayNumber()}`);
      else setLabel("Event archive");
    };
    update();
    const id = setInterval(update, 3_600_000);
    return () => clearInterval(id);
  }, []);

  return <Badge variant="brand">{label}</Badge>;
}

/** An archive notice shown only once the event has concluded. */
export function SemiconArchiveNotice() {
  const [archived, setArchived] = useState(false);

  useEffect(() => {
    setArchived(eventStatus() === "archive");
  }, []);

  if (!archived) return null;

  return (
    <Alert variant="info" title="SEMICON India 2026 — Event Archive">
      This event has concluded (17–19 September 2026). This page remains available
      as an archive of Semitree&rsquo;s coverage — event information, articles,
      analysis, and links are preserved.
    </Alert>
  );
}
