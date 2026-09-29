"use client";

import { useMemo, useState } from "react";

const HIT =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

const SAMPLES = ["UUUUAAAA", "CSPCSPCS", "WWWWBBWW"] as const;

const COLOR: Record<string, string> = {
  U: "bg-[var(--ua-evergreen)] text-white",
  A: "bg-[#D6B55B] text-[#14382A]",
  C: "bg-[#1B2A4A] text-white",
  S: "bg-emerald-100 text-[#14382A]",
  P: "bg-stone-300 text-[#14382A]",
  W: "bg-white text-[#14382A] ring-1 ring-stone-300",
  B: "bg-[#14382A] text-white",
};

type RlePart = { ch: string; n: number };

function encodeRle(text: string): RlePart[] {
  const parts: RlePart[] = [];
  for (const ch of text) {
    const last = parts[parts.length - 1];
    if (last && last.ch === ch) last.n += 1;
    else parts.push({ ch, n: 1 });
  }
  return parts;
}

function rleString(parts: RlePart[]): string {
  return parts.map((part) => `${part.n}${part.ch}`).join("");
}

const LOSSY_ORIGINAL = ["#14382A", "#1B4A33", "#D6B55B", "#C4A24A", "#14382A", "#D6B55B", "#1B4A33", "#C4A24A"];
const LOSSY_SIMPLE = ["#14382A", "#14382A", "#D6B55B", "#D6B55B", "#14382A", "#D6B55B", "#14382A", "#D6B55B"];

const QUIZ = [
  {
    prompt: "A ZIP file of notes that can be opened back to the original text is…",
    choices: ["Lossless", "Lossy"] as const,
    answer: "Lossless",
  },
  {
    prompt: "A JPEG photo that looks a little blurry after saving smaller is…",
    choices: ["Lossless", "Lossy"] as const,
    answer: "Lossy",
  },
];

export function DataCompressionLab() {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [lossyOn, setLossyOn] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);

  const original = SAMPLES[sampleIndex];
  const parts = useMemo(() => encodeRle(original), [original]);
  const compressed = rleString(parts);
  const originalBits = original.length * 8;
  const compressedBits = compressed.length * 8;
  const ratio = Math.round((compressedBits / originalBits) * 100);
  const helped = compressedBits < originalBits;
  const quiz = QUIZ[quizStep];

  function checkQuiz(choice: string) {
    setPicked(choice);
    const match = choice === quiz.answer;
    setOk(match);
    setFeedback(
      match
        ? quiz.answer === "Lossless"
          ? "Yes. Lossless compression can rebuild the original bits."
          : "Yes. Lossy compression throws some detail away to save space."
        : "Not yet. Think about whether you can get the original file back.",
    );
  }

  function nextQuiz() {
    setQuizStep((current) => (current + 1) % QUIZ.length);
    setPicked(null);
    setFeedback(null);
    setOk(null);
  }

  return (
    <section
      className="ua-card ua-shadow-soft p-5"
      aria-labelledby="data-compression-heading"
    >
      <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
        AP CSP lab
      </p>
      <h2
        id="data-compression-heading"
        className="mt-1 font-serif text-2xl text-stone-900"
      >
        Data Compression
      </h2>
      <p className="mt-2 text-sm leading-snug text-stone-700">
        Compression makes files smaller. Lossless keeps every original bit.
        Lossy throws some detail away.
      </p>

      <h3 className="mt-4 font-serif text-xl text-stone-900">Lossless · RLE</h3>
      <p className="mt-1 text-sm text-stone-700">
        Run-length encoding stores a count, then the symbol. Repeats shrink.
        Mixed letters often do not.
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {original.split("").map((ch, index) => (
          <span
            key={`${ch}-${index}`}
            className={`flex h-11 w-11 items-center justify-center rounded-xl font-mono text-lg font-bold ${
              COLOR[ch] ?? "bg-emerald-50 text-[#14382A]"
            }`}
          >
            {ch}
          </span>
        ))}
      </div>
      <p className="mt-3 text-center font-mono text-sm font-semibold text-[#14382A]">
        {compressed}
      </p>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-stone-200/80">
          <dt className="text-[0.65rem] font-semibold tracking-wide text-emerald-800 uppercase">
            Original
          </dt>
          <dd className="mt-1 font-mono text-lg font-bold text-[#14382A]">
            {originalBits} bits
          </dd>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-stone-200/80">
          <dt className="text-[0.65rem] font-semibold tracking-wide text-emerald-800 uppercase">
            Compressed
          </dt>
          <dd className="mt-1 font-mono text-lg font-bold text-[#14382A]">
            {compressedBits} bits
          </dd>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-stone-200/80">
          <dt className="text-[0.65rem] font-semibold tracking-wide text-emerald-800 uppercase">
            Size
          </dt>
          <dd className="mt-1 font-mono text-lg font-bold text-[#14382A]">
            {ratio}%
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-center text-sm text-stone-700">
        {helped
          ? "This pattern compresses. You can rebuild the original from the counts."
          : "This pattern does not shrink. RLE still stores the original letters."}
      </p>
      <button
        type="button"
        className={`${HIT} mt-3 bg-[var(--ua-evergreen)] text-white`}
        onClick={() => setSampleIndex((current) => (current + 1) % SAMPLES.length)}
      >
        Try another pattern
      </button>

      <h3 className="mt-6 font-serif text-xl text-stone-900">Lossy · fewer colors</h3>
      <p className="mt-1 text-sm text-stone-700">
        Reducing similar colors saves bits, but the original shades are gone.
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {(lossyOn ? LOSSY_SIMPLE : LOSSY_ORIGINAL).map((color, index) => (
          <span
            key={`${color}-${index}`}
            className="h-11 w-11 rounded-xl ring-1 ring-stone-300"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="mt-2 text-center text-sm font-medium text-stone-800">
        {lossyOn
          ? "2 colors · 8 bits. The original 4 shades cannot be restored."
          : "4 colors · 16 bits."}
      </p>
      <button
        type="button"
        className={`${HIT} mt-3 ${
          lossyOn ? "bg-emerald-50 text-[#14382A]" : "bg-[var(--ua-evergreen)] text-white"
        }`}
        onClick={() => setLossyOn((current) => !current)}
      >
        {lossyOn ? "Show original colors" : "Reduce to 2 colors"}
      </button>

      <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-stone-200/80">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
            Practice
          </p>
          <p className="text-xs font-medium text-stone-600">
            {quizStep + 1} of {QUIZ.length}
          </p>
        </div>
        <p className="mt-2 text-sm font-medium text-stone-800">{quiz.prompt}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {quiz.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              aria-pressed={picked === choice}
              className={`${HIT} ${
                picked === choice
                  ? "bg-[var(--ua-evergreen)] text-white"
                  : "bg-emerald-50 text-[#14382A]"
              }`}
              onClick={() => checkQuiz(choice)}
            >
              {choice}
            </button>
          ))}
          <button
            type="button"
            className={`${HIT} bg-white text-[#14382A] ring-1 ring-stone-200`}
            onClick={nextQuiz}
          >
            Next Question
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
