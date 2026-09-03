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

export const metadata: Metadata = {
  title: {
    default: "Code with Brett · Ursuline Academy Dedham",
    template: "%s · Code with Brett",
  },
  description:
    "Computer science and AI literacy for Ursuline Academy in Dedham, Massachusetts.",
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
