/**
 * Concept registry — the node layer of Semitree's knowledge graph.
 *
 * Each concept has a short `summary` (its definition) and, for the core
 * concepts, a longer `explanation`. Concept↔concept edges live here
 * (`relatedConceptSlugs`); concept↔lesson, concept↔tool, and concept↔resource
 * edges are declared once on the OTHER side (lessons/tools/resources reference
 * concept slugs) and traversed in both directions by `graph.ts` — so no link is
 * duplicated across the data.
 */
import type { Concept } from "./types";

/** Broad grouping for filtering the glossary. */
export type GlossaryGroup =
  | "fundamentals"
  | "dimensionless-numbers"
  | "transport"
  | "droplets"
  | "fabrication";

export interface GlossaryTerm extends Concept {
  group: GlossaryGroup;
  /** Longer explanation (paragraphs) for the core concepts. */
  explanation?: string[];
  /** Neighbouring concept slugs (concept↔concept edges). */
  relatedConceptSlugs?: string[];
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "microfluidics",
    title: "Microfluidics",
    group: "fundamentals",
    summary:
      "The science and engineering of manipulating tiny volumes of fluid in micrometre-scale channels.",
    explanation: [
      "Microfluidics works with channels roughly 1–1000 µm across, handling microlitre-to-picolitre volumes. A whole laboratory protocol can be routed through a network of tiny channels on a single chip.",
      "Because surface and viscous forces dominate over inertia and gravity at this scale, fluids behave predictably (laminar flow) and new capabilities — droplets, capillary filling, precise gradients — become possible.",
    ],
    relatedConceptSlugs: ["laminar-flow", "lab-on-chip", "droplet-microfluidics"],
  },
  {
    slug: "lab-on-chip",
    title: "Lab-on-a-chip",
    group: "fundamentals",
    summary:
      "A device that integrates one or more laboratory functions onto a single microfluidic chip.",
    explanation: [
      "A lab-on-a-chip miniaturises and automates steps such as mixing, reaction, separation, and detection on a chip only centimetres across.",
      "It cuts sample and reagent use and enables portable, point-of-care testing outside central laboratories.",
    ],
    relatedConceptSlugs: ["microfluidics", "droplet-microfluidics"],
  },
  {
    slug: "laminar-flow",
    title: "Laminar flow",
    group: "fundamentals",
    summary:
      "Smooth, orderly flow in parallel layers with no cross-stream mixing. It is the norm at the microscale, where viscous forces dominate inertia.",
    explanation: [
      "Laminar flow moves in smooth, parallel layers with no cross-currents, so adjacent streams stay separate and follow paths set by the channel geometry.",
      "It arises whenever viscous forces dominate inertia — that is, at low Reynolds number — which is almost always the case in microchannels. The main consequence is that mixing happens only by diffusion.",
    ],
    relatedConceptSlugs: ["reynolds-number", "diffusion", "microfluidics"],
  },
  {
    slug: "reynolds-number",
    title: "Reynolds number (Re)",
    group: "dimensionless-numbers",
    summary:
      "The dimensionless ratio of inertial to viscous forces, Re = ρvDₕ/μ. Low Re (≪2000) means laminar flow; microchannels almost always sit here.",
    explanation: [
      "The Reynolds number Re = ρvDₕ/μ is the ratio of inertial to viscous forces. Low Re means viscosity dominates and flow is laminar; high Re means inertia dominates and turbulence can appear.",
      "Microchannels have small length scales and modest velocities, so Re is usually far below the ~2000 pipe-flow transition — a quick calculation confirms you are in the laminar regime.",
    ],
    relatedConceptSlugs: ["laminar-flow", "hydraulic-diameter"],
  },
  {
    slug: "hydraulic-diameter",
    title: "Hydraulic diameter (Dₕ)",
    group: "fundamentals",
    summary:
      "An effective diameter for non-circular channels, Dₕ = 4A/P (for a rectangle, 2wh/(w+h)). It lets circular-pipe formulas apply to other shapes.",
    explanation: [
      "The hydraulic diameter Dₕ = 4·Area/Perimeter (for a rectangle, 2wh/(w+h)) reduces a non-circular cross-section to a single equivalent length scale.",
      "It lets you apply circular-pipe formulas — Reynolds number, resistance, pressure drop — to rectangular microchannels.",
    ],
    relatedConceptSlugs: ["reynolds-number", "flow-resistance"],
  },
  {
    slug: "pressure-drop",
    title: "Pressure drop (ΔP)",
    group: "fundamentals",
    summary:
      "The pressure difference needed to drive a flow through a channel. For laminar flow it is linear in flow rate (Hagen–Poiseuille).",
    explanation: [
      "The pressure drop ΔP is the pressure a pump must supply to push a given flow rate through a channel against its hydraulic resistance.",
      "For laminar flow in a circular channel it follows Hagen–Poiseuille, ΔP = 128µLQ/(πD⁴); the strong 1/D⁴ dependence means small channels demand large pressures.",
    ],
    relatedConceptSlugs: ["flow-resistance", "hydraulic-diameter"],
  },
  {
    slug: "flow-resistance",
    title: "Hydraulic resistance (R)",
    group: "fundamentals",
    summary:
      "A channel's resistance to flow, R = ΔP/Q. Channels combine in series and parallel exactly like electrical resistors.",
    explanation: [
      "Hydraulic resistance R = ΔP/Q measures how strongly a channel opposes flow — exactly analogous to electrical resistance.",
      "Resistances add in series and combine reciprocally in parallel, so a whole chip can be analysed as a circuit (the hydraulic–electrical analogy).",
    ],
    relatedConceptSlugs: ["pressure-drop", "hydraulic-electrical-analogy"],
  },
  {
    slug: "hydraulic-electrical-analogy",
    title: "Hydraulic–electrical analogy",
    group: "fundamentals",
    summary:
      "A modelling shortcut mapping pressure↔voltage, flow rate↔current, and hydraulic resistance↔resistance, so a chip can be analysed as a circuit.",
    relatedConceptSlugs: ["flow-resistance", "pressure-drop"],
  },
  {
    slug: "diffusion",
    title: "Diffusion",
    group: "transport",
    summary:
      "Spreading of molecules driven by concentration gradients. Mixing time scales as t ≈ L²/2D, so it is slow across wide channels.",
    explanation: [
      "Diffusion is the spreading of molecules by random thermal motion, from high toward low concentration. Without turbulence it is the only mixing mechanism in laminar microflows.",
      "The characteristic time to diffuse a distance L is t ≈ L²/(2D); the square dependence is why mixing across wide channels is slow and why folded mixers are used.",
    ],
    relatedConceptSlugs: ["laminar-flow", "peclet-number"],
  },
  {
    slug: "peclet-number",
    title: "Péclet number (Pe)",
    group: "dimensionless-numbers",
    summary:
      "The ratio of advective to diffusive transport, Pe = vL/D. High Pe means flow carries species faster than diffusion can mix them.",
    relatedConceptSlugs: ["diffusion", "reynolds-number"],
  },
  {
    slug: "capillary-number",
    title: "Capillary number (Ca)",
    group: "dimensionless-numbers",
    summary:
      "The ratio of viscous to interfacial forces, Ca = μv/γ. It governs droplet formation regimes in two-phase microfluidics.",
    relatedConceptSlugs: ["surface-tension", "droplet-microfluidics"],
  },
  {
    slug: "weber-number",
    title: "Weber number (We)",
    group: "dimensionless-numbers",
    summary:
      "The ratio of inertial to interfacial forces. It helps predict droplet breakup and jetting behaviour.",
    relatedConceptSlugs: ["surface-tension", "droplet-microfluidics"],
  },
  {
    slug: "bond-number",
    title: "Bond number (Bo)",
    group: "dimensionless-numbers",
    summary:
      "The ratio of gravitational to interfacial forces. At the microscale Bo is tiny, so surface tension dominates gravity.",
    relatedConceptSlugs: ["surface-tension"],
  },
  {
    slug: "surface-tension",
    title: "Surface tension (γ)",
    group: "fundamentals",
    summary:
      "The energy per unit area of a liquid interface. It dominates microscale behaviour, driving capillary filling and droplet formation.",
    explanation: [
      "Surface tension γ is the energy per unit area of a liquid interface; it acts to minimise interfacial area.",
      "At the microscale it dominates gravity, driving capillary filling of channels and holding droplets together — the basis of droplet microfluidics and paper devices.",
    ],
    relatedConceptSlugs: ["droplet-microfluidics", "wetting"],
  },
  {
    slug: "wetting",
    title: "Wetting & contact angle",
    group: "fundamentals",
    summary:
      "How a liquid spreads on a surface, quantified by the contact angle. It sets whether channels fill spontaneously and how droplets behave.",
    relatedConceptSlugs: ["surface-tension"],
  },
  {
    slug: "stokes-einstein",
    title: "Stokes–Einstein relation",
    group: "transport",
    summary:
      "Estimates a particle's diffusion coefficient, D = k_BT/(6πμr), linking diffusion to temperature, viscosity, and particle size.",
    relatedConceptSlugs: ["diffusion"],
  },
  {
    slug: "droplet-microfluidics",
    title: "Droplet microfluidics",
    group: "droplets",
    summary:
      "Generating and manipulating discrete droplets in an immiscible carrier, each a tiny isolated reactor — the basis of single-cell workflows.",
    explanation: [
      "Droplet microfluidics generates and manipulates discrete droplets of one fluid inside an immiscible carrier, each droplet acting as an isolated picolitre reactor.",
      "It underpins high-throughput assays and single-cell techniques, where cell encapsulation follows Poisson statistics.",
    ],
    relatedConceptSlugs: ["poisson-loading", "surface-tension", "t-junction"],
  },
  {
    slug: "t-junction",
    title: "T-junction",
    group: "droplets",
    summary:
      "A droplet generator where the dispersed phase meets the continuous phase at a right angle; droplet size is set by the flow-rate ratio.",
    relatedConceptSlugs: ["droplet-microfluidics", "flow-focusing"],
  },
  {
    slug: "flow-focusing",
    title: "Flow-focusing",
    group: "droplets",
    summary:
      "A droplet generator where a central stream is pinched by two side streams through a narrow orifice, giving fine control of droplet size.",
    relatedConceptSlugs: ["droplet-microfluidics", "t-junction"],
  },
  {
    slug: "poisson-loading",
    title: "Poisson loading",
    group: "droplets",
    summary:
      "Cell encapsulation follows Poisson statistics, P(k)=λᵏe⁻λ/k!. To keep doublets rare, most droplets must be empty (low λ).",
    relatedConceptSlugs: ["droplet-microfluidics"],
  },
  {
    slug: "newtonian-fluid",
    title: "Newtonian fluid",
    group: "fundamentals",
    summary:
      "A fluid whose viscosity is constant regardless of shear rate (e.g. water). Most microfluidics formulas assume Newtonian behaviour.",
    relatedConceptSlugs: ["flow-resistance"],
  },
  {
    slug: "pdms",
    title: "PDMS",
    group: "fabrication",
    summary:
      "Polydimethylsiloxane — the workhorse elastomer for soft lithography: transparent, gas-permeable, and easy to mould and bond.",
    explanation: [
      "Polydimethylsiloxane (PDMS) is a transparent, flexible, gas-permeable silicone elastomer.",
      "It is cast against a micro-patterned mould (soft lithography) to replicate channels quickly and cheaply, making it the workhorse material for research prototypes.",
    ],
    relatedConceptSlugs: ["soft-lithography"],
  },
  {
    slug: "soft-lithography",
    title: "Soft lithography",
    group: "fabrication",
    summary:
      "Casting an elastomer (usually PDMS) against a micro-patterned mould to replicate channels — the most common rapid-prototyping route.",
    relatedConceptSlugs: ["pdms"],
  },
];

const BY_SLUG = new Map(GLOSSARY.map((c) => [c.slug, c]));

export function getConcept(slug: string): GlossaryTerm | undefined {
  return BY_SLUG.get(slug);
}

export function conceptTitle(slug: string): string {
  return BY_SLUG.get(slug)?.title ?? slug;
}

export function hasConcept(slug: string): boolean {
  return BY_SLUG.has(slug);
}
