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
  const words = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
  }).format(date);

  return `${words} ${day}${suffix}`;
}

export function TodayDate() {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setToday(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <time dateTime={today.toISOString().slice(0, 10)} suppressHydrationWarning>
      {formatDate(today)}
    </time>
  );
}
