import Image from "next/image";
import { Fragment } from "react";
import { Icon } from "@/components/ds/Icon";
import { TRIP_STEPS, type TripStep } from "@/components/trip/TripProgress";

const STEP_ICONS: Record<TripStep, string> = {
  City: "/trip/map-pin-line.svg",
  Travelers: "/trip/v2/team-line.svg",
  Experience: "/trip/v2/compass-3-line.svg",
  Dates: "/trip/v2/calendar-line.svg",
  Personalization: "/trip/v2/sound-module-line.svg",
};

// Connector lines between steps, in order (the Experience → Dates line is 20% opacity in Figma).
const CONNECTORS = [
  "/trip/v2/step-line.svg",
  "/trip/v2/step-line.svg",
  "/trip/v2/step-line-6.svg",
  "/trip/v2/step-line.svg",
];

type TripStepperProps = {
  current: TripStep;
  /** Replaces the current step's name, e.g. the chosen city ("Bangkok"). */
  currentLabel?: string;
  className?: string;
};

/** Trip flow v2 — icon stepper above the step card (Figma node 17:8658). */
export function TripStepper({ current, currentLabel, className = "" }: TripStepperProps) {
  return (
    <nav aria-label="Trip planning progress" className={className}>
      {/* Figma frame is 648px wide; the last step leaves 21px of room on the right. */}
      <ol className="flex w-[648px] items-start gap-4">
        {TRIP_STEPS.map((step, i) => {
          const isCurrent = step === current;
          return (
            <Fragment key={step}>
              {i > 0 && (
                <li aria-hidden className="mt-7 flex shrink-0">
                  <Image src={CONNECTORS[i - 1]} alt="" width={51} height={1} />
                </li>
              )}
              <li
                aria-current={isCurrent ? "step" : undefined}
                className={`flex w-[59px] shrink-0 flex-col items-center gap-2 ${
                  isCurrent ? "text-brand-blue" : "text-text-secondary"
                }`}
              >
                <span
                  className={`flex size-14 items-center justify-center rounded-full p-2 ${
                    isCurrent ? "bg-bg-white-0" : "border border-black/5"
                  }`}
                >
                  <Icon src={STEP_ICONS[step]} size={28} />
                </span>
                <span className="text-center text-sm font-medium leading-5 tracking-[-0.084px] whitespace-nowrap">
                  {isCurrent && currentLabel ? currentLabel : step}
                  <span className="sr-only">{`, step ${i + 1} of ${TRIP_STEPS.length}`}</span>
                </span>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
