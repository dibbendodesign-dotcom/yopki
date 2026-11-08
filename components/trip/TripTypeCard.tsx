"use client";

import { Radio } from "@base-ui/react/radio";
import type { ReactNode } from "react";
import { Icon } from "@/components/ds/Icon";

export type TripType = "solo" | "partner" | "family";

// PROVISIONAL copy — no Figma frame for this step yet. Icons are from the Yopki Design System.
export const TRIP_TYPES: {
  value: TripType;
  label: string;
  description: string;
  /** Yopki DS icon (Remix set), tinted via currentColor. */
  icon: string;
}[] = [
  {
    value: "solo",
    label: "Solo trip",
    description: "Just me, exploring at my own pace",
    icon: "/trip/ds/user-line.svg",
  },
  {
    value: "partner",
    label: "Partner trip",
    description: "A getaway for the two of us",
    icon: "/trip/ds/heart-line.svg",
  },
  {
    value: "family",
    label: "Family trip",
    description: "Travelling with family, kids included",
    icon: "/trip/ds/team-line.svg",
  },
];

type TripTypeCardProps = {
  value: TripType;
  label: string;
  description: string;
  icon: string;
  checked: boolean;
  /** Shown inside the card while it's selected, under the option (e.g. the family counters). */
  panel?: ReactNode;
};

/**
 * One trip-type option — must sit inside a Base UI RadioGroup. The card is a wrapper so a selected
 * option can grow to hold a panel; the panel's buttons can't live inside the radio itself
 * (no controls inside a control). Selected: pale sky border, sky tint, sky icon.
 */
export function TripTypeCard({ value, label, description, icon, checked, panel }: TripTypeCardProps) {
  return (
    <div
      className={`overflow-clip rounded-12 border transition-colors ${
        checked
          ? "border-brand-blue/30 bg-brand-blue-alpha-8"
          : "border-stroke-soft-200 bg-bg-white-0 shadow-x-small hover:bg-bg-weak-50"
      }`}
    >
      <Radio.Root
        value={value}
        className="group flex w-full cursor-pointer items-center gap-3 rounded-12 p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:ring-inset"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-white-0 text-icon-sub-600 shadow-x-small transition-colors group-data-checked:border-brand-blue/30 group-data-checked:text-brand-blue">
          <Icon src={icon} size={20} />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-base leading-6 font-medium tracking-[-0.176px] text-text-strong-950">{label}</span>
          <span className="text-sm leading-5 tracking-[-0.084px] text-text-sub-600">{description}</span>
        </span>
      </Radio.Root>

      {checked && panel && (
        <div
          role="group"
          aria-label={`${label} details`}
          // Arrow keys here belong to the panel's buttons, not the radio group around them.
          onKeyDown={(e) => e.stopPropagation()}
          className="mx-3 mb-3 flex flex-col divide-y divide-stroke-soft-200 rounded-10 border border-stroke-soft-200 bg-bg-white-0 px-3"
        >
          {panel}
        </div>
      )}
    </div>
  );
}
