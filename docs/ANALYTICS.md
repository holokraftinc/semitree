# Semitree — Product Analytics

A lightweight, privacy-conscious analytics architecture for product decisions.
All events flow through one typed seam, `track()` in
[`src/lib/analytics.ts`](../src/lib/analytics.ts).

> **No analytics provider is connected yet.** Events are defined and fired
> throughout the app, but until a provider is configured (see
> [§4](#4-connecting-a-provider-manual-step)) they only push to
> `window.dataLayer` and log in development. Nothing is sent to a third party.

## 1. Events

| Event | Payload | Fires when |
|-------|---------|-----------|
| `tool_opened` | `{ tool }` | a tool page mounts |
| `calculation_completed` | `{ tool }` | a calculator returns a result |
| `calculation_error` | `{ tool, field? }` | a calculation is rejected (invalid input / engine error) |
| `lesson_opened` | `{ lesson, level? }` | a lesson page mounts |
| `lesson_to_tool` | `{ lesson, tool }` | a user clicks a tool link from a lesson (Try-it / related tool) |
| `tool_to_lesson` | `{ tool, lesson }` | a user clicks a lesson link from a tool |
| `search_performed` | `{ query, results }` | a search settles (debounced) |
| `search_no_result` | `{ query }` | a search returns zero results |
| `resource_clicked` | `{ resource, kind? }` | a resource's outbound link is clicked |
| `directory_clicked` | `{ entry, type? }` | a directory listing's link is clicked |
| `newsletter_clicked` | `{ location? }` | the newsletter form is submitted |

The event names and payloads are the single source of truth in
`AnalyticsEventMap`; `track` is type-checked against it.

> Note: `resource_clicked` and `directory_clicked` are wired but only fire once
> resources have outbound URLs / the directory has listings (none yet — no data
> is fabricated).

## 2. Product questions → events

| Question | Answered by |
|----------|-------------|
| Which tools are most used? | count `tool_opened` (and `calculation_completed`) by `tool` |
| Which tools are repeatedly used? | repeat `tool_opened` / `calculation_completed` per visitor over time |
| Which lessons drive calculator usage? | `lesson_to_tool` grouped by `lesson` |
| Which calculators drive learning? | `tool_to_lesson` grouped by `tool` |
| What are users searching for? | `search_performed.query` frequency |
| Which searches return nothing? | `search_no_result.query` frequency |
| Where is there friction? | `calculation_error` by `tool` / `field` |

## 3. Privacy

- **No personal data.** We send only the properties listed above — content
  slugs, search terms, and counts. No names, emails, or free-form PII.
- **No cookies, no fingerprinting, no user IDs** are set by this layer.
- **Search terms** are collected because "what are users searching for" is a core
  product question; they are user-entered topics, not identifiers.
- The email a visitor types into the newsletter form is **not** included in
  `newsletter_clicked` — only the fact that the form was submitted.
- Choose a **cookieless, privacy-first provider** (e.g. Plausible) or a provider
  configured without PII to keep this property true.

## 4. Connecting a provider (MANUAL STEP)

⚠️ **This requires manual configuration and is NOT done.** No external analytics
account has been created or connected. To turn events into dashboards:

1. **Create an account** with a privacy-first provider — recommended:
   **Plausible** (cookieless, GDPR-friendly). Alternatives: Fathom, or GA4
   configured without PII.
2. **Add your domain** in the provider and copy the site ID / snippet.
3. **Load the script** — add the provider's `<script>` to
   `src/app/layout.tsx` (e.g. via `next/script`), gated behind an env flag.
4. **Forward events** — implement the `send()` function in
   `src/lib/analytics.ts` to call the provider's custom-event API. For Plausible:
   `window.plausible?.(event, { props })`. This is the ONLY code change needed;
   every `track()` call already routes through `send()`.
5. **Set env vars** in Vercel (e.g. `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`).

Until steps 1–5 are done, analytics events are defined and firing but go
nowhere except `window.dataLayer` and the dev console. **Please tell me which
provider you want and I will wire step 3–4; I cannot create the account for
you.**
