"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { BestSelvesActivity } from "./BestSelvesActivity";

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

type ScheduleItem = {
  time: string;
  title: string;
  detail?: string;
  nested?: { label: string; time: string; detail?: string }[];
};

const MASS_SCHEDULE: ScheduleItem[] = [
  { time: "8:00–8:07", title: "Advisory" },
  { time: "8:10–8:40", title: "D Block" },
  { time: "8:43–9:13", title: "E Block" },
  { time: "9:16–9:46", title: "F Block" },
  { time: "9:49–10:10", title: "Break" },
  { time: "10:13–10:43", title: "G Block" },
  { time: "10:46–11:16", title: "A Block" },
  { time: "11:19–11:49", title: "H1" },
  { time: "11:51–12:21", title: "H2" },
  { time: "12:25–12:55", title: "B Block" },
  { time: "1:00–2:00", title: "Holy Spirit Mass" },
  { time: "2:10–2:45", title: "Advisory" },
];

const MASS_SEATING_URL =
  "https://docs.google.com/spreadsheets/d/1uvD2PyJvUQRa7BvlVCOGNvgkafJ2ffy0hg1ooslDMJs/edit?gid=0#gid=0";
const SESSION_KEY = "advisory-access";
const MASS_DATE_LABEL = "Friday, September 18th";
const MASS_DATE_ISO = "2026-09-18";

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
            Passcode required
          </p>
          <h2 className="mt-2 font-serif text-3xl text-stone-900">
            Enter passcode
          </h2>
          <p className="mt-2 text-sm font-semibold text-[var(--ua-evergreen)]">
            <time dateTime={MASS_DATE_ISO}>{MASS_DATE_LABEL}</time>
            <span className="font-normal text-stone-500"> · </span>
            Day 6 · Holy Spirit Mass
          </p>
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
    <div className="my-6 flex flex-1 flex-col gap-5 sm:my-8">
      <section
        aria-label="Notices"
        className="ua-card ua-shadow-soft divide-y divide-emerald-900/8 overflow-hidden text-sm"
      >
        <p className="flex items-center gap-2.5 px-4 py-2.5 text-stone-700 sm:px-5">
          <span aria-hidden className="shrink-0 text-base leading-none">🩺</span>
          <span className="font-semibold text-stone-900">Health forms due</span>
        </p>
        <p className="flex items-center gap-2.5 px-4 py-2.5 text-stone-700 sm:px-5">
          <span aria-hidden className="shrink-0 text-base leading-none">🫖</span>
          <span>Don&rsquo;t leave belongings in the Tea Room.</span>
        </p>
        <p className="flex items-center gap-2.5 px-4 py-2.5 text-stone-700 sm:px-5">
          <span aria-hidden className="shrink-0 text-base leading-none">🧹</span>
          <span>Help keep our campus clean.</span>
        </p>
      </section>

      <BestSelvesActivity />

      <section
        className="ua-card ua-shadow-soft overflow-hidden"
        aria-labelledby="mass-schedule-heading"
      >
        <div className="border-b border-emerald-800/15 bg-[linear-gradient(135deg,#eef5ef_0%,#f7f4ec_100%)] px-5 py-4 sm:px-7 sm:py-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-emerald-800 uppercase">
            Advisory · Schedule
          </p>
          <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h2
              id="mass-schedule-heading"
              className="font-serif text-2xl leading-tight text-stone-900 sm:text-3xl"
            >
              Day 6 · Holy Spirit Mass
            </h2>
            <time
              dateTime={MASS_DATE_ISO}
              className="shrink-0 text-sm font-semibold text-stone-700 sm:text-base"
            >
              {MASS_DATE_LABEL}
            </time>
          </div>
        </div>

        <ol className="divide-y divide-emerald-900/8 px-3 py-2 sm:px-4">
          {MASS_SCHEDULE.map((item) => (
            <li
              key={`${item.time}-${item.title}`}
              className="grid grid-cols-[6.5rem_1fr] gap-3 px-2 py-2.5 sm:grid-cols-[7.5rem_1fr] sm:gap-4 sm:px-3 sm:py-3"
            >
              <time className="pt-0.5 text-sm font-bold tabular-nums text-[var(--ua-evergreen)] sm:text-base">
                {item.time}
              </time>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug text-stone-900 sm:text-base">
                  {item.title}
                </p>
                {item.detail ? (
                  <p className="mt-0.5 text-xs leading-snug text-stone-600 sm:text-sm">
                    {item.detail}
                  </p>
                ) : null}
                {item.nested ? (
                  <ul className="mt-2 space-y-1.5">
                    {item.nested.map((row) => (
                      <li
                        key={row.label}
                        className="rounded-lg bg-emerald-50/80 px-2.5 py-1.5 text-xs text-stone-700 ring-1 ring-emerald-800/10 sm:text-sm"
                      >
                        <span className="font-semibold text-stone-900">
                          {row.label}
                        </span>
                        <span className="mt-0.5 block tabular-nums text-emerald-900/80">
                          {row.time}
                        </span>
                        {row.detail ? (
                          <span className="mt-0.5 block text-stone-600">
                            {row.detail}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        <p className="border-t border-emerald-900/8 px-5 py-3 text-xs text-stone-500 sm:px-7">
          Modified schedule for Holy Spirit Mass.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section
          className="ua-card ua-shadow-soft flex px-6 py-8 sm:px-8 sm:py-10"
          aria-labelledby="ursuline-prayer-heading"
        >
          <div className="mx-auto w-full max-w-xl text-center">
            <h2
              id="ursuline-prayer-heading"
              className="font-serif text-2xl text-stone-900 sm:text-3xl"
            >
              Ursuline Prayer
            </h2>
            <blockquote className="mt-5 space-y-3 font-serif text-lg leading-relaxed text-stone-800 sm:text-xl sm:leading-relaxed">
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
              <p className="pt-1 font-semibold text-[var(--ua-evergreen)]">
                Amen.
              </p>
            </blockquote>
          </div>
        </section>

        <section
          className="ua-card ua-shadow-soft flex px-6 py-8 sm:px-8 sm:py-10"
          aria-labelledby="pledge-heading"
        >
          <div className="mx-auto w-full max-w-xl text-center">
            <div className="flex items-center justify-center gap-3">
              <Image
                src="/media/branded/us-flag.svg"
                alt="American flag"
                width={56}
                height={30}
                className="h-7 w-12 shrink-0 rounded-sm shadow-sm ring-1 ring-stone-300/70 sm:h-8 sm:w-14"
              />
              <h2
                id="pledge-heading"
                className="font-serif text-2xl text-stone-900 sm:text-3xl"
              >
                Pledge of Allegiance
              </h2>
            </div>
            <blockquote className="mt-5 font-serif text-lg leading-relaxed text-stone-800 sm:text-xl sm:leading-relaxed">
              <p>
                I pledge allegiance to the Flag of the United States of America,
                and to the Republic for which it stands, one Nation under God,
                indivisible, with liberty and justice for all.
              </p>
            </blockquote>
          </div>
        </section>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <a
          href={MASS_SEATING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ua-card ua-shadow-soft flex flex-col overflow-hidden p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
          aria-label="Open the Mass seating chart in Google Sheets"
        >
          <p className="text-xs font-semibold tracking-[0.16em] text-emerald-800 uppercase">
            Chapel
          </p>
          <h2 className="mt-1 font-serif text-2xl text-stone-900 sm:text-3xl">
            Mass Seating Chart
          </h2>
          <Image
            src="/media/advisory/mass-seating-chart.svg"
            alt=""
            width={640}
            height={220}
            className="mt-3 w-full rounded-xl ring-1 ring-stone-200"
          />
          <span className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b4a33]">
            Open seating chart ↗
          </span>
        </a>

        <section
          className="ua-card ua-shadow-soft p-6 sm:p-8"
          aria-labelledby="locker-heading"
        >
          <h2 id="locker-heading" className="font-serif text-3xl text-stone-900">
            Locker Assignments
          </h2>
          <table className="mt-5 w-full max-w-md border-collapse text-left">
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
    </div>
  );
}
