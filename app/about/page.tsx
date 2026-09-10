import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PhotoCarousel } from "../components/PhotoCarousel";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "@/app/lib/site";

const aboutTitle = "About Brett Hannan";
const aboutDescription =
  "Brett Hannan teaches computer science and mathematics at Ursuline Academy Dedham — AP CSP, AP CSA, Calculus Honors, AI literacy, and classroom innovation.";

export const metadata: Metadata = {
  title: aboutTitle,
  description: aboutDescription,
  alternates: { canonical: "/about/" },
  openGraph: {
    type: "profile",
    siteName: SITE_NAME,
    title: `${aboutTitle} · ${SITE_NAME}`,
    description: aboutDescription,
    url: "/about/",
    images: [
      DEFAULT_OG_IMAGE,
      {
        url: "/media/branded/brett-hannan.png",
        width: 220,
        height: 285,
        alt: "Brett Hannan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${aboutTitle} · ${SITE_NAME}`,
    description: aboutDescription,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/about/#person`,
  name: "Brett Hannan",
  url: `${SITE_URL}/about/`,
  image: `${SITE_URL}/media/branded/brett-hannan.png`,
  jobTitle: "Computer Science and Mathematics Teacher",
  email: "bhannan@ursulineacademy.net",
  worksFor: {
    "@type": "EducationalOrganization",
    name: "Ursuline Academy",
    url: "https://www.ursulineacademy.net/",
  },
};

const experience = [
  "Centner Academy · Miami, FL — Director of Artificial Intelligence & Innovation; Robotics Coach & Founder",
  "The Greene School · West Palm Beach, FL — Computer Science Teacher; Chief Innovation Officer & Founder",
  "The Sage School · Foxborough, MA — Computer Science and Mathematics Teacher",
  "Naval Undersea Warfare Center · Newport, RI — Software Engineering",
];

const education = [
  "M.S. in Computation Sciences",
  "B.S. in Software Engineering",
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

const publications: ReactNode[] = [
  "Applying Big Data Analytics in Bioinformatics and Medicine (2017)",
  "Focus on Healthful Fats and Diet Patterns (2017)",
  <>
    iHANDS: Intelligent Health Advising and Decision-Support Agent — IEEE/WI-IAT
    Conference (2014) ·{" "}
    <a
      href="https://doi.org/10.1109/WI-IAT.2014.180"
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-[var(--ua-evergreen)] underline underline-offset-4"
    >
      View IEEE publication ↗
    </a>
  </>,
  "Featured in Palm Beach Post, South Florida Science Center, NASA Education, and MIT Media Lab pieces on classroom innovation and robotics",
];

const summerProjects: ReactNode[] = [
  <a
    key="swimming"
    href="https://newenglandswimmingholes.com"
    target="_blank"
    rel="noopener noreferrer"
    className="font-semibold text-[var(--ua-evergreen)] underline underline-offset-4"
  >
    New England Swimming Holes ↗
  </a>,
  <a
    key="farm"
    href="https://newenglandfarmguide.com"
    target="_blank"
    rel="noopener noreferrer"
    className="font-semibold text-[var(--ua-evergreen)] underline underline-offset-4"
  >
    New England Farm Guide ↗
  </a>,
];

const catPhotos = [
  {
    src: "/media/about/cat/business-cat.jpg",
    alt: "A black cat wearing a white collar and striped necktie at a desk behind a keyboard",
  },
  {
    src: "/media/about/cat/yoga-mat.jpg",
    alt: "A black cat lounging on an orange yoga mat with a waterfront view behind",
  },
  {
    src: "/media/about/cat/sleeping-white-bed.jpg",
    alt: "A black cat with white whiskers sleeping on a white quilted bedspread",
  },
  {
    src: "/media/about/cat/sleeping-skyline.jpg",
    alt: "A black cat sleeping in sunlight on a bed with a water and city skyline view",
  },
] as const;

const lifePhotos = [
  {
    src: "/media/about/brett/graffiti-wall.jpg",
    alt: "Brett Hannan with friends posing playfully in front of a colorful graffiti mural",
  },
  {
    src: "/media/about/brett/friends-hedge.jpg",
    alt: "Brett Hannan with two friends, arms around each other, in front of a green hedge",
  },
  {
    src: "/media/about/brett/robotics-students.jpg",
    alt: "Brett Hannan with a student robotics team at an event",
  },
  {
    src: "/media/about/brett/umass-graduation.jpg",
    alt: "Brett Hannan at his University of Massachusetts Dartmouth graduation with family",
  },
  {
    src: "/media/about/brett/umass-friends.jpg",
    alt: "Brett Hannan smiling with friends indoors, wearing a UMass Dartmouth shirt",
  },
  {
    src: "/media/about/brett/robotics-mentoring.jpg",
    alt: "Brett Hannan talking with a student robotics team",
  },
  {
    src: "/media/about/brett/bridge-city.jpg",
    alt: "Brett Hannan in a blue jacket and sunglasses by a stone bridge overlooking a city",
  },
] as const;

function ListCard({
  title,
  items,
}: {
  title: string;
  items: readonly ReactNode[];
}) {
  return (
    <section className="ua-card ua-shadow-soft p-6">
      <h2 className="font-serif text-2xl text-stone-900">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-700">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2">
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
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
          <ListCard title="Prior roles" items={experience} />
          <ListCard title="Education" items={education} />
          <ListCard
            title="Publications, research, and media"
            items={publications}
          />
          <ListCard title="Recent summer projects" items={summerProjects} />

          <ListCard title="Awards" items={awards} />
          <ListCard title="Clubs & memberships" items={memberships} />

          <section
            className="ua-card ua-shadow-soft grid gap-4 p-4 sm:p-5 md:col-span-2 md:grid-cols-2"
            aria-label="Photo galleries"
          >
            <PhotoCarousel
              photos={lifePhotos}
              label="Photos from life and work"
            />
            <PhotoCarousel photos={catPhotos} label="Photos of a black cat" />
          </section>
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
