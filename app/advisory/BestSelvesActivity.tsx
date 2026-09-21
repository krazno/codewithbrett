"use client";

import { useId, useState } from "react";

type Arm = "looks" | "sounds" | "feels";

const ARMS: {
  id: Arm;
  title: string;
  emoji: string;
  placeholder: string;
}[] = [
  {
    id: "looks",
    title: "Looks like",
    emoji: "👀",
    placeholder: "Including someone new…",
  },
  {
    id: "sounds",
    title: "Sounds like",
    emoji: "💬",
    placeholder: "You can sit with us…",
  },
  {
    id: "feels",
    title: "Feels like",
    emoji: "💗",
    placeholder: "Safe and welcomed…",
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
      [arm]: [...current[arm], text].slice(-8),
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
      <p className="mt-1 text-sm text-stone-700">
        Add notes beside the Y chart.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
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

      <div className="mt-4 grid items-start gap-3 md:grid-cols-3">
        <ArmPanel
          arm={ARMS[0]}
          formId={formId}
          notes={notes.looks}
          draft={drafts.looks}
          onDraft={(value) =>
            setDrafts((current) => ({ ...current, looks: value }))
          }
          onAdd={() => addNote("looks")}
        />

        <ArmPanel
          arm={ARMS[1]}
          formId={formId}
          notes={notes.sounds}
          draft={drafts.sounds}
          onDraft={(value) =>
            setDrafts((current) => ({ ...current, sounds: value }))
          }
          onAdd={() => addNote("sounds")}
        />

        <ArmPanel
          arm={ARMS[2]}
          formId={formId}
          notes={notes.feels}
          draft={drafts.feels}
          onDraft={(value) =>
            setDrafts((current) => ({ ...current, feels: value }))
          }
          onAdd={() => addNote("feels")}
        />
      </div>

      <div className="mx-auto mt-4 w-full max-w-[16rem]">
        <div className="best-selves-heart">
          <svg
            viewBox="0 0 240 220"
            className="h-auto w-full"
            role="img"
            aria-label="Y chart heart: Looks like, Sounds like, Feels like"
          >
            <path
              d="M120 204 C 38 148 8 98 8 58 C 8 24 34 6 66 6 C 88 6 108 18 120 42 C 132 18 152 6 174 6 C 206 6 232 24 232 58 C 232 98 202 148 120 204 Z"
              fill="#F8EEF5"
              stroke="#C9A24A"
              strokeWidth="2.4"
            />
            <path
              d="M48 62 L120 118 L192 62"
              fill="none"
              stroke="#14382A"
              strokeOpacity="0.28"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M120 118 L120 188"
              fill="none"
              stroke="#14382A"
              strokeOpacity="0.28"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text
              x="120"
              y="124"
              textAnchor="middle"
              fill="#C9A24A"
              fontFamily="Georgia, serif"
              fontSize="22"
            >
              Y
            </text>
            <text
              x="62"
              y="52"
              textAnchor="middle"
              fill="#14382A"
              fontFamily="Georgia, serif"
              fontSize="13"
            >
              Looks like
            </text>
            <text
              x="178"
              y="52"
              textAnchor="middle"
              fill="#14382A"
              fontFamily="Georgia, serif"
              fontSize="13"
            >
              Sounds like
            </text>
            <text
              x="120"
              y="158"
              textAnchor="middle"
              fill="#14382A"
              fontFamily="Georgia, serif"
              fontSize="13"
            >
              Feels like
            </text>
          </svg>
        </div>
      </div>

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
    </section>
  );
}

function ArmPanel({
  arm,
  formId,
  notes,
  draft,
  className,
  onDraft,
  onAdd,
}: {
  arm: (typeof ARMS)[number];
  formId: string;
  notes: string[];
  draft: string;
  className?: string;
  onDraft: (value: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className={`rounded-2xl bg-[#F8EEF5]/70 p-3 ${className ?? ""}`}>
      <p className="font-serif text-base text-stone-900">
        {arm.title} {arm.emoji}
      </p>
      <form
        className="mt-2 flex gap-1"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd();
        }}
      >
        <label className="sr-only" htmlFor={`${formId}-${arm.id}`}>
          Add to {arm.title}
        </label>
        <input
          id={`${formId}-${arm.id}`}
          value={draft}
          maxLength={60}
          placeholder={arm.placeholder}
          onChange={(event) => onDraft(event.target.value)}
          className="min-h-11 min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-3 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
        />
        <button
          type="submit"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ua-evergreen)] text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B55B]"
          aria-label={`Add to ${arm.title}`}
        >
          +
        </button>
      </form>
      <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto">
        {notes.map((note, index) => (
          <li
            key={`${note}-${index}`}
            className="break-words rounded-xl bg-white px-2.5 py-1.5 text-sm text-stone-800"
          >
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
