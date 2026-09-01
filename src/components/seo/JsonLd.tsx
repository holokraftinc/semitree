/**
 * Renders a JSON-LD structured-data script. Server component; `data` is a
 * schema.org document (typically from `jsonLdGraph`).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (our own trusted data).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
