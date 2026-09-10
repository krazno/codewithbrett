import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { ContentGuard } from "./components/ContentGuard";
import { GoogleAnalyticsHead } from "./components/GoogleAnalytics";
import {
  GoogleTagManagerBody,
  GoogleTagManagerHead,
} from "./components/GoogleTagManager";
import { NavQuoteStrip } from "./components/NavQuoteStrip";
import { QuoteFooter } from "./components/QuoteFooter";
import { SiteHeader } from "./components/SiteHeader";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "./lib/site";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · CS & Math at Ursuline Academy`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Code with Brett",
    "Brett Hannan",
    "Ursuline Academy Dedham",
    "AP Computer Science Principles",
    "AP Computer Science A",
    "Calculus Honors",
    "Dedham MA",
    "computer science teacher",
  ],
  authors: [{ name: "Brett Hannan", url: `${SITE_URL}/about/` }],
  creator: "Brett Hannan",
  publisher: SITE_NAME,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} · CS & Math at Ursuline Academy`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · CS & Math at Ursuline Academy`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
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
      <body className="flex min-h-screen flex-col bg-stone-50 font-sans antialiased">
        <GoogleTagManagerBody />
        <NavQuoteStrip />
        <SiteHeader />
        <div className="flex-1">
          <ContentGuard>{children}</ContentGuard>
        </div>
        <QuoteFooter />
      </body>
    </html>
  );
}
