"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ds/Icon";
import { ProgressBarLabel } from "@/components/ds/ProgressBarLabel";
import type { TripDraft } from "@/components/trip/tripDraft";

/** How long each answer is "worked on" before it's checked off. PROVISIONAL — swap for real progress. */
const STEP_MS = 900;

/** Each row shows a single line of `value` (truncated with … if it runs long). */
/**
 * `emoji` — the Yopki DS colour-emoji set (Apple style), rendered as the Unicode character so it
 * shows as the platform's colour emoji (identical artwork on Apple devices).
 */
type Row = { label: string; value: string[]; emoji: string };

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

/** Short, one-line summary — same wording as the Preferences step footer, e.g. "2 must-dos · 1 must-avoid". */
function personalization(d: TripDraft): string[] {
  const parts = [
    d.mustDos?.length ? plural(d.mustDos.length, "must-do", "must-dos") : null,
    d.mustAvoids?.length
      ? plural(d.mustAvoids.length, "must-avoid", "must-avoids")
      : null,
  ].filter((p): p is string => p !== null);
  return [parts.length ? parts.join(" · ") : "Picking highlights for you"];
}

/** Turn the saved answers into the checklist, with a sensible line when a step was skipped. */
export function buildRows(d: TripDraft): Row[] {
  const travelers =
    d.tripType === "family"
      ? `Family trip · ${plural(d.adults ?? 2, "adult", "adults")}, ${plural(d.children ?? 0, "child", "children")}`
      : d.tripType === "partner"
        ? "Partner trip · 2 travelers"
        : d.tripType === "solo"
          ? "Solo trip"
          : "Your travel group";
  // DS emoji: Smiling Face with Sunglasses / Two Hearts / House with Garden.
  const travelersEmoji = d.tripType === "partner" ? "💕" : d.tripType === "family" ? "🏡" : "😎";

  return [
    {
      label: "Destination",
      value: [d.cities?.length ? d.cities.join(" · ") : "Your destination"],
      emoji: "🗺️", // DS: World Map
    },
    { label: "Travelers", value: [travelers], emoji: travelersEmoji },
    {
      label: "Dates",
      value: [d.when || "Your dates"],
      emoji: "⏳", // DS: Hourglass Not Done
    },
    {
      // Must-dos and must-avoids together — one row per stepper step.
      label: "Preferences",
      value: personalization(d),
      emoji: "🧳", // DS: Luggage
    },
  ];
}

type BuildingItineraryProps = {
  draft: TripDraft;
  /** Fires with the number of rows checked off so far (drives the stepper above). */
  onProgress?: (done: number) => void;
  onDone: () => void;
};

/**
 * "Build my trip" animation — your answers, checked off one by one (idea 1).
 * Each row goes pending (faded) → working (sky tint + spinner) → done (green check), all in one box
 * with inset dividers. Progress shows twice: a sky stroke flowing clockwise around the box border,
 * and a sky progress bar underneath. Spinner, slide-in and stroke flow respect
 * prefers-reduced-motion; progress is announced to screen readers.
 * PROVISIONAL — no Figma frame; built from the DS pieces in use.
 */
export function BuildingItinerary({
  draft,
  onProgress,
  onDone,
}: BuildingItineraryProps) {
  const rows = buildRows(draft);
  // 0…rows.length = rows checked off; rows.length + 1 = "putting your days together" finished.
  const [done, setDone] = useState(0);
  const finished = done > rows.length;

  useEffect(() => {
    // Once finished, wait one more step so the border stroke can close its loop (it eases to 100%
    // over STEP_MS) before the screen switches to "Your trip is ready".
    const t = finished
      ? setTimeout(onDone, STEP_MS)
      : setTimeout(() => setDone((n) => n + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [done, finished, onDone]);

  useEffect(() => {
    onProgress?.(Math.min(done, rows.length));
  }, [done, rows.length, onProgress]);

  const working = done < rows.length ? rows[done] : null;
  const status = working
    ? `Checking ${working.label.toLowerCase()}…`
    : "Putting your days together…";
  const pct = (Math.min(done, rows.length + 1) / (rows.length + 1)) * 100;

  // The box's size, so the progress stroke can trace its exact rounded border.
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.target.getBoundingClientRect();
      setBox({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex w-full max-w-[448px] flex-col gap-6">
      {/* One box; thin dividers between the rows, inset 16px from both sides (drawn per row below).
          A sky stroke flows clockwise around its border from the top-left as the build runs. */}
      <div ref={boxRef} className="relative">
        <ol className="flex flex-col overflow-clip rounded-12 border border-stroke-soft-200 bg-bg-white-0 shadow-x-small">
          {rows.map((row, i) => {
            const state =
              i < done ? "done" : i === done ? "working" : "pending";
            return (
              <li
                key={row.label}
                className={`relative flex items-center gap-3 p-4 transition-colors not-first:before:absolute not-first:before:inset-x-4 not-first:before:top-0 not-first:before:h-px not-first:before:bg-stroke-soft-200 duration-300 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both ${
                  state === "working"
                    ? "bg-brand-blue-alpha-8"
                    : "bg-bg-white-0"
                } ${state === "pending" ? "opacity-50" : ""}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full border bg-bg-white-0 shadow-x-small transition-colors ${
                    state === "pending" ? "border-stroke-soft-200" : "border-brand-blue/30"
                  }`}
                >
                  {/* Greyscale until the row is reached, then it "lights up" in full colour. */}
                  <span
                    aria-hidden
                    className={`font-[Apple_Color_Emoji,Segoe_UI_Emoji,Noto_Color_Emoji,sans-serif] text-[22px] leading-none transition-[filter] duration-300 ${
                      state === "pending" ? "grayscale" : ""
                    }`}
                  >
                    {row.emoji}
                  </span>
                </span>

                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-xs leading-4 font-medium text-text-sub-600">
                    {row.label}
                  </span>
                  {row.value.map((line) => (
                    <span
                      key={line}
                      className="truncate text-base leading-6 font-medium tracking-[-0.176px] text-text-strong-950"
                    >
                      {line}
                    </span>
                  ))}
                </span>

                {/* Status: spinner while working, green (state/success/base) check when done. */}
                <span
                  aria-hidden
                  className="flex size-5 shrink-0 items-center justify-center"
                >
                  {state === "working" && (
                    <span className="size-5 rounded-full border-2 border-brand-blue/20 border-t-brand-blue motion-safe:animate-spin" />
                  )}
                  {state === "done" && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-state-success-base motion-safe:animate-in motion-safe:zoom-in-50">
                      <Icon
                        src="/trip/ds/check-fill.svg"
                        size={14}
                        className="text-text-white-0"
                      />
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>

        {box && (
          <svg
            aria-hidden
            width={box.w}
            height={box.h}
            className="pointer-events-none absolute inset-0 overflow-visible"
          >
            {/* Sits on the 1px grey border (inset half the 1.5px stroke). pathLength=100 makes the
              dash offset a straight percentage; a linear transition as long as one step keeps the
              line moving continuously between checkpoints. */}
            <rect
              x={0.75}
              y={0.75}
              width={box.w - 1.5}
              height={box.h - 1.5}
              rx={11.25}
              pathLength={100}
              fill="none"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray="100 100"
              strokeDashoffset={100 - pct}
              className="stroke-brand-blue transition-[stroke-dashoffset] ease-linear motion-reduce:transition-none"
              style={{
                transitionDuration: `${STEP_MS}ms`,
                opacity: pct > 0 ? 1 : 0,
              }}
            />
          </svg>
        )}
      </div>

      <ProgressBarLabel
        tone="sky"
        title={finished ? "Itinerary ready" : status}
        value={pct}
      />

      <p className="sr-only" role="status" aria-live="polite">
        {finished ? "Your itinerary is ready." : status}
      </p>
    </div>
  );
}
