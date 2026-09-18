"use client";

import { FormEvent, type ReactNode, useEffect, useState } from "react";

const SESSION_KEY = "course-access";
const COURSE_PASSCODE = "67";

export function CoursePasscodeGate({
  courseTitle,
  children,
}: {
  courseTitle: string;
  children: ReactNode;
}) {
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [incorrect, setIncorrect] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SESSION_KEY) === "granted");
  }, []);

  function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passcode === COURSE_PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, "granted");
      setUnlocked(true);
      setIncorrect(false);
      return;
    }

    setIncorrect(true);
  }

  if (!unlocked) {
    return (
      <section className="mx-auto my-6 flex min-h-[60vh] max-w-5xl flex-1 items-center justify-center px-5 sm:my-8 sm:px-6">
        <form
          onSubmit={unlock}
          className="ua-card ua-shadow-soft w-full max-w-sm px-6 py-10 text-center sm:px-12 sm:py-14"
        >
          <p className="text-xs font-semibold tracking-[0.16em] text-emerald-800 uppercase">
            Passcode required
          </p>
          <h2 className="mt-2 font-serif text-3xl text-stone-900">
            Enter passcode
          </h2>
          <p className="mt-2 text-sm font-semibold text-[var(--ua-evergreen)]">
            {courseTitle}
          </p>
          <label
            htmlFor="course-passcode"
            className="mt-6 block text-left text-sm font-semibold text-stone-800"
          >
            Passcode
          </label>
          <input
            id="course-passcode"
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
            aria-describedby={incorrect ? "course-passcode-error" : undefined}
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-center text-xl tracking-[0.3em] text-stone-900 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-none"
          />
          {incorrect ? (
            <p
              id="course-passcode-error"
              role="alert"
              className="mt-2 text-sm text-red-700"
            >
              That passcode is not correct.
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
          >
            Open class
          </button>
        </form>
      </section>
    );
  }

  return <>{children}</>;
}
