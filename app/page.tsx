import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COURSES, type Course } from "@/app/lib/courses";

export const metadata: Metadata = {
  title: {
    absolute: "Ursuline Academy Dedham · Classes with Mr. Hannan",
  },
  description:
    "Class hubs for AP CSP, Calculus, and Homeroom at Ursuline Academy Dedham.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Ursuline Academy Dedham",
    title: "Ursuline Academy Dedham · Classes with Mr. Hannan",
    description:
      "Class hubs for AP CSP, Calculus, and Homeroom at Ursuline Academy Dedham.",
    url: "/",
    images: [
      {
        url: "/media/branded/ua-seal.png",
        alt: "Ursuline Academy Dedham",
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
      name: "Ursuline Academy Dedham · Classes with Mr. Hannan",
      url: "https://www.codewithbrett.com/",
      description:
        "Computer science and AI literacy for Ursuline Academy in Dedham, Massachusetts.",
      publisher: {
        "@type": "Person",
        name: "Brett Hannan",
        email: "bhannan@ursulineacademy.net",
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

function CourseCard({ course, wide }: { course: Course; wide?: boolean }) {
  return (
    <Link
      href={`/classes/${course.slug}/`}
      className={`ua-card ua-shadow-soft flex flex-col gap-3 p-5 text-center transition hover:bg-white sm:p-6 ${
        wide
          ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc(50%-0.5rem)] sm:flex-row sm:items-center sm:text-left"
          : ""
      }`}
    >
      <div
        className={`mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[rgba(13,92,61,0.25)] ${wide ? "sm:mx-0" : ""}`}
      >
        <Image
          src={course.image}
          alt=""
          width={80}
          height={80}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-2xl text-stone-900">{course.title}</h3>
        <p className="mt-1 text-sm text-stone-600">
          {course.room}
          {course.scheduleNote ? ` · ${course.scheduleNote}` : ""}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone-700">
          {course.description}
        </p>
        <span className="mt-3 inline-block text-sm font-semibold text-[var(--ua-evergreen)]">
          Open class page
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-10 sm:px-6 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            Welcome
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-stone-700">
            Your class hub for CS and calc, made for Ursuline girls who want
            help that actually makes sense.
          </p>
        </header>
      </section>

      <section className="ua-card ua-shadow-soft mt-8 flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-[rgba(13,92,61,0.25)] sm:mx-0">
          <Image
            src="/media/branded/brett-hannan.png"
            alt="Brett Hannan"
            width={112}
            height={112}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h2 className="font-serif text-2xl text-stone-900">Brett Hannan</h2>
          <p className="mt-1 text-sm text-stone-600">
            Ursuline Academy Dedham
          </p>
          <p className="mt-2 text-sm text-stone-700">
            Questions, stuck on homework, or just need a vibe check before the
            quiz? Reach out — help is meant to feel easy.
          </p>
          <p className="mt-3 text-sm text-stone-700">
            Email:{" "}
            <a
              href="mailto:bhannan@ursulineacademy.net"
              className="font-medium text-[var(--ua-evergreen)] underline underline-offset-2"
            >
              bhannan@ursulineacademy.net
            </a>
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <SoftLink href={PLACEHOLDER} primary>
              Live help
            </SoftLink>
            <SoftLink href={PLACEHOLDER}>Schedule a meeting</SoftLink>
            <SoftLink href={PLACEHOLDER}>Anonymous feedback</SoftLink>
          </div>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl">
        <Image
          src="/media/branded/campus-students.png"
          alt="Ursuline Academy campus"
          width={960}
          height={540}
          className="h-auto w-full object-cover"
        />
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl text-stone-900">Your classes</h2>
        <p className="mt-1 text-sm text-stone-600">
          Tap your class — you’ll need the passcode from Brett. Each page will
          have Google Classroom and the syllabus.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {COURSES.map((c, i) => (
            <CourseCard
              key={c.slug}
              course={c}
              wide={i === COURSES.length - 1}
            />
          ))}
        </div>
      </section>

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
