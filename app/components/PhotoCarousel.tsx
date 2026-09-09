"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Photo = {
  src: string;
  alt: string;
};

export function PhotoCarousel({
  photos,
  label,
  intervalMs = 4000,
}: {
  photos: readonly Photo[];
  label: string;
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || photos.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % photos.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [photos.length, intervalMs, reducedMotion]);

  const photo = photos[index] ?? photos[0];
  if (!photo) return null;

  return (
    <figure
      className="relative overflow-hidden rounded-2xl bg-stone-200"
      aria-label={label}
    >
      <div className="relative aspect-[4/3] w-full">
        {photos.map((item, i) => (
          <div
            key={item.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            } ${reducedMotion ? "!duration-0" : ""}`}
            aria-hidden={i !== index}
          >
            <Image
              src={item.src}
              alt={i === index ? item.alt : ""}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && !reducedMotion ? (
        <div
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5"
          role="tablist"
          aria-label={`${label} slides`}
        >
          {photos.map((item, i) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show photo ${i + 1} of ${photos.length}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                i === index
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/55 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      ) : null}

      <figcaption className="sr-only">{photo.alt}</figcaption>
    </figure>
  );
}
