import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "../lib/site";

const lessonTitle = "AI, the Brain, and Serviam";
const lessonDescription =
  "AI literacy lesson for Ursuline Academy Dedham: Serviam judgment with AI and Inside AI labs for students.";

export const metadata: Metadata = {
  title: lessonTitle,
  description: lessonDescription,
  alternates: { canonical: "/ursuline-ai/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${lessonTitle} · ${SITE_NAME}`,
    description: lessonDescription,
    url: "/ursuline-ai/",
    images: [
      {
        url: "/assets/ursuline-shield.png",
        alt: "Ursuline Academy Dedham",
      },
      DEFAULT_OG_IMAGE,
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${lessonTitle} · ${SITE_NAME}`,
    description: lessonDescription,
    images: ["/assets/ursuline-shield.png"],
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
