import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { FilmStackBuilder } from "@/components/tools/semi/FilmStackBuilder";
import { SemiToolSeo } from "@/components/seo/SemiToolSeo";
import { TrackView } from "@/components/analytics/TrackView";
import { pageMeta } from "@/lib/seo";
import { ToolEcosystem } from "@/components/tools/ToolEcosystem";

export const metadata: Metadata = pageMeta({
  title: "Film stack builder",
  description:
    "Build a multi-layer thin-film stack, compute total thickness, and visualize the layers on a substrate.",
  path: "/semiconductors/tools/film-stack",
});

export default function Page() {
  return (
    <Container className="py-10">
      <SemiToolSeo slug="film-stack" />
      <TrackView event="tool_opened" payload={{ tool: "film-stack" }} />
      <FilmStackBuilder />
      <ToolEcosystem slug="film-stack" />
    </Container>
  );
}
