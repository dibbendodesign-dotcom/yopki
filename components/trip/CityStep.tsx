"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { TextInput } from "@/components/ds/TextInput";
import { TripStepper } from "@/components/trip/TripStepper";
import { Button as UIButton } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const SUGGESTED_CITIES = ["Bangkok", "Phuket", "Chiang Mai"];

/** "Bangkok", "Bangkok & Phuket", "Bangkok, Phuket & Chiang Mai" */
function formatCities(cities: string[]) {
  if (cities.length <= 1) return cities[0] ?? "";
  return `${cities.slice(0, -1).join(", ")} & ${cities[cities.length - 1]}`;
}

/** Trip flow v2 — step 1: pick the city (or cities) to visit. Figma node 17:8657. */
export function CityStep() {
  const [cities, setCities] = useState(SUGGESTED_CITIES);
  const [selected, setSelected] = useState<string[]>(["Bangkok"]);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const closeAdd = () => {
    setIsAdding(false);
    setDraft("");
  };

  const commitDraft = () => {
    const name = draft.trim().replace(/\s+/g, " ");
    if (name) {
      const city = cities.find((c) => c.toLowerCase() === name.toLowerCase()) ?? name;
      if (!cities.includes(city)) setCities((prev) => [...prev, city]);
      setSelected((prev) => (prev.includes(city) ? prev : [...prev, city]));
    }
    closeAdd();
  };

  // Keep the selection in list order so the heading reads naturally.
  const ordered = cities.filter((c) => selected.includes(c));
  const destination = formatCities(ordered);
  const stepLabel = ordered.length > 1 ? `${ordered[0]} +${ordered.length - 1}` : ordered[0];

  return (
    // Figma: stepper box is 76px tall (labels overflow it) + 56px gap = 48px gap below our 84px stepper.
    <main className="mx-auto mt-[25px] mb-10 flex w-full max-w-[932px] flex-col items-center gap-12 px-4">
      <TripStepper current="City" currentLabel={stepLabel} className="max-w-full overflow-x-auto px-6" />

      <section className="flex w-full flex-col items-center gap-[72px] rounded-20 bg-bg-white-0 p-10 shadow-card">
        <h1
          aria-live="polite"
          className="w-[376px] max-w-full text-center text-[26px] leading-[30px] font-semibold text-brand-blue"
        >
          {destination ? `Let’s quickly plan your trip to ${destination}!` : "Where would you like to go?"}
        </h1>

        <div className="flex max-w-full flex-col items-center gap-6">
          <ToggleGroup
            multiple
            spacing={4}
            value={selected}
            onValueChange={setSelected}
            aria-label="Cities to visit"
            className="max-w-full flex-wrap justify-center"
          >
            {cities.map((city) => (
              <ToggleGroupItem
                key={city}
                value={city}
                className="h-[60px] w-40 justify-start gap-2 rounded-12! border border-black/10 py-2.5 pr-4 pl-3 text-base font-semibold text-black hover:bg-bg-weak-50 hover:text-black aria-pressed:border-transparent aria-pressed:bg-bg-selected aria-pressed:hover:bg-bg-selected"
              >
                <Image
                  src={selected.includes(city) ? "/trip/v2/check-fill.svg" : "/trip/add-line.svg"}
                  alt=""
                  width={28}
                  height={28}
                />
                <span className="truncate">{city}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="flex w-full items-center gap-4">
            <Separator className="flex-1 bg-black/10" />
            <span className="text-sm leading-[18px] font-medium tracking-[-0.084px] text-black/50">or</span>
            <Separator className="flex-1 bg-black/10" />
          </div>

          {isAdding ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                commitDraft();
              }}
              className="flex w-full items-end gap-2"
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
                className="flex-1"
              />
              <Button type="submit" disabled={!draft.trim()} className="w-20">
                Add
              </Button>
            </form>
          ) : (
            <UIButton
              variant="link"
              onClick={() => setIsAdding(true)}
              className="h-auto gap-2 rounded-12 border-0 py-0 pr-4 pl-3 text-base leading-normal font-medium text-brand-blue"
            >
              <Image src="/trip/v2/add-line-blue.svg" alt="" width={28} height={28} />
              Add another city
            </UIButton>
          )}
        </div>

        <Button
          size="large"
          className="w-[300px] max-w-full"
          disabled={ordered.length === 0}
          rightIcon={<Icon src="/trip/v2/arrow-right-line.svg" size={24} />}
          // Next step (Travelers) isn't built yet — intentionally no navigation.
        >
          Let&apos;s Go
        </Button>
      </section>
    </main>
  );
}
