import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MIXED,
  RULES,
  SHARED,
  gradeNumber,
} from "./content.ts";

describe("shared limits", () => {
  it("has lim f = 3 and lim g = 4 as x → 2", () => {
    assert.equal(SHARED.f(2), 3);
    assert.equal(SHARED.g(2), 4);
  });
});

describe("shared worked examples", () => {
  it("sum is 7", () => {
    assert.equal(2 * 2 + 2 + 1, 7);
  });
  it("difference is -1", () => {
    assert.equal(2 + 1 - 2 * 2, -1);
  });
  it("constant multiple is 6", () => {
    assert.equal(2 * (2 + 1), 6);
  });
  it("product is 12", () => {
    assert.equal((2 + 1) * 2 * 2, 12);
  });
  it("quotient is 3/4", () => {
    assert.equal((2 + 1) / (2 * 2), 0.75);
  });
  it("power is 9", () => {
    assert.equal((2 + 1) ** 2, 9);
  });
  it("root is √3", () => {
    assert.ok(Math.abs(Math.sqrt(2 + 1) - Math.sqrt(3)) < 1e-12);
  });
});

describe("second examples", () => {
  it("sum at -1 is 6", () => {
    assert.equal(2 * 1 + 3 + (-1 - 2 * -1), 6);
  });
  it("difference at 3 is 0", () => {
    assert.equal(3 ** 2 + 1 - (4 * 3 - 2), 0);
  });
  it("constant at -1 is 3", () => {
    assert.equal(-3 * (1 + 2 * -1), 3);
  });
  it("product at 1 is 6", () => {
    assert.equal((1 + 2) * (3 - 1), 6);
  });
  it("quotient at 3 is 2", () => {
    assert.equal((9 + 1) / (6 - 1), 2);
  });
  it("power at -1 is 1", () => {
    assert.equal((-2 + 3) ** 3, 1);
  });
  it("cube root at 8 is 3", () => {
    assert.equal(Math.cbrt(8 + 19), 3);
  });
  it("composite h(f(3)) is 15", () => {
    assert.equal(2 * (9 + 1) - 5, 15);
  });
});

describe("mixed challenge values", () => {
  it("matches each listed answer", () => {
    assert.equal(MIXED[0].answer, 18);
    assert.equal(MIXED[1].answer, 15);
    assert.equal(MIXED[2].answer, 4);
    assert.equal(MIXED[3].answer, 3);
    assert.equal(MIXED[4].answer, 5);
  });
});

describe("gradeNumber", () => {
  it("accepts 3/4 and 0.75", () => {
    assert.equal(gradeNumber("3/4", 0.75), true);
    assert.equal(gradeNumber("0.75", 0.75), true);
  });
  it("accepts sqrt(3)", () => {
    assert.equal(gradeNumber("sqrt(3)", Math.sqrt(3)), true);
  });
});

describe("eight laws are present", () => {
  it("loads all eight rules", () => {
    assert.equal(RULES.length, 8);
  });
});
