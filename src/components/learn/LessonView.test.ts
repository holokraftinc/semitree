import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonView } from "./LessonView";
import { LESSONS, type LessonContent } from "@/lib/data/lessons";

function render(lesson: LessonContent): string {
  return renderToStaticMarkup(createElement(LessonView, { lesson }));
}

/** A module that exercises every standardized (optional) section. */
const fullModule: LessonContent = {
  slug: "test-full-module",
  title: "Test Full Module",
  level: 1,
  order: 99,
  summary: "A module exercising every standardized section.",
  quickStart: ["Takeaway one", "Takeaway two", "Takeaway three"],
  whatYoullLearn: ["Objective A"],
  intuition: ["An everyday analogy."],
  concept: ["The scientifically correct definition."],
  whyItMatters: ["It matters because…"],
  howItWorks: ["Step one", "Step two"],
  equation: { expression: "Re = ρvD/μ", caption: "Reynolds number" },
  variables: [{ symbol: "Re", name: "Reynolds number", unit: "—" }],
  equationAssumptions: ["Newtonian, incompressible fluid."],
  dimensionless: { high: "Inertia dominates.", low: "Viscosity dominates.", competing: "It is the ratio of inertial to viscous forces." },
  workedExample: { intro: ["Plug in numbers."], math: "Re = 1", conclusion: "Laminar." },
  microfluidicExample: ["In a 100 µm channel…"],
  designImplications: ["Pick channel width to stay laminar."],
  commonMistakes: ["Assuming turbulence at the microscale."],
  researcherNotes: ["Transition Re in microchannels can differ from pipe flow."],
  relatedConceptSlugs: ["reynolds-number"],
  relatedToolSlugs: ["reynolds-number"],
  furtherReading: [
    { title: "A review", author: "Author", year: 2010, publisher: "Journal", url: "https://example.org/review", doi: "10.0000/example" },
  ],
};

describe("LessonView — standardized module structure", () => {
  it("renders every standardized section when the fields are present", () => {
    const html = render(fullModule);
    for (const marker of [
      "If you only remember three things",
      "Intuition",
      "How it works",
      "Assumptions",
      "Reading the number",
      "High value",
      "Low value",
      "Microfluidic example",
      "Practical design implications",
      "Common mistakes",
      "Researcher notes",
      "Further reading",
    ]) {
      expect(html, `expected section: ${marker}`).toContain(marker);
    }
    // A reference with a url renders as a link + DOI link.
    expect(html).toContain("https://example.org/review");
    expect(html).toContain("doi.org/10.0000/example");
    // Researcher notes are collapsible.
    expect(html).toContain("<details");
  });

  it("renders the surface-tension lesson with its equation, sections and DOI references", () => {
    const lesson = LESSONS.find((l) => l.slug === "surface-tension-wetting-capillarity");
    expect(lesson).toBeDefined();
    const html = render(lesson!);
    // Young's equation expression and its contact-angle symbol.
    expect(html).toContain("γₛᵥ = γₛₗ + γₗᵥ · cos θ");
    // Standardized sections are present.
    for (const marker of [
      "If you only remember three things",
      "Intuition",
      "How it works",
      "Reading the number",
      "Microfluidic example",
      "Practical design implications",
      "Researcher notes",
    ]) {
      expect(html, `expected section: ${marker}`).toContain(marker);
    }
    // Every reference with a DOI renders a resolvable doi.org link (no fabricated bare text).
    for (const doi of [
      "10.1098/rstl.1805.0005",
      "10.1103/PhysRev.17.273",
      "10.1103/RevModPhys.77.977",
      "10.1146/annurev.fluid.36.050802.122124",
      "10.1038/nature05058",
      "10.1021/ac9013989",
    ]) {
      expect(html, `expected DOI link: ${doi}`).toContain(`https://doi.org/${doi}`);
    }
    // Related concepts link only to real glossary slugs.
    expect(html).toContain("/concepts/surface-tension");
    expect(html).toContain("/concepts/bond-number");
  });

  it("renders the dimensionless-numbers lesson with all five numbers, calculator links and DOIs", () => {
    const lesson = LESSONS.find((l) => l.slug === "dimensionless-numbers");
    expect(lesson).toBeDefined();
    const html = render(lesson!);
    // All five numbers are named in the how-it-works breakdown.
    for (const name of ["Reynolds", "Péclet", "Capillary", "Weber", "Bond"]) {
      expect(html, `expected number: ${name}`).toContain(name);
    }
    // The featured Reynolds equation renders.
    expect(html).toContain("Re = ρUL/μ = UL/ν");
    // Links to existing calculators (no duplicate calculator created).
    expect(html).toContain("/tools/reynolds-number");
    expect(html).toContain("/tools/diffusion-time");
    expect(html).toContain("/tools/hydraulic-diameter");
    // Related concepts link only to real glossary slugs.
    for (const slug of ["reynolds-number", "peclet-number", "capillary-number", "weber-number", "bond-number"]) {
      expect(html, `expected concept link: ${slug}`).toContain(`/concepts/${slug}`);
    }
    // Every DOI reference resolves through doi.org.
    for (const doi of [
      "10.1103/RevModPhys.77.977",
      "10.1146/annurev.fluid.36.050802.122124",
      "10.1119/1.10903",
      "10.1126/science.1066238",
      "10.1039/b510841a",
      "10.1039/c001191f",
    ]) {
      expect(html, `expected DOI link: ${doi}`).toContain(`https://doi.org/${doi}`);
    }
  });

  it("renders the PDMS lesson with the workflow, limitations, material comparison and DOIs", () => {
    const lesson = LESSONS.find((l) => l.slug === "pdms-soft-lithography");
    expect(lesson).toBeDefined();
    expect(lesson!.level).toBe(2);
    const html = render(lesson!);
    // The workflow steps appear (How it works).
    for (const step of ["Photolithography", "SU-8", "Casting", "Demolding", "Bonding", "Surface treatment"]) {
      expect(html, `expected workflow step: ${step}`).toContain(step);
    }
    // Limitations and the researcher material comparison are present.
    for (const marker of ["absorption", "Hydrophobic recovery", "Versus glass", "Versus silicon", "Versus thermoplastics"]) {
      expect(html, `expected marker: ${marker}`).toContain(marker);
    }
    // The one exact process condition is present and labelled as an example.
    expect(html).toContain("10:1");
    expect(html).toContain("example process condition");
    // Related concepts link only to real glossary slugs; no fabrication calculator is invented.
    expect(html).toContain("/concepts/pdms");
    expect(html).toContain("/concepts/soft-lithography");
    expect(html).not.toContain("Related tools");
    // Every DOI reference resolves through doi.org.
    for (const doi of [
      "10.1146/annurev.matsci.28.1.153",
      "10.1021/ac980656z",
      "10.1021/ar010110q",
      "10.1088/0960-1317/17/6/R01",
      "10.1039/b612140c",
      "10.1021/ac0346712",
      "10.1039/c2lc20982a",
      "10.1007/s00216-007-1692-2",
    ]) {
      expect(html, `expected DOI link: ${doi}`).toContain(`https://doi.org/${doi}`);
    }
  });

  it("does NOT render new optional sections for an existing lesson (regression)", () => {
    const existing = LESSONS.find((l) => l.slug === "what-is-microfluidics");
    expect(existing).toBeDefined();
    const html = render(existing!);
    // Existing base sections still render.
    expect(html).toContain("The concept");
    expect(html).toContain("Why it matters");
    // None of the new standardized sections appear (they set no new fields).
    for (const absent of [
      "If you only remember three things",
      "How it works",
      "Researcher notes",
      "Practical design implications",
      "Reading the number",
      "<details",
    ]) {
      expect(html, `should not contain: ${absent}`).not.toContain(absent);
    }
  });
});
