"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { CompactButton } from "@/components/ds/CompactButton";
import { Icon } from "@/components/ds/Icon";
import { SearchInput } from "@/components/trip/SearchInput";
import { SearchResultItem } from "@/components/trip/SearchResultItem";

type Destination = { name: string; thumbnail: string };

// PROVISIONAL data — the five destinations shown in the Figma frame.
// Swap for an API / search source when one exists.
const DESTINATIONS: Destination[] = [
  { name: "New York", thumbnail: "/trip/destinations/new-york.jpg" },
  { name: "New York City, New York", thumbnail: "/trip/destinations/new-york-city.jpg" },
  { name: "New England", thumbnail: "/trip/destinations/new-york.jpg" },
  { name: "Papua New Guinea", thumbnail: "/trip/destinations/papua-new-guinea.jpg" },
  { name: "New Jersey", thumbnail: "/trip/destinations/new-jersey.jpg" },
];

/** Trip creation — "Where" destination search modal. */
export function WhereStep() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const listId = useId();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const results = q ? DESTINATIONS.filter((d) => d.name.toLowerCase().includes(q)) : [];
  const showList = open && q.length > 0;
  const optionId = (i: number) => `${listId}-opt-${i}`;

  const close = () => router.back();

  const choose = (d: Destination) => {
    setSelected(d.name);
    setQuery(d.name);
    setOpen(false);
    // Next step isn't built yet — selection is kept locally only.
  };

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
        if (showList && results[activeIndex]) {
          e.preventDefault();
          choose(results[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        if (showList) setOpen(false);
        else close();
        break;
    }
  };

  return (
    <main className="flex w-full flex-1 items-center justify-center px-4 py-10">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-full max-w-[520px] flex-col gap-4 rounded-20 bg-bg-white-0 p-4 shadow-medium"
      >
        <header className="flex items-center justify-between">
          {/* DS Title / H6 */}
          <h1 id={titleId} className="text-xl font-medium leading-7 text-text-strong-950">
            Where
          </h1>
          <CompactButton label="Close" onClick={close} icon={<Icon src="/trip/close-line-20.svg" />} />
        </header>

        <div className="relative">
          <SearchInput
            ref={inputRef}
            autoFocus
            role="combobox"
            aria-label="Search destinations"
            aria-autocomplete="list"
            aria-expanded={showList}
            aria-controls={listId}
            aria-activedescendant={showList && results.length ? optionId(activeIndex) : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
              setActiveIndex(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={onKeyDown}
            onClear={() => {
              setQuery("");
              setSelected(null);
              setActiveIndex(0);
              inputRef.current?.focus();
            }}
          />

          {showList && (
            <div className="absolute top-full right-0 left-0 z-10 mt-1 overflow-clip rounded-12 border border-stroke-soft-200 bg-bg-white-0 p-2 shadow-medium">
              {results.length > 0 ? (
                <ul id={listId} role="listbox" aria-label="Destinations" className="flex flex-col gap-1">
                  {results.map((d, i) => (
                    <SearchResultItem
                      key={d.name}
                      id={optionId(i)}
                      label={d.name}
                      thumbnail={d.thumbnail}
                      active={i === activeIndex}
                      selected={d.name === selected}
                      onMouseEnter={() => setActiveIndex(i)}
                      // Keep focus in the input so blur doesn't close the list before click.
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => choose(d)}
                    />
                  ))}
                </ul>
              ) : (
                // PROVISIONAL empty state — not in the Figma frame.
                <p id={listId} role="status" className="p-2 text-sm leading-5 tracking-[-0.084px] text-text-sub-600">
                  No destinations match “{query.trim()}”
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
