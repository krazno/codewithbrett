import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FUNCTIONS,
  DEFAULT_RESTRICTED,
  domainInterval,
  explainExcludedInput,
  formatInterval,
  formatPair,
  fullRange,
  isInputAllowed,
  rangeInterval,
  restrictedRangeEvenMinAtZero,
  restrictedRangeLinear,
} from "./math.ts";

describe("function evaluation", () => {
  it("evaluates the three class functions", () => {
    assert.equal(FUNCTIONS.f.evaluate(3), 5);
    assert.equal(FUNCTIONS.g.evaluate(4), 15);
    assert.equal(FUNCTIONS.g.evaluate(-1), 0);
    assert.equal(FUNCTIONS.g.evaluate(0), -1);
    assert.equal(FUNCTIONS.g.evaluate(1), 0);
    assert.equal(FUNCTIONS.h.evaluate(-4), 2);
    assert.equal(FUNCTIONS.h.evaluate(0), -2);
  });

  it("does not skip substitution steps", () => {
    assert.deepEqual(FUNCTIONS.g.substitutionLines(4), [
      "g(4) = 4² − 1",
      "g(4) = 16 − 1",
      "g(4) = 15",
    ]);
    assert.equal(formatPair(4, 15), "(4, 15)");
  });
});

describe("full domains and ranges", () => {
  it("uses the real line as domain for all three functions", () => {
    assert.equal(formatInterval(domainInterval("full", "f", DEFAULT_RESTRICTED)), "(-∞, ∞)");
    assert.equal(formatInterval(domainInterval("full", "g", DEFAULT_RESTRICTED)), "(-∞, ∞)");
    assert.equal(formatInterval(domainInterval("full", "h", DEFAULT_RESTRICTED)), "(-∞, ∞)");
  });

  it("uses exact full ranges, not the viewing window", () => {
    assert.equal(formatInterval(fullRange("f")), "(-∞, ∞)");
    assert.equal(formatInterval(fullRange("g")), "[-1, ∞)");
    assert.equal(formatInterval(fullRange("h")), "[-2, ∞)");
  });
});

describe("restricted linear ranges", () => {
  it("maps a closed interval through f(x)=x+2", () => {
    assert.equal(
      formatInterval(restrictedRangeLinear({ left: -3, right: 3, leftClosed: true, rightClosed: true })),
      "[-1, 5]",
    );
  });

  it("keeps open endpoints open after a linear map", () => {
    assert.equal(
      formatInterval(restrictedRangeLinear({ left: -3, right: 3, leftClosed: true, rightClosed: false })),
      "[-1, 5)",
    );
  });
});

describe("quadratic intervals crossing x = 0", () => {
  it("includes the vertex on [-3, 3]", () => {
    const r = rangeInterval("restricted", "g", {
      left: -3,
      right: 3,
      leftClosed: true,
      rightClosed: true,
    });
    assert.equal(formatInterval(r), "[-1, 8]");
  });

  it("still includes the max when only one endpoint of equal |x| is closed", () => {
    const r = rangeInterval("restricted", "g", {
      left: -3,
      right: 3,
      leftClosed: true,
      rightClosed: false,
    });
    assert.equal(formatInterval(r), "[-1, 8]");
  });

  it("opens the max when both equal-|x| endpoints are excluded", () => {
    const r = rangeInterval("restricted", "g", {
      left: -3,
      right: 3,
      leftClosed: false,
      rightClosed: false,
    });
    assert.equal(formatInterval(r), "[-1, 8)");
  });
});

describe("quadratic intervals entirely left or right of x = 0", () => {
  it("uses the right endpoint as the min on the left of 0", () => {
    const r = rangeInterval("restricted", "g", {
      left: -4,
      right: -1,
      leftClosed: true,
      rightClosed: true,
    });
    assert.equal(formatInterval(r), "[0, 15]");
  });

  it("uses the left endpoint as the min on the right of 0", () => {
    const r = rangeInterval("restricted", "g", {
      left: 1,
      right: 4,
      leftClosed: true,
      rightClosed: true,
    });
    assert.equal(formatInterval(r), "[0, 15]");
  });

  it("treats an open vertex endpoint as an unattained infimum", () => {
    const right = rangeInterval("restricted", "g", {
      left: 0,
      right: 4,
      leftClosed: false,
      rightClosed: true,
    });
    assert.equal(formatInterval(right), "(-1, 15]");

    const left = rangeInterval("restricted", "g", {
      left: -4,
      right: 0,
      leftClosed: true,
      rightClosed: false,
    });
    assert.equal(formatInterval(left), "(-1, 15]");
  });
});

describe("absolute-value intervals crossing x = 0", () => {
  it("includes h(0)=-2 when 0 is inside the domain", () => {
    const r = rangeInterval("restricted", "h", {
      left: -3,
      right: 3,
      leftClosed: true,
      rightClosed: true,
    });
    assert.equal(formatInterval(r), "[-2, 1]");
  });
});

describe("open and closed endpoints", () => {
  it("formats mixed brackets", () => {
    assert.equal(
      formatInterval(
        restrictedRangeEvenMinAtZero(
          { left: -2, right: 5, leftClosed: false, rightClosed: true },
          FUNCTIONS.g.evaluate,
        ),
      ),
      "[-1, 24]",
    );
  });
});

describe("equal output values from two endpoints", () => {
  it("includes the shared max when either endpoint is closed", () => {
    assert.equal(
      formatInterval(
        rangeInterval("restricted", "g", {
          left: -2,
          right: 2,
          leftClosed: false,
          rightClosed: true,
        }),
      ),
      "[-1, 3]",
    );
  });

  it("excludes the shared max when both endpoints are open", () => {
    assert.equal(
      formatInterval(
        rangeInterval("restricted", "g", {
          left: -2,
          right: 2,
          leftClosed: false,
          rightClosed: false,
        }),
      ),
      "[-1, 3)",
    );
  });
});

describe("attempts to select excluded inputs", () => {
  const openRight = {
    left: -3,
    right: 3,
    leftClosed: true,
    rightClosed: false,
  };

  it("rejects an open endpoint and explains why", () => {
    assert.equal(isInputAllowed(3, "restricted", openRight), false);
    assert.match(explainExcludedInput(3, openRight), /open/i);
    assert.equal(isInputAllowed(-3, "restricted", openRight), true);
  });

  it("rejects values outside the restricted interval", () => {
    assert.equal(isInputAllowed(4, "restricted", openRight), false);
    assert.match(explainExcludedInput(4, openRight), /outside/i);
  });
});

describe("interval-notation formatting", () => {
  it("uses infinity and empty-set symbols", () => {
    assert.equal(formatInterval(fullRange("f")), "(-∞, ∞)");
    assert.equal(
      formatInterval(
        rangeInterval("restricted", "f", {
          left: 2,
          right: 2,
          leftClosed: false,
          rightClosed: false,
        }),
      ),
      "∅",
    );
  });
});
