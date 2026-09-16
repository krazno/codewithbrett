"use client";

import { useCallback, useId, useRef } from "react";
import {
  FUNCTIONS,
  GRAPH_X_MAX,
  GRAPH_X_MIN,
  GRAPH_Y_MAX,
  GRAPH_Y_MIN,
  type DomainMode,
  type FnId,
  type RestrictedDomain,
  isInputAllowed,
} from "@/app/lib/functionGarden/math";
import { getMarker, type MarkerId } from "./markers";

const VW = 720;
const VH = 520;
const PAD = { l: 54, r: 30, t: 30, b: 46 };
const PLOT_W = VW - PAD.l - PAD.r;
const PLOT_H = VH - PAD.t - PAD.b;

function xPx(x: number) {
  return PAD.l + ((x - GRAPH_X_MIN) / (GRAPH_X_MAX - GRAPH_X_MIN)) * PLOT_W;
}
function yPx(y: number) {
  return PAD.t + ((GRAPH_Y_MAX - y) / (GRAPH_Y_MAX - GRAPH_Y_MIN)) * PLOT_H;
}

function sampleCurve(
  fnId: FnId,
  x0: number,
  x1: number,
  step = 0.08,
): string {
  const fn = FUNCTIONS[fnId].evaluate;
  const parts: string[] = [];
  let started = false;
  for (let x = x0; x <= x1 + 1e-9; x += step) {
    const xx = Math.min(x, x1);
    const y = fn(xx);
    if (y < GRAPH_Y_MIN - 1 || y > GRAPH_Y_MAX + 1) {
      started = false;
      continue;
    }
    const cmd = started ? "L" : "M";
    parts.push(`${cmd} ${xPx(xx).toFixed(2)} ${yPx(y).toFixed(2)}`);
    started = true;
  }
  return parts.join(" ");
}

type Props = {
  fnId: FnId;
  x: number;
  showPoint: boolean;
  domainMode: DomainMode;
  domain: RestrictedDomain;
  markerId: MarkerId;
  reducedMotion: boolean;
  spotlight?: boolean;
  onPickX: (x: number) => void;
};

export function InteractiveGraph({
  fnId,
  x,
  showPoint,
  domainMode,
  domain,
  markerId,
  reducedMotion,
  spotlight,
  onPickX,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const labelId = useId();
  const fn = FUNCTIONS[fnId];
  const y = fn.evaluate(x);
  const restricted = domainMode === "restricted";
  const domainLeft = Math.min(domain.left, domain.right);
  const domainRight = Math.max(domain.left, domain.right);

  const pickFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const vx = ((clientX - rect.left) / rect.width) * VW;
      const vy = ((clientY - rect.top) / rect.height) * VH;
      if (vx < PAD.l || vx > VW - PAD.r || vy < PAD.t || vy > VH - PAD.b) return;
      const gx =
        GRAPH_X_MIN +
        ((vx - PAD.l) / PLOT_W) * (GRAPH_X_MAX - GRAPH_X_MIN);
      onPickX(gx);
    },
    [onPickX],
  );

  const xTicks: number[] = [];
  for (let t = GRAPH_X_MIN; t <= GRAPH_X_MAX; t++) xTicks.push(t);
  const yTicks: number[] = [];
  for (let t = GRAPH_Y_MIN; t <= GRAPH_Y_MAX; t++) yTicks.push(t);

  const fullPath = sampleCurve(fnId, GRAPH_X_MIN, GRAPH_X_MAX);
  const allowedPath = restricted
    ? sampleCurve(fnId, domainLeft, domainRight)
    : fullPath;

  const yAtLeft = fn.evaluate(domainLeft);
  const yAtRight = fn.evaluate(domainRight);
  const inWindow = (yy: number) => yy >= GRAPH_Y_MIN && yy <= GRAPH_Y_MAX;

  const pointInWindow =
    showPoint &&
    x >= GRAPH_X_MIN &&
    x <= GRAPH_X_MAX &&
    y >= GRAPH_Y_MIN &&
    y <= GRAPH_Y_MAX &&
    (domainMode === "full" || isInputAllowed(x, domainMode, domain));

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-[#FFFDF7] ${
        spotlight
          ? "border-[#D6B55B] ring-2 ring-[#D6B55B]"
          : "border-[rgba(31,77,58,0.18)]"
      }`}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        className="h-auto w-full touch-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B]"
        role="img"
        aria-labelledby={labelId}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            onPickX(x - 1);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            onPickX(x + 1);
          }
        }}
        onPointerDown={(e) => {
          (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
          pickFromEvent(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 0) return;
          pickFromEvent(e.clientX, e.clientY);
        }}
      >
        <title id={labelId}>
          {`Graph of ${fn.display}. Viewing window x from ${GRAPH_X_MIN} to ${GRAPH_X_MAX}, y from ${GRAPH_Y_MIN} to ${GRAPH_Y_MAX}.`}
        </title>
        <rect
          x={PAD.l}
          y={PAD.t}
          width={PLOT_W}
          height={PLOT_H}
          fill="#FFFDF7"
        />
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

        {restricted ? (
          <path
            d={fullPath}
            fill="none"
            stroke="rgba(31,77,58,0.22)"
            strokeWidth="3"
            strokeDasharray="5 7"
            strokeLinecap="round"
          />
        ) : null}
        <path
          d={allowedPath}
          fill="none"
          stroke="#1F4D3A"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* axes arrows */}
        <polygon
          points={`${PAD.l + PLOT_W + 10},${yPx(0)} ${PAD.l + PLOT_W - 4},${yPx(0) - 6} ${PAD.l + PLOT_W - 4},${yPx(0) + 6}`}
          fill="#14382A"
        />
        <polygon
          points={`${xPx(0)},${PAD.t - 10} ${xPx(0) - 6},${PAD.t + 4} ${xPx(0) + 6},${PAD.t + 4}`}
          fill="#14382A"
        />
        <text
          x={PAD.l + PLOT_W + 8}
          y={yPx(0) - 12}
          fontSize="16"
          fontWeight="700"
          fill="#14382A"
        >
          x
        </text>
        <text
          x={xPx(0) + 10}
          y={PAD.t - 12}
          fontSize="16"
          fontWeight="700"
          fill="#14382A"
        >
          y
        </text>

        {xTicks.map((t) =>
          t === 0 ? null : (
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
                fontSize="13"
                fill="#1F2933"
              >
                {t}
              </text>
            </g>
          ),
        )}
        {yTicks.map((t) =>
          t === 0 || t % 2 !== 0 ? null : (
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
                y={yPx(t) + 4}
                textAnchor="end"
                fontSize="13"
                fill="#1F2933"
              >
                {t}
              </text>
            </g>
          ),
        )}

        {restricted && inWindow(yAtLeft) ? (
          <circle
            cx={xPx(domainLeft)}
            cy={yPx(yAtLeft)}
            r="7"
            fill={domain.leftClosed ? "#1F4D3A" : "#FFFDF7"}
            stroke="#1F4D3A"
            strokeWidth="2.4"
          />
        ) : null}
        {restricted && inWindow(yAtRight) ? (
          <circle
            cx={xPx(domainRight)}
            cy={yPx(yAtRight)}
            r="7"
            fill={domain.rightClosed ? "#1F4D3A" : "#FFFDF7"}
            stroke="#1F4D3A"
            strokeWidth="2.4"
          />
        ) : null}

        {pointInWindow ? (
          <>
            <line
              x1={xPx(x)}
              x2={xPx(x)}
              y1={yPx(0)}
              y2={yPx(y)}
              stroke="#D6B55B"
              strokeWidth="2"
              strokeDasharray={reducedMotion ? undefined : "5 5"}
            />
            <line
              x1={xPx(x)}
              x2={xPx(0)}
              y1={yPx(y)}
              y2={yPx(y)}
              stroke="#D6B55B"
              strokeWidth="2"
              strokeDasharray={reducedMotion ? undefined : "5 5"}
            />
            <circle
              cx={xPx(x)}
              cy={yPx(0)}
              r="5"
              fill="#D6B55B"
              stroke="#14382A"
              strokeWidth="1.4"
            />
            <rect
              x={xPx(0) - 7}
              y={yPx(y) - 7}
              width="14"
              height="14"
              fill="#D6B55B"
              stroke="#14382A"
              strokeWidth="1.4"
            />
            <g
              transform={`translate(${xPx(x) - 12} ${yPx(y) - 12})`}
              color="#14382A"
            >
              {getMarker(markerId).icon(24)}
            </g>
          </>
        ) : null}
      </svg>
      <p className="border-t border-[rgba(31,77,58,0.12)] px-3 py-1.5 text-center text-[0.7rem] leading-snug text-[#1F4D3A] sm:text-xs">
        Viewing window only — it does not limit the domain.
      </p>
    </div>
  );
}
