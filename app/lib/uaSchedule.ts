import schedule from "@/data/ua-schedule-2026-27.json";

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
    times: unknown[];
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

export const uaScheduleMeta = data.meta;
export const uaSchedule = data;
