import type { Metadata } from "next";
import Link from "next/link";
import { UnderstandingLimitPropertiesLazy } from "@/app/components/limit-properties/UnderstandingLimitPropertiesLazy";
import { SITE_NAME } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Understanding Limit Properties",
  description:
    "A Calculus Honors lesson on the eight limit laws, with graphs, tables, and guided practice.",
  alternates: { canonical: "/tools/limit-properties/" },
  openGraph: {
    siteName: SITE_NAME,
    title: `Understanding Limit Properties · ${SITE_NAME}`,
    description:
      "See why limit laws work with graphs, numerical tables, and step-by-step algebra.",
    url: "/tools/limit-properties/",
  },
};

export default function LimitPropertiesPage() {
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
      <UnderstandingLimitPropertiesLazy />
    </main>
  );
}
