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
      "Prepare & coat: the wafer is cleaned and primed for adhesion, then a resist-processing track spin-coats a thin, uniform film of photoresist onto it.",
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
      { name: "Resolution limit", detail: "The smallest printable feature — set roughly by wavelength divided by numerical aperture (the Rayleigh relation), so shorter light and higher NA print finer patterns." },
      { name: "Depth of focus", detail: "The vertical range over which the image stays sharp. It shrinks as resolution improves, so higher-resolution tools demand far tighter focus and flatter wafers." },
      { name: "Resist performance", detail: "The sensitivity and resolution of the light-sensitive film." },
    ],
    parametersNote:
      "Specific resolution, numerical aperture, overlay, and throughput figures are technology-, vendor-, and process-dependent — treat any single number you see as an example for one configuration, not a universal spec.",
    performance: [
      "The headline metrics are resolution (smallest printable feature), overlay accuracy, and throughput (wafers per hour) — and they trade off against one another and against cost. Techniques such as multiple patterning and resolution enhancement push resolution beyond a single exposure's limit, at the cost of extra steps.",
      "The two families of light matter here. DUV (deep-ultraviolet, notably 193 nm, and its higher-resolution 'immersion' form that uses water between the lens and wafer) is the long-time workhorse; to reach today's smallest features it leans on multiple patterning, splitting one layer across several exposures. EUV (extreme-ultraviolet, ~13.5 nm) uses far shorter light to print those features in fewer steps, but the wavelength is absorbed by air, glass, and conventional masks — so EUV needs a vacuum, all-reflective mirror optics, special reflective masks, and a complex light source, which makes it powerful but costly and, in practice, available from effectively one supplier.",
      "Because depth of focus shrinks as resolution rises, advanced lithography also depends on extremely flat wafers and tight focus control — a reminder that lithography does not simply 'print a pattern' but defines features that the whole downstream flow (etch, implant, deposition) must then transfer faithfully.",
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
  {
    slug: "deposition",
    title: "Deposition equipment",
    summary:
      "The machines that add thin films — conductors, insulators, and semiconductors — onto the wafer, layer by layer, with near-atomic control.",
    categoryId: "deposition",

    quickAnswer:
      "Deposition equipment lays down thin films on the wafer. A chip is built from many stacked layers of metal, insulator, and semiconductor; deposition tools add each layer with controlled thickness, uniformity, and composition.",
    whyItMatters:
      "Every layer in a chip — the transistors, the insulation between them, and the metal wiring that connects them — begins as a deposited film. Film thickness, uniformity, and quality set device behaviour and yield, and some layers (such as gate dielectrics) must be controlled to within a few atoms.",
    intuition: [
      "Think of building a layer cake, except each layer is a film thinner than a virus and must cover the whole wafer evenly. Deposition is how each of those layers is added.",
      "Some methods 'spray' atoms onto the surface; others grow a film from gases that react on the wafer; the most precise add material almost one atomic layer at a time.",
    ],
    whereItFits:
      "Throughout the flow, wherever a new material layer is needed — so that lithography can pattern it and etching can shape it. Deposition, lithography, and etching repeat together, layer after layer, to build the device up in three dimensions.",

    inputs: [
      "A wafer (often already patterned with previous layers)",
      "A source of the material — a solid 'target' (for sputtering) or gas-phase 'precursors'",
      "Energy — heat, plasma, or both — to drive film formation",
      "Carrier and reactant process gases (for gas-based methods)",
    ],
    howItWorks: [
      "Load: the wafer is placed in a controlled chamber, usually under vacuum.",
      "Deliver material: atoms are sputtered from a target (PVD), reacted from gases on the hot surface (CVD), or added in self-limiting atomic layers (ALD).",
      "Grow the film: material builds up on the wafer surface; temperature, pressure, and precursor flow set the film's thickness and properties.",
    ],
    outputs: [
      "A wafer carrying a new thin film of controlled thickness, uniformity, and quality — ready to be patterned by lithography and shaped by etch, or to serve directly as insulation or wiring.",
    ],
    subsystems: [
      { name: "Process chamber", detail: "A sealed, usually vacuum, environment where the film forms." },
      { name: "Source / precursor delivery", detail: "Supplies the material — a sputter target (PVD) or metered gas precursors (CVD/ALD)." },
      { name: "Energy source", detail: "Heat and/or plasma that drives the deposition reaction." },
      { name: "Wafer chuck / heater", detail: "Holds the wafer and controls its temperature precisely." },
      { name: "Gas & vacuum system", detail: "Delivers process gases and maintains chamber pressure." },
    ],
    parameters: [
      { name: "Thickness", detail: "The target film thickness, often controlled to nanometres or less." },
      { name: "Uniformity", detail: "How evenly the film covers the whole wafer — both across a wafer and wafer-to-wafer." },
      { name: "Conformality", detail: "How evenly the film coats over steps, trenches, and high-aspect-ratio features — where ALD excels." },
      { name: "Composition & stress", detail: "The film's chemistry and built-in mechanical stress, set by temperature, pressure, and precursors." },
      { name: "Deposition rate", detail: "How fast the film grows — traded off against control and uniformity." },
    ],
    parametersNote:
      "Exact rates, temperatures, and thickness ranges depend on the material, the method, and the equipment vendor — treat any specific number as an example for one process, not a universal value.",
    performance: [
      "The main methods trade off differently. PVD (physical vapour deposition, e.g. sputtering) is fast and common for metals, but it is largely line-of-sight, so it covers deep features poorly. CVD (chemical vapour deposition) grows films from reacting gases and gives better step coverage. ALD (atomic layer deposition) builds a film one self-limiting atomic layer at a time — the slowest but the most precise and conformal, essential for the thinnest, most demanding layers such as high-k gate dielectrics. Epitaxy grows a crystalline film aligned to the wafer's own crystal structure, used for high-quality device layers.",
      "Choosing a method balances thickness control, conformality, film quality, the allowable temperature, and throughput — no single technique wins on every axis.",
    ],
    defects: [
      "Non-uniform thickness → device variation across the wafer",
      "Poor conformality → voids or thin spots inside deep features",
      "Particles and contamination → defects that reduce yield",
      "Wrong film stress → wafer bow or film cracking",
      "Composition drift → shifted electrical properties",
    ],
    metrology: [
      "After deposition, film thickness and uniformity are measured (for example by optical or ellipsometric techniques), composition and stress are checked, and wafers are inspected for particles and defects. That data feeds back to keep the process on target.",
    ],
    yieldImplications: [
      "Because films underlie every device and every interconnect, thickness and defect control are central to yield. A systematic thickness error or a recurring particle source can affect every wafer, and conformality failures create hidden voids that fail later.",
    ],
    manufacturingImplications: [
      "Deposition is a high-volume, repeated step, so chamber matching, precursor supply, and particle control drive throughput and cost. ALD's precision comes at the cost of speed, so it is used where it is genuinely needed rather than everywhere.",
    ],
    cost: [
      "Precursors and targets are consumables, and high-purity materials plus vacuum tooling make deposition capital- and materials-intensive; specific costs are material- and vendor-dependent and are not stated here.",
    ],
    relatedMaterials: [
      { label: "Precursor gases & sputter targets" },
      { label: "Dielectrics" },
      { label: "Conductive metals" },
    ],
    relatedEquipment: [
      { label: "Etching", href: "/semiconductors/equipment/etching" },
      { label: "Lithography", href: "/semiconductors/equipment/lithography" },
      { label: "CMP", href: "/semiconductors/equipment#cmp" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["deposition", "metallization", "oxidation"],
    packagingConnection:
      "Advanced packaging uses deposition too — for example seed layers and redistribution-layer metals — though usually much thicker than front-end films.",
    supplyChainConnection:
      "Deposition depends on a supply of ultra-pure precursor gases, sputter targets, and specialty chemicals, plus a small set of equipment makers — all real supply-chain considerations.",
    advanced: [
      "Atomic layer deposition (ALD) and area-selective deposition for atomic-scale control",
      "Epitaxy for strained and compound-semiconductor layers",
      "Low-temperature and new-precursor processes for advanced integration",
      "Conformal fill of very high-aspect-ratio structures (e.g. 3D memory)",
    ],
    learnNext: [
      { label: "Deposition (process)", href: "/semiconductors/learn/deposition" },
      { label: "Etching", href: "/semiconductors/equipment/etching" },
      { label: "Metallization", href: "/semiconductors/learn/metallization" },
    ],
  },
  {
    slug: "etching",
    title: "Etching equipment",
    summary:
      "The machines that selectively remove material to carve a chip's features — turning a flat resist pattern into real three-dimensional structures.",
    categoryId: "etching",

    quickAnswer:
      "Etching equipment removes material from the wafer where it isn't wanted. After lithography defines a pattern in resist, etch tools cut that pattern into the underlying film — shaping the transistors, trenches, and wiring of the chip.",
    whyItMatters:
      "Etching is how a flat pattern becomes real three-dimensional structure. The shape (profile) and precision of an etch set transistor dimensions, electrical isolation, and interconnect quality, so etch directly affects device performance and yield.",
    intuition: [
      "Think of the resist pattern as a stencil: etching removes the material left exposed by the stencil while protecting what sits under the resist — a bit like sandblasting through a mask.",
      "Some etches eat in every direction and round off features; others cut straight down to make sharp vertical walls.",
    ],
    whereItFits:
      "Right after lithography, on nearly every patterned layer: lithography defines where, etch removes material there, then the resist is stripped and the next layer begins.",

    inputs: [
      "A wafer with a patterned resist (or hard) mask from lithography",
      "Etchant chemistry — liquid chemicals (wet) or reactive gases / plasma (dry)",
      "For plasma etch, RF power to create and drive the plasma",
    ],
    howItWorks: [
      "Load: the masked wafer enters the etch tool.",
      "Wet etch: the wafer meets a liquid chemical that dissolves the unmasked material — simple, but it usually etches in all directions (isotropic).",
      "Dry / plasma etch: a plasma of reactive ions removes material and can be made highly directional (anisotropic) to cut straight down.",
      "Endpoint & stop: a detection system senses when the target layer is cleared, and the etch stops at the right depth.",
    ],
    outputs: [
      "A wafer with the pattern transferred into the film as real 3D features — trenches, lines, contacts. The mask is then removed, leaving the etched structure behind.",
    ],
    subsystems: [
      { name: "Process chamber", detail: "Contains the etch environment — a vacuum chamber for plasma etch." },
      { name: "Plasma / RF source", detail: "Generates and controls the reactive plasma in dry etch." },
      { name: "Gas or chemical delivery", detail: "Meters etch gases (dry) or liquid etchants (wet)." },
      { name: "Wafer chuck", detail: "Holds and cools the wafer; an applied bias can steer ions for directionality." },
      { name: "Endpoint detection", detail: "Senses when a layer is cleared so the etch stops at the right depth." },
    ],
    parameters: [
      { name: "Selectivity", detail: "How much faster the target material etches than the mask and the layer beneath — high selectivity protects what should stay." },
      { name: "Etch rate", detail: "How fast material is removed — traded off against control and uniformity." },
      { name: "Anisotropy (profile)", detail: "Whether the etch cuts straight down (anisotropic) or sideways too (isotropic), which sets the wall profile." },
      { name: "Uniformity", detail: "How evenly the etch proceeds across the whole wafer." },
      { name: "Aspect-ratio capability", detail: "The ability to etch deep, narrow features without distorting them." },
    ],
    parametersNote:
      "Etch rates, selectivities, and profiles depend heavily on the material stack, the chemistry, and the equipment vendor — treat any specific value as an example for one process, not a universal figure.",
    performance: [
      "The core distinction is wet versus dry etch. Wet (liquid) etching is cheap and gentle but usually isotropic — it undercuts the mask — so it is used where straight walls aren't needed. Dry / plasma etching (including reactive-ion etching) can be made anisotropic, cutting the vertical walls that dense, small features require, and is the workhorse of modern patterning.",
      "The key trade-offs are selectivity (removing the target without harming the mask or the layer below), profile control (vertical versus sloped walls), and the ability to etch high-aspect-ratio features — all of which get harder as features shrink.",
    ],
    defects: [
      "Under- or over-etch → features left connected, or the layer below damaged",
      "Poor selectivity → mask erosion or punch-through into the wrong layer",
      "Sloped or bowed profiles → devices out of spec",
      "Etch residue or polymer → defects and electrical shorts",
      "Non-uniform etch → variation across the wafer",
    ],
    metrology: [
      "After etch, feature dimensions and profiles are measured (for example critical dimension and cross-section), any remaining film is checked, and wafers are inspected for residue and defects. Endpoint signals and metrology data are used to tune the recipe.",
    ],
    yieldImplications: [
      "Etch shapes the actual device geometry, so profile and selectivity errors translate directly into performance loss and yield loss — and deep, high-aspect-ratio etches are especially demanding.",
    ],
    manufacturingImplications: [
      "Etch is a repeated, high-throughput step, so chamber conditioning, reliable endpoint detection, by-product management, and safe handling of reactive gases all drive uptime and cost.",
    ],
    cost: [
      "Etch tools and their reactive process gases are significant costs; exact figures are chemistry- and vendor-dependent and are not stated here. More patterning steps (multiple patterning) mean more etch steps and more cost.",
    ],
    relatedMaterials: [
      { label: "Process gases & etchants" },
      { label: "Photoresist", href: "/semiconductors/learn/photoresist" },
    ],
    relatedEquipment: [
      { label: "Lithography", href: "/semiconductors/equipment/lithography" },
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
      { label: "Metrology & inspection", href: "/semiconductors/equipment#metrology-inspection" },
    ],
    relatedConceptLessons: ["mosfet", "integrated-circuit"],
    relatedProcessLessons: ["etching", "lithography"],
    packagingConnection:
      "Etching also shapes advanced-packaging features — for example etching through-silicon vias (TSVs) that connect stacked dies in 3D packages.",
    supplyChainConnection:
      "Etch relies on specialty reactive gases and a small set of equipment suppliers; secure gas supply and safe handling are real supply-chain and facility concerns.",
    advanced: [
      "Atomic layer etching (ALE) for atomic-scale removal",
      "High-aspect-ratio etching for 3D NAND and DRAM",
      "Cryogenic and pulsed-plasma etching",
      "Selective etching for gate-all-around and other advanced devices",
    ],
    learnNext: [
      { label: "Etching (process)", href: "/semiconductors/learn/etching" },
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
      { label: "Lithography", href: "/semiconductors/equipment/lithography" },
    ],
  },
];

export function getEquipmentTopic(slug: string): EquipmentTopic | undefined {
  return EQUIPMENT_TOPICS.find((t) => t.slug === slug);
}

export function getEquipmentTopicSlugs(): string[] {
  return EQUIPMENT_TOPICS.map((t) => t.slug);
}
