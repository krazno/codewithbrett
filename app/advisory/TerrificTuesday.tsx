"use client";

import { useEffect, useRef, useState } from "react";

const CAMPUS = { lat: 42.2418, lon: -71.1662 };
const MOVIE_HREF =
  "https://dedhamcommunitytheatre.com/movies/virginia_woolfs_night_day";
const MOVIE_IMG =
  "https://dedhamcommunitytheatre.com/_uploads/movies/virginia_woolfs_night_day.jpg";
const WALK_HREF =
  "https://www.google.com/maps/dir/?api=1&origin=85+Lowder+Street,+Dedham,+MA+02026&destination=580+High+Street,+Dedham,+MA+02026&travelmode=walking";

const DAY = {
  iso: "2026-09-22",
  label: "Tuesday, September 22nd",
};

const SCHEDULE = [
  { time: "8:00", title: "Meet in advisory" },
  { time: "8:05–8:10", title: "Walk to the theater" },
  { time: "8:30–9:00", title: "Arrive · concessions cash only" },
  { time: "9:00–9:30", title: "Q&A with Rep. Paul McMurtry" },
  { time: "9:30–11:10", title: "Night & Day" },
  { time: "11:10–11:30", title: "Ice cream if you brought cash" },
  { time: "11:30–12:00", title: "Walk back to campus" },
  { time: "12:00–12:45", title: "Lunch + film talk" },
  { time: "12:45", title: "Dismissal for 10th & 11th" },
] as const;

const BRING = [
  { emoji: "🥪", text: "Your lunch" },
  { emoji: "💧", text: "Refillable water bottle" },
  { emoji: "💚", text: "Spirit wear" },
  { emoji: "👟", text: "Clothes for the walk and the weather" },
  { emoji: "💵", text: "Small bills if you want snacks or ice cream" },
] as const;

function weatherCopy(code: number) {
  if (code === 0) return { emoji: "☀️", label: "Sunny" };
  if (code <= 3) return { emoji: "⛅", label: "Partly cloudy" };
  if (code <= 48) return { emoji: "🌫️", label: "Foggy" };
  if (code <= 67) return { emoji: "🌧️", label: "Rainy" };
  if (code <= 77) return { emoji: "❄️", label: "Snowy" };
  if (code <= 82) return { emoji: "🌦️", label: "Showers" };
  return { emoji: "⛈️", label: "Stormy" };
}

export function AdvisoryWeather() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${CAMPUS.lat}&longitude=${CAMPUS.lon}` +
      `&current=temperature_2m,weather_code` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code` +
      `&timezone=America%2FNew_York&forecast_days=1&temperature_unit=fahrenheit`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: {
        current?: { temperature_2m?: number; weather_code?: number };
        daily?: {
          temperature_2m_max?: number[];
          temperature_2m_min?: number[];
          precipitation_probability_max?: number[];
          weather_code?: number[];
        };
      }) => {
        if (cancelled) return;
        const code = data.current?.weather_code ?? data.daily?.weather_code?.[0] ?? 1;
        const now = Math.round(data.current?.temperature_2m ?? 0);
        const high = Math.round(data.daily?.temperature_2m_max?.[0] ?? now);
        const low = Math.round(data.daily?.temperature_2m_min?.[0] ?? now);
        const rain = data.daily?.precipitation_probability_max?.[0] ?? 0;
        const { emoji, label } = weatherCopy(code);
        setText(
          `${emoji} ${label} · ${now}° now · ${high}° / ${low}° · ${rain}% rain`,
        );
      })
      .catch(() => {
        if (!cancelled) setText(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!text) return null;

  return (
    <p className="flex items-center gap-2.5 px-4 py-2.5 text-stone-700 sm:px-5">
      <span className="font-semibold text-stone-900">Dedham weather</span>
      <span className="text-sm">{text}</span>
    </p>
  );
}

function MovieRow() {
  const [broken, setBroken] = useState(false);

  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
      <a
        href={MOVIE_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 overflow-hidden rounded-xl border border-stone-200 bg-white text-left hover:bg-emerald-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
      >
        {broken ? (
          <div className="flex h-14 w-10 shrink-0 items-center justify-center bg-[#F8EEF5] text-lg" aria-hidden>
            🎬
          </div>
        ) : (
          <img
            src={MOVIE_IMG}
            alt=""
            width={40}
            height={56}
            className="h-14 w-10 shrink-0 object-cover"
            onError={() => setBroken(true)}
          />
        )}
        <span className="min-w-0 py-1.5 pr-3">
          <span className="block font-serif text-base leading-tight text-stone-900">
            Virginia Woolf’s Night &amp; Day
          </span>
          <span className="block text-xs text-stone-600">
            Dedham Community Theatre · Movie page ↗
          </span>
        </span>
      </a>
      <a
        href={WALK_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-emerald-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
      >
        Walk · 0.8 mi · ~20 min ↗
      </a>
    </div>
  );
}

export function TerrificTuesdayModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(13,92,61,0.28)] p-3 backdrop-blur-md sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tt-title"
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-[rgba(13,92,61,0.22)] bg-[#FFFDF7] shadow-[0_24px_60px_rgba(11,61,46,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-1 bg-[var(--ua-evergreen)] px-5 py-3 text-white sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-emerald-100 uppercase">
              Terrific Tuesday
            </p>
            <h2 id="tt-title" className="font-serif text-2xl leading-tight">
              Your day at the movies
            </h2>
          </div>
          <p className="pb-0.5 text-sm text-emerald-50">
            <time dateTime={DAY.iso}>{DAY.label}</time>
          </p>
        </div>
        <div className="h-1 bg-[#D6B55B]" aria-hidden />

        <div className="space-y-3 px-5 py-4">
          <MovieRow />

          <ol className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {SCHEDULE.map((item) => (
              <li key={item.time} className="flex items-baseline gap-2">
                <time className="w-[4.75rem] shrink-0 text-xs font-bold tabular-nums text-[var(--ua-evergreen)]">
                  {item.time}
                </time>
                <span className="min-w-0 text-sm leading-snug text-stone-800">
                  {item.title}
                </span>
              </li>
            ))}
          </ol>

          <ul className="flex flex-wrap gap-1.5">
            {BRING.map((item) => (
              <li
                key={item.text}
                className="rounded-full bg-[#EAF3ED] px-3 py-1 text-xs text-[#14382A]"
              >
                <span aria-hidden>{item.emoji} </span>
                {item.text}
              </li>
            ))}
          </ul>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
          >
            See you there
          </button>
        </div>
      </div>
    </div>
  );
}
