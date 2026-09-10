import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TodayDate } from "@/app/components/TodayDate";
import { COURSES, type Course } from "@/app/lib/courses";

export const metadata: Metadata = {
  title: {
    absolute: "Ursuline Academy Dedham · Classes with Mr. Hannan",
  },
  description:
    "Class hubs for AP CSP, AP CSA, Calculus Honors, and Study Hall at Ursuline Academy Dedham.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Ursuline Academy Dedham",
    title: "Ursuline Academy Dedham · Classes with Mr. Hannan",
    description:
      "Class hubs for AP CSP, AP CSA, Calculus Honors, and Study Hall at Ursuline Academy Dedham.",
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
    ? "inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#0b4a33]"
    : "inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[rgba(32,37,34,0.18)] bg-white/80 px-4 py-2.5 text-center text-sm font-semibold text-stone-800 hover:bg-white";

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

function CourseCard({ course }: { course: Course }) {
  return (
    <article className="ua-card p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
      <Link href={`/classes/${course.slug}/`} className="flex gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full">
          <Image
            src={course.image}
            alt=""
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <h3 className="font-serif text-xl text-stone-900">{course.title}</h3>
          <p className="text-xs text-stone-600">
            {course.room}
            {course.scheduleNote ? ` · ${course.scheduleNote}` : ""}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-stone-700">
            {course.description}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8 sm:px-6 sm:py-10">
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
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(247,244,236,0.78)] via-[rgba(255,255,255,0.9)] to-[rgba(238,246,241,0.94)]" />
        </div>

        <div className="relative z-10 grid gap-7 p-5 sm:gap-8 sm:p-6 md:grid-cols-2 md:items-center md:gap-10 md:p-7">
          <header className="flex items-center gap-4 sm:gap-5">
            <Image
              src="/media/branded/ua-seal.png"
              alt="Ursuline Academy Dedham"
              width={112}
              height={112}
              className="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28"
              priority
            />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.14em] text-emerald-800/80 uppercase">
                Faith · Courage · Joy
              </p>
              <h1 className="mt-1 font-serif text-3xl text-stone-900 sm:text-4xl">
                Welcome
              </h1>
              <div className="mt-2 text-xl font-semibold text-stone-800 sm:text-2xl">
                <TodayDate />
              </div>
            </div>
          </header>

          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[rgba(13,92,61,0.25)]">
                <Image
                  src="/media/branded/brett-hannan.png"
                  alt="Brett Hannan"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-2xl leading-tight text-stone-900 sm:text-3xl">
                  Brett Hannan
                </h2>
                <p className="mt-1 text-sm text-stone-600">
                  Computer Science & Mathematics
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm leading-relaxed text-stone-600">
                Questions or need help? Reach out anytime.
              </p>
              <div
                className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                role="group"
                aria-label="Quick actions"
              >
                <SoftLink
                  href="https://calendar.app.google/Y59k115ZMYyLjcUG6"
                  primary
                >
                  Schedule a meeting
                </SoftLink>
                <SoftLink href="mailto:bhannan@ursulineacademy.net">
                  Email
                </SoftLink>
                <SoftLink href="/about/">About me</SoftLink>
                <SoftLink href="https://calendar.app.google/Y59k115ZMYyLjcUG6">
                  Google Calendar
                </SoftLink>
                <div className="sm:col-span-2">
                  <SoftLink href={PLACEHOLDER}>Anonymous feedback</SoftLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8" aria-label="Classes">
        <div className="grid gap-4 sm:grid-cols-2">
          {COURSES.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
          <article className="ua-card p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
            <Link href="/advisory/" className="flex items-center gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/media/branded/ua-seal.png"
                  alt=""
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                  Ursuline Academy
                </p>
                <h3 className="font-serif text-xl text-stone-900">Advisory</h3>
                <p className="mt-1 text-xs leading-relaxed text-stone-700">
                  Prayer and reflection.
                </p>
              </div>
            </Link>
          </article>
        </div>
      </section>

      <section
        className="mt-8 grid gap-4 lg:grid-cols-3"
        aria-label="Class features"
      >
        <article className="ua-card ua-shadow-soft flex h-full flex-col p-6">
          <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
            Your ideas
          </p>
          <h2 className="mt-1 font-serif text-2xl text-stone-900">
            Help shape our classes
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Suggest a field trip or a guest expert who could bring our learning
            to life.
          </p>
          <div className="mt-auto flex flex-col gap-2 pt-5">
            <SoftLink href={PLACEHOLDER}>Suggest an academic trip</SoftLink>
            <SoftLink href={PLACEHOLDER}>Suggest an industry expert</SoftLink>
          </div>
        </article>

        <article className="ua-card ua-shadow-soft flex h-full flex-col p-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] font-serif text-sm font-bold text-white"
              aria-hidden="true"
            >
              UA
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                Serviam
              </p>
              <h2 className="font-serif text-2xl leading-tight text-stone-900">
                Classroom Prayers &amp; Mindfulness
              </h2>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Find a quiet moment for prayer, reflection, and focus.
          </p>
          <div className="mt-auto pt-5">
            <SoftLink href={PLACEHOLDER} primary>
              Open prayers &amp; mindfulness
            </SoftLink>
          </div>
        </article>

        <article className="ua-card ua-shadow-soft flex h-full flex-col overflow-hidden">
          <div className="flex flex-1 flex-col p-6">
            <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
              For school &amp; beyond
            </p>
            <h2 className="mt-1 font-serif text-2xl text-stone-900">
              Tools &amp; Resources
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              A short list of software that supports writing, coding, and class
              projects.
            </p>
            <div
              className="mt-5 flex flex-wrap items-center gap-2"
              aria-label="Featured tools: Cursor, Wispr Flow, Eclipse IDE, and Gamma"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-stone-200 bg-white p-2 shadow-sm">
                <Image
                  src="/media/resources/cursor.svg"
                  alt="Cursor"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-stone-200 bg-white p-2 shadow-sm">
                <Image
                  src="/media/resources/wispr-flow.svg"
                  alt="Wispr Flow"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="flex h-14 w-20 items-center justify-center rounded-xl border border-stone-200 bg-white p-2 shadow-sm">
                <Image
                  src="/media/resources/eclipse-ide.svg"
                  alt="Eclipse IDE"
                  width={64}
                  height={24}
                  className="h-auto w-full object-contain"
                />
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-stone-200 bg-white p-2 shadow-sm">
                <span
                  aria-label="Gamma"
                  className="font-serif text-lg font-bold text-stone-700"
                >
                  Γ
                </span>
              </div>
            </div>
            <div className="mt-auto pt-5">
              <Link
                href="/resources/"
                className="inline-flex items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b4a33]"
              >
                More resources
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="ua-card ua-shadow-soft mt-6 overflow-hidden">
        <Image
          src="/media/branded/brett-with-students.png"
          alt="Mr. Hannan with Ursuline Academy students"
          width={1024}
          height={768}
          className="h-auto w-full object-cover"
        />
      </section>

      <aside
        className="mt-7 text-center text-xs leading-relaxed text-stone-500"
        aria-label="Website fact"
      >
        <span className="font-semibold text-emerald-800">
          Built with 6,000+ lines of code
        </span>{" "}
        across TypeScript, JavaScript, CSS, Python, and shell.
      </aside>

      <p className="mt-5 text-center text-sm text-stone-500">
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
