"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

const X_MIN = -0.15;
const X_MAX = 4.7;
const Y_MIN = -1.2;
const Y_MAX = 17.2;
const X_LO = 0;
const X_HI = 4.4;
const MIN_SEP = 0.1;
const TANGENT_SEP = 0.18;
const VW = 720;
const VH = 500;
const PAD = { l: 50, r: 28, t: 26, b: 42 };
const PLOT_W = VW - PAD.l - PAD.r;
const PLOT_H = VH - PAD.t - PAD.b;

type Example = {
  id: 1 | 2 | 3;
  label: string;
  range: string;
  x1: number;
  x2: number;
};

const EXAMPLES: Example[] = [
  { id: 1, label: "Example 1", range: "x = 1 to 3", x1: 1, x2: 3 },
  { id: 2, label: "Example 2", range: "x = 0 to 2", x1: 0, x2: 2 },
  { id: 3, label: "Example 3", range: "x = 2 to 4", x1: 2, x2: 4 },
];

function f(x: number) {
  return x * x;
}

function fmt(n: number) {
  const r = Math.round(n * 100) / 100;
  return String(r);
}

function xPx(x: number) {
  return PAD.l + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
}

function yPx(y: number) {
  return PAD.t + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PLOT_H;
}

function sampleCurve() {
  const parts: string[] = [];
  let started = false;
  for (let x = X_MIN; x <= X_MAX + 1e-9; x += 0.04) {
    const xx = Math.min(x, X_MAX);
    const y = f(xx);
    if (y < Y_MIN - 0.5 || y > Y_MAX + 0.5) {
      started = false;
      continue;
    }
    parts.push(`${started ? "L" : "M"} ${xPx(xx).toFixed(2)} ${yPx(y).toFixed(2)}`);
    started = true;
  }
  return parts.join(" ");
}

const CURVE = sampleCurve();

function clipLine(x0: number, y0: number, m: number) {
  const pts: { x: number; y: number }[] = [];
  const add = (x: number, y: number) => {
    if (
      x >= X_MIN - 1e-6 &&
      x <= X_MAX + 1e-6 &&
      y >= Y_MIN - 1e-6 &&
      y <= Y_MAX + 1e-6
    ) {
      pts.push({ x, y });
    }
  };
  add(X_MIN, y0 + m * (X_MIN - x0));
  add(X_MAX, y0 + m * (X_MAX - x0));
  if (Math.abs(m) > 1e-8) {
    add(x0 + (Y_MIN - y0) / m, Y_MIN);
    add(x0 + (Y_MAX - y0) / m, Y_MAX);
  }
  const uniq: { x: number; y: number }[] = [];
  for (const p of pts) {
    if (!uniq.some((q) => Math.abs(q.x - p.x) < 1e-4 && Math.abs(q.y - p.y) < 1e-4)) {
      uniq.push(p);
    }
  }
  uniq.sort((a, b) => a.x - b.x);
  if (uniq.length >= 2) return [uniq[0], uniq[uniq.length - 1]] as const;
  return [
    { x: X_MIN, y: y0 + m * (X_MIN - x0) },
    { x: X_MAX, y: y0 + m * (X_MAX - x0) },
  ] as const;
}

function clampX(x: number) {
  return Math.min(X_HI, Math.max(X_LO, x));
}

const hit =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

export function WhereCalculusGoesNext() {
  const labelId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<"a" | "b" | null>(null);
  const ptsRef = useRef({ a: 1, b: 3 });
  const [xA, setXA] = useState(1);
  const [xB, setXB] = useState(3);
  const [example, setExample] = useState<1 | 2 | 3 | null>(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  ptsRef.current = { a: xA, b: xB };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const yA = f(xA);
  const yB = f(xB);
  const dx = xB - xA;
  const dy = yB - yA;
  const sep = Math.abs(dx);
  const isTangent = sep <= TANGENT_SEP;
  const slope = isTangent ? 2 * xA : dy / dx;
  const rate = dy / dx;
  const line = clipLine(xA, yA, slope);
  const sign = dx >= 0 ? 1 : -1;

  const svgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      vx: ((clientX - rect.left) / rect.width) * VW,
      vy: ((clientY - rect.top) / rect.height) * VH,
    };
  }, []);

  const toGraphX = useCallback((vx: number) => {
    return X_MIN + ((vx - PAD.l) / PLOT_W) * (X_MAX - X_MIN);
  }, []);

  const movePoint = useCallback((which: "a" | "b", raw: number) => {
    const next = clampX(raw);
    const { a, b } = ptsRef.current;
    const other = which === "a" ? b : a;
    let clamped =
      Math.abs(next - other) < MIN_SEP
        ? other + (next >= other ? MIN_SEP : -MIN_SEP)
        : next;
    clamped = clampX(clamped);
    if (Math.abs(clamped - other) < MIN_SEP) return;
    if (which === "a") setXA(clamped);
    else setXB(clamped);
    setExample(null);
  }, []);

  function loadExample(ex: Example) {
    setExample(ex.id);
    setXA(ex.x1);
    setXB(ex.x2);
  }

  function reset() {
    loadExample(EXAMPLES[0]);
  }

  function setSeparation(nextSep: number) {
    const s = Math.max(MIN_SEP, nextSep);
    setXB(clampX(xA + sign * s));
    setExample(null);
  }

  const xTicks = [0, 1, 2, 3, 4];
  const yTicks = [0, 2, 4, 6, 8, 10, 12, 14, 16];

  const midX = (xA + xB) / 2;
  const midY = (yA + yB) / 2;
  const corner = { x: xB, y: yA };
  const showDelta = sep > 0.35;

  const lineLabel = isTangent ? "Tangent Line" : "Secant Line";
  const rateLabel = isTangent
    ? "Instantaneous Rate of Change"
    : "Average Rate of Change";

  return (
    <div className="overflow-x-hidden rounded-2xl border border-[rgba(31,77,58,0.16)] bg-[#FFFDF7] p-4 text-[#1F2933] sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl leading-tight text-[#14382A] sm:text-3xl">
            Where Calculus Goes Next
          </h2>
          <p className="mt-0.5 text-[0.7rem] tracking-wide text-[#1F4D3A] uppercase sm:text-xs">
            From two points to one moment.
          </p>
        </div>
        <p className="text-xs font-semibold text-[#1F4D3A] sm:text-sm" aria-live="polite">
          {isTangent ? (
            <>
              <span className="text-[#14382A]">One moment</span>
              <span className="mx-1.5 text-[#D6B55B]">→</span>
              tangent
              <span className="mx-1.5 text-[#D6B55B]">→</span>
              instantaneous rate
            </>
          ) : (
            <>
              <span className="text-[#14382A]">Two points</span>
              <span className="mx-1.5 text-[#D6B55B]">→</span>
              secant
              <span className="mx-1.5 text-[#D6B55B]">→</span>
              average rate
            </>
          )}
        </p>
      </header>

      <div
        className="mt-5 flex flex-wrap gap-2"
        role="group"
        aria-label="Teacher examples"
      >
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            type="button"
            className={`${hit} min-w-[7.5rem] flex-col gap-0 py-2 ${
              example === ex.id
                ? "bg-[#1F4D3A] text-white"
                : "border border-[rgba(31,77,58,0.22)] bg-white text-[#14382A]"
            }`}
            aria-pressed={example === ex.id}
            onClick={() => loadExample(ex)}
          >
            <span>{ex.label}</span>
            <span className={`text-[0.7rem] font-medium ${example === ex.id ? "text-white/80" : "text-[#1F4D3A]"}`}>
              {ex.range}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.85fr)]">
        <div className="overflow-hidden rounded-2xl border border-[rgba(31,77,58,0.18)] bg-[#FFFDF7]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VW} ${VH}`}
            className="h-auto w-full touch-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B]"
            role="img"
            aria-labelledby={labelId}
            onPointerDown={(e) => {
              const p = svgPoint(e.clientX, e.clientY);
              if (!p) return;
              const dA = Math.hypot(p.vx - xPx(xA), p.vy - yPx(yA));
              const dB = Math.hypot(p.vx - xPx(xB), p.vy - yPx(yB));
              if (Math.min(dA, dB) > 42) return;
              dragRef.current = dA <= dB ? "a" : "b";
              (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
              movePoint(dragRef.current, toGraphX(p.vx));
            }}
            onPointerMove={(e) => {
              if (!dragRef.current || e.buttons === 0) return;
              const p = svgPoint(e.clientX, e.clientY);
              if (!p) return;
              movePoint(dragRef.current, toGraphX(p.vx));
            }}
            onPointerUp={() => {
              dragRef.current = null;
            }}
          >
            <title id={labelId}>
              Graph of f(x) = x squared with two draggable points and the line through them.
            </title>
            <rect x={PAD.l} y={PAD.t} width={PLOT_W} height={PLOT_H} fill="#FFFDF7" />
            {xTicks.map((t) => (
              <line
                key={`vg-${t}`}
                x1={xPx(t)}
                x2={xPx(t)}
                y1={PAD.t}
                y2={PAD.t + PLOT_H}
                stroke={t === 0 ? "rgba(31,77,58,0.45)" : "rgba(31,77,58,0.12)"}
                strokeWidth={t === 0 ? 1.6 : 1}
              />
            ))}
            {yTicks.map((t) => (
              <line
                key={`hg-${t}`}
                x1={PAD.l}
                x2={PAD.l + PLOT_W}
                y1={yPx(t)}
                y2={yPx(t)}
                stroke={t === 0 ? "rgba(31,77,58,0.45)" : "rgba(31,77,58,0.12)"}
                strokeWidth={t === 0 ? 1.6 : 1}
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
            <line
              x1={xPx(line[0].x)}
              y1={yPx(line[0].y)}
              x2={xPx(line[1].x)}
              y2={yPx(line[1].y)}
              stroke={isTangent ? "#C49A2A" : "#D6B55B"}
              strokeWidth={isTangent ? 4 : 3}
              strokeLinecap="round"
              style={{
                transition: reducedMotion ? undefined : "stroke 180ms ease, stroke-width 180ms ease",
              }}
            />
            <text
              x={xPx(isTangent ? xA + 0.55 : midX)}
              y={yPx(isTangent ? yA + 1.4 : midY) - 14}
              textAnchor="middle"
              fontSize="15"
              fontWeight="700"
              fill="#8A6A1A"
              opacity="0.85"
            >
              {lineLabel}
            </text>

            {showDelta ? (
              <g>
                <polyline
                  points={`${xPx(xA)},${yPx(yA)} ${xPx(corner.x)},${yPx(corner.y)} ${xPx(xB)},${yPx(yB)}`}
                  fill="rgba(214,181,91,0.14)"
                  stroke="none"
                />
                <line
                  x1={xPx(xA)}
                  y1={yPx(yA)}
                  x2={xPx(corner.x)}
                  y2={yPx(corner.y)}
                  stroke="#C49A2A"
                  strokeWidth="2.4"
                />
                <line
                  x1={xPx(corner.x)}
                  y1={yPx(corner.y)}
                  x2={xPx(xB)}
                  y2={yPx(yB)}
                  stroke="#1F4D3A"
                  strokeWidth="2.4"
                />
                <text
                  x={(xPx(xA) + xPx(corner.x)) / 2}
                  y={yPx(yA) + (yA >= 2 ? 22 : -10)}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="700"
                  fill="#8A6A1A"
                >
                  Δx
                </text>
                <text
                  x={xPx(corner.x) + (dx >= 0 ? 18 : -18)}
                  y={(yPx(corner.y) + yPx(yB)) / 2 + 5}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="700"
                  fill="#1F4D3A"
                >
                  Δy
                </text>
              </g>
            ) : null}

            {xTicks.map((t) => (
              <g key={`xt-${t}`}>
                <line
                  x1={xPx(t)}
                  x2={xPx(t)}
                  y1={yPx(0) - 5}
                  y2={yPx(0) + 5}
                  stroke="#14382A"
                  strokeWidth="1.4"
                />
                <text
                  x={xPx(t)}
                  y={yPx(0) + 20}
                  textAnchor="middle"
                  fontSize="14"
                  fill="#1F2933"
                >
                  {t}
                </text>
              </g>
            ))}
            {yTicks.filter((t) => t !== 0 && t % 4 === 0).map((t) => (
              <g key={`yt-${t}`}>
                <line
                  x1={xPx(0) - 5}
                  x2={xPx(0) + 5}
                  y1={yPx(t)}
                  y2={yPx(t)}
                  stroke="#14382A"
                  strokeWidth="1.4"
                />
                <text
                  x={xPx(0) - 10}
                  y={yPx(t) + 5}
                  textAnchor="end"
                  fontSize="14"
                  fill="#1F2933"
                >
                  {t}
                </text>
              </g>
            ))}
            <text
              x={PAD.l + PLOT_W - 4}
              y={yPx(0) - 10}
              fontSize="16"
              fontWeight="700"
              fill="#14382A"
            >
              x
            </text>
            <text x={xPx(0) + 10} y={PAD.t + 14} fontSize="16" fontWeight="700" fill="#14382A">
              y
            </text>

            {(
              [
                ["A", xA, yA],
                ["B", xB, yB],
              ] as const
            ).map(([name, x, y]) => {
              const labelX = xPx(x) + (x < 0.35 ? 16 : 0) + (isTangent && name === "B" ? 18 : 0);
              const labelY = yPx(y) - 20 - (isTangent && name === "A" ? 6 : 0);
              return (
              <g key={name} style={{ cursor: "grab" }}>
                <circle cx={xPx(x)} cy={yPx(y)} r="22" fill="transparent" />
                <circle
                  cx={xPx(x)}
                  cy={yPx(y)}
                  r="11"
                  fill="#D6B55B"
                  stroke="#14382A"
                  strokeWidth="2"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="700"
                  fill="#14382A"
                >
                  {name}
                </text>
              </g>
              );
            })}
          </svg>
          <p className="border-t border-[rgba(31,77,58,0.12)] px-3 py-2 text-center text-xs text-[#1F4D3A]">
            f(x) = x² · drag A and B
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[rgba(31,77,58,0.16)] bg-white px-4 py-4">
            <p className="text-[0.7rem] font-semibold tracking-wide text-[#1F4D3A] uppercase">
              {rateLabel}
            </p>
            <p className="mt-3 font-mono text-sm leading-relaxed text-[#14382A]">
              A = ({fmt(xA)}, {fmt(yA)})
              <br />
              B = ({fmt(xB)}, {fmt(yB)})
            </p>
            <p className="mt-3 font-mono text-sm leading-relaxed text-[#14382A]">
              Δy = {fmt(yB)} − {fmt(yA)} = {fmt(dy)}
              <br />
              Δx = {fmt(xB)} − {fmt(xA)} = {fmt(dx)}
            </p>
            <p className="mt-4 font-serif text-3xl text-[#14382A]" aria-live="polite">
              {fmt(dy)} / {fmt(dx)} ={" "}
              <span className="inline-block rounded-md border-2 border-[#D6B55B] px-2 py-0.5">
                {fmt(rate)}
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-[rgba(31,77,58,0.16)] bg-white px-4 py-4 text-sm text-[#14382A]">
            <p className="font-semibold">Average Rate of Change</p>
            <p className="mt-2 font-mono text-[0.95rem] leading-relaxed">
              (change in y) / (change in x)
              <br />
              (y₂ − y₁) / (x₂ − x₁)
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="min-w-0 flex-1">
          <span className="mb-2 block text-sm font-semibold text-[#14382A]">
            Bring the points together
          </span>
          <input
            type="range"
            min={MIN_SEP}
            max={3}
            step={0.02}
            value={Math.min(3, Math.max(MIN_SEP, sep))}
            onChange={(e) => setSeparation(Number(e.target.value))}
            aria-valuemin={MIN_SEP}
            aria-valuemax={3}
            aria-valuenow={Number(sep.toFixed(2))}
            aria-label="Bring the points together"
            className="h-11 w-full cursor-pointer accent-[#1F4D3A]"
          />
          <span className="mt-1 flex justify-between text-[0.7rem] font-semibold tracking-wide text-[#1F4D3A] uppercase">
            <span>Together</span>
            <span>Apart</span>
          </span>
        </label>
        <button
          type="button"
          className={`${hit} shrink-0 border border-[rgba(31,77,58,0.22)] bg-white px-5 text-[#14382A]`}
          onClick={reset}
        >
          Reset
        </button>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className={`rounded-xl px-3 py-3 ${isTangent ? "bg-[#EAF3ED]/60" : "bg-[#EAF3ED]"}`}>
          <dt className="text-xs font-semibold text-[#14382A]">Secant line</dt>
          <dd className="mt-1 text-xs leading-snug text-[#1F4D3A]">
            A line through two points on a curve.
          </dd>
        </div>
        <div className={`rounded-xl px-3 py-3 ${isTangent ? "bg-[#EAF3ED]/60" : "bg-[#EAF3ED]"}`}>
          <dt className="text-xs font-semibold text-[#14382A]">Average rate of change</dt>
          <dd className="mt-1 text-xs leading-snug text-[#1F4D3A]">
            How much y changes, on average, for each 1-unit change in x.
          </dd>
        </div>
        <div className={`rounded-xl px-3 py-3 ${isTangent ? "bg-[#F7EFDA]" : "bg-[#EAF3ED]/60"}`}>
          <dt className="text-xs font-semibold text-[#14382A]">Tangent line</dt>
          <dd className="mt-1 text-xs leading-snug text-[#1F4D3A]">
            A line showing the direction of a curve at one point.
          </dd>
        </div>
        <div className={`rounded-xl px-3 py-3 ${isTangent ? "bg-[#F7EFDA]" : "bg-[#EAF3ED]/60"}`}>
          <dt className="text-xs font-semibold text-[#14382A]">
            Instantaneous rate of change
          </dt>
          <dd className="mt-1 text-xs leading-snug text-[#1F4D3A]">
            How fast something is changing at one moment.
          </dd>
        </div>
      </dl>
    </div>
  );
}
