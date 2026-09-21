"use client";

import dynamic from "next/dynamic";

export const ClosingTheGapLazy = dynamic(
  () => import("./ClosingTheGap").then((mod) => mod.ClosingTheGap),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-[rgba(31,77,58,0.16)] bg-[#FFFDF7] p-6 text-sm text-[#1F4D3A]">
        Loading Closing the Gap…
      </div>
    ),
  },
);
