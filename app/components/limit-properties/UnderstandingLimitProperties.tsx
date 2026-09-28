"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { NAVY } from "@/app/components/limits/ExploringLimitsGraphs";
import { Tex } from "@/app/components/limits/Tex";
import {
  MIXED,
  PRACTICE,
  RULES,
  RULE_IDS,
  SHARED,
  INTRO_GRAPH,
  approachRows,
  gradeNumber,
  ruleById,
  type GraphSpec,
  type PracticeItem,
  type Rule,
  type RuleId,
  type Step,
} from "@/app/lib/limitProperties/content";
import {
  ApproachSliders,
  LimitGraph,
  ValueTable,
} from "./LimitGraph";

const HIT =
  "inline-flex min-h-12 items-center justify-center rounded-xl px-4 text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";
const CREAM = "#FFFEFB";
const STORE = "ua-limit-properties-v1";

type Mode = "explore" | "build" | "next" | "graph" | "practice" | "mixed";
type View = "all" | "symbolic" | "table" | "graph";

type Stats = {
  correct: number;
  attempts: number;
  streak: number;
  mastered: RuleId[];
  needs: RuleId[];
  quick: Partial<Record<RuleId, number>>;
};

const EMPTY_STATS: Stats = {
  correct: 0,
  attempts: 0,
  streak: 0,
  mastered: [],
  needs: [],
  quick: {},
};

const MODES: { id: Mode; label: string }[] = [
  { id: "explore", label: "Explore" },
  { id: "build", label: "Build the Rule" },
  { id: "next", label: "What Happens Next?" },
  { id: "graph", label: "Graph It" },
  { id: "practice", label: "Practice" },
  { id: "mixed", label: "Which Law?" },
];

function MathLine({
  math,
  text,
  large,
}: {
  math: string;
  text: string;
  large?: boolean;
}) {
  return (
    <div className="px-1 py-3 text-center">
      <span className="sr-only">{text}</span>
      <Tex
        display
        className={large ? "text-4xl sm:text-5xl" : "text-xl sm:text-3xl"}
        math={math}
      />
    </div>
  );
}

function useApproach(spec: GraphSpec) {
  const gap = Math.max(0.05, (spec.xMax - spec.xMin) * 0.04);
  const [leftX, setLeftX] = useState(spec.c - gap * 4);
  const [rightX, setRightX] = useState(spec.c + gap * 4);
  useEffect(() => {
    const g = Math.max(0.05, (spec.xMax - spec.xMin) * 0.04);
    setLeftX(Math.max(spec.xMin, spec.c - g * 4));
    setRightX(Math.min(spec.xMax, spec.c + g * 4));
  }, [spec.c, spec.xMin, spec.xMax]);
  return { leftX, rightX, setLeftX, setRightX };
}

function ViewToggle({
  view,
  setView,
}: {
  view: View;
  setView: (v: View) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Representation">
      {(
        [
          ["all", "All three"],
          ["symbolic", "Symbolic"],
          ["table", "Table"],
          ["graph", "Graph"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          className={HIT}
          style={{
            background: view === id ? NAVY : "#F4F0E6",
            color: view === id ? "#fff" : NAVY,
          }}
          onClick={() => setView(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function StepReveal({
  steps,
  step,
  large,
  hideAnswer,
}: {
  steps: Step[];
  step: number;
  large?: boolean;
  hideAnswer?: boolean;
}) {
  const shown = hideAnswer ? 0 : step;
  return (
    <div className="space-y-3">
      {steps.slice(0, Math.max(1, shown + 1)).map((item, i) => (
        <MathLine key={item.math} math={item.math} text={item.text} large={large} />
      ))}
    </div>
  );
}

export function UnderstandingLimitProperties() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [mode, setMode] = useState<Mode>("explore");
  const [ruleId, setRuleId] = useState<RuleId>("sum");
  const [board, setBoard] = useState(false);
  const [view, setView] = useState<View>("all");
  const [showCoords, setShowCoords] = useState(true);
  const [showTable, setShowTable] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [hideAnswer, setHideAnswer] = useState(false);
  const [step, setStep] = useState(0);
  const [example, setExample] = useState<1 | 2>(1);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [quickQ, setQuickQ] = useState(0);
  const [practiceLevel, setPracticeLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [practiceIx, setPracticeIx] = useState(0);
  const [mixedIx, setMixedIx] = useState(0);

  const rule = ruleById(ruleId);
  const steps = example === 1 ? rule.shared.steps : rule.second.steps;
  const spec = rule.shared.graph;

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE);
      if (raw) setStats({ ...EMPTY_STATS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    sessionStorage.setItem(STORE, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    setStep(showAnswers ? steps.length - 1 : 0);
    setHideAnswer(false);
    setQuickQ(0);
  }, [ruleId, example, mode, showAnswers, steps.length]);

  function resetProgress() {
    setStats(EMPTY_STATS);
    sessionStorage.removeItem(STORE);
  }

  return (
    <section
      className="ua-card ua-shadow-soft relative w-full min-w-0 overflow-x-hidden p-4 sm:p-6 md:col-span-2"
      style={{ background: CREAM, color: NAVY }}
      aria-labelledby={`${uid}-heading`}
      id="limit-properties"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {board ? null : (
            <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-emerald-800 uppercase">
              Limit laws · Calculus Honors
            </p>
          )}
          <h2
            id={`${uid}-heading`}
            className={`mt-1 font-serif ${board ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"}`}
          >
            Understanding Limit Properties
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={HIT}
            style={{ background: board ? NAVY : "#F4F0E6", color: board ? "#fff" : NAVY }}
            onClick={() => setBoard((v) => !v)}
          >
            Board Mode
          </button>
        </div>
      </div>

      {board ? null : (
        <>
          <p className="mt-2 max-w-3xl text-base leading-snug">
            Limit laws let us split a complicated limit into simpler ones we already
            know. Watch these two functions as <Tex math={String.raw`x\to 2`} />.
          </p>
          <div className="mt-3 overflow-x-auto">
            <MathLine
              math={String.raw`f(x)=x+1,\quad g(x)=x^{2}`}
              text="f(x)=x+1, g(x)=x^2"
            />
            <div className="mt-2">
              <MathLine
                math={String.raw`\lim_{x\to 2}f(x)=3,\quad\lim_{x\to 2}g(x)=4`}
                text="lim f = 3, lim g = 4 as x→2"
              />
            </div>
          </div>
        </>
      )}

      {board ? null : (
        <div
          className="mt-4 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Lesson modes"
        >
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              className={HIT}
              style={{
                background: mode === item.id ? NAVY : "#F4F0E6",
                color: mode === item.id ? "#fff" : NAVY,
              }}
              onClick={() => setMode(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <RulePicker ruleId={ruleId} setRuleId={setRuleId} compact={board} />

      {mode === "explore" || board ? (
        <Explore
          rule={rule}
          spec={spec}
          steps={steps}
          step={step}
          setStep={setStep}
          example={example}
          setExample={setExample}
          view={view}
          setView={setView}
          showCoords={showCoords}
          showTable={showTable}
          board={board}
          hideAnswer={hideAnswer}
          setHideAnswer={setHideAnswer}
          showAnswers={showAnswers}
          quickQ={quickQ}
          setQuickQ={setQuickQ}
          stats={stats}
          setStats={setStats}
        />
      ) : null}
      {!board && mode === "build" ? <BuildRule rule={rule} /> : null}
      {!board && mode === "next" ? <WhatNext rule={rule} /> : null}
      {!board && mode === "graph" ? (
        <GraphIt
          spec={spec}
          rule={rule}
          showCoords={showCoords}
          setShowCoords={setShowCoords}
          showTable={showTable}
        />
      ) : null}
      {!board && mode === "practice" ? (
        <Practice
          level={practiceLevel}
          setLevel={setPracticeLevel}
          index={practiceIx}
          setIndex={setPracticeIx}
          stats={stats}
          setStats={setStats}
        />
      ) : null}
      {!board && mode === "mixed" ? (
        <MixedChallenge index={mixedIx} setIndex={setMixedIx} />
      ) : null}

      {board ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className={HIT}
            style={{ background: "#F4F0E6", color: NAVY }}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Previous Step
          </button>
          <button
            type="button"
            className={HIT}
            style={{ background: NAVY, color: "#fff" }}
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          >
            Next Step
          </button>
          <button
            type="button"
            className={HIT}
            style={{ background: "#F4F0E6", color: NAVY }}
            onClick={() => setHideAnswer((v) => !v)}
          >
            {hideAnswer ? "Show Work" : "Hide Answer"}
          </button>
          <button
            type="button"
            className={HIT}
            style={{ background: "#F4F0E6", color: NAVY }}
            onClick={() => {
              setStep(0);
              setHideAnswer(false);
              setExample(1);
            }}
          >
            Reset Example
          </button>
        </div>
      ) : (
        <TeacherPanel
          ruleId={ruleId}
          setRuleId={setRuleId}
          setMode={setMode}
          setExample={setExample}
          setBoard={setBoard}
          showAnswers={showAnswers}
          setShowAnswers={setShowAnswers}
          showCoords={showCoords}
          setShowCoords={setShowCoords}
          showTable={showTable}
          setShowTable={setShowTable}
          setPracticeIx={setPracticeIx}
          resetProgress={resetProgress}
          stats={stats}
        />
      )}
    </section>
  );
}

function RulePicker({
  ruleId,
  setRuleId,
  compact,
}: {
  ruleId: RuleId;
  setRuleId: (id: RuleId) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`mt-4 flex flex-wrap gap-2 ${compact ? "" : ""}`}
      role="group"
      aria-label="Limit property"
    >
      {RULES.map((rule) => (
        <button
          key={rule.id}
          type="button"
          className={HIT}
          style={{
            background: ruleId === rule.id ? NAVY : "#fff",
            color: ruleId === rule.id ? "#fff" : NAVY,
            border: "1px solid rgba(27,42,74,0.18)",
          }}
          onClick={() => setRuleId(rule.id)}
        >
          {rule.name}
        </button>
      ))}
    </div>
  );
}

function Explore({
  rule,
  spec,
  steps,
  step,
  setStep,
  example,
  setExample,
  view,
  setView,
  showCoords,
  showTable,
  board,
  hideAnswer,
  setHideAnswer,
  showAnswers,
  quickQ,
  setQuickQ,
  stats,
  setStats,
}: {
  rule: Rule;
  spec: GraphSpec;
  steps: Step[];
  step: number;
  setStep: (n: number | ((s: number) => number)) => void;
  example: 1 | 2;
  setExample: (n: 1 | 2) => void;
  view: View;
  setView: (v: View) => void;
  showCoords: boolean;
  showTable: boolean;
  board: boolean;
  hideAnswer: boolean;
  setHideAnswer: (v: boolean | ((b: boolean) => boolean)) => void;
  showAnswers: boolean;
  quickQ: number;
  setQuickQ: (n: number) => void;
  stats: Stats;
  setStats: (s: Stats) => void;
}) {
  const approach = useApproach(spec);
  const rows = approachRows(spec.c, spec.curves[0].fn);
  const showSym = view === "all" || view === "symbolic";
  const showG = example === 1 && (view === "all" || view === "graph");
  const showT = example === 1 && showTable && (view === "all" || view === "table");

  return (
    <div className="mt-5 space-y-5">
      {board ? null : <CoreIntro showCoords={showCoords} />}

      <div>
        <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
          {rule.name}
        </p>
        <p className={`mt-1 ${board ? "text-2xl" : "text-lg"}`}>
          How we say it: {rule.say}
        </p>
        {showSym ? (
          <div className="mt-4">
            <MathLine math={rule.formula} text={rule.formulaText} large={board} />
            {rule.note ? <p className="mt-2 text-center text-sm">{rule.note}</p> : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={HIT}
          style={{ background: example === 1 ? NAVY : "#F4F0E6", color: example === 1 ? "#fff" : NAVY }}
          onClick={() => setExample(1)}
        >
          Shared example
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: example === 2 ? NAVY : "#F4F0E6", color: example === 2 ? "#fff" : NAVY }}
          onClick={() => setExample(2)}
        >
          Second example
        </button>
      </div>

      {board ? null : <ViewToggle view={view} setView={setView} />}

      {showSym ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <StepReveal steps={steps} step={step} large={board} hideAnswer={hideAnswer} />
          {board ? null : (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className={HIT}
                style={{ background: NAVY, color: "#fff" }}
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              >
                Next Step
              </button>
              <button
                type="button"
                className={HIT}
                style={{ background: "#F4F0E6", color: NAVY }}
                onClick={() => setStep(0)}
              >
                Reset Example
              </button>
            </div>
          )}
        </div>
      ) : null}

      {rule.id === "composite" && example === 1 && showSym ? (
        <ol className="mx-auto max-w-sm space-y-2 text-center text-lg">
          <li>
            <Tex math={String.raw`x\to 2`} />
          </li>
          <li aria-hidden>↓</li>
          <li>
            <Tex math={String.raw`f(x)\to 3`} />
          </li>
          <li aria-hidden>↓</li>
          <li>
            <Tex math={String.raw`g(3)=3^{2}=9`} />
          </li>
        </ol>
      ) : null}

      {example === 1 && showG ? (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <LimitGraph
            spec={spec}
            leftX={approach.leftX}
            rightX={approach.rightX}
            showCoords={showCoords}
            tall={board}
            ariaLabel={`${rule.name} graph`}
          />
        </div>
      ) : null}
      {example === 1 ? (
        <ApproachSliders
          spec={spec}
          leftX={approach.leftX}
          rightX={approach.rightX}
          onLeft={approach.setLeftX}
          onRight={approach.setRightX}
        />
      ) : null}
      {example === 1 && showT ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-3">
          <p className="mb-2 text-center text-sm text-stone-500">
            x-values approaching {spec.c} from both sides
          </p>
          <ValueTable rows={rows} />
        </div>
      ) : null}

      {example === 1 ? (
        <p className={`${board ? "text-xl" : "text-base"}`}>
          Notice that the graph approaches the same y-value from both
          directions, so the two-sided limit exists.
        </p>
      ) : null}

      {board ? null : (
        <QuickCheck
          rule={rule}
          q={quickQ}
          setQ={setQuickQ}
          stats={stats}
          setStats={setStats}
          reveal={showAnswers}
        />
      )}
    </div>
  );
}

function CoreIntro({ showCoords }: { showCoords: boolean }) {
  const approach = useApproach(INTRO_GRAPH);
  return (
    <details className="rounded-2xl border border-stone-200 bg-white p-4">
      <summary className="cursor-pointer text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        Shared functions · drag x toward 2
      </summary>
      <div className="mt-3 flex flex-wrap justify-center gap-6">
        <MathLine math={SHARED.fMath} text={SHARED.fText} />
        <MathLine math={SHARED.gMath} text={SHARED.gText} />
      </div>
      <div className="mt-3 text-center">
        <MathLine
          math={String.raw`\lim_{x\to 2}f(x)=3,\quad\lim_{x\to 2}g(x)=4`}
          text="As x→2, lim f = 3 and lim g = 4"
        />
      </div>
      <p className="mt-2 text-center text-sm text-stone-500">
        Navy is <Tex math="f" />. Green is <Tex math="g" />. Dashed line is{" "}
        <Tex math="x=2" />.
      </p>
      <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200">
        <LimitGraph
          spec={INTRO_GRAPH}
          leftX={approach.leftX}
          rightX={approach.rightX}
          showCoords={showCoords}
          ariaLabel="Graphs of f(x)=x+1 and g(x)=x squared with points (2,3) and (2,4)."
        />
      </div>
      <ApproachSliders
        spec={INTRO_GRAPH}
        leftX={approach.leftX}
        rightX={approach.rightX}
        onLeft={approach.setLeftX}
        onRight={approach.setRightX}
      />
    </details>
  );
}

function BuildRule({ rule }: { rule: Rule }) {
  const [slots, setSlots] = useState<(string | null)[]>(() =>
    Array.from({ length: rule.build.solution.length }, () => null),
  );
  const [held, setHeld] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setSlots(Array.from({ length: rule.build.solution.length }, () => null));
    setHeld(null);
    setTries(0);
    setMsg("");
    setOk(false);
  }, [rule.id, rule.build.solution.length]);

  const used = new Set(slots.filter(Boolean));
  const bank = rule.build.bank;

  function place(index: number) {
    if (!held) {
      if (slots[index]) {
        setHeld(slots[index]);
        setSlots((s) => s.map((v, i) => (i === index ? null : v)));
      }
      return;
    }
    setSlots((s) => s.map((v, i) => (i === index ? held : v)));
    setHeld(null);
  }

  function check() {
    const filled = slots.every(Boolean);
    if (!filled) {
      setMsg("Fill every slot, then check.");
      return;
    }
    const match = slots.every((id, i) => id === rule.build.solution[i]);
    setTries((n) => n + 1);
    if (match) {
      setOk(true);
      setMsg("That is the symbolic rule.");
      return;
    }
    if (tries < 1) {
      setMsg("Good start. Which operation connects the two functions?");
    } else {
      setMsg("Look at how the two limits are joined. Try a different piece.");
    }
  }

  return (
    <div className="mt-5">
      <p className="text-lg font-semibold">{rule.name}</p>
      <p className="mt-1 text-stone-600">
        Tap a tile, then tap a slot. On a first miss, the full rule stays hidden.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {slots.map((id, i) => {
          const piece = bank.find((p) => p.id === id);
          return (
            <button
              key={`slot-${i}`}
              type="button"
              className="min-h-14 min-w-16 rounded-xl border-2 border-dashed border-stone-300 bg-white px-3"
              onClick={() => place(i)}
            >
              {piece ? <Tex math={piece.math} /> : <span className="text-stone-400">slot</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {bank.map((piece) => (
          <button
            key={piece.id}
            type="button"
            disabled={used.has(piece.id)}
            className={HIT}
            style={{
              background: held === piece.id ? NAVY : "#fff",
              color: held === piece.id ? "#fff" : NAVY,
              opacity: used.has(piece.id) ? 0.35 : 1,
              border: "1px solid rgba(27,42,74,0.18)",
            }}
            onClick={() => setHeld(piece.id)}
          >
            <Tex math={piece.math} />
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={HIT} style={{ background: NAVY, color: "#fff" }} onClick={check}>
          Check my rule
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: "#F4F0E6", color: NAVY }}
          onClick={() => {
            setSlots(Array.from({ length: rule.build.solution.length }, () => null));
            setOk(false);
            setMsg("");
            setHeld(null);
          }}
        >
          Reset
        </button>
      </div>
      {msg ? (
        <p className="mt-3" style={{ color: ok ? "#15803D" : "#b45309" }}>
          {msg}
        </p>
      ) : null}
    </div>
  );
}

function WhatNext({ rule }: { rule: Rule }) {
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setPick(null);
    setChecked(false);
  }, [rule.id]);
  const spec = rule.next;
  return (
    <div className="mt-5">
      <p className="text-lg font-semibold">{rule.name}</p>
      <div className="mt-3 space-y-2 rounded-2xl border border-stone-200 bg-white p-4">
        {spec.given.map((item) => (
          <MathLine key={item.math} math={item.math} text={item.text} />
        ))}
      </div>
      <p className="mt-4 font-semibold">{spec.question}</p>
      <div className="mt-2 flex flex-col gap-2">
        {spec.choices.map((choice, i) => (
          <button
            key={choice}
            type="button"
            className={`${HIT} justify-start text-left`}
            style={{
              background: pick === i ? NAVY : "#fff",
              color: pick === i ? "#fff" : NAVY,
              border: "1px solid rgba(27,42,74,0.18)",
            }}
            onClick={() => {
              setPick(i);
              setChecked(false);
            }}
          >
            {choice}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={`${HIT} mt-4`}
        style={{ background: NAVY, color: "#fff" }}
        disabled={pick == null}
        onClick={() => setChecked(true)}
      >
        Check my work
      </button>
      {checked && pick != null ? (
        <p className="mt-3">
          {pick === spec.answer
            ? spec.why
            : "Not yet. Try separating this expression into simpler limits first."}
        </p>
      ) : null}
    </div>
  );
}

function GraphIt({
  spec,
  rule,
  showCoords,
  setShowCoords,
  showTable,
}: {
  spec: GraphSpec;
  rule: Rule;
  showCoords: boolean;
  setShowCoords: (v: boolean) => void;
  showTable: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const [guessC, setGuessC] = useState(String(spec.c));
  const [guessY, setGuessY] = useState("");
  const [showAlg, setShowAlg] = useState(false);
  const zspec = useMemo(() => {
    const half = (spec.xMax - spec.xMin) / (2 * zoom);
    return { ...spec, xMin: spec.c - half, xMax: spec.c + half };
  }, [spec, zoom]);
  const approach = useApproach(zspec);
  const expected = spec.marks[0]?.y ?? 0;
  const ok = gradeNumber(guessY, expected, rule.quick.calculate.accept ?? []);

  return (
    <div className="mt-5">
      <p className="text-lg font-semibold">Estimate the limit from the graph first.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={HIT} style={{ background: "#F4F0E6", color: NAVY }} onClick={() => setZoom(1)}>
          Zoom out
        </button>
        <button type="button" className={HIT} style={{ background: "#F4F0E6", color: NAVY }} onClick={() => setZoom(2)}>
          Zoom in
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: showCoords ? NAVY : "#F4F0E6", color: showCoords ? "#fff" : NAVY }}
          onClick={() => setShowCoords(!showCoords)}
        >
          Point coordinates
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: showAlg ? NAVY : "#F4F0E6", color: showAlg ? "#fff" : NAVY }}
          onClick={() => setShowAlg((v) => !v)}
        >
          Toggle algebra
        </button>
      </div>
      <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <LimitGraph
          spec={zspec}
          leftX={approach.leftX}
          rightX={approach.rightX}
          showCoords={showCoords}
          ariaLabel={`Graph for ${rule.name}`}
        />
      </div>
      <ApproachSliders
        spec={zspec}
        leftX={approach.leftX}
        rightX={approach.rightX}
        onLeft={approach.setLeftX}
        onRight={approach.setRightX}
      />
      {showTable ? (
        <div className="mt-3 rounded-2xl border border-stone-200 bg-white p-3">
          <ValueTable rows={approachRows(spec.c, spec.curves[0].fn)} />
        </div>
      ) : null}
      <p className="mt-4 font-semibold">As x approaches ____, y appears to approach ____.</p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          x approaches
          <input
            className="mt-1 min-h-12 w-full rounded-xl border border-stone-300 px-3"
            value={guessC}
            onChange={(e) => setGuessC(e.target.value)}
          />
        </label>
        <label className="text-sm font-semibold">
          y appears to approach
          <input
            className="mt-1 min-h-12 w-full rounded-xl border border-stone-300 px-3"
            value={guessY}
            onChange={(e) => setGuessY(e.target.value)}
          />
        </label>
      </div>
      {guessY ? (
        <p className="mt-3">
          {ok
            ? "Notice that the graph approaches the same y-value from both directions."
            : "Read the height the moving points are heading toward."}
        </p>
      ) : null}
      {showAlg ? (
        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4">
          {rule.shared.steps.map((item) => (
            <MathLine key={item.math} math={item.math} text={item.text} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function markResult(stats: Stats, rule: RuleId | undefined, correct: boolean): Stats {
  const attempts = stats.attempts + 1;
  const correctN = stats.correct + (correct ? 1 : 0);
  const streak = correct ? stats.streak + 1 : 0;
  const mastered = [...stats.mastered];
  const needs = [...stats.needs];
  if (rule) {
    if (correct && !mastered.includes(rule) && streak >= 2) mastered.push(rule);
    if (!correct && !needs.includes(rule)) needs.push(rule);
    if (correct) {
      const i = needs.indexOf(rule);
      if (i >= 0 && streak >= 2) needs.splice(i, 1);
    }
  }
  return { ...stats, attempts, correct: correctN, streak, mastered, needs };
}

function Practice({
  level,
  setLevel,
  index,
  setIndex,
  stats,
  setStats,
}: {
  level: 1 | 2 | 3 | 4 | 5;
  setLevel: (n: 1 | 2 | 3 | 4 | 5) => void;
  index: number;
  setIndex: (n: number) => void;
  stats: Stats;
  setStats: (s: Stats) => void;
}) {
  const pool = PRACTICE.filter((p) => p.level === level);
  const item = pool[index % pool.length];
  const [pick, setPick] = useState<number | null>(null);
  const [value, setValue] = useState("");
  const [why, setWhy] = useState("");
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setPick(null);
    setValue("");
    setWhy("");
    setChecked(false);
    setOk(false);
  }, [level, index, item.prompt]);

  function check() {
    let good = false;
    if (item.choices && item.answerIndex != null) good = pick === item.answerIndex;
    else if (item.answer != null) good = gradeNumber(value, item.answer, item.accept ?? []);
    else good = why.trim().length > 12;
    setOk(good);
    setChecked(true);
    setStats(markResult(stats, item.rule, good));
  }

  return (
    <div className="mt-5">
      <ProgressTracker stats={stats} />
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Practice level">
        {([1, 2, 3, 4, 5] as const).map((n) => (
          <button
            key={n}
            type="button"
            className={HIT}
            style={{ background: level === n ? NAVY : "#F4F0E6", color: level === n ? "#fff" : NAVY }}
            onClick={() => {
              setLevel(n);
              setIndex(0);
            }}
          >
            Level {n}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        Level {level}
        {level === 1
          ? " · Identify the rule"
          : level === 2
            ? " · Evaluate"
            : level === 3
              ? " · Combine two rules"
              : level === 4
                ? " · Multi-step"
                : " · Explain in words"}
      </p>
      <p className="mt-2 text-lg">{item.prompt}</p>
      {item.math ? (
        <div className="mt-3">
          <MathLine math={item.math} text={item.prompt} />
        </div>
      ) : null}
      {item.choices ? (
        <div className="mt-3 flex flex-col gap-2">
          {item.choices.map((choice, i) => (
            <button
              key={choice}
              type="button"
              className={`${HIT} justify-start`}
              style={{
                background: pick === i ? NAVY : "#fff",
                color: pick === i ? "#fff" : NAVY,
                border: "1px solid rgba(27,42,74,0.18)",
              }}
              onClick={() => setPick(i)}
            >
              {choice}
            </button>
          ))}
        </div>
      ) : item.answer != null ? (
        <label className="mt-3 block text-sm font-semibold">
          Limit
          <input
            className="mt-1 min-h-12 w-full rounded-xl border border-stone-300 px-3"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>
      ) : (
        <label className="mt-3 block text-sm font-semibold">
          Your explanation
          <textarea
            className="mt-1 min-h-28 w-full rounded-xl border border-stone-300 p-3"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
          />
        </label>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={HIT} style={{ background: NAVY, color: "#fff" }} onClick={check}>
          Check my work
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: "#F4F0E6", color: NAVY }}
          onClick={() => setIndex(index + 1)}
        >
          Next question
        </button>
      </div>
      {checked ? (
        <div className="mt-3 rounded-2xl bg-[#EAF3ED] p-4">
          <p>{ok ? "Nice work. Keep going." : item.hint}</p>
          {item.model ? <p className="mt-2">{item.model}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function MixedChallenge({
  index,
  setIndex,
}: {
  index: number;
  setIndex: (n: number) => void;
}) {
  const item = MIXED[index % MIXED.length];
  const [picked, setPicked] = useState<RuleId[]>([]);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setPicked([]);
    setValue("");
    setChecked(false);
  }, [index]);

  function toggle(id: RuleId) {
    setPicked((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  }

  const lawsOk =
    picked.length === item.laws.length && item.laws.every((id, i) => picked[i] === id);
  const valOk = gradeNumber(value, item.answer, item.accept ?? []);

  return (
    <div className="mt-5">
      <h3 className="font-serif text-2xl">Which Limit Law Do I Need?</h3>
      <p className="mt-2">
        Tap the properties in the order you would use them, then evaluate.
      </p>
      <div className="mt-4">
        <MathLine math={item.math} text={item.text} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {RULE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={HIT}
            style={{
              background: picked.includes(id) ? NAVY : "#fff",
              color: picked.includes(id) ? "#fff" : NAVY,
              border: "1px solid rgba(27,42,74,0.18)",
            }}
            onClick={() => toggle(id)}
          >
            {ruleById(id).name}
            {picked.includes(id) ? ` · ${picked.indexOf(id) + 1}` : ""}
          </button>
        ))}
      </div>
      {picked.length ? (
        <p className="mt-2 text-sm">
          Sequence: {picked.map((id) => ruleById(id).name).join(" → ")}
        </p>
      ) : null}
      <label className="mt-4 block text-sm font-semibold">
        Limit
        <input
          className="mt-1 min-h-12 w-full rounded-xl border border-stone-300 px-3"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={HIT}
          style={{ background: NAVY, color: "#fff" }}
          onClick={() => setChecked(true)}
        >
          Check my work
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: "#F4F0E6", color: NAVY }}
          onClick={() => setIndex(index + 1)}
        >
          Next expression
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: "#F4F0E6", color: NAVY }}
          onClick={() => setPicked([])}
        >
          Clear sequence
        </button>
      </div>
      {checked ? (
        <p className="mt-3">
          {lawsOk && valOk
            ? "That sequence and value match."
            : lawsOk
              ? "The laws are in a good order. Check the arithmetic."
              : `A working sequence is ${item.laws.map((id) => ruleById(id).name).join(" → ")}.`}
        </p>
      ) : null}
    </div>
  );
}

function QuickCheck({
  rule,
  q,
  setQ,
  stats,
  setStats,
  reveal,
}: {
  rule: Rule;
  q: number;
  setQ: (n: number) => void;
  stats: Stats;
  setStats: (s: Stats) => void;
  reveal: boolean;
}) {
  const [pick, setPick] = useState<number | null>(null);
  const [value, setValue] = useState("");
  const [why, setWhy] = useState("");
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setPick(null);
    setValue("");
    setWhy("");
    setChecked(false);
  }, [rule.id, q]);

  const done = stats.quick[rule.id] ?? 0;

  function pass() {
    const next = Math.max(done, q + 1);
    setStats({ ...stats, quick: { ...stats.quick, [rule.id]: next } });
    setChecked(true);
  }

  function check() {
    if (q === 0) {
      if (pick === rule.quick.identify.answer) pass();
      else setChecked(true);
      return;
    }
    if (q === 1) {
      if (gradeNumber(value, rule.quick.calculate.answer, rule.quick.calculate.accept ?? [])) pass();
      else setChecked(true);
      return;
    }
    if (why.trim().length > 8) pass();
    else setChecked(true);
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
        Quick check · {Math.min(q + 1, 3)} of 3
      </p>
      {q === 0 ? (
        <>
          <p className="mt-2 font-semibold">{rule.quick.identify.question}</p>
          <div className="mt-2 flex flex-col gap-2">
            {rule.quick.identify.choices.map((choice, i) => (
              <button
                key={choice}
                type="button"
                className={`${HIT} justify-start`}
                style={{
                  background: pick === i ? NAVY : "#F4F0E6",
                  color: pick === i ? "#fff" : NAVY,
                }}
                onClick={() => setPick(i)}
              >
                {choice}
              </button>
            ))}
          </div>
        </>
      ) : null}
      {q === 1 ? (
        <>
          <p className="mt-2 font-semibold">{rule.quick.calculate.question}</p>
          <div className="mt-2">
            <MathLine math={rule.quick.calculate.math} text={rule.quick.calculate.question} />
          </div>
          <input
            className="mt-3 min-h-12 w-full rounded-xl border border-stone-300 px-3"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="Limit value"
          />
        </>
      ) : null}
      {q === 2 ? (
        <>
          <p className="mt-2 font-semibold">{rule.quick.explain.question}</p>
          <textarea
            className="mt-2 min-h-28 w-full rounded-xl border border-stone-300 p-3"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
          />
        </>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={HIT} style={{ background: NAVY, color: "#fff" }} onClick={check}>
          Check
        </button>
        {q < 2 ? (
          <button
            type="button"
            className={HIT}
            style={{ background: "#F4F0E6", color: NAVY }}
            onClick={() => setQ(q + 1)}
          >
            Next
          </button>
        ) : null}
      </div>
      {checked || reveal ? (
        <p className="mt-3">
          {q === 0
            ? pick === rule.quick.identify.answer || reveal
              ? "That is the matching law."
              : "Look at the operation that joins the pieces."
            : q === 1
              ? gradeNumber(value, rule.quick.calculate.answer, rule.quick.calculate.accept ?? []) || reveal
                ? "That value matches the graph height."
                : "Try separating this expression into simpler limits first."
              : rule.quick.explain.model}
        </p>
      ) : null}
    </div>
  );
}

function ProgressTracker({ stats }: { stats: Stats }) {
  return (
    <div className="rounded-2xl bg-[#EAF3ED] p-4 text-sm">
      <p>
        Correct {stats.correct} · Attempts {stats.attempts} · Streak {stats.streak}
      </p>
      <p className="mt-1">
        Mastered: {stats.mastered.length ? stats.mastered.map((id) => ruleById(id).name).join(", ") : "none yet"}
      </p>
      <p className="mt-1">
        Needs more practice:{" "}
        {stats.needs.length ? stats.needs.map((id) => ruleById(id).name).join(", ") : "none"}
      </p>
    </div>
  );
}

function TeacherPanel({
  ruleId,
  setRuleId,
  setMode,
  setExample,
  setBoard,
  showAnswers,
  setShowAnswers,
  showCoords,
  setShowCoords,
  showTable,
  setShowTable,
  setPracticeIx,
  resetProgress,
  stats,
}: {
  ruleId: RuleId;
  setRuleId: (id: RuleId) => void;
  setMode: (m: Mode) => void;
  setExample: (n: 1 | 2) => void;
  setBoard: (v: boolean) => void;
  showAnswers: boolean;
  setShowAnswers: (v: boolean) => void;
  showCoords: boolean;
  setShowCoords: (v: boolean) => void;
  showTable: boolean;
  setShowTable: (v: boolean) => void;
  setPracticeIx: (n: number) => void;
  resetProgress: () => void;
  stats: Stats;
}) {
  return (
    <details className="mt-8 rounded-2xl border border-stone-200 bg-white p-4">
      <summary className="cursor-pointer text-sm font-semibold tracking-wide text-stone-500 uppercase">
        Teacher controls
      </summary>
      <div className="mt-3 flex flex-wrap gap-2">
        <select
          className="min-h-12 rounded-xl border border-stone-300 px-3"
          value={ruleId}
          onChange={(e) => setRuleId(e.target.value as RuleId)}
          aria-label="Jump to rule"
        >
          {RULES.map((rule) => (
            <option key={rule.id} value={rule.id}>
              {rule.name}
            </option>
          ))}
        </select>
        <button type="button" className={HIT} style={{ background: "#F4F0E6", color: NAVY }} onClick={() => setExample(1)}>
          Example 1
        </button>
        <button type="button" className={HIT} style={{ background: "#F4F0E6", color: NAVY }} onClick={() => setExample(2)}>
          Example 2
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: showAnswers ? NAVY : "#F4F0E6", color: showAnswers ? "#fff" : NAVY }}
          onClick={() => setShowAnswers(!showAnswers)}
        >
          Toggle answers
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: showCoords ? NAVY : "#F4F0E6", color: showCoords ? "#fff" : NAVY }}
          onClick={() => setShowCoords(!showCoords)}
        >
          Graph labels
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: showTable ? NAVY : "#F4F0E6", color: showTable ? "#fff" : NAVY }}
          onClick={() => setShowTable(!showTable)}
        >
          Numerical table
        </button>
        <button
          type="button"
          className={HIT}
          style={{ background: "#F4F0E6", color: NAVY }}
          onClick={() => {
            setMode("practice");
            setPracticeIx(Math.floor(Math.random() * 8));
          }}
        >
          Random practice
        </button>
        <button type="button" className={HIT} style={{ background: NAVY, color: "#fff" }} onClick={() => setBoard(true)}>
          Enable Board Mode
        </button>
        <button type="button" className={HIT} style={{ background: "#F4F0E6", color: NAVY }} onClick={resetProgress}>
          Reset student progress
        </button>
      </div>
      <div className="mt-3">
        <ProgressTracker stats={stats} />
      </div>
    </details>
  );
}
