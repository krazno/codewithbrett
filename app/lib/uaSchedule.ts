import schedule from "../../data/ua-schedule-2026-27.json" with { type: "json" };

export type CalendarEntry = {
  kind: string;
  cycleDay: number | null;
  label: string | null;
  notes?: string;
  affected?: boolean;
  special?: boolean;
  raw?: string;
};

type TeachingBlock = {
  course: string;
  short?: string;
  room: string;
  notes?: string;
  meetsDays?: number[];
} | null;

type RotationSequence = {
  dropped: string;
  load: number;
  sequence: Array<{
    time: string;
    block: string | null;
    course: string;
    room: string | null;
  }>;
};

type ScheduleData = {
  meta: {
    school: string;
    year: string;
    timezone: string;
    day0Start: string;
    day1Start: string;
    source: string;
    notes: string;
  };
  calendar: Record<string, CalendarEntry>;
  blockRotation: {
    times: Array<{
      slot: string;
      time: string | null;
      fixed?: string;
      note?: string;
    }>;
    days: Record<string, string[]>;
    slotOrder: string[];
  };
  teaching: {
    teacher: string;
    year: string;
    blocks: Record<string, TeachingBlock>;
    duties: unknown[];
    lunch: unknown;
    rotationSequences: Record<string, RotationSequence>;
  };
};

const data = schedule as ScheduleData;

const TZ = data.meta.timezone || "America/New_York";

/** YYYY-MM-DD in America/New_York for a given instant. */
export function americaDateKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getCalendarEntry(dateKey: string): CalendarEntry | null {
  return data.calendar[dateKey] ?? null;
}

/** Compact nav label: "Day 4", "Day 0", or null when no cycle day (weekend / no school / unknown). */
export function getCycleDayLabel(date: Date = new Date()): string | null {
  const entry = getCalendarEntry(americaDateKey(date));
  return entry?.label ?? null;
}

export function getTeachingForCycleDay(cycleDay: number): RotationSequence | null {
  return data.teaching.rotationSequences[String(cycleDay)] ?? null;
}

const SLOT_INDEX: Record<string, number> = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
  lunch: 4,
  "5": 5,
  "6": 6,
};

const LUNCH_NESTED = [
  {
    label: "First Lunch",
    time: "11:55–12:25",
    detail:
      "Science, Directed Research, History, World Language, 9th grade colloquium, Study Hall",
  },
  {
    label: "Second Lunch",
    time: "12:40–1:10",
    detail:
      "Theology, English, Math, CS, Fine Arts, counseling classes, 7/8 Specials",
  },
];

function enDashTime(time: string) {
  return time.replace(/-/g, "–");
}

export function formatAmericaDateLabel(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export type AdvisoryBellRow = {
  time: string;
  title: string;
  nested?: { label: string; time: string; detail?: string }[];
};

export type AdvisoryDay = {
  dateKey: string;
  dateLabel: string;
  cycleLabel: string | null;
  cycleDay: number | null;
  dropped: string | null;
  notes: string | null;
  rows: AdvisoryBellRow[] | null;
};

/** School-wide bell list for Advisory, using today's cycle day from the calendar ledger. */
export function getAdvisoryDay(date: Date = new Date()): AdvisoryDay {
  const dateKey = americaDateKey(date);
  const entry = getCalendarEntry(dateKey);
  const dateLabel = formatAmericaDateLabel(date);
  const cycleDay = entry?.cycleDay ?? null;
  const cycleLabel = entry?.label ?? null;
  const notes = entry?.notes || null;
  const blocks =
    cycleDay != null && cycleDay > 0
      ? data.blockRotation.days[String(cycleDay)]
      : undefined;

  if (!blocks || blocks.length < 8) {
    return {
      dateKey,
      dateLabel,
      cycleLabel,
      cycleDay,
      dropped: null,
      notes,
      rows: null,
    };
  }

  const dropped = blocks[7] ?? null;
  const rows: AdvisoryBellRow[] = [];

  for (const slot of data.blockRotation.times) {
    if (slot.slot === "dropped") continue;
    const time = slot.time ? enDashTime(slot.time) : "";
    if (slot.slot === "advisory") {
      rows.push({ time, title: "Advisory — Prayer and Pledge" });
      continue;
    }
    if (slot.slot === "activity") {
      rows.push({ time, title: "Activity" });
      continue;
    }
    const index = SLOT_INDEX[slot.slot];
    if (index == null) continue;
    const letter = blocks[index];
    if (slot.slot === "lunch") {
      rows.push({
        time,
        title: `Lunch / ${letter} Block`,
        nested: LUNCH_NESTED,
      });
      continue;
    }
    rows.push({ time, title: `${letter} Block` });
  }

  return {
    dateKey,
    dateLabel,
    cycleLabel,
    cycleDay,
    dropped,
    notes,
    rows,
  };
}

export const uaScheduleMeta = data.meta;
export const uaSchedule = data;
