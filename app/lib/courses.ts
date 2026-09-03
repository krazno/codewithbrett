/** Temporary course config — expand later with real Classroom / syllabus / Meet links. */

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

export const COURSES: Course[] = [
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
  {
    slug: "ap-csp",
    title: "AP CSP",
    room: "Rm A207",
    description:
      "How computers and the internet work, plus writing programs. Built around the AP CSP exam.",
    image: "/media/classes/ap-csp/thumb.png",
    passcode: "CSP",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
  {
    slug: "calculus",
    title: "Calculus",
    room: "Rm 118",
    description:
      "Limits, derivatives, and integrals. We practice a lot so the ideas actually stick.",
    image: "/media/classes/calculus/thumb.png",
    passcode: "CALC",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
  {
    slug: "calculus-h",
    title: "Calculus H",
    room: "Rm 118",
    description:
      "Honors calculus. Same big ideas as Calculus, with a bit more challenge and speed.",
    image: "/media/classes/calculus-h/thumb.png",
    passcode: "CALCH",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
  {
    slug: "ap-csp-a",
    title: "AP CSP A",
    room: "Rm 118",
    description:
      "The AP CSP course as section A. Same material as the A207 class, different period.",
    image: "/media/classes/ap-csp-a/thumb.png",
    passcode: "CSPA",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}
