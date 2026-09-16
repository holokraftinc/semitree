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

/**
 * Keys for the small built-in schematic diagrams (rendered by TopicDiagram).
 * Each is used only where a labeled diagram is substantially clearer than text,
 * and each is technically accurate; topics without a suitable, verifiable
 * diagram simply omit this rather than inventing one.
 */
export type TopicDiagramKey =
  | "litho-system"
  | "litho-flow"
  | "deposition-film"
  | "etch-profile"
  | "cmp"
  | "ion-implant"
  | "control-loop"
  | "wafer-structure"
  | "interconnect"
  | "gate-dielectric"
  | "package-stack"
  | "thermal-path";

/**
 * The curiosity-driven "learning loop" recap shown at the end of a substantial
 * topic. Only the authored parts live here — key takeaways and what the topic
 * unlocks; the "learn next / see the process / go deeper / explore the industry"
 * pathways are derived from the topic's existing cross-links.
 */
export interface LearningLoop {
  /** 3-5 key ideas the reader just learned. */
  youJustLearned: string[];
  /** One line on what this topic now enables the reader to understand. */
  nowYouKnow: string;
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
  learningLoop?: LearningLoop; // 24 — curiosity-driven end-of-topic recap
  /** A schematic diagram shown near the top, and the question it answers. */
  diagram?: TopicDiagramKey;
  diagramCaption?: string;
}

export const EQUIPMENT_TOPICS: EquipmentTopic[] = [
  {
    slug: "lithography",
    diagram: "litho-system",
    diagramCaption: "What does lithography actually do?",
    learningLoop: {
      youJustLearned: [
        "What lithography equipment does — it prints each layer's pattern onto the wafer",
        "Why exposure (wavelength, numerical aperture, focus, and dose) sets the smallest feature",
        "What resolution means, and how DUV and EUV differ",
        "Why overlay — layer-to-layer alignment — is as critical as resolution",
      ],
      nowYouKnow:
        "You can see why lithography paces the whole industry, and how a printed pattern only becomes a real device through the steps that follow it.",
    },
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
    diagram: "deposition-film",
    diagramCaption: "How does deposition create a film?",
    learningLoop: {
      youJustLearned: [
        "Why thin films are deposited to build a chip layer by layer",
        "How PVD, CVD, ALD, and epitaxy differ",
        "What conformality, thickness, and uniformity mean",
        "Why precursor purity and process control decide film quality",
      ],
      nowYouKnow:
        "You understand how each layer of a chip is added, and why a film is the product of material and process together, not the tool alone.",
    },
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
    diagram: "etch-profile",
    diagramCaption: "How does etching remove material?",
    learningLoop: {
      youJustLearned: [
        "Why material is removed to turn a flat pattern into real 3D structure",
        "The difference between wet and dry / plasma etch",
        "What selectivity, etch rate, and anisotropy control",
        "Why profile and endpoint matter for device geometry",
      ],
      nowYouKnow:
        "You can see how lithography and etch work as a pair to shape every layer, and why etch chemistry is central to the result.",
    },
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
  {
    slug: "ion-implantation",
    diagram: "ion-implant",
    diagramCaption: "How does implantation dope the wafer?",
    learningLoop: {
      youJustLearned: [
        "Why doping is what turns plain silicon into a working device",
        "How ion species, energy, and dose set the junction",
        "Why implant and anneal are a matched pair",
        "How masking limits doping to chosen regions",
      ],
      nowYouKnow:
        "You can see how transistors get their electrical character, and why an implant is always followed by a thermal step.",
    },
    title: "Ion implantation equipment",
    summary:
      "The machines that fire precisely chosen ions into the wafer to dope silicon — setting where, and how strongly, each region conducts.",
    categoryId: "doping",

    quickAnswer:
      "Ion implantation equipment introduces dopant atoms into the silicon by accelerating ions and driving them into the wafer. Doping is what turns plain silicon into working transistors, and implantation controls exactly where the dopants go and how many.",
    whyItMatters:
      "Doping decides how each region of silicon conducts, so it is what makes a transistor a transistor. Implantation gives precise, repeatable control over how much dopant is added and how deep it goes — the basis of well-defined junctions, thresholds, and device behaviour.",
    intuition: [
      "Pure silicon barely conducts. Adding a tiny, controlled amount of certain atoms ('dopants') changes that — some let it carry electrons, others let it carry positive 'holes'. Doping is how you paint conductivity into chosen regions.",
      "Ion implantation is like a very precise atomic paint-gun: it accelerates dopant ions and drives them into the surface, and by choosing the ion, its speed, and how many you fire, you set how deep and how strong the doping is.",
    ],
    whereItFits:
      "After a masking layer defines which regions to dope — to form transistor source/drain regions, wells, and threshold adjustments — and it is almost always followed by a thermal anneal that activates the dopants.",

    inputs: [
      "A wafer, usually with a patterned mask (resist or hard mask) opening only the regions to be doped",
      "A source of the dopant element, to be ionized",
      "Electrical power to accelerate the ions",
    ],
    howItWorks: [
      "Ionize: the dopant element is turned into charged ions.",
      "Select & accelerate: the desired ion is selected and accelerated to a chosen energy — higher energy drives ions deeper.",
      "Scan & implant: the beam is scanned across the wafer so a controlled number of ions (the dose) enters the exposed silicon, while the mask blocks the rest.",
    ],
    outputs: [
      "A wafer with dopant atoms embedded in the exposed regions at a controlled dose and depth — but not yet electrically active until it is annealed.",
    ],
    subsystems: [
      { name: "Ion source", detail: "Creates ions from the dopant element." },
      { name: "Species selection", detail: "Picks the exact ion to implant and rejects the rest." },
      { name: "Acceleration column", detail: "Accelerates ions to the chosen energy, which sets implant depth." },
      { name: "Beam scan & wafer stage", detail: "Sweeps the beam (or wafer) for a uniform dose across the wafer." },
      { name: "Dose measurement", detail: "Counts the delivered charge to control the dose." },
    ],
    parameters: [
      { name: "Ion species", detail: "Which dopant element is implanted — it determines the type of conductivity produced." },
      { name: "Energy", detail: "How fast the ions travel — higher energy places dopants deeper below the surface." },
      { name: "Dose", detail: "How many ions per unit area are delivered — it sets how strongly the region is doped." },
      { name: "Implant angle", detail: "The tilt of the beam relative to the wafer, which affects the depth profile and shadowing." },
      { name: "Uniformity", detail: "How evenly the dose is delivered across the whole wafer." },
    ],
    parametersNote:
      "Specific energies, doses, species, and resulting profiles are process- and device-dependent — treat any values you see elsewhere as examples for one process, not universal figures. This is a conceptual overview, not an operating recipe.",
    performance: [
      "Two quantities dominate the result. Energy sets the implantation profile — how deep the dopants go and the shape of the dopant-versus-depth curve — while dose sets how heavily the region is doped. Together they define the junction.",
      "Crucially, freshly implanted dopants are not yet doing anything electrically: they sit in the wrong places in the crystal and have damaged it along the way. A subsequent anneal (a thermal step) heals the crystal and 'activates' the dopants by moving them onto proper lattice sites. Implant and anneal are therefore a matched pair.",
    ],
    defects: [
      "Dose or energy off target → wrong junction depth or strength, shifting device behaviour",
      "Non-uniform dose → device variation across the wafer",
      "Channeling (ions travelling too far down crystal 'channels') → deeper-than-intended profiles",
      "Residual crystal damage if the anneal is insufficient",
      "Mask failure → dopants where they should not be",
    ],
    metrology: [
      "After implant and anneal, dose and profile are checked indirectly — for example via sheet-resistance and other electrical or physical measurements — and compared against target, feeding process control.",
    ],
    yieldImplications: [
      "Because doping sets transistor thresholds and junctions, implant errors show up directly as parametric shifts and yield loss; across-wafer uniformity is key to consistent devices.",
    ],
    manufacturingImplications: [
      "Implant is a repeated, tightly controlled step; dose accuracy, beam uniformity, and pairing with the right anneal drive device consistency. Dopant sources require strict facility-level safety controls, which are outside the scope of this overview.",
    ],
    cost: [
      "Implanters and their partner anneal tools are significant capital; specific costs are vendor-dependent and are not stated here.",
    ],
    relatedMaterials: [
      { label: "Dopant species" },
      { label: "Masking / photoresist", href: "/semiconductors/learn/photoresist" },
    ],
    relatedEquipment: [
      { label: "Thermal processing", href: "/semiconductors/equipment/thermal" },
      { label: "Lithography", href: "/semiconductors/equipment/lithography" },
      { label: "Metrology & inspection", href: "/semiconductors/equipment#metrology-inspection" },
    ],
    relatedConceptLessons: ["mosfet", "integrated-circuit"],
    relatedProcessLessons: ["ion-implantation", "oxidation"],
    supplyChainConnection:
      "Implant relies on specialty dopant source materials and a small set of equipment suppliers; secure supply and safe handling of these materials are real considerations.",
    advanced: [
      "Ultra-shallow junctions for advanced nodes",
      "Plasma and high-current implant techniques",
      "Damage engineering and advanced activation anneals",
      "Implantation for materials modification beyond doping",
    ],
    learnNext: [
      { label: "Ion implantation (process)", href: "/semiconductors/learn/ion-implantation" },
      { label: "Thermal processing", href: "/semiconductors/equipment/thermal" },
      { label: "MOSFET", href: "/semiconductors/learn/mosfet" },
    ],
  },
  {
    slug: "thermal",
    learningLoop: {
      youJustLearned: [
        "Why some essential steps are driven purely by heat",
        "How diffusion, activation, and annealing work",
        "What the thermal budget is and why it must be managed",
        "How batch furnace and rapid thermal processing differ",
      ],
      nowYouKnow:
        "You understand why temperature and time set film and junction properties, and why later steps must stay gentle enough not to undo earlier ones.",
    },
    title: "Thermal processing equipment",
    summary:
      "The furnaces and rapid-heating tools that use precise high temperature to grow films, activate dopants, and repair the silicon crystal.",
    categoryId: "thermal",

    quickAnswer:
      "Thermal processing equipment heats wafers under tight control to make things happen that only heat can: growing oxide films, activating implanted dopants, and healing crystal damage. Temperature and time are the knobs.",
    whyItMatters:
      "Many essential steps are driven purely by heat — oxide growth, dopant activation and diffusion, and annealing. How hot and how long directly set film and junction properties, so thermal control is central to how devices behave.",
    intuition: [
      "Heat makes atoms move. Thermal processing uses carefully controlled temperature to grow a film, spread dopants a little, or let a damaged crystal rearrange itself back into order.",
      "There are two broad styles: slow batch furnace steps that heat many wafers together for longer, and rapid thermal processing that heats a single wafer very hot for a very short time.",
    ],
    whereItFits:
      "At oxide-growth steps and, crucially, right after ion implantation to activate dopants and repair damage — plus various anneals throughout the flow.",

    inputs: [
      "Wafers (often just implanted, or needing an oxide grown)",
      "Controlled ambient gases (for example an oxidizing or an inert atmosphere)",
      "Precise, uniform heat",
    ],
    howItWorks: [
      "Load: wafers enter a furnace (many at once) or a single-wafer rapid-thermal chamber.",
      "Heat under control: temperature, time, and gas ambient are held to tight setpoints.",
      "Drive the reaction: heat grows an oxide, activates and diffuses dopants, or anneals out damage — then the wafers are cooled in a controlled way.",
    ],
    outputs: [
      "Wafers with a grown film, activated dopants, or a repaired crystal — with properties set by the temperature-and-time history they experienced.",
    ],
    subsystems: [
      { name: "Heating system", detail: "Furnace elements, or rapid lamps/heaters, that reach and hold high temperature." },
      { name: "Temperature control & sensing", detail: "Measures and regulates temperature precisely and uniformly." },
      { name: "Gas ambient control", detail: "Delivers the required atmosphere (oxidizing, inert, and so on)." },
      { name: "Wafer handling / boat", detail: "Holds wafers — a batch 'boat' in furnaces, or a single-wafer chuck in RTP." },
    ],
    parameters: [
      { name: "Temperature", detail: "The peak temperature — a primary driver of every thermal reaction." },
      { name: "Time", detail: "How long the wafer is held hot; with temperature it sets the outcome." },
      { name: "Ramp rate", detail: "How fast the wafer heats and cools — rapid processing uses very fast ramps." },
      { name: "Ambient", detail: "The surrounding gas, which determines whether (for example) an oxide grows." },
      { name: "Uniformity", detail: "Even temperature across the wafer and from wafer to wafer." },
    ],
    parametersNote:
      "Exact temperatures, times, and ramps are process-specific — treat any figure elsewhere as an example, not a universal recipe.",
    performance: [
      "A central idea is the thermal budget: the cumulative effect of all the heat a wafer sees. Every hot step also nudges dopants along, so later steps must be gentle enough not to undo earlier ones. Managing the total thermal budget — often by favouring short, hot rapid-thermal steps over long furnace steps — is essential at advanced nodes.",
      "Furnace processing heats many wafers together for longer times, with efficient, gentle ramps. Rapid thermal processing heats a single wafer very hot for seconds, minimizing diffusion while still activating dopants. The choice trades throughput, uniformity, and thermal budget against one another.",
    ],
    defects: [
      "Too much thermal budget → dopants diffuse too far and junctions move",
      "Temperature non-uniformity → device variation, wafer stress, or warping",
      "Wrong ambient → unwanted or missing film growth",
      "Contamination at high temperature → deep, hard-to-remove defects",
      "Incomplete activation → high-resistance regions",
    ],
    metrology: [
      "Grown-film thickness, sheet resistance (a proxy for activation), and uniformity are measured after thermal steps and compared against target to keep the process in control.",
    ],
    yieldImplications: [
      "Thermal steps set junction and film properties for the whole wafer at once, so an out-of-spec furnace or RTP run can shift every device — and thermal-budget errors are often irreversible.",
    ],
    manufacturingImplications: [
      "Batch furnaces give throughput; single-wafer RTP gives control and a low thermal budget. Tool matching and temperature uniformity are central to consistent results.",
    ],
    cost: [
      "Thermal tools and their tight temperature control are significant capital; specifics are vendor-dependent and are not stated here.",
    ],
    relatedMaterials: [
      { label: "Process gases" },
      { label: "Grown oxide films" },
    ],
    relatedEquipment: [
      { label: "Ion implantation", href: "/semiconductors/equipment/ion-implantation" },
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
      { label: "Metrology & inspection", href: "/semiconductors/equipment#metrology-inspection" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["oxidation", "ion-implantation"],
    supplyChainConnection:
      "Thermal processing relies on high-purity process gases and specialist furnace and RTP equipment makers.",
    advanced: [
      "Millisecond and laser annealing for ultra-low thermal budget",
      "Dopant activation with minimal diffusion",
      "Atomic-scale interface control in grown films",
    ],
    learnNext: [
      { label: "Oxidation (process)", href: "/semiconductors/learn/oxidation" },
      { label: "Ion implantation", href: "/semiconductors/equipment/ion-implantation" },
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
    ],
  },
  {
    slug: "cmp",
    diagram: "cmp",
    diagramCaption: "Where does CMP fit, and how does it planarize?",
    learningLoop: {
      youJustLearned: [
        "Why planarization is required as layers stack up",
        "How slurry and pad remove material together",
        "What selectivity, dishing, and erosion mean",
        "Why endpoint control keeps CMP repeatable",
      ],
      nowYouKnow:
        "You understand why flat surfaces make multilayer chips possible, and how CMP defects ripple into every layer built above.",
    },
    title: "CMP (planarization) equipment",
    summary:
      "Chemical-mechanical planarization tools that polish the wafer flat between layers, so every new layer is built on a smooth surface.",
    categoryId: "cmp",

    quickAnswer:
      "CMP equipment polishes the wafer flat by combining a chemical slurry with a mechanical pad. Chips are built in many layers, and each new layer needs a flat starting surface — CMP provides it and also removes excess material.",
    whyItMatters:
      "As layers stack up, the surface becomes uneven. Lithography needs a flat surface to keep its shallow depth of focus usable, and interconnects need excess metal removed cleanly. CMP is what makes multilayer chips possible.",
    intuition: [
      "Imagine building many floors of a building — each floor must be level, or the next one goes wrong. CMP is the step that levels the surface after each layer.",
      "It works like a very controlled polish: the wafer is pressed face-down onto a spinning pad while a liquid 'slurry' both chemically softens and mechanically grinds away the high spots.",
    ],
    whereItFits:
      "Between build-up layers — especially across the interconnect (wiring) stack — and after steps that leave excess material, such as filling trenches or vias.",

    inputs: [
      "A wafer with an uneven surface or excess material",
      "Polishing slurry — a chemically active liquid carrying fine abrasive particles",
      "A polishing pad",
    ],
    howItWorks: [
      "Press & spin: the wafer is held face-down and pressed against a rotating pad.",
      "Polish: slurry is fed onto the pad; the chemistry softens the surface while abrasive particles and the pad mechanically remove material, preferentially taking down the high spots.",
      "Stop at target: removal is controlled to a target thickness or planarity using endpoint signals, then the wafer is cleaned.",
    ],
    outputs: [
      "A flat, planar wafer surface with excess material removed — ready for the next layer's lithography or deposition.",
    ],
    subsystems: [
      { name: "Polishing head / carrier", detail: "Holds the wafer and applies controlled pressure." },
      { name: "Platen & pad", detail: "The rotating surface that, with slurry, removes material." },
      { name: "Slurry delivery", detail: "Feeds the chemically active, abrasive slurry." },
      { name: "Pad conditioner", detail: "Keeps the pad in a consistent, effective state." },
      { name: "Endpoint & cleaning", detail: "Detects when to stop and removes slurry residue afterward." },
    ],
    parameters: [
      { name: "Removal rate", detail: "How fast material is taken off — traded against control and uniformity." },
      { name: "Selectivity", detail: "How much faster one material polishes than another — used to stop on a target layer." },
      { name: "Planarity / uniformity", detail: "How flat the result is, across features and across the wafer." },
      { name: "Down-force & speed", detail: "Pressure and rotation, which set removal rate and uniformity." },
      { name: "Dishing & erosion", detail: "Over-polishing of soft or dense regions — key effects to control." },
    ],
    parametersNote:
      "Removal rates, slurry chemistries, and pad conditions are process- and vendor-specific — treat any figures elsewhere as examples, not universal values.",
    performance: [
      "Two goals compete: remove enough material and leave a flat surface, without over-polishing. Selectivity — polishing the target faster than the underlying stop layer — lets CMP stop where intended; poor selectivity causes 'dishing' (soft regions polished too low) and 'erosion' (dense regions worn down).",
      "Because CMP is a coupled physical-chemical process, it is inherently variable. Endpoint detection and tight consumable (pad and slurry) control are what make it repeatable.",
    ],
    defects: [
      "Dishing and erosion → non-flat interconnects",
      "Scratches from the pad or stray particles",
      "Slurry residue → defects if not fully cleaned",
      "Non-uniform removal → thickness variation across the wafer",
      "Over- or under-polish → wrong remaining thickness",
    ],
    metrology: [
      "After CMP, remaining film thickness and planarity are measured and wafers are inspected for scratches and residue, feeding back to adjust pressure, time, and consumables.",
    ],
    yieldImplications: [
      "CMP defects — scratches, residue, dishing — directly cause opens, shorts, and lithography problems on later layers, so CMP is a notable yield and defectivity lever.",
    ],
    manufacturingImplications: [
      "Slurry and pads are consumables with real cost and variability; consumable management, pad conditioning, and endpoint reliability drive CMP throughput and consistency.",
    ],
    cost: [
      "Consumables (slurry, pads) on top of the tools make CMP a meaningful ongoing cost; specifics are vendor-dependent and are not stated here.",
    ],
    relatedMaterials: [
      { label: "Slurry & abrasives" },
      { label: "Polishing pads" },
    ],
    relatedEquipment: [
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
      { label: "Lithography", href: "/semiconductors/equipment/lithography" },
      { label: "Metrology & inspection", href: "/semiconductors/equipment#metrology-inspection" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["cmp", "metallization"],
    supplyChainConnection:
      "CMP depends on a steady supply of specialty slurries and pads and a small set of tool makers — consumables are a real supply-chain factor.",
    advanced: [
      "CMP for advanced interconnect and new materials",
      "Reducing dishing and erosion at tight pitches",
      "In-situ and improved endpoint techniques",
    ],
    learnNext: [
      { label: "CMP (process)", href: "/semiconductors/learn/cmp" },
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
      { label: "Metallization", href: "/semiconductors/learn/metallization" },
    ],
  },
  {
    slug: "metrology",
    diagram: "control-loop",
    diagramCaption: "How does the process-control loop work?",
    learningLoop: {
      youJustLearned: [
        "Why 'you cannot control what you cannot measure' is central",
        "What film thickness, CD, overlay, and defectivity measure",
        "How measurement feeds the process-control loop",
        "Why sampling trades coverage against speed",
      ],
      nowYouKnow:
        "You can see how measurement turns manufacturing from guesswork into a controlled loop that protects yield.",
    },
    title: "Metrology equipment",
    summary:
      "The measurement tools that quantify what the process actually produced — film thickness, feature size, overlay, and more — so the process can be controlled.",
    categoryId: "metrology-inspection",

    quickAnswer:
      "Metrology equipment measures the wafer: how thick the films are, how big the features are, how well layers align, and the surface and electrical properties. These measurements are what let engineers keep every process on target.",
    whyItMatters:
      "You cannot control what you cannot measure. Metrology turns a process from guesswork into a controlled loop: it quantifies the result of each step so deviations are caught and corrected before they cost yield.",
    intuition: [
      "Every process step has some variation. Metrology is how the fab 'sees' that variation — by measuring the real wafer instead of assuming the step worked.",
      "Different measurements answer different questions: How thick is this film? How wide is this line? Did this layer land on top of the last one?",
    ],
    whereItFits:
      "Throughout the flow, after key steps — often on sample wafers or sample sites — feeding the data that keeps every other tool in spec.",

    inputs: [
      "A processed wafer, or sample sites on it",
      "A measurement recipe defining what to measure and where",
    ],
    howItWorks: [
      "Measure: an appropriate technique quantifies the property of interest — for example an optical method for film thickness, or a specialized tool for feature size and overlay.",
      "Compare: the measured value is compared against the target and the control limits.",
      "Feed back: deviations are used to adjust the responsible process tool before more wafers drift.",
    ],
    outputs: [
      "Quantitative data — thickness, critical dimension, overlay, and more — that drives process-control decisions.",
    ],
    subsystems: [
      { name: "Measurement sensor / optics", detail: "The core technique that quantifies the property." },
      { name: "Precision stage", detail: "Positions the wafer to measure the right sites accurately." },
      { name: "Recipe & data system", detail: "Defines what and where to measure, and records results for control." },
    ],
    parameters: [
      { name: "Accuracy & precision", detail: "How correct, and how repeatable, the measurement is — both matter for control." },
      { name: "Throughput vs sampling", detail: "How many wafers and sites are measured; more sampling catches more, but costs time." },
      { name: "Sensitivity", detail: "The smallest change the tool can reliably detect." },
    ],
    parametersNote:
      "Achievable accuracy, precision, and throughput are technique- and vendor-dependent — treat any figures elsewhere as examples, not universal specs.",
    performance: [
      "The measurements that matter most include: film thickness (are deposited or grown layers on target?), critical dimension or CD (are features the right size?), overlay (did this layer align to the previous one?), surface properties (roughness and topography), electrical properties (for example sheet resistance as a proxy for doping and activation), and defectivity (covered under inspection).",
      "A key trade-off is measurement quality versus speed and sampling. Measuring every wafer everywhere would be ideal for control but is impractical, so fabs sample intelligently and rely on precise, repeatable tools.",
      "This is the heart of process control: run the process, measure the result, compare it against target, adjust the tool, and run again. Equipment provides both the sensing and the knobs; process control closes the loop; and the tighter and faster that loop runs, the higher the yield.",
    ],
    defects: [
      "A wrong or drifting measurement is dangerous — it can hide a real process problem or trigger a false correction",
      "Poor sampling → problems missed between measured wafers",
      "Low precision → real drifts lost in measurement noise",
    ],
    yieldImplications: [
      "Metrology is a yield multiplier: fast, accurate measurement shortens the learning cycle and catches drifts early, while blind spots let systematic errors reach many wafers before they are discovered.",
    ],
    manufacturingImplications: [
      "Metrology defines the sampling plan and control limits for the whole fab; its accuracy and uptime gate how tightly every other process can be run.",
    ],
    cost: [
      "Metrology adds tool cost and cycle time, but pays back by preventing scrap; specific costs are vendor-dependent and are not stated here.",
    ],
    relatedEquipment: [
      { label: "Inspection", href: "/semiconductors/equipment/inspection" },
      { label: "Lithography", href: "/semiconductors/equipment/lithography" },
      { label: "CMP", href: "/semiconductors/equipment/cmp" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["metrology"],
    supplyChainConnection:
      "Metrology tools come from specialist equipment makers and are a strategic part of a fab's process-control capability.",
    advanced: [
      "In-line and in-situ metrology for real-time control",
      "Machine-learning-assisted and 'virtual' metrology",
      "Metrology for 3D and high-aspect-ratio structures",
    ],
    learnNext: [
      { label: "Metrology (process)", href: "/semiconductors/learn/metrology" },
      { label: "Inspection", href: "/semiconductors/equipment/inspection" },
      { label: "Lithography", href: "/semiconductors/equipment/lithography" },
    ],
  },
  {
    slug: "inspection",
    diagram: "control-loop",
    diagramCaption: "How does inspection close the control loop?",
    learningLoop: {
      youJustLearned: [
        "How inspection finds and classifies defects",
        "Why classification matters as much as detection",
        "How defect trends point to the responsible process step",
        "Why sensitivity trades against nuisance defects",
      ],
      nowYouKnow:
        "You understand how inspection turns yield loss from a mystery into a list of fixable causes.",
    },
    title: "Inspection equipment",
    summary:
      "The tools that find and classify defects on the wafer — where metrology measures dimensions, inspection hunts for the particles, scratches, and pattern flaws that kill chips.",
    categoryId: "metrology-inspection",

    quickAnswer:
      "Inspection equipment scans wafers to find defects — particles, scratches, pattern flaws — and classifies them. Where metrology measures how big or thick things are, inspection asks 'is anything wrong, where, and what kind?' It is central to finding and fixing yield problems.",
    whyItMatters:
      "A single well-placed defect can kill a die. Inspection catches defects early, locates them, and — by classifying and counting them — reveals which process step is causing yield loss, so it can be fixed.",
    intuition: [
      "Metrology measures the things you meant to make; inspection looks for the things you didn't — a stray particle, a scratch, a missing or bridged pattern.",
      "Finding a defect is only half the job: knowing what kind it is and where it came from is what lets you stop it happening again.",
    ],
    whereItFits:
      "After key steps and throughout the flow — often catching defects on sample wafers so a drifting or contaminating tool is found before it spoils many wafers.",

    inputs: [
      "A processed wafer",
      "An inspection recipe defining sensitivity and the area to scan",
    ],
    howItWorks: [
      "Scan: the wafer surface or pattern is scanned to detect anything that differs from the expected pattern or a clean surface.",
      "Detect & locate: candidate defects are found and their positions recorded on a defect map.",
      "Classify & count: defects are sorted into types and tallied — often with higher-magnification review — to point at a root cause.",
    ],
    outputs: [
      "Defect maps and classified defect counts that reveal where and how yield is being lost, feeding process monitoring and improvement.",
    ],
    subsystems: [
      { name: "Imaging / scanning system", detail: "Scans the wafer to detect deviations (optical or other techniques)." },
      { name: "Defect detection engine", detail: "Compares against the expected pattern or neighbouring dies to flag defects." },
      { name: "Review & classification", detail: "Higher-resolution review that categorizes defect types." },
      { name: "Defect-map & data system", detail: "Records locations and counts for analysis and trending." },
    ],
    parameters: [
      { name: "Sensitivity", detail: "The smallest or most subtle defect the tool can reliably catch." },
      { name: "Throughput vs coverage", detail: "How much area is scanned, how fast — more coverage catches more but costs time." },
      { name: "Capture & classification accuracy", detail: "How reliably real defects are found and correctly typed, versus false counts." },
    ],
    parametersNote:
      "Achievable sensitivity, throughput, and coverage are technique- and vendor-dependent — treat any figures elsewhere as examples, not universal specs.",
    performance: [
      "Inspection balances sensitivity against speed and false counts. Too insensitive and killer defects slip through; too sensitive and engineers drown in nuisance flags. Good classification — sorting real, yield-relevant defects from harmless ones — is as important as raw detection.",
      "Inspection is the sensing half of process monitoring: a rising count of a particular defect type points straight at the tool or step responsible, driving a targeted fix. It is the same control loop as metrology — measure, compare, adjust, run again — applied to defects rather than dimensions.",
    ],
    defects: [
      "Missed (undetected) killer defects → yield loss discovered too late",
      "Too many nuisance or false defects → wasted review effort",
      "Misclassification → the wrong root cause chased",
      "Sparse sampling → excursions caught late",
    ],
    yieldImplications: [
      "Inspection is a primary driver of yield improvement: by finding, classifying, and trending defects, it turns yield loss from a mystery into a list of fixable causes — and the faster the loop runs, the faster yield climbs.",
    ],
    manufacturingImplications: [
      "Inspection defines the defect-monitoring strategy; its sensitivity and sampling determine how quickly a contaminating or drifting tool (an 'excursion') is caught and contained.",
    ],
    cost: [
      "Inspection adds tool cost and cycle time but prevents large-scale scrap; specifics are vendor-dependent and are not stated here.",
    ],
    relatedEquipment: [
      { label: "Metrology", href: "/semiconductors/equipment/metrology" },
      { label: "CMP", href: "/semiconductors/equipment/cmp" },
      { label: "Lithography", href: "/semiconductors/equipment/lithography" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["metrology"],
    supplyChainConnection:
      "Inspection tools are highly specialized and come from a small set of equipment makers — a strategic capability for yield.",
    advanced: [
      "Higher-sensitivity and e-beam inspection for the smallest defects",
      "Machine-learning defect classification",
      "Inspecting 3D and buried structures",
    ],
    learnNext: [
      { label: "Metrology", href: "/semiconductors/equipment/metrology" },
      { label: "Metrology (process)", href: "/semiconductors/learn/metrology" },
      { label: "Wafer test", href: "/semiconductors/learn/wafer-test" },
    ],
  },
  {
    slug: "die-attach",
    title: "Die attach equipment",
    summary:
      "The tools that place each die onto its package substrate or carrier and bond it down — the first assembly step after a wafer is cut into individual chips.",
    categoryId: "packaging",

    quickAnswer:
      "Die attach equipment picks up an individual die and bonds it onto a substrate, leadframe, or another die. It is the first step of assembly: getting the bare chip mounted so it can be connected and protected.",
    whyItMatters:
      "The die-attach bond holds the chip in place and often carries heat (and sometimes current) away from it. A weak or voided bond leads to overheating and reliability failures, so die-attach quality underpins the whole package.",
    intuition: [
      "Once a wafer is sliced into individual chips, each tiny die has to be set down accurately onto its package and fixed in place — that is die attach.",
      "The 'glue' can be an adhesive, a polymer paste, or a solder, chosen for how much heat or current the bond must carry.",
    ],
    whereItFits:
      "At the start of assembly, right after the wafer is singulated into dies and before interconnection (wire bonding or flip-chip).",

    inputs: [
      "Singulated dies",
      "A substrate, leadframe, or base die",
      "A die-attach material (adhesive, paste, or solder)",
    ],
    howItWorks: [
      "Pick: a tool picks up a known-good die.",
      "Place: it positions the die accurately onto the substrate.",
      "Bond: the die-attach material is cured or reflowed to fix the die in place.",
    ],
    outputs: ["A die mounted and bonded to its carrier, ready for interconnection."],
    subsystems: [
      { name: "Pick-and-place head", detail: "Picks up and precisely positions each die." },
      { name: "Material dispense", detail: "Applies adhesive, paste, or solder for the bond." },
      { name: "Bond / cure stage", detail: "Cures or reflows the material to set the bond." },
      { name: "Vision / alignment", detail: "Aligns the die to the substrate accurately." },
    ],
    parameters: [
      { name: "Placement accuracy", detail: "How precisely the die lands on the substrate." },
      { name: "Bond-line thickness", detail: "The thickness of the attach material, affecting heat flow and stress." },
      { name: "Void content", detail: "Trapped voids in the bond that hurt heat transfer and reliability." },
      { name: "Throughput", detail: "Dies placed per hour." },
    ],
    parametersNote:
      "Exact accuracies, materials, and cure conditions are package- and vendor-dependent; treat any figures elsewhere as examples, not universal specs.",
    defects: [
      "Voids in the bond → hot spots and reliability loss",
      "Die tilt or misplacement → downstream interconnect problems",
      "Insufficient cure or reflow → a weak bond",
      "Contamination → poor adhesion",
    ],
    yieldImplications: [
      "Because it is early in assembly, a die-attach defect can waste all the value added afterward; bond integrity is a key reliability driver.",
    ],
    relatedMaterials: [
      { label: "Substrates" },
      { label: "Die-attach adhesives & solder" },
      { label: "Thermal interface materials" },
    ],
    relatedEquipment: [
      { label: "Wire bonding", href: "/semiconductors/equipment/wire-bonding" },
      { label: "Flip-chip", href: "/semiconductors/equipment/flip-chip" },
      { label: "Singulation", href: "/semiconductors/equipment/singulation" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["packaging", "dicing", "die-vs-package"],
    packagingConnection:
      "Die attach is the opening step of packaging; the substrate it bonds to and the thermal path it creates shape the whole package.",
    supplyChainConnection:
      "Die attach depends on substrates, adhesives, and solder materials from the packaging-materials supply chain.",
    advanced: [
      "Solder and sintered-metal die attach for high power and heat",
      "Die-to-die attach for 3D stacks",
      "High-accuracy placement for fine-pitch and chiplet assembly",
    ],
    learnNext: [
      { label: "Packaging (learn)", href: "/semiconductors/learn/packaging" },
      { label: "Wire bonding", href: "/semiconductors/equipment/wire-bonding" },
      { label: "Die vs package", href: "/semiconductors/learn/die-vs-package" },
    ],
  },
  {
    slug: "wire-bonding",
    title: "Wire bonding equipment",
    summary:
      "The machines that stitch fine metal wires between the die's pads and the package, forming the electrical connections in the most widely used interconnect method.",
    categoryId: "packaging",

    quickAnswer:
      "Wire bonding equipment connects the die to its package by welding very fine metal wires from the chip's pads to the package leads. It is the most common way to make a packaged chip's electrical connections.",
    whyItMatters:
      "Every signal and power line into and out of the chip runs through these connections. Wire bonding is mature, flexible, and low-cost, which is why it still dominates a huge share of packaged devices.",
    intuition: [
      "After a die is mounted, its tiny pads must be wired to the outside world. Wire bonding welds a hair-thin wire from each pad to a matching point on the package.",
      "Each bond is a tiny weld made with heat, pressure, and ultrasonic vibration — repeated hundreds of times per chip, very fast.",
    ],
    whereItFits:
      "In the interconnect step, after die attach, for wire-bonded package types.",

    inputs: [
      "A die-attached substrate or leadframe",
      "Fine bonding wire (a metal such as gold, copper, or aluminium)",
    ],
    howItWorks: [
      "First bond: the tool forms a bond on the die pad.",
      "Loop: it feeds and shapes a wire loop across to the package.",
      "Second bond & cut: it bonds to the package lead and cuts the wire, then repeats for the next pad.",
    ],
    outputs: ["A die whose pads are electrically connected to the package, ready for encapsulation."],
    subsystems: [
      { name: "Bond head & capillary", detail: "Guides the wire and forms each bond." },
      { name: "Ultrasonic + heat system", detail: "Supplies the energy that welds the wire." },
      { name: "Wire feed", detail: "Feeds and tensions the bonding wire." },
      { name: "Vision / alignment", detail: "Locates pads and leads precisely." },
    ],
    parameters: [
      { name: "Bond pitch", detail: "How closely spaced the pads and bonds are — finer pitch is harder." },
      { name: "Loop height / shape", detail: "The wire arc, which must avoid shorts and fit the package." },
      { name: "Bond strength", detail: "How well each weld holds — checked by pull and shear tests." },
      { name: "Throughput", detail: "Bonds (wires) per second." },
    ],
    parametersNote:
      "Wire materials, pitches, and bond settings are package- and vendor-dependent; treat any figures elsewhere as examples, not universal specs.",
    defects: [
      "Weak or lifted bonds → opens",
      "Wire sweep or sagging loops → shorts",
      "Cratering or pad damage under the bond",
      "Wrong wire material or settings → reliability loss",
    ],
    yieldImplications: [
      "A single bad bond can fail a whole package; bond reliability is a major back-end quality metric.",
    ],
    relatedMaterials: [
      { label: "Bonding wire (gold / copper / aluminium)" },
      { label: "Substrates" },
    ],
    relatedEquipment: [
      { label: "Die attach", href: "/semiconductors/equipment/die-attach" },
      { label: "Flip-chip", href: "/semiconductors/equipment/flip-chip" },
      { label: "Molding", href: "/semiconductors/equipment/molding" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["wire-bonding", "electrical-connections", "packaging"],
    packagingConnection:
      "Wire bonding is one of the two main ways a package makes its electrical connections (the other is flip-chip).",
    supplyChainConnection:
      "It depends on fine bonding wire and substrates from the packaging-materials supply chain.",
    advanced: [
      "Copper and silver wire for cost and performance",
      "Fine-pitch and high-count bonding",
      "Wire bonding for power and high-reliability parts",
    ],
    learnNext: [
      { label: "Electrical connections", href: "/semiconductors/learn/electrical-connections" },
      { label: "Flip-chip", href: "/semiconductors/equipment/flip-chip" },
      { label: "Wire bonding (learn)", href: "/semiconductors/learn/wire-bonding" },
    ],
  },
  {
    slug: "flip-chip",
    title: "Flip-chip equipment",
    summary:
      "The tools that connect a die face-down to its substrate through arrays of tiny solder bumps — a higher-performance alternative to wire bonding.",
    categoryId: "packaging",

    quickAnswer:
      "Flip-chip equipment connects a die by flipping it face-down and joining an array of small solder bumps on its surface directly to the substrate. This gives far more connections and shorter electrical paths than wire bonding.",
    whyItMatters:
      "Flip-chip provides many more connections with lower resistance and inductance, which high-performance chips (processors, high-bandwidth devices) need. It also enables advanced 2.5D and 3D packaging.",
    intuition: [
      "Instead of running wires from the edge pads, flip-chip puts connection bumps all across the face of the die, then turns the die over and lands it on the substrate.",
      "Because connections cover the whole face, thousands are possible in a small area.",
    ],
    whereItFits:
      "In the interconnect step for flip-chip package types, after bumps are formed on the wafer and the die is placed.",

    inputs: [
      "A bumped die (solder bumps formed on the pads)",
      "A substrate or another die",
      "Underfill material (added after joining)",
    ],
    howItWorks: [
      "Flip & align: the die is turned face-down and aligned to the substrate.",
      "Join: the solder bumps are reflowed (or thermocompression-bonded) to connect the die.",
      "Underfill: a material is flowed under the die to protect the joints and manage stress.",
    ],
    outputs: ["A die electrically joined to the substrate through a bump array, mechanically reinforced by underfill."],
    subsystems: [
      { name: "Flip & placement head", detail: "Turns and precisely places the die." },
      { name: "Bonding / reflow system", detail: "Joins the bumps by reflow or thermocompression." },
      { name: "Underfill dispense", detail: "Fills and protects the gap under the die." },
      { name: "Vision / alignment", detail: "Aligns bump arrays to substrate pads." },
    ],
    parameters: [
      { name: "Placement accuracy", detail: "Alignment of the bump array to the substrate — critical at fine pitch." },
      { name: "Bump pitch / count", detail: "How closely spaced, and how many, the connections are." },
      { name: "Joint quality", detail: "Well-formed, void-free solder joints." },
      { name: "Underfill coverage", detail: "Complete, void-free fill under the die." },
    ],
    parametersNote:
      "Bump pitches, bonding methods, and materials are package- and vendor-dependent; treat any figures elsewhere as examples, not universal specs.",
    defects: [
      "Misalignment → bridged or missing joints",
      "Voids in joints or underfill → reliability loss",
      "Insufficient reflow → weak or open joints",
      "Warpage → uneven joining",
    ],
    yieldImplications: [
      "With thousands of joints, a single bad joint can fail the part; flip-chip yield and reliability hinge on alignment and joint quality.",
    ],
    relatedMaterials: [
      { label: "Solder bumps / microbumps" },
      { label: "Substrates" },
      { label: "Underfill" },
    ],
    relatedEquipment: [
      { label: "Wire bonding", href: "/semiconductors/equipment/wire-bonding" },
      { label: "Advanced bonding", href: "/semiconductors/equipment/advanced-bonding" },
      { label: "Advanced packaging", href: "/semiconductors/equipment/advanced-packaging" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["flip-chip", "electrical-connections", "packaging"],
    packagingConnection:
      "Flip-chip is the high-performance interconnect that underpins most advanced 2.5D and 3D packaging.",
    supplyChainConnection:
      "It relies on bumping materials, substrates, and underfill from the packaging-materials supply chain.",
    advanced: [
      "Fine-pitch microbumps for 2.5D and 3D",
      "Thermocompression bonding for tight control",
      "The path toward bumpless / hybrid bonding",
    ],
    learnNext: [
      { label: "Flip-chip (learn)", href: "/semiconductors/learn/flip-chip" },
      { label: "Advanced bonding", href: "/semiconductors/equipment/advanced-bonding" },
      { label: "2.5D packaging", href: "/semiconductors/learn/2-5d" },
    ],
  },
  {
    slug: "molding",
    title: "Molding (encapsulation) equipment",
    summary:
      "The encapsulation tools that seal the die and its connections in a protective molding compound, forming the body of the package.",
    categoryId: "packaging",

    quickAnswer:
      "Molding equipment encapsulates the die and its interconnections in a protective compound — usually an epoxy — creating the solid package body that shields the chip from moisture, contamination, and mechanical damage.",
    whyItMatters:
      "Bare dies and fine bonds are fragile. Encapsulation protects them and gives the package its mechanical form and handling robustness; it also affects heat flow and reliability.",
    intuition: [
      "After the die is connected, it needs to be sealed inside a tough body — molding surrounds it with a protective compound that hardens into the package you can see and handle.",
      "Think of setting a delicate part in solid resin so it survives the outside world.",
    ],
    whereItFits:
      "In the encapsulation step, after interconnection and before singulation, for molded package types.",

    inputs: [
      "Interconnected dies on substrates or leadframes",
      "Molding compound (typically an epoxy resin)",
    ],
    howItWorks: [
      "Load: assembled units are placed in a mold.",
      "Fill: molding compound is introduced under heat and pressure to surround the die and connections.",
      "Cure: the compound hardens, then units are removed and post-cured.",
    ],
    outputs: ["Encapsulated packages with the die sealed inside a protective body."],
    subsystems: [
      { name: "Mold & press", detail: "Shapes the package and applies heat and pressure." },
      { name: "Compound feed", detail: "Delivers and meters the molding compound." },
      { name: "Cure system", detail: "Hardens the compound." },
    ],
    parameters: [
      { name: "Fill completeness", detail: "Full encapsulation with no unfilled areas." },
      { name: "Void content", detail: "Trapped voids that weaken protection and heat flow." },
      { name: "Warpage", detail: "Package bowing from cure stress — worse for thin or large packages." },
      { name: "Cure conditions", detail: "Time and temperature that set final properties." },
    ],
    parametersNote:
      "Compounds and mold conditions are package- and vendor-dependent; treat any figures elsewhere as examples, not universal specs.",
    defects: [
      "Incomplete fill → exposed, unprotected areas",
      "Voids → weak spots and heat traps",
      "Warpage → assembly and board-level problems",
      "Wire sweep during fill → shorts",
    ],
    yieldImplications: [
      "Molding defects can ruin otherwise-good assemblies late in the flow; fill quality and warpage control are key.",
    ],
    relatedMaterials: [
      { label: "Molding compound (epoxy)" },
      { label: "Substrates" },
    ],
    relatedEquipment: [
      { label: "Wire bonding", href: "/semiconductors/equipment/wire-bonding" },
      { label: "Singulation", href: "/semiconductors/equipment/singulation" },
      { label: "Packaging inspection", href: "/semiconductors/equipment/packaging-inspection" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["packaging"],
    packagingConnection:
      "Encapsulation forms the package body that protects the die and gives the part its handleable form.",
    supplyChainConnection:
      "Molding depends on epoxy molding compounds from the packaging-materials supply chain.",
    advanced: [
      "Low-warpage compounds for thin and large packages",
      "Molded wafer-level and fan-out encapsulation",
      "Compounds tuned for heat and reliability",
    ],
    learnNext: [
      { label: "Packaging (learn)", href: "/semiconductors/learn/packaging" },
      { label: "Singulation", href: "/semiconductors/equipment/singulation" },
      { label: "Wafer-level packaging", href: "/semiconductors/equipment/wafer-level-packaging" },
    ],
  },
  {
    slug: "singulation",
    title: "Singulation (dicing) equipment",
    summary:
      "The cutting tools that separate a processed wafer, or a molded strip, into individual dies or packages.",
    categoryId: "packaging",

    quickAnswer:
      "Singulation equipment separates many chips made together into individual units — cutting a finished wafer into separate dies, or splitting a molded strip into individual packages. It is how batch-made chips become discrete parts.",
    whyItMatters:
      "Chips are made and packaged in large batches for efficiency, but they ship as individual parts. Singulation makes that separation cleanly, without cracking or chipping the fragile silicon.",
    intuition: [
      "Everything is made many-at-once on a wafer or strip; singulation is the step that finally cuts them apart into individual pieces.",
      "It must cut hard, brittle material precisely without creating cracks that would fail later.",
    ],
    whereItFits:
      "It appears twice in the story: dicing a wafer into dies (around assembly) and singulating molded strips into finished packages (near the end).",

    inputs: [
      "A finished wafer or a molded package strip",
      "A cutting method (blade, laser, or other)",
    ],
    howItWorks: [
      "Mount: the wafer or strip is held on a carrier (for example dicing tape on a frame).",
      "Cut: a blade or laser separates along the streets between units.",
      "Clean & transfer: debris is removed and the singulated units move on.",
    ],
    outputs: ["Individual dies or packages, separated and ready for the next step (assembly or shipping)."],
    subsystems: [
      { name: "Cutting system", detail: "Blade or laser that performs the separation." },
      { name: "Wafer / strip handling", detail: "Mounts and moves the workpiece on a carrier." },
      { name: "Vision / alignment", detail: "Locates the cut streets accurately." },
      { name: "Clean / dry", detail: "Removes cutting debris." },
    ],
    parameters: [
      { name: "Cut accuracy", detail: "Staying centered in the street without hitting devices." },
      { name: "Chipping / cracking", detail: "Edge damage that threatens reliability." },
      { name: "Kerf width", detail: "How much material the cut consumes." },
      { name: "Throughput", detail: "Units separated per hour." },
    ],
    parametersNote:
      "Cutting methods and parameters are material- and vendor-dependent; treat any figures elsewhere as examples, not universal specs.",
    defects: [
      "Chipping or cracking → weak, unreliable dies",
      "Off-street cuts → damaged devices",
      "Debris contamination",
      "Delamination in molded strips",
    ],
    yieldImplications: [
      "Late-stage damage here scraps finished value; clean edges matter for die strength and reliability.",
    ],
    relatedMaterials: [{ label: "Dicing tape & carriers" }],
    relatedEquipment: [
      { label: "Die attach", href: "/semiconductors/equipment/die-attach" },
      { label: "Molding", href: "/semiconductors/equipment/molding" },
      { label: "Packaging inspection", href: "/semiconductors/equipment/packaging-inspection" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["dicing", "packaging"],
    packagingConnection:
      "Singulation bridges the wafer and package worlds — turning batches into the individual parts that get assembled and shipped.",
    supplyChainConnection:
      "It depends on consumables such as dicing tape and blades from the packaging-materials supply chain.",
    advanced: [
      "Laser and plasma dicing for narrow streets and fragile wafers",
      "Dicing very thin wafers",
      "Stealth dicing techniques",
    ],
    learnNext: [
      { label: "Dicing (learn)", href: "/semiconductors/learn/dicing" },
      { label: "Packaging inspection", href: "/semiconductors/equipment/packaging-inspection" },
      { label: "Wafer test", href: "/semiconductors/learn/wafer-test" },
    ],
  },
  {
    slug: "wafer-level-packaging",
    title: "Wafer-level packaging equipment",
    summary:
      "The tools that build the package directly on the wafer — before dicing — so many packages are formed together, enabling very small, high-density parts.",
    categoryId: "packaging",

    quickAnswer:
      "Wafer-level packaging (WLP) equipment forms the package while the chips are still on the wafer, rather than one die at a time. This makes very compact packages, processes many at once, and underpins fan-out and advanced packaging.",
    whyItMatters:
      "Doing packaging steps at wafer scale is efficient and enables the smallest packages (near the size of the die itself) and fan-out approaches that add more connections without a traditional substrate.",
    intuition: [
      "Traditional packaging handles one die at a time; wafer-level packaging keeps everything on the wafer and builds the connections there, then dices at the end.",
      "It borrows wafer-fab-style steps — deposition, lithography, plating — and applies them to packaging.",
    ],
    whereItFits:
      "An alternative packaging path that overlaps front-end-style processing, used for WLP and fan-out package types; singulation comes at the end.",

    inputs: [
      "A wafer of finished dies (or a reconstituted wafer of dies in a carrier)",
      "Redistribution and bump materials",
    ],
    howItWorks: [
      "Redistribute: build a redistribution layer (RDL) to route the die's pads outward.",
      "Bump: form solder bumps or balls for board connection.",
      "Singulate: dice the wafer into finished, packaged parts.",
    ],
    outputs: ["Individual, already-packaged parts once the wafer is diced."],
    subsystems: [
      { name: "RDL processing", detail: "Deposition, lithography, and plating to build routing (fab-like tools)." },
      { name: "Bumping", detail: "Forms the external solder connections." },
      { name: "Carrier / handling", detail: "Manages wafers or reconstituted carriers." },
    ],
    parameters: [
      { name: "RDL line / space", detail: "How fine the redistribution routing is." },
      { name: "Bump uniformity", detail: "Consistent, well-formed external connections." },
      { name: "Warpage", detail: "Reconstituted-wafer bow that challenges processing." },
      { name: "Overlay / alignment", detail: "Accurate routing to the die pads." },
    ],
    parametersNote:
      "WLP and fan-out capabilities are technology- and vendor-dependent; treat any figures elsewhere as examples, not universal specs.",
    defects: [
      "RDL opens or shorts",
      "Bump non-uniformity",
      "Warpage-driven lithography errors",
      "Die shift in reconstituted wafers",
    ],
    yieldImplications: [
      "Because many packages are built together, a systematic wafer-level error affects many parts at once — but the batch efficiency is a major advantage.",
    ],
    relatedMaterials: [
      { label: "Redistribution metals & dielectrics" },
      { label: "Solder bumps / balls" },
    ],
    relatedEquipment: [
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
      { label: "Lithography", href: "/semiconductors/equipment/lithography" },
      { label: "Advanced packaging", href: "/semiconductors/equipment/advanced-packaging" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["wafer-level-packaging", "packaging"],
    packagingConnection:
      "WLP and fan-out are a bridge between wafer fabrication and packaging, using fab-style tools to build the package.",
    supplyChainConnection:
      "It draws on both the fab and packaging-materials supply chains (RDL, dielectrics, bumping).",
    advanced: [
      "Fan-out wafer- and panel-level packaging",
      "High-density RDL for chiplets",
      "Panel-scale processing for cost",
    ],
    learnNext: [
      { label: "Wafer-level packaging (learn)", href: "/semiconductors/learn/wafer-level-packaging" },
      { label: "Advanced packaging", href: "/semiconductors/equipment/advanced-packaging" },
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
    ],
  },
  {
    slug: "advanced-bonding",
    title: "Advanced bonding equipment",
    summary:
      "The precision bonding tools that join dies or wafers directly — including hybrid bonding — for the tightest, highest-density interconnects in 3D integration.",
    categoryId: "packaging",

    quickAnswer:
      "Advanced bonding equipment joins dies or wafers with extreme precision, including hybrid bonding that connects copper-to-copper and dielectric-to-dielectric without solder bumps. It enables the densest, shortest interconnects for 3D-stacked chips.",
    whyItMatters:
      "As connections shrink below what solder bumps allow, direct and hybrid bonding provide far higher connection density and performance — key to 3D stacking, high-bandwidth memory, and leading-edge chiplet integration.",
    intuition: [
      "When even microbumps are too big and slow, dies can be bonded face-to-face directly, with metal pads meeting metal pads — that is hybrid bonding.",
      "It needs near-perfect flatness, cleanliness, and alignment, because the surfaces essentially fuse together.",
    ],
    whereItFits:
      "In advanced interconnect and 3D integration, as a higher-density alternative to bumped flip-chip.",

    inputs: [
      "Prepared, ultra-flat and clean die or wafer surfaces",
      "Precisely defined bonding pads",
    ],
    howItWorks: [
      "Prepare: surfaces are made extremely flat and clean.",
      "Align: dies or wafers are aligned with very high precision.",
      "Bond: surfaces are joined (often dielectric bonding first, then a thermal step forms the metal connections).",
    ],
    outputs: ["A directly bonded die or wafer stack with very high-density interconnections."],
    subsystems: [
      { name: "High-precision aligner", detail: "Aligns bonding partners to very tight tolerance." },
      { name: "Bond chamber", detail: "Joins surfaces under controlled conditions." },
      { name: "Surface preparation", detail: "Ensures the flatness and cleanliness a direct bond needs." },
    ],
    parameters: [
      { name: "Alignment accuracy", detail: "Extremely tight — the limiter for connection density." },
      { name: "Surface flatness / cleanliness", detail: "Prerequisites for a good direct bond." },
      { name: "Bond strength / voids", detail: "Void-free, strong bonds across the interface." },
      { name: "Interconnect pitch", detail: "How tightly connections can be packed." },
    ],
    parametersNote:
      "Hybrid-bonding capabilities are leading-edge and vendor-dependent; treat any figures elsewhere as examples, not universal specs.",
    defects: [
      "Misalignment → failed or incorrect connections",
      "Voids or particles at the interface → weak bonds or opens",
      "Surface non-flatness → incomplete bonding",
    ],
    yieldImplications: [
      "At these densities, tiny particles or slight misalignment cause failures; cleanliness and alignment dominate yield.",
    ],
    relatedMaterials: [
      { label: "Bonding dielectrics & copper" },
      { label: "Ultra-clean surfaces" },
    ],
    relatedEquipment: [
      { label: "Flip-chip", href: "/semiconductors/equipment/flip-chip" },
      { label: "Advanced packaging", href: "/semiconductors/equipment/advanced-packaging" },
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["3d-ic", "advanced-packaging"],
    packagingConnection:
      "Hybrid and direct bonding is the enabling step for the densest 3D stacks and leading-edge chiplet integration.",
    supplyChainConnection:
      "It relies on specialized bonding tools and ultra-clean process materials — a leading-edge capability.",
    advanced: [
      "Wafer-to-wafer and die-to-wafer hybrid bonding",
      "Sub-micron bond pitch for 3D",
      "Bonding for high-bandwidth memory stacks",
    ],
    learnNext: [
      { label: "3D IC (learn)", href: "/semiconductors/learn/3d-ic" },
      { label: "Advanced packaging", href: "/semiconductors/equipment/advanced-packaging" },
      { label: "HBM", href: "/semiconductors/learn/hbm" },
    ],
  },
  {
    slug: "packaging-inspection",
    title: "Packaging inspection equipment",
    summary:
      "The inspection tools that check assembled packages for defects — voids, cracks, bond and joint flaws — often seeing inside the package without opening it.",
    categoryId: "packaging",

    quickAnswer:
      "Packaging inspection equipment checks assembled parts for defects: bond and joint quality, voids, cracks, and delamination. It often looks inside the sealed package non-destructively (for example with X-ray or acoustic imaging) to catch problems before parts ship.",
    whyItMatters:
      "Back-end assembly adds hidden failure modes — voids under a die, a cracked joint, delamination. Inspection catches these before shipping, protecting reliability and field quality.",
    intuition: [
      "Once a package is sealed, you cannot just look at the connections — inspection uses techniques that see through the package to find hidden flaws.",
      "It is the back-end cousin of wafer inspection: find and classify defects, then trace them to the process step.",
    ],
    whereItFits:
      "In the inspect step, after encapsulation and singulation, and before or alongside testing.",

    inputs: [
      "Assembled and encapsulated packages",
      "An inspection recipe or method (optical, X-ray, acoustic, and so on)",
    ],
    howItWorks: [
      "Image: the package is imaged externally and/or internally, non-destructively.",
      "Detect: flaws such as voids, cracks, and bad joints are found and located.",
      "Classify: defects are categorized to point at the responsible assembly step.",
    ],
    outputs: ["Pass/fail decisions and defect data that feed back into assembly process control."],
    subsystems: [
      { name: "Imaging system", detail: "Optical, X-ray, or acoustic imaging of the package." },
      { name: "Defect detection / analysis", detail: "Finds and locates internal and external flaws." },
      { name: "Handling", detail: "Presents packages for inspection." },
    ],
    parameters: [
      { name: "Sensitivity", detail: "Smallest void or crack reliably detected." },
      { name: "Coverage", detail: "How much of the package and its joints is inspected." },
      { name: "Throughput", detail: "Parts inspected per hour." },
      { name: "Classification accuracy", detail: "Correctly typing real defects versus nuisance flags." },
    ],
    parametersNote:
      "Inspection methods and sensitivities are package- and vendor-dependent; treat any figures elsewhere as examples, not universal specs.",
    performance: [
      "Like front-end inspection, packaging inspection balances sensitivity against speed and false calls — and its real value is trending defect types back to the assembly step that caused them, closing the measure-compare-adjust loop for the back end.",
    ],
    defects: [
      "Missed hidden voids or cracks → field failures",
      "Excess false calls → wasted yield",
      "Misclassification → the wrong root cause chased",
    ],
    yieldImplications: [
      "Catching assembly defects here prevents shipping latent failures; it closes the process-control loop for the back end.",
    ],
    relatedEquipment: [
      { label: "Molding", href: "/semiconductors/equipment/molding" },
      { label: "Wafer probing", href: "/semiconductors/equipment/wafer-probing" },
      { label: "Semiconductor test", href: "/semiconductors/equipment/semiconductor-test" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["packaging", "final-test"],
    packagingConnection:
      "Packaging inspection is the quality gate of the assembly line, protecting the value added during packaging.",
    supplyChainConnection:
      "Specialized inspection tools are a strategic back-end capability for reliability.",
    advanced: [
      "High-resolution X-ray and CT for complex 3D packages",
      "Acoustic imaging for delamination",
      "Machine-learning defect classification",
    ],
    learnNext: [
      { label: "Wafer probing", href: "/semiconductors/equipment/wafer-probing" },
      { label: "Semiconductor test", href: "/semiconductors/equipment/semiconductor-test" },
      { label: "Packaging (learn)", href: "/semiconductors/learn/packaging" },
    ],
  },
  {
    slug: "wafer-probing",
    title: "Wafer probing equipment",
    summary:
      "The tools that electrically test each die while it is still on the wafer, so bad dies are found before the cost of packaging is spent on them.",
    categoryId: "testing",

    quickAnswer:
      "Wafer probing equipment touches tiny probes to each die's pads and runs electrical tests while the chips are still on the wafer. It identifies known-good dies so that only good ones move on to packaging.",
    whyItMatters:
      "Packaging a bad die wastes money and materials. Wafer test (probe) screens dies early, feeds yield learning back to the fab, and creates the wafer map of good and bad dies used downstream.",
    intuition: [
      "Before spending effort packaging each chip, you test them all on the wafer — a card of fine probes contacts each die and checks whether it works.",
      "The result is a map of which dies are good, so only those get packaged.",
    ],
    whereItFits:
      "Between wafer fabrication and assembly — the first electrical test, often called wafer sort or probe.",

    inputs: [
      "A finished wafer",
      "A probe card matched to the die's pads",
      "A test program (run on the test equipment)",
    ],
    howItWorks: [
      "Align & contact: probes are aligned and lowered onto a die's pads.",
      "Test: the tester runs electrical tests through the probes.",
      "Step & map: the prober steps to the next die and records pass/fail into a wafer map.",
    ],
    outputs: ["A wafer map of known-good versus failing dies, and yield/parametric data fed back to the fab."],
    subsystems: [
      { name: "Prober (stage)", detail: "Positions the wafer and steps die-to-die precisely." },
      { name: "Probe card", detail: "The array of fine contacts to the die pads." },
      { name: "Tester interface", detail: "Connects the probes to the test equipment." },
      { name: "Vision / alignment", detail: "Aligns probes to pads." },
    ],
    parameters: [
      { name: "Contact accuracy", detail: "Landing probes reliably on small pads." },
      { name: "Parallelism", detail: "How many dies are tested at once (throughput)." },
      { name: "Contact quality", detail: "Good electrical contact without pad damage." },
      { name: "Throughput", detail: "Dies tested per hour." },
    ],
    parametersNote:
      "Probe-card designs and test coverage are device- and vendor-dependent; treat any figures elsewhere as examples, not universal specs.",
    defects: [
      "Poor contact → false failures (yield loss)",
      "Pad or probe damage",
      "Misalignment → missed pads",
      "Inadequate coverage → bad dies passed on",
    ],
    yieldImplications: [
      "Probe both measures yield and prevents wasted packaging; contact reliability directly affects apparent yield.",
    ],
    relatedEquipment: [
      { label: "Semiconductor test", href: "/semiconductors/equipment/semiconductor-test" },
      { label: "Metrology & inspection", href: "/semiconductors/equipment#metrology-inspection" },
      { label: "Die attach", href: "/semiconductors/equipment/die-attach" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["wafer-test", "final-test"],
    packagingConnection:
      "Wafer probing decides which dies are worth packaging — the gate between the fab and assembly.",
    supplyChainConnection:
      "It relies on probe cards and test systems from specialized suppliers.",
    advanced: [
      "Massively parallel probing",
      "Probing fine-pitch and bumped wafers",
      "At-speed and specialized test at probe",
    ],
    learnNext: [
      { label: "Wafer test (learn)", href: "/semiconductors/learn/wafer-test" },
      { label: "Semiconductor test", href: "/semiconductors/equipment/semiconductor-test" },
      { label: "Final test (learn)", href: "/semiconductors/learn/final-test" },
    ],
  },
  {
    slug: "semiconductor-test",
    title: "Semiconductor test equipment (ATE)",
    summary:
      "Automated test equipment (ATE) that exercises a chip's functions and measures its parameters to sort good parts from bad, at both wafer and final test.",
    categoryId: "testing",

    quickAnswer:
      "Semiconductor test equipment — automated test equipment, or ATE — applies signals to a chip and measures its responses to verify it works and meets spec. It runs at wafer probe and again after packaging (final test), and sorts parts by result.",
    whyItMatters:
      "Only tested, known-good chips can ship. Test verifies function and performance, sorts (bins) parts by capability, and generates data that drives yield and quality — but thorough testing also adds real cost and time.",
    intuition: [
      "A tester is like an automated exam for the chip: it asks many questions (applies inputs) very fast and checks all the answers (outputs).",
      "The same chip is usually tested twice — once on the wafer and once packaged — because handling and packaging can introduce new failures.",
    ],
    whereItFits:
      "In the test step, both at wafer probe (via a prober) and at final test (via a handler), after packaging.",

    inputs: [
      "Devices to test (on-wafer via a prober, or packaged via a handler)",
      "A test program defining stimuli and pass/fail limits",
    ],
    howItWorks: [
      "Stimulate: the tester applies electrical signals to the device.",
      "Measure: it captures the responses and compares them to limits.",
      "Bin: parts are sorted (binned) by pass/fail and by performance grade.",
    ],
    outputs: ["Known-good, graded parts plus rich test data for yield and quality analysis."],
    subsystems: [
      { name: "Test head & instruments", detail: "Sources signals and measures responses." },
      { name: "Device interface", detail: "Connects to the device (probe card, or socket and handler)." },
      { name: "Test program", detail: "Defines the sequence of tests and their limits." },
      { name: "Data system", detail: "Records results for binning and analysis." },
    ],
    parameters: [
      { name: "Test coverage", detail: "How thoroughly the device's functions are exercised." },
      { name: "Test time", detail: "Time per device — a direct cost driver." },
      { name: "Accuracy", detail: "Measurement precision for parametric limits." },
      { name: "Parallelism", detail: "Devices tested simultaneously." },
    ],
    parametersNote:
      "Test coverage, times, and instrument capabilities are device- and vendor-dependent; treat any figures elsewhere as examples, not universal specs.",
    defects: [
      "Insufficient coverage → bad parts shipped (test escapes)",
      "Over-testing → unnecessary cost and time",
      "Marginal limits → good parts failed or bad parts passed",
      "Contact or handling issues → false results",
    ],
    yieldImplications: [
      "Test defines what ships; coverage and limits trade quality against cost, and test data is central to yield and reliability learning.",
    ],
    relatedEquipment: [
      { label: "Wafer probing", href: "/semiconductors/equipment/wafer-probing" },
      { label: "Burn-in & reliability", href: "/semiconductors/equipment/burn-in" },
      { label: "Packaging inspection", href: "/semiconductors/equipment/packaging-inspection" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["wafer-test", "final-test"],
    packagingConnection:
      "Final test is the last gate after packaging — only parts that pass here are shipped.",
    supplyChainConnection:
      "ATE, handlers, and sockets come from specialized test-equipment suppliers.",
    advanced: [
      "System-level test (SLT) for complex SoCs",
      "Higher parallelism to cut test cost",
      "Adaptive, data-driven test",
    ],
    learnNext: [
      { label: "Final test (learn)", href: "/semiconductors/learn/final-test" },
      { label: "Burn-in & reliability", href: "/semiconductors/equipment/burn-in" },
      { label: "Wafer probing", href: "/semiconductors/equipment/wafer-probing" },
    ],
  },
  {
    slug: "burn-in",
    title: "Burn-in & reliability testing",
    summary:
      "Reliability-screening equipment that stresses parts with heat and voltage over time to weed out early-life failures before they reach customers.",
    categoryId: "testing",

    quickAnswer:
      "Burn-in and reliability equipment stresses chips — typically with elevated temperature and voltage for a period of time — to force weak parts to fail before shipping. It targets 'infant mortality,' the early-life failures that would otherwise happen in the field.",
    whyItMatters:
      "Some defective parts pass normal test but fail soon after, in use. Reliability screening like burn-in catches these early failures, which is essential for high-reliability applications such as automotive, medical, and data-center parts.",
    intuition: [
      "A quick test shows a chip works now; burn-in checks that it keeps working by stressing it hard for a while, so the weak ones fail in the factory instead of in the customer's hands.",
      "It is based on the idea that a small fraction of parts fail very early in life — so stress them to reveal those.",
    ],
    whereItFits:
      "In the reliability part of testing, typically after packaging and often combined with electrical test.",

    inputs: [
      "Packaged parts",
      "Burn-in boards and sockets",
      "Controlled stress conditions (temperature, voltage, time)",
    ],
    howItWorks: [
      "Load: parts are placed in burn-in boards and an environmental chamber or oven.",
      "Stress: elevated temperature and voltage are applied for a set time, often while exercising the parts.",
      "Screen: parts that fail during or after stress are removed; survivors continue.",
    ],
    outputs: ["Reliability-screened parts with early-life failures removed."],
    subsystems: [
      { name: "Environmental chamber / oven", detail: "Applies and controls temperature stress." },
      { name: "Burn-in boards & sockets", detail: "Hold and power many parts under stress." },
      { name: "Stimulus / monitor", detail: "Exercises and watches the parts during stress." },
    ],
    parameters: [
      { name: "Temperature / voltage", detail: "The stress level applied." },
      { name: "Duration", detail: "How long the stress is applied." },
      { name: "Coverage", detail: "How well the stress exercises real failure modes." },
      { name: "Capacity", detail: "How many parts are screened at once." },
    ],
    parametersNote:
      "Reliability-screening conditions are device- and application-dependent; treat any figures elsewhere as examples, not universal specs. This is a conceptual overview, not a qualification procedure.",
    defects: [
      "Under-stress → early failures slip through",
      "Over-stress → damage to good parts or wasted life",
      "Socket or board issues → false results",
    ],
    yieldImplications: [
      "Reliability screening trades some cost and yield for far lower field-failure rates — critical where failures are costly or dangerous.",
    ],
    relatedEquipment: [
      { label: "Semiconductor test", href: "/semiconductors/equipment/semiconductor-test" },
      { label: "Packaging inspection", href: "/semiconductors/equipment/packaging-inspection" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["final-test"],
    packagingConnection:
      "Reliability screening protects the quality of finished, packaged parts before they ship.",
    supplyChainConnection:
      "It links to reliability requirements set by end markets (for example automotive) and to specialized burn-in equipment suppliers.",
    advanced: [
      "Test-during-burn-in for efficiency",
      "Statistical and adaptive reliability screening",
      "Reduced or targeted burn-in guided by data",
    ],
    learnNext: [
      { label: "Final test (learn)", href: "/semiconductors/learn/final-test" },
      { label: "Semiconductor test", href: "/semiconductors/equipment/semiconductor-test" },
      { label: "Supply chain", href: "/supply-chain" },
    ],
  },
  {
    slug: "advanced-packaging",
    diagram: "package-stack",
    diagramCaption: "What is inside a package?",
    learningLoop: {
      youJustLearned: [
        "How advanced packaging integrates multiple dies into one package",
        "The roles of 2.5D, 3D, and chiplets",
        "Why known-good-die yield compounds across a multi-die package",
        "How bonding and substrates enable heterogeneous integration",
      ],
      nowYouKnow:
        "You can see why packaging has become system integration, and a primary way performance keeps improving as classical scaling slows.",
    },
    title: "Advanced packaging equipment",
    summary:
      "The integration tools and platforms that combine multiple dies — 2.5D interposers, 3D stacks, and chiplets — into a single high-performance package.",
    categoryId: "packaging",

    quickAnswer:
      "Advanced packaging equipment builds multi-die packages: placing several dies on an interposer (2.5D), stacking dies vertically (3D), and integrating chiplets. It treats the package as a system, not just protection for one chip.",
    whyItMatters:
      "As single-chip scaling slows, putting multiple optimized dies together in one package delivers more performance and bandwidth. Advanced packaging has become a primary way to keep systems improving — making back-end equipment strategically important.",
    intuition: [
      "Instead of one big chip, advanced packaging combines several smaller dies very close together so they act like one — on a silicon 'interposer', stacked in 3D, or connected as chiplets.",
      "The package becomes part of the system design, not an afterthought.",
    ],
    whereItFits:
      "An integration layer spanning interconnect, bonding, and assembly for 2.5D, 3D, and chiplet products; it builds on flip-chip, wafer-level packaging, and advanced bonding.",

    inputs: [
      "Multiple known-good dies (and often interposers)",
      "High-density interconnect and substrate materials",
    ],
    howItWorks: [
      "Integrate the base: build or place the high-density routing base (for example an interposer).",
      "Place & join dies: attach multiple dies with flip-chip or bonding, aligned precisely.",
      "Build up & finish: add stacking or RDL, encapsulate, and prepare for test.",
    ],
    outputs: ["A multi-die package integrating several chips into one high-performance unit."],
    subsystems: [
      { name: "High-accuracy placement / bonding", detail: "Places and joins multiple dies precisely." },
      { name: "Interposer / RDL processing", detail: "Builds the dense routing between dies." },
      { name: "Assembly & encapsulation", detail: "Completes and protects the multi-die package." },
    ],
    parameters: [
      { name: "Interconnect density", detail: "How many die-to-die connections are possible." },
      { name: "Placement accuracy", detail: "Alignment across multiple dies — critical." },
      { name: "Warpage / stress", detail: "Managing stress across a large multi-die package." },
      { name: "Known-good-die yield", detail: "All dies must be good, so incoming yield compounds." },
    ],
    parametersNote:
      "Advanced-packaging capabilities are technology- and vendor-dependent; treat any figures elsewhere as examples, not universal specs.",
    defects: [
      "Any bad die → a failed multi-die package (compounded yield)",
      "Misalignment across dies",
      "Warpage from mixed materials",
      "Interconnect voids or opens",
    ],
    yieldImplications: [
      "With several dies per package, overall yield depends on every die being good, so known-good-die screening and assembly precision are decisive.",
    ],
    relatedMaterials: [
      { label: "Interposers & substrates" },
      { label: "Microbump / bonding materials" },
      { label: "Thermal materials" },
    ],
    relatedEquipment: [
      { label: "Flip-chip", href: "/semiconductors/equipment/flip-chip" },
      { label: "Advanced bonding", href: "/semiconductors/equipment/advanced-bonding" },
      { label: "Wafer-level packaging", href: "/semiconductors/equipment/wafer-level-packaging" },
    ],
    relatedConceptLessons: ["integrated-circuit"],
    relatedProcessLessons: ["advanced-packaging", "2-5d", "3d-ic", "chiplets"],
    packagingConnection:
      "Advanced packaging is where packaging becomes system integration — 2.5D, 3D, and chiplets.",
    supplyChainConnection:
      "It draws on interposers, high-density substrates, and bonding materials, and is a strategic, capacity-constrained part of the supply chain.",
    advanced: [
      "Chiplet ecosystems and standard die-to-die interfaces",
      "3D stacking with hybrid bonding",
      "High-bandwidth memory integration",
      "Panel-level advanced packaging",
    ],
    learnNext: [
      { label: "Advanced packaging (learn)", href: "/semiconductors/learn/advanced-packaging" },
      { label: "Chiplets", href: "/semiconductors/learn/chiplets" },
      { label: "3D IC", href: "/semiconductors/learn/3d-ic" },
    ],
  },
];

export function getEquipmentTopic(slug: string): EquipmentTopic | undefined {
  return EQUIPMENT_TOPICS.find((t) => t.slug === slug);
}

export function getEquipmentTopicSlugs(): string[] {
  return EQUIPMENT_TOPICS.map((t) => t.slug);
}
