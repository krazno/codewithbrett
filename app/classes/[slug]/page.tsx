import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Presentation } from "lucide-react";
import { COURSES, getCourse } from "@/app/lib/courses";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Class" };
  return {
    title: course.title,
    robots: { index: false, follow: false },
  };
}

export default async function ClassPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const headerImage = course.slug.startsWith("ap-cs")
    ? "/media/course-headers/computer-science.png"
    : course.slug.startsWith("calculus")
      ? "/media/course-headers/mathematics.png"
      : course.image;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f4ec_0%,#eef5ef_55%,#f7f4ec_100%)]">
      <div className="mx-auto max-w-5xl px-6 py-8 sm:py-10">
        <header className="overflow-hidden rounded-3xl bg-[var(--ua-evergreen)] shadow-xl">
          <div className="relative aspect-[4/1] min-h-40">
            <Image
              src={headerImage}
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
          <div
            className={`grid gap-3 px-7 py-5 text-white sm:items-end sm:px-10 ${
              course.seal
                ? "sm:grid-cols-[auto_1fr_auto]"
                : "sm:grid-cols-[1fr_auto]"
            }`}
          >
            {course.seal ? (
              <div className="h-24 w-24 overflow-hidden rounded-full">
                <Image
                  src={course.seal}
                  alt=""
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-emerald-100 uppercase">
                Ursuline Academy · 2026–2027
              </p>
              <h1 className="mt-1 font-serif text-4xl">{course.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80">
                {course.description}
              </p>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <p className="whitespace-nowrap font-semibold text-emerald-50">
                {course.room}
                {course.scheduleNote ? ` · ${course.scheduleNote}` : ""}
              </p>
              {course.syllabusUrl ? (
                <a
                  href={course.syllabusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open syllabus for ${course.title} in a new tab`}
                  className="inline-flex rounded-full border border-white/50 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--ua-evergreen)] focus:outline-none"
                >
                  Syllabus
                </a>
              ) : null}
            </div>
          </div>
        </header>

        <div
          className={`mt-6 grid gap-4 ${
            course.apJoinCode
              ? "md:grid-cols-2"
              : course.textbook
                ? "md:grid-cols-2 lg:grid-cols-3"
                : course.googleMeetUrl || course.summerWorkUrl
                  ? "md:grid-cols-2"
                  : ""
          }`}
        >
          {course.summerWorkUrl ? (
            <section
              className="ua-card ua-shadow-soft p-6"
              aria-labelledby="summer-work-heading"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-sm font-bold text-white"
                  aria-hidden="true"
                >
                  SW
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                    Before classes begin
                  </p>
                  <h2
                    id="summer-work-heading"
                    className="font-serif text-2xl text-stone-900"
                  >
                    Summer work
                  </h2>
                </div>
              </div>
              <p className="mt-4 text-sm text-stone-700">
                Open the summer assignment for this course.
              </p>
              <a
                href={course.summerWorkUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open summer work for ${course.title} in a new tab`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
              >
                Open Summer work ↗
              </a>
            </section>
          ) : null}

          {course.googleClassroomUrl && course.googleClassroomCode ? (
            <section
              className="ua-card ua-shadow-soft p-6"
              aria-labelledby="google-classroom-heading"
            >
              <div className="flex items-center gap-3">
                <Image
                  src="/media/logos/google-classroom.png"
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                    Course access
                  </p>
                  <h2
                    id="google-classroom-heading"
                    className="font-serif text-2xl text-stone-900"
                  >
                    Join Google Classroom
                  </h2>
                </div>
              </div>
              <a
                href={course.googleClassroomUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open Google Classroom for ${course.title}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
              >
                Open Google Classroom ↗
              </a>
              <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3">
                <p className="text-xs font-semibold text-stone-600 uppercase">
                  Class code
                </p>
                <p className="mt-1 font-mono text-2xl font-bold tracking-[0.12em] text-[var(--ua-evergreen)]">
                  {course.googleClassroomCode}
                </p>
              </div>
              <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-stone-700">
                <li>Sign in with your Ursuline Google account.</li>
                <li>Open the correct class using the button.</li>
                <li>Select “Join” and enter the code if asked.</li>
              </ol>
            </section>
          ) : null}

          {course.apJoinCode ? (
            <section className="ua-card ua-shadow-soft p-6">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-navy)] font-serif text-xl font-bold text-white"
                  aria-hidden="true"
                >
                  AP<sup className="text-[8px]">®</sup>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-indigo-800 uppercase">
                    College Board
                  </p>
                  <h2 className="font-serif text-2xl text-stone-900">
                    Join My AP®
                  </h2>
                </div>
              </div>
              <a
                href="https://myap.collegeboard.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-navy)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#191d45] focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 focus:outline-none"
              >
                Open My AP® ↗
              </a>
              <div className="mt-4 rounded-xl bg-indigo-50 px-4 py-3">
                <p className="text-xs font-semibold text-stone-600 uppercase">
                  Join code
                </p>
                <p className="mt-1 font-mono text-2xl font-bold tracking-[0.16em] text-[var(--ua-navy)]">
                  {course.apJoinCode}
                </p>
              </div>
              <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-stone-700">
                <li>Sign in with your College Board account.</li>
                <li>Select “Join a Course or Exam.”</li>
                <li>Enter the code and confirm your section.</li>
              </ol>
            </section>
          ) : null}

          {course.googleMeetUrl ? (
            <section
              className="ua-card ua-shadow-soft p-6"
              aria-labelledby="live-help-heading"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-sm font-bold text-white"
                  aria-hidden="true"
                >
                  Meet
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                    Course support
                  </p>
                  <h2
                    id="live-help-heading"
                    className="font-serif text-2xl text-stone-900"
                  >
                    Live Help
                  </h2>
                </div>
              </div>
              <p className="mt-4 text-sm text-stone-700">
                Join the Google Meet for live help with this course.
              </p>
              <a
                href={course.googleMeetUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Join Live Help for ${course.title} in Google Meet`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
              >
                Join Live Help ↗
              </a>
            </section>
          ) : null}

          {course.textbook ? (
            <section
              className="ua-card ua-shadow-soft p-6"
              aria-labelledby="resources-heading"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-white"
                  aria-hidden="true"
                >
                  <BookOpen size={24} strokeWidth={2} />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                    Course materials
                  </p>
                  <h2
                    id="resources-heading"
                    className="font-serif text-2xl text-stone-900"
                  >
                    Resources
                  </h2>
                </div>
              </div>
              <a
                href={course.textbook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-xl bg-emerald-50 px-4 py-3 hover:bg-emerald-100 focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
              >
                <span className="block text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                  Digital textbook
                </span>
                <span className="mt-1 block font-semibold text-stone-900">
                  {course.textbook.title} ↗
                </span>
              </a>
              {course.resources?.length ? (
                <ul className="mt-3 divide-y divide-stone-200">
                  {course.resources.map((resource) => (
                    <li key={resource.url}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-1 py-3 hover:text-[var(--ua-evergreen)] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
                      >
                        <span className="block text-sm font-medium">
                          {resource.title} ↗
                        </span>
                        <span className="mt-0.5 block text-xs text-stone-500">
                          {resource.category}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          {/* Academic classes only (omit Study Hall). Paste Share → Embed URL into gammaEmbedSrc. */}
          {course.googleClassroomUrl ? (
            <section
              className="ua-card ua-shadow-soft overflow-hidden p-6"
              aria-labelledby="gamma-presentation-heading"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-white"
                  aria-hidden="true"
                >
                  <Presentation size={24} strokeWidth={2} />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                    Current deck
                  </p>
                  <h2
                    id="gamma-presentation-heading"
                    className="font-serif text-2xl text-stone-900"
                  >
                    Class Presentation
                  </h2>
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                {course.gammaEmbedSrc ? (
                  <div className="aspect-video min-h-[12rem] w-full">
                    <iframe
                      src={course.gammaEmbedSrc}
                      title={
                        course.gammaEmbedTitle ??
                        `${course.title} Class Presentation`
                      }
                      className="h-full w-full border-0"
                      allow="fullscreen"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video min-h-[12rem] w-full items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-stone-50 px-6 text-center">
                    <p className="text-sm font-medium text-stone-500">
                      Presentation coming soon
                    </p>
                  </div>
                )}
              </div>
            </section>
          ) : null}
        </div>

        <footer className="mt-8 flex items-center justify-between border-t border-stone-300 pt-4 text-sm">
          <Link
            href="/"
            className="font-medium text-[var(--ua-evergreen)] hover:underline"
          >
            ← Back to classes
          </Link>
          <p className="text-xs text-stone-500">
            Faith · Courage · Joy · Serviam
          </p>
        </footer>
      </div>
    </main>
  );
}
