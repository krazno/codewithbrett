import type { Metadata } from "next";
import Link from "next/link";
import { LimitsApproachingLazy } from "@/app/components/limits/LimitsApproachingLazy";
import { SITE_NAME } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Limits: What Are We Approaching?",
  description:
    "A Calculus Honors introduction to limit notation, near versus at, and a hole in a graph.",
  alternates: { canonical: "/tools/limits-approaching/" },
  openGraph: {
    siteName: SITE_NAME,
    title: `Limits: What Are We Approaching? · ${SITE_NAME}`,
    description:
      "See what lim x→a f(x)=L means, then work a limit with a hole at x=2.",
    url: "/tools/limits-approaching/",
  },
};

export default function LimitsApproachingPage() {
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
      <LimitsApproachingLazy />
    </main>
  );
}
