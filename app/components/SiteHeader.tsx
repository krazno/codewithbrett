"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { COURSES } from "@/app/lib/courses";
import { CycleDayLabel } from "./CycleDayLabel";
import { NavCountdownTimer } from "./NavCountdownTimer";
import { NavQuoteStrip } from "./NavQuoteStrip";
import { TodayDateLabel } from "./TodayDate";

const COURSE_LINKS = [
  ...COURSES.map((course) => ({
    href: `/classes/${course.slug}/`,
    label: course.title,
  })),
  { href: "/advisory/", label: "Advisory" },
] as const;

const navLinkClass =
  "rounded-sm text-[0.9375rem] font-medium leading-none text-white/95 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ua-evergreen)]";

const menuLinkClass =
  "block rounded-md px-3 py-2 text-sm font-medium text-stone-900 hover:bg-emerald-50 focus:outline-none focus-visible:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-700";

const mobileLinkClass =
  "rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white";

export function SiteHeader() {
  const pathname = usePathname();
  const coursesMenuId = useId();
  const mobileMenuId = useId();
  const coursesRef = useRef<HTMLDivElement>(null);
  const coursesButtonRef = useRef<HTMLButtonElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setCoursesOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!coursesOpen && !mobileOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCoursesOpen(false);
        setMobileOpen(false);
        coursesButtonRef.current?.focus();
      }
    }

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (coursesOpen && coursesRef.current && !coursesRef.current.contains(target)) {
        setCoursesOpen(false);
      }
      if (mobileOpen && mobileRef.current && !mobileRef.current.contains(target)) {
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [coursesOpen, mobileOpen]);

  return (
    <header ref={mobileRef} className="sticky top-0 z-[60]" role="banner">
      <NavQuoteStrip />

      <div className="border-b border-black/25 bg-[var(--ua-evergreen)] text-white shadow-md">
      <div className="mx-auto flex h-[var(--site-header-height)] max-w-5xl items-center justify-between gap-4 px-3 sm:gap-6 sm:px-6">
        <div className="flex min-w-0 items-center gap-5 sm:gap-7">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ua-evergreen)]"
            aria-label="Ursuline Academy Dedham — Home"
          >
            <Image
              src="/media/branded/ua-seal.png"
              alt=""
              width={36}
              height={36}
              priority
              className="h-8 w-8 object-contain"
            />
            <span className="hidden font-serif text-[1.125rem] leading-none font-semibold tracking-tight sm:inline">
              Ursuline
            </span>
          </Link>

          <nav
            aria-label="Site"
            className="hidden items-center gap-6 border-l border-white/25 pl-5 md:flex lg:gap-7 lg:pl-6"
          >
            <Link href="/" className={navLinkClass}>
              Home
            </Link>

            <div ref={coursesRef} className="relative">
              <button
                ref={coursesButtonRef}
                type="button"
                className={`${navLinkClass} inline-flex items-center gap-1.5`}
                aria-expanded={coursesOpen}
                aria-haspopup="menu"
                aria-controls={coursesMenuId}
                onClick={() => setCoursesOpen((open) => !open)}
              >
                Courses
                <span aria-hidden className="text-[0.6rem] leading-none opacity-80">
                  {coursesOpen ? "▴" : "▾"}
                </span>
              </button>

              {coursesOpen ? (
                <ul
                  id={coursesMenuId}
                  role="menu"
                  aria-label="Courses"
                  className="absolute top-[calc(100%+0.45rem)] left-0 z-50 min-w-[13.5rem] rounded-lg border border-stone-200 bg-white py-1.5 text-left shadow-lg"
                >
                  {COURSE_LINKS.map((item) => (
                    <li key={item.href} role="none">
                      <Link
                        href={item.href}
                        role="menuitem"
                        className={menuLinkClass}
                        onClick={() => setCoursesOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <Link href="/about/" className={navLinkClass}>
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <NavCountdownTimer />
          <div className="hidden min-[420px]:flex min-[420px]:flex-col min-[420px]:items-end min-[420px]:gap-0.5">
            <TodayDateLabel className="whitespace-nowrap text-right text-[0.75rem] leading-none font-medium text-white/90 md:text-sm" />
            <CycleDayLabel className="whitespace-nowrap text-right text-[0.7rem] leading-none font-semibold tracking-wide text-white/80 md:text-xs" />
          </div>

          <button
            id="site-mobile-toggle"
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-white/35 px-2.5 py-1.5 text-sm font-medium leading-none text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ua-evergreen)] md:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileMenuId}
            onClick={() => setMobileOpen((open) => !open)}
          >
            Menu
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id={mobileMenuId}
          className="border-t border-white/15 bg-[var(--ua-evergreen)] md:hidden"
        >
          <nav
            aria-label="Mobile"
            className="mx-auto flex max-w-5xl flex-col gap-0.5 px-3 py-2.5 sm:px-6"
          >
            <Link
              href="/"
              className={mobileLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <p className="px-3 pt-2.5 pb-1 text-sm font-medium text-white/65">
              Courses
            </p>
            {COURSE_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${mobileLinkClass} text-white/95`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/about/"
              className={mobileLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      ) : null}
      </div>
    </header>
  );
}
