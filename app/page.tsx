import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Code with Brett · Ursuline Academy Dedham",
  },
  description:
    "Code with Brett at Ursuline Academy Dedham — AI literacy lessons, student handouts, and faculty materials for Ursuline Bears in Dedham, Massachusetts.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Code with Brett · Ursuline Academy Dedham",
    title: "Code with Brett · Ursuline Academy Dedham",
    description:
      "AI literacy and computer science class home for Ursuline Academy in Dedham, MA.",
    url: "/",
    images: [
      {
        url: "/assets/ursuline-shield.png",
        alt: "Ursuline Academy · Code with Brett",
      },
    ],
  },
};

const links = [
  {
    href: "/ursuline-ai/",
    title: "Student lesson",
    blurb: "AI, the Brain, and Serviam — full interactive class.",
  },
  {
    href: "/ursuline-ai/#pt1",
    title: "Part 1",
    blurb: "Wisdom, judgment, and Serviam with AI.",
  },
  {
    href: "/ursuline-ai/#pt2",
    title: "Part 2",
    blurb: "Inside AI — how models work, labs included.",
  },
  {
    href: "/ursuline-ai/#faculty",
    title: "Faculty",
    blurb: "Teacher plans and leadership review materials.",
  },
  {
    href: "/artifacts/ursuline_serviam_ai_student_handout.docx",
    title: "Part 1 handout",
    blurb: "Student Serviam Use Card (download).",
  },
  {
    href: "/artifacts/ursuline_part2_student_handout.docx",
    title: "Part 2 handout",
    blurb: "Inside AI lab notes (download).",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Code with Brett · Ursuline Academy Dedham",
      url: "https://www.codewithbrett.com/",
      description:
        "Computer science and AI literacy for Ursuline Academy in Dedham, Massachusetts.",
      publisher: {
        "@type": "Person",
        name: "Brett Hannan",
      },
    },
    {
      "@type": "EducationalOrganization",
      name: "Ursuline Academy",
      alternateName: ["Ursuline Academy Dedham", "UA Dedham"],
      url: "https://www.ursulineacademy.net/",
      address: {
        "@type": "PostalAddress",
        streetAddress: "85 Lowder Street",
        addressLocality: "Dedham",
        addressRegion: "MA",
        postalCode: "02026",
        addressCountry: "US",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-12 text-center">
        <Image
          src="/assets/ua-crest.png"
          alt="Ursuline Academy Dedham"
          width={72}
          height={72}
          className="mx-auto mb-6 h-[72px] w-[72px] object-contain"
          priority
        />
        <p className="text-sm font-medium tracking-wide text-emerald-800 uppercase">
          Ursuline Academy · Dedham, MA
        </p>
        <h1 className="mt-3 font-serif text-4xl text-stone-900 sm:text-5xl">
          Code with Brett
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-600">
          Class home for AI literacy and computer science at Ursuline Academy.
        </p>
      </header>

      <nav aria-label="Ursuline materials" className="grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-stone-200 bg-white px-5 py-4 text-left transition hover:border-emerald-700/40 hover:bg-emerald-50/50"
          >
            <span className="block font-medium text-stone-900">{item.title}</span>
            <span className="mt-1 block text-sm leading-snug text-stone-600">
              {item.blurb}
            </span>
          </Link>
        ))}
      </nav>

      <p className="mt-12 text-center text-sm text-stone-500">
        Serviam ·{" "}
        <a
          href="https://www.ursulineacademy.net/"
          className="underline decoration-stone-300 underline-offset-2 hover:text-emerald-800"
          rel="noopener noreferrer"
        >
          ursulineacademy.net
        </a>
      </p>
    </main>
  );
}
