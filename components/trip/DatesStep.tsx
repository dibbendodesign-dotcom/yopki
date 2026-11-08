"use client";

import { Tabs } from "@base-ui/react/tabs";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ds/Button";
import { DateRangeCalendar, type DateRange } from "@/components/ds/DateRangeCalendar";
import { NumberStepper } from "@/components/ds/NumberStepper";
import { DATE_MODE_TAB_CLASS, MonthCarousel, upcomingMonths } from "@/components/trip/MonthCarousel";
import { saveTripDraft } from "@/components/trip/tripDraft";
import { TripStepper } from "@/components/trip/TripStepper";

type DateMode = "dates" | "flexible";

// PROVISIONAL limits / defaults — Figma shows 7 days.
const DEFAULT_DAYS = 7;
const MIN_DAYS = 1;
const MAX_DAYS = 30;
/** How many months ahead the flexible picker offers, starting with the current month. */
const MONTHS_AHEAD = 12;


/**
 * Today's date (yyyy-mm-dd), read in the browser only: the visitor's time zone decides which month
 * it is, and Next.js must not freeze `new Date()` into the prerendered page. `null` on the server.
 */
const noopSubscribe = () => () => {};
function useToday() {
  return useSyncExternalStore(noopSubscribe, () => isoDate(new Date()), () => null);
}


/** yyyy-mm-dd in local time. */
function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function nightsBetween(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

const shortDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });


/** Trip flow — step 3: when. Exact dates, or flexible (a trip length + the months that suit). Figma 66:6752. */
export function DatesStep() {
  const router = useRouter();
  const [mode, setMode] = useState<DateMode>("flexible");

  // Flexible
  const [days, setDays] = useState(DEFAULT_DAYS);
  const today = useToday();
  const months = useMemo(() => (today ? upcomingMonths(today, MONTHS_AHEAD) : []), [today]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  // Exact dates — PROVISIONAL: no Figma frame for the "Dates" tab yet.
  const [range, setRange] = useState<DateRange | undefined>();
  const todayDate = useMemo(() => (today ? new Date(`${today}T00:00`) : null), [today]);

  const toggleMonth = (key: string) =>
    setSelectedMonths((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const chosenMonths = months.filter((m) => selectedMonths.includes(m.key));
  const nights = range?.from && range.to ? nightsBetween(range.from, range.to) : 0;

  const ready = mode === "flexible" ? chosenMonths.length > 0 : nights > 0;
  const summary =
    mode === "flexible"
      ? chosenMonths.length > 0
        ? `${days} ${days === 1 ? "day" : "days"} in ${chosenMonths.map((m) => m.name).join(", ")}`
        : "Pick at least one month"
      : range?.from && range.to && nights > 0
        ? `${shortDate(range.from)} – ${shortDate(range.to)} · ${nights} ${nights === 1 ? "night" : "nights"}`
        : range?.from
          ? `From ${shortDate(range.from)} — now pick your last day`
          : "Pick your first and last day";

  return (
    <main className="mx-auto mt-6 mb-10 flex w-full max-w-[932px] flex-col items-center gap-11 px-4">
      <TripStepper current="Dates" className="max-w-full overflow-x-auto" />

      <section className="flex w-full max-w-[778px] flex-col rounded-20 border border-stroke-soft-200 bg-bg-white-0 shadow-card">
        <div className="flex w-full flex-col items-center gap-14 px-9 pt-10 pb-16 max-sm:px-5">
          <h1 className="text-center text-[32px] leading-10 font-medium tracking-[-0.16px] text-brand-blue">
            When are you travelling?
          </h1>

          <Tabs.Root
            value={mode}
            onValueChange={(value) => setMode(value as DateMode)}
            className="flex w-full flex-col items-center gap-[31px]"
          >
            {/* Figma "Switch Toggle" 18:12489 */}
            <Tabs.List
              aria-label="How to pick dates"
              className="flex items-center gap-1 rounded-full bg-bg-weak-50 p-1"
            >
              <Tabs.Tab value="dates" className={DATE_MODE_TAB_CLASS}>
                Dates
              </Tabs.Tab>
              <Tabs.Tab value="flexible" className={DATE_MODE_TAB_CLASS}>
                Flexible
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel
              value="flexible"
              className="flex w-full max-w-[432px] flex-col items-center gap-[31px] outline-none"
            >
              <h2 id="days-heading" className="text-xl leading-7 font-medium text-text-strong-950">
                How many days?
              </h2>

              <NumberStepper
                label="Days"
                value={days}
                min={MIN_DAYS}
                max={MAX_DAYS}
                onChange={setDays}
                decreaseLabel="One day fewer"
                increaseLabel="One day more"
              />

              <MonthCarousel months={months} selected={selectedMonths} onToggle={toggleMonth} />
            </Tabs.Panel>

            <Tabs.Panel value="dates" className="flex min-h-[336px] w-full justify-center outline-none">
              {/* Read in the browser only (see useToday), so it renders right after hydration. */}
              {todayDate && <DateRangeCalendar value={range} onChange={setRange} fromDate={todayDate} />}
            </Tabs.Panel>
          </Tabs.Root>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-b-20 border-t border-stroke-soft-200 bg-bg-white-0 px-[31px] py-5">
          <p aria-live="polite" className="text-sm leading-5 tracking-[-0.084px] text-text-sub-600">
            {summary}
          </p>

          <div className="flex shrink-0 items-center gap-3">
            <Button size="large" variant="neutral-stroke" onClick={() => router.push("/trip/new/travelers")}>
              Back
            </Button>
            <Button
              size="large"
              disabled={!ready}
              // Saves the dates summary to the trip draft (read by the build animation).
              onClick={() => {
                saveTripDraft({ when: summary });
                router.push("/trip/new/personalization");
              }}
            >
              Continue
            </Button>
          </div>
        </footer>
      </section>
    </main>
  );
}
