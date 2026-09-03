/** Temporary course config. Expand later with real Classroom / syllabus / Meet links. */

export type Course = {
  slug: string;
  title: string;
  room: string;
  scheduleNote?: string;
  description: string;
  image: string;
  /** Temporary simple passcode for class page access */
  passcode: string;
  googleClassroomUrl: string; // placeholder "#" until ready
  syllabusUrl: string; // placeholder "#" until ready
};

/**
 * Display order:
 * 1–2 AP CSP (Principles), 3–4 Calculus H, 5 AP CSA, 6 Study Hall
 */
export const COURSES: Course[] = [
  {
    slug: "ap-csp-b",
    title: "AP CSP (B)",
    room: "Rm A207",
    scheduleNote: "Block B",
    description:
      "AP Computer Science Principles. How computers and the internet work, plus writing programs for the AP exam.",
    image: "/media/classes/ap-csp-b/thumb.png",
    passcode: "CSPB",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
  {
    slug: "ap-csp-f",
    title: "AP CSP (F)",
    room: "Rm A207",
    scheduleNote: "Block F",
    description:
      "AP Computer Science Principles. Same course as Block B, different period.",
    image: "/media/classes/ap-csp-f/thumb.png",
    passcode: "CSPF",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
  {
    slug: "calculus-h-d",
    title: "Calculus H (D)",
    room: "Rm 118",
    scheduleNote: "Block D",
    description:
      "Honors calculus. Limits, derivatives, and integrals, with more challenge and pace.",
    image: "/media/classes/calculus-h-d/thumb.png",
    passcode: "CALCD",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
  {
    slug: "calculus-h-e",
    title: "Calculus H (E)",
    room: "Rm 118",
    scheduleNote: "Block E",
    description:
      "Honors calculus. Same course as Block D, different period.",
    image: "/media/classes/calculus-h-e/thumb.png",
    passcode: "CALCE",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
  {
    slug: "ap-csa-h",
    title: "AP CSA (H)",
    room: "Rm 118",
    scheduleNote: "Block H",
    description:
      "AP Computer Science A. Java programming and problem solving for the AP CSA exam.",
    image: "/media/classes/ap-csa-h/thumb.png",
    passcode: "CSAH",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
  {
    slug: "study-hall",
    title: "Study Hall",
    room: "AH",
    scheduleNote: "Day 4",
    description:
      "A quiet block to get work done. Bring homework from any class and ask if you get stuck.",
    image: "/media/classes/study-hall/thumb.png",
    passcode: "SH4",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}
