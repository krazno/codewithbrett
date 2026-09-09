import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TodayDateLabel } from "@/app/components/TodayDate";
import { AdvisoryContent } from "./AdvisoryContent";

export const metadata: Metadata = {
  title: "Advisory",
  description:
    "All Student Orientation Day 2 schedule, Ursuline Prayer, Pledge of Allegiance, and Advisory materials.",
  alternates: { canonical: "/advisory/" },
  robots: { index: false, follow: false },
};

export default function AdvisoryPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f4ec_0%,#eef5ef_55%,#f7f4ec_100%)]">
      <div
        className="sticky top-0 z-50 border-b border-emerald-900/15 bg-[#f7f4ec]/95 shadow-sm backdrop-blur-md"
        role="banner"
      >
        <nav
          aria-label="Advisory"
          className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-3 py-2.5 sm:px-6 sm:py-3"
        >
          <Link
            href="/"
            className="shrink-0 text-sm font-semibold text-[var(--ua-evergreen)] underline decoration-emerald-800/30 underline-offset-4 hover:decoration-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
          >
            Home
          </Link>
          <TodayDateLabel className="text-right text-sm font-semibold text-[var(--ua-evergreen)] sm:text-base" />
        </nav>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-2.75rem)] max-w-5xl flex-col px-5 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-10">
        <header className="overflow-hidden rounded-3xl bg-[var(--ua-evergreen)] shadow-xl">
          <div className="relative aspect-[4/1] min-h-40">
            <Image
              src="/media/branded/campus-entrance.png"
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-4 px-7 py-5 text-white sm:px-10">
            <Image
              src="/media/branded/ua-seal.png"
              alt="Ursuline Academy Dedham"
              width={88}
              height={88}
              className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24"
            />
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-emerald-100 uppercase">
                Faith · Courage · Joy · Serviam
              </p>
              <h1 className="mt-1 font-serif text-4xl sm:text-5xl">
                Advisory
              </h1>
            </div>
          </div>
        </header>

        <AdvisoryContent />

        <footer className="flex items-center justify-between gap-4 border-t border-stone-300 pt-4 text-sm">
          <Link
            href="/"
            className="font-semibold text-[var(--ua-evergreen)] underline decoration-emerald-700/30 underline-offset-4 hover:decoration-emerald-700"
          >
            ← Back to classes
          </Link>
          <p className="text-xs text-stone-500">Ursuline Academy Dedham</p>
        </footer>
      </div>
    </main>
  );
}
