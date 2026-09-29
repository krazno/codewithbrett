export const RULE_IDS = [
  "sum",
  "difference",
  "constant",
  "product",
  "quotient",
  "power",
  "root",
  "composite",
] as const;

export type RuleId = (typeof RULE_IDS)[number];

export type Step = { math: string; text: string };

export type GraphSpec = {
  curves: {
    fn: (x: number) => number | null;
    color: string;
    label: string;
  }[];
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  c: number;
  vAsymptote?: number;
  marks: {
    x: number;
    y: number;
    label: string;
    color?: string;
    dx?: number;
    dy?: number;
    anchor?: "start" | "middle" | "end";
    open?: boolean;
  }[];
  skip?: (x: number) => boolean;
};

export type BuildPiece = { id: string; math: string };
export type BuildSpec = {
  slots: number;
  solution: string[];
  bank: BuildPiece[];
};

export type NextSpec = {
  given: Step[];
  question: string;
  choices: string[];
  answer: number;
  why: string;
};

export type QuickSpec = {
  identify: { question: string; choices: string[]; answer: number };
  calculate: { question: string; math: string; answer: number; accept?: string[] };
  explain: { question: string; model: string };
};

export type Rule = {
  id: RuleId;
  name: string;
  say: string;
  formula: string;
  formulaText: string;
  note?: string;
  shared: { steps: Step[]; graph: GraphSpec };
  second: { steps: Step[] };
  build: BuildSpec;
  next: NextSpec;
  quick: QuickSpec;
};

const NAVY = "#1B2A4A";
const GREEN = "#0b4a33";
const GOLD = "#B45309";

export const SHARED = {
  fMath: String.raw`f(x)=x+1`,
  gMath: String.raw`g(x)=x^{2}`,
  fText: "f(x) = x + 1",
  gText: "g(x) = x^2",
  c: 2,
  Lf: 3,
  Lg: 4,
  f: (x: number) => x + 1,
  g: (x: number) => x * x,
};

export const INTRO_GRAPH: GraphSpec = {
  curves: [
    { fn: SHARED.f, color: NAVY, label: "f" },
    { fn: SHARED.g, color: GREEN, label: "g" },
  ],
  xMin: 0,
  xMax: 4,
  yMin: -1,
  yMax: 18,
  c: 2,
  marks: [
    { x: 2, y: 3, label: "(2, 3)", color: NAVY, dx: -14, dy: 20, anchor: "end" },
    { x: 2, y: 4, label: "(2, 4)", color: GREEN, dx: 14, dy: -16 },
  ],
};

const PLUS = { id: "plus", math: "+" };
const MINUS = { id: "minus", math: "-" };
const TIMES = { id: "times", math: String.raw`\cdot` };
const EQ1 = { id: "eq1", math: "=" };
const EQ2 = { id: "eq2", math: "=" };

function windowFor(
  fn: (x: number) => number | null,
  c: number,
  markY: number,
  extra?: Partial<GraphSpec>,
): GraphSpec {
  const xMin = extra?.xMin ?? c - 2.5;
  const xMax = extra?.xMax ?? c + 2.5;
  return {
    curves: [{ fn, color: NAVY, label: "y" }],
    xMin,
    xMax,
    yMin: extra?.yMin ?? Math.min(-1, markY) - 2,
    yMax: extra?.yMax ?? Math.max(markY, 2) + 3,
    c,
    marks: [{ x: c, y: markY, label: extra?.marks?.[0]?.label ?? `(${c}, ${markY})` }],
    skip: extra?.skip,
  };
}

export const RULES: Rule[] = [
  {
    id: "sum",
    name: "Sum Rule",
    say: "The limit of a sum is the sum of the limits.",
    formula: String.raw`\begin{aligned}\lim_{x\to c}\bigl[f(x)+g(x)\bigr]&=\lim_{x\to c}f(x)+\lim_{x\to c}g(x)\\&=L+M\end{aligned}`,
    formulaText: "lim (f+g) = lim f + lim g = L + M",
    shared: {
      steps: [
        { math: String.raw`\lim_{x\to 2}\bigl[(x+1)+x^{2}\bigr]`, text: "lim as x→2 of [(x+1)+x²]" },
        { math: String.raw`=\lim_{x\to 2}(x+1)+\lim_{x\to 2}x^{2}`, text: "= lim(x+1) + lim x²" },
        { math: String.raw`=3+4`, text: "= 3 + 4" },
        { math: String.raw`=7`, text: "= 7" },
      ],
      graph: windowFor((x) => x * x + x + 1, 2, 7, {
        xMin: 0,
        xMax: 4,
        yMin: -1,
        yMax: 16,
        marks: [{ x: 2, y: 7, label: "(2, 7)" }],
      }),
    },
    second: {
      steps: [
        { math: String.raw`\lim_{x\to -1}\bigl[(2x^{2}+3)+(x^{3}-2x)\bigr]`, text: "lim as x→-1 of [(2x²+3)+(x³-2x)]" },
        { math: String.raw`=\lim_{x\to -1}(2x^{2}+3)+\lim_{x\to -1}(x^{3}-2x)`, text: "= lim(2x²+3) + lim(x³-2x)" },
        { math: String.raw`=\bigl[2(-1)^{2}+3\bigr]+\bigl[(-1)^{3}-2(-1)\bigr]`, text: "= [2(1)+3] + [-1+2]" },
        { math: String.raw`=5+1`, text: "= 5 + 1" },
        { math: String.raw`=6`, text: "= 6" },
      ],
    },
    build: {
      slots: 7,
      solution: ["lim-sum", "eq1", "lim-f", "plus", "lim-g", "eq2", "LplusM"],
      bank: [
        { id: "lim-sum", math: String.raw`\lim(f+g)` },
        { id: "lim-f", math: String.raw`\lim f` },
        { id: "lim-g", math: String.raw`\lim g` },
        PLUS,
        MINUS,
        TIMES,
        EQ1,
        EQ2,
        { id: "LplusM", math: "L+M" },
        { id: "LM", math: "LM" },
      ],
    },
    next: {
      given: [
        { math: String.raw`\lim_{x\to 2}\bigl[(x+1)+x^{2}\bigr]`, text: "lim as x→2 of [(x+1)+x²]" },
        { math: String.raw`=\lim_{x\to 2}(x+1)+\lim_{x\to 2}x^{2}`, text: "= lim(x+1) + lim x²" },
      ],
      question: "What should we do next?",
      choices: [
        "Add the functions first, then take one limit",
        "Evaluate each simpler limit",
        "Multiply the limits",
        "Differentiate",
      ],
      answer: 1,
      why: "The sum rule splits the limit. Next, evaluate each simpler limit: 3 + 4 = 7.",
    },
    quick: {
      identify: {
        question: "Which rule says the limit of a sum is the sum of the limits?",
        choices: ["Sum", "Product", "Quotient", "Power"],
        answer: 0,
      },
      calculate: {
        question: "Evaluate",
        math: String.raw`\lim_{x\to 2}\bigl[(x+1)+x^{2}\bigr]`,
        answer: 7,
      },
      explain: {
        question: "In your own words, why can we split a sum inside a limit?",
        model:
          "If each piece approaches a height, the combined graph approaches the sum of those heights.",
      },
    },
  },
  {
    id: "difference",
    name: "Difference Rule",
    say: "The limit of a difference is the difference of the limits.",
    formula: String.raw`\begin{aligned}\lim_{x\to c}\bigl[f(x)-g(x)\bigr]&=\lim_{x\to c}f(x)-\lim_{x\to c}g(x)\\&=L-M\end{aligned}`,
    formulaText: "lim (f-g) = lim f - lim g = L - M",
    shared: {
      steps: [
        { math: String.raw`\lim_{x\to 2}\bigl[(x+1)-x^{2}\bigr]`, text: "lim as x→2 of [(x+1)-x²]" },
        { math: String.raw`=\lim_{x\to 2}(x+1)-\lim_{x\to 2}x^{2}`, text: "= lim(x+1) - lim x²" },
        { math: String.raw`=3-4`, text: "= 3 - 4" },
        { math: String.raw`=-1`, text: "= -1" },
      ],
      graph: windowFor((x) => x + 1 - x * x, 2, -1, {
        xMin: 0,
        xMax: 4,
        yMin: -12,
        yMax: 4,
        marks: [{ x: 2, y: -1, label: "(2, -1)" }],
      }),
    },
    second: {
      steps: [
        { math: String.raw`\lim_{x\to 3}\bigl[(x^{2}+1)-(4x-2)\bigr]`, text: "lim as x→3 of [(x²+1)-(4x-2)]" },
        { math: String.raw`=\lim_{x\to 3}(x^{2}+1)-\lim_{x\to 3}(4x-2)`, text: "= lim(x²+1) - lim(4x-2)" },
        { math: String.raw`=(3^{2}+1)-\bigl(4(3)-2\bigr)`, text: "= (9+1) - (12-2)" },
        { math: String.raw`=10-10`, text: "= 10 - 10" },
        { math: String.raw`=0`, text: "= 0" },
      ],
    },
    build: {
      slots: 7,
      solution: ["lim-diff", "eq1", "lim-f", "minus", "lim-g", "eq2", "LminusM"],
      bank: [
        { id: "lim-diff", math: String.raw`\lim(f-g)` },
        { id: "lim-f", math: String.raw`\lim f` },
        { id: "lim-g", math: String.raw`\lim g` },
        PLUS,
        MINUS,
        EQ1,
        EQ2,
        { id: "LminusM", math: "L-M" },
        { id: "LplusM", math: "L+M" },
        { id: "LM", math: "LM" },
      ],
    },
    next: {
      given: [
        { math: String.raw`\lim_{x\to 2}\bigl[(x+1)-x^{2}\bigr]`, text: "lim as x→2 of [(x+1)-x²]" },
        { math: String.raw`=\lim_{x\to 2}(x+1)-\lim_{x\to 2}x^{2}`, text: "= lim(x+1) - lim x²" },
      ],
      question: "What should we do next?",
      choices: [
        "Add 3 and 4",
        "Evaluate each simpler limit, then subtract",
        "Multiply the limits",
        "Cancel x²",
      ],
      answer: 1,
      why: "Each simpler limit is already known: 3 − 4 = −1.",
    },
    quick: {
      identify: {
        question: "The limit of a difference is the difference of the limits. Which rule is that?",
        choices: ["Sum", "Difference", "Quotient", "Root"],
        answer: 1,
      },
      calculate: {
        question: "Evaluate",
        math: String.raw`\lim_{x\to 2}\bigl[(x+1)-x^{2}\bigr]`,
        answer: -1,
      },
      explain: {
        question: "Why can the graph of f − g go below the axis even if f and g stay positive?",
        model: "We subtract the heights. If g’s height is larger, the difference is negative.",
      },
    },
  },
  {
    id: "constant",
    name: "Constant Multiple Rule",
    say: "The limit of a constant times a function is the constant times the limit of the function.",
    formula: String.raw`\lim_{x\to c}\bigl[k\,f(x)\bigr]=k\lim_{x\to c}f(x)=kL`,
    formulaText: "lim [k f(x)] = k lim f(x) = kL",
    shared: {
      steps: [
        { math: String.raw`\lim_{x\to 2}\bigl[2(x+1)\bigr]`, text: "lim as x→2 of [2(x+1)]" },
        { math: String.raw`=2\lim_{x\to 2}(x+1)`, text: "= 2 lim(x+1)" },
        { math: String.raw`=2(3)`, text: "= 2(3)" },
        { math: String.raw`=6`, text: "= 6" },
      ],
      graph: windowFor((x) => 2 * x + 2, 2, 6, {
        xMin: 0,
        xMax: 4,
        yMin: -1,
        yMax: 12,
        marks: [{ x: 2, y: 6, label: "(2, 6)" }],
      }),
    },
    second: {
      steps: [
        { math: String.raw`\lim_{x\to -1}\bigl[-3(x^{2}+2x)\bigr]`, text: "lim as x→-1 of [-3(x²+2x)]" },
        { math: String.raw`=-3\lim_{x\to -1}(x^{2}+2x)`, text: "= -3 lim(x²+2x)" },
        { math: String.raw`=-3\bigl[(-1)^{2}+2(-1)\bigr]`, text: "= -3[1 - 2]" },
        { math: String.raw`=-3(-1)`, text: "= -3(-1)" },
        { math: String.raw`=3`, text: "= 3" },
      ],
    },
    build: {
      slots: 6,
      solution: ["lim-kf", "eq1", "k", "lim-f", "eq2", "kL"],
      bank: [
        { id: "lim-kf", math: String.raw`\lim(kf)` },
        { id: "k", math: "k" },
        { id: "lim-f", math: String.raw`\lim f` },
        EQ1,
        EQ2,
        { id: "kL", math: "kL" },
        { id: "LplusM", math: "L+M" },
        TIMES,
      ],
    },
    next: {
      given: [
        { math: String.raw`\lim_{x\to 2}\bigl[2(x+1)\bigr]`, text: "lim as x→2 of [2(x+1)]" },
        { math: String.raw`=2\lim_{x\to 2}(x+1)`, text: "= 2 lim(x+1)" },
      ],
      question: "What should we do next?",
      choices: [
        "Add 2 and 3",
        "Multiply the constant by the simpler limit",
        "Divide by 2",
        "Square the limit",
      ],
      answer: 1,
      why: "The constant rides along: 2 × 3 = 6.",
    },
    quick: {
      identify: {
        question: "Which rule lets a constant factor out of a limit?",
        choices: ["Sum", "Constant multiple", "Product", "Power"],
        answer: 1,
      },
      calculate: {
        question: "Evaluate",
        math: String.raw`\lim_{x\to 2}\bigl[2(x+1)\bigr]`,
        answer: 6,
      },
      explain: {
        question: "Why does doubling f double the limit?",
        model: "Every y-value is scaled by k, so the height the graph approaches is also scaled by k.",
      },
    },
  },
  {
    id: "product",
    name: "Product Rule",
    say: "The limit of a product is the product of the limits.",
    formula: String.raw`\begin{aligned}\lim_{x\to c}\bigl[f(x)g(x)\bigr]&=\bigl(\lim_{x\to c}f(x)\bigr)\bigl(\lim_{x\to c}g(x)\bigr)\\&=LM\end{aligned}`,
    formulaText: "lim (f g) = (lim f)(lim g) = LM",
    shared: {
      steps: [
        { math: String.raw`\lim_{x\to 2}\bigl[(x+1)x^{2}\bigr]`, text: "lim as x→2 of [(x+1)x²]" },
        { math: String.raw`=\bigl(\lim_{x\to 2}(x+1)\bigr)\bigl(\lim_{x\to 2}x^{2}\bigr)`, text: "= (lim(x+1))(lim x²)" },
        { math: String.raw`=(3)(4)`, text: "= (3)(4)" },
        { math: String.raw`=12`, text: "= 12" },
      ],
      graph: windowFor((x) => (x + 1) * x * x, 2, 12, {
        xMin: 0,
        xMax: 3.2,
        yMin: -2,
        yMax: 22,
        marks: [{ x: 2, y: 12, label: "(2, 12)" }],
      }),
    },
    second: {
      steps: [
        { math: String.raw`\lim_{x\to 1}\bigl[(x^{2}+2)(3x-1)\bigr]`, text: "lim as x→1 of [(x²+2)(3x-1)]" },
        { math: String.raw`=\bigl[\lim_{x\to 1}(x^{2}+2)\bigr]\bigl[\lim_{x\to 1}(3x-1)\bigr]`, text: "= [lim(x²+2)][lim(3x-1)]" },
        { math: String.raw`=(3)(2)`, text: "= (3)(2)" },
        { math: String.raw`=6`, text: "= 6" },
      ],
    },
    build: {
      slots: 7,
      solution: ["lim-fg", "eq1", "lim-f", "times", "lim-g", "eq2", "LM"],
      bank: [
        { id: "lim-fg", math: String.raw`\lim(fg)` },
        { id: "lim-f", math: String.raw`\lim f` },
        { id: "lim-g", math: String.raw`\lim g` },
        TIMES,
        PLUS,
        EQ1,
        EQ2,
        { id: "LM", math: "LM" },
        { id: "LplusM", math: "L+M" },
      ],
    },
    next: {
      given: [
        { math: String.raw`\lim_{x\to 2}\bigl[(x+1)x^{2}\bigr]`, text: "lim as x→2 of [(x+1)x²]" },
        { math: String.raw`=\bigl(\lim_{x\to 2}(x+1)\bigr)\bigl(\lim_{x\to 2}x^{2}\bigr)`, text: "= (lim f)(lim g)" },
      ],
      question: "What should we do next?",
      choices: [
        "Add 3 and 4",
        "Multiply the two simpler limits",
        "Divide 3 by 4",
        "Take a square root",
      ],
      answer: 1,
      why: "Product of heights: 3 × 4 = 12.",
    },
    quick: {
      identify: {
        question: "Which rule turns a product inside a limit into a product of limits?",
        choices: ["Sum", "Difference", "Product", "Quotient"],
        answer: 2,
      },
      calculate: {
        question: "Evaluate",
        math: String.raw`\lim_{x\to 2}\bigl[(x+1)x^{2}\bigr]`,
        answer: 12,
      },
      explain: {
        question: "How is the product rule different from the sum rule?",
        model: "Sum adds the two approaching heights. Product multiplies them.",
      },
    },
  },
  {
    id: "quotient",
    name: "Quotient Rule",
    say: "The limit of a quotient is the quotient of the limits, as long as the denominator limit is not zero.",
    formula: String.raw`\begin{aligned}\lim_{x\to c}\dfrac{f(x)}{g(x)}&=\dfrac{\displaystyle\lim_{x\to c}f(x)}{\displaystyle\lim_{x\to c}g(x)}=\dfrac{L}{M}\\ &\text{if }M\neq 0\end{aligned}`,
    formulaText: "lim f/g = (lim f)/(lim g) = L/M, M ≠ 0",
    note: "Always check the denominator limit first. If it is 0, this rule does not apply.",
    shared: {
      steps: [
        { math: String.raw`\lim_{x\to 2}\dfrac{x+1}{x^{2}}`, text: "lim as x→2 of (x+1)/x²" },
        { math: String.raw`=\dfrac{\lim_{x\to 2}(x+1)}{\lim_{x\to 2}x^{2}}`, text: "= [lim(x+1)] / [lim x²]" },
        { math: String.raw`=\dfrac{3}{4}`, text: "= 3/4" },
        { math: String.raw`\text{denominator limit }=4\neq 0`, text: "denominator limit = 4 ≠ 0" },
      ],
      graph: windowFor((x) => (x === 0 ? null : (x + 1) / (x * x)), 2, 0.75, {
        xMin: 0.6,
        xMax: 4,
        yMin: -0.5,
        yMax: 4,
        skip: (x) => Math.abs(x) < 0.12,
        marks: [{ x: 2, y: 0.75, label: "(2, 3/4)" }],
      }),
    },
    second: {
      steps: [
        { math: String.raw`\lim_{x\to 3}\dfrac{x^{2}+1}{2x-1}`, text: "lim as x→3 of (x²+1)/(2x-1)" },
        { math: String.raw`=\dfrac{3^{2}+1}{2(3)-1}`, text: "= (9+1)/(6-1)" },
        { math: String.raw`=\dfrac{10}{5}`, text: "= 10/5" },
        { math: String.raw`=2`, text: "= 2" },
        { math: String.raw`\text{denominator limit }=5\neq 0`, text: "denominator limit = 5 ≠ 0" },
      ],
    },
    build: {
      slots: 6,
      solution: ["lim-quot", "eq1", "frac", "eq2", "LoverM", "Mne0"],
      bank: [
        { id: "lim-quot", math: String.raw`\lim\dfrac{f}{g}` },
        { id: "frac", math: String.raw`\dfrac{\lim f}{\lim g}` },
        EQ1,
        EQ2,
        { id: "LoverM", math: String.raw`\dfrac{L}{M}` },
        { id: "LM", math: "LM" },
        { id: "LplusM", math: "L+M" },
        { id: "Mne0", math: String.raw`(M\neq 0)` },
      ],
    },
    next: {
      given: [
        { math: String.raw`\lim_{x\to 2}\dfrac{x+1}{x^{2}}`, text: "lim as x→2 of (x+1)/x²" },
      ],
      question: "What should we do next?",
      choices: [
        "Cancel x from top and bottom",
        "Check the denominator limit, then divide the two limits",
        "Multiply 3 and 4",
        "Take a derivative",
      ],
      answer: 1,
      why: "Denominator limit is 4, which is not 0, so the rule applies: 3/4.",
    },
    quick: {
      identify: {
        question: "Before using the quotient rule, what must be true?",
        choices: [
          "The numerator limit is 0",
          "The denominator limit is not 0",
          "The functions are linear",
          "x is positive",
        ],
        answer: 1,
      },
      calculate: {
        question: "Evaluate",
        math: String.raw`\lim_{x\to 2}\dfrac{x+1}{x^{2}}`,
        answer: 0.75,
        accept: ["3/4", "0.75"],
      },
      explain: {
        question: "Why does the quotient rule need M ≠ 0?",
        model: "Division by zero is undefined. If the denominator height is 0, this law does not apply.",
      },
    },
  },
  {
    id: "power",
    name: "Power Rule",
    say: "The limit of a power is the power of the limit.",
    formula: String.raw`\begin{aligned}\lim_{x\to c}\bigl[f(x)\bigr]^{n}&=\bigl[\lim_{x\to c}f(x)\bigr]^{n}\\&=L^{n}\end{aligned}`,
    formulaText: "lim [f(x)]^n = [lim f(x)]^n = L^n",
    shared: {
      steps: [
        { math: String.raw`\lim_{x\to 2}(x+1)^{2}`, text: "lim as x→2 of (x+1)²" },
        { math: String.raw`=\bigl[\lim_{x\to 2}(x+1)\bigr]^{2}`, text: "= [lim(x+1)]²" },
        { math: String.raw`=3^{2}`, text: "= 3²" },
        { math: String.raw`=9`, text: "= 9" },
      ],
      graph: windowFor((x) => (x + 1) * (x + 1), 2, 9, {
        xMin: -1,
        xMax: 4,
        yMin: -1,
        yMax: 18,
        marks: [{ x: 2, y: 9, label: "(2, 9)" }],
      }),
    },
    second: {
      steps: [
        { math: String.raw`\lim_{x\to -1}(2x+3)^{3}`, text: "lim as x→-1 of (2x+3)³" },
        { math: String.raw`=\bigl[\lim_{x\to -1}(2x+3)\bigr]^{3}`, text: "= [lim(2x+3)]³" },
        { math: String.raw`=\bigl[2(-1)+3\bigr]^{3}`, text: "= [−2+3]³" },
        { math: String.raw`=1^{3}`, text: "= 1³" },
        { math: String.raw`=1`, text: "= 1" },
      ],
    },
    build: {
      slots: 5,
      solution: ["lim-pow", "eq1", "lim-f-n", "eq2", "Ln"],
      bank: [
        { id: "lim-pow", math: String.raw`\lim[f]^{n}` },
        { id: "lim-f-n", math: String.raw`[\lim f]^{n}` },
        EQ1,
        EQ2,
        { id: "Ln", math: String.raw`L^{n}` },
        { id: "nL", math: "nL" },
        { id: "LM", math: "LM" },
      ],
    },
    next: {
      given: [
        { math: String.raw`\lim_{x\to 2}(x+1)^{2}`, text: "lim as x→2 of (x+1)²" },
        { math: String.raw`=\bigl[\lim_{x\to 2}(x+1)\bigr]^{2}`, text: "= [lim(x+1)]²" },
      ],
      question: "What should we do next?",
      choices: [
        "Square the inside limit",
        "Multiply by 2",
        "Add 2",
        "Take a square root",
      ],
      answer: 0,
      why: "The inside limit is 3, and 3² = 9.",
    },
    quick: {
      identify: {
        question: "Which rule says the limit of a power is the power of the limit?",
        choices: ["Product", "Power", "Root", "Constant multiple"],
        answer: 1,
      },
      calculate: {
        question: "Evaluate",
        math: String.raw`\lim_{x\to 2}(x+1)^{2}`,
        answer: 9,
      },
      explain: {
        question: "Why does squaring f square the limit?",
        model: "If y-values approach L, the squared y-values approach L².",
      },
    },
  },
  {
    id: "root",
    name: "Root Rule",
    say: "The limit of a root is the root of the limit, when the root is defined.",
    formula: String.raw`\lim_{x\to c}\sqrt{f(x)}=\sqrt{\lim_{x\to c}f(x)}=\sqrt{L}`,
    formulaText: "lim n√f(x) = n√(lim f(x)) = n√L",
    note: "For an even root, the limiting value must be in the real-number domain (L ≥ 0).",
    shared: {
      steps: [
        { math: String.raw`\lim_{x\to 2}\sqrt{x+1}`, text: "lim as x→2 of √(x+1)" },
        { math: String.raw`=\sqrt{\lim_{x\to 2}(x+1)}`, text: "= √[lim(x+1)]" },
        { math: String.raw`=\sqrt{3}`, text: "= √3" },
      ],
      graph: windowFor((x) => (x + 1 < 0 ? null : Math.sqrt(x + 1)), 2, Math.sqrt(3), {
        xMin: -1,
        xMax: 5,
        yMin: -0.5,
        yMax: 3.2,
        skip: (x) => x + 1 < 0,
        marks: [{ x: 2, y: Math.sqrt(3), label: "(2, √3)" }],
      }),
    },
    second: {
      steps: [
        { math: String.raw`\lim_{x\to 8}\sqrt[3]{x+19}`, text: "lim as x→8 of cube root of (x+19)" },
        { math: String.raw`=\sqrt[3]{\lim_{x\to 8}(x+19)}`, text: "= cube root of the inside limit" },
        { math: String.raw`=\sqrt[3]{27}`, text: "= cube root of 27" },
        { math: String.raw`=3`, text: "= 3" },
      ],
    },
    build: {
      slots: 5,
      solution: ["lim-root", "eq1", "root-lim", "eq2", "rootL"],
      bank: [
        { id: "lim-root", math: String.raw`\lim\sqrt[n]{f}` },
        { id: "root-lim", math: String.raw`\sqrt[n]{\lim f}` },
        EQ1,
        EQ2,
        { id: "rootL", math: String.raw`\sqrt[n]{L}` },
        { id: "Ln", math: String.raw`L^{n}` },
        { id: "nL", math: "nL" },
      ],
    },
    next: {
      given: [
        { math: String.raw`\lim_{x\to 2}\sqrt{x+1}`, text: "lim as x→2 of √(x+1)" },
        { math: String.raw`=\sqrt{\lim_{x\to 2}(x+1)}`, text: "= √[lim(x+1)]" },
      ],
      question: "What should we do next?",
      choices: [
        "Square 3",
        "Take the square root of the inside limit",
        "Add 1 to the limit",
        "Multiply by 1/2",
      ],
      answer: 1,
      why: "The inside limit is 3, and √3 is defined because 3 > 0.",
    },
    quick: {
      identify: {
        question: "For an even root, the inside limit must be",
        choices: ["Negative", "Zero only", "Nonnegative", "An integer"],
        answer: 2,
      },
      calculate: {
        question: "Evaluate",
        math: String.raw`\lim_{x\to 8}\sqrt[3]{x+19}`,
        answer: 3,
      },
      explain: {
        question: "Why does the even-root rule need L ≥ 0?",
        model: "Even roots of negative numbers are not real. The graph would not exist there.",
      },
    },
  },
  {
    id: "composite",
    name: "Composite Function Rule",
    say: "If the outside function is continuous at the inside limit, plug the inside limit into the outside function.",
    formula: String.raw`\begin{aligned}&\lim_{x\to c}f(x)=L\text{ and }g\text{ continuous at }L\\ &\Rightarrow\lim_{x\to c}g\bigl(f(x)\bigr)=g(L)\end{aligned}`,
    formulaText: "If lim f = L and g is continuous at L, then lim g(f(x)) = g(L)",
    shared: {
      steps: [
        { math: String.raw`f(x)=x+1,\quad g(u)=u^{2}`, text: "f(x)=x+1, g(u)=u²" },
        { math: String.raw`\lim_{x\to 2}g\bigl(f(x)\bigr)=g\bigl(\lim_{x\to 2}f(x)\bigr)`, text: "lim g(f(x)) = g(lim f)" },
        { math: String.raw`=g(3)`, text: "= g(3)" },
        { math: String.raw`=3^{2}`, text: "= 3²" },
        { math: String.raw`=9`, text: "= 9" },
      ],
      graph: windowFor((x) => (x + 1) * (x + 1), 2, 9, {
        xMin: -1,
        xMax: 4,
        yMin: -1,
        yMax: 18,
        marks: [{ x: 2, y: 9, label: "(2, 9)" }],
      }),
    },
    second: {
      steps: [
        { math: String.raw`f(x)=x^{2}+1,\quad h(u)=2u-5`, text: "f(x)=x²+1, h(u)=2u-5" },
        { math: String.raw`\lim_{x\to 3}h\bigl(f(x)\bigr)=h\bigl(\lim_{x\to 3}(x^{2}+1)\bigr)`, text: "lim h(f) = h(lim(x²+1))" },
        { math: String.raw`=h(10)`, text: "= h(10)" },
        { math: String.raw`=2(10)-5`, text: "= 2(10)-5" },
        { math: String.raw`=15`, text: "= 15" },
      ],
    },
    build: {
      slots: 5,
      solution: ["lim-gf", "eq1", "g-lim", "eq2", "gL"],
      bank: [
        { id: "lim-gf", math: String.raw`\lim g(f)` },
        { id: "g-lim", math: String.raw`g(\lim f)` },
        EQ1,
        EQ2,
        { id: "gL", math: "g(L)" },
        { id: "Lg", math: "Lg" },
        { id: "LM", math: "LM" },
      ],
    },
    next: {
      given: [
        { math: String.raw`\lim_{x\to 2}g\bigl(f(x)\bigr)`, text: "lim g(f(x)) as x→2" },
        { math: String.raw`=g\bigl(\lim_{x\to 2}f(x)\bigr)`, text: "= g(lim f)" },
      ],
      question: "What should we do next?",
      choices: [
        "Multiply f and g",
        "Plug the inside limit into the outside function",
        "Take a derivative",
        "Add 2 and 3",
      ],
      answer: 1,
      why: "You found the inside limit, 3. Now g(3) = 3² = 9.",
    },
    quick: {
      identify: {
        question: "The composite rule requires that the outside function is",
        choices: ["Odd", "A polynomial only", "Continuous at the inside limit", "Always 0"],
        answer: 2,
      },
      calculate: {
        question: "Evaluate",
        math: String.raw`\lim_{x\to 2}(x+1)^{2}`,
        answer: 9,
      },
      explain: {
        question: "Describe the chain x → 2 → f(x) → g(f(x)).",
        model: "x approaches 2, f(x) approaches 3, then g sends 3 to 9.",
      },
    },
  },
];

export function ruleById(id: RuleId) {
  return RULES.find((rule) => rule.id === id)!;
}

export type MixedItem = {
  math: string;
  text: string;
  laws: RuleId[];
  answer: number;
  accept?: string[];
};

export const MIXED: MixedItem[] = [
  {
    math: String.raw`\lim_{x\to 2}3(x^{2}+x)`,
    text: "lim as x→2 of 3(x²+x)",
    laws: ["constant", "sum"],
    answer: 18,
  },
  {
    math: String.raw`\lim_{x\to 1}(x^{2}+2)(x+4)`,
    text: "lim as x→1 of (x²+2)(x+4)",
    laws: ["product"],
    answer: 15,
  },
  {
    math: String.raw`\lim_{x\to 3}\left(\dfrac{x^{2}+1}{2x-1}\right)^{2}`,
    text: "lim as x→3 of [(x²+1)/(2x-1)]²",
    laws: ["power", "quotient"],
    answer: 4,
  },
  {
    math: String.raw`\lim_{x\to 8}\sqrt{x+1}`,
    text: "lim as x→8 of √(x+1)",
    laws: ["root"],
    answer: 3,
    accept: ["3", "√9"],
  },
  {
    math: String.raw`\lim_{x\to 2}\bigl[(x^{2}+x+1)-\sqrt{x+2}\bigr]`,
    text: "lim as x→2 of [(x²+x+1)-√(x+2)]",
    laws: ["difference", "root"],
    answer: 5,
  },
];

export type PracticeItem = {
  level: 1 | 2 | 3 | 4 | 5;
  rule?: RuleId;
  prompt: string;
  math?: string;
  choices?: string[];
  answerIndex?: number;
  answer?: number;
  accept?: string[];
  model?: string;
  hint: string;
};

export const PRACTICE: PracticeItem[] = [
  {
    level: 1,
    rule: "sum",
    prompt: "Which limit law applies first?",
    math: String.raw`\lim_{x\to 2}\bigl[(x+1)+x^{2}\bigr]`,
    choices: ["Sum", "Product", "Quotient", "Power"],
    answerIndex: 0,
    hint: "Good start. Which operation connects the two functions?",
  },
  {
    level: 1,
    rule: "quotient",
    prompt: "Which limit law applies first?",
    math: String.raw`\lim_{x\to 2}\dfrac{x+1}{x^{2}}`,
    choices: ["Product", "Quotient", "Root", "Difference"],
    answerIndex: 1,
    hint: "Check the denominator limit before applying the quotient rule.",
  },
  {
    level: 1,
    rule: "composite",
    prompt: "Which limit law applies first?",
    math: String.raw`\lim_{x\to 2}g\bigl(f(x)\bigr)`,
    choices: ["Sum", "Product", "Composite", "Quotient"],
    answerIndex: 2,
    hint: "You found the inside limit. Now what does the outside function do to that value?",
  },
  {
    level: 1,
    rule: "power",
    prompt: "Which limit law applies first?",
    math: String.raw`\lim_{x\to 2}(x+1)^{2}`,
    choices: ["Root", "Power", "Constant multiple", "Difference"],
    answerIndex: 1,
    hint: "The exponent is outside the function.",
  },
  {
    level: 2,
    rule: "sum",
    prompt: "Evaluate.",
    math: String.raw`\lim_{x\to 2}\bigl[(x+1)+x^{2}\bigr]`,
    answer: 7,
    hint: "Try separating this expression into simpler limits first.",
  },
  {
    level: 2,
    rule: "difference",
    prompt: "Evaluate.",
    math: String.raw`\lim_{x\to 2}\bigl[(x+1)-x^{2}\bigr]`,
    answer: -1,
    hint: "Subtract the two simpler limits.",
  },
  {
    level: 2,
    rule: "constant",
    prompt: "Evaluate.",
    math: String.raw`\lim_{x\to 2}2(x+1)`,
    answer: 6,
    hint: "The constant 2 multiplies the limit of x+1.",
  },
  {
    level: 2,
    rule: "product",
    prompt: "Evaluate.",
    math: String.raw`\lim_{x\to 1}(x^{2}+2)(3x-1)`,
    answer: 6,
    hint: "Evaluate each factor’s limit, then multiply.",
  },
  {
    level: 2,
    rule: "quotient",
    prompt: "Evaluate.",
    math: String.raw`\lim_{x\to 3}\dfrac{x^{2}+1}{2x-1}`,
    answer: 2,
    hint: "Check the denominator limit before applying the quotient rule.",
  },
  {
    level: 2,
    rule: "power",
    prompt: "Evaluate.",
    math: String.raw`\lim_{x\to -1}(2x+3)^{3}`,
    answer: 1,
    hint: "Find the inside limit, then raise it to the power.",
  },
  {
    level: 2,
    rule: "root",
    prompt: "Evaluate.",
    math: String.raw`\lim_{x\to 8}\sqrt[3]{x+19}`,
    answer: 3,
    hint: "The cube root of the inside limit is defined.",
  },
  {
    level: 3,
    rule: "constant",
    prompt: "Evaluate. Two rules.",
    math: String.raw`\lim_{x\to 2}3(x^{2}+x)`,
    answer: 18,
    hint: "Factor out 3, then use the sum rule inside.",
  },
  {
    level: 3,
    rule: "product",
    prompt: "Evaluate. Two rules.",
    math: String.raw`\lim_{x\to 1}(x^{2}+2)(x+4)`,
    answer: 15,
    hint: "Product of two simpler limits.",
  },
  {
    level: 4,
    rule: "power",
    prompt: "Evaluate this multi-step limit.",
    math: String.raw`\lim_{x\to 3}\left(\dfrac{x^{2}+1}{2x-1}\right)^{2}`,
    answer: 4,
    hint: "Quotient first (denominator 5 ≠ 0), then square.",
  },
  {
    level: 4,
    rule: "difference",
    prompt: "Evaluate this multi-step limit.",
    math: String.raw`\lim_{x\to 2}\bigl[(x^{2}+x+1)-\sqrt{x+2}\bigr]`,
    answer: 5,
    hint: "Difference of a polynomial limit and a root limit.",
  },
  {
    level: 5,
    rule: "quotient",
    prompt: "Explain in words why we must check the denominator before dividing limits.",
    model:
      "If the denominator limit is 0, dividing is undefined, so the quotient rule does not apply.",
    hint: "Check the denominator limit before applying the quotient rule.",
  },
  {
    level: 5,
    rule: "composite",
    prompt: "Explain the chain: x approaches 2, then f, then g.",
    model: "x → 2, f(x) → 3, g(3) = 9. The outside function must be continuous at 3.",
    hint: "You found the inside limit. Now what does the outside function do to that value?",
  },
];

export const APPROACH_XS = [1.9, 1.99, 1.999, 2.001, 2.01, 2.1];

export function approachRows(c: number, fn: (x: number) => number | null, xs?: number[]) {
  const list =
    xs ??
    (Math.abs(c - 2) < 1e-9
      ? APPROACH_XS
      : [c - 0.1, c - 0.01, c - 0.001, c + 0.001, c + 0.01, c + 0.1]);
  return list.map((x) => ({ x, y: fn(x) }));
}

export function fmtNum(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return "—";
  const r = Math.round(n * 10000) / 10000;
  return String(r);
}

export function gradeNumber(raw: string, expected: number, extra: string[] = []) {
  const t = raw.trim().replace(/−/g, "-").replace(/\s/g, "");
  if (!t) return false;
  if (extra.some((s) => s.replace(/\s/g, "") === t)) return true;
  if (t.includes("/")) {
    const [a, b] = t.split("/").map(Number);
    if (!b || !Number.isFinite(a) || !Number.isFinite(b)) return false;
    return Math.abs(a / b - expected) < 1e-3;
  }
  if (t.startsWith("sqrt(") && t.endsWith(")")) {
    const inner = Number(t.slice(5, -1));
    if (Number.isFinite(inner)) return Math.abs(Math.sqrt(inner) - expected) < 1e-3;
  }
  const n = Number(t);
  return Number.isFinite(n) && Math.abs(n - expected) < 1e-3;
}
