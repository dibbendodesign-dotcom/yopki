import type { ReactNode } from "react";
import { Checkbox } from "@/components/ds/Checkbox";

type CheckboxCardProps = {
  label: string;
  description?: string;
  /** Icon placed in the DS "Key Icons [1.0]" circle. */
  icon: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

/**
 * DS "Checkbox Card [1.0]" — 🧩 Type=⬅️ Left Icon.
 * States from the DS:
 *   Default — white, stroke/soft-200 border, x-small shadow
 *   Hover   — bg/weak-50, no border/shadow
 *   Active  — white, primary-base border, no shadow
 */
export function CheckboxCard({ label, description, icon, checked, onCheckedChange }: CheckboxCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`group flex w-full cursor-pointer items-start gap-3.5 overflow-clip rounded-12 border p-4 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-base/30 ${
        checked
          ? "border-primary-base bg-bg-white-0"
          : "border-stroke-soft-200 bg-bg-white-0 shadow-x-small hover:border-transparent hover:bg-bg-weak-50 hover:shadow-none"
      }`}
    >
      {/* Key Icons [1.0] */}
      <span className="flex shrink-0 items-center justify-center overflow-clip rounded-full border border-stroke-soft-200 bg-bg-white-0 p-2.5 text-icon-sub-600 shadow-x-small">
        {icon}
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1 self-stretch">
        <span className="text-sm font-medium leading-5 tracking-[-0.084px] text-text-strong-950">
          {label}
        </span>
        {description && (
          <span className="text-xs leading-4 text-text-sub-600">{description}</span>
        )}
      </span>

      <Checkbox checked={checked} />
    </button>
  );
}
