"use client";

import { useId, useState, type ReactNode } from "react";
import { NAVY } from "@/app/components/limits/ExploringLimitsGraphs";
import { Tex } from "@/app/components/limits/Tex";
import { gradeNumber, type GraphSpec } from "@/app/lib/limitProperties/content";
import { LimitGraph } from "@/app/components/limit-properties/LimitGraph";

const HIT =
  "inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";
const FIELD =
  "mt-1 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base";
const CREAM = "#FFFEFB";

const GRAPH1: GraphSpec = {
  curves: [{ fn: (x) => x + 3, color: "#2563EB", label: "y" }],
  xMin: -2,
  xMax: 6,
  yMin: -4,
  yMax: 10,
  c: 3,
  marks: [{ x: 3, y: 6, label: "(3, 6)", open: true, dx: 14, dy: -14 }],
  skip: (x) => Math.abs(x - 3) < 0.08,
};

const GRAPH2: GraphSpec = {
  curves: [
    {
      fn: (x) => (Math.abs(x - 1) < 0.08 ? null : (x + 2) / (x - 1)),
      color: "#2563EB",
      label: "y",
    },
  ],
  xMin: -4,
  xMax: 5,
  yMin: -8,
  yMax: 12,
  c: 2,
  vAsymptote: 1,
  marks: [{ x: 2, y: 4, label: "(2, 4)", open: true, dx: 14, dy: -14 }],
  skip: (x) => Math.abs(x - 1) < 0.12 || Math.abs(x - 2) < 0.08,
};

const HINTS1 = [
  "Try direct substitution. What form do you get?",
  "0/0 is not the answer. Factor x^2 - 9.",
  "x^2 - 9 factors as (x - 3)(x + 3).",
  "Cancel common factors, not terms.",
];

const HINTS2 = [
  "Factor both the numerator and the denominator.",
  "Numerator: (x - 2)(x + 2). Denominator: (x - 2)(x - 1).",
  "Cancel the common factor (x - 2), then plug x = 2 into what remains.",
];

const HINTS3 = [
  "Compare the left-hand limit and the right-hand limit. Do they approach the same value?",
];

const HINTS4 = [
  "The limit describes nearby behavior. f(2) describes the actual value at x = 2.",
];

export function Qod10LimitsRetrieval() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [step, setStep] = useState(0);
  const [p1, setP1] = useState("");
  const [p1why, setP1why] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState<string | null>(null);
  const [p4a, setP4a] = useState("");
  const [p4b, setP4b] = useState("");
  const [p4why, setP4why] = useState("");
  const [hint, setHint] = useState(0);
  const [checked, setChecked] = useState(false);
  const [attempted, setAttempted] = useState([false, false, false, false]);

  const done = attempted.every(Boolean) && step >= 4;

  function markAttempted() {
    setAttempted((prev) => prev.map((v, i) => (i === step ? true : v)));
  }

  function check() {
    markAttempted();
    setChecked(true);
  }

  function tryAgain() {
    setChecked(false);
    if (step === 0) {
      setP1("");
      setP1why("");
    }
    if (step === 1) setP2("");
    if (step === 2) setP3(null);
    if (step === 3) {
      setP4a("");
      setP4b("");
      setP4why("");
    }
    setHint(0);
  }

  function next() {
    setStep((s) => Math.min(4, s + 1));
    setChecked(false);
    setHint(0);
  }

  const hints = step === 0 ? HINTS1 : step === 1 ? HINTS2 : step === 2 ? HINTS3 : HINTS4;
  const ok1 = gradeNumber(p1, 6);
  const ok2 = gradeNumber(p2, 4);
  const ok3 = p3 === "DNE";
  const ok4 = gradeNumber(p4a, 4) && gradeNumber(p4b, 7);

  return (
    <section
      className="ua-card ua-shadow-soft relative w-full min-w-0 overflow-x-hidden p-4 sm:p-6 md:col-span-2"
      style={{ background: CREAM, color: NAVY }}
      aria-labelledby={`${uid}-heading`}
      id="qod10-limits-retrieval"
    >
      <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-emerald-800 uppercase">
        Today&apos;s problem · Entry ticket check
      </p>
      <h2
        id={`${uid}-heading`}
        className="mt-1 font-serif text-2xl sm:text-3xl"
      >
        QOD10 | Limits Retrieval
      </h2>
      <p className="mt-2 max-w-3xl text-base leading-snug">
        Check your work after Monday&apos;s QOD. Try each problem first. Hints
        and solutions stay hidden until you attempt.
      </p>
      <p className="mt-3 text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        {done ? "Complete" : `Problem ${Math.min(step + 1, 4)} of 4`}
      </p>

      {!done && step === 0 ? (
        <ProblemCard
          title="1. Factor First"
          math={String.raw`\lim_{x\to 3}\dfrac{x^{2}-9}{x-3}`}
          text="lim as x → 3 of (x^2 - 9)/(x - 3)"
          graph={
            <LimitGraph
              spec={GRAPH1}
              showCoords
              ariaLabel="Line y equals x plus 3 with a hole at 3 comma 6."
            />
          }
        >
          <label className="mt-4 block text-sm font-semibold">
            Limit
            <input
              className={FIELD}
              inputMode="decimal"
              value={p1}
              autoComplete="off"
              onChange={(e) => {
                setP1(e.target.value);
                setChecked(false);
              }}
            />
          </label>
          <label className="mt-3 block text-sm font-semibold">
            Optional: show your factoring
            <input
              className={FIELD}
              value={p1why}
              autoComplete="off"
              spellCheck={false}
              placeholder="(x - 3)(x + 3)"
              onChange={(e) => setP1why(e.target.value)}
            />
          </label>
          {checked ? (
            <Feedback ok={ok1}>
              {ok1
                ? "Direct substitution is 0/0, so we factor. After canceling (x - 3), the remaining line is x + 3, which is 6 at x = 3. The hole on the graph is at (3, 6)."
                : hintMessage(HINTS1, hint, "Try direct substitution first.")}
            </Feedback>
          ) : null}
        </ProblemCard>
      ) : null}

      {!done && step === 1 ? (
        <ProblemCard
          title="2. Factor Both Parts"
          math={String.raw`\lim_{x\to 2}\dfrac{x^{2}-4}{x^{2}-3x+2}`}
          text="lim as x → 2 of (x^2 - 4)/(x^2 - 3x + 2)"
          graph={
            <LimitGraph
              spec={GRAPH2}
              showCoords
              ariaLabel="Graph of y equals x plus 2 over x minus 1 with a hole at 2 comma 4 and a vertical asymptote at x equals 1."
            />
          }
        >
          <p className="mt-2 text-center text-sm text-stone-600">
            After simplifying,{" "}
            <Tex math={String.raw`y=\dfrac{x+2}{x-1}`} /> for{" "}
            <Tex math={String.raw`x\neq 2`} />.
          </p>
          <label className="mt-4 block text-sm font-semibold">
            Limit
            <input
              className={FIELD}
              inputMode="decimal"
              value={p2}
              autoComplete="off"
              onChange={(e) => {
                setP2(e.target.value);
                setChecked(false);
              }}
            />
          </label>
          {checked ? (
            <Feedback ok={ok2}>
              {ok2
                ? "Cancel (x - 2). The remaining expression is (x + 2)/(x - 1). At x = 2 that is 4/1 = 4, matching the hole at (2, 4)."
                : hintMessage(HINTS2, hint, "Factor both numerator and denominator.")}
            </Feedback>
          ) : null}
        </ProblemCard>
      ) : null}

      {!done && step === 2 ? (
        <ProblemCard
          title="3. Do the Sides Agree?"
          math={String.raw`\lim_{x\to 1^{-}}f(x)=2,\quad\lim_{x\to 1^{+}}f(x)=5`}
          text="Left-hand limit is 2. Right-hand limit is 5. What is the two-sided limit as x → 1?"
          extra={
            <p className="mt-2 text-center text-lg">
              What is <Tex math={String.raw`\lim_{x\to 1}f(x)`} />?
            </p>
          }
          graph={<JumpGraph />}
        >
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["2", "5", "3.5", "DNE"].map((choice) => (
              <button
                key={choice}
                type="button"
                className={HIT}
                style={{
                  background: p3 === choice ? NAVY : "#fff",
                  color: p3 === choice ? "#fff" : NAVY,
                  border: "1px solid rgba(27,42,74,0.18)",
                }}
                onClick={() => {
                  setP3(choice);
                  setChecked(false);
                }}
              >
                {choice}
              </button>
            ))}
          </div>
          {checked ? (
            <Feedback ok={ok3}>
              {ok3
                ? "A two-sided limit exists only when the left-hand and right-hand limits agree. 2 and 5 do not agree, so the two-sided limit does not exist."
                : "Compare the left-hand limit and the right-hand limit. Do they approach the same value?"}
            </Feedback>
          ) : null}
        </ProblemCard>
      ) : null}

      {!done && step === 3 ? (
        <ProblemCard
          title="4. Near Is Not Always the Same as At"
          math={String.raw`\lim_{x\to 2}f(x)=4,\quad f(2)=7`}
          text="As x approaches 2, the function approaches y = 4 from both sides. However, f(2) = 7."
          graph={<NearAtGraph />}
        >
          <p className="mt-2 text-sm text-stone-600">
            As x approaches 2, the graph approaches y = 4 from both sides.
            The filled point is f(2) = 7.
          </p>
          <label className="mt-4 block text-sm font-semibold">
            A. What is <Tex math={String.raw`\lim_{x\to 2}f(x)`} />?
            <input
              className={FIELD}
              inputMode="decimal"
              value={p4a}
              autoComplete="off"
              onChange={(e) => {
                setP4a(e.target.value);
                setChecked(false);
              }}
            />
          </label>
          <label className="mt-3 block text-sm font-semibold">
            B. What is f(2)?
            <input
              className={FIELD}
              inputMode="decimal"
              value={p4b}
              autoComplete="off"
              onChange={(e) => {
                setP4b(e.target.value);
                setChecked(false);
              }}
            />
          </label>
          <label className="mt-3 block text-sm font-semibold">
            Why can these values be different?
            <textarea
              className="mt-1 min-h-24 w-full rounded-xl border border-stone-300 p-3 text-base"
              value={p4why}
              onChange={(e) => setP4why(e.target.value)}
            />
          </label>
          {checked ? (
            <Feedback ok={ok4}>
              {ok4
                ? "The limit is 4 because nearby y-values approach 4. f(2) = 7 is the actual point at x = 2. The limit describes nearby behavior; the function value describes the height at the point."
                : hintMessage(
                    HINTS4,
                    hint,
                    "Read the open circle for the limit and the filled point for f(2).",
                  )}
            </Feedback>
          ) : null}
        </ProblemCard>
      ) : null}

      {done ? (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="font-serif text-2xl">QOD10 Check Complete</h3>
          <p className="mt-2 text-sm text-stone-600">
            No grade is stored. These are the four ideas from today&apos;s
            retrieval.
          </p>
          <ul className="mt-4 space-y-2 text-base">
            {[
              "Factor a removable-hole limit",
              "Factor numerator and denominator",
              "Compare one-sided limits",
              "Distinguish a limit from a function value",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden className="mt-0.5 text-emerald-700">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className={HIT}
            style={{ background: NAVY, color: "#fff" }}
            onClick={check}
          >
            Check My Work
          </button>
          <button
            type="button"
            className={HIT}
            style={{ background: "#F4F0E6", color: NAVY }}
            onClick={tryAgain}
          >
            Try Again
          </button>
          <button
            type="button"
            className={HIT}
            style={{ background: "#F4F0E6", color: NAVY }}
            onClick={() => setHint((n) => Math.min(hints.length - 1, n + (checked ? 1 : 0)))}
            disabled={!checked}
          >
            Show a Hint
          </button>
          <button
            type="button"
            className={HIT}
            style={{ background: "#F4F0E6", color: NAVY }}
            onClick={next}
            disabled={!attempted[step]}
          >
            Next Problem
          </button>
        </div>
      )}
      {!done && !checked ? (
        <p className="mt-2 text-sm text-stone-500">
          Check your work before the next hint or problem.
        </p>
      ) : null}
    </section>
  );
}

function hintMessage(hints: string[], hint: number, fallback: string) {
  return hints[Math.min(hint, hints.length - 1)] ?? fallback;
}

function Feedback({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl p-4" style={{ background: ok ? "#EAF3ED" : "#F4F0E6" }}>
      <p className="font-semibold">{ok ? "That matches." : "Not yet."}</p>
      <p className="mt-1">{children}</p>
    </div>
  );
}

function ProblemCard({
  title,
  math,
  text,
  graph,
  extra,
  children,
}: {
  title: string;
  math: string;
  text: string;
  graph: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mt-4">
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        {title}
      </p>
      <div className="mt-3 text-center">
        <span className="sr-only">{text}</span>
        <Tex display className="text-2xl sm:text-4xl" math={math} />
      </div>
      {extra}
      <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {graph}
      </div>
      {children}
    </div>
  );
}

function JumpGraph() {
  const VW = 640;
  const VH = 280;
  const PAD = { l: 52, r: 28, t: 24, b: 42 };
  const xMin = -1;
  const xMax = 3;
  const yMin = -1;
  const yMax = 8;
  const toX = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * (VW - PAD.l - PAD.r);
  const toY = (y: number) => PAD.t + ((yMax - y) / (yMax - yMin)) * (VH - PAD.t - PAD.b);
  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="h-[min(34dvh,18rem)] w-full"
      role="img"
      aria-label="Left piece at height 2 with an open circle at 1 comma 2. Right piece at height 5 with an open circle at 1 comma 5."
    >
      <rect x={PAD.l} y={PAD.t} width={VW - PAD.l - PAD.r} height={VH - PAD.t - PAD.b} fill="#FFFDF8" />
      <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={VH - PAD.b} stroke={NAVY} strokeWidth="1.6" />
      <line x1={PAD.l} x2={VW - PAD.r} y1={VH - PAD.b} y2={VH - PAD.b} stroke={NAVY} strokeWidth="1.6" />
      {[-1, 0, 1, 2, 3].map((x) => (
        <text key={x} x={toX(x)} y={VH - 14} textAnchor="middle" fontSize="13" fontWeight="700" fill={NAVY}>
          {x}
        </text>
      ))}
      {[0, 2, 4, 6, 8].map((y) => (
        <text key={y} x={PAD.l - 8} y={toY(y) + 4} textAnchor="end" fontSize="13" fontWeight="700" fill={NAVY}>
          {y}
        </text>
      ))}
      <line x1={toX(xMin)} y1={toY(2)} x2={toX(0.96)} y2={toY(2)} stroke="#2563EB" strokeWidth="2.8" />
      <line x1={toX(1.04)} y1={toY(5)} x2={toX(xMax)} y2={toY(5)} stroke="#2563EB" strokeWidth="2.8" />
      <circle cx={toX(1)} cy={toY(2)} r="9" fill={CREAM} stroke="#2563EB" strokeWidth="2.6" />
      <circle cx={toX(1)} cy={toY(5)} r="9" fill={CREAM} stroke="#2563EB" strokeWidth="2.6" />
    </svg>
  );
}

function NearAtGraph() {
  const spec: GraphSpec = {
    curves: [
      {
        fn: (x) => -0.5 * (x - 2) * (x - 2) + 4,
        color: "#2563EB",
        label: "y",
      },
    ],
    xMin: 0,
    xMax: 4,
    yMin: 0,
    yMax: 8,
    c: 2,
    marks: [
      { x: 2, y: 4, label: "(2, 4)", open: true, dx: 16, dy: 18 },
      { x: 2, y: 7, label: "(2, 7)", dx: 16, dy: -14 },
    ],
    skip: (x) => Math.abs(x - 2) < 0.08,
  };
  return (
    <LimitGraph
      spec={spec}
      showCoords
      ariaLabel="Curve approaching an open circle at 2 comma 4, with a filled point at 2 comma 7."
    />
  );
}
