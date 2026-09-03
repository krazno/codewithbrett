import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI, the Brain, and Serviam",
  description:
    "Interactive AI literacy lessons for Ursuline Academy students. Part 1: wisdom and judgment. Part 2: Inside AI.",
};

export default function UrsulineAiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <meta
        httpEquiv="Cache-Control"
        content="no-cache, no-store, must-revalidate"
      />
      <meta httpEquiv="Pragma" content="no-cache" />
      <meta httpEquiv="Expires" content="0" />
      {children}
    </>
  );
}
