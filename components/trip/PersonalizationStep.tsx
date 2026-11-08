"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { BuildingItinerary } from "@/components/trip/BuildingItinerary";
import { ChoiceSection, MUST_AVOIDS, MUST_DOS } from "@/components/trip/ChoiceSection";
import { saveTripDraft, useTripDraft } from "@/components/trip/tripDraft";
import { TRIP_STEPPER_STEPS, TripStepper } from "@/components/trip/TripStepper";





const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Trip flow — step 4: what to do and what to skip. Layout from Figma 17:9403, in the current DS style. */
export function PersonalizationStep() {
  const router = useRouter();
  const [mustDos, setMustDos] = useState<string[]>([]);
  const [mustAvoids, setMustAvoids] = useState<string[]>([]);
  // form → building (the checklist animation) → ready.
  const [phase, setPhase] = useState<"form" | "building" | "ready">("form");
  // Rows checked off during the build — one per stepper step, so it drives the stepper directly.
  const [built, setBuilt] = useState(0);
  const draft = useTripDraft();

  const startBuild = () => {
    saveTripDraft({ mustDos, mustAvoids });
    setBuilt(0);
    setPhase("building");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onBuilt = useCallback(() => setPhase("ready"), []);

  const doCount = mustDos.length;
  const avoidCount = mustAvoids.length;
  const summary =
    doCount + avoidCount > 0
      ? `${plural(doCount, "must-do", "must-dos")} · ${plural(avoidCount, "must-avoid", "must-avoids")}`
      : "Optional — pick anything that matters to you";

  const stepperCurrent = TRIP_STEPPER_STEPS[Math.min(built, TRIP_STEPPER_STEPS.length - 1)];

  return (
    <main className="mx-auto mt-6 mb-10 flex w-full max-w-[932px] flex-col items-center gap-11 px-4">
      <TripStepper
        current={phase === "building" ? stepperCurrent : "Preferences"}
        allComplete={phase === "ready"}
        className="max-w-full overflow-x-auto"
      />

      <section className="flex w-full max-w-[778px] flex-col rounded-20 border border-stroke-soft-200 bg-bg-white-0 shadow-card">
        <div className="flex w-full flex-col items-center gap-14 px-9 pt-10 pb-16 max-sm:px-5">
          {phase === "form" ? (
            <h1 className="text-center text-[32px] leading-10 font-medium tracking-[-0.16px] text-brand-blue">
              Make the trip yours
            </h1>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center motion-safe:animate-in motion-safe:fade-in">
              {/* Key icon with the CTA's spark; a soft sky halo pulses while building. */}
              <span className="relative flex size-14 items-center justify-center">
                {phase === "building" && (
                  <span aria-hidden className="absolute inset-0 rounded-full bg-brand-blue-alpha-8 motion-safe:animate-ping" />
                )}
                <span className="relative flex size-14 items-center justify-center rounded-full border border-brand-blue/30 bg-bg-white-0 text-brand-blue shadow-x-small">
                  <Icon src="/trip/ds/sparkling-2-fill.svg" size={28} />
                </span>
              </span>
              <h1 className="text-[32px] leading-10 font-medium tracking-[-0.16px] text-brand-blue">
                {phase === "building" ? "Building your trip…" : "Your trip is ready"}
              </h1>
              <p className="text-base leading-6 tracking-[-0.176px] text-text-sub-600">
                {phase === "building"
                  ? "Using everything you told us"
                  : "Planned around everything you told us"}
              </p>
            </div>
          )}

          {phase !== "form" && (
            <BuildingItinerary draft={draft} onProgress={setBuilt} onDone={onBuilt} />
          )}

          {/* 582px column — the Figma frame's width. Kept mounted (just hidden) while building, so
              "Edit my answers" comes back with every choice — including your own chips — intact. */}
          <div hidden={phase !== "form"} className="flex w-full max-w-[582px] flex-col gap-12">
            <ChoiceSection
              title="Must-dos"
              choices={MUST_DOS}
              value={mustDos}
              onValueChange={setMustDos}
              addLabel="Add your own must-do"
              addPlaceholder="Add your own, e.g. a rooftop bar with city views"
              customIcon="/trip/ds/star-line.svg"
            />
            <ChoiceSection
              title="Must-avoids"
              choices={MUST_AVOIDS}
              value={mustAvoids}
              onValueChange={setMustAvoids}
              addLabel="Add your own must-avoid"
              addPlaceholder="Add your own, e.g. early morning starts"
              customIcon="/trip/ds/forbid-line.svg"
            />
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-b-20 border-t border-stroke-soft-200 bg-bg-white-0 px-[31px] py-5">
          {/* Nothing on the left once the trip is ready — the heading already says so. */}
          {phase !== "ready" && (
            <p className="text-sm leading-5 tracking-[-0.084px] text-text-sub-600">
              {phase === "form" ? summary : "This takes a few seconds"}
            </p>
          )}

          {/* ml-auto keeps the buttons on the right when the left text is gone. */}
          <div className="ml-auto flex shrink-0 items-center gap-3">
            {phase === "form" ? (
              <>
                <Button size="large" variant="neutral-stroke" onClick={() => router.push("/trip/new/dates")}>
                  Back
                </Button>
                <Button
                  size="large"
                  // Yopki DS sparkling-2-fill, white on the primary fill (inherits the button's text colour).
                  leftIcon={<Icon src="/trip/ds/sparkling-2-fill.svg" size={20} />}
                  onClick={startBuild}
                >
                  Build my trip
                </Button>
              </>
            ) : (
              <>
                <Button size="large" variant="neutral-stroke" onClick={() => setPhase("form")}>
                  {phase === "building" ? "Cancel" : "Edit my answers"}
                </Button>
                {phase === "ready" && (
                  <Button
                    size="large"
                    // No itinerary page yet — intentionally no navigation.
                  >
                    View my itinerary
                  </Button>
                )}
              </>
            )}
          </div>
        </footer>
      </section>
    </main>
  );
}
