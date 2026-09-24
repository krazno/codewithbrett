"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Tex } from "./Tex";
import {
  ApproachNumberLine,
  CurveGraph,
  GOLD,
  JumpGraph,
  LEFT,
  NAVY,
  PlayBar,
  RIGHT,
  useApproachPlayer,
} from "./ExploringLimitsGraphs";

const HIT =
  "inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

type StageId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const STAGES: { id: StageId; tab: string; title: string; steps: number }[] = [
  { id: 0, tab: "1. Open", title: "Opening", steps: 3 },
  { id: 1, tab: "2. QOD 1", title: "QOD 1", steps: 6 },
  { id: 2, tab: "3. QOD 2", title: "QOD 2", steps: 13 },
  { id: 3, tab: "4. QOD 3", title: "QOD 3", steps: 6 },
  { id: 4, tab: "5. Idea", title: "Big Idea", steps: 4 },
  { id: 5, tab: "6. Sides", title: "Two Directions", steps: 5 },
  { id: 6, tab: "7. Agree", title: "Limit Exists", steps: 4 },
  { id: 7, tab: "8. DNE", title: "When DNE", steps: 2 },
  { id: 8, tab: "9. A", title: "Practice A", steps: 2 },
  { id: 9, tab: "10. B", title: "Practice B", steps: 3 },
  { id: 10, tab: "11. C", title: "Practice C", steps: 6 },
  { id: 11, tab: "12. Check", title: "Quick Check", steps: 6 },
  { id: 12, tab: "13. Close", title: "Closing", steps: 3 },
];

function CrossMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 opacity-70"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M7.1 1.2h1.8v5h5v1.8h-5v6.8H7.1V8H1.2V6.2h5.9z" />
    </svg>
  );
}

function Fade({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return <div className="el-fade">{children}</div>;
}

function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mt-4 rounded-2xl px-4 py-3 text-lg leading-snug sm:text-xl"
      style={{ background: "#EAF3ED", color: NAVY }}
    >
      {children}
    </p>
  );
}

export function ExploringLimits() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rootRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState<StageId>(0);
  const [step, setStep] = useState(0);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [guess, setGuess] = useState<string | null>(null);
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);

  const max = STAGES[stage].steps;

  const go = useCallback((id: StageId) => {
    setStage(id);
    setStep(0);
  }, []);

  function resetLesson() {
    setStage(0);
    setStep(0);
    setGuess(null);
    setQ1(null);
    setQ2(null);
    setQ3(null);
  }

  function next() {
    if (step < max - 1) {
      setStep(step + 1);
      return;
    }
    if (stage < 12) {
      setStage((stage + 1) as StageId);
      setStep(0);
    }
  }

  function back() {
    if (step > 0) {
      setStep(step - 1);
      return;
    }
    if (stage > 0) {
      const prev = (stage - 1) as StageId;
      setStage(prev);
      setStep(STAGES[prev].steps - 1);
    }
  }

  async function toggleFullscreen() {
    const node = rootRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await node.requestFullscreen();
  }

  const revealNext = step < max - 1 && isReveal(stage, step + 1);
  const trySub = (stage === 1 || stage === 2 || stage === 3) && step === 0;
  const nextLabel =
    stage === 12 && step >= max - 1
      ? "Done"
      : trySub
        ? "Try Direct Substitution"
        : revealNext
          ? "Reveal"
          : "Next";

  return (
    <section
      ref={rootRef}
      className="ua-card ua-shadow-soft relative w-full min-w-0 overflow-x-hidden p-4 sm:p-6 md:col-span-2"
      style={{ background: "#FFFEFB" }}
      aria-labelledby={`${uid}-heading`}
    >
      <div className="absolute top-3 right-3 z-10">
        <details
          className="text-right"
          open={teacherOpen}
          onToggle={(event) => setTeacherOpen(event.currentTarget.open)}
        >
          <summary className="cursor-pointer list-none text-[0.7rem] tracking-wide text-stone-500 uppercase">
            Teacher
          </summary>
          <div
            className="mt-2 w-56 rounded-xl border border-stone-200 bg-white p-3 text-left text-sm shadow-sm"
            style={{ color: NAVY }}
          >
            <label className="mt-1 block text-xs font-semibold">Jump</label>
            <select
              className="mt-1 min-h-11 w-full rounded-lg border border-stone-300 px-2"
              value={stage}
              onChange={(event) => go(Number(event.target.value) as StageId)}
            >
              {STAGES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={`${HIT} mt-2 w-full bg-[#F4F0E6] text-sm`}
              style={{ color: NAVY }}
              onClick={() => void toggleFullscreen()}
            >
              Full screen
            </button>
            <button
              type="button"
              className={`${HIT} mt-1 w-full bg-[#F4F0E6] text-sm`}
              style={{ color: NAVY }}
              onClick={resetLesson}
            >
              Reset lesson
            </button>
          </div>
        </details>
      </div>

      <p className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.14em] text-emerald-800 uppercase">
        <CrossMark />
        Calculus Honors · Exploring Limits
      </p>
      {stage === 0 ? (
        <h2 id={`${uid}-heading`} className="sr-only">
          Exploring Limits
        </h2>
      ) : (
        <h2
          id={`${uid}-heading`}
          className="mt-1 max-w-3xl pr-16 font-serif text-2xl sm:text-3xl"
          style={{ color: NAVY }}
        >
          {STAGES[stage].title}
        </h2>
      )}
      <p className="mt-0.5 text-sm tracking-wide text-stone-500">
        Approach · Reflect · Grow
      </p>

      <div
        role="tablist"
        aria-label="Lesson stages"
        className="mt-4 flex w-full min-w-0 flex-wrap gap-1"
      >
        {STAGES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={stage === item.id}
            className={`${HIT} px-2 text-[0.7rem] sm:text-xs`}
            style={{
              background: stage === item.id ? NAVY : "#F4F0E6",
              color: stage === item.id ? "#fff" : NAVY,
            }}
            onClick={() => go(item.id)}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div className="mt-5 min-h-[12rem]">
        {stage === 0 ? <Opening step={step} /> : null}
        {stage === 1 ? <Problem1 step={step} /> : null}
        {stage === 2 ? <Problem2 step={step} /> : null}
        {stage === 3 ? <Problem3 step={step} /> : null}
        {stage === 4 ? <BigIdea step={step} /> : null}
        {stage === 5 ? <TwoDirections step={step} /> : null}
        {stage === 6 ? <AgreeLimit step={step} /> : null}
        {stage === 7 ? (
          <DisagreeLimit step={step} guess={guess} setGuess={setGuess} />
        ) : null}
        {stage === 8 ? <PracticeA step={step} /> : null}
        {stage === 9 ? <PracticeB step={step} /> : null}
        {stage === 10 ? <PracticeC step={step} /> : null}
        {stage === 11 ? (
          <QuickCheck
            step={step}
            q1={q1}
            q2={q2}
            q3={q3}
            setQ1={setQ1}
            setQ2={setQ2}
            setQ3={setQ3}
          />
        ) : null}
        {stage === 12 ? <Closing step={step} /> : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          className={HIT}
          style={{ background: "#F4F0E6", color: NAVY }}
          disabled={stage === 0 && step === 0}
          onClick={back}
        >
          Back
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: NAVY, color: "#fff" }}
          disabled={stage === 12 && step >= max - 1}
          onClick={next}
        >
          {nextLabel}
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: "#F4F0E6", color: NAVY }}
          onClick={resetLesson}
        >
          Reset
        </button>
      </div>
    </section>
  );
}

function isReveal(stage: StageId, nextStep: number) {
  const map: Record<number, number[]> = {
    1: [1, 2, 3],
    2: [1, 2, 9],
    3: [1, 2],
    7: [1],
    8: [1],
    9: [1, 2],
    10: [1, 2, 3, 4],
    11: [1, 3, 5],
  };
  return (map[stage] ?? []).includes(nextStep);
}

function Opening({ step }: { step: number }) {
  const motion = useApproachPlayer(step >= 2);
  return (
    <div className="text-center" style={{ color: NAVY }}>
      <p className="font-serif text-4xl leading-tight sm:text-5xl" style={{ color: NAVY }}>
        Exploring Limits
      </p>
      <p className="mt-2 text-xl sm:text-2xl">What is the function approaching?</p>
      <p className="mt-3 flex items-center justify-center gap-2 text-sm tracking-[0.16em] text-emerald-800 uppercase">
        <CrossMark /> Approach · Reflect · Grow
      </p>
      <p className="mx-auto mt-6 max-w-3xl px-2 text-lg leading-snug sm:text-xl">
        Today I can evaluate limits algebraically and use a graph to describe what a
        function approaches from the left and from the right.
      </p>
      <Fade show={step >= 1}>
        <p className="mx-auto mt-8 max-w-2xl font-serif text-2xl leading-snug sm:text-3xl">
          If <Tex math="x" /> gets closer and closer to a number, what happens to{" "}
          <Tex math="f(x)" />?
        </p>
      </Fade>
      <Fade show={step >= 2}>
        <div className="mx-auto mt-5 max-w-3xl overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <CurveGraph
            f={(x) => 0.35 * (x - 2) ** 2 + 2.4}
            xMin={0}
            xMax={4}
            yMin={0}
            yMax={6}
            targetX={2}
            t={motion.t}
            mode="both"
            ariaLabel="A point approaching x equals 2 from the left and from the right on a simple curve."
          />
        </div>
        <PlayBar
          playing={motion.playing}
          onPlay={motion.play}
          onPause={motion.pause}
          onReset={motion.reset}
        />
        <p className="mt-2 text-sm text-stone-500">
          Blue comes from the left. Green comes from the right.
        </p>
      </Fade>
    </div>
  );
}

function Problem1({ step }: { step: number }) {
  const motion = useApproachPlayer(step >= 4);
  return (
    <div style={{ color: NAVY }}>
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        QOD | Evaluating Limits · 1 of 3
      </p>
      <div className="mt-3 text-center">
        <Tex display className="text-3xl sm:text-4xl" math={String.raw`\lim_{x\to 3}(x^2+2x-1)`} />
      </div>
      <p className="mt-3 text-center text-stone-500">Try substituting first.</p>
      <Fade show={step >= 1}>
        <p className="mt-5 text-center text-lg">Replace each <Tex math="x" /> with 3.</p>
        <p className="mt-2 text-center font-serif text-2xl">
          <Tex math={String.raw`3^2+2(3)-1`} />
        </p>
      </Fade>
      <Fade show={step >= 2}>
        <p className="mt-3 text-center font-serif text-2xl">
          <Tex math={String.raw`9+6-1`} />
        </p>
      </Fade>
      <Fade show={step >= 3}>
        <p className="mt-3 text-center font-serif text-4xl font-semibold">14</p>
      </Fade>
      <Fade show={step >= 4}>
        <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <CurveGraph
            f={(x) => x * x + 2 * x - 1}
            xMin={0}
            xMax={5}
            yMin={-2}
            yMax={18}
            targetX={3}
            filled={{ x: 3, y: 14 }}
            t={motion.t}
            ariaLabel="Parabola y equals x squared plus 2x minus 1 with a filled point at 3 comma 14."
          />
        </div>
        <PlayBar
          playing={motion.playing}
          onPlay={motion.play}
          onPause={motion.pause}
          onReset={motion.reset}
        />
        <p className="mt-2 text-center text-lg font-semibold">(3, 14)</p>
      </Fade>
      <Fade show={step >= 5}>
        <p className="mt-4 text-center font-serif text-2xl">
          As <Tex math={String.raw`x\to 3`} />, <Tex math={String.raw`f(x)\to 14`} />.
        </p>
        <Prompt>What do you notice about the y-values as x gets closer to 3?</Prompt>
      </Fade>
    </div>
  );
}

function Problem2({ step }: { step: number }) {
  const motion = useApproachPlayer(step >= 10);
  return (
    <div style={{ color: NAVY }}>
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        QOD | Evaluating Limits · 2 of 3
      </p>
      <div className="mt-3 text-center">
        <Tex
          display
          className="text-3xl sm:text-4xl"
          math={String.raw`\lim_{x\to 4}\dfrac{x^2-16}{x-4}`}
        />
      </div>
      <p className="mt-3 text-center text-stone-500">Try substituting first.</p>
      <Fade show={step >= 1}>
        <p className="mt-5 text-center font-serif text-2xl">
          <Tex math={String.raw`\dfrac{4^2-16}{4-4}`} />
        </p>
      </Fade>
      <Fade show={step >= 2}>
        <p className="mt-3 text-center font-serif text-3xl">
          <Tex math={String.raw`\dfrac{0}{0}`} />
        </p>
      </Fade>
      <Fade show={step >= 3}>
        <p className="mt-5 text-center font-serif text-3xl font-semibold">0/0 is a clue.</p>
      </Fade>
      <Fade show={step >= 4}>
        <p className="mt-2 text-center text-xl">Something needs to be simplified.</p>
      </Fade>
      <Fade show={step >= 5}>
        <p className="mt-5 text-center text-xl">
          <Tex math={String.raw`x^2-16=(x-4)(x+4)`} />
        </p>
      </Fade>
      <Fade show={step >= 6}>
        <p className="mt-3 text-center font-serif text-2xl">
          <Tex math={String.raw`\dfrac{(x-4)(x+4)}{x-4}`} />
        </p>
      </Fade>
      <Fade show={step >= 7}>
        <p className="mt-2 text-center text-lg">
          The common factor <Tex math={String.raw`(x-4)`} /> cancels, for{" "}
          <Tex math={String.raw`x\neq 4`} />.
        </p>
      </Fade>
      <Fade show={step >= 8}>
        <p className="mt-3 text-center font-serif text-3xl">
          <Tex math={String.raw`x+4\quad(x\neq 4)`} />
        </p>
      </Fade>
      <Fade show={step >= 9}>
        <p className="mt-3 text-center font-serif text-3xl">
          <Tex math={String.raw`4+4=8`} />
        </p>
      </Fade>
      <Fade show={step >= 10}>
        <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <CurveGraph
            f={(x) => x + 4}
            xMin={0}
            xMax={8}
            yMin={0}
            yMax={14}
            targetX={4}
            hole={{ x: 4, y: 8 }}
            t={motion.t}
            ariaLabel="Line y equals x plus 4 with a clear open circle at 4 comma 8."
          />
        </div>
        <PlayBar
          playing={motion.playing}
          onPlay={motion.play}
          onPause={motion.pause}
          onReset={motion.reset}
        />
        <p className="mt-2 text-center text-lg">
          This is <Tex math={String.raw`y=x+4`} />, except an open circle at (4, 8).
        </p>
      </Fade>
      <Fade show={step >= 11}>
        <p className="mt-4 text-center text-xl font-semibold leading-snug">
          The function is undefined at <Tex math="x=4" />, but the limit still exists.
        </p>
      </Fade>
      <Fade show={step >= 12}>
        <p className="mt-3 text-center font-serif text-2xl">
          <Tex math={String.raw`\lim_{x\to 4}\dfrac{x^2-16}{x-4}=8`} />
        </p>
        <Prompt>How can the limit be 8 if the function has a hole at x = 4?</Prompt>
      </Fade>
    </div>
  );
}

function Problem3({ step }: { step: number }) {
  const motion = useApproachPlayer(step >= 3);
  return (
    <div style={{ color: NAVY }}>
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        QOD | Evaluating Limits · 3 of 3
      </p>
      <div className="mt-3 text-center">
        <Tex
          display
          className="text-3xl sm:text-4xl"
          math={String.raw`\lim_{x\to 2}\dfrac{x+5}{x+1}`}
        />
      </div>
      <p className="mt-3 text-center text-stone-500">Try substituting first.</p>
      <Fade show={step >= 1}>
        <p className="mt-5 text-center font-serif text-2xl">
          <Tex math={String.raw`\dfrac{2+5}{2+1}`} />
        </p>
      </Fade>
      <Fade show={step >= 2}>
        <p className="mt-3 text-center font-serif text-4xl">
          <Tex math={String.raw`\dfrac{7}{3}`} />
        </p>
      </Fade>
      <Fade show={step >= 3}>
        <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <CurveGraph
            f={(x) => (x + 5) / (x + 1)}
            xMin={-3.2}
            xMax={5}
            yMin={-4}
            yMax={8}
            targetX={2}
            filled={{ x: 2, y: 7 / 3 }}
            vAsymptote={step >= 5 ? -1 : undefined}
            t={motion.t}
            ariaLabel="Graph of y equals x plus 5 over x plus 1 with a filled point at 2 comma 7 thirds."
          />
        </div>
        <PlayBar
          playing={motion.playing}
          onPlay={motion.play}
          onPause={motion.pause}
          onReset={motion.reset}
        />
        <p className="mt-2 text-center text-lg font-semibold">
          <Tex math={String.raw`\left(2,\dfrac{7}{3}\right)`} />
        </p>
      </Fade>
      <Fade show={step >= 4}>
        <p className="mt-4 text-center font-serif text-2xl">
          As <Tex math={String.raw`x\to 2`} />, <Tex math={String.raw`f(x)\to \dfrac{7}{3}`} />.
        </p>
      </Fade>
      <Fade show={step >= 5}>
        <p className="mt-3 text-center text-base text-stone-600">
          The dashed line is <Tex math="x=-1" />. The graph has other behavior there — we
          are not studying asymptotes today.
        </p>
      </Fade>
    </div>
  );
}

function BigIdea({ step }: { step: number }) {
  const motion = useApproachPlayer(step >= 3);
  return (
    <div className="mx-auto max-w-3xl text-center" style={{ color: NAVY }}>
      <p className="font-serif text-3xl leading-snug sm:text-4xl">A limit asks:</p>
      <p className="mt-3 font-serif text-3xl font-semibold leading-snug sm:text-5xl">
        What value is the function{" "}
        <span style={{ color: "#0d5c3d" }}>APPROACHING</span>?
      </p>
      <Fade show={step >= 1}>
        <p className="mt-8 rounded-2xl bg-[#EAF3ED] px-5 py-4 text-xl sm:text-2xl">
          1. We care about values near <Tex math="x=a" />.
        </p>
      </Fade>
      <Fade show={step >= 2}>
        <p className="mt-3 rounded-2xl bg-[#EAF3ED] px-5 py-4 text-xl sm:text-2xl">
          2. The function does not always need to be defined at <Tex math="x=a" />.
        </p>
      </Fade>
      <Fade show={step >= 3}>
        <p className="mt-3 rounded-2xl bg-[#EAF3ED] px-5 py-4 text-xl sm:text-2xl">
          3. We should check what happens from both sides.
        </p>
        <div className="mx-auto mt-5 max-w-xl overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <ApproachNumberLine t={motion.t} />
        </div>
        <PlayBar
          playing={motion.playing}
          onPlay={motion.play}
          onPause={motion.pause}
          onReset={motion.reset}
        />
      </Fade>
    </div>
  );
}

function TwoDirections({ step }: { step: number }) {
  const left = useApproachPlayer(step >= 1 && step < 3);
  const right = useApproachPlayer(step >= 3);
  const t = step >= 3 ? right.t : left.t;
  const playing = step >= 3 ? right.playing : left.playing;
  const play = step >= 3 ? right.play : left.play;
  const pause = step >= 3 ? right.pause : left.pause;
  const reset = step >= 3 ? right.reset : left.reset;
  const mode = step >= 3 ? "right" : step >= 1 ? "left" : "none";
  return (
    <div style={{ color: NAVY }}>
      <p className="text-center font-serif text-3xl">Approaching From Two Directions</p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <CurveGraph
          f={(x) => 0.4 * (x - 2) ** 2 + 3}
          xMin={0}
          xMax={4}
          yMin={0}
          yMax={7}
          targetX={2}
          t={t}
          mode={mode}
          ariaLabel="A curve near x equals 2 used to show left-hand and right-hand approach."
        />
      </div>
      {step >= 1 ? (
        <PlayBar playing={playing} onPlay={play} onPause={pause} onReset={reset} />
      ) : null}
      <Fade show={step >= 1}>
        <p className="mt-4 text-center text-xl" style={{ color: LEFT }}>
          From the LEFT
        </p>
        <p className="text-center font-serif text-2xl">
          <Tex math={String.raw`x\to 2^-`} />
        </p>
        <p className="text-center text-lg">
          left-hand limit · <Tex math={String.raw`\lim_{x\to 2^-}f(x)`} />
        </p>
      </Fade>
      <Fade show={step >= 2}>
        <Prompt>
          The − does not mean negative 2. It means values just less than 2.
        </Prompt>
      </Fade>
      <Fade show={step >= 3}>
        <p className="mt-4 text-center text-xl" style={{ color: RIGHT }}>
          From the RIGHT
        </p>
        <p className="text-center font-serif text-2xl">
          <Tex math={String.raw`x\to 2^+`} />
        </p>
        <p className="text-center text-lg">
          right-hand limit · <Tex math={String.raw`\lim_{x\to 2^+}f(x)`} />
        </p>
      </Fade>
      <Fade show={step >= 4}>
        <Prompt>The + means values just greater than 2.</Prompt>
      </Fade>
    </div>
  );
}

function AgreeLimit({ step }: { step: number }) {
  const motion = useApproachPlayer(step >= 0);
  return (
    <div style={{ color: NAVY }}>
      <p className="text-center font-serif text-3xl">When does the limit exist?</p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <JumpGraph
          leftY={4}
          rightY={4}
          holeY={4}
          t={motion.t}
          ariaLabel="Both sides of a graph approach y equals 4 at x equals 2."
        />
      </div>
      <PlayBar
        playing={motion.playing}
        onPlay={motion.play}
        onPause={motion.pause}
        onReset={motion.reset}
      />
      <Fade show={step >= 1}>
        <p className="mt-4 text-center text-xl">
          Left-hand limit = 4 · Right-hand limit = 4
        </p>
      </Fade>
      <Fade show={step >= 2}>
        <p className="mt-3 text-center font-serif text-2xl">
          Because they agree, <Tex math={String.raw`\lim_{x\to 2}f(x)=4`} />.
        </p>
      </Fade>
      <Fade show={step >= 3}>
        <div
          className="mx-auto mt-5 max-w-sm rounded-2xl border-2 px-6 py-4 text-center text-xl leading-relaxed"
          style={{ borderColor: GOLD }}
        >
          LEFT → 4
          <br />
          RIGHT → 4
          <br />
          <span className="mt-2 inline-block font-semibold">LIMIT = 4</span>
        </div>
      </Fade>
    </div>
  );
}

function DisagreeLimit({
  step,
  guess,
  setGuess,
}: {
  step: number;
  guess: string | null;
  setGuess: (value: string) => void;
}) {
  const motion = useApproachPlayer(true);
  const choices = ["2", "5", "7", "DNE"];
  return (
    <div style={{ color: NAVY }}>
      <p className="text-center font-serif text-3xl">What should the overall limit be?</p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <JumpGraph
          leftY={2}
          rightY={5}
          holeY={2}
          t={motion.t}
          ariaLabel="Left side approaches 2 and right side approaches 5."
        />
      </div>
      <PlayBar
        playing={motion.playing}
        onPlay={motion.play}
        onPause={motion.pause}
        onReset={motion.reset}
      />
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {choices.map((choice) => (
          <button
            key={choice}
            type="button"
            className={`${HIT} min-w-[4.5rem]`}
            style={{
              background: guess === choice ? NAVY : "#F4F0E6",
              color: guess === choice ? "#fff" : NAVY,
            }}
            onClick={() => setGuess(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-sm text-stone-500">
        Choose first. Then use Reveal.
      </p>
      <Fade show={step >= 1}>
        <p className="mt-5 text-center text-xl">
          Left-hand limit = 2 · Right-hand limit = 5
        </p>
        <p className="mt-2 text-center text-xl font-semibold">They do not agree.</p>
        <p className="mt-3 text-center font-serif text-2xl">
          <Tex math={String.raw`\lim_{x\to a}f(x)`} /> = DNE
        </p>
        <p className="mt-5 text-center text-xl">
          A two-sided limit exists only when LEFT = RIGHT.
        </p>
      </Fade>
    </div>
  );
}

function PracticeA({ step }: { step: number }) {
  const motion = useApproachPlayer(step >= 1);
  return (
    <div style={{ color: NAVY }}>
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        Board practice A
      </p>
      <div className="mt-4 text-center">
        <Tex display className="text-3xl sm:text-4xl" math={String.raw`\lim_{x\to 2}(x^2+3x)`} />
      </div>
      <p className="mt-4 text-center text-stone-500">Work this before Reveal.</p>
      <Fade show={step >= 1}>
        <p className="mt-5 text-center font-serif text-4xl font-semibold">10</p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <CurveGraph
            f={(x) => x * x + 3 * x}
            xMin={0}
            xMax={4}
            yMin={-1}
            yMax={16}
            targetX={2}
            filled={{ x: 2, y: 10 }}
            t={motion.t}
            ariaLabel="Graph of y equals x squared plus 3x through 2 comma 10."
          />
        </div>
        <PlayBar
          playing={motion.playing}
          onPlay={motion.play}
          onPause={motion.pause}
          onReset={motion.reset}
        />
      </Fade>
    </div>
  );
}

function PracticeB({ step }: { step: number }) {
  const motion = useApproachPlayer(step >= 2);
  return (
    <div style={{ color: NAVY }}>
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        Board practice B
      </p>
      <div className="mt-4 text-center">
        <Tex
          display
          className="text-3xl sm:text-4xl"
          math={String.raw`\lim_{x\to 5}\dfrac{x^2-25}{x-5}`}
        />
      </div>
      <p className="mt-4 text-center text-stone-500">Work this before Reveal.</p>
      <Fade show={step >= 1}>
        <p className="mt-5 text-center text-xl">
          <Tex math={String.raw`x^2-25=(x-5)(x+5)`} />
        </p>
      </Fade>
      <Fade show={step >= 2}>
        <p className="mt-3 text-center font-serif text-4xl font-semibold">10</p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <CurveGraph
            f={(x) => x + 5}
            xMin={1}
            xMax={9}
            yMin={2}
            yMax={16}
            targetX={5}
            hole={{ x: 5, y: 10 }}
            t={motion.t}
            ariaLabel="Line y equals x plus 5 with a hole at 5 comma 10."
          />
        </div>
        <PlayBar
          playing={motion.playing}
          onPlay={motion.play}
          onPause={motion.pause}
          onReset={motion.reset}
        />
        <p className="mt-2 text-center text-lg">
          <Tex math={String.raw`y=x+5`} /> with a hole at (5, 10).
        </p>
      </Fade>
    </div>
  );
}

function PracticeC({ step }: { step: number }) {
  const motion = useApproachPlayer(true);
  return (
    <div style={{ color: NAVY }}>
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        Board practice C · Graph reading
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <JumpGraph
          leftY={4}
          rightY={4}
          atY={1}
          holeY={4}
          targetX={3}
          t={motion.t}
          ariaLabel="Open circle at 3 comma 4 and a filled dot at 3 comma 1. Both sides approach 4."
        />
      </div>
      <PlayBar
        playing={motion.playing}
        onPlay={motion.play}
        onPause={motion.pause}
        onReset={motion.reset}
      />
      <ol className="mx-auto mt-5 max-w-xl space-y-2 text-lg sm:text-xl">
        <li>1. What is the left-hand limit?</li>
        <li>2. What is the right-hand limit?</li>
        <li>
          3. What is <Tex math={String.raw`\lim_{x\to 3}f(x)`} />?
        </li>
        <li>
          4. What is <Tex math="f(3)" />?
        </li>
      </ol>
      <Fade show={step >= 1}>
        <p className="mt-4 text-center text-xl">Left limit = 4</p>
      </Fade>
      <Fade show={step >= 2}>
        <p className="text-center text-xl">Right limit = 4</p>
      </Fade>
      <Fade show={step >= 3}>
        <p className="text-center text-xl">Overall limit = 4</p>
      </Fade>
      <Fade show={step >= 4}>
        <p className="text-center text-xl">
          <Tex math="f(3)=1" />
        </p>
      </Fade>
      <Fade show={step >= 5}>
        <Prompt>
          The LIMIT and the FUNCTION VALUE do not have to be the same.
        </Prompt>
      </Fade>
    </div>
  );
}

function QuickCheck({
  step,
  q1,
  q2,
  q3,
  setQ1,
  setQ2,
  setQ3,
}: {
  step: number;
  q1: string | null;
  q2: string | null;
  q3: string | null;
  setQ1: (value: string) => void;
  setQ2: (value: string) => void;
  setQ3: (value: string) => void;
}) {
  return (
    <div style={{ color: NAVY }}>
      <p className="text-center font-serif text-3xl">Quick check</p>
      <div className="mx-auto mt-5 max-w-2xl space-y-6 text-lg sm:text-xl">
        <div>
          <p>1. If direct substitution gives a normal number, what should you usually do?</p>
          <ChoiceRow
            value={q1}
            onChange={setQ1}
            options={["Stop; it is DNE", "Use that value as the limit", "Always factor first"]}
          />
          <Fade show={step >= 1}>
            <p className="mt-2 font-semibold">Use that value as the limit.</p>
          </Fade>
        </div>
        <Fade show={step >= 2}>
          <p>2. If substitution gives 0/0, what should you think?</p>
          <ChoiceRow
            value={q2}
            onChange={setQ2}
            options={["The limit is DNE", "Try simplifying or factoring", "The answer is 0"]}
          />
        </Fade>
        <Fade show={step >= 3}>
          <p className="font-semibold">Try simplifying or factoring. 0/0 is a clue, not DNE.</p>
        </Fade>
        <Fade show={step >= 4}>
          <p>3. For a two-sided limit to exist, what must be true?</p>
          <ChoiceRow
            value={q3}
            onChange={setQ3}
            options={[
              "f(a) exists",
              "Left-hand limit = right-hand limit",
              "The graph has no holes",
            ]}
          />
        </Fade>
        <Fade show={step >= 5}>
          <p className="font-semibold">Left-hand limit = right-hand limit.</p>
        </Fade>
      </div>
    </div>
  );
}

function ChoiceRow({
  value,
  onChange,
  options,
}: {
  value: string | null;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`${HIT} justify-start text-left text-sm sm:text-base`}
          style={{
            background: value === option ? NAVY : "#F4F0E6",
            color: value === option ? "#fff" : NAVY,
          }}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Closing({ step }: { step: number }) {
  return (
    <div className="mx-auto max-w-3xl text-center" style={{ color: NAVY }}>
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        Today’s big idea
      </p>
      <p className="mt-4 font-serif text-2xl leading-snug sm:text-3xl">
        A limit describes where a function is heading, even when something unusual
        happens at the point itself.
      </p>
      <Fade show={step >= 1}>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <p className="rounded-2xl bg-[#EAF3ED] px-4 py-5 text-xl">
            Left = Right → Limit exists
          </p>
          <p className="rounded-2xl bg-[#F4F0E6] px-4 py-5 text-xl">
            Left ≠ Right → DNE
          </p>
        </div>
      </Fade>
      <Fade show={step >= 2}>
        <Prompt>
          What matters more when finding a limit: where the function is, or where the
          function is going?
        </Prompt>
      </Fade>
    </div>
  );
}
