"use client";

import { useEffect, useState } from "react";
import { ANGELA_QUOTES } from "@/app/lib/quotes";

/** Topmost rotating quote banner; hides when the page scrolls down. */
export function NavQuoteStrip() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % ANGELA_QUOTES.length);
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

  const quote = ANGELA_QUOTES[quoteIndex];

  return (
    <div
      className={`site-quote-bar overflow-hidden transition-[max-height,opacity,border-color] duration-200 ease-out ${
        hidden
          ? "max-h-0 border-transparent opacity-0"
          : "max-h-28 opacity-100"
      }`}
      aria-label="Inspirational quote"
      aria-hidden={hidden}
    >
      <figure
        className="site-nav-quote mx-auto flex max-w-5xl flex-wrap items-baseline justify-center gap-x-2.5 gap-y-0.5 px-3 py-2.5 text-center sm:px-6"
        key={quoteIndex}
      >
        <blockquote className="min-w-0 font-serif text-[0.875rem] font-medium leading-snug tracking-[0.01em] text-[var(--ua-evergreen)] sm:text-[1rem] sm:leading-snug">
          “{quote.text}”
        </blockquote>
        <figcaption className="shrink-0 font-sans text-[0.625rem] font-medium tracking-[0.1em] text-[var(--ua-teal)] uppercase sm:text-[0.68rem]">
          — {quote.source}
        </figcaption>
      </figure>
    </div>
  );
}
