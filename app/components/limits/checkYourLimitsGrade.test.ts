import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ALGEBRA,
  SIDES,
  gradeExists,
  gradeFactors,
  gradeNumber,
  gradeSimplified,
  parseTwoLinearFactors,
} from "./checkYourLimitsGrade.ts";

describe("QOD follow-up algebra facts", () => {
  it("accepts reversed factors and spacing for problem 1", () => {
    assert.equal(gradeFactors("(x - 3)(x + 3)", ALGEBRA[1].offsets), "correct");
    assert.equal(gradeFactors("(x+3)(x-3)", ALGEBRA[1].offsets), "correct");
    assert.equal(gradeFactors("(x - 3)*(x + 3)", ALGEBRA[1].offsets), "correct");
    assert.equal(gradeFactors("(x-3)(x-3)", ALGEBRA[1].offsets), "incorrect");
    assert.equal(gradeFactors("difference of squares", ALGEBRA[1].offsets), "choose");
    assert.equal(gradeSimplified("x + 3", "x+3"), "correct");
    assert.equal(gradeSimplified("3+x", "x+3"), "correct");
    assert.equal(gradeSimplified("x + 4", "x+3"), "incorrect");
    assert.equal(gradeNumber("6", ALGEBRA[1].limit), true);
    assert.equal(ALGEBRA[1].limit, 6);
  });

  it("accepts reversed factors for problem 2 and the hole value -1", () => {
    assert.equal(gradeFactors("(x - 2)(x - 3)", ALGEBRA[2].offsets), "correct");
    assert.equal(gradeFactors("(x-3)(x-2)", ALGEBRA[2].offsets), "correct");
    assert.equal(gradeSimplified("x - 3", "x-3"), "correct");
    assert.equal(gradeSimplified("-3 + x", "x-3"), "correct");
    assert.equal(gradeNumber("-1", ALGEBRA[2].limit), true);
    assert.deepEqual(parseTwoLinearFactors("(x-2)(x-3)"), [-2, -3]);
  });
});

describe("QOD follow-up one-sided facts", () => {
  it("matches problem 3 jump values", () => {
    assert.equal(SIDES[3].left, 2);
    assert.equal(SIDES[3].right, -1);
    assert.equal(SIDES[3].exists, false);
    assert.equal(gradeExists("no", false), true);
    assert.equal(gradeExists("yes", false), false);
  });

  it("matches problem 4 removable-point values", () => {
    assert.equal(SIDES[4].left, 3);
    assert.equal(SIDES[4].right, 3);
    assert.equal(SIDES[4].exists, true);
    assert.equal(SIDES[4].value, 3);
    assert.equal(gradeNumber("3", 3), true);
  });

  it("matches problem 5 corner values", () => {
    assert.equal(SIDES[5].left, 1);
    assert.equal(SIDES[5].right, 1);
    assert.equal(SIDES[5].exists, true);
    assert.equal(SIDES[5].value, 1);
  });
});
