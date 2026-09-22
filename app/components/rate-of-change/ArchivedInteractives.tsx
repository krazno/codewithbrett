"use client";

import { useState, type ReactNode } from "react";

export function ArchivedInteractives({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="md:col-span-2">
      <button
        type="button"
        aria-expanded={open}
        className="inline-flex min-h-11 w-full items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 text-left text-sm font-semibold text-[#1B2A4A] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2"
        onClick={() => setOpen((current) => !current)}
      >
        <span>Earlier interactives</span>
        <span className="text-[var(--ua-evergreen)]">{open ? "Hide" : "Show"}</span>
      </button>
      {open ? <div className="mt-3 grid items-start gap-3">{children}</div> : null}
    </section>
  );
}
