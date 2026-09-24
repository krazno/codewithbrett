"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "ua-nav-countdown";
const FIVE_MS = 5 * 60 * 1000;
const THREE_MS = 3 * 60 * 1000;
const ONE_MS = 1 * 60 * 1000;
const FIVE_ANNOUNCE_WINDOW_MS = 2500;
const WARNING_REPEAT_MS = 45_000;
const PRESETS_MIN = [5, 6, 10, 15, 20, 25, 30, 40, 45] as const;

type TimerStage = "normal" | "yellow" | "red-outline" | "red-flash" | "done";

type StoredTimer = {
  endsAt: number;
  warnedAt?: number;
  announcedFive?: boolean;
};

function formatRemaining(ms: number) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function stageFor(remainingMs: number, running: boolean, finished: boolean): TimerStage {
  if (finished) return "done";
  if (!running) return "normal";
  if (remainingMs <= ONE_MS) return "red-flash";
  if (remainingMs <= THREE_MS) return "red-outline";
  if (remainingMs <= FIVE_MS) return "yellow";
  return "normal";
}

function readStored(): StoredTimer | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredTimer;
    if (typeof parsed?.endsAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(value: StoredTimer | null) {
  try {
    if (!value) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* ignore quota / private mode */
  }
}

function playTone(audio: HTMLAudioElement | null) {
  if (!audio) return;
  try {
    audio.currentTime = 0;
    void audio.play().catch(() => {
      /* autoplay may still block until gesture */
    });
  } catch {
    /* ignore */
  }
}

function pickFemaleVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const preferred = [
    /samantha/i,
    /karen/i,
    /moira/i,
    /tessa/i,
    /fiona/i,
    /victoria/i,
    /zira/i,
    /female/i,
    /google us english/i,
    /google uk english female/i,
  ];
  for (const re of preferred) {
    const match = voices.find((voice) => re.test(voice.name));
    if (match) return match;
  }
  return voices.find((voice) => voice.lang.toLowerCase().startsWith("en"));
}

function speakFiveMinutesRemaining() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const speak = () => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("5 minutes remaining");
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1.08;
      const voice = pickFemaleVoice();
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    } catch {
      /* ignore */
    }
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.addEventListener("voiceschanged", speak, {
      once: true,
    });
    window.setTimeout(speak, 250);
    return;
  }
  speak();
}

export function NavCountdownTimer() {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const warningAudioRef = useRef<HTMLAudioElement | null>(null);
  const finalAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastWarnedRef = useRef(0);
  const finishedRef = useRef(false);
  const announcedFiveRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [customMin, setCustomMin] = useState("25");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setEndsAt(stored.endsAt);
      lastWarnedRef.current = stored.warnedAt ?? 0;
      finishedRef.current = stored.endsAt <= Date.now();
      announcedFiveRef.current = Boolean(stored.announcedFive);
    }
    setReady(true);
    setNow(Date.now());

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(mq.matches);
    syncMotion();
    mq.addEventListener("change", syncMotion);

    const warmVoices = () => window.speechSynthesis.getVoices();
    warmVoices();
    window.speechSynthesis.addEventListener("voiceschanged", warmVoices);
    return () => {
      mq.removeEventListener("change", syncMotion);
      window.speechSynthesis.removeEventListener("voiceschanged", warmVoices);
    };
  }, []);

  useEffect(() => {
    if (endsAt == null) return;
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [endsAt]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  const remainingMs = endsAt == null ? 0 : Math.max(0, endsAt - now);
  const running = endsAt != null && remainingMs > 0;
  const finished = endsAt != null && remainingMs === 0;
  const stage = stageFor(remainingMs, running, finished);
  const display = endsAt == null ? null : formatRemaining(remainingMs);

  useEffect(() => {
    if (endsAt == null) return;

    if (
      remainingMs > 0 &&
      remainingMs <= FIVE_MS &&
      remainingMs > FIVE_MS - FIVE_ANNOUNCE_WINDOW_MS &&
      !announcedFiveRef.current
    ) {
      announcedFiveRef.current = true;
      writeStored({ endsAt, warnedAt: lastWarnedRef.current, announcedFive: true });
      playTone(warningAudioRef.current);
      speakFiveMinutesRemaining();
    }

    if (remainingMs > 0 && remainingMs <= ONE_MS) {
      const since = now - lastWarnedRef.current;
      if (lastWarnedRef.current === 0 || since >= WARNING_REPEAT_MS) {
        lastWarnedRef.current = now;
        writeStored({
          endsAt,
          warnedAt: now,
          announcedFive: announcedFiveRef.current,
        });
        playTone(warningAudioRef.current);
      }
    }

    if (remainingMs === 0 && !finishedRef.current) {
      finishedRef.current = true;
      playTone(finalAudioRef.current);
      writeStored({
        endsAt,
        warnedAt: lastWarnedRef.current || now,
        announcedFive: announcedFiveRef.current,
      });
    }
  }, [endsAt, remainingMs, now]);

  function unlockAudio(skipWarning = false) {
    const warn = skipWarning ? null : warningAudioRef.current;
    const fin = finalAudioRef.current;
    for (const a of [warn, fin]) {
      if (!a) continue;
      a.muted = true;
      void a
        .play()
        .then(() => {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        })
        .catch(() => {
          a.muted = false;
        });
    }
    try {
      window.speechSynthesis.getVoices();
    } catch {
      /* ignore */
    }
  }

  function startMinutes(minutes: number) {
    const ms = Math.max(1, Math.round(minutes * 60_000));
    const nextEnds = Date.now() + ms;
    const atFive = ms <= FIVE_MS && ms > FIVE_MS - FIVE_ANNOUNCE_WINDOW_MS;
    unlockAudio(atFive);
    finishedRef.current = false;
    lastWarnedRef.current = 0;
    announcedFiveRef.current = atFive;
    setEndsAt(nextEnds);
    setNow(Date.now());
    writeStored({ endsAt: nextEnds, announcedFive: atFive });
    if (atFive) {
      if (warningAudioRef.current) warningAudioRef.current.muted = false;
      playTone(warningAudioRef.current);
      speakFiveMinutesRemaining();
    }
    setOpen(false);
  }

  function clearTimer() {
    setEndsAt(null);
    setNow(Date.now());
    lastWarnedRef.current = 0;
    finishedRef.current = false;
    announcedFiveRef.current = false;
    writeStored(null);
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  function startCustom() {
    const minutes = Number.parseFloat(customMin);
    if (!Number.isFinite(minutes) || minutes <= 0) return;
    startMinutes(minutes);
  }

  if (!ready) {
    return (
      <span
        className="inline-flex h-7 min-w-[3.25rem] items-center justify-center"
        aria-hidden
      />
    );
  }

  const flashClass =
    stage === "yellow" && !reducedMotion
      ? "nav-timer-yellow"
      : stage === "yellow"
        ? "bg-yellow-400 text-yellow-950"
        : stage === "red-outline"
          ? "bg-white text-red-700 ring-2 ring-red-600"
          : (stage === "red-flash" || stage === "done") && !reducedMotion
            ? "nav-timer-flash"
            : stage === "red-flash" || stage === "done"
              ? "bg-red-600 text-white"
              : "bg-white/15 text-white hover:bg-white/25";

  const overlayClass =
    stage === "yellow"
      ? reducedMotion
        ? "shadow-[inset_0_0_0_18px_rgb(250_204_21)]"
        : "screen-timer-yellow-frame"
      : stage === "red-outline"
        ? "screen-timer-red-outline"
        : stage === "red-flash" || stage === "done"
          ? reducedMotion
            ? "bg-red-600/30"
            : "screen-timer-flash"
          : null;

  return (
    <div ref={rootRef} className="relative shrink-0">
      {overlayClass
        ? createPortal(
            <div
              className={`pointer-events-none fixed inset-0 z-[80] ${overlayClass}`}
              aria-hidden
            />,
            document.body,
          )
        : null}
      <audio
        ref={warningAudioRef}
        src="/media/timer-warning.wav"
        preload="auto"
        aria-hidden
      />
      <audio
        ref={finalAudioRef}
        src="/media/timer-final.wav"
        preload="auto"
        aria-hidden
      />

      {running || finished ? (
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={`inline-flex h-7 min-w-[3.5rem] items-center justify-center rounded-md px-2 font-mono text-[0.8125rem] font-semibold tabular-nums leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ua-evergreen)] ${flashClass}`}
            aria-live="polite"
            aria-atomic="true"
            aria-label={
              finished
                ? "Timer finished"
                : stage === "yellow"
                  ? `Timer warning, ${display} remaining`
                  : `Timer, ${display} remaining`
            }
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
          >
            {display}
          </button>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/35 text-sm leading-none text-white/95 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ua-evergreen)]"
            aria-label="Clear timer"
            title="Clear"
            onClick={clearTimer}
          >
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="inline-flex h-7 items-center justify-center rounded-md border border-white/35 px-2 text-[0.75rem] font-medium leading-none text-white/95 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ua-evergreen)]"
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="dialog"
          onClick={() => setOpen((v) => !v)}
        >
          Timer
        </button>
      )}

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Set countdown timer"
          className="absolute top-[calc(100%+0.45rem)] right-0 z-50 w-[15.5rem] rounded-lg border border-stone-200 bg-white p-3 text-left text-stone-900 shadow-lg"
        >
          <p className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
            Duration
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {PRESETS_MIN.map((m) => (
              <button
                key={m}
                type="button"
                className="rounded-md border border-stone-200 bg-stone-50 px-1.5 py-1.5 text-xs font-semibold text-stone-800 hover:border-emerald-600 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                onClick={() => startMinutes(m)}
              >
                {m}m
              </button>
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5">
            <label className="sr-only" htmlFor={`${panelId}-custom`}>
              Custom minutes
            </label>
            <input
              id={`${panelId}-custom`}
              type="number"
              min={1}
              max={600}
              step={1}
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") startCustom();
              }}
              className="min-w-0 flex-1 rounded-md border border-stone-200 px-2 py-1.5 text-sm tabular-nums text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              placeholder="min"
            />
            <button
              type="button"
              className="rounded-md bg-[var(--ua-evergreen)] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0a4d33] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              onClick={startCustom}
            >
              Start
            </button>
          </div>
          {endsAt != null ? (
            <button
              type="button"
              className="mt-2 w-full rounded-md px-2 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              onClick={clearTimer}
            >
              Clear timer
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
