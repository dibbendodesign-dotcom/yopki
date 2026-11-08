"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ds/Button";
import { CheckboxCard } from "@/components/ds/CheckboxCard";
import { ContentDivider } from "@/components/ds/ContentDivider";
import { Icon } from "@/components/ds/Icon";
import { LinkButton } from "@/components/ds/LinkButton";
import { ProgressBarLabel } from "@/components/ds/ProgressBarLabel";
import { TextInput } from "@/components/ds/TextInput";

type City = { name: string; description?: string };

// PROVISIONAL copy — city descriptions aren't in the Figma frame.
const SUGGESTED_CITIES: City[] = [
  { name: "Bangkok", description: "Temples, street food and nightlife" },
  { name: "Phuket", description: "Beaches and island hopping" },
  { name: "Chiang Mai", description: "Old town, mountains and night markets" },
];

const TOTAL_STEPS = 5;

/** "Bangkok", "Bangkok & Phuket", "Bangkok, Phuket & Chiang Mai" */
function formatCities(cities: string[]) {
  if (cities.length <= 1) return cities[0] ?? "";
  return `${cities.slice(0, -1).join(", ")} & ${cities[cities.length - 1]}`;
}

/** Trip creation — step 1: choose the city (or cities) to visit. */
export function CitySelectionStep() {
  const [cities, setCities] = useState<City[]>(SUGGESTED_CITIES);
  const [selected, setSelected] = useState<string[]>(["Bangkok"]);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const setChecked = (name: string, checked: boolean) =>
    setSelected((prev) =>
      checked ? (prev.includes(name) ? prev : [...prev, name]) : prev.filter((c) => c !== name),
    );

  const closeAdd = () => {
    setIsAdding(false);
    setDraft("");
  };

  const commitDraft = () => {
    const name = draft.trim().replace(/\s+/g, " ");
    if (name) {
      const existing = cities.find((c) => c.name.toLowerCase() === name.toLowerCase());
      const city = existing?.name ?? name;
      if (!existing) setCities((prev) => [...prev, { name: city, description: "Added by you" }]);
      setChecked(city, true);
    }
    closeAdd();
  };

  const orderedSelection = cities.filter((c) => selected.includes(c.name)).map((c) => c.name);
  const destination = formatCities(orderedSelection);

  return (
    <main className="mx-auto my-10 flex w-[480px] flex-col">
      <section className="flex flex-col gap-5 rounded-20 bg-bg-white-0 p-5 shadow-card">
        <ProgressBarLabel title={`Step 1 of ${TOTAL_STEPS} · Destination`} value={100 / TOTAL_STEPS} />

        <ContentDivider />

        <header className="flex flex-col gap-1">
          {/* DS Title / H6 */}
          <h1 aria-live="polite" className="text-xl font-medium leading-7 text-text-strong-950">
            {destination ? `Let’s quickly plan your trip to ${destination}!` : "Where would you like to go?"}
          </h1>
          {/* DS Paragraph / Small */}
          <p className="text-sm leading-5 tracking-[-0.084px] text-text-sub-600">
            Pick one or more cities. You can change this later.
          </p>
        </header>

        <div role="group" aria-label="Cities to visit" className="flex flex-col gap-3">
          {cities.map((city) => (
            <CheckboxCard
              key={city.name}
              label={city.name}
              description={city.description}
              icon={<Icon src="/trip/map-pin-line.svg" />}
              checked={selected.includes(city.name)}
              onCheckedChange={(checked) => setChecked(city.name, checked)}
            />
          ))}
        </div>

        {isAdding ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              commitDraft();
            }}
            className="flex items-end gap-2"
          >
            <TextInput
              ref={inputRef}
              label="Add a city"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && closeAdd()}
              onBlur={() => !draft.trim() && closeAdd()}
              placeholder="e.g. Krabi"
              maxLength={40}
              wrapperClassName="flex-1"
            />
            <Button type="submit" disabled={!draft.trim()} className="w-20">
              Add
            </Button>
          </form>
        ) : (
          <LinkButton
            onClick={() => setIsAdding(true)}
            className="self-start"
            leftIcon={<Icon src="/trip/add-line.svg" />}
          >
            Add another city
          </LinkButton>
        )}

        <ContentDivider />

        <Button
          className="w-full"
          disabled={orderedSelection.length === 0}
          rightIcon={<Icon src="/ds/arrow-right-s-line.svg" />}
          // Next step (Travelers) isn't built yet — intentionally no navigation.
        >
          Let&apos;s Go
        </Button>
      </section>
    </main>
  );
}
