"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ds/Icon";

/** Gap between month cards (Figma 18:12497) — also used to work out carousel pages. */
const CARD_GAP = 12;

export type MonthOption = { key: string; name: string; label: string };

/** The next `count` months starting with today's (yyyy-mm-dd) month. */
export function upcomingMonths(today: string, count: number): MonthOption[] {
  const now = new Date(`${today}T00:00`);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      name: d.toLocaleString("en-US", { month: "long" }),
      label: d.toLocaleString("en-US", { month: "long", year: "numeric" }),
    };
  });
}

/** Dates / Flexible switch item (Figma "Switch Toggle" 18:12489); the selected item is a full pill. */
export const DATE_MODE_TAB_CLASS =
  "flex cursor-pointer items-center justify-center rounded-full px-6 py-1.5 text-xs leading-4 font-medium text-text-soft-400 transition-colors outline-none hover:text-text-sub-600 focus-visible:ring-2 focus-visible:ring-brand-blue/30 data-active:bg-bg-white-0 data-active:text-text-strong-950 data-active:shadow-toggle-switch";

type MonthCarouselProps = {
  months: MonthOption[];
  selected: string[];
  onToggle: (key: string) => void;
};

/**
 * Month cards in a snap-scrolling row — 4 per view (3 on phones) — with page dots underneath.
 * Card: Figma "Discover places to visit" 18:12498; dots: "indicator" 18:12522 (24×6 pill for the
 * current page, 6px dots at 50% for the rest, 8px apart), drawn in code because they track scrolling.
 */
export function MonthCarousel({ months, selected, onToggle }: MonthCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.clientWidth + CARD_GAP;
    setPageCount(Math.max(1, Math.round((el.scrollWidth + CARD_GAP) / step)));
    setPage(Math.round(el.scrollLeft / step));
  }, []);

  // Re-measure once the months arrive (they're read in the browser after hydration) and on resize.
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, months.length]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * (el.clientWidth + CARD_GAP), behavior: "smooth" });
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        ref={trackRef}
        role="group"
        aria-label="Months that suit you"
        onScroll={measure}
        className="flex min-h-[108px] w-full snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {months.map((m) => {
          const isSelected = selected.includes(m.key);
          return (
            <button
              key={m.key}
              type="button"
              aria-pressed={isSelected}
              aria-label={m.label}
              onClick={() => onToggle(m.key)}
              // 4 cards per view (3 on phones), minus the gaps between them. Side padding is 4px
              // rather than Figma's 16px so "September" still fits a quarter of the 432px row.
              className="group flex min-w-0 shrink-0 basis-[calc((100%-36px)/4)] cursor-pointer snap-start flex-col items-center gap-3 overflow-clip rounded-12 border border-stroke-soft-200 bg-bg-white-0 px-1 py-4 transition-colors outline-none hover:bg-bg-weak-50 focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:ring-inset aria-pressed:border-brand-blue/30 aria-pressed:bg-brand-blue-alpha-8 max-sm:basis-[calc((100%-24px)/3)]"
            >
              {/* Key Icons [1.0] with the Yopki DS calendar-line (sky when the month is selected,
                  like the trip-type cards). */}
              <span className="flex shrink-0 items-center justify-center overflow-clip rounded-full border border-stroke-soft-200 bg-bg-white-0 p-2.5 text-icon-sub-600 shadow-x-small transition-colors group-aria-pressed:border-brand-blue/30 group-aria-pressed:text-brand-blue">
                <Icon src="/trip/ds/calendar-line.svg" size={20} />
              </span>
              <span className="text-sm leading-5 font-medium tracking-[-0.084px] whitespace-nowrap text-text-strong-950">
                {m.name}
              </span>
            </button>
          );
        })}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show months page ${i + 1} of ${pageCount}`}
              aria-current={i === page ? "true" : undefined}
              onClick={() => goTo(i)}
              className={`h-1.5 cursor-pointer rounded-full bg-stroke-soft-200 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 ${
                i === page ? "w-6" : "w-1.5 opacity-50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
