"use client";

import { RadioGroup } from "@base-ui/react/radio-group";
import { Tabs } from "@base-ui/react/tabs";
import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { Button } from "@/components/ds/Button";
import { DateRangeCalendar, type DateRange } from "@/components/ds/DateRangeCalendar";
import { Icon } from "@/components/ds/Icon";
import { NumberStepper } from "@/components/ds/NumberStepper";
import { ProgressBarLabel } from "@/components/ds/ProgressBarLabel";
import { TextInput } from "@/components/ds/TextInput";
import { BuildingItinerary } from "@/components/trip/BuildingItinerary";
import { CHOICE_CHIP_CLASS } from "@/components/trip/choiceChip";
import { ChoiceSection, MUST_DOS } from "@/components/trip/ChoiceSection";
import { DATE_MODE_TAB_CLASS, MonthCarousel, upcomingMonths } from "@/components/trip/MonthCarousel";
import { SearchResultItem } from "@/components/trip/SearchResultItem";
import { TravelerCounter } from "@/components/trip/TravelerCounter";
import { TRIP_TYPES, TripTypeCard, type TripType } from "@/components/trip/TripTypeCard";
import { TripStepper } from "@/components/trip/TripStepper";
import type { TripDraft } from "@/components/trip/tripDraft";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/* ------------------------------------------------------------------------------------------------
 * Status labels
 * --------------------------------------------------------------------------------------------- */

type Status =
  | { kind: "figma"; node: string }
  | { kind: "changed"; what: string }
  | { kind: "review" };

function StatusBadge({ status }: { status: Status }) {
  const styles = {
    figma: "border-brand-blue/30 bg-brand-blue-alpha-8 text-brand-blue",
    changed: "border-stroke-soft-200 bg-bg-weak-50 text-text-sub-600",
    review: "border-primary-base/40 bg-primary-alpha-16 text-primary-base",
  }[status.kind];
  const text =
    status.kind === "figma" ? `From Figma · ${status.node}` : status.kind === "changed" ? `Changed on request · ${status.what}` : "Needs review";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs leading-4 font-medium ${styles}`}>
      {status.kind === "review" && <span aria-hidden>●</span>}
      {text}
    </span>
  );
}

type PatternProps = {
  id: string;
  title: string;
  where: string;
  statuses: Status[];
  /** Why it needs review — shown only when one of the statuses is "review". */
  review?: string[];
  notes?: string[];
  children: ReactNode;
  wide?: boolean;
};

function Pattern({ id, title, where, statuses, review, notes, children, wide }: PatternProps) {
  const needsReview = statuses.some((s) => s.kind === "review");
  return (
    <article
      id={id}
      className={`flex min-w-0 scroll-mt-6 flex-col overflow-clip rounded-20 border bg-bg-white-0 shadow-x-small ${
        needsReview ? "border-primary-base/40" : "border-stroke-soft-200"
      } ${wide ? "lg:col-span-2" : ""}`}
    >
      <header className="flex flex-col gap-2 border-b border-stroke-soft-200 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="mr-auto text-base leading-6 font-medium tracking-[-0.176px] text-text-strong-950">{title}</h3>
          {statuses.map((s, i) => (
            <StatusBadge key={i} status={s} />
          ))}
        </div>
        <p className="text-xs leading-4 text-text-sub-600">Used in: {where}</p>
      </header>

      {/* Wide previews (stepper, chips) scroll inside the card on small screens. */}
      <div className="flex min-w-0 flex-1 items-center justify-center overflow-x-auto bg-bg-weak-50 p-6 max-sm:justify-start">
        {children}
      </div>

      {(review?.length || notes?.length) && (
        <footer className="flex flex-col gap-2 border-t border-stroke-soft-200 p-4 text-sm leading-5 text-text-sub-600">
          {review?.length ? (
            <div>
              <p className="mb-1 text-xs leading-4 font-medium tracking-wide text-primary-base uppercase">To review</p>
              <ul className="list-disc space-y-1 pl-5">
                {review.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {notes?.length ? (
            <ul className="list-disc space-y-1 pl-5 text-xs leading-4">
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : null}
        </footer>
      )}
    </article>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-6 flex-col gap-4">
      <h2 className="text-xl leading-7 font-medium text-text-strong-950">{title}</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{children}</div>
    </section>
  );
}

/** Small caption under a state in a preview. */
const State = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col items-center gap-2">
    {children}
    <span className="text-xs leading-4 text-text-soft-400">{label}</span>
  </div>
);

/* ------------------------------------------------------------------------------------------------
 * Review checklist (top of page) — keep in sync with the "review" statuses below.
 * --------------------------------------------------------------------------------------------- */

const REVIEW_ITEMS: { id: string; title: string; why: string }[] = [
  { id: "btn-large", title: "Large (46px) button size", why: "Not a size in Buttons [1.0]; the primary CTA is still orange in a sky flow." },
  { id: "btn-remove", title: "Chip remove (×) button", why: "No Figma frame." },
  { id: "input-search", title: "Search field states", why: "Hover / focus never inspected; focus is orange." },
  { id: "input-add", title: "“Add your own” field", why: "No Figma frame." },
  { id: "input-stepper", title: "Number stepper count colour", why: "Figma differs between counters." },
  { id: "input-results", title: "Search result list", why: "No Figma reference recorded." },
  { id: "input-calendar", title: "Date range calendar", why: "No Figma frame." },
  { id: "card-city-added", title: "Added city chip", why: "No Figma frame for added state / remove." },
  { id: "card-trip-type", title: "Trip-type cards + family panel", why: "No Figma frame for the cards." },
  { id: "card-month", title: "Month card selected / hover", why: "Selected state not in Figma; padding changed." },
  { id: "card-prefs", title: "Preference chips & your own items", why: "Icon matches are loose; own-item chips have no frame." },
  { id: "fb-build", title: "Build checklist", why: "No Figma frame; emoji licensing; double progress." },
  { id: "fb-progress", title: "Sky progress bar", why: "New colour variant not in the DS." },
];

const SAMPLE_DRAFT: TripDraft = {
  cities: ["Bangkok", "Phuket"],
  tripType: "family",
  adults: 2,
  children: 1,
  when: "7 days in December",
  mustDos: ["Beach Time", "Sunset Views"],
  mustAvoids: ["Long Lines"],
};

// Fixed sample dates so the gallery renders the same every time (no "today").
const SAMPLE_MONTHS_FROM = "2027-01-01";
const CALENDAR_FROM = new Date(2027, 0, 1);

/* ------------------------------------------------------------------------------------------------
 * Gallery
 * --------------------------------------------------------------------------------------------- */

export function TripFlowGallery() {
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const sampleMonths = useMemo(() => upcomingMonths(SAMPLE_MONTHS_FROM, 12), []);
  // Live state for the interactive previews.
  const [search, setSearch] = useState("Phu");
  const [draft, setDraft] = useState("");
  const [count, setCount] = useState(2);
  const [mode, setMode] = useState("flexible");
  const [range, setRange] = useState<DateRange | undefined>({ from: new Date(2027, 0, 12), to: new Date(2027, 0, 18) });
  const [cities, setCities] = useState<string[]>(["Bangkok"]);
  const [tripType, setTripType] = useState<TripType | null>("family");
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(1);
  const [months, setMonths] = useState<string[]>(["2027-02"]);
  const [prefs, setPrefs] = useState<string[]>(["Beach Time"]);
  const [buildRun, setBuildRun] = useState(0);

  return (
    <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-12 px-4 py-10">
      <header className="flex flex-col gap-3">
        <p className="text-sm leading-5 font-medium text-brand-blue">Yopki · Trip flow</p>
        <h1 className="text-[32px] leading-10 font-medium tracking-[-0.16px] text-text-strong-950">UI gallery</h1>
        <p className="max-w-[720px] text-base leading-6 text-text-sub-600">
          Every button, input and selection card used in the four trip steps and the build screen, rendered live
          from the real components. Each pattern says where it came from:
        </p>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={{ kind: "figma", node: "node id" }} />
          <StatusBadge status={{ kind: "changed", what: "what changed" }} />
          <StatusBadge status={{ kind: "review" }} />
        </div>
      </header>

      {/* Review checklist */}
      <nav
        aria-labelledby="review-heading"
        className="flex flex-col gap-3 rounded-20 border border-primary-base/40 bg-bg-white-0 p-5 shadow-x-small"
      >
        <h2 id="review-heading" className="text-base leading-6 font-medium text-text-strong-950">
          {REVIEW_ITEMS.length} patterns still need your review
        </h2>
        <ol className="grid gap-x-6 gap-y-2 text-sm leading-5 sm:grid-cols-2">
          {REVIEW_ITEMS.map((r, i) => (
            <li key={r.id} className="flex gap-2">
              <span className="w-5 shrink-0 text-right text-text-soft-400 tabular-nums">{i + 1}.</span>
              <span>
                <a href={`#${r.id}`} className="font-medium text-brand-blue underline-offset-2 hover:underline">
                  {r.title}
                </a>
                <span className="text-text-sub-600"> — {r.why}</span>
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* ------------------------------------------------------------------ Buttons */}
      <Section id="buttons" title="Buttons">
        <Pattern
          id="btn-large"
          title="Primary · Large"
          where="Start planning, Continue, Build my trip, View my itinerary"
          statuses={[{ kind: "figma", node: "18:12526 footer" }, { kind: "review" }]}
          review={[
            "46px “Large” isn’t a size in Buttons [1.0] (Medium 40 / Small 36 / X-Small 32 / 2X-Small 28) — confirm it, or add it to the DS.",
            "Still orange (primary-base) while every selection in the flow is now sky — keep, or move the CTA to sky?",
          ]}
        >
          <div className="flex flex-wrap items-end justify-center gap-4">
            <State label="Default">
              <Button size="large">Continue</Button>
            </State>
            <State label="With DS spark icon">
              <Button size="large" leftIcon={<Icon src="/trip/ds/sparkling-2-fill.svg" size={20} />}>
                Build my trip
              </Button>
            </State>
            <State label="Disabled">
              <Button size="large" disabled>
                Continue
              </Button>
            </State>
          </div>
        </Pattern>

        <Pattern
          id="btn-neutral"
          title="Neutral · Stroke · Large"
          where="Back, Cancel, Edit my answers, Add"
          statuses={[{ kind: "figma", node: "Buttons [1.0]" }]}
          notes={["Text colours checked against the DS: sub-600 default, strong-950 hover & focus, disabled-300 disabled. Same 46px size question as the primary button."]}
        >
          <div className="flex flex-wrap items-end justify-center gap-4">
            <State label="Default">
              <Button size="large" variant="neutral-stroke">
                Back
              </Button>
            </State>
            <State label="Disabled">
              <Button size="large" variant="neutral-stroke" disabled>
                Add
              </Button>
            </State>
          </div>
        </Pattern>

        <Pattern
          id="btn-icon"
          title="Icon button · 32"
          where="Number stepper − / +"
          statuses={[{ kind: "figma", node: "18:12741" }, { kind: "changed", what: "icon/sub-600" }]}
        >
          <div className="flex items-end gap-6">
            <State label="Default">
              <Button size="icon" variant="neutral-stroke" aria-label="Add one" leftIcon={<Icon src="/trip/v3/plus-4.svg" className="text-icon-sub-600" />} />
            </State>
            <State label="Disabled">
              <Button size="icon" variant="neutral-stroke" aria-label="Remove one" disabled leftIcon={<Icon src="/trip/v3/minus-4.svg" className="text-text-disabled-300" />} />
            </State>
          </div>
        </Pattern>

        <Pattern
          id="btn-remove"
          title="Chip remove (×)"
          where="Added cities, your own must-dos / must-avoids"
          statuses={[{ kind: "review" }]}
          review={["No Figma frame. Shows on hover / keyboard focus, always on touch screens; 20px circle may be a small touch target."]}
        >
          <AddedChip label="Krabi" />
        </Pattern>
      </Section>

      {/* ------------------------------------------------------------------ Inputs */}
      <Section id="inputs" title="Inputs">
        <Pattern
          id="input-search"
          title="Search field · Large"
          where="Destination — search city"
          statuses={[{ kind: "figma", node: "49:6423" }, { kind: "review" }]}
          review={[
            "Hover and focus states were never inspected in Figma (marked provisional in code).",
            "Focus border / ring is orange (primary) — the rest of the flow now uses sky.",
          ]}
        >
          <div className="w-full max-w-[360px]">
            <TextInput
              size="large"
              label="Search city"
              hideLabel
              leftIcon={<Icon src="/trip/v3/search-2-line.svg" />}
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>
        </Pattern>

        <Pattern
          id="input-results"
          title="Search result list"
          where="Destination — dropdown under the search field"
          statuses={[{ kind: "review" }]}
          review={["No Figma node is recorded for the dropdown or its hover / selected rows — confirm against the design."]}
        >
          <ul role="listbox" aria-label="Cities (preview)" className="flex w-full max-w-[360px] flex-col gap-1 rounded-12 border border-stroke-soft-200 bg-bg-white-0 p-2 shadow-medium">
            <SearchResultItem label="Phuket" icon={<Icon src="/trip/map-pin-line.svg" className="text-text-sub-600" />} active />
            <SearchResultItem label="Phi Phi" icon={<Icon src="/trip/map-pin-line.svg" className="text-text-sub-600" />} selected />
          </ul>
        </Pattern>

        <Pattern
          id="input-add"
          title="“Add your own” field"
          where="Preferences — must-dos, must-avoids"
          statuses={[{ kind: "review" }]}
          review={["No Figma frame (Figma only had a plain text field). Enter or Add turns the text into a chip; max 3 per section, then the field disables."]}
        >
          <div className="flex w-full max-w-[420px] items-center gap-3">
            <TextInput
              size="large"
              label="Add your own (preview)"
              hideLabel
              wrapperClassName="flex-1"
              placeholder="Add your own, e.g. a rooftop bar"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <Button size="large" variant="neutral-stroke" disabled={!draft.trim()}>
              Add
            </Button>
          </div>
        </Pattern>

        <Pattern
          id="input-stepper"
          title="Number stepper"
          where="Travelers — adults / children; Dates — how many days"
          statuses={[{ kind: "figma", node: "18:12740 · 18:12492" }, { kind: "review" }]}
          review={["Figma shows the count in text/primary for travelers but text/secondary for days — we use strong-950 for both. Which is right?"]}
        >
          <div className="flex flex-col items-center gap-4">
            <NumberStepper label="Days" value={count} min={1} max={5} onChange={setCount} decreaseLabel="One fewer" increaseLabel="One more" />
            <span className="text-xs leading-4 text-text-soft-400">Live — limits 1–5 here to show disabled ends</span>
          </div>
        </Pattern>

        <Pattern
          id="input-switch"
          title="Dates / Flexible switch"
          where="Dates"
          statuses={[{ kind: "figma", node: "18:12489" }, { kind: "changed", what: "pill selected" }]}
        >
          <Tabs.Root value={mode} onValueChange={(v) => setMode(v as string)}>
            <Tabs.List aria-label="Date mode (preview)" className="flex items-center gap-1 rounded-full bg-bg-white-0 p-1">
              <Tabs.Tab value="dates" className={DATE_MODE_TAB_CLASS}>
                Dates
              </Tabs.Tab>
              <Tabs.Tab value="flexible" className={DATE_MODE_TAB_CLASS}>
                Flexible
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </Pattern>

        <Pattern
          id="input-calendar"
          title="Date range calendar"
          where="Dates — Dates tab"
          statuses={[{ kind: "review" }]}
          review={[
            "No Figma frame — the whole look (sky start/end circles, pale band, bold sky today) is a placeholder.",
            "Built on react-day-picker 9.14.0; DS arrow-left/right-s-line in the nav.",
          ]}
        >
          {/* The calendar reads "today" internally, so it renders in the browser only (as on the Dates step). */}
          {isClient ? (
            <DateRangeCalendar value={range} onChange={setRange} fromDate={CALENDAR_FROM} />
          ) : (
            <div className="h-[336px] w-[280px]" />
          )}
        </Pattern>
      </Section>

      {/* ------------------------------------------------------------------ Selection */}
      <Section id="selection" title="Selection cards & chips">
        <Pattern
          id="card-city"
          title="Choice chip"
          where="Destination — suggested cities"
          statuses={[{ kind: "figma", node: "49:6388" }, { kind: "changed", what: "sky selected" }]}
        >
          <ToggleGroup multiple spacing={4} value={cities} onValueChange={setCities} aria-label="Cities (preview)" className="flex-wrap justify-center">
            {["Bangkok", "Phuket", "Chiang Mai"].map((c) => (
              <ToggleGroupItem key={c} value={c} className={CHOICE_CHIP_CLASS}>
                <Icon src={cities.includes(c) ? "/trip/ds/check-fill.svg" : "/trip/v3/add-line.svg"} size={28} className="text-brand-blue" />
                {c}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Pattern>

        <Pattern
          id="card-city-added"
          title="Added city chip"
          where="Destination — cities added from search"
          statuses={[{ kind: "review" }]}
          review={["No Figma frame for the second row of added cities, the 3-city limit message, or the remove (×) control."]}
        >
          <AddedChip label="Krabi" alwaysShowRemove />
        </Pattern>

        <Pattern
          id="card-trip-type"
          title="Trip-type card (single choice)"
          where="Travelers"
          wide
          statuses={[{ kind: "review" }, { kind: "figma", node: "63:6751 counters" }]}
          review={[
            "No Figma frame for the cards — layout (rows, 448px), copy and icon choices were decided in chat.",
            "Family expands into a white panel with the Figma counters; confirm the nesting, defaults (2 adults, 1 child) and limits (1–10 / 0–10).",
          ]}
        >
          <RadioGroup
            value={tripType}
            onValueChange={(v) => setTripType(v as TripType)}
            aria-label="Trip type (preview)"
            className="flex w-full max-w-[448px] flex-col gap-2"
          >
            {TRIP_TYPES.map((t) => (
              <TripTypeCard
                key={t.value}
                {...t}
                checked={tripType === t.value}
                panel={
                  t.value === "family" ? (
                    <>
                      <TravelerCounter label="Adults" description="Ages 13 or above" noun="adult" value={adults} min={1} onChange={setAdults} />
                      <TravelerCounter label="Children" description="Ages 2-12" noun="child" value={kids} min={0} onChange={setKids} />
                    </>
                  ) : null
                }
              />
            ))}
          </RadioGroup>
        </Pattern>

        <Pattern
          id="card-month"
          title="Month card + page dots"
          where="Dates — Flexible tab"
          wide
          statuses={[{ kind: "figma", node: "18:12498 · 18:12522" }, { kind: "review" }]}
          review={[
            "Selected state (pale sky border + tint, sky icon) isn’t in Figma — and Figma’s grey “March” was read as hover.",
            "Side padding is 4px, not Figma’s 16px, so “September” fits four to a row.",
            "Several months can be picked — Figma doesn’t say whether it’s one or many.",
            "Page dots stay grey as in Figma; the active pill is low-contrast.",
          ]}
        >
          <div className="w-full max-w-[432px]">
            <MonthCarousel
              months={sampleMonths}
              selected={months}
              onToggle={(k) => setMonths((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]))}
            />
          </div>
        </Pattern>

        <Pattern
          id="card-prefs"
          title="Preference chips + your own items"
          where="Preferences — must-dos / must-avoids"
          wide
          statuses={[{ kind: "figma", node: "17:9403" }, { kind: "changed", what: "sky style, DS icons" }, { kind: "review" }]}
          review={[
            "Icons are the closest DS (Remix) matches, some loose — e.g. gift-line for Tourist Traps, disc-line for Nightlife.",
            "Your own items get a star (must-do) or forbid (must-avoid) icon and a remove (×) — no Figma frame.",
          ]}
        >
          <div className="w-full max-w-[582px]">
            <ChoiceSection
              title="Must-dos"
              choices={MUST_DOS}
              value={prefs}
              onValueChange={setPrefs}
              addLabel="Add your own must-do (preview)"
              addPlaceholder="Add your own, e.g. a rooftop bar"
              customIcon="/trip/ds/star-line.svg"
            />
          </div>
        </Pattern>
      </Section>

      {/* ------------------------------------------------------------------ Progress & feedback */}
      <Section id="feedback" title="Progress & feedback">
        <Pattern
          id="fb-stepper"
          title="Stepper"
          where="Top of every step"
          wide
          statuses={[{ kind: "figma", node: "49:6396" }, { kind: "changed", what: "check states, even spacing, “Preferences”" }]}
        >
          <div className="flex w-full flex-col items-center gap-6 overflow-x-auto">
            <State label="Step 1 current">
              <TripStepper current="Destination" />
            </State>
            <State label="Step 3 current (1–2 done)">
              <TripStepper current="Dates" />
            </State>
            <State label="All done (after build)">
              <TripStepper current="Preferences" allComplete />
            </State>
          </div>
        </Pattern>

        <Pattern
          id="fb-build"
          title="Build checklist"
          where="Preferences — after “Build my trip”"
          statuses={[{ kind: "review" }]}
          review={[
            "No Figma frame — heading copy, timing (0.9s per row, simulated) and layout are placeholders.",
            "Emoji are Unicode characters; the DS emoji are Apple artwork, and 4 of 6 couldn’t be exported from Figma.",
            "Progress shows twice — border stroke and progress bar. Keep both?",
          ]}
        >
          <div className="flex w-full flex-col items-center gap-4">
            <BuildingItinerary key={buildRun} draft={SAMPLE_DRAFT} onDone={noop} />
            <Button size="large" variant="neutral-stroke" onClick={() => setBuildRun((n) => n + 1)}>
              Replay
            </Button>
          </div>
        </Pattern>

        <Pattern
          id="fb-progress"
          title="Progress bar · sky"
          where="Build checklist"
          statuses={[{ kind: "figma", node: "Progress Bar Label [1.0]" }, { kind: "review" }]}
          review={["The DS bar is orange; the sky tone is a new variant added in code — add it to the DS, or drop it."]}
        >
          <div className="flex w-full max-w-[360px] flex-col gap-6">
            <ProgressBarLabel tone="sky" title="Checking dates…" value={40} />
            <ProgressBarLabel title="DS default (orange)" value={40} />
          </div>
        </Pattern>
      </Section>
    </main>
  );
}

const noop = () => {};
const noopSubscribe = () => () => {};

/**
 * A real, selected choice chip with the corner remove (×) — mirrors the added-city / own-item chips.
 * Preview only: removing just hides it until you press "Restore".
 */
function AddedChip({ label, alwaysShowRemove = false }: { label: string; alwaysShowRemove?: boolean }) {
  const [value, setValue] = useState<string[]>([label]);
  const [removed, setRemoved] = useState(false);
  if (removed)
    return (
      <Button size="large" variant="neutral-stroke" onClick={() => setRemoved(false)}>
        Restore
      </Button>
    );
  return (
    <ToggleGroup multiple value={value} onValueChange={setValue} aria-label={`${label} (preview)`}>
      <div className="group/chip relative">
        <ToggleGroupItem value={label} className={CHOICE_CHIP_CLASS}>
          <Icon
            src={value.includes(label) ? "/trip/ds/check-fill.svg" : "/trip/v3/add-line.svg"}
            size={28}
            className="text-brand-blue"
          />
          {label}
        </ToggleGroupItem>
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={() => setRemoved(true)}
          className={`absolute -top-2 -right-2 flex size-5 cursor-pointer items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 shadow-x-small transition-opacity outline-none group-focus-within/chip:opacity-100 group-hover/chip:opacity-100 hover:text-text-strong-950 focus-visible:ring-2 focus-visible:ring-brand-blue/30 [@media(hover:none)]:opacity-100 ${
            alwaysShowRemove ? "opacity-100" : "opacity-0"
          }`}
        >
          <Icon src="/trip/close-line-20.svg" size={14} />
        </button>
      </div>
    </ToggleGroup>
  );
}
