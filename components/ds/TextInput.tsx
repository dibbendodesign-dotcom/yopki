import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { CompactButton } from "@/components/ds/CompactButton";
import { Icon } from "@/components/ds/Icon";

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  /** DS "Label [1.0]" layer hidden — the label is still read by screen readers. */
  hideLabel?: boolean;
  /** Leading icon slot (e.g. search-2-line), tinted text/soft-400. */
  leftIcon?: ReactNode;
  /** Trailing close-line icon: clears the field. Shown whenever this is set. */
  onClear?: () => void;
  /** DS 📏 Size: Medium (40, default) | Large (50, trip city search — Figma 49:6423). */
  size?: "medium" | "large";
  wrapperClassName?: string;
};

const sizes = {
  medium: "py-2.5",
  large: "py-3.5",
};

/**
 * DS "Text Input [1.0]" — Label [1.0] (Label/Small) above a field with
 * bg/white-0, stroke/soft-200 border, radius-10, x-small shadow,
 * Paragraph/Small text, text/soft-400 placeholder and icons.
 * Hover / focus styling is PROVISIONAL (those variants weren't inspected).
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {
    label,
    hideLabel = false,
    leftIcon,
    onClear,
    size = "medium",
    wrapperClassName = "",
    className = "",
    id,
    disabled,
    value,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={`flex w-full flex-col gap-1 ${wrapperClassName}`}>
      <label
        htmlFor={inputId}
        className={
          hideLabel ? "sr-only" : "text-sm font-medium leading-5 tracking-[-0.084px] text-text-strong-950"
        }
      >
        {label}
      </label>
      <div
        className={`flex w-full items-center gap-2 rounded-10 border border-stroke-soft-200 bg-bg-white-0 pr-2.5 pl-3 shadow-x-small transition-[border-color,box-shadow,background-color] hover:bg-bg-weak-50 focus-within:border-primary-base focus-within:bg-bg-white-0 focus-within:ring-2 focus-within:ring-primary-base/15 has-[input:disabled]:bg-bg-weak-50 ${sizes[size]}`}
      >
        {leftIcon && <span className="flex shrink-0 text-text-soft-400">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          value={value}
          disabled={disabled}
          className={`min-w-0 flex-1 bg-transparent text-sm leading-5 tracking-[-0.084px] text-text-strong-950 outline-none placeholder:text-text-soft-400 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {onClear && (
          <CompactButton
            label={`Clear ${label.toLowerCase()}`}
            onClick={onClear}
            disabled={disabled || !value}
            // The 20px icon sits flush in the field, as in Figma (no compact-button padding).
            className="p-0! text-text-soft-400! disabled:cursor-default disabled:hover:bg-transparent"
            icon={<Icon src="/trip/close-line-20.svg" />}
          />
        )}
      </div>
    </div>
  );
});
