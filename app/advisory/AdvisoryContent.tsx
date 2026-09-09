"use client";

import Image from "next/image";
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

type ScheduleItem = {
  time: string;
  title: string;
  detail?: string;
  nested?: { label: string; time: string }[];
};

const ORIENTATION_SCHEDULE: ScheduleItem[] = [
  {
    time: "8:00–8:15",
    title: "Advisory — Prayer and Pledge",
    detail: "Advisory Locations · All-Student Welcome!",
  },
  {
    time: "8:15–8:45",
    title: "Bethlehem Farm Presentation / Athletic and Theatre Plug",
    detail: "RC Gym",
  },
  {
    time: "8:45–8:55",
    title: "Break — Club Fair",
  },
  {
    time: "8:55–9:15",
    title: "A Block",
    detail: "Assigned Classrooms · 30-minute classes",
  },
  {
    time: "9:20–9:50",
    title: "B Block",
  },
  {
    time: "9:55–10:25",
    title: "C Block",
  },
  {
    time: "10:30–11:00",
    title: "D Block",
  },
  {
    time: "11:05–11:35",
    title: "E Block",
  },
  {
    time: "11:40–12:45",
    title: "Lunch / Tea Room",
    nested: [
      { label: "Lunch 1", time: "11:40–12:10 · Class 12:15–12:45" },
      { label: "Lunch 2", time: "Class 11:40–12:10 · Lunch 12:15–12:45" },
    ],
  },
  {
    time: "12:50–1:20",
    title: "F Block",
  },
  {
    time: "1:25–1:55",
    title: "G Block",
  },
  {
    time: "2:00–2:30",
    title: "H Block",
  },
  {
    time: "2:30–2:46",
    title: "Advisory — Kahoot about Student Expectations",
    detail: "Advisory Locations",
  },
];

const SESSION_KEY = "advisory-access";

/** Same natural date style as the homepage `TodayDate` (without the live clock). */
function formatAdvisoryDate(date: Date) {
  const day = date.getDate();
  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? "th"
      : day % 10 === 1
        ? "st"
        : day % 10 === 2
          ? "nd"
          : day % 10 === 3
            ? "rd"
            : "th";
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(date);
  const month = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(date);

  return `${weekday}, ${month} ${day}${suffix}`;
}

export function AdvisoryContent() {
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SESSION_KEY) === "granted");
    setToday(new Date());
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
        className="ua-card ua-shadow-soft overflow-hidden"
        aria-labelledby="orientation-day2-heading"
      >
        <div className="border-b border-emerald-800/15 bg-[linear-gradient(135deg,#eef5ef_0%,#f7f4ec_100%)] px-5 py-4 sm:px-7 sm:py-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-emerald-800 uppercase">
            Advisory · Schedule
          </p>
          <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h2
              id="orientation-day2-heading"
              className="font-serif text-2xl leading-tight text-stone-900 sm:text-3xl"
            >
              All Student Orientation Day 2
            </h2>
            <time
              dateTime={today?.toISOString()}
              className="shrink-0 text-sm font-semibold text-stone-700 sm:text-base"
            >
              {today ? formatAdvisoryDate(today) : "\u00A0"}
            </time>
          </div>
        </div>

        <ol className="divide-y divide-emerald-900/8 px-3 py-2 sm:px-4">
          {ORIENTATION_SCHEDULE.map((item) => (
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
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
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
  );
}
