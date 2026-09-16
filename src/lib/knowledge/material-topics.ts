/**
 * Individual semiconductor material topics — the reusable educational template.
 *
 * One data object per material, rendered by MaterialTopicView. Every section is
 * OPTIONAL and gated, so a topic only shows what it has. Content is educational
 * and qualitative and always framed in the context of making a chip: NO
 * fabricated purity, electrical, thermal, price, or supply figures — where a
 * property depends on composition, processing, temperature, or structure, the
 * text says so. Material selection is taught as a multi-property trade-off (no
 * material is universally "best"). Cross-links reuse lesson slugs (validated in
 * material-topics.test.ts) and equipment topic pages.
 */
import type { NamedItem, TopicLink } from "./equipment-topics";

export type { NamedItem, TopicLink };

export interface MaterialTopic {
  slug: string;
  title: string;
  summary: string;
  /** Links back to its hub category (materials-map.ts). */
  categoryId?: string;

  quickAnswer?: string; // 1
  whyItMatters?: string; // 2
  intuition?: string[]; // 3
  properties?: NamedItem[]; // 4 — electrical / optical / thermal / mechanical / chemical ...
  /** Caveat that property values depend on composition/processing/temperature/structure. */
  propertiesNote?: string;
  whereUsed?: string[]; // 5
  processConnection?: string; // 6
  relatedEquipment?: TopicLink[]; // 7 — equipment topic pages
  parameters?: NamedItem[]; // 8
  parametersNote?: string;
  purity?: string[]; // 9
  processCompatibility?: string[]; // 10
  defects?: string[]; // 11
  performance?: string[]; // 12
  yieldImplications?: string[]; // 13
  packagingConnection?: string; // 14
  supplyChainConnection?: string; // 15
  safety?: string[]; // 16
  /** Lead framing for selection: choice is a multi-property trade-off. */
  selectionNote?: string; // 17
  alternatives?: NamedItem[]; // 17
  relatedMaterials?: TopicLink[]; // 18
  relatedProcessLessons?: string[]; // 19 — lesson slugs
  relatedConceptLessons?: string[]; // 19 — lesson slugs
  advanced?: string[]; // 20
  learnNext?: TopicLink[]; // 21
}

export const MATERIAL_TOPICS: MaterialTopic[] = [
  {
    slug: "silicon",
    title: "Silicon",
    summary:
      "The foundational semiconductor material for most chips — a group-14 element, grown as a near-perfect single crystal and doped to build transistors.",
    categoryId: "semiconductor-materials",

    quickAnswer:
      "Silicon is the semiconductor most chips are built from. Grown as an extremely pure single crystal and sliced into wafers, it can be doped to control how it conducts and forms a high-quality native oxide — the combination that made it the workhorse of the industry.",
    whyItMatters:
      "Silicon underpins the vast majority of integrated circuits. It is abundant, its properties can be controlled precisely by doping, and it forms an excellent native insulator (silicon dioxide) — and decades of manufacturing maturity make it hard to displace for mainstream logic and memory.",
    intuition: [
      "A semiconductor sits between a conductor and an insulator: on its own silicon barely conducts, but adding tiny amounts of other atoms (doping) lets you dial its conductivity up or down where you want it.",
      "Two things make silicon special beyond being a semiconductor: it can be grown as a nearly perfect crystal, and heating it in oxygen grows a clean, stable insulating skin (silicon dioxide) — a natural, high-quality insulator built right on the material.",
    ],
    properties: [
      { name: "Electrical", detail: "A semiconductor with an indirect bandgap (commonly cited near 1.1 eV) that supports switching at room temperature; conductivity is set deliberately by doping type and level." },
      { name: "Optical", detail: "Its indirect bandgap makes silicon a poor light emitter, which is why photonics and LEDs usually turn to other materials — a good example of a property steering material choice." },
      { name: "Thermal", detail: "Conducts heat reasonably well for a semiconductor and tolerates high processing temperatures; exact values depend on doping, temperature, and crystal quality." },
      { name: "Mechanical", detail: "Hard and brittle; strong enough to process as thin wafers but prone to cracking and chipping if mishandled." },
      { name: "Chemical", detail: "Stable under normal conditions and forms a protective, high-quality native oxide (silicon dioxide) — central to its usefulness." },
    ],
    propertiesNote:
      "Silicon's electrical, thermal, and mechanical behaviour depend on doping, crystal orientation, temperature, and defect content — so treat any single value as tied to a specific material and condition, not a universal constant.",
    whereUsed: [
      "The wafer / substrate that essentially all mainstream ICs are built on",
      "The transistor channel and source/drain regions (doped silicon)",
      "MEMS and sensors, and as the base for many specialty devices",
    ],
    processConnection:
      "Silicon runs through the whole flow: a large single crystal (ingot) is grown, sliced and polished into wafers, thermally oxidized to grow insulating layers, doped by implantation and annealing, and patterned layer by layer. Each of these steps depends on the silicon's crystal quality and purity.",
    relatedEquipment: [
      { label: "Thermal processing", href: "/semiconductors/equipment/thermal" },
      { label: "Ion implantation", href: "/semiconductors/equipment/ion-implantation" },
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
    ],
    parameters: [
      { name: "Crystal orientation", detail: "The crystal direction of the wafer surface, which influences device and process behaviour." },
      { name: "Doping type & level", detail: "Whether the silicon is n- or p-type and how heavily doped — set for the intended device." },
      { name: "Resistivity", detail: "How strongly the bulk silicon conducts, following from doping; specified per product rather than fixed." },
      { name: "Defect density", detail: "Crystal defects such as dislocations that can degrade devices." },
      { name: "Oxygen / impurity content", detail: "Trace elements (for example oxygen from crystal growth) that affect behaviour and must be controlled." },
    ],
    parametersNote:
      "Target orientation, doping, resistivity, and impurity levels are product- and process-dependent; treat any figure you see elsewhere as an example for one specification, not a universal value.",
    purity: [
      "Silicon for devices must be extremely pure (often called electronic-grade); even trace metallic contamination creates electrical traps and leakage.",
      "Purity is built up in stages — from raw silica to metallurgical silicon to highly purified polysilicon before the crystal is grown — and cleanliness is maintained throughout the fab.",
      "Because contamination effects depend on the specific impurity and where it sits in the device, purity requirements are stated per process, not as one universal number.",
    ],
    processCompatibility: [
      "Silicon's standout compatibility is with its own oxide (silicon dioxide), which enabled the whole planar/CMOS approach.",
      "It withstands the high-temperature steps (oxidation, anneals) that many processes need — though the total thermal budget still has to be managed.",
      "It integrates with the standard toolset (lithography, etch, deposition, CMP), which is a large part of why the ecosystem is built around it.",
    ],
    defects: [
      "Crystal defects (e.g. dislocations) → degraded or failed devices",
      "Metallic contamination → leakage and reliability loss",
      "Surface damage, particles, or scratches → patterning and yield problems",
      "Uncontrolled impurities (e.g. oxygen precipitates) → shifted electrical behaviour",
    ],
    performance: [
      "Silicon's controllable conductivity (via doping) and its high-quality native oxide are what make well-behaved transistors possible, so its crystal quality and purity set a ceiling on device performance.",
      "Its indirect bandgap is a genuine limitation for light emission and for the very highest-frequency or high-power roles, which is exactly where other materials are chosen instead — a reminder that 'best' depends on the job.",
    ],
    yieldImplications: [
      "Because every device sits in or on the silicon, wafer-level defects and contamination can affect many dies at once, so incoming crystal quality and cleanliness are fundamental yield levers.",
    ],
    packagingConnection:
      "The die itself is silicon, so its mechanical and thermal properties matter in packaging — for example the mismatch in thermal expansion between the silicon die and package materials is a key reliability consideration, and silicon is also used as interposers in advanced packaging.",
    supplyChainConnection:
      "Silicon starts from abundant silica but requires energy-intensive purification and crystal growth, and the polysilicon, ingot, and wafer steps are concentrated in relatively few suppliers — making high-quality wafer supply strategically important. (No specific capacity or price figures are stated here.)",
    safety: [
      "Solid silicon itself is low-hazard, but many processes that work it use hazardous materials (for example silane and other reactive gases, and strong chemicals), which are handled under strict fab safety controls.",
      "This overview is conceptual and not a substitute for material safety data or facility procedures.",
    ],
    selectionNote:
      "No material is universally best. Choosing a semiconductor material weighs electrical, optical, thermal, mechanical, and chemical properties against process compatibility, reliability, maturity, and cost — silicon wins for mainstream logic and memory, while other materials win where their properties fit the job better.",
    alternatives: [
      { name: "Germanium (Ge) / SiGe", detail: "Higher carrier mobility for speed, used selectively (e.g. strained-SiGe regions), but less convenient oxide and other trade-offs." },
      { name: "Compound semiconductors (GaAs, InP)", detail: "Direct bandgaps and high speed suit optoelectronics and high-frequency RF, at higher cost and lower maturity than silicon." },
      { name: "Wide-bandgap (SiC, GaN)", detail: "Handle high voltage, temperature, and power well — favoured for power and RF — but are costlier and less mature for dense logic." },
      { name: "Silicon-on-insulator (SOI)", detail: "Still silicon, but on a buried oxide to cut leakage/capacitance for certain applications, at added wafer cost." },
    ],
    relatedMaterials: [
      { label: "Wafers & substrates", href: "/semiconductors/materials#wafers-substrates" },
      { label: "Dielectrics", href: "/semiconductors/materials#dielectrics" },
      { label: "Dopant materials", href: "/semiconductors/materials#dopant-materials" },
    ],
    relatedProcessLessons: ["silicon", "ingot", "wafer", "oxidation", "ion-implantation"],
    relatedConceptLessons: ["integrated-circuit", "mosfet"],
    advanced: [
      "Strained silicon and SiGe for mobility enhancement",
      "Silicon-on-insulator (SOI) and thin-body devices",
      "Silicon photonics — working around the indirect bandgap",
      "Integration of non-silicon channels on silicon for future devices",
    ],
    learnNext: [
      { label: "Silicon (process)", href: "/semiconductors/learn/silicon" },
      { label: "Wafer", href: "/semiconductors/learn/wafer" },
      { label: "Materials hub", href: "/semiconductors/materials" },
    ],
  },
];

export function getMaterialTopic(slug: string): MaterialTopic | undefined {
  return MATERIAL_TOPICS.find((t) => t.slug === slug);
}

export function getMaterialTopicSlugs(): string[] {
  return MATERIAL_TOPICS.map((t) => t.slug);
}
