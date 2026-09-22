import type { Metadata } from "next";
import Link from "next/link";
import { AverageToInstantaneousLazy } from "@/app/components/rate-of-change/AverageToInstantaneousLazy";
import { SITE_NAME } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "From Average Rate to Instantaneous Rate",
  description:
    "Estimate an instantaneous rate of change from shrinking average rates for Ursuline Academy Calculus Honors.",
  alternates: { canonical: "/tools/average-to-instantaneous/" },
  openGraph: {
    siteName: SITE_NAME,
    title: `From Average Rate to Instantaneous Rate · ${SITE_NAME}`,
    description:
      "Watch secant slopes approach a tangent as the interval shrinks toward t = 2.",
    url: "/tools/average-to-instantaneous/",
  },
};

export default function AverageToInstantaneousPage() {
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
      <AverageToInstantaneousLazy />
    </main>
  );
}
