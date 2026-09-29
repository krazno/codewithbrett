"use client";

import { useMemo, useState } from "react";

const HIT =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

type Kind = "text" | "bw" | "color";

const KINDS: { id: Kind; label: string; bitsEach: number; unit: string }[] = [
  { id: "text", label: "Text", bitsEach: 8, unit: "characters" },
  { id: "bw", label: "B&W image", bitsEach: 1, unit: "pixels" },
  { id: "color", label: "Color image", bitsEach: 24, unit: "pixels" },
];

const PRACTICE = [
  {
    prompt: "How many bits does the word CAT take if each character is 8 bits?",
    answer: 24,
    hint: "3 characters × 8 bits.",
  },
  {
    prompt: "An 8 × 8 black-and-white image uses 1 bit per pixel. How many bytes is that?",
    answer: 8,
    hint: "64 bits. 8 bits = 1 byte.",
  },
  {
    prompt: "How many bytes are in 2 KB? (1 KB = 1024 bytes)",
    answer: 2048,
    hint: "2 × 1024.",
  },
];

function formatKb(bytes: number): string {
  if (bytes === 0) return "0";
  const kb = bytes / 1024;
  if (Number.isInteger(kb)) return String(kb);
  if (kb < 0.01) return kb.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  return kb.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function MetricsForMemoryLab() {
  const [kind, setKind] = useState<Kind>("text");
  const [count, setCount] = useState(5);
  const [width, setWidth] = useState(8);
  const [height, setHeight] = useState(8);
  const [step, setStep] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);

  const spec = KINDS.find((item) => item.id === kind) ?? KINDS[0];
  const items = kind === "text" ? count : width * height;
  const bits = items * spec.bitsEach;
  const bytes = bits / 8;
  const kb = formatKb(bytes);
  const problem = PRACTICE[step];

  const formula = useMemo(() => {
    if (kind === "text") return `${count} characters × 8 bits`;
    if (kind === "bw") return `${width} × ${height} pixels × 1 bit`;
    return `${width} × ${height} pixels × 24 bits`;
  }, [kind, count, width, height]);

  function check() {
    const value = Number.parseFloat(guess);
    const match = Number.isFinite(value) && value === problem.answer;
    setOk(match);
    setFeedback(match ? "That matches." : `Not yet. ${problem.hint}`);
  }

  function next() {
    setStep((current) => (current + 1) % PRACTICE.length);
    setGuess("");
    setFeedback(null);
    setOk(null);
  }

  return (
    <section
      className="ua-card ua-shadow-soft p-5"
      aria-labelledby="memory-metrics-heading"
    >
      <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
        AP CSP lab
      </p>
      <h2
        id="memory-metrics-heading"
        className="mt-1 font-serif text-2xl text-stone-900"
      >
        Metrics for Memory
      </h2>
      <p className="mt-2 text-sm leading-snug text-stone-700">
        Computers store everything as bits. 8 bits = 1 byte. 1024 bytes = 1 KB.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {KINDS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={kind === item.id}
            className={`${HIT} ${
              kind === item.id
                ? "bg-[var(--ua-evergreen)] text-white"
                : "bg-emerald-50 text-[#14382A]"
            }`}
            onClick={() => setKind(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-stone-700">
        {spec.label}: {spec.bitsEach} bit{spec.bitsEach === 1 ? "" : "s"} per{" "}
        {kind === "text" ? "character" : "pixel"}.
      </p>

      {kind === "text" ? (
        <label className="mt-3 block text-sm font-semibold text-stone-800">
          Characters
          <input
            className="mt-1 min-h-11 w-28 rounded-lg border border-stone-300 bg-white px-3 text-base"
            type="number"
            inputMode="numeric"
            min={0}
            max={500}
            value={count}
            onChange={(e) => setCount(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-stone-800">
            Width
            <input
              className="mt-1 min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-base"
              type="number"
              inputMode="numeric"
              min={1}
              max={64}
              value={width}
              onChange={(e) =>
                setWidth(Math.max(1, Number(e.target.value) || 1))
              }
            />
          </label>
          <label className="text-sm font-semibold text-stone-800">
            Height
            <input
              className="mt-1 min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-base"
              type="number"
              inputMode="numeric"
              min={1}
              max={64}
              value={height}
              onChange={(e) =>
                setHeight(Math.max(1, Number(e.target.value) || 1))
              }
            />
          </label>
        </div>
      )}

      <div className="mt-4 rounded-2xl bg-emerald-50/90 p-4 ring-1 ring-stone-200/80">
        <p className="font-mono text-sm font-semibold text-[#14382A]">
          {formula} = {bits} bits
        </p>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-white p-3 ring-1 ring-stone-200/80">
            <dt className="text-[0.65rem] font-semibold tracking-wide text-emerald-800 uppercase">
              Bits
            </dt>
            <dd className="mt-1 font-mono text-base font-bold break-all text-[#14382A] sm:text-lg">
              {bits}
            </dd>
          </div>
          <div className="rounded-xl bg-white p-3 ring-1 ring-stone-200/80">
            <dt className="text-[0.65rem] font-semibold tracking-wide text-emerald-800 uppercase">
              Bytes
            </dt>
            <dd className="mt-1 font-mono text-base font-bold break-all text-[#14382A] sm:text-lg">
              {Number.isInteger(bytes) ? bytes : bytes.toFixed(2)}
            </dd>
          </div>
          <div className="rounded-xl bg-white p-3 ring-1 ring-stone-200/80">
            <dt className="text-[0.65rem] font-semibold tracking-wide text-emerald-800 uppercase">
              KB
            </dt>
            <dd className="mt-1 font-mono text-base font-bold break-all text-[#14382A] sm:text-lg">
              {kb}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-stone-200/80">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
            Practice
          </p>
          <p className="text-xs font-medium text-stone-600">
            {step + 1} of {PRACTICE.length}
          </p>
        </div>
        <p className="mt-2 text-sm font-medium text-stone-800">{problem.prompt}</p>
        <label className="mt-3 block text-sm font-semibold">
          Answer
          <input
            className="mt-1 min-h-11 w-28 rounded-lg border border-stone-300 bg-white px-3 text-base"
            type="number"
            inputMode="numeric"
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              setFeedback(null);
              setOk(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") check();
            }}
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={`${HIT} bg-[var(--ua-evergreen)] text-white`}
            onClick={check}
          >
            Check My Answer
          </button>
          <button
            type="button"
            className={`${HIT} bg-emerald-50 text-[#14382A]`}
            onClick={next}
          >
            Next Problem
          </button>
        </div>
        {feedback ? (
          <p
            className={`mt-2 text-sm font-medium ${
              ok ? "text-[var(--ua-evergreen)]" : "text-stone-800"
            }`}
            role="status"
          >
            {feedback}
          </p>
        ) : null}
      </div>
    </section>
  );
}
