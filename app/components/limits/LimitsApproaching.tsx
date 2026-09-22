"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Tex } from "./Tex";

const NAVY = "#1B2A4A";
const SECANT = "#2563EB";
const TANGENT = "#15803D";
const HIT =
  "inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

type SectionId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const SECTIONS: { id: SectionId; tab: string; title: string }[] = [
  { id: 0, tab: "1. Approach", title: "Approaching" },
  { id: 1, tab: "2. Notation", title: "What Is a Limit?" },
  { id: 2, tab: "3. Near vs At", title: "Near Is Not Always At" },
  { id: 3, tab: "4. See it", title: "See the Idea" },
  { id: 4, tab: "5. We do", title: "Example 1 | We Do" },
  { id: 5, tab: "6. Three ways", title: "One Limit, Three Ways" },
  { id: 6, tab: "7. You do", title: "Example 2 | You Do" },
  { id: 7, tab: "8. Check", title: "Quick Check" },
  { id: 8, tab: "9. From class", title: "From Class" },
];

type Part = "xa" | "fx" | "L" | null;
type WeDoStep = 0 | 1 | 2 | 3 | 4;

function fSimple(x: number) {
  return x + 2;
}

function fmt(n: number) {
  const rounded = Math.round(n * 1e4) / 1e4;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded);
}

export function LimitsApproaching() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rootRef = useRef<HTMLElement>(null);
  const [section, setSection] = useState<SectionId>(0);
  const [part, setPart] = useState<Part>(null);
  const [distance, setDistance] = useState(1);
  const [fromRight, setFromRight] = useState(false);
  const [limitRevealed, setLimitRevealed] = useState(false);
  const [weDo, setWeDo] = useState<WeDoStep>(0);
  const [ready, setReady] = useState(false);
  const [estimate, setEstimate] = useState("");
  const [tries, setTries] = useState(0);
  const [youDo, setYouDo] = useState<"idle" | "correct" | "wrong" | "help">(
    "idle",
  );
  const [helpStep, setHelpStep] = useState(0);
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [blanks, setBlanks] = useState<(string | null)[]>([null, null, null, null]);
  const [hideAnswers, setHideAnswers] = useState(false);
  const [forceShow, setForceShow] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);

  const xLeft = 2 - distance;
  const xRight = 2 + distance;
  const xNow = fromRight ? xRight : xLeft;
  const yNow = fSimple(xNow);

  const go = useCallback((id: SectionId) => {
    setSection(id);
    setPart(null);
  }, []);

  function resetLesson() {
    setSection(0);
    setPart(null);
    setDistance(1);
    setFromRight(false);
    setLimitRevealed(false);
    setWeDo(0);
    setReady(false);
    setEstimate("");
    setTries(0);
    setYouDo("idle");
    setHelpStep(0);
    setQ1(null);
    setQ2(null);
    setBlanks([null, null, null, null]);
    setHideAnswers(false);
    setForceShow(false);
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

  const answersOn = forceShow && !hideAnswers;
  const weDoShown = (n: WeDoStep) =>
    !hideAnswers && (forceShow || weDo >= n);

  return (
    <section
      ref={rootRef}
      className="ua-card ua-shadow-soft relative p-4 sm:p-6 md:col-span-2"
      style={{ background: "#FFFEFB" }}
      aria-labelledby={`${uid}-heading`}
    >
      <div className="absolute top-3 right-3">
        <details
          className="text-right"
          open={teacherOpen}
          onToggle={(event) => setTeacherOpen(event.currentTarget.open)}
        >
          <summary className="cursor-pointer list-none text-[0.7rem] tracking-wide text-stone-500 uppercase">
            Teacher
          </summary>
          <div
            className="mt-2 w-52 rounded-xl border border-stone-200 bg-white p-3 text-left text-sm shadow-sm"
            style={{ color: NAVY }}
          >
            <label className="flex min-h-10 items-center gap-2">
              <input
                type="checkbox"
                checked={hideAnswers}
                onChange={(event) => {
                  setHideAnswers(event.target.checked);
                  if (event.target.checked) setForceShow(false);
                }}
              />
              Hide answers
            </label>
            <label className="flex min-h-10 items-center gap-2">
              <input
                type="checkbox"
                checked={forceShow}
                onChange={(event) => {
                  setForceShow(event.target.checked);
                  if (event.target.checked) setHideAnswers(false);
                }}
              />
              Show answers
            </label>
            <label className="mt-2 block text-xs font-semibold">Jump to section</label>
            <select
              className="mt-1 min-h-11 w-full rounded-lg border border-stone-300 px-2"
              value={section}
              onChange={(event) => go(Number(event.target.value) as SectionId)}
            >
              {SECTIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={`${HIT} mt-2 w-full bg-[#F4F0E6]`}
              onClick={() => void toggleFullscreen()}
            >
              Full screen
            </button>
            <button
              type="button"
              className={`${HIT} mt-1 w-full bg-[#F4F0E6]`}
              onClick={resetLesson}
            >
              Reset lesson
            </button>
          </div>
        </details>
      </div>

      <p className="text-[0.7rem] font-semibold tracking-wide text-emerald-800 uppercase">
        Calculus Honors · Limits
      </p>
      <h2
        id={`${uid}-heading`}
        className="mt-1 max-w-3xl pr-16 font-serif text-2xl sm:text-3xl"
        style={{ color: NAVY }}
      >
        Limits: What Are We Approaching?
      </h2>

      <div
        role="tablist"
        aria-label="Lesson sections"
        className="mt-4 flex flex-wrap gap-1"
      >
        {SECTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={section === item.id}
            className={`${HIT} px-1 text-[0.7rem] sm:text-xs`}
            style={{
              background: section === item.id ? NAVY : "#F4F0E6",
              color: section === item.id ? "#fff" : NAVY,
            }}
            onClick={() => go(item.id)}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div className="mt-5 min-h-[22rem]">
        {section === 0 ? <ApproachSlide /> : null}
        {section === 1 ? (
          <NotationSlide part={part} setPart={setPart} />
        ) : null}
        {section === 2 ? <NearAtSlide /> : null}
        {section === 3 ? (
          <SeeSlide
            uid={uid}
            distance={distance}
            setDistance={setDistance}
            fromRight={fromRight}
            setFromRight={setFromRight}
            xNow={xNow}
            yNow={yNow}
            xLeft={xLeft}
            xRight={xRight}
            limitRevealed={limitRevealed && !hideAnswers}
            onReveal={() => setLimitRevealed(true)}
          />
        ) : null}
        {section === 4 ? (
          <WeDoSlide weDo={weDo} setWeDo={setWeDo} shown={weDoShown} />
        ) : null}
        {section === 5 ? <ThreeWaysSlide /> : null}
        {section === 6 ? (
          <YouDoSlide
            ready={ready}
            setReady={setReady}
            estimate={estimate}
            setEstimate={setEstimate}
            youDo={youDo}
            setYouDo={setYouDo}
            tries={tries}
            setTries={setTries}
            helpStep={helpStep}
            setHelpStep={setHelpStep}
            hideAnswers={hideAnswers}
            answersOn={answersOn}
          />
        ) : null}
        {section === 7 ? (
          <CheckSlide
            q1={q1}
            setQ1={setQ1}
            q2={q2}
            setQ2={setQ2}
            blanks={blanks}
            setBlanks={setBlanks}
            hideAnswers={hideAnswers}
            answersOn={answersOn}
          />
        ) : null}
        {section === 8 ? <FromClassSlide /> : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          className={`${HIT} bg-white`}
          style={{ color: NAVY }}
          disabled={section === 0}
          onClick={() => go((section - 1) as SectionId)}
        >
          Back
        </button>
        <button
          type="button"
          className={`${HIT} text-white`}
          style={{ background: NAVY }}
          disabled={section === 8}
          onClick={() => go((section + 1) as SectionId)}
        >
          Next
        </button>
      </div>
    </section>
  );
}

function ApproachSlide() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h3 className="font-serif text-3xl" style={{ color: NAVY }}>
        Approaching
      </h3>
      <p className="mt-6 text-xl leading-relaxed sm:text-2xl" style={{ color: NAVY }}>
        Average rates can get closer and closer to one number.
      </p>
      <p className="mt-4 text-xl leading-relaxed sm:text-2xl" style={{ color: NAVY }}>
        That number is what we are approaching.
      </p>
      <p className="mt-8 text-lg text-stone-600">
        Calculus has a name and a notation for this idea.
      </p>
    </div>
  );
}

function NotationSlide({
  part,
  setPart,
}: {
  part: Part;
  setPart: (value: Part) => void;
}) {
  const note =
    part === "xa"
      ? "The input x gets closer and closer to a."
      : part === "fx"
        ? "The function produces output values."
        : part === "L"
          ? "The outputs approach L."
          : "Tap a piece of the notation.";

  return (
    <div className="mx-auto max-w-3xl text-center">
      <h3 className="font-serif text-3xl" style={{ color: NAVY }}>
        What Is a Limit?
      </h3>
      <p className="mx-auto mt-5 max-w-2xl text-xl leading-relaxed" style={{ color: NAVY }}>
        A limit describes what the output of a function approaches as the input
        gets closer and closer to a value.
      </p>
      <div
        className="mx-auto mt-6 inline-block rounded-2xl border-2 px-10 py-5"
        style={{ borderColor: NAVY, color: NAVY }}
      >
        <Tex
          display
          className="text-3xl sm:text-4xl"
          math={String.raw`\lim_{x \to a} f(x) = L`}
        />
      </div>
      <p className="mt-4 text-lg font-semibold sm:text-xl" style={{ color: NAVY }}>
        As <Tex math="x" /> approaches <Tex math="a" />, <Tex math="f(x)" />{" "}
        approaches <Tex math="L" />.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {(
          [
            ["xa", String.raw`x \to a`],
            ["fx", String.raw`f(x)`],
            ["L", String.raw`L`],
          ] as const
        ).map(([id, math]) => (
          <button
            key={id}
            type="button"
            aria-pressed={part === id}
            className={`${HIT} min-h-14 ${part === id ? "text-white" : "bg-white"}`}
            style={{
              background: part === id ? SECANT : "#fff",
              color: part === id ? "#fff" : NAVY,
              border: `2px solid ${part === id ? SECANT : "#ddd"}`,
            }}
            onClick={() => setPart(part === id ? null : id)}
          >
            <Tex math={math} />
          </button>
        ))}
      </div>
      <p className="mt-4 min-h-12 text-lg" style={{ color: NAVY }}>
        {note}
      </p>
    </div>
  );
}

function NearAtSlide() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h3 className="font-serif text-3xl" style={{ color: NAVY }}>
        Near is not always the same as At
      </h3>
      <p
        className="mx-auto mt-8 max-w-xl rounded-2xl px-6 py-5 text-2xl font-semibold"
        style={{ background: "#E8EEF7", color: NAVY }}
      >
        NEAR is not always the same as AT.
      </p>
      <p className="mt-8 text-xl leading-relaxed" style={{ color: NAVY }}>
        A limit asks what happens <span className="font-semibold">near</span> an
        input.
      </p>
      <p className="mt-3 text-xl leading-relaxed" style={{ color: NAVY }}>
        It does not automatically tell us what happens exactly{" "}
        <span className="font-semibold">at</span> that input.
      </p>
    </div>
  );
}

function SeeSlide({
  uid,
  distance,
  setDistance,
  fromRight,
  setFromRight,
  xNow,
  yNow,
  xLeft,
  xRight,
  limitRevealed,
  onReveal,
}: {
  uid: string;
  distance: number;
  setDistance: (value: number) => void;
  fromRight: boolean;
  setFromRight: (value: boolean) => void;
  xNow: number;
  yNow: number;
  xLeft: number;
  xRight: number;
  limitRevealed: boolean;
  onReveal: () => void;
}) {
  return (
    <div>
      <h3 className="text-center font-serif text-3xl" style={{ color: NAVY }}>
        See the idea before calculating
      </h3>
      <div className="mt-2 text-center text-lg" style={{ color: NAVY }}>
        <Tex display math={String.raw`f(x)=\dfrac{x^2-4}{x-2}`} />
      </div>
      <div className="mt-3 grid items-start gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(16rem,20rem)]">
        <HoleGraph
          uid={uid}
          xLeft={xLeft}
          xRight={xRight}
          xNow={xNow}
          fromRight={fromRight}
        />
        <div className="rounded-2xl border border-stone-200 bg-white p-4" style={{ color: NAVY }}>
          <div className="grid gap-2">
            <button
              type="button"
              className={`${HIT} flex-1`}
              style={{
                background: fromRight ? "#F4F0E6" : NAVY,
                color: fromRight ? NAVY : "#fff",
              }}
              onClick={() => setFromRight(false)}
            >
              From the left
            </button>
            <button
              type="button"
              className={`${HIT} flex-1`}
              style={{
                background: fromRight ? NAVY : "#F4F0E6",
                color: fromRight ? "#fff" : NAVY,
              }}
              onClick={() => setFromRight(true)}
            >
              From the right
            </button>
          </div>
          <label className="mt-4 block text-sm font-semibold" htmlFor={`${uid}-d`}>
            Move x closer to 2
            <input
              id={`${uid}-d`}
              type="range"
              min={0.01}
              max={1}
              step={0.01}
              value={1.01 - distance}
              onChange={(event) =>
                setDistance(Math.round((1.01 - Number(event.target.value)) * 100) / 100)
              }
              className="mt-2 w-full"
            />
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[1, 0.5, 0.1, 0.01].map((value) => (
              <button
                key={value}
                type="button"
                className={`${HIT} bg-[#F4F0E6]`}
                onClick={() => setDistance(value)}
              >
                {fromRight ? `x = ${fmt(2 + value)}` : `x = ${fmt(2 - value)}`}
              </button>
            ))}
          </div>
          <p className="mt-4 text-lg">
            Point: ({fmt(xNow)}, {fmt(yNow)})
          </p>
          <p className="mt-2 text-lg font-semibold">x is approaching: 2</p>
          <p className="text-lg font-semibold">f(x) is approaching: 4</p>
          {limitRevealed ? (
            <div className="mt-4">
              <Tex
                display
                className="text-xl"
                math={String.raw`\lim_{x\to 2}\dfrac{x^2-4}{x-2}=4`}
              />
              <p className="mt-2 text-sm">
                Even though the original function is not defined at x = 2, the
                outputs can still approach 4.
              </p>
            </div>
          ) : (
            <button
              type="button"
              className={`${HIT} mt-4 w-full text-white`}
              style={{ background: TANGENT }}
              onClick={onReveal}
            >
              Reveal the limit
            </button>
          )}
          <p
            className="mt-4 rounded-xl px-3 py-3 text-sm font-semibold"
            style={{ background: "#E8EEF7" }}
          >
            Key idea: the limit is about what happens near x = 2.
          </p>
        </div>
      </div>
    </div>
  );
}

function WeDoSlide({
  weDo,
  setWeDo,
  shown,
}: {
  weDo: WeDoStep;
  setWeDo: (value: WeDoStep) => void;
  shown: (n: WeDoStep) => boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <h3 className="text-center font-serif text-3xl" style={{ color: NAVY }}>
        Example 1 | We Do
      </h3>
      <div className="mt-4 text-center">
        <Tex
          display
          className="text-2xl sm:text-3xl"
          math={String.raw`\lim_{x\to 2}\dfrac{x^2-4}{x-2}`}
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(
          [
            [1, "1. Try substitution"],
            [2, "2. Factor"],
            [3, "3. Simplify"],
            [4, "4. Interpret"],
          ] as const
        ).map(([n, label]) => (
          <button
            key={n}
            type="button"
            disabled={n > 1 && !shown((n - 1) as WeDoStep)}
            className={`${HIT} ${shown(n) ? "text-white" : "bg-white"}`}
            style={{
              background: shown(n) ? NAVY : "#F4F0E6",
              color: shown(n) ? "#fff" : NAVY,
              opacity: n > 1 && !shown((n - 1) as WeDoStep) ? 0.45 : 1,
            }}
            onClick={() => setWeDo(n)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5 min-h-[10rem] rounded-2xl border border-stone-200 bg-white p-4 text-lg" style={{ color: NAVY }}>
        {shown(1) ? (
          <div>
            <Tex display math={String.raw`\dfrac{2^2-4}{2-2}=\dfrac{0}{0}`} />
            <p className="mt-2">
              <Tex math={String.raw`\tfrac{0}{0}`} /> does <span className="font-semibold">not</span> mean the answer is 0.
            </p>
            <p className="mt-1">Direct substitution did not answer the question.</p>
            <p className="mt-3 font-semibold">What should we try next?</p>
          </div>
        ) : (
          <p>Predict first. Then try substitution.</p>
        )}
        {shown(2) ? (
          <div className="mt-4 border-t border-stone-100 pt-3">
            <Tex display math={String.raw`x^2-4=(x-2)(x+2)`} />
            <Tex
              display
              math={String.raw`\dfrac{x^2-4}{x-2}=\dfrac{(x-2)(x+2)}{x-2}`}
            />
          </div>
        ) : null}
        {shown(3) ? (
          <div className="mt-4 border-t border-stone-100 pt-3">
            <p>For <Tex math={String.raw`x \neq 2`} />,</p>
            <Tex
              display
              math={String.raw`\dfrac{(x-2)(x+2)}{x-2}=x+2`}
            />
            <p className="mt-2">x = 1.9 → 3.9 · x = 1.99 → 3.99</p>
            <p>x = 2.01 → 4.01 · x = 2.1 → 4.1</p>
            <p className="mt-2 font-semibold">What are the outputs approaching?</p>
          </div>
        ) : null}
        {shown(4) ? (
          <div className="mt-4 border-t border-stone-100 pt-3">
            <p className="text-2xl font-semibold" style={{ color: TANGENT }}>
              4
            </p>
            <Tex
              display
              className="text-xl"
              math={String.raw`\boxed{\lim_{x\to 2}\dfrac{x^2-4}{x-2}=4}`}
            />
            <p className="mt-2">
              The function does not need a value at x = 2 for the limit to exist.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ThreeWaysSlide() {
  return (
    <div>
      <h3 className="text-center font-serif text-3xl" style={{ color: NAVY }}>
        One limit, three ways to see it
      </h3>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-stone-200 bg-white p-4" style={{ color: NAVY }}>
          <p className="text-xs font-semibold tracking-wide uppercase">Algebra</p>
          <Tex display math={String.raw`\dfrac{x^2-4}{x-2}`} />
          <p className="text-sm">factors and simplifies to</p>
          <Tex display math={String.raw`x+2,\quad x\neq 2`} />
        </article>
        <article className="rounded-2xl border border-stone-200 bg-white p-4" style={{ color: NAVY }}>
          <p className="text-xs font-semibold tracking-wide uppercase">Table</p>
          <table className="mt-2 w-full text-left text-lg">
            <thead>
              <tr>
                <th className="pb-1">x</th>
                <th className="pb-1">f(x)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1.9", "3.9"],
                ["1.99", "3.99"],
                ["2.01", "4.01"],
                ["2.1", "4.1"],
              ].map(([x, y]) => (
                <tr key={x} className={y.startsWith("3.99") || y.startsWith("4.01") ? "font-semibold" : undefined}>
                  <td className="py-0.5">{x}</td>
                  <td className="py-0.5">{y}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-sm font-semibold" style={{ color: TANGENT }}>
            Outputs move toward 4.
          </p>
        </article>
        <article className="rounded-2xl border border-stone-200 bg-white p-4" style={{ color: NAVY }}>
          <p className="text-xs font-semibold tracking-wide uppercase">Graph</p>
          <MiniHole />
          <p className="mt-1 text-center text-sm">Open circle at (2, 4)</p>
        </article>
      </div>
      <div className="mt-5 text-center" style={{ color: NAVY }}>
        <p className="text-lg">All three tell the same story:</p>
        <p className="mt-2 text-xl">
          <Tex math={String.raw`x \to 2`} /> while <Tex math={String.raw`f(x) \to 4`} />
        </p>
        <Tex
          display
          className="mt-2 text-2xl"
          math={String.raw`\lim_{x\to 2}f(x)=4`}
        />
      </div>
    </div>
  );
}

function YouDoSlide({
  ready,
  setReady,
  estimate,
  setEstimate,
  youDo,
  setYouDo,
  tries,
  setTries,
  helpStep,
  setHelpStep,
  hideAnswers,
  answersOn,
}: {
  ready: boolean;
  setReady: (value: boolean) => void;
  estimate: string;
  setEstimate: (value: string) => void;
  youDo: "idle" | "correct" | "wrong" | "help";
  setYouDo: (value: "idle" | "correct" | "wrong" | "help") => void;
  tries: number;
  setTries: (value: number) => void;
  helpStep: number;
  setHelpStep: (value: number) => void;
  hideAnswers: boolean;
  answersOn: boolean;
}) {
  const showWork = !hideAnswers && (youDo === "correct" || answersOn || youDo === "help");

  function check() {
    const value = Number(estimate.trim());
    if (value === 6) {
      setYouDo("correct");
      return;
    }
    setYouDo("wrong");
    setTries(tries + 1);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h3 className="text-center font-serif text-3xl" style={{ color: NAVY }}>
        Example 2 | You Do
      </h3>
      <div className="mt-4 text-center">
        <Tex
          display
          className="text-2xl sm:text-3xl"
          math={String.raw`\lim_{x\to 3}\dfrac{x^2-9}{x-3}`}
        />
      </div>
      <p className="mt-4 text-center text-lg" style={{ color: NAVY }}>
        Work this in your notebook first.
      </p>
      <ol className="mx-auto mt-3 max-w-md list-decimal text-lg" style={{ color: NAVY }}>
        <li>Try substitution.</li>
        <li>Factor.</li>
        <li>Simplify.</li>
        <li>Determine what the outputs approach.</li>
      </ol>
      {!ready ? (
        <button
          type="button"
          className={`${HIT} mx-auto mt-6 flex w-full max-w-md text-white`}
          style={{ background: SECANT }}
          onClick={() => setReady(true)}
        >
          I’m ready to check
        </button>
      ) : (
        <div className="mx-auto mt-5 max-w-md">
          <label className="block text-sm font-semibold" style={{ color: NAVY }} htmlFor="limit-est">
            My estimate for the limit is
          </label>
          <input
            id="limit-est"
            inputMode="decimal"
            value={estimate}
            onChange={(event) => {
              setEstimate(event.target.value);
              if (youDo === "wrong") setYouDo("idle");
            }}
            className="mt-1 min-h-12 w-full rounded-xl border border-stone-300 px-3 text-xl"
          />
          <button
            type="button"
            className={`${HIT} mt-3 w-full text-white`}
            style={{ background: TANGENT }}
            onClick={check}
          >
            Check
          </button>
        </div>
      )}
      {youDo === "correct" && !hideAnswers ? (
        <p className="mt-4 text-center text-xl font-semibold" style={{ color: TANGENT }}>
          Correct.
        </p>
      ) : null}
      {youDo === "wrong" && !hideAnswers ? (
        <div className="mt-4 text-center" style={{ color: NAVY }}>
          <p>Take another look at the numerator.</p>
          <p className="mt-1">
            Can <Tex math={String.raw`x^2-9`} /> be factored as a difference of squares?
          </p>
          <button
            type="button"
            className={`${HIT} mt-3 bg-[#F4F0E6]`}
            onClick={() => setYouDo("idle")}
          >
            Try again
          </button>
          {tries >= 2 ? (
            <button
              type="button"
              className={`${HIT} mt-2 bg-white`}
              style={{ color: NAVY }}
              onClick={() => {
                setYouDo("help");
                setHelpStep(Math.min(4, Math.max(helpStep, 0) + 1));
              }}
            >
              Show me the next step
            </button>
          ) : null}
        </div>
      ) : null}
      {showWork ? (
        <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4" style={{ color: NAVY }}>
          {(answersOn || youDo === "correct" || helpStep >= 1) && (
            <Tex display math={String.raw`\dfrac{3^2-9}{3-3}=\dfrac{0}{0}`} />
          )}
          {(answersOn || youDo === "correct" || helpStep >= 2) && (
            <Tex display math={String.raw`x^2-9=(x-3)(x+3)`} />
          )}
          {(answersOn || youDo === "correct" || helpStep >= 3) && (
            <Tex
              display
              math={String.raw`\dfrac{(x-3)(x+3)}{x-3}=x+3,\quad x\neq 3`}
            />
          )}
          {(answersOn || youDo === "correct" || helpStep >= 4) && (
            <>
              <p className="mt-2">
                As x approaches 3, <Tex math={String.raw`x+3 \to 6`} />.
              </p>
              <Tex
                display
                className="text-xl"
                math={String.raw`\boxed{\lim_{x\to 3}\dfrac{x^2-9}{x-3}=6}`}
              />
            </>
          )}
          {youDo === "help" && helpStep < 4 && !answersOn ? (
            <button
              type="button"
              className={`${HIT} mt-3 bg-[#F4F0E6]`}
              onClick={() => setHelpStep(helpStep + 1)}
            >
              Show me the next step
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function CheckSlide({
  q1,
  setQ1,
  q2,
  setQ2,
  blanks,
  setBlanks,
  hideAnswers,
  answersOn,
}: {
  q1: string | null;
  setQ1: (value: string | null) => void;
  q2: string | null;
  setQ2: (value: string | null) => void;
  blanks: (string | null)[];
  setBlanks: (value: (string | null)[]) => void;
  hideAnswers: boolean;
  answersOn: boolean;
}) {
  const q1ok = q1 === "B";
  const q2ok = q2 === "true";
  const q3ok = blanks[0] === "x" && blanks[1] === "a" && blanks[2] === "f(x)" && blanks[3] === "L";

  function fill(word: string) {
    const next = [...blanks];
    const index = next.findIndex((item) => item == null);
    if (index === -1) return;
    next[index] = word;
    setBlanks(next);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8" style={{ color: NAVY }}>
      <h3 className="text-center font-serif text-3xl">Quick check</h3>
      <div>
        <p className="font-semibold">1.</p>
        <p className="mt-1">If</p>
        <Tex display math={String.raw`\lim_{x\to 5}f(x)=8`} />
        <p>which statement is best?</p>
        <div className="mt-2 grid gap-2">
          {[
            ["A", "f(5) must equal 8."],
            ["B", "As x gets close to 5, f(x) gets close to 8."],
            ["C", "x becomes equal to 8."],
            ["D", "The function must be undefined at x = 5."],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`${HIT} justify-start bg-white text-left`}
              style={{
                border: `2px solid ${q1 === id ? NAVY : "#e7e5e4"}`,
                background: q1 === id ? "#E8EEF7" : "#fff",
              }}
              onClick={() => setQ1(id)}
            >
              {id}. {label}
            </button>
          ))}
        </div>
        {!hideAnswers && q1 ? (
          <p className="mt-2 font-semibold" style={{ color: q1ok ? TANGENT : "#9B3A52" }}>
            {q1ok
              ? "Yes. The limit is about approaching 8."
              : answersOn
                ? "Best: B. As x gets close to 5, f(x) gets close to 8."
                : "Not quite. The limit is about what happens near x = 5."}
          </p>
        ) : null}
      </div>
      <div>
        <p className="font-semibold">2. True or False</p>
        <p className="mt-1">
          A limit can exist even if the function is not defined at the exact input.
        </p>
        <div className="mt-2 flex gap-2">
          {["true", "false"].map((id) => (
            <button
              key={id}
              type="button"
              className={`${HIT} flex-1 bg-white`}
              style={{
                border: `2px solid ${q2 === id ? NAVY : "#e7e5e4"}`,
                background: q2 === id ? "#E8EEF7" : "#fff",
              }}
              onClick={() => setQ2(id)}
            >
              {id === "true" ? "True" : "False"}
            </button>
          ))}
        </div>
        {!hideAnswers && q2 ? (
          <p className="mt-2 font-semibold" style={{ color: q2ok ? TANGENT : "#9B3A52" }}>
            {q2ok ? "True. Near is not the same as at." : "Look back at the hole in the graph."}
          </p>
        ) : null}
      </div>
      <div>
        <p className="font-semibold">3. Complete</p>
        <Tex display math={String.raw`\lim_{x\to a}f(x)=L`} />
        <p className="mt-2 text-lg">
          As {slot(blanks[0])} approaches {slot(blanks[1])}, the output{" "}
          {slot(blanks[2])} approaches {slot(blanks[3])}.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["x", "a", "f(x)", "L"].map((word) => (
            <button
              key={word}
              type="button"
              className={`${HIT} bg-[#F4F0E6]`}
              onClick={() => fill(word)}
            >
              {word}
            </button>
          ))}
          <button
            type="button"
            className={`${HIT} bg-white`}
            onClick={() => setBlanks([null, null, null, null])}
          >
            Clear
          </button>
        </div>
        {!hideAnswers && blanks.every(Boolean) ? (
          <p className="mt-2 font-semibold" style={{ color: q3ok ? TANGENT : "#9B3A52" }}>
            {q3ok
              ? "Yes: as x approaches a, f(x) approaches L."
              : "Read it as: as x approaches a, f(x) approaches L."}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function slot(value: string | null) {
  return (
    <span
      className="inline-flex min-w-[3rem] justify-center border-b-2 px-1 font-semibold"
      style={{ borderColor: NAVY, color: NAVY }}
    >
      {value ?? "____"}
    </span>
  );
}

function FromClassSlide() {
  return (
    <div className="mx-auto max-w-2xl text-center" style={{ color: NAVY }}>
      <h3 className="font-serif text-3xl">From class</h3>
      <p className="mt-6 text-xl">A limit describes what a function approaches.</p>
      <div
        className="mx-auto mt-5 inline-block rounded-2xl border-2 px-10 py-5"
        style={{ borderColor: NAVY }}
      >
        <Tex display className="text-3xl" math={String.raw`\lim_{x\to a}f(x)=L`} />
      </div>
      <p className="mt-4 text-xl font-semibold">
        As <Tex math="x" /> approaches <Tex math="a" />, <Tex math="f(x)" /> approaches{" "}
        <Tex math="L" />.
      </p>
      <p
        className="mx-auto mt-6 max-w-lg rounded-2xl px-5 py-4 text-xl font-semibold"
        style={{ background: "#E8EEF7" }}
      >
        NEAR is not always the same as AT.
      </p>
      <p className="mt-5 text-xl">
        A limit can exist even when the function is not defined at the exact input.
      </p>
      <p className="mt-10 text-sm tracking-wide text-stone-500 uppercase">Next</p>
      <p className="mt-1 text-lg">Limits from the left and from the right.</p>
    </div>
  );
}

function HoleGraph({
  uid,
  xLeft,
  xRight,
  xNow,
  fromRight,
}: {
  uid: string;
  xLeft: number;
  xRight: number;
  xNow: number;
  fromRight: boolean;
}) {
  const VW = 640;
  const VH = 300;
  const PAD = { l: 48, r: 18, t: 18, b: 40 };
  const X0 = 0.4;
  const X1 = 3.6;
  const Y0 = 1;
  const Y1 = 6.2;
  const toX = (x: number) => PAD.l + ((x - X0) / (X1 - X0)) * (VW - PAD.l - PAD.r);
  const toY = (y: number) => PAD.t + ((Y1 - y) / (Y1 - Y0)) * (VH - PAD.t - PAD.b);
  const yL = fSimple(xLeft);
  const yR = fSimple(xRight);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="h-[min(36dvh,17rem)] w-full"
        role="img"
        aria-labelledby={`${uid}-hole`}
      >
        <title id={`${uid}-hole`}>
          Graph of y equals x plus 2 with an open circle at 2 comma 4.
        </title>
        <rect x={PAD.l} y={PAD.t} width={VW - PAD.l - PAD.r} height={VH - PAD.t - PAD.b} fill="#FFFDF8" />
        {[1, 2, 3].map((x) => (
          <text key={x} x={toX(x)} y={VH - 14} textAnchor="middle" fontSize="13" fill={NAVY} fontWeight="700">
            {x}
          </text>
        ))}
        {[2, 4, 6].map((y) => (
          <text key={y} x={PAD.l - 8} y={toY(y) + 4} textAnchor="end" fontSize="13" fill={NAVY} fontWeight="700">
            {y}
          </text>
        ))}
        <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={VH - PAD.b} stroke={NAVY} strokeWidth="1.4" />
        <line x1={PAD.l} x2={VW - PAD.r} y1={VH - PAD.b} y2={VH - PAD.b} stroke={NAVY} strokeWidth="1.4" />
        <text x={VW - 6} y={VH - PAD.b + 4} textAnchor="end" fontSize="12" fontWeight="700" fill={NAVY}>
          x
        </text>
        <line
          x1={toX(X0)}
          y1={toY(fSimple(X0))}
          x2={toX(X1)}
          y2={toY(fSimple(X1))}
          stroke={NAVY}
          strokeWidth="2.6"
        />
        <circle cx={toX(2)} cy={toY(4)} r="8" fill="#FFFEFB" stroke={NAVY} strokeWidth="2.4" />
        <text x={toX(2) + 16} y={toY(4) - 16} fontSize="12" fontWeight="700" fill={NAVY}>
          not defined here
        </text>
        <circle
          cx={toX(xLeft)}
          cy={toY(yL)}
          r="6"
          fill={fromRight ? "#94a3b8" : SECANT}
          stroke="#fff"
          strokeWidth="2"
        />
        <circle
          cx={toX(xRight)}
          cy={toY(yR)}
          r="6"
          fill={fromRight ? SECANT : "#94a3b8"}
          stroke="#fff"
          strokeWidth="2"
        />
        <circle
          cx={toX(xNow)}
          cy={toY(fSimple(xNow))}
          r="7"
          fill="none"
          stroke={TANGENT}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function MiniHole() {
  const W = 280;
  const H = 140;
  const toX = (x: number) => 36 + ((x - 0.5) / 3) * 220;
  const toY = (y: number) => 16 + ((6.5 - y) / 5) * 100;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-32 w-full" aria-hidden="true">
      <line x1={toX(0.6)} y1={toY(2.6)} x2={toX(3.4)} y2={toY(5.4)} stroke={NAVY} strokeWidth="2.2" />
      <circle cx={toX(2)} cy={toY(4)} r="6" fill="#fff" stroke={NAVY} strokeWidth="2" />
    </svg>
  );
}
