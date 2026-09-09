"use client";

import { useEffect, useState } from "react";

function formatDate(date: Date) {
  const day = date.getDate();
  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? "th"
      : day % 10 === 1
        ? "st"
        : day % 10 === 2
          ? "nd"
          : day % 10 === 3
            ? "rd"
            : "th";
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(date);
  const month = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(date);

  return `${weekday}, ${month} ${day}${suffix}`;
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
      <span className="block">{now ? formatDate(now) : "\u00A0"}</span>
      <span className="mt-1 block text-base font-semibold text-emerald-800 sm:text-lg">
        {now ? formatTime(now) : "\u00A0"}
      </span>
    </time>
  );
}
