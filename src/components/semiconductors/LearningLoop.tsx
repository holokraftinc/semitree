import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { TopicLink } from "@/lib/knowledge/equipment-topics";

/**
 * The curiosity-driven learning loop shown at the end of a substantial topic.
 * Leads with what the reader just learned and what it unlocks, then offers
 * educationally relevant pathways to continue. Presentational only — the caller
 * derives the pathways from the topic's existing cross-links, so no unrelated
 * "keep clicking" recommendations are produced here.
 */

function Chips({ links }: { links: TopicLink[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) =>
        l.href ? (
          <Link
            key={l.label}
            href={l.href}
            className="rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {l.label} →
          </Link>
        ) : (
          <span key={l.label} className="rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground">
            {l.label}
          </span>
        ),
      )}
    </div>
  );
}

function PathRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

export function LearningLoop({
  youJustLearned,
  nowYouKnow,
  learnNext,
  seeProcess,
  understandMaterial,
  understandMachine,
  hasAdvanced,
  backHref,
  backLabel,
}: {
  youJustLearned: string[];
  nowYouKnow?: string;
  learnNext?: TopicLink[];
  seeProcess?: { label: string; href: string };
  understandMaterial?: TopicLink[];
  understandMachine?: TopicLink[];
  hasAdvanced?: boolean;
  backHref: string;
  backLabel: string;
}) {
  return (
    <Card className="border-brand/30 bg-brand/5 p-6">
      <div className="space-y-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">You just learned</h2>
          <ul className="mt-2 space-y-2">
            {youJustLearned.map((it, i) => (
              <li key={i} className="flex gap-2 leading-relaxed text-foreground">
                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>

        {nowYouKnow && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Now you know</h3>
            <p className="mt-1 leading-relaxed text-foreground">{nowYouKnow}</p>
          </div>
        )}

        <div className="space-y-3 border-t border-border pt-4">
          {learnNext && learnNext.length > 0 && (
            <PathRow label="Learn next"><Chips links={learnNext} /></PathRow>
          )}
          {seeProcess && (
            <PathRow label="See the process">
              <Link href={seeProcess.href} className="font-medium text-brand hover:underline">
                {seeProcess.label} →
              </Link>
            </PathRow>
          )}
          {understandMaterial && understandMaterial.length > 0 && (
            <PathRow label="Understand the material"><Chips links={understandMaterial} /></PathRow>
          )}
          {understandMachine && understandMachine.length > 0 && (
            <PathRow label="Understand the machine"><Chips links={understandMachine} /></PathRow>
          )}
          {hasAdvanced && (
            <PathRow label="Go deeper">
              <a href="#advanced" className="font-medium text-brand hover:underline">
                Advanced &amp; research →
              </a>
            </PathRow>
          )}
          <PathRow label="Explore the industry">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/semiconductors/ecosystem" className="font-medium text-brand hover:underline">Ecosystem →</Link>
              <Link href="/supply-chain" className="font-medium text-brand hover:underline">Supply chain →</Link>
              <Link href="/industry" className="font-medium text-brand hover:underline">Industry →</Link>
            </div>
          </PathRow>
        </div>

        <Link href={backHref} className="inline-block text-sm font-medium text-brand hover:underline">
          ← {backLabel}
        </Link>
      </div>
    </Card>
  );
}
