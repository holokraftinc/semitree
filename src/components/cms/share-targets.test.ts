import { describe, expect, it } from "vitest";
import { buildShareTargets } from "./share-targets";

const URL = "https://semitree.in/insights/articles/?slug=my-post";
const TITLE = "India's Semiconductor Push & You";

describe("buildShareTargets", () => {
  const targets = buildShareTargets(URL, TITLE);
  const byKey = Object.fromEntries(targets.map((t) => [t.key, t]));

  it("returns the five web-share networks", () => {
    expect(targets.map((t) => t.key)).toEqual(["facebook", "linkedin", "x", "whatsapp", "email"]);
  });

  it("encodes the URL and title into every target", () => {
    const encUrl = encodeURIComponent(URL);
    const encTitle = encodeURIComponent(TITLE);
    expect(byKey.facebook.href).toContain(encUrl);
    expect(byKey.linkedin.href).toContain(encUrl);
    expect(byKey.x.href).toContain(encUrl);
    expect(byKey.x.href).toContain(encTitle);
    expect(byKey.whatsapp.href).toContain(encodeURIComponent(`${TITLE} ${URL}`));
    expect(byKey.email.href).toContain(encTitle);
  });

  it("uses correct share intents and mailto is not external", () => {
    expect(byKey.facebook.href.startsWith("https://www.facebook.com/sharer/")).toBe(true);
    expect(byKey.linkedin.href.startsWith("https://www.linkedin.com/sharing/")).toBe(true);
    expect(byKey.whatsapp.href.startsWith("https://wa.me/")).toBe(true);
    expect(byKey.email.href.startsWith("mailto:")).toBe(true);
    expect(byKey.email.external).toBe(false);
    for (const k of ["facebook", "linkedin", "x", "whatsapp"] as const) {
      expect(byKey[k].external).toBe(true);
    }
  });

  it("does not leak raw spaces or unencoded query chars into hrefs", () => {
    for (const t of targets) {
      expect(t.href).not.toMatch(/\s/);
    }
  });
});
