# Downloadable files

Put downloadable resource files here. They are served at `/files/<name>` and
referenced from a resource's `fileUrl` in `src/lib/data/samples.ts`, e.g.:

```ts
{
  slug: "dimensionless-numbers-cheatsheet",
  title: "Dimensionless numbers cheat sheet",
  kind: "cheatsheet",
  description: "Re, Pe, Ca, We, Bo at a glance.",
  fileUrl: "/files/dimensionless-numbers.pdf",
  fileSize: "180 KB",
}
```

## Licensing rule — READ THIS

Only add files that are **free/open or that Semitree is licensed to
distribute**:

- Public-domain or Creative-Commons / open-access material.
- Content Semitree authored (cheat sheets, guides).
- Files with **explicit written permission** from the rights holder.

**Do NOT add copyrighted books, papers, or other material without permission**,
even if a copy is available for free somewhere online. Availability ≠ a licence
to redistribute.

## Host limits

GitHub Pages rejects any single file over **100 MB** and is unsuitable for very
large assets. Keep downloads small; host large media elsewhere.
