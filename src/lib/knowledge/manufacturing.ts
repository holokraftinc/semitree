/**
 * Semiconductor Manufacturing Explorer — process model.
 *
 * Original Semitree content: standard, well-established process-engineering
 * knowledge, written from scratch. Following the same editorial rule as the
 * lessons (see semi-lessons.ts): NO fabricated citations, company names, or
 * statistics. "Related companies" resolve to industry *segments* (the /industry
 * section), and "related research" to research *themes* plus the /research
 * section — never invented specific names or papers.
 *
 * Equipment and materials are named as generic tool/material *categories*
 * (e.g. "EUV scanner", "ion implanter", "CMP slurry"), which are factual
 * engineering terms, not company products.
 *
 * One structured array drives the explorer index, every process page, and the
 * sitemap.
 */

/** The three canonical phases of the line. */
export type StageId = "material-prep" | "wafer-fab" | "test-assembly";

export interface Stage {
  id: StageId;
  label: string;
  summary: string;
}

export const STAGES: Stage[] = [
  {
    id: "material-prep",
    label: "Material preparation",
    summary: "Turning sand into a defect-free, polished single-crystal wafer.",
  },
  {
    id: "wafer-fab",
    label: "Wafer fabrication (front-end)",
    summary:
      "Building the transistors and wiring, layer by layer, on the wafer surface — repeated hundreds of times.",
  },
  {
    id: "test-assembly",
    label: "Test & assembly (back-end)",
    summary: "Testing, cutting, packaging, and final-testing the finished dies.",
  },
];

/** Industry segments mirror the /industry page's segment list. */
export type IndustrySegment =
  | "Foundries & IDMs"
  | "Equipment"
  | "Materials"
  | "Design & IP"
  | "Packaging & test";

export interface ProcessStep {
  slug: string;
  name: string;
  /** 1-based position in the overall flow. */
  order: number;
  stage: StageId;
  tagline: string;

  what: string;
  why: string;
  how: string[];

  inputs: string[];
  outputs: string[];
  criticalParameters: string[];
  defects: string[];
  equipment: string[];
  materials: string[];

  /** Lesson slug under /semiconductors/learn for the "Learn" action. */
  lessonSlug?: string;
  /** Sibling lessons for "Understand this concept". */
  relatedConcepts: { label: string; slug: string }[];
  /** Semiconductor tool slugs (under /semiconductors/tools) that apply. */
  relatedTools: string[];
  /** Industry segments (link to /industry) — never specific companies. */
  industrySegments: IndustrySegment[];
  /** Active research themes (factual directions, not citations). */
  researchThemes: string[];
}

export const MFG_PROCESSES: ProcessStep[] = [
  /* ----------------------------- MATERIAL PREP ----------------------------- */
  {
    slug: "raw-material",
    name: "Raw material",
    order: 1,
    stage: "material-prep",
    tagline: "Silica sand and the carbon that reduces it.",
    what: "The starting feedstock for silicon chips: high-purity silica (SiO₂), typically from quartz sand, plus carbon sources used to reduce it to elemental silicon.",
    why: "Every silicon wafer begins as ordinary quartz. The purity and consistency of the feedstock set the floor for everything downstream — contamination introduced here is expensive or impossible to remove later.",
    how: [
      "Quartz (SiO₂) is heated with carbon in a submerged-arc furnace. The carbon strips the oxygen, leaving metallurgical-grade silicon (MGS), which is roughly 98–99% pure.",
      "MGS is still far too impure for electronics — it is the raw input to the purification step, not a finished material.",
    ],
    inputs: ["Quartz / silica sand (SiO₂)", "Carbon sources (coke, coal, wood chips)", "Electrical energy"],
    outputs: ["Metallurgical-grade silicon (MGS), ~98–99% pure"],
    criticalParameters: ["Feedstock purity", "Furnace temperature", "Carbon-to-silica ratio"],
    defects: ["Metallic impurities (Fe, Al, Ca)", "Inconsistent purity between batches"],
    equipment: ["Submerged-arc / electric-arc furnace"],
    materials: ["Silica sand", "Carbon reductants"],
    lessonSlug: "silicon",
    relatedConcepts: [{ label: "Silicon", slug: "silicon" }],
    relatedTools: [],
    industrySegments: ["Materials"],
    researchThemes: ["Lower-energy silicon reduction", "Feedstock traceability and purity control"],
  },
  {
    slug: "silicon",
    name: "Silicon",
    order: 2,
    stage: "material-prep",
    tagline: "Purifying to electronic-grade polysilicon.",
    what: "The refinement of metallurgical-grade silicon into electronic-grade silicon (EGS) — polycrystalline silicon pure to better than 99.9999999% (\"nine nines\", 9N).",
    why: "Semiconductor devices depend on precisely controlled doping at parts-per-billion levels. Any uncontrolled impurity swamps the intentional dopants and ruins device behaviour.",
    how: [
      "The dominant route is the Siemens process: MGS is converted to trichlorosilane gas, distilled to extreme purity, then decomposed onto heated silicon rods to grow high-purity polysilicon.",
      "The result is electronic-grade polysilicon — pure, but polycrystalline (many small crystals), so it still is not a usable wafer.",
    ],
    inputs: ["Metallurgical-grade silicon", "Hydrogen chloride / chlorine", "Hydrogen"],
    outputs: ["Electronic-grade polysilicon (9N+)"],
    criticalParameters: ["Impurity concentration (ppb)", "Distillation efficiency", "Deposition temperature"],
    defects: ["Residual donors/acceptors (B, P)", "Carbon and metal contamination"],
    equipment: ["Distillation columns", "Siemens deposition reactors"],
    materials: ["Trichlorosilane", "Hydrogen"],
    lessonSlug: "silicon",
    relatedConcepts: [
      { label: "Silicon", slug: "silicon" },
      { label: "Intrinsic semiconductor", slug: "intrinsic-semiconductor" },
    ],
    relatedTools: [],
    industrySegments: ["Materials"],
    researchThemes: ["Fluidized-bed reactor (granular polysilicon)", "Energy-efficient purification"],
  },
  {
    slug: "ingot",
    name: "Ingot",
    order: 3,
    stage: "material-prep",
    tagline: "Growing a single crystal.",
    what: "Growth of a large single-crystal silicon boule (ingot) from molten polysilicon, most commonly by the Czochralski (CZ) method.",
    why: "Transistors need a perfect, periodic crystal lattice with a known orientation. A single crystal — not the polycrystalline feedstock — is what gives predictable, uniform electrical properties across the wafer.",
    how: [
      "Polysilicon is melted in a quartz crucible. A small seed crystal of known orientation is dipped into the melt and slowly pulled upward while rotating.",
      "As it is withdrawn, silicon solidifies onto the seed, replicating its crystal orientation and growing a cylindrical single-crystal ingot. Dopant can be added to the melt to set the base resistivity.",
    ],
    inputs: ["Electronic-grade polysilicon", "Seed crystal", "Optional dopant (B or P)"],
    outputs: ["Single-crystal silicon ingot of defined orientation and resistivity"],
    criticalParameters: ["Pull rate", "Rotation speed", "Melt temperature", "Crystal orientation (e.g. ⟨100⟩)"],
    defects: ["Dislocations", "Oxygen-induced defects", "Resistivity non-uniformity along the boule"],
    equipment: ["Czochralski crystal puller"],
    materials: ["Quartz crucible", "Argon ambient", "Dopant"],
    lessonSlug: "ingot",
    relatedConcepts: [
      { label: "Ingot", slug: "ingot" },
      { label: "Doping", slug: "doping" },
    ],
    relatedTools: [],
    industrySegments: ["Materials", "Equipment"],
    researchThemes: ["300 mm+ crystal uniformity", "Low-oxygen and float-zone growth"],
  },
  {
    slug: "wafer",
    name: "Wafer",
    order: 4,
    stage: "material-prep",
    tagline: "Slicing and polishing the substrate.",
    what: "Conversion of the cylindrical ingot into thin, flat, mirror-polished wafers that serve as the substrate for all subsequent processing.",
    why: "The wafer surface must be atomically flat and defect-free — lithography later focuses features onto it with nanometre precision, and any waviness or damage degrades every device built on it.",
    how: [
      "The ingot is ground to a precise diameter, then sliced into thin discs with a wire saw. Slicing leaves surface damage that must be removed.",
      "Wafers are lapped and etched to remove saw damage, then chemically-mechanically polished to a mirror finish on the device side, cleaned, and inspected.",
    ],
    inputs: ["Silicon ingot", "Slurry and polishing pads", "Ultra-pure water"],
    outputs: ["Polished, cleaned single-crystal wafers"],
    criticalParameters: ["Thickness uniformity", "Total thickness variation (TTV)", "Surface flatness / warp", "Particle count"],
    defects: ["Micro-scratches", "Saw-mark residue", "Edge chips", "Particulate contamination"],
    equipment: ["Wire saw", "Lapping and CMP polishers", "Wafer cleaning stations"],
    materials: ["Polishing slurry", "Ultra-pure water", "Cleaning chemistries"],
    lessonSlug: "wafer",
    relatedConcepts: [
      { label: "Wafer", slug: "wafer" },
      { label: "CMP", slug: "cmp" },
    ],
    relatedTools: ["die-per-wafer"],
    industrySegments: ["Materials"],
    researchThemes: ["Larger-diameter wafer economics", "Edge-defect and warp reduction"],
  },

  /* ------------------------------ WAFER FAB -------------------------------- */
  {
    slug: "oxidation",
    name: "Oxidation",
    order: 5,
    stage: "wafer-fab",
    tagline: "Growing a silicon-dioxide layer.",
    what: "Thermal growth of a silicon-dioxide (SiO₂) layer by reacting the silicon surface with oxygen or steam at high temperature.",
    why: "Silicon's native oxide is one of the reasons silicon dominates electronics: SiO₂ is a stable, high-quality insulator used as gate dielectric, masking layer, and surface passivation.",
    how: [
      "Wafers are heated in a furnace (typically 900–1200 °C). Dry oxidation uses O₂ for thin, high-quality films; wet oxidation uses steam for faster, thicker growth.",
      "Oxygen diffuses through the growing oxide to react at the silicon interface, consuming some silicon as the oxide thickens.",
    ],
    inputs: ["Silicon wafer", "Oxygen (dry) or water vapour (wet)", "Heat"],
    outputs: ["Wafer with a controlled-thickness SiO₂ layer"],
    criticalParameters: ["Oxide thickness", "Temperature", "Ambient (dry vs wet)", "Interface trap density"],
    defects: ["Thickness non-uniformity", "Pinholes", "Interface states", "Contamination-induced charge"],
    equipment: ["Thermal oxidation / diffusion furnace", "Rapid thermal processing (RTP) tools"],
    materials: ["Oxygen", "High-purity water", "Silicon"],
    lessonSlug: "oxidation",
    relatedConcepts: [
      { label: "Oxidation", slug: "oxidation" },
      { label: "MOSFET", slug: "mosfet" },
    ],
    relatedTools: [],
    industrySegments: ["Equipment", "Materials"],
    researchThemes: ["High-κ gate dielectrics beyond SiO₂", "Ultra-thin interfacial layers"],
  },
  {
    slug: "deposition",
    name: "Deposition",
    order: 6,
    stage: "wafer-fab",
    tagline: "Adding thin films of material.",
    what: "Adding thin films of conductors, insulators, or semiconductors onto the wafer surface — by chemical vapour deposition (CVD), physical vapour deposition (PVD), or atomic-layer deposition (ALD).",
    why: "Every layer of a chip — dielectrics, barrier metals, gate materials — is built by deposition. Film thickness and conformality directly set device dimensions and reliability.",
    how: [
      "CVD reacts gas-phase precursors on the hot wafer to grow a film; PVD (sputtering/evaporation) physically transports atoms from a target to the wafer; ALD grows films one atomic layer at a time for ultimate thickness control.",
      "The method is chosen for the material, the required conformality (coverage of steep features), and thickness precision.",
    ],
    inputs: ["Wafer", "Precursor gases or sputter targets", "Vacuum / controlled ambient"],
    outputs: ["Wafer with a new thin film of defined thickness and composition"],
    criticalParameters: ["Film thickness", "Uniformity", "Conformality / step coverage", "Stress", "Composition"],
    defects: ["Voids and seams", "Poor step coverage", "Particle inclusion", "Film stress cracking"],
    equipment: ["CVD reactors", "PVD sputtering tools", "ALD reactors"],
    materials: ["Precursor gases", "Sputter targets (e.g. Ti, Ta, Cu)", "Dielectric sources"],
    lessonSlug: "deposition",
    relatedConcepts: [
      { label: "Deposition", slug: "deposition" },
      { label: "Metallization", slug: "metallization" },
    ],
    relatedTools: [],
    industrySegments: ["Equipment", "Materials"],
    researchThemes: ["Area-selective ALD", "Conformal fills for high-aspect-ratio 3D structures"],
  },
  {
    slug: "photoresist",
    name: "Photoresist",
    order: 7,
    stage: "wafer-fab",
    tagline: "Coating a light-sensitive film.",
    what: "Applying a light-sensitive polymer (photoresist) to the wafer so that a pattern can be optically transferred in the lithography step.",
    why: "Photoresist is the recording medium of chipmaking: it captures the mask pattern as a physical stencil that guides etching or implantation. Its resolution and sensitivity gate the whole patterning process.",
    how: [
      "Liquid resist is dispensed onto the wafer, which is spun at high speed to produce a thin, uniform film, then soft-baked to drive off solvent.",
      "Positive resist becomes soluble where exposed to light; negative resist becomes insoluble. The choice determines whether exposed regions are removed or retained after development.",
    ],
    inputs: ["Wafer (often freshly deposited/oxidized)", "Liquid photoresist", "Adhesion promoter"],
    outputs: ["Wafer with a uniform, light-sensitive resist film"],
    criticalParameters: ["Resist thickness", "Uniformity", "Soft-bake temperature", "Adhesion"],
    defects: ["Thickness variation", "Comets/striations from particles", "Poor adhesion / lifting", "Bubbles"],
    equipment: ["Spin coater / track system", "Hot plates"],
    materials: ["Photoresist polymer", "Solvents", "Adhesion promoter (e.g. HMDS)"],
    lessonSlug: "photoresist",
    relatedConcepts: [
      { label: "Photoresist", slug: "photoresist" },
      { label: "Lithography", slug: "lithography" },
    ],
    relatedTools: [],
    industrySegments: ["Materials", "Equipment"],
    researchThemes: ["EUV-sensitive and metal-oxide resists", "Line-edge-roughness reduction"],
  },
  {
    slug: "lithography",
    name: "Lithography",
    order: 8,
    stage: "wafer-fab",
    tagline: "Projecting the pattern — the pacing step of Moore's Law.",
    what: "Optically projecting each layer's pattern from a mask onto the resist-coated wafer, defining where features will be built. It is the step that sets minimum feature size.",
    why: "Lithography is the pacing technology of scaling: resolution here determines how small transistors can be, and it is repeated for every patterned layer of the chip.",
    how: [
      "A scanner/stepper projects the mask pattern, usually demagnified, onto the resist, repeating field by field across the wafer. Resolution improves with shorter wavelength and higher numerical aperture (Rayleigh: resolution ≈ k₁·λ/NA).",
      "Deep-ultraviolet (193 nm) light with immersion and multi-patterning served for years; extreme-ultraviolet (EUV, 13.5 nm) now enables the smallest features. Exposed resist is then developed into a stencil.",
    ],
    inputs: ["Resist-coated wafer", "Photomask / reticle", "Exposure light (DUV or EUV)"],
    outputs: ["Patterned (developed) resist stencil on the wafer"],
    criticalParameters: ["Wavelength (λ)", "Numerical aperture (NA)", "Overlay / alignment accuracy", "Depth of focus", "Dose"],
    defects: ["Overlay misalignment", "Line-edge roughness", "Bridging / necking of features", "Defocus blur"],
    equipment: ["DUV scanner", "EUV scanner", "Mask aligner", "Track (coat/develop)"],
    materials: ["Photomask / reticle", "Developer", "Pellicle"],
    lessonSlug: "lithography",
    relatedConcepts: [
      { label: "Lithography", slug: "lithography" },
      { label: "Photoresist", slug: "photoresist" },
      { label: "Etching", slug: "etching" },
    ],
    relatedTools: [],
    industrySegments: ["Equipment", "Materials"],
    researchThemes: ["High-NA EUV", "Multi-patterning and computational lithography", "Directed self-assembly"],
  },
  {
    slug: "etching",
    name: "Etching",
    order: 9,
    stage: "wafer-fab",
    tagline: "Removing material through the resist openings.",
    what: "Selectively removing material where the resist pattern leaves it exposed, transferring the resist pattern into the underlying device layer.",
    why: "Etching turns the temporary resist stencil into permanent structure in the real materials — trenches, gates, contacts, and vias. Its directionality and selectivity determine feature fidelity.",
    how: [
      "Wet etching uses chemical baths and is often isotropic (etches in all directions). Dry/plasma etching uses reactive ions and can be highly anisotropic, cutting straight down to make vertical features.",
      "A good etch is selective — it attacks the target far faster than the mask or the layer beneath — and is precisely timed or endpoint-detected to stop at the right depth.",
    ],
    inputs: ["Patterned (resist-masked) wafer", "Etchant gases or liquids", "Plasma power (dry etch)"],
    outputs: ["Wafer with the pattern etched into the target layer"],
    criticalParameters: ["Anisotropy", "Selectivity", "Etch rate", "Critical-dimension control", "Endpoint detection"],
    defects: ["Undercut", "Over/under-etch", "Sidewall roughness", "Etch residue / polymer"],
    equipment: ["Reactive-ion etch (RIE) tools", "Deep-RIE / plasma etchers", "Wet benches"],
    materials: ["Etchant gases (e.g. fluorine/chlorine chemistries)", "Wet etchants"],
    lessonSlug: "etching",
    relatedConcepts: [
      { label: "Etching", slug: "etching" },
      { label: "Lithography", slug: "lithography" },
      { label: "Deposition", slug: "deposition" },
    ],
    relatedTools: [],
    industrySegments: ["Equipment", "Materials"],
    researchThemes: ["Atomic-layer etching (ALE)", "High-aspect-ratio etch for 3D NAND / DRAM"],
  },
  {
    slug: "doping",
    name: "Doping",
    order: 10,
    stage: "wafer-fab",
    tagline: "Implanting impurities to set conductivity.",
    what: "Introducing controlled amounts of dopant atoms (e.g. boron, phosphorus, arsenic) into specific regions of the silicon to create n-type and p-type areas — usually by ion implantation.",
    why: "Doping is what makes a transistor: it defines sources, drains, wells, and channels by locally setting carrier type and concentration. Precise dose and depth control device thresholds and currents.",
    how: [
      "In ion implantation, dopant atoms are ionized, accelerated to high energy, and fired into the wafer; the mask (resist or oxide) blocks unwanted areas. Dose sets concentration; energy sets depth.",
      "Implantation damages the crystal, so a high-temperature anneal follows to repair the lattice and electrically activate the dopants.",
    ],
    inputs: ["Masked wafer", "Dopant species (B, P, As, …)", "Ion beam energy"],
    outputs: ["Wafer with defined n-type / p-type doped regions"],
    criticalParameters: ["Dose", "Implant energy (depth)", "Tilt angle", "Anneal temperature", "Junction depth"],
    defects: ["Incomplete activation", "Residual crystal damage", "Channeling", "Dose non-uniformity"],
    equipment: ["Ion implanter", "Rapid thermal anneal (RTA) tools", "Diffusion furnace"],
    materials: ["Dopant source gases", "Masking layers"],
    lessonSlug: "ion-implantation",
    relatedConcepts: [
      { label: "Doping", slug: "doping" },
      { label: "n-type semiconductor", slug: "n-type" },
      { label: "p-type semiconductor", slug: "p-type" },
      { label: "PN junction", slug: "pn-junction" },
    ],
    relatedTools: ["built-in-potential"],
    industrySegments: ["Equipment", "Materials"],
    researchThemes: ["Ultra-shallow junctions", "Conformal doping for 3D transistors"],
  },
  {
    slug: "cmp",
    name: "CMP",
    order: 11,
    stage: "wafer-fab",
    tagline: "Planarizing the surface between layers.",
    what: "Chemical-mechanical planarization: polishing the wafer flat between build-up steps using a combination of chemical slurry and mechanical abrasion.",
    why: "Each added layer creates topography. Lithography needs a flat surface to keep features in focus, so the wafer must be re-planarized many times as layers stack up — CMP is what makes multilayer wiring possible.",
    how: [
      "The wafer is pressed face-down against a rotating polishing pad flooded with an abrasive, chemically active slurry. Chemistry softens the surface while abrasives remove the high spots.",
      "CMP is used both to remove excess material (e.g. copper overburden in damascene wiring) and to level dielectric layers.",
    ],
    inputs: ["Wafer with surface topography", "CMP slurry", "Polishing pad"],
    outputs: ["Planarized (flat) wafer ready for the next layer"],
    criticalParameters: ["Removal rate", "Within-wafer uniformity", "Dishing and erosion", "Endpoint control"],
    defects: ["Dishing", "Erosion", "Micro-scratches", "Residual slurry particles"],
    equipment: ["CMP polisher", "Post-CMP cleaning stations"],
    materials: ["Abrasive slurry", "Polishing pads", "Ultra-pure water"],
    lessonSlug: "cmp",
    relatedConcepts: [
      { label: "CMP", slug: "cmp" },
      { label: "Metallization", slug: "metallization" },
    ],
    relatedTools: [],
    industrySegments: ["Equipment", "Materials"],
    researchThemes: ["Low-defectivity slurries", "CMP for advanced dielectric and metal stacks"],
  },
  {
    slug: "metrology",
    name: "Metrology",
    order: 12,
    stage: "wafer-fab",
    tagline: "Measuring and inspecting every layer.",
    what: "Measuring dimensions, film properties, and overlay, and inspecting for defects — repeatedly, throughout the fab — to keep the process within specification.",
    why: "With hundreds of steps and nanometre tolerances, a fab cannot rely on the final test alone. In-line metrology and inspection catch drift and defects early, protecting yield and enabling process control.",
    how: [
      "Metrology measures what is intended: film thickness, critical dimensions, overlay alignment, and doping/stress. Inspection hunts for what is not intended: particles, pattern defects, and scratches.",
      "Techniques span optical scatterometry, electron microscopy (CD-SEM), ellipsometry, and automated optical/e-beam defect inspection. Data feeds statistical process control loops.",
    ],
    inputs: ["Wafers at various process stages", "Reference standards / recipes"],
    outputs: ["Dimensional, film, and overlay data; defect maps"],
    criticalParameters: ["Measurement precision & repeatability", "Throughput", "Sensitivity to small defects", "Sampling strategy"],
    defects: ["Escaped (undetected) defects", "False counts", "Measurement drift"],
    equipment: ["CD-SEM", "Optical scatterometry / ellipsometry", "Defect-inspection scanners", "Overlay metrology"],
    materials: ["Reference / calibration wafers"],
    lessonSlug: "metrology",
    relatedConcepts: [
      { label: "Metrology & inspection", slug: "metrology" },
      { label: "Wafer test", slug: "wafer-test" },
    ],
    relatedTools: [],
    industrySegments: ["Equipment"],
    researchThemes: ["E-beam and hybrid metrology for EUV nodes", "AI-based defect classification"],
  },
  {
    slug: "interconnect",
    name: "Interconnect",
    order: 13,
    stage: "wafer-fab",
    tagline: "Wiring the transistors together.",
    what: "Building the multilevel metal wiring (typically copper, with barrier and dielectric layers) that connects millions to billions of transistors into working circuits.",
    why: "Transistors are useless without wiring. Modern chips stack many metal layers; as features shrink, interconnect resistance and capacitance (RC delay) increasingly limit speed and power, so materials and geometry matter enormously.",
    how: [
      "The dominant scheme is copper damascene: trenches and vias are etched into a dielectric, lined with a diffusion barrier, filled with copper, and then CMP removes the overburden — repeated for each metal level.",
      "Low-κ dielectrics between wires reduce capacitance; barrier layers stop copper from diffusing into the silicon.",
    ],
    inputs: ["Wafer with completed transistors", "Dielectric and barrier films", "Copper"],
    outputs: ["Wafer with multilevel metal interconnect"],
    criticalParameters: ["Line resistance", "Interconnect capacitance (RC delay)", "Via reliability", "Electromigration lifetime"],
    defects: ["Voids in vias/lines", "Electromigration failures", "Barrier discontinuity", "Dielectric breakdown"],
    equipment: ["Electroplating tools", "PVD/CVD for barriers and seed", "CMP polishers"],
    materials: ["Copper", "Barrier metals (Ta/TaN)", "Low-κ dielectrics"],
    lessonSlug: "metallization",
    relatedConcepts: [
      { label: "Metallization", slug: "metallization" },
      { label: "Deposition", slug: "deposition" },
      { label: "CMP", slug: "cmp" },
    ],
    relatedTools: ["rc-time-constant", "power-density"],
    industrySegments: ["Equipment", "Materials"],
    researchThemes: ["Alternative interconnect metals (Co, Ru)", "Air-gap and ultra-low-κ dielectrics"],
  },

  /* ---------------------------- TEST & ASSEMBLY ---------------------------- */
  {
    slug: "wafer-test",
    name: "Wafer test",
    order: 14,
    stage: "test-assembly",
    tagline: "Testing each die before dicing.",
    what: "Electrically testing each die while it is still on the wafer (wafer sort / probe), marking or logging which dies pass and which fail.",
    why: "Packaging is expensive, so it makes no sense to package a bad die. Wafer test screens out failures early and produces the yield data that drives process improvement.",
    how: [
      "A probe card lands fine needles or contacts on each die's pads, and automated test equipment applies electrical stimuli and measures responses against the spec.",
      "Results are recorded as a wafer map of good/bad dies; failing dies are inked or logged so they are discarded after dicing.",
    ],
    inputs: ["Finished wafer", "Test program", "Probe card"],
    outputs: ["Wafer map of passing / failing dies; yield data"],
    criticalParameters: ["Test coverage", "Probe contact quality", "Test time per die", "Yield"],
    defects: ["Probe-mark damage", "Escaped defective dies", "Contact / continuity failures"],
    equipment: ["Wafer prober", "Automated test equipment (ATE)", "Probe cards"],
    materials: ["Probe cards"],
    lessonSlug: "wafer-test",
    relatedConcepts: [
      { label: "Wafer test", slug: "wafer-test" },
      { label: "Metrology & inspection", slug: "metrology" },
    ],
    relatedTools: ["wafer-yield", "die-per-wafer"],
    industrySegments: ["Packaging & test", "Equipment"],
    researchThemes: ["Test-cost reduction and parallelism", "Adaptive / data-driven test"],
  },
  {
    slug: "dicing",
    name: "Dicing",
    order: 15,
    stage: "test-assembly",
    tagline: "Cutting the wafer into individual dies.",
    what: "Separating the wafer into individual dies (chips) by sawing, laser, or plasma along the scribe lines between dies.",
    why: "Every die must be singulated before it can be packaged. Dicing has to separate cleanly without chipping or cracking the brittle silicon, which would kill otherwise-good dies.",
    how: [
      "The wafer is mounted on adhesive dicing tape for support. A diamond blade, laser, or plasma process cuts along the scribe streets between dies.",
      "Good dies (per the wafer-test map) are picked from the tape for packaging; bad ones are discarded.",
    ],
    inputs: ["Tested wafer", "Dicing tape / frame", "Wafer map"],
    outputs: ["Singulated individual dies, sorted good/bad"],
    criticalParameters: ["Kerf width", "Chipping (front/back)", "Cut alignment", "Die-break strength"],
    defects: ["Edge chipping", "Micro-cracks", "Delamination", "Saw-street misalignment"],
    equipment: ["Dicing saw", "Laser / plasma dicing tools", "Die-attach / pick-and-place"],
    materials: ["Dicing tape", "Diamond blades"],
    lessonSlug: "dicing",
    relatedConcepts: [
      { label: "Dicing", slug: "dicing" },
      { label: "Wafer", slug: "wafer" },
    ],
    relatedTools: ["die-per-wafer"],
    industrySegments: ["Packaging & test", "Equipment"],
    researchThemes: ["Plasma dicing for thin wafers", "Low-damage singulation"],
  },
  {
    slug: "packaging",
    name: "Packaging",
    order: 16,
    stage: "test-assembly",
    tagline: "Protecting and connecting the die.",
    what: "Mounting the die in a package that protects it, connects it electrically to the outside world, and helps remove heat — from simple wire-bonded packages to flip-chip, 2.5D, and 3D stacks.",
    why: "The bare die is fragile and its pads are microscopic. Packaging provides mechanical protection, usable electrical terminals, and a thermal path. Advanced packaging is now a key lever for performance where transistor scaling slows.",
    how: [
      "The die is attached to a substrate or leadframe, then connected — by wire bonding to pads, or by flip-chip bumps to the substrate — and usually encapsulated (molded) for protection.",
      "Advanced schemes integrate multiple dies: interposers (2.5D), stacked dies and through-silicon vias (3D), chiplets, and high-bandwidth memory (HBM).",
    ],
    inputs: ["Known-good die", "Package substrate / leadframe", "Bond wires or bumps", "Mold compound"],
    outputs: ["Packaged chip with external terminals"],
    criticalParameters: ["Thermal resistance (θ_JA)", "Interconnect reliability", "Warpage", "Signal/power integrity"],
    defects: ["Delamination", "Bond/bump failures", "Voids in underfill", "Warpage-induced cracks"],
    equipment: ["Die bonder", "Wire bonder", "Flip-chip bonder", "Molding equipment"],
    materials: ["Package substrate", "Bond wire / solder bumps", "Underfill", "Mold compound"],
    lessonSlug: "packaging",
    relatedConcepts: [
      { label: "Packaging", slug: "packaging" },
      { label: "Flip-chip", slug: "flip-chip" },
      { label: "Advanced packaging", slug: "advanced-packaging" },
    ],
    relatedTools: ["junction-temperature", "power-density"],
    industrySegments: ["Packaging & test", "Materials"],
    researchThemes: ["Chiplets and heterogeneous integration", "2.5D/3D stacking and HBM", "Panel-level packaging"],
  },
  {
    slug: "final-test",
    name: "Final test",
    order: 17,
    stage: "test-assembly",
    tagline: "The last quality gate before shipping.",
    what: "Testing the fully packaged chip — often across voltage and temperature, sometimes with burn-in — to confirm it meets specification before it ships.",
    why: "Packaging can introduce new failures, and customers need guaranteed parts. Final test is the last gate: it verifies function and performance and sorts parts into speed/quality grades (binning).",
    how: [
      "The packaged part is loaded into a test handler and contacted by a socket; automated test equipment runs functional and parametric tests, often over a temperature range.",
      "Burn-in may stress parts to weed out early-life failures. Passing parts are binned by performance grade; failures are scrapped.",
    ],
    inputs: ["Packaged chips", "Final-test program", "Test handler & sockets"],
    outputs: ["Graded, ship-ready chips (and reject stream)"],
    criticalParameters: ["Test coverage", "Test conditions (V, T)", "Binning accuracy", "Test time"],
    defects: ["Escaped defective units (test escapes)", "Yield loss from over-rejection", "Socket contact issues"],
    equipment: ["Automated test equipment (ATE)", "Test handlers", "Burn-in ovens"],
    materials: ["Test sockets"],
    lessonSlug: "final-test",
    relatedConcepts: [
      { label: "Final test", slug: "final-test" },
      { label: "Wafer test", slug: "wafer-test" },
    ],
    relatedTools: ["wafer-yield"],
    industrySegments: ["Packaging & test", "Equipment"],
    researchThemes: ["System-level test (SLT)", "Reliability screening and burn-in reduction"],
  },
];

const BY_SLUG = new Map(MFG_PROCESSES.map((p) => [p.slug, p]));

export function getProcess(slug: string): ProcessStep | undefined {
  return BY_SLUG.get(slug);
}

export function processesOfStage(stage: StageId): ProcessStep[] {
  return MFG_PROCESSES.filter((p) => p.stage === stage);
}

/** Previous / next step in the overall flow, for in-page navigation. */
export function processNeighbors(slug: string): {
  prev?: ProcessStep;
  next?: ProcessStep;
} {
  const i = MFG_PROCESSES.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return {
    prev: i > 0 ? MFG_PROCESSES[i - 1] : undefined,
    next: i < MFG_PROCESSES.length - 1 ? MFG_PROCESSES[i + 1] : undefined,
  };
}

/** Stages in flow order, each with its ordered processes. */
export function flowByStage(): { stage: Stage; processes: ProcessStep[] }[] {
  return STAGES.map((stage) => ({
    stage,
    processes: processesOfStage(stage.id),
  }));
}
