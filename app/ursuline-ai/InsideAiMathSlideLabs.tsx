"use client";

import { useMemo, useState, type ReactNode } from "react";

type WordPoint = { word: string; x: number; y: number; cluster: string };

const DECK_TOKENS = ["Explain", "photosynthesis", "using", "basketball", "analogy"];

/** Part 2 vector lab: matches deck question (code+algorithm vs code+cupcake). */
const VECTOR_LAB_TOKEN_A = "code";
const VECTOR_LAB_TOKEN_B = "algorithm";

const wordPoints: WordPoint[] = [
  { word: "code", x: -0.55, y: 0.42, cluster: "CS" },
  { word: "function", x: -0.38, y: 0.55, cluster: "CS" },
  { word: "algorithm", x: -0.62, y: 0.28, cluster: "CS" },
  { word: "robot", x: -0.18, y: -0.22, cluster: "Robotics" },
  { word: "sensor", x: -0.05, y: -0.35, cluster: "Robotics" },
  { word: "circuit", x: 0.08, y: -0.18, cluster: "Robotics" },
  { word: "service", x: -0.72, y: 0.75, cluster: "Mission" },
  { word: "fairness", x: -0.55, y: 0.88, cluster: "Mission" },
  { word: "dignity", x: -0.38, y: 0.82, cluster: "Mission" },
  { word: "cupcake", x: 0.78, y: 0.12, cluster: "Other" },
];

const CLUSTER_COLORS: Record<string, { fill: string; stroke: string }> = {
  CS: { fill: "#d1fae5", stroke: "#6ee7b7" },
  Robotics: { fill: "#fef3c7", stroke: "#fcd34d" },
  Mission: { fill: "#ede9fe", stroke: "#c4b5fd" },
  Other: { fill: "#f5f5f4", stroke: "#d6d3d1" },
};

const TRAINING_PATHWAY_STEPS = ["Predict", "Measure loss", "Adjust weights", "Repeat"] as const;

function cosine(a: WordPoint, b: WordPoint) {
  const dot = a.x * b.x + a.y * b.y;
  const mag = Math.sqrt(a.x * a.x + a.y * a.y) * Math.sqrt(b.x * b.x + b.y * b.y);
  return dot / mag;
}

function toSvgX(x: number) {
  return 250 + x * 190;
}

function toSvgY(y: number) {
  return 250 - y * 190;
}

function LabCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 sm:rounded-3xl sm:p-6 md:p-8">
      <h3 className="font-serif text-xl text-stone-900 sm:text-2xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{hint}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function PathwaySection({
  variant,
  children,
}: {
  variant: "generation" | "training";
  children: ReactNode;
}) {
  const isGeneration = variant === "generation";
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-center gap-3">
        <p
          className={`shrink-0 text-xs font-semibold uppercase tracking-widest ${
            isGeneration ? "text-emerald-800" : "text-amber-900"
          }`}
        >
          {isGeneration ? "Generation pathway" : "Training pathway"}
        </p>
        <div className={`h-px flex-1 ${isGeneration ? "bg-emerald-200/70" : "bg-amber-200/70"}`} />
      </div>
      {children}
    </div>
  );
}

export function VectorSimilarityLab() {
  const [firstWord, setFirstWord] = useState(VECTOR_LAB_TOKEN_A);
  const [secondWord, setSecondWord] = useState(VECTOR_LAB_TOKEN_B);

  const first = wordPoints.find((p) => p.word === firstWord) ?? wordPoints[0];
  const second = wordPoints.find((p) => p.word === secondWord) ?? wordPoints[1];
  const cos = cosine(first, second);
  const angle = Math.acos(Math.max(-1, Math.min(1, cos))) * (180 / Math.PI);
  const relationship =
    cos > 0.85 ? "Very close" : cos > 0.45 ? "Related" : cos > 0 ? "Weak" : "Far apart";

  const deckQuestion =
    firstWord === VECTOR_LAB_TOKEN_A && secondWord === "cupcake"
      ? "Code and cupcake sit far apart. The model calculates distance, it does not feel meaning."
      : firstWord === VECTOR_LAB_TOKEN_A && secondWord === VECTOR_LAB_TOKEN_B
        ? "Code and algorithm belong in the same cluster, like the slide deck example."
        : first.cluster === second.cluster
          ? `Both words sit in the ${first.cluster} cluster on this teaching map.`
          : "Different clusters usually mean weaker similarity in this 2D map.";

  return (
    <LabCard
      title="Tokens → vectors"
      hint="Close vectors = related patterns. Similarity is calculated, not felt."
    >
      <div className="mb-6">
        <p className="text-sm font-medium text-stone-800">Sample prompt tokens</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DECK_TOKENS.map((token) => (
            <span
              key={token}
              className="rounded-md border border-emerald-200/80 bg-emerald-50/50 px-2.5 py-1 text-sm text-emerald-900"
            >
              {token}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-stone-500">
          Each token becomes an ID, then an embedding vector. Example: robot = [0.12, -0.44, 0.81]. Real models use
          many more dimensions.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <p className="text-sm text-stone-700">
            Which pair belongs closer together: <span className="font-medium">code and algorithm</span> or{" "}
            <span className="font-medium">code and cupcake</span>?
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label htmlFor="vector-lab-token-a" className="text-sm text-stone-700">
              Token A
              <select
                id="vector-lab-token-a"
                value={firstWord}
                onChange={(e) => setFirstWord(e.target.value)}
                className="mt-2 min-h-[44px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-700"
              >
                {wordPoints.map((p) => (
                  <option key={p.word} value={p.word}>
                    {p.word}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="vector-lab-token-b" className="text-sm text-stone-700">
              Token B
              <select
                id="vector-lab-token-b"
                value={secondWord}
                onChange={(e) => setSecondWord(e.target.value)}
                className="mt-2 min-h-[44px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-700"
              >
                {wordPoints.map((p) => (
                  <option key={p.word} value={p.word}>
                    {p.word}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <svg viewBox="0 0 500 500" className="h-[240px] w-full max-w-full sm:h-[320px]" role="img" aria-label="Embedding map">
            <line x1="40" x2="460" y1="250" y2="250" stroke="#d6d3d1" strokeWidth="2" />
            <line x1="250" x2="250" y1="40" y2="460" stroke="#d6d3d1" strokeWidth="2" />
            <line x1="250" y1="250" x2={toSvgX(first.x)} y2={toSvgY(first.y)} stroke="#065f46" strokeWidth="3" />
            <line x1="250" y1="250" x2={toSvgX(second.x)} y2={toSvgY(second.y)} stroke="#b45309" strokeWidth="3" />
            {wordPoints.map((p) => {
              const on = p.word === first.word || p.word === second.word;
              const colors = CLUSTER_COLORS[p.cluster];
              return (
                <g key={p.word}>
                  <circle
                    cx={toSvgX(p.x)}
                    cy={toSvgY(p.y)}
                    r={on ? 8 : 5}
                    fill={on ? "#065f46" : colors.fill}
                    stroke={on ? "#b45309" : colors.stroke}
                  />
                  <text x={toSvgX(p.x) + 8} y={toSvgY(p.y) + 4} fontSize={on ? 14 : 11} fill="#1c1917">
                    {p.word}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="text-xs text-stone-500">
            Clusters: CS (code, function, algorithm), robotics (robot, sensor, circuit), mission (service, fairness,
            dignity).
          </p>
        </div>
        <div className="space-y-3 rounded-2xl bg-emerald-900 p-5 text-white">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-200/80">Cosine similarity</p>
            <p className="mt-1 text-4xl font-semibold tabular-nums">{cos.toFixed(2)}</p>
            <p className="text-sm text-emerald-100/80">
              {angle.toFixed(0)}° · {relationship}
            </p>
          </div>
          <p className="rounded-xl bg-white/10 p-3 font-mono text-xs">cos = dot / (|a| × |b|)</p>
          <p className="text-sm leading-relaxed text-emerald-100/90">{deckQuestion}</p>
          <p className="text-xs text-emerald-100/70">
            Vectors represent learned relationships mathematically, not human meaning in the full sense.
          </p>
        </div>
      </div>
    </LabCard>
  );
}

export function TinyNeuronTrainer() {
  const [evidence, setEvidence] = useState(0.85);
  const [crossCheck, setCrossCheck] = useState(0.6);
  const [w1, setW1] = useState(0.35);
  const [w2, setW2] = useState(0.25);
  const [bias, setBias] = useState(0.1);
  const [target, setTarget] = useState(1.0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);

  const prediction = w1 * evidence + w2 * crossCheck + bias;
  const error = prediction - target;
  const loss = 0.5 * error * error;

  function trainStep(steps = 1) {
    const lr = 0.18;
    let nw1 = w1;
    let nw2 = w2;
    let nb = bias;
    const hist = [...lossHistory];
    for (let i = 0; i < steps; i += 1) {
      const pred = nw1 * evidence + nw2 * crossCheck + nb;
      const err = pred - target;
      hist.push(0.5 * err * err);
      nw1 -= lr * err * evidence;
      nw2 -= lr * err * crossCheck;
      nb -= lr * err;
    }
    setW1(Number(nw1.toFixed(4)));
    setW2(Number(nw2.toFixed(4)));
    setBias(Number(nb.toFixed(4)));
    setLossHistory(hist.slice(-28));
  }

  const curvePoints = useMemo(() => {
    if (lossHistory.length < 2) return "";
    const max = Math.max(...lossHistory, 0.01);
    return lossHistory
      .map((v, i) => `${20 + (i / Math.max(1, lossHistory.length - 1)) * 260},${130 - (v / max) * 105}`)
      .join(" ");
  }, [lossHistory]);

  const sliders = [
    {
      label: "Evidence strength",
      short: "x1",
      value: evidence,
      set: setEvidence,
      min: 0,
      max: 1,
    },
    {
      label: "Cross-checks",
      short: "x2",
      value: crossCheck,
      set: setCrossCheck,
      min: 0,
      max: 1,
    },
    { label: "Weight w1", short: "w1", value: w1, set: setW1, min: -1, max: 1 },
    { label: "Weight w2", short: "w2", value: w2, set: setW2, min: -1, max: 1 },
    { label: "Bias b", short: "b", value: bias, set: setBias, min: -1, max: 1 },
    { label: "Target y", short: "y", value: target, set: setTarget, min: 0, max: 1 },
  ];

  return (
    <LabCard
      title="Loss and weight updates"
      hint="If you were deciding whether a source is trustworthy, which signals should get more weight? Change the weights and run training steps."
    >
      <div className="mb-5 flex flex-wrap gap-2 text-xs uppercase tracking-widest text-stone-500">
        {TRAINING_PATHWAY_STEPS.map((step, i) => (
          <span key={step} className="flex items-center gap-2">
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-950">{step}</span>
            {i < TRAINING_PATHWAY_STEPS.length - 1 && <span className="text-stone-400">→</span>}
          </span>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="grid gap-3 sm:grid-cols-2">
          {sliders.map((s) => (
            <label key={s.short} className="text-sm text-stone-700">
              <span className="flex justify-between">
                <span>{s.label}</span>
                <span className="font-mono text-emerald-800">{s.value.toFixed(2)}</span>
              </span>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={0.05}
                value={s.value}
                onChange={(e) => s.set(Number(e.target.value))}
                className="mt-2 w-full accent-emerald-800"
              />
            </label>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-emerald-900 p-4 text-white">
            <p className="break-words font-mono text-xs sm:text-sm">
              z = ({w1.toFixed(2)} × {evidence.toFixed(2)}) + ({w2.toFixed(2)} × {crossCheck.toFixed(2)}) +{" "}
              {bias.toFixed(2)}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="text-xs text-emerald-200/70">Predict</p>
                <p className="font-semibold tabular-nums">{prediction.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-200/70">Error</p>
                <p className="font-semibold tabular-nums">{error.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-200/70">Loss</p>
                <p className="font-semibold tabular-nums">{loss.toFixed(2)}</p>
              </div>
            </div>
            <p className="mt-2 text-right text-xs text-emerald-200/70">Loss = ½ × error²</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => trainStep(1)}
              className="inline-flex min-h-[44px] items-center rounded-full bg-emerald-800 px-4 py-2.5 text-sm text-white hover:bg-emerald-700"
            >
              1 step
            </button>
            <button
              type="button"
              onClick={() => trainStep(20)}
              className="inline-flex min-h-[44px] items-center rounded-full bg-amber-600 px-4 py-2.5 text-sm text-white hover:bg-amber-500"
            >
              20 steps
            </button>
            <button
              type="button"
              onClick={() => {
                setW1(0.35);
                setW2(0.25);
                setBias(0.1);
                setLossHistory([]);
              }}
              className="inline-flex min-h-[44px] items-center rounded-full border border-stone-300 px-4 py-2.5 text-sm text-stone-600"
            >
              Reset
            </button>
          </div>
          <svg viewBox="0 0 300 150" className="h-32 w-full" aria-label="Loss curve">
            <line x1="20" x2="280" y1="130" y2="130" stroke="#d6d3d1" strokeWidth="2" />
            {curvePoints ? (
              <polyline points={curvePoints} fill="none" stroke="#065f46" strokeWidth="3" />
            ) : (
              <text x="40" y="78" fill="#78716c" fontSize="12">
                Train to see loss drop.
              </text>
            )}
          </svg>
        </div>
      </div>
    </LabCard>
  );
}

export default function InsideAiMathSlideLabs() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <PathwaySection variant="generation">
        <VectorSimilarityLab />
      </PathwaySection>

      <PathwaySection variant="training">
        <TinyNeuronTrainer />
      </PathwaySection>
    </div>
  );
}
