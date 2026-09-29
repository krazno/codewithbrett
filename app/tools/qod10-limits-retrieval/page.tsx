import type { Metadata } from "next";
import Link from "next/link";
import { Qod10LimitsRetrievalLazy } from "@/app/components/limits/Qod10LimitsRetrievalLazy";
import { SITE_NAME } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "QOD10 | Limits Retrieval",
  description:
    "Check Monday’s Calculus Honors QOD: factoring holes, one-sided limits, and nearby vs at.",
  alternates: { canonical: "/tools/qod10-limits-retrieval/" },
  openGraph: {
    siteName: SITE_NAME,
    title: `QOD10 | Limits Retrieval · ${SITE_NAME}`,
    description:
      "A four-problem check of limit retrieval with graphs, hints, and no grade.",
    url: "/tools/qod10-limits-retrieval/",
  },
};

export default function Qod10Page() {
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
      <Qod10LimitsRetrievalLazy />
    </main>
  );
}
