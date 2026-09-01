# Semitree — Deployment

Target: **GitHub → Vercel**, free tier (per the Plan). Cost to launch is a
domain (~$10–15/yr); everything else is free at this scale.

## 1. Prerequisites

- Node.js ≥ 18.18 (developed on Node 24, npm 11).
- A GitHub account and a Vercel account.

## 2. Local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build locally
```

## 3. Repository (GitHub)

Phase 01 does not create commits automatically. To put this on GitHub:

```bash
git init
git add .
git commit -m "Phase 01: foundation & architecture"
git branch -M main
git remote add origin git@github.com:<you>/semitree.git
git push -u origin main
```

`.gitignore` already excludes `node_modules`, `.next`, env files, and
`.vercel`.

## 4. Vercel

1. In Vercel, **Add New → Project** and import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. Build command: `next build` (default). Output: `.next` (default). Install:
   `npm install` (default).
4. Deploy. Vercel gives a `*.vercel.app` URL immediately.
5. Every push to `main` → production deploy; every PR → a preview deploy.

No environment variables are required in Phase 01.

## 5. Custom domain

Add the domain in Vercel → Project → Settings → Domains and follow the DNS
instructions. Vercel provisions TLS automatically.

**Set `NEXT_PUBLIC_SITE_URL`** to the production origin (e.g.
`https://semitree.com`) in Vercel → Settings → Environment Variables. It is the
base for canonical URLs, OpenGraph URLs, `sitemap.xml`, and `robots.txt`. Until
set, it falls back to the reserved placeholder `https://semitree.example.com`,
so canonicals/sitemap will point at the placeholder domain — remember to set it
before launch.

## 6. Analytics & newsletter (later)

- **Analytics:** Plausible or GA4 — add the script/env in a later phase.
- **Newsletter:** a free-tier email tool — signup form + integration later.

Neither is wired in Phase 01.

## 7. Environments

| Environment | Trigger                | URL |
|-------------|------------------------|-----|
| Production  | push to `main`         | custom domain / `*.vercel.app` |
| Preview     | pull request           | per-PR preview URL |
| Local       | `npm run dev`          | `localhost:3000` |

## 8. Rollback

Vercel keeps every deployment; use **Instant Rollback** in the dashboard to
promote a previous deployment if a release regresses.
