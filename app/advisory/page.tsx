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
      <header
        className="sticky top-0 z-50 border-b border-black/25 bg-[var(--ua-evergreen)] text-white shadow-md"
        role="banner"
      >
        <nav
          aria-label="Advisory"
          className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-3 py-2 sm:gap-4 sm:px-6 sm:py-2.5"
        >
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5">
            <Image
              src="/media/branded/ua-seal.png"
              alt=""
              width={40}
              height={40}
              priority
              className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
            />
            <div
              className="hidden h-6 w-px shrink-0 bg-white/25 sm:block"
              aria-hidden
            />
            <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
              <p className="truncate font-serif text-[0.95rem] leading-none font-semibold tracking-tight sm:text-base">
                Advisory
              </p>
              <Link
                href="/"
                className="w-fit text-xs font-semibold tracking-wide text-white/90 uppercase underline decoration-white/40 underline-offset-[3px] hover:text-white hover:decoration-white focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ua-evergreen)] sm:text-[0.7rem]"
              >
                Home
              </Link>
            </div>
          </div>

          <TodayDateLabel className="shrink-0 whitespace-nowrap text-right text-[0.7rem] leading-snug font-medium text-white sm:text-sm sm:font-semibold" />
        </nav>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col px-5 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-10">
        <div className="overflow-hidden rounded-3xl bg-[var(--ua-evergreen)] shadow-xl">
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
        </div>

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
