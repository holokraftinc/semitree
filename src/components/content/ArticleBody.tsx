import type { Block } from "@/lib/content/types";

/** Renders structured content blocks. Presentational; no raw HTML from data. */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className="pt-2 text-xl font-semibold tracking-tight">{b.text}</h2>
            );
          case "h3":
            return (
              <h3 key={i} className="pt-1 text-lg font-semibold tracking-tight">{b.text}</h3>
            );
          case "p":
            return (
              <p key={i} className="text-[15px] leading-relaxed text-foreground">{b.text}</p>
            );
          case "ul":
            return (
              <ul key={i} className="ml-5 list-disc space-y-1.5 text-[15px] leading-relaxed">
                {b.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="ml-5 list-decimal space-y-1.5 text-[15px] leading-relaxed">
                {b.items.map((it) => <li key={it}>{it}</li>)}
              </ol>
            );
          case "callout":
            return (
              <aside key={i} className="rounded-xl border border-brand/30 bg-brand/5 p-4">
                {b.title && <p className="text-sm font-semibold text-brand">{b.title}</p>}
                <p className="mt-1 text-[15px] leading-relaxed text-foreground">{b.text}</p>
              </aside>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-2 border-brand/40 pl-4 text-[15px] italic text-muted-foreground">
                {b.text}
                {b.cite && <cite className="mt-1 block text-xs not-italic">— {b.cite}</cite>}
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
