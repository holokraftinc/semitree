/** Simple labelled rectangular channel cross-section (width w × height h). */
export function ChannelDiagram() {
  return (
    <figure className="rounded-lg border border-border bg-muted/40 p-4">
      <svg
        viewBox="0 0 240 160"
        className="mx-auto h-auto w-full max-w-[240px]"
        role="img"
        aria-label="Rectangular channel cross-section, showing width w along the horizontal edge and height h along the vertical edge."
      >
        {/* channel */}
        <rect
          x="50"
          y="45"
          width="140"
          height="70"
          rx="4"
          className="fill-brand/10 stroke-brand"
          strokeWidth="2"
        />
        {/* width dimension */}
        <line x1="50" y1="130" x2="190" y2="130" className="stroke-foreground" strokeWidth="1" />
        <line x1="50" y1="125" x2="50" y2="135" className="stroke-foreground" strokeWidth="1" />
        <line x1="190" y1="125" x2="190" y2="135" className="stroke-foreground" strokeWidth="1" />
        <text x="120" y="148" textAnchor="middle" className="fill-foreground font-mono text-[13px]">
          w
        </text>
        {/* height dimension */}
        <line x1="30" y1="45" x2="30" y2="115" className="stroke-foreground" strokeWidth="1" />
        <line x1="25" y1="45" x2="35" y2="45" className="stroke-foreground" strokeWidth="1" />
        <line x1="25" y1="115" x2="35" y2="115" className="stroke-foreground" strokeWidth="1" />
        <text x="18" y="84" textAnchor="middle" className="fill-foreground font-mono text-[13px]">
          h
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        Rectangular channel cross-section (width w × height h).
      </figcaption>
    </figure>
  );
}
