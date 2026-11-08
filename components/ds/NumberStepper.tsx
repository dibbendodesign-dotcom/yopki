import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";

type NumberStepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  /** What's being counted — read before the number by screen readers ("Adults: 2"). */
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
};

/**
 * − / count / + control (Figma "Button group" 18:12740, 18:12492).
 * − and + are DS Buttons (Neutral·Stroke, icon size); the count pill is display-only, so it's a
 * styled span rather than a button, and it announces changes politely.
 */
export function NumberStepper({
  value,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  onChange,
  label,
  decreaseLabel,
  increaseLabel,
}: NumberStepperProps) {
  const canDecrease = value > min;
  const canIncrease = value < max;
  // icon/sub-600 when usable, text/disabled-300 at the limit.
  const iconClass = (enabled: boolean) => (enabled ? "text-icon-sub-600" : "text-text-disabled-300");

  return (
    <div className="flex shrink-0 items-center gap-3">
      <Button
        size="icon"
        variant="neutral-stroke"
        aria-label={decreaseLabel}
        disabled={!canDecrease}
        onClick={() => onChange(value - 1)}
        leftIcon={<Icon src="/trip/v3/minus-4.svg" className={iconClass(canDecrease)} />}
      />

      <span
        aria-live="polite"
        className="flex h-8 min-w-[52px] items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-white-0 px-5 text-sm leading-5 font-medium tracking-[-0.084px] text-text-strong-950 tabular-nums"
      >
        <span className="sr-only">{`${label}: `}</span>
        {value}
      </span>

      <Button
        size="icon"
        variant="neutral-stroke"
        aria-label={increaseLabel}
        disabled={!canIncrease}
        onClick={() => onChange(value + 1)}
        leftIcon={<Icon src="/trip/v3/plus-4.svg" className={iconClass(canIncrease)} />}
      />
    </div>
  );
}
