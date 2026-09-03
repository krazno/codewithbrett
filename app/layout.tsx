import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { ContentGuard } from "./components/ContentGuard";
import { GoogleAnalyticsHead } from "./components/GoogleAnalytics";
import {
  GoogleTagManagerBody,
  GoogleTagManagerHead,
} from "./components/GoogleTagManager";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://www.codewithbrett.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ursuline Academy Dedham · Classes with Mr. Hannan",
    template: "%s · Ursuline Academy Dedham",
  },
  description:
    "Computer science and calculus class home for Ursuline Academy in Dedham, Massachusetts.",
  keywords: [
    "Ursuline Academy Dedham",
    "Ursuline Academy",
    "Dedham MA",
    "AP CSP",
    "calculus",
    "Serviam",
    "Ursuline Bears",
  ],
  authors: [{ name: "Brett Hannan" }],
  creator: "Brett Hannan",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ursuline Academy Dedham",
    title: "Ursuline Academy Dedham · Classes with Mr. Hannan",
    description:
      "Computer science and calculus class home for Ursuline Academy in Dedham, Massachusetts.",
    images: [
      {
        url: "/media/branded/ua-seal.png",
        alt: "Ursuline Academy Dedham",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Ursuline Academy Dedham · Classes with Mr. Hannan",
    description:
      "Computer science and calculus class home for Ursuline Academy in Dedham, MA.",
    images: ["/media/branded/ua-seal.png"],
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
        <ContentGuard>{children}</ContentGuard>
      </body>
    </html>
  );
}
