"use client";

import { useEffect, useLayoutEffect, useState } from "react";

export const NAVY = "#1B2A4A";
export const LEFT = "#2563EB";
export const RIGHT = "#15803D";
export const GOLD = "#D6B55B";

const VW = 640;
const VH = 300;
const PAD = { l: 52, r: 22, t: 22, b: 42 };

export function useApproachPlayer(active: boolean, seconds = 4.8) {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);

  useLayoutEffect(() => {
    if (!active) {
      setPlaying(false);
      setT(0);
      return;
    }
    setT(0);
    setPlaying(true);
  }, [active]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = 0;
    let stopped = false;
    const tick = (now: number) => {
      if (stopped) return;
      if (!last) last = now;
      const dt = (now - last) / 1000;
      last = now;
      setT((value) => {
        const next = value + dt / seconds;
        return next >= 1 ? 1 : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [playing, seconds]);

  useEffect(() => {
    if (t >= 1 && playing) setPlaying(false);
  }, [t, playing]);

  return {
    t,
    playing,
    play() {
      setT((value) => (value >= 1 ? 0 : value));
      setPlaying(true);
    },
    pause() {
      setPlaying(false);
    },
    reset() {
      setPlaying(false);
      setT(0);
    },
  };
}

function toX(x: number, xMin: number, xMax: number) {
  return PAD.l + ((x - xMin) / (xMax - xMin)) * (VW - PAD.l - PAD.r);
}

function toY(y: number, yMin: number, yMax: number) {
  return PAD.t + ((yMax - y) / (yMax - yMin)) * (VH - PAD.t - PAD.b);
}

function ticks(min: number, max: number) {
  const span = max - min;
  const step = span > 12 ? 4 : span > 8 ? 2 : 1;
  const start = Math.ceil(min / step) * step;
  const out: number[] = [];
  for (let n = start; n <= max - 0.01; n += step) {
    if (Math.abs(n) < 1e-9) out.push(0);
    else out.push(n);
  }
  return out;
}

function polyline(
  f: (x: number) => number | null,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  skip?: (x: number) => boolean,
) {
  const parts: string[] = [];
  let current: string[] = [];
  const n = 120;
  for (let i = 0; i <= n; i += 1) {
    const x = xMin + (i / n) * (xMax - xMin);
    if (skip?.(x)) {
      if (current.length > 1) parts.push(current.join(" "));
      current = [];
      continue;
    }
    const y = f(x);
    if (y == null || !Number.isFinite(y) || y < yMin - 2 || y > yMax + 2) {
      if (current.length > 1) parts.push(current.join(" "));
      current = [];
      continue;
    }
    current.push(`${toX(x, xMin, xMax)},${toY(y, yMin, yMax)}`);
  }
  if (current.length > 1) parts.push(current.join(" "));
  return parts;
}

export function PlayBar({
  playing,
  onPlay,
  onPause,
  onReset,
}: {
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}) {
  const hit =
    "inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-2">
      <button
        type="button"
        className={hit}
        style={{ background: NAVY, color: "#fff" }}
        onClick={playing ? onPause : onPlay}
      >
        {playing ? "Pause" : "Play"}
      </button>
      <button
        type="button"
        className={hit}
        style={{ background: "#F4F0E6", color: NAVY }}
        onClick={onReset}
      >
        Reset motion
      </button>
    </div>
  );
}

export function CurveGraph({
  f,
  xMin,
  xMax,
  yMin,
  yMax,
  targetX,
  hole,
  filled,
  vAsymptote,
  t,
  mode = "both",
  ariaLabel,
}: {
  f: (x: number) => number | null;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  targetX: number;
  hole?: { x: number; y: number };
  filled?: { x: number; y: number };
  vAsymptote?: number;
  t: number;
  mode?: "both" | "left" | "right" | "none";
  ariaLabel: string;
}) {
  const xTicks = ticks(xMin, xMax);
  const yTicks = ticks(yMin, yMax);
  const gap = 0.08;
  const reach = Math.min(1.7, (xMax - xMin) * 0.28);
  const xL = targetX - reach * (1 - t) - gap * t;
  const xR = targetX + reach * (1 - t) + gap * t;
  const yL = f(xL);
  const yR = f(xR);
  const skip = (x: number) => {
    if (hole && Math.abs(x - hole.x) < 0.06) return true;
    if (vAsymptote != null && Math.abs(x - vAsymptote) < 0.12) return true;
    return false;
  };
  const parts = polyline(f, xMin, xMax, yMin, yMax, skip);

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="h-[min(32dvh,16rem)] w-full lg:h-[min(38dvh,20rem)]"
      role="img"
      aria-label={ariaLabel}
    >
      <rect
        x={PAD.l}
        y={PAD.t}
        width={VW - PAD.l - PAD.r}
        height={VH - PAD.t - PAD.b}
        fill="#FFFDF8"
      />
      {xMin < 0 && xMax > 0 ? (
        <line
          x1={toX(0, xMin, xMax)}
          x2={toX(0, xMin, xMax)}
          y1={PAD.t}
          y2={VH - PAD.b}
          stroke="#d6d3d1"
          strokeWidth="1"
        />
      ) : null}
      {yMin < 0 && yMax > 0 ? (
        <line
          x1={PAD.l}
          x2={VW - PAD.r}
          y1={toY(0, yMin, yMax)}
          y2={toY(0, yMin, yMax)}
          stroke="#d6d3d1"
          strokeWidth="1"
        />
      ) : null}
      <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={VH - PAD.b} stroke={NAVY} strokeWidth="1.6" />
      <line x1={PAD.l} x2={VW - PAD.r} y1={VH - PAD.b} y2={VH - PAD.b} stroke={NAVY} strokeWidth="1.6" />
      {xTicks.map((x) => (
        <text
          key={`x${x}`}
          x={toX(x, xMin, xMax)}
          y={VH - 14}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={NAVY}
        >
          {x}
        </text>
      ))}
      {yTicks.map((y) => (
        <text
          key={`y${y}`}
          x={PAD.l - 8}
          y={toY(y, yMin, yMax) + 4}
          textAnchor="end"
          fontSize="13"
          fontWeight="700"
          fill={NAVY}
        >
          {y}
        </text>
      ))}
      <text x={VW - 8} y={VH - PAD.b - 6} textAnchor="end" fontSize="13" fontWeight="700" fill={NAVY}>
        x
      </text>
      <text x={PAD.l + 10} y={PAD.t + 14} fontSize="13" fontWeight="700" fill={NAVY}>
        y
      </text>
      {vAsymptote != null ? (
        <line
          x1={toX(vAsymptote, xMin, xMax)}
          x2={toX(vAsymptote, xMin, xMax)}
          y1={PAD.t}
          y2={VH - PAD.b}
          stroke="#b45309"
          strokeWidth="1.6"
          strokeDasharray="6 5"
        />
      ) : null}
      {parts.map((points) => (
        <polyline
          key={points.slice(0, 24)}
          points={points}
          fill="none"
          stroke={NAVY}
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
      ))}
      {hole ? (
        <circle
          cx={toX(hole.x, xMin, xMax)}
          cy={toY(hole.y, yMin, yMax)}
          r="9"
          fill="#FFFEFB"
          stroke={NAVY}
          strokeWidth="2.8"
        />
      ) : null}
      {filled ? (
        <circle
          cx={toX(filled.x, xMin, xMax)}
          cy={toY(filled.y, yMin, yMax)}
          r="8"
          fill={NAVY}
          stroke="#fff"
          strokeWidth="2"
        />
      ) : null}
      {mode !== "none" && mode !== "right" && yL != null && Number.isFinite(yL) ? (
        <circle
          cx={toX(xL, xMin, xMax)}
          cy={toY(yL, yMin, yMax)}
          r="8"
          fill={LEFT}
          stroke="#fff"
          strokeWidth="2"
        />
      ) : null}
      {mode !== "none" && mode !== "left" && yR != null && Number.isFinite(yR) ? (
        <circle
          cx={toX(xR, xMin, xMax)}
          cy={toY(yR, yMin, yMax)}
          r="8"
          fill={RIGHT}
          stroke="#fff"
          strokeWidth="2"
        />
      ) : null}
    </svg>
  );
}

export function JumpGraph({
  leftY,
  rightY,
  atY,
  targetX = 2,
  t,
  mode = "both",
  holeY,
  ariaLabel,
}: {
  leftY: number;
  rightY: number;
  atY?: number;
  targetX?: number;
  t: number;
  mode?: "both" | "left" | "right" | "none";
  holeY?: number;
  ariaLabel: string;
}) {
  const xMin = targetX - 3;
  const xMax = targetX + 3;
  const yMin = Math.min(0, leftY, rightY, atY ?? 0, holeY ?? 0) - 1;
  const yMax = Math.max(leftY, rightY, atY ?? 0, holeY ?? 0) + 2;
  const xL = targetX - 2.2 * (1 - t) - 0.12;
  const xR = targetX + 2.2 * (1 - t) + 0.12;
  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="h-[min(32dvh,16rem)] w-full lg:h-[min(38dvh,20rem)]"
      role="img"
      aria-label={ariaLabel}
    >
      <rect
        x={PAD.l}
        y={PAD.t}
        width={VW - PAD.l - PAD.r}
        height={VH - PAD.t - PAD.b}
        fill="#FFFDF8"
      />
      <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={VH - PAD.b} stroke={NAVY} strokeWidth="1.6" />
      <line x1={PAD.l} x2={VW - PAD.r} y1={VH - PAD.b} y2={VH - PAD.b} stroke={NAVY} strokeWidth="1.6" />
      {ticks(xMin, xMax).map((x) => (
        <text
          key={x}
          x={toX(x, xMin, xMax)}
          y={VH - 14}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={NAVY}
        >
          {x}
        </text>
      ))}
      {ticks(yMin, yMax).map((y) => (
        <text
          key={y}
          x={PAD.l - 8}
          y={toY(y, yMin, yMax) + 4}
          textAnchor="end"
          fontSize="13"
          fontWeight="700"
          fill={NAVY}
        >
          {y}
        </text>
      ))}
      <line
        x1={toX(xMin, xMin, xMax)}
        y1={toY(leftY, yMin, yMax)}
        x2={toX(targetX - 0.04, xMin, xMax)}
        y2={toY(leftY, yMin, yMax)}
        stroke={NAVY}
        strokeWidth="2.6"
      />
      <line
        x1={toX(targetX + 0.04, xMin, xMax)}
        y1={toY(rightY, yMin, yMax)}
        x2={toX(xMax, xMin, xMax)}
        y2={toY(rightY, yMin, yMax)}
        stroke={NAVY}
        strokeWidth="2.6"
      />
      {leftY === rightY ? (
        <circle
          cx={toX(targetX, xMin, xMax)}
          cy={toY(holeY ?? leftY, yMin, yMax)}
          r="9"
          fill="#FFFEFB"
          stroke={NAVY}
          strokeWidth="2.8"
        />
      ) : (
        <>
          <circle
            cx={toX(targetX, xMin, xMax)}
            cy={toY(leftY, yMin, yMax)}
            r="9"
            fill="#FFFEFB"
            stroke={NAVY}
            strokeWidth="2.8"
          />
          <circle
            cx={toX(targetX, xMin, xMax)}
            cy={toY(rightY, yMin, yMax)}
            r="9"
            fill="#FFFEFB"
            stroke={NAVY}
            strokeWidth="2.8"
          />
        </>
      )}
      {atY != null ? (
        <circle
          cx={toX(targetX, xMin, xMax)}
          cy={toY(atY, yMin, yMax)}
          r="8"
          fill={NAVY}
          stroke="#fff"
          strokeWidth="2"
        />
      ) : null}
      {mode !== "none" && mode !== "right" ? (
        <circle
          cx={toX(xL, xMin, xMax)}
          cy={toY(leftY, yMin, yMax)}
          r="8"
          fill={LEFT}
          stroke="#fff"
          strokeWidth="2"
        />
      ) : null}
      {mode !== "none" && mode !== "left" ? (
        <circle
          cx={toX(xR, xMin, xMax)}
          cy={toY(rightY, yMin, yMax)}
          r="8"
          fill={RIGHT}
          stroke="#fff"
          strokeWidth="2"
        />
      ) : null}
    </svg>
  );
}

export function ApproachNumberLine({ t }: { t: number }) {
  const xMin = 0;
  const xMax = 4;
  const a = 2;
  const y = 88;
  const xL = a - 1.6 * (1 - t) - 0.1;
  const xR = a + 1.6 * (1 - t) + 0.1;
  return (
    <svg viewBox="0 0 640 140" className="h-28 w-full" role="img" aria-label="Points approaching 2 from the left and from the right on a number line.">
      <line x1={toX(xMin, xMin, xMax)} x2={toX(xMax, xMin, xMax)} y1={y} y2={y} stroke={NAVY} strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((n) => (
        <g key={n}>
          <line
            x1={toX(n, xMin, xMax)}
            x2={toX(n, xMin, xMax)}
            y1={y - 8}
            y2={y + 8}
            stroke={NAVY}
            strokeWidth="1.6"
          />
          <text
            x={toX(n, xMin, xMax)}
            y={y + 28}
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            fill={NAVY}
          >
            {n === 2 ? "a" : n}
          </text>
        </g>
      ))}
      <circle cx={toX(xL, xMin, xMax)} cy={y} r="8" fill={LEFT} stroke="#fff" strokeWidth="2" />
      <circle cx={toX(xR, xMin, xMax)} cy={y} r="8" fill={RIGHT} stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
