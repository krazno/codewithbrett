"use client";

import { useEffect, useId, useState } from "react";
import {
  DEFAULT_RESTRICTED,
  DEFAULT_STEP,
  FUNCTIONS,
  FUNCTION_ORDER,
  clampToWindow,
  describeInterval,
  domainInterval,
  explainExcludedInput,
  formatInterval,
  formatNumber,
  formatPair,
  isInputAllowed,
  normalizeDomain,
  rangeInterval,
  snapToStep,
  type DomainMode,
  type FnId,
  type RestrictedDomain,
} from "@/app/lib/functionGarden/math";
import { InteractiveGraph } from "./InteractiveGraph";
import styles from "./function-garden.module.css";
import {
  DEFAULT_MARKER,
  MARKERS,
  MarkerIcon,
  type MarkerId,
} from "./markers";

type AppMode = "explore" | "challenge" | "demo";
type ChallengePhase = "setup" | "hidden" | "revealed";
type Spotlight =
  | "input"
  | "calc"
  | "pair"
  | "graph"
  | "domain"
  | "range"
  | "notation"
  | null;

type TableRow = {
  x: number;
  y: number;
  lines: string[];
  pair: string;
};

const DEMO_STEPS: {
  title: string;
  body: string;
  x: number;
  restrict: boolean;
  spotlight: Spotlight;
}[] = [
  {
    title: "Choose an input.",
    body: "Choose an input and watch where it travels. Partner-ready: try x = −1 first.",
    x: -1,
    restrict: false,
    spotlight: "input",
  },
  {
    title: "Substitute it into the function.",
    body: "Do not skip the substitution step — write the input in place of x.",
    x: -1,
    restrict: false,
    spotlight: "calc",
  },
  {
    title: "Calculate the output.",
    body: "Every allowed input produces an output. Here x = 0 gives the vertex.",
    x: 0,
    restrict: false,
    spotlight: "calc",
  },
  {
    title: "Find the ordered pair.",
    body: "The ordered pair connects the table to the graph. Try x = 1.",
    x: 1,
    restrict: false,
    spotlight: "pair",
  },
  {
    title: "Locate the point on the graph.",
    body: "Follow the gold guides from the x-axis to the curve, then to the y-axis. Try x = 4.",
    x: 4,
    restrict: false,
    spotlight: "graph",
  },
  {
    title: "Restrict the domain.",
    body: "Try moving an endpoint. What changes? The viewing window is still not the domain.",
    x: 2,
    restrict: true,
    spotlight: "domain",
  },
  {
    title: "Watch the range change.",
    body: "Changing the domain can change the range. Read both interval notation and the plain-language line.",
    x: 2,
    restrict: true,
    spotlight: "range",
  },
  {
    title: "Compare brackets and parentheses.",
    body: "Filled circles and brackets include an endpoint. Open circles and parentheses do not.",
    x: -3,
    restrict: true,
    spotlight: "notation",
  },
];

const hit =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

function rowFor(fnId: FnId, x: number): TableRow {
  const y = FUNCTIONS[fnId].evaluate(x);
  return {
    x,
    y,
    lines: FUNCTIONS[fnId].substitutionLines(x),
    pair: formatPair(x, y),
  };
}

export function FunctionGarden({ embedded = false }: { embedded?: boolean }) {
  const formId = useId();
  const [appMode, setAppMode] = useState<AppMode>("explore");
  const [fnId, setFnId] = useState<FnId>("g");
  const [x, setX] = useState(0);
  const [typed, setTyped] = useState("0");
  const [domainMode, setDomainMode] = useState<DomainMode>("full");
  const [domain, setDomain] = useState<RestrictedDomain>(DEFAULT_RESTRICTED);
  const [markerId, setMarkerId] = useState<MarkerId>(DEFAULT_MARKER);
  const [rows, setRows] = useState<TableRow[]>(() => [rowFor("g", 0)]);
  const [excludeMsg, setExcludeMsg] = useState<string | null>(null);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [challengePhase, setChallengePhase] = useState<ChallengePhase>("setup");
  const [prediction, setPrediction] = useState("");
  const [predictionOk, setPredictionOk] = useState<boolean | null>(null);
  const [turns, setTurns] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const fn = FUNCTIONS[fnId];
  const y = fn.evaluate(x);
  const lines = fn.substitutionLines(x);
  const pair = formatPair(x, y);
  const liveDomain = normalizeDomain(domain);
  const domainIv = domainInterval(domainMode, fnId, liveDomain);
  const rangeIv = rangeInterval(domainMode, fnId, liveDomain);
  const hideMath = appMode === "challenge" && challengePhase === "hidden";
  const spotlight = appMode === "demo" ? DEMO_STEPS[demoStep].spotlight : null;
  const completePair = turns >= 2 && challengePhase === "revealed";

  function recordPoint(nextX: number, nextFn: FnId = fnId) {
    const next = rowFor(nextFn, nextX);
    setRows((prev) => {
      const rest = prev.filter((row) => row.x !== nextX);
      return [next, ...rest].slice(0, 6);
    });
  }

  function trySetX(raw: number) {
    const snapped = snapToStep(clampToWindow(raw), DEFAULT_STEP);
    setTyped(formatNumber(snapped));
    if (!isInputAllowed(snapped, domainMode, domain)) {
      setExcludeMsg(explainExcludedInput(snapped, domain));
      return;
    }
    setExcludeMsg(null);
    setX(snapped);
    recordPoint(snapped);
  }

  function changeFunction(id: FnId) {
    setFnId(id);
    const allowed = isInputAllowed(x, domainMode, domain);
    const nextX = allowed ? x : 0;
    const useX = isInputAllowed(nextX, domainMode, domain) ? nextX : domain.left;
    setX(useX);
    setTyped(formatNumber(useX));
    setRows([rowFor(id, useX)]);
    setExcludeMsg(null);
  }

  function enterDemo() {
    setAppMode("demo");
    setFnId("g");
    setDemoStep(0);
    applyDemo(0);
  }

  function applyDemo(index: number) {
    const step = DEMO_STEPS[index];
    setFnId("g");
    setDomainMode(step.restrict ? "restricted" : "full");
    if (step.restrict) setDomain(DEFAULT_RESTRICTED);
    setX(step.x);
    setTyped(formatNumber(step.x));
    setExcludeMsg(null);
    setRows([rowFor("g", step.x)]);
  }

  function leaveDemo() {
    setAppMode("explore");
    setDemoStep(0);
  }

  function checkPrediction() {
    const guess = Number.parseFloat(prediction);
    const ok = Number.isFinite(guess) && guess === y;
    setPredictionOk(ok);
    setChallengePhase("revealed");
    setTurns((n) => n + 1);
    if (ok && !reducedMotion) {
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 1400);
    }
  }

  const ring = (on: boolean) =>
    on ? "ring-2 ring-[#D6B55B] ring-offset-2" : "";

  return (
    <div
      className={`function-garden overflow-x-hidden rounded-3xl border border-[rgba(31,77,58,0.16)] bg-[#FFFDF7] text-[#1F2933] ${
        embedded ? "p-4 sm:p-5" : "p-5 sm:p-7"
      }`}
    >
      <header className="mb-4">
        <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-[#1F4D3A] uppercase">
          Created for Ursuline Academy Calculus Honors
        </p>
        <h2 className="mt-1 font-serif text-3xl text-[#14382A] sm:text-4xl">
          UA Function Garden
        </h2>
        <p className="mt-1 text-base text-[#1F4D3A] sm:text-lg">
          Change the input. Watch the math come alive.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Function Garden modes"
        className="mb-4 grid grid-cols-3 gap-2"
      >
        {(
          [
            ["explore", "Explore"],
            ["challenge", "Bear Pair Challenge"],
            ["demo", "Teacher Demo"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={appMode === id}
            className={`${hit} ${
              appMode === id
                ? "bg-[#1F4D3A] text-white"
                : "bg-[#EAF3ED] text-[#14382A]"
            }`}
            onClick={() => {
              if (id === "demo") enterDemo();
              else if (id === "challenge") {
                setAppMode("challenge");
                setChallengePhase("setup");
                setPrediction("");
                setPredictionOk(null);
              } else {
                setAppMode("explore");
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {appMode === "explore" ? (
        <p className="mb-3 text-sm text-[#1F4D3A]">
          Explore first. Explain what you notice second.
        </p>
      ) : null}

      {appMode === "demo" ? (
        <div className="mb-4 rounded-2xl border border-[#D6B55B] bg-[#EAF3ED] p-4">
          <p className="text-xs font-semibold tracking-wide text-[#1F4D3A] uppercase">
            Teacher Demo · Step {demoStep + 1} of {DEMO_STEPS.length}
          </p>
          <p className="mt-1 font-serif text-xl text-[#14382A]">
            {DEMO_STEPS[demoStep].title}
          </p>
          <p className="mt-1 text-sm leading-relaxed">{DEMO_STEPS[demoStep].body}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={`${hit} bg-white text-[#14382A]`}
              disabled={demoStep === 0}
              onClick={() => {
                const next = Math.max(0, demoStep - 1);
                setDemoStep(next);
                applyDemo(next);
              }}
            >
              Back
            </button>
            <button
              type="button"
              className={`${hit} bg-[#1F4D3A] text-white`}
              disabled={demoStep === DEMO_STEPS.length - 1}
              onClick={() => {
                const next = Math.min(DEMO_STEPS.length - 1, demoStep + 1);
                setDemoStep(next);
                applyDemo(next);
              }}
            >
              Next
            </button>
            <button
              type="button"
              className={`${hit} bg-white text-[#14382A]`}
              onClick={leaveDemo}
            >
              Leave Demo
            </button>
          </div>
        </div>
      ) : null}

      {appMode === "challenge" ? (
        <div className="mb-4 rounded-2xl border border-[rgba(31,77,58,0.16)] bg-[#EAF3ED] p-4">
          <p className="font-serif text-xl text-[#14382A]">Bear Pair Challenge</p>
          <p className="mt-1 text-sm leading-relaxed">
            Partner A chooses an input. Partner B predicts the output. Reveal
            the result, talk through the graph, and then switch roles.
          </p>
          {challengePhase === "setup" ? (
            <button
              type="button"
              className={`${hit} mt-3 bg-[#1F4D3A] text-white`}
              onClick={() => {
                setChallengePhase("hidden");
                setPrediction("");
                setPredictionOk(null);
              }}
            >
              Hide My Input
            </button>
          ) : null}
          {challengePhase === "hidden" ? (
            <div className="mt-3 space-y-2">
              <label className="block text-sm font-semibold" htmlFor={`${formId}-pred`}>
                Partner B: predict the output
              </label>
              <input
                id={`${formId}-pred`}
                type="number"
                inputMode="numeric"
                className="min-h-11 w-full max-w-[12rem] rounded-xl border border-[rgba(31,77,58,0.25)] bg-white px-3 text-base"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
              />
              <button
                type="button"
                className={`${hit} bg-[#1F4D3A] text-white`}
                onClick={checkPrediction}
              >
                Check Our Prediction
              </button>
            </div>
          ) : null}
          {challengePhase === "revealed" ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium">
                {predictionOk
                  ? "You found it! Follow the input to the graph and check the ordered pair."
                  : "Not yet, and that is completely okay. Let’s trace the input through the function together."}
              </p>
              {completePair ? (
                <p className="font-serif text-lg text-[#14382A]">
                  Bear Pair complete! What connection did you notice between the
                  table and the graph?
                </p>
              ) : null}
              {celebrate || (completePair && !reducedMotion) ? (
                <div className={`flex gap-2 text-[#1F4D3A] ${styles.celebrate}`} aria-hidden>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <MarkerIcon key={i} id={markerId} size={22} />
                  ))}
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`${hit} bg-[#1F4D3A] text-white`}
                  onClick={() => {
                    setChallengePhase("setup");
                    setPrediction("");
                    setPredictionOk(null);
                    if (completePair) setTurns(0);
                  }}
                >
                  Switch Roles
                </button>
                <button
                  type="button"
                  className={`${hit} bg-white text-[#14382A]`}
                  onClick={() => {
                    setChallengePhase("setup");
                    setPrediction("");
                    setPredictionOk(null);
                    if (completePair) setTurns(0);
                  }}
                >
                  Try Another
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        role="group"
        aria-label="Choose a function"
        className="mb-4 grid gap-2 sm:grid-cols-3"
      >
        {FUNCTION_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={fnId === id}
            className={`${hit} h-auto min-h-11 flex-col py-3 ${
              fnId === id
                ? "bg-[#1F4D3A] text-white"
                : "bg-white text-[#14382A] ring-1 ring-[rgba(31,77,58,0.18)]"
            }`}
            onClick={() => changeFunction(id)}
            disabled={appMode === "demo" || hideMath}
          >
            <span className="font-serif text-lg">{FUNCTIONS[id].display}</span>
          </button>
        ))}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(18rem,24rem)_minmax(0,1fr)]">
        <div className="order-1 lg:order-2">
          <InteractiveGraph
            fnId={fnId}
            x={x}
            showPoint={!hideMath}
            domainMode={domainMode}
            domain={liveDomain}
            markerId={markerId}
            reducedMotion={reducedMotion}
            spotlight={spotlight === "graph"}
            onPickX={trySetX}
          />
        </div>

        <div className="order-2 space-y-3 lg:order-1">
          <section
            className={`rounded-2xl bg-[#EAF3ED] p-4 ${ring(spotlight === "input")}`}
          >
            <p className="text-xs font-semibold tracking-wide text-[#1F4D3A] uppercase">
              Choose an input
            </p>
            <p className="mt-1 text-sm">
              {hideMath
                ? "Input hidden for Partner B."
                : "Choose an input and watch where it travels."}
            </p>
            <label className="mt-3 block text-sm font-semibold" htmlFor={`${formId}-slider`}>
              x-value slider
            </label>
            <input
              id={`${formId}-slider`}
              type="range"
              min={-6}
              max={6}
              step={1}
              value={x}
              disabled={hideMath}
              onChange={(e) => trySetX(Number(e.target.value))}
              className="mt-1 h-11 w-full accent-[#1F4D3A]"
            />
            <div className="mt-2 flex gap-2">
              <label className="sr-only" htmlFor={`${formId}-num`}>
                Enter an x value
              </label>
              <input
                id={`${formId}-num`}
                type="number"
                inputMode="numeric"
                step={1}
                value={hideMath ? "" : typed}
                disabled={hideMath}
                placeholder={hideMath ? "Hidden" : "x"}
                onChange={(e) => setTyped(e.target.value)}
                onBlur={() => {
                  const n = Number.parseFloat(typed);
                  if (Number.isFinite(n)) trySetX(n);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const n = Number.parseFloat(typed);
                    if (Number.isFinite(n)) trySetX(n);
                  }
                }}
                className="min-h-11 w-24 rounded-xl border border-[rgba(31,77,58,0.25)] bg-white px-3 text-base"
              />
              <button
                type="button"
                className={`${hit} bg-[#1F4D3A] text-white`}
                disabled={hideMath}
                onClick={() => {
                  const n = Number.parseFloat(typed);
                  if (Number.isFinite(n)) trySetX(n);
                }}
              >
                Go
              </button>
            </div>
            {excludeMsg ? (
              <p className="mt-2 text-sm font-medium text-[#14382A]" role="status">
                {excludeMsg}
              </p>
            ) : null}
          </section>

          <section
            className={`rounded-2xl bg-white p-4 ring-1 ring-[rgba(31,77,58,0.12)] ${ring(
              spotlight === "calc" || spotlight === "pair",
            )}`}
            aria-live="polite"
          >
            <p className="text-xs font-semibold tracking-wide text-[#1F4D3A] uppercase">
              Input → output
            </p>
            {hideMath ? (
              <p className="mt-2 text-sm">Waiting for Partner B’s prediction.</p>
            ) : (
              <>
                <p className="mt-2 text-sm">
                  Input: x = {formatNumber(x)}
                </p>
                <p className="mt-1 text-sm font-medium">Function calculation:</p>
                <ul className="mt-1 space-y-0.5 font-mono text-sm">
                  {lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm">
                  Output: y = {formatNumber(y)}
                </p>
                <p className="mt-1 font-serif text-lg">
                  Ordered pair: {pair}
                </p>
              </>
            )}
          </section>

          <section
            className={`rounded-2xl bg-white p-4 ring-1 ring-[rgba(31,77,58,0.12)] ${ring(
              spotlight === "domain" ||
                spotlight === "range" ||
                spotlight === "notation",
            )}`}
          >
            <p className="text-xs font-semibold tracking-wide text-[#1F4D3A] uppercase">
              Domain
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                aria-pressed={domainMode === "full"}
                className={`${hit} ${
                  domainMode === "full"
                    ? "bg-[#1F4D3A] text-white"
                    : "bg-[#EAF3ED] text-[#14382A]"
                }`}
                onClick={() => {
                  setDomainMode("full");
                  setExcludeMsg(null);
                }}
              >
                Full Function
              </button>
              <button
                type="button"
                aria-pressed={domainMode === "restricted"}
                className={`${hit} ${
                  domainMode === "restricted"
                    ? "bg-[#1F4D3A] text-white"
                    : "bg-[#EAF3ED] text-[#14382A]"
                }`}
                onClick={() => {
                  setDomainMode("restricted");
                  if (!isInputAllowed(x, "restricted", domain)) {
                    const fallback = isInputAllowed(0, "restricted", domain)
                      ? 0
                      : domain.leftClosed
                        ? domain.left
                        : domain.left + 1;
                    setX(fallback);
                    setTyped(formatNumber(fallback));
                    recordPoint(fallback);
                  }
                }}
              >
                Restrict the Domain
              </button>
            </div>

            {domainMode === "restricted" ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm">Try moving an endpoint. What changes?</p>
                {(
                  [
                    ["left", "Left endpoint"],
                    ["right", "Right endpoint"],
                  ] as const
                ).map(([side, label]) => (
                  <div key={side}>
                    <p className="text-sm font-semibold">{label}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className={`${hit} bg-[#EAF3ED]`}
                        aria-label={`Decrease ${label}`}
                        onClick={() =>
                          setDomain((d) => ({
                            ...d,
                            [side]: Math.max(-6, d[side] - 1),
                          }))
                        }
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center font-mono text-lg">
                        {domain[side]}
                      </span>
                      <button
                        type="button"
                        className={`${hit} bg-[#EAF3ED]`}
                        aria-label={`Increase ${label}`}
                        onClick={() =>
                          setDomain((d) => ({
                            ...d,
                            [side]: Math.min(6, d[side] + 1),
                          }))
                        }
                      >
                        +
                      </button>
                      <button
                        type="button"
                        aria-pressed={domain[`${side}Closed`]}
                        className={`${hit} ${
                          domain[`${side}Closed`]
                            ? "bg-[#1F4D3A] text-white"
                            : "bg-white ring-1 ring-[rgba(31,77,58,0.25)]"
                        }`}
                        onClick={() =>
                          setDomain((d) => ({
                            ...d,
                            [`${side}Closed`]: true,
                          }))
                        }
                      >
                        ● Closed
                      </button>
                      <button
                        type="button"
                        aria-pressed={!domain[`${side}Closed`]}
                        className={`${hit} ${
                          !domain[`${side}Closed`]
                            ? "bg-[#1F4D3A] text-white"
                            : "bg-white ring-1 ring-[rgba(31,77,58,0.25)]"
                        }`}
                        onClick={() =>
                          setDomain((d) => ({
                            ...d,
                            [`${side}Closed`]: false,
                          }))
                        }
                      >
                        ○ Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className={`mt-3 space-y-2 text-sm ${ring(spotlight === "range")}`}>
              <p>
                <span className="font-semibold">Domain:</span>{" "}
                {formatInterval(domainIv)}
              </p>
              <p>{describeInterval(domainIv, "input")}</p>
              <p>
                <span className="font-semibold">Range:</span>{" "}
                {formatInterval(rangeIv)}
              </p>
              <p>{describeInterval(rangeIv, "output")}</p>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-[#1F4D3A]">
              <li>Filled circle = included · Bracket = included</li>
              <li>Open circle = not included · Parenthesis = not included</li>
            </ul>
          </section>
        </div>
      </div>

      <section className="mt-4 rounded-2xl bg-[#EAF3ED] p-4">
        <h3 className="font-serif text-2xl text-[#14382A]">
          One Idea, Four Views
        </h3>
        {hideMath ? (
          <p className="mt-2 text-sm">
            Function rule: {fn.display}. The other views stay hidden until you
            check the prediction.
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed">
            <li>
              <span className="font-semibold">Function rule:</span> {fn.display}
            </li>
            <li>
              <span className="font-semibold">Input/output:</span> An input of{" "}
              {formatNumber(x)} produces an output of {formatNumber(y)}.
            </li>
            <li>
              <span className="font-semibold">Function notation:</span>{" "}
              {fn.letter}({formatNumber(x)}) = {formatNumber(y)}
            </li>
            <li>
              <span className="font-semibold">Ordered pair:</span> {pair}
            </li>
          </ul>
        )}
      </section>

      <section className="mt-4 overflow-x-auto rounded-2xl bg-white p-4 ring-1 ring-[rgba(31,77,58,0.12)]">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-serif text-2xl text-[#14382A]">Table of values</h3>
          <button
            type="button"
            className={`${hit} bg-[#EAF3ED] text-[#14382A]`}
            onClick={() => setRows([rowFor(fnId, x)])}
          >
            Clear My Points
          </button>
        </div>
        <p className="mb-2 text-sm">
          The ordered pair connects the table to the graph.
        </p>
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(31,77,58,0.16)]">
              <th className="py-2 pr-2 font-semibold">Input x</th>
              <th className="py-2 pr-2 font-semibold">Function calculation</th>
              <th className="py-2 pr-2 font-semibold">Output y</th>
              <th className="py-2 font-semibold">Ordered pair</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.x} className="border-b border-[rgba(31,77,58,0.08)]">
                <td className="py-2 pr-2 font-mono">
                  <span className="inline-flex items-center gap-1">
                    {i === 0 ? (
                      <MarkerIcon
                        id={markerId}
                        size={16}
                        className="text-[#1F4D3A]"
                      />
                    ) : null}
                    {formatNumber(row.x)}
                  </span>
                </td>
                <td className="py-2 pr-2 font-mono text-xs sm:text-sm">
                  {row.lines.join(" → ")}
                </td>
                <td className="py-2 pr-2 font-mono">{formatNumber(row.y)}</td>
                <td className="py-2 font-mono">{row.pair}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-[rgba(31,77,58,0.12)]">
        <h3 className="font-serif text-xl text-[#14382A]">Choose Your Marker</h3>
        <p className="mt-1 text-sm">
          Markers celebrate the point. They do not change the mathematics.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MARKERS.map((marker) => (
            <button
              key={marker.id}
              type="button"
              aria-pressed={markerId === marker.id}
              aria-label={marker.label}
              className={`${hit} gap-2 ${
                markerId === marker.id
                  ? "bg-[#1F4D3A] text-white"
                  : "bg-[#EAF3ED] text-[#14382A]"
              }`}
              onClick={() => setMarkerId(marker.id)}
            >
              <MarkerIcon id={marker.id} size={18} />
              <span className="hidden sm:inline">{marker.label}</span>
            </button>
          ))}
        </div>
      </section>

      <details
        className="mt-4 rounded-2xl bg-[#EAF3ED] p-4"
        open={reminderOpen}
        onToggle={(e) => setReminderOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer list-none font-serif text-xl text-[#14382A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B]">
          Need a reminder?
        </summary>
        <dl className="mt-3 space-y-2 text-sm">
          <div>
            <dt className="font-semibold">Input</dt>
            <dd>The value that enters the function.</dd>
          </div>
          <div>
            <dt className="font-semibold">Output</dt>
            <dd>The value produced by the function.</dd>
          </div>
          <div>
            <dt className="font-semibold">Domain</dt>
            <dd>All permitted input values.</dd>
          </div>
          <div>
            <dt className="font-semibold">Range</dt>
            <dd>All resulting output values.</dd>
          </div>
          <div>
            <dt className="font-semibold">Function notation</dt>
            <dd>
              g(4) = 15 means that an input of 4 produces an output of 15.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Ordered pair</dt>
            <dd>(4, 15) records the input first and the output second.</dd>
          </div>
          <div>
            <dt className="font-semibold">Interval notation</dt>
            <dd>Brackets include an endpoint. Parentheses do not.</dd>
          </div>
        </dl>
      </details>

      <p className="sr-only" aria-live="polite">
        {hideMath
          ? `Function ${fn.display}. Input hidden for the partner challenge.`
          : `For ${fn.display}, an input of ${formatNumber(x)} produces an output of ${formatNumber(y)}. Ordered pair ${pair}. Domain ${formatInterval(domainIv)}. Range ${formatInterval(rangeIv)}.`}
      </p>
    </div>
  );
}
