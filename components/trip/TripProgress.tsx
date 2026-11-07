export const TRIP_STEPS = ["City", "Travelers", "Experience", "Dates", "Personalization"] as const;

export type TripStep = (typeof TRIP_STEPS)[number];

type TripProgressProps = {
  current: TripStep;
  className?: string;
};

/**
 * Segmented progress for the trip-creation flow — one segment per step,
 * named underneath so people can see where they are and what's left.
 * Built from the DS Progress Bar tokens (bg/soft-200 track,
 * state/warning/base fill, 6px full-radius line). Layout is PROVISIONAL —
 * there's no Figma frame for it yet.
 */
export function TripProgress({ current, className = "" }: TripProgressProps) {
  const index = TRIP_STEPS.indexOf(current);
  const next = TRIP_STEPS[index + 1];

  return (
    <nav aria-label="Trip planning progress" className={`flex w-full flex-col gap-2 ${className}`}>
      {/* DS Paragraph / X-Small */}
      <p className="flex items-center justify-between gap-2 text-xs leading-4 text-text-sub-600">
        <span>
          Step {index + 1} of {TRIP_STEPS.length}
          {/* Step names are hidden below sm, so name the current one here. */}
          <span className="sm:hidden"> · {current}</span>
        </span>
        {next && <span>Next: {next}</span>}
      </p>

      <ol className="grid grid-cols-5 gap-1.5">
        {TRIP_STEPS.map((step, i) => {
          const state = i < index ? "done" : i === index ? "current" : "upcoming";
          return (
            <li
              key={step}
              aria-current={state === "current" ? "step" : undefined}
              className="flex min-w-0 flex-col gap-1.5"
            >
              <span
                aria-hidden
                className={`h-1.5 w-full rounded-full transition-colors ${
                  state === "upcoming" ? "bg-bg-soft-200" : "bg-state-warning-base"
                }`}
              />
              <span
                className={`truncate text-xs leading-4 max-sm:sr-only ${
                  state === "current" ? "font-medium text-text-strong-950" : "text-text-sub-600"
                }`}
              >
                {step}
                <span className="sr-only">
                  {state === "done" ? " (completed)" : state === "upcoming" ? " (not started)" : ""}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
