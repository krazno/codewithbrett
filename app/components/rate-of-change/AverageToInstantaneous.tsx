"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

const T_MIN = 1.4;
const T_MAX = 3.45;
const S_MIN = 4;
const S_MAX = 24;
const VW = 680;
const VH = 292;
const PAD = { l: 64, r: 40, t: 26, b: 44 };
const PLOT_W = VW - PAD.l - PAD.r;
const PLOT_H = VH - PAD.t - PAD.b;
const A_T = 2;
const A_S = 10;

const NAVY = "#1B2A4A";
const BURGUNDY = "#8B2E4A";
const SECANT = "#2563EB";
const TANGENT = "#15803D";

type PartId = 1 | 2 | 3 | 4 | 5;

type GuidedPart = {
  id: 1 | 2 | 3 | 4;
  tab: string;
  interval: string;
  b: number;
  sBLabel: string;
  dtLabel: string;
  dsLabel: string;
  arocLabel: string;
  lines: string[];
};

const GUIDED: GuidedPart[] = [
  {
    id: 1,
    tab: "Part 1",
    interval: "[2, 3]",
    b: 3,
    sBLabel: "19",
    dtLabel: "1",
    dsLabel: "9",
    arocLabel: "9",
    lines: [
      "s(2) = 2² + 4(2) − 2 = 10 meters",
      "s(3) = 3² + 4(3) − 2 = 19 meters",
      "AROC = [s(3) − s(2)] / (3 − 2)",
      "AROC = (19 − 10) / (3 − 2)",
      "AROC = 9 / 1",
      "AROC = 9 m/s",
    ],
  },
  {
    id: 2,
    tab: "Part 2",
    interval: "[2, 2.5]",
    b: 2.5,
    sBLabel: "14.25",
    dtLabel: "0.5",
    dsLabel: "4.25",
    arocLabel: "8.5",
    lines: [
      "s(2.5) = (2.5)² + 4(2.5) − 2 = 14.25 meters",
      "AROC = [s(2.5) − s(2)] / (2.5 − 2)",
      "AROC = (14.25 − 10) / (2.5 − 2)",
      "AROC = 4.25 / 0.5",
      "AROC = 8.5 m/s",
    ],
  },
  {
    id: 3,
    tab: "Part 3",
    interval: "[2, 2.1]",
    b: 2.1,
    sBLabel: "10.81",
    dtLabel: "0.1",
    dsLabel: "0.81",
    arocLabel: "8.1",
    lines: [
      "s(2.1) = (2.1)² + 4(2.1) − 2 = 10.81 meters",
      "AROC = [s(2.1) − s(2)] / (2.1 − 2)",
      "AROC = (10.81 − 10) / (2.1 − 2)",
      "AROC = 0.81 / 0.1",
      "AROC = 8.1 m/s",
    ],
  },
  {
    id: 4,
    tab: "Part 4",
    interval: "[2, 2.01]",
    b: 2.01,
    sBLabel: "10.0801",
    dtLabel: "0.01",
    dsLabel: "0.0801",
    arocLabel: "8.01",
    lines: [
      "s(2.01) = (2.01)² + 4(2.01) − 2 = 10.0801 meters",
      "AROC = [s(2.01) − s(2)] / (2.01 − 2)",
      "AROC = (10.0801 − 10) / (2.01 − 2)",
      "AROC = 0.0801 / 0.01",
      "AROC = 8.01 m/s",
    ],
  },
];

function sOf(t: number) {
  return t * t + 4 * t - 2;
}

function arocFrom(b: number) {
  return b + 6;
}

function fmt(n: number) {
  const rounded = Math.round(n * 1e6) / 1e6;
  if (Number.isInteger(rounded)) return String(rounded);
  const text = rounded.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  return text;
}

function tPx(t: number) {
  return PAD.l + ((t - T_MIN) / (T_MAX - T_MIN)) * PLOT_W;
}
function sPx(s: number) {
  return PAD.t + ((S_MAX - s) / (S_MAX - S_MIN)) * PLOT_H;
}

function curvePath(t0 = T_MIN, t1 = T_MAX, toT = tPx, toS = sPx) {
  const parts: string[] = [];
  const step = (t1 - t0) / 80;
  for (let t = t0; t <= t1 + 1e-9; t += step) {
    const tt = Math.min(t, t1);
    parts.push(
      `${parts.length ? "L" : "M"} ${toT(tt).toFixed(2)} ${toS(sOf(tt)).toFixed(2)}`,
    );
  }
  return parts.join(" ");
}

const CURVE = curvePath();

function clipSlopeLine(t0: number, s0: number, m: number) {
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
  if (uniq.length >= 2) return [uniq[0], uniq[uniq.length - 1]] as const;
  return [
    { t: T_MIN, s: s0 + m * (T_MIN - t0) },
    { t: T_MAX, s: s0 + m * (T_MAX - t0) },
  ] as const;
}

const hit =
  "inline-flex min-h-11 items-center justify-center rounded-xl px-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

function isCorrectEstimate(raw: string) {
  const text = raw
    .trim()
    .toLowerCase()
    .replace(/approximately|approx\.?|about|around/g, " ")
    .replace(/m\/s|meters?\s*per\s*second/g, " ")
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const value = Number(text);
  return value === 8;
}

export function AverageToInstantaneous() {
  const graphId = useId();
  const playRef = useRef({ cancelled: false, timer: 0 });
  const [part, setPart] = useState<PartId>(1);
  const [graphB, setGraphB] = useState(3);
  const [revealCount, setRevealCount] = useState<Record<1 | 2 | 3 | 4, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });
  const [estimate, setEstimate] = useState("");
  const [estimateState, setEstimateState] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  const [playing, setPlaying] = useState(false);
  const [hideCalcs, setHideCalcs] = useState(false);
  const [hideTable, setHideTable] = useState(false);
  const [hideCoords, setHideCoords] = useState(false);
  const [hideTriangle, setHideTriangle] = useState(false);
  const [pauseAnim, setPauseAnim] = useState(false);
  const [showDerivative, setShowDerivative] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const animateTo = useCallback(
    (target: number) => {
      if (reducedMotion || pauseAnim) {
        setGraphB(target);
        return;
      }
      const start = graphB;
      const duration = 700;
      const t0 = performance.now();
      const tick = (now: number) => {
        if (playRef.current.cancelled && playing) return;
        const u = Math.min(1, (now - t0) / duration);
        const eased = 1 - (1 - u) * (1 - u);
        setGraphB(start + (target - start) * eased);
        if (u < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    [graphB, pauseAnim, playing, reducedMotion],
  );

  function goTo(next: PartId) {
    setPart(next);
    const target = next === 5 ? 2.001 : GUIDED[next - 1].b;
    animateTo(target);
  }

  function reset() {
    playRef.current.cancelled = true;
    window.clearTimeout(playRef.current.timer);
    setPlaying(false);
    setPart(1);
    setGraphB(3);
    setRevealCount({ 1: 0, 2: 0, 3: 0, 4: 0 });
    setEstimate("");
    setEstimateState("idle");
    setShowDerivative(false);
  }

  function revealPart(id: 1 | 2 | 3 | 4) {
    const total = GUIDED[id - 1].lines.length;
    if (revealCount[id] >= total) return;
    if (pauseAnim || reducedMotion) {
      setRevealCount((current) => ({ ...current, [id]: total }));
      return;
    }
    let shown = revealCount[id];
    const step = () => {
      shown += 1;
      setRevealCount((current) => ({ ...current, [id]: shown }));
      if (shown < total) {
        playRef.current.timer = window.setTimeout(step, 450);
      }
    };
    step();
  }

  async function playAll() {
    playRef.current.cancelled = false;
    setPlaying(true);
    setRevealCount({ 1: 0, 2: 0, 3: 0, 4: 0 });
    setEstimateState("idle");
    for (const id of [1, 2, 3, 4, 5] as const) {
      if (playRef.current.cancelled) break;
      setPart(id);
      const target = id === 5 ? 2.001 : GUIDED[id - 1].b;
      setGraphB(target);
      if (id < 5) {
        setRevealCount((current) => ({
          ...current,
          [id]: GUIDED[id - 1].lines.length,
        }));
      } else {
        setEstimate("8");
        setEstimateState("correct");
      }
      await new Promise<void>((resolve) => {
        playRef.current.timer = window.setTimeout(resolve, 3000);
      });
    }
    setPlaying(false);
  }

  const guided = part === 5 ? null : GUIDED[part - 1];
  const b = graphB;
  const sB = sOf(b);
  const dt = b - A_T;
  const ds = sB - A_S;
  const aroc = arocFrom(b);
  const showInset = b <= 2.12;
  const showTangent = part === 5;
  const shownLines = guided ? revealCount[guided.id] : 0;
  const fullyRevealed = (id: 1 | 2 | 3 | 4) =>
    revealCount[id] >= GUIDED[id - 1].lines.length;

  const secant = clipSlopeLine(A_T, A_S, aroc);
  const tangent = clipSlopeLine(A_T, A_S, 8);

  return (
    <section
      className="ua-card ua-shadow-soft p-3 sm:p-4 md:col-span-2"
      aria-labelledby="aroc-heading"
      style={{ background: "#FFFDF8" }}
    >
      <p className="text-[0.7rem] font-semibold tracking-wide text-emerald-800 uppercase">
        Calculus Honors · Block D
      </p>
      <h2
        id="aroc-heading"
        className="mt-0.5 font-serif text-xl sm:text-2xl"
        style={{ color: NAVY }}
      >
        From Average Rate to Instantaneous Rate
      </h2>
      <p
        className="mt-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold"
        style={{ background: "#E8EEF7", color: NAVY }}
      >
        I can calculate average rates of change over smaller intervals and use
        the pattern to estimate an instantaneous rate of change.
      </p>
      <p className="mt-2 text-sm leading-snug" style={{ color: NAVY }}>
        <span className="font-semibold">
          s(t) = t<sup>2</sup> + 4t − 2
        </span>
        {" · "}
        <span className="whitespace-nowrap font-serif text-base font-semibold">
          AROC = [s(b) − s(a)] / (b − a)
        </span>
        {" · estimate at t = 2 s"}
      </p>

      <div className="mt-3 flex flex-col gap-2">
        <div
          role="tablist"
          aria-label="Activity parts"
          className="grid grid-cols-5 gap-1"
        >
          {([1, 2, 3, 4, 5] as const).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={part === id}
              className={`${hit} min-h-10 px-1 text-xs sm:text-sm ${
                part === id ? "text-white" : "bg-white"
              }`}
              style={{
                background: part === id ? NAVY : "#F4F0E6",
                color: part === id ? "#fff" : NAVY,
              }}
              onClick={() => goTo(id)}
            >
              {id === 5 ? "Estimate" : `Part ${id}`}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            className={`${hit} min-h-10 bg-white`}
            style={{ color: NAVY }}
            disabled={part === 1}
            onClick={() => goTo((part - 1) as PartId)}
          >
            Previous
          </button>
          <button
            type="button"
            className={`${hit} min-h-10 bg-white`}
            style={{ color: NAVY }}
            disabled={part === 5}
            onClick={() => goTo((part + 1) as PartId)}
          >
            Next
          </button>
          <button
            type="button"
            className={`${hit} min-h-10 bg-white`}
            style={{ color: NAVY }}
            onClick={reset}
          >
            Reset
          </button>
          <button
            type="button"
            className={`${hit} min-h-10 text-white`}
            style={{ background: playing ? BURGUNDY : NAVY }}
            onClick={() => {
              if (playing) {
                playRef.current.cancelled = true;
                window.clearTimeout(playRef.current.timer);
                setPlaying(false);
                return;
              }
              void playAll();
            }}
          >
            {playing ? "Pause" : "Play All"}
          </button>
        </div>
      </div>

      <div className="mt-3 grid items-stretch gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,24rem)]">
        <div className="rounded-2xl border border-stone-200 bg-white">
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="mx-auto h-[min(32dvh,15rem)] w-full max-h-[15rem] sm:h-[min(34dvh,16.5rem)] sm:max-h-[16.5rem]"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-labelledby={graphId}
          >
            <title id={graphId}>
              Graph of s of t equals t squared plus 4t minus 2 with a secant
              through A at 2 comma 10 and B.
            </title>
            <rect x={PAD.l} y={PAD.t} width={PLOT_W} height={PLOT_H} fill="#FFFDF8" />
            {[1.5, 2, 2.5, 3].map((t) => (
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
            {[6, 10, 14, 18, 22].map((s) => (
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
              Position, s(t) (meters)
            </text>
            <path d={CURVE} fill="none" stroke={BURGUNDY} strokeWidth="2.8" />
            {showTangent ? (
              <line
                x1={tPx(tangent[0].t)}
                y1={sPx(tangent[0].s)}
                x2={tPx(tangent[1].t)}
                y2={sPx(tangent[1].s)}
                stroke={TANGENT}
                strokeWidth="3"
              />
            ) : (
              <line
                x1={tPx(secant[0].t)}
                y1={sPx(secant[0].s)}
                x2={tPx(secant[1].t)}
                y2={sPx(secant[1].s)}
                stroke={SECANT}
                strokeWidth="2.6"
              />
            )}
            {!hideTriangle && dt > 0.15 ? (
              <g>
                <polyline
                  points={`${tPx(A_T)},${sPx(A_S)} ${tPx(b)},${sPx(A_S)} ${tPx(b)},${sPx(sB)}`}
                  fill="none"
                  stroke="#C45C78"
                  strokeWidth="1.8"
                  strokeDasharray="5 4"
                />
                <text
                  x={(tPx(A_T) + tPx(b)) / 2}
                  y={Math.min(sPx(A_S) + 18, PAD.t + PLOT_H - 6)}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill="#9B3A52"
                  stroke="#fff"
                  strokeWidth="3"
                  paintOrder="stroke"
                >
                  Δt = {fmt(dt)}
                </text>
                <text
                  x={tPx(b) > PAD.l + PLOT_W - 70 ? tPx(b) - 10 : tPx(b) + 10}
                  y={(sPx(A_S) + sPx(sB)) / 2}
                  textAnchor={tPx(b) > PAD.l + PLOT_W - 70 ? "end" : "start"}
                  fontSize="13"
                  fontWeight="700"
                  fill="#9B3A52"
                  stroke="#fff"
                  strokeWidth="3"
                  paintOrder="stroke"
                >
                  Δs = {fmt(ds)}
                </text>
              </g>
            ) : null}
            <circle
              cx={tPx(A_T)}
              cy={sPx(A_S)}
              r="6"
              fill={NAVY}
              stroke="#fff"
              strokeWidth="2"
            />
            {b > 2.08 ? (
              <circle
                cx={tPx(b)}
                cy={sPx(sB)}
                r="6"
                fill={showTangent ? TANGENT : SECANT}
                stroke="#fff"
                strokeWidth="2"
              />
            ) : null}
            {!hideCoords ? (
              <>
                <text
                  x={tPx(A_T) - 8}
                  y={sPx(A_S) - 10}
                  textAnchor="end"
                  fontSize="14"
                  fontWeight="700"
                  fill={NAVY}
                  stroke="#fff"
                  strokeWidth="3"
                  paintOrder="stroke"
                >
                  A(2, 10)
                </text>
                {b > 2.08 ? (
                  <text
                    x={b > 2.7 ? tPx(b) - 8 : tPx(b) + 8}
                    y={Math.max(sPx(sB) - 10, PAD.t + 14)}
                    textAnchor={b > 2.7 ? "end" : "start"}
                    fontSize="14"
                    fontWeight="700"
                    fill={NAVY}
                    stroke="#fff"
                    strokeWidth="3"
                    paintOrder="stroke"
                  >
                    B({fmt(b)}, {fmt(sB)})
                  </text>
                ) : null}
              </>
            ) : null}
            {!showInset ? (
              <text
                x={Math.min(
                  (tPx(A_T) + tPx(Math.min(b, 2.8))) / 2 + 12,
                  PAD.l + PLOT_W - 8,
                )}
                y={Math.max((sPx(A_S) + sPx(sB)) / 2 - 8, PAD.t + 16)}
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                fill={showTangent ? TANGENT : SECANT}
                stroke="#fff"
                strokeWidth="3"
                paintOrder="stroke"
              >
                {showTangent ? "8 m/s" : `${fmt(aroc)} m/s`}
              </text>
            ) : null}
            {showTangent && estimateState === "correct" ? (
              <text
                x={tPx(2.45)}
                y={Math.max(sPx(sOf(2.45)) - 16, PAD.t + 14)}
                fontSize="13"
                fontWeight="700"
                fill={TANGENT}
                stroke="#fff"
                strokeWidth="3"
                paintOrder="stroke"
              >
                Estimated instantaneous rate = 8 m/s
              </text>
            ) : null}
            {showInset ? (
              <Inset b={b} hideCoords={hideCoords} tangent={showTangent} />
            ) : null}
          </svg>
          <div
            className="grid grid-cols-2 gap-x-3 gap-y-1 border-t border-stone-200 px-3 py-2 text-sm font-semibold sm:grid-cols-5"
            style={{ color: NAVY }}
          >
            <p className="whitespace-nowrap">A(2, 10)</p>
            <p className="whitespace-nowrap">
              B({fmt(b)}, {fmt(sB)})
            </p>
            <p className="whitespace-nowrap">Δt = {fmt(dt)} s</p>
            <p className="whitespace-nowrap">Δs = {fmt(ds)} m</p>
            <p className="whitespace-nowrap sm:col-auto col-span-2">
              slope = {fmt(aroc)} m/s
            </p>
          </div>
        </div>

        <div className="flex min-h-0 flex-col overflow-auto rounded-2xl border border-stone-200 bg-white p-3">
          {part === 5 ? (
            <div>
              <p className="font-serif text-xl" style={{ color: NAVY }}>
                9, 8.5, 8.1, 8.01, …
              </p>
              <p className="mt-2 text-sm" style={{ color: NAVY }}>
                As b gets closer and closer to 2, what value do the average
                rates appear to approach?
              </p>
              <label className="mt-3 block text-sm font-semibold" style={{ color: NAVY }} htmlFor={`${graphId}-est`}>
                Your estimate
              </label>
              <input
                id={`${graphId}-est`}
                value={estimate}
                onChange={(event) => {
                  setEstimate(event.target.value);
                  setEstimateState("idle");
                }}
                className="mt-1 min-h-11 w-full rounded-xl border border-stone-300 px-3 text-base focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              />
              <button
                type="button"
                className={`${hit} mt-2 w-full text-white`}
                style={{ background: TANGENT }}
                onClick={() =>
                  setEstimateState(isCorrectEstimate(estimate) ? "correct" : "incorrect")
                }
              >
                Check Estimate
              </button>
              {estimateState === "correct" ? (
                <div className="mt-3 space-y-2 text-sm" style={{ color: NAVY }}>
                  <p className="font-semibold" style={{ color: TANGENT }}>
                    Correct. The average rates approach 8 m/s.
                  </p>
                  <p>
                    The runner’s estimated instantaneous rate of change at t = 2
                    is 8 m/s.
                  </p>
                  <p>
                    As the interval becomes smaller, the average rates 9, 8.5,
                    8.1, and 8.01 get closer to 8. On the graph, the secant
                    lines approach the tangent line at t = 2.
                  </p>
                  <p className="font-semibold">
                    Secant line → Tangent line
                    <br />
                    Average rate → Instantaneous rate
                  </p>
                </div>
              ) : null}
              {estimateState === "incorrect" ? (
                <p className="mt-2 text-sm font-medium text-red-700" role="status">
                  Look at the pattern 9, 8.5, 8.1, 8.01. What number are they
                  heading toward?
                </p>
              ) : null}
            </div>
          ) : guided && !hideCalcs ? (
            <div>
              <p className="font-serif text-lg" style={{ color: NAVY }}>
                Interval {guided.interval}
              </p>
              <p className="mt-1 text-sm font-semibold" style={{ color: NAVY }}>
                A = (2, 10) · B = ({fmt(guided.b)}, {guided.sBLabel})
              </p>
              <ul className="mt-2 space-y-1 text-sm" style={{ color: NAVY }}>
                {guided.lines.map((line, index) => (
                  <li
                    key={line}
                    className="font-mono text-[0.82rem] leading-snug sm:text-sm"
                  >
                    {index < shownLines ? line : "?"}
                  </li>
                ))}
              </ul>
              {shownLines < guided.lines.length ? (
                <button
                  type="button"
                  className={`${hit} mt-3 w-full text-white`}
                  style={{ background: SECANT }}
                  onClick={() => revealPart(guided.id)}
                >
                  Reveal Calculation
                </button>
              ) : (
                <p className="mt-3 text-sm font-semibold" style={{ color: SECANT }}>
                  Δt = {guided.dtLabel} s · Δs = {guided.dsLabel} m · Secant
                  slope = {guided.arocLabel} m/s
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm" style={{ color: NAVY }}>
              Calculations are hidden in Teacher Mode.
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-stone-200 bg-white px-3 py-2">
        <label className="flex flex-col gap-1 text-sm font-semibold" style={{ color: NAVY }} htmlFor={`${graphId}-b`}>
          Move b closer to 2
          <input
            id={`${graphId}-b`}
            type="range"
            min={2.001}
            max={3}
            step={0.001}
            value={b}
            onChange={(event) => setGraphB(Number(event.target.value))}
            className="w-full"
            aria-valuemin={2.001}
            aria-valuemax={3}
            aria-valuenow={Number(b.toFixed(3))}
            aria-valuetext={`b equals ${fmt(b)}`}
          />
        </label>
        <p className="mt-1 text-sm font-semibold" style={{ color: NAVY }}>
          Interval [2, {fmt(b)}] · B({fmt(b)}, {fmt(sB)}) · Δt = {fmt(dt)} · Δs ={" "}
          {fmt(ds)} · AROC = {fmt(aroc)} m/s
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[3, 2.5, 2.1, 2.01].map((value) => (
            <button
              key={value}
              type="button"
              className={`${hit} bg-[#F4F0E6]`}
              style={{ color: NAVY }}
              onClick={() => setGraphB(value)}
            >
              b = {value}
            </button>
          ))}
        </div>
      </div>

      {!hideTable ? (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">
              Average rates of change as the interval shrinks toward t = 2
            </caption>
            <thead style={{ background: "#E8EEF7", color: NAVY }}>
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">
                  Interval
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  s(2)
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  s(b)
                </th>
                <th scope="col" className="px-3 py-2 font-semibold">
                  Average Rate of Change
                </th>
              </tr>
            </thead>
            <tbody>
              {GUIDED.map((row) =>
                fullyRevealed(row.id) ? (
                  <tr
                    key={row.id}
                    className={part === row.id ? "font-semibold" : undefined}
                    style={{
                      background: part === row.id ? "#E8F0FE" : undefined,
                      color: NAVY,
                    }}
                  >
                    <td className="px-3 py-2">{row.interval}</td>
                    <td className="px-3 py-2">10</td>
                    <td className="px-3 py-2">{row.sBLabel}</td>
                    <td className="px-3 py-2">{row.arocLabel} m/s</td>
                  </tr>
                ) : null,
              )}
              {estimateState === "correct" ? (
                <tr
                  className={part === 5 ? "font-semibold" : undefined}
                  style={{
                    background: part === 5 ? "#EAF6EE" : undefined,
                    color: NAVY,
                  }}
                >
                  <td className="px-3 py-2">b → 2</td>
                  <td className="px-3 py-2">10</td>
                  <td className="px-3 py-2">approaches 10</td>
                  <td className="px-3 py-2">approaches 8 m/s</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {showDerivative ? (
        <p className="mt-3 rounded-xl px-3 py-2 text-sm" style={{ background: "#EAF6EE", color: NAVY }}>
          Extension: s′(t) = 2t + 4, so s′(2) = 8 m/s.
        </p>
      ) : null}

      <details className="mt-4 text-sm" style={{ color: NAVY }}>
        <summary className="cursor-pointer text-xs tracking-wide text-stone-500 uppercase">
          Teacher Mode
        </summary>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              checked={hideCalcs}
              onChange={(event) => setHideCalcs(event.target.checked)}
            />
            Hide calculations
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              checked={hideTable}
              onChange={(event) => setHideTable(event.target.checked)}
            />
            Hide table
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              checked={hideCoords}
              onChange={(event) => setHideCoords(event.target.checked)}
            />
            Hide coordinates
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              checked={hideTriangle}
              onChange={(event) => setHideTriangle(event.target.checked)}
            />
            Hide slope triangle
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              checked={pauseAnim}
              onChange={(event) => setPauseAnim(event.target.checked)}
            />
            Pause animations
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              checked={showDerivative}
              onChange={(event) => setShowDerivative(event.target.checked)}
            />
            Show derivative extension
          </label>
        </div>
        <button type="button" className={`${hit} mt-2 bg-[#F4F0E6]`} onClick={reset}>
          Reset the activity
        </button>
      </details>
    </section>
  );
}

function Inset({
  b,
  hideCoords,
  tangent,
}: {
  b: number;
  hideCoords: boolean;
  tangent: boolean;
}) {
  const pad = 8;
  const x0 = 478;
  const y0 = 18;
  const w = 186;
  const h = 118;
  const t0 = Math.min(1.985, b - 0.02);
  const t1 = Math.max(2.03, b + 0.02);
  const s0 = sOf(t0) - 0.08;
  const s1 = sOf(t1) + 0.08;
  const toT = (t: number) => x0 + pad + ((t - t0) / (t1 - t0)) * (w - pad * 2);
  const toS = (s: number) => y0 + pad + ((s1 - s) / (s1 - s0)) * (h - pad * 2);
  const clipId = "aroc-inset-clip";
  const sB = sOf(b);

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect x={x0} y={y0} width={w} height={h} rx="6" />
        </clipPath>
      </defs>
      <rect
        x={x0}
        y={y0}
        width={w}
        height={h}
        fill="#fff"
        stroke={NAVY}
        strokeWidth="1.4"
        rx="6"
      />
      <text x={x0 + 10} y={y0 + 14} fontSize="10" fontWeight="700" fill={NAVY}>
        Magnified near t = 2
      </text>
      <g clipPath={`url(#${clipId})`}>
        <path
          d={curvePath(t0, t1, toT, toS)}
          fill="none"
          stroke={BURGUNDY}
          strokeWidth="2"
        />
        <line
          x1={toT(A_T)}
          y1={toS(A_S)}
          x2={toT(b)}
          y2={toS(sB)}
          stroke={tangent ? TANGENT : SECANT}
          strokeWidth="2"
        />
        <circle cx={toT(A_T)} cy={toS(A_S)} r="4" fill={NAVY} />
        <circle cx={toT(b)} cy={toS(sB)} r="4" fill={tangent ? TANGENT : SECANT} />
      </g>
      {!hideCoords ? (
        <text x={x0 + 10} y={y0 + h - 8} fontSize="10" fill={NAVY}>
          B({fmt(b)}, {fmt(sB)})
        </text>
      ) : null}
    </g>
  );
}
