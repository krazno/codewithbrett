import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClassGate } from "@/app/components/ClassGate";
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

  const classroomReady = course.googleClassroomUrl !== "#";
  const syllabusReady = course.syllabusUrl !== "#";

  return (
    <ClassGate
      courseSlug={course.slug}
      courseTitle={course.title}
      passcode={course.passcode}
    >
      <main className="min-h-screen bg-[linear-gradient(180deg,#f7f4ec_0%,#eef5ef_55%,#f7f4ec_100%)]">
        <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--ua-evergreen)] hover:underline"
          >
            ← Code with Brett
          </Link>

          <header className="mt-6">
            <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
              Ursuline Academy · Class hub
            </p>
            <h1 className="mt-2 font-serif text-4xl text-stone-900 sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-2 text-stone-600">
              {course.room}
              {course.scheduleNote ? ` · ${course.scheduleNote}` : ""}
            </p>
          </header>

          <section className="ua-card ua-shadow-soft mt-8 space-y-3 p-5">
            <h2 className="font-serif text-xl text-stone-900">Quick links</h2>
            <p className="text-sm text-stone-600">
              Classroom and syllabus links will land here. For now these are
              placeholders.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {classroomReady ? (
                <a
                  href={course.googleClassroomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b4a33]"
                >
                  Google Classroom
                </a>
              ) : (
                <span className="inline-flex items-center justify-center rounded-full border border-dashed border-[rgba(32,37,34,0.25)] px-5 py-2.5 text-sm text-stone-500">
                  Google Classroom · coming soon
                </span>
              )}
              {syllabusReady ? (
                <a
                  href={course.syllabusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(32,37,34,0.2)] bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
                >
                  Syllabus
                </a>
              ) : (
                <span className="inline-flex items-center justify-center rounded-full border border-dashed border-[rgba(32,37,34,0.25)] px-5 py-2.5 text-sm text-stone-500">
                  Syllabus · coming soon
                </span>
              )}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-[rgba(32,37,34,0.1)] bg-white/70 p-5">
            <h2 className="font-serif text-lg text-stone-900">Class media</h2>
            <p className="mt-1 text-sm text-stone-600">
              Images for this class will live in{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">
                /media/classes/{course.slug}/
              </code>
            </p>
          </section>

          <p className="mt-10 text-center text-xs text-stone-500">
            Faith · Courage · Joy · Serviam
          </p>
        </div>
      </main>
    </ClassGate>
  );
}
