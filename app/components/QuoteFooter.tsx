"use client";

import { useEffect, useState } from "react";

const quotes = [
  {
    text: "She is clothed with strength and dignity, and she laughs without fear of the future.",
    source: "Proverbs 31:25",
  },
  {
    text: "Act, move, believe, strive, hope.",
    source: "St. Angela Merici (excerpt)",
  },
  {
    text: "Whatever you do, work at it with all your heart.",
    source: "Colossians 3:23",
  },
  {
    text: "For God gave us a spirit not of fear but of power and love and self-control.",
    source: "2 Timothy 1:7",
  },
  {
    text: "With God all things are possible.",
    source: "Matthew 19:26",
  },
] as const;

export function QuoteFooter() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % quotes.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const quote = quotes[quoteIndex];

  return (
    <footer className="site-quote-footer" aria-label="Inspirational quote">
      <figure className="site-quote-content" key={quoteIndex}>
        <blockquote>“{quote.text}”</blockquote>
        <figcaption>— {quote.source}</figcaption>
      </figure>
    </footer>
  );
}
