import type { Author } from "./types";

/**
 * Authors. Semitree's content is published under the Semitree byline (its own
 * original editorial), not attributed to invented individual personas. The
 * Author entity is structured so real, consenting authors/editors can be added
 * later.
 */
export const AUTHORS: Author[] = [
  {
    id: "semitree",
    name: "Semitree",
    bio: "Original explainers, tutorials, and analysis from the Semitree editorial team — a Holokraft app.",
  },
];

const BY_ID = new Map(AUTHORS.map((a) => [a.id, a]));

export function getAuthor(id: string): Author | undefined {
  return BY_ID.get(id);
}
