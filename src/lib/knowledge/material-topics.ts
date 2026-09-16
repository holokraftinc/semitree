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
      "In a crystal the atoms sit in a regular, repeating 3D lattice; growing silicon as one large, orderly crystal — rather than a jumble of small grains — is what gives the predictable, uniform electrical behaviour devices depend on.",
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
  {
    slug: "silicon-wafers",
    title: "Silicon wafers",
    summary:
      "The polished single-crystal silicon discs that chips are built on — defined by diameter, orientation, and crystal and surface quality.",
    categoryId: "wafers-substrates",

    quickAnswer:
      "A silicon wafer is a thin, round slice of single-crystal silicon, polished mirror-flat, that serves as the substrate for building chips. Its diameter, crystal orientation, flatness, and cleanliness are tightly specified because every device is built on it.",
    whyItMatters:
      "The wafer is the foundation for the entire process — hundreds of steps are performed on it. Larger wafers yield more chips per pass (better economics), while flatness, crystal quality, and surface cleanliness set the floor for yield and device performance.",
    intuition: [
      "Think of the wafer as the 'canvas' every chip is built onto — it must be extremely flat, clean, and uniform, because thousands of tiny features are layered on it with nanometre precision.",
      "Bigger canvases (larger-diameter wafers) let you make more chips at once, which is a big reason wafer sizes have grown over the decades.",
    ],
    properties: [
      { name: "Crystallinity", detail: "A single, continuous crystal (not many grains), so electrical behaviour is uniform and predictable across the wafer." },
      { name: "Flatness / uniformity", detail: "Extremely flat and uniform in thickness, so lithography stays in focus across the surface." },
      { name: "Surface quality", detail: "A polished, defect- and particle-free surface, because surface flaws become device flaws." },
    ],
    propertiesNote:
      "Wafer diameter, thickness, and flatness/defect specs are standardized per generation and product — treat any specific number as a spec for one wafer type, not a universal value.",
    whereUsed: [
      "The substrate for essentially every integrated circuit",
      "The starting material handed from wafer suppliers to fabs",
    ],
    parameters: [
      { name: "Diameter", detail: "The wafer size; larger diameters yield more dies per wafer (better cost), and the industry has moved to progressively larger sizes." },
      { name: "Crystal orientation", detail: "The crystal direction of the surface, chosen because it affects device and process behaviour." },
      { name: "Thickness", detail: "Set so the wafer is mechanically robust to handle, yet not wasteful; specified per diameter." },
      { name: "Crystal quality / defect density", detail: "Dislocations and other crystal defects must be minimized." },
      { name: "Flatness & uniformity", detail: "Across-wafer flatness and thickness uniformity, critical for lithography depth of focus." },
      { name: "Surface cleanliness", detail: "Particle and contamination levels, controlled to very low limits." },
    ],
    parametersNote:
      "Exact diameters, thicknesses, flatness, and defect limits are set by industry standards and product needs and are not stated here as fixed figures.",
    processConnection:
      "Wafers are produced by growing a single crystal (ingot), slicing it into discs, then lapping, etching, and polishing to a flat, clean surface — after which the fab builds devices on them. The wafer's role is purely as the substrate: the stable, precise foundation every later step depends on.",
    relatedEquipment: [
      { label: "Metrology", href: "/semiconductors/equipment/metrology" },
      { label: "Inspection", href: "/semiconductors/equipment/inspection" },
      { label: "CMP", href: "/semiconductors/equipment/cmp" },
    ],
    purity: [
      "The wafer must be extremely clean and pure at the surface; particles or contamination carried in become defects in every device built above them.",
    ],
    defects: [
      "Crystal defects (dislocations) → device failures",
      "Flatness or thickness variation → lithography focus errors",
      "Surface particles or scratches → pattern and yield loss",
      "Edge damage → cracking during handling",
    ],
    performance: [
      "Substrate quality follows the chain material property -> process choice -> equipment -> device structure -> performance: a flatter, cleaner, more perfect wafer lets lithography and every later step work to tighter tolerances, which directly lifts device yield and consistency.",
    ],
    yieldImplications: [
      "Because the wafer underlies every die, a systematic wafer-quality problem can affect a whole wafer or lot, making incoming wafer quality a fundamental yield lever.",
    ],
    selectionNote:
      "Wafer choice (diameter, orientation, resistivity, plain vs epitaxial vs SOI) is matched to the device and process — there is no single 'best' wafer, only the right one for the job.",
    relatedMaterials: [
      { label: "Silicon", href: "/semiconductors/materials/silicon" },
      { label: "SOI", href: "/semiconductors/materials/soi" },
    ],
    relatedProcessLessons: ["ingot", "wafer", "silicon"],
    relatedConceptLessons: ["integrated-circuit"],
    advanced: [
      "Epitaxial wafers (an added crystal layer for device quality)",
      "300 mm wafers and the economics of larger diameters",
      "Wafer flatness and edge control for advanced nodes",
    ],
    learnNext: [
      { label: "Wafer (process)", href: "/semiconductors/learn/wafer" },
      { label: "Ingot (process)", href: "/semiconductors/learn/ingot" },
      { label: "SOI", href: "/semiconductors/materials/soi" },
    ],
  },
  {
    slug: "soi",
    title: "Silicon-on-insulator (SOI)",
    summary:
      "A wafer with a thin silicon device layer sitting on a buried oxide, used to cut leakage and capacitance for certain devices.",
    categoryId: "wafers-substrates",

    quickAnswer:
      "Silicon-on-insulator (SOI) is a specialty wafer structure: a thin top layer of device silicon separated from the bulk by a buried insulating oxide. That buried oxide electrically isolates the devices, reducing certain leakage and capacitance effects.",
    whyItMatters:
      "For some applications, isolating the active silicon from the bulk with a buried oxide improves speed, power, or noise behaviour. SOI is a good example of choosing a substrate structure to change device behaviour — at the cost of more expensive wafers.",
    intuition: [
      "Ordinary devices sit directly in the bulk silicon; SOI puts a thin sheet of silicon on top of an insulating layer, like building on a foundation with a damp-proof membrane.",
      "That buried insulator limits how current and capacitance leak into the bulk, which can help with speed and power for the right designs.",
    ],
    properties: [
      { name: "Buried oxide (electrical)", detail: "An insulating layer under the device silicon that isolates devices from the bulk, reducing some leakage and capacitance." },
      { name: "Thin device layer", detail: "A precisely controlled top-silicon thickness where the devices are built." },
    ],
    propertiesNote:
      "The benefits and the right device-layer/buried-oxide thicknesses depend heavily on the application and device design; SOI is not universally better than bulk silicon.",
    whereUsed: [
      "Certain low-power, high-speed, RF, and specialty devices where isolation helps",
      "As one of several substrate options a designer can choose",
    ],
    processConnection:
      "SOI wafers are made by specialized techniques (for example bonding a wafer and transferring a thin silicon layer onto an oxidized wafer). In the fab, devices are then built in the thin top layer much as on bulk silicon, but the buried oxide changes the isolation.",
    relatedEquipment: [
      { label: "Advanced bonding", href: "/semiconductors/equipment/advanced-bonding" },
      { label: "Metrology", href: "/semiconductors/equipment/metrology" },
    ],
    defects: [
      "Device-layer thickness variation → device variation",
      "Defects at the buried-oxide interface → device issues",
      "Higher wafer cost and complexity than bulk",
    ],
    performance: [
      "SOI shows the property -> device chain clearly: adding a buried insulator (a material/structure choice) changes device isolation, which changes speed, power, and noise — beneficial for some designs, unnecessary cost for others.",
    ],
    selectionNote:
      "SOI versus bulk silicon is a design trade-off: the isolation can improve speed, power, or noise for suitable designs, but wafers cost more and not every product benefits — neither is universally 'better'.",
    alternatives: [
      { name: "Bulk silicon", detail: "Cheaper and mature; the default for most products." },
      { name: "FinFET / gate-all-around on bulk", detail: "Achieve strong electrostatic control without SOI in many advanced logic processes." },
    ],
    relatedMaterials: [
      { label: "Silicon", href: "/semiconductors/materials/silicon" },
      { label: "Silicon wafers", href: "/semiconductors/materials/silicon-wafers" },
      { label: "Silicon dioxide", href: "/semiconductors/materials/silicon-dioxide" },
    ],
    relatedProcessLessons: ["wafer", "silicon"],
    relatedConceptLessons: ["mosfet", "integrated-circuit"],
    advanced: [
      "Fully-depleted SOI (FD-SOI)",
      "RF-SOI for radio-frequency front ends",
      "Layer-transfer and bonding techniques",
    ],
    learnNext: [
      { label: "Silicon wafers", href: "/semiconductors/materials/silicon-wafers" },
      { label: "Silicon dioxide", href: "/semiconductors/materials/silicon-dioxide" },
      { label: "MOSFET", href: "/semiconductors/learn/mosfet" },
    ],
  },
  {
    slug: "silicon-dioxide",
    title: "Silicon dioxide (SiO2)",
    summary:
      "Silicon's native oxide and the classic insulator of the industry — used for gate dielectrics, isolation, and masking.",
    categoryId: "dielectrics",

    quickAnswer:
      "Silicon dioxide (SiO2) is the insulating oxide that forms naturally on silicon and can also be deposited. It has been central as the transistor gate insulator, for isolating devices and wiring, and as a masking layer — a big reason silicon became dominant.",
    whyItMatters:
      "A great insulator that silicon grows on its own, with a clean, stable interface, made the planar transistor and CMOS practical. SiO2 remains ubiquitous for isolation and insulation even where advanced gates now use other materials.",
    intuition: [
      "Every circuit needs insulators — to keep current where it belongs, to store charge in a transistor gate, and to isolate neighbouring devices and wires from each other.",
      "SiO2 is the classic insulator, and uniquely, silicon makes its own by simply reacting with oxygen when heated — and that clean silicon-to-oxide interface is what let engineers build reliable transistor gates for decades.",
    ],
    properties: [
      { name: "Electrical (insulator)", detail: "A strong electrical insulator with a stable, high-quality interface to silicon." },
      { name: "Chemical", detail: "Chemically stable and a good barrier and mask against many process steps." },
      { name: "Thermal", detail: "Grown at high temperature and withstands subsequent thermal steps." },
    ],
    propertiesNote:
      "Oxide behaviour (for example how thin a gate oxide can be before leakage matters) depends on thickness and how it is grown or deposited — which is exactly why very thin gates moved to high-k materials.",
    whereUsed: [
      "Historically the transistor gate dielectric",
      "Isolation between devices and between wiring layers",
      "Masking and protective/passivation layers",
    ],
    processConnection:
      "SiO2 is either grown by oxidizing silicon (thermal processing) or deposited (CVD). Grown oxide gives the best silicon interface; deposited oxide is used where you need an insulator on top of other materials.",
    relatedEquipment: [
      { label: "Thermal processing", href: "/semiconductors/equipment/thermal" },
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
    ],
    defects: [
      "Pinholes or contamination in a gate oxide → leakage or failure",
      "Thickness non-uniformity → device variation",
      "Interface traps → degraded transistor behaviour",
    ],
    performance: [
      "SiO2 is the textbook property -> performance chain: a thin, high-quality oxide grown on silicon (property + process + thermal equipment) forms the gate that switches the transistor (device structure), and its quality sets leakage and reliability (performance).",
    ],
    selectionNote:
      "SiO2 is chosen for its interface quality and stability, but as gate oxides became atomically thin, leakage forced a switch to high-k dielectrics for the gate — a clear case of properties driving a material change.",
    alternatives: [
      { name: "High-k dielectrics", detail: "Replace SiO2 as the gate insulator at advanced nodes to cut leakage." },
      { name: "Silicon nitride", detail: "Used where a denser barrier or different properties are needed." },
    ],
    relatedMaterials: [
      { label: "High-k dielectrics", href: "/semiconductors/materials/high-k-dielectrics" },
      { label: "Silicon nitride", href: "/semiconductors/materials/silicon-nitride" },
      { label: "Low-k dielectrics", href: "/semiconductors/materials/low-k-dielectrics" },
    ],
    relatedProcessLessons: ["oxidation", "deposition"],
    relatedConceptLessons: ["mosfet", "integrated-circuit"],
    advanced: [
      "Ultra-thin gate oxides and the move to high-k",
      "Oxide reliability and breakdown",
      "Deposited oxides for 3D structures",
    ],
    learnNext: [
      { label: "Oxidation (process)", href: "/semiconductors/learn/oxidation" },
      { label: "High-k dielectrics", href: "/semiconductors/materials/high-k-dielectrics" },
      { label: "Low-k dielectrics", href: "/semiconductors/materials/low-k-dielectrics" },
    ],
  },
  {
    slug: "silicon-nitride",
    title: "Silicon nitride (SiN)",
    summary:
      "A dense, robust deposited dielectric used as a barrier, passivation, hardmask, and stress layer.",
    categoryId: "dielectrics",

    quickAnswer:
      "Silicon nitride (often written SiN or Si3N4) is a deposited dielectric that is denser and a better barrier than silicon dioxide. It is widely used to block moisture and contaminants, as a hardmask and etch-stop, and to apply engineered stress.",
    whyItMatters:
      "Its density and barrier properties make silicon nitride the go-to protective and structural dielectric — sealing devices against contamination and enabling process tricks like etch stops and stress engineering.",
    intuition: [
      "If SiO2 is the classic insulator, silicon nitride is the tough, sealing one — it keeps moisture and mobile contaminants out and stands up to steps that would attack oxide.",
      "It is also used as a 'hard' mask that survives etching better than photoresist, and as a layer that deliberately strains silicon to boost performance.",
    ],
    properties: [
      { name: "Barrier (chemical)", detail: "Dense and an excellent barrier to moisture and many contaminants." },
      { name: "Mechanical / stress", detail: "Can be deposited with controlled stress, used to strain silicon and improve transistor performance." },
      { name: "Etch behaviour", detail: "Etches differently from oxide, making it a useful etch-stop and hardmask." },
    ],
    propertiesNote:
      "Silicon nitride's exact properties (stress, composition, density) depend strongly on how it is deposited — the same name can describe films with quite different behaviour.",
    whereUsed: [
      "Final passivation that protects finished chips",
      "Etch-stop and hardmask layers during patterning",
      "Stress/strain layers that enhance transistor performance",
      "Spacers in transistor fabrication",
    ],
    processConnection:
      "Silicon nitride is deposited (CVD/PECVD, or ALD for thin films); the deposition conditions set its stress and barrier quality, which is why it connects tightly to deposition equipment and recipes.",
    relatedEquipment: [
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
      { label: "Etching", href: "/semiconductors/equipment/etching" },
    ],
    defects: [
      "Wrong stress → wafer bow or device shifts",
      "Pinholes → poor barrier protection",
      "Non-uniform deposition → variation",
    ],
    performance: [
      "Nitride shows property -> device performance directly: a stress-engineered nitride layer (material + deposition choice) strains the silicon channel (device structure), which raises carrier mobility and speed (performance).",
    ],
    selectionNote:
      "Silicon nitride is chosen where its barrier, etch, or stress properties beat oxide's — the two dielectrics are complementary, not ranked.",
    relatedMaterials: [
      { label: "Silicon dioxide", href: "/semiconductors/materials/silicon-dioxide" },
      { label: "High-k dielectrics", href: "/semiconductors/materials/high-k-dielectrics" },
    ],
    relatedProcessLessons: ["deposition", "etching"],
    relatedConceptLessons: ["mosfet"],
    advanced: [
      "Stress engineering for mobility",
      "ALD nitrides for thin, conformal barriers",
      "Low-temperature nitrides for advanced integration",
    ],
    learnNext: [
      { label: "Deposition (process)", href: "/semiconductors/learn/deposition" },
      { label: "Silicon dioxide", href: "/semiconductors/materials/silicon-dioxide" },
      { label: "Low-k dielectrics", href: "/semiconductors/materials/low-k-dielectrics" },
    ],
  },
  {
    slug: "high-k-dielectrics",
    title: "High-k dielectrics",
    summary:
      "Insulators with high permittivity that replaced silicon dioxide as the transistor gate insulator to cut leakage at advanced nodes.",
    categoryId: "dielectrics",

    quickAnswer:
      "High-k dielectrics are gate insulators with a higher dielectric constant ('k') than silicon dioxide. They let a transistor keep strong gate control with a physically thicker layer, which dramatically reduces the gate leakage that ultra-thin SiO2 suffers — a key enabler of advanced nodes.",
    whyItMatters:
      "As gate oxides were scaled to just a few atoms thick, leakage through them became unmanageable. High-k materials solved this by providing the same electrical effect with a thicker, less leaky film — one of the most important materials changes in modern logic.",
    intuition: [
      "A transistor gate works like a capacitor: you want strong control of the channel, which pushed the oxide thinner and thinner until electrons leaked straight through.",
      "A high-k material has more 'dielectric effect' per nanometre, so you can make the layer thicker (less leaky) while keeping the same control — solving the leakage problem.",
    ],
    properties: [
      { name: "Electrical (high permittivity)", detail: "A higher dielectric constant than SiO2, giving strong gate control at a greater physical thickness (less leakage)." },
      { name: "Interface behaviour", detail: "Needs careful interface engineering with silicon and is usually paired with a metal gate." },
    ],
    propertiesNote:
      "The actual dielectric constant and behaviour depend on the specific material and how it is deposited and integrated; high-k is a class of materials, not a single compound, and no specific values are asserted here.",
    whereUsed: [
      "The transistor gate dielectric in advanced logic (with metal gates)",
      "Certain capacitors and specialty structures",
    ],
    processConnection:
      "High-k films are typically deposited by ALD for atomic-level thickness control and conformality, then integrated with metal-gate schemes. This ties them closely to precise deposition equipment.",
    relatedEquipment: [
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
      { label: "Thermal processing", href: "/semiconductors/equipment/thermal" },
    ],
    defects: [
      "Interface defects → threshold and reliability problems",
      "Thickness or composition non-uniformity → device variation",
      "Integration issues within the gate stack",
    ],
    performance: [
      "High-k is the clearest property -> performance story: a material with higher permittivity (property), deposited by ALD (process/equipment), lets the gate stack (device structure) control the channel without leaking — enabling continued scaling (performance).",
    ],
    selectionNote:
      "High-k replaced SiO2 specifically for the gate because leakage demanded it; SiO2 and nitride still win elsewhere. The choice is property-driven and role-specific, not a blanket ranking.",
    alternatives: [
      { name: "Silicon dioxide", detail: "Still used for thicker oxides and isolation, but too leaky as an ultra-thin gate." },
    ],
    relatedMaterials: [
      { label: "Silicon dioxide", href: "/semiconductors/materials/silicon-dioxide" },
      { label: "Silicon nitride", href: "/semiconductors/materials/silicon-nitride" },
    ],
    relatedProcessLessons: ["deposition"],
    relatedConceptLessons: ["mosfet", "integrated-circuit"],
    advanced: [
      "High-k / metal-gate integration",
      "ALD of high-k films",
      "New gate dielectrics for gate-all-around devices",
    ],
    learnNext: [
      { label: "MOSFET", href: "/semiconductors/learn/mosfet" },
      { label: "Silicon dioxide", href: "/semiconductors/materials/silicon-dioxide" },
      { label: "Deposition (process)", href: "/semiconductors/learn/deposition" },
    ],
  },
  {
    slug: "low-k-dielectrics",
    title: "Low-k dielectrics",
    summary:
      "Interlayer insulators with low permittivity that reduce capacitance between wires, cutting interconnect delay and power.",
    categoryId: "dielectrics",

    quickAnswer:
      "Low-k dielectrics are the insulators placed between metal wires, chosen for a low dielectric constant. Lower capacitance between wires means faster, lower-power signalling — critical as interconnect, not the transistor, increasingly limits performance.",
    whyItMatters:
      "In modern chips the delay and power of the wiring (interconnect) can dominate. Low-k dielectrics reduce the capacitance between closely packed wires, directly improving speed and power — but they tend to be more fragile and harder to integrate.",
    intuition: [
      "Two wires with insulator between them form a capacitor; the more capacitance, the slower and more power-hungry the signal.",
      "Using a lower-k insulator between the wires cuts that capacitance — often by making the material more porous (adding empty space), which unfortunately also makes it weaker.",
    ],
    properties: [
      { name: "Electrical (low permittivity)", detail: "A low dielectric constant that reduces capacitance between interconnect wires." },
      { name: "Mechanical (fragile)", detail: "Often porous to lower k, which makes the material mechanically weak and prone to damage." },
    ],
    propertiesNote:
      "Low-k is a family of materials with a range of k values and porosities; exact properties depend on the material and processing and are not stated here as fixed numbers.",
    whereUsed: [
      "The insulating layers between metal interconnect wires (interlayer / intermetal dielectric)",
    ],
    processConnection:
      "Low-k films are deposited and then integrated into the copper interconnect (damascene) flow, where CMP and etch must handle their fragility. Their weakness makes integration — especially CMP and packaging stress — a real challenge.",
    relatedEquipment: [
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
      { label: "CMP", href: "/semiconductors/equipment/cmp" },
    ],
    defects: [
      "Cracking or crushing during CMP or packaging (fragility)",
      "Moisture uptake in porous films → property shifts",
      "Integration damage that raises the effective k",
    ],
    performance: [
      "Low-k shows the chain from the wiring side: a lower-permittivity material (property) between wires (interconnect structure) reduces capacitance, which cuts signal delay and power (performance) — provided the process can integrate a fragile film.",
    ],
    yieldImplications: [
      "Because low-k films are fragile, they are a real source of interconnect and packaging-related defects, tying material choice directly to yield and reliability.",
    ],
    packagingConnection:
      "Fragile low-k layers are sensitive to the mechanical stresses of packaging (for example flip-chip bump stress), so material choice interacts with packaging design.",
    selectionNote:
      "Low-k trades mechanical robustness for lower capacitance — the right k is chosen per node by balancing performance against integration and reliability, not by picking the lowest possible k.",
    relatedMaterials: [
      { label: "Copper", href: "/semiconductors/materials/copper" },
      { label: "Silicon dioxide", href: "/semiconductors/materials/silicon-dioxide" },
    ],
    relatedProcessLessons: ["deposition", "metallization", "cmp"],
    relatedConceptLessons: ["integrated-circuit"],
    advanced: [
      "Porous ultra-low-k dielectrics",
      "Air-gap interconnect concepts",
      "Mechanical reliability of low-k stacks",
    ],
    learnNext: [
      { label: "Copper", href: "/semiconductors/materials/copper" },
      { label: "Metallization (process)", href: "/semiconductors/learn/metallization" },
      { label: "CMP (process)", href: "/semiconductors/learn/cmp" },
    ],
  },
  {
    slug: "copper",
    title: "Copper",
    summary:
      "The low-resistance metal used for most modern interconnect wiring, enabled by the damascene process and diffusion barriers.",
    categoryId: "conductors",

    quickAnswer:
      "Copper is the primary interconnect metal in modern chips because it has low electrical resistance and good electromigration resistance. It cannot be easily etched, so it is patterned by the damascene approach — filling trenches and polishing back — and needs a barrier layer to keep it out of the silicon.",
    whyItMatters:
      "Devices are useless without metal wiring to connect them, make contact, and route signals and power. As chips added more, thinner wires, resistance in that wiring became a limiter — and copper's low resistivity reduced wiring delay and power versus aluminum, which is why it became the interconnect metal of choice.",
    intuition: [
      "Millions of devices are useless without wiring to connect them; the wiring's resistance slows signals and wastes power, so a lower-resistance metal helps.",
      "Copper conducts better than aluminum, but it is hard to etch and it degrades silicon if it gets in — so it is inlaid into grooves (damascene) and wrapped in a barrier layer.",
    ],
    properties: [
      { name: "Electrical (low resistivity)", detail: "Lower resistivity than aluminum, reducing interconnect delay and power." },
      { name: "Reliability (electromigration)", detail: "Better electromigration resistance than aluminum, important for thin, high-current wires." },
      { name: "Chemical (integration)", detail: "Diffuses into silicon and oxide and is hard to etch, so it needs barriers and the damascene process." },
    ],
    propertiesNote:
      "Resistivity and reliability in a real chip depend on line dimensions, barriers, and microstructure — thin copper lines behave differently from bulk copper, so no single figure applies.",
    whereUsed: [
      "The main interconnect wiring layers in most advanced logic and many other chips",
    ],
    processConnection:
      "Because copper resists etching, it is patterned by damascene: a dielectric is patterned, a barrier and copper are deposited to fill the trenches, and CMP polishes away the excess. This ties copper tightly to deposition, plating, and CMP equipment.",
    relatedEquipment: [
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
      { label: "CMP", href: "/semiconductors/equipment/cmp" },
    ],
    defects: [
      "Voids in the fill → opens or high resistance",
      "Barrier failure → copper diffusion and device degradation",
      "Dishing or erosion during CMP",
      "Electromigration over time → reliability wear-out",
    ],
    performance: [
      "Copper is a full property -> performance chain: a low-resistivity metal (property) integrated by damascene with barriers (process/equipment) forms the interconnect (device structure), whose lower resistance and better reliability improve chip speed, power, and lifetime (performance).",
    ],
    yieldImplications: [
      "Copper integration (fill, barrier, CMP) is defect-sensitive, making it a significant interconnect yield and reliability factor.",
    ],
    supplyChainConnection:
      "Copper metal is abundant, but the ultra-pure targets and plating chemistries, and the barrier materials, come from specialized suppliers. (No specific figures are stated here.)",
    selectionNote:
      "Copper wins for dense, fast interconnect, but aluminum and tungsten are still chosen for specific roles — the 'best' conductor depends on where in the chip it is used.",
    alternatives: [
      { name: "Aluminum", detail: "Easier to etch and still used in some layers and older, robust designs." },
      { name: "Tungsten", detail: "Used for contacts/vias (plugs) where fill and reliability matter more than low resistance." },
    ],
    relatedMaterials: [
      { label: "Aluminum", href: "/semiconductors/materials/aluminum" },
      { label: "Tungsten", href: "/semiconductors/materials/tungsten" },
      { label: "Low-k dielectrics", href: "/semiconductors/materials/low-k-dielectrics" },
    ],
    relatedProcessLessons: ["metallization", "deposition", "cmp"],
    relatedConceptLessons: ["integrated-circuit"],
    advanced: [
      "Barrier/liner scaling for thin copper lines",
      "Alternative liners and metals (e.g. cobalt, ruthenium) for fine lines",
      "Electromigration reliability at advanced nodes",
    ],
    learnNext: [
      { label: "Metallization (process)", href: "/semiconductors/learn/metallization" },
      { label: "Aluminum", href: "/semiconductors/materials/aluminum" },
      { label: "Tungsten", href: "/semiconductors/materials/tungsten" },
    ],
  },
  {
    slug: "aluminum",
    title: "Aluminum",
    summary:
      "The original interconnect metal — easy to deposit and etch, still used for certain layers, bond pads, and robust designs.",
    categoryId: "conductors",

    quickAnswer:
      "Aluminum was the standard interconnect metal for decades because it conducts well, adheres to silicon dioxide, and can be deposited and etched with straightforward processes. Copper has replaced it for dense high-performance wiring, but aluminum remains common for bond pads and some layers.",
    whyItMatters:
      "Aluminum's easy processing — it can be etched directly, unlike copper — made early integrated circuits practical, and its maturity and reliability keep it in use for specific roles even in modern chips.",
    intuition: [
      "Metals are needed to wire devices together and to form the contact and bond pads a package connects to; aluminum was the first good fit because it sticks to oxide and is easy to pattern by etching.",
      "Copper conducts better, but aluminum's simplicity and reliability mean it never fully went away — for example, it is common for the top bond pads.",
    ],
    properties: [
      { name: "Electrical", detail: "A good conductor (higher resistivity than copper), adequate for many wiring roles." },
      { name: "Process (etchable)", detail: "Can be deposited and etched with standard processes — simpler than copper's damascene." },
      { name: "Reliability", detail: "Mature and well understood, though more prone to electromigration than copper in thin lines." },
    ],
    propertiesNote:
      "Aluminum's real-world resistivity and electromigration behaviour depend on alloying, line size, and processing; no single figure is asserted here.",
    whereUsed: [
      "Bond pads that packages connect to",
      "Interconnect in mature/robust processes and some layers",
      "Where simple, reliable metallization is preferred",
    ],
    processConnection:
      "Aluminum is deposited (often by PVD) and patterned by etching — a simpler flow than copper damascene — which is part of its enduring appeal for certain layers.",
    relatedEquipment: [
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
      { label: "Etching", href: "/semiconductors/equipment/etching" },
    ],
    defects: [
      "Electromigration in thin, high-current lines",
      "Hillocks or voids from stress",
      "Etch residue or corrosion if not controlled",
    ],
    performance: [
      "Aluminum illustrates process-driven choice: an easily etched metal (property/process) forms wiring and pads (device structure) with mature reliability (performance) — chosen where simplicity beats copper's lower resistance.",
    ],
    packagingConnection:
      "Aluminum bond pads are a common interface between the die and the package's wire bonds.",
    selectionNote:
      "Aluminum vs copper is a classic trade-off: copper for dense, fast wiring; aluminum for easy processing, pads, and robustness. Neither is universally better.",
    alternatives: [
      { name: "Copper", detail: "Lower resistance for dense, high-performance interconnect." },
      { name: "Tungsten", detail: "For contact and via plugs." },
    ],
    relatedMaterials: [
      { label: "Copper", href: "/semiconductors/materials/copper" },
      { label: "Tungsten", href: "/semiconductors/materials/tungsten" },
    ],
    relatedProcessLessons: ["metallization", "deposition", "etching"],
    relatedConceptLessons: ["integrated-circuit"],
    advanced: [
      "Aluminum for power and specialty devices",
      "Electromigration mitigation by alloying",
      "Legacy-node metallization",
    ],
    learnNext: [
      { label: "Copper", href: "/semiconductors/materials/copper" },
      { label: "Metallization (process)", href: "/semiconductors/learn/metallization" },
      { label: "Wire bonding", href: "/semiconductors/equipment/wire-bonding" },
    ],
  },
  {
    slug: "tungsten",
    title: "Tungsten",
    summary:
      "The metal used to fill contacts and vias ('plugs') that connect wiring levels — valued for reliable fill of tiny holes.",
    categoryId: "conductors",

    quickAnswer:
      "Tungsten is used mainly to fill the tiny vertical holes — contacts and vias — that connect one wiring level to another and to the devices. It has higher resistance than copper or aluminum, but it fills small, high-aspect-ratio holes reliably and stands up well, which matters more for short plugs.",
    whyItMatters:
      "Connecting stacked wiring levels needs a metal that can fill narrow vertical holes without voids. Tungsten's excellent fill and reliability in these 'plugs' made it the standard for contacts and vias, even though it is more resistive than the wiring metals.",
    intuition: [
      "Wiring runs horizontally on many levels; to connect the levels (and reach the devices) you need vertical 'plugs' through the insulator.",
      "For those small vertical holes, reliable, void-free filling matters more than the lowest resistance — and tungsten fills them very well, so it became the plug metal.",
    ],
    properties: [
      { name: "Fill (process)", detail: "Deposited by CVD to fill narrow, deep contacts and vias with few voids." },
      { name: "Electrical", detail: "Higher resistivity than copper or aluminum, acceptable because plugs are short." },
      { name: "Reliability / mechanical", detail: "Refractory and robust; stable through subsequent processing." },
    ],
    propertiesNote:
      "Tungsten's contribution to resistance depends on plug size and geometry; because plugs are short, their higher resistivity is a smaller penalty than it would be for long wires.",
    whereUsed: [
      "Contact plugs connecting devices to the first wiring level",
      "Via plugs connecting wiring levels to each other",
      "Some local interconnect and specialty roles",
    ],
    processConnection:
      "Tungsten is deposited by CVD (usually over a barrier/adhesion layer) to fill the holes, then CMP removes the overburden, leaving plugs. This ties it to deposition and CMP equipment.",
    relatedEquipment: [
      { label: "Deposition", href: "/semiconductors/equipment/deposition" },
      { label: "CMP", href: "/semiconductors/equipment/cmp" },
    ],
    defects: [
      "Voids in the plug fill → high resistance or opens",
      "Barrier or adhesion failure",
      "Dishing or erosion during CMP",
    ],
    performance: [
      "Tungsten shows that 'best' is role-specific: a metal chosen for fill and reliability (property), deposited by CVD and planarized by CMP (process/equipment), forms plugs (device structure) that reliably connect levels (performance) — even though its resistance is higher than the wiring metals.",
    ],
    selectionNote:
      "Tungsten is chosen for plugs where fill and reliability dominate, while copper or aluminum carry the longer wires — the conductors are matched to their role, not ranked overall.",
    alternatives: [
      { name: "Copper", detail: "Lower resistance for the wiring itself, and increasingly for some vias." },
      { name: "Cobalt / other metals", detail: "Explored for contacts and plugs at advanced nodes." },
    ],
    relatedMaterials: [
      { label: "Copper", href: "/semiconductors/materials/copper" },
      { label: "Aluminum", href: "/semiconductors/materials/aluminum" },
    ],
    relatedProcessLessons: ["metallization", "deposition", "cmp"],
    relatedConceptLessons: ["integrated-circuit"],
    advanced: [
      "Barrier/liner scaling for tungsten plugs",
      "Low-resistance contact schemes",
      "Alternative plug metals (e.g. cobalt) at advanced nodes",
    ],
    learnNext: [
      { label: "Copper", href: "/semiconductors/materials/copper" },
      { label: "Metallization (process)", href: "/semiconductors/learn/metallization" },
      { label: "CMP (process)", href: "/semiconductors/learn/cmp" },
    ],
  },
];

export function getMaterialTopic(slug: string): MaterialTopic | undefined {
  return MATERIAL_TOPICS.find((t) => t.slug === slug);
}

export function getMaterialTopicSlugs(): string[] {
  return MATERIAL_TOPICS.map((t) => t.slug);
}
