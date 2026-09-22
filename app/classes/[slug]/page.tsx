import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  BookOpen,
  ClipboardList,
  Code2,
  Film,
  Gamepad2,
  KeyRound,
  Presentation,
} from "lucide-react";
import { COURSES, getCourse } from "@/app/lib/courses";
import { SITE_NAME } from "@/app/lib/site";
import { BinaryFlipLab } from "@/app/components/BinaryFlipLab";
import { FunctionGardenLazy } from "@/app/components/function-garden/FunctionGardenLazy";
import { JavaDataTypesLab } from "@/app/components/JavaDataTypesLab";
import { LimitsApproachingLazy } from "@/app/components/limits/LimitsApproachingLazy";
import { AverageToInstantaneousLazy } from "@/app/components/rate-of-change/AverageToInstantaneousLazy";
import { ArchivedInteractives } from "@/app/components/rate-of-change/ArchivedInteractives";
import { CarRateLessonLazy } from "@/app/components/rate-of-change/CarRateLessonLazy";
import { ClosingTheGapLazy } from "@/app/components/rate-of-change/ClosingTheGapLazy";
import { SeeTheSecantLine } from "@/app/components/rate-of-change/SeeTheSecantLine";
import { WhereCalculusGoesNextLazy } from "@/app/components/rate-of-change/WhereCalculusGoesNextLazy";
import { CourseNoticeModal } from "./CourseNoticeModal";
import { CoursePasscodeGate } from "./CoursePasscodeGate";

const STUDENT_PROFILE_SURVEY_URL = "https://forms.gle/bSMTuh9JSgLWbpKdA";
const CALCULUS_SCHOLARSHIP_URL =
  "https://docs.google.com/document/d/1uuqsegcM0cNvbckZKWlfMPJdoMBfoGhHoShTDdYkpfU/edit?usp=sharing";
const STRETCH_VIDEO_ID = "37tBZS7-E9k";
const STRETCH_WATCH_URL = `https://www.youtube.com/watch?v=${STRETCH_VIDEO_ID}`;
const STRETCH_EMBED_URL = `https://www.youtube.com/embed/${STRETCH_VIDEO_ID}`;
const MAKECODE_URL = "https://arcade.makecode.com/#editor";
const ONLINE_JAVA_URL = "https://www.online-java.com/";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Class" };

  const title = course.title;
  const description = `${course.description} Room ${course.room}${
    course.scheduleNote ? ` · ${course.scheduleNote}` : ""
  } at Ursuline Academy Dedham.`;

  return {
    title,
    description,
    alternates: { canonical: `/classes/${course.slug}/` },
    // Class hubs include Classroom / Meet codes — keep out of public search.
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${title} · ${SITE_NAME}`,
      description,
      url: `/classes/${course.slug}/`,
      images: [
        {
          url: course.image,
          alt: `${course.title} class`,
        },
      ],
    },
  };
}

export default async function ClassPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const headerImage = course.slug.startsWith("ap-cs") || course.slug === "coding-club"
    ? "/media/course-headers/computer-science.png"
    : course.slug.startsWith("calculus")
      ? "/media/course-headers/mathematics.png"
      : course.image;
  const showMakeCode = course.slug.startsWith("ap-csp");
  const showOnlineJava = course.slug.startsWith("ap-csa");

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f4ec_0%,#eef5ef_55%,#f7f4ec_100%)]">
      <CoursePasscodeGate courseTitle={course.title}>
      <CourseNoticeModal
        slug={course.slug}
        courseTitle={course.title}
        googleClassroomUrl={course.googleClassroomUrl}
        scholarshipUrl={
          course.slug.startsWith("calculus")
            ? CALCULUS_SCHOLARSHIP_URL
            : undefined
        }
      />
      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-6 sm:py-8">
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
                  alt={`${course.title} seal`}
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

        {course.comingSoon ? (
          <section className="ua-card ua-shadow-soft mt-6 p-8 text-center sm:p-10">
            <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
              New this year
            </p>
            <h2 className="mt-2 font-serif text-3xl text-stone-900">
              Coming soon
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-600">
              {course.description}
            </p>
          </section>
        ) : (
        <div className="mt-5 grid items-start gap-3 md:grid-cols-2">
          {showMakeCode ? (
            <div className="md:col-span-2">
              <BinaryFlipLab />
            </div>
          ) : null}

          {course.ideEmbedUrl || course.ideUrl ? (
            <section
              className="ua-card ua-shadow-soft overflow-hidden p-5 md:col-span-2"
              aria-labelledby="ide-heading"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-white"
                  aria-hidden="true"
                >
                  <Code2 size={24} strokeWidth={2} />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                    {course.idePlatform ?? "Code editor"}
                  </p>
                  <h2
                    id="ide-heading"
                    className="font-serif text-2xl text-stone-900"
                  >
                    Java IDE
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-sm text-stone-700">
                Write, compile, and run Java right here — or open the full editor
                in a new tab.
              </p>
              {course.ideEmbedUrl ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                  <div className="h-[32rem] w-full">
                    <iframe
                      src={course.ideEmbedUrl}
                      title={`${course.title} Java IDE`}
                      className="h-full w-full border-0"
                      allow="clipboard-read; clipboard-write"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              ) : null}
              {course.ideUrl ? (
                <a
                  href={course.ideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open the ${
                    course.idePlatform ?? "online"
                  } Java editor for ${course.title} in a new tab`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
                >
                  {`Open ${course.idePlatform ?? "IDE"} ↗`}
                </a>
              ) : null}
            </section>
          ) : null}

          {showOnlineJava ? <JavaDataTypesLab /> : null}

          {course.slug === "calculus-h-d" ? (
            <>
              <LimitsApproachingLazy />
              <p className="text-center text-sm md:col-span-2">
                <Link
                  href="/tools/limits-approaching/"
                  className="font-medium text-[var(--ua-evergreen)] hover:underline"
                >
                  Open this lesson on its own page
                </Link>
              </p>
            </>
          ) : null}

          {course.slug === "calculus-h-d" ? (
            <ArchivedInteractives>
              <CarRateLessonLazy />
              <p className="text-center text-sm">
                <Link
                  href="/tools/average-and-instantaneous-rates/"
                  className="font-medium text-[var(--ua-evergreen)] hover:underline"
                >
                  Open the average-rate lesson on its own page
                </Link>
              </p>
              <AverageToInstantaneousLazy />
              <p className="text-center text-sm">
                <Link
                  href="/tools/average-to-instantaneous/"
                  className="font-medium text-[var(--ua-evergreen)] hover:underline"
                >
                  Open the runner activity on its own page
                </Link>
              </p>
              <SeeTheSecantLine />
              <section
                className="md:col-span-2"
                aria-label="UA Function Garden"
              >
                <FunctionGardenLazy embedded />
                <p className="mt-2 text-center text-sm">
                  <Link
                    href="/tools/function-garden/"
                    className="font-medium text-[var(--ua-evergreen)] hover:underline"
                  >
                    Open UA Function Garden on its own page
                  </Link>
                </p>
              </section>
              <section
                id="where-calculus-goes-next"
                className="mt-8 scroll-mt-24 md:col-span-2 md:mt-10"
                aria-label="Where Calculus Goes Next"
              >
                <WhereCalculusGoesNextLazy />
              </section>
              <section
                id="closing-the-gap"
                className="mt-8 scroll-mt-24 md:col-span-2 md:mt-10"
                aria-label="Closing the Gap"
              >
                <ClosingTheGapLazy />
              </section>
            </ArchivedInteractives>
          ) : null}

          {course.slug.startsWith("calculus") && course.slug !== "calculus-h-d" ? (
            <SeeTheSecantLine />
          ) : null}

          {course.slug.startsWith("calculus") && course.slug !== "calculus-h-d" ? (
            <section
              className="md:col-span-2"
              aria-label="UA Function Garden"
            >
              <FunctionGardenLazy embedded />
              <p className="mt-2 text-center text-sm">
                <Link
                  href="/tools/function-garden/"
                  className="font-medium text-[var(--ua-evergreen)] hover:underline"
                >
                  Open UA Function Garden on its own page
                </Link>
              </p>
            </section>
          ) : null}

          {course.slug.startsWith("calculus") && course.slug !== "calculus-h-d" ? (
            <>
              <section
                id="where-calculus-goes-next"
                className="mt-8 scroll-mt-24 md:col-span-2 md:mt-10"
                aria-label="Where Calculus Goes Next"
              >
                <WhereCalculusGoesNextLazy />
              </section>
              <section
                id="closing-the-gap"
                className="mt-8 scroll-mt-24 md:col-span-2 md:mt-10"
                aria-label="Closing the Gap"
              >
                <ClosingTheGapLazy />
              </section>
            </>
          ) : null}

          <section
            className="ua-card ua-shadow-soft flex h-full flex-col p-5"
            aria-labelledby="entry-ticket-heading"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-xs font-bold text-white"
                aria-hidden="true"
              >
                ET
              </span>
              <div>
                <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                  Start of class
                </p>
                <h2
                  id="entry-ticket-heading"
                  className="font-serif text-2xl text-stone-900"
                >
                  Entry Ticket
                </h2>
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
              <Image
                src="/media/entry-ticket/banner.png"
                alt="Entry Ticket — Think, Share, Grow"
                width={1024}
                height={341}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
            {course.googleClassroomUrl ? (
              <a
                href={course.googleClassroomUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Complete today's entry ticket for ${course.title} in Google Classroom`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
              >
                Complete Entry Ticket ↗
              </a>
            ) : (
              <p className="mt-4 rounded-full bg-emerald-50 px-5 py-3 text-center text-sm font-semibold text-stone-500">
                Posted at the start of class.
              </p>
            )}
          </section>

          <section
            className="ua-card ua-shadow-soft flex h-full flex-col p-5"
            aria-labelledby="student-profile-heading"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-white"
                aria-hidden="true"
              >
                <ClipboardList size={24} strokeWidth={2} />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                  Getting started
                </p>
                <h2
                  id="student-profile-heading"
                  className="font-serif text-2xl text-stone-900"
                >
                  Student Passions, Interest &amp; Learning Profile
                </h2>
              </div>
            </div>
            <p className="mt-3 text-sm text-stone-700">
              Tell me about your passions, interests, and how you learn best.
            </p>
            <a
              href={STUDENT_PROFILE_SURVEY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open the Student Passions, Interest & Learning Profile survey for ${course.title} in a new tab`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
            >
              Open the survey ↗
            </a>
          </section>

          {course.summerWorkUrl ? (
            <section
              className="ua-card ua-shadow-soft flex h-full flex-col p-5"
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
              <p className="mt-3 text-sm text-stone-700">
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

          {course.slug.startsWith("calculus") ? (
            <section
              className="ua-card ua-shadow-soft flex h-full flex-col p-5"
              aria-labelledby="scholarship-heading"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-white"
                  aria-hidden="true"
                >
                  <Award size={24} strokeWidth={2} />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                    Opportunities
                  </p>
                  <h2
                    id="scholarship-heading"
                    className="font-serif text-2xl text-stone-900"
                  >
                    Scholarship
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-sm text-stone-700">
                Open the Calculus Honors scholarship information.
              </p>
              <a
                href={CALCULUS_SCHOLARSHIP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open the scholarship document for ${course.title} in a new tab`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
              >
                Open Scholarship ↗
              </a>
            </section>
          ) : null}

          {course.googleClassroomUrl && course.googleClassroomCode ? (
            <section
              className="ua-card ua-shadow-soft flex h-full flex-col p-5"
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

          {course.sectionCode ? (
            <section
              className="ua-card ua-shadow-soft flex h-full flex-col p-5"
              aria-labelledby="section-code-heading"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-white"
                  aria-hidden="true"
                >
                  <KeyRound size={24} strokeWidth={2} />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                    {course.sectionPlatform ?? "Class platform"}
                  </p>
                  <h2
                    id="section-code-heading"
                    className="font-serif text-2xl text-stone-900"
                  >
                    Join your section
                  </h2>
                </div>
              </div>
              {course.sectionJoinUrl ? (
                <a
                  href={course.sectionJoinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Join the ${
                    course.sectionPlatform ?? "class"
                  } section for ${course.title}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
                >
                  {`Open ${course.sectionPlatform ?? "platform"} ↗`}
                </a>
              ) : null}
              <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3">
                <p className="text-xs font-semibold text-stone-600 uppercase">
                  Section code
                </p>
                <p className="mt-1 font-mono text-2xl font-bold tracking-[0.12em] text-[var(--ua-evergreen)]">
                  {course.sectionCode}
                </p>
              </div>
            </section>
          ) : null}

          {showMakeCode ? (
            <section
              className="ua-card ua-shadow-soft flex h-full flex-col p-5"
              aria-labelledby="makecode-heading"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-white"
                  aria-hidden="true"
                >
                  <Gamepad2 size={24} strokeWidth={2} />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                    Game coding
                  </p>
                  <h2
                    id="makecode-heading"
                    className="font-serif text-2xl text-stone-900"
                  >
                    MakeCode Arcade
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-sm text-stone-700">
                Open the MakeCode Arcade editor to build games for class.
              </p>
              <a
                href={MAKECODE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open MakeCode Arcade for ${course.title}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
              >
                Open MakeCode Arcade ↗
              </a>
            </section>
          ) : null}

          {showOnlineJava ? (
            <section
              className="ua-card ua-shadow-soft flex h-full flex-col p-5"
              aria-labelledby="online-java-heading"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-white"
                  aria-hidden="true"
                >
                  <Code2 size={24} strokeWidth={2} />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                    Practice coding
                  </p>
                  <h2
                    id="online-java-heading"
                    className="font-serif text-2xl text-stone-900"
                  >
                    Online Java
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-sm text-stone-700">
                Write and run Java in the browser for class practice.
              </p>
              <a
                href={ONLINE_JAVA_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open Online Java for ${course.title}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
              >
                Open Online Java ↗
              </a>
            </section>
          ) : null}

          {course.apJoinCode ? (
            <section className="ua-card ua-shadow-soft flex h-full flex-col p-5">
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
              className="ua-card ua-shadow-soft flex h-full flex-col p-5"
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
              <p className="mt-3 text-sm text-stone-700">
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
              className="ua-card ua-shadow-soft flex h-full flex-col p-5"
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

          {course.challengeVideoEmbedUrl ? (
            <section
              className="ua-card ua-shadow-soft flex h-full flex-col p-5"
              aria-labelledby="challenge-video-heading"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-white"
                  aria-hidden="true"
                >
                  <Film size={24} strokeWidth={2} />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                    Calculus Challenge
                  </p>
                  <h2
                    id="challenge-video-heading"
                    className="font-serif text-2xl text-stone-900"
                  >
                    Sample video
                  </h2>
                </div>
              </div>
              <div className="mx-auto mt-3 w-full max-w-[14rem] overflow-hidden rounded-2xl border border-stone-200 bg-black">
                <div className="aspect-[9/16] w-full">
                  <iframe
                    src={course.challengeVideoEmbedUrl}
                    title={`${course.title} challenge sample video`}
                    className="h-full w-full border-0"
                    allow="autoplay; encrypted-media; fullscreen"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
              {course.challengeVideoUrl ? (
                <a
                  href={course.challengeVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch the calculus challenge sample video for ${course.title} on TikTok`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
                >
                  Watch on TikTok ↗
                </a>
              ) : null}
            </section>
          ) : null}

          {/* Academic classes only (omit Study Hall). Paste Share → Embed into gammaEmbedSrc + docs into gammaUrl. */}
          {course.googleClassroomUrl ? (
            <section
              className="ua-card ua-shadow-soft overflow-hidden p-5 md:col-span-2"
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
              {course.gammaUrl ? (
                <a
                  href={course.gammaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open class presentation for ${course.title} in a new tab`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
                >
                  Open presentation ↗
                </a>
              ) : null}

              {course.presentations?.map((deck) => (
                <div key={deck.url} className="mt-6">
                  {deck.label ? (
                    <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                      {deck.label}
                    </p>
                  ) : null}
                  <div className="mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                    <div className="aspect-video min-h-[12rem] w-full">
                      <iframe
                        src={deck.embedSrc}
                        title={deck.title ?? `${course.title} presentation`}
                        className="h-full w-full border-0"
                        allow="fullscreen"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                  <a
                    href={deck.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${
                      deck.label ?? "presentation"
                    } for ${course.title} in a new tab`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
                  >
                    Open presentation ↗
                  </a>
                </div>
              ))}
            </section>
          ) : null}

          <section
            className="ua-card ua-shadow-soft mx-auto flex w-full max-w-[18rem] flex-col p-4 md:col-span-2"
            aria-labelledby="stretch-heading"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-xs font-bold text-white"
                aria-hidden="true"
              >
                5m
              </span>
              <div>
                <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                  Start of class
                </p>
                <h2
                  id="stretch-heading"
                  className="font-serif text-xl text-stone-900"
                >
                  5-Minute Stretch
                </h2>
              </div>
            </div>
            <div className="mx-auto mt-3 aspect-square w-full max-w-[14rem] overflow-hidden rounded-xl border border-stone-200 bg-black">
              <iframe
                src={STRETCH_EMBED_URL}
                title="5-Minute Stretch"
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <a
              href={STRETCH_WATCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the 5-minute stretch video on YouTube"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
            >
              Open on YouTube ↗
            </a>
          </section>
        </div>
        )}

        <footer className="mt-5 flex items-center justify-between border-t border-stone-300 pt-3 text-sm">
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
      </CoursePasscodeGate>
    </main>
  );
}
