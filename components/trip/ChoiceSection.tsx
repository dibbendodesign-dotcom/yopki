"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { TextInput } from "@/components/ds/TextInput";
import { CHOICE_CHIP_CLASS } from "@/components/trip/choiceChip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type Choice = { label: string; icon: string };

// Options from Figma 17:9403; icons are the closest Yopki Design System (Remix) matches.
export const MUST_DOS: Choice[] = [
  { label: "Beach Time", icon: "/trip/ds/umbrella-line.svg" },
  { label: "Scenic Hike", icon: "/trip/ds/landscape-line.svg" },
  { label: "Cultural Tours", icon: "/trip/ds/ancient-gate-line.svg" },
  { label: "Nightlife", icon: "/trip/ds/disc-line.svg" },
  { label: "Sunset Views", icon: "/trip/ds/sun-foggy-line.svg" },
  { label: "City Tour", icon: "/trip/ds/building-line.svg" },
];

export const MUST_AVOIDS: Choice[] = [
  { label: "Tourist Traps", icon: "/trip/ds/gift-line.svg" },
  { label: "Too Many Souvenirs", icon: "/trip/ds/shopping-bag-line.svg" },
  { label: "Long Lines", icon: "/trip/ds/alarm-line.svg" },
  { label: "Skipping Rest Time", icon: "/trip/ds/hotel-bed-line.svg" },
  { label: "Expensive Restaurants", icon: "/trip/ds/restaurant-line.svg" },
];

/** Your own items per section (PROVISIONAL limit, same as added cities). */
const MAX_CUSTOM = 3;

type ChoiceSectionProps = {
  title: string;
  choices: Choice[];
  value: string[];
  onValueChange: (value: string[]) => void;
  addLabel: string;
  addPlaceholder: string;
  /** Yopki DS icon for items you add yourself (star for must-dos, forbid for must-avoids). */
  customIcon: string;
};

/**
 * Heading, multi-select chips (same chip as the city picker), then a field that adds your own item:
 * Enter or "Add" turns the text into a chip, selected straight away. Typing one of the listed options
 * just selects it. Your own chips can be removed with the × on their corner, like added cities.
 */
export function ChoiceSection({
  title,
  choices,
  value,
  onValueChange,
  addLabel,
  addPlaceholder,
  customIcon,
}: ChoiceSectionProps) {
  const headingId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [custom, setCustom] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const isFull = custom.length >= MAX_CUSTOM;

  const add = () => {
    const text = draft.trim().replace(/\s+/g, " ");
    if (!text) return;
    const existing = [...choices.map((c) => c.label), ...custom].find((l) => l.toLowerCase() === text.toLowerCase());
    if (!existing && isFull) return;
    const label = existing ?? text;
    if (!existing) setCustom((prev) => [...prev, label]);
    if (!value.includes(label)) onValueChange([...value, label]);
    setDraft("");
  };

  const remove = (label: string) => {
    setCustom((prev) => prev.filter((l) => l !== label));
    onValueChange(value.filter((l) => l !== label));
    // The chip (and its focused × button) is gone — hand focus back to the field.
    setTimeout(() => inputRef.current?.focus());
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-6">
      <h2 id={headingId} className="text-xl leading-7 font-medium text-text-strong-950">
        {title}
      </h2>

      <ToggleGroup
        multiple
        spacing={4}
        value={value}
        onValueChange={onValueChange}
        aria-labelledby={headingId}
        className="w-full flex-wrap"
      >
        {choices.map((c) => (
          <ToggleGroupItem key={c.label} value={c.label} className={CHOICE_CHIP_CLASS}>
            <Icon src={c.icon} size={24} className="text-brand-blue" />
            {c.label}
          </ToggleGroupItem>
        ))}

        {custom.map((label) => (
          <div key={label} className="group/chip relative">
            <ToggleGroupItem value={label} className={CHOICE_CHIP_CLASS}>
              {/* Your own item: the section's own icon, like the listed options (state shows via the chip fill). */}
              <Icon src={customIcon} size={24} className="text-brand-blue" />
              {label}
            </ToggleGroupItem>
            <button
              type="button"
              aria-label={`Remove ${label}`}
              onClick={() => remove(label)}
              // Revealed on hover / keyboard focus; always shown on touch screens (no hover).
              className="absolute -top-2 -right-2 flex size-5 cursor-pointer items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 opacity-0 shadow-x-small transition-opacity outline-none group-focus-within/chip:opacity-100 group-hover/chip:opacity-100 hover:text-text-strong-950 focus-visible:ring-2 focus-visible:ring-brand-blue/30 [@media(hover:none)]:opacity-100"
            >
              <Icon src="/trip/close-line-20.svg" size={14} />
            </button>
          </div>
        ))}
      </ToggleGroup>

      <div className="flex w-full items-center gap-3">
        <TextInput
          ref={inputRef}
          size="large"
          label={addLabel}
          hideLabel
          wrapperClassName="flex-1"
          placeholder={isFull ? `You can add up to ${MAX_CUSTOM} of your own` : addPlaceholder}
          disabled={isFull}
          maxLength={40}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Button size="large" variant="neutral-stroke" onClick={add} disabled={!draft.trim() || isFull}>
          Add
        </Button>
      </div>
    </section>
  );
}
