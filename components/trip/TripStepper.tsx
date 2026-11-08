import { Fragment } from "react";
import { Icon } from "@/components/ds/Icon";

export const TRIP_STEPPER_STEPS = ["Destination", "Travelers", "Dates", "Preferences"] as const;

export type TripStepperStep = (typeof TRIP_STEPPER_STEPS)[number];

const STEP_ICONS: Record<TripStepperStep, string> = {
  Destination: "/trip/map-pin-line.svg",
  Travelers: "/trip/v2/team-line.svg",
  Dates: "/trip/v2/calendar-line.svg",
  Preferences: "/trip/ds/list-settings-line.svg",
};

type TripStepperProps = {
  current: TripStepperStep;
  /** Every step done (the trip is being built) — all circles show the check, all lines go sky. */
  allComplete?: boolean;
  className?: string;
};

/** Trip flow — icon stepper above the step card (Figma "Trip Step" 43:1332, stepper 49:6396). */
export function TripStepper({ current, allComplete = false, className = "" }: TripStepperProps) {
  const currentIndex = allComplete ? TRIP_STEPPER_STEPS.length : TRIP_STEPPER_STEPS.indexOf(current);

  return (
    // `relative` keeps the absolutely-positioned sr-only labels inside the (scrollable) nav,
    // otherwise they escape it and widen the page on narrow screens.
    <nav aria-label="Trip planning progress" className={`relative ${className}`}>
      <ol className="flex items-start gap-4">
        {TRIP_STEPPER_STEPS.map((step, i) => {
          const isCurrent = i === currentIndex;
          const isComplete = i < currentIndex;
          return (
            <Fragment key={step}>
              {i > 0 && (
                // Same height as the 40px circle and top-aligned with it, so the line runs through the
                // circle centres. (The Figma frame 49:6396 offsets these connectors 14px lower.)
                // -mx-8 pulls the line into the empty space beside each circle (steps are 104px wide,
                // circle 40px → 32px each side), leaving the ol's 16px gap: the line sits exactly
                // 16px from the circle on both sides, for every step.
                <li aria-hidden className="-mx-8 flex h-10 w-[51px] shrink-0 items-center">
                  <span
                    className={`h-px w-full rounded-[1px] ${
                      // The line leaving the current step fades from blue into the upcoming grey.
                      i - 1 === currentIndex
                        ? "bg-linear-to-r from-brand-blue to-stroke-step"
                        : i - 1 < currentIndex
                          ? "bg-brand-blue"
                          : "bg-stroke-step"
                    }`}
                  />
                </li>
              )}
              <li
                aria-current={isCurrent ? "step" : undefined}
                // Every step is the same width (room for the longest label), so the
                // circles are evenly spaced whatever the label length.
                className={`flex h-[68px] w-26 shrink-0 flex-col items-center gap-2 ${
                  isCurrent ? "text-brand-blue" : "text-text-sub-600"
                }`}
              >
                <span
                  className={`flex size-10 items-center justify-center rounded-full border ${
                    // Completed steps share the current step's light circle.
                    isCurrent || isComplete ? "border-stroke-step-current bg-neutral-100" : "border-black/5"
                  }`}
                >
                  {isComplete ? (
                    // Completed steps: a sky (brand-blue) filled circle with the DS check-fill in white
                    // (the DS has no checkbox-circle icon, so the circle is drawn here).
                    <span aria-hidden className="flex size-[18px] items-center justify-center rounded-full bg-brand-blue">
                      <Icon src="/trip/ds/check-fill.svg" size={14} className="text-text-white-0" />
                    </span>
                  ) : (
                    <Icon src={STEP_ICONS[step]} size={20} />
                  )}
                </span>
                <span className="text-center text-sm leading-5 font-medium tracking-[-0.084px] whitespace-nowrap">
                  {step}
                  <span className="sr-only">{`, step ${i + 1} of ${TRIP_STEPPER_STEPS.length}${isComplete ? ", completed" : ""}`}</span>
                </span>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
