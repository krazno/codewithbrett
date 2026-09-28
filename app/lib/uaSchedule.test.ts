import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAdvisoryDay } from "./uaSchedule.ts";

describe("advisory cycle schedule", () => {
  it("shows Day 4 bells on Monday 2026-09-28", () => {
    const day = getAdvisoryDay(new Date("2026-09-28T12:00:00-04:00"));
    assert.equal(day.dateKey, "2026-09-28");
    assert.equal(day.cycleLabel, "Day 4");
    assert.equal(day.dropped, "E");
    assert.deepEqual(
      day.rows?.map((row) => `${row.time} ${row.title}`),
      [
        "8:00–8:07 Advisory — Prayer and Pledge",
        "8:10–8:55 F Block",
        "8:58–9:43 G Block",
        "9:46–10:16 Activity",
        "10:19–11:04 H Block",
        "11:07–11:52 A Block",
        "11:55–1:10 Lunch / B Block",
        "1:13–1:58 C Block",
        "2:01–2:46 D Block",
      ],
    );
  });

  it("still shows Day 1 as H dropped", () => {
    const day = getAdvisoryDay(new Date("2026-09-11T12:00:00-04:00"));
    assert.equal(day.cycleLabel, "Day 1");
    assert.equal(day.dropped, "H");
    assert.equal(day.rows?.[1]?.title, "A Block");
  });
});
