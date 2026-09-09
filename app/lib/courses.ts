export type Course = {
  slug: string;
  title: string;
  room: string;
  scheduleNote?: string;
  description: string;
  image: string;
  seal?: string;
  googleClassroomCode?: string;
  googleClassroomUrl?: string;
  googleMeetUrl?: string;
  syllabusUrl?: string;
  summerWorkUrl?: string;
  apJoinCode?: string;
  /**
   * Gamma public embed URL from Share → Embed (e.g. https://gamma.app/embed/…).
   * Leave undefined until a deck is ready; the class page still shows a slot.
   */
  gammaEmbedSrc?: string;
  /** Gamma Share / docs URL for “Open presentation” (e.g. https://gamma.app/docs/…). */
  gammaUrl?: string;
  /** Optional accessible title for the Gamma iframe (defaults to “Class Presentation”). */
  gammaEmbedTitle?: string;
  textbook?: {
    title: string;
    url: string;
    note: string;
  };
  resources?: {
    title: string;
    url: string;
    category: "Supplemental" | "Supplemental & story reading";
  }[];
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
    image: "/media/classes/ap-csp-b/seal.png",
    seal: "/media/classes/ap-csp-b/seal.png",
    googleClassroomCode: "7n676v2o",
    googleClassroomUrl:
      "https://classroom.google.com/c/ODc4MjcwNDk2Mzk5?cjc=7n676v2o",
    googleMeetUrl: "https://meet.google.com/weu-wncf-uxm",
    syllabusUrl:
      "https://docs.google.com/document/d/1yJIb8zwbEaQzgO7xT8VamcOliQnA1Z-s/edit?usp=sharing",
    summerWorkUrl:
      "https://drive.google.com/file/d/1MHy2unu6ZNfZAK9pGB-Ur123fRdGqR0a/view?usp=sharing",
    apJoinCode: "Y3LEZM",
    gammaEmbedSrc: "https://gamma.app/embed/yf84iuczscacr6s",
    gammaUrl: "https://gamma.app/docs/Welcome-to-yf84iuczscacr6s",
    gammaEmbedTitle: "Welcome to AP CSP",
    textbook: {
      title: "OpenStax Introduction to Computer Science",
      url: "https://openstax.org/books/introduction-computer-science/pages/1-introduction",
      note: "Primary digital textbook",
    },
    resources: [
      {
        title: "Blown to Bits, 2nd Edition",
        url: "https://www.pearson.com/en-us/subject-catalog/p/blown-to-bits-your-life-liberty-and-happiness-after-the-digital-explosion/P200000000091/9780137460168",
        category: "Supplemental",
      },
      {
        title: "The Machine Stops",
        url: "https://www.gutenberg.org/ebooks/72890",
        category: "Supplemental & story reading",
      },
    ],
  },
  {
    slug: "ap-csp-f",
    title: "AP CSP (F)",
    room: "Rm A207",
    scheduleNote: "Block F",
    description:
      "AP Computer Science Principles. Data, the internet, and creative coding for the AP exam—Block F section.",
    image: "/media/classes/ap-csp-f/seal.png",
    seal: "/media/classes/ap-csp-f/seal.png",
    googleClassroomCode: "wbujhmtr",
    googleClassroomUrl:
      "https://classroom.google.com/c/ODc4MjcwMDE5Nzc4?cjc=wbujhmtr",
    googleMeetUrl: "https://meet.google.com/pmq-gxvg-bmg",
    syllabusUrl:
      "https://docs.google.com/document/d/1yJIb8zwbEaQzgO7xT8VamcOliQnA1Z-s/edit?usp=sharing",
    summerWorkUrl:
      "https://drive.google.com/file/d/1MHy2unu6ZNfZAK9pGB-Ur123fRdGqR0a/view?usp=sharing",
    apJoinCode: "G22APR",
    gammaEmbedSrc: "https://gamma.app/embed/yf84iuczscacr6s",
    gammaUrl: "https://gamma.app/docs/Welcome-to-yf84iuczscacr6s",
    gammaEmbedTitle: "Welcome to AP CSP",
    textbook: {
      title: "OpenStax Introduction to Computer Science",
      url: "https://openstax.org/books/introduction-computer-science/pages/1-introduction",
      note: "Primary digital textbook",
    },
    resources: [
      {
        title: "Blown to Bits, 2nd Edition",
        url: "https://www.pearson.com/en-us/subject-catalog/p/blown-to-bits-your-life-liberty-and-happiness-after-the-digital-explosion/P200000000091/9780137460168",
        category: "Supplemental",
      },
      {
        title: "The Machine Stops",
        url: "https://www.gutenberg.org/ebooks/72890",
        category: "Supplemental & story reading",
      },
    ],
  },
  {
    slug: "calculus-h-d",
    title: "Calculus H (D)",
    room: "Rm 118",
    scheduleNote: "Block D",
    description:
      "Honors calculus. Limits, derivatives, and integrals, with more challenge and pace.",
    image: "/media/classes/calculus-h-d/seal.png",
    seal: "/media/classes/calculus-h-d/seal.png",
    googleClassroomCode: "kv3shxpx",
    googleClassroomUrl:
      "https://classroom.google.com/c/ODc4MjcyODE4NTE5?cjc=kv3shxpx",
    googleMeetUrl: "https://meet.google.com/umt-zodc-mck",
    syllabusUrl:
      "https://docs.google.com/document/d/1QI5PtjlFoUx-HpBcj-3TDQkT7VhTzsOL/edit?usp=sharing",
    summerWorkUrl:
      "https://drive.google.com/file/d/1pdug9Ckuy4AdxfaVg0en345NslyCkPa1/view?usp=sharing",
    gammaEmbedSrc: "https://gamma.app/embed/fspy3bsk7zfi634",
    gammaUrl:
      "https://gamma.app/docs/Welcome-to-Calculus-Honors-fspy3bsk7zfi634",
    gammaEmbedTitle: "Welcome to Calculus Honors",
    textbook: {
      title: "OpenStax Calculus Volume 1",
      url: "https://openstax.org/books/calculus-volume-1/pages/1-introduction",
      note: "Primary digital textbook",
    },
    resources: [
      {
        title: "Calculus Made Easy",
        url: "https://www.gutenberg.org/ebooks/33283",
        category: "Supplemental",
      },
      {
        title: "Katherine Johnson: A Lifetime of STEM",
        url: "https://www.nasa.gov/learning-resources/katherine-johnson-a-lifetime-of-stem/",
        category: "Supplemental & story reading",
      },
      {
        title: "Sofia Kovalevskaya",
        url: "https://mathshistory.st-andrews.ac.uk/Biographies/Kovalevskaya/",
        category: "Supplemental & story reading",
      },
    ],
  },
  {
    slug: "calculus-h-e",
    title: "Calculus H (E)",
    room: "Rm 118",
    scheduleNote: "Block E",
    description:
      "Honors calculus. Limits, derivatives, and integrals with rigor and pace for Block E.",
    image: "/media/classes/calculus-h-e/seal.png",
    seal: "/media/classes/calculus-h-e/seal.png",
    googleClassroomCode: "cwq6rxo6",
    googleClassroomUrl:
      "https://classroom.google.com/c/ODc4MjcwMzkyOTU4?cjc=cwq6rxo6",
    googleMeetUrl: "https://meet.google.com/ctu-npkv-aoj",
    syllabusUrl:
      "https://docs.google.com/document/d/1QI5PtjlFoUx-HpBcj-3TDQkT7VhTzsOL/edit?usp=sharing",
    summerWorkUrl:
      "https://drive.google.com/file/d/1pdug9Ckuy4AdxfaVg0en345NslyCkPa1/view?usp=sharing",
    gammaEmbedSrc: "https://gamma.app/embed/fspy3bsk7zfi634",
    gammaUrl:
      "https://gamma.app/docs/Welcome-to-Calculus-Honors-fspy3bsk7zfi634",
    gammaEmbedTitle: "Welcome to Calculus Honors",
    textbook: {
      title: "OpenStax Calculus Volume 1",
      url: "https://openstax.org/books/calculus-volume-1/pages/1-introduction",
      note: "Primary digital textbook",
    },
    resources: [
      {
        title: "Calculus Made Easy",
        url: "https://www.gutenberg.org/ebooks/33283",
        category: "Supplemental",
      },
      {
        title: "Katherine Johnson: A Lifetime of STEM",
        url: "https://www.nasa.gov/learning-resources/katherine-johnson-a-lifetime-of-stem/",
        category: "Supplemental & story reading",
      },
      {
        title: "Sofia Kovalevskaya",
        url: "https://mathshistory.st-andrews.ac.uk/Biographies/Kovalevskaya/",
        category: "Supplemental & story reading",
      },
    ],
  },
  {
    slug: "ap-csa-h",
    title: "AP CSA (H)",
    room: "Rm 118",
    scheduleNote: "Block H",
    description:
      "AP Computer Science A. Java programming and problem solving for the AP CSA exam.",
    image: "/media/classes/ap-csa-h/seal.png",
    seal: "/media/classes/ap-csa-h/seal.png",
    googleClassroomCode: "ahdo734n",
    googleClassroomUrl:
      "https://classroom.google.com/c/ODc4MjY4MDQyMTg3?cjc=ahdo734n",
    googleMeetUrl: "https://meet.google.com/dqo-mwho-hni",
    syllabusUrl:
      "https://docs.google.com/document/d/1H1YdzHNvq0xnf7qhqEe9SrOX40oBJSkP/edit?usp=sharing",
    summerWorkUrl:
      "https://drive.google.com/file/d/11Wuja7oinHxfxkHBMVnBEBgjvq4cQTby/view?usp=sharing",
    apJoinCode: "7QXGY7",
    textbook: {
      title: "CSAwesome2: AP CSA Java 2026+",
      url: "https://runestone.academy/ns/books/published/csawesome2/csawesome2.html?mode=browsing",
      note: "Primary digital textbook · AP-authorized · CSAwesome approved",
    },
    resources: [
      {
        title: "Think Java, 2nd Edition",
        url: "https://greenteapress.com/wp/think-java-2e/",
        category: "Supplemental",
      },
    ],
  },
  {
    slug: "study-hall",
    title: "Study Hall (A)",
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
