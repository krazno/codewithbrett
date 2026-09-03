import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { GoogleAnalyticsHead } from "./components/GoogleAnalytics";
import {
  GoogleTagManagerBody,
  GoogleTagManagerHead,
} from "./components/GoogleTagManager";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const siteUrl = "https://www.codewithbrett.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Code with Brett · Ursuline Academy Dedham",
    template: "%s · Code with Brett · Ursuline Academy Dedham",
  },
  description:
    "Code with Brett — computer science and AI literacy for Ursuline Academy in Dedham, Massachusetts.",
  keywords: [
    "Code with Brett",
    "Ursuline Academy Dedham",
    "Ursuline Academy",
    "Dedham MA",
    "AI literacy",
    "computer science",
    "Serviam",
    "Ursuline Bears",
  ],
  authors: [{ name: "Brett Hannan · Code with Brett" }],
  creator: "Code with Brett",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Code with Brett · Ursuline Academy Dedham",
    title: "Code with Brett · Ursuline Academy Dedham",
    description:
      "Computer science and AI literacy for Ursuline Academy in Dedham, Massachusetts.",
    images: [
      {
        url: "/assets/ursuline-shield.png",
        alt: "Ursuline Academy · Code with Brett",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Code with Brett · Ursuline Academy Dedham",
    description:
      "Computer science and AI literacy for Ursuline Academy in Dedham, MA.",
    images: ["/assets/ursuline-shield.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <head>
        <GoogleTagManagerHead />
        <GoogleAnalyticsHead />
      </head>
      <body className="min-h-screen bg-stone-50 font-sans antialiased">
        <GoogleTagManagerBody />
        {children}
      </body>
    </html>
  );
}
