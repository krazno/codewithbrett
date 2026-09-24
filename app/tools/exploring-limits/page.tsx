import type { Metadata } from "next";
import Link from "next/link";
import { ExploringLimitsLazy } from "@/app/components/limits/ExploringLimitsLazy";
import { SITE_NAME } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Exploring Limits",
  description:
    "A Calculus Honors lesson on evaluating limits, holes, and left- and right-hand limits.",
  alternates: { canonical: "/tools/exploring-limits/" },
  openGraph: {
    siteName: SITE_NAME,
    title: `Exploring Limits · ${SITE_NAME}`,
    description:
      "Evaluate limits algebraically and describe what a function approaches from the left and from the right.",
    url: "/tools/exploring-limits/",
  },
};

export default function ExploringLimitsPage() {
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
      <ExploringLimitsLazy />
    </main>
  );
}
