"use client";

import { useEffect, useState } from "react";
import { SITE_QUOTES } from "@/app/lib/quotes";

export function QuoteFooter() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % SITE_QUOTES.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const quote = SITE_QUOTES[quoteIndex];

  return (
    <footer className="site-quote-footer" aria-label="Inspirational quote">
      <figure className="site-quote-content" key={quoteIndex}>
        <blockquote>“{quote.text}”</blockquote>
        <figcaption>— {quote.source}</figcaption>
      </figure>
    </footer>
  );
}
