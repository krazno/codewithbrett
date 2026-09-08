import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COURSES, type Course } from "@/app/lib/courses";

export const metadata: Metadata = {
  title: "New Student Orientation · Meet Mr. Hannan",
  description:
    "Meet Mr. Hannan, see this year's classes, and learn what to bring to class.",
  alternates: { canonical: "/orientation/" },
};

function subjectFor(course: Course) {
  if (course.slug.startsWith("ap-cs")) return "Computer Science";
  if (course.slug.startsWith("calculus")) return "Mathematics";
  return "Academic Support";
}

export default function OrientationPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-6 sm:px-8 lg:flex lg:h-screen lg:min-h-0 lg:flex-col lg:overflow-hidden lg:py-4">
      <section className="ua-card ua-shadow-soft relative overflow-hidden rounded-[24px]">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/media/branded/campus-entrance.png"
            alt=""
            fill
            className="object-cover opacity-[0.16]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(247,244,236,0.96)] via-[rgba(255,255,255,0.91)] to-[rgba(225,240,231,0.92)]" />
        </div>

        <div className="relative z-10 grid gap-4 px-6 py-6 sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center lg:py-5">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/media/branded/ua-seal.png"
                alt="Ursuline Academy Dedham"
                width={58}
                height={58}
                className="h-[58px] w-[58px] object-contain"
                priority
              />
              <p className="text-xs font-semibold tracking-[0.16em] text-emerald-800 uppercase">
                New Student Orientation
              </p>
            </div>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-stone-900 lg:text-[2.7rem]">
              Welcome! I&apos;m Mr. Hannan.
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-stone-700">
              I teach computer science and calculus. My classroom is a place to
              ask questions, try ideas, solve meaningful problems, and learn
              from every attempt.
            </p>
          </div>

          <Image
            src="/media/branded/brett-hannan.png"
            alt="Brett Hannan"
            width={180}
            height={180}
            className="mx-auto h-36 w-36 rounded-full border-4 border-white object-cover shadow-xl lg:h-28 lg:w-28"
            priority
          />
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-[var(--ua-evergreen)] px-5 py-4 text-white shadow-lg lg:shrink-0 lg:py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="shrink-0">
            <p className="text-xs font-semibold tracking-[0.14em] text-emerald-100 uppercase">
              What to bring
            </p>
            <h2 className="font-serif text-2xl">You&apos;re ready with:</h2>
          </div>
          <ul className="grid flex-1 grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:max-w-3xl">
            {[
              "Your device",
              "A writing implement",
              "Paper",
              "An eager mind",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[1.55fr_0.75fr]">
        <div>
          <div className="flex items-end justify-between gap-4 lg:h-10">
            <div>
              <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                2026–2027
              </p>
              <h2 className="font-serif text-2xl text-stone-900">My classes</h2>
            </div>
            <p className="hidden text-sm text-stone-600 sm:block">
              Blocks, subjects, and what we&apos;ll learn
            </p>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:h-[calc(100%-3.25rem)] lg:grid-cols-3 lg:grid-rows-2">
            {COURSES.map((course) => (
              <article
                key={course.slug}
                className="ua-card flex gap-3 border-l-4 border-l-[var(--ua-evergreen)] p-3 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md lg:min-h-0"
              >
                <Image
                  src={course.image}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
                <div>
                  <p className="text-[10px] font-semibold tracking-wide text-[var(--ua-evergreen)] uppercase">
                    {subjectFor(course)} · {course.scheduleNote}
                  </p>
                  <h3 className="font-serif text-lg text-stone-900">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-700">
                    {course.description}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-stone-500">
                    {course.room}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="lg:min-h-0">
          <section className="ua-card h-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-[var(--ua-sage)] px-5 py-3">
              <p className="text-xs font-semibold tracking-[0.14em] text-emerald-800 uppercase">
                Teacher · Technologist · Researcher
              </p>
              <h2 className="font-serif text-2xl text-stone-900">
                A little about me
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-stone-700">
                I combine classroom teaching with a background in computer
                science, school leadership, and hands-on STEAM learning.
              </p>
            </div>

            <div className="space-y-3 p-4">
              <div>
                <h3 className="text-[10px] font-semibold tracking-wide text-emerald-800 uppercase">
                  Before Ursuline
                </h3>
                <ul className="mt-1 space-y-0.5 text-xs text-stone-700">
                  <li className="flex gap-2">
                    <span className="text-emerald-700">•</span>
                    Centner Academy — High School Principal & AI Director
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-700">•</span>
                    The Greene School — Assistant Head & CIO
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-700">•</span>
                    The Sage School — Technology & Computer Science Director
                  </li>
                </ul>
              </div>

              <div className="border-t border-stone-200 pt-2">
                <h3 className="text-[10px] font-semibold tracking-wide text-emerald-800 uppercase">
                  Education · UMass Dartmouth
                </h3>
                <ul className="mt-1 space-y-0.5 text-xs text-stone-700">
                  <li className="flex gap-2">
                    <span className="text-emerald-700">•</span>
                    M.S. in Computer Science
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-700">•</span>
                    B.S. in Computer Science, Software Engineering
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                <h3 className="text-[10px] font-semibold tracking-wide text-emerald-800 uppercase">
                  My research
                </h3>
                <p className="mt-1 text-xs font-semibold text-stone-900">
                  iHANDS · Intelligent Health Advising
                </p>
                <p className="mt-1 text-xs leading-relaxed text-stone-700">
                  Published research using AI, machine learning, and medical
                  knowledge systems to support personalized health decisions.
                </p>
                <a
                  href="https://doi.org/10.1109/WI-IAT.2014.180"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center rounded-full bg-[var(--ua-evergreen)] px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-[#0b4a33]"
                >
                  View the IEEE publication ↗
                </a>
              </div>

              <div className="border-t border-stone-200 pt-2">
                <h3 className="text-[10px] font-semibold tracking-wide text-emerald-800 uppercase">
                  Selected recognition
                </h3>
                <ul className="mt-1 space-y-0.5 text-xs text-stone-700">
                  <li className="flex gap-2">
                    <span className="text-emerald-700">•</span>
                    Governor&apos;s Proclamation for STEAM Education
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-700">•</span>
                    Business Visionary Award
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-700">•</span>
                    MIT, Amazon Future Engineer & LEGO ambassador
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </aside>
      </section>

      <footer className="mt-3 flex shrink-0 items-center justify-between border-t border-stone-300/70 pt-2 text-xs text-stone-600">
        <p>Faith · Courage · Joy · Serviam</p>
        <Link
          href="/"
          className="font-semibold text-[var(--ua-evergreen)] underline decoration-emerald-700/30 underline-offset-4"
        >
          Return to class homepage
        </Link>
      </footer>
    </main>
  );
}
