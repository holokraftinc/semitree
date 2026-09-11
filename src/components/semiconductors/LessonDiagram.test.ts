import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonDiagram } from "./LessonDiagram";
import type { LessonVisualKey } from "@/lib/knowledge/semi-lessons";

// Every declared visual key must have a real diagram branch (not fall back to null).
const KEYS: LessonVisualKey[] = [
  "energy-bands",
  "pn-junction",
  "mosfet",
  "wafer-flow",
  "doping",
  "cmos",
  "wafer-to-package",
  "wire-bonding",
  "flip-chip",
  "2-5d",
  "3d-ic",
  "chiplets",
];

describe("LessonDiagram", () => {
  it("renders a labelled <svg> for every visual key", () => {
    for (const key of KEYS) {
      const html = renderToStaticMarkup(createElement(LessonDiagram, { visualKey: key }));
      expect(html, `no svg for ${key}`).toContain("<svg");
      expect(html, `no aria-label for ${key}`).toContain('role="img"');
      expect(html, `empty aria-label for ${key}`).toMatch(/aria-label="[^"]{10,}"/);
    }
  });
});
