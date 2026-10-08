import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SearchDialog } from "@/components/search/SearchDialog";
import { MainNav } from "./MainNav";
import { MobileNav } from "./MobileNav";

/** Sticky site header: wordmark, primary nav, a CTA, and mobile menu. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="rounded-sm text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Semi<span className="text-brand">tree</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center gap-2">
          <SearchDialog />
          {/* Newsletter is the right-side utility CTA. (No auth exists yet, so
              no Login is shown.) Hidden until xl so the primary nav has room. */}
          <ButtonLink
            href="/newsletter"
            size="sm"
            variant="outline"
            className="hidden xl:inline-flex"
          >
            Newsletter
          </ButtonLink>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
