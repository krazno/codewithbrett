import type { ReactNode } from "react";

export type MarkerId =
  | "paw"
  | "soccer"
  | "volleyball"
  | "basketball"
  | "music"
  | "star"
  | "treehill"
  | "classic";

type MarkerDef = {
  id: MarkerId;
  label: string;
  /** Inline SVG. Math never depends on this. */
  icon: (size: number) => ReactNode;
};

function svgProps(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    focusable: false,
  };
}

/**
 * Student-interest markers. Add a new entry here to theme a future class
 * without touching graph or domain logic.
 */
export const MARKERS: MarkerDef[] = [
  {
    id: "paw",
    label: "Ursuline bear paw",
    icon: (size) => (
      <svg {...svgProps(size)}>
        <ellipse cx="12" cy="15.2" rx="5.2" ry="4.4" fill="currentColor" />
        <circle cx="6.2" cy="8.2" r="2.15" fill="currentColor" />
        <circle cx="10.1" cy="6.1" r="2.15" fill="currentColor" />
        <circle cx="14.3" cy="6.1" r="2.15" fill="currentColor" />
        <circle cx="18" cy="8.2" r="2.15" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "soccer",
    label: "Soccer ball",
    icon: (size) => (
      <svg {...svgProps(size)}>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <polygon
          points="12,8.2 14.6,10 13.6,13.1 10.4,13.1 9.4,10"
          fill="currentColor"
        />
        <path
          d="M12 3.2 14.6 10M12 3.2 9.4 10M20.4 8.4 14.6 10M20.4 8.4 13.6 13.1M3.6 8.4 9.4 10M3.6 8.4 10.4 13.1M6.4 19.2 10.4 13.1M17.6 19.2 13.6 13.1M6.4 19.2 12 21M17.6 19.2 12 21"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
  {
    id: "volleyball",
    label: "Volleyball",
    icon: (size) => (
      <svg {...svgProps(size)}>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M5 9.5c3.2 1 6.4 1 11.5-1.2M4.8 14.8c4-.2 8.4-1.6 14.2-1.2M9.2 4.4c.6 4.4-.4 8.8-3.4 14.2M14.8 4.2c-.2 4.6.8 9.2 4.2 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "basketball",
    label: "Basketball",
    icon: (size) => (
      <svg {...svgProps(size)}>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M12 3v18M3.4 12H20.6M6.2 5.4c3 3.4 3 9.8 0 13.2M17.8 5.4c-3 3.4-3 9.8 0 13.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    ),
  },
  {
    id: "music",
    label: "Music note",
    icon: (size) => (
      <svg {...svgProps(size)}>
        <path
          d="M10 18.2a2.6 2.6 0 1 1-1.8-2.48V6.4L18 4.6v8.7a2.6 2.6 0 1 1-1.8-2.47V7.5l-6.2 1.3v9.4Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "star",
    label: "Star",
    icon: (size) => (
      <svg {...svgProps(size)}>
        <path
          d="M12 3.2 14.4 9h6.2l-5 3.7 1.9 6.1L12 15.6 6.5 18.8 8.4 12.7 3.4 9h6.2L12 3.2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "treehill",
    label: "One Tree Hill",
    icon: (size) => (
      <svg {...svgProps(size)}>
        <rect x="10.4" y="14" width="3.2" height="7.2" rx="0.6" fill="currentColor" />
        <circle cx="12" cy="8.2" r="5.4" fill="currentColor" />
        <circle cx="7.6" cy="11.2" r="3.6" fill="currentColor" />
        <circle cx="16.4" cy="11.2" r="3.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "classic",
    label: "Classic point",
    icon: (size) => (
      <svg {...svgProps(size)}>
        <circle cx="12" cy="12" r="6.5" fill="currentColor" />
        <circle cx="12" cy="12" r="3.2" fill="#FFFDF7" />
      </svg>
    ),
  },
];

export const DEFAULT_MARKER: MarkerId = "paw";

export function getMarker(id: MarkerId): MarkerDef {
  return MARKERS.find((m) => m.id === id) ?? MARKERS[0];
}

export function MarkerIcon({
  id,
  size = 20,
  className,
}: {
  id: MarkerId;
  size?: number;
  className?: string;
}) {
  return (
    <span className={className} style={{ display: "inline-flex", color: "inherit" }}>
      {getMarker(id).icon(size)}
    </span>
  );
}
