/**
 * Product analytics — typed event schema + a single privacy-conscious `track`
 * seam.
 *
 * PRIVACY: this layer sends ONLY the properties passed with each event (tool /
 * lesson / concept slugs, search terms, result counts). It sets no cookies,
 * assigns no user IDs, and collects no personal data. Search terms are user
 * input and are the point of the "what are users searching for" question — they
 * are not identifiers.
 *
 * NO PROVIDER IS CONNECTED. Until one is configured (see docs/ANALYTICS.md),
 * `track` pushes events to `window.dataLayer` (for a future tag manager) and
 * logs in development. Wiring a real provider is a single change in `send()`.
 */

/**
 * The full product-analytics event schema. Each event's payload is exactly the
 * fields needed to answer the product questions in docs/ANALYTICS.md.
 */
export interface AnalyticsEventMap {
  /** A tool/calculator page was opened. → most-used & repeat-use tools. */
  tool_opened: { tool: string };
  /** A calculation produced a result. → active tool usage. */
  calculation_completed: { tool: string };
  /** A calculation failed validation / could not compute. → friction. */
  calculation_error: { tool: string; field?: string };
  /** A lesson page was opened. */
  lesson_opened: { lesson: string; level?: number };
  /** A user followed a link from a lesson to a tool. → lessons that drive tools. */
  lesson_to_tool: { lesson: string; tool: string };
  /** A user followed a link from a tool to a lesson. → tools that drive learning. */
  tool_to_lesson: { tool: string; lesson: string };
  /** A search was run (after debounce). → what users search for. */
  search_performed: { query: string; results: number };
  /** A search returned nothing. → gaps in content/tools. */
  search_no_result: { query: string };
  /** A resource link was clicked. */
  resource_clicked: { resource: string; kind?: string };
  /** A directory listing was clicked. */
  directory_clicked: { entry: string; type?: string };
  /** The newsletter signup was submitted. */
  newsletter_clicked: { location?: string };
}

export type AnalyticsEvent = keyof AnalyticsEventMap;

/** The one place a real provider is wired. Currently dataLayer + dev log. */
function send(event: AnalyticsEvent, props: Record<string, unknown>): void {
  const w = window as typeof window & { dataLayer?: unknown[] };
  try {
    (w.dataLayer ||= []).push({ event, ...props });
  } catch {
    // never let analytics break the UI
  }
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props);
  }
}

/** Track a product event. Type-safe: payload must match the event's schema. */
export function track<E extends AnalyticsEvent>(
  event: E,
  props: AnalyticsEventMap[E],
): void {
  if (typeof window === "undefined") return;
  send(event, props as Record<string, unknown>);
}
