import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * Industry voices — conversations with the people building the ecosystem. The
 * interview series is being started; this section frames it honestly and invites
 * participation rather than showing fabricated quotes.
 */
const VOICES = [
  "Engineers",
  "Founders",
  "Manufacturing leaders",
  "Suppliers",
  "Researchers",
  "Investors",
];

export function IndustryVoices() {
  return (
    <section aria-labelledby="voices-h" className="border-b border-border">
      <Container className="py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Industry voices</p>
          <h2 id="voices-h" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Conversations with the people building it
          </h2>
          <p className="mt-3 text-muted-foreground">
            Perspectives from across the ecosystem — the engineers, founders, manufacturers, suppliers, researchers, and
            investors shaping India&rsquo;s semiconductor future. The interview series is just beginning.
          </p>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          {VOICES.map((v) => (
            <li key={v} className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
              {v}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/insights" className="text-sm font-medium text-brand hover:underline">
            Read insights →
          </Link>
          <Link href="/submit" className="text-sm font-medium text-brand hover:underline">
            Share your perspective →
          </Link>
        </div>
      </Container>
    </section>
  );
}
