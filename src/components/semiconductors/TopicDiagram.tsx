import type { TopicDiagramKey } from "@/lib/knowledge/equipment-topics";

/**
 * Small built-in schematic diagrams for equipment and material topics. Inline
 * SVG, theme-aware via Tailwind fill/stroke tokens, labeled, responsive
 * (viewBox + w-full). Each is technically accurate and answers one question;
 * unknown keys return null so the page simply shows no diagram.
 */

const wide = "mx-auto h-auto w-full max-w-xl";
const mid = "mx-auto h-auto w-full max-w-md";
const narrow = "mx-auto h-auto w-full max-w-xs";

function Arrow({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
        <path d="M0 0L6 3L0 6z" className="fill-foreground" />
      </marker>
    </defs>
  );
}

export function TopicDiagram({ diagramKey }: { diagramKey: TopicDiagramKey }) {
  switch (diagramKey) {
    case "litho-system":
      return (
        <svg viewBox="0 0 300 250" className={mid} role="img" aria-label="A lithography system: light passes through a full-size mask, projection optics demagnify the pattern, and a smaller image is printed into the resist on the wafer.">
          <rect x="90" y="12" width="120" height="26" rx="4" className="fill-brand/30 stroke-brand" strokeWidth="1.4" />
          <text x="150" y="29" textAnchor="middle" className="fill-foreground text-[11px]">Light source (DUV / EUV)</text>
          <line x1="150" y1="38" x2="150" y2="56" className="stroke-foreground" strokeWidth="1.4" markerEnd="url(#ls-a)" />
          <rect x="45" y="58" width="210" height="26" rx="3" className="fill-info/15 stroke-border" strokeWidth="1.4" />
          <text x="150" y="75" textAnchor="middle" className="fill-foreground text-[11px]">Mask / reticle (full-size pattern)</text>
          <line x1="150" y1="84" x2="150" y2="104" className="stroke-foreground" strokeWidth="1.4" markerEnd="url(#ls-a)" />
          <ellipse cx="150" cy="120" rx="82" ry="14" className="fill-muted stroke-border" strokeWidth="1.4" />
          <text x="150" y="124" textAnchor="middle" className="fill-foreground text-[11px]">Projection optics — demagnify</text>
          <line x1="112" y1="134" x2="128" y2="186" className="stroke-brand/50" strokeWidth="1" />
          <line x1="188" y1="134" x2="172" y2="186" className="stroke-brand/50" strokeWidth="1" />
          <rect x="80" y="188" width="140" height="16" className="fill-muted stroke-border" strokeWidth="1.4" />
          <rect x="122" y="188" width="56" height="16" className="fill-brand/25 stroke-brand" strokeWidth="1" />
          <text x="150" y="224" textAnchor="middle" className="fill-foreground text-[11px]">Wafer + resist (smaller image)</text>
          <text x="150" y="240" textAnchor="middle" className="fill-muted-foreground text-[9px]">the pattern shrinks from mask to wafer</text>
          <Arrow id="ls-a" />
        </svg>
      );

    case "litho-flow":
      return (
        <svg viewBox="0 0 380 150" className={wide} role="img" aria-label="Four lithography steps: coat resist over a film on the wafer; expose it to light through a mask; develop to open the resist; then transfer the pattern into the film by etching and strip the resist.">
          {[
            { x: 8, label: "1 · Coat" },
            { x: 100, label: "2 · Expose" },
            { x: 192, label: "3 · Develop" },
            { x: 284, label: "4 · Transfer" },
          ].map((s, i) => (
            <g key={i}>
              {/* wafer + film base */}
              <rect x={s.x} y={96} width={80} height={16} className="fill-muted stroke-border" strokeWidth="1.1" />
              {i < 3 ? (
                <rect x={s.x} y={82} width={80} height={14} className="fill-info/20 stroke-border" strokeWidth="1.1" />
              ) : (
                <>
                  <rect x={s.x} y={82} width={30} height={14} className="fill-info/20 stroke-border" strokeWidth="1.1" />
                  <rect x={s.x + 50} y={82} width={30} height={14} className="fill-info/20 stroke-border" strokeWidth="1.1" />
                </>
              )}
              <text x={s.x + 40} y={130} textAnchor="middle" className="fill-foreground text-[10px]">{s.label}</text>
            </g>
          ))}
          {/* 1 Coat: full resist */}
          <rect x={8} y={70} width={80} height={12} className="fill-brand/30 stroke-brand" strokeWidth="1" />
          {/* 2 Expose: full resist + light + mask opening */}
          <rect x={100} y={70} width={80} height={12} className="fill-brand/30 stroke-brand" strokeWidth="1" />
          <rect x={100} y={48} width={30} height={8} className="fill-foreground/70" />
          <rect x={150} y={48} width={30} height={8} className="fill-foreground/70" />
          <line x1={140} y1={44} x2={140} y2={68} className="stroke-brand" strokeWidth="1.2" markerEnd="url(#lf-a)" />
          {/* 3 Develop: resist opened */}
          <rect x={192} y={70} width={30} height={12} className="fill-brand/30 stroke-brand" strokeWidth="1" />
          <rect x={242} y={70} width={30} height={12} className="fill-brand/30 stroke-brand" strokeWidth="1" />
          {/* 4 Transfer: film etched in the gap, resist gone */}
          <rect x={314} y={82} width={20} height={30} className="fill-muted stroke-border" strokeDasharray="2 2" strokeWidth="1" />
          <text x={324} y={64} textAnchor="middle" className="fill-muted-foreground text-[8px]">etched</text>
          <Arrow id="lf-a" />
        </svg>
      );

    case "deposition-film":
      return (
        <svg viewBox="0 0 320 170" className={mid} role="img" aria-label="Deposition: source atoms or precursor molecules arrive at the wafer surface and build up a thin film on top of it.">
          <text x="160" y="20" textAnchor="middle" className="fill-foreground text-[11px]">Precursor / source atoms arrive</text>
          {[60, 110, 160, 210, 260].map((x, i) => (
            <line key={i} x1={x} y1={28} x2={x} y2={92} className="stroke-brand/60" strokeWidth="1.2" markerEnd="url(#dp-a)" />
          ))}
          {[80, 130, 180, 230].map((x, i) => (
            <circle key={i} cx={x} cy={50 + (i % 2) * 14} r="3" className="fill-brand" />
          ))}
          <rect x="40" y="96" width="240" height="18" className="fill-brand/25 stroke-brand" strokeWidth="1.3" />
          <text x="160" y="109" textAnchor="middle" className="fill-foreground text-[10px]">deposited film</text>
          <rect x="40" y="114" width="240" height="30" className="fill-muted stroke-border" strokeWidth="1.3" />
          <text x="160" y="133" textAnchor="middle" className="fill-muted-foreground text-[10px]">wafer</text>
          <text x="160" y="162" textAnchor="middle" className="fill-muted-foreground text-[9px]">atoms build a film, layer by layer (PVD / CVD / ALD)</text>
          <Arrow id="dp-a" />
        </svg>
      );

    case "etch-profile":
      return (
        <svg viewBox="0 0 340 165" className={mid} role="img" aria-label="Etching: a mask protects part of the film; where the mask is open, the exposed material is removed straight down, leaving a trench.">
          {[150, 165, 180, 195].map((x, i) => (
            <line key={i} x1={x} y1={20} x2={x} y2={58} className="stroke-brand/60" strokeWidth="1.2" markerEnd="url(#et-a)" />
          ))}
          <text x="172" y="14" textAnchor="middle" className="fill-muted-foreground text-[9px]">etch</text>
          {/* mask with opening */}
          <rect x="30" y="58" width="115" height="16" className="fill-brand/25 stroke-brand" strokeWidth="1.2" />
          <rect x="200" y="58" width="110" height="16" className="fill-brand/25 stroke-brand" strokeWidth="1.2" />
          <text x="87" y="70" textAnchor="middle" className="fill-foreground text-[9px]">mask</text>
          {/* film */}
          <rect x="30" y="74" width="280" height="26" className="fill-info/20 stroke-border" strokeWidth="1.2" />
          {/* trench (removed material) */}
          <rect x="145" y="74" width="55" height="26" className="fill-muted stroke-border" strokeDasharray="3 2" strokeWidth="1.1" />
          <text x="172" y="90" textAnchor="middle" className="fill-muted-foreground text-[8px]">removed</text>
          <text x="88" y="90" textAnchor="middle" className="fill-foreground text-[9px]">film</text>
          {/* wafer */}
          <rect x="30" y="100" width="280" height="30" className="fill-muted stroke-border" strokeWidth="1.2" />
          <text x="88" y="119" textAnchor="middle" className="fill-muted-foreground text-[9px]">wafer</text>
          <text x="170" y="152" textAnchor="middle" className="fill-muted-foreground text-[9px]">the mask protects; the opening etches straight down (anisotropic)</text>
          <Arrow id="et-a" />
        </svg>
      );

    case "cmp":
      return (
        <svg viewBox="0 0 340 175" className={mid} role="img" aria-label="Chemical-mechanical planarization: slurry and a polishing pad wear down the high spots of an uneven surface, leaving it flat.">
          {/* pad + slurry pressing */}
          <rect x="30" y="20" width="280" height="18" rx="3" className="fill-brand/25 stroke-brand" strokeWidth="1.3" />
          <text x="170" y="33" textAnchor="middle" className="fill-foreground text-[10px]">pad + slurry (chemical + abrasive)</text>
          {[70, 120, 170, 220, 270].map((x, i) => (
            <line key={i} x1={x} y1={40} x2={x} y2={54} className="stroke-foreground" strokeWidth="1.2" markerEnd="url(#cm-a)" />
          ))}
          {/* before */}
          <rect x="30" y="86" width="120" height="24" className="fill-muted stroke-border" strokeWidth="1.2" />
          <path d="M30 86 h20 v-10 h20 v10 h20 v-6 h20 v6 h20" className="fill-info/25 stroke-border" strokeWidth="1.1" />
          <text x="90" y="102" textAnchor="middle" className="fill-foreground text-[9px]">uneven</text>
          <text x="90" y="126" textAnchor="middle" className="fill-muted-foreground text-[9px]">before</text>
          {/* arrow */}
          <line x1="158" y1="92" x2="188" y2="92" className="stroke-foreground" strokeWidth="1.4" markerEnd="url(#cm-a)" />
          {/* after */}
          <rect x="196" y="86" width="120" height="24" className="fill-muted stroke-border" strokeWidth="1.2" />
          <rect x="196" y="78" width="120" height="8" className="fill-info/25 stroke-border" strokeWidth="1.1" />
          <text x="256" y="102" textAnchor="middle" className="fill-foreground text-[9px]">planar</text>
          <text x="256" y="126" textAnchor="middle" className="fill-muted-foreground text-[9px]">after</text>
          <text x="170" y="158" textAnchor="middle" className="fill-muted-foreground text-[9px]">CMP flattens each layer so the next can be built on it</text>
          <Arrow id="cm-a" />
        </svg>
      );

    case "ion-implant":
      return (
        <svg viewBox="0 0 320 170" className={mid} role="img" aria-label="Ion implantation: an ion beam is driven into the wafer; a mask blocks it except at an opening, where dopant atoms enter and form a doped region.">
          <text x="160" y="16" textAnchor="middle" className="fill-foreground text-[10px]">ion beam (species, energy, dose)</text>
          {[140, 155, 170, 185].map((x, i) => (
            <line key={i} x1={x} y1={22} x2={x} y2={58} className="stroke-brand/70" strokeWidth="1.3" markerEnd="url(#ii-a)" />
          ))}
          {/* mask with opening */}
          <rect x="30" y="58" width="105" height="16" className="fill-brand/25 stroke-brand" strokeWidth="1.2" />
          <rect x="190" y="58" width="100" height="16" className="fill-brand/25 stroke-brand" strokeWidth="1.2" />
          <text x="82" y="70" textAnchor="middle" className="fill-foreground text-[9px]">mask (blocks ions)</text>
          {/* wafer */}
          <rect x="30" y="80" width="260" height="55" className="fill-muted stroke-border" strokeWidth="1.3" />
          <text x="60" y="120" className="fill-muted-foreground text-[9px]">silicon</text>
          {/* doped region under opening */}
          <rect x="135" y="80" width="55" height="26" className="fill-warning/30 stroke-border" strokeWidth="1.1" />
          <text x="162" y="97" textAnchor="middle" className="fill-foreground text-[8px]">doped</text>
          <text x="160" y="158" textAnchor="middle" className="fill-muted-foreground text-[9px]">energy sets depth · dose sets how heavily it is doped · then anneal</text>
          <Arrow id="ii-a" />
        </svg>
      );

    case "control-loop":
      return (
        <svg viewBox="0 0 300 210" className={mid} role="img" aria-label="The process-control loop: run the process, measure the result, compare it to target, adjust the tool, and run again.">
          {[
            { x: 20, y: 20, t: "Process" },
            { x: 180, y: 20, t: "Measure" },
            { x: 180, y: 150, t: "Compare" },
            { x: 20, y: 150, t: "Adjust" },
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={b.y} width="100" height="40" rx="5" className="fill-brand/15 stroke-brand" strokeWidth="1.3" />
              <text x={b.x + 50} y={b.y + 25} textAnchor="middle" className="fill-foreground text-[12px]">{b.t}</text>
            </g>
          ))}
          <line x1="120" y1="40" x2="180" y2="40" className="stroke-foreground" strokeWidth="1.4" markerEnd="url(#cl-a)" />
          <line x1="230" y1="60" x2="230" y2="150" className="stroke-foreground" strokeWidth="1.4" markerEnd="url(#cl-a)" />
          <line x1="180" y1="170" x2="120" y2="170" className="stroke-foreground" strokeWidth="1.4" markerEnd="url(#cl-a)" />
          <line x1="70" y1="150" x2="70" y2="60" className="stroke-foreground" strokeWidth="1.4" markerEnd="url(#cl-a)" />
          <text x="150" y="108" textAnchor="middle" className="fill-muted-foreground text-[9px]">measure, compare,</text>
          <text x="150" y="120" textAnchor="middle" className="fill-muted-foreground text-[9px]">adjust, repeat</text>
          <Arrow id="cl-a" />
        </svg>
      );

    case "wafer-structure":
      return (
        <svg viewBox="0 0 330 140" className={mid} role="img" aria-label="A silicon wafer: a round polished disc of many dies, and in cross-section a very thin, very flat single-crystal slice.">
          <circle cx="75" cy="70" r="50" className="fill-brand/10 stroke-brand" strokeWidth="1.4" />
          <line x1="45" y1="112" x2="70" y2="105" className="stroke-brand" strokeWidth="1.4" />
          {[...Array(4)].map((_, i) => (
            <line key={`v${i}`} x1={45 + i * 20} y1={25} x2={45 + i * 20} y2={115} className="stroke-brand/40" strokeWidth="0.7" />
          ))}
          {[...Array(4)].map((_, i) => (
            <line key={`h${i}`} x1={27} y1={45 + i * 18} x2={123} y2={45 + i * 18} className="stroke-brand/40" strokeWidth="0.7" />
          ))}
          <text x="75" y="134" textAnchor="middle" className="fill-muted-foreground text-[10px]">wafer of dies (top view)</text>
          <line x1="135" y1="70" x2="165" y2="70" className="stroke-foreground" strokeWidth="1.3" markerEnd="url(#wf-a)" />
          <rect x="175" y="62" width="140" height="18" className="fill-muted stroke-border" strokeWidth="1.4" />
          <rect x="175" y="58" width="140" height="4" className="fill-brand/40" />
          <text x="245" y="52" textAnchor="middle" className="fill-foreground text-[9px]">polished surface</text>
          <text x="245" y="96" textAnchor="middle" className="fill-muted-foreground text-[9px]">single-crystal silicon</text>
          <text x="245" y="110" textAnchor="middle" className="fill-muted-foreground text-[9px]">(cross-section: thin & flat)</text>
          <Arrow id="wf-a" />
        </svg>
      );

    case "interconnect":
      return (
        <svg viewBox="0 0 300 220" className={mid} role="img" aria-label="Interconnect cross-section: transistors in the silicon are joined by tungsten contacts to stacked copper wiring levels, connected by vias, all separated by dielectric insulation.">
          {/* dielectric background */}
          <rect x="30" y="30" width="240" height="140" className="fill-muted/40 stroke-border" strokeDasharray="3 3" strokeWidth="1" />
          <text x="262" y="26" textAnchor="end" className="fill-muted-foreground text-[9px]">dielectric (insulator)</text>
          {/* metal levels */}
          {[
            { y: 40, t: "Metal 3 (Cu)" },
            { y: 78, t: "Metal 2 (Cu)" },
            { y: 116, t: "Metal 1 (Cu)" },
          ].map((m, i) => (
            <g key={i}>
              <rect x={45} y={m.y} width={210} height={14} className="fill-brand/30 stroke-brand" strokeWidth="1.1" />
              <text x={150} y={m.y + 10} textAnchor="middle" className="fill-foreground text-[9px]">{m.t}</text>
            </g>
          ))}
          {/* vias between levels */}
          <rect x={90} y={54} width={12} height={24} className="fill-info/40 stroke-border" strokeWidth="1" />
          <rect x={200} y={92} width={12} height={24} className="fill-info/40 stroke-border" strokeWidth="1" />
          <text x={118} y={70} className="fill-muted-foreground text-[8px]">via</text>
          {/* tungsten contacts */}
          <rect x={70} y={130} width={12} height={30} className="fill-info/40 stroke-border" strokeWidth="1" />
          <rect x={218} y={130} width={12} height={30} className="fill-info/40 stroke-border" strokeWidth="1" />
          <text x={150} y={152} textAnchor="middle" className="fill-muted-foreground text-[8px]">tungsten contacts</text>
          {/* substrate */}
          <rect x={30} y={170} width={240} height={30} className="fill-muted stroke-border" strokeWidth="1.3" />
          <text x={150} y={189} textAnchor="middle" className="fill-muted-foreground text-[9px]">silicon + transistors</text>
        </svg>
      );

    case "gate-dielectric":
      return (
        <svg viewBox="0 0 320 160" className={mid} role="img" aria-label="A transistor gate stack: the gate sits over a very thin gate dielectric on the silicon channel, with source and drain on either side.">
          <rect x="30" y="88" width="260" height="52" className="fill-muted stroke-border" strokeWidth="1.3" />
          <text x="45" y="120" className="fill-muted-foreground text-[9px]">silicon</text>
          <rect x="40" y="72" width="60" height="16" className="fill-info/20 stroke-border" strokeWidth="1.1" />
          <text x="70" y="84" textAnchor="middle" className="fill-foreground text-[9px]">source</text>
          <rect x="220" y="72" width="60" height="16" className="fill-info/20 stroke-border" strokeWidth="1.1" />
          <text x="250" y="84" textAnchor="middle" className="fill-foreground text-[9px]">drain</text>
          <rect x="110" y="66" width="100" height="6" className="fill-warning/50 stroke-border" strokeWidth="0.8" />
          <rect x="120" y="44" width="80" height="22" className="fill-brand/30 stroke-brand" strokeWidth="1.2" />
          <text x="160" y="59" textAnchor="middle" className="fill-foreground text-[10px]">gate</text>
          <text x="160" y="82" textAnchor="middle" className="fill-muted-foreground text-[8px]">channel</text>
          <line x1="250" y1="55" x2="210" y2="68" className="stroke-foreground" strokeWidth="1" markerEnd="url(#gd-a)" />
          <text x="252" y="52" className="fill-muted-foreground text-[8px]">gate dielectric</text>
          <text x="160" y="152" textAnchor="middle" className="fill-muted-foreground text-[9px]">the gate dielectric is only a few atoms thick</text>
          <Arrow id="gd-a" />
        </svg>
      );

    case "package-stack":
      return (
        <svg viewBox="0 0 300 230" className={mid} role="img" aria-label="A package cross-section: the die is attached to a substrate and connected by wire bonds or bumps, encapsulated in mold compound, with solder balls underneath connecting to the circuit board.">
          {/* mold outline */}
          <rect x="55" y="40" width="190" height="80" rx="4" className="fill-brand/5 stroke-brand/40" strokeDasharray="3 3" strokeWidth="1" />
          <text x="240" y="52" textAnchor="end" className="fill-muted-foreground text-[8px]">mold compound</text>
          {/* die */}
          <rect x="110" y="72" width="80" height="26" className="fill-muted stroke-brand" strokeWidth="1.3" />
          <text x="150" y="89" textAnchor="middle" className="fill-foreground text-[10px]">die</text>
          {/* die attach */}
          <rect x="110" y="98" width="80" height="8" className="fill-brand/20 stroke-border" strokeWidth="1" />
          <text x="150" y="105" textAnchor="middle" className="fill-foreground text-[7px]">die attach</text>
          {/* wire bonds */}
          <path d="M110 74 Q95 60 80 106" className="fill-none stroke-foreground/70" strokeWidth="1" />
          <path d="M190 74 Q205 60 220 106" className="fill-none stroke-foreground/70" strokeWidth="1" />
          <text x="150" y="66" textAnchor="middle" className="fill-muted-foreground text-[7px]">wire bonds (or bumps)</text>
          {/* substrate */}
          <rect x="60" y="106" width="180" height="22" className="fill-info/15 stroke-border" strokeWidth="1.3" />
          <text x="150" y="121" textAnchor="middle" className="fill-foreground text-[9px]">package substrate</text>
          {/* solder balls */}
          {[80, 110, 140, 170, 200, 220].map((x, i) => (
            <circle key={i} cx={x} cy={138} r="7" className="fill-warning/40 stroke-border" strokeWidth="1" />
          ))}
          <text x="150" y="162" textAnchor="middle" className="fill-muted-foreground text-[8px]">solder balls (BGA)</text>
          {/* board */}
          <rect x="40" y="170" width="220" height="26" className="fill-muted stroke-border" strokeWidth="1.3" />
          <text x="150" y="187" textAnchor="middle" className="fill-muted-foreground text-[9px]">circuit board</text>
        </svg>
      );

    case "thermal-path":
      return (
        <svg viewBox="0 0 250 250" className={narrow} role="img" aria-label="The thermal path: heat flows up from the die through the thermal interface material, into the heat spreader or lid, through another interface layer, and out to the heat sink and air.">
          {/* heat-flow arrows */}
          {[95, 155].map((x, i) => (
            <line key={i} x1={x} y1={210} x2={x} y2={40} className="stroke-warning/70" strokeWidth="2" markerEnd="url(#tp-a)" />
          ))}
          <rect x="70" y="206" width="110" height="30" className="fill-warning/30 stroke-warning" strokeWidth="1.3" />
          <text x="125" y="225" textAnchor="middle" className="fill-foreground text-[10px]">die (heat source)</text>
          <rect x="70" y="190" width="110" height="16" className="fill-brand/25 stroke-brand" strokeWidth="1.1" />
          <text x="125" y="202" textAnchor="middle" className="fill-foreground text-[8px]">TIM</text>
          <rect x="55" y="156" width="140" height="34" className="fill-muted stroke-border" strokeWidth="1.3" />
          <text x="125" y="177" textAnchor="middle" className="fill-foreground text-[9px]">heat spreader / lid</text>
          <rect x="55" y="144" width="140" height="12" className="fill-brand/20 stroke-border" strokeWidth="1" />
          <text x="125" y="153" textAnchor="middle" className="fill-foreground text-[7px]">TIM</text>
          <rect x="45" y="86" width="160" height="58" className="fill-info/15 stroke-border" strokeWidth="1.3" />
          {[65, 90, 115, 140, 165, 185].map((x, i) => (
            <line key={i} x1={x} y1={90} x2={x} y2={144} className="stroke-border" strokeWidth="1" />
          ))}
          <text x="125" y="118" textAnchor="middle" className="fill-foreground text-[9px]">heat sink</text>
          <text x="125" y="34" textAnchor="middle" className="fill-muted-foreground text-[9px]">heat out to air →</text>
          <Arrow id="tp-a" />
        </svg>
      );

    default:
      return null;
  }
}
