import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI, the Brain, and Serviam",
  description:
    "Code with Brett lesson for Ursuline Academy Dedham — AI literacy, Serviam, and Inside AI labs for Ursuline students.",
  alternates: { canonical: "/ursuline-ai/" },
  openGraph: {
    title: "AI, the Brain, and Serviam · Code with Brett · Ursuline Academy Dedham",
    description:
      "Interactive AI literacy for Ursuline Academy students in Dedham, Massachusetts.",
    url: "/ursuline-ai/",
  },
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
