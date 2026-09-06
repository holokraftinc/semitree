# Semitree — Admin / CMS Architecture

Forward-looking design for how Semitree content will be managed as it grows to
multiple domains. **Nothing here is built in this phase** — it documents the
intended path so today's structured-data model stays compatible with it.

## 1. Today (no admin, no database)

- Content is **structured TypeScript data** in `src/lib/data` (+ domains in
  `src/lib/domains`).
- The site is a **static export** (`output: "export"`) deployed to GitHub Pages.
- There is **no database, no Supabase, no auth, no server** at runtime.
- "Publishing" = a `git push` → GitHub Actions builds and deploys.

This is fast, free, and safe for the current volume. The data is already shaped
so it can move behind a CMS/DB with no change to the component layer.

## 2. Design principles for a future CMS

1. **Data-first.** The CMS is a source of the same typed entities
   (Domain, Section, Tool, Lesson, Concept, Resource). Components never learn
   where data came from.
2. **Domain-scoped.** Every content item is tagged with `domainId`; editors work
   within a domain.
3. **Build-time or request-time, not both baked in.** Keep a clean data-access
   seam so we can stay static (fetch at build) or go dynamic (fetch at request)
   later.
4. **Auditable & safe.** Draft → review → publish; and an accuracy/licensing
   check gate (no fabricated references, no unlicensed files — see PRODUCT.md).

## 3. Options (to decide in a later phase)

| Option | Fits when | Notes |
|--------|-----------|-------|
| **Keep git-as-CMS** (MDX/JSON in repo, PRs) | small team, technical editors | zero new infra; static export stays |
| **Headless CMS** (e.g. a hosted content API) | non-technical editors | build-time fetch keeps static export |
| **Database + admin app** (e.g. Postgres/Supabase + an authed `/admin`) | dynamic content, submissions, directory listings, accounts | requires leaving pure static export; adds auth |

The directory (company/equipment listings, submissions) and any user accounts /
saved work are the features most likely to require option 3.

## 4. Proposed seam

Introduce a thin **content repository** interface later, e.g.:

```ts
interface ContentRepo {
  domains(): Promise<Domain[]>;
  tools(domainId): Promise<Tool[]>;
  lessons(domainId): Promise<Lesson[]>;
  concepts(domainId): Promise<Concept[]>;
  resources(domainId): Promise<Resource[]>;
}
```

Today's implementation reads the in-repo TS modules; a future implementation
reads a CMS/DB. Pages depend on the interface, not the source.

## 5. Auth (future, only if needed)

Not present today. Required only for an admin app, submissions, or user
accounts. When added, prefer a managed provider and keep public content
render-able without auth. Credentials/PII handling must follow the platform's
privacy rules (see ANALYTICS.md).

## 6. Out of scope for this phase

No admin UI, no CMS integration, no database, no auth. Architecture and
documentation only.
