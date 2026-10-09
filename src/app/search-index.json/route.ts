import { buildSearchIndex } from "@/lib/search";

/**
 * Static search index, emitted at build time as /search-index.json.
 * The client search dialog fetches this once (on first open) so the heavy
 * registries never ship in the page bundle.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex());
}
