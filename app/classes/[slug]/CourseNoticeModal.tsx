"use client";

import { useEffect, useRef, useState } from "react";

export function CourseNoticeModal({
  slug,
  courseTitle,
  googleClassroomUrl,
}: {
  slug: string;
  courseTitle: string;
  googleClassroomUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const storageKey = `course-notice-dismissed:${slug}`;

  useEffect(() => {
    if (sessionStorage.getItem(storageKey) !== "1") setOpen(true);
  }, [storageKey]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function dismiss() {
    sessionStorage.setItem(storageKey, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={dismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-notice-title"
        className="ua-card ua-shadow-soft w-full max-w-md p-6 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-xs font-semibold tracking-[0.16em] text-emerald-800 uppercase">
          {courseTitle}
        </p>
        <h2
          id="course-notice-title"
          className="mt-1 font-serif text-2xl text-stone-900"
        >
          Check Google Classroom
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-700">
          For the most current information and assignments, please check Google
          Classroom for this course. Thank you for your patience as I port over
          our curriculum.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {googleClassroomUrl ? (
            <a
              href={googleClassroomUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="inline-flex items-center justify-center rounded-full border border-[var(--ua-evergreen)] px-5 py-2.5 text-sm font-semibold text-[var(--ua-evergreen)] hover:bg-emerald-50 focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
            >
              Open Google Classroom ↗
            </a>
          ) : null}
          <button
            ref={closeRef}
            type="button"
            onClick={dismiss}
            className="inline-flex items-center justify-center rounded-full bg-[var(--ua-evergreen)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b4a33] focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 focus:outline-none"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
