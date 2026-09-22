import type { Metadata } from "next";
import Link from "next/link";
import { CarRateLessonLazy } from "@/app/components/rate-of-change/CarRateLessonLazy";
import { SITE_NAME } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Average Rate and Instantaneous Rate",
  description:
    "Teacher-led Calculus Honors lesson on average and instantaneous rates of change using s(t) = t².",
  alternates: { canonical: "/tools/average-and-instantaneous-rates/" },
  openGraph: {
    siteName: SITE_NAME,
    title: `Average Rate and Instantaneous Rate · ${SITE_NAME}`,
    description:
      "Flip cards to reveal average and instantaneous rates for the car model s(t) = t².",
    url: "/tools/average-and-instantaneous-rates/",
  },
};

export default function AverageAndInstantaneousRatesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <p className="mb-4 text-sm">
        <Link
          href="/classes/calculus-h-d/"
          className="font-medium text-[var(--ua-evergreen)] hover:underline"
        >
          ← Back to Calculus H (D)
        </Link>
      </p>
      <CarRateLessonLazy />
    </main>
  );
}
