export type Course = {
  slug: string;
  title: string;
  room: string;
  scheduleNote?: string;
  description: string;
  image: string;
  googleClassroomCode?: string;
  googleClassroomUrl?: string;
  apJoinCode?: string;
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
    image: "/media/orientation/students-at-sign.png",
    googleClassroomCode: "7n676v2o",
    googleClassroomUrl:
      "https://classroom.google.com/c/ODc4MjcwNDk2Mzk5?cjc=7n676v2o",
    apJoinCode: "Y3LEZM",
  },
  {
    slug: "ap-csp-f",
    title: "AP CSP (F)",
    room: "Rm A207",
    scheduleNote: "Block F",
    description:
      "AP Computer Science Principles. Same course as Block B, different period.",
    image: "/media/orientation/students-outdoors.png",
    googleClassroomCode: "wbujhmtr",
    googleClassroomUrl:
      "https://classroom.google.com/c/ODc4MjcwMDE5Nzc4?cjc=wbujhmtr",
    apJoinCode: "G22APR",
  },
  {
    slug: "calculus-h-d",
    title: "Calculus H (D)",
    room: "Rm 118",
    scheduleNote: "Block D",
    description:
      "Honors calculus. Limits, derivatives, and integrals, with more challenge and pace.",
    image: "/media/orientation/campus-aerial.png",
    googleClassroomCode: "kv3shxpx",
    googleClassroomUrl:
      "https://classroom.google.com/c/ODc4MjcyODE4NTE5?cjc=kv3shxpx",
  },
  {
    slug: "calculus-h-e",
    title: "Calculus H (E)",
    room: "Rm 118",
    scheduleNote: "Block E",
    description:
      "Honors calculus. Same course as Block D, different period.",
    image: "/media/orientation/campus-entrance-spring.png",
    googleClassroomCode: "cwq6rxo6",
    googleClassroomUrl:
      "https://classroom.google.com/c/ODc4MjcwMzkyOTU4?cjc=cwq6rxo6",
  },
  {
    slug: "ap-csa-h",
    title: "AP CSA (H)",
    room: "Rm 118",
    scheduleNote: "Block H",
    description:
      "AP Computer Science A. Java programming and problem solving for the AP CSA exam.",
    image: "/media/classes/ap-csa-h/thumb.png",
    googleClassroomCode: "ahdo734n",
    googleClassroomUrl:
      "https://classroom.google.com/c/ODc4MjY4MDQyMTg3?cjc=ahdo734n",
    apJoinCode: "7QXGY7",
  },
  {
    slug: "study-hall",
    title: "Study Hall",
    room: "AH",
    scheduleNote: "Day 4",
    description:
      "A quiet block to get work done. Bring homework from any class and ask if you get stuck.",
    image: "/media/classes/study-hall/thumb.png",
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}
