"use client";

import { RadioGroup } from "@base-ui/react/radio-group";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ds/Button";
import { TravelerCounter } from "@/components/trip/TravelerCounter";
import { saveTripDraft } from "@/components/trip/tripDraft";
import { TripStepper } from "@/components/trip/TripStepper";
import { TRIP_TYPES, TripTypeCard, type TripType } from "@/components/trip/TripTypeCard";


// PROVISIONAL copy — no Figma frame for this step yet. Icons are from the Yopki Design System.
// PROVISIONAL limits and starting counts for a family trip.
const MAX_TRAVELERS_PER_GROUP = 10;
const DEFAULT_ADULTS = 2;
const DEFAULT_CHILDREN = 1;

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;


/**
 * Trip flow — step 2: who's travelling. A single choice, so the cards are a radio group under the hood
 * (picking one replaces the other; arrow keys move between them) — but no visible radio dot: the
 * selected card is shown by a pale sky border (heading blue at 30%), a sky tint and a heading-blue icon.
 */
export function TravelersStep() {
  const router = useRouter();
  const [tripType, setTripType] = useState<TripType | null>(null);
  const [adults, setAdults] = useState(DEFAULT_ADULTS);
  const [children, setChildren] = useState(DEFAULT_CHILDREN);

  const chosen = TRIP_TYPES.find((t) => t.value === tripType);

  return (
    <main className="mx-auto mt-6 mb-10 flex w-full max-w-[932px] flex-col items-center gap-11 px-4">
      <TripStepper current="Travelers" className="max-w-full overflow-x-auto" />

      <section className="flex w-full max-w-[778px] flex-col rounded-20 border border-stroke-soft-200 bg-bg-white-0 shadow-card">
        <div className="flex w-full flex-col items-center gap-14 px-9 pt-10 pb-16 max-sm:px-5">
          <h1
            id="trip-type-heading"
            className="text-center text-[32px] leading-10 font-medium tracking-[-0.16px] text-brand-blue"
          >
            Who are you travelling with?
          </h1>

          {/* 448px column — the counters' Figma width (63:6751). */}
          <RadioGroup
            value={tripType}
            onValueChange={(value) => setTripType(value as TripType)}
            aria-labelledby="trip-type-heading"
            className="flex w-full max-w-[448px] flex-col gap-2"
          >
            {TRIP_TYPES.map(({ value, label, description, icon }) => (
              <TripTypeCard
                key={value}
                value={value}
                label={label}
                description={description}
                icon={icon}
                checked={tripType === value}
                panel={
                  // Family trip only — how many adults and children (Figma 63:6751), inside the same card.
                  value === "family" ? (
                    <>
                      <TravelerCounter
                        label="Adults"
                        description="Ages 13 or above"
                        noun="adult"
                        value={adults}
                        min={1}
                        max={MAX_TRAVELERS_PER_GROUP}
                        onChange={setAdults}
                      />
                      <TravelerCounter
                        label="Children"
                        description="Ages 2-12"
                        noun="child"
                        value={children}
                        min={0}
                        max={MAX_TRAVELERS_PER_GROUP}
                        onChange={setChildren}
                      />
                    </>
                  ) : null
                }
              />
            ))}
          </RadioGroup>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-b-20 border-t border-stroke-soft-200 bg-bg-white-0 px-[31px] py-5">
          <p
            aria-live="polite"
            className="text-sm leading-5 tracking-[-0.084px] text-text-sub-600"
          >
            {!chosen
              ? "Choose one to continue"
              : tripType === "family"
                ? `${chosen.label} · ${plural(adults, "adult", "adults")}, ${plural(children, "child", "children")}`
                : `${chosen.label} selected`}
          </p>

          <div className="flex shrink-0 items-center gap-3">
            <Button
              size="large"
              variant="neutral-stroke"
              onClick={() => router.push("/")}
            >
              Back
            </Button>
            <Button
              size="large"
              disabled={!chosen}
              // Saves trip type and counts to the trip draft (read by the build animation).
              onClick={() => {
                if (tripType) saveTripDraft({ tripType, adults, children });
                router.push("/trip/new/dates");
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
