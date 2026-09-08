# Semitree CMS — production runbook (Phase 13)

Move the WordPress CMS to **https://cms.semitree.in** without disrupting the live
site at **https://semitree.in**. The public site (GitHub Pages) is never touched
by this phase, so it cannot be broken by these steps.

> ⚠️ Not production-ready until every check in "Final verification" passes.
> Several steps are manual (DNS/hosting/email) — see Section B.

---

## Step 1 — DNS audit (current, DO NOT overwrite)

| Type | Host | Value | Purpose |
|------|------|-------|---------|
| A | `semitree.in` | 185.199.108.153 / .109 / .110 / .111 | GitHub Pages — **keep** |
| CNAME | `www.semitree.in` | holokraftinc.github.io | GitHub Pages — **keep** |
| NS | `semitree.in` | ns65 / ns66.domaincontrol.com | GoDaddy DNS — **keep** |
| A/AAAA/TXT/MX | — | none | (SPF/DKIM/DMARC added later, Step 11) |
| CNAME | `cms.semitree.in` | *(does not exist — to be ADDED)* | WordPress CMS |

Only a **new** `cms` record is added. Nothing existing is modified.

---

## Step 2/3 — Point cms.semitree.in at WordPress + configure the domain

**Do not guess the DNS target — take the exact value from GoDaddy.**

Preferred (GoDaddy auto-wires DNS + SSL, since DNS and WordPress are both GoDaddy):
1. GoDaddy → your **Managed WordPress** site → **Settings → Domains** (or "Add
   domain") → add **cms.semitree.in**.
2. GoDaddy provisions the DNS record and an SSL certificate automatically. If it
   shows a target instead, add that **exact** record under DNS:
   - `Type: CNAME  Host: cms  Value: <exact hostname GoDaddy shows>  TTL: 1 hour`
   (Only if GoDaddy gives an IP: `Type: A  Host: cms  Value: <exact IP>`.)
3. In WordPress **Settings → General**, set **WordPress Address** and **Site
   Address** to `https://cms.semitree.in` (or use the MWP "Change domain" tool,
   which also rewrites stored URLs/media). Confirm media URLs now use
   `cms.semitree.in`.
4. **Launch the site** (disable GoDaddy "Coming Soon") — required so the REST API
   stops returning 401.
5. Activate the **semitree-cms** plugin (`cms/semitree-cms.zip`) if not already.

Verify: HTTPS padlock, login at `/wp-admin`, `/wp-json/wp/v2/articles` returns
JSON, media/admin URLs use cms.semitree.in. **cms.semitree.in is the CMS only —
never the public site.**

---

## Step 4 — Frontend API URL

Already env-driven. **The production default is `https://cms.semitree.in`**
(`src/lib/wordpress/config.ts`), so no code change is needed. Optionally set it
explicitly in the deploy environment (GitHub Actions repo **Variable**
`NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.semitree.in`) and reference it in the
build step. For local dev, put the temporary host in `.env.local`.

## Step 5 — Canonical URLs (already enforced)

The plugin's `st_seo.canonical` always resolves to `https://semitree.in/<type>/<slug>`,
and the frontend applies that canonical. The CMS host never appears as a public
canonical. (Public base is set in **Semitree Settings**.)

## Step 6 — CORS (already implemented)

The plugin restricts REST `Access-Control-Allow-Origin` to `https://semitree.in`
(+ `https://www.semitree.in`) only — no wildcard. Adjust via the
`semitree_allowed_origins` filter or the Settings public base if www is unused.

---

## Step 7 — Production security checklist

Frontend (done): no dev URLs / localhost / secrets in the bundle (scanned);
CMS HTML sanitized; only public GET/subscribe POST from the browser.

WordPress (manual, in wp-admin/host):
- [ ] Strong admin password + 2FA; unique admin username (not "admin").
- [ ] `WP_DEBUG` off (`wp-config.php`), no debug output.
- [ ] WordPress + plugins updated; remove unused plugins; keep one theme only.
- [ ] REST exposes only published public content (verify drafts/private/subscribers hidden).
- [ ] No test credentials; application passwords only if needed for authenticated writes.

## Step 8 — Newsletter (in the CMS)

`semitree-cms` adds a **Newsletters** type (subject, preview text, introduction,
selected articles, custom sections, featured image, CTA, footer, scheduled date,
status: Draft/Scheduled/Sent/Archived). It is **internal** (not on the public
REST API). **WordPress/PHP does not send bulk email** — use a provider (Step 11).

## Step 9 — Subscribers (in the CMS)

**Subscribers** store: email, name, subscription date, status
(Active/Unsubscribed/Bounced), source, consent timestamp, unsubscribe timestamp,
and a per-subscriber unsubscribe token. `show_in_rest=false` — **never exposed
publicly**. Capture/removal happen only through two write-only endpoints:
- `POST {cms}/wp-json/semitree/v1/subscribe`  → `{ email, name?, source? }` (honeypot, rate-limited, dedupe → 409 "already")
- `POST {cms}/wp-json/semitree/v1/unsubscribe` → `{ token }`

## Step 10 — Public subscribe (frontend, done)

`NewsletterSignup` ("Get Semitree in your inbox…") posts to the subscribe
endpoint with success / already-subscribed / validation / error states, in the
existing design. `/unsubscribe?token=…` handles one-click unsubscribe.

## Step 11 — Email infrastructure (recommendation + DNS to add manually)

Pick ONE provider (don't hard-code credentials anywhere in the repo):
- **Transactional + broadcast:** Amazon SES, Resend, or Postmark.
- **Newsletter-first:** MailerLite, Buttondown, or Mailchimp.

Decide the sending identity, e.g. `news@semitree.in` (or a subdomain like
`mail.semitree.in`). Then add these DNS records **manually in GoDaddy** (exact
values come from your provider's dashboard):

```
# SPF (one TXT per sending domain; merge includes if you have more than one sender)
Type: TXT   Host: @            Value: v=spf1 include:<provider-spf-host> ~all

# DKIM (the provider gives you the exact selector hosts/values — usually CNAMEs)
Type: CNAME Host: <selector1>._domainkey   Value: <provider value>
Type: CNAME Host: <selector2>._domainkey   Value: <provider value>

# DMARC (start in monitor mode, then tighten to quarantine/reject)
Type: TXT   Host: _dmarc       Value: v=DMARC1; p=none; rua=mailto:dmarc@semitree.in; fo=1
```

Do **not** change the existing `@` A records or `www` CNAME. Adding TXT/CNAME for
email does not affect the website.

---

## Step 12 — Production test checklist (run after Section B)

1. cms.semitree.in opens (HTTPS) • 2. wp-admin login • 3. `/wp-json/wp/v2/articles`
returns JSON • 4. frontend `/cms/articles` shows items • 5. create an article •
6. it appears on Semitree • 7. a draft does NOT appear • 8. unpublish → gone •
9. featured image renders • 10. SEO/canonical = semitree.in • 11. mobile •
12. search • 13. existing tools/learning/maps still work • 14. subscribe works
(success + already states) • 15. `/wp-json/wp/v2/st_subscriber` = 404 (protected)
• 16. unsubscribe link works • 17. stop WordPress → frontend still loads (graceful)
• 18. no secrets in page source or bundle • 19. no myftpupload/localhost in bundle
• 20. semitree.in unchanged.

---

## Step 13 — Rollback plan

- **Website:** untouched this phase (GitHub Pages + `semitree.in` A/`www` CNAME
  unchanged) — nothing to roll back; it keeps working regardless.
- **DNS:** `cms.semitree.in` is new — to roll back, delete that single record.
- **Frontend:** `/cms/*` degrades gracefully if the CMS is down; to fully revert,
  revert the Phase 12/13 commits or unset the env — the rest of the site is
  unaffected.
- **WordPress:** restore from GoDaddy Managed WordPress daily backup / restore
  point (verify retention). Deactivating `semitree-cms` removes CMS structure
  without deleting stored content.

---

## SECTION A — CLAUDE COMPLETED (in the repo)

- DNS audit (read-only) documented above; nothing changed.
- CORS locked to semitree.in (+ www) in the plugin (no wildcard).
- Newsletter management type + Subscribers store (private) added to the plugin.
- Public **subscribe/unsubscribe** REST endpoints (honeypot, rate limit, dedupe,
  consent + unsubscribe timestamps); subscriber data never exposed on read APIs.
- Frontend subscribe experience with success/already/validation/error states +
  `/unsubscribe` page, in the existing design system.
- Frontend default API URL set to `https://cms.semitree.in`; temp host removed
  from shipped code; `.env.example` updated.
- Security scan: no dev URLs, localhost, or secrets in the bundle.
- Rebuilt `cms/semitree-cms.zip`. Build (200 pages) + lint + 157 tests pass.
- Verified graceful states in the browser (validation, error, unsubscribe).

## SECTION B — MANUAL STEPS REQUIRED FROM YOU

1. **GoDaddy DNS / domain:** add `cms.semitree.in` to the Managed WordPress site
   (Step 2); do not touch `@`/`www`/NS.
2. **WordPress domain:** set Site/WordPress Address to `https://cms.semitree.in`;
   confirm media URLs updated (Step 3).
3. **SSL:** confirm the auto-provisioned cert for cms.semitree.in; force HTTPS.
4. **Launch** the site (disable Coming Soon) and **activate** the plugin.
5. **Email provider:** choose one; create the sending identity (Step 11).
6–7. **SPF / DKIM / DMARC:** add the provider's exact DNS records at GoDaddy (Step 11).
8. **Production env var** (optional): set `NEXT_PUBLIC_WORDPRESS_API_URL` in the
   deploy environment (default already targets cms.semitree.in).
9. **Deploy** the frontend (push to `main` → GitHub Pages).
10. **Final verification:** run the Step 12 checklist; only then is it production-ready.

DNS, production switch, and secrets remain entirely in your hands.
