"use client";

import { useEffect } from "react";

/**
 * Best-effort print / capture deterrents for classroom devices.
 * Note: iPad/OS screenshots cannot be fully blocked by any website.
 */
export function ContentGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const meta = e.metaKey || e.ctrlKey;
      if (meta && (key === "p" || key === "s")) {
        e.preventDefault();
        e.stopPropagation();
      }
      // PrintScreen / some capture shortcuts
      if (key === "printscreen") {
        e.preventDefault();
      }
    };

    const blockContext = (e: MouseEvent) => {
      e.preventDefault();
    };

    const blockDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener("keydown", blockKeys, true);
    document.addEventListener("contextmenu", blockContext);
    document.addEventListener("dragstart", blockDrag);

    return () => {
      document.removeEventListener("keydown", blockKeys, true);
      document.removeEventListener("contextmenu", blockContext);
      document.removeEventListener("dragstart", blockDrag);
    };
  }, []);

  return <>{children}</>;
}
