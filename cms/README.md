# Semitree Headless CMS (WordPress)

Phase 11 turns the existing GoDaddy Managed WordPress install into the **Semitree
headless CMS**. WordPress manages **content only**; the existing Semitree
frontend at **https://semitree.in** keeps full control of UI, layout,
navigation, design, search, maps, and learning/knowledge interfaces.

```
You → WordPress Admin → Semitree CMS → WordPress REST API → Semitree frontend → semitree.in
```

Everything is delivered as **config-as-code**: one lightweight plugin
(`semitree-cms/`) — no ACF, no CPT-UI, no page-builder, no theme changes. It is
version-controlled here in the Semitree repo.

> **DNS, GitHub Pages, and the public site are untouched.** Nothing here points
> `semitree.in` at WordPress. This phase stops before frontend integration.

---

## Step 1 — Inspection findings (remote, read-only)

Determined from the public surface of `https://1265580.us28.myftpupload.com`
without logging in:

| # | Item | Finding |
|---|------|---------|
| 1 | WordPress version | Ships the **Twenty Twenty-Five** theme → **WP 6.7+** (exact version needs wp-admin) |
| 2 | PHP version | **Needs wp-admin** (Tools → Site Health → Info) |
| 3 | Active theme | **Twenty Twenty-Five** (default; irrelevant for headless) |
| 4 | Installed plugins | **Needs wp-admin** |
| 6 | REST API status | **Currently returns HTTP 401 for all endpoints** — the site is in GoDaddy's **"Coming Soon" / launch-pending mode** (its placeholder page is served at the edge). REST must be reachable for headless to work → see manual steps. |
| 9 | SSL/HTTPS | **Working** (HTTP/2, Cloudflare edge in front of GoDaddy MWP) |
| — | XML-RPC | **Already blocked** at the edge (HTTP 403) ✓ |
| — | Host | **GoDaddy Managed WordPress** (us28), Cloudflare CDN |
| 5,7,8,10–15 | Available plugins, roles, media, GoDaddy caps, CPT/field capability, API auth, caching, backups | **Need wp-admin** — see "Manual steps" |

**No plugins were installed remotely** (per instruction — assess first). The
Semitree CMS is one small plugin you install once.

---

## Install (manual — needs your wp-admin)

1. In this repo, the plugin is `cms/semitree-cms/`. A ready-to-upload
   `cms/semitree-cms.zip` is included.
2. wp-admin → **Plugins → Add New → Upload Plugin** → choose `semitree-cms.zip`
   → **Install** → **Activate**.
   - On activation it registers all content types/taxonomies, **seeds the
     taxonomy terms** (Semiconductors tree + Microfluidics + difficulty levels +
     example tags), and flushes permalinks.
3. Confirm the **Semitree CMS** menu appears in the admin sidebar.

(GoDaddy Managed WordPress allows custom plugin uploads. If your plan blocks
uploads, use SFTP/File Manager to drop the `semitree-cms` folder into
`wp-content/plugins/`, then activate.)

---

## What the plugin provides

- **Content types** (Step 2): Articles, Industry News, Explainers, Research
  Insights, Industry Analysis — each with the exact fields in the spec, as native
  post meta (title, body, featured image, author, dates are native WP).
- **Taxonomy** (Step 3): hierarchical **Domains** (Semiconductors + 40+
  sub-domains, and **Microfluidics preserved** with its 6 categories),
  **Categories**, **Topics**, **Difficulty levels**, and flexible **Tags** —
  all expandable in wp-admin, none hard-coded in the frontend.
- **Authors** (Step 4): profile fields (long bio, organization, LinkedIn,
  website, expertise, photo) with a public-safe REST profile.
- **Tags** (Step 5): flexible tagging, seeded with examples (TSMC, EUV, …).
- **Statuses** (Step 6): Draft, **In Review** (native Pending), **Scheduled**
  (native Future), Published, and a custom **Archived** status (Archive /
  Unarchive row + bulk actions). Archived and drafts are **not public**.
- **Media** (Step 7): native Media Library; alt-text hint added; nothing is
  auto-downloaded.
- **SEO** (Step 8): per-item SEO title/description, canonical, OG title/description,
  social image — plus a resolved `st_seo` REST object whose **canonical always
  defaults to `https://semitree.in/<type>/<slug>`**, never the CMS host.
- **REST API** (Step 9): custom bases `articles`, `news`, `explainers`,
  `research`, `analysis`, plus `domains`, `content-categories`, `topics`,
  `content-tags`, `difficulty-levels`; convenience read-fields for featured
  image, resolved SEO, and author. Only **published, public** content is served
  to unauthenticated requests.
- **Clean slugs** (Step 10): each type has a matching slug; the frontend builds
  the final public URL. WP renders no public UI (no archives).
- **Admin experience** (Step 11): single **Semitree CMS** menu with a dashboard
  (published/draft counts, subscribers, recent content, "analytics not
  connected"), grouped content, **Audience → Subscribers** (private store,
  never public), and **Semitree Settings**. Default **Posts** and **Comments**
  are hidden and comments disabled.
- **Security** (Step 12): XML-RPC disabled, version generator removed, author
  enumeration blocked, REST user responses stripped of email/roles/username for
  unauthenticated callers, subscriber store excluded from REST. The REST API is
  **not** disabled (headless needs it); it simply only serves public content.

---

## Test plan (Step 15) — run after install **and** after the site is launched

Replace `BASE` with the CMS host (temporary today, `https://cms.semitree.in`
later). These are unauthenticated GET requests — exactly what the frontend does.

```bash
BASE="https://1265580.us28.myftpupload.com"

# REST reachable at all (must NOT be 401 once the site is launched):
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/wp-json/"

# Each content type endpoint exists and returns only published items:
for t in articles news explainers research analysis; do
  echo "$t: $(curl -s -o /dev/null -w '%{http_code}' "$BASE/wp-json/wp/v2/$t")"
done

# Taxonomies:
for x in domains content-categories topics content-tags difficulty-levels; do
  echo "$x: $(curl -s -o /dev/null -w '%{http_code}' "$BASE/wp-json/wp/v2/$x")"
done

# Draft must NOT be public (create a draft article, then):
curl -s "$BASE/wp-json/wp/v2/articles?status=publish" | grep -c '"id"'   # published only
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/wp-json/wp/v2/articles?status=draft"  # 401 for unauth

# Credentials/private must NOT leak:
curl -s "$BASE/wp-json/wp/v2/users" | grep -i '"email"' && echo "LEAK" || echo "no email exposed (good)"
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/wp-json/wp/v2/st_subscriber"  # 404 (never registered publicly)
```

**Expected:** published → 200 with items; draft/private → not returned to
unauthenticated callers; no email/credentials in any public response.

Create the five test items in wp-admin (Article, News, Explainer, Research,
Analysis) with a category, domain, tags, author, featured image, slug, and SEO
fields; save one as **Draft** and one as **Published**; then run the above.

---

## FINAL REPORT

### CLAUDE COMPLETED (in this repo, config-as-code)
1. **Remote inspection** of the live install (version/theme/SSL/REST/XML-RPC/host).
2. **`semitree-cms` plugin** implementing Steps 2–12: 5 content types, full field
   sets, expandable Domains taxonomy (Semiconductors + Microfluidics preserved),
   Categories/Topics/Tags/Difficulty, author profiles, statuses incl. Archived,
   REST bases + convenience fields, canonical-to-`semitree.in` SEO resolver,
   grouped admin + dashboard + settings + subscribers, and security hardening.
3. **Term seeding** on activation (domains, difficulty, example tags).
4. **Structural validation** of all PHP (brace/paren balance) — passed. (A live
   `php -l` / activation is the final confirmation; see manual steps.)
5. **Test plan** with copy-paste verification commands.

### MANUAL STEPS REQUIRED FROM YOU (need wp-admin / hosting login)
- **Install & activate** `semitree-cms.zip` (above). Confirm no activation error.
- **Set a strong admin password** and, ideally, add 2FA.
- In **Semitree Settings**, confirm the public base is `https://semitree.in`.
- Record from **Tools → Site Health → Info**: PHP version, WP version, memory —
  and remove any unused plugins/themes GoDaddy pre-installed (keep Twenty
  Twenty-Five as the fallback theme; a headless site still needs one theme).
- Create the **5 test items** and run the **test plan**.
- Decide author accounts/roles (create authors as WordPress users; fill the
  Semitree author profile fields).

### REQUIRES GODADDY (dashboard, not wp-admin)
- **Launch the site / disable "Coming Soon"** — this is why the REST API returns
  401 today. Until the site is launched, headless endpoints are blocked at the
  edge. (GoDaddy dashboard → your Managed WordPress site → **Launch**.)
- **Backups**: confirm what your Managed WordPress plan includes — GoDaddy MWP
  typically provides **daily automatic backups with ~30-day retention and
  one-click restore** (Files + Database), but **verify this on your plan** and
  note the retention/restore path. If your plan's retention is short, the
  simplest reliable add-on is **UpdraftPlus** to an external destination
  (Drive/S3) on a daily schedule — one plugin only, no overlap.
- **Do NOT** change any DNS, A, CNAME, or the `semitree.in` / GitHub Pages
  records. The future `cms.semitree.in` mapping is a **later** phase.

### REQUIRED IN THE SEMITREE GITHUB PROJECT
- **Nothing this phase** (frontend integration is explicitly out of scope).
- For later: the frontend will read `/<host>/wp-json/wp/v2/{articles,news,…}`,
  use the `st_seo.canonical` (already forced to `semitree.in`), and should set
  the CMS host via an env var (e.g. `NEXT_PUBLIC_CMS_URL`) so switching from the
  temporary host to `https://cms.semitree.in` is a one-line change.

---

## Rebuilding the zip from source

```bash
cd cms && rm -f semitree-cms.zip && zip -r semitree-cms.zip semitree-cms -x '*.DS_Store'
```
