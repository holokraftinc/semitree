import type { LessonVisualKey } from "@/lib/knowledge/semi-lessons";

/**
 * Small built-in SVG diagrams for flagship lessons. Theme-aware via currentColor
 * and Tailwind fill/stroke classes. Returns null for unknown keys (the caller
 * falls back to the textual visual description).
 */
export function LessonDiagram({ visualKey }: { visualKey: LessonVisualKey }) {
  const common = "mx-auto h-auto w-full max-w-md";
  if (visualKey === "energy-bands") {
    return (
      <svg viewBox="0 0 320 180" className={common} role="img" aria-label="Valence band below the conduction band, separated by the bandgap Eg.">
        <rect x="40" y="30" width="240" height="34" rx="3" className="fill-brand/20 stroke-brand" strokeWidth="1.5" />
        <text x="160" y="52" textAnchor="middle" className="fill-foreground text-[11px]">Conduction band (empty)</text>
        <rect x="40" y="116" width="240" height="34" rx="3" className="fill-muted stroke-border" strokeWidth="1.5" />
        <text x="160" y="138" textAnchor="middle" className="fill-foreground text-[11px]">Valence band (filled)</text>
        <line x1="300" y1="64" x2="300" y2="116" className="stroke-foreground" strokeWidth="1" />
        <text x="290" y="94" textAnchor="end" className="fill-muted-foreground text-[11px]">Eg</text>
      </svg>
    );
  }
  if (visualKey === "pn-junction") {
    return (
      <svg viewBox="0 0 320 160" className={common} role="img" aria-label="A p-type region and n-type region meeting at a depletion zone with an internal field.">
        <rect x="20" y="50" width="120" height="60" className="fill-warning/15 stroke-border" strokeWidth="1.5" />
        <text x="80" y="85" textAnchor="middle" className="fill-foreground text-[12px]">p-type</text>
        <rect x="180" y="50" width="120" height="60" className="fill-info/15 stroke-border" strokeWidth="1.5" />
        <text x="240" y="85" textAnchor="middle" className="fill-foreground text-[12px]">n-type</text>
        <rect x="140" y="50" width="40" height="60" className="fill-muted stroke-border" strokeWidth="1.5" />
        <text x="160" y="132" textAnchor="middle" className="fill-muted-foreground text-[10px]">depletion</text>
        <line x1="150" y1="80" x2="170" y2="80" className="stroke-foreground" strokeWidth="1.5" markerEnd="url(#ar)" />
        <defs><marker id="ar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" className="fill-foreground" /></marker></defs>
      </svg>
    );
  }
  if (visualKey === "mosfet") {
    return (
      <svg viewBox="0 0 320 170" className={common} role="img" aria-label="MOSFET cross-section: gate over a thin oxide, source and drain either side, channel beneath the gate.">
        <rect x="20" y="90" width="280" height="60" className="fill-muted stroke-border" strokeWidth="1.5" />
        <text x="30" y="130" className="fill-muted-foreground text-[10px]">body</text>
        <rect x="40" y="70" width="60" height="20" className="fill-info/20 stroke-border" strokeWidth="1.2" />
        <text x="70" y="84" textAnchor="middle" className="fill-foreground text-[10px]">source</text>
        <rect x="220" y="70" width="60" height="20" className="fill-info/20 stroke-border" strokeWidth="1.2" />
        <text x="250" y="84" textAnchor="middle" className="fill-foreground text-[10px]">drain</text>
        <rect x="110" y="64" width="100" height="6" className="fill-warning/40 stroke-border" strokeWidth="0.8" />
        <rect x="120" y="44" width="80" height="20" className="fill-brand/30 stroke-brand" strokeWidth="1.2" />
        <text x="160" y="58" textAnchor="middle" className="fill-foreground text-[10px]">gate</text>
        <text x="160" y="86" textAnchor="middle" className="fill-muted-foreground text-[9px]">channel</text>
      </svg>
    );
  }
  if (visualKey === "wafer-flow") {
    return (
      <svg viewBox="0 0 340 120" className={common} role="img" aria-label="Ingot sliced into wafers, then a single polished wafer of many dies.">
        <rect x="20" y="40" width="70" height="40" rx="20" className="fill-muted stroke-border" strokeWidth="1.5" />
        <text x="55" y="98" textAnchor="middle" className="fill-muted-foreground text-[10px]">ingot</text>
        <path d="M110 60 L150 60" className="stroke-foreground" strokeWidth="1.5" markerEnd="url(#a2)" />
        <circle cx="210" cy="60" r="34" className="fill-brand/10 stroke-brand" strokeWidth="1.5" />
        {[...Array(4)].map((_, i) => (
          <line key={`v${i}`} x1={186 + i * 16} y1="30" x2={186 + i * 16} y2="90" className="stroke-brand/40" strokeWidth="0.8" />
        ))}
        {[...Array(4)].map((_, i) => (
          <line key={`h${i}`} x1="178" y1={38 + i * 15} x2="242" y2={38 + i * 15} className="stroke-brand/40" strokeWidth="0.8" />
        ))}
        <text x="210" y="110" textAnchor="middle" className="fill-muted-foreground text-[10px]">wafer of dies</text>
        <defs><marker id="a2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" className="fill-foreground" /></marker></defs>
      </svg>
    );
  }
  if (visualKey === "doping") {
    return (
      <svg viewBox="0 0 340 170" className={common} role="img" aria-label="n-type doping: a phosphorus atom in the silicon lattice donates a free electron. p-type doping: a boron atom creates a hole.">
        {/* n-type panel */}
        <rect x="14" y="30" width="150" height="112" rx="4" className="fill-info/10 stroke-border" strokeWidth="1.2" />
        <text x="89" y="24" textAnchor="middle" className="fill-foreground text-[11px]">n-type (donor)</text>
        {[...Array(9)].map((_, i) => (
          <circle key={`nsi${i}`} cx={44 + (i % 3) * 40} cy={58 + Math.floor(i / 3) * 30} r="3" className="fill-muted-foreground/50" />
        ))}
        <circle cx="84" cy="88" r="9" className="fill-brand/30 stroke-brand" strokeWidth="1.2" />
        <text x="84" y="91" textAnchor="middle" className="fill-foreground text-[8px]">P</text>
        <circle cx="126" cy="70" r="4" className="fill-brand" />
        <text x="126" y="60" textAnchor="middle" className="fill-muted-foreground text-[8px]">free e⁻</text>
        {/* p-type panel */}
        <rect x="176" y="30" width="150" height="112" rx="4" className="fill-warning/10 stroke-border" strokeWidth="1.2" />
        <text x="251" y="24" textAnchor="middle" className="fill-foreground text-[11px]">p-type (acceptor)</text>
        {[...Array(9)].map((_, i) => (
          <circle key={`psi${i}`} cx={206 + (i % 3) * 40} cy={58 + Math.floor(i / 3) * 30} r="3" className="fill-muted-foreground/50" />
        ))}
        <circle cx="246" cy="88" r="9" className="fill-warning/40 stroke-border" strokeWidth="1.2" />
        <text x="246" y="91" textAnchor="middle" className="fill-foreground text-[8px]">B</text>
        <circle cx="288" cy="70" r="4" className="fill-none stroke-foreground" strokeWidth="1.2" />
        <text x="288" y="60" textAnchor="middle" className="fill-muted-foreground text-[8px]">hole</text>
      </svg>
    );
  }
  if (visualKey === "cmos") {
    return (
      <svg viewBox="0 0 300 200" className={common} role="img" aria-label="CMOS inverter: a PMOS transistor connects the output to the supply and an NMOS transistor connects it to ground; both gates are tied to the input.">
        <line x1="70" y1="26" x2="230" y2="26" className="stroke-foreground" strokeWidth="1.5" />
        <text x="150" y="18" textAnchor="middle" className="fill-muted-foreground text-[10px]">V_DD</text>
        <line x1="70" y1="174" x2="230" y2="174" className="stroke-foreground" strokeWidth="1.5" />
        <text x="150" y="190" textAnchor="middle" className="fill-muted-foreground text-[10px]">GND</text>
        <rect x="120" y="44" width="60" height="46" rx="3" className="fill-warning/15 stroke-border" strokeWidth="1.3" />
        <text x="150" y="71" textAnchor="middle" className="fill-foreground text-[11px]">PMOS</text>
        <rect x="120" y="110" width="60" height="46" rx="3" className="fill-info/15 stroke-border" strokeWidth="1.3" />
        <text x="150" y="137" textAnchor="middle" className="fill-foreground text-[11px]">NMOS</text>
        <line x1="150" y1="26" x2="150" y2="44" className="stroke-foreground" strokeWidth="1.3" />
        <line x1="150" y1="90" x2="150" y2="110" className="stroke-foreground" strokeWidth="1.3" />
        <line x1="150" y1="156" x2="150" y2="174" className="stroke-foreground" strokeWidth="1.3" />
        <line x1="40" y1="100" x2="118" y2="100" className="stroke-brand" strokeWidth="1.3" />
        <text x="34" y="103" textAnchor="end" className="fill-foreground text-[10px]">in</text>
        <line x1="118" y1="67" x2="118" y2="133" className="stroke-brand/70" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="150" y1="100" x2="262" y2="100" className="stroke-foreground" strokeWidth="1.3" />
        <circle cx="150" cy="100" r="2.5" className="fill-foreground" />
        <text x="268" y="103" className="fill-foreground text-[10px]">out</text>
      </svg>
    );
  }
  if (visualKey === "wafer-to-package") {
    return (
      <svg viewBox="0 0 360 120" className={common} role="img" aria-label="A wafer of many dies; one die singulated from it; then that die mounted and sealed inside a package with solder balls underneath.">
        <circle cx="52" cy="52" r="32" className="fill-brand/10 stroke-brand" strokeWidth="1.5" />
        {[...Array(3)].map((_, i) => (
          <line key={`wv${i}`} x1={36 + i * 16} y1="24" x2={36 + i * 16} y2="80" className="stroke-brand/40" strokeWidth="0.8" />
        ))}
        {[...Array(3)].map((_, i) => (
          <line key={`wh${i}`} x1="24" y1={36 + i * 16} x2="80" y2={36 + i * 16} className="stroke-brand/40" strokeWidth="0.8" />
        ))}
        <text x="52" y="104" textAnchor="middle" className="fill-muted-foreground text-[10px]">wafer of dies</text>
        <path d="M96 52 L128 52" className="stroke-foreground" strokeWidth="1.4" markerEnd="url(#wp)" />
        <rect x="140" y="38" width="28" height="28" className="fill-brand/20 stroke-brand" strokeWidth="1.3" />
        <text x="154" y="104" textAnchor="middle" className="fill-muted-foreground text-[10px]">die</text>
        <path d="M180 52 L212 52" className="stroke-foreground" strokeWidth="1.4" markerEnd="url(#wp)" />
        <rect x="236" y="32" width="92" height="44" rx="3" className="fill-muted stroke-border" strokeWidth="1.4" />
        <rect x="268" y="44" width="28" height="20" className="fill-brand/20 stroke-brand" strokeWidth="1" />
        {[...Array(4)].map((_, i) => (
          <circle key={`bl${i}`} cx={252 + i * 20} cy="82" r="3.5" className="fill-foreground/70" />
        ))}
        <text x="282" y="104" textAnchor="middle" className="fill-muted-foreground text-[10px]">package</text>
        <defs><marker id="wp" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" className="fill-foreground" /></marker></defs>
      </svg>
    );
  }
  if (visualKey === "wire-bonding") {
    return (
      <svg viewBox="0 0 320 160" className={common} role="img" aria-label="A die sitting on a substrate, with fine bond wires arcing from the die's edge pads out to the package leads on each side.">
        <rect x="30" y="110" width="260" height="20" className="fill-muted stroke-border" strokeWidth="1.4" />
        <text x="160" y="146" textAnchor="middle" className="fill-muted-foreground text-[10px]">substrate / leadframe</text>
        <rect x="120" y="80" width="80" height="30" className="fill-brand/20 stroke-brand" strokeWidth="1.3" />
        <text x="160" y="99" textAnchor="middle" className="fill-foreground text-[10px]">die</text>
        <rect x="40" y="104" width="26" height="10" className="fill-info/30 stroke-border" strokeWidth="1" />
        <rect x="254" y="104" width="26" height="10" className="fill-info/30 stroke-border" strokeWidth="1" />
        <path d="M126 82 Q96 50 60 104" className="fill-none stroke-foreground" strokeWidth="1.2" />
        <path d="M140 82 Q108 60 66 104" className="fill-none stroke-foreground" strokeWidth="1.2" />
        <path d="M194 82 Q224 50 260 104" className="fill-none stroke-foreground" strokeWidth="1.2" />
        <path d="M180 82 Q212 60 254 104" className="fill-none stroke-foreground" strokeWidth="1.2" />
        <text x="53" y="128" textAnchor="middle" className="fill-muted-foreground text-[9px]">lead</text>
        <text x="267" y="128" textAnchor="middle" className="fill-muted-foreground text-[9px]">lead</text>
        <text x="230" y="46" textAnchor="middle" className="fill-muted-foreground text-[9px]">bond wires</text>
      </svg>
    );
  }
  if (visualKey === "flip-chip") {
    return (
      <svg viewBox="0 0 320 160" className={common} role="img" aria-label="A die flipped face-down and joined to the substrate by a row of solder bumps, with underfill between them and solder balls under the substrate.">
        <rect x="60" y="44" width="200" height="30" className="fill-brand/20 stroke-brand" strokeWidth="1.3" />
        <text x="160" y="63" textAnchor="middle" className="fill-foreground text-[10px]">die (face-down)</text>
        {[...Array(7)].map((_, i) => (
          <circle key={`bump${i}`} cx={80 + i * 27} cy="84" r="5" className="fill-warning/70 stroke-border" strokeWidth="0.8" />
        ))}
        <text x="288" y="87" textAnchor="middle" className="fill-muted-foreground text-[9px]">bumps</text>
        <rect x="60" y="94" width="200" height="22" className="fill-muted stroke-border" strokeWidth="1.4" />
        <text x="160" y="109" textAnchor="middle" className="fill-muted-foreground text-[10px]">substrate</text>
        <text x="160" y="80" textAnchor="middle" className="fill-muted-foreground text-[8px]">underfill</text>
        {[...Array(6)].map((_, i) => (
          <circle key={`fb${i}`} cx={82 + i * 32} cy="126" r="4" className="fill-foreground/70" />
        ))}
      </svg>
    );
  }
  if (visualKey === "2-5d") {
    return (
      <svg viewBox="0 0 320 150" className={common} role="img" aria-label="Two dies placed side by side on a silicon interposer, which carries dense wiring between them and sits on the package substrate.">
        <rect x="60" y="40" width="80" height="30" className="fill-brand/20 stroke-brand" strokeWidth="1.3" />
        <text x="100" y="59" textAnchor="middle" className="fill-foreground text-[10px]">logic die</text>
        <rect x="180" y="40" width="80" height="30" className="fill-info/20 stroke-border" strokeWidth="1.3" />
        <text x="220" y="59" textAnchor="middle" className="fill-foreground text-[10px]">HBM</text>
        <rect x="44" y="74" width="232" height="20" className="fill-brand/10 stroke-brand" strokeWidth="1.3" />
        <text x="160" y="88" textAnchor="middle" className="fill-foreground text-[9px]">silicon interposer</text>
        {[...Array(9)].map((_, i) => (
          <line key={`ip${i}`} x1={120 + i * 10} y1="74" x2={120 + i * 10} y2="94" className="stroke-brand/40" strokeWidth="0.7" />
        ))}
        <rect x="44" y="98" width="232" height="20" className="fill-muted stroke-border" strokeWidth="1.4" />
        <text x="160" y="112" textAnchor="middle" className="fill-muted-foreground text-[9px]">substrate</text>
        {[...Array(6)].map((_, i) => (
          <circle key={`b25${i}`} cx={70 + i * 36} cy="128" r="4" className="fill-foreground/70" />
        ))}
      </svg>
    );
  }
  if (visualKey === "3d-ic") {
    return (
      <svg viewBox="0 0 320 160" className={common} role="img" aria-label="Two dies stacked vertically and connected top-to-bottom by through-silicon vias, mounted on a substrate.">
        <rect x="110" y="34" width="100" height="26" className="fill-info/20 stroke-border" strokeWidth="1.3" />
        <text x="160" y="51" textAnchor="middle" className="fill-foreground text-[10px]">die 2</text>
        <rect x="110" y="64" width="100" height="26" className="fill-brand/20 stroke-brand" strokeWidth="1.3" />
        <text x="160" y="81" textAnchor="middle" className="fill-foreground text-[10px]">die 1</text>
        {[...Array(4)].map((_, i) => (
          <line key={`tsv${i}`} x1={130 + i * 20} y1="34" x2={130 + i * 20} y2="90" className="stroke-warning" strokeWidth="1.4" />
        ))}
        <text x="248" y="64" textAnchor="middle" className="fill-muted-foreground text-[9px]">TSVs</text>
        <rect x="90" y="94" width="140" height="20" className="fill-muted stroke-border" strokeWidth="1.4" />
        <text x="160" y="108" textAnchor="middle" className="fill-muted-foreground text-[9px]">substrate</text>
        {[...Array(5)].map((_, i) => (
          <circle key={`b3d${i}`} cx={108 + i * 26} cy="126" r="4" className="fill-foreground/70" />
        ))}
      </svg>
    );
  }
  if (visualKey === "chiplets") {
    return (
      <svg viewBox="0 0 320 150" className={common} role="img" aria-label="Several chiplets — for example CPU cores, an I/O die and a memory die — placed on a shared substrate and linked by short die-to-die connections.">
        <rect x="30" y="44" width="60" height="34" className="fill-brand/20 stroke-brand" strokeWidth="1.2" />
        <text x="60" y="65" textAnchor="middle" className="fill-foreground text-[10px]">Core</text>
        <rect x="110" y="44" width="60" height="34" className="fill-brand/20 stroke-brand" strokeWidth="1.2" />
        <text x="140" y="65" textAnchor="middle" className="fill-foreground text-[10px]">Core</text>
        <rect x="190" y="44" width="45" height="34" className="fill-info/20 stroke-border" strokeWidth="1.2" />
        <text x="212" y="65" textAnchor="middle" className="fill-foreground text-[9px]">I/O</text>
        <rect x="250" y="44" width="45" height="34" className="fill-info/20 stroke-border" strokeWidth="1.2" />
        <text x="272" y="65" textAnchor="middle" className="fill-foreground text-[9px]">Mem</text>
        <line x1="90" y1="61" x2="110" y2="61" className="stroke-warning" strokeWidth="1.4" />
        <line x1="170" y1="61" x2="190" y2="61" className="stroke-warning" strokeWidth="1.4" />
        <line x1="235" y1="61" x2="250" y2="61" className="stroke-warning" strokeWidth="1.4" />
        <text x="130" y="34" textAnchor="middle" className="fill-muted-foreground text-[8px]">die-to-die links</text>
        <rect x="20" y="82" width="285" height="22" className="fill-muted stroke-border" strokeWidth="1.4" />
        <text x="162" y="97" textAnchor="middle" className="fill-muted-foreground text-[9px]">shared substrate / interposer</text>
        {[...Array(7)].map((_, i) => (
          <circle key={`bc${i}`} cx={45 + i * 40} cy="116" r="4" className="fill-foreground/70" />
        ))}
      </svg>
    );
  }
  return null;
}
