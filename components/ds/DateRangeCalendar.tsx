"use client";

import { DayPicker, type DateRange } from "react-day-picker";
import { Icon } from "@/components/ds/Icon";

export type { DateRange };

type DateRangeCalendarProps = {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  /** Earliest selectable day; days before it are disabled and you can't page back past its month. */
  fromDate: Date;
  /** Months shown side by side on wider screens (phones always show one). Default: a single month. */
  numberOfMonths?: number;
};

/**
 * Range calendar on react-day-picker, styled with DS tokens. PROVISIONAL — no Figma frame yet.
 * Start / end days are sky circles; days between sit on a pale sky band (brand-blue-alpha-8), and the
 * start / end cells carry half of that band so it reads as one continuous strip. Today is sky + bold.
 */
export function DateRangeCalendar({ value, onChange, fromDate, numberOfMonths = 1 }: DateRangeCalendarProps) {
  return (
    <DayPicker
      mode="range"
      selected={value}
      onSelect={onChange}
      // A trip is at least one night; clicking again after a full range starts a fresh one.
      min={1}
      resetOnSelect
      excludeDisabled
      disabled={{ before: fromDate }}
      startMonth={fromDate}
      defaultMonth={value?.from ?? fromDate}
      numberOfMonths={numberOfMonths}
      showOutsideDays={false}
      components={{
        // Yopki DS arrow-left-s-line / arrow-right-s-line.
        Chevron: ({ orientation }) => (
          <Icon src={`/trip/ds/arrow-${orientation === "left" ? "left" : "right"}-s-line.svg`} size={20} />
        ),
      }}
      classNames={{
        root: "relative w-fit",
        // Phones: only the first month (any month after another one is hidden; the nav also lives in
        // this container, so :first-child can't be used). The arrows still step one month at a time.
        months: "flex gap-8 max-sm:[&>.rdp-month~.rdp-month]:hidden",
        month: "rdp-month flex flex-col gap-4",
        month_caption: "flex h-8 items-center justify-center",
        caption_label: "text-base leading-6 font-medium tracking-[-0.176px] text-text-strong-950",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        // Same look as the DS icon Button (Neutral·Stroke, 32px).
        button_previous:
          "flex size-8 cursor-pointer items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-white-0 text-text-strong-950 transition-colors outline-none hover:bg-bg-weak-50 focus-visible:ring-2 focus-visible:ring-brand-blue/30 disabled:cursor-not-allowed disabled:text-text-disabled-300 disabled:hover:bg-bg-white-0",
        button_next:
          "flex size-8 cursor-pointer items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-white-0 text-text-strong-950 transition-colors outline-none hover:bg-bg-weak-50 focus-visible:ring-2 focus-visible:ring-brand-blue/30 disabled:cursor-not-allowed disabled:text-text-disabled-300 disabled:hover:bg-bg-white-0",
        month_grid: "border-collapse",
        weekdays: "",
        weekday: "size-10 p-0 text-center text-xs leading-4 font-medium text-text-soft-400",
        week: "",
        // The cell carries the range band; the button inside carries the circle.
        day: "size-10 p-0 text-center [&.rdp-rs.rdp-re]:bg-none",
        day_button:
          "flex size-10 cursor-pointer items-center justify-center rounded-full text-sm leading-5 tracking-[-0.084px] text-text-strong-950 transition-colors outline-none hover:bg-bg-weak-50 focus-visible:ring-2 focus-visible:ring-brand-blue/30 disabled:cursor-not-allowed disabled:hover:bg-transparent",
        today: "font-semibold [&>button]:text-brand-blue",
        selected: "",
        range_start:
          "rdp-rs bg-linear-to-r from-transparent from-50% to-brand-blue-alpha-8 to-50% [&>button]:bg-brand-blue [&>button]:font-medium [&>button]:text-text-white-0 [&>button]:hover:bg-brand-blue",
        range_end:
          "rdp-re bg-linear-to-l from-transparent from-50% to-brand-blue-alpha-8 to-50% [&>button]:bg-brand-blue [&>button]:font-medium [&>button]:text-text-white-0 [&>button]:hover:bg-brand-blue",
        range_middle: "bg-brand-blue-alpha-8 [&>button]:rounded-none [&>button]:hover:bg-brand-blue-alpha-8",
        disabled: "[&>button]:text-text-disabled-300",
        outside: "invisible",
        hidden: "invisible",
      }}
    />
  );
}
