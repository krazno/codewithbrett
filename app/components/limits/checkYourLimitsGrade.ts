export type GradeMark = "correct" | "incorrect" | "choose";

export const ALGEBRA = {
  1: {
    offsets: [-3, 3] as [number, number],
    simplified: "x+3" as const,
    limit: 6,
    factorChoices: ["(x - 3)(x + 3)", "(x - 3)(x - 3)", "(x + 9)(x - 1)"],
    correctChoice: "(x - 3)(x + 3)",
  },
  2: {
    offsets: [-2, -3] as [number, number],
    simplified: "x-3" as const,
    limit: -1,
    factorChoices: ["(x - 2)(x - 3)", "(x - 2)(x + 3)", "(x - 6)(x + 1)"],
    correctChoice: "(x - 2)(x - 3)",
  },
} as const;

export const SIDES = {
  3: { left: 2, right: -1, exists: false as const },
  4: { left: 3, right: 3, exists: true as const, value: 3 },
  5: { left: 1, right: 1, exists: true as const, value: 1 },
} as const;

export function normalizeExpr(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/[·×]/g, "*")
    .replace(/\s+/g, "");
}

function offsetsMatch(a: number, b: number, expected: readonly [number, number]) {
  const [e1, e2] = expected;
  return (a === e1 && b === e2) || (a === e2 && b === e1);
}

export function parseTwoLinearFactors(raw: string): [number, number] | null {
  const n = normalizeExpr(raw).replace(/\)\*\(/g, ")(");
  const matched = n.match(/^\(x([+-]\d+)\)\(x([+-]\d+)\)$/);
  if (!matched) return null;
  return [Number(matched[1]), Number(matched[2])];
}

export function gradeFactors(
  raw: string,
  expected: readonly [number, number],
  picked?: string | null,
): GradeMark {
  if (picked) {
    const parsedPick = parseTwoLinearFactors(picked);
    if (parsedPick && offsetsMatch(parsedPick[0], parsedPick[1], expected)) {
      return "correct";
    }
    if (parsedPick) return "incorrect";
  }
  const n = normalizeExpr(raw);
  if (!n) return "incorrect";
  const parsed = parseTwoLinearFactors(n);
  if (!parsed) return "choose";
  return offsetsMatch(parsed[0], parsed[1], expected) ? "correct" : "incorrect";
}

export function gradeSimplified(
  raw: string,
  expected: "x+3" | "x-3",
): GradeMark {
  const n = normalizeExpr(raw);
  if (!n) return "incorrect";
  const plus = ["x+3", "3+x", "1x+3", "+x+3"];
  const minus = ["x-3", "-3+x", "1x-3"];
  const aliases = expected === "x+3" ? plus : minus;
  if (aliases.includes(n)) return "correct";
  if (/^[+-]?\d*x[+-]\d+$/.test(n) || /^[+-]?\d+[+-]\d*x$/.test(n)) {
    return "incorrect";
  }
  return "choose";
}

export function gradeNumber(raw: string, expected: number): boolean {
  const n = Number(normalizeExpr(raw).replace(/,/g, ""));
  return Number.isFinite(n) && Math.abs(n - expected) < 1e-6;
}

export function gradeExists(value: "yes" | "no" | null, exists: boolean): boolean {
  if (value == null) return false;
  return (value === "yes") === exists;
}
