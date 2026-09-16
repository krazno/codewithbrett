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
type ChallengePhase = "setup" | "predict" | "revealed";
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
  result: string;
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
    body: "Try x = −1 and watch it travel.",
    x: -1,
    restrict: false,
    spotlight: "input",
  },
  {
    title: "Substitute.",
    body: "Put the input in place of x.",
    x: -1,
    restrict: false,
    spotlight: "calc",
  },
  {
    title: "Calculate the output.",
    body: "x = 0 is the vertex.",
    x: 0,
    restrict: false,
    spotlight: "calc",
  },
  {
    title: "Ordered pair.",
    body: "(x, y) connects the table to the graph.",
    x: 1,
    restrict: false,
    spotlight: "pair",
  },
  {
    title: "Find it on the graph.",
    body: "Follow the gold guides. Try x = 4.",
    x: 4,
    restrict: false,
    spotlight: "graph",
  },
  {
    title: "Restrict the domain.",
    body: "Move an endpoint. The window is not the domain.",
    x: 2,
    restrict: true,
    spotlight: "domain",
  },
  {
    title: "Watch the range.",
    body: "Changing the domain can change the range.",
    x: 2,
    restrict: true,
    spotlight: "range",
  },
  {
    title: "Brackets vs parentheses.",
    body: "Filled / [  included. Open / (  not included.",
    x: -3,
    restrict: true,
    spotlight: "notation",
  },
];

const hit =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

function rowFor(fnId: FnId, x: number): TableRow {
  const y = FUNCTIONS[fnId].evaluate(x);
  const lines = FUNCTIONS[fnId].substitutionLines(x);
  return {
    x,
    y,
    result: lines[lines.length - 1],
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
  const hideOutput = appMode === "challenge" && challengePhase === "predict";
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

  const ring = (on: boolean) => (on ? "ring-2 ring-[#D6B55B]" : "");

  return (
    <div
      className={`function-garden overflow-x-hidden rounded-2xl border border-[rgba(31,77,58,0.16)] bg-[#FFFDF7] text-[#1F2933] ${
        embedded ? "p-3 sm:p-4" : "p-4 sm:p-5"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-serif text-2xl leading-tight text-[#14382A]">
            UA Function Garden
          </h2>
          <p className="text-xs text-[#1F4D3A] sm:text-sm">
            Change the input. Watch the math come alive.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="Mode"
            className="inline-flex rounded-lg bg-[#EAF3ED] p-0.5"
          >
            {(
              [
                ["explore", "Explore"],
                ["challenge", "Bear Pair"],
                ["demo", "Demo"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={appMode === id}
                className={`${hit} rounded-md px-2.5 text-xs sm:text-sm ${
                  appMode === id
                    ? "bg-[#1F4D3A] text-white"
                    : "bg-transparent text-[#14382A]"
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
          <label className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#1F4D3A]">
            Marker
            <select
              className="min-h-11 min-w-[10.5rem] rounded-lg border border-[rgba(31,77,58,0.22)] bg-white px-2 text-sm font-medium text-[#14382A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B]"
              value={markerId}
              aria-label="Choose your marker"
              onChange={(e) => setMarkerId(e.target.value as MarkerId)}
            >
              {MARKERS.map((marker) => (
                <option key={marker.id} value={marker.id}>
                  {marker.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {appMode === "demo" ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-[#D6B55B] bg-[#EAF3ED] px-3 py-2">
          <p className="min-w-0 flex-1 text-sm">
            <span className="font-semibold">
              {demoStep + 1}/{DEMO_STEPS.length}. {DEMO_STEPS[demoStep].title}
            </span>{" "}
            {DEMO_STEPS[demoStep].body}
          </p>
          <button
            type="button"
            className={`${hit} bg-white text-xs`}
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
            className={`${hit} bg-[#1F4D3A] text-xs text-white`}
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
            className={`${hit} bg-white text-xs`}
            onClick={() => {
              setAppMode("explore");
              setDemoStep(0);
            }}
          >
            Leave
          </button>
        </div>
      ) : null}

      {appMode === "challenge" ? (
        <div className="mt-3 rounded-xl bg-[#EAF3ED] px-3 py-2">
          <p className="text-sm">
            Partner A picks an input. Partner B sees that input and predicts the
            output.
          </p>
          {challengePhase === "setup" ? (
            <button
              type="button"
              className={`${hit} mt-2 bg-[#1F4D3A] text-white`}
              onClick={() => {
                setChallengePhase("predict");
                setPrediction("");
                setPredictionOk(null);
              }}
            >
              Partner B: predict y
            </button>
          ) : null}
          {challengePhase === "predict" ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="font-mono text-sm font-semibold">
                {fn.letter}({formatNumber(x)}) = ?
              </p>
              <label className="sr-only" htmlFor={`${formId}-pred`}>
                Predicted output
              </label>
              <input
                id={`${formId}-pred`}
                type="number"
                inputMode="numeric"
                placeholder="y"
                className="min-h-11 w-24 rounded-lg border border-[rgba(31,77,58,0.25)] bg-white px-3 text-base"
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") checkPrediction();
                }}
              />
              <button
                type="button"
                className={`${hit} bg-[#1F4D3A] text-white`}
                onClick={checkPrediction}
              >
                Check
              </button>
            </div>
          ) : null}
          {challengePhase === "revealed" ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">
                {predictionOk
                  ? "You found it — check the ordered pair on the graph."
                  : "Not yet, and that is okay. Trace x through the function together."}
              </p>
              {completePair ? (
                <p className="w-full font-serif text-base text-[#14382A]">
                  Bear Pair complete! What connection did you notice between the
                  table and the graph?
                </p>
              ) : null}
              {celebrate || (completePair && !reducedMotion) ? (
                <div
                  className={`flex gap-1 text-[#1F4D3A] ${styles.celebrate}`}
                  aria-hidden
                >
                  {Array.from({ length: 3 }).map((_, i) => (
                    <MarkerIcon key={i} id={markerId} size={18} />
                  ))}
                </div>
              ) : null}
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
                Switch roles
              </button>
              <button
                type="button"
                className={`${hit} bg-white`}
                onClick={() => {
                  setChallengePhase("setup");
                  setPrediction("");
                  setPredictionOk(null);
                  if (completePair) setTurns(0);
                }}
              >
                Try another
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        role="group"
        aria-label="Choose a function"
        className="mt-3 grid grid-cols-3 gap-1.5"
      >
        {FUNCTION_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={fnId === id}
            className={`${hit} h-11 ${
              fnId === id
                ? "bg-[#1F4D3A] text-white"
                : "bg-white text-[#14382A] ring-1 ring-[rgba(31,77,58,0.16)]"
            }`}
            onClick={() => changeFunction(id)}
            disabled={appMode === "demo" || hideOutput}
          >
            {FUNCTIONS[id].display}
          </button>
        ))}
      </div>

      <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
        <div className="order-1 lg:order-2">
          <InteractiveGraph
            fnId={fnId}
            x={x}
            showPoint={!hideOutput}
            domainMode={domainMode}
            domain={liveDomain}
            markerId={markerId}
            reducedMotion={reducedMotion}
            spotlight={spotlight === "graph"}
            onPickX={hideOutput ? () => {} : trySetX}
          />
        </div>

        <div className="order-2 space-y-3 lg:order-1">
          <section
            className={`rounded-xl bg-[#EAF3ED] p-3 ${ring(
              spotlight === "input" ||
                spotlight === "calc" ||
                spotlight === "pair",
            )}`}
            aria-live="polite"
          >
            <p className="font-serif text-xl text-[#14382A]">{fn.display}</p>
            <label
              className="mt-2 block text-xs font-semibold tracking-wide text-[#1F4D3A] uppercase"
              htmlFor={`${formId}-slider`}
            >
              Input x
            </label>
            <input
              id={`${formId}-slider`}
              type="range"
              min={-6}
              max={6}
              step={1}
              value={x}
              disabled={hideOutput}
              onChange={(e) => trySetX(Number(e.target.value))}
              className="mt-1 h-11 w-full accent-[#1F4D3A]"
            />
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor={`${formId}-num`}>
                Enter an x value
              </label>
              <input
                id={`${formId}-num`}
                type="number"
                inputMode="numeric"
                step={1}
                value={typed}
                disabled={hideOutput}
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
                className="min-h-11 w-20 rounded-lg border border-[rgba(31,77,58,0.25)] bg-white px-2 text-base"
              />
              {hideOutput ? (
                <p className="font-mono text-sm font-semibold">
                  {fn.letter}({formatNumber(x)}) = ?
                </p>
              ) : (
                <div className={`min-w-0 text-sm ${ring(spotlight === "calc")}`}>
                  {lines.map((line) => (
                    <p key={line} className="font-mono leading-snug">
                      {line}
                    </p>
                  ))}
                  <p className="mt-1 font-serif text-base">
                    {pair}
                  </p>
                </div>
              )}
            </div>
            {excludeMsg ? (
              <p className="mt-2 text-sm font-medium" role="status">
                {excludeMsg}
              </p>
            ) : null}
          </section>

          <section className="overflow-x-auto rounded-xl bg-white p-3 ring-1 ring-[rgba(31,77,58,0.12)]">
            <div className="mb-1 flex items-center justify-between gap-2">
              <h3 className="font-serif text-lg text-[#14382A]">
                Table of values
              </h3>
              <button
                type="button"
                className={`${hit} h-9 min-h-11 bg-[#EAF3ED] text-xs`}
                onClick={() => setRows([rowFor(fnId, x)])}
              >
                Clear
              </button>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[rgba(31,77,58,0.16)] text-xs text-[#1F4D3A]">
                  <th className="py-1.5 pr-2 font-semibold">x</th>
                  <th className="py-1.5 pr-2 font-semibold">Equation</th>
                  <th className="py-1.5 pr-2 font-semibold">y</th>
                  <th className="py-1.5 font-semibold">(x, y)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const mask = hideOutput && row.x === x;
                  return (
                    <tr
                      key={row.x}
                      className="border-b border-[rgba(31,77,58,0.08)]"
                    >
                      <td className="py-1.5 pr-2 font-mono">
                        <span className="inline-flex items-center gap-1">
                          {i === 0 ? (
                            <MarkerIcon
                              id={markerId}
                              size={14}
                              className="text-[#1F4D3A]"
                            />
                          ) : null}
                          {formatNumber(row.x)}
                        </span>
                      </td>
                      <td className="py-1.5 pr-2 font-mono text-xs sm:text-sm">
                        {mask ? `${fn.letter}(${formatNumber(row.x)}) = ?` : row.result}
                      </td>
                      <td className="py-1.5 pr-2 font-mono">
                        {mask ? "—" : formatNumber(row.y)}
                      </td>
                      <td className="py-1.5 font-mono">
                        {mask ? `(${formatNumber(row.x)}, ?)` : row.pair}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <details
          className={`rounded-xl bg-white p-3 ring-1 ring-[rgba(31,77,58,0.12)] ${ring(
            spotlight === "domain" ||
              spotlight === "range" ||
              spotlight === "notation",
          )}`}
          open={appMode === "demo" && (spotlight === "domain" || spotlight === "range" || spotlight === "notation")}
        >
          <summary className="cursor-pointer text-sm font-semibold text-[#14382A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B]">
            Domain {formatInterval(domainIv)} · Range {formatInterval(rangeIv)}
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              aria-pressed={domainMode === "full"}
              className={`${hit} text-xs ${
                domainMode === "full"
                  ? "bg-[#1F4D3A] text-white"
                  : "bg-[#EAF3ED] text-[#14382A]"
              }`}
              onClick={() => {
                setDomainMode("full");
                setExcludeMsg(null);
              }}
            >
              Full function
            </button>
            <button
              type="button"
              aria-pressed={domainMode === "restricted"}
              className={`${hit} text-xs ${
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
              Restrict domain
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#1F4D3A]">
            {describeInterval(domainIv, "input")} {describeInterval(rangeIv, "output")}{" "}
            Filled / [ included. Open / ( not included.
          </p>
          {domainMode === "restricted" ? (
            <div className="mt-2 space-y-2">
              {(
                [
                  ["left", "Left"],
                  ["right", "Right"],
                ] as const
              ).map(([side, label]) => (
                <div
                  key={side}
                  className="flex flex-wrap items-center gap-1.5 text-sm"
                >
                  <span className="w-12 font-semibold">{label}</span>
                  <button
                    type="button"
                    className={`${hit} h-11 w-11 bg-[#EAF3ED]`}
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
                  <span className="min-w-6 text-center font-mono">
                    {domain[side]}
                  </span>
                  <button
                    type="button"
                    className={`${hit} h-11 w-11 bg-[#EAF3ED]`}
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
                    className={`${hit} text-xs ${
                      domain[`${side}Closed`]
                        ? "bg-[#1F4D3A] text-white"
                        : "bg-white ring-1 ring-[rgba(31,77,58,0.2)]"
                    }`}
                    onClick={() =>
                      setDomain((d) => ({ ...d, [`${side}Closed`]: true }))
                    }
                  >
                    ●
                  </button>
                  <button
                    type="button"
                    aria-pressed={!domain[`${side}Closed`]}
                    className={`${hit} text-xs ${
                      !domain[`${side}Closed`]
                        ? "bg-[#1F4D3A] text-white"
                        : "bg-white ring-1 ring-[rgba(31,77,58,0.2)]"
                    }`}
                    onClick={() =>
                      setDomain((d) => ({ ...d, [`${side}Closed`]: false }))
                    }
                  >
                    ○
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </details>

        <details className="rounded-xl bg-[#EAF3ED] p-3">
          <summary className="cursor-pointer text-sm font-semibold text-[#14382A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B]">
            Need a reminder?
          </summary>
          <dl className="mt-2 space-y-1.5 text-xs sm:text-sm">
            <div>
              <dt className="font-semibold">Input</dt>
              <dd>The value that enters the function.</dd>
            </div>
            <div>
              <dt className="font-semibold">Output</dt>
              <dd>The value produced by the function.</dd>
            </div>
            <div>
              <dt className="font-semibold">Domain / range</dt>
              <dd>Permitted inputs / resulting outputs.</dd>
            </div>
            <div>
              <dt className="font-semibold">Notation</dt>
              <dd>
                g(4) = 15. Ordered pair (4, 15). Brackets include; parentheses
                do not.
              </dd>
            </div>
          </dl>
        </details>
      </div>

      <p className="sr-only" aria-live="polite">
        {hideOutput
          ? `Function ${fn.display}. Input x = ${formatNumber(x)}. Predict the output.`
          : `For ${fn.display}, an input of ${formatNumber(x)} produces an output of ${formatNumber(y)}. Ordered pair ${pair}. Domain ${formatInterval(domainIv)}. Range ${formatInterval(rangeIv)}.`}
      </p>
    </div>
  );
}
