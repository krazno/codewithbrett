import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f4ec_0%,#eef5ef_55%,#f7f4ec_100%)]">
      <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
        <Link
          href="/"
          className="text-sm font-medium text-[var(--ua-evergreen)] hover:underline"
        >
          ← Back to classes
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
            Ursuline Academy
          </p>
          <h1 className="mt-2 font-serif text-4xl text-stone-900 sm:text-5xl">
            {course.title}
          </h1>
          <p className="mt-2 text-stone-600">
            {course.room}
            {course.scheduleNote ? ` · ${course.scheduleNote}` : ""}
          </p>
          <p className="mt-4 leading-relaxed text-stone-700">
            {course.description}
          </p>
        </header>

        {course.apJoinCode ? (
          <section className="ua-card ua-shadow-soft mt-8 p-6">
            <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
              College Board · My AP
            </p>
            <h2 className="mt-2 font-serif text-2xl text-stone-900">
              Join this AP section
            </h2>
            <div className="mt-4 rounded-xl bg-emerald-50 px-5 py-4">
              <p className="text-xs font-semibold text-stone-600 uppercase">
                Join code
              </p>
              <p className="mt-1 font-mono text-3xl font-bold tracking-[0.18em] text-[var(--ua-evergreen)]">
                {course.apJoinCode}
              </p>
            </div>
            <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-stone-700">
              <li>Sign in to My AP with your College Board account.</li>
              <li>Select “Join a Course or Exam.”</li>
              <li>Enter the join code above and confirm your class section.</li>
            </ol>
            <a
              href="https://myap.collegeboard.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-full bg-[var(--ua-evergreen)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b4a33]"
            >
              Open My AP ↗
            </a>
          </section>
        ) : null}

        <p className="mt-10 text-center text-xs text-stone-500">
          Faith · Courage · Joy · Serviam
        </p>
      </div>
    </main>
  );
}
