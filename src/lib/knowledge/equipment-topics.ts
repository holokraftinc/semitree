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
  {
    slug: "ion-implantation",
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
];

export function getEquipmentTopic(slug: string): EquipmentTopic | undefined {
  return EQUIPMENT_TOPICS.find((t) => t.slug === slug);
}

export function getEquipmentTopicSlugs(): string[] {
  return EQUIPMENT_TOPICS.map((t) => t.slug);
}
