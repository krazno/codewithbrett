"use client";

import { LEFT, NAVY, RIGHT } from "@/app/components/limits/ExploringLimitsGraphs";
import { fmtNum, type GraphSpec } from "@/app/lib/limitProperties/content";

const VW = 640;
const VH = 320;
const PAD = { l: 52, r: 88, t: 36, b: 44 };

function toX(x: number, xMin: number, xMax: number) {
  return PAD.l + ((x - xMin) / (xMax - xMin)) * (VW - PAD.l - PAD.r);
}
function toY(y: number, yMin: number, yMax: number) {
  return PAD.t + ((yMax - y) / (yMax - yMin)) * (VH - PAD.t - PAD.b);
}

function ticks(min: number, max: number) {
  const span = max - min;
  const step = span > 14 ? 4 : span > 8 ? 2 : 1;
  const start = Math.ceil(min / step) * step;
  const out: number[] = [];
  for (let n = start; n <= max - 1e-9; n += step) out.push(Math.abs(n) < 1e-9 ? 0 : n);
  return out;
}

function polyline(
  f: (x: number) => number | null,
  spec: GraphSpec,
) {
  const parts: string[] = [];
  let current: string[] = [];
  const n = 160;
  for (let i = 0; i <= n; i += 1) {
    const x = spec.xMin + (i / n) * (spec.xMax - spec.xMin);
    if (spec.skip?.(x)) {
      if (current.length > 1) parts.push(current.join(" "));
      current = [];
      continue;
    }
    const y = f(x);
    if (y == null || !Number.isFinite(y) || y < spec.yMin - 2 || y > spec.yMax + 2) {
      if (current.length > 1) parts.push(current.join(" "));
      current = [];
      continue;
    }
    current.push(`${toX(x, spec.xMin, spec.xMax)},${toY(y, spec.yMin, spec.yMax)}`);
  }
  if (current.length > 1) parts.push(current.join(" "));
  return parts;
}

export function LimitGraph({
  spec,
  leftX,
  rightX,
  showCoords = true,
  tall = false,
  ariaLabel,
}: {
  spec: GraphSpec;
  leftX?: number;
  rightX?: number;
  showCoords?: boolean;
  tall?: boolean;
  ariaLabel: string;
}) {
  const { xMin, xMax, yMin, yMax, c } = spec;
  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className={
        tall
          ? "h-[min(52dvh,26rem)] w-full"
          : "h-[min(34dvh,18rem)] w-full lg:h-[min(40dvh,22rem)]"
      }
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
          stroke="#e7e5e4"
          strokeWidth="1"
        />
      ) : null}
      {yMin < 0 && yMax > 0 ? (
        <line
          x1={PAD.l}
          x2={VW - PAD.r}
          y1={toY(0, yMin, yMax)}
          y2={toY(0, yMin, yMax)}
          stroke="#e7e5e4"
          strokeWidth="1"
        />
      ) : null}
      <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={VH - PAD.b} stroke={NAVY} strokeWidth="1.6" />
      <line
        x1={PAD.l}
        x2={VW - PAD.r}
        y1={VH - PAD.b}
        y2={VH - PAD.b}
        stroke={NAVY}
        strokeWidth="1.6"
      />
      {ticks(xMin, xMax).map((x) => (
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
      {ticks(yMin, yMax).map((y) => (
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
      {spec.vAsymptote != null ? (
        <line
          x1={toX(spec.vAsymptote, xMin, xMax)}
          x2={toX(spec.vAsymptote, xMin, xMax)}
          y1={PAD.t}
          y2={VH - PAD.b}
          stroke="#b45309"
          strokeWidth="1.6"
          strokeDasharray="6 5"
        />
      ) : null}
      <line
        x1={toX(c, xMin, xMax)}
        x2={toX(c, xMin, xMax)}
        y1={PAD.t}
        y2={VH - PAD.b}
        stroke={NAVY}
        strokeWidth="1.6"
        strokeDasharray="7 6"
      />
      {spec.curves.map((curve) =>
        polyline(curve.fn, spec).map((points) => (
          <polyline
            key={`${curve.label}-${points.slice(0, 18)}`}
            points={points}
            fill="none"
            stroke={curve.color}
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
        )),
      )}
      {spec.marks.map((mark) => {
        const color = mark.color ?? NAVY;
        return (
          <g key={`${mark.x},${mark.y},${mark.label}`}>
            <circle
              cx={toX(mark.x, xMin, xMax)}
              cy={toY(mark.y, yMin, yMax)}
              r="8"
              fill={mark.open ? "#FFFEFB" : color}
              stroke={mark.open ? color : "#fff"}
              strokeWidth="2.4"
            />
            {showCoords ? (
              <text
                x={toX(mark.x, xMin, xMax) + (mark.dx ?? 14)}
                y={toY(mark.y, yMin, yMax) + (mark.dy ?? -12)}
                textAnchor={mark.anchor ?? "start"}
                fontSize="14"
                fontWeight="700"
                fill={color}
              >
                {mark.label}
              </text>
            ) : null}
          </g>
        );
      })}
      {leftX != null
        ? spec.curves.map((curve, i) => {
            const y = curve.fn(leftX);
            if (y == null || !Number.isFinite(y)) return null;
            const dy = spec.curves.length > 1 ? (i === 0 ? -14 : 18) : -12;
            return (
              <g key={`L-${curve.label}`}>
                <circle
                  cx={toX(leftX, xMin, xMax)}
                  cy={toY(y, yMin, yMax)}
                  r="8"
                  fill={LEFT}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {showCoords ? (
                  <text
                    x={toX(leftX, xMin, xMax) - 10}
                    y={toY(y, yMin, yMax) + dy}
                    textAnchor="end"
                    fontSize="13"
                    fontWeight="700"
                    fill={LEFT}
                  >
                    {curve.label} ({fmtNum(leftX)}, {fmtNum(y)})
                  </text>
                ) : null}
              </g>
            );
          })
        : null}
      {rightX != null
        ? spec.curves.map((curve, i) => {
            const y = curve.fn(rightX);
            if (y == null || !Number.isFinite(y)) return null;
            const dy = spec.curves.length > 1 ? (i === 0 ? -14 : 18) : 18;
            return (
              <g key={`R-${curve.label}`}>
                <circle
                  cx={toX(rightX, xMin, xMax)}
                  cy={toY(y, yMin, yMax)}
                  r="8"
                  fill={RIGHT}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {showCoords ? (
                  <text
                    x={toX(rightX, xMin, xMax) + 12}
                    y={toY(y, yMin, yMax) + dy}
                    fontSize="13"
                    fontWeight="700"
                    fill={RIGHT}
                  >
                    {curve.label} ({fmtNum(rightX)}, {fmtNum(y)})
                  </text>
                ) : null}
              </g>
            );
          })
        : null}
    </svg>
  );
}

export function ApproachSliders({
  spec,
  leftX,
  rightX,
  onLeft,
  onRight,
}: {
  spec: GraphSpec;
  leftX: number;
  rightX: number;
  onLeft: (x: number) => void;
  onRight: (x: number) => void;
}) {
  const gap = Math.max(0.02, (spec.xMax - spec.xMin) * 0.01);
  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      <label className="text-sm font-semibold" style={{ color: LEFT }}>
        Approach from the left
        <input
          type="range"
          className="mt-1 h-12 w-full"
          min={spec.xMin}
          max={spec.c - gap}
          step={0.01}
          value={leftX}
          onChange={(event) => onLeft(Number(event.target.value))}
        />
      </label>
      <label className="text-sm font-semibold" style={{ color: RIGHT }}>
        Approach from the right
        <input
          type="range"
          className="mt-1 h-12 w-full"
          min={spec.c + gap}
          max={spec.xMax}
          step={0.01}
          value={rightX}
          onChange={(event) => onRight(Number(event.target.value))}
        />
      </label>
    </div>
  );
}

export function ValueTable({
  rows,
}: {
  rows: { x: number; y: number | null }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[18rem] text-center text-sm">
        <thead>
          <tr className="text-stone-500">
            <th className="px-2 py-2 font-semibold">x</th>
            <th className="px-2 py-2 font-semibold">y</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.x} className="border-t border-stone-200">
              <td className="px-2 py-2 font-semibold">{fmtNum(row.x)}</td>
              <td className="px-2 py-2">{fmtNum(row.y)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
