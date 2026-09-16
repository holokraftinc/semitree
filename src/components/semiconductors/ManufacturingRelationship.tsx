import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { LinkRef, ProcessLink } from "@/lib/knowledge/process-links";

/**
 * Renders the cross-domain relationship for one manufacturing process:
 *
 *   PROCESS + EQUIPMENT + MATERIAL + CONTROL + METROLOGY = MANUFACTURING RESULT
 *
 * Presentational only. Shown on Equipment and Material topic pages so each page
 * surfaces USED IN / PERFORMED BY / REQUIRES / MEASURED BY / AFFECTS / LEARN
 * NEXT. The current page's own entity is rendered as plain text (not a
 * self-link).
 */

function Chips({
  refs,
  base,
  currentSlug,
}: {
  refs: LinkRef[];
  base: string;
  currentSlug?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {refs.map((r) =>
        r.slug === currentSlug ? (
          <span
            key={r.slug}
            aria-current="page"
            className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-sm font-medium text-brand"
          >
            {r.label} (this page)
          </span>
        ) : (
          <Link
            key={r.slug}
            href={`${base}/${r.slug}`}
            className="rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {r.label} →
          </Link>
        ),
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

export function ManufacturingRelationship({
  link,
  currentSlug,
  currentKind,
}: {
  link: ProcessLink;
  currentSlug?: string;
  currentKind?: "equipment" | "material";
}) {
  const eqCurrent = currentKind === "equipment" ? currentSlug : undefined;
  const matCurrent = currentKind === "material" ? currentSlug : undefined;

  return (
    <Card className="border-brand/20 bg-muted/20 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">
        How this fits into manufacturing
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        A result is never the equipment alone. For{" "}
        <span className="font-medium">{link.process}</span>, it comes from{" "}
        <span className="font-medium text-foreground">
          process + equipment + material + control + metrology
        </span>{" "}
        together.
      </p>

      <div className="mt-4 space-y-3">
        {link.manufacturingSlug && (
          <Row label="Used in">
            <Link
              href={`/manufacturing/${link.manufacturingSlug}`}
              className="font-medium text-brand hover:underline"
            >
              {link.process} process →
            </Link>
            {link.conceptLesson && (
              <>
                {"  ·  "}
                <Link
                  href={`/semiconductors/learn/${link.conceptLesson}`}
                  className="text-brand hover:underline"
                >
                  concept →
                </Link>
              </>
            )}
          </Row>
        )}
        {link.equipment.length > 0 && (
          <Row label="Performed by">
            <Chips refs={link.equipment} base="/semiconductors/equipment" currentSlug={eqCurrent} />
          </Row>
        )}
        {link.materials.length > 0 && (
          <Row label="Requires">
            <Chips refs={link.materials} base="/semiconductors/materials" currentSlug={matCurrent} />
          </Row>
        )}
        {link.metrology.length > 0 && (
          <Row label="Measured by">
            <Chips refs={link.metrology} base="/semiconductors/equipment" currentSlug={eqCurrent} />
          </Row>
        )}
        <Row label="Affects">{link.affects}</Row>
        {link.supplyChain && (
          <Row label="Supply chain">
            <Link href="/supply-chain" className="font-medium text-brand hover:underline">
              Suppliers & ecosystem →
            </Link>
          </Row>
        )}
        {link.next && (
          <Row label="Learn next">
            <Link href={link.next.href} className="font-medium text-brand hover:underline">
              {link.next.label} →
            </Link>
          </Row>
        )}
      </div>
    </Card>
  );
}
