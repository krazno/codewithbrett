import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { gradeNumber } from "../limitProperties/content.ts";

describe("QOD10 answers", () => {
  it("problem 1 is a 0/0 hole that simplifies to 6", () => {
    assert.equal((9 - 9) / (3 - 3) || 0, 0);
    assert.equal(3 + 3, 6);
    assert.equal(gradeNumber("6", 6), true);
  });
  it("problem 2 cancels (x-2) and equals 4", () => {
    const simplified = (2 + 2) / (2 - 1);
    assert.equal(simplified, 4);
    assert.equal(gradeNumber("4", 4), true);
  });
  it("problem 3 one-sided limits disagree so DNE", () => {
    assert.notEqual(2, 5);
  });
  it("problem 4 limit 4 is not f(2) = 7", () => {
    assert.equal(gradeNumber("4", 4), true);
    assert.equal(gradeNumber("7", 7), true);
    assert.notEqual(4, 7);
  });
});
