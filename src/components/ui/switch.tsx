"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
}

export function Switch({ checked, onCheckedChange }: SwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "flex h-7 w-12 items-center rounded-full p-1 transition",
        checked ? "bg-[var(--success)]" : "bg-[var(--muted)]",
      )}
      aria-pressed={checked}
    >
      <span className={cn("h-5 w-5 rounded-full bg-white transition", checked ? "translate-x-5" : "translate-x-0")} />
    </button>
  );
}
