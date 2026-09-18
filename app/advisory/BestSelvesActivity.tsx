"use client";

import { useId, useState } from "react";

type Arm = "looks" | "sounds" | "feels";

const ARMS: Record<
  Arm,
  {
    title: string;
    emoji: string;
    placeholder: string;
    selected: string;
    idle: string;
  }
> = {
  looks: {
    title: "Looks Like",
    emoji: "👀",
    placeholder: "Including someone new…",
    selected:
      "border-[#1F4D3A] bg-[#EAF3ED] ring-2 ring-[#D6B55B]",
    idle: "border-emerald-200/80 bg-[#EAF3ED]/70",
  },
  sounds: {
    title: "Sounds Like",
    emoji: "💬",
    placeholder: "You can sit with us…",
    selected:
      "border-[#D6B55B] bg-[#FBF6E8] ring-2 ring-[#D6B55B]",
    idle: "border-amber-200/80 bg-[#FBF6E8]/80",
  },
  feels: {
    title: "Feels Like",
    emoji: "💗",
    placeholder: "Safe and welcomed…",
    selected:
      "border-pink-300 bg-[#F8EEF5] ring-2 ring-pink-300",
    idle: "border-pink-200/80 bg-[#F8EEF5]/80",
  },
};

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
  const [arm, setArm] = useState<Arm>("looks");
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState<Record<Arm, string[]>>({
    looks: [],
    sounds: [],
    feels: [],
  });
  const [promptIndex, setPromptIndex] = useState(0);
  const [commitment, setCommitment] = useState("");
  const [committed, setCommitted] = useState(false);

  function addNote() {
    const text = draft.trim();
    if (!text) return;
    setNotes((current) => ({
      ...current,
      [arm]: [...current[arm], text].slice(-8),
    }));
    setDraft("");
  }

  function makeCommitment() {
    if (!commitment.trim()) return;
    setCommitted(true);
  }

  return (
    <section
      className="ua-card ua-shadow-soft relative overflow-hidden p-5 sm:p-7"
      aria-labelledby="best-selves-heading"
    >
      <span
        className="pointer-events-none absolute top-4 right-6 text-lg text-[#D6B55B] motion-safe:animate-pulse"
        aria-hidden
      >
        ✦
      </span>
      <span
        className="pointer-events-none absolute top-10 right-14 text-pink-300"
        aria-hidden
      >
        ♡
      </span>
      <span
        className="pointer-events-none absolute bottom-8 left-5 text-sm text-[#D6B55B]/70"
        aria-hidden
      >
        ✦
      </span>

      <p className="text-xs font-semibold tracking-[0.16em] text-emerald-800 uppercase">
        Advisory
      </p>
      <h2
        id="best-selves-heading"
        className="mt-1 font-serif text-2xl text-stone-900 sm:text-3xl"
      >
        Living Our Best Selves at UA 💚
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-700 sm:text-base">
        Small choices can help everyone feel seen, supported, and welcome. Let’s
        imagine the kind of community we want to create together.
      </p>

      <ol className="mt-4 grid gap-2 sm:grid-cols-3">
        <li className="rounded-2xl bg-[#EAF3ED] px-3 py-3">
          <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
            1. Reflect
          </p>
          <p className="mt-1 text-sm text-stone-700">
            Think about how we want our community to feel.
          </p>
        </li>
        <li className="rounded-2xl bg-[#FBF6E8] px-3 py-3">
          <p className="text-xs font-semibold tracking-wide text-amber-800 uppercase">
            2. Build Our Y
          </p>
          <p className="mt-1 text-sm text-stone-700">
            Share what kindness, empathy, and being our best selves look like,
            sound like, and feel like.
          </p>
        </li>
        <li className="rounded-2xl bg-[#F8EEF5] px-3 py-3">
          <p className="text-xs font-semibold tracking-wide text-pink-800 uppercase">
            3. Choose One Action
          </p>
          <p className="mt-1 text-sm text-stone-700">
            Choose one small thing you can personally do today.
          </p>
        </li>
      </ol>

      <div className="mt-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {(["looks", "sounds"] as const).map((key) => (
            <ArmCard
              key={key}
              arm={key}
              selected={arm === key}
              notes={notes[key]}
              onSelect={() => setArm(key)}
            />
          ))}
        </div>
        <p
          className="my-1 text-center font-serif text-6xl leading-none text-[#D6B55B] sm:text-7xl"
          aria-hidden
        >
          Y
        </p>
        <div className="mx-auto max-w-md">
          <ArmCard
            arm="feels"
            selected={arm === "feels"}
            notes={notes.feels}
            onSelect={() => setArm("feels")}
          />
        </div>
      </div>

      <p className="mt-4 text-center font-serif text-lg text-[#14382A]">
        {PROMPTS[promptIndex]}
      </p>
      <div className="mt-2 flex justify-center">
        <button
          type="button"
          className={`${hit} bg-[#FBF6E8] text-[#14382A]`}
          onClick={() =>
            setPromptIndex((i) => (i + 1) % PROMPTS.length)
          }
        >
          Give us a prompt ✨
        </button>
      </div>

      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          addNote();
        }}
      >
        <label className="sr-only" htmlFor={`${formId}-note`}>
          Add a note to {ARMS[arm].title}
        </label>
        <input
          id={`${formId}-note`}
          value={draft}
          maxLength={80}
          placeholder={ARMS[arm].placeholder}
          onChange={(event) => setDraft(event.target.value)}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 text-base text-stone-900 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 focus:outline-none"
        />
        <button
          type="submit"
          className={`${hit} bg-[var(--ua-evergreen)] text-white`}
        >
          Add to {ARMS[arm].title}
        </button>
      </form>

      <details className="mt-4 rounded-2xl bg-white p-3 ring-1 ring-stone-200">
        <summary className="cursor-pointer text-sm font-semibold text-[#14382A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B]">
          Need an idea?
        </summary>
        <div className="mt-3 grid gap-3 text-sm text-stone-700 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-emerald-800">Looks Like</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              <li>Inviting someone to join</li>
              <li>Cleaning up shared spaces</li>
              <li>Helping without being asked</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-amber-800">Sounds Like</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              <li>“Are you okay?”</li>
              <li>“You did a great job.”</li>
              <li>“I see it differently, but I respect your view.”</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-pink-800">Feels Like</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              <li>Welcoming</li>
              <li>Safe</li>
              <li>Valued</li>
              <li>Supported</li>
            </ul>
          </div>
        </div>
      </details>

      <div className="mt-5 rounded-2xl bg-[#F8EEF5] p-4 ring-1 ring-pink-200/80 sm:p-5">
        <h3 className="font-serif text-xl text-stone-900">
          One Small Choice 🌟
        </h3>
        <p className="mt-1 text-sm text-stone-700">
          What is one thing you can personally do today to help someone feel
          valued at UA?
        </p>
        {committed ? (
          <p
            className="mt-3 rounded-xl bg-white px-3 py-3 text-sm font-medium text-[#1F4D3A]"
            role="status"
          >
            Beautiful choice. Small actions shape our community. 💚
          </p>
        ) : (
          <form
            className="mt-3 flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              makeCommitment();
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
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 text-base text-stone-900 focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 focus:outline-none"
            />
            <button
              type="submit"
              className={`${hit} bg-[var(--ua-evergreen)] text-white`}
            >
              Make My Commitment
            </button>
          </form>
        )}
      </div>

      <details className="mt-4 text-sm text-stone-600">
        <summary className="cursor-pointer font-semibold text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B]">
          For the advisory leader
        </summary>
        <p className="mt-2 leading-relaxed">
          Invite students to share their ideas aloud while you record them on
          the classroom whiteboard. At the end, take a picture of the completed
          Y chart to send to Blanca.
        </p>
      </details>
    </section>
  );
}

function ArmCard({
  arm,
  selected,
  notes,
  onSelect,
}: {
  arm: Arm;
  selected: boolean;
  notes: string[];
  onSelect: () => void;
}) {
  const meta = ARMS[arm];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`min-h-11 rounded-2xl border p-3 text-left motion-safe:transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B] ${
        selected ? meta.selected : meta.idle
      }`}
    >
      <p className="font-serif text-lg text-stone-900">
        {meta.title} {meta.emoji}
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {notes.length === 0 ? (
          <li className="text-xs text-stone-500">Tap, then add a note.</li>
        ) : (
          notes.map((note, index) => (
            <li
              key={`${note}-${index}`}
              className="rounded-full bg-white/90 px-2.5 py-1 text-xs text-stone-800 ring-1 ring-stone-200/80"
            >
              {note}
            </li>
          ))
        )}
      </ul>
    </button>
  );
}
