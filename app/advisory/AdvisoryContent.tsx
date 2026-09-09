"use client";

import { FormEvent, useEffect, useState } from "react";

const LOCKERS = [
  ["SC", "474"],
  ["GF", "475"],
  ["RH", "476"],
  ["AO", "477"],
  ["CW", "478"],
  ["CC", "479"],
  ["IM", "480"],
  ["ON", "481"],
  ["CP", "482"],
  ["AH", "483"],
] as const;

const SESSION_KEY = "advisory-access";

export function AdvisoryContent() {
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [incorrect, setIncorrect] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SESSION_KEY) === "granted");
  }, []);

  function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passcode === "118") {
      sessionStorage.setItem(SESSION_KEY, "granted");
      setUnlocked(true);
      setIncorrect(false);
      return;
    }

    setIncorrect(true);
  }

  if (!unlocked) {
    return (
      <section className="ua-card ua-shadow-soft my-6 flex flex-1 items-center justify-center px-6 py-10 sm:my-8 sm:px-12 sm:py-14">
        <form onSubmit={unlock} className="w-full max-w-sm text-center">
          <p className="text-xs font-semibold tracking-[0.16em] text-emerald-800 uppercase">
            Advisory access
          </p>
          <h2 className="mt-2 font-serif text-3xl text-stone-900">
            Enter passcode
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            This is a casual client-side gate for Advisory materials, not
            secure authentication.
          </p>
          <label
            htmlFor="advisory-passcode"
            className="mt-6 block text-left text-sm font-semibold text-stone-800"
          >
            Passcode
          </label>
          <input
            id="advisory-passcode"
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={3}
            value={passcode}
            onChange={(event) => {
              setPasscode(event.target.value);
              setIncorrect(false);
            }}
            aria-invalid={incorrect}
            aria-describedby={incorrect ? "passcode-error" : undefined}
            className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-center text-xl tracking-[0.3em] text-stone-900 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-none"
          />
          {incorrect ? (
            <p id="passcode-error" role="alert" className="mt-2 text-sm text-red-700">
              That passcode is not correct.
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
          >
            Open Advisory
          </button>
        </form>
      </section>
    );
  }

  return (
    <div className="my-6 grid flex-1 gap-5 sm:my-8 lg:grid-cols-[1.6fr_0.8fr]">
      <section
        className="ua-card ua-shadow-soft flex items-center justify-center px-6 py-10 sm:px-12 sm:py-14"
        aria-labelledby="ursuline-prayer-heading"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.16em] text-emerald-800 uppercase">
            Advisory
          </p>
          <h2
            id="ursuline-prayer-heading"
            className="mt-2 font-serif text-3xl text-stone-900 sm:text-4xl"
          >
            Ursuline Prayer
          </h2>
          <blockquote className="mt-6 space-y-4 font-serif text-xl leading-relaxed text-stone-800 sm:text-2xl sm:leading-relaxed">
            <p>
              Gracious God, let us remain in harmony, united together all of one
              heart and one will.
            </p>
            <p>
              Let us be bound to one another by the bond of love, respecting
              each other, helping each other, and bearing with each other in
              Jesus Christ.
            </p>
            <p>
              For if we try to be like this, without any doubt, the Lord God
              will be in our midst.
            </p>
            <p className="pt-2 font-semibold text-[var(--ua-evergreen)]">
              Amen.
            </p>
          </blockquote>
        </div>
      </section>

      <section
        className="ua-card ua-shadow-soft p-6 sm:p-8"
        aria-labelledby="locker-heading"
      >
        <p className="text-xs font-semibold tracking-[0.16em] text-emerald-800 uppercase">
          Advisory
        </p>
        <h2 id="locker-heading" className="mt-1 font-serif text-3xl text-stone-900">
          Locker Assignments
        </h2>
        <table className="mt-5 w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-emerald-800 text-xs tracking-wide text-stone-600 uppercase">
              <th scope="col" className="px-2 py-2 font-semibold">
                Initials
              </th>
              <th scope="col" className="px-2 py-2 text-right font-semibold">
                Locker
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {LOCKERS.map(([initials, locker]) => (
              <tr key={locker}>
                <th scope="row" className="px-2 py-2.5 font-semibold text-stone-900">
                  {initials}
                </th>
                <td className="px-2 py-2.5 text-right tabular-nums text-stone-700">
                  {locker}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
