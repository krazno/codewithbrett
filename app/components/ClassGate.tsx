"use client";

import { FormEvent, useEffect, useState } from "react";

type Props = {
  courseSlug: string;
  courseTitle: string;
  passcode: string;
  children: React.ReactNode;
};

function storageKey(slug: string) {
  return `cwb_class_unlock_${slug}`;
}

export function ClassGate({
  courseSlug,
  courseTitle,
  passcode,
  children,
}: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey(courseSlug)) === "1") {
        setUnlocked(true);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [courseSlug]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.trim().toUpperCase() === passcode.toUpperCase()) {
      try {
        sessionStorage.setItem(storageKey(courseSlug), "1");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
      setError("");
      return;
    }
    setError("That passcode doesn’t match — try again.");
    setValue("");
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center text-sm text-stone-600">
        Loading…
      </div>
    );
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(13,92,61,0.55)] p-4 backdrop-blur-sm">
      <div className="ua-card ua-shadow-soft w-full max-w-sm p-6 text-center">
        <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
          Class access
        </p>
        <h1 className="mt-2 font-serif text-2xl text-stone-900">{courseTitle}</h1>
        <p className="mt-2 text-sm text-stone-600">
          Enter the passcode Brett shared in class.
        </p>
        <form onSubmit={onSubmit} className="mt-5 space-y-3" autoComplete="off">
          <input
            type="password"
            inputMode="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Passcode"
            aria-label={`${courseTitle} passcode`}
            className="w-full rounded-xl border border-[rgba(32,37,34,0.18)] bg-white px-4 py-3 text-center text-base tracking-widest outline-none focus:border-[var(--ua-evergreen)]"
            autoFocus
          />
          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33]"
          >
            Unlock
          </button>
        </form>
        <a
          href="/"
          className="mt-4 inline-block text-sm text-stone-600 underline underline-offset-2 hover:text-[var(--ua-evergreen)]"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
