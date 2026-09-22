"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

const PDF_HREF =
  "/artifacts/Calc_Honors_Average_Rate_and_Instantaneous_Rate_Notes.pdf";

const NAVY = "#1B2A4A";
const BURGUNDY = "#8B2E4A";
const SECANT = "#2563EB";
const TANGENT = "#15803D";
const HIT =
  "inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

const T_MIN = 0.6;
const T_MAX = 3.5;
const S_MIN = 0;
const S_MAX = 13;
const VW = 640;
const VH = 320;
const PAD = { l: 58, r: 22, t: 20, b: 42 };
const PLOT_W = VW - PAD.l - PAD.r;
const PLOT_H = VH - PAD.t - PAD.b;
const P = { t: 2, s: 4 };

type SectionId = 1 | 2 | 3 | 4 | 5 | 6;

type Card = {
  prompt: string;
  hint?: string;
  answerTitle: string;
  answer: string[];
  graph?: "secant" | "tangent" | "shrink";
  b?: number;
  rateReady?: boolean;
};

type ShrinkRow = {
  b: number;
  qLabel: string;
  setup: string;
  rate: string;
};

const SHRINK: ShrinkRow[] = [
  {
    b: 3,
    qLabel: "Q(3, 9)",
    setup: "[s(3) − s(2)] / (3 − 2) = (9 − 4) / 1",
    rate: "5 ft/s",
  },
  {
    b: 2.5,
    qLabel: "Q(2.5, 6.25)",
    setup: "[s(2.5) − s(2)] / (2.5 − 2) = (6.25 − 4) / 0.5",
    rate: "4.5 ft/s",
  },
  {
    b: 2.1,
    qLabel: "Q(2.1, 4.41)",
    setup: "[s(2.1) − s(2)] / (2.1 − 2) = (4.41 − 4) / 0.1",
    rate: "4.1 ft/s",
  },
  {
    b: 2.01,
    qLabel: "Q(2.01, 4.0401)",
    setup: "[s(2.01) − s(2)] / (2.01 − 2) = (4.0401 − 4) / 0.01",
    rate: "4.01 ft/s",
  },
];

const SECTIONS: { id: SectionId; tab: string; title: string; cards: Card[] }[] =
  [
    {
      id: 1,
      tab: "1. Big idea",
      title: "Big idea",
      cards: [
        {
          prompt: "What is an average rate of change?",
          hint: "Think about a whole interval, not one instant.",
          answerTitle: "Average rate of change",
          answer: [
            "It is how fast something changes over an interval.",
            "You need two inputs.",
            "Think: average speed for an entire car ride.",
          ],
        },
        {
          prompt: "What is an instantaneous rate of change?",
          hint: "Think about one exact moment.",
          answerTitle: "Instantaneous rate of change",
          answer: [
            "It is the rate at one exact input or moment.",
            "Think: what a speedometer says right now.",
          ],
        },
        {
          prompt: "Match the lines to the rates: secant and tangent.",
          hint: "One line uses two points. One matches the curve at a chosen point.",
          answerTitle: "Secant ↔ average · Tangent ↔ instantaneous",
          answer: [
            "A secant line goes through two points on a curve. Its slope is an average rate.",
            "A tangent line matches the curve at one chosen point. Its slope is an instantaneous rate.",
          ],
        },
        {
          prompt:
            "Does a tangent line get its slope from a single plotted point alone?",
          hint: "One point is not enough to determine a line.",
          answerTitle: "The slope matches the rate at that point",
          answer: [
            "A tangent line has a slope that matches the instantaneous rate at the chosen point.",
            "One point alone does not determine a line. The tangent follows the curve’s direction there.",
          ],
        },
      ],
    },
    {
      id: 2,
      tab: "2. Example",
      title: "One worked example",
      cards: [
        {
          prompt: "A car’s position is s(t) = t² feet after t seconds. Predict s(2).",
          hint: "Substitute t = 2.",
          answerTitle: "s(2) = 4 ft",
          answer: ["s(2) = 2² = 4 feet."],
        },
        {
          prompt: "Predict s(3).",
          hint: "Same formula, t = 3.",
          answerTitle: "s(3) = 9 ft",
          answer: ["s(3) = 3² = 9 feet."],
        },
        {
          prompt: "Predict the average rate of change on [2, 3].",
          hint: "Average rate = [s(3) − s(2)] / (3 − 2).",
          answerTitle: "5 ft/s",
          answer: [
            "AROC = [s(3) − s(2)] / (3 − 2) = (9 − 4) / (3 − 2) = 5 / 1 = 5 ft/s.",
            "The car’s position changed at an average rate of 5 ft/s.",
          ],
        },
      ],
    },
    {
      id: 3,
      tab: "3. Graph",
      title: "Graph and lines",
      cards: [
        {
          prompt:
            "P = (2, 4) and Q = (3, 9). Which line through these points represents the average rate?",
          hint: "Average rate uses two inputs.",
          answerTitle: "Secant through P and Q",
          answer: [
            "The secant line through P and Q represents the average rate on [2, 3].",
            "Slope = (9 − 4) / (3 − 2) = 5 ft/s.",
          ],
          graph: "secant",
        },
        {
          prompt: "Which line represents the instantaneous rate at t = 2?",
          hint: "Instantaneous rate is the rate at one exact moment.",
          answerTitle: "Tangent at P",
          answer: [
            "The tangent line at P represents the instantaneous rate at t = 2.",
            "Its slope is 4 ft/s. It matches the curve’s direction at P; one point alone does not determine the line.",
          ],
          graph: "tangent",
        },
      ],
    },
    {
      id: 4,
      tab: "4. Shrink",
      title: "Shrink the interval",
      cards: SHRINK.flatMap((row) => [
        {
          prompt: `P stays at (2, 4). For the interval [2, ${fmt(row.b)}], predict the coordinates of Q.`,
          hint: "Q is on s(t) = t².",
          answerTitle: row.qLabel,
          answer: [`s(${fmt(row.b)}) = ${fmt(row.b)}² = ${fmt(sOf(row.b))} ft.`],
          graph: "shrink",
          b: row.b,
        },
        {
          prompt: `Predict the average rate on [2, ${fmt(row.b)}].`,
          hint: "Use [s(b) − s(2)] / (b − 2).",
          answerTitle: row.rate,
          answer: [`${row.setup} = ${row.rate}.`],
          graph: "shrink",
          b: row.b,
          rateReady: true,
        },
      ]),
    },
    {
      id: 5,
      tab: "5. Try one",
      title: "Try one",
      cards: [
        {
          prompt: "f(x) = x² + 1. Predict the average rate on [1, 1.5].",
          hint: "No units. This is an abstract function.",
          answerTitle: "2.5",
          answer: [
            "f(1) = 2 and f(1.5) = 3.25.",
            "[f(1.5) − f(1)] / (1.5 − 1) = (3.25 − 2) / 0.5 = 1.25 / 0.5 = 2.5.",
          ],
        },
        {
          prompt: "Predict the average rate on [1, 1.1].",
          answerTitle: "2.1",
          answer: [
            "f(1.1) = 2.21.",
            "[f(1.1) − f(1)] / (1.1 − 1) = (2.21 − 2) / 0.1 = 0.21 / 0.1 = 2.1.",
          ],
        },
        {
          prompt: "Predict the average rate on [1, 1.01].",
          answerTitle: "2.01",
          answer: [
            "f(1.01) = 2.0201.",
            "[f(1.01) − f(1)] / (1.01 − 1) = (2.0201 − 2) / 0.01 = 0.0201 / 0.01 = 2.01.",
          ],
        },
        {
          prompt: "What is the estimated instantaneous rate of f at x = 1?",
          hint: "Look at 2.5, 2.1, 2.01.",
          answerTitle: "2",
          answer: [
            "The average rates 2.5, 2.1, and 2.01 approach 2.",
            "The estimated instantaneous rate at x = 1 is 2.",
          ],
        },
      ],
    },
    {
      id: 6,
      tab: "6. Exit",
      title: "Exit check",
      cards: [
        {
          prompt: "Two points → ____ line → ____ rate.",
          answerTitle: "secant · average rate of change",
          answer: ["Two points → secant line → average rate of change."],
        },
        {
          prompt: "One moment → ____ line → ____ rate.",
          answerTitle: "tangent · instantaneous rate of change",
          answer: [
            "One moment → tangent line → instantaneous rate of change.",
          ],
        },
        {
          prompt: "Why shrink the interval?",
          answerTitle: "Secant slope approaches tangent slope",
          answer: [
            "To make the secant slope approach the tangent slope at the chosen point.",
          ],
        },
      ],
    },
  ];

SECTIONS[3].cards.push(
  {
    prompt: "What number are the rates 5, 4.5, 4.1, 4.01 approaching?",
    hint: "This estimates the rate at exactly t = 2.",
    answerTitle: "4 ft/s",
    answer: [
      "The average rates approach 4 ft/s.",
      "So the estimated instantaneous rate at t = 2 is 4 ft/s.",
    ],
    graph: "shrink",
    b: 2.01,
    rateReady: true,
  },
  {
    prompt: "Why can’t we compute the rate on the interval [2, 2]?",
    hint: "Look at the denominator.",
    answerTitle: "The denominator would be 0",
    answer: [
      "[s(2) − s(2)] / (2 − 2) = 0 / 0, which is undefined.",
      "We do not calculate a rate using [2, 2]. Keep one input at 2 and move the other closer.",
    ],
    graph: "shrink",
    b: 2.01,
    rateReady: true,
  },
);

function sOf(t: number) {
  return t * t;
}

function fmt(n: number) {
  const rounded = Math.round(n * 1e6) / 1e6;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

function tPx(t: number) {
  return PAD.l + ((t - T_MIN) / (T_MAX - T_MIN)) * PLOT_W;
}
function sPx(s: number) {
  return PAD.t + ((S_MAX - s) / (S_MAX - S_MIN)) * PLOT_H;
}

function curvePath() {
  const parts: string[] = [];
  for (let t = T_MIN; t <= T_MAX + 1e-9; t += 0.04) {
    const tt = Math.min(t, T_MAX);
    parts.push(
      `${parts.length ? "L" : "M"} ${tPx(tt).toFixed(2)} ${sPx(sOf(tt)).toFixed(2)}`,
    );
  }
  return parts.join(" ");
}

const CURVE = curvePath();

function clipLine(t0: number, s0: number, m: number) {
  const pts: { t: number; s: number }[] = [];
  const add = (t: number, s: number) => {
    if (t >= T_MIN && t <= T_MAX && s >= S_MIN && s <= S_MAX) pts.push({ t, s });
  };
  add(T_MIN, s0 + m * (T_MIN - t0));
  add(T_MAX, s0 + m * (T_MAX - t0));
  if (Math.abs(m) > 1e-8) {
    add(t0 + (S_MIN - s0) / m, S_MIN);
    add(t0 + (S_MAX - s0) / m, S_MAX);
  }
  const uniq: { t: number; s: number }[] = [];
  for (const p of pts) {
    if (!uniq.some((q) => Math.abs(q.t - p.t) < 1e-4 && Math.abs(q.s - p.s) < 1e-4)) {
      uniq.push(p);
    }
  }
  uniq.sort((a, b) => a.t - b.t);
  return uniq.length >= 2
    ? ([uniq[0], uniq[uniq.length - 1]] as const)
    : [
        { t: T_MIN, s: s0 + m * (T_MIN - t0) },
        { t: T_MAX, s: s0 + m * (T_MAX - t0) },
      ];
}

export function CarRateLesson() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const playRef = useRef(0);
  const [sectionId, setSectionId] = useState<SectionId>(1);
  const [stepBySection, setStepBySection] = useState<Record<SectionId, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  });
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [graphB, setGraphB] = useState(3);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sticky, setSticky] = useState({ secant: false, tangent: false });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const section = SECTIONS[sectionId - 1];
  const step = stepBySection[sectionId];
  const card = section.cards[step];
  const cardKey = `${sectionId}-${step}`;
  const isOpen = Boolean(revealed[cardKey]);
  const showGraph = sectionId === 3 || sectionId === 4;

  const animateTo = useCallback(
    (target: number) => {
      window.cancelAnimationFrame(playRef.current);
      if (reducedMotion) {
        setGraphB(target);
        return;
      }
      const start = graphB;
      const t0 = performance.now();
      const tick = (now: number) => {
        const u = Math.min(1, (now - t0) / 700);
        const eased = 1 - (1 - u) * (1 - u);
        setGraphB(start + (target - start) * eased);
        if (u < 1) playRef.current = requestAnimationFrame(tick);
      };
      playRef.current = requestAnimationFrame(tick);
    },
    [graphB, reducedMotion],
  );

  function setStep(next: number) {
    const clamped = Math.max(0, Math.min(section.cards.length - 1, next));
    setStepBySection((current) => ({ ...current, [sectionId]: clamped }));
    const nextCard = section.cards[clamped];
    if (nextCard?.b != null) animateTo(nextCard.b);
  }

  function goSection(id: SectionId) {
    setSectionId(id);
    const nextCard = SECTIONS[id - 1].cards[stepBySection[id]];
    if (nextCard?.b != null) setGraphB(nextCard.b);
    else if (id === 3 || id === 4) setGraphB(3);
  }

  function resetSection() {
    setStepBySection((current) => ({ ...current, [sectionId]: 0 }));
    setRevealed((current) => {
      const next = { ...current };
      section.cards.forEach((_, index) => {
        delete next[`${sectionId}-${index}`];
      });
      return next;
    });
    if (sectionId === 3) setSticky({ secant: false, tangent: false });
    if (sectionId === 3 || sectionId === 4) setGraphB(3);
  }

  function resetLesson() {
    setSectionId(1);
    setStepBySection({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    setRevealed({});
    setSticky({ secant: false, tangent: false });
    setGraphB(3);
  }

  function toggleReveal() {
    setRevealed((current) => ({ ...current, [cardKey]: !current[cardKey] }));
    if (!isOpen && card.graph === "secant") {
      setSticky((current) => ({ ...current, secant: true }));
    }
    if (!isOpen && card.graph === "tangent") {
      setSticky((current) => ({ ...current, tangent: true }));
    }
  }

  function replay() {
    const target = card.b ?? 3;
    const from = target >= 2.9 ? 3.2 : 3;
    setGraphB(from);
    window.setTimeout(() => animateTo(target), 40);
  }

  const showSecant =
    (sectionId === 3 && sticky.secant) || sectionId === 4;
  const showTangent =
    (sectionId === 3 && sticky.tangent) || sectionId === 4;
  const showRate =
    (sectionId === 3 && sticky.secant) ||
    (sectionId === 4 && stickyRate(revealed, step)) ||
    Boolean(card.rateReady && isOpen);
  const showQLabel =
    sectionId === 3 || (sectionId === 4 && qLabelReady(revealed, step, card.b ?? graphB));

  return (
    <section
      className="ua-card ua-shadow-soft p-4 sm:p-5 md:col-span-2"
      style={{ background: "#FFFDF8" }}
      aria-labelledby={`${uid}-heading`}
      tabIndex={0}
      onKeyDown={(event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        if (event.key === "ArrowRight") {
          event.preventDefault();
          if (step < section.cards.length - 1) setStep(step + 1);
          else if (sectionId < 6) goSection((sectionId + 1) as SectionId);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          if (step > 0) setStep(step - 1);
          else if (sectionId > 1) goSection((sectionId - 1) as SectionId);
        }
        if (event.key === "Enter" && event.target === event.currentTarget) {
          event.preventDefault();
          toggleReveal();
        }
      }}
    >
      <p className="text-[0.7rem] font-semibold tracking-wide text-emerald-800 uppercase">
        Calculus Honors · Unit 1
      </p>
      <h2
        id={`${uid}-heading`}
        className="mt-0.5 font-serif text-2xl sm:text-3xl"
        style={{ color: NAVY }}
      >
        Average Rate and Instantaneous Rate
      </h2>
      <p
        className="mt-2 rounded-lg px-3 py-2 text-sm font-semibold sm:text-base"
        style={{ background: "#E8EEF7", color: NAVY }}
      >
        I can explain the difference between average rate of change and
        instantaneous rate of change, and I can use smaller intervals to estimate
        a rate at one exact moment.
      </p>
      <p className="mt-2 text-sm" style={{ color: NAVY }}>
        Car model for this lesson:{" "}
        <span className="font-semibold">s(t) = t²</span> (feet, seconds). This is
        not the runner entry ticket.
      </p>
      <p className="mt-2">
        <a
          href={PDF_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[var(--ua-evergreen)] underline-offset-2 hover:underline"
        >
          Open or download the original notes PDF
        </a>
      </p>

      <div
        role="tablist"
        aria-label="Lesson sections"
        className="mt-4 grid grid-cols-3 gap-1 sm:grid-cols-6"
      >
        {SECTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={sectionId === item.id}
            className={`${HIT} px-2 text-xs sm:text-sm`}
            style={{
              background: sectionId === item.id ? NAVY : "#F4F0E6",
              color: sectionId === item.id ? "#fff" : NAVY,
            }}
            onClick={() => goSection(item.id)}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          className={`${HIT} bg-white`}
          style={{ color: NAVY }}
          disabled={sectionId === 1 && step === 0}
          onClick={() => {
            if (step > 0) setStep(step - 1);
            else if (sectionId > 1) goSection((sectionId - 1) as SectionId);
          }}
        >
          Previous
        </button>
        <button
          type="button"
          className={`${HIT} bg-white`}
          style={{ color: NAVY }}
          disabled={sectionId === 6 && step === section.cards.length - 1}
          onClick={() => {
            if (step < section.cards.length - 1) setStep(step + 1);
            else if (sectionId < 6) goSection((sectionId + 1) as SectionId);
          }}
        >
          Next
        </button>
        <button
          type="button"
          className={`${HIT} bg-white`}
          style={{ color: NAVY }}
          onClick={resetSection}
        >
          Reset Section
        </button>
        <button
          type="button"
          className={`${HIT} text-white`}
          style={{ background: NAVY }}
          onClick={resetLesson}
        >
          Reset Lesson
        </button>
        {sectionId === 4 ? (
          <>
            <button
              type="button"
              className={`${HIT} bg-[#F4F0E6]`}
              style={{ color: NAVY }}
              onClick={replay}
            >
              Replay
            </button>
            <button
              type="button"
              className={`${HIT} bg-[#F4F0E6]`}
              style={{ color: NAVY }}
              onClick={resetSection}
            >
              Reset
            </button>
          </>
        ) : null}
      </div>

      <p className="mt-3 text-sm font-semibold" style={{ color: NAVY }}>
        {section.title} · Question {step + 1} of {section.cards.length}
      </p>

      <div
        className={`mt-3 grid items-stretch gap-3 ${
          showGraph ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,24rem)]" : ""
        }`}
      >
        {showGraph ? (
          <CarGraph
            uid={uid}
            b={graphB}
            showSecant={showSecant}
            showTangent={showTangent}
            showRate={showRate && showSecant}
            showQLabel={showQLabel}
            revealSecantLabel={sticky.secant || sectionId === 4}
            revealTangentLabel={sticky.tangent || sectionId === 4}
          />
        ) : null}

        <article
          className="flex min-h-[16rem] flex-col rounded-2xl border border-stone-200 bg-white p-4 sm:p-5"
          aria-live="polite"
        >
          <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: isOpen ? TANGENT : SECANT }}>
            {isOpen ? "Answer" : "Question"}
          </p>
          {!isOpen ? (
            <>
              <p
                className="mt-2 font-serif text-xl leading-snug break-words sm:text-2xl"
                style={{ color: NAVY }}
              >
                {card.prompt}
              </p>
              {card.hint ? (
                <p className="mt-2 text-sm text-stone-600">{card.hint}</p>
              ) : null}
            </>
          ) : (
            <>
              <p
                className="mt-2 font-serif text-xl leading-snug sm:text-2xl"
                style={{ color: TANGENT }}
              >
                {card.answerTitle}
              </p>
              <ul className="mt-3 space-y-2 text-base sm:text-lg" style={{ color: NAVY }}>
                {card.answer.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </>
          )}
          <button
            type="button"
            className={`${HIT} mt-auto w-full text-white`}
            style={{ background: isOpen ? NAVY : SECANT }}
            aria-pressed={isOpen}
            onClick={toggleReveal}
          >
            {isOpen ? "Show Question" : "Reveal"}
          </button>
        </article>
      </div>
    </section>
  );
}

function qLabelReady(
  revealed: Record<string, boolean>,
  step: number,
  b: number,
) {
  return SECTIONS[3].cards.some((item, index) => {
    if (item.b == null || Math.abs(item.b - b) > 1e-6 || item.rateReady) {
      return false;
    }
    return Boolean(revealed[`4-${index}`]) && index <= step;
  });
}

function stickyRate(revealed: Record<string, boolean>, step: number) {
  for (let index = 0; index <= step; index += 1) {
    const card = SECTIONS[3].cards[index];
    if (card?.rateReady && revealed[`4-${index}`]) return true;
  }
  return false;
}

function CarGraph({
  uid,
  b,
  showSecant,
  showTangent,
  showRate,
  showQLabel,
  revealSecantLabel,
  revealTangentLabel,
}: {
  uid: string;
  b: number;
  showSecant: boolean;
  showTangent: boolean;
  showRate: boolean;
  showQLabel: boolean;
  revealSecantLabel: boolean;
  revealTangentLabel: boolean;
}) {
  const sB = sOf(b);
  const slope = b + 2;
  const secant = clipLine(P.t, P.s, slope);
  const tangent = clipLine(P.t, P.s, 4);
  const qFar = b > 2.12;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="mx-auto h-[min(38dvh,18rem)] w-full max-h-[18rem]"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby={`${uid}-graph`}
      >
        <title id={`${uid}-graph`}>
          Graph of s of t equals t squared in feet versus seconds, with P at 2
          comma 4.
        </title>
        <defs>
          <clipPath id={`${uid}-plot`}>
            <rect x={PAD.l} y={PAD.t} width={PLOT_W} height={PLOT_H} />
          </clipPath>
        </defs>
        <rect x={PAD.l} y={PAD.t} width={PLOT_W} height={PLOT_H} fill="#FFFDF8" />
        {[1, 2, 3].map((t) => (
          <g key={`t-${t}`}>
            <line
              x1={tPx(t)}
              x2={tPx(t)}
              y1={PAD.t}
              y2={PAD.t + PLOT_H}
              stroke="rgba(27,42,74,0.1)"
            />
            <text
              x={tPx(t)}
              y={PAD.t + PLOT_H + 18}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill={NAVY}
            >
              {t}
            </text>
          </g>
        ))}
        {[0, 4, 9].map((s) => (
          <g key={`s-${s}`}>
            <line
              x1={PAD.l}
              x2={PAD.l + PLOT_W}
              y1={sPx(s)}
              y2={sPx(s)}
              stroke="rgba(27,42,74,0.1)"
            />
            <text
              x={PAD.l - 8}
              y={sPx(s) + 4}
              textAnchor="end"
              fontSize="13"
              fontWeight="700"
              fill={NAVY}
            >
              {s}
            </text>
          </g>
        ))}
        <line
          x1={PAD.l}
          x2={PAD.l + PLOT_W}
          y1={PAD.t + PLOT_H}
          y2={PAD.t + PLOT_H}
          stroke={NAVY}
          strokeWidth="1.4"
        />
        <line
          x1={PAD.l}
          x2={PAD.l}
          y1={PAD.t}
          y2={PAD.t + PLOT_H}
          stroke={NAVY}
          strokeWidth="1.4"
        />
        <text
          x={PAD.l + PLOT_W / 2}
          y={VH - 6}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={NAVY}
        >
          Time, t (seconds)
        </text>
        <text
          x={14}
          y={PAD.t + PLOT_H / 2}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={NAVY}
          transform={`rotate(-90 14 ${PAD.t + PLOT_H / 2})`}
        >
          Position, s(t) (feet)
        </text>
        <g clipPath={`url(#${uid}-plot)`}>
          <path d={CURVE} fill="none" stroke={BURGUNDY} strokeWidth="3" />
          {showTangent ? (
            <line
              x1={tPx(tangent[0].t)}
              y1={sPx(tangent[0].s)}
              x2={tPx(tangent[1].t)}
              y2={sPx(tangent[1].s)}
              stroke={TANGENT}
              strokeWidth="3"
            />
          ) : null}
          {showSecant ? (
            <line
              x1={tPx(secant[0].t)}
              y1={sPx(secant[0].s)}
              x2={tPx(secant[1].t)}
              y2={sPx(secant[1].s)}
              stroke={SECANT}
              strokeWidth="2.6"
              strokeDasharray="8 5"
            />
          ) : null}
        </g>
        <circle
          cx={tPx(P.t)}
          cy={sPx(P.s)}
          r="6"
          fill={NAVY}
          stroke="#fff"
          strokeWidth="2"
        />
        <text
          x={tPx(P.t) - 8}
          y={sPx(P.s) - 10}
          textAnchor="end"
          fontSize="14"
          fontWeight="700"
          fill={NAVY}
          stroke="#fff"
          strokeWidth="3"
          paintOrder="stroke"
        >
          P(2, 4)
        </text>
        <circle
          cx={tPx(b)}
          cy={sPx(sB)}
          r="6"
          fill={SECANT}
          stroke="#fff"
          strokeWidth="2"
        />
        {qFar && showQLabel ? (
          <text
            x={tPx(b) + 8}
            y={sPx(sB) - 10}
            fontSize="14"
            fontWeight="700"
            fill={NAVY}
            stroke="#fff"
            strokeWidth="3"
            paintOrder="stroke"
          >
            Q({fmt(b)}, {fmt(sB)})
          </text>
        ) : null}
        <text
          x={tPx(0.95)}
          y={sPx(sOf(0.95)) + 18}
          fontSize="12"
          fontWeight="700"
          fill={BURGUNDY}
        >
          s(t) = t²
        </text>
        {revealSecantLabel ? (
          <text
            x={tPx(2.55)}
            y={sPx(sOf(2.55)) + 22}
            fontSize="12"
            fontWeight="700"
            fill={SECANT}
            stroke="#fff"
            strokeWidth="3"
            paintOrder="stroke"
          >
            {`Secant (dashed)${showRate ? ` · ${fmt(slope)} ft/s` : ""}`}
          </text>
        ) : null}
        {revealTangentLabel ? (
          <text
            x={tPx(1.15)}
            y={sPx(4 * 1.15 - 4) - 10}
            fontSize="12"
            fontWeight="700"
            fill={TANGENT}
            stroke="#fff"
            strokeWidth="3"
            paintOrder="stroke"
          >
            Tangent (solid) · 4 ft/s
          </text>
        ) : null}
      </svg>
      <ul
        className="flex flex-wrap gap-x-4 gap-y-1 border-t border-stone-200 px-3 py-2 text-sm font-semibold"
        style={{ color: NAVY }}
      >
        <li>Curve s(t) = t² — solid burgundy</li>
        {revealSecantLabel ? (
          <li>
            Secant — dashed blue
            {showRate ? ` · ${fmt(slope)} ft/s` : ""}
          </li>
        ) : null}
        {revealTangentLabel ? (
          <li>Tangent — solid green · 4 ft/s</li>
        ) : null}
      </ul>
    </div>
  );
}
