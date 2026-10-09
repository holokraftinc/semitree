import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { FilmThicknessCalculator } from "@/components/tools/semi/FilmThicknessCalculator";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Film thickness / volume calculator",
  description:
    "Relate thin-film thickness, area, and volume (V = thickness x area); solve for the missing quantity.",
  path: "/semiconductors/tools/film-thickness",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="film-thickness" />
      <TrackView event="tool_opened" payload={{ tool: "film-thickness" }} />
      <FilmThicknessCalculator />
      <ToolEcosystem slug="film-thickness" />
    </Container>
  );
}
