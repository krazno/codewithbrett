"use client";

import { useId, useState } from "react";

const T_MIN = 0;
const T_MAX = 5;
const D_MIN = 0;
const D_MAX = 28;
const VW = 560;
const VH = 280;
const PAD = { l: 40, r: 18, t: 18, b: 32 };
const PLOT_W = VW - PAD.l - PAD.r;
const PLOT_H = VH - PAD.t - PAD.b;

const A = { t: 1, d: 3 };
const B = { t: 4, d: 24 };

function dOf(t: number) {
  return t * t + 2 * t;
}

function tPx(t: number) {
  return PAD.l + ((t - T_MIN) / (T_MAX - T_MIN)) * PLOT_W;
}
function dPx(d: number) {
  return PAD.t + ((D_MAX - d) / (D_MAX - D_MIN)) * PLOT_H;
}

function curvePath() {
  const parts: string[] = [];
  for (let t = T_MIN; t <= T_MAX + 1e-9; t += 0.05) {
    const tt = Math.min(t, T_MAX);
    parts.push(
      `${parts.length ? "L" : "M"} ${tPx(tt).toFixed(1)} ${dPx(dOf(tt)).toFixed(1)}`,
    );
  }
  return parts.join(" ");
}

const CURVE = curvePath();

const STEPS = [
  { id: 1, label: "Step 1: Find the outputs" },
  { id: 2, label: "Step 2: Find the changes" },
  { id: 3, label: "Step 3: Find the rate" },
  { id: 4, label: "Step 4: Interpret" },
] as const;

const CHOICES = [
  { id: "A", label: "Tangent line" },
  { id: "B", label: "Secant line" },
  { id: "C", label: "Vertical line" },
  { id: "D", label: "Horizontal line" },
] as const;

const hit =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

export function SeeTheSecantLine() {
  const graphId = useId();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [choice, setChoice] = useState<(typeof CHOICES)[number]["id"] | null>(
    null,
  );
  const [checked, setChecked] = useState(false);
  const correct = choice === "B";

  return (
    <section
      className="ua-card ua-shadow-soft p-5 md:col-span-2"
      aria-labelledby="secant-heading"
    >
      <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
        Calculus Honors
      </p>
      <h2
        id="secant-heading"
        className="mt-1 font-serif text-2xl text-stone-900"
      >
        See the Secant Line
      </h2>
      <p className="mt-1 text-sm text-stone-700">
        How do two points tell us how quickly something changed?
      </p>
      <p className="mt-3 text-sm leading-relaxed text-stone-700">
        A cyclist’s distance from home is modeled by{" "}
        <span className="font-semibold">
          d(t) = t<sup>2</sup> + 2t
        </span>
        . Here, t is time in hours and d(t) is distance in miles. Find the
        average rate of change from t = 1 to t = 4.
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[rgba(31,77,58,0.16)] bg-[#FFFDF7]">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="h-auto w-full"
          role="img"
          aria-labelledby={graphId}
        >
          <title id={graphId}>
            Graph of d of t equals t squared plus 2t with points A at 1 comma 3
            and B at 4 comma 24 connected by a secant line.
          </title>
          <rect
            x={PAD.l}
            y={PAD.t}
            width={PLOT_W}
            height={PLOT_H}
            fill="#FFFDF7"
          />
          {[0, 1, 2, 3, 4, 5].map((t) => (
            <g key={`vt-${t}`}>
              <line
                x1={tPx(t)}
                x2={tPx(t)}
                y1={PAD.t}
                y2={PAD.t + PLOT_H}
                stroke="rgba(31,77,58,0.12)"
              />
              <text
                x={tPx(t)}
                y={PAD.t + PLOT_H + 16}
                textAnchor="middle"
                fontSize="11"
                fill="#1F2933"
              >
                {t}
              </text>
            </g>
          ))}
          {[0, 5, 10, 15, 20, 25].map((d) => (
            <g key={`hd-${d}`}>
              <line
                x1={PAD.l}
                x2={PAD.l + PLOT_W}
                y1={dPx(d)}
                y2={dPx(d)}
                stroke="rgba(31,77,58,0.12)"
              />
              {d > 0 ? (
                <text
                  x={PAD.l - 6}
                  y={dPx(d) + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#1F2933"
                >
                  {d}
                </text>
              ) : null}
            </g>
          ))}
          <line
            x1={PAD.l}
            x2={PAD.l + PLOT_W}
            y1={dPx(0)}
            y2={dPx(0)}
            stroke="#14382A"
            strokeWidth="1.4"
          />
          <line
            x1={tPx(0)}
            x2={tPx(0)}
            y1={PAD.t}
            y2={PAD.t + PLOT_H}
            stroke="#14382A"
            strokeWidth="1.4"
          />
          <text
            x={PAD.l + PLOT_W - 4}
            y={dPx(0) - 6}
            textAnchor="end"
            fontSize="12"
            fontWeight="700"
            fill="#14382A"
          >
            t
          </text>
          <text
            x={tPx(0) + 8}
            y={PAD.t + 12}
            fontSize="12"
            fontWeight="700"
            fill="#14382A"
          >
            d
          </text>
          <path
            d={CURVE}
            fill="none"
            stroke="#1F4D3A"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <line
            x1={tPx(A.t)}
            y1={dPx(A.d)}
            x2={tPx(B.t)}
            y2={dPx(B.d)}
            stroke="#D6B55B"
            strokeWidth="2.4"
            strokeDasharray="7 5"
          />
          <circle
            cx={tPx(A.t)}
            cy={dPx(A.d)}
            r="6"
            fill="#1F4D3A"
            stroke="#FFFDF7"
            strokeWidth="2"
          />
          <circle
            cx={tPx(B.t)}
            cy={dPx(B.d)}
            r="6"
            fill="#1F4D3A"
            stroke="#FFFDF7"
            strokeWidth="2"
          />
          <text
            x={tPx(A.t) - 10}
            y={dPx(A.d) - 10}
            fontSize="12"
            fontWeight="700"
            fill="#14382A"
          >
            A (1, 3)
          </text>
          <text
            x={tPx(B.t) - 52}
            y={dPx(B.d) - 10}
            fontSize="12"
            fontWeight="700"
            fill="#14382A"
          >
            B (4, 24)
          </text>
        </svg>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[rgba(31,77,58,0.12)] px-3 py-2 text-xs text-stone-700">
          <li className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-5 bg-[#1F4D3A]" aria-hidden />
            Curve: d(t) = t<sup>2</sup> + 2t
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span
              className="inline-block w-5 border-t-2 border-dashed border-[#D6B55B]"
              aria-hidden
            />
            Line through A and B: Secant line
          </li>
        </ul>
      </div>

      <div
        role="tablist"
        aria-label="Solution steps"
        className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-4"
      >
        {STEPS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={step === item.id}
            className={`${hit} px-2 text-xs sm:text-sm ${
              step === item.id
                ? "bg-[var(--ua-evergreen)] text-white"
                : "bg-emerald-50 text-[#14382A]"
            }`}
            onClick={() => setStep(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-2xl bg-emerald-50/80 p-4 text-sm text-stone-800">
        {step === 1 ? (
          <div className="space-y-1.5">
            <p>
              d(1) = 1<sup>2</sup> + 2(1) = 3 miles
            </p>
            <p>
              d(4) = 4<sup>2</sup> + 2(4) = 24 miles
            </p>
          </div>
        ) : null}
        {step === 2 ? (
          <div className="space-y-1.5">
            <p>Change in distance: 24 − 3 = 21 miles</p>
            <p>Change in time: 4 − 1 = 3 hours</p>
          </div>
        ) : null}
        {step === 3 ? (
          <div className="space-y-1.5">
            <p>Average rate of change</p>
            <p>= change in distance ÷ change in time</p>
            <p>= 21 ÷ 3</p>
            <p className="font-serif text-2xl text-[var(--ua-evergreen)]">
              7 miles per hour
            </p>
          </div>
        ) : null}
        {step === 4 ? (
          <div className="space-y-2">
            <p>
              From Hour 1 to Hour 4, the cyclist’s distance from home increased
              at an average rate of 7 miles per hour.
            </p>
            <p className="font-semibold text-[#14382A]">
              Two points → Secant line → Average rate of change
            </p>
          </div>
        ) : null}
      </div>

      <fieldset className="mt-4">
        <legend className="font-serif text-lg text-stone-900">
          Check your understanding
        </legend>
        <p className="mt-1 text-sm text-stone-700">
          The average rate of change from t = 1 to t = 4 is the slope of which
          line?
        </p>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {CHOICES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={choice === item.id}
              className={`${hit} justify-start px-3 ${
                choice === item.id
                  ? "bg-[var(--ua-evergreen)] text-white"
                  : "bg-white text-[#14382A] ring-1 ring-stone-200"
              }`}
              onClick={() => {
                setChoice(item.id);
                setChecked(false);
              }}
            >
              {item.id}. {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`${hit} mt-2 bg-[var(--ua-evergreen)] text-white`}
          disabled={choice == null}
          onClick={() => setChecked(true)}
        >
          Check
        </button>
        {checked && choice ? (
          <p className="mt-2 text-sm font-medium text-[#14382A]" role="status">
            {correct
              ? "Yes! A secant line connects two points on a curve and represents average rate of change."
              : "Not quite. Look at the straight line connecting points A and B."}
          </p>
        ) : null}
      </fieldset>
    </section>
  );
}
