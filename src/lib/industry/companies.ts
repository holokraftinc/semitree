/**
 * Semiconductor company registry.
 *
 * Seeded ONLY with well-established public facts (see the editorial rule in
 * types.ts). Coordinates are city-level (the marker sits on the city, not an
 * exact street address) unless a specific site is genuinely known. Leadership
 * and hiring URLs are intentionally omitted where they cannot be stated with
 * confidence — the UI renders whatever is present and nothing more. India fab /
 * ATMP / OSAT projects reflect publicly announced facilities and their states.
 *
 * `lastVerified` records when each entry was compiled from public sources.
 */
import type { Company, CompanyType, GeoPoint } from "./types";

const V = "2026-09-06"; // compilation date

// Reusable city points (city-level precision).
const US = (city: string, lat: number, long: number, state: string): Omit<GeoPoint, "label" | "kind"> => ({
  city, state, country: "United States", countryCode: "US", lat, long, precision: "city",
});
const IN_ = (city: string, lat: number, long: number, state: string): Omit<GeoPoint, "label" | "kind"> => ({
  city, state, country: "India", countryCode: "IN", lat, long, precision: "city",
});

export const COMPANIES: Company[] = [
  {
    slug: "tsmc",
    name: "TSMC",
    types: ["foundry"],
    website: "https://www.tsmc.com",
    hq: { label: "HQ", kind: "hq", city: "Hsinchu", country: "Taiwan", countryCode: "TW", lat: 24.8138, long: 120.9675, precision: "city" },
    description:
      "The world's largest dedicated (pure-play) foundry: it manufactures chips designed by fabless companies rather than selling its own branded products.",
    technologies: ["Leading-edge logic (FinFET, gate-all-around)", "Advanced packaging (CoWoS, InFO)"],
    products: ["Foundry wafer manufacturing services"],
    processes: ["Lithography", "Etching", "Deposition"],
    founders: ["Morris Chang"],
    research: ["Advanced logic nodes (2 nm and beyond)", "Advanced packaging and chiplets"],
    relatedCompanies: ["asml", "applied-materials", "nvidia"],
    relatedProcesses: ["lithography", "etching", "deposition", "wafer-test"],
    relatedTools: ["die-per-wafer", "wafer-yield"],
    relatedConcepts: [{ label: "Integrated circuit", slug: "integrated-circuit" }, { label: "CMOS", slug: "cmos" }],
    sources: [{ label: "tsmc.com", url: "https://www.tsmc.com" }],
    lastVerified: V,
  },
  {
    slug: "intel",
    name: "Intel",
    types: ["idm", "foundry"],
    website: "https://www.intel.com",
    hq: { label: "HQ", kind: "hq", ...US("Santa Clara", 37.3875, -121.9700, "California") },
    sites: [{ label: "Intel India (Bengaluru)", kind: "rd", ...IN_("Bengaluru", 12.9716, 77.5946, "Karnataka") }],
    description:
      "An integrated device manufacturer (IDM) that designs and fabricates its own processors, and is building a foundry business (Intel Foundry).",
    technologies: ["x86 processors", "Advanced logic nodes", "Advanced packaging (Foveros, EMIB)"],
    products: ["CPUs", "Data-center and client silicon"],
    processes: ["Lithography", "Etching", "Deposition"],
    founders: ["Robert Noyce", "Gordon Moore"],
    research: ["Transistor scaling", "Advanced packaging"],
    relatedCompanies: ["tsmc", "amd", "asml"],
    relatedProcesses: ["lithography", "deposition", "interconnect", "packaging"],
    relatedTools: ["power-density", "die-per-wafer"],
    relatedConcepts: [{ label: "CMOS", slug: "cmos" }, { label: "MOSFET", slug: "mosfet" }],
    sources: [{ label: "intel.com", url: "https://www.intel.com" }],
    lastVerified: V,
  },
  {
    slug: "samsung-semiconductor",
    name: "Samsung Electronics",
    types: ["idm", "foundry"],
    website: "https://www.samsung.com",
    hq: { label: "HQ", kind: "hq", city: "Suwon", country: "South Korea", countryCode: "KR", lat: 37.2636, long: 127.0286, precision: "city" },
    description:
      "A major integrated device manufacturer and foundry, and one of the largest producers of memory (DRAM and NAND) as well as logic.",
    technologies: ["DRAM", "NAND flash", "Leading-edge logic (GAA)", "Foundry"],
    products: ["Memory", "Logic / foundry services", "Image sensors"],
    processes: ["Deposition", "Etching", "Lithography"],
    research: ["Memory scaling", "Gate-all-around logic"],
    relatedCompanies: ["sk-hynix", "micron"],
    relatedProcesses: ["deposition", "etching", "lithography"],
    relatedTools: ["wafer-yield", "die-per-wafer"],
    relatedConcepts: [{ label: "Integrated circuit", slug: "integrated-circuit" }],
    sources: [{ label: "samsung.com", url: "https://www.samsung.com" }],
    lastVerified: V,
  },
  {
    slug: "sk-hynix",
    name: "SK hynix",
    types: ["idm"],
    website: "https://www.skhynix.com",
    hq: { label: "HQ", kind: "hq", city: "Icheon", country: "South Korea", countryCode: "KR", lat: 37.2792, long: 127.4425, precision: "city" },
    description: "A major memory-focused IDM producing DRAM and NAND flash, including high-bandwidth memory (HBM).",
    technologies: ["DRAM", "NAND flash", "HBM"],
    products: ["Memory"],
    processes: ["Deposition", "Etching"],
    research: ["High-bandwidth memory", "3D NAND scaling"],
    relatedCompanies: ["samsung-semiconductor", "micron"],
    relatedProcesses: ["deposition", "etching", "packaging"],
    relatedConcepts: [{ label: "HBM", slug: "hbm" }],
    sources: [{ label: "skhynix.com", url: "https://www.skhynix.com" }],
    lastVerified: V,
  },
  {
    slug: "micron",
    name: "Micron Technology",
    types: ["idm", "atmp"],
    website: "https://www.micron.com",
    hq: { label: "HQ", kind: "hq", ...US("Boise", 43.6150, -116.2023, "Idaho") },
    sites: [
      { label: "Sanand ATMP", kind: "atmp", ...IN_("Sanand", 22.9880, 72.3813, "Gujarat") },
      { label: "Hyderabad design center", kind: "rd", ...IN_("Hyderabad", 17.3850, 78.4867, "Telangana") },
    ],
    description:
      "A memory-focused IDM (DRAM, NAND). It is building an assembly-and-test (ATMP) facility at Sanand, Gujarat — one of India's first announced large semiconductor facilities.",
    technologies: ["DRAM", "NAND flash", "HBM"],
    products: ["Memory"],
    processes: ["Packaging", "Testing"],
    research: ["Memory scaling", "Advanced assembly and test"],
    relatedCompanies: ["samsung-semiconductor", "sk-hynix"],
    relatedProcesses: ["packaging", "final-test", "dicing"],
    relatedTools: ["wafer-yield", "junction-temperature"],
    relatedConcepts: [{ label: "Packaging", slug: "packaging" }],
    sources: [{ label: "micron.com", url: "https://www.micron.com" }],
    lastVerified: V,
  },
  {
    slug: "nvidia",
    name: "NVIDIA",
    types: ["fabless"],
    website: "https://www.nvidia.com",
    hq: { label: "HQ", kind: "hq", ...US("Santa Clara", 37.3541, -121.9552, "California") },
    sites: [{ label: "Bengaluru design center", kind: "rd", ...IN_("Bengaluru", 12.9716, 77.5946, "Karnataka") }],
    description:
      "A fabless designer of GPUs and accelerated-computing platforms; it designs chips and outsources fabrication to foundries.",
    technologies: ["GPUs", "AI accelerators", "Interconnect / systems"],
    products: ["GPUs", "Data-center AI platforms"],
    founders: ["Jensen Huang", "Chris Malachowsky", "Curtis Priem"],
    research: ["Accelerated computing", "AI hardware and interconnect"],
    relatedCompanies: ["tsmc", "amd"],
    relatedProcesses: ["packaging"],
    relatedTools: ["power-density", "rc-time-constant"],
    relatedConcepts: [{ label: "Integrated circuit", slug: "integrated-circuit" }, { label: "HBM", slug: "hbm" }],
    sources: [{ label: "nvidia.com", url: "https://www.nvidia.com" }],
    lastVerified: V,
  },
  {
    slug: "amd",
    name: "AMD",
    types: ["fabless"],
    website: "https://www.amd.com",
    hq: { label: "HQ", kind: "hq", ...US("Santa Clara", 37.3900, -121.9600, "California") },
    sites: [{ label: "Hyderabad design center", kind: "rd", ...IN_("Hyderabad", 17.3850, 78.4867, "Telangana") }],
    description: "A fabless designer of CPUs, GPUs, and adaptive computing; fabrication is outsourced to foundries.",
    technologies: ["x86 CPUs", "GPUs", "Adaptive SoCs / FPGAs", "Chiplets"],
    products: ["CPUs", "GPUs", "Data-center accelerators"],
    founders: ["Jerry Sanders"],
    research: ["Chiplet architectures", "Accelerated computing"],
    relatedCompanies: ["nvidia", "intel", "tsmc"],
    relatedProcesses: ["packaging"],
    relatedTools: ["power-density", "power-dissipation"],
    relatedConcepts: [{ label: "Chiplets", slug: "chiplets" }, { label: "CMOS", slug: "cmos" }],
    sources: [{ label: "amd.com", url: "https://www.amd.com" }],
    lastVerified: V,
  },
  {
    slug: "qualcomm",
    name: "Qualcomm",
    types: ["fabless"],
    website: "https://www.qualcomm.com",
    hq: { label: "HQ", kind: "hq", ...US("San Diego", 32.8951, -117.1957, "California") },
    sites: [
      { label: "Hyderabad design center", kind: "rd", ...IN_("Hyderabad", 17.3850, 78.4867, "Telangana") },
      { label: "Bengaluru design center", kind: "rd", ...IN_("Bengaluru", 12.9716, 77.5946, "Karnataka") },
    ],
    description: "A fabless designer of mobile SoCs and wireless technologies; chips are manufactured by foundries.",
    technologies: ["Mobile SoCs", "Wireless / modem", "RF front-end"],
    products: ["Snapdragon SoCs", "Modems", "RF"],
    founders: ["Irwin Jacobs", "Andrew Viterbi"],
    research: ["Wireless communications", "Low-power mobile SoCs"],
    relatedCompanies: ["tsmc", "arm"],
    relatedProcesses: ["packaging"],
    relatedTools: ["power-density", "rc-time-constant"],
    relatedConcepts: [{ label: "Integrated circuit", slug: "integrated-circuit" }],
    sources: [{ label: "qualcomm.com", url: "https://www.qualcomm.com" }],
    lastVerified: V,
  },
  {
    slug: "broadcom",
    name: "Broadcom",
    types: ["fabless"],
    website: "https://www.broadcom.com",
    hq: { label: "HQ", kind: "hq", ...US("Palo Alto", 37.4419, -122.1430, "California") },
    description: "A broad semiconductor and infrastructure-software company; its chip business is fabless, spanning networking, broadband, and storage.",
    technologies: ["Networking silicon", "Custom ASICs", "Broadband / storage"],
    products: ["Networking chips", "Custom accelerators"],
    research: ["High-speed networking", "Custom silicon"],
    relatedCompanies: ["tsmc"],
    relatedProcesses: ["packaging"],
    relatedTools: ["rc-time-constant"],
    relatedConcepts: [{ label: "Integrated circuit", slug: "integrated-circuit" }],
    sources: [{ label: "broadcom.com", url: "https://www.broadcom.com" }],
    lastVerified: V,
  },
  {
    slug: "asml",
    name: "ASML",
    types: ["equipment"],
    website: "https://www.asml.com",
    hq: { label: "HQ", kind: "hq", city: "Veldhoven", country: "Netherlands", countryCode: "NL", lat: 51.4192, long: 5.4041, precision: "city" },
    description: "The dominant maker of photolithography systems, and the sole supplier of extreme-ultraviolet (EUV) lithography scanners.",
    technologies: ["EUV lithography", "DUV lithography", "Computational lithography"],
    products: ["Lithography scanners"],
    research: ["High-NA EUV", "Lithography productivity"],
    relatedCompanies: ["tsmc", "intel", "samsung-semiconductor"],
    relatedProcesses: ["lithography"],
    relatedConcepts: [{ label: "Lithography", slug: "lithography" }, { label: "Photoresist", slug: "photoresist" }],
    sources: [{ label: "asml.com", url: "https://www.asml.com" }],
    lastVerified: V,
  },
  {
    slug: "applied-materials",
    name: "Applied Materials",
    types: ["equipment"],
    website: "https://www.appliedmaterials.com",
    hq: { label: "HQ", kind: "hq", ...US("Santa Clara", 37.3760, -121.9640, "California") },
    sites: [{ label: "Bengaluru R&D", kind: "rd", ...IN_("Bengaluru", 12.9716, 77.5946, "Karnataka") }],
    description: "One of the largest suppliers of wafer-fabrication equipment, spanning deposition, etch, and other process steps.",
    technologies: ["Deposition (CVD/PVD/ALD)", "Etch", "CMP", "Ion implantation"],
    products: ["Process equipment"],
    research: ["Materials engineering for advanced nodes"],
    relatedCompanies: ["lam-research", "tokyo-electron", "kla"],
    relatedProcesses: ["deposition", "etching", "cmp", "doping"],
    relatedConcepts: [{ label: "Deposition", slug: "deposition" }],
    sources: [{ label: "appliedmaterials.com", url: "https://www.appliedmaterials.com" }],
    lastVerified: V,
  },
  {
    slug: "lam-research",
    name: "Lam Research",
    types: ["equipment"],
    website: "https://www.lamresearch.com",
    hq: { label: "HQ", kind: "hq", ...US("Fremont", 37.5485, -121.9886, "California") },
    description: "A major supplier of wafer-fabrication equipment, especially etch and deposition tools.",
    technologies: ["Plasma etch", "Deposition", "Clean"],
    products: ["Etch and deposition systems"],
    research: ["Atomic-layer etch", "High-aspect-ratio etch"],
    relatedCompanies: ["applied-materials", "tokyo-electron"],
    relatedProcesses: ["etching", "deposition"],
    relatedConcepts: [{ label: "Etching", slug: "etching" }],
    sources: [{ label: "lamresearch.com", url: "https://www.lamresearch.com" }],
    lastVerified: V,
  },
  {
    slug: "kla",
    name: "KLA",
    types: ["equipment", "testing"],
    website: "https://www.kla.com",
    hq: { label: "HQ", kind: "hq", ...US("Milpitas", 37.4323, -121.9066, "California") },
    sites: [{ label: "Chennai R&D", kind: "rd", ...IN_("Chennai", 13.0827, 80.2707, "Tamil Nadu") }],
    description: "A leader in process-control equipment — metrology and defect inspection used throughout the fab.",
    technologies: ["Defect inspection", "Metrology", "Overlay"],
    products: ["Inspection and metrology systems"],
    research: ["Metrology for EUV nodes", "AI-based defect detection"],
    relatedCompanies: ["applied-materials", "lam-research"],
    relatedProcesses: ["metrology", "wafer-test"],
    relatedConcepts: [{ label: "Metrology & inspection", slug: "metrology" }],
    sources: [{ label: "kla.com", url: "https://www.kla.com" }],
    lastVerified: V,
  },
  {
    slug: "tokyo-electron",
    name: "Tokyo Electron (TEL)",
    types: ["equipment"],
    website: "https://www.tel.com",
    hq: { label: "HQ", kind: "hq", city: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.6895, long: 139.6917, precision: "city" },
    description: "A major Japanese supplier of wafer-fabrication equipment across coat/develop, deposition, etch, and cleaning.",
    technologies: ["Coat/develop tracks", "Deposition", "Etch", "Clean"],
    products: ["Process equipment"],
    research: ["Patterning and deposition for advanced nodes"],
    relatedCompanies: ["applied-materials", "lam-research"],
    relatedProcesses: ["photoresist", "deposition", "etching"],
    relatedConcepts: [{ label: "Photoresist", slug: "photoresist" }],
    sources: [{ label: "tel.com", url: "https://www.tel.com" }],
    lastVerified: V,
  },
  {
    slug: "synopsys",
    name: "Synopsys",
    types: ["eda", "design-services"],
    website: "https://www.synopsys.com",
    hq: { label: "HQ", kind: "hq", ...US("Sunnyvale", 37.3688, -122.0363, "California") },
    sites: [
      { label: "Bengaluru R&D", kind: "rd", ...IN_("Bengaluru", 12.9716, 77.5946, "Karnataka") },
      { label: "Noida R&D", kind: "rd", ...IN_("Noida", 28.5355, 77.3910, "Uttar Pradesh") },
    ],
    description: "A leading electronic-design-automation (EDA) company providing chip-design and verification software and IP.",
    technologies: ["EDA tools", "Silicon IP", "Verification"],
    products: ["Design and verification software", "IP cores"],
    research: ["AI-driven design automation"],
    relatedCompanies: ["cadence", "arm"],
    relatedConcepts: [
      { label: "RTL", slug: "rtl" },
      { label: "Synthesis", slug: "synthesis" },
      { label: "Verification", slug: "verification" },
    ],
    sources: [{ label: "synopsys.com", url: "https://www.synopsys.com" }],
    lastVerified: V,
  },
  {
    slug: "cadence",
    name: "Cadence",
    types: ["eda", "design-services"],
    website: "https://www.cadence.com",
    hq: { label: "HQ", kind: "hq", ...US("San Jose", 37.3382, -121.8863, "California") },
    sites: [{ label: "Noida R&D", kind: "rd", ...IN_("Noida", 28.5355, 77.3910, "Uttar Pradesh") }],
    description: "A leading EDA company providing tools for chip and system design, verification, and IP.",
    technologies: ["EDA tools", "IP", "System design"],
    products: ["Design and verification software", "IP"],
    research: ["Computational software for design"],
    relatedCompanies: ["synopsys", "arm"],
    relatedConcepts: [
      { label: "Place & route", slug: "place-and-route" },
      { label: "Physical design", slug: "physical-design" },
    ],
    sources: [{ label: "cadence.com", url: "https://www.cadence.com" }],
    lastVerified: V,
  },
  {
    slug: "arm",
    name: "Arm",
    types: ["design-services", "eda"],
    website: "https://www.arm.com",
    hq: { label: "HQ", kind: "hq", city: "Cambridge", country: "United Kingdom", countryCode: "GB", lat: 52.2053, long: 0.1218, precision: "city" },
    sites: [{ label: "Bengaluru R&D", kind: "rd", ...IN_("Bengaluru", 12.9716, 77.5946, "Karnataka") }],
    description: "A designer and licensor of processor architectures and IP cores used across most of the world's mobile devices.",
    technologies: ["CPU/GPU IP", "Instruction-set architecture", "SoC IP"],
    products: ["Processor IP", "Architecture licenses"],
    research: ["Energy-efficient processor architecture"],
    relatedCompanies: ["qualcomm", "synopsys"],
    relatedConcepts: [
      { label: "Architecture", slug: "architecture" },
      { label: "RTL", slug: "rtl" },
    ],
    sources: [{ label: "arm.com", url: "https://www.arm.com" }],
    lastVerified: V,
  },
  {
    slug: "globalfoundries",
    name: "GlobalFoundries",
    types: ["foundry"],
    website: "https://gf.com",
    hq: { label: "HQ", kind: "hq", ...US("Malta", 42.9865, -73.7887, "New York") },
    description: "A pure-play foundry focused on specialty and essential (non-leading-edge) process technologies.",
    technologies: ["Specialty processes (RF, power, embedded)", "Mature/essential nodes"],
    products: ["Foundry wafer manufacturing services"],
    processes: ["Lithography", "Etching", "Deposition"],
    research: ["Specialty process technologies"],
    relatedCompanies: ["tsmc", "samsung-semiconductor"],
    relatedProcesses: ["lithography", "etching", "deposition"],
    relatedTools: ["die-per-wafer", "wafer-yield"],
    relatedConcepts: [{ label: "Integrated circuit", slug: "integrated-circuit" }],
    sources: [{ label: "gf.com", url: "https://gf.com" }],
    lastVerified: V,
  },
  {
    slug: "texas-instruments",
    name: "Texas Instruments",
    types: ["idm"],
    website: "https://www.ti.com",
    hq: { label: "HQ", kind: "hq", ...US("Dallas", 32.7767, -96.7970, "Texas") },
    sites: [{ label: "Bengaluru R&D", kind: "rd", ...IN_("Bengaluru", 12.9716, 77.5946, "Karnataka") }],
    description: "An IDM focused on analog and embedded processing, designing and manufacturing its own chips.",
    technologies: ["Analog", "Embedded processing", "Power management"],
    products: ["Analog ICs", "Microcontrollers", "Power"],
    processes: ["Lithography", "Etching"],
    research: ["Analog and power technology"],
    relatedCompanies: ["infineon"],
    relatedProcesses: ["lithography", "packaging"],
    relatedTools: ["power-dissipation", "ohms-law"],
    relatedConcepts: [{ label: "MOSFET", slug: "mosfet" }],
    sources: [{ label: "ti.com", url: "https://www.ti.com" }],
    lastVerified: V,
  },
  {
    slug: "infineon",
    name: "Infineon Technologies",
    types: ["idm"],
    website: "https://www.infineon.com",
    hq: { label: "HQ", kind: "hq", city: "Neubiberg", country: "Germany", countryCode: "DE", lat: 48.0785, long: 11.6416, precision: "city" },
    sites: [{ label: "Bengaluru R&D", kind: "rd", ...IN_("Bengaluru", 12.9716, 77.5946, "Karnataka") }],
    description: "A German IDM focused on power semiconductors, automotive, and security, designing and manufacturing its own devices.",
    technologies: ["Power semiconductors", "Automotive", "Security ICs"],
    products: ["Power devices", "Microcontrollers", "Sensors"],
    processes: ["Deposition", "Etching"],
    research: ["Wide-bandgap power (SiC, GaN)"],
    relatedCompanies: ["texas-instruments"],
    relatedProcesses: ["deposition", "packaging"],
    relatedTools: ["power-dissipation", "junction-temperature"],
    relatedConcepts: [{ label: "MOSFET", slug: "mosfet" }],
    sources: [{ label: "infineon.com", url: "https://www.infineon.com" }],
    lastVerified: V,
  },
  {
    slug: "ase",
    name: "ASE Technology",
    types: ["osat", "atmp", "packaging", "testing"],
    website: "https://www.aseglobal.com",
    hq: { label: "HQ", kind: "hq", city: "Kaohsiung", country: "Taiwan", countryCode: "TW", lat: 22.6273, long: 120.3014, precision: "city" },
    description: "One of the largest outsourced semiconductor assembly and test (OSAT) providers — packaging and testing chips made by others.",
    technologies: ["Advanced packaging", "Flip-chip", "System-in-package", "Test"],
    products: ["Assembly and test services"],
    processes: ["Packaging", "Testing", "Dicing"],
    research: ["Advanced packaging and heterogeneous integration"],
    relatedCompanies: ["amkor"],
    relatedProcesses: ["packaging", "dicing", "final-test"],
    relatedTools: ["junction-temperature", "power-density"],
    relatedConcepts: [{ label: "Packaging", slug: "packaging" }, { label: "Flip-chip", slug: "flip-chip" }],
    sources: [{ label: "aseglobal.com", url: "https://www.aseglobal.com" }],
    lastVerified: V,
  },
  {
    slug: "amkor",
    name: "Amkor Technology",
    types: ["osat", "atmp", "packaging", "testing"],
    website: "https://www.amkor.com",
    hq: { label: "HQ", kind: "hq", ...US("Tempe", 33.4255, -111.9400, "Arizona") },
    description: "A major OSAT provider offering outsourced semiconductor packaging and test services worldwide.",
    technologies: ["Advanced packaging", "Wire-bond & flip-chip", "Test"],
    products: ["Assembly and test services"],
    processes: ["Packaging", "Testing"],
    research: ["Advanced packaging"],
    relatedCompanies: ["ase"],
    relatedProcesses: ["packaging", "final-test"],
    relatedTools: ["junction-temperature"],
    relatedConcepts: [{ label: "Advanced packaging", slug: "advanced-packaging" }],
    sources: [{ label: "amkor.com", url: "https://www.amkor.com" }],
    lastVerified: V,
  },
  {
    slug: "shin-etsu",
    name: "Shin-Etsu Chemical",
    types: ["materials", "silicon-wafers", "chemicals"],
    website: "https://www.shinetsu.co.jp",
    hq: { label: "HQ", kind: "hq", city: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.6762, long: 139.7503, precision: "city" },
    description: "A leading materials supplier and one of the largest producers of silicon wafers and photoresist materials for the industry.",
    technologies: ["Silicon wafers", "Photoresist materials", "Specialty chemicals"],
    products: ["Silicon wafers", "Materials"],
    processes: ["Ingot", "Wafer"],
    research: ["Advanced wafer and resist materials"],
    relatedProcesses: ["silicon", "ingot", "wafer", "photoresist"],
    relatedConcepts: [{ label: "Silicon", slug: "silicon" }, { label: "Wafer", slug: "wafer" }],
    sources: [{ label: "shinetsu.co.jp", url: "https://www.shinetsu.co.jp" }],
    lastVerified: V,
  },

  /* ---------------------- India-headquartered / India projects ---------------------- */
  {
    slug: "tata-electronics",
    name: "Tata Electronics",
    types: ["foundry", "osat", "atmp"],
    hq: { label: "HQ", kind: "hq", ...IN_("Mumbai", 19.0760, 72.8777, "Maharashtra") },
    sites: [
      { label: "Dholera fab", kind: "fab", ...IN_("Dholera", 22.2400, 72.1800, "Gujarat") },
      { label: "Jagiroad ATMP", kind: "atmp", ...IN_("Jagiroad", 26.0700, 92.1600, "Assam") },
    ],
    description:
      "The Tata Group's semiconductor arm. It has publicly announced India's first major commercial fab at Dholera, Gujarat (with Powerchip/PSMC as technology partner) and an assembly-and-test facility at Jagiroad, Assam.",
    technologies: ["Wafer fabrication (planned)", "Assembly & test (planned)"],
    products: ["Foundry and ATMP services (in development)"],
    research: ["Domestic fab and ATMP capability build-out"],
    relatedCompanies: ["micron", "cg-power"],
    relatedProcesses: ["wafer", "lithography", "packaging", "final-test"],
    relatedTools: ["die-per-wafer", "wafer-yield"],
    relatedConcepts: [{ label: "Wafer", slug: "wafer" }, { label: "Packaging", slug: "packaging" }],
    sources: [],
    lastVerified: V,
  },
  {
    slug: "cg-power",
    name: "CG Power and Industrial Solutions",
    types: ["osat", "atmp", "packaging"],
    hq: { label: "HQ", kind: "hq", ...IN_("Mumbai", 19.0760, 72.8777, "Maharashtra") },
    sites: [{ label: "Sanand OSAT", kind: "osat", ...IN_("Sanand", 22.9880, 72.3813, "Gujarat") }],
    description:
      "An Indian industrial and power company that, with partners (Renesas and Stars Microelectronics), has announced an OSAT / assembly-and-test facility at Sanand, Gujarat.",
    technologies: ["Assembly & test (planned)"],
    products: ["OSAT services (in development)"],
    research: ["Domestic packaging and test capability"],
    relatedCompanies: ["tata-electronics", "kaynes"],
    relatedProcesses: ["packaging", "final-test", "dicing"],
    relatedTools: ["junction-temperature"],
    relatedConcepts: [{ label: "Packaging", slug: "packaging" }],
    sources: [],
    lastVerified: V,
  },
  {
    slug: "kaynes",
    name: "Kaynes Technology",
    types: ["osat", "atmp", "packaging"],
    hq: { label: "HQ", kind: "hq", ...IN_("Mysuru", 12.2958, 76.6394, "Karnataka") },
    sites: [{ label: "Sanand OSAT", kind: "osat", ...IN_("Sanand", 22.9880, 72.3813, "Gujarat") }],
    description:
      "An Indian electronics-manufacturing company that has announced an OSAT / assembly-and-test facility at Sanand, Gujarat.",
    technologies: ["Assembly & test (planned)", "Electronics manufacturing"],
    products: ["OSAT services (in development)"],
    research: ["Domestic packaging and test capability"],
    relatedCompanies: ["cg-power", "tata-electronics"],
    relatedProcesses: ["packaging", "final-test"],
    relatedTools: ["junction-temperature"],
    relatedConcepts: [{ label: "Packaging", slug: "packaging" }],
    sources: [],
    lastVerified: V,
  },
  {
    slug: "hcltech",
    name: "HCLTech",
    types: ["design-services", "osat"],
    website: "https://www.hcltech.com",
    hq: { label: "HQ", kind: "hq", ...IN_("Noida", 28.5355, 77.3910, "Uttar Pradesh") },
    sites: [{ label: "Jewar OSAT (HCL–Foxconn JV)", kind: "osat", ...IN_("Jewar", 28.1200, 77.5600, "Uttar Pradesh") }],
    description:
      "An Indian IT and engineering-services company. The HCL Group, with Foxconn, has announced an OSAT / assembly-and-test facility near Jewar (YEIDA), Uttar Pradesh.",
    technologies: ["Semiconductor design services", "Assembly & test (planned)"],
    products: ["Engineering & design services", "OSAT (in development)"],
    research: ["Domestic packaging and design services"],
    relatedCompanies: ["tata-electronics"],
    relatedProcesses: ["packaging", "final-test"],
    relatedConcepts: [{ label: "Packaging", slug: "packaging" }],
    sources: [{ label: "hcltech.com", url: "https://www.hcltech.com" }],
    lastVerified: V,
  },
];

/* --------------------------------- Helpers --------------------------------- */

const BY_SLUG = new Map(COMPANIES.map((c) => [c.slug, c]));

export function getCompany(slug: string): Company | undefined {
  return BY_SLUG.get(slug);
}

/** All geographic points for a company (HQ first, then sites). */
export function companyPoints(c: Company): GeoPoint[] {
  return [c.hq, ...(c.sites ?? [])];
}

/** Distinct company types actually present, in the canonical order. */
export function presentTypes(): CompanyType[] {
  const present = new Set<CompanyType>();
  for (const c of COMPANIES) c.types.forEach((t) => present.add(t));
  const order: CompanyType[] = [
    "fabless", "foundry", "idm", "osat", "atmp", "eda", "equipment", "materials",
    "chemicals", "silicon-wafers", "packaging", "testing", "design-services",
    "research", "startup", "distributor",
  ];
  return order.filter((t) => present.has(t));
}

/** Distinct HQ countries, alphabetically. */
export function presentCountries(): string[] {
  return Array.from(new Set(COMPANIES.map((c) => c.hq.country))).sort();
}

/** Distinct technologies across all companies, alphabetically. */
export function presentTechnologies(): string[] {
  const set = new Set<string>();
  for (const c of COMPANIES) (c.technologies ?? []).forEach((t) => set.add(t));
  return Array.from(set).sort();
}

/** Companies whose types intersect the given set (for supply-chain stages). */
export function companiesForTypes(types: CompanyType[]): Company[] {
  const wanted = new Set(types);
  return COMPANIES.filter((c) => c.types.some((t) => wanted.has(t))).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

/** Companies that reference a given company as related (for back-links). */
export function relatedCompanyObjects(slug: string): Company[] {
  const c = BY_SLUG.get(slug);
  if (!c?.relatedCompanies) return [];
  return c.relatedCompanies
    .map((s) => BY_SLUG.get(s))
    .filter((x): x is Company => Boolean(x));
}
