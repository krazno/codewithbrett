import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sample lesson · Ursuline Academy Dedham",
  description:
    "Temporary class hub page: course buttons and links to the current Ursuline lesson facets.",
  alternates: { canonical: "/sample-lesson/" },
};

const MATERIAL_LINKS = [
  {
    href: "/ursuline-ai/",
    title: "Student lesson",
    blurb: "AI, the Brain, and Serviam — full interactive class.",
  },
  { href: "/ursuline-ai/#pt1", title: "Part 1", blurb: "Wisdom, judgment, and Serviam with AI." },
  { href: "/ursuline-ai/#pt2", title: "Part 2", blurb: "Inside AI — how models work, labs included." },
  { href: "/ursuline-ai/#faculty", title: "Faculty", blurb: "Teacher plans and leadership review materials." },
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

const COURSES = [
  {
    id: "study-hall",
    title: "Study Hall (Day 4 - AH)",
    room: "",
  },
  { id: "ap-csp", title: "AP CSP", room: "Rm A207" },
  { id: "calculus", title: "Calculus", room: "Rm 118" },
  { id: "calculus-h", title: "Calculus H", room: "Rm 118" },
  { id: "ap-csp-a", title: "AP CSP A", room: "Rm 118" },
];

export default function SampleLessonPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      <header className="mb-10 text-center">
        <div className="relative mx-auto mb-4 h-16 w-16">
          <Image
            src="/assets/ua-crest.png"
            alt="Ursuline Academy Dedham"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
          Sample lesson hub
        </p>
        <h1 className="mt-2 font-serif text-4xl text-stone-900 sm:text-5xl">
          Ursuline materials and class buttons
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-stone-700">
          Temporary placeholders for each course page. Replace these sections later with full pages.
        </p>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="/ursuline-ai/"
            className="rounded-full bg-[var(--ua-evergreen)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33]"
          >
            Start the student lesson
          </a>
          <Link
            href="/"
            className="rounded-full border border-[rgba(32,37,34,0.18)] bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--ua-evergreen)] hover:bg-white"
          >
            Back to home
          </Link>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-[var(--ua-evergreen)]">
          Ursuline lesson facets
        </h2>
        <nav aria-label="Ursuline materials" className="grid gap-3 sm:grid-cols-2">
          {MATERIAL_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="ua-card px-5 py-4 transition hover:border-emerald-700/40 hover:bg-white/90"
            >
              <span className="block font-medium text-stone-900">{item.title}</span>
              <span className="mt-1 block text-sm leading-snug text-stone-700">
                {item.blurb}
              </span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--ua-evergreen)]">
            Ursuline Academy course link (temporary)
          </h2>
        </div>
        <a
          href="https://www.boostmyschool.com/ursulineacademy?utm_source=chatgpt.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ua-card ua-shadow-soft block overflow-hidden"
          style={{ padding: 0, borderRadius: 18 }}
        >
          <img
            src="https://tse4.mm.bing.net/th/id/OIP.w6Trpp9Awa0E9WBrf-Ue9wHaHa?r=0&pid=Api"
            alt="Ursuline Academy"
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </a>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-[var(--ua-evergreen)]">
          Temporary class buttons
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {COURSES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="ua-card px-5 py-4 transition hover:border-emerald-700/40 hover:bg-white/90"
            >
              <span className="block text-sm font-semibold text-stone-900">
                {c.title}
              </span>
              {c.room ? (
                <span className="mt-1 block text-xs text-stone-700">{c.room}</span>
              ) : (
                <span className="mt-1 block text-xs text-stone-700">&nbsp;</span>
              )}
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-5 pb-10">
        {COURSES.map((c) => (
          <div
            key={c.id}
            id={c.id}
            className="ua-card ua-shadow-soft scroll-mt-28 px-6 py-6"
          >
            <h3 className="font-semibold text-[var(--ua-evergreen)]">
              {c.title}
            </h3>
            {c.room ? (
              <p className="mt-1 text-sm text-stone-700">{c.room}</p>
            ) : null}

            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              This is a temporary placeholder for the course page. Later, you’ll replace this section with the full content for the course.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/ursuline-ai/"
                className="rounded-full border border-[rgba(32,37,34,0.18)] bg-white/70 px-5 py-2 text-xs font-semibold text-[var(--ua-evergreen)] hover:bg-white"
              >
                Open student lesson
              </Link>
              <Link
                href="/sample-lesson/"
                className="rounded-full border border-[rgba(32,37,34,0.18)] bg-white/70 px-5 py-2 text-xs font-semibold text-stone-700 hover:bg-white"
              >
                Stay on sample hub
              </Link>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

