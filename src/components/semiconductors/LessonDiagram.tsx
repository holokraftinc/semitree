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
  return null;
}
