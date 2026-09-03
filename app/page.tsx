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
      <section
        className="relative mb-10 ua-card ua-shadow-soft overflow-hidden"
        style={{
          padding: "clamp(1.25rem, 3vw, 2.25rem)",
          borderRadius: "22px",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <Image
            src="/assets/ursuline-shield.png"
            alt=""
            fill
            className="object-cover"
            priority={false}
          />
        </div>

        <header className="relative z-10 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-3">
            <Image
              src="/assets/ua-crest.png"
              alt="Ursuline Academy Dedham"
              width={56}
              height={56}
              className="h-[56px] w-[56px] object-contain"
              priority
            />
            <span className="inline-flex items-center rounded-full border border-[rgba(32,37,34,0.15)] bg-white/60 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800 uppercase">
              Ursuline Academy · Dedham, MA
            </span>
          </div>

          <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
            Faith · Courage · Joy
          </p>

          <h1 className="mt-3 font-serif text-4xl text-stone-900 sm:text-5xl">
            Code with Brett
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-700">
            AI literacy and computer science with Ursuline Bears — clear lessons,
            downloadable handouts, and a faculty hub.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="/ursuline-ai/"
              className="rounded-full bg-[var(--ua-evergreen)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33]"
              rel="noopener noreferrer"
            >
              Start the lesson
            </a>
            <a
              href="/sample-lesson/"
              className="rounded-full border border-[rgba(32,37,34,0.18)] bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--ua-evergreen)] hover:bg-white"
            >
              Sample lesson
            </a>
          </div>
        </header>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--ua-evergreen)]">
            Explore Ursuline materials
          </h2>
          <span className="hidden text-sm text-stone-600 sm:block">
            Everything you need, in one place.
          </span>
        </div>

        <nav aria-label="Ursuline materials" className="grid gap-3 sm:grid-cols-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-[rgba(32,37,34,0.14)] bg-white/70 px-5 py-4 text-left transition hover:border-emerald-700/40 hover:bg-white"
            >
              <span className="block font-medium text-stone-900">{item.title}</span>
              <span className="mt-1 block text-sm leading-snug text-stone-700">
                {item.blurb}
              </span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-[var(--ua-evergreen)]">
          Temporary class buttons (schedule)
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              id: "study-hall",
              label: "Study Hall (Day 4 - AH)",
              room: "",
            },
            { id: "ap-csp", label: "AP CSP (Rm A207)", room: "Rm A207" },
            { id: "calculus", label: "Calculus (Rm 118)", room: "Rm 118" },
            { id: "calculus-h", label: "Calculus H (Rm 118)", room: "Rm 118" },
            { id: "ap-csp-a", label: "AP CSP A (Rm 118)", room: "Rm 118" },
          ].map((c) => (
            <Link
              key={c.id}
              href={`/sample-lesson/#${c.id}`}
              className="rounded-2xl border border-[rgba(32,37,34,0.14)] bg-white/70 px-5 py-4 text-left transition hover:border-emerald-700/40 hover:bg-white"
            >
              <span className="block text-sm font-semibold text-stone-900">
                {c.label}
              </span>
              <span className="mt-1 block text-xs text-stone-700">
                Jump to this course section on the sample lesson page.
              </span>
            </Link>
          ))}
        </div>
      </section>

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
