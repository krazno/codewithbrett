import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI, the Brain, and Serviam",
  description:
    "AI literacy lesson for Ursuline Academy Dedham: Serviam and Inside AI labs for Ursuline students.",
  alternates: { canonical: "/ursuline-ai/" },
  openGraph: {
    type: "website",
    siteName: "Ursuline Academy Dedham",
    title: "AI, the Brain, and Serviam · Ursuline Academy Dedham",
    description:
      "Interactive AI literacy for Ursuline Academy students in Dedham, Massachusetts.",
    url: "/ursuline-ai/",
    images: [
      {
        url: "/assets/ursuline-shield.png",
        alt: "Ursuline Academy Dedham",
      },
    ],
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
