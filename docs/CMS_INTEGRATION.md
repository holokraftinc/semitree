# Semitree ← WordPress (headless) integration

Phase 12 connects the existing Semitree frontend to the WordPress CMS (Phase 11)
**without changing DNS, deployment, or the existing UI**. WordPress provides
**data**; Semitree provides **presentation**.

## Model (why client-side)

Semitree is a **static export** on GitHub Pages — no server, no SSR, no API
routes. So CMS content is fetched **in the browser** (which the spec requires:
"public read-only content retrieved from the browser"). Benefits:

- Content appears/updates **live, with no rebuild** once WordPress is launched.
- The production build stays **fully decoupled** from the (currently 401) CMS —
  builds never fail if WordPress is down.
- Swapping to `https://cms.semitree.in` is a **one-line env change**.

## Configuration

| Variable | Purpose | Default |
|----------|---------|---------|
| `NEXT_PUBLIC_WORDPRESS_API_URL` | CMS base URL (public, read-only; not a secret) | `https://1265580.us28.myftpupload.com` |

- Read in `src/lib/wordpress/config.ts`. To go to production later:
  set `NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.semitree.in` and rebuild. No
  code changes. See `.env.example`.

## API service (`src/lib/wordpress/`)

The single place that talks to WordPress — never called from UI components directly.

- `config.ts` — env-driven base URL, the 5 content types → REST bases.
- `types.ts` — raw WP shape + normalized `CmsArticle`.
- `map.ts` — WP → `CmsArticle`, HTML decode/strip, defensive sanitize.
- `client.ts` — `fetchList()` / `fetchBySlug()` with **caching (memory +
  sessionStorage, 5-min TTL), request dedup, 8s timeout/abort, pagination via
  `X-WP-Total`/`X-WP-TotalPages`, field selection (`_fields`) so we never pull
  the whole DB, and stale-cache fallback on error**.

## WordPress endpoints used (all public GET, unauthenticated)

```
GET {base}/wp-json/wp/v2/articles      ?_fields=…&per_page=&page=&search=&domains=&content-tags=
GET {base}/wp-json/wp/v2/news
GET {base}/wp-json/wp/v2/explainers
GET {base}/wp-json/wp/v2/research
GET {base}/wp-json/wp/v2/analysis
GET {base}/wp-json/wp/v2/{type}?slug={slug}&_embed=wp:term   (detail)
```
Consumes the plugin's convenience fields `st_featured_image`, `st_author`,
`st_seo` (so lists stay light — no `_embed` needed for cards).

## Routes & components

- `/cms` — newsroom hub (static) linking the 5 types.
- `/cms/[type]` — static shell for each of the 5 types; client-renders a
  paginated **list**, or the **detail** view when `?slug=` is present.
- Detail reuses the Semitree article design (`CmsArticleView`): featured image,
  title/subtitle, author, date, sanitized body, tags/domains, client-applied SEO
  (title/description/OG/canonical — canonical always points at `semitree.in`).
- `/blog` gains a silent "Live from the newsroom" section + a newsroom link;
  it renders nothing while the CMS is empty/unreachable, so the blog is unchanged
  until content exists.

Existing `/articles/[slug]` (Phase-10 local content) is **untouched**.

> Pretty per-article URLs like `/articles/<slug>` served as static HTML would
> require build-time SSG from the CMS (a rebuild on every publish). That's
> available later if desired; the current client model was chosen for live
> updates + build decoupling on static hosting.

## Post-launch test checklist (run once WordPress is launched)

The CMS currently returns **HTTP 401** (site in GoDaddy "Coming Soon" mode), so
content checks can't pass yet. After you (1) launch the site, (2) activate the
Phase-11 plugin, (3) add the 5 test items:

```bash
BASE="https://1265580.us28.myftpupload.com"   # later: https://cms.semitree.in
for t in articles news explainers research analysis; do
  echo "$t -> $(curl -s -o /dev/null -w '%{http_code}' "$BASE/wp-json/wp/v2/$t")"
done
```

Then in the app (dev: `NEXT_PUBLIC_WORDPRESS_API_URL=$BASE npm run dev`):
`/cms/articles`, `/cms/news`, `/cms/explainers`, `/cms/research`, `/cms/analysis`
show items; open one → detail renders in Semitree design; drafts do **not**
appear; categories/domains/tags/author/featured image populate.

## Security

- Browser makes **only unauthenticated public GETs**. No passwords, application
  passwords, DB/hosting credentials, or Supabase keys are used or present.
- The CMS URL is public and safe to expose (it's a read endpoint).
- WP content HTML is sanitized before injection (scripts/handlers/`javascript:`).
