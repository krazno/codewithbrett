import type { Metadata } from "next";
import Link from "next/link";
import { FunctionGardenLazy } from "@/app/components/function-garden/FunctionGardenLazy";
import { SITE_NAME } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "UA Function Garden",
  description:
    "Explore functions, ordered pairs, domain, and range for Ursuline Academy Calculus Honors.",
  alternates: { canonical: "/tools/function-garden/" },
  openGraph: {
    siteName: SITE_NAME,
    title: `UA Function Garden · ${SITE_NAME}`,
    description:
      "Change the input. Watch the math come alive — a Calculus Honors interactive.",
    url: "/tools/function-garden/",
  },
};

export default function FunctionGardenPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <p className="mb-4 text-sm">
        <Link
          href="/"
          className="font-medium text-[var(--ua-evergreen)] hover:underline"
        >
          ← Back to classes
        </Link>
      </p>
      <FunctionGardenLazy />
    </main>
  );
}
