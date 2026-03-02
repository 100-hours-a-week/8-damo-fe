"use client";

import { cn } from "@/src/lib/utils";

interface SegmentedTabsProps {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedTabs({
  tabs,
  value,
  onChange,
  className,
}: SegmentedTabsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-xl bg-[#fbfbff] p-0.5",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex-1 cursor-pointer rounded-[11px] px-3 py-2 text-base font-semibold transition-all",
            value === tab.value
              ? "bg-white text-foreground shadow-[0px_4px_6px_0px_rgba(0,0,0,0.08)]"
              : "text-[#aeaeb2]"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
