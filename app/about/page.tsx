import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Mr. Hannan",
  description:
    "About Brett Hannan, Computer Science and Mathematics teacher at Ursuline Academy Dedham.",
  alternates: { canonical: "/about/" },
};

const experience = [
  "Centner Academy · Miami, FL — Director of Artificial Intelligence & Innovation; Robotics Coach & Founder",
  "The Greene School · West Palm Beach, FL — Computer Science Teacher; Chief Innovation Officer & Founder",
  "The Sage School · Foxborough, MA — Computer Science and Mathematics Teacher",
  "Naval Undersea Warfare Center · Newport, RI — Software Engineering",
];

const awards = [
  "Governor’s Proclamation for STEAM Education",
  "South Florida Business Visionary Award",
  "NASA Education Recognition for Maker Space Innovation",
  "Best Robotics Coach in South Florida",
];

const memberships = [
  "MagicSchool AI Ambassador",
  "LEGO Education Ambassador",
  "Amazon Future Engineer Teacher Ambassador",
  "MIT Media Lab Ambassador",
];

function ListCard({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <section className="ua-card ua-shadow-soft p-6">
      <h2 className="font-serif text-2xl text-stone-900">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-emerald-700" aria-hidden="true">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f4ec_0%,#eef5ef_55%,#f7f4ec_100%)]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-10">
        <header className="ua-shadow-soft overflow-hidden rounded-3xl bg-[var(--ua-evergreen)] text-white">
          <div className="relative aspect-[4/1] min-h-36">
            <Image
              src="/media/branded/campus-entrance.png"
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-5 px-6 py-5 sm:px-10">
            <Image
              src="/media/branded/brett-hannan.png"
              alt="Brett Hannan"
              width={104}
              height={104}
              className="h-24 w-24 shrink-0 rounded-full border-4 border-white object-cover shadow-lg"
              priority
            />
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-emerald-100 uppercase">
                Ursuline Academy Dedham
              </p>
              <h1 className="mt-1 font-serif text-4xl sm:text-5xl">
                Brett Hannan
              </h1>
              <p className="mt-1 text-sm text-white/85">
                Computer Science &amp; Mathematics
              </p>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <ListCard title="Prior roles" items={experience} />
          </div>

          <div className="md:col-span-2">
            <ListCard
              title="Education"
              items={[
                "M.S. in Computation Sciences · UMass Dartmouth",
                "B.S. in Software Engineering · UMass Dartmouth",
              ]}
            />
          </div>

          <section className="ua-card ua-shadow-soft p-6 md:col-span-2">
            <h2 className="font-serif text-2xl text-stone-900">
              Publications, research, and media
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-700">
              <li className="flex gap-2">
                <span className="text-emerald-700" aria-hidden="true">
                  •
                </span>
                <span>
                  Applying Big Data Analytics in Bioinformatics and Medicine
                  (2017)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-700" aria-hidden="true">
                  •
                </span>
                <span>Focus on Healthful Fats and Diet Patterns (2017)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-700" aria-hidden="true">
                  •
                </span>
                <span>
                  iHANDS: Intelligent Health Advising and Decision-Support
                  Agent — IEEE/WI-IAT Conference (2014) ·{" "}
                  <a
                    href="https://doi.org/10.1109/WI-IAT.2014.180"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[var(--ua-evergreen)] underline underline-offset-4"
                  >
                    View IEEE publication ↗
                  </a>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-700" aria-hidden="true">
                  •
                </span>
                <span>
                  Featured in Palm Beach Post, South Florida Science Center,
                  NASA Education, and MIT Media Lab pieces on classroom
                  innovation and robotics
                </span>
              </li>
            </ul>
          </section>

          <section className="ua-card ua-shadow-soft p-6 md:col-span-2">
            <h2 className="font-serif text-2xl text-stone-900">
              Recent summer projects
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="https://newenglandswimmingholes.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--ua-evergreen)] underline underline-offset-4"
                >
                  New England Swimming Holes ↗
                </a>
              </li>
              <li>
                <a
                  href="https://newenglandfarmguide.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--ua-evergreen)] underline underline-offset-4"
                >
                  New England Farm Guide ↗
                </a>
              </li>
            </ul>
          </section>

          <ListCard title="Awards" items={awards} />
          <ListCard title="Clubs & memberships" items={memberships} />
        </div>

        <footer className="mt-8 flex items-center justify-between gap-4 border-t border-stone-300 pt-4 text-sm">
          <Link
            href="/"
            className="font-semibold text-[var(--ua-evergreen)] underline decoration-emerald-700/30 underline-offset-4"
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
