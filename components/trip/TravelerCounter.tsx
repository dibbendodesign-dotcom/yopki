import { NumberStepper } from "@/components/ds/NumberStepper";

type TravelerCounterProps = {
  label: string;
  description: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  /** Singular noun for the button names, e.g. "adult" → "Remove an adult" / "Add an adult". */
  noun: string;
};

/**
 * Traveler count row — label + age range on the left, − / count / + on the right. Layout only:
 * the surrounding panel supplies the background, side padding and dividers.
 * Figma "Tab Menu Vertical Items" (18:12736) in frame 63:6751.
 */
export function TravelerCounter({ label, description, value, min = 0, max = 10, onChange, noun }: TravelerCounterProps) {
  const article = /^[aeiou]/i.test(noun) ? "an" : "a";

  return (
    <div role="group" aria-label={label} className="flex w-full items-center gap-1.5 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Same type as the trip-type card title / description above. */}
        <p className="text-base leading-6 font-medium tracking-[-0.176px] text-text-strong-950">{label}</p>
        <p className="text-sm leading-5 tracking-[-0.084px] text-text-sub-600">{description}</p>
      </div>

      <NumberStepper
        label={label}
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        decreaseLabel={`Remove ${article} ${noun}`}
        increaseLabel={`Add ${article} ${noun}`}
      />
    </div>
  );
}
