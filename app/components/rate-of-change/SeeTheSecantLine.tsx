"use client";

import { useId } from "react";

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
const CORNER = { t: 4, d: 3 };

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

export function SeeTheSecantLine() {
  const graphId = useId();

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
        d(t) = t<sup>2</sup> + 2t · average rate from t = 1 to t = 4
      </p>

      <div className="mt-4 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(14rem,18rem)]">
        <div className="overflow-hidden rounded-2xl border border-[rgba(31,77,58,0.16)] bg-[#FFFDF7]">
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="h-auto w-full"
            role="img"
            aria-labelledby={graphId}
          >
            <title id={graphId}>
              Graph of d of t equals t squared plus 2t with secant through A and
              B. Rise is 21 and run is 3.
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
              x2={tPx(CORNER.t)}
              y2={dPx(CORNER.d)}
              stroke="#C45C78"
              strokeWidth="1.8"
              strokeDasharray="4 4"
            />
            <line
              x1={tPx(CORNER.t)}
              y1={dPx(CORNER.d)}
              x2={tPx(B.t)}
              y2={dPx(B.d)}
              stroke="#C45C78"
              strokeWidth="1.8"
              strokeDasharray="4 4"
            />
            <line
              x1={tPx(A.t)}
              y1={dPx(A.d)}
              x2={tPx(B.t)}
              y2={dPx(B.d)}
              stroke="#D6B55B"
              strokeWidth="2.4"
            />
            <text
              x={(tPx(A.t) + tPx(CORNER.t)) / 2}
              y={dPx(CORNER.d) + 16}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#C45C78"
            >
              run 3
            </text>
            <text
              x={tPx(CORNER.t) + 10}
              y={(dPx(CORNER.d) + dPx(B.d)) / 2}
              fontSize="12"
              fontWeight="700"
              fill="#C45C78"
            >
              rise 21
            </text>
            <text
              x={(tPx(A.t) + tPx(B.t)) / 2 - 18}
              y={(dPx(A.d) + dPx(B.d)) / 2 - 8}
              fontSize="13"
              fontWeight="700"
              fill="#8A6A1B"
            >
              7 mi/h
            </text>
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
        </div>

        <div className="flex flex-col justify-center gap-3 rounded-2xl bg-emerald-50/80 p-4 text-sm text-stone-800">
          <p>
            d(1) = 3
            <span className="mx-2 text-stone-400">·</span>
            d(4) = 24
          </p>
          <p>
            rise = 24 − 3 = <span className="font-semibold">21</span>
          </p>
          <p>
            run = 4 − 1 = <span className="font-semibold">3</span>
          </p>
          <p className="font-serif text-2xl text-[var(--ua-evergreen)]">
            21 ÷ 3 = 7 mi/h
          </p>
          <p className="text-sm font-semibold text-[#14382A]">
            Secant slope = average rate of change
          </p>
        </div>
      </div>
    </section>
  );
}
