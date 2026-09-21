"use client";

import Image from "next/image";
import { FormEvent, useEffect, useId, useState } from "react";

const STORAGE_KEY = "ua-community-home";
const PASSCODE = "67";
const CAMPUS = { lat: 42.2418, lon: -71.1662 };
const CAMPUS_MILES = 3.5;

const QUOTES = [
  {
    text: "If, according to times and circumstances, the need arises to make new rules or do something differently, do it prudently and with good advice.",
    source: "St. Angela Merici, Last Legacy",
  },
  {
    text: "You must not be afraid.",
    source: "St. Angela Merici",
  },
  {
    text: "Strive to seek out the means and ways to advance.",
    source: "St. Angela Merici",
  },
] as const;

function campusMapSrc() {
  const pad = 0.035;
  const bbox = [
    CAMPUS.lon - pad,
    CAMPUS.lat - pad * 0.7,
    CAMPUS.lon + pad,
    CAMPUS.lat + pad * 0.7,
  ].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${CAMPUS.lat}%2C${CAMPUS.lon}`;
}

function milesFromCampus(lat: number, lon: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat - CAMPUS.lat);
  const dLon = toRad(lon - CAMPUS.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(CAMPUS.lat)) *
      Math.cos(toRad(lat)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * 3958.8 * Math.asin(Math.sqrt(a));
}

export function HomeCommunityGate() {
  const quoteId = useId();
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [incorrect, setIncorrect] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [offCampus, setOffCampus] = useState(false);

  useEffect(() => {
    setUnlocked(localStorage.getItem(STORAGE_KEY) === "ok");
    setReady(true);
  }, []);

  useEffect(() => {
    if (unlocked || !ready) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [unlocked, ready]);

  useEffect(() => {
    if (unlocked) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = window.setInterval(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [unlocked]);

  useEffect(() => {
    if (!ready || unlocked || !navigator.geolocation) return;
    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        setOffCampus(
          milesFromCampus(pos.coords.latitude, pos.coords.longitude) >
            CAMPUS_MILES,
        );
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
    return () => {
      cancelled = true;
    };
  }, [ready, unlocked]);

  function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passcode.trim() === PASSCODE) {
      localStorage.setItem(STORAGE_KEY, "ok");
      setUnlocked(true);
      setIncorrect(false);
      return;
    }
    setIncorrect(true);
  }

  if (!ready || unlocked) return null;

  const quote = QUOTES[quoteIndex];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(13,92,61,0.28)] p-4 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ua-community-title"
        className="max-h-[min(90vh,44rem)] w-full max-w-xl overflow-y-auto rounded-md border border-[rgba(13,92,61,0.28)] bg-[#FFFDF7] shadow-[0_24px_60px_rgba(11,61,46,0.28)]"
      >
        <div className="flex items-center gap-3 bg-[var(--ua-evergreen)] px-5 py-3.5 text-white sm:px-6">
          <Image
            src="/media/branded/ua-seal.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-emerald-100 uppercase">
              Ursuline Community
            </p>
            <h2
              id="ua-community-title"
              className="font-serif text-xl leading-tight sm:text-2xl"
            >
              Welcome to Code with Brett
            </h2>
          </div>
        </div>
        <div className="h-1 bg-[#D6B55B]" aria-hidden />

        <figure
          className="border-b border-[rgba(13,92,61,0.12)] bg-[#EAF3ED] px-5 py-3 sm:px-6"
          aria-live="polite"
        >
          <blockquote
            key={quoteId + quoteIndex}
            className="font-serif text-sm leading-snug text-[#14382A] sm:text-[0.95rem]"
          >
            “{quote.text}”
          </blockquote>
          <figcaption className="mt-1 text-[0.65rem] font-semibold tracking-[0.08em] text-[#1F4D3A] uppercase">
            — {quote.source}
          </figcaption>
        </figure>

        <form onSubmit={unlock} className="px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-sm text-stone-700">
            This space is for the Ursuline community. Enter the community
            passcode to continue.
          </p>

          {offCampus ? (
            <p className="mt-3 rounded-md border border-[rgba(13,92,61,0.18)] bg-[#EAF3ED] px-3 py-2.5 text-sm text-[#14382A]">
              We noticed you’re trying to access this website outside of campus.
            </p>
          ) : null}

          <div className="mt-4 overflow-hidden rounded-md border border-[rgba(13,92,61,0.18)]">
            <iframe
              title="Ursuline Academy Dedham"
              src={campusMapSrc()}
              className="h-36 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <p className="bg-white px-3 py-2 text-xs font-medium text-[#14382A]">
              Ursuline Academy · 85 Lowder Street, Dedham
            </p>
          </div>

          <label
            htmlFor="ua-community-passcode"
            className="mt-5 block text-sm font-semibold text-stone-800"
          >
            Community passcode
          </label>
          <input
            id="ua-community-passcode"
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={2}
            value={passcode}
            onChange={(event) => {
              setPasscode(event.target.value);
              setIncorrect(false);
            }}
            aria-invalid={incorrect}
            aria-describedby={incorrect ? "ua-community-passcode-error" : undefined}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-center text-xl tracking-[0.3em] text-stone-900 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-none"
          />
          {incorrect ? (
            <p
              id="ua-community-passcode-error"
              role="alert"
              className="mt-2 text-sm text-red-700"
            >
              That passcode is not correct.
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
