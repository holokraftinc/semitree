import { describe, expect, it } from "vitest";
import { syringePump } from "./syringePump";

describe("syringePump", () => {
  it("speed-from-flow: v = Q / (π d²/4)", () => {
    const r = syringePump({ mode: "speed-from-flow", innerDiameter: 1e-2, flowRate: 1e-9 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const area = (Math.PI * (1e-2) ** 2) / 4;
      expect(r.value.crossSectionArea).toBeCloseTo(area, 12);
      expect(r.value.plungerSpeed).toBeCloseTo(1e-9 / area, 15);
    }
  });

  it("flow-from-speed is the inverse of speed-from-flow", () => {
    const a = syringePump({ mode: "speed-from-flow", innerDiameter: 1e-2, flowRate: 1e-9 });
    if (a.ok) {
      const b = syringePump({
        mode: "flow-from-speed",
        innerDiameter: 1e-2,
        plungerSpeed: a.value.plungerSpeed,
      });
      if (b.ok) expect(b.value.flowRate).toBeCloseTo(1e-9, 15);
    }
  });

  it("zero flow / zero speed → zero counterpart", () => {
    const a = syringePump({ mode: "speed-from-flow", innerDiameter: 1e-2, flowRate: 0 });
    if (a.ok) expect(a.value.plungerSpeed).toBe(0);
    const b = syringePump({ mode: "flow-from-speed", innerDiameter: 1e-2, plungerSpeed: 0 });
    if (b.ok) expect(b.value.flowRate).toBe(0);
  });

  it("small and large diameters stay finite", () => {
    const small = syringePump({ mode: "flow-from-speed", innerDiameter: 1e-4, plungerSpeed: 1e-6 });
    const large = syringePump({ mode: "flow-from-speed", innerDiameter: 3e-2, plungerSpeed: 1e-3 });
    if (small.ok) expect(Number.isFinite(small.value.flowRate)).toBe(true);
    if (large.ok) expect(Number.isFinite(large.value.flowRate)).toBe(true);
  });

  it("rejects zero diameter, negative flow, NaN, and empty", () => {
    expect(syringePump({ mode: "speed-from-flow", innerDiameter: 0, flowRate: 1e-9 }).ok).toBe(false);
    expect(syringePump({ mode: "speed-from-flow", innerDiameter: 1e-2, flowRate: -1e-9 }).ok).toBe(false);
    expect(syringePump({ mode: "flow-from-speed", innerDiameter: 1e-2, plungerSpeed: NaN }).ok).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(syringePump({} as any).ok).toBe(false);
  });
});
