"use client";

import { useId, useMemo, useState } from "react";

/** Place values, high bit first. Extend this array later for 5–8 bits. */
const PLACE_VALUES = [8, 4, 2, 1] as const;

type ChallengeType = "build" | "read";
type Challenge = { type: ChallengeType; target: number };

const hit =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

function bitsFromDecimal(value: number): boolean[] {
  let remaining = value;
  return PLACE_VALUES.map((place) => {
    const on = remaining >= place;
    if (on) remaining -= place;
    return on;
  });
}

function decimalFromBits(bits: boolean[]): number {
  return bits.reduce(
    (sum, on, index) => sum + (on ? PLACE_VALUES[index] : 0),
    0,
  );
}

function fourBitString(bits: boolean[]): string {
  return bits.map((on) => (on ? "1" : "0")).join("");
}

function binaryOf(value: number): string {
  return value.toString(2);
}

function randomChallenge(previous?: Challenge): Challenge {
  const type: ChallengeType = Math.random() < 0.5 ? "build" : "read";
  let target = Math.floor(Math.random() * 16);
  if (previous && target === previous.target && type === previous.type) {
    target = (target + 1) % 16;
  }
  return { type, target };
}

function Equiv({ value }: { value: number }) {
  return (
    <span>
      {value}
      <sub>10</sub>
      {" ⇔ "}
      {binaryOf(value)}
      <sub>2</sub>
    </span>
  );
}

export function BinaryFlipLab() {
  const formId = useId();
  const [bits, setBits] = useState(() => PLACE_VALUES.map(() => false));
  const [exampleNote, setExampleNote] = useState(false);
  const [challenge, setChallenge] = useState<Challenge>({
    type: "build",
    target: 11,
  });
  const [round, setRound] = useState(1);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackOk, setFeedbackOk] = useState<boolean | null>(null);

  const total = useMemo(() => decimalFromBits(bits), [bits]);
  const pattern = fourBitString(bits);
  const equation = PLACE_VALUES.map((place, index) =>
    bits[index] ? String(place) : "0",
  ).join(" + ");
  const readLocked = challenge.type === "read";

  function toggleBit(index: number) {
    if (readLocked) return;
    setBits((current) =>
      current.map((on, i) => (i === index ? !on : on)),
    );
    setFeedback(null);
    setFeedbackOk(null);
    setExampleNote(false);
  }

  function showExample() {
    setBits(bitsFromDecimal(5));
    setExampleNote(true);
    setFeedback(null);
    setFeedbackOk(null);
  }

  function resetBits() {
    if (readLocked) {
      setBits(bitsFromDecimal(challenge.target));
    } else {
      setBits(PLACE_VALUES.map(() => false));
    }
    setGuess("");
    setFeedback(null);
    setFeedbackOk(null);
    setExampleNote(false);
  }

  function startChallenge(next: Challenge, nextRound = round) {
    setChallenge(next);
    setRound(nextRound);
    setGuess("");
    setFeedback(null);
    setFeedbackOk(null);
    setExampleNote(false);
    setBits(
      next.type === "read"
        ? bitsFromDecimal(next.target)
        : PLACE_VALUES.map(() => false),
    );
  }

  function checkAnswer() {
    const ok =
      challenge.type === "build"
        ? total === challenge.target
        : Number.parseInt(guess, 10) === challenge.target;
    setFeedbackOk(ok);
    setFeedback(
      ok
        ? `You got it! ${challenge.target}₁₀ ⇔ ${binaryOf(challenge.target)}₂`
        : "Almost! Check which place values are turned on.",
    );
  }

  function newChallenge() {
    const nextRound = round >= 3 ? 1 : round + 1;
    startChallenge(randomChallenge(challenge), nextRound);
  }

  return (
    <section
      className="ua-card ua-shadow-soft p-5"
      aria-labelledby="binary-flip-heading"
    >
      <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
        AP CSP lab
      </p>
      <h2
        id="binary-flip-heading"
        className="mt-1 font-serif text-2xl text-stone-900"
      >
        Binary Flip Lab
      </h2>
      <p className="mt-2 text-sm leading-snug text-stone-700">
        Binary uses two digits: 0 and 1.
      </p>
      <p className="text-sm leading-snug text-stone-700">
        Each position has a value. Flip a bit ON to use its value.
      </p>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {PLACE_VALUES.map((place, index) => {
          const on = bits[index];
          return (
            <div key={place} className="text-center">
              <p className="mb-1 font-mono text-sm font-semibold text-[#14382A]">
                {place}
              </p>
              <button
                type="button"
                disabled={readLocked}
                aria-pressed={on}
                aria-label={`${place}s place, currently ${on ? "on, 1" : "off, 0"}`}
                onClick={() => toggleBit(index)}
                className={`flex min-h-[4.75rem] w-full flex-col items-center justify-center rounded-2xl border-2 font-mono text-3xl font-bold motion-safe:transition-colors motion-safe:duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2 ${
                  on
                    ? "border-[#D6B55B] bg-[var(--ua-evergreen)] text-white"
                    : "border-stone-300 bg-emerald-50 text-stone-400"
                } ${readLocked ? "cursor-default" : ""}`}
              >
                {on ? "1" : "0"}
                <span className="mt-1 text-[0.65rem] font-semibold tracking-wide uppercase">
                  {on ? "On" : "Off"}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <p
        className="mt-3 text-center font-mono text-base font-semibold text-[#14382A] sm:text-lg"
        aria-live="polite"
      >
        {equation} = {total}
      </p>
      <p className="mt-1 text-center text-sm text-stone-800">
        <Equiv value={total} />
      </p>
      <p className="mt-0.5 text-center text-xs text-stone-600">
        4-bit display: {pattern}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={`${hit} bg-[var(--ua-evergreen)] text-white`}
          onClick={showExample}
        >
          Show Me an Example
        </button>
        <button
          type="button"
          className={`${hit} bg-emerald-50 text-[#14382A]`}
          onClick={resetBits}
        >
          Reset Bits
        </button>
      </div>
      {exampleNote ? (
        <p className="mt-2 text-xs text-stone-600">
          The subscript tells us which number system is being used.
        </p>
      ) : null}

      <div className="mt-4 rounded-2xl bg-emerald-50/90 p-4 ring-1 ring-stone-200/80">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
            Practice
          </p>
          <p className="text-xs font-medium text-stone-600">{round} of 3</p>
        </div>
        {challenge.type === "build" ? (
          <p className="mt-2 text-sm font-medium text-stone-800">
            Flip the bits to make {challenge.target}.
          </p>
        ) : (
          <>
            <p className="mt-2 font-mono text-lg font-semibold tracking-[0.2em] text-[#14382A]">
              {fourBitString(bitsFromDecimal(challenge.target))}
            </p>
            <label
              className="mt-2 block text-sm font-medium text-stone-800"
              htmlFor={`${formId}-guess`}
            >
              What decimal number does this represent?
            </label>
            <input
              id={`${formId}-guess`}
              type="number"
              inputMode="numeric"
              min={0}
              max={15}
              value={guess}
              onChange={(e) => {
                setGuess(e.target.value);
                setFeedback(null);
                setFeedbackOk(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") checkAnswer();
              }}
              className="mt-1 min-h-11 w-24 rounded-lg border border-stone-300 bg-white px-3 text-base"
            />
          </>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={`${hit} bg-[var(--ua-evergreen)] text-white`}
            onClick={checkAnswer}
          >
            Check My Answer
          </button>
          <button
            type="button"
            className={`${hit} bg-white text-[#14382A] ring-1 ring-stone-200`}
            onClick={newChallenge}
          >
            New Challenge
          </button>
        </div>
        {feedback ? (
          <p
            className={`mt-2 text-sm font-medium ${
              feedbackOk ? "text-[var(--ua-evergreen)]" : "text-stone-800"
            }`}
            role="status"
          >
            {feedbackOk ? (
              <>
                You got it! <Equiv value={challenge.target} />
              </>
            ) : (
              feedback
            )}
          </p>
        ) : null}
      </div>
    </section>
  );
}
