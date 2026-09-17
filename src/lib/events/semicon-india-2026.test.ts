import { describe, expect, it } from "vitest";
import {
  eventStatus,
  eventDayNumber,
  EVENT_START,
  EVENT_END,
  EVENT_SLUG,
} from "./semicon-india-2026";

// Fixed instants in India Standard Time — no system clock is changed.
const t = (iso: string) => Date.parse(iso);

describe("SEMICON India 2026 lifecycle", () => {
  it("is upcoming before the event", () => {
    expect(eventStatus(t("2026-09-16T12:00:00+05:30"))).toBe("upcoming");
    expect(eventDayNumber(t("2026-09-16T12:00:00+05:30"))).toBeNull();
  });

  it("is live during the event, with the right day number (IST)", () => {
    expect(eventStatus(t("2026-09-17T09:00:00+05:30"))).toBe("live");
    expect(eventDayNumber(t("2026-09-17T09:00:00+05:30"))).toBe(1);
    expect(eventDayNumber(t("2026-09-18T09:00:00+05:30"))).toBe(2);
    expect(eventDayNumber(t("2026-09-19T23:00:00+05:30"))).toBe(3);
  });

  it("becomes an archive after the event", () => {
    expect(eventStatus(t("2026-09-20T00:00:00+05:30"))).toBe("archive");
    expect(eventStatus(t("2026-12-01T00:00:00+05:30"))).toBe("archive");
    expect(eventDayNumber(t("2026-09-20T00:00:00+05:30"))).toBeNull();
  });

  it("uses correct IST window boundaries", () => {
    // First instant of the event is live; one second after the end is archive.
    expect(eventStatus(EVENT_START)).toBe("live");
    expect(eventStatus(EVENT_END)).toBe("live");
    expect(eventStatus(EVENT_END + 1000)).toBe("archive");
    expect(eventStatus(EVENT_START - 1000)).toBe("upcoming");
  });

  it("exposes a stable slug", () => {
    expect(EVENT_SLUG).toBe("semicon-india-2026");
  });
});
