/**
 * Renders a JSON-LD structured-data script. Server component; `data` is a
 * schema.org document (typically from `jsonLdGraph`).
 *
 * `<`, `>` and `&` are escaped to their \\uXXXX form so a value containing a
 * stray `</script>` can never break out of the script element (the standard
 * JSON-LD XSS hardening). The result is still valid JSON. Defense in depth even
 * though the data is our own.
 */
function escapeForScript(json: string): string {
  return json.replace(/[<>&]/g, (ch) => "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0"));
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeForScript(JSON.stringify(data)) }}
    />
  );
}
