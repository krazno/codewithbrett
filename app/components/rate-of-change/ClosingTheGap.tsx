"use client";

import { useEffect, useId, useRef, useState } from "react";

const T_MIN = 0;
const T_MAX = 2.45;
const S_MIN = -0.6;
const S_MAX = 9.6;
const VW = 720;
const VH = 500;
const PAD = { l: 54, r: 28, t: 26, b: 46 };
const PLOT_W = VW - PAD.l - PAD.r;
const PLOT_H = VH - PAD.t - PAD.b;
const T_A = 1;
const S_A = 3;
const TANGENT_SLOPE = 4;

type Step = {
  id: 1 | 2 | 3;
  t: number;
  s: number;
  dt: number;
  ds: number;
  rate: number;
  interval: string;
  label: string;
};

const STEPS: Step[] = [
  {
    id: 1,
    t: 2,
    s: 8,
    dt: 1,
    ds: 5,
    rate: 5,
    interval: "[1, 2]",
    label: "t = 2",
  },
  {
    id: 2,
    t: 1.1,
    s: 3.41,
    dt: 0.1,
    ds: 0.41,
    rate: 4.1,
    interval: "[1, 1.1]",
    label: "t = 1.1",
  },
  {
    id: 3,
    t: 1.01,
    s: 3.0401,
    dt: 0.01,
    ds: 0.0401,
    rate: 4.01,
    interval: "[1, 1.01]",
    label: "t = 1.01",
  },
];

function sOf(t: number) {
  return t * t + 2 * t;
}

function fmt(n: number) {
  const rounded = Math.round(n * 10000) / 10000;
  if (Object.is(rounded, -0)) return "0";
  return String(rounded);
}

function tPx(t: number) {
  return PAD.l + ((t - T_MIN) / (T_MAX - T_MIN)) * PLOT_W;
}

function sPx(s: number) {
  return PAD.t + ((S_MAX - s) / (S_MAX - S_MIN)) * PLOT_H;
}

function sampleCurve() {
  const parts: string[] = [];
  let started = false;
  for (let t = T_MIN; t <= T_MAX + 1e-9; t += 0.03) {
    const tt = Math.min(t, T_MAX);
    const s = sOf(tt);
    if (s < S_MIN - 0.4 || s > S_MAX + 0.4) {
      started = false;
      continue;
    }
    parts.push(
      `${started ? "L" : "M"} ${tPx(tt).toFixed(2)} ${sPx(s).toFixed(2)}`,
    );
    started = true;
  }
  return parts.join(" ");
}

const CURVE = sampleCurve();

function clipLine(t0: number, s0: number, m: number) {
  const pts: { t: number; s: number }[] = [];
  const add = (t: number, s: number) => {
    if (
      t >= T_MIN - 1e-6 &&
      t <= T_MAX + 1e-6 &&
      s >= S_MIN - 1e-6 &&
      s <= S_MAX + 1e-6
    ) {
      pts.push({ t, s });
    }
  };
  add(T_MIN, s0 + m * (T_MIN - t0));
  add(T_MAX, s0 + m * (T_MAX - t0));
  if (Math.abs(m) > 1e-8) {
    add(t0 + (S_MIN - s0) / m, S_MIN);
    add(t0 + (S_MAX - s0) / m, S_MAX);
  }
  const uniq: { t: number; s: number }[] = [];
  for (const p of pts) {
    if (
      !uniq.some((q) => Math.abs(q.t - p.t) < 1e-4 && Math.abs(q.s - p.s) < 1e-4)
    ) {
      uniq.push(p);
    }
  }
  uniq.sort((a, b) => a.t - b.t);
  if (uniq.length >= 2) return [uniq[0], uniq[uniq.length - 1]] as const;
  return [
    { t: T_MIN, s: s0 + m * (T_MIN - t0) },
    { t: T_MAX, s: s0 + m * (T_MAX - t0) },
  ] as const;
}

const hit =
  "inline-flex min-h-14 min-w-[7.5rem] flex-col items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

export function ClosingTheGap() {
  const labelId = useId();
  const rafRef = useRef<number | null>(null);
  const tBRef = useRef(STEPS[0].t);
  const [tB, setTB] = useState(STEPS[0].t);
  const [stepId, setStepId] = useState<1 | 2 | 3>(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  tBRef.current = tB;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const landed = STEPS.find((step) => step.id === stepId) ?? STEPS[0];
  const snapped = Math.abs(tB - landed.t) < 1e-4;
  const sB = snapped ? landed.s : sOf(tB);
  const dt = snapped ? landed.dt : tB - T_A;
  const ds = snapped ? landed.ds : sB - S_A;
  const rate = snapped ? landed.rate : ds / dt;
  const interval = snapped ? landed.interval : `[1, ${fmt(tB)}]`;
  const close = landed.id === 3 && snapped;
  const secant = clipLine(T_A, S_A, rate);
  const tangent = clipLine(T_A, S_A, TANGENT_SLOPE);
  const showDelta = dt > 0.25;
  const midT = (T_A + tB) / 2;
  const midS = (S_A + sB) / 2;

  function goTo(step: Step) {
    setStepId(step.id);
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    const from = tBRef.current;
    if (reducedMotion || Math.abs(from - step.t) < 1e-4) {
      setTB(step.t);
      return;
    }
    const to = step.t;
    const start = performance.now();
    const duration = 700;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - p) * (1 - p);
      setTB(from + (to - from) * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        rafRef.current = null;
        setTB(to);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  const tTicks = [0, 1, 2];
  const sTicks = [0, 2, 4, 6, 8];

  return (
    <div className="overflow-x-hidden rounded-2xl border border-[rgba(31,77,58,0.16)] bg-[#FFFDF7] p-4 text-[#1F2933] sm:p-6">
      <header>
        <div>
          <h2 className="font-serif text-2xl leading-tight text-[#14382A] sm:text-3xl">
            Closing the Gap
          </h2>
          <p className="mt-0.5 text-[0.7rem] tracking-wide text-[#1F4D3A] uppercase sm:text-xs">
            Move the second point closer to t = 1.
          </p>
          <p className="mt-2 font-mono text-sm text-[#1F4D3A] sm:text-base">
            s(t) = t² + 2t
          </p>
        </div>
      </header>

      <div
        className="mt-5 flex flex-wrap gap-2"
        role="group"
        aria-label="Move point B closer to t = 1"
      >
        {STEPS.map((step) => (
          <button
            key={step.id}
            type="button"
            className={`${hit} ${
              stepId === step.id
                ? "bg-[#1F4D3A] text-white"
                : "border border-[rgba(31,77,58,0.22)] bg-white text-[#14382A]"
            }`}
            aria-pressed={stepId === step.id}
            onClick={() => goTo(step)}
          >
            <span>{step.label}</span>
            <span
              className={`text-[0.7rem] font-medium ${
                stepId === step.id ? "text-white/80" : "text-[#1F4D3A]"
              }`}
            >
              {step.interval}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.85fr)]">
        <div className="overflow-hidden rounded-2xl border border-[rgba(31,77,58,0.18)] bg-[#FFFDF7]">
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="h-auto w-full select-none"
            role="img"
            aria-labelledby={labelId}
          >
            <title id={labelId}>
              Graph of position s of t equals t squared plus 2 t, with a fixed
              point at t equals 1 and a second point moving closer.
            </title>
            <rect
              x={PAD.l}
              y={PAD.t}
              width={PLOT_W}
              height={PLOT_H}
              fill="#FFFDF7"
            />
            {tTicks.map((tick) => (
              <line
                key={`vg-${tick}`}
                x1={tPx(tick)}
                x2={tPx(tick)}
                y1={PAD.t}
                y2={PAD.t + PLOT_H}
                stroke={tick === 0 ? "rgba(31,77,58,0.45)" : "rgba(31,77,58,0.12)"}
                strokeWidth={tick === 0 ? 1.6 : 1}
              />
            ))}
            {sTicks.map((tick) => (
              <line
                key={`hg-${tick}`}
                x1={PAD.l}
                x2={PAD.l + PLOT_W}
                y1={sPx(tick)}
                y2={sPx(tick)}
                stroke={tick === 0 ? "rgba(31,77,58,0.45)" : "rgba(31,77,58,0.12)"}
                strokeWidth={tick === 0 ? 1.6 : 1}
              />
            ))}
            <path
              d={CURVE}
              fill="none"
              stroke="#1F4D3A"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {close ? (
              <line
                x1={tPx(tangent[0].t)}
                y1={sPx(tangent[0].s)}
                x2={tPx(tangent[1].t)}
                y2={sPx(tangent[1].s)}
                stroke="#C49A2A"
                strokeWidth="4"
                strokeLinecap="round"
              />
            ) : null}
            <line
              x1={tPx(secant[0].t)}
              y1={sPx(secant[0].s)}
              x2={tPx(secant[1].t)}
              y2={sPx(secant[1].s)}
              stroke={close ? "#C49A2A" : "#D6B55B"}
              strokeWidth={close ? 3.4 : 3.6}
              strokeLinecap="round"
              opacity={close ? 0.55 : 1}
            />
            <text
              x={tPx(close ? T_A + 0.55 : midT)}
              y={sPx(close ? S_A + 1.15 : midS) - 12}
              textAnchor="middle"
              fontSize="15"
              fontWeight="700"
              fill="#8A6A1A"
              opacity="0.9"
            >
              {close ? "Tangent Line" : "Secant Line"}
            </text>

            {showDelta ? (
              <g>
                <polyline
                  points={`${tPx(T_A)},${sPx(S_A)} ${tPx(tB)},${sPx(S_A)} ${tPx(tB)},${sPx(sB)}`}
                  fill="rgba(214,181,91,0.16)"
                  stroke="none"
                />
                <line
                  x1={tPx(T_A)}
                  y1={sPx(S_A)}
                  x2={tPx(tB)}
                  y2={sPx(S_A)}
                  stroke="#C49A2A"
                  strokeWidth="2.4"
                />
                <line
                  x1={tPx(tB)}
                  y1={sPx(S_A)}
                  x2={tPx(tB)}
                  y2={sPx(sB)}
                  stroke="#1F4D3A"
                  strokeWidth="2.4"
                />
                <text
                  x={(tPx(T_A) + tPx(tB)) / 2}
                  y={sPx(S_A) + 22}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="700"
                  fill="#8A6A1A"
                >
                  Δt
                </text>
                <text
                  x={tPx(tB) + 18}
                  y={(sPx(S_A) + sPx(sB)) / 2 + 5}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="700"
                  fill="#1F4D3A"
                >
                  Δs
                </text>
              </g>
            ) : null}

            {tTicks.map((tick) => (
              <g key={`tt-${tick}`}>
                <line
                  x1={tPx(tick)}
                  x2={tPx(tick)}
                  y1={sPx(0) - 5}
                  y2={sPx(0) + 5}
                  stroke="#14382A"
                  strokeWidth="1.4"
                />
                <text
                  x={tPx(tick)}
                  y={sPx(0) + 22}
                  textAnchor="middle"
                  fontSize="14"
                  fill="#1F2933"
                >
                  {tick}
                </text>
              </g>
            ))}
            {sTicks
              .filter((tick) => tick !== 0)
              .map((tick) => (
                <g key={`st-${tick}`}>
                  <line
                    x1={tPx(0) - 5}
                    x2={tPx(0) + 5}
                    y1={sPx(tick)}
                    y2={sPx(tick)}
                    stroke="#14382A"
                    strokeWidth="1.4"
                  />
                  <text
                    x={tPx(0) - 10}
                    y={sPx(tick) + 5}
                    textAnchor="end"
                    fontSize="14"
                    fill="#1F2933"
                  >
                    {tick}
                  </text>
                </g>
              ))}
            <text
              x={PAD.l + PLOT_W - 2}
              y={sPx(0) - 10}
              fontSize="16"
              fontWeight="700"
              fill="#14382A"
            >
              t (s)
            </text>
            <text
              x={tPx(0) + 10}
              y={PAD.t + 16}
              fontSize="16"
              fontWeight="700"
              fill="#14382A"
            >
              s (m)
            </text>

            <g>
              <circle
                cx={tPx(T_A)}
                cy={sPx(S_A)}
                r="11"
                fill="#1F4D3A"
                stroke="#14382A"
                strokeWidth="2"
              />
              <text
                x={tPx(T_A) - 16}
                y={sPx(S_A) - 16}
                textAnchor="middle"
                fontSize="16"
                fontWeight="700"
                fill="#14382A"
              >
                A
              </text>
              <circle
                cx={tPx(tB)}
                cy={sPx(sB)}
                r="11"
                fill="#D6B55B"
                stroke="#14382A"
                strokeWidth="2"
              />
              <text
                x={tPx(tB) + (close ? 20 : 0)}
                y={sPx(sB) - 16}
                textAnchor="middle"
                fontSize="16"
                fontWeight="700"
                fill="#14382A"
              >
                B
              </text>
            </g>
          </svg>
          <p className="border-t border-[rgba(31,77,58,0.12)] px-3 py-2 text-center text-xs text-[#1F4D3A]">
            A stays at t = 1 · B moves closer
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[rgba(31,77,58,0.16)] bg-white px-4 py-4">
            <p className="text-[0.7rem] font-semibold tracking-wide text-[#1F4D3A] uppercase">
              {close ? "Instantaneous rate" : "Average rate of change"}
            </p>
            <p className="mt-3 font-mono text-sm leading-relaxed text-[#14382A]">
              Interval: {interval}
              <br />
              A = (1 s, 3 m)
              <br />
              B = ({fmt(tB)} s, {fmt(sB)} m)
            </p>
            <p className="mt-3 font-mono text-sm leading-relaxed text-[#14382A]">
              Δs = {fmt(ds)} m
              <br />
              Δt = {fmt(dt)} s
            </p>
            <p
              className="mt-4 font-serif text-2xl leading-snug text-[#14382A] sm:text-3xl"
              aria-live="polite"
            >
              {fmt(ds)} m / {fmt(dt)} s ={" "}
              <span className="inline-block rounded-md border-2 border-[#D6B55B] px-2 py-0.5">
                {fmt(rate)} m/s
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-[rgba(31,77,58,0.16)] bg-white px-4 py-4 text-sm text-[#14382A]">
            <p className="font-semibold">What do you notice?</p>
            {close ? (
              <>
                <p className="mt-2 text-[#1F4D3A]">
                  The average rates are approaching about 4 m/s.
                </p>
                <p className="mt-3 font-medium">
                  What do you think the instantaneous rate is at t = 1?
                </p>
              </>
            ) : (
              <p className="mt-2 text-[#1F4D3A]">
                Watch the secant as the interval shrinks.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
