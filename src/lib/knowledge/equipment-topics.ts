/**
 * Individual semiconductor equipment topics — the reusable educational template.
 *
 * One data object per equipment topic, rendered by EquipmentTopicView. Every
 * section is OPTIONAL and gated, so a topic only shows what it has. Content is
 * educational and qualitative: NO fabricated throughput, resolution, accuracy,
 * cost, process windows, or vendor/company capabilities — where a value is
 * technology/vendor/process dependent, the text says so. Reuse cross-links via
 * lesson slugs (validated in equipment-topics.test.ts).
 */

export interface NamedItem {
  name: string;
  detail: string;
}

export interface TopicLink {
  label: string;
  href?: string;
}

export interface EquipmentTopic {
  slug: string;
  title: string;
  summary: string;
  /** Links back to its hub category (equipment-map.ts). */
  categoryId?: string;

  quickAnswer?: string; // 1
  whyItMatters?: string; // 2
  intuition?: string[]; // 3
  whereItFits?: string; // 4
  inputs?: string[]; // 5
  howItWorks?: string[]; // 6
  outputs?: string[]; // 7
  subsystems?: NamedItem[]; // 8
  parameters?: NamedItem[]; // 9
  /** Caveat that specific numbers are technology/vendor/process dependent. */
  parametersNote?: string;
  performance?: string[]; // 10
  defects?: string[]; // 11
  metrology?: string[]; // 12
  yieldImplications?: string[]; // 13
  manufacturingImplications?: string[]; // 14
  cost?: string[]; // 15
  relatedMaterials?: TopicLink[]; // 16
  relatedEquipment?: TopicLink[]; // 17
  relatedConceptLessons?: string[]; // 18 — lesson slugs (/semiconductors/learn/<slug>)
  relatedProcessLessons?: string[]; // 19 — lesson slugs
  packagingConnection?: string; // 20
  supplyChainConnection?: string; // 21
  advanced?: string[]; // 22
  learnNext?: TopicLink[]; // 23
}

export const EQUIPMENT_TOPICS: EquipmentTopic[] = [
  {
    slug: "lithography",
    title: "Lithography equipment",
    summary:
      "The machines that print a chip's circuit pattern onto the wafer — coating resist, projecting a mask image with light, and developing it.",
    categoryId: "lithography",

    quickAnswer:
      "Lithography equipment prints the circuit pattern onto the wafer: it coats the wafer with a light-sensitive film (resist), projects a mask's pattern onto it with light, and develops the image. It is the tool that defines the chip's smallest features.",
    whyItMatters:
      "Lithography sets the minimum feature size, so it paces how small and dense chips can become. It runs once for every patterned layer — dozens of times per wafer — and is usually the most throughput-limiting and capital-intensive step, so it dominates fab economics.",
    intuition: [
      "Think of a stencil made of light. A mask holds the pattern; light shines through it and is focused down onto a resist-coated wafer, and wherever the light lands the resist changes so the pattern can be developed — much like exposing and developing photographic film.",
      "Because the image is shrunk as it is projected, the tiny features on the wafer come from a larger pattern on the mask.",
    ],
    whereItFits:
      "At the start of every patterned layer. A wafer cycles through lithography, then etch or deposition, then cleaning, then lithography again — layer after layer.",

    inputs: [
      "A wafer (usually with films already deposited on it)",
      "Photoresist and any underlayers",
      "A photomask / reticle carrying that layer's pattern",
      "Light of a specific wavelength (e.g. deep-ultraviolet or extreme-ultraviolet)",
    ],
    howItWorks: [
      "Coat: a resist-processing track spin-coats a thin, uniform film of photoresist onto the wafer.",
      "Align & expose: the wafer is precisely aligned to the layers beneath it, then a scanner projects the mask pattern onto it with light — usually demagnified, so the wafer image is smaller than the mask.",
      "Develop: the exposed (or unexposed, depending on resist type) resist is developed away, leaving a resist pattern that protects some areas and opens others for the next step.",
    ],
    outputs: [
      "A wafer carrying a patterned resist layer, ready for etching, deposition, or ion implantation. The resist is stripped afterward — the pattern it defines is what remains.",
    ],
    subsystems: [
      { name: "Light source", detail: "Produces the exposure light; shorter wavelengths (DUV, then EUV) enable smaller features." },
      { name: "Illumination optics", detail: "Shapes and directs the light onto the mask." },
      { name: "Photomask / reticle", detail: "Holds the pattern for a single layer." },
      { name: "Projection optics", detail: "Focus and (usually) demagnify the mask image onto the wafer." },
      { name: "Wafer stage", detail: "Positions and scans the wafer with extreme precision." },
      { name: "Alignment system", detail: "Aligns each layer to the ones below it — the basis of overlay accuracy." },
      { name: "Resist-processing track", detail: "Coats and develops the resist; often a linked but separate tool." },
    ],
    parameters: [
      { name: "Wavelength", detail: "Shorter light prints smaller features; different nodes use DUV or EUV." },
      { name: "Numerical aperture (NA)", detail: "Higher-NA optics resolve finer features." },
      { name: "Focus and dose", detail: "How sharply the image lands and how much light is delivered — both have a limited usable 'process window'." },
      { name: "Overlay", detail: "How accurately a layer aligns to the previous ones." },
      { name: "Resist performance", detail: "The sensitivity and resolution of the light-sensitive film." },
    ],
    parametersNote:
      "Specific resolution, numerical aperture, overlay, and throughput figures are technology-, vendor-, and process-dependent — treat any single number you see as an example for one configuration, not a universal spec.",
    performance: [
      "The headline metrics are resolution (smallest printable feature), overlay accuracy, and throughput (wafers per hour) — and they trade off against one another and against cost. Techniques such as multiple patterning and resolution enhancement push resolution beyond a single exposure's limit, at the cost of extra steps.",
    ],
    defects: [
      "Focus or dose out of window → malformed, missing, or bridged features",
      "Overlay error → a layer misaligned to those beneath it, causing shorts or opens",
      "A defect on the mask → repeated on every die it prints",
      "Resist problems → pattern collapse of tall, thin features, or scumming",
    ],
    metrology: [
      "After exposure the wafer is measured for critical dimension (CD — the actual feature size) and overlay (layer-to-layer alignment), and inspected for pattern and particle defects. Because the pattern is still only in resist at this point, out-of-spec wafers can often be reworked (strip and re-expose) rather than scrapped.",
    ],
    yieldImplications: [
      "Lithography repeats every layer and its errors are often systematic (a mask defect prints on every die), so it is a major yield lever. Tight CD and overlay control lift both device performance and yield, while rework capability limits the damage from a bad exposure.",
    ],
    manufacturingImplications: [
      "Lithography usually gates fab throughput and is the single largest capital cost, so tool uptime, scheduling, and matching multiple tools to behave identically ('tool matching') are central to fab output. Advanced nodes need more lithography steps (multiple patterning), which multiplies cost and cycle time.",
    ],
    cost: [
      "Advanced lithography tools are among the most expensive equipment in a fab — EUV especially — but exact prices are vendor- and configuration-dependent and are not stated here. Cost per patterned layer rises steeply with multiple patterning, which is part of why each new node costs more.",
    ],
    relatedMaterials: [
      { label: "Photoresist", href: "/semiconductors/learn/photoresist" },
      { label: "Photomask / reticle" },
    ],
    relatedEquipment: [
      { label: "Etching", href: "/semiconductors/equipment#etching" },
      { label: "Metrology & inspection", href: "/semiconductors/equipment#metrology-inspection" },
    ],
    relatedConceptLessons: ["integrated-circuit", "mosfet"],
    relatedProcessLessons: ["lithography", "photoresist", "etching"],
    packagingConnection:
      "Advanced packaging (fan-out, interposers, redistribution layers) uses its own lithography, though usually at coarser dimensions than front-end patterning.",
    supplyChainConnection:
      "Lithography tools come from a very small number of equipment makers, and EUV in particular has effectively a single supplier — a key reason lithography is a strategic chokepoint in the semiconductor supply chain.",
    advanced: [
      "Extreme-ultraviolet (EUV) and high-NA EUV lithography for the smallest nodes",
      "Multiple patterning and computational / inverse lithography",
      "Resolution enhancement (optical proximity correction, phase-shift masks)",
      "Directed self-assembly and other next-generation patterning research",
    ],
    learnNext: [
      { label: "Lithography (process)", href: "/semiconductors/learn/lithography" },
      { label: "Photoresist", href: "/semiconductors/learn/photoresist" },
      { label: "Etching", href: "/semiconductors/learn/etching" },
    ],
  },
];

export function getEquipmentTopic(slug: string): EquipmentTopic | undefined {
  return EQUIPMENT_TOPICS.find((t) => t.slug === slug);
}

export function getEquipmentTopicSlugs(): string[] {
  return EQUIPMENT_TOPICS.map((t) => t.slug);
}
