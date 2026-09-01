"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type TabItem = { value: string; label: string; content: React.ReactNode };

/**
 * Accessible tabs following the WAI-ARIA tabs pattern: roving focus, arrow-key
 * navigation, Home/End, and correct tab/tabpanel roles + aria-controls wiring.
 */
export function Tabs({
  items,
  defaultValue,
  className,
}: {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
}) {
  const baseId = useId();
  const [active, setActive] = useState(defaultValue ?? items[0]?.value);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const keys: Record<string, number> = {
      ArrowRight: (index + 1) % items.length,
      ArrowLeft: (index - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = items[keys[e.key]];
    setActive(next.value);
    tabRefs.current[next.value]?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex gap-1 border-b border-border"
      >
        {items.map((item, i) => {
          const selected = item.value === active;
          return (
            <button
              key={item.value}
              ref={(el) => {
                tabRefs.current[item.value] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${item.value}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "-mb-px border-b-2 px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-brand text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.value}
          role="tabpanel"
          id={`${baseId}-panel-${item.value}`}
          aria-labelledby={`${baseId}-tab-${item.value}`}
          hidden={item.value !== active}
          tabIndex={0}
          className="pt-4 focus-visible:outline-none"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
