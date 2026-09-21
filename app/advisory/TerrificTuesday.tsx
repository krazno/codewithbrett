"use client";

import { useEffect, useRef, useState } from "react";

const CAMPUS = { lat: 42.2418, lon: -71.1662 };
const THEATER = { lat: 42.24807, lon: -71.17318 };
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
  { time: "7:45", title: "Optional chaperone check-in", detail: "Faculty room at 85 Lowder" },
  { time: "8:00", title: "Advisory & attendance", detail: "Normal start. Be in your seat." },
  { time: "8:05–8:10", title: "We walk", detail: "We leave once everyone is accounted for." },
  { time: "8:30–9:00", title: "Arrive at the theater", detail: "Concessions open. Cash only, small bills." },
  { time: "9:00–9:30", title: "Q&A", detail: "Rep. Paul McMurtry, theater owner." },
  { time: "9:30–11:10", title: "Night & Day", detail: "Virginia Woolf’s un-romantic comedy. 1 hr 35 min." },
  { time: "11:10–11:30", title: "Ron’s ice cream sandwiches", detail: "For students who brought cash." },
  { time: "11:30–12:00", title: "Walk back to campus", detail: "Stay with the group." },
  { time: "12:00–12:45", title: "Lunch in advisory", detail: "Film discussion together." },
  { time: "12:45", title: "Dismissal", detail: "10th and 11th are dismissed." },
] as const;

const BRING = [
  { emoji: "🥪", text: "Your lunch" },
  { emoji: "💧", text: "Refillable water bottle" },
  { emoji: "💚", text: "Spirit wear" },
  { emoji: "👟", text: "Clothes for the walk and the weather" },
  { emoji: "💵", text: "Small bills if you want snacks or ice cream" },
] as const;

function walkMapSrc() {
  const west = Math.min(CAMPUS.lon, THEATER.lon) - 0.006;
  const south = Math.min(CAMPUS.lat, THEATER.lat) - 0.004;
  const east = Math.max(CAMPUS.lon, THEATER.lon) + 0.006;
  const north = Math.max(CAMPUS.lat, THEATER.lat) + 0.004;
  const bbox = [west, south, east, north].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${THEATER.lat}%2C${THEATER.lon}`;
}

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

function MovieCard() {
  const [broken, setBroken] = useState(false);

  return (
    <a
      href={MOVIE_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="flex overflow-hidden rounded-2xl border border-stone-200 bg-white text-left hover:bg-emerald-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
    >
      {broken ? (
        <div className="flex h-28 w-20 shrink-0 items-center justify-center bg-[#F8EEF5] text-2xl" aria-hidden>
          🎬
        </div>
      ) : (
        <img
          src={MOVIE_IMG}
          alt=""
          width={80}
          height={112}
          className="h-28 w-20 shrink-0 object-cover"
          onError={() => setBroken(true)}
        />
      )}
      <span className="min-w-0 p-3">
        <span className="block text-[0.65rem] font-semibold tracking-[0.14em] text-emerald-800 uppercase">
          Today’s film
        </span>
        <span className="mt-0.5 block font-serif text-lg leading-tight text-stone-900">
          Virginia Woolf’s Night &amp; Day
        </span>
        <span className="mt-1 block text-sm text-stone-600">
          Dedham Community Theatre · 580 High Street
        </span>
        <span className="mt-1 inline-block text-sm font-semibold text-[var(--ua-evergreen)]">
          Movie page ↗
        </span>
      </span>
    </a>
  );
}

function WalkCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <iframe
        title="Walking map from Ursuline to Dedham Community Theatre"
        src={walkMapSrc()}
        className="h-40 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="px-3 py-2.5">
        <p className="font-serif text-base text-stone-900">
          Walk from 85 Lowder Street
        </p>
        <p className="mt-0.5 text-sm text-stone-600">
          About 0.8 miles · ~20 minutes at a group pace. Pin is the theater.
        </p>
        <a
          href={WALK_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-sm font-semibold text-[var(--ua-evergreen)]"
        >
          Open walking directions ↗
        </a>
      </div>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(13,92,61,0.28)] p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tt-title"
        className="max-h-[min(92vh,46rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-[rgba(13,92,61,0.22)] bg-[#FFFDF7] shadow-[0_24px_60px_rgba(11,61,46,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-[var(--ua-evergreen)] px-5 py-4 text-white sm:px-6">
          <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-emerald-100 uppercase">
            Terrific Tuesday · Day 8
          </p>
          <h2 id="tt-title" className="mt-0.5 font-serif text-2xl leading-tight">
            Night &amp; Day, here we come
          </h2>
          <p className="mt-1 text-sm text-emerald-50">
            <time dateTime={DAY.iso}>{DAY.label}</time>
            {" · "}A cute field-trip day. Stay with the group, be kind, have fun.
          </p>
        </div>
        <div className="h-1 bg-[#D6B55B]" aria-hidden />

        <div className="space-y-4 px-4 py-4 sm:px-5">
          <p className="rounded-2xl bg-[#F8EEF5] px-3 py-2 text-sm text-[#14382A]">
            Advisors: attendance at 8:00, then we walk. Please check that
            required advisory forms were completed and sent to parents.
          </p>

          <MovieCard />
          <WalkCard />

          <section>
            <h3 className="font-serif text-lg text-stone-900">The plan</h3>
            <ol className="mt-2 space-y-1.5">
              {SCHEDULE.map((item) => (
                <li
                  key={item.time}
                  className="grid grid-cols-[6.4rem_1fr] gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-stone-200"
                >
                  <time className="pt-0.5 text-xs font-bold tabular-nums text-[var(--ua-evergreen)]">
                    {item.time}
                  </time>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      {item.title}
                    </p>
                    <p className="text-xs leading-snug text-stone-600">
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h3 className="font-serif text-lg text-stone-900">Please bring</h3>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {BRING.map((item) => (
                <li
                  key={item.text}
                  className="rounded-2xl bg-[#EAF3ED] px-3 py-2 text-sm text-[#14382A]"
                >
                  <span aria-hidden>{item.emoji} </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="px-4 pb-5 sm:px-5">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
          >
            Got it — let’s have a great day
          </button>
        </div>
      </div>
    </div>
  );
}
