"use client";

import { useId, useState } from "react";

const PDF_HREF =
  "/artifacts/Calc_Honors_Average_Rate_and_Instantaneous_Rate_Notes.pdf";

const NAVY = "#1B2A4A";
const SECANT = "#2563EB";
const TANGENT = "#15803D";
const HIT =
  "inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

const CARDS: { q: string; a: string }[] = [
  {
    q: "What is an average rate of change?",
    a: "How fast something changes over an interval.\nYou need two inputs.",
  },
  {
    q: "What is an instantaneous rate of change?",
    a: "The rate at one exact moment.",
  },
  {
    q: "Which line is average? Which is instantaneous?",
    a: "Secant → two points → average rate.\nTangent → one moment → instantaneous rate.",
  },
  {
    q: "What is s(2)?",
    a: "s(2) = 4 ft",
  },
  {
    q: "What is s(3)?",
    a: "s(3) = 9 ft",
  },
  {
    q: "Average rate on [2, 3]?",
    a: "(9 − 4) / (3 − 2) = 5 ft/s",
  },
  {
    q: "Average rate on [2, 2.5]?",
    a: "(6.25 − 4) / 0.5 = 4.5 ft/s",
  },
  {
    q: "Average rate on [2, 2.1]?",
    a: "(4.41 − 4) / 0.1 = 4.1 ft/s",
  },
  {
    q: "Average rate on [2, 2.01]?",
    a: "(4.0401 − 4) / 0.01 = 4.01 ft/s",
  },
  {
    q: "What number are 5, 4.5, 4.1, 4.01 approaching?",
    a: "4 ft/s\nThat is the estimated rate at t = 2.",
  },
  {
    q: "Two points → ____ line → ____ rate.",
    a: "Two points → secant → average rate.",
  },
  {
    q: "One moment → ____ line → ____ rate.",
    a: "One moment → tangent → instantaneous rate.",
  },
];

export function CarRateLesson() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = CARDS[i];

  function go(next: number) {
    setI(Math.max(0, Math.min(CARDS.length - 1, next)));
    setFlipped(false);
  }

  return (
    <section
      className="ua-card ua-shadow-soft p-4 sm:p-5 md:col-span-2"
      style={{ background: "#FFFDF8" }}
      aria-labelledby={`${uid}-heading`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-semibold tracking-wide text-emerald-800 uppercase">
            Notes
          </p>
          <h2
            id={`${uid}-heading`}
            className="mt-0.5 font-serif text-2xl"
            style={{ color: NAVY }}
          >
            Average vs Instantaneous
          </h2>
        </div>
        <p className="shrink-0 text-sm font-semibold" style={{ color: NAVY }}>
          {i + 1} / {CARDS.length}
        </p>
      </div>
      <p className="mt-1 text-sm" style={{ color: NAVY }}>
        Car: <span className="font-semibold">s(t) = t²</span> feet after t seconds.
      </p>

      <button
        type="button"
        aria-pressed={flipped}
        className="mt-4 flex min-h-[14rem] w-full flex-col items-center justify-center rounded-2xl border-2 bg-white px-5 py-6 text-center sm:py-8"
        style={{ borderColor: flipped ? TANGENT : "#e7e5e4", color: NAVY }}
        onClick={() => setFlipped((open) => !open)}
      >
        <p className="text-base font-semibold sm:text-lg" style={{ color: NAVY }}>
          s(t) = t²
          <span className="ml-1 font-normal text-stone-500">feet after t seconds</span>
        </p>
        <p
          className="mt-4 text-xs font-semibold tracking-wide uppercase"
          style={{ color: flipped ? TANGENT : SECANT }}
        >
          {flipped ? "Answer" : "Tap to flip"}
        </p>
        <p className="mt-2 font-serif text-2xl leading-snug whitespace-pre-line sm:text-3xl">
          {flipped ? card.a : card.q}
        </p>
      </button>

      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          className={`${HIT} bg-white`}
          style={{ color: NAVY }}
          disabled={i === 0}
          onClick={() => go(i - 1)}
        >
          Back
        </button>
        <button
          type="button"
          className={`${HIT} min-w-[7rem] text-white`}
          style={{ background: NAVY }}
          disabled={i === CARDS.length - 1}
          onClick={() => go(i + 1)}
        >
          Next
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
        {CARDS.map((_, index) => (
          <span
            key={index}
            className="h-2 w-2 rounded-full"
            style={{ background: index === i ? NAVY : "#d6d3d1" }}
          />
        ))}
      </div>

      <p className="mt-4 text-center text-sm">
        <a
          href={PDF_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--ua-evergreen)] hover:underline"
        >
          Notes PDF
        </a>
      </p>
    </section>
  );
}
