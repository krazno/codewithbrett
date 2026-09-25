import type { Metadata } from "next";
import Link from "next/link";
import { CheckYourLimitsLazy } from "@/app/components/limits/CheckYourLimitsLazy";
import { SITE_NAME } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Check Your Limits | QOD Follow-Up",
  description:
    "A short Calculus Honors self-check on holes, one-sided limits, and whether a two-sided limit exists.",
  alternates: { canonical: "/tools/check-your-limits/" },
  openGraph: {
    siteName: SITE_NAME,
    title: `Check Your Limits · ${SITE_NAME}`,
    description:
      "Check the five QOD limit problems with graphs, feedback, and left- and right-hand approach.",
    url: "/tools/check-your-limits/",
  },
};

export default function CheckYourLimitsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl min-w-0 px-4 py-6 sm:px-6 sm:py-8">
      <p className="mb-4 text-sm">
        <Link
          href="/classes/calculus-h-d/"
          className="font-medium text-[var(--ua-evergreen)] hover:underline"
        >
          ← Back to Calculus H (D)
        </Link>
      </p>
      <CheckYourLimitsLazy />
    </main>
  );
}
