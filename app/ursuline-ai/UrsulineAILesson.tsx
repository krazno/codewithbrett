"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import InsideAiMathSlideLabs from "./InsideAiMathSlideLabs";
import {
  ArrowRight,
  Check,
  Download,
  Eye,
  FileText,
  Heart,
  Play,
  RotateCcw,
  Search,
} from "lucide-react";

type Signal = "green" | "yellow" | "red" | null;

type NavLink = { href: string; label: string; shortLabel: string };

const NAV_PT1: NavLink[] = [
  { href: "#pt1-deck", label: "Part 1 Slides", shortLabel: "Slides" },
  { href: "#pt1-handout", label: "Part 1 Handout", shortLabel: "Handout" },
];

const NAV_PT2: NavLink[] = [
  { href: "#pt2-deck", label: "Part 2 Slides", shortLabel: "Slides" },
  { href: "#pt2-labs", label: "Part 2 Labs", shortLabel: "Labs" },
  { href: "#pt2-handout", label: "Part 2 Lab Sheet", shortLabel: "Lab Sheet" },
];

const NAV_PT1_PART = { label: "Part 1: AI Literacy", shortLabel: "Part 1" };
const NAV_PT2_PART = { label: "Part 2: Inside AI", shortLabel: "Part 2" };

const PT1_GAMMA_EMBED = "https://gamma.app/embed/bdlnsqv1f45r7to";
const PT1_GAMMA_DOCS = "https://gamma.app/docs/AI-the-Brain-and-Serviam-bdlnsqv1f45r7to";
const PT2_GAMMA_EMBED = "https://gamma.app/embed/vm7pqgz6iuexocx";
const PT2_GAMMA_DOCS =
  "https://gamma.app/docs/Inside-AI-The-Math-Science-and-Code-Behind-Intelligent-Tools-vm7pqgz6iuexocx";
const pt2DeckReady = !PT2_GAMMA_EMBED.includes("REPLACE");

const CLAIMS = [
  "AI works like a human brain.",
  "It understands words and remembers facts.",
  "It always chooses the best answer.",
];

const AUDIT_ANSWERS: Signal[] = ["yellow", "yellow", "red"];

const AUDIT_MISLEADING_WORDS = ["understands", "remembers", "always", "best"] as const;

type AuditMisleadingWord = (typeof AUDIT_MISLEADING_WORDS)[number];

const AUDIT_WORD_FEEDBACK: Record<AuditMisleadingWord, string> = {
  understands:
    "Good eye — understands suggests comprehension and meaning, not pattern-matching on tokens.",
  remembers:
    "Good eye — remembers suggests stored personal memory, not weights learned from training data.",
  always:
    "Good eye — always suggests certainty; models estimate probability and can be wrong.",
  best:
    "Good eye — best suggests judgment and truth; models pick likely outputs, not guaranteed correct ones.",
};

const SCENARIOS: { text: string; answer: Signal }[] = [
  { text: "AI quizzes me before a test.", answer: "green" },
  { text: "AI helps debug code I already understand.", answer: "green" },
  { text: "AI outlines ideas for a project I still have to develop.", answer: "yellow" },
  { text: "AI summarizes an article when my teacher says it is okay.", answer: "yellow" },
  { text: "AI writes my essay and I turn it in as my own.", answer: "red" },
  {
    text: "I paste private health information or ask AI for medical or legal advice about someone.",
    answer: "red",
  },
];

const SERVIAM = [
  { letter: "S", word: "Start", detail: "with your own thinking." },
  { letter: "E", word: "Examine", detail: "the purpose. Am I learning or avoiding effort?" },
  { letter: "R", word: "Require", detail: "reasoning and evidence from the tool." },
  { letter: "V", word: "Verify", detail: "before using or sharing anything." },
  { letter: "I", word: "Identify", detail: "risks like privacy, bias, and accuracy." },
  { letter: "A", word: "Attribute", detail: "AI assistance honestly." },
  { letter: "M", word: "Make", detail: "your work serve learning and others." },
];

/** Canonical lesson thesis — hero, closing, and Part 1 handout only. */
const CORE_THESIS =
  "AI is not magic. It is math trained on patterns. Human wisdom decides whether, when, and how to use it.";

const PT1_HANDOUT = {
  title: "Serviam Use Card",
  sub: "Your one-page guide for using AI with integrity.",
  href: "/artifacts/ursuline_serviam_ai_student_handout.docx",
};

const PT2_HANDOUT = {
  title: "Inside AI Lab Notes",
  sub: "Vectors, weights, and training worksheet for class.",
  href: "/artifacts/ursuline_part2_student_handout.docx",
};

const AI_LEADERS = [
  { name: "Joy Buolamwini", focus: "AI fairness and algorithmic bias" },
  { name: "Fei-Fei Li", focus: "computer vision and human-centered AI" },
  { name: "Timnit Gebru", focus: "AI ethics and responsible technology" },
] as const;

const AI_PROBLEM_AREAS = [
  { id: "fairness", label: "Fairness" },
  { id: "health", label: "Health" },
  { id: "climate", label: "Climate" },
  { id: "education", label: "Education" },
  { id: "creativity", label: "Creativity" },
  { id: "accessibility", label: "Accessibility" },
] as const;

const AI_PROBLEM_AFFIRMATION =
  "Leaders in AI start with a problem they care about.";

const TEACHER_PLANS = [
  {
    part: "Part 1",
    title: "AI, the Brain, and Serviam",
    description: "Timing, objectives, and facilitation notes for Part 1.",
    href: "/artifacts/team/ursuline_pt1_teacher_lesson_plan.docx",
  },
  {
    part: "Part 2",
    title: "Inside AI",
    description: "Timing, objectives, math and CS activities, and extension notes for Part 2.",
    href: "/artifacts/team/ursuline_part2_teacher_lesson_plan.docx",
  },
];

const PATHWAY_STEPS = [
  "Prompt",
  "Tokens",
  "Token IDs",
  "Vectors",
  "Attention",
  "Probability",
  "Response",
  "Human review",
] as const;

const PATHWAY_FINAL_STEP = PATHWAY_STEPS.length;

const NAV_SCROLL_SECTIONS = [
  "pt1",
  "pt1-deck",
  "pt1-handout",
  "pt2",
  "pt2-deck",
  "pt2-labs",
  "pt2-handout",
] as const;

const DEFINE_ABILITIES = [
  { label: "Recognize", detail: "Patterns in data" },
  { label: "Predict", detail: "Likely outputs" },
  { label: "Generate", detail: "New content and ideas" },
  { label: "Support", detail: "Human decision-making" },
] as const;

const AI_CAPABILITIES = [
  { label: "Classify", tip: "Sorts content into categories—like spam vs. inbox." },
  { label: "Recommend", tip: "Suggests what you might want next from patterns." },
  { label: "Generate", tip: "Creates text, images, or code from a prompt." },
  { label: "Search", tip: "Finds relevant info across huge datasets fast." },
  { label: "Code", tip: "Helps write, fix, or explain programming steps." },
  {
    label: "Act with permission",
    tip: "Some AI systems can trigger actions in approved apps, devices, or workflows.",
  },
] as const;

const LEARNER_COMPARE_PAIRS = [
  { human: "Memory: carries the past", ai: "Tokens: processes word pieces" },
  { human: "Emotion: feels the stakes", ai: "Probability: estimates likely outputs" },
  { human: "Purpose: acts with intention", ai: "Pattern: matches training data" },
  { human: "Moral judgment: weighs right and wrong", ai: "No judgment: no stakes, no conscience" },
] as const;

const TILE_INTERACTIVE =
  "transition-all duration-200 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 active:scale-[0.98] active:bg-emerald-100 active:text-emerald-900 md:hover:z-10 md:hover:scale-[1.03] md:hover:bg-emerald-50 md:hover:text-emerald-800 md:hover:shadow-[0_8px_20px_rgba(6,78,59,0.12),inset_0_0_0_1px_rgba(16,185,129,0.2)]";

const CARD_LIFT =
  "transition-all duration-200 ease-out motion-reduce:transition-none focus-within:border-emerald-300 focus-within:shadow-md md:hover:-translate-y-0.5 md:hover:border-emerald-200 md:hover:shadow-[0_10px_24px_rgba(6,78,59,0.1)]";

const URSULINE_SHIELD_SRC = "/assets/ursuline-shield.png";

const IDEA_HUB_LABEL = "I.D.E.A. Hub";
const IDEA_ACRONYM_TOKEN = "I.D.E.A.";
const IDEA_ACRONYM_PLACEHOLDER = "\uE000";

/** Normalize student-visible I.D.E.A. Hub typos (e.g. I.D.E.A.Hub, IDEA Hub, I.D.E.A. Hut). */
function normalizeIdeaHub(text: string): string {
  return text
    .replace(/\bI\.D\.E\.A\.?\s*Hut\b/gi, IDEA_HUB_LABEL)
    .replace(/\bI\.D\.E\.A\.?\s*Hub\b/gi, IDEA_HUB_LABEL)
    .replace(/\bIDEA\s+Hub\b/gi, IDEA_HUB_LABEL);
}

type PathwayNextToken = { word: string; pct: number };

type PathwayPreset = {
  id: string;
  shortLabel: string;
  /** Full Ursuline-voice sentence shown in the prompt and response panels */
  fullSentence: string;
  /** When set, the pathway can teach next-token choice before the closing phrase */
  nextTokenStem?: string;
  nextTokens: readonly PathwayNextToken[];
};

const PREDICT_IDEA_SENTENCE_STEM = `The students entered the ${IDEA_HUB_LABEL} to design a`;
const PREDICT_IDEA_DEFAULT_WORD = "robot";

const PATHWAY_IDEA_HUB_NEXT: readonly PathwayNextToken[] = [
  { word: "robot", pct: 42 },
  { word: "app", pct: 24 },
  { word: "tutoring tool", pct: 16 },
  { word: "garden plan", pct: 11 },
  { word: "study guide", pct: 7 },
];

const PATHWAY_PRESETS: readonly PathwayPreset[] = [
  {
    id: "idea-hub",
    shortLabel: "I.D.E.A. Hub",
    fullSentence: `The students entered the ${IDEA_HUB_LABEL} to design a robot.`,
    nextTokenStem: `The students entered the ${IDEA_HUB_LABEL} to design a`,
    nextTokens: PATHWAY_IDEA_HUB_NEXT,
  },
  {
    id: "serviam",
    shortLabel: "Serviam project",
    fullSentence:
      "Our Serviam project needs a tool that helps new students find their way around campus.",
    nextTokens: [
      { word: "campus", pct: 38 },
      { word: "students", pct: 26 },
      { word: "tool", pct: 18 },
      { word: "find", pct: 12 },
      { word: "way", pct: 6 },
    ],
  },
  {
    id: "science-fair",
    shortLabel: "Science fair",
    fullSentence: "Before the science fair, we asked AI to explain photosynthesis.",
    nextTokens: [
      { word: "photosynthesis", pct: 36 },
      { word: "fair", pct: 24 },
      { word: "explain", pct: 20 },
      { word: "asked", pct: 12 },
      { word: "AI", pct: 8 },
    ],
  },
];

const PATHWAY_CUSTOM_NEXT: readonly PathwayNextToken[] = [
  { word: "robot", pct: 32 },
  { word: "app", pct: 24 },
  { word: "guide", pct: 20 },
  { word: "plan", pct: 15 },
  { word: "essay", pct: 9 },
];

const PATHWAY_DEFAULT_PRESET_ID = PATHWAY_PRESETS[0].id;

const PATHWAY_CUSTOM_MIN_WORDS = 3;
const PATHWAY_CUSTOM_MAX_WORDS = 20;

/** Keep I.D.E.A. as one token so chips do not read as I.D.E.A.Hub. */
function tokenizePrompt(text: string): string[] {
  const normalized = normalizeIdeaHub(text);
  const protectedText = normalized.replace(/\bI\.D\.E\.A\./g, IDEA_ACRONYM_PLACEHOLDER);
  return protectedText
    .replace(/([.,!?])/g, " $1")
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => (t === IDEA_ACRONYM_PLACEHOLDER ? IDEA_ACRONYM_TOKEN : t))
    .slice(0, 12);
}

function markBg(m: Signal) {
  if (m === "green") return "bg-emerald-600 text-white border-emerald-700";
  if (m === "yellow") return "bg-amber-400 text-stone-900 border-amber-500";
  if (m === "red") return "bg-rose-500 text-white border-rose-600";
  return "bg-white text-stone-400 border-stone-200 hover:border-stone-400";
}

function markLabel(m: Signal) {
  if (m === "green") return "Accurate";
  if (m === "yellow") return "Vague";
  if (m === "red") return "Misleading";
  return "Click or tap to mark";
}

function dotBg(m: Signal) {
  if (m === "green") return "bg-emerald-500";
  if (m === "yellow") return "bg-amber-400";
  if (m === "red") return "bg-rose-500";
  return "bg-stone-200";
}

function fakeIdFor(w: string) {
  let h = 0;
  for (let i = 0; i < w.length; i++) h = (h * 31 + w.charCodeAt(i)) % 9973;
  return h;
}

function fakeVectorFor(w: string) {
  const id = fakeIdFor(w);
  const a = ((id % 100) / 100 - 0.5).toFixed(2);
  const b = (((id * 7) % 100) / 100 - 0.5).toFixed(2);
  const c = (((id * 13) % 100) / 100 - 0.5).toFixed(2);
  return `[${a}, ${b}, ${c}, …]`;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function sanitizePathwayInput(text: string): string {
  return normalizeIdeaHub(text)
    .replace(/[^\w\s.'",!?-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

function isValidPathwayCustom(text: string): boolean {
  const words = countWords(text);
  return words >= PATHWAY_CUSTOM_MIN_WORDS && words <= PATHWAY_CUSTOM_MAX_WORDS;
}

function endsWithSentencePunctuation(text: string): boolean {
  return /[.!?]$/.test(text.trim());
}

/** Custom prompts ending mid-phrase (design a / to explain / that helps) invite a next-token pick. */
function isIncompletePathwayStem(text: string): boolean {
  const words = tokenizePrompt(text);
  const last = words[words.length - 1]?.toLowerCase() ?? "";
  const tail = words.slice(-3).join(" ").toLowerCase();
  return (
    last === "a" ||
    last === "for" ||
    tail.includes("design a") ||
    last === "explain" ||
    tail.includes("to explain") ||
    last === "helps" ||
    tail.includes("that helps")
  );
}

function isCompleteCustomPathway(text: string): boolean {
  const cleaned = sanitizePathwayInput(text);
  if (!cleaned) return false;
  if (endsWithSentencePunctuation(cleaned)) return true;
  return countWords(cleaned) >= 5 && !isIncompletePathwayStem(cleaned);
}

/** Text used for prompt display, tokens, and attention — one source for all panels */
function getPathwayPromptText(
  preset: PathwayPreset,
  useCustom: boolean,
  customText: string,
  pick: string | null,
): string {
  if (useCustom) {
    const cleaned = sanitizePathwayInput(customText);
    if (!cleaned) return "";
    if (isCompleteCustomPathway(cleaned)) return cleaned;
    if (pick) return `${cleaned} ${pick}`.trim();
    return cleaned;
  }
  if (preset.nextTokenStem) {
    if (pick) return `${preset.nextTokenStem} ${pick}`.trim();
    return preset.fullSentence.replace(/\s*[.!?]\s*$/, "").trim();
  }
  return preset.fullSentence;
}

function pathwayTeachesNextToken(
  preset: PathwayPreset,
  useCustom: boolean,
  customText: string,
): boolean {
  if (useCustom) {
    const cleaned = sanitizePathwayInput(customText);
    return Boolean(cleaned) && !isCompleteCustomPathway(cleaned);
  }
  return Boolean(preset.nextTokenStem);
}

/** Deterministic attention weights from token position and content. */
function computeAttentionWeights(tokens: string[], boostLastStem = false): { token: string; weight: number }[] {
  const n = tokens.length;
  if (n === 0) return [];
  return tokens.map((token, i) => {
    const positionFactor = 40 + (i / Math.max(n - 1, 1)) * 45;
    const lengthBonus = Math.min(token.length * 2, 12);
    const isStopWord = /^(a|an|the|to|in|of|for|and|or|is|was|we|our|it|that|before)$/i.test(token);
    const contentBonus = isStopWord ? 0 : 8;
    const hashBonus = fakeIdFor(token) % 15;
    let weight = Math.min(98, Math.round(positionFactor + lengthBonus + contentBonus + hashBonus));
    if (boostLastStem && i === n - 1) weight = Math.min(98, weight + 4);
    return { token, weight };
  });
}

function getPathwayPreset(id: string): PathwayPreset {
  return PATHWAY_PRESETS.find((p) => p.id === id) ?? PATHWAY_PRESETS[0];
}

/** Match custom prompt endings to preset next-token sets so panels stay coherent. */
function getCustomPathwayNext(stem: string): readonly PathwayNextToken[] {
  const words = tokenizePrompt(stem);
  const last = words[words.length - 1]?.toLowerCase() ?? "";
  const tail = words.slice(-3).join(" ").toLowerCase();

  if (last === "helps" || last === "help" || tail.includes("that helps")) {
    return [
      { word: "new students find their way around campus", pct: 42 },
      { word: "classmates", pct: 24 },
      { word: "teachers", pct: 18 },
      { word: "volunteers", pct: 10 },
      { word: "neighbors", pct: 6 },
    ];
  }
  if (last === "explain" || tail.includes("to explain")) {
    return getPathwayPreset("science-fair").nextTokens;
  }
  if (
    last === "a" ||
    last === "for" ||
    tail.includes("design a") ||
    normalizeIdeaHub(stem).includes(IDEA_HUB_LABEL)
  ) {
    return PATHWAY_IDEA_HUB_NEXT;
  }
  return PATHWAY_CUSTOM_NEXT;
}

function ensureSentenceEnd(text: string): string {
  const t = text.trim();
  if (!t) return t;
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

function PathwayPromptSentence({
  promptText,
  teachesNextToken,
  nextTokenStem,
  pick,
  defaultWord,
  showBlank,
  emptyLabel = "Enter a prompt above",
}: {
  promptText: string;
  teachesNextToken: boolean;
  nextTokenStem: string | null;
  pick: string | null;
  defaultWord: string | null;
  showBlank: boolean;
  emptyLabel?: string;
}) {
  if (!promptText) {
    return <p className="font-serif text-lg leading-relaxed text-stone-500 sm:text-xl">{emptyLabel}</p>;
  }

  if (!teachesNextToken || !nextTokenStem) {
    return (
      <p className="font-serif text-lg leading-relaxed text-stone-900 sm:text-xl">
        {ensureSentenceEnd(promptText)}
      </p>
    );
  }

  const word = pick ?? (showBlank ? null : defaultWord);
  return (
    <p className="font-serif text-lg leading-relaxed text-stone-900 sm:text-xl">
      {nextTokenStem}{" "}
      {showBlank ? (
        <span className="inline-block min-w-[6rem] border-b-2 border-dashed border-stone-400 px-1 text-center italic text-stone-400">
          ________
        </span>
      ) : (
        <span className={pick ? "text-emerald-800" : "text-stone-800"}>{word}</span>
      )}
      .
    </p>
  );
}

function ProbabilityBarRow({
  word,
  pct,
  showValues,
  animateBars,
  isModelTop,
  isSelected,
  reducedMotion,
  onSelect,
}: {
  word: string;
  pct: number;
  showValues: boolean;
  animateBars: boolean;
  isModelTop: boolean;
  isSelected: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex w-full items-center gap-3 rounded-lg px-1.5 py-1.5 text-left transition-colors motion-reduce:transition-none ${
        isSelected
          ? "bg-emerald-50 ring-1 ring-emerald-300"
          : isModelTop
            ? "bg-emerald-50/40 hover:bg-emerald-50"
            : "hover:bg-stone-50"
      }`}
    >
      <div className="flex w-28 shrink-0 items-center gap-1.5">
        <span className={`truncate text-sm ${isSelected ? "font-medium text-emerald-900" : "text-stone-700"}`}>
          {word}
        </span>
        {isModelTop && showValues && (
          <span className="shrink-0 rounded bg-emerald-800 px-1 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
            top
          </span>
        )}
      </div>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
        <div
          className={`h-full rounded-full ${
            reducedMotion ? "" : "transition-all duration-700 ease-out group-hover:opacity-90 motion-reduce:transition-none"
          } ${isSelected ? "bg-emerald-700" : isModelTop ? "bg-emerald-600" : "bg-stone-400 md:group-hover:bg-stone-500"}`}
          style={{ width: animateBars && showValues ? `${pct}%` : "0%" }}
        />
      </div>
      <div className="w-10 shrink-0 text-right text-xs tabular-nums text-stone-500">
        {showValues ? pct : 0}%
      </div>
    </button>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function useScrollSpy(sectionIds: readonly string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "");
  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target.id;
        if (top) setActive(top);
      },
      { rootMargin: "-12% 0px -58% 0px", threshold: [0, 0.12, 0.3, 0.5] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);
  return active;
}

function NavResponsiveLabel({ shortLabel, label }: { shortLabel: string; label: string }) {
  return (
    <>
      <span className="sm:hidden">{shortLabel}</span>
      <span className="hidden sm:inline">{label}</span>
    </>
  );
}

function NavPill({
  href,
  label,
  shortLabel,
  active,
  variant = "sub",
  accent = "emerald",
  className = "",
}: {
  href: string;
  label: string;
  shortLabel?: string;
  active: boolean;
  variant?: "pt1" | "pt2" | "sub";
  accent?: "emerald" | "stone";
  className?: string;
}) {
  const isPart = variant === "pt1" || variant === "pt2";
  const base =
    "inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full text-[11px] font-medium transition-all duration-200 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] md:hover:scale-[1.04] md:hover:shadow-sm motion-reduce:md:hover:scale-100";

  let styles = "";
  if (isPart) {
    styles = active
      ? variant === "pt1"
        ? "bg-emerald-900 text-white shadow-md ring-2 ring-emerald-600/40 focus-visible:outline-emerald-300"
        : "bg-stone-950 text-white shadow-md ring-2 ring-stone-600/50 focus-visible:outline-amber-300"
      : variant === "pt1"
        ? "bg-emerald-800 text-white hover:bg-emerald-900 focus-visible:outline-emerald-700"
        : "bg-stone-900 text-white hover:bg-stone-800 focus-visible:outline-stone-700";
  } else if (accent === "stone") {
    styles = active
      ? "bg-stone-900 text-white shadow-sm ring-1 ring-stone-600/40 focus-visible:outline-stone-700"
      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-stone-700";
  } else {
    styles = active
      ? "bg-white text-emerald-800 shadow-sm ring-1 ring-emerald-200/80 focus-visible:outline-emerald-700"
      : "text-stone-600 hover:bg-white hover:text-emerald-800 focus-visible:outline-emerald-700";
  }

  return (
    <a
      href={href}
      aria-current={active ? "location" : undefined}
      className={`${base} ${styles} ${isPart ? "px-2.5 py-1.5 xl:px-3 xl:text-xs" : "px-2.5 py-1.5 xl:px-3 xl:text-xs"} ${className}`}
    >
      {shortLabel ? <NavResponsiveLabel shortLabel={shortLabel} label={label} /> : label}
    </a>
  );
}

function NavPartGroup({
  partHref,
  partLabel,
  partShortLabel,
  variant,
  links,
  activeSection,
  className = "",
}: {
  partHref: string;
  partLabel: string;
  partShortLabel: string;
  variant: "pt1" | "pt2";
  links: readonly NavLink[];
  activeSection: string;
  className?: string;
}) {
  const partId = partHref.replace("#", "");
  const accent = variant === "pt1" ? "emerald" : "stone";
  const shell =
    variant === "pt1"
      ? "bg-emerald-50/70 ring-emerald-200/60"
      : "bg-stone-100/90 ring-stone-300/70";

  return (
    <div
      role="group"
      aria-label={partLabel}
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-1 py-0.5 ring-1 ${shell} ${className}`}
    >
      <NavPill
        href={partHref}
        label={partLabel}
        shortLabel={partShortLabel}
        variant={variant}
        active={activeSection === partId}
      />
      {links.map((link) => {
        const sectionId = link.href.replace("#", "");
        return (
          <NavPill
            key={link.href}
            href={link.href}
            label={link.label}
            shortLabel={link.shortLabel}
            accent={accent}
            active={activeSection === sectionId}
          />
        );
      })}
    </div>
  );
}

function LessonNavGroups({ activeSection }: { activeSection: string }) {
  return (
    <>
      <NavPartGroup
        partHref="#pt1"
        partLabel={NAV_PT1_PART.label}
        partShortLabel={NAV_PT1_PART.shortLabel}
        variant="pt1"
        links={NAV_PT1}
        activeSection={activeSection}
      />
      <div className="mx-0.5 h-5 w-px shrink-0 bg-stone-300/90" aria-hidden />
      <NavPartGroup
        partHref="#pt2"
        partLabel={NAV_PT2_PART.label}
        partShortLabel={NAV_PT2_PART.shortLabel}
        variant="pt2"
        links={NAV_PT2}
        activeSection={activeSection}
      />
    </>
  );
}

function HeroJumpCard({
  href,
  title,
  titleClass,
  grades,
  format,
  description,
  buttonLabel,
  buttonClass,
}: {
  href: string;
  title: string;
  titleClass: string;
  grades: string;
  format?: string;
  description: string;
  buttonLabel: string;
  buttonClass: string;
}) {
  return (
    <a
      href={href}
      className="group flex min-h-[168px] flex-col rounded-2xl border border-stone-200 bg-white/80 p-5 backdrop-blur-sm transition hover:border-stone-300 hover:bg-white hover:shadow-sm"
    >
      <p className={`font-serif text-lg leading-snug text-stone-900 ${titleClass}`}>{title}</p>
      <p className="mt-1.5 text-xs font-medium text-stone-600">{grades}</p>
      {format ? (
        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-stone-500">{format}</p>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-stone-700">{description}</p>
      <span
        className={`mt-auto inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:w-fit ${buttonClass}`}
      >
        {buttonLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </a>
  );
}

function LessonSection({
  id,
  kicker,
  title,
  intro,
  children,
  className = "bg-white",
}: {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 border-t border-stone-200 sm:scroll-mt-28 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 md:py-24">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <div className="mb-4 text-xs uppercase tracking-widest text-amber-700">{kicker}</div>
            <h2 className="mb-4 font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">{title}</h2>
            <p className="leading-relaxed text-stone-600">{intro}</p>
          </div>
          <div className="md:col-span-8">{children}</div>
        </div>
      </div>
    </section>
  );
}

function InteractiveCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:rounded-3xl sm:p-8 md:p-10 ${className}`}>
      {children}
    </div>
  );
}

function StudentHandoutCard({
  title,
  sub,
  href,
}: {
  title: string;
  sub: string;
  href: string;
}) {
  return (
    <a
      href={href}
      download
      className="group block rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-emerald-200 hover:bg-emerald-50/30 sm:p-8"
    >
      <FileText className="mb-4 h-5 w-5 text-emerald-800" strokeWidth={1.5} />
      <div className="mb-1 font-serif text-xl">{title}</div>
      <div className="mb-4 text-sm text-stone-500">{sub}</div>
      <div className="inline-flex items-center gap-2 text-xs text-stone-700 transition group-hover:text-emerald-800">
        <Download className="h-3 w-3" />
        Download
      </div>
    </a>
  );
}

function PartBanner({
  part,
  title,
  subtitle,
  variant = "light",
}: {
  part: 1 | 2;
  title: string;
  subtitle: string;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  return (
    <div
      className={`border-b border-stone-200 ${dark ? "bg-stone-900 text-stone-50" : "bg-white text-stone-900"}`}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 sm:px-6 sm:py-10 md:flex-row md:items-end md:justify-between md:py-12">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-amber-300" : "text-emerald-800"}`}>
            Part {part}
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl md:text-4xl">{title}</h2>
        </div>
        <p className={`max-w-md text-pretty text-xs leading-relaxed sm:text-sm ${dark ? "text-stone-400" : "text-stone-600"}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function UrsulineAILesson() {
  const reducedMotion = usePrefersReducedMotion();
  const activeSection = useScrollSpy(NAV_SCROLL_SECTIONS);
  const compareRef = useRef<HTMLElement>(null);
  const [compareRevealed, setCompareRevealed] = useState(reducedMotion);
  const [compareActiveIndex, setCompareActiveIndex] = useState(0);
  const [openCapability, setOpenCapability] = useState<string | null>(null);

  const [revealedHook, setRevealedHook] = useState(false);
  const [pickedHook, setPickedHook] = useState<string | null>(null);
  const [focusWord, setFocusWord] = useState<string | null>(null);

  const [pathStep, setPathStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [pathwayPick, setPathwayPick] = useState<string | null>(null);
  const [pathwayBarsLive, setPathwayBarsLive] = useState(false);
  const [pathwayPresetId, setPathwayPresetId] = useState(PATHWAY_DEFAULT_PRESET_ID);
  const [pathwayUseCustom, setPathwayUseCustom] = useState(false);
  const [pathwayCustomText, setPathwayCustomText] = useState("");
  const [pathwayCustomHint, setPathwayCustomHint] = useState<string | null>(null);

  const [auditMarks, setAuditMarks] = useState<Signal[]>([null, null, null]);
  const [auditMisleadingWord, setAuditMisleadingWord] = useState<AuditMisleadingWord | null>(null);
  const [decisions, setDecisions] = useState<Signal[]>(Array(SCENARIOS.length).fill(null));
  const [reflection, setReflection] = useState({ power: "", limit: "", promise: "" });
  const [serviamChallenge, setServiamChallenge] = useState("");
  const [aiProblemFocus, setAiProblemFocus] = useState<string | null>(null);

  useEffect(() => {
    if (!running) return;
    if (pathStep >= PATHWAY_FINAL_STEP) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setPathStep((s) => s + 1), 850);
    return () => clearTimeout(t);
  }, [running, pathStep]);

  useEffect(() => {
    if (reducedMotion) {
      setCompareRevealed(true);
      return;
    }
    const el = compareRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setCompareRevealed(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const clearPathwayRun = () => {
    setRunning(false);
    setPathStep(0);
    setPathwayPick(null);
    setPathwayBarsLive(false);
  };

  const startPathwayRun = () => {
    clearPathwayRun();
    setRunning(true);
    setTimeout(() => setPathStep(1), 100);
  };

  const runPathway = () => {
    if (pathwayUseCustom) {
      const cleaned = sanitizePathwayInput(pathwayCustomText);
      if (!isValidPathwayCustom(cleaned)) {
        setPathwayCustomHint(
          `Use ${PATHWAY_CUSTOM_MIN_WORDS}–${PATHWAY_CUSTOM_MAX_WORDS} words (letters, numbers, basic punctuation).`,
        );
        return;
      }
      setPathwayCustomHint(null);
      setPathwayCustomText(cleaned);
    }
    startPathwayRun();
  };

  const resetPathway = () => {
    clearPathwayRun();
    setPathwayPresetId(PATHWAY_DEFAULT_PRESET_ID);
    setPathwayUseCustom(false);
    setPathwayCustomText("");
    setPathwayCustomHint(null);
  };

  const selectPathwayPreset = (id: string) => {
    setPathwayUseCustom(false);
    setPathwayPresetId(id);
    setPathwayCustomHint(null);
    clearPathwayRun();
    setRunning(true);
    setTimeout(() => setPathStep(1), 100);
  };

  const switchToCustomPathway = () => {
    setPathwayUseCustom(true);
    clearPathwayRun();
  };

  useEffect(() => {
    if (pathStep >= 6) setPathwayBarsLive(true);
  }, [pathStep]);

  const activePreset = getPathwayPreset(pathwayPresetId);
  const pathwayPromptText = getPathwayPromptText(
    activePreset,
    pathwayUseCustom,
    pathwayCustomText,
    pathwayPick,
  );
  const teachesNextToken = pathwayTeachesNextToken(activePreset, pathwayUseCustom, pathwayCustomText);
  const pathwayNextTokenStem = pathwayUseCustom
    ? teachesNextToken
      ? sanitizePathwayInput(pathwayCustomText)
      : null
    : activePreset.nextTokenStem ?? null;
  const pathwayNextTokens = pathwayUseCustom
    ? getCustomPathwayNext(sanitizePathwayInput(pathwayCustomText))
    : activePreset.nextTokens;
  const pathwayModelTop = pathwayNextTokens[0].word;
  const pathwayDefaultWord = activePreset.nextTokenStem ? pathwayNextTokens[0].word : null;
  const tokens = tokenizePrompt(pathwayPromptText);
  const stemTokens = pathwayNextTokenStem ? tokenizePrompt(pathwayNextTokenStem) : tokens;
  const pickedTokens =
    pathwayPick && pathwayNextTokenStem
      ? tokens.slice(stemTokens.length)
      : pathwayPick
        ? tokenizePrompt(pathwayPick)
        : [];
  const pathwayTokensVisible =
    pathStep >= 7
      ? tokens.length
      : pathwayPick !== null
        ? tokens.length
        : pathStep >= 2
          ? Math.min(tokens.length, Math.max(0, pathStep - 1))
          : 0;
  const visibleTokens = tokens.slice(0, pathwayTokensVisible);
  const attentionTokens = computeAttentionWeights(
    visibleTokens,
    Boolean(pathwayPick) && pickedTokens.length > 0,
  );
  const showPathwayAttention = pathStep >= 5 || pathwayBarsLive || pathwayPick !== null;
  const showPathwayProbabilities = pathStep >= 6 || pathwayBarsLive || pathwayPick !== null;
  const showPathwayNextBlank =
    teachesNextToken && showPathwayProbabilities && !pathwayPick && Boolean(pathwayNextTokenStem);
  const customWordCount = countWords(pathwayCustomText);
  const customInputValid = isValidPathwayCustom(sanitizePathwayInput(pathwayCustomText));

  const pickPathwayToken = (word: string) => {
    setPathwayPick(word);
    setPathwayBarsLive(true);
    if (pathStep < 6) setPathStep(6);
  };

  const cycleMark = (i: number) => {
    const order: Signal[] = [null, "green", "yellow", "red"];
    setAuditMarks((m) =>
      m.map((v, idx) => (idx === i ? order[(order.indexOf(v) + 1) % 4] : v)),
    );
  };

  const auditScore = auditMarks.filter((m, i) => m === AUDIT_ANSWERS[i]).length;
  const auditComplete = auditMarks.every((m) => m !== null);

  const setDecision = (i: number, val: Signal) => {
    setDecisions((d) => d.map((v, idx) => (idx === i ? val : v)));
  };

  return (
    <div id="top" className="min-h-screen bg-stone-50 text-stone-900 scroll-mt-0">
      <nav className="sticky top-0 z-50 border-b border-stone-200/70 bg-stone-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:gap-4 sm:py-3 md:px-6 md:py-4">
          <a
            href="#top"
            className="group flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:gap-3"
            aria-label="Ursuline Academy — back to top of lesson"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-900 shadow-sm ring-1 ring-emerald-900/10 transition group-hover:bg-emerald-950 sm:h-9 sm:w-9 md:h-10 md:w-10">
              <Image
                src={URSULINE_SHIELD_SRC}
                alt="Ursuline Academy"
                width={32}
                height={40}
                className="h-[1.375rem] w-auto object-contain sm:h-6 md:h-7"
                priority
              />
            </span>
            <span
              className="hidden h-5 w-px shrink-0 bg-stone-300/80 sm:block"
              aria-hidden
            />
            <span className="hidden font-serif text-sm tracking-tight text-stone-800 sm:inline md:text-[15px]">
              AI · Brain · Serviam
            </span>
          </a>
          <div
            className="-mr-4 ml-auto flex max-w-[min(100%,22rem)] items-center gap-2 overflow-x-auto pb-0.5 sm:max-w-none sm:gap-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Lesson sections"
          >
            <LessonNavGroups activeSection={activeSection} />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-20 md:pt-24">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <h1 className="mb-6 font-serif text-3xl leading-[0.95] tracking-tight text-stone-900 sm:text-5xl md:text-7xl lg:text-8xl">
                AI, the Brain,
                <br />
                <span className="italic text-emerald-800">and Serviam.</span>
              </h1>
              <p className="mb-6 max-w-2xl font-serif text-lg leading-snug text-stone-700 sm:text-xl">
                {CORE_THESIS}
              </p>
              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <HeroJumpCard
                  href="#pt1"
                  title="Part 1: AI, the Brain, and Serviam"
                  titleClass="text-emerald-800"
                  grades="A 20-minute student lesson for grades 7–12"
                  description="How AI works, why judgment matters, and how to use it with integrity."
                  buttonLabel="Start here"
                  buttonClass="bg-emerald-800 text-white group-hover:bg-emerald-900"
                />
                <HeroJumpCard
                  href="#pt2"
                  title="Optional Extension: Inside AI"
                  titleClass="text-stone-800"
                  grades="Upper School / AP STEM extension"
                  description="A math, science, and code lab for vectors, similarity, weights, and training."
                  buttonLabel="Go deeper"
                  buttonClass="bg-stone-900 text-white group-hover:bg-stone-800"
                />
              </div>
            </div>
            <Image
              src="/ursuline-ai-assets/01-ai-brain-circuit.png"
              alt=""
              width={140}
              height={140}
              className="mx-auto opacity-90 lg:mx-0"
              priority
              aria-hidden
            />
          </div>
          <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 md:grid-cols-4">
            {[
              { icon: Search, label: "Question" },
              { icon: Check, label: "Verify" },
              { icon: FileText, label: "Attribute" },
              { icon: Heart, label: "Serve" },
            ].map((h) => (
              <div key={h.label} className="flex flex-col items-start gap-2 bg-stone-50 px-4 py-6 sm:gap-3 sm:px-6 sm:py-8">
                <h.icon className="h-5 w-5 text-emerald-800" strokeWidth={1.5} aria-hidden />
                <span className="font-serif text-base sm:text-lg">{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="pt1" className="scroll-mt-28">
        <PartBanner
          part={1}
          title="AI, the Brain, and Serviam"
          subtitle="AI, the Brain, and Serviam · grades 7–12"
        />

      <section
        aria-label="Part 1 handout quick reference"
        className="border-b border-stone-200 bg-gradient-to-br from-emerald-50/80 to-stone-50"
      >
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-emerald-800" strokeWidth={1.5} aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-800">Quick reference</p>
                <p className="mt-1 font-serif text-lg text-stone-900 sm:text-xl">{PT1_HANDOUT.title}</p>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-stone-600">
                  Your quick reference — download the Part 1 handout to follow along and take notes as you work
                  through this lesson.
                </p>
              </div>
            </div>
            <a
              href={PT1_HANDOUT.href}
              download
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900 sm:self-center"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download handout
            </a>
          </div>
        </div>
      </section>

      <section id="pt1-deck" className="scroll-mt-28 border-t border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <p className="mb-4 text-xs uppercase tracking-widest text-amber-700">Part 1 · Slides</p>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 md:text-3xl">AI, the Brain, and Serviam</h3>
              <p className="mt-2 max-w-xl text-sm text-stone-600">
                Follow along with the slides, then work through each section below.
              </p>
            </div>
            <a
              href={PT1_GAMMA_DOCS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition hover:border-emerald-700 hover:bg-emerald-50"
            >
              Open full slides
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="aspect-video w-full">
              <iframe
                src={PT1_GAMMA_EMBED}
                title="AI, the Brain, and Serviam, Part 1 slides"
                className="h-full w-full"
                allow="fullscreen"
                loading="lazy"
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-stone-500">
            Slides not showing? Use <span className="font-medium text-emerald-800">Open full slides</span> above.
          </p>
        </div>
      </section>

      {/* Essential question */}
      <section className="border-t border-stone-200">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 md:py-24">
          <div className="mb-6 text-xs uppercase tracking-widest text-stone-500">Essential question</div>
          <p className="mb-10 font-serif text-2xl leading-tight tracking-tight text-stone-900 sm:text-3xl md:text-5xl">
            How can we understand AI well enough to use it
            <span className="italic text-emerald-800"> wisely</span>,
            <span className="italic text-emerald-800"> truthfully</span>, and in
            <span className="italic text-emerald-800"> service of others</span>?
          </p>
          <p className="mb-4 text-sm text-stone-500">Choose one word that matters most to you.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["wisely", "truthfully", "service", "integrity", "curiosity"].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setFocusWord(w)}
                className={`rounded-full border px-4 py-2 text-sm capitalize transition ${
                  focusWord === w
                    ? "border-emerald-800 bg-emerald-800 text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-stone-900"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why this matters */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="mb-4 text-xs uppercase tracking-widest text-amber-700">Why this matters now</div>
          <h2 className="mb-3 max-w-2xl font-serif text-3xl text-stone-900 md:text-4xl">
            AI is already shaping daily life.
          </h2>
          <p className="mb-8 max-w-xl text-stone-600">
            Many AI systems are powerful because they can generate. Human judgment determines whether that
            output is accurate, ethical, and useful.
          </p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 md:grid-cols-4">
            {["School", "Search", "Social", "Maps", "Writing", "Coding", "Photos", "Music"].map((w) => (
              <button
                key={w}
                type="button"
                className={`relative z-0 min-h-[52px] w-full bg-white px-4 py-5 text-center font-serif text-base text-stone-800 ${TILE_INTERACTIVE} md:text-lg`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Predict */}
      <LessonSection
        id="predict"
        kicker="01 · Warm-up · Think aloud"
        title="Before AI predicts, your brain predicts."
        intro={`Pick the word you think comes next in this ${IDEA_HUB_LABEL} sentence. Then see how likely each option is.`}
      >
        <InteractiveCard>
          <p className="mb-8 font-serif text-2xl leading-relaxed text-stone-900 md:text-3xl">
            {PREDICT_IDEA_SENTENCE_STEM}{" "}
            <span className={pickedHook ? "text-emerald-800" : "text-stone-500"}>
              {pickedHook ?? PREDICT_IDEA_DEFAULT_WORD}
            </span>
            .
          </p>
          <div className="mb-4 text-xs uppercase tracking-widest text-stone-500">What word came to mind?</div>
          <div className="mb-8 flex flex-wrap gap-2">
            {PATHWAY_IDEA_HUB_NEXT.map((c) => (
              <button
                key={c.word}
                type="button"
                onClick={() => {
                  setPickedHook(c.word);
                  setRevealedHook(true);
                }}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                  pickedHook === c.word
                    ? "border-emerald-800 bg-emerald-800 text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-stone-900"
                }`}
              >
                {c.word}
              </button>
            ))}
          </div>
          {revealedHook && (
            <div className="space-y-3">
              <div className="mb-3 text-xs uppercase tracking-widest text-stone-500">How likely is each word?</div>
              {PATHWAY_IDEA_HUB_NEXT.map((c) => (
                <div key={c.word} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-stone-700">{c.word}</div>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        pickedHook === c.word ? "bg-emerald-700" : "bg-stone-400"
                      }`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                  <div className="w-10 text-right text-xs tabular-nums text-stone-500">{c.pct}%</div>
                </div>
              ))}
              <p className="pt-2 text-sm text-stone-500">
                What clues did your brain use? Highest probability is a guess — not proof it is the best idea.
              </p>
            </div>
          )}
        </InteractiveCard>
      </LessonSection>

      {/* Define */}
      <LessonSection
        id="define"
        kicker="02 · Mini-lesson · Core concept"
        title="What is AI?"
        intro="Many AI systems use data and math to find patterns, make predictions, generate content, or support decisions. They can be powerful, but they do not replace your judgment, voice, or conscience. Think of them as fast pattern detectives, not people with wisdom or feelings."
        className="bg-stone-50"
      >
        <InteractiveCard>
          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            {DEFINE_ABILITIES.map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl border border-stone-200 bg-white p-5 ${CARD_LIFT}`}
              >
                <div className="font-serif text-xl text-stone-900 transition-colors md:group-hover:text-emerald-800">
                  {item.label}
                </div>
                <p className="mt-1 text-sm text-stone-600">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="mb-4 text-xs uppercase tracking-widest text-stone-500">AI is bigger than chatbots</p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 md:grid-cols-3">
            {AI_CAPABILITIES.map((cap) => {
              const tipOpen = openCapability === cap.label;
              return (
                <button
                  key={cap.label}
                  type="button"
                  aria-expanded={tipOpen}
                  onClick={() => setOpenCapability((prev) => (prev === cap.label ? null : cap.label))}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                      setOpenCapability((prev) => (prev === cap.label ? null : prev));
                    }
                  }}
                  className={`group relative min-h-[56px] bg-white px-3 py-5 text-center font-serif text-lg text-stone-800 ${TILE_INTERACTIVE}`}
                >
                  <span className="relative z-10">{cap.label}</span>
                  <span
                    className={`pointer-events-none absolute inset-x-2 bottom-full z-20 mb-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-left text-xs font-sans leading-snug text-emerald-900 shadow-md transition-all duration-200 motion-reduce:transition-none ${
                      tipOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-1 opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                    }`}
                    role="tooltip"
                  >
                    {cap.tip}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-sm text-stone-500">
            You interact with AI dozens of times a day, often without knowing it.
          </p>
        </InteractiveCard>
      </LessonSection>

      {/* Human vs machine */}
      <section
        id="compare-learners"
        ref={compareRef}
        className="border-t border-stone-200 bg-white"
      >
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <p
            className={`mb-6 text-center text-sm text-stone-500 transition-all duration-700 ease-out motion-reduce:transition-none ${
              compareRevealed ? "opacity-100" : "opacity-0"
            }`}
          >
            Click or tap a row to compare
          </p>
          <div
            className={`grid gap-8 md:grid-cols-2 motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
              compareRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } transition-all duration-700 ease-out motion-reduce:transition-none`}
          >
            <div className={`rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-8 ${CARD_LIFT}`}>
              <p className="mb-4 text-xs uppercase tracking-widest text-amber-700">Human learner</p>
              <ul className="space-y-2">
                {LEARNER_COMPARE_PAIRS.map((pair, i) => (
                  <li key={pair.human}>
                    <button
                      type="button"
                      onMouseEnter={() => setCompareActiveIndex(i)}
                      onFocus={() => setCompareActiveIndex(i)}
                      onClick={() => setCompareActiveIndex((prev) => (prev === i ? 0 : i))}
                      className={`w-full rounded-xl px-3 py-3 text-left font-serif text-lg transition-all duration-200 ease-out motion-reduce:transition-none ${
                        compareActiveIndex === i
                          ? "bg-emerald-100/90 text-emerald-900 shadow-sm ring-1 ring-emerald-200/80"
                          : "text-stone-800 hover:bg-white/80"
                      }`}
                    >
                      {pair.human}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-8 ${CARD_LIFT}`}>
              <p className="mb-4 text-xs uppercase tracking-widest text-amber-700">AI model</p>
              <ul className="space-y-2">
                {LEARNER_COMPARE_PAIRS.map((pair, i) => (
                  <li key={pair.ai}>
                    <button
                      type="button"
                      onMouseEnter={() => setCompareActiveIndex(i)}
                      onFocus={() => setCompareActiveIndex(i)}
                      onClick={() => setCompareActiveIndex((prev) => (prev === i ? 0 : i))}
                      className={`w-full rounded-xl px-3 py-3 text-left font-serif text-lg transition-all duration-200 ease-out motion-reduce:transition-none ${
                        compareActiveIndex === i
                          ? "bg-amber-100/90 text-amber-950 shadow-sm ring-1 ring-amber-200/80"
                          : "text-stone-800 hover:bg-white/80"
                      }`}
                    >
                      {pair.ai}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p
            className={`mt-8 text-center font-serif text-xl text-stone-700 transition-all duration-700 ease-out motion-reduce:transition-none md:text-2xl ${
              compareRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            The model can produce language. The learner must still question, verify, explain, and decide.
          </p>
        </div>
      </section>

      {/* Pathway */}
      <LessonSection
        id="pathway"
        kicker="03 · How it works · Generation pathway"
        title="From prompt to response (inference)."
        intro={`When you prompt a model, it runs inference — math on patterns it already learned. Trace one ${IDEA_HUB_LABEL} prompt through tokens, vectors, and probability. Training (learning from examples) is a separate process — see Part 2 labs.`}
      >
        <InteractiveCard>
          <p className="mb-4 text-xs uppercase tracking-widest text-emerald-800">Generation pathway · inference</p>
          <div className="mb-4">
            <p className="mb-2 text-xs text-stone-500">Choose a prompt or write your own</p>
            <div className="flex flex-wrap gap-2">
              {PATHWAY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => selectPathwayPreset(preset.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition motion-reduce:transition-none ${
                    !pathwayUseCustom && pathwayPresetId === preset.id
                      ? "border-emerald-800 bg-emerald-800 text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:border-stone-900"
                  }`}
                >
                  {preset.shortLabel}
                </button>
              ))}
              <button
                type="button"
                onClick={switchToCustomPathway}
                className={`rounded-full border px-3 py-1.5 text-sm transition motion-reduce:transition-none ${
                  pathwayUseCustom
                    ? "border-emerald-800 bg-emerald-800 text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-stone-900"
                }`}
              >
                Custom sentence
              </button>
            </div>
          </div>

          {pathwayUseCustom && (
            <div className="mb-4">
              <label htmlFor="pathway-custom" className="sr-only">
                Custom prompt sentence
              </label>
              <input
                id="pathway-custom"
                type="text"
                value={pathwayCustomText}
                onChange={(e) => {
                  setPathwayCustomText(e.target.value);
                  setPathwayCustomHint(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runPathway();
                }}
                placeholder={`e.g. Before the science fair, we asked AI to explain photosynthesis.`}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
              <p className="mt-1.5 text-xs text-stone-500">
                {customWordCount > 0 ? (
                  <>
                    {customWordCount} word{customWordCount === 1 ? "" : "s"}
                    {!customInputValid && customWordCount < PATHWAY_CUSTOM_MIN_WORDS
                      ? ` · add at least ${PATHWAY_CUSTOM_MIN_WORDS} words`
                      : !customInputValid && customWordCount > PATHWAY_CUSTOM_MAX_WORDS
                        ? ` · max ${PATHWAY_CUSTOM_MAX_WORDS} words`
                        : customInputValid
                          ? " · ready to run"
                          : ""}
                  </>
                ) : (
                  `${PATHWAY_CUSTOM_MIN_WORDS}–${PATHWAY_CUSTOM_MAX_WORDS} words · ends with a phrase the model could complete`
                )}
              </p>
              {pathwayCustomHint && (
                <p className="mt-1 text-xs text-amber-800" role="status">
                  {pathwayCustomHint}
                </p>
              )}
            </div>
          )}

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <PathwayPromptSentence
              promptText={pathwayPromptText}
              teachesNextToken={teachesNextToken}
              nextTokenStem={pathwayNextTokenStem}
              pick={pathwayPick}
              defaultWord={pathwayDefaultWord}
              showBlank={showPathwayNextBlank}
            />
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={runPathway}
                disabled={running || (pathwayUseCustom && !customInputValid && pathStep === 0)}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-2 text-sm text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                {running ? "Running…" : pathStep >= PATHWAY_FINAL_STEP ? "Run again" : "Run pathway"}
              </button>
              <button
                type="button"
                onClick={resetPathway}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-3 py-2 text-sm text-stone-600 transition hover:border-stone-900"
                aria-label="Reset pathway"
                title="Reset pathway"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Reset</span>
              </button>
            </div>
          </div>

          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
            {PATHWAY_STEPS.map((s, i) => (
              <div key={s} className="flex shrink-0 items-center gap-2">
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-all ${
                    pathStep > i
                      ? "bg-emerald-100 text-emerald-800"
                      : pathStep === i + 1
                        ? "bg-amber-100 text-amber-900"
                        : "bg-stone-200 text-stone-500"
                  }`}
                >
                  <span className="font-mono">{i + 1}</span>
                  <span>{s}</span>
                </div>
                {i < PATHWAY_STEPS.length - 1 && (
                  <ArrowRight className="h-3 w-3 shrink-0 text-stone-400" aria-hidden />
                )}
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className={`rounded-2xl border border-stone-200 bg-white p-5 transition ${pathStep >= 2 || pathwayPick ? "opacity-100" : "opacity-40"}`}>
              <div className="mb-3 text-xs uppercase tracking-widest text-stone-500">Tokens · puzzle pieces</div>
              <div className="flex flex-wrap gap-2">
                {pathwayTokensVisible > 0 ? (
                  visibleTokens.map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className={`rounded-md border px-2.5 py-1 text-sm transition-all duration-300 motion-reduce:transition-none ${
                        pathwayPick && i >= stemTokens.length
                          ? "border-amber-300 bg-amber-50 text-amber-950 ring-1 ring-amber-200"
                          : "border-emerald-200 bg-emerald-50 text-emerald-900"
                      }`}
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-stone-500">Run the pathway or pick a next word.</span>
                )}
              </div>
              <p className="mt-3 text-xs text-stone-500">
                A language model processes token IDs and vectors, not words with human meaning.
              </p>
            </div>

            <div className={`rounded-2xl border border-stone-200 bg-white p-5 transition ${pathStep >= 3 ? "opacity-100" : "opacity-40"}`}>
              <div className="mb-3 text-xs uppercase tracking-widest text-stone-500">Token IDs</div>
              {visibleTokens.length > 0 ? (
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {visibleTokens.map((t, i) => (
                    <span key={`id-${t}-${i}`} className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-900">
                      {t.slice(0, 12)} → {fakeIdFor(t)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500">Each token maps to a number the model can compute with.</p>
              )}
            </div>

            <div className={`rounded-2xl border border-stone-200 bg-white p-5 transition ${pathStep >= 4 ? "opacity-100" : "opacity-40"}`}>
              <div className="mb-3 text-xs uppercase tracking-widest text-stone-500">Vectors · embeddings</div>
              {visibleTokens.length > 0 ? (
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {visibleTokens.map((t, i) => (
                    <span key={`vec-${t}-${i}`} className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-900">
                      {t.slice(0, 10)} {fakeVectorFor(t)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500">Embeddings turn token IDs into vectors — coordinates in a high-dimensional space.</p>
              )}
            </div>

            <div className={`rounded-2xl border border-stone-200 bg-white p-5 transition ${showPathwayAttention ? "opacity-100" : "opacity-40"}`}>
              <div className="mb-3 text-xs uppercase tracking-widest text-stone-500">Attention · weights on tokens</div>
              <p className="mb-3 text-xs text-stone-500">
                Attention helps the model calculate which token relationships matter in context.
              </p>
              {attentionTokens.length > 0 ? (
                <div className="space-y-2">
                  {attentionTokens.map((row, i) => (
                    <div key={`${row.token}-${i}`} className="flex items-center gap-3">
                      <div className="w-24 truncate text-sm text-stone-700">{row.token}</div>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-700 motion-reduce:transition-none"
                          style={{ width: showPathwayAttention ? `${row.weight}%` : "0%" }}
                        />
                      </div>
                      <div className="w-10 text-right text-xs tabular-nums text-stone-500">
                        {showPathwayAttention ? row.weight : 0}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500">Run the pathway to see attention on this prompt&apos;s tokens.</p>
              )}
            </div>

            <div className={`rounded-2xl border border-stone-200 bg-white p-5 transition ${showPathwayProbabilities ? "opacity-100" : "opacity-40"}`}>
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs uppercase tracking-widest text-stone-500">
                  {teachesNextToken ? "Probability · next token" : "Probability · word weights"}
                </div>
                <span className="text-xs text-stone-500">
                  {teachesNextToken ? "What word might come next? Pick one." : "Tap a word to explore its weight."}
                </span>
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                {pathwayNextTokens.map((p) => (
                  <button
                    key={p.word}
                    type="button"
                    onClick={() => pickPathwayToken(p.word)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-all motion-reduce:transition-none ${
                      pathwayPick === p.word
                        ? "border-emerald-800 bg-emerald-800 text-white"
                        : p.word === pathwayModelTop
                          ? "border-emerald-300 bg-emerald-50 text-emerald-900 hover:border-emerald-700"
                          : "border-stone-300 bg-white text-stone-700 hover:border-stone-900"
                    }`}
                  >
                    {p.word}
                  </button>
                ))}
              </div>
              <div className="space-y-0.5">
                {pathwayNextTokens.map((p) => (
                  <ProbabilityBarRow
                    key={p.word}
                    word={p.word}
                    pct={p.pct}
                    showValues={showPathwayProbabilities}
                    animateBars={showPathwayProbabilities}
                    isModelTop={p.word === pathwayModelTop}
                    isSelected={pathwayPick === p.word}
                    reducedMotion={reducedMotion}
                    onSelect={() => pickPathwayToken(p.word)}
                  />
                ))}
              </div>
              {pathwayPick && (
                <p className="mt-3 text-xs leading-relaxed text-stone-600">
                  {pathwayPick === pathwayModelTop ? (
                    <>
                      You and the model both leaned toward <span className="font-medium text-emerald-800">{pathwayModelTop}</span> — still check facts and fit for your project.
                    </>
                  ) : (
                    <>
                      You picked <span className="font-medium text-emerald-800">{pathwayPick}</span> · Model&apos;s top pick:{" "}
                      <span className="font-medium text-emerald-800">{pathwayModelTop}</span> ({pathwayNextTokens[0].pct}%) — highest probability ≠ correct.
                    </>
                  )}
                </p>
              )}
              <p className="mt-2 text-xs text-stone-500">
                These numbers illustrate how inference works—highest probability is not the same as the best answer.
              </p>
            </div>
          </div>

          <div className={`mt-4 grid gap-4 md:grid-cols-2 ${pathStep >= 6 || pathwayPick ? "opacity-100" : "opacity-40"}`}>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs uppercase tracking-widest text-stone-500">Response</div>
                {pathwayTokensVisible > 0 && (
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 font-mono text-xs tabular-nums text-stone-600">
                    {pathwayTokensVisible} token{pathwayTokensVisible === 1 ? "" : "s"} assembled
                  </span>
                )}
              </div>
              {(pathStep >= 6 || pathwayPick || pathStep >= 2) && pathwayPromptText && (
                <p className="mb-3 font-serif text-base leading-snug text-stone-800">
                  {ensureSentenceEnd(pathwayPromptText)}
                </p>
              )}
              <p className="text-sm leading-relaxed text-stone-700">
                Text is built token by token from probability. It can sound fluent and confident without being correct.
              </p>
            </div>
            <div className={`rounded-2xl border p-5 ${pathStep >= 7 ? "border-emerald-300 bg-emerald-50" : "border-stone-200 bg-white"}`}>
              <div className="flex items-start gap-3">
                <Eye className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                <div>
                  <div className="mb-1 text-xs uppercase tracking-widest text-emerald-800">Human review</div>
                  <p className="text-sm leading-relaxed text-stone-700">
                    Check the claim, source, and reasoning — truthful, fair, and kind. If the answer shifts when you challenge it, treat that as a warning; either way, you still need evidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </InteractiveCard>
      </LessonSection>

      {/* Audit */}
      <LessonSection
        id="audit"
        kicker="04 · Audit an AI answer"
        title="Fluency does not always mean truth."
        intro="A confident answer still needs evidence. Click or tap each claim to mark it as accurate, vague, or misleading."
        className="bg-stone-50"
      >
        <InteractiveCard>
          <div className="mb-6 text-xs uppercase tracking-widest text-stone-400">Practice AI answer</div>
          <p className="mb-8 font-serif text-xl leading-relaxed text-stone-800 md:text-2xl">
            &ldquo;AI works like a human brain. It understands words, remembers facts, and always chooses
            the best answer.&rdquo;
          </p>
          <p className="mb-4 text-sm text-stone-600">
            <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 align-middle" /> Accurate
            <span className="mx-3 inline-block h-2.5 w-2.5 rounded-full bg-amber-400 align-middle" /> Vague
            <span className="mx-3 inline-block h-2.5 w-2.5 rounded-full bg-rose-500 align-middle" /> Misleading
          </p>
          <div className="space-y-3">
            {CLAIMS.map((c, i) => (
              <button
                key={c}
                type="button"
                onClick={() => cycleMark(i)}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${markBg(auditMarks[i])}`}
              >
                <div className={`h-3 w-3 shrink-0 rounded-full ${auditMarks[i] ? "bg-white/80" : "bg-stone-300"}`} />
                <div className="flex-1 text-base">{c}</div>
                <div className="text-xs uppercase tracking-widest opacity-80">{markLabel(auditMarks[i])}</div>
              </button>
            ))}
          </div>
          {auditComplete && (
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <div className="mb-1 font-serif text-lg text-emerald-900">
                  You marked {auditScore} of 3 correctly.
                </div>
                <p className="text-sm leading-relaxed text-emerald-800/90">
                  The brain analogy and wording like &ldquo;understands&rdquo; and &ldquo;remembers&rdquo; oversimplify
                  how AI works. &ldquo;Always chooses the best answer&rdquo; is misleading. Models estimate
                  probability, not truth.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-stone-200 pt-8" aria-labelledby="audit-word-analysis-heading">
            <p
              id="audit-word-analysis-heading"
              className="mb-1 font-serif text-lg leading-relaxed text-stone-900 sm:text-xl"
            >
              Which word is most misleading: understands, remembers, always, or best?
            </p>
            <p className="mb-4 text-sm text-stone-600">Click or tap one word. There is no single right answer.</p>
            <div
              className="flex flex-wrap gap-2"
              role="radiogroup"
              aria-labelledby="audit-word-analysis-heading"
            >
              {AUDIT_MISLEADING_WORDS.map((word) => {
                const selected = auditMisleadingWord === word;
                return (
                  <button
                    key={word}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setAuditMisleadingWord(word)}
                    className={`min-h-[44px] rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 active:scale-[0.98] motion-reduce:active:scale-100 ${
                      selected
                        ? "border-emerald-800 bg-emerald-800 text-white shadow-sm"
                        : "border-stone-300 bg-white text-stone-700 hover:border-emerald-700 hover:text-emerald-900"
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
            {auditMisleadingWord && (
              <div
                className="mt-5 rounded-xl border border-stone-200 bg-white px-4 py-4 sm:px-5 sm:py-5"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm leading-relaxed text-stone-800">
                  {AUDIT_WORD_FEEDBACK[auditMisleadingWord]}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  Any of these can mislead. The strongest critique names why.
                </p>
              </div>
            )}
          </div>

        </InteractiveCard>
      </LessonSection>

      {/* Serviam / Decide */}
      <section id="serviam" className="scroll-mt-28 border-t border-stone-200 bg-emerald-900 text-stone-50">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="mb-4 text-xs uppercase tracking-widest text-amber-300">05 · SERVIAM protocol</div>
              <h2 className="mb-4 font-serif text-4xl leading-tight">The SERVIAM AI protocol.</h2>
              <p className="mb-4 text-emerald-100/80 leading-relaxed">
                Serviam is not just a motto for service projects. It is also a way to make choices when powerful tools are in our hands.
              </p>
              <p className="text-emerald-100/80">
                Seven steps for every AI interaction. Serviam means &ldquo;I will serve.&rdquo;
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-px overflow-hidden rounded-2xl border border-emerald-700/40 bg-emerald-800/40">
                {SERVIAM.map((s) => (
                  <div
                    key={s.letter}
                    className="grid grid-cols-12 items-baseline gap-3 bg-emerald-900 px-5 py-5 transition hover:bg-emerald-800/40 md:gap-4 md:px-6 md:py-6"
                  >
                    <div className="col-span-2 font-serif text-4xl leading-none text-amber-300 md:col-span-1 md:text-5xl">
                      {s.letter}
                    </div>
                    <div className="col-span-3 font-serif text-lg text-stone-50 md:col-span-2 md:text-xl">
                      {s.word}
                    </div>
                    <div className="col-span-7 text-sm leading-relaxed text-emerald-100/85 md:col-span-9">
                      {s.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice */}
      <LessonSection
        id="practice"
        kicker="06 · Green, yellow, red"
        title="Green, yellow, red AI choices."
        intro="The color is about how you use the tool, not the tool itself. Mark each scenario."
      >
        <InteractiveCard className="space-y-3 !p-6 md:!p-8">
          <div className="mb-2 grid grid-cols-3 gap-2 text-center text-xs uppercase tracking-widest text-stone-500">
            <span>Green · supports learning</span>
            <span>Yellow · needs boundaries</span>
            <span>Red · undermines integrity</span>
          </div>
          {SCENARIOS.map((sc, i) => (
            <div
              key={sc.text}
              className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 md:flex-row md:items-center"
            >
              <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotBg(decisions[i])}`} />
              <div className="flex-1 text-stone-800">{sc.text}</div>
              <div className="flex shrink-0 gap-2">
                {(["green", "yellow", "red"] as const).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setDecision(i, color)}
                    aria-label={`Mark as ${color}`}
                    className={`h-11 min-h-[44px] w-11 min-w-[44px] rounded-full border-2 transition-all ${
                      decisions[i] === color
                        ? color === "green"
                          ? "scale-110 border-emerald-600 bg-emerald-500"
                          : color === "yellow"
                            ? "scale-110 border-amber-500 bg-amber-400"
                            : "scale-110 border-rose-600 bg-rose-500"
                        : color === "green"
                          ? "border-emerald-300 hover:bg-emerald-50"
                          : color === "yellow"
                            ? "border-amber-300 hover:bg-amber-50"
                            : "border-rose-300 hover:bg-rose-50"
                    }`}
                  />
                ))}
              </div>
              {decisions[i] && decisions[i] === sc.answer && (
                <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
              )}
            </div>
          ))}
        </InteractiveCard>
      </LessonSection>

      {/* Reflect */}
      <LessonSection
        id="reflect"
        kicker="07 · Reflection"
        title="One power. One limit. One promise."
        intro="Keep this. Revisit it in six months."
        className="bg-stone-50"
      >
        <InteractiveCard>
          <div className="space-y-8">
            {(
              [
                {
                  key: "power" as const,
                  label: "Power: AI can…",
                  hint: "What is one specific capability you saw today?",
                },
                {
                  key: "limit" as const,
                  label: "Limit: AI cannot promise…",
                  hint: "What is one real limitation to remember?",
                },
                {
                  key: "promise" as const,
                  label: "Promise: I will…",
                  hint: "What is one commitment for using AI with integrity?",
                },
              ] as const
            ).map((f) => (
              <div key={f.key}>
                <label htmlFor={`reflection-${f.key}`} className="mb-1 block text-xs uppercase tracking-widest text-stone-500">
                  {f.label}
                </label>
                <p className="mb-2 text-sm text-stone-500">{f.hint}</p>
                <input
                  id={`reflection-${f.key}`}
                  value={reflection[f.key]}
                  onChange={(e) => setReflection({ ...reflection, [f.key]: e.target.value })}
                  className="w-full border-b border-stone-300 bg-transparent py-3 font-serif text-xl text-stone-900 outline-none transition-colors focus:border-emerald-700 md:text-2xl"
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        </InteractiveCard>
      </LessonSection>

      {/* Closing */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
          <p className="font-serif text-2xl leading-tight tracking-tight text-stone-900 md:text-4xl">
            {CORE_THESIS}
          </p>
        </div>
      </section>

      {/* Part 1 handout */}
      <section id="pt1-handout" className="scroll-mt-24 border-t border-stone-200 bg-white sm:scroll-mt-28">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 md:py-20">
          <div className="mb-4 text-xs uppercase tracking-widest text-emerald-800">Part 1 · Handout</div>
          <h2 className="mb-4 font-serif text-2xl text-stone-900 sm:text-3xl">Serviam Use Card</h2>
          <p className="mb-8 max-w-xl font-serif text-base leading-relaxed text-stone-700 sm:text-lg">
            {CORE_THESIS}
          </p>
          <div className="max-w-xl">
            <StudentHandoutCard {...PT1_HANDOUT} />
          </div>
        </div>
      </section>
      </div>

      <section id="pt2" className="scroll-mt-28 border-t border-stone-300">
        <PartBanner
          part={2}
          title="Inside AI"
          subtitle="Extension · Upper School · AP STEM"
          variant="dark"
        />

        <section className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-16 md:py-20">
            <p className="mb-4 text-xs uppercase tracking-widest text-stone-500">Part 2 · Essential question</p>
            <p className="font-serif text-xl leading-tight text-stone-900 sm:text-2xl md:text-4xl">
              How does language become math, and math become a response?
            </p>
          </div>
        </section>

        <section id="pt2-deck" className="scroll-mt-24 border-t border-stone-200 bg-stone-50 sm:scroll-mt-28">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 md:py-16">
            <p className="mb-4 text-xs uppercase tracking-widest text-amber-700">Part 2 · Slides</p>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <h3 className="font-serif text-2xl text-stone-900 md:text-3xl">Inside AI</h3>
              {pt2DeckReady && (
                <a
                  href={PT2_GAMMA_DOCS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-100"
                >
                  Open full slides
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              )}
            </div>
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              {pt2DeckReady ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={PT2_GAMMA_EMBED}
                    title="Inside AI, Part 2 slides"
                    className="h-full w-full"
                    allow="fullscreen"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-stone-50 px-6 py-12 text-center">
                  <p className="font-serif text-xl text-stone-800">Your class slides will appear here.</p>
                  <p className="max-w-md text-sm leading-relaxed text-stone-600">
                    Start with the interactive labs below. They cover vectors, weights, and training. You will see
                    the same ideas in the slides.
                  </p>
                  <a
                    href="#pt2-labs"
                    className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                  >
                    Go to labs
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              )}
            </div>
            {pt2DeckReady && (
              <p className="mt-4 text-sm text-stone-500">
                Slides not showing? Use <span className="font-medium text-stone-800">Open full slides</span> above.
              </p>
            )}
          </div>
        </section>

        <section id="pt2-labs" className="scroll-mt-24 border-t border-stone-200 bg-stone-50 sm:scroll-mt-28">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 md:py-16">
            <p className="mb-4 text-xs uppercase tracking-widest text-amber-700">Part 2 · Interactive labs</p>
            <h3 className="mb-3 font-serif text-2xl text-stone-900 md:text-3xl">Try the math behind the model</h3>
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-stone-600">
              Change the inputs and watch how similarity and training work.
            </p>
            <InsideAiMathSlideLabs />
          </div>
        </section>

        <section id="pt2-handout" className="scroll-mt-24 border-t border-stone-200 bg-white sm:scroll-mt-28">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 md:py-20">
            <p className="mb-4 text-xs uppercase tracking-widest text-emerald-800">Part 2 · Lab Sheet</p>
            <h2 className="mb-8 font-serif text-2xl text-stone-900 sm:text-3xl">Inside AI Lab Notes</h2>
            <div className="max-w-xl">
              <StudentHandoutCard {...PT2_HANDOUT} />
            </div>
          </div>
        </section>
      </section>

      <LessonSection
        id="women-leading-ai"
        kicker="Women leading AI"
        title="Women are already shaping AI"
        intro="AI is not just a tool students use. It is a field students can lead. Computer scientists, engineers, designers, ethicists, physicians, artists, and entrepreneurs are all shaping how intelligent tools are built and used."
        className="bg-stone-50"
      >
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AI_LEADERS.map((leader) => (
              <div
                key={leader.name}
                className={`rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 ${CARD_LIFT} md:hover:border-emerald-200`}
              >
                <div className="font-serif text-lg text-stone-900 sm:text-xl">{leader.name}</div>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{leader.focus}</p>
              </div>
            ))}
          </div>

          <div
            className={`rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 to-white p-5 sm:rounded-3xl sm:p-8 ${CARD_LIFT} md:hover:border-emerald-300`}
          >
            <p className="mb-1 text-xs uppercase tracking-widest text-emerald-800">Your turn</p>
            <p className="font-serif text-lg leading-relaxed text-stone-900 sm:text-xl">
              Which kind of AI problem would you want to help solve: fairness, health, climate,
              education, creativity, or accessibility?
            </p>
            <p className="mt-3 text-sm text-stone-600">Click or tap one area that matters to you.</p>
            <div
              className="mt-6 flex flex-wrap gap-2"
              role="group"
              aria-label="AI problem areas you want to help solve"
            >
              {AI_PROBLEM_AREAS.map((area) => {
                const selected = aiProblemFocus === area.id;
                return (
                  <button
                    key={area.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setAiProblemFocus(area.id)}
                    className={`min-h-[44px] rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 active:scale-[0.98] motion-reduce:active:scale-100 ${
                      selected
                        ? "border-emerald-800 bg-emerald-800 text-white shadow-sm"
                        : "border-stone-300 bg-white text-stone-700 hover:border-emerald-700 hover:text-emerald-900"
                    }`}
                  >
                    {area.label}
                  </button>
                );
              })}
            </div>
            {aiProblemFocus && (
              <div
                className="mt-6 rounded-xl border border-emerald-200 bg-white/90 px-4 py-4 sm:px-5 sm:py-5"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm leading-relaxed text-emerald-900">
                  <span className="font-medium">
                    {AI_PROBLEM_AREAS.find((a) => a.id === aiProblemFocus)?.label}
                  </span>
                  {" — "}
                  {AI_PROBLEM_AFFIRMATION}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  You do not need a title yet. Naming the problem you care about is how future leaders
                  in AI begin.
                </p>
              </div>
            )}
          </div>
        </div>
      </LessonSection>

      <section
        id="serviam-design-challenge"
        className="scroll-mt-24 border-t border-stone-200 bg-white sm:scroll-mt-28"
      >
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 md:py-24">
          <div className="grid gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4">
              <div className="mb-4 text-xs uppercase tracking-widest text-emerald-800">Optional extension</div>
              <h2 className="font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">
                Serviam Design Challenge
              </h2>
            </div>
            <div className="md:col-span-8">
              <div
                className={`rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-5 sm:rounded-3xl sm:p-8 md:p-10 ${CARD_LIFT} md:hover:border-emerald-300 md:hover:from-emerald-50`}
              >
                <p className="font-serif text-lg leading-relaxed text-stone-900 sm:text-xl">
                  Design an AI tool that serves someone.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-stone-700 sm:text-base">
                  Choose one group: a new student, an older neighbor, a student who needs extra support in class, a
                  busy teacher, or a local nonprofit. What would your AI tool help them do? What risks would you plan
                  for? How would you keep it truthful, fair, and kind?
                </p>
                <div className="mt-8">
                  <label htmlFor="serviam-challenge-notes" className="mb-2 block text-xs uppercase tracking-widest text-emerald-800">
                    Your idea (optional)
                  </label>
                  <textarea
                    id="serviam-challenge-notes"
                    value={serviamChallenge}
                    onChange={(e) => setServiamChallenge(e.target.value)}
                    rows={5}
                    placeholder="Who would you design for? What would your tool do, and what would you check before sharing it?"
                    className="w-full resize-y rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 sm:text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faculty"
        aria-labelledby="leadership-review-heading"
        className="scroll-mt-24 border-t border-stone-300 bg-stone-100 sm:scroll-mt-28"
      >
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 md:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">
            For Leadership Review
          </p>
          <h2 id="leadership-review-heading" className="mb-2 font-serif text-2xl text-stone-900 sm:text-3xl">
            Teacher lesson plans — Part 1 &amp; Part 2
          </h2>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-stone-600">
            Facilitation guides for leadership reviewers evaluating this submission. These teacher
            plans sit alongside the student materials above and are not part of the student
            experience.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {TEACHER_PLANS.map((plan) => (
              <a
                key={plan.href}
                href={plan.href}
                download
                className="group flex flex-col rounded-2xl border border-stone-300 bg-white p-5 transition hover:border-stone-400 hover:shadow-sm sm:p-6"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <FileText className="h-5 w-5 shrink-0 text-stone-600" strokeWidth={1.5} aria-hidden />
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-stone-500">
                    {plan.part}
                  </span>
                </div>
                <div className="mb-1 font-serif text-lg text-stone-900">{plan.title}</div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-stone-600">{plan.description}</p>
                <span className="inline-flex min-h-[44px] items-center gap-2 text-xs font-medium text-stone-700 transition group-hover:text-stone-900">
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  Download lesson plan
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-stone-50">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-4 py-8 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-10">
          <span>Ursuline Academy · Dedham</span>
          <span className="font-serif italic">Serviam.</span>
        </div>
      </footer>
    </div>
  );
}
