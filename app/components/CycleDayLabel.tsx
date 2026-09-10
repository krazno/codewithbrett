"use client";

import { useEffect, useState } from "react";
import { getCycleDayLabel } from "@/app/lib/uaSchedule";

/** Compact cycle-day chip for the sticky header (e.g. Day 4, Day 0). */
export function CycleDayLabel({ className }: { className?: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(getCycleDayLabel(new Date()));
  }, []);

  if (!label) return null;

  return (
    <span
      className={className}
      aria-label={`Ursuline cycle ${label}`}
      suppressHydrationWarning
    >
      {label}
    </span>
  );
}
