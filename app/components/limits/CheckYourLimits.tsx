"use client";

import { useEffect, useId, useState } from "react";
import { LEFT, NAVY, RIGHT } from "./ExploringLimitsGraphs";
import { Tex } from "./Tex";
import {
  ALGEBRA,
  SIDES,
  gradeExists,
  gradeFactors,
  gradeNumber,
  gradeSimplified,
} from "./checkYourLimitsGrade";

const HIT =
  "inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";
const FIELD =
  "mt-1 min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base";
const CREAM = "#FFFEFB";

type Tab = 1 | 2 | 3 | 4 | 5 | "compare";
type AlgId = 1 | 2;
type SideId = 3 | 4 | 5;

type AlgDraft = {
  factors: string;
  simplified: string;
  limit: string;
  pick: string | null;
  checked: boolean;
};

type SideDraft = {
  left: string;
  right: string;
  exists: "yes" | "no" | null;
  value: string;
  why: string;
  checked: boolean;
};

const TABS: { id: Tab; label: string }[] = [
  { id: 1, label: "1" },
  { id: 2, label: "2" },
  { id: 3, label: "3" },
  { id: 4, label: "4" },
  { id: 5, label: "5" },
  { id: "compare", label: "Compare" },
];

const EMPTY_ALG: AlgDraft = {
  factors: "",
  simplified: "",
  limit: "",
  pick: null,
  checked: false,
};
const EMPTY_SIDE: SideDraft = {
  left: "",
  right: "",
  exists: null,
  value: "",
  why: "",
  checked: false,
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function useDots(unlocked: boolean, reduced: boolean, key: string) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!unlocked) {
      setT(0);
      setPlaying(false);
      return;
    }
    if (reduced) {
      setT(1);
      setPlaying(false);
      return;
    }
    setT(0);
    setPlaying(true);
  }, [unlocked, reduced, key]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = 0;
    let stop = false;
    const tick = (now: number) => {
      if (stop) return;
      if (!last) last = now;
      const dt = (now - last) / 1000;
      last = now;
      setT((value) => {
        const next = value + dt / 4.8;
        return next >= 1 ? 1 : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      stop = true;
      cancelAnimationFrame(raf);
    };
  }, [playing]);

  useEffect(() => {
    if (t >= 1 && playing) setPlaying(false);
  }, [t, playing]);

  return {
    t: unlocked ? (reduced ? 1 : t) : 0,
    playing,
    replay() {
      if (reduced) return;
      setT(0);
      setPlaying(true);
    },
    pause() {
      setPlaying(false);
    },
  };
}

function MathBlock({ text, math }: { text: string; math: string }) {
  return (
    <div className="text-center">
      <p className="text-lg leading-snug sm:text-xl">{text}</p>
      <div className="mt-2">
        <Tex display className="text-2xl sm:text-3xl" math={math} />
      </div>
    </div>
  );
}

function Mark({ ok }: { ok: boolean }) {
  return (
    <span className="font-semibold" style={{ color: ok ? RIGHT : "#b45309" }}>
      {ok ? "Looks good." : "Not yet."}
    </span>
  );
}

export function CheckYourLimits() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<Tab>(1);
  const [alg, setAlg] = useState<Record<AlgId, AlgDraft>>({
    1: { ...EMPTY_ALG },
    2: { ...EMPTY_ALG },
  });
  const [sides, setSides] = useState<Record<SideId, SideDraft>>({
    3: { ...EMPTY_SIDE },
    4: { ...EMPTY_SIDE },
    5: { ...EMPTY_SIDE },
  });

  const unlocked =
    tab === "compare"
      ? false
      : tab <= 2
        ? alg[tab as AlgId].checked
        : sides[tab as SideId].checked;
  const dots = useDots(unlocked, reduced, String(tab));

  function resetAll() {
    setTab(1);
    setAlg({ 1: { ...EMPTY_ALG }, 2: { ...EMPTY_ALG } });
    setSides({
      3: { ...EMPTY_SIDE },
      4: { ...EMPTY_SIDE },
      5: { ...EMPTY_SIDE },
    });
  }

  return (
    <section
      className="ua-card ua-shadow-soft relative w-full min-w-0 overflow-x-hidden p-4 sm:p-6 md:col-span-2"
      style={{ background: CREAM }}
      aria-labelledby={`${uid}-heading`}
    >
      <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-emerald-800 uppercase">
        Today&apos;s problem · QOD Follow-Up
      </p>
      <h2
        id={`${uid}-heading`}
        className="mt-1 max-w-3xl pr-4 font-serif text-2xl sm:text-3xl"
        style={{ color: NAVY }}
      >
        Check Your Limits | QOD Follow-Up
      </h2>
      <p className="mt-2 text-base leading-snug" style={{ color: NAVY }}>
        You just finished today&apos;s five-question QOD. Use this 5- to 7-minute
        self-check to factor, read each graph, and decide whether a two-sided
        limit exists.
      </p>

      <div
        role="tablist"
        aria-label="QOD follow-up problems"
        className="mt-4 flex w-full min-w-0 flex-wrap gap-1"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`${HIT} px-3 text-sm`}
            style={{
              background: tab === item.id ? NAVY : "#F4F0E6",
              color: tab === item.id ? "#fff" : NAVY,
            }}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5" style={{ color: NAVY }}>
        {tab === 1 ? (
          <AlgebraProblem
            id={1}
            draft={alg[1]}
            setDraft={(next) => setAlg((cur) => ({ ...cur, 1: next }))}
            dots={dots}
            reduced={reduced}
          />
        ) : null}
        {tab === 2 ? (
          <AlgebraProblem
            id={2}
            draft={alg[2]}
            setDraft={(next) => setAlg((cur) => ({ ...cur, 2: next }))}
            dots={dots}
            reduced={reduced}
          />
        ) : null}
        {tab === 3 || tab === 4 || tab === 5 ? (
          <SidesProblem
            id={tab}
            draft={sides[tab]}
            setDraft={(next) =>
              setSides((cur) => ({ ...cur, [tab]: next }))
            }
            dots={dots}
            reduced={reduced}
          />
        ) : null}
        {tab === "compare" ? <ComparePanel /> : null}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          className={HIT}
          style={{ background: "#F4F0E6", color: NAVY }}
          onClick={resetAll}
        >
          Reset self-check
        </button>
      </div>
    </section>
  );
}

function AlgebraProblem({
  id,
  draft,
  setDraft,
  dots,
  reduced,
}: {
  id: AlgId;
  draft: AlgDraft;
  setDraft: (next: AlgDraft) => void;
  dots: { t: number; playing: boolean; replay: () => void; pause: () => void };
  reduced: boolean;
}) {
  const spec = ALGEBRA[id];
  const ready =
    Boolean(draft.factors.trim() || draft.pick) &&
    Boolean(draft.simplified.trim()) &&
    Boolean(draft.limit.trim());
  const factorMark = draft.checked
    ? gradeFactors(draft.factors, spec.offsets, draft.pick)
    : null;
  const simpMark = draft.checked
    ? gradeSimplified(draft.simplified, spec.simplified)
    : null;
  const limitOk = draft.checked ? gradeNumber(draft.limit, spec.limit) : null;

  function check() {
    if (!ready) return;
    setDraft({ ...draft, checked: true });
  }

  return (
    <div>
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        Problem {id}
      </p>
      {id === 1 ? (
        <MathBlock
          text="lim as x -> 3 of (x^2 - 9)/(x - 3)"
          math={String.raw`\lim_{x\to 3}\dfrac{x^{2}-9}{x-3}`}
        />
      ) : (
        <MathBlock
          text="lim as x -> 2 of (x^2 - 5x + 6)/(x - 2)"
          math={String.raw`\lim_{x\to 2}\dfrac{x^{2}-5x+6}{x-2}`}
        />
      )}
      <p className="mt-2 text-center text-sm text-stone-600">
        {id === 1
          ? "Graph: y = x + 3 for x != 3, with a hole at (3, 6)."
          : "Graph: y = x - 3 for x != 2, with a hole at (2, -1)."}
      </p>
      <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {id === 1 ? (
          <HoleLineGraph
            xMin={0}
            xMax={6}
            yMin={0}
            yMax={9}
            targetX={3}
            lineY={(x) => x + 3}
            hole={{ x: 3, y: 6 }}
            t={dots.t}
            showDots={draft.checked}
            ariaLabel="Line y equals x plus 3 with an outlined hole at 3 comma 6."
          />
        ) : (
          <HoleLineGraph
            xMin={-1}
            xMax={5}
            yMin={-5}
            yMax={3}
            targetX={2}
            lineY={(x) => x - 3}
            hole={{ x: 2, y: -1 }}
            t={dots.t}
            showDots={draft.checked}
            ariaLabel="Line y equals x minus 3 with an outlined hole at 2 comma negative 1."
          />
        )}
      </div>
      <MotionBar
        unlocked={draft.checked}
        reduced={reduced}
        playing={dots.playing}
        onReplay={dots.replay}
        onPause={dots.pause}
      />

      <label className="mt-4 block text-sm font-semibold">
        Factored numerator
        <input
          className={FIELD}
          value={draft.factors}
          autoComplete="off"
          spellCheck={false}
          placeholder="(x - ?)(x - ?)"
          onChange={(event) =>
            setDraft({ ...draft, factors: event.target.value, pick: null })
          }
        />
      </label>
      <label className="mt-3 block text-sm font-semibold">
        Simplified expression
        <input
          className={FIELD}
          value={draft.simplified}
          autoComplete="off"
          spellCheck={false}
          placeholder="x + ? or x - ?"
          onChange={(event) =>
            setDraft({ ...draft, simplified: event.target.value })
          }
        />
      </label>
      <label className="mt-3 block text-sm font-semibold">
        Limit
        <input
          className={FIELD}
          inputMode="decimal"
          value={draft.limit}
          autoComplete="off"
          onChange={(event) => setDraft({ ...draft, limit: event.target.value })}
        />
      </label>

      <button
        type="button"
        className={`${HIT} mt-4 w-full sm:w-auto`}
        style={{ background: NAVY, color: "#fff" }}
        disabled={!ready}
        onClick={check}
      >
        Check my work
      </button>
      {!ready ? (
        <p className="mt-2 text-sm text-stone-500">
          Fill in the factorization, the simplified expression, and the limit
          first.
        </p>
      ) : null}

      {factorMark === "choose" || simpMark === "choose" ? (
        <div className="mt-4 rounded-2xl bg-[#EAF3ED] p-4">
          {factorMark === "choose" ? (
            <>
              <p className="font-semibold">
                We could not safely read that factorization. Tap the matching
                one.
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {spec.factorChoices.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    className={HIT}
                    style={{
                      background: draft.pick === choice ? NAVY : "#fff",
                      color: draft.pick === choice ? "#fff" : NAVY,
                    }}
                    onClick={() =>
                      setDraft({ ...draft, pick: choice, checked: true })
                    }
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </>
          ) : null}
          {simpMark === "choose" ? (
            <p className="mt-3">
              Write the simplified expression as a line like x + 3 or x - 3 so
              we can check it without guessing.
            </p>
          ) : null}
        </div>
      ) : null}

      {draft.checked && factorMark !== "choose" && simpMark !== "choose" ? (
        <div className="mt-4 space-y-3" aria-live="polite">
          <p>
            <Mark ok={factorMark === "correct"} /> Factoring:{" "}
            {factorMark === "correct"
              ? id === 1
                ? "Yes — (x - 3)(x + 3), in either order."
                : "Yes — (x - 2)(x - 3), in either order."
              : id === 1
                ? "x^2 - 9 is a difference of squares. Check the two linear factors."
                : "x^2 - 5x + 6 should split into two linear factors that multiply back to that quadratic."}
          </p>
          <p>
            <Mark ok={simpMark === "correct"} /> Simplified expression:{" "}
            {simpMark === "correct"
              ? id === 1
                ? "The leftover line is x + 3."
                : "The leftover line is x - 3."
              : "After the matching factor cancels, a simple line should remain."}
          </p>
          <p>
            <Mark ok={Boolean(limitOk)} /> Limit:{" "}
            {limitOk
              ? id === 1
                ? "The y-value at the hole is 6."
                : "The y-value at the hole is -1."
              : "Read the open circle. That height is what the function approaches."}
          </p>
          <HelpDetails
            hint={
              id === 1
                ? "Factor x^2 - 9, cancel the (x - 3) that made the denominator 0, then plug x = 3 into what remains."
                : "Factor x^2 - 5x + 6, cancel the (x - 2) that made the denominator 0, then plug x = 2 into what remains."
            }
            steps={
              id === 1
                ? [
                    "Factoring: (x - 3)(x + 3).",
                    "Simplified expression: x + 3.",
                    "The original function is undefined at x = 3.",
                    "Graph: y = x + 3 for x != 3, with a hole at (3, 6).",
                    "Limit: 6.",
                  ]
                : [
                    "Factoring: (x - 2)(x - 3).",
                    "Simplified expression: x - 3.",
                    "The original function is undefined at x = 2.",
                    "Graph: y = x - 3 for x != 2, with a hole at (2, -1).",
                    "Limit: -1.",
                  ]
            }
          />
        </div>
      ) : null}
    </div>
  );
}

function SidesProblem({
  id,
  draft,
  setDraft,
  dots,
  reduced,
}: {
  id: SideId;
  draft: SideDraft;
  setDraft: (next: SideDraft) => void;
  dots: { t: number; playing: boolean; replay: () => void; pause: () => void };
  reduced: boolean;
}) {
  const spec = SIDES[id];
  const needsValue = draft.exists === "yes";
  const ready =
    Boolean(draft.left.trim()) &&
    Boolean(draft.right.trim()) &&
    draft.exists != null &&
    (!needsValue || Boolean(draft.value.trim()));

  const leftOk = draft.checked ? gradeNumber(draft.left, spec.left) : null;
  const rightOk = draft.checked ? gradeNumber(draft.right, spec.right) : null;
  const existsOk = draft.checked
    ? gradeExists(draft.exists, spec.exists)
    : null;
  const valueOk =
    draft.checked && spec.exists && draft.exists === "yes"
      ? gradeNumber(draft.value, spec.value)
      : null;

  function check() {
    if (!ready) return;
    setDraft({ ...draft, checked: true });
  }

  return (
    <div>
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        Problem {id}
      </p>
      {id === 3 ? (
        <>
          <MathBlock
            text="lim as x -> 1 of g(x)"
            math={String.raw`\lim_{x\to 1}g(x)`}
          />
          <p className="mt-2 text-center text-sm text-stone-600">
            g(x) = x + 1 for x &lt; 1; g(1) = 0; g(x) = x - 2 for x &gt; 1.
            Open points: (1, 2) and (1, -1). Filled point: (1, 0).
          </p>
        </>
      ) : null}
      {id === 4 ? (
        <>
          <MathBlock
            text="lim as x -> -2 of h(x)"
            math={String.raw`\lim_{x\to -2}h(x)`}
          />
          <p className="mt-2 text-center text-sm text-stone-600">
            h(x) = 1 - x for x != -2; h(-2) = -1. Open point: (-2, 3). Filled
            point: (-2, -1).
          </p>
        </>
      ) : null}
      {id === 5 ? (
        <>
          <MathBlock
            text="lim as x -> 1 of p(x), where p(x) = |x - 1| + 1."
            math={String.raw`\lim_{x\to 1}p(x),\quad p(x)=|x-1|+1`}
          />
          <p className="mt-2 text-center text-sm text-stone-600">
            V-shaped graph with a filled vertex at (1, 1).
          </p>
        </>
      ) : null}

      <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {id === 3 ? (
          <PieceGraph
            xMin={-1}
            xMax={3}
            yMin={-3}
            yMax={4}
            targetX={1}
            leftY={(x) => x + 1}
            rightY={(x) => x - 2}
            opens={[
              { x: 1, y: 2 },
              { x: 1, y: -1 },
            ]}
            filled={{ x: 1, y: 0 }}
            t={dots.t}
            showDots={draft.checked}
            ariaLabel="Piecewise graph of g with open points at 1 comma 2 and 1 comma negative 1, and a filled point at 1 comma 0."
          />
        ) : null}
        {id === 4 ? (
          <HoleLineGraph
            xMin={-5}
            xMax={1}
            yMin={-3}
            yMax={6}
            targetX={-2}
            lineY={(x) => 1 - x}
            hole={{ x: -2, y: 3 }}
            filled={{ x: -2, y: -1 }}
            t={dots.t}
            showDots={draft.checked}
            ariaLabel="Line y equals 1 minus x with an open point at negative 2 comma 3 and a filled point at negative 2 comma negative 1."
          />
        ) : null}
        {id === 5 ? (
          <PieceGraph
            xMin={-1}
            xMax={3}
            yMin={0}
            yMax={4}
            targetX={1}
            leftY={(x) => 2 - x}
            rightY={(x) => x}
            joinAtTarget
            filled={{ x: 1, y: 1 }}
            t={dots.t}
            showDots={draft.checked}
            ariaLabel="V-shaped graph of absolute value of x minus 1, plus 1, with a filled vertex at 1 comma 1."
          />
        ) : null}
      </div>
      <MotionBar
        unlocked={draft.checked}
        reduced={reduced}
        playing={dots.playing}
        onReplay={dots.replay}
        onPause={dots.pause}
      />

      <label className="mt-4 block text-sm font-semibold">
        Left-hand limit
        <input
          className={FIELD}
          inputMode="decimal"
          value={draft.left}
          autoComplete="off"
          onChange={(event) => setDraft({ ...draft, left: event.target.value })}
        />
      </label>
      <label className="mt-3 block text-sm font-semibold">
        Right-hand limit
        <input
          className={FIELD}
          inputMode="decimal"
          value={draft.right}
          autoComplete="off"
          onChange={(event) =>
            setDraft({ ...draft, right: event.target.value })
          }
        />
      </label>
      <p className="mt-3 text-sm font-semibold">Does the two-sided limit exist?</p>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          className={HIT}
          style={{
            background: draft.exists === "yes" ? NAVY : "#F4F0E6",
            color: draft.exists === "yes" ? "#fff" : NAVY,
          }}
          onClick={() => setDraft({ ...draft, exists: "yes" })}
        >
          Yes, it exists
        </button>
        <button
          type="button"
          className={HIT}
          style={{
            background: draft.exists === "no" ? NAVY : "#F4F0E6",
            color: draft.exists === "no" ? "#fff" : NAVY,
          }}
          onClick={() => setDraft({ ...draft, exists: "no", value: "" })}
        >
          No, it does not exist
        </button>
      </div>
      {needsValue ? (
        <label className="mt-3 block text-sm font-semibold">
          Two-sided limit
          <input
            className={FIELD}
            inputMode="decimal"
            value={draft.value}
            autoComplete="off"
            onChange={(event) =>
              setDraft({ ...draft, value: event.target.value })
            }
          />
        </label>
      ) : null}
      <label className="mt-3 block text-sm font-semibold">
        Short explanation (not auto-graded)
        <textarea
          className={`${FIELD} min-h-24 py-3`}
          value={draft.why}
          onChange={(event) => setDraft({ ...draft, why: event.target.value })}
        />
      </label>

      <button
        type="button"
        className={`${HIT} mt-4 w-full sm:w-auto`}
        style={{ background: NAVY, color: "#fff" }}
        disabled={!ready}
        onClick={check}
      >
        Check my work
      </button>
      {!ready ? (
        <p className="mt-2 text-sm text-stone-500">
          Enter both one-sided limits and choose whether the two-sided limit
          exists.
        </p>
      ) : null}

      {draft.checked ? (
        <div className="mt-4 space-y-3" aria-live="polite">
          <p>
            <Mark ok={Boolean(leftOk)} /> Left-hand limit:{" "}
            {leftOk
              ? `Yes, ${spec.left}.`
              : id === 3
                ? "From the left, g follows y = x + 1. Read the open circle at (1, 2)."
                : id === 4
                  ? "From the left, h follows y = 1 - x. Read the open circle at (-2, 3)."
                  : "From the left, the V approaches the filled vertex at (1, 1)."}
          </p>
          <p>
            <Mark ok={Boolean(rightOk)} /> Right-hand limit:{" "}
            {rightOk
              ? `Yes, ${spec.right}.`
              : id === 3
                ? "From the right, g follows y = x - 2. Read the open circle at (1, -1)."
                : id === 4
                  ? "From the right, h follows the same line y = 1 - x, so it matches the left."
                  : "From the right, the V also approaches the filled vertex at (1, 1)."}
          </p>
          <p>
            <Mark ok={Boolean(existsOk)} /> Two-sided limit:{" "}
            {existsOk
              ? spec.exists
                ? `It exists and equals ${spec.value}.`
                : "It does not exist, because the two sides do not agree."
              : spec.exists
                ? "Both sides approach the same height, so the two-sided limit exists."
                : "The two sides must agree. If they do not, the two-sided limit does not exist."}
          </p>
          {valueOk === false ? (
            <p>
              <Mark ok={false} /> The two-sided value should be the common
              approaching height.
            </p>
          ) : null}

          <div className="rounded-2xl bg-[#EAF3ED] p-4">
            <p className="font-semibold">Model explanation</p>
            <p className="mt-2 leading-snug">{MODEL[id]}</p>
            <p className="mt-3 font-semibold">Self-check</p>
            <ul className="mt-1 list-disc pl-5 leading-snug">
              {CHECKS[id].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <HelpDetails hint={HINTS[id]} steps={STEPS[id]} />
        </div>
      ) : null}
    </div>
  );
}

const MODEL: Record<SideId, string> = {
  3: "From the left, the open circle is at (1, 2), so the left-hand limit is 2. From the right, the open circle is at (1, -1), so the right-hand limit is -1. Those heights do not match, so the two-sided limit does not exist. The filled point (1, 0) is g(1), which does not decide the limit.",
  4: "From both sides, the graph follows y = 1 - x and approaches the open circle at (-2, 3). The left-hand and right-hand limits are both 3, so the two-sided limit is 3. The filled point (-2, -1) is h(-2), which is different from the limit.",
  5: "The V has a filled vertex at (1, 1). From the left and from the right, p(x) approaches 1, so the two-sided limit is 1. That is also p(1). A corner does not stop the limit from existing when the heights agree.",
};

const CHECKS: Record<SideId, string[]> = {
  3: [
    "Did I read the open circles for the approach heights?",
    "Did I treat the filled point as the function value, not the limit?",
    "Did I require both sides to match for a two-sided limit?",
  ],
  4: [
    "Did both sides approach height 3?",
    "Did I keep h(-2) = -1 separate from the limit?",
  ],
  5: [
    "Did both sides approach 1?",
    "Did I remember that a corner can still have a limit?",
  ],
};

const HINTS: Record<SideId, string> = {
  3: "One-sided limits come from the open circles, not from the filled point. If those two heights disagree, there is no two-sided limit.",
  4: "Follow the line y = 1 - x toward x = -2 from each side. The filled point is the function value, not the approaching height.",
  5: "A sharp corner is still a limit if the y-values from both sides settle at the same height.",
};

const STEPS: Record<SideId, string[]> = {
  3: [
    "Left-hand limit: 2.",
    "Right-hand limit: -1.",
    "Two-sided limit: does not exist.",
    "g(1) = 0 is the filled point, not the limit.",
  ],
  4: [
    "Left-hand limit: 3.",
    "Right-hand limit: 3.",
    "Two-sided limit: 3.",
    "Function value h(-2): -1.",
  ],
  5: [
    "Left-hand limit: 1.",
    "Right-hand limit: 1.",
    "Two-sided limit: 1.",
    "Function value p(1): 1.",
    "The corner does not prevent the limit from existing.",
  ],
};

function ComparePanel() {
  return (
    <div>
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        Compare 3, 4, and 5
      </p>
      <ul className="mt-3 space-y-3 text-lg leading-snug">
        <li>
          <span className="font-semibold">Problem 3:</span> different
          approaching heights, so no two-sided limit.
        </li>
        <li>
          <span className="font-semibold">Problem 4:</span> same approaching
          height, even though the filled point differs.
        </li>
        <li>
          <span className="font-semibold">Problem 5:</span> same approaching
          height, even though the graph has a corner.
        </li>
      </ul>
    </div>
  );
}

function HelpDetails({ hint, steps }: { hint: string; steps: string[] }) {
  return (
    <div className="space-y-2">
      <details className="rounded-2xl border border-stone-200 bg-white p-3">
        <summary className={`${HIT} w-full justify-between px-2`}>
          Hint
        </summary>
        <p className="mt-2 leading-snug">{hint}</p>
      </details>
      <details className="rounded-2xl border border-stone-200 bg-white p-3">
        <summary className={`${HIT} w-full justify-between px-2`}>
          Step-by-step solution
        </summary>
        <ol className="mt-2 list-decimal pl-5 leading-snug">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}

function MotionBar({
  unlocked,
  reduced,
  playing,
  onReplay,
  onPause,
}: {
  unlocked: boolean;
  reduced: boolean;
  playing: boolean;
  onReplay: () => void;
  onPause: () => void;
}) {
  if (!unlocked) {
    return (
      <p className="mt-2 text-center text-sm text-stone-500">
        After you check, you can watch a dot approach from each side.
      </p>
    );
  }
  if (reduced) {
    return (
      <p className="mt-2 text-center text-sm text-stone-500">
        Motion is reduced, so the dots stay near the target x-value. Blue is
        from the left. Green is from the right.
      </p>
    );
  }
  return (
    <div className="mt-2">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className={HIT}
          style={{ background: NAVY, color: "#fff" }}
          onClick={onReplay}
        >
          Replay
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: "#F4F0E6", color: NAVY }}
          disabled={!playing}
          onClick={onPause}
        >
          Pause
        </button>
      </div>
      <p className="mt-2 text-center text-sm text-stone-500">
        Blue comes from the left. Green comes from the right.
      </p>
    </div>
  );
}

const VW = 640;
const VH = 300;
const PAD = { l: 52, r: 22, t: 22, b: 42 };

function toX(x: number, xMin: number, xMax: number) {
  return PAD.l + ((x - xMin) / (xMax - xMin)) * (VW - PAD.l - PAD.r);
}
function toY(y: number, yMin: number, yMax: number) {
  return PAD.t + ((yMax - y) / (yMax - yMin)) * (VH - PAD.t - PAD.b);
}
function intTicks(min: number, max: number) {
  const out: number[] = [];
  for (let n = Math.ceil(min); n <= Math.floor(max); n += 1) out.push(n);
  return out;
}

function Axes({
  xMin,
  xMax,
  yMin,
  yMax,
  ariaLabel,
  children,
}: {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  ariaLabel: string;
  children: React.ReactNode;
}) {
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
      <line
        x1={PAD.l}
        x2={PAD.l}
        y1={PAD.t}
        y2={VH - PAD.b}
        stroke={NAVY}
        strokeWidth="1.6"
      />
      <line
        x1={PAD.l}
        x2={VW - PAD.r}
        y1={VH - PAD.b}
        y2={VH - PAD.b}
        stroke={NAVY}
        strokeWidth="1.6"
      />
      {intTicks(xMin, xMax).map((x) => (
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
      {intTicks(yMin, yMax).map((y) => (
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
      {children}
    </svg>
  );
}

function OpenDot({
  x,
  y,
  xMin,
  xMax,
  yMin,
  yMax,
}: {
  x: number;
  y: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}) {
  return (
    <circle
      cx={toX(x, xMin, xMax)}
      cy={toY(y, yMin, yMax)}
      r="9"
      fill={CREAM}
      stroke={NAVY}
      strokeWidth="2.8"
    />
  );
}

function FilledDot({
  x,
  y,
  xMin,
  xMax,
  yMin,
  yMax,
}: {
  x: number;
  y: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}) {
  return (
    <circle
      cx={toX(x, xMin, xMax)}
      cy={toY(y, yMin, yMax)}
      r="8"
      fill={NAVY}
      stroke="#fff"
      strokeWidth="2"
    />
  );
}

function ApproachDots({
  targetX,
  t,
  leftY,
  rightY,
  xMin,
  xMax,
  yMin,
  yMax,
}: {
  targetX: number;
  t: number;
  leftY: (x: number) => number;
  rightY: (x: number) => number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}) {
  const reach = Math.min(1.7, (xMax - xMin) * 0.28);
  const gap = 0.08;
  const xL = targetX - reach * (1 - t) - gap * t;
  const xR = targetX + reach * (1 - t) + gap * t;
  return (
    <>
      <circle
        cx={toX(xL, xMin, xMax)}
        cy={toY(leftY(xL), yMin, yMax)}
        r="8"
        fill={LEFT}
        stroke="#fff"
        strokeWidth="2"
      />
      <circle
        cx={toX(xR, xMin, xMax)}
        cy={toY(rightY(xR), yMin, yMax)}
        r="8"
        fill={RIGHT}
        stroke="#fff"
        strokeWidth="2"
      />
    </>
  );
}

function HoleLineGraph({
  xMin,
  xMax,
  yMin,
  yMax,
  targetX,
  lineY,
  hole,
  filled,
  t,
  showDots,
  ariaLabel,
}: {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  targetX: number;
  lineY: (x: number) => number;
  hole: { x: number; y: number };
  filled?: { x: number; y: number };
  t: number;
  showDots: boolean;
  ariaLabel: string;
}) {
  const gap = 0.08;
  return (
    <Axes
      xMin={xMin}
      xMax={xMax}
      yMin={yMin}
      yMax={yMax}
      ariaLabel={ariaLabel}
    >
      <line
        x1={toX(xMin, xMin, xMax)}
        y1={toY(lineY(xMin), yMin, yMax)}
        x2={toX(targetX - gap, xMin, xMax)}
        y2={toY(lineY(targetX - gap), yMin, yMax)}
        stroke={NAVY}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <line
        x1={toX(targetX + gap, xMin, xMax)}
        y1={toY(lineY(targetX + gap), yMin, yMax)}
        x2={toX(xMax, xMin, xMax)}
        y2={toY(lineY(xMax), yMin, yMax)}
        stroke={NAVY}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <OpenDot x={hole.x} y={hole.y} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} />
      {filled ? (
        <FilledDot
          x={filled.x}
          y={filled.y}
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
        />
      ) : null}
      {showDots ? (
        <ApproachDots
          targetX={targetX}
          t={t}
          leftY={lineY}
          rightY={lineY}
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
        />
      ) : null}
    </Axes>
  );
}

function PieceGraph({
  xMin,
  xMax,
  yMin,
  yMax,
  targetX,
  leftY,
  rightY,
  opens,
  filled,
  joinAtTarget,
  t,
  showDots,
  ariaLabel,
}: {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  targetX: number;
  leftY: (x: number) => number;
  rightY: (x: number) => number;
  opens?: { x: number; y: number }[];
  filled?: { x: number; y: number };
  joinAtTarget?: boolean;
  t: number;
  showDots: boolean;
  ariaLabel: string;
}) {
  const gap = joinAtTarget ? 0 : 0.08;
  const leftEnd = targetX - gap;
  const rightStart = targetX + gap;
  return (
    <Axes
      xMin={xMin}
      xMax={xMax}
      yMin={yMin}
      yMax={yMax}
      ariaLabel={ariaLabel}
    >
      <line
        x1={toX(xMin, xMin, xMax)}
        y1={toY(leftY(xMin), yMin, yMax)}
        x2={toX(leftEnd, xMin, xMax)}
        y2={toY(leftY(leftEnd), yMin, yMax)}
        stroke={NAVY}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <line
        x1={toX(rightStart, xMin, xMax)}
        y1={toY(rightY(rightStart), yMin, yMax)}
        x2={toX(xMax, xMin, xMax)}
        y2={toY(rightY(xMax), yMin, yMax)}
        stroke={NAVY}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {opens?.map((point) => (
        <OpenDot
          key={`${point.x},${point.y}`}
          x={point.x}
          y={point.y}
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
        />
      ))}
      {filled ? (
        <FilledDot
          x={filled.x}
          y={filled.y}
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
        />
      ) : null}
      {showDots ? (
        <ApproachDots
          targetX={targetX}
          t={t}
          leftY={leftY}
          rightY={rightY}
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
        />
      ) : null}
    </Axes>
  );
}
