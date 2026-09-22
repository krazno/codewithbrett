"use client";

import dynamic from "next/dynamic";

export const AverageToInstantaneousLazy = dynamic(
  () =>
    import("./AverageToInstantaneous").then(
      (mod) => mod.AverageToInstantaneous,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-[rgba(31,77,58,0.16)] bg-[#FFFDF7] p-6 text-sm text-[#1F4D3A] md:col-span-2">
        Loading From Average Rate to Instantaneous Rate…
      </div>
    ),
  },
);
