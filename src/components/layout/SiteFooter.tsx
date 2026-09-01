import Link from "next/link";
import { Container } from "@/components/ui/Container";

const FOOTER_SECTIONS = [
  {
    title: "Tools",
    links: [{ href: "/tools", label: "All tools" }],
  },
  {
    title: "Learn",
    links: [
      { href: "/learn", label: "Curriculum" },
      { href: "/concepts", label: "Concepts glossary" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resources", label: "Reading list" },
      { href: "/directory", label: "Directory" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/newsletter", label: "Newsletter" },
    ],
  },
] as const;

/** Site footer with grouped links, wordmark, and the accuracy note. */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/30">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-1">
            <Link
              href="/"
              className="rounded-sm text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Semi<span className="text-brand">tree</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Learn microfluidics and design your chip in the same place.
              Learn → Calculate → Understand → Apply.
            </p>
          </div>
          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <p className="text-sm font-semibold text-foreground">
                {section.title}
              </p>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="rounded-sm text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            All calculators use standard, published fluid-mechanics equations.
            Always verify against primary sources for critical work.
          </p>
          <p className="mt-2">
            Semitree · A Holokraft Apps
          </p>
        </div>
      </Container>
    </footer>
  );
}
