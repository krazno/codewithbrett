"use client";

import { useId, useState } from "react";

type Arm = "looks" | "sounds" | "feels";

const ARMS: { id: Arm; title: string; emoji: string; placeholder: string; tone: string }[] =
  [
    {
      id: "looks",
      title: "Looks like",
      emoji: "👀",
      placeholder: "Including someone new…",
      tone: "bg-[#EAF3ED]",
    },
    {
      id: "sounds",
      title: "Sounds like",
      emoji: "💬",
      placeholder: "You can sit with us…",
      tone: "bg-[#FBF6E8]",
    },
    {
      id: "feels",
      title: "Feels like",
      emoji: "💗",
      placeholder: "Safe and welcomed…",
      tone: "bg-[#F8EEF5]",
    },
  ];

const PROMPTS = [
  "What does kindness look like at Ursuline?",
  "What does respect sound like?",
  "How does it feel when someone includes you?",
  "What could make a new student feel welcome?",
  "How can we disagree while still respecting one another?",
  "What does empathy look like in a classroom?",
  "What can we do when we notice someone sitting alone?",
  "How can we make shared spaces feel cared for?",
  "What words help someone feel supported?",
  "What small action could improve someone’s day?",
];

const hit =
  "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] focus-visible:ring-offset-2";

export function BestSelvesActivity() {
  const formId = useId();
  const [notes, setNotes] = useState<Record<Arm, string[]>>({
    looks: [],
    sounds: [],
    feels: [],
  });
  const [drafts, setDrafts] = useState<Record<Arm, string>>({
    looks: "",
    sounds: "",
    feels: "",
  });
  const [promptIndex, setPromptIndex] = useState(0);
  const [commitment, setCommitment] = useState("");
  const [committed, setCommitted] = useState(false);

  function addNote(arm: Arm) {
    const text = drafts[arm].trim();
    if (!text) return;
    setNotes((current) => ({
      ...current,
      [arm]: [...current[arm], text].slice(-6),
    }));
    setDrafts((current) => ({ ...current, [arm]: "" }));
  }

  return (
    <section
      className="ua-card ua-shadow-soft p-5 sm:p-6"
      aria-labelledby="best-selves-heading"
    >
      <h2
        id="best-selves-heading"
        className="font-serif text-2xl text-stone-900 sm:text-3xl"
      >
        Living Our Best Selves at UA
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-stone-700">
        Small choices can help everyone feel seen, supported, and welcome. Let’s
        imagine the kind of community we want to create together.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="min-w-0 flex-1 font-serif text-base text-[#14382A] sm:text-lg">
          {PROMPTS[promptIndex]}
        </p>
        <button
          type="button"
          className={`${hit} shrink-0 bg-[#FBF6E8] text-[#14382A]`}
          onClick={() => setPromptIndex((i) => (i + 1) % PROMPTS.length)}
        >
          New prompt
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {ARMS.map((arm) => (
          <div key={arm.id} className={`rounded-2xl p-3 ${arm.tone}`}>
            <p className="font-serif text-lg text-stone-900">
              {arm.title} {arm.emoji}
            </p>
            <ul className="mt-2 min-h-[2.5rem] space-y-1">
              {notes[arm.id].map((note, index) => (
                <li
                  key={`${note}-${index}`}
                  className="rounded-xl bg-white px-2.5 py-1.5 text-sm text-stone-800"
                >
                  {note}
                </li>
              ))}
            </ul>
            <form
              className="mt-2 flex gap-1.5"
              onSubmit={(event) => {
                event.preventDefault();
                addNote(arm.id);
              }}
            >
              <label className="sr-only" htmlFor={`${formId}-${arm.id}`}>
                Add to {arm.title}
              </label>
              <input
                id={`${formId}-${arm.id}`}
                value={drafts[arm.id]}
                maxLength={80}
                placeholder={arm.placeholder}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    [arm.id]: event.target.value,
                  }))
                }
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 text-base focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              />
              <button
                type="submit"
                className={`${hit} w-11 shrink-0 bg-[var(--ua-evergreen)] px-0 text-white`}
                aria-label={`Add to ${arm.title}`}
              >
                +
              </button>
            </form>
          </div>
        ))}
      </div>

      <details className="mt-3 text-sm text-stone-700">
        <summary className="cursor-pointer font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B]">
          Need an idea?
        </summary>
        <p className="mt-2 text-stone-600">
          Looks like: inviting someone to join. Sounds like: “Are you okay?”
          Feels like: welcomed and valued.
        </p>
      </details>

      <div className="mt-4 border-t border-stone-200 pt-4">
        <h3 className="font-serif text-xl text-stone-900">One small choice</h3>
        <p className="mt-1 text-sm text-stone-700">
          What is one thing you can personally do today to help someone feel
          valued at UA?
        </p>
        {committed ? (
          <p className="mt-2 text-sm font-medium text-[#1F4D3A]" role="status">
            Beautiful choice. Small actions shape our community.
          </p>
        ) : (
          <form
            className="mt-2 flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              if (!commitment.trim()) return;
              setCommitted(true);
            }}
          >
            <label className="sr-only" htmlFor={`${formId}-commit`}>
              Personal commitment
            </label>
            <input
              id={`${formId}-commit`}
              value={commitment}
              maxLength={120}
              onChange={(event) => setCommitment(event.target.value)}
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 text-base focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
            />
            <button
              type="submit"
              className={`${hit} bg-[var(--ua-evergreen)] text-white`}
            >
              Make my commitment
            </button>
          </form>
        )}
      </div>

      <details className="mt-3 text-sm text-stone-600">
        <summary className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B]">
          For the advisory leader
        </summary>
        <p className="mt-2">
          Invite students to share their ideas aloud while you record them on
          the classroom whiteboard. At the end, take a picture of the completed
          Y chart to send to Blanca.
        </p>
      </details>
    </section>
  );
}
