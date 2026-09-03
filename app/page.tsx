import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COURSES } from "@/app/lib/courses";

export const metadata: Metadata = {
  title: {
    absolute: "Code with Brett · Ursuline Academy Dedham",
  },
  description:
    "Code with Brett at Ursuline Academy Dedham — class hubs, AI literacy, and ways to get help. Built for Ursuline Bears.",
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
        url: "/media/branded/ua-seal.png",
        alt: "Ursuline Academy · Code with Brett",
      },
    ],
  },
};

const PLACEHOLDER = "#"; // swap for Google Form / Meet / Calendar later

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

function SoftLink({
  href,
  children,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const ready = href !== "#";
  const className = primary
    ? "inline-flex items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b4a33]"
    : "inline-flex items-center justify-center rounded-full border border-[rgba(32,37,34,0.18)] bg-white/80 px-5 py-2.5 text-sm font-semibold text-stone-800 hover:bg-white";

  if (!ready) {
    return (
      <span
        className={`${className} cursor-default opacity-80`}
        title="Link coming soon"
      >
        {children}
        <span className="ml-1.5 text-[10px] font-normal tracking-wide text-stone-500 uppercase">
          soon
        </span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={className}
    >
      {children}
    </a>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-10 sm:px-6 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="ua-card ua-shadow-soft relative overflow-hidden rounded-[22px]">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/media/branded/campus-entrance.png"
            alt=""
            fill
            className="object-cover opacity-[0.18]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(247,244,236,0.75)] via-[rgba(255,255,255,0.88)] to-[rgba(238,246,241,0.95)]" />
        </div>

        <header className="relative z-10 px-5 py-8 text-center sm:px-8 sm:py-10">
          <Image
            src="/media/branded/ua-seal.png"
            alt="Ursuline Academy Dedham"
            width={72}
            height={72}
            className="mx-auto h-[72px] w-[72px] object-contain"
            priority
          />
          <p className="mt-3 text-xs font-semibold tracking-wide text-emerald-800 uppercase">
            Faith · Courage · Joy · Ursuline Bears
          </p>
          <h1 className="mt-2 font-serif text-4xl text-stone-900 sm:text-5xl">
            Code with Brett
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-stone-700">
            Your class hub for CS, calc, and AI — made for Ursuline girls who
            want help that actually makes sense.
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
            <Link
              href="/ursuline-ai/"
              className="rounded-full bg-[var(--ua-evergreen)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33]"
            >
              Start the AI lesson
            </Link>
            <Link
              href="/sample-lesson/"
              className="rounded-full border border-[rgba(32,37,34,0.18)] bg-white/80 px-6 py-3 text-sm font-semibold text-[var(--ua-evergreen)] hover:bg-white"
            >
              Sample lesson
            </Link>
          </div>
        </header>
      </section>

      {/* Meet Brett */}
      <section className="ua-card ua-shadow-soft mt-8 flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <div
          className="mx-auto flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(13,92,61,0.25)] bg-[var(--ua-sage)] sm:mx-0"
          aria-hidden
        >
          {/* Drop photo at /media/branded/brett-hannan.png to replace initials */}
          <span className="font-serif text-3xl font-semibold text-[var(--ua-evergreen)]">
            BH
          </span>
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h2 className="font-serif text-2xl text-stone-900">Brett Hannan</h2>
          <p className="mt-1 text-sm text-stone-600">
            Code with Brett · Ursuline Academy Dedham
          </p>
          <p className="mt-2 text-sm text-stone-700">
            Questions, stuck on homework, or just need a vibe check before the
            quiz? Reach out — help is meant to feel easy.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-stone-700">
            <li>
              Email:{" "}
              <span className="text-stone-500">add contact email soon</span>
            </li>
            <li>
              Office / room:{" "}
              <span className="text-stone-500">shared in class</span>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <SoftLink href={PLACEHOLDER} primary>
              Live help
            </SoftLink>
            <SoftLink href={PLACEHOLDER}>Schedule a meeting</SoftLink>
            <SoftLink href={PLACEHOLDER}>Anonymous feedback</SoftLink>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            Live help → Google Meet later · Schedule → calendar booking later ·
            Feedback → anonymous survey later
          </p>
        </div>
      </section>

      {/* Campus vibe strip */}
      <section className="mt-8 overflow-hidden rounded-2xl">
        <Image
          src="/media/branded/campus-students.png"
          alt="Ursuline Academy campus"
          width={960}
          height={540}
          className="h-auto w-full object-cover"
        />
      </section>

      {/* Classes */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl text-stone-900">Your classes</h2>
        <p className="mt-1 text-sm text-stone-600">
          Tap your class — you’ll need the passcode from Brett. Each page will
          have Google Classroom and the syllabus.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {COURSES.map((c) => (
            <Link
              key={c.slug}
              href={`/classes/${c.slug}/`}
              className="rounded-2xl border border-[rgba(32,37,34,0.14)] bg-white/75 px-5 py-4 text-left transition hover:border-emerald-700/40 hover:bg-white"
            >
              <span className="block text-base font-semibold text-stone-900">
                {c.title}
              </span>
              <span className="mt-1 block text-sm text-stone-600">{c.room}</span>
              <span className="mt-2 block text-xs font-medium text-[var(--ua-evergreen)]">
                Open class page →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Suggest */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl text-stone-900">Got ideas?</h2>
        <p className="mt-1 text-sm text-stone-600">
          Field trips and guest experts make class better — drop a suggestion
          anytime. Forms coming soon.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <SoftLink href={PLACEHOLDER}>Suggest an academic trip</SoftLink>
          <SoftLink href={PLACEHOLDER}>Suggest an industry expert</SoftLink>
        </div>
      </section>

      {/* Lesson materials (compact) */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl text-stone-900">Lesson materials</h2>
        <nav
          aria-label="Lesson materials"
          className="mt-4 grid gap-2 sm:grid-cols-2"
        >
          {[
            {
              href: "/ursuline-ai/",
              title: "AI, the Brain, and Serviam",
              blurb: "Full interactive lesson",
            },
            {
              href: "/sample-lesson/",
              title: "Sample lesson hub",
              blurb: "Course placeholders + preview",
            },
            {
              href: "/artifacts/ursuline_serviam_ai_student_handout.docx",
              title: "Part 1 handout",
              blurb: "Serviam Use Card",
            },
            {
              href: "/artifacts/ursuline_part2_student_handout.docx",
              title: "Part 2 handout",
              blurb: "Inside AI lab notes",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-[rgba(32,37,34,0.12)] bg-white/70 px-4 py-3 hover:bg-white"
            >
              <span className="block text-sm font-semibold text-stone-900">
                {item.title}
              </span>
              <span className="text-xs text-stone-600">{item.blurb}</span>
            </Link>
          ))}
        </nav>
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
