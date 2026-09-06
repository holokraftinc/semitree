/**
 * Research Hub registry.
 *
 * See types.ts for the NO-FABRICATION rule. Papers, patents, and researchers are
 * deliberately EMPTY (they need individually-verified sources). Journals,
 * conferences, universities, and labs are seeded with real, established entities;
 * a `url` is present only where the canonical domain is known.
 */
import type { ResearchResource, ResearchTopic, ResourceType } from "./types";
import { getProcess } from "@/lib/knowledge/manufacturing";
import { getCompany } from "@/lib/industry/companies";

const V = "2026-09-06";

/* ------------------------------- Sections ---------------------------------- */

export const SECTIONS: { type: ResourceType | "topic"; label: string; description: string }[] = [
  { type: "paper", label: "Papers", description: "Peer-reviewed research (added only with verified sources)." },
  { type: "patent", label: "Patents", description: "Granted patents (added only with verified sources)." },
  { type: "journal", label: "Journals", description: "Where the field publishes." },
  { type: "conference", label: "Conferences", description: "Where the field meets." },
  { type: "lab", label: "Research labs", description: "Institutes and consortia." },
  { type: "university", label: "Universities", description: "Academic research groups." },
  { type: "topic", label: "Research topics", description: "Active areas, linked to the knowledge base." },
  { type: "researcher", label: "Researchers", description: "Researcher profiles (added only with consent/verification)." },
];

/* ------------------------------ Research topics ---------------------------- */

export const RESEARCH_TOPICS: ResearchTopic[] = [
  {
    slug: "euv-lithography",
    name: "EUV lithography",
    summary: "Extreme-ultraviolet patterning and its extension to High-NA.",
    description: [
      "EUV (13.5 nm) lithography enables the smallest features in advanced logic and memory. Research focuses on extending resolution with High-NA optics, improving photoresist performance, and cutting cost and defectivity per wafer.",
    ],
    technologies: ["EUV", "High-NA EUV", "Computational lithography", "Multi-patterning"],
    devices: ["Advanced logic", "DRAM"],
    materials: ["EUV photoresist", "Pellicle", "Reticle"],
    applications: ["Advanced logic", "Memory"],
    relatedConcepts: [
      { label: "Lithography", slug: "lithography" },
      { label: "Photoresist", slug: "photoresist" },
    ],
    relatedProcesses: ["lithography", "photoresist"],
    relatedTools: [],
    relatedCompanies: ["asml", "tsmc", "intel", "samsung-semiconductor"],
    openQuestions: ["Extending High-NA EUV", "Resist resolution vs line-edge roughness", "Throughput and cost per wafer"],
  },
  {
    slug: "gaa-transistors",
    name: "Gate-all-around transistors",
    summary: "Nanosheet transistors succeeding the FinFET.",
    description: [
      "Gate-all-around (GAA) nanosheet transistors wrap the gate fully around the channel for better electrostatic control at scaled dimensions. Research addresses channel engineering, contact resistance, and stacked complementary FET (CFET) devices.",
    ],
    technologies: ["Gate-all-around (GAA)", "Nanosheet", "CFET"],
    devices: ["MOSFET", "Logic transistor"],
    materials: ["Silicon", "High-κ dielectric"],
    applications: ["Advanced logic"],
    relatedConcepts: [
      { label: "MOSFET", slug: "mosfet" },
      { label: "CMOS", slug: "cmos" },
    ],
    relatedProcesses: ["deposition", "etching", "doping"],
    relatedTools: ["built-in-potential"],
    relatedCompanies: ["tsmc", "samsung-semiconductor", "intel"],
    openQuestions: ["Nanosheet channel engineering", "Contact resistance at scale", "CFET stacking"],
  },
  {
    slug: "advanced-packaging-chiplets",
    name: "Advanced packaging & chiplets",
    summary: "Heterogeneous integration of multiple dies.",
    description: [
      "As transistor scaling slows, performance increasingly comes from packaging: splitting a design into chiplets and integrating them on interposers (2.5D) or 3D stacks. Research covers die-to-die interconnect, thermal management, and known-good-die testing.",
    ],
    technologies: ["Chiplets", "2.5D", "3D stacking", "Heterogeneous integration"],
    devices: ["SoC", "Interposer", "HBM stack"],
    materials: ["Substrate", "Solder bumps", "Underfill", "TSV copper"],
    applications: ["AI / HPC", "Data center"],
    relatedConcepts: [
      { label: "Chiplets", slug: "chiplets" },
      { label: "Flip-chip", slug: "flip-chip" },
      { label: "Advanced packaging", slug: "advanced-packaging" },
    ],
    relatedProcesses: ["packaging", "dicing"],
    relatedTools: ["junction-temperature", "power-density"],
    relatedCompanies: ["tsmc", "ase", "amkor", "amd", "nvidia"],
    openQuestions: ["Die-to-die interconnect standards", "Thermal management of 3D stacks", "Known-good-die test"],
  },
  {
    slug: "high-bandwidth-memory",
    name: "High-bandwidth memory (HBM)",
    summary: "Stacked DRAM for bandwidth-hungry accelerators.",
    description: [
      "HBM stacks multiple DRAM dies connected by through-silicon vias to deliver very high bandwidth, and has become critical for AI accelerators. Research targets taller stacks, thermal limits, and base-die integration.",
    ],
    technologies: ["HBM", "TSV", "Die stacking"],
    devices: ["DRAM", "Memory stack"],
    materials: ["Silicon (TSV)", "Microbumps"],
    applications: ["AI / HPC", "GPUs"],
    relatedConcepts: [
      { label: "HBM", slug: "hbm" },
      { label: "3D IC", slug: "3d-ic" },
    ],
    relatedProcesses: ["packaging", "dicing", "interconnect"],
    relatedTools: ["power-density"],
    relatedCompanies: ["sk-hynix", "samsung-semiconductor", "micron", "nvidia"],
    openQuestions: ["Stack height & thermal limits", "Bandwidth scaling", "Base-die integration"],
  },
  {
    slug: "wide-bandgap",
    name: "Wide-bandgap semiconductors",
    summary: "Silicon carbide and gallium nitride for power and RF.",
    description: [
      "Wide-bandgap materials — silicon carbide (SiC) and gallium nitride (GaN) — outperform silicon for high-voltage, high-frequency, and high-temperature power electronics. Research focuses on wafer quality, device reliability, and cost.",
    ],
    technologies: ["Silicon carbide (SiC)", "Gallium nitride (GaN)", "Power devices"],
    devices: ["Power MOSFET", "Diode", "HEMT"],
    materials: ["SiC", "GaN", "Silicon"],
    applications: ["Automotive / EV", "Power electronics", "RF"],
    relatedConcepts: [
      { label: "MOSFET", slug: "mosfet" },
      { label: "PN junction", slug: "pn-junction" },
      { label: "Diode", slug: "diode" },
    ],
    relatedProcesses: ["deposition", "doping", "packaging"],
    relatedTools: ["power-dissipation", "junction-temperature"],
    relatedCompanies: ["infineon", "texas-instruments"],
    openQuestions: ["SiC wafer defect density & cost", "GaN reliability", "Vertical GaN devices"],
  },
  {
    slug: "interconnect-scaling",
    name: "Interconnect scaling",
    summary: "Keeping on-chip wiring fast as pitches shrink.",
    description: [
      "As wires shrink, resistance and capacitance (RC delay) increasingly limit chip performance. Research explores alternative conductor metals (cobalt, ruthenium), lower-κ dielectrics, and air gaps.",
    ],
    technologies: ["Copper damascene", "Low-κ dielectrics", "Alternative metals (Co, Ru)", "Air gaps"],
    devices: ["Logic backend"],
    materials: ["Copper", "Cobalt", "Ruthenium", "Low-κ dielectric", "Barrier metals"],
    applications: ["Advanced logic"],
    relatedConcepts: [
      { label: "Metallization", slug: "metallization" },
      { label: "CMP", slug: "cmp" },
    ],
    relatedProcesses: ["interconnect", "deposition", "cmp"],
    relatedTools: ["rc-time-constant"],
    relatedCompanies: ["applied-materials", "lam-research", "tsmc", "intel"],
    openQuestions: ["RC delay at scaled pitch", "Barrier/liner scaling", "New conductor metals"],
  },
  {
    slug: "yield-defect-learning",
    name: "Yield & defect learning",
    summary: "Finding and fixing defects to ramp yield.",
    description: [
      "Yield is the economic heart of a fab. Research combines metrology, defect inspection, and statistical/AI methods to find defects early and shorten the yield-ramp of new process nodes.",
    ],
    technologies: ["Defect inspection", "Metrology", "Statistical process control", "AI defect classification"],
    devices: [],
    materials: [],
    applications: ["Fab operations"],
    relatedConcepts: [
      { label: "Metrology & inspection", slug: "metrology" },
      { label: "Wafer test", slug: "wafer-test" },
    ],
    relatedProcesses: ["metrology", "wafer-test", "final-test"],
    relatedTools: ["wafer-yield", "die-per-wafer"],
    relatedCompanies: ["kla", "applied-materials"],
    openQuestions: ["Faster yield ramp at new nodes", "AI/ML defect root-cause", "Metrology for EUV-era features"],
  },
  {
    slug: "ai-eda",
    name: "AI-driven design automation",
    summary: "Machine learning inside the chip-design flow.",
    description: [
      "EDA vendors and researchers are applying machine learning across synthesis, place-and-route, and verification to explore larger design spaces faster and improve power, performance, and area.",
    ],
    technologies: ["AI/ML in EDA", "Cloud EDA", "Design-space exploration"],
    devices: [],
    materials: [],
    applications: ["Chip design"],
    relatedConcepts: [
      { label: "RTL", slug: "rtl" },
      { label: "Synthesis", slug: "synthesis" },
      { label: "Place & route", slug: "place-and-route" },
      { label: "Verification", slug: "verification" },
    ],
    relatedProcesses: [],
    relatedTools: [],
    relatedCompanies: ["synopsys", "cadence", "arm"],
    openQuestions: ["ML-guided place & route", "Generative design", "AI-assisted verification coverage"],
  },
  {
    slug: "3d-integration",
    name: "3D integration",
    summary: "Stacking devices vertically with dense bonding.",
    description: [
      "3D integration stacks logic and memory vertically using through-silicon vias and hybrid bonding to cut interconnect distance and boost density. Research targets bonding pitch, thermal dissipation, and 3D-aware design tools.",
    ],
    technologies: ["3D IC", "TSV", "Hybrid bonding", "CFET"],
    devices: ["3D logic", "3D memory"],
    materials: ["TSV copper", "Bonding dielectrics"],
    applications: ["AI / HPC", "Memory"],
    relatedConcepts: [
      { label: "3D IC", slug: "3d-ic" },
      { label: "2.5D integration", slug: "2-5d" },
    ],
    relatedProcesses: ["interconnect", "packaging"],
    relatedTools: ["junction-temperature", "power-density"],
    relatedCompanies: ["tsmc", "intel", "samsung-semiconductor"],
    openQuestions: ["Hybrid bonding pitch scaling", "Thermal dissipation in stacks", "3D design tools"],
  },
];

/* --------------------------------- Resources ------------------------------- */
/* Only real, established entities. `url` set only where the canonical domain is
   known. Papers / patents / researchers intentionally empty. */

const uni = (id: string, title: string, country: string, url?: string): ResearchResource => ({
  id,
  type: "university",
  title,
  organization: country,
  url,
  verified: true,
  tags: [country],
  lastVerified: V,
});

export const RESEARCH_RESOURCES: ResearchResource[] = [
  // Universities (real; stable domains).
  uni("mit", "Massachusetts Institute of Technology", "United States", "https://www.mit.edu"),
  uni("stanford", "Stanford University", "United States", "https://www.stanford.edu"),
  uni("berkeley", "University of California, Berkeley", "United States", "https://www.berkeley.edu"),
  uni("caltech", "California Institute of Technology", "United States", "https://www.caltech.edu"),
  uni("gatech", "Georgia Institute of Technology", "United States", "https://www.gatech.edu"),
  uni("purdue", "Purdue University", "United States", "https://www.purdue.edu"),
  uni("ethz", "ETH Zurich", "Switzerland", "https://ethz.ch"),
  uni("kaist", "KAIST", "South Korea", "https://www.kaist.ac.kr"),
  uni("nus", "National University of Singapore", "Singapore", "https://www.nus.edu.sg"),
  uni("iisc", "Indian Institute of Science (IISc)", "India", "https://iisc.ac.in"),
  uni("iitb", "IIT Bombay", "India", "https://www.iitb.ac.in"),
  uni("iitm", "IIT Madras", "India", "https://www.iitm.ac.in"),

  // Research labs / consortia (real).
  { id: "imec", type: "lab", title: "imec", organization: "Belgium", url: "https://www.imec-int.com", verified: true, tags: ["Belgium"], lastVerified: V },
  { id: "fraunhofer", type: "lab", title: "Fraunhofer Society", organization: "Germany", url: "https://www.fraunhofer.de", verified: true, tags: ["Germany"], lastVerified: V },
  { id: "astar-ime", type: "lab", title: "A*STAR Institute of Microelectronics (IME)", organization: "Singapore", url: "https://www.a-star.edu.sg", verified: true, tags: ["Singapore"], lastVerified: V },
  { id: "src", type: "lab", title: "Semiconductor Research Corporation (SRC)", organization: "United States", url: "https://www.src.org", verified: true, tags: ["United States"], lastVerified: V },
  { id: "cea-leti", type: "lab", title: "CEA-Leti", organization: "France", verified: true, tags: ["France"], lastVerified: V },

  // Journals (real). URL only where canonical domain is confident.
  { id: "nature-electronics", type: "journal", title: "Nature Electronics", organization: "Nature Portfolio", url: "https://www.nature.com/natelectron/", verified: true, lastVerified: V },
  { id: "ieee-ted", type: "journal", title: "IEEE Transactions on Electron Devices", organization: "IEEE", verified: true, lastVerified: V },
  { id: "ieee-jssc", type: "journal", title: "IEEE Journal of Solid-State Circuits", organization: "IEEE", verified: true, lastVerified: V },
  { id: "ieee-edl", type: "journal", title: "IEEE Electron Device Letters", organization: "IEEE", verified: true, lastVerified: V },
  { id: "solid-state-electronics", type: "journal", title: "Solid-State Electronics", organization: "Elsevier", verified: true, lastVerified: V },

  // Conferences (real). URL only where confident.
  { id: "iedm", type: "conference", title: "IEEE International Electron Devices Meeting (IEDM)", organization: "IEEE", verified: true, lastVerified: V },
  { id: "isscc", type: "conference", title: "IEEE International Solid-State Circuits Conference (ISSCC)", organization: "IEEE", url: "https://www.isscc.org", verified: true, lastVerified: V },
  { id: "vlsi-symposium", type: "conference", title: "Symposium on VLSI Technology and Circuits", organization: "IEEE", verified: true, lastVerified: V },
  { id: "dac", type: "conference", title: "Design Automation Conference (DAC)", organization: "ACM/IEEE", url: "https://www.dac.com", verified: true, lastVerified: V },
  { id: "date", type: "conference", title: "Design, Automation and Test in Europe (DATE)", verified: true, lastVerified: V },
  { id: "ectc", type: "conference", title: "IEEE Electronic Components and Technology Conference (ECTC)", organization: "IEEE", verified: true, lastVerified: V },
  { id: "semicon", type: "conference", title: "SEMICON", organization: "SEMI", url: "https://www.semi.org", verified: true, lastVerified: V },

  // Papers, patents, researchers: intentionally none (no fabrication).
];

/* --------------------------------- Helpers --------------------------------- */

const TOPIC_BY_SLUG = new Map(RESEARCH_TOPICS.map((t) => [t.slug, t]));

export function getTopic(slug: string): ResearchTopic | undefined {
  return TOPIC_BY_SLUG.get(slug);
}

export function resourcesByType(type: ResourceType): ResearchResource[] {
  return RESEARCH_RESOURCES.filter((r) => r.type === type);
}

export function countByType(type: ResourceType): number {
  return resourcesByType(type).length;
}

/* --------------------------------- Discovery ------------------------------- */

export type FacetKey =
  | "technology"
  | "process"
  | "device"
  | "material"
  | "application"
  | "company";

export const FACET_DEFS: { key: FacetKey; label: string }[] = [
  { key: "technology", label: "Technology" },
  { key: "process", label: "Process" },
  { key: "device", label: "Device" },
  { key: "material", label: "Material" },
  { key: "application", label: "Application" },
  { key: "company", label: "Company" },
];

function topicValuesFor(topic: ResearchTopic, key: FacetKey): string[] {
  switch (key) {
    case "technology": return topic.technologies;
    case "device": return topic.devices;
    case "material": return topic.materials;
    case "application": return topic.applications;
    case "process": return topic.relatedProcesses;
    case "company": return topic.relatedCompanies;
  }
}

/** Options for a facet as {value,label}. Process/company map slug → name. */
export function facetOptions(key: FacetKey): { value: string; label: string }[] {
  const values = new Set<string>();
  for (const t of RESEARCH_TOPICS) topicValuesFor(t, key).forEach((v) => values.add(v));
  const arr = Array.from(values);
  if (key === "process") {
    return arr
      .map((slug) => ({ value: slug, label: getProcess(slug)?.name ?? slug }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
  if (key === "company") {
    return arr
      .map((slug) => ({ value: slug, label: getCompany(slug)?.name ?? slug }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
  return arr.sort().map((v) => ({ value: v, label: v }));
}

export function topicsForFacet(key: FacetKey, value: string): ResearchTopic[] {
  return RESEARCH_TOPICS.filter((t) => topicValuesFor(t, key).includes(value));
}
