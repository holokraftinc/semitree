/**
 * Industry-problem submission — posts to the Semitree CMS custom REST namespace
 * (semitree/v1), exactly like the newsletter subscribe flow. Public,
 * unauthenticated POST only; NO secrets in the browser (the endpoint is a
 * public write-only route; validation, persistence, rate-limiting, and the
 * acknowledgement email all live server-side in the Semitree WordPress plugin).
 *
 * DEPENDENCY: this calls `POST {semitree/v1}/industry-problem`. That route must
 * be added to the Semitree CMS plugin (same shape as /subscribe) before
 * submissions persist — see docs in the submit page / PR notes. Until the
 * endpoint is live, set NEXT_PUBLIC_PROBLEM_SUBMISSIONS_ENABLED to anything
 * other than "true" so the form honestly reports submissions as not-yet-open
 * instead of hitting a 404. We never fake a successful submission.
 */
import { WP_SEMITREE_API } from "./config";

/** Whether the live submission path is enabled (endpoint deployed on the CMS). */
export const PROBLEM_SUBMISSIONS_ENABLED =
  process.env.NEXT_PUBLIC_PROBLEM_SUBMISSIONS_ENABLED === "true";

export interface IndustryProblemPayload {
  fullName: string;
  email: string;
  organization?: string;
  role?: string;
  problemTitle: string;
  problemStatement: string;
  category: string;
  customCategory?: string;
  locationScope?: string;
  locationDetail?: string;
  affectedParticipants: string[];
  impactType?: string;
  supportingContext?: string;
  referenceUrl?: string;
  contactConsent: boolean;
  publicationContactConsent: boolean;
}

export type SubmitProblemResult = "submitted" | "invalid" | "rate_limited" | "error";

/** Submit a structured industry problem. Maps CMS responses to a result union. */
export async function submitIndustryProblem(
  payload: IndustryProblemPayload,
): Promise<SubmitProblemResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${WP_SEMITREE_API}/industry-problem`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      // `source`/`website` mirror the subscribe payload; `website` is a honeypot
      // the server can reject when non-empty (basic spam protection).
      body: JSON.stringify({ ...payload, source: "website", website: "" }),
      signal: controller.signal,
    });
    if (res.status === 400) return "invalid";
    if (res.status === 429) return "rate_limited";
    if (!res.ok) return "error";
    return "submitted";
  } catch {
    return "error";
  } finally {
    clearTimeout(timer);
  }
}
