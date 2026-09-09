"use client";

import { useEffect, useState } from "react";

function daySuffix(day: number) {
  return day % 100 >= 11 && day % 100 <= 13
    ? "th"
    : day % 10 === 1
      ? "st"
      : day % 10 === 2
        ? "nd"
        : day % 10 === 3
          ? "rd"
          : "th";
}

export function formatTodayDate(date: Date) {
  const day = date.getDate();
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(date);
  const month = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(date);

  return `${weekday}, ${month} ${day}${daySuffix(day)}`;
}

/** Compact label for narrow sticky headers (e.g. Wed, Sep 9th). */
export function formatTodayDateCompact(date: Date) {
  const day = date.getDate();
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(date);
  const month = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);

  return `${weekday}, ${month} ${day}${daySuffix(day)}`;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function TodayDate() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();

    const timer = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <time dateTime={now?.toISOString()}>
      <span className="block">{now ? formatTodayDate(now) : "\u00A0"}</span>
      <span className="mt-1 block text-base font-semibold text-emerald-800 sm:text-lg">
        {now ? formatTime(now) : "\u00A0"}
      </span>
    </time>
  );
}

/** Date-only label for sticky bars (no clock). */
export function TodayDateLabel({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const full = now ? formatTodayDate(now) : "\u00A0";
  const compact = now ? formatTodayDateCompact(now) : "\u00A0";

  return (
    <time
      dateTime={now ? now.toISOString().slice(0, 10) : undefined}
      className={className}
      suppressHydrationWarning
      aria-label={now ? full : "Today’s date"}
    >
      <span className="lg:hidden">{compact}</span>
      <span className="hidden lg:inline">{full}</span>
    </time>
  );
}
