"use client";

import { useEffect, useState } from "react";
import { SITE_QUOTES } from "@/app/lib/quotes";

/** Slim rotating quotes under sticky nav; hides when the page is scrolled down. */
export function NavQuoteStrip() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % SITE_QUOTES.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setHidden(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const quote = SITE_QUOTES[quoteIndex];

  return (
    <div
      className={`overflow-hidden border-b border-black/15 bg-[var(--ua-evergreen)]/95 text-white transition-[max-height,opacity,border-color] duration-200 ease-out ${
        hidden
          ? "max-h-0 border-transparent opacity-0"
          : "max-h-14 opacity-100"
      }`}
      aria-hidden={hidden}
    >
      <figure
        className="site-nav-quote mx-auto flex max-w-5xl items-baseline justify-center gap-x-2 px-3 py-1.5 text-center sm:px-6"
        key={quoteIndex}
      >
        <blockquote className="min-w-0 truncate font-serif text-[0.8125rem] font-medium leading-snug text-white/95 sm:text-sm">
          “{quote.text}”
        </blockquote>
        <figcaption className="hidden shrink-0 text-[0.65rem] font-semibold tracking-wide text-white/70 uppercase sm:inline">
          — {quote.source}
        </figcaption>
      </figure>
    </div>
  );
}
