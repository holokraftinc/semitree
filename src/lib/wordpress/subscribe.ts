/**
 * Newsletter subscribe/unsubscribe — talks to the Semitree CMS custom REST
 * namespace (semitree/v1). Public, unauthenticated POSTs only; no secrets.
 */
import { WP_SEMITREE_API } from "./config";

export type SubscribeResult = "subscribed" | "already" | "invalid" | "rate_limited" | "error";

/** Subscribe an email. Maps CMS responses to a small result union. */
export async function subscribe(email: string, name?: string): Promise<SubscribeResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${WP_SEMITREE_API}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, name: name || undefined, source: "website", website: "" }),
      signal: controller.signal,
    });
    if (res.status === 409) return "already";
    if (res.status === 400) return "invalid";
    if (res.status === 429) return "rate_limited";
    if (!res.ok) return "error";
    const data = (await res.json().catch(() => null)) as { status?: string } | null;
    if (data?.status === "already") return "already";
    return "subscribed";
  } catch {
    return "error";
  } finally {
    clearTimeout(timer);
  }
}

export type UnsubscribeResult = "unsubscribed" | "not_found" | "invalid" | "error";

/** Unsubscribe using the token from a newsletter's unsubscribe link. */
export async function unsubscribe(token: string): Promise<UnsubscribeResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${WP_SEMITREE_API}/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ token }),
      signal: controller.signal,
    });
    if (res.status === 404) return "not_found";
    if (res.status === 400) return "invalid";
    if (!res.ok) return "error";
    return "unsubscribed";
  } catch {
    return "error";
  } finally {
    clearTimeout(timer);
  }
}
