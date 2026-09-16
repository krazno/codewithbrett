/**
 * Exact function, domain, and range helpers for UA Function Garden.
 * Visual components should call these — do not infer range from sampled graph points.
 */

export const GRAPH_X_MIN = -6;
export const GRAPH_X_MAX = 6;
export const GRAPH_Y_MIN = -8;
export const GRAPH_Y_MAX = 18;
export const DEFAULT_STEP = 1;
export const DEFAULT_RESTRICTED: RestrictedDomain = {
  left: -3,
  right: 3,
  leftClosed: true,
  rightClosed: true,
};

export type FnId = "f" | "g" | "h";
export type DomainMode = "full" | "restricted";

export type RestrictedDomain = {
  left: number;
  right: number;
  leftClosed: boolean;
  rightClosed: boolean;
};

export type Interval = {
  empty: boolean;
  unboundedLeft: boolean;
  unboundedRight: boolean;
  left: number | null;
  right: number | null;
  leftClosed: boolean;
  rightClosed: boolean;
};

export type FunctionDef = {
  id: FnId;
  letter: "f" | "g" | "h";
  rule: string;
  display: string;
  evaluate: (x: number) => number;
  substitutionLines: (x: number) => string[];
};

const REAL_LINE: Interval = {
  empty: false,
  unboundedLeft: true,
  unboundedRight: true,
  left: null,
  right: null,
  leftClosed: false,
  rightClosed: false,
};

function closedRay(start: number): Interval {
  return {
    empty: false,
    unboundedLeft: false,
    unboundedRight: true,
    left: start,
    right: null,
    leftClosed: true,
    rightClosed: false,
  };
}

export const EMPTY_INTERVAL: Interval = {
  empty: true,
  unboundedLeft: false,
  unboundedRight: false,
  left: null,
  right: null,
  leftClosed: false,
  rightClosed: false,
};

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return n > 0 ? "∞" : "-∞";
  const rounded = Math.round(n * 1e10) / 1e10;
  if (Object.is(rounded, -0)) return "0";
  return String(rounded);
}

export function formatPair(x: number, y: number): string {
  return `(${formatNumber(x)}, ${formatNumber(y)})`;
}

function formatTerm(n: number): string {
  return formatNumber(n);
}

export const FUNCTIONS: Record<FnId, FunctionDef> = {
  f: {
    id: "f",
    letter: "f",
    rule: "x + 2",
    display: "f(x) = x + 2",
    evaluate: (x) => x + 2,
    substitutionLines: (x) => {
      const y = x + 2;
      return [
        `f(${formatTerm(x)}) = ${formatTerm(x)} + 2`,
        `f(${formatTerm(x)}) = ${formatTerm(y)}`,
      ];
    },
  },
  g: {
    id: "g",
    letter: "g",
    rule: "x² − 1",
    display: "g(x) = x² − 1",
    evaluate: (x) => x * x - 1,
    substitutionLines: (x) => {
      const sq = x * x;
      const y = sq - 1;
      return [
        `g(${formatTerm(x)}) = ${formatTerm(x)}² − 1`,
        `g(${formatTerm(x)}) = ${formatTerm(sq)} − 1`,
        `g(${formatTerm(x)}) = ${formatTerm(y)}`,
      ];
    },
  },
  h: {
    id: "h",
    letter: "h",
    rule: "|x| − 2",
    display: "h(x) = |x| − 2",
    evaluate: (x) => Math.abs(x) - 2,
    substitutionLines: (x) => {
      const abs = Math.abs(x);
      const y = abs - 2;
      return [
        `h(${formatTerm(x)}) = |${formatTerm(x)}| − 2`,
        `h(${formatTerm(x)}) = ${formatTerm(abs)} − 2`,
        `h(${formatTerm(x)}) = ${formatTerm(y)}`,
      ];
    },
  },
};

export const FUNCTION_ORDER: FnId[] = ["f", "g", "h"];

export function snapToStep(value: number, step = DEFAULT_STEP): number {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

export function clampToWindow(x: number): number {
  return Math.min(GRAPH_X_MAX, Math.max(GRAPH_X_MIN, x));
}

export function normalizeDomain(d: RestrictedDomain): RestrictedDomain {
  if (d.left < d.right) return d;
  if (d.left > d.right) {
    return {
      left: d.right,
      right: d.left,
      leftClosed: d.rightClosed,
      rightClosed: d.leftClosed,
    };
  }
  return d;
}

export function isDomainEmpty(d: RestrictedDomain): boolean {
  const n = normalizeDomain(d);
  if (n.left < n.right) return false;
  return !(n.leftClosed && n.rightClosed);
}

/** Is x an allowed input for the current domain setting? */
export function isInputAllowed(
  x: number,
  mode: DomainMode,
  domain: RestrictedDomain,
): boolean {
  if (mode === "full") return true;
  const n = normalizeDomain(domain);
  if (isDomainEmpty(n)) return false;
  if (x < n.left || x > n.right) return false;
  if (x === n.left && !n.leftClosed) return false;
  if (x === n.right && !n.rightClosed) return false;
  return true;
}

export function explainExcludedInput(
  x: number,
  domain: RestrictedDomain,
): string {
  const n = normalizeDomain(domain);
  if (isDomainEmpty(n)) {
    return "This restricted domain has no permitted inputs. Close at least one endpoint, or widen the interval.";
  }
  if (x === n.left && !n.leftClosed) {
    return `${formatNumber(x)} is not included because the left endpoint is open. Open circles are not included.`;
  }
  if (x === n.right && !n.rightClosed) {
    return `${formatNumber(x)} is not included because the right endpoint is open. Open circles are not included.`;
  }
  return `${formatNumber(x)} is outside the restricted domain. Every allowed input produces an output — try a value inside the highlighted interval.`;
}

export function formatInterval(interval: Interval): string {
  if (interval.empty) return "∅";
  const left = interval.unboundedLeft ? "-∞" : formatNumber(interval.left ?? 0);
  const right = interval.unboundedRight ? "∞" : formatNumber(interval.right ?? 0);
  const lb = interval.unboundedLeft || !interval.leftClosed ? "(" : "[";
  const rb = interval.unboundedRight || !interval.rightClosed ? ")" : "]";
  return `${lb}${left}, ${right}${rb}`;
}

export function describeInterval(
  interval: Interval,
  kind: "input" | "output",
): string {
  const noun = kind === "input" ? "Inputs" : "Outputs";
  if (interval.empty) {
    return kind === "input"
      ? "No permitted inputs in this restricted domain."
      : "No resulting outputs in this restricted domain.";
  }
  if (interval.unboundedLeft && interval.unboundedRight) {
    return kind === "input" ? "All real inputs." : "All real outputs.";
  }
  if (interval.unboundedRight && interval.left != null) {
    const include = interval.leftClosed ? "including" : "not including";
    return `${noun} from ${formatNumber(interval.left)} upward, ${include} ${formatNumber(interval.left)}.`;
  }
  if (interval.unboundedLeft && interval.right != null) {
    const include = interval.rightClosed ? "including" : "not including";
    return `${noun} through ${formatNumber(interval.right)}, ${include} ${formatNumber(interval.right)}.`;
  }
  if (
    interval.left != null &&
    interval.right != null &&
    interval.left === interval.right
  ) {
    return `Only the ${kind === "input" ? "input" : "output"} ${formatNumber(interval.left)}.`;
  }
  if (interval.left == null || interval.right == null) return "";
  const leftPhrase = interval.leftClosed
    ? `including ${formatNumber(interval.left)}`
    : `not including ${formatNumber(interval.left)}`;
  const rightPhrase = interval.rightClosed
    ? `including ${formatNumber(interval.right)}`
    : `not including ${formatNumber(interval.right)}`;
  return `${noun} from ${formatNumber(interval.left)} through ${formatNumber(interval.right)}, ${leftPhrase} but ${rightPhrase}.`;
}

function finiteInterval(
  left: number,
  right: number,
  leftClosed: boolean,
  rightClosed: boolean,
): Interval {
  if (left > right) return EMPTY_INTERVAL;
  if (left === right && !(leftClosed && rightClosed)) return EMPTY_INTERVAL;
  return {
    empty: false,
    unboundedLeft: false,
    unboundedRight: false,
    left,
    right,
    leftClosed,
    rightClosed,
  };
}

/** Full (unrestricted) domain — never confuse this with the graphing window. */
export function fullDomain(_id: FnId): Interval {
  return REAL_LINE;
}

export function fullRange(id: FnId): Interval {
  if (id === "f") return REAL_LINE;
  if (id === "g") return closedRay(-1);
  return closedRay(-2);
}

/**
 * Range of f(x)=x+2 on a restricted interval.
 * Linear and increasing, so endpoint images keep their inclusion flags.
 */
export function restrictedRangeLinear(domain: RestrictedDomain): Interval {
  const n = normalizeDomain(domain);
  if (isDomainEmpty(n)) return EMPTY_INTERVAL;
  return finiteInterval(n.left + 2, n.right + 2, n.leftClosed, n.rightClosed);
}

/**
 * Range of an even “V / parabola” with a unique minimum at x = 0
 * (g(x)=x²−1 and h(x)=|x|−2).
 *
 * Minimum: g/h at 0 if 0 is permitted; otherwise the allowed value nearest 0
 * (an open endpoint at 0 means the vertex value is an infimum, not attained).
 *
 * Maximum: the allowed endpoint with greater |x|. If both endpoints give the
 * same output, that output is included when at least one of those endpoints is.
 */
export function restrictedRangeEvenMinAtZero(
  domain: RestrictedDomain,
  fn: (x: number) => number,
): Interval {
  const n = normalizeDomain(domain);
  if (isDomainEmpty(n)) return EMPTY_INTERVAL;

  const yL = fn(n.left);
  const yR = fn(n.right);
  const zeroInterior = n.left < 0 && n.right > 0;
  const zeroIncluded = isInputAllowed(0, "restricted", n);

  let minVal: number;
  let minIncluded: boolean;

  if (zeroIncluded || zeroInterior) {
    // Interior points are always permitted; vertex output is attained.
    minVal = fn(0);
    minIncluded = true;
  } else if (n.left === 0 && !n.leftClosed) {
    // (0, R] — approaches the vertex from the right, never includes it.
    minVal = fn(0);
    minIncluded = false;
  } else if (n.right === 0 && !n.rightClosed) {
    // [L, 0)
    minVal = fn(0);
    minIncluded = false;
  } else if (n.right <= 0) {
    // Entirely to the left of 0: nearest allowed x is the right endpoint.
    minVal = yR;
    minIncluded = n.rightClosed;
  } else {
    // Entirely to the right of 0: nearest allowed x is the left endpoint.
    minVal = yL;
    minIncluded = n.leftClosed;
  }

  let maxVal: number;
  let maxIncluded: boolean;
  if (yL > yR) {
    maxVal = yL;
    maxIncluded = n.leftClosed;
  } else if (yR > yL) {
    maxVal = yR;
    maxIncluded = n.rightClosed;
  } else {
    maxVal = yL;
    maxIncluded = n.leftClosed || n.rightClosed;
  }

  return finiteInterval(minVal, maxVal, minIncluded, maxIncluded);
}

export function domainInterval(
  mode: DomainMode,
  id: FnId,
  restricted: RestrictedDomain,
): Interval {
  if (mode === "full") return fullDomain(id);
  const n = normalizeDomain(restricted);
  if (isDomainEmpty(n)) return EMPTY_INTERVAL;
  return finiteInterval(n.left, n.right, n.leftClosed, n.rightClosed);
}

export function rangeInterval(
  mode: DomainMode,
  id: FnId,
  restricted: RestrictedDomain,
): Interval {
  if (mode === "full") return fullRange(id);
  if (id === "f") return restrictedRangeLinear(restricted);
  return restrictedRangeEvenMinAtZero(restricted, FUNCTIONS[id].evaluate);
}

export function nearestAllowedInput(
  x: number,
  mode: DomainMode,
  domain: RestrictedDomain,
  step = DEFAULT_STEP,
): number | null {
  const snapped = snapToStep(clampToWindow(x), step);
  if (isInputAllowed(snapped, mode, domain)) return snapped;
  if (mode === "full") return snapped;

  const n = normalizeDomain(domain);
  if (isDomainEmpty(n)) return null;

  const candidates: number[] = [];
  for (let t = n.left; t <= n.right + 1e-9; t += step) {
    const v = snapToStep(t, step);
    if (isInputAllowed(v, "restricted", n)) candidates.push(v);
  }
  if (candidates.length === 0) return null;
  return candidates.reduce((best, v) =>
    Math.abs(v - snapped) < Math.abs(best - snapped) ? v : best,
  );
}
