import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tools & Resources",
  description:
    "A concise collection of software resources for writing, coding, and class projects.",
  alternates: { canonical: "/resources/" },
};

const resources = [
  {
    name: "Cursor",
    href: "https://cursor.com/",
    description: "AI-assisted code editor.",
    image: "/media/resources/cursor.svg",
    imageWidth: 56,
    imageHeight: 56,
    textIcon: null,
  },
  {
    name: "Wispr Flow",
    href: "https://wisprflow.ai/",
    description: "Voice dictation for writing and coding.",
    image: "/media/resources/wispr-flow.svg",
    imageWidth: 56,
    imageHeight: 56,
    textIcon: null,
  },
  {
    name: "Eclipse IDE",
    href: "https://www.eclipse.org/ide/",
    description: "Java and software development IDE.",
    image: "/media/resources/eclipse-ide.svg",
    imageWidth: 96,
    imageHeight: 32,
    textIcon: null,
  },
  {
    name: "NotebookLM",
    href: "https://notebooklm.google/",
    description:
      "AI-assisted research and study notebook grounded in your sources.",
    image: null,
    imageWidth: 56,
    imageHeight: 56,
    textIcon: "NLM",
  },
  {
    name: "Google Gems",
    href: "https://gemini.google.com/gems/view",
    description:
      "Create custom Gemini experts for repeatable tasks and guided workflows.",
    image: null,
    imageWidth: 56,
    imageHeight: 56,
    textIcon: "G",
  },
] as const;

export default function ResourcesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-8 sm:px-6 sm:py-10">
      <Link
        href="/"
        className="mb-5 w-fit text-sm font-semibold text-[var(--ua-evergreen)] underline decoration-emerald-800/30 underline-offset-4"
      >
        ← Back to classes
      </Link>

      <header className="ua-card ua-shadow-soft overflow-hidden">
        <div className="grid sm:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
              A practical starting point
            </p>
            <h1 className="mt-1 font-serif text-4xl text-stone-900 sm:text-5xl">
              Tools &amp; Resources
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600">
              A small collection of software for writing, coding, and building
              class projects.
            </p>
          </div>

          <div className="flex min-h-44 items-center justify-center gap-3 bg-gradient-to-br from-[#e9f3ed] via-white to-[#edf0f8] p-6">
            {resources.map((resource) => (
              <div
                key={resource.name}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-200 bg-white p-2.5 shadow-sm sm:h-20 sm:w-20"
              >
                {resource.image ? (
                  <Image
                    src={resource.image}
                    alt={`${resource.name} logo`}
                    width={resource.imageWidth}
                    height={resource.imageHeight}
                    className="max-h-full w-full object-contain"
                  />
                ) : (
                  <span
                    aria-label={resource.name}
                    className="font-serif text-lg font-bold text-stone-700"
                  >
                    {resource.textIcon}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="mt-6" aria-labelledby="software-picks">
        <h2 id="software-picks" className="sr-only">
          Software picks
        </h2>
        <div className="grid gap-4">
          {resources.map((resource) => (
            <article
              key={resource.name}
              className="ua-card flex items-center gap-4 p-5 sm:gap-6 sm:p-6"
            >
              <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white p-2.5">
                {resource.image ? (
                  <Image
                    src={resource.image}
                    alt=""
                    width={resource.imageWidth}
                    height={resource.imageHeight}
                    className="max-h-full w-full object-contain"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="font-serif text-lg font-bold text-stone-700"
                  >
                    {resource.textIcon}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-2xl text-stone-900">
                  {resource.name}
                </h3>
                <p className="mt-1 text-sm text-stone-600">
                  {resource.description}
                </p>
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-sm font-semibold text-[var(--ua-evergreen)] underline decoration-emerald-800/30 underline-offset-4"
                >
                  Visit official site{" "}
                  <span aria-hidden="true" className="ml-1">
                    ↗
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="mt-6 text-center text-xs leading-relaxed text-stone-500">
        Product names and logos belong to their respective owners.
      </p>
    </main>
  );
}
