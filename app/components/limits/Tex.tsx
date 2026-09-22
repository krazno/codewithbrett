"use client";

import katex from "katex";
import "katex/dist/katex.min.css";

export function Tex({
  math,
  display = false,
  className = "",
}: {
  math: string;
  display?: boolean;
  className?: string;
}) {
  const html = katex.renderToString(math, {
    displayMode: display,
    throwOnError: false,
    strict: "ignore",
    output: "html",
  });
  const Tag = display ? "div" : "span";
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
