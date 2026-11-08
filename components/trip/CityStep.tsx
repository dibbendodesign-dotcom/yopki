"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { TextInput } from "@/components/ds/TextInput";
import { CHOICE_CHIP_CLASS } from "@/components/trip/choiceChip";
import { saveTripDraft } from "@/components/trip/tripDraft";
import { SearchResultItem } from "@/components/trip/SearchResultItem";
import { TripStepper } from "@/components/trip/TripStepper";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const SUGGESTED_CITIES = ["Bangkok", "Phuket", "Chiang Mai"];

// PROVISIONAL data — swap for an API / search source when one exists.
const SEARCHABLE_CITIES = [
  "Bangkok",
  "Phuket",
  "Chiang Mai",
  "Chiang Rai",
  "Krabi",
  "Koh Samui",
  "Koh Phangan",
  "Koh Tao",
  "Koh Lanta",
  "Koh Phi Phi",
  "Koh Chang",
  "Pattaya",
  "Hua Hin",
  "Ayutthaya",
  "Sukhothai",
  "Kanchanaburi",
  "Khao Lak",
  "Pai",
  "Udon Thani",
  "Khon Kaen",
];

const MAX_RESULTS = 3;

/** Cities added from search go on a second row, up to this many. */
const MAX_ADDED_CITIES = 3;

/** Cities whose name starts with the query come first, then other matches; at most 3. */
function searchCities(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const starts = SEARCHABLE_CITIES.filter((c) => c.toLowerCase().startsWith(q));
  const contains = SEARCHABLE_CITIES.filter((c) => !c.toLowerCase().startsWith(q) && c.toLowerCase().includes(q));
  return [...starts, ...contains].slice(0, MAX_RESULTS);
}

/** Trip flow — step 1: pick the city (or cities) to visit. Figma node 49:6388. */
export function CityStep() {
  const router = useRouter();
  const listId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const [added, setAdded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>(["Bangkok"]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = searchCities(query);
  const showList = open && results.length > 0;
  const optionId = (i: number) => `${listId}-opt-${i}`;

  const isFull = added.length >= MAX_ADDED_CITIES;

  // Selects the city — a suggested or already-added one is reselected, anything else
  // becomes a new chip on the second row (while there's room) — and clears the search.
  const addCity = (raw: string) => {
    const name = raw.trim().replace(/\s+/g, " ");
    if (!name) return;
    const existing = [...SUGGESTED_CITIES, ...added].find((c) => c.toLowerCase() === name.toLowerCase());
    if (!existing && isFull) return;
    const city = existing ?? name;
    if (!existing) setAdded((prev) => [...prev, city]);
    setSelected((prev) => (prev.includes(city) ? prev : [...prev, city]));
    setQuery("");
    setActiveIndex(0);
  };

  const removeCity = (city: string) => {
    setAdded((prev) => prev.filter((c) => c !== city));
    setSelected((prev) => prev.filter((c) => c !== city));
    // The chip (and its focused remove button) is gone — hand focus to the search field,
    // after the re-render that re-enables it when the row was full.
    setTimeout(() => searchRef.current?.focus());
  };

  const renderChip = (city: string) => (
    <ToggleGroupItem key={city} value={city} className={CHOICE_CHIP_CLASS}>
      {selected.includes(city) ? (
        // Sky check when selected, sky + otherwise — matching the trip-type cards on the Travelers step.
        <Icon src="/trip/ds/check-fill.svg" size={28} className="text-brand-blue" />
      ) : (
        <Icon src="/trip/v3/add-line.svg" size={28} className="text-brand-blue" />
      )}
      {city}
    </ToggleGroupItem>
  );

  const chosen = [...SUGGESTED_CITIES, ...added].filter((c) => selected.includes(c));

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setOpen(true);
        if (results.length) setActiveIndex((i) => (i + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setOpen(true);
        if (results.length) setActiveIndex((i) => (i - 1 + results.length) % results.length);
        break;
      case "Enter":
        e.preventDefault();
        // Pick the highlighted suggestion; with none, add the typed text as-is.
        addCity(showList ? results[activeIndex] : query);
        break;
      case "Escape":
        if (showList) setOpen(false);
        else setQuery("");
        break;
    }
  };

  return (
    <main className="mx-auto mt-6 mb-10 flex w-full max-w-[932px] flex-col items-center gap-11 px-4">
      <TripStepper current="Destination" className="max-w-full overflow-x-auto" />

      <section className="flex w-full max-w-[778px] flex-col rounded-20 border border-stroke-soft-200 bg-bg-white-0 shadow-card">
        <div className="flex max-w-full flex-col items-center gap-14 self-center px-9 pt-10 pb-16">
          <h1 className="text-center text-[32px] leading-10 font-medium tracking-[-0.16px] text-brand-blue">
            Choose your cities to start planning
          </h1>

          <div className="flex max-w-full flex-col items-center gap-6">
            <ToggleGroup
              multiple
              spacing={4}
              value={selected}
              onValueChange={setSelected}
              aria-label="Cities to visit"
              className="max-w-full flex-col"
            >
              <div className="flex max-w-full flex-wrap justify-center gap-4">{SUGGESTED_CITIES.map(renderChip)}</div>

              {added.length > 0 && (
                <div className="flex max-w-full flex-wrap justify-center gap-4">
                  {added.map((city) => (
                    <div key={city} className="group/chip relative">
                      {renderChip(city)}
                      <button
                        type="button"
                        aria-label={`Remove ${city}`}
                        onClick={() => removeCity(city)}
                        // Revealed on hover / keyboard focus; always shown on touch screens (no hover).
                        className="absolute -top-2 -right-2 flex size-5 cursor-pointer items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 opacity-0 shadow-x-small transition-opacity outline-none group-focus-within/chip:opacity-100 group-hover/chip:opacity-100 hover:text-text-strong-950 focus-visible:ring-2 focus-visible:ring-primary-base/30 [@media(hover:none)]:opacity-100"
                      >
                        <Icon src="/trip/close-line-20.svg" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </ToggleGroup>

            <div className="flex w-full items-center gap-4">
              <Separator className="flex-1 bg-stroke-soft-200" />
              <span className="text-sm leading-5 font-medium tracking-[-0.084px] text-text-sub-600 opacity-50">
                or
              </span>
              <Separator className="flex-1 bg-stroke-soft-200" />
            </div>

            <div className="relative w-full">
              <TextInput
                ref={searchRef}
                size="large"
                label="Search city"
                hideLabel
                leftIcon={<Icon src="/trip/v3/search-2-line.svg" />}
                type="text"
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={showList}
                aria-controls={listId}
                aria-activedescendant={showList ? optionId(activeIndex) : undefined}
                placeholder={isFull ? `You can add up to ${MAX_ADDED_CITIES} cities` : "Search city..."}
                disabled={isFull}
                value={query}
                maxLength={40}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                onKeyDown={onKeyDown}
                onClear={() => {
                  setQuery("");
                  setActiveIndex(0);
                }}
              />

              {showList && (
                <ul
                  id={listId}
                  role="listbox"
                  aria-label="Cities"
                  className="absolute top-full right-0 left-0 z-10 mt-1 flex flex-col gap-1 rounded-12 border border-stroke-soft-200 bg-bg-white-0 p-2 shadow-medium"
                >
                  {results.map((city, i) => (
                    <SearchResultItem
                      key={city}
                      id={optionId(i)}
                      label={city}
                      icon={<Icon src="/trip/map-pin-line.svg" className="text-text-sub-600" />}
                      active={i === activeIndex}
                      selected={selected.includes(city)}
                      onMouseEnter={() => setActiveIndex(i)}
                      // Keep focus in the input so blur doesn't close the list before the click lands.
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => addCity(city)}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions — selected-city count on the left, Start planning on the right (pattern from Figma 18:12526). */}
        <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-b-20 border-t border-stroke-soft-200 bg-bg-white-0 px-[31px] py-5">
          <p aria-live="polite" className="text-sm leading-5 tracking-[-0.084px] text-text-sub-600">
            {chosen.length > 0
              ? `${chosen.length} ${chosen.length === 1 ? "city" : "cities"} selected`
              : "No cities selected yet"}
          </p>

          <div className="flex shrink-0 items-center gap-3">
            <Button
              size="large"
              disabled={chosen.length === 0}
              // Saves the chosen cities to the trip draft (read by the build animation).
              onClick={() => {
                saveTripDraft({ cities: chosen });
                router.push("/trip/new/travelers");
              }}
            >
              Start planning my trip
            </Button>
          </div>
        </footer>
      </section>
    </main>
  );
}
