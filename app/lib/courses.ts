/** Temporary course config — expand later with real Classroom / syllabus / Meet links. */

export type Course = {
  slug: string;
  title: string;
  room: string;
  scheduleNote?: string;
  /** Temporary simple passcode for class page access */
  passcode: string;
  googleClassroomUrl: string; // placeholder "#" until ready
  syllabusUrl: string; // placeholder "#" until ready
};

export const COURSES: Course[] = [
  {
    slug: "study-hall",
    title: "Study Hall",
    room: "Day 4 · AH",
    scheduleNote: "Day 4 — AH",
    passcode: "SH4",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
  {
    slug: "ap-csp",
    title: "AP CSP",
    room: "Rm A207",
    passcode: "CSP",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
  {
    slug: "calculus",
    title: "Calculus",
    room: "Rm 118",
    passcode: "CALC",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
  {
    slug: "calculus-h",
    title: "Calculus H",
    room: "Rm 118",
    passcode: "CALCH",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
  {
    slug: "ap-csp-a",
    title: "AP CSP A",
    room: "Rm 118",
    passcode: "CSPA",
    googleClassroomUrl: "#",
    syllabusUrl: "#",
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}
