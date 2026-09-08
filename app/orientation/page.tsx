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
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
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

        <div className="relative z-10 grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center">
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
            <h1 className="mt-5 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
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
            className="mx-auto h-40 w-40 rounded-full border-4 border-white object-cover shadow-xl sm:h-44 sm:w-44"
            priority
          />
        </div>
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                2026–2027
              </p>
              <h2 className="font-serif text-3xl text-stone-900">My classes</h2>
            </div>
            <p className="hidden text-sm text-stone-600 sm:block">
              Blocks, subjects, and what we&apos;ll learn
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {COURSES.map((course) => (
              <article
                key={course.slug}
                className="ua-card flex gap-4 p-4 sm:min-h-36"
              >
                <Image
                  src={course.image}
                  alt=""
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] shrink-0 rounded-xl object-cover"
                />
                <div>
                  <p className="text-xs font-semibold tracking-wide text-[var(--ua-evergreen)] uppercase">
                    {subjectFor(course)} · {course.scheduleNote}
                  </p>
                  <h3 className="mt-1 font-serif text-xl text-stone-900">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-700">
                    {course.description}
                  </p>
                  <p className="mt-2 text-xs font-medium text-stone-500">
                    {course.room}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl bg-[var(--ua-evergreen)] p-6 text-white shadow-lg">
            <p className="text-xs font-semibold tracking-[0.14em] text-emerald-100 uppercase">
              What to bring
            </p>
            <h2 className="mt-2 font-serif text-3xl">You&apos;re ready with:</h2>
            <ul className="mt-4 space-y-3 text-base">
              {[
                "Your device",
                "A writing implement",
                "Paper",
                "An eager mind to learn",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="ua-card p-6">
            <h2 className="font-serif text-2xl text-stone-900">
              A little about me
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">
              Before Ursuline, I led technology, computer science, AI, and
              STEAM programs at Centner Academy, The Greene School, and The
              Sage School.
            </p>

            <div className="mt-4 border-t border-stone-200 pt-4">
              <h3 className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                Education
              </h3>
              <p className="mt-2 text-sm text-stone-700">
                M.S. Computer Science
                <br />
                B.S. Computer Science, Software Engineering
                <br />
                <span className="text-stone-500">
                  University of Massachusetts Dartmouth
                </span>
              </p>
            </div>

            <div className="mt-4 border-t border-stone-200 pt-4">
              <h3 className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                Research & recognition
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">
                Published AI researcher and co-developer of the iHANDS
                intelligent health advising system. Honors include a
                Governor&apos;s Proclamation for STEAM Education and the South
                Florida Science Center Business Visionary Award.
              </p>
            </div>
          </section>
        </aside>
      </section>

      <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-stone-300/70 pt-5 text-sm text-stone-600 sm:flex-row">
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
