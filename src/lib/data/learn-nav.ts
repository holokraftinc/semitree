/**
 * Data-driven Previous/Next for the microfluidics Learn curriculum.
 *
 * The learning sequence follows the curriculum outline (CURRICULUM) — the
 * intended order, grouped by level — not arbitrary URL order. Neighbors are
 * computed WITHIN the lesson's level so navigation never crosses into an
 * unrelated part of the path. Mirrors the semiconductor `lessonNeighbors` shape.
 */
import { CURRICULUM } from "./curriculum";
import { getLesson } from "./lessons";

export interface NavTopic {
  slug: string;
  title: string;
  summary: string;
}

export interface MicroNeighbors {
  prev?: NavTopic;
  next?: NavTopic;
  /** The level (module group) this topic belongs to, e.g. "Physics Foundations". */
  levelTitle?: string;
  /** 1-based position within the level, and the level's topic count. */
  index?: number;
  total?: number;
}

function toTopic(slug: string | undefined): NavTopic | undefined {
  if (!slug) return undefined;
  const l = getLesson(slug);
  return l ? { slug: l.slug, title: l.title, summary: l.summary } : undefined;
}

export function microLessonNeighbors(slug: string): MicroNeighbors {
  for (const level of CURRICULUM) {
    // Ordered lesson slugs in this level that actually have written content.
    const slugs = level.modules
      .map((m) => m.lessonSlug)
      .filter((s): s is string => Boolean(s) && Boolean(getLesson(s as string)));
    const i = slugs.indexOf(slug);
    if (i === -1) continue;
    return {
      levelTitle: level.title,
      index: i + 1,
      total: slugs.length,
      prev: toTopic(slugs[i - 1]),
      next: toTopic(slugs[i + 1]),
    };
  }
  return {};
}
